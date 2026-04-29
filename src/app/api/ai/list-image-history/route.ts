import { AIMediaType, AITaskStatus } from '@/extensions/ai';
import { respData, respErr } from '@/shared/lib/resp';
import { getAITasks } from '@/shared/models/ai_task';
import { getUserInfo } from '@/shared/models/user';

type HistoryImage = {
  taskId: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

type RawImageEntry = {
  imageUrl?: string;
};

const MAX_TASKS = 30;
const MAX_IMAGES = 60;

export async function POST() {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('no auth, please sign in');
    }

    const tasks = await getAITasks({
      userId: user.id,
      mediaType: AIMediaType.IMAGE,
      status: AITaskStatus.SUCCESS,
      limit: MAX_TASKS,
    });

    const images: HistoryImage[] = [];
    for (const task of tasks) {
      if (!task.taskInfo) continue;
      let info: { images?: RawImageEntry[] };
      try {
        info = JSON.parse(task.taskInfo);
      } catch {
        continue;
      }
      const taskImages = info.images;
      if (!Array.isArray(taskImages)) continue;
      for (const entry of taskImages) {
        if (!entry?.imageUrl) continue;
        images.push({
          taskId: task.id,
          prompt: task.prompt ?? '',
          imageUrl: entry.imageUrl,
          createdAt:
            task.createdAt instanceof Date
              ? task.createdAt.toISOString()
              : String(task.createdAt ?? ''),
        });
        if (images.length >= MAX_IMAGES) break;
      }
      if (images.length >= MAX_IMAGES) break;
    }

    return respData({ images });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('list-image-history failed:', e);
    }
    return respErr('failed to load history');
  }
}
