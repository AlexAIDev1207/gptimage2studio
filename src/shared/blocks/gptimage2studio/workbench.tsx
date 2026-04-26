'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  ImageUploader,
  ImageUploaderValue,
} from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppContext } from '@/shared/contexts/app';

import { capabilityCards, workbench } from './content';

type Mode = 'text-to-image' | 'image-to-image';
type ResolutionTier = '1K' | '2K' | '4K';
type OutputCount = 1 | 2 | 4;

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

// Two-model dropdown. Maps to (provider, model) per scene.
type ModelKey = 'gpt-image-2' | 'nano-banana';

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
    textToImage: { provider: 'replicate', model: 'bytedance/seedream-4' },
    imageToImage: { provider: 'replicate', model: 'bytedance/seedream-4' },
  },
  {
    key: 'nano-banana',
    label: 'Nano Banana',
    tagline: 'Reference-driven editing · fast iteration',
    emoji: '🍌',
    textToImage: { provider: 'replicate', model: 'google/nano-banana-pro' },
    imageToImage: { provider: 'fal', model: 'fal-ai/nano-banana-pro/edit' },
  },
];

const ASPECT_RATIO_OPTIONS: { value: string; label: string }[] = [
  { value: 'auto', label: 'Auto · AI auto-decide' },
  { value: '1:1', label: '1:1 · Square' },
  { value: '4:5', label: '4:5 · Portrait' },
  { value: '5:4', label: '5:4 · Landscape' },
  { value: '3:4', label: '3:4 · Portrait' },
  { value: '4:3', label: '4:3 · Landscape' },
  { value: '16:9', label: '16:9 · Widescreen' },
  { value: '9:16', label: '9:16 · Vertical' },
  { value: '3:2', label: '3:2 · Photo' },
  { value: '2:3', label: '2:3 · Photo Portrait' },
  { value: '21:9', label: '21:9 · Cinematic' },
];

const RESOLUTION_OPTIONS: {
  value: ResolutionTier;
  label: string;
  multiplier: number;
}[] = [
  { value: '1K', label: '1K (1024 × 1024)', multiplier: 1 },
  { value: '2K', label: '2K (2048 × 2048)', multiplier: 2 },
  { value: '4K', label: '4K (4096 × 4096)', multiplier: 4 },
];

const OUTPUT_COUNT_OPTIONS: OutputCount[] = [1, 2, 4];

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

export default function Workbench() {
  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } =
    useAppContext();

  const [mode, setMode] = useState<Mode>('text-to-image');
  const [modelKey, setModelKey] = useState<ModelKey>('gpt-image-2');
  const [aspectRatio, setAspectRatio] = useState<string>('auto');
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
    null,
  );
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(
    null,
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
    [modelKey],
  );

  const currentMapping = useMemo(
    () =>
      isImageEditMode ? selectedModel.imageToImage : selectedModel.textToImage,
    [isImageEditMode, selectedModel],
  );

  const isReferenceUploading = useMemo(
    () => referenceImageItems.some((item) => item.status === 'uploading'),
    [referenceImageItems],
  );

  const hasReferenceUploadError = useMemo(
    () => referenceImageItems.some((item) => item.status === 'error'),
    [referenceImageItems],
  );

  const baseCost = isImageEditMode ? 4 : 2;
  const resolutionMultiplier =
    RESOLUTION_OPTIONS.find((r) => r.value === resolution)?.multiplier ?? 1;
  const costCredits = baseCost * resolutionMultiplier * outputCount;

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
    [],
  );

  const resetTaskState = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setTaskId(null);
    setGenerationStartTime(null);
    setTaskStatus(null);
  }, []);

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
              })),
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
              })),
            );
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
    [generationStartTime, resetTaskState, fetchUserCredits],
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

    if (remainingCredits < baseCost) {
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
        image_size: resolution,
        num_images: outputCount,
      };

      if (aspectRatio !== 'auto') {
        options.aspect_ratio = aspectRatio;
      }

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
            })),
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
        `/api/proxy/file?url=${encodeURIComponent(image.url)}`,
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
    <div className="mt-10">
      {/* Promo card */}
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/[0.06] p-4 shadow-[0_0_40px_-20px_rgba(16,185,129,0.6)] sm:flex-row sm:items-center sm:justify-between md:p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-300">
              <Gift className="size-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white sm:text-base">
                Get 20 Free Credits &amp; Try Pro
              </h3>
              <p className="mt-0.5 text-xs text-emerald-200/80 sm:text-sm">
                New accounts unlock 20 credits to test Pro features today.
              </p>
            </div>
          </div>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Sign Up Free
          </a>
        </div>
      </div>

      {/* Workbench card */}
      <div className="mt-6 grid overflow-hidden rounded-3xl border border-white/10 bg-[#101218]/90 shadow-2xl shadow-black/50 backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT: form */}
        <div className="border-b border-white/10 p-4 md:p-6 lg:border-r lg:border-b-0">
          {/* Mode tabs */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-2 border-white/10 bg-[#0B0D12] p-1 text-zinc-400">
              <TabsTrigger
                value="image-to-image"
                className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Pencil className="size-3.5" />
                Image Edit
              </TabsTrigger>
              <TabsTrigger
                value="text-to-image"
                className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Wand2 className="size-3.5" />
                Text-to-Image
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Model select */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Select Model
              </label>
              <a
                href="#comparison"
                className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Compare →
              </a>
            </div>
            <Select
              value={modelKey}
              onValueChange={(v) => setModelKey(v as ModelKey)}
            >
              <SelectTrigger className="mt-2 h-auto w-full border-white/10 bg-[#0B0D12] py-2.5 text-left text-zinc-200 hover:bg-white/5">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#101218] text-zinc-200">
                {MODEL_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.key}
                    value={opt.key}
                    className="focus:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">
                        {opt.emoji}
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-white">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {opt.tagline}
                        </span>
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reference uploader (Image Edit only) */}
          {isImageEditMode && (
            <div className="mt-5">
              <label className="block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Reference Images
              </label>
              <div className="mt-2">
                <ImageUploader
                  allowMultiple
                  maxImages={5}
                  maxSizeMB={10}
                  emptyHint="Upload up to 5 reference images (PNG/JPG, max 10MB each)"
                  onChange={handleReferenceImagesChange}
                />
              </div>
              {hasReferenceUploadError && (
                <p className="mt-2 text-xs text-rose-400">
                  Some images failed to upload. Please remove and try again.
                </p>
              )}
            </div>
          )}

          {/* Prompt textarea */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="wb-prompt"
                className="block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase"
              >
                Describe your idea
              </label>
              <span
                className={`text-[11px] tabular-nums ${
                  isPromptOverLimit ? 'text-rose-400' : 'text-zinc-500'
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
              placeholder="Describe the image you want to create..."
              className={`mt-2 min-h-[150px] resize-none rounded-xl border-white/10 bg-[#0B0D12] text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-400/30 ${
                isPromptOverLimit ? 'border-rose-500/60' : ''
              }`}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-zinc-500">
                Detailed descriptions lead to better results
              </p>
              <a
                href="#prompts"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
              >
                <Sparkles className="size-3.5" />
                Browse Inspiration
              </a>
            </div>
          </div>

          {/* Aspect / Resolution / Output */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Aspect Ratio
              </label>
              <Select
                value={aspectRatio}
                onValueChange={(v) => setAspectRatio(v)}
              >
                <SelectTrigger className="mt-2 w-full border-white/10 bg-[#0B0D12] text-zinc-200 hover:bg-white/5">
                  <span className="flex items-center gap-2">
                    {aspectRatio === 'auto' && (
                      <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
                    )}
                    <SelectValue placeholder="Auto" />
                  </span>
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#101218] text-zinc-200">
                  {ASPECT_RATIO_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="focus:bg-white/10"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Resolution
              </label>
              <Select
                value={resolution}
                onValueChange={(v) => setResolution(v as ResolutionTier)}
              >
                <SelectTrigger className="mt-2 w-full border-white/10 bg-[#0B0D12] text-zinc-200 hover:bg-white/5">
                  <span className="flex items-center gap-2">
                    <Monitor className="size-3.5 text-zinc-400" />
                    <SelectValue placeholder="2K" />
                  </span>
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#101218] text-zinc-200">
                  {RESOLUTION_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="focus:bg-white/10"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Output Count
              </label>
              <Select
                value={String(outputCount)}
                onValueChange={(v) =>
                  setOutputCount(Number(v) as OutputCount)
                }
              >
                <SelectTrigger className="mt-2 w-full border-white/10 bg-[#0B0D12] text-zinc-200 hover:bg-white/5">
                  <span className="flex items-center gap-2">
                    <Images className="size-3.5 text-zinc-400" />
                    <SelectValue placeholder="1" />
                  </span>
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#101218] text-zinc-200">
                  {OUTPUT_COUNT_OPTIONS.map((n) => (
                    <SelectItem
                      key={n}
                      value={String(n)}
                      className="focus:bg-white/10"
                    >
                      {n} {n === 1 ? 'image' : 'images'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Credit cost pill */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-full border border-emerald-400/30 bg-emerald-500/[0.06] px-4 py-2 text-xs">
            <span className="font-semibold tracking-wider text-emerald-200/80 uppercase">
              Credit Cost
            </span>
            <span className="font-semibold text-emerald-200">
              {costCredits} {costCredits === 1 ? 'credit' : 'credits'}
            </span>
          </div>

          {/* Start Creation button */}
          <div className="mt-3">
            {!isMounted ? (
              <Button
                size="lg"
                className="w-full rounded-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                disabled
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Start Creation
                <span className="ml-2 inline-flex items-center rounded-full bg-zinc-950/20 px-2 py-0.5 text-[10px] font-bold tabular-nums text-zinc-900">
                  {costCredits}
                </span>
              </Button>
            ) : isCheckSign ? (
              <Button
                size="lg"
                className="w-full rounded-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                disabled
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking account
              </Button>
            ) : !user ? (
              <Button
                size="lg"
                className="w-full rounded-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                onClick={() => setIsShowSignModal(true)}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Sign in to start
              </Button>
            ) : remainingCredits < baseCost ? (
              <a
                href="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                <Wand2 className="size-4" />
                Top up credits to continue
              </a>
            ) : (
              <Button
                size="lg"
                className="w-full rounded-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
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
                    <span className="ml-2 inline-flex items-center rounded-full bg-zinc-950/20 px-2 py-0.5 text-[10px] font-bold tabular-nums text-zinc-900">
                      {costCredits}
                    </span>
                  </>
                )}
              </Button>
            )}

            {isMounted && user && (
              <p className="mt-2 text-center text-[11px] text-zinc-500">
                Remaining credits: {remainingCredits}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: carousel / progress / results */}
        <div className="bg-[#0B0D12] p-3 md:p-5">
          {generatedImages.length > 0 ? (
            <ResultsPanel
              images={generatedImages}
              downloadingImageId={downloadingImageId}
              onDownload={handleDownloadImage}
            />
          ) : isGenerating ? (
            <ProgressPanel
              progress={progress}
              statusLabel={taskStatusLabel}
            />
          ) : (
            <CarouselPanel
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
  activeIndex,
  onPrev,
  onNext,
  onSelect,
  activeFeature,
}: {
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  activeFeature: (typeof capabilityCards)[number];
}) {
  return (
    <div className="relative h-full">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101218]">
        <div className="relative aspect-[16/11] w-full">
          <Image
            src={activeFeature.image}
            alt={activeFeature.alt}
            fill
            priority={activeIndex === 0}
            sizes="(min-width: 1024px) 680px, 100vw"
            className="object-cover"
          />

          {/* NEW RELEASE pill */}
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-200 uppercase backdrop-blur">
              <Sparkles className="size-3" />
              NEW RELEASE!
            </span>
          </div>

          {/* Prev / Next chevrons */}
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous slide"
            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white backdrop-blur transition hover:bg-black/75"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next slide"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white backdrop-blur transition hover:bg-black/75"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Bottom gradient + copy */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 pb-10">
            <span className="inline-flex rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-emerald-300 uppercase backdrop-blur">
              {activeFeature.badge}
            </span>
            <h3 className="mt-2 text-xl font-bold text-white md:text-2xl">
              {activeFeature.title}
            </h3>
            <p className="mt-1 max-w-xl text-sm text-zinc-300">
              {activeFeature.copy}
            </p>
          </div>

          {/* Bottom dot indicators */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {capabilityCards.map((c, i) => (
              <button
                key={c.title}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Slide ${i + 1}: ${c.title}`}
                aria-current={i === activeIndex}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex
                    ? 'w-6 bg-emerald-400'
                    : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
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
    <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#101218] p-6">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
        <Loader2 className="size-6 animate-spin" />
      </span>
      <div className="w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Progress</span>
          <span className="tabular-nums">{progress}%</span>
        </div>
        <Progress value={progress} className="bg-white/10" />
        {statusLabel && (
          <p className="text-center text-xs text-zinc-500">{statusLabel}</p>
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
      <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#101218] p-6 text-center">
        <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-white/5 text-zinc-400">
          <ImageIcon className="size-6" />
        </span>
        <p className="text-sm text-zinc-400">No images yet</p>
      </div>
    );
  }

  const single = images.length === 1;

  return (
    <div
      className={
        single
          ? 'grid grid-cols-1 gap-3'
          : 'grid grid-cols-1 gap-3 sm:grid-cols-2'
      }
    >
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101218]"
        >
          <div className={single ? 'relative w-full' : 'relative aspect-square w-full'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.prompt || 'Generated image'}
              className={
                single ? 'h-auto w-full' : 'h-full w-full object-cover'
              }
              loading="lazy"
            />
          </div>
          <button
            type="button"
            onClick={() => onDownload(image)}
            disabled={downloadingImageId === image.id}
            className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-60"
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
