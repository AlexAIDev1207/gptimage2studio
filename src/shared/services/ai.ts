import {
  AIManager,
  FalProvider,
  GeminiProvider,
  KieProvider,
  ReplicateProvider,
} from '@/extensions/ai';
import { Configs, getAllConfigs } from '@/shared/models/config';

/**
 * get ai manager with configs
 */
export function getAIManagerWithConfigs(configs: Configs) {
  const aiManager = new AIManager();

  // GPT Image 2 Studio 默认 provider：Kie.ai
  const kieApiKey = configs.kie_api_key || process.env.KIE_API_KEY;
  if (kieApiKey) {
    aiManager.addProvider(
      new KieProvider({
        apiKey: kieApiKey,
        baseUrl:
          configs.kie_base_url ||
          process.env.KIE_BASE_URL ||
          'https://api.kie.ai/api/v1',
        // 保持 false 走快速预览流程：先回 Kie URL，后由
        // /api/ai/notify/kie 与 /api/images/mirror 异步镜像到 R2
        customStorage:
          (configs.kie_custom_storage ||
            process.env.KIE_CUSTOM_STORAGE ||
            'false') === 'true',
      }),
      true
    );
  }

  if (configs.replicate_api_token) {
    aiManager.addProvider(
      new ReplicateProvider({
        apiToken: configs.replicate_api_token,
        customStorage: configs.replicate_custom_storage === 'true',
      })
    );
  }

  if (configs.fal_api_key) {
    aiManager.addProvider(
      new FalProvider({
        apiKey: configs.fal_api_key,
        customStorage: configs.fal_custom_storage === 'true',
      })
    );
  }

  if (configs.gemini_api_key) {
    aiManager.addProvider(
      new GeminiProvider({
        apiKey: configs.gemini_api_key,
      })
    );
  }

  return aiManager;
}

/**
 * global ai service
 */
let aiService: AIManager | null = null;

/**
 * get ai service manager
 */
export async function getAIService(configs?: Configs): Promise<AIManager> {
  if (!configs) {
    configs = await getAllConfigs();
  }
  aiService = getAIManagerWithConfigs(configs);

  return aiService;
}
