import { envConfigs } from '@/config';
import { AIMediaType, AITaskStatus } from '@/extensions/ai';
import { getUuid } from '@/shared/lib/hash';
import { getMediaCostCredits } from '@/shared/lib/gptimage2-cost';
import { respData, respErr } from '@/shared/lib/resp';
import { createAITask, NewAITask } from '@/shared/models/ai_task';
import { getAllConfigs } from '@/shared/models/config';
import { getRemainingCredits } from '@/shared/models/credit';
import { syncImageAssetsFromAITask } from '@/shared/models/image_asset';
import { getUserInfo } from '@/shared/models/user';
import { getAIService } from '@/shared/services/ai';

const TAG = '[ai/generate]';

export async function POST(request: Request) {
  const startedAt = Date.now();
  try {
    let { provider, mediaType, model, prompt, options, scene } =
      await request.json();

    if (!provider || !mediaType || !model) {
      throw new Error('invalid params');
    }

    if (!prompt && !options) {
      throw new Error('prompt or options is required');
    }

    const configs = await getAllConfigs();
    const aiService = await getAIService(configs);

    if (!aiService.getMediaTypes().includes(mediaType)) {
      throw new Error('invalid mediaType');
    }

    const aiProvider = aiService.getProvider(provider);
    if (!aiProvider) {
      throw new Error('invalid provider');
    }

    const user = await getUserInfo();
    if (!user) {
      throw new Error('no auth, please sign in');
    }

    if (mediaType === AIMediaType.IMAGE) {
      if (!['text-to-image', 'image-to-image'].includes(scene)) {
        throw new Error('invalid scene');
      }
    } else if (mediaType === AIMediaType.MUSIC) {
      scene = 'text-to-music';
    }

    const costCredits = getMediaCostCredits({
      mediaType,
      scene,
      options,
      configs,
    });

    const remainingCredits = await getRemainingCredits(user.id);
    console.log(
      `${TAG} start: user=${user.id} provider=${provider} model=${model} scene=${scene} cost=${costCredits} balance=${remainingCredits}`
    );

    if (remainingCredits < costCredits) {
      console.log(
        `${TAG} reject: user=${user.id} insufficient_credits balance=${remainingCredits} need=${costCredits}`
      );
      throw new Error('insufficient credits');
    }

    const callbackBaseUrl = configs.app_url || envConfigs.app_url;
    const callbackUrl = `${callbackBaseUrl}/api/ai/notify/${provider}`;
    const params: any = {
      mediaType,
      model,
      prompt,
      callbackUrl,
      options,
    };

    const result = await aiProvider.generate({ params });
    if (!result?.taskId) {
      console.log(
        `${TAG} provider_no_task_id: user=${user.id} provider=${provider} model=${model}`
      );
      throw new Error(
        `ai generate failed, mediaType: ${mediaType}, provider: ${provider}, model: ${model}`
      );
    }

    const newAITask: NewAITask = {
      id: getUuid(),
      userId: user.id,
      mediaType,
      provider,
      model,
      prompt,
      scene,
      options: options ? JSON.stringify(options) : null,
      status: result.taskStatus,
      costCredits,
      taskId: result.taskId,
      taskInfo: result.taskInfo ? JSON.stringify(result.taskInfo) : null,
      taskResult: result.taskResult ? JSON.stringify(result.taskResult) : null,
    };

    await createAITask(newAITask);

    if (newAITask.status === AITaskStatus.SUCCESS) {
      await syncImageAssetsFromAITask(newAITask as any);
    }

    console.log(
      `${TAG} success: user=${user.id} task=${newAITask.id} kie_task=${result.taskId} status=${newAITask.status} duration=${Date.now() - startedAt}ms`
    );

    return respData(newAITask);
  } catch (e: any) {
    console.error(`${TAG} failed: ${e?.message || e} duration=${Date.now() - startedAt}ms`);
    return respErr(e.message);
  }
}
