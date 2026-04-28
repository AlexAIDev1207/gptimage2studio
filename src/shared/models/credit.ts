import { and, asc, count, desc, eq, gt, gte, isNull, or, sql, sum } from 'drizzle-orm';

import { db } from '@/core/db';
import { credit } from '@/config/db/schema';
import { getSnowId, getUuid } from '@/shared/lib/hash';

import { getAllConfigs } from './config';
import { appendUserToResult, User } from './user';

export type Credit = typeof credit.$inferSelect & {
  user?: User;
};
export type NewCredit = typeof credit.$inferInsert;
export type UpdateCredit = Partial<
  Omit<NewCredit, 'id' | 'transactionNo' | 'createdAt'>
>;

export enum CreditStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DELETED = 'deleted',
}

export enum CreditTransactionType {
  GRANT = 'grant', // grant credit
  CONSUME = 'consume', // consume credit
}

export enum CreditTransactionScene {
  PAYMENT = 'payment', // payment
  SUBSCRIPTION = 'subscription', // subscription
  RENEWAL = 'renewal', // renewal
  GIFT = 'gift', // gift
  REWARD = 'reward', // reward
}

// Calculate credit expiration time based on order and subscription info
export function calculateCreditExpirationTime({
  creditsValidDays,
  currentPeriodEnd,
}: {
  creditsValidDays: number;
  currentPeriodEnd?: Date;
}): Date | null {
  const now = new Date();

  // Check if credits should never expire
  if (!creditsValidDays || creditsValidDays <= 0) {
    // never expires
    return null;
  }

  const expiresAt = new Date();

  if (currentPeriodEnd) {
    // For subscription: credits expire at the end of current period
    expiresAt.setTime(currentPeriodEnd.getTime());
  } else {
    // For one-time payment: use configured validity days
    expiresAt.setDate(now.getDate() + creditsValidDays);
  }

  return expiresAt;
}

// Helper function to create expiration condition for queries
export function createExpirationCondition() {
  const currentTime = new Date();
  // Credit is valid if: expires_at IS NULL OR expires_at > current_time
  return or(isNull(credit.expiresAt), gt(credit.expiresAt, currentTime));
}

// create credit
export async function createCredit(newCredit: NewCredit) {
  const [result] = await db().insert(credit).values(newCredit).returning();
  return result;
}

// get credits
export async function getCredits({
  userId,
  status,
  transactionType,
  getUser = false,
  page = 1,
  limit = 30,
}: {
  userId?: string;
  status?: CreditStatus;
  transactionType?: CreditTransactionType;
  getUser?: boolean;
  page?: number;
  limit?: number;
}): Promise<Credit[]> {
  const result = await db()
    .select()
    .from(credit)
    .where(
      and(
        userId ? eq(credit.userId, userId) : undefined,
        status ? eq(credit.status, status) : undefined,
        transactionType
          ? eq(credit.transactionType, transactionType)
          : undefined
      )
    )
    .orderBy(desc(credit.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}

// get credits count
export async function getCreditsCount({
  userId,
  status,
  transactionType,
}: {
  userId?: string;
  status?: CreditStatus;
  transactionType?: CreditTransactionType;
}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(credit)
    .where(
      and(
        userId ? eq(credit.userId, userId) : undefined,
        status ? eq(credit.status, status) : undefined,
        transactionType
          ? eq(credit.transactionType, transactionType)
          : undefined
      )
    );

  return result?.count || 0;
}

// Plan returned by planConsumeCredits — caller composes additional writes
// and runs everything through db().batch([...]) to get D1-atomic execution.
// After running the batch, caller must call verifyConsumePlan() to detect
// concurrent over-spend (the WHERE remaining_credits >= ? guards above
// silently no-op on race; we have to actively verify).
export type ConsumeCreditsPlan = {
  userId: string;
  credits: number;
  consumeRecord: NewCredit;
  // drizzle query builders ready to be passed into db.batch():
  // [N×UPDATE credit (with race guard), INSERT credit (consume row)]
  statements: any[];
  // pre-batch sum(remaining_credits) for active grants — verifyConsumePlan
  // re-reads the sum and confirms the difference equals `credits`.
  expectedBalanceAfter: number;
};

/**
 * Read user's grant credits, plan FIFO consumption, build write statements.
 * Does NOT execute any writes — returns statements + the consume record so
 * the caller can compose them with other writes (e.g. ai_task insert) and
 * run as one D1 batch (truly atomic).
 *
 * Throws if balance is insufficient.
 */
export async function planConsumeCredits({
  userId,
  credits,
  scene,
  description,
  metadata,
}: {
  userId: string;
  credits: number; // credits to consume
  scene?: string;
  description?: string;
  metadata?: string;
}): Promise<ConsumeCreditsPlan> {
  const currentTime = new Date();
  const dbi = db();

  // 1. check credits balance
  const [creditsBalance] = await dbi
    .select({ total: sum(credit.remainingCredits) })
    .from(credit)
    .where(
      and(
        eq(credit.userId, userId),
        eq(credit.transactionType, CreditTransactionType.GRANT),
        eq(credit.status, CreditStatus.ACTIVE),
        gt(credit.remainingCredits, 0),
        or(
          isNull(credit.expiresAt),
          gt(credit.expiresAt, currentTime)
        )
      )
    );

  if (
    !creditsBalance ||
    !creditsBalance.total ||
    parseInt(creditsBalance.total) < credits
  ) {
    throw new Error(
      `Insufficient credits, ${creditsBalance?.total || 0} < ${credits}`
    );
  }

  // 2. plan FIFO consumption (read only)
  const maxRowsToScan = 10000;
  const grants = await dbi
    .select()
    .from(credit)
    .where(
      and(
        eq(credit.userId, userId),
        eq(credit.transactionType, CreditTransactionType.GRANT),
        eq(credit.status, CreditStatus.ACTIVE),
        gt(credit.remainingCredits, 0),
        or(
          isNull(credit.expiresAt),
          gt(credit.expiresAt, currentTime)
        )
      )
    )
    .orderBy(asc(credit.expiresAt))
    .limit(maxRowsToScan);

  let remainingToConsume = credits;
  const consumedItems: any[] = [];
  const updateStatements: any[] = [];

  for (const item of grants) {
    if (remainingToConsume <= 0) break;
    const toConsume = Math.min(remainingToConsume, item.remainingCredits);

    // Build (do not execute) UPDATE with two race guards:
    // 1. Use relative arithmetic (`remaining_credits - X`) so concurrent
    //    deductions compose correctly.
    // 2. WHERE remaining_credits >= X — if a concurrent consume already
    //    drained this row, our UPDATE matches 0 rows. Caller verifies
    //    rowsAffected on each batch result and aborts/compensates if
    //    any guard failed.
    updateStatements.push(
      dbi
        .update(credit)
        .set({
          remainingCredits: sql`${credit.remainingCredits} - ${toConsume}`,
        })
        .where(
          and(eq(credit.id, item.id), gte(credit.remainingCredits, toConsume))
        )
    );

    consumedItems.push({
      creditId: item.id,
      transactionNo: item.transactionNo,
      expiresAt: item.expiresAt,
      creditsToConsume: remainingToConsume,
      creditsConsumed: toConsume,
      creditsBefore: item.remainingCredits,
      creditsAfter: item.remainingCredits - toConsume,
    });

    remainingToConsume -= toConsume;
  }

  if (remainingToConsume > 0) {
    // shouldn't happen because balance check above passed, but be safe
    throw new Error(
      `Insufficient credits when planning consumption (still need ${remainingToConsume})`
    );
  }

  // 3. build consume record (id pre-generated so callers can reference it)
  const consumeRecord: NewCredit = {
    id: getUuid(),
    transactionNo: getSnowId(),
    transactionType: CreditTransactionType.CONSUME,
    transactionScene: scene,
    userId,
    status: CreditStatus.ACTIVE,
    description,
    credits: -credits,
    consumedDetail: JSON.stringify(consumedItems),
    metadata,
  };

  // 4. return plan with all writes ready to be batched
  return {
    userId,
    credits,
    consumeRecord,
    statements: [
      ...updateStatements,
      dbi.insert(credit).values(consumeRecord),
    ],
    expectedBalanceAfter: parseInt(creditsBalance.total) - credits,
  };
}

/**
 * Verify post-batch that the actual sum(remaining_credits) matches what
 * planConsumeCredits expected. If concurrent consumers raced our UPDATEs
 * and our `WHERE remaining_credits >= ?` guards silently dropped some
 * deductions, the actual balance will be higher than expected.
 *
 * Throws ConsumeRaceError on detection so the caller can compensate.
 */
export class ConsumeRaceError extends Error {
  constructor(
    public expected: number,
    public actual: number
  ) {
    super(
      `Consume race detected: expected balance ${expected}, got ${actual} (delta ${actual - expected})`
    );
    this.name = 'ConsumeRaceError';
  }
}

export async function verifyConsumePlan(plan: ConsumeCreditsPlan): Promise<void> {
  const dbi = db();
  const currentTime = new Date();
  const [row] = await dbi
    .select({ total: sum(credit.remainingCredits) })
    .from(credit)
    .where(
      and(
        eq(credit.userId, plan.userId),
        eq(credit.transactionType, CreditTransactionType.GRANT),
        eq(credit.status, CreditStatus.ACTIVE),
        or(isNull(credit.expiresAt), gt(credit.expiresAt, currentTime))
      )
    );
  const actual = parseInt(row?.total || '0');
  if (actual !== plan.expectedBalanceAfter) {
    throw new ConsumeRaceError(plan.expectedBalanceAfter, actual);
  }
}

/**
 * Atomically consume credits via D1 batch + post-verify for race detection.
 * Convenience wrapper for callers that don't need to compose with other writes.
 *
 * On ConsumeRaceError, the consume row is marked INVALID so balance reads
 * skip it; caller should treat the operation as failed and retry.
 */
export async function consumeCredits(args: {
  userId: string;
  credits: number;
  scene?: string;
  description?: string;
  metadata?: string;
}): Promise<NewCredit> {
  const plan = await planConsumeCredits(args);
  await db().batch(plan.statements);
  try {
    await verifyConsumePlan(plan);
  } catch (e) {
    if (e instanceof ConsumeRaceError) {
      // best-effort: invalidate the consume row so it doesn't double-count
      await db()
        .update(credit)
        .set({ status: CreditStatus.DELETED })
        .where(eq(credit.id, plan.consumeRecord.id));
    }
    throw e;
  }
  return plan.consumeRecord;
}

// get remaining credits
export async function getRemainingCredits(userId: string): Promise<number> {
  const currentTime = new Date();

  const [result] = await db()
    .select({
      total: sum(credit.remainingCredits),
    })
    .from(credit)
    .where(
      and(
        eq(credit.userId, userId),
        eq(credit.transactionType, CreditTransactionType.GRANT),
        eq(credit.status, CreditStatus.ACTIVE),
        gt(credit.remainingCredits, 0),
        or(
          isNull(credit.expiresAt), // Never expires
          gt(credit.expiresAt, currentTime) // Not yet expired
        )
      )
    );

  return parseInt(result?.total || '0');
}

// grant credits for new user
export async function grantCreditsForNewUser(user: User) {
  // get configs from db
  const configs = await getAllConfigs();

  // if initial credits enabled
  if (configs.initial_credits_enabled !== 'true') {
    return;
  }

  // get initial credits amount and valid days
  const credits = parseInt(configs.initial_credits_amount as string) || 0;
  if (credits <= 0) {
    return;
  }

  const creditsValidDays =
    parseInt(configs.initial_credits_valid_days as string) || 0;

  const description = configs.initial_credits_description || 'initial credits';

  const newCredit = await grantCreditsForUser({
    user: user,
    credits: credits,
    validDays: creditsValidDays,
    description: description,
  });

  return newCredit;
}

// grant credits for user
export async function grantCreditsForUser({
  user,
  credits,
  validDays,
  description,
}: {
  user: User;
  credits: number;
  validDays?: number;
  description?: string;
}) {
  if (credits <= 0) {
    return;
  }

  const creditsValidDays = validDays && validDays > 0 ? validDays : 0;

  const expiresAt = calculateCreditExpirationTime({
    creditsValidDays: creditsValidDays,
  });

  const creditDescription = description || 'grant credits';

  const newCredit: NewCredit = {
    id: getUuid(),
    userId: user.id,
    userEmail: user.email,
    orderNo: '',
    subscriptionNo: '',
    transactionNo: getSnowId(),
    transactionType: CreditTransactionType.GRANT,
    transactionScene: CreditTransactionScene.GIFT,
    credits: credits,
    remainingCredits: credits,
    description: creditDescription,
    expiresAt: expiresAt,
    status: CreditStatus.ACTIVE,
  };

  await createCredit(newCredit);

  return newCredit;
}
