import { AIMediaType } from '@/extensions/ai';

export type GptImage2CostConfigs = Record<string, any>;

type ResolutionTier = '1K' | '2K' | '4K';

function intFromConfig(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function resolutionTier(options: any): ResolutionTier {
  const tier = options?.resolution || options?.image_size || '1K';
  if (tier === '4K' || tier === '2K' || tier === '1K') return tier;
  return '1K';
}

function outputCount(options: any) {
  // Kie GPT Image 2 docs expose one image output per task. Keep the helper ready
  // for future fan-out, but clamp MVP calls to one image unless you implement
  // multiple backend tasks.
  const n = Number(options?.num_images ?? options?.n ?? 1);
  if (!Number.isFinite(n)) return 1;
  return Math.min(1, Math.max(1, Math.floor(n)));
}

export function getGptImage2ResolutionCostCredits({
  options,
  configs = {},
}: {
  options?: any;
  configs?: GptImage2CostConfigs;
}) {
  const oneK = intFromConfig(configs.gptimage2_1k_credits || process.env.GPTIMAGE2_1K_CREDITS, 6);
  const twoK = intFromConfig(configs.gptimage2_2k_credits || process.env.GPTIMAGE2_2K_CREDITS, 10);
  const fourK = intFromConfig(configs.gptimage2_4k_credits || process.env.GPTIMAGE2_4K_CREDITS, 16);

  switch (resolutionTier(options)) {
    case '4K':
      return fourK;
    case '2K':
      return twoK;
    case '1K':
    default:
      return oneK;
  }
}

export function getImageCostCredits({
  mediaType,
  options,
  configs = {},
}: {
  mediaType: string;
  scene?: string;
  options?: any;
  configs?: GptImage2CostConfigs;
}) {
  if (mediaType !== AIMediaType.IMAGE) return 0;

  return getGptImage2ResolutionCostCredits({ options, configs }) * outputCount(options);
}

export function getMediaCostCredits({
  mediaType,
  scene,
  options,
  configs = {},
}: {
  mediaType: string;
  scene?: string;
  options?: any;
  configs?: GptImage2CostConfigs;
}) {
  if (mediaType === AIMediaType.IMAGE) {
    return getImageCostCredits({ mediaType, scene, options, configs });
  }

  if (mediaType === AIMediaType.VIDEO) {
    if (scene === 'text-to-video') return 6;
    if (scene === 'image-to-video') return 8;
    if (scene === 'video-to-video') return 10;
  }

  if (mediaType === AIMediaType.MUSIC) return 10;

  throw new Error('invalid mediaType');
}
