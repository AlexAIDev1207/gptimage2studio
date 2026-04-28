import { and, count, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { aiTask, credit } from '@/config/db/schema';
import { AITaskStatus } from '@/extensions/ai';
import { appendUserToResult, User } from '@/shared/models/user';

import { CreditStatus, planConsumeCredits } from './credit';

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

  // Failed path: refund consumed credits and update ai_task in one D1 batch
  // (atomic). 1. read consume record (read-only — outside batch).
  const [consumedCredit] = await dbi
    .select()
    .from(credit)
    .where(eq(credit.id, updateAITask.creditId));

  // No active consume record to refund — just update task.
  if (!consumedCredit || consumedCredit.status !== CreditStatus.ACTIVE) {
    const [result] = await dbi
      .update(aiTask)
      .set(updateAITask)
      .where(eq(aiTask.id, id))
      .returning();
    return result;
  }

  // 2. build refund statements
  const consumedItems: any[] = JSON.parse(consumedCredit.consumedDetail || '[]');
  const refundStatements = consumedItems
    .filter((item: any) => item && item.creditId && item.creditsConsumed > 0)
    .map((item: any) =>
      dbi
        .update(credit)
        .set({
          remainingCredits: sql`${credit.remainingCredits} + ${item.creditsConsumed}`,
        })
        .where(eq(credit.id, item.creditId))
    );

  // 3. atomic batch: refunds + mark consume as deleted + update ai_task
  await dbi.batch([
    ...refundStatements,
    dbi
      .update(credit)
      .set({ status: CreditStatus.DELETED })
      .where(eq(credit.id, updateAITask.creditId)),
    dbi.update(aiTask).set(updateAITask).where(eq(aiTask.id, id)),
  ]);

  // 4. read back updated task (D1 batch doesn't return .returning() values cleanly)
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
