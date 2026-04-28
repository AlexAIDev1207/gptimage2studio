import { and, count, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { aiTask, credit } from '@/config/db/schema';
import { AITaskStatus } from '@/extensions/ai';
import { appendUserToResult, User } from '@/shared/models/user';

import {
  ConsumeRaceError,
  CreditStatus,
  planConsumeCredits,
  verifyConsumePlan,
} from './credit';

export type AITask = typeof aiTask.$inferSelect & {
  user?: User;
};
export type NewAITask = typeof aiTask.$inferInsert;
export type UpdateAITask = Partial<Omit<NewAITask, 'id' | 'createdAt'>>;

export async function createAITask(newAITask: NewAITask) {
  const dbi = db();

  // No credits needed: simple single insert.
  if (!newAITask.costCredits || newAITask.costCredits <= 0) {
    const [taskResult] = await dbi.insert(aiTask).values(newAITask).returning();
    return taskResult;
  }

  // With credits: D1 doesn't support BEGIN/COMMIT — use db.batch() (atomic).
  // 1. plan credit consumption (reads only)
  const plan = await planConsumeCredits({
    userId: newAITask.userId,
    credits: newAITask.costCredits,
    scene: newAITask.scene,
    description: `generate ${newAITask.mediaType}`,
    metadata: JSON.stringify({
      type: 'ai-task',
      mediaType: newAITask.mediaType,
      taskId: newAITask.id,
    }),
  });

  // 2. ai_task references the consume credit row via creditId (set upfront)
  const taskWithCreditId = { ...newAITask, creditId: plan.consumeRecord.id };

  // 3. atomically execute: credit UPDATEs + consume INSERT + ai_task INSERT
  await dbi.batch([
    ...plan.statements,
    dbi.insert(aiTask).values(taskWithCreditId),
  ]);

  // 4. detect concurrent over-spend that bypassed our WHERE guards.
  //    On race: invalidate consume row + drop ai_task we just inserted +
  //    surface the error so the route returns 5xx and the user retries.
  try {
    await verifyConsumePlan(plan);
  } catch (e) {
    if (e instanceof ConsumeRaceError) {
      await dbi.batch([
        dbi
          .update(credit)
          .set({ status: CreditStatus.DELETED })
          .where(eq(credit.id, plan.consumeRecord.id)),
        dbi.delete(aiTask).where(eq(aiTask.id, newAITask.id)),
      ]);
    }
    throw e;
  }

  return taskWithCreditId;
}

export async function findAITaskById(id: string) {
  const [result] = await db().select().from(aiTask).where(eq(aiTask.id, id));
  return result;
}

export async function updateAITaskById(id: string, updateAITask: UpdateAITask) {
  const dbi = db();

  // Simple update path: no credit refund needed.
  if (updateAITask.status !== AITaskStatus.FAILED || !updateAITask.creditId) {
    const [result] = await dbi
      .update(aiTask)
      .set(updateAITask)
      .where(eq(aiTask.id, id))
      .returning();
    return result;
  }

  // Failed path: refund consumed credits + mark consume DELETED + update
  // ai_task — all idempotent in one D1 batch.
  //
  // Concurrency: this method may be invoked from multiple paths
  // (Kie webhook, frontend polling) racing on the same task. We make the
  // batch idempotent by guarding every write with `consume.status='active'`
  // via an EXISTS subquery. The first batch wins; subsequent ones see
  // status='deleted' and become no-ops.
  const consumeId = updateAITask.creditId;

  // 1. read consume record once (outside batch) so we know which grants to refund.
  //    If already deleted (someone else won), we still update ai_task and return.
  const [consumedCredit] = await dbi
    .select()
    .from(credit)
    .where(eq(credit.id, consumeId));

  if (!consumedCredit) {
    const [result] = await dbi
      .update(aiTask)
      .set(updateAITask)
      .where(eq(aiTask.id, id))
      .returning();
    return result;
  }

  const consumedItems: any[] = JSON.parse(
    consumedCredit.consumedDetail || '[]'
  );

  // 2. Build batch statements. Every refund / claim guards on consume still
  //    being ACTIVE — so concurrent batches don't double-refund.
  const consumeStillActive = sql`EXISTS (SELECT 1 FROM credit AS c WHERE c.id = ${consumeId} AND c.status = ${CreditStatus.ACTIVE})`;

  const refundStatements = consumedItems
    .filter((item: any) => item && item.creditId && item.creditsConsumed > 0)
    .map((item: any) =>
      dbi
        .update(credit)
        .set({
          remainingCredits: sql`${credit.remainingCredits} + ${item.creditsConsumed}`,
        })
        .where(and(eq(credit.id, item.creditId), consumeStillActive))
    );

  await dbi.batch([
    ...refundStatements,
    // Atomic claim: only the first batch sees status=ACTIVE and flips it.
    dbi
      .update(credit)
      .set({ status: CreditStatus.DELETED })
      .where(
        and(eq(credit.id, consumeId), eq(credit.status, CreditStatus.ACTIVE))
      ),
    // ai_task update is always safe (idempotent — last write wins).
    dbi.update(aiTask).set(updateAITask).where(eq(aiTask.id, id)),
  ]);

  // 3. read back updated task
  const [result] = await dbi.select().from(aiTask).where(eq(aiTask.id, id));
  return result;
}

export async function getAITasksCount({
  userId,
  status,
  mediaType,
  provider,
}: {
  userId?: string;
  status?: string;
  mediaType?: string;
  provider?: string;
}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(aiTask)
    .where(
      and(
        userId ? eq(aiTask.userId, userId) : undefined,
        mediaType ? eq(aiTask.mediaType, mediaType) : undefined,
        provider ? eq(aiTask.provider, provider) : undefined,
        status ? eq(aiTask.status, status) : undefined
      )
    );

  return result?.count || 0;
}

export async function getAITasks({
  userId,
  status,
  mediaType,
  provider,
  page = 1,
  limit = 30,
  getUser = false,
}: {
  userId?: string;
  status?: string;
  mediaType?: string;
  provider?: string;
  page?: number;
  limit?: number;
  getUser?: boolean;
}): Promise<AITask[]> {
  const result = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        userId ? eq(aiTask.userId, userId) : undefined,
        mediaType ? eq(aiTask.mediaType, mediaType) : undefined,
        provider ? eq(aiTask.provider, provider) : undefined,
        status ? eq(aiTask.status, status) : undefined
      )
    )
    .orderBy(desc(aiTask.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}
