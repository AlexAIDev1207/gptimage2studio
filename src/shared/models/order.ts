import { and, count, desc, eq, or } from 'drizzle-orm';

import { db } from '@/core/db';
import { credit, order, subscription } from '@/config/db/schema';
import { PaymentType } from '@/extensions/payment/types';

import { NewCredit } from './credit';
import {
  NewSubscription,
  UpdateSubscription,
  updateSubscriptionBySubscriptionNo,
} from './subscription';
import { appendUserToResult, User } from './user';

export type Order = typeof order.$inferSelect & {
  user?: User;
};
export type NewOrder = typeof order.$inferInsert;
export type UpdateOrder = Partial<
  Omit<NewOrder, 'id' | 'orderNo' | 'createdAt'>
>;

export enum OrderStatus {
  // processing status
  PENDING = 'pending', // order saved, waiting for checkout
  CREATED = 'created', // checkout success
  // final status
  COMPLETED = 'completed', // checkout completed, but failed
  PAID = 'paid', // order paid success
  FAILED = 'failed', // order paid, but failed
  REFUNDED = 'refunded', // order fully refunded by merchant or user
}

/**
 * create order
 */
export async function createOrder(newOrder: NewOrder) {
  const [result] = await db().insert(order).values(newOrder).returning();

  return result;
}

/**
 * get orders
 */
export async function getOrders({
  orderNo,
  userId,
  status,
  getUser,
  paymentType,
  paymentProvider,
  page = 1,
  limit = 30,
}: {
  orderNo?: string;
  userId?: string;
  status?: OrderStatus;
  getUser?: boolean;
  paymentType?: PaymentType;
  paymentProvider?: string;
  page?: number;
  limit?: number;
} = {}): Promise<Order[]> {
  const result = await db()
    .select()
    .from(order)
    .where(
      and(
        orderNo ? eq(order.orderNo, orderNo) : undefined,
        userId ? eq(order.userId, userId) : undefined,
        status ? eq(order.status, status) : undefined,
        paymentType ? eq(order.paymentType, paymentType) : undefined,
        paymentProvider ? eq(order.paymentProvider, paymentProvider) : undefined
      )
    )
    .orderBy(desc(order.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}

/**
 * get orders count
 */
export async function getOrdersCount({
  orderNo,
  userId,
  paymentType,
  status,
  paymentProvider,
}: {
  orderNo?: string;
  userId?: string;
  paymentType?: PaymentType;
  paymentProvider?: string;
  status?: OrderStatus;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(order)
    .where(
      and(
        orderNo ? eq(order.orderNo, orderNo) : undefined,
        userId ? eq(order.userId, userId) : undefined,
        status ? eq(order.status, status) : undefined,
        paymentType ? eq(order.paymentType, paymentType) : undefined,
        paymentProvider ? eq(order.paymentProvider, paymentProvider) : undefined
      )
    );

  return result?.count || 0;
}

/**
 * find order by id
 */
export async function findOrderById(id: string) {
  const [result] = await db().select().from(order).where(eq(order.id, id));

  return result;
}

/**
 * find order by order no
 */
export async function findOrderByOrderNo(orderNo: string) {
  const [result] = await db()
    .select()
    .from(order)
    .where(eq(order.orderNo, orderNo));

  return result;
}

/**
 * find order by transaction id and payment provider
 */
export async function findOrderByTransactionId({
  transactionId,
  paymentProvider,
}: {
  transactionId: string;
  paymentProvider: string;
}) {
  const [result] = await db()
    .select()
    .from(order)
    .where(
      and(
        eq(order.transactionId, transactionId),
        eq(order.paymentProvider, paymentProvider)
      )
    );

  return result;
}

/**
 * update order
 */
export async function updateOrderByOrderNo(
  orderNo: string,
  updateOrder: UpdateOrder,
  options?: {
    // Only update if current status matches (optimistic lock)
    expectedStatus?: OrderStatus;
  }
) {
  const conditions = [eq(order.orderNo, orderNo)];

  // Add status check for optimistic locking
  if (options?.expectedStatus) {
    conditions.push(eq(order.status, options.expectedStatus));
  }

  const [result] = await db()
    .update(order)
    .set(updateOrder)
    .where(and(...conditions))
    .returning();

  return result;
}

/**
 * update order by order id
 */
export async function updateOrderByOrderId(
  orderId: string,
  updateOrder: UpdateOrder
) {
  const [result] = await db()
    .update(order)
    .set(updateOrder)
    .where(eq(order.id, orderId))
    .returning();

  return result;
}

export async function updateOrderInTransaction({
  orderNo,
  updateOrder,
  newSubscription,
  newCredit,
}: {
  orderNo: string;
  updateOrder: UpdateOrder;
  newSubscription?: NewSubscription;
  newCredit?: NewCredit;
}) {
  if (!orderNo || !updateOrder) {
    throw new Error('orderNo and updateOrder are required');
  }

  // only update order, no need transaction
  if (!newSubscription && !newCredit) {
    return updateOrderByOrderNo(orderNo, updateOrder);
  }

  // D1 doesn't support BEGIN/COMMIT — use db.batch() (atomic).
  //
  // Known limitation (P2 follow-up): the idempotency check is read-then-write
  // (see step 1 below). Schema currently has *non-unique* indexes on
  // (subscriptionId, paymentProvider) and credit.orderNo, so two concurrent
  // webhook deliveries may both observe "not exists" and create duplicate rows.
  // To fix robustly: add UNIQUE constraints in schema migration and use
  // INSERT ... ON CONFLICT IGNORE/UPDATE here. Acceptable for now because:
  // 1) Stripe webhooks rarely deliver in true parallel for the same event.
  // 2) The optimistic-lock guard on the order UPDATE prevents double-PAID.
  const dbi = db();
  const stmts: any[] = [];
  const finalResult: any = { order: null, subscription: null, credit: null };

  // 1. read existing subscription / credit (idempotency)
  let existingSubscription: any = null;
  if (newSubscription?.subscriptionId && newSubscription.paymentProvider) {
    const [row] = await dbi
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.subscriptionId, newSubscription.subscriptionId),
          eq(subscription.paymentProvider, newSubscription.paymentProvider)
        )
      );
    existingSubscription = row;
  }

  let existingCredit: any = null;
  if (newCredit) {
    const [row] = await dbi
      .select()
      .from(credit)
      .where(eq(credit.orderNo, orderNo));
    existingCredit = row;
  }

  // 2. compose batch writes
  if (newSubscription && !existingSubscription) {
    stmts.push(dbi.insert(subscription).values(newSubscription));
    finalResult.subscription = newSubscription;
  } else if (existingSubscription) {
    finalResult.subscription = existingSubscription;
  }

  if (newCredit && !existingCredit) {
    stmts.push(dbi.insert(credit).values(newCredit));
    finalResult.credit = newCredit;
  } else if (existingCredit) {
    finalResult.credit = existingCredit;
  }

  // update order with optimistic lock
  stmts.push(
    dbi
      .update(order)
      .set(updateOrder)
      .where(
        and(
          eq(order.orderNo, orderNo),
          updateOrder.status === OrderStatus.PAID
            ? or(
                eq(order.status, OrderStatus.CREATED),
                eq(order.status, OrderStatus.PENDING)
              )
            : undefined
        )
      )
  );

  // 3. atomic execution
  await dbi.batch(stmts);

  // 4. read back order (D1 batch has no .returning())
  const [orderRow] = await dbi
    .select()
    .from(order)
    .where(eq(order.orderNo, orderNo));
  finalResult.order = orderRow;

  if (
    updateOrder.status === OrderStatus.PAID &&
    orderRow &&
    orderRow.status !== OrderStatus.PAID
  ) {
    console.log(
      `Order ${orderNo} optimistic lock missed: status=${orderRow.status}`
    );
  }

  return finalResult;
}

export async function updateSubscriptionInTransaction({
  subscriptionNo,
  updateSubscription,
  newOrder,
  newCredit,
}: {
  subscriptionNo: string; // subscription unique id in table
  updateSubscription: UpdateSubscription;
  newOrder?: NewOrder;
  newCredit?: NewCredit;
}) {
  if (!subscriptionNo || !updateSubscription) {
    throw new Error('subscriptionNo and updateSubscription are required');
  }

  // only update order, no need transaction
  if (!newOrder && !newCredit) {
    return updateSubscriptionBySubscriptionNo(
      subscriptionNo,
      updateSubscription
    );
  }

  // D1 doesn't support BEGIN/COMMIT — use db.batch() (atomic).
  const dbi = db();
  const stmts: any[] = [];
  const finalResult: any = { order: null, subscription: null, credit: null };

  // 1. read existing order (idempotency on transaction id)
  let existingOrder: any = null;
  if (newOrder?.transactionId && newOrder.paymentProvider) {
    const [row] = await dbi
      .select()
      .from(order)
      .where(
        and(
          eq(order.transactionId, newOrder.transactionId),
          eq(order.paymentProvider, newOrder.paymentProvider)
        )
      );
    existingOrder = row;
  }

  // 2. read existing credit (using order_no — either from existing or new)
  let existingCredit: any = null;
  if (newCredit) {
    const checkOrderNo = existingOrder?.orderNo || newOrder?.orderNo;
    if (checkOrderNo) {
      const [row] = await dbi
        .select()
        .from(credit)
        .where(eq(credit.orderNo, checkOrderNo));
      existingCredit = row;
    }
  }

  // 3. compose batch writes
  if (newOrder && !existingOrder) {
    stmts.push(dbi.insert(order).values(newOrder));
    finalResult.order = newOrder;
  } else if (existingOrder) {
    finalResult.order = existingOrder;
  }

  if (newCredit && !existingCredit) {
    stmts.push(dbi.insert(credit).values(newCredit));
    finalResult.credit = newCredit;
  } else if (existingCredit) {
    finalResult.credit = existingCredit;
  }

  // update subscription
  stmts.push(
    dbi
      .update(subscription)
      .set(updateSubscription)
      .where(eq(subscription.subscriptionNo, subscriptionNo))
  );

  // 4. atomic execution
  await dbi.batch(stmts);

  // 5. read back subscription
  const [subRow] = await dbi
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionNo, subscriptionNo));
  finalResult.subscription = subRow;

  return finalResult;
}
