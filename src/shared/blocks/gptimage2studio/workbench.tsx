'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Gift,
  Image as ImageIcon,
  Images,
  Loader2,
  Monitor,
  Pencil,
  Sparkles,
  User as UserIcon,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';

import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { ImageUploader, ImageUploaderValue } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppContext } from '@/shared/contexts/app';

import { capabilityCards, workbench } from './content';

type Mode = 'text-to-image' | 'image-to-image';
type ResolutionTier = '1K' | '2K' | '4K';
type OutputCount = 1 | 2 | 4;
type WorkbenchVariant = 'banana' | 'studio';
type ModelKey = 'gpt-image-2' | 'nano-banana';

interface UsePromptEventDetail {
  prompt?: string;
  mode?: Mode;
  modelKey?: ModelKey;
  referenceImage?: string;
}

interface GeneratedImage {
  id: string;
  url: string;
  provider?: string;
  model?: string;
  prompt?: string;
}

interface BackendTask {
  id: string;
  status: string;
  provider: string;
  model: string;
  prompt: string | null;
  taskInfo: string | null;
  taskResult: string | null;
}

const MAX_PROMPT_LENGTH = 5000;
const POLL_INTERVAL = 5000;
const GENERATION_TIMEOUT = 180000;
const PENDING_PROMPT_STORAGE_KEY = 'gptimage2studio:pending-prompt';

// Two-model dropdown. Maps to (provider, model) per scene.
interface ModelOption {
  key: ModelKey;
  label: string;
  tagline: string;
  emoji: string;
  // mapping per scene
  textToImage: { provider: string; model: string };
  imageToImage: { provider: string; model: string };
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    key: 'gpt-image-2',
    label: 'GPT Image 2',
    tagline: 'Perfect text rendering · 4K resolution',
    emoji: '✨',
    textToImage: { provider: 'kie', model: 'gpt-image-2-text-to-image' },
    imageToImage: { provider: 'kie', model: 'gpt-image-2-image-to-image' },
  },
  {
    key: 'nano-banana',
    label: 'Nano Banana',
    tagline: 'Reference-driven editing · fast iteration',
    emoji: '🍌',
    // Nano Banana 2 走 Kie.ai 同一个模型；image_input 为空时为 text-to-image，非空时为 image-to-image。
    textToImage: { provider: 'kie', model: 'nano-banana-2' },
    imageToImage: { provider: 'kie', model: 'nano-banana-2' },
  },
];

const ASPECT_RATIO_OPTIONS: { value: string; label: string }[] = [
  { value: 'auto', label: 'Auto · 1K only' },
  { value: '1:1', label: '1:1 Square' },
  { value: '3:4', label: '3:4 Portrait' },
  { value: '4:3', label: '4:3 Landscape' },
  { value: '16:9', label: '16:9 Wide' },
  { value: '9:16', label: '9:16 Vertical' },
];

const RESOLUTION_OPTIONS: {
  value: ResolutionTier;
  label: string;
  multiplier: number;
}[] = [
  { value: '1K', label: '1K · 6 credits', multiplier: 6 },
  { value: '2K', label: '2K · 10 credits', multiplier: 10 },
  { value: '4K', label: '4K · 16 credits', multiplier: 16 },
];

const OUTPUT_COUNT_OPTIONS: OutputCount[] = [1];

const WORKBENCH_THEMES: Record<
  WorkbenchVariant,
  {
    promoBorder: string;
    promoBg: string;
    promoIcon: string;
    primaryButton: string;
    activeTab: string;
    activeModel: string;
    focusRing: string;
    costPanel: string;
    costText: string;
    featurePill: string;
    dot: string;
    panelGlow: string;
  }
> = {
  banana: {
    promoBorder: 'border-emerald-200 dark:border-emerald-400/25',
    promoBg:
      'bg-gradient-to-r from-emerald-50 via-white to-cyan-50 dark:from-emerald-500/[0.10] dark:via-transparent dark:to-cyan-500/[0.08]',
    promoIcon:
      'border-emerald-200 bg-white text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300',
    primaryButton:
      'bg-gradient-to-r from-emerald-500 to-cyan-400 text-zinc-950 hover:from-emerald-400 hover:to-cyan-300',
    activeTab:
      'data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-400 data-[state=active]:text-zinc-950',
    activeModel:
      'border-emerald-300 bg-emerald-50 text-slate-950 shadow-[0_18px_44px_-30px_rgba(16,185,129,0.4)] dark:border-emerald-400/50 dark:bg-emerald-500/10 dark:text-white dark:shadow-none',
    focusRing: 'focus-visible:ring-emerald-400/40',
    costPanel:
      'border-emerald-200 bg-emerald-50/85 dark:border-emerald-400/30 dark:bg-emerald-500/[0.08]',
    costText: 'text-emerald-700 dark:text-emerald-300',
    featurePill:
      'border-emerald-200/90 bg-white/88 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/25 dark:text-emerald-100',
    dot: 'bg-emerald-400',
    panelGlow: 'shadow-emerald-200/70 dark:shadow-emerald-950/30',
  },
  studio: {
    promoBorder: 'border-cyan-200 dark:border-violet-400/25',
    promoBg:
      'bg-gradient-to-r from-cyan-50 via-white to-sky-50 dark:from-violet-500/[0.12] dark:via-transparent dark:to-cyan-500/[0.08]',
    promoIcon:
      'border-cyan-200 bg-white text-cyan-600 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-300',
    primaryButton:
      'bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 text-white hover:from-violet-400 hover:via-blue-400 hover:to-cyan-300',
    activeTab:
      'data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-sky-400 data-[state=active]:text-slate-950 dark:data-[state=active]:from-violet-500 dark:data-[state=active]:to-cyan-400 dark:data-[state=active]:text-white',
    activeModel:
      'border-cyan-300 bg-cyan-50 text-slate-950 shadow-[0_18px_44px_-30px_rgba(34,211,238,0.42)] dark:border-violet-400/50 dark:bg-violet-500/15 dark:text-white dark:shadow-none',
    focusRing: 'focus-visible:ring-violet-400/40',
    costPanel:
      'border-cyan-200 bg-cyan-50/85 dark:border-violet-400/30 dark:bg-violet-500/[0.09]',
    costText: 'text-cyan-700 dark:text-violet-200',
    featurePill:
      'border-cyan-200/90 bg-white/88 text-cyan-700 dark:border-violet-400/45 dark:bg-violet-500/25 dark:text-violet-100',
    dot: 'bg-violet-400',
    panelGlow: 'shadow-cyan-200/70 dark:shadow-violet-950/30',
  },
};

type WorkbenchTheme = (typeof WORKBENCH_THEMES)[WorkbenchVariant];

function parseTaskResult(taskResult: string | null): any {
  if (!taskResult) return null;
  try {
    return JSON.parse(taskResult);
  } catch {
    return null;
  }
}

function extractImageUrls(result: any): string[] {
  if (!result) return [];
  const output = result.output ?? result.images ?? result.data;
  if (!output) return [];
  if (typeof output === 'string') return [output];
  if (Array.isArray(output)) {
    return output
      .flatMap((item) => {
        if (!item) return [];
        if (typeof item === 'string') return [item];
        if (typeof item === 'object') {
          const candidate =
            item.url ?? item.uri ?? item.image ?? item.src ?? item.imageUrl;
          return typeof candidate === 'string' ? [candidate] : [];
        }
        return [];
      })
      .filter(Boolean);
  }
  if (typeof output === 'object') {
    const candidate =
      output.url ?? output.uri ?? output.image ?? output.src ?? output.imageUrl;
    if (typeof candidate === 'string') return [candidate];
  }
  return [];
}

export default function Workbench({
  variant = 'banana',
}: {
  variant?: WorkbenchVariant;
}) {
  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } =
    useAppContext();
  const theme = WORKBENCH_THEMES[variant];

  const [mode, setMode] = useState<Mode>('text-to-image');
  const [modelKey, setModelKey] = useState<ModelKey>('gpt-image-2');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [resolution, setResolution] = useState<ResolutionTier>('2K');
  const [outputCount, setOutputCount] = useState<OutputCount>(1);
  const [prompt, setPrompt] = useState<string>(workbench.defaultPrompt);

  const [referenceImageItems, setReferenceImageItems] = useState<
    ImageUploaderValue[]
  >([]);
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);

  const [activeWorkbenchFeature, setActiveWorkbenchFeature] =
    useState<number>(0);

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<AITaskStatus | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const promptLength = prompt.length;
  const isPromptOverLimit = promptLength > MAX_PROMPT_LENGTH;
  const isImageEditMode = mode === 'image-to-image';
  const remainingCredits = user?.credits?.remainingCredits ?? 0;

  const selectedModel = useMemo(
    () => MODEL_OPTIONS.find((m) => m.key === modelKey) ?? MODEL_OPTIONS[0],
    [modelKey]
  );

  const currentMapping = useMemo(
    () =>
      isImageEditMode ? selectedModel.imageToImage : selectedModel.textToImage,
    [isImageEditMode, selectedModel]
  );

  const isReferenceUploading = useMemo(
    () => referenceImageItems.some((item) => item.status === 'uploading'),
    [referenceImageItems]
  );

  const hasReferenceUploadError = useMemo(
    () => referenceImageItems.some((item) => item.status === 'error'),
    [referenceImageItems]
  );

  const resolutionCost =
    RESOLUTION_OPTIONS.find((r) => r.value === resolution)?.multiplier ?? 6;
  const costCredits = resolutionCost * outputCount;

  const taskStatusLabel = useMemo(() => {
    if (!taskStatus) return '';
    switch (taskStatus) {
      case AITaskStatus.PENDING:
        return 'Waiting for the model to start';
      case AITaskStatus.PROCESSING:
        return 'Generating your image...';
      case AITaskStatus.SUCCESS:
        return 'Image generation completed';
      case AITaskStatus.FAILED:
        return 'Generation failed';
      default:
        return '';
    }
  }, [taskStatus]);

  const handleReferenceImagesChange = useCallback(
    (items: ImageUploaderValue[]) => {
      setReferenceImageItems(items);
      const uploadedUrls = items
        .filter((item) => item.status === 'uploaded' && item.url)
        .map((item) => item.url as string);
      setReferenceImageUrls(uploadedUrls);
    },
    []
  );

  const resetTaskState = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setTaskId(null);
    setGenerationStartTime(null);
    setTaskStatus(null);
  }, []);

  useEffect(() => {
    const applyPromptDetail = (detail?: UsePromptEventDetail) => {
      if (!detail?.prompt) return;

      const nextMode = detail.mode ?? 'text-to-image';
      const trimmedPrompt = detail.prompt.slice(0, MAX_PROMPT_LENGTH);

      setPrompt(trimmedPrompt);
      setMode(nextMode);
      setModelKey(detail.modelKey ?? 'gpt-image-2');
      setGeneratedImages([]);
      resetTaskState();

      if (detail.referenceImage) {
        const referenceItem: ImageUploaderValue = {
          id: `prompt-ref-${Date.now()}`,
          preview: detail.referenceImage,
          url: detail.referenceImage,
          status: 'uploaded',
        };
        setReferenceImageItems([referenceItem]);
        setReferenceImageUrls([detail.referenceImage]);
      } else if (nextMode === 'text-to-image') {
        setReferenceImageItems([]);
        setReferenceImageUrls([]);
      }

      toast.success(
        nextMode === 'image-to-image'
          ? 'Prompt loaded with reference image'
          : 'Prompt loaded in workbench'
      );
    };

    try {
      const pendingPrompt = window.sessionStorage.getItem(
        PENDING_PROMPT_STORAGE_KEY
      );
      if (pendingPrompt) {
        window.sessionStorage.removeItem(PENDING_PROMPT_STORAGE_KEY);
        applyPromptDetail(JSON.parse(pendingPrompt) as UsePromptEventDetail);
      }
    } catch {
      window.sessionStorage.removeItem(PENDING_PROMPT_STORAGE_KEY);
    }

    const handleUsePrompt = (event: Event) => {
      applyPromptDetail((event as CustomEvent<UsePromptEventDetail>).detail);
    };

    window.addEventListener('gptimage2studio:use-prompt', handleUsePrompt);

    return () => {
      window.removeEventListener('gptimage2studio:use-prompt', handleUsePrompt);
    };
  }, [resetTaskState]);

  const pollTaskStatus = useCallback(
    async (id: string) => {
      try {
        if (
          generationStartTime &&
          Date.now() - generationStartTime > GENERATION_TIMEOUT
        ) {
          resetTaskState();
          toast.error('Image generation timed out. Please try again.');
          return true;
        }

        const resp = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: id }),
        });

        if (!resp.ok) {
          throw new Error(`request failed with status: ${resp.status}`);
        }

        const { code, message, data } = await resp.json();
        if (code !== 0) {
          throw new Error(message || 'Query task failed');
        }

        const task = data as BackendTask;
        const currentStatus = task.status as AITaskStatus;
        setTaskStatus(currentStatus);

        const parsedResult = parseTaskResult(task.taskInfo);
        const imageUrls = extractImageUrls(parsedResult);

        if (currentStatus === AITaskStatus.PENDING) {
          setProgress((prev) => Math.max(prev, 20));
          return false;
        }

        if (currentStatus === AITaskStatus.PROCESSING) {
          if (imageUrls.length > 0) {
            setGeneratedImages(
              imageUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                provider: task.provider,
                model: task.model,
                prompt: task.prompt ?? undefined,
              }))
            );
            setProgress((prev) => Math.max(prev, 85));
          } else {
            setProgress((prev) => Math.min(prev + 10, 80));
          }
          return false;
        }

        if (currentStatus === AITaskStatus.SUCCESS) {
          if (imageUrls.length === 0) {
            toast.error('The provider returned no images. Please retry.');
          } else {
            setGeneratedImages(
              imageUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                provider: task.provider,
                model: task.model,
                prompt: task.prompt ?? undefined,
              }))
            );
            void fetch('/api/images/mirror', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ taskId: task.id }),
            }).catch(() => undefined);
            toast.success('Image generated successfully');
          }

          setProgress(100);
          resetTaskState();
          return true;
        }

        if (currentStatus === AITaskStatus.FAILED) {
          const errorMessage =
            parsedResult?.errorMessage || 'Generate image failed';
          toast.error(errorMessage);
          resetTaskState();
          fetchUserCredits();
          return true;
        }

        setProgress((prev) => Math.min(prev + 5, 95));
        return false;
      } catch (error: any) {
        toast.error(`Query task failed: ${error.message}`);
        resetTaskState();
        fetchUserCredits();
        return true;
      }
    },
    [generationStartTime, resetTaskState, fetchUserCredits]
  );

  useEffect(() => {
    if (!taskId || !isGenerating) return;

    let cancelled = false;

    const tick = async () => {
      if (!taskId) return;
      const completed = await pollTaskStatus(taskId);
      if (completed) cancelled = true;
    };

    tick();

    const interval = setInterval(async () => {
      if (cancelled || !taskId) {
        clearInterval(interval);
        return;
      }
      const completed = await pollTaskStatus(taskId);
      if (completed) clearInterval(interval);
    }, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [taskId, isGenerating, pollTaskStatus]);

  const handleGenerate = async () => {
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    if (remainingCredits < costCredits) {
      toast.error('Insufficient credits. Please top up to keep creating.');
      return;
    }

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error('Please enter a prompt before generating.');
      return;
    }

    if (isPromptOverLimit) {
      toast.error('Prompt is too long. Please shorten it to 5000 characters.');
      return;
    }

    if (isImageEditMode && referenceImageUrls.length === 0) {
      toast.error('Please upload reference images before generating.');
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    setTaskStatus(AITaskStatus.PENDING);
    setGeneratedImages([]);
    setGenerationStartTime(Date.now());

    try {
      const options: Record<string, any> = {
        resolution,
        aspect_ratio: aspectRatio,
      };

      if (isImageEditMode) {
        options.image_input = referenceImageUrls;
      }

      const resp = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: AIMediaType.IMAGE,
          scene: isImageEditMode ? 'image-to-image' : 'text-to-image',
          provider: currentMapping.provider,
          model: currentMapping.model,
          prompt: trimmedPrompt,
          options,
        }),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status: ${resp.status}`);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message || 'Failed to create an image task');
      }

      const newTaskId = data?.id;
      if (!newTaskId) {
        throw new Error('Task id missing in response');
      }

      if (data.status === AITaskStatus.SUCCESS && data.taskInfo) {
        const parsedResult = parseTaskResult(data.taskInfo);
        const imageUrls = extractImageUrls(parsedResult);

        if (imageUrls.length > 0) {
          setGeneratedImages(
            imageUrls.map((url, index) => ({
              id: `${newTaskId}-${index}`,
              url,
              provider: currentMapping.provider,
              model: currentMapping.model,
              prompt: trimmedPrompt,
            }))
          );
          toast.success('Image generated successfully');
          setProgress(100);
          resetTaskState();
          await fetchUserCredits();
          return;
        }
      }

      setTaskId(newTaskId);
      setProgress(25);

      await fetchUserCredits();
    } catch (error: any) {
      toast.error(`Failed to generate image: ${error.message}`);
      resetTaskState();
    }
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    if (!image.url) return;

    try {
      setDownloadingImageId(image.id);
      const resp = await fetch(
        `/api/proxy/file?url=${encodeURIComponent(image.url)}`
      );
      if (!resp.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 200);
      toast.success('Image downloaded');
    } catch {
      toast.error('Failed to download image');
    } finally {
      setDownloadingImageId(null);
    }
  };

  const carouselCount = capabilityCards.length;
  const activeFeature = capabilityCards[activeWorkbenchFeature];
  const goPrev = () =>
    setActiveWorkbenchFeature((i) => (i - 1 + carouselCount) % carouselCount);
  const goNext = () =>
    setActiveWorkbenchFeature((i) => (i + 1) % carouselCount);

  const startDisabled =
    isGenerating ||
    !prompt.trim() ||
    isPromptOverLimit ||
    isReferenceUploading ||
    hasReferenceUploadError ||
    (isImageEditMode && referenceImageUrls.length === 0);

  return (
    <div className="mt-9">
      {/* Promo card — 仅未登录用户可见 */}
      {!user && (
        <div className="mx-auto max-w-[1280px]">
          <div
            className={`flex flex-col items-start gap-4 rounded-2xl border ${theme.promoBorder} ${theme.promoBg} p-4 shadow-[0_0_60px_-28px_rgba(34,211,238,0.45)] sm:flex-row sm:items-center sm:justify-between md:p-5`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex size-10 items-center justify-center rounded-xl border ${theme.promoIcon}`}
              >
                <Gift className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white sm:text-base">
                  {workbench.promoCard.title}
                </h3>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-zinc-400 sm:text-sm">
                  {workbench.promoCard.subtitle}
                </p>
              </div>
            </div>
            <Link
              href={workbench.promoCard.href}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold transition ${theme.primaryButton}`}
            >
              {workbench.promoCard.cta}
              <Sparkles className="size-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Workbench card */}
      <div
        className={`mx-auto mt-7 grid max-w-[1280px] overflow-hidden rounded-[22px] border border-emerald-100 bg-white shadow-2xl ${theme.panelGlow} backdrop-blur dark:border-white/10 dark:bg-[#17181D] lg:grid-cols-[minmax(440px,0.38fr)_minmax(0,0.62fr)]`}
      >
        {/* LEFT: form */}
        <div className="border-b border-emerald-100 bg-white p-4 dark:border-white/10 dark:bg-[#17181D] md:p-6 lg:border-r lg:border-b-0">
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl border border-emerald-100 bg-emerald-50/70 p-1 text-slate-500 dark:border-white/10 dark:bg-[#111827] dark:text-zinc-400">
              <TabsTrigger
                value="image-to-image"
                className={`gap-1.5 rounded-lg text-xs font-semibold sm:text-sm ${theme.activeTab}`}
              >
                <Pencil className="size-3.5" />
                Image Edit
              </TabsTrigger>
              <TabsTrigger
                value="text-to-image"
                className={`gap-1.5 rounded-lg text-xs font-semibold sm:text-sm ${theme.activeTab}`}
              >
                <Wand2 className="size-3.5" />
                Text-to-Image
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                Select Model
              </label>
              <a
                href="#comparison"
                className="text-[11px] font-bold text-cyan-600 hover:text-emerald-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                Compare →
              </a>
            </div>
            <div className="mt-2 grid gap-2">
              {MODEL_OPTIONS.map((opt) => {
                const isActive = opt.key === modelKey;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setModelKey(opt.key)}
                    className={`flex min-h-[68px] items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                      isActive
                        ? theme.activeModel
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-white/10 dark:bg-[#0B0D12] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-base dark:bg-white/10">
                      {opt.emoji}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm leading-tight font-bold text-slate-950 dark:text-white">
                        {opt.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 dark:text-zinc-400">
                        {opt.tagline}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {isImageEditMode && (
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                  Reference Images
                </label>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Required for editing
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <ImageUploader
                  allowMultiple
                  maxImages={5}
                  maxSizeMB={30}
                  defaultPreviews={referenceImageUrls}
                  emptyHint=""
                  uploadLabel="Add Image"
                  uploadSubLabel="Max 30MB"
                  onChange={handleReferenceImagesChange}
                  className="w-full [&_.group]:w-full [&_.group]:rounded-2xl [&_.group]:border-emerald-100 [&_.group]:bg-emerald-50/55 [&_.group]:p-0 [&_.group]:shadow-none [&_.group]:hover:border-cyan-300/60 dark:[&_.group]:border-white/15 dark:[&_.group]:bg-[#080B10] [&_button]:h-[118px] [&_button]:w-full [&_button]:gap-2.5 [&_button]:px-3 [&_button]:text-center [&_button_div]:h-11 [&_button_div]:w-11 [&_button_div]:border-emerald-200 dark:[&_button_div]:border-white/30 [&_button_svg]:h-5 [&_button_svg]:w-5 [&_button_svg]:text-cyan-500 dark:[&_button_svg]:text-cyan-300 [&_img]:h-[118px] [&_img]:w-full [&_img]:rounded-2xl [&_span]:leading-none [&_span]:text-slate-700 dark:[&_span]:text-zinc-300 [&_span:first-of-type]:text-[13px] [&_span:first-of-type]:font-bold [&_span:last-child]:text-[11px] [&_span:last-child]:font-medium [&_span:last-child]:text-slate-500 dark:[&_span:last-child]:text-zinc-500 [&>div:last-child]:grid [&>div:last-child]:grid-cols-1 [&>div:last-child]:gap-3"
                />
                <button
                  type="button"
                  onClick={() =>
                    toast.message(
                      'Library picker will be connected after launch.'
                    )
                  }
                  className="flex h-[118px] w-full flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/55 px-3 text-center transition hover:border-cyan-300/60 hover:bg-cyan-50/60 dark:border-white/15 dark:bg-[#080B10] dark:hover:bg-white/[0.04]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-emerald-200 dark:border-white/30">
                    <Images className="size-5 text-cyan-500 dark:text-cyan-300" />
                  </span>
                  <span className="text-[13px] leading-none font-bold text-slate-800 dark:text-zinc-300">
                    From Library
                  </span>
                  <span className="text-[11px] leading-none font-medium text-slate-500 dark:text-zinc-500">
                    Saved refs
                  </span>
                </button>
              </div>
              {hasReferenceUploadError && (
                <p className="mt-2 text-xs text-rose-400">
                  Some images failed to upload. Please remove and try again.
                </p>
              )}
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="wb-prompt"
                className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400"
              >
                Describe your idea
              </label>
              <span
                className={`text-[11px] tabular-nums ${
                  isPromptOverLimit
                    ? 'text-rose-500 dark:text-rose-400'
                    : 'text-slate-500 dark:text-zinc-500'
                }`}
              >
                {promptLength}/{MAX_PROMPT_LENGTH}
              </span>
            </div>
            <Textarea
              id="wb-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              placeholder="Describe the effect you want, including style, color, composition and other details..."
              className={`mt-2 min-h-[154px] resize-none rounded-xl border-emerald-100 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-inner shadow-emerald-100/70 placeholder:text-slate-400 dark:border-[#252832] dark:bg-[#050507] dark:text-zinc-200 dark:shadow-black/30 dark:placeholder:text-zinc-600 focus-visible:ring-2 ${theme.focusRing} ${
                isPromptOverLimit ? 'border-rose-500/60' : ''
              }`}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-500 dark:text-zinc-500">
                Detailed descriptions lead to better results
              </p>
              <a
                href="#prompts"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-cyan-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.07]"
              >
                <Sparkles className="size-3.5 text-cyan-500 dark:text-cyan-300" />
                Browse Inspiration
              </a>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                Aspect Ratio
              </label>
              <Select
                value={aspectRatio}
                onValueChange={(v) => setAspectRatio(v)}
              >
                <SelectTrigger className="mt-2 w-full rounded-xl border-emerald-100 bg-white text-slate-700 hover:bg-emerald-50/60 dark:border-white/10 dark:bg-[#0B0D12] dark:text-zinc-200 dark:hover:bg-white/[0.04] [&>span]:min-w-0 [&>span]:truncate">
                  <span className="flex items-center gap-2">
                    {aspectRatio === 'auto' && (
                      <span className="inline-flex size-3 rounded-sm bg-emerald-400" />
                    )}
                    <SelectValue placeholder="Auto" />
                  </span>
                </SelectTrigger>
                <SelectContent className="border-emerald-100 bg-white text-slate-700 dark:border-white/10 dark:bg-[#101218] dark:text-zinc-200">
                  {ASPECT_RATIO_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="focus:bg-emerald-50 dark:focus:bg-white/10"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                Resolution
              </label>
              <Select
                value={resolution}
                onValueChange={(v) => setResolution(v as ResolutionTier)}
              >
                <SelectTrigger className="mt-2 w-full rounded-xl border-emerald-100 bg-white text-slate-700 hover:bg-emerald-50/60 dark:border-white/10 dark:bg-[#0B0D12] dark:text-zinc-200 dark:hover:bg-white/[0.04] [&>span]:min-w-0 [&>span]:truncate">
                  <span className="flex items-center gap-2">
                    <Monitor className="size-3.5 text-slate-400 dark:text-zinc-400" />
                    <SelectValue placeholder="2K" />
                  </span>
                </SelectTrigger>
                <SelectContent className="border-emerald-100 bg-white text-slate-700 dark:border-white/10 dark:bg-[#101218] dark:text-zinc-200">
                  {RESOLUTION_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="focus:bg-emerald-50 dark:focus:bg-white/10"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
              Output Count
            </label>
            <Select
              value={String(outputCount)}
              onValueChange={(v) => setOutputCount(Number(v) as OutputCount)}
            >
              <SelectTrigger className="mt-2 w-full rounded-xl border-emerald-100 bg-white text-slate-700 hover:bg-emerald-50/60 dark:border-white/10 dark:bg-[#0B0D12] dark:text-zinc-200 dark:hover:bg-white/[0.04] [&>span]:min-w-0 [&>span]:truncate">
                <span className="flex items-center gap-2">
                  <Images className="size-3.5 text-slate-400 dark:text-zinc-400" />
                  <SelectValue placeholder="1" />
                </span>
              </SelectTrigger>
              <SelectContent className="border-emerald-100 bg-white text-slate-700 dark:border-white/10 dark:bg-[#101218] dark:text-zinc-200">
                {OUTPUT_COUNT_OPTIONS.map((n) => (
                  <SelectItem
                    key={n}
                    value={String(n)}
                    className="focus:bg-emerald-50 dark:focus:bg-white/10"
                  >
                    {n} {n === 1 ? 'image' : 'images'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            className={`mt-5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${theme.costPanel}`}
          >
            <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-zinc-300">
              <span className="inline-flex size-2 rounded-full bg-emerald-400" />
              Credit Cost
            </span>
            <span className={`font-black tabular-nums ${theme.costText}`}>
              {costCredits} {costCredits === 1 ? 'credit' : 'credits'}
            </span>
          </div>

          <div className="mt-5">
            {!isMounted ? (
              <Button
                size="lg"
                className={`h-14 w-full rounded-xl text-base font-black ${theme.primaryButton}`}
                disabled
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Start Creation
              </Button>
            ) : isCheckSign ? (
              <Button
                size="lg"
                className={`h-14 w-full rounded-xl text-base font-black ${theme.primaryButton}`}
                disabled
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking account
              </Button>
            ) : !user ? (
              <Button
                size="lg"
                className={`h-14 w-full rounded-xl text-base font-black ${theme.primaryButton}`}
                onClick={() => setIsShowSignModal(true)}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Sign in to start
              </Button>
            ) : remainingCredits < costCredits ? (
              <Link
                href="/pricing"
                className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-black transition ${theme.primaryButton}`}
              >
                <Wand2 className="size-4" />
                Top up credits to continue
              </Link>
            ) : (
              <Button
                size="lg"
                className={`h-14 w-full rounded-xl text-base font-black disabled:opacity-60 ${theme.primaryButton}`}
                onClick={handleGenerate}
                disabled={startDisabled}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Start Creation
                    <span className="ml-2 inline-flex items-center rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-black tabular-nums text-zinc-950">
                      {costCredits}
                    </span>
                  </>
                )}
              </Button>
            )}

            {isMounted && user && (
              <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-zinc-500">
                Remaining credits: {remainingCredits}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: carousel / progress / results */}
        <div className="bg-emerald-50/55 p-3 dark:bg-[#111318] md:p-5">
          {generatedImages.length > 0 ? (
            <ResultsPanel
              images={generatedImages}
              downloadingImageId={downloadingImageId}
              onDownload={handleDownloadImage}
            />
          ) : isGenerating ? (
            <ProgressPanel progress={progress} statusLabel={taskStatusLabel} />
          ) : (
            <CarouselPanel
              variant={variant}
              theme={theme}
              activeIndex={activeWorkbenchFeature}
              onPrev={goPrev}
              onNext={goNext}
              onSelect={setActiveWorkbenchFeature}
              activeFeature={activeFeature}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CarouselPanel({
  variant,
  theme,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
  activeFeature,
}: {
  variant: WorkbenchVariant;
  theme: WorkbenchTheme;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  activeFeature: (typeof capabilityCards)[number];
}) {
  return (
    <div className="relative h-full min-h-[560px] lg:min-h-[700px]">
      <div className="relative h-full min-h-[560px] overflow-hidden rounded-[18px] border border-emerald-100 bg-white lg:min-h-[700px] dark:border-white/10 dark:bg-[#0B0D12]">
        <Image
          src={activeFeature.image}
          alt={activeFeature.alt}
          fill
          priority={activeIndex === 0}
          sizes="(min-width: 1024px) 700px, 100vw"
          className="object-cover object-top"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_55%,rgba(255,255,255,0.64)_82%,rgba(236,253,245,0.97)_100%)] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_60%,rgba(0,0,0,0.55)_82%,rgba(0,0,0,0.92)_100%)]" />

        <div className="pointer-events-none absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black tracking-widest uppercase backdrop-blur ${theme.featurePill}`}
          >
            <Sparkles className="size-3" />
            {variant === 'studio'
              ? 'New · GPT Image 2 Studio'
              : 'New · GPT Image 2'}
          </span>
        </div>

        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous slide"
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-emerald-100 bg-white/88 p-3 text-slate-700 shadow-lg backdrop-blur transition hover:bg-emerald-50 dark:border-white/15 dark:bg-black/55 dark:text-white dark:hover:bg-black/75"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next slide"
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full border border-emerald-100 bg-white/88 p-3 text-slate-700 shadow-lg backdrop-blur transition hover:bg-emerald-50 dark:border-white/15 dark:bg-black/55 dark:text-white dark:hover:bg-black/75"
        >
          <ChevronRight className="size-4" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-5 pb-12 md:p-8 md:pb-14">
          <h3 className="max-w-xl text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
            {activeFeature.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-zinc-200 md:text-base">
            {activeFeature.copy}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
          {capabilityCards.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Slide ${i + 1}: ${c.title}`}
              aria-current={i === activeIndex}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex
                  ? `w-9 ${theme.dot}`
                  : 'w-2 bg-emerald-200 hover:bg-emerald-300 dark:bg-white/35 dark:hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressPanel({
  progress,
  statusLabel,
}: {
  progress: number;
  statusLabel: string;
}) {
  return (
    <div className="flex h-full min-h-[560px] flex-col items-center justify-center gap-4 rounded-[18px] border border-emerald-100 bg-white p-6 dark:border-white/10 dark:bg-[#0B0D12] lg:min-h-[700px]">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
        <Loader2 className="size-6 animate-spin" />
      </span>
      <div className="w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>Progress</span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <Progress value={progress} className="bg-emerald-100 dark:bg-white/10" />
        {statusLabel && (
          <p className="text-center text-xs text-slate-500 dark:text-zinc-500">{statusLabel}</p>
        )}
      </div>
    </div>
  );
}

function ResultsPanel({
  images,
  downloadingImageId,
  onDownload,
}: {
  images: GeneratedImage[];
  downloadingImageId: string | null;
  onDownload: (image: GeneratedImage) => void;
}) {
  if (images.length === 0) {
    return (
      <div className="flex h-full min-h-[560px] flex-col items-center justify-center rounded-[18px] border border-emerald-100 bg-white p-6 text-center dark:border-white/10 dark:bg-[#0B0D12] lg:min-h-[700px]">
        <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-white/5 dark:text-zinc-400">
          <ImageIcon className="size-6" />
        </span>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          No images yet
        </p>
      </div>
    );
  }

  const single = images.length === 1;

  // Single image: center within panel using flex; image keeps native
  // aspect ratio via object-contain, never overflows panel height.
  // Works for 16:9 / 1:1 / 9:16 / 4:3 / 3:4: tall images get side gutters,
  // wide images get top/bottom gutters — always centered.
  if (single) {
    const image = images[0];
    return (
      <div className="flex h-full min-h-[560px] items-center justify-center rounded-[18px] border border-emerald-100 bg-white p-3 dark:border-white/10 dark:bg-[#0B0D12] lg:min-h-[700px]">
        <div className="group relative inline-flex max-h-full max-w-full overflow-hidden rounded-[14px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.prompt || 'Generated image'}
            className="block max-h-full max-w-full rounded-[14px] object-contain"
            loading="lazy"
          />
          <button
            type="button"
            onClick={() => onDownload(image)}
            disabled={downloadingImageId === image.id}
            className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur transition hover:bg-emerald-50 disabled:opacity-60 dark:border-white/15 dark:bg-black/65 dark:text-white dark:hover:bg-black/80"
          >
            {downloadingImageId === image.id ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            Download
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative overflow-hidden rounded-[18px] border border-emerald-100 bg-white dark:border-white/10 dark:bg-[#0B0D12]"
        >
          <div className="relative aspect-square w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.prompt || 'Generated image'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <button
            type="button"
            onClick={() => onDownload(image)}
            disabled={downloadingImageId === image.id}
            className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur transition hover:bg-emerald-50 disabled:opacity-60 dark:border-white/15 dark:bg-black/65 dark:text-white dark:hover:bg-black/80"
          >
            {downloadingImageId === image.id ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            Download
          </button>
        </div>
      ))}
    </div>
  );
}
