import { and, eq } from 'drizzle-orm';

import { aiTask } from '@/config/db/schema';
import { db } from '@/core/db';
import { AIMediaType, AITaskStatus } from '@/extensions/ai';
import { getAllConfigs } from '@/shared/models/config';
import { UpdateAITask, updateAITaskById } from '@/shared/models/ai_task';
import {
  mirrorImageAssetsForTask,
  syncImageAssetsFromAITask,
} from '@/shared/models/image_asset';
import { getAIService } from '@/shared/services/ai';

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
  }
  return btoa(binary);
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacSha256Base64(message: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return bytesToBase64(new Uint8Array(signature));
}

function getProviderTaskId(body: any): string | undefined {
  return (
    body?.taskId ||
    body?.task_id ||
    body?.data?.taskId ||
    body?.data?.task_id ||
    body?.data?.id ||
    body?.id
  );
}

async function verifyKieWebhook({
  request,
  taskId,
  webhookHmacKey,
}: {
  request: Request;
  taskId: string;
  webhookHmacKey?: string;
}) {
  if (!webhookHmacKey) return true;

  const timestamp = request.headers.get('X-Webhook-Timestamp');
  const signature = request.headers.get('X-Webhook-Signature');
  if (!timestamp || !signature) return false;

  const expected = await hmacSha256Base64(`${taskId}.${timestamp}`, webhookHmacKey);
  return constantTimeEqual(expected, signature);
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody || '{}');
    const providerTaskId = getProviderTaskId(body);

    if (!providerTaskId) {
      return new Response('missing task id', { status: 400 });
    }

    const configs = await getAllConfigs();
    const webhookHmacKey = configs.kie_webhook_hmac_key || process.env.KIE_WEBHOOK_HMAC_KEY;
    const verified = await verifyKieWebhook({ request, taskId: providerTaskId, webhookHmacKey });
    if (!verified) {
      return new Response('invalid signature', { status: 401 });
    }

    const [task] = await db()
      .select()
      .from(aiTask)
      .where(and(eq(aiTask.provider, 'kie'), eq(aiTask.taskId, providerTaskId)))
      .limit(1);

    if (!task) {
      // Return 200 so Kie does not retry forever for old tasks that are no longer in our DB.
      return Response.json({ ok: true, skipped: 'task not found' });
    }

    const aiService = await getAIService(configs);
    const aiProvider = aiService.getProvider('kie');
    if (!aiProvider?.query) {
      return new Response('kie provider unavailable', { status: 500 });
    }

    // Query the authoritative recordInfo endpoint instead of trusting a callback
    // shape that may vary by model family.
    const result = await aiProvider.query({
      taskId: providerTaskId,
      mediaType: task.mediaType || AIMediaType.IMAGE,
      model: task.model,
    });

    const updateAITask: UpdateAITask = {
      status: result.taskStatus,
      taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
      taskResult: result.taskResult ? JSON.stringify(result.taskResult) : null,
      creditId: task.creditId,
    };

    const updated = await updateAITaskById(task.id, updateAITask);

    if (updated?.status === AITaskStatus.SUCCESS) {
      await syncImageAssetsFromAITask(updated as any);
      await mirrorImageAssetsForTask({ aiTaskId: updated.id, userId: updated.userId });
    }

    return Response.json({ ok: true, status: updated?.status || result.taskStatus });
  } catch (error: any) {
    console.error('kie notify failed', error);
    return new Response(error?.message || 'kie notify failed', { status: 500 });
  }
}
