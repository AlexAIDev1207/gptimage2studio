import { getUuid } from '@/shared/lib/hash';

import {
  AIConfigs,
  AIGenerateParams,
  AIImage,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
} from './types';

/**
 * Kie.ai configs.
 * Docs: https://docs.kie.ai/
 */
export interface KieConfigs extends AIConfigs {
  apiKey: string;
  baseUrl?: string;
  /**
   * Keep false for GPT Image 2 UX: return Kie result URLs immediately, then mirror to R2
   * through callback or /api/images/mirror without blocking the user's first preview.
   */
  customStorage?: boolean;
}

type KieResolution = '1K' | '2K' | '4K';
type KieAspectRatio = 'auto' | '1:1' | '9:16' | '16:9' | '4:3' | '3:4';

const KIE_GPT_IMAGE_2_TEXT_MODEL = 'gpt-image-2-text-to-image';
const KIE_GPT_IMAGE_2_EDIT_MODEL = 'gpt-image-2-image-to-image';
// Nano Banana 2 在 Kie.ai 上是单一模型，根据 image_input 是否传值决定 text-to-image 或 image-to-image。
// 文档：https://docs.kie.ai/market/google/nanobanana2.md
const KIE_NANO_BANANA_2_MODEL = 'nano-banana-2';
const SUPPORTED_ASPECT_RATIOS = new Set<KieAspectRatio>([
  'auto',
  '1:1',
  '9:16',
  '16:9',
  '4:3',
  '3:4',
]);

function normalizeResolution(value: unknown): KieResolution {
  if (value === '4K' || value === '2K' || value === '1K') return value;
  return '1K';
}

function nearestSupportedAspectRatio(value: unknown): KieAspectRatio {
  if (typeof value === 'string' && SUPPORTED_ASPECT_RATIOS.has(value as KieAspectRatio)) {
    return value as KieAspectRatio;
  }

  // Map unsupported frontend ratios to Kie-supported ratios instead of failing the task.
  if (value === '4:5' || value === '2:3') return '3:4';
  if (value === '5:4' || value === '3:2' || value === '21:9') return '16:9';

  return 'auto';
}

function normalizeAspectRatio(value: unknown, resolution: KieResolution): KieAspectRatio {
  let aspectRatio = nearestSupportedAspectRatio(value);

  // Kie GPT Image 2 notes: auto / unspecified aspect ratio only creates 1K images.
  if (resolution !== '1K' && aspectRatio === 'auto') {
    aspectRatio = '16:9';
  }

  // Kie GPT Image 2 notes: 1:1 cannot be converted to 4K.
  if (resolution === '4K' && aspectRatio === '1:1') {
    aspectRatio = '16:9';
  }

  return aspectRatio;
}

function getImageInputs(options: any): string[] {
  const candidates = options?.input_urls || options?.image_input || options?.image_urls;
  if (!Array.isArray(candidates)) return [];

  return candidates
    .filter((url: unknown): url is string => typeof url === 'string' && url.length > 0)
    .slice(0, 16);
}

function parseJsonString<T = any>(value: unknown): T | null {
  if (!value) return null;
  if (typeof value === 'object') return value as T;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function extractResultUrls(data: any): string[] {
  const resultJson = parseJsonString<any>(data?.resultJson);

  const candidates = [
    resultJson?.resultUrls,
    resultJson?.result_urls,
    resultJson?.images,
    resultJson?.imageUrls,
    data?.resultUrls,
    data?.result_urls,
    data?.info?.resultUrls,
    data?.info?.result_urls,
    data?.info?.result_urls,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((url: unknown): url is string => typeof url === 'string' && url.length > 0);
    }
    if (typeof candidate === 'string' && candidate.length > 0) {
      return [candidate];
    }
  }

  return [];
}

function mapImageTaskStatus(status: string): AITaskStatus {
  switch (status) {
    case 'waiting':
    case 'queuing':
      return AITaskStatus.PENDING;
    case 'generating':
      return AITaskStatus.PROCESSING;
    case 'success':
      return AITaskStatus.SUCCESS;
    case 'fail':
      return AITaskStatus.FAILED;
    default:
      throw new Error(`unknown Kie task status: ${status}`);
  }
}

/**
 * Kie.ai image provider for GPT Image 2.
 *
 * - Text to image model: gpt-image-2-text-to-image
 * - Image to image model: gpt-image-2-image-to-image
 * - Create task: POST /api/v1/jobs/createTask
 * - Query task: GET /api/v1/jobs/recordInfo?taskId=...
 */
export class KieProvider implements AIProvider {
  readonly name = 'kie';
  configs: KieConfigs;

  constructor(configs: KieConfigs) {
    this.configs = configs;
  }

  private getBaseUrl() {
    return (this.configs.baseUrl || 'https://api.kie.ai/api/v1').replace(/\/$/, '');
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.configs.apiKey}`,
    };
  }

  private isSupportedImageModel(model?: string) {
    return (
      model === KIE_GPT_IMAGE_2_TEXT_MODEL ||
      model === KIE_GPT_IMAGE_2_EDIT_MODEL ||
      model === KIE_NANO_BANANA_2_MODEL
    );
  }

  async generateImage({ params }: { params: AIGenerateParams }): Promise<AITaskResult> {
    const { model, prompt, callbackUrl, options = {} } = params;

    if (!model) throw new Error('model is required');
    if (!prompt) throw new Error('prompt is required');
    if (!this.isSupportedImageModel(model)) {
      throw new Error(`unsupported Kie image model: ${model}`);
    }

    const resolution = normalizeResolution(options.resolution || options.image_size);
    const aspectRatio = normalizeAspectRatio(options.aspect_ratio || 'auto', resolution);
    const imageInputs = getImageInputs(options);

    if (model === KIE_GPT_IMAGE_2_EDIT_MODEL && imageInputs.length === 0) {
      throw new Error('input_urls are required for gpt-image-2-image-to-image');
    }

    const input: Record<string, any> = {
      prompt,
      aspect_ratio: aspectRatio,
      resolution,
    };

    if (model === KIE_GPT_IMAGE_2_EDIT_MODEL) {
      input.input_urls = imageInputs;
    } else if (model === KIE_NANO_BANANA_2_MODEL) {
      // Nano Banana 2：image_input 为空数组 → text-to-image；非空 → image-to-image。最多 14 张。
      input.image_input = imageInputs.slice(0, 14);
      if (typeof options.output_format === 'string') {
        input.output_format = options.output_format;
      }
    }

    const payload: Record<string, any> = {
      model,
      input,
    };

    if (callbackUrl) {
      payload.callBackUrl = callbackUrl;
    }

    const resp = await fetch(`${this.getBaseUrl()}/jobs/createTask`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const body = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(body?.msg || body?.message || `Kie request failed with status: ${resp.status}`);
    }

    const { code, msg, data } = body;
    if (code !== 200) {
      throw new Error(`Kie image task creation failed: ${msg || code}`);
    }
    if (!data?.taskId) {
      throw new Error('Kie image task creation failed: no taskId returned');
    }

    return {
      taskStatus: AITaskStatus.PENDING,
      taskId: data.taskId,
      taskInfo: {
        status: 'waiting',
        images: [],
        createTime: new Date(),
      },
      taskResult: {
        provider: this.name,
        request: payload,
        response: body,
      },
    };
  }

  async generate({ params }: { params: AIGenerateParams }): Promise<AITaskResult> {
    if (params.mediaType !== AIMediaType.IMAGE) {
      throw new Error(`KieProvider in this bundle supports image generation only, got: ${params.mediaType}`);
    }

    return this.generateImage({ params });
  }

  async queryImage({ taskId }: { taskId: string }): Promise<AITaskResult> {
    const resp = await fetch(`${this.getBaseUrl()}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const body = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(body?.msg || body?.message || `Kie query failed with status: ${resp.status}`);
    }

    const { code, msg, data } = body;
    if (code !== 200) {
      throw new Error(msg || `Kie query failed: ${code}`);
    }
    if (!data?.state) {
      throw new Error('Kie query failed: missing task state');
    }

    const taskStatus = mapImageTaskStatus(data.state);
    const resultUrls = extractResultUrls(data);
    const createTime = data.createTime ? new Date(data.createTime) : new Date();

    const images: AIImage[] = resultUrls.map((url) =>
      ({
        id: getUuid(),
        createTime,
        imageUrl: url,
        providerUrl: url,
        storageStatus: 'external',
      }) as AIImage
    );

    return {
      taskId,
      taskStatus,
      taskInfo: {
        images,
        status: data.state,
        errorCode: data.failCode,
        errorMessage: data.failMsg,
        createTime,
      },
      taskResult: body?.data || body,
    };
  }

  async query({ taskId, mediaType }: { taskId: string; mediaType?: string; model?: string }): Promise<AITaskResult> {
    if (mediaType && mediaType !== AIMediaType.IMAGE) {
      throw new Error(`KieProvider in this bundle supports image query only, got: ${mediaType}`);
    }

    return this.queryImage({ taskId });
  }
}
