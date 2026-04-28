import { respData, respErr } from '@/shared/lib/resp';
import { findAITaskById } from '@/shared/models/ai_task';
import {
  mirrorImageAssetsForTask,
  syncImageAssetsFromAITask,
} from '@/shared/models/image_asset';
import { getUserInfo } from '@/shared/models/user';

const TAG = '[images/mirror]';

/**
 * Fire-and-forget endpoint used by the frontend after it has already displayed
 * the provider result URL. This mirrors successful Kie images to R2 without
 * blocking the first user-visible preview.
 */
export async function POST(req: Request) {
  const startedAt = Date.now();
  try {
    const { taskId } = await req.json();
    if (!taskId) return respErr('invalid params');

    const user = await getUserInfo();
    if (!user) return respErr('no auth, please sign in');

    const task = await findAITaskById(taskId);
    if (!task || task.userId !== user.id) return respErr('task not found');

    console.log(`${TAG} start: user=${user.id} task=${task.id}`);

    await syncImageAssetsFromAITask(task as any);
    const assets = await mirrorImageAssetsForTask({
      aiTaskId: task.id,
      userId: user.id,
    });

    console.log(
      `${TAG} done: user=${user.id} task=${task.id} mirrored=${assets.length} duration=${Date.now() - startedAt}ms`
    );

    return respData({ mirrored: assets.length });
  } catch (e: any) {
    console.error(`${TAG} failed: ${e?.message || e} duration=${Date.now() - startedAt}ms`);
    return respErr(e.message || 'mirror images failed');
  }
}
