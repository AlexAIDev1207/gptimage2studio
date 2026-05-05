'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, Copy, Wand2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale } from 'next-intl';

import {
  applyArguments,
  extractArguments,
  getCluster,
  TIER_STYLE,
  type PromptArgument,
  type PromptItem,
} from './clusters-helpers';

const PENDING_PROMPT_STORAGE_KEY = 'gptimage2studio:pending-prompt';

type PromptMode = 'text-to-image' | 'image-to-image';

function getResolution(prompt: PromptItem): string {
  return prompt.estimated_credits >= 10 ? '2K' : '1K';
}

export function ClusterPromptDialog({
  prompt,
  clusterSlug,
  onClose,
}: {
  prompt: PromptItem | null;
  clusterSlug: string;
  onClose: () => void;
}) {
  const locale = useLocale();
  const cluster = useMemo(() => getCluster(clusterSlug), [clusterSlug]);
  const tier = cluster?.spec.tier ?? 'commercial';
  const tierStyle = TIER_STYLE[tier];

  const args = useMemo<PromptArgument[]>(
    () => (prompt ? extractArguments(prompt.final_prompt) : []),
    [prompt],
  );
  const [argValues, setArgValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // 重置表单
  useEffect(() => {
    if (!prompt) return;
    const init: Record<string, string> = {};
    for (const arg of args) {
      init[arg.name] = arg.default;
    }
    setArgValues(init);
    setCopied(false);
  }, [prompt, args]);

  // ESC 关闭
  useEffect(() => {
    if (!prompt) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prompt, onClose]);

  // body scroll lock
  useEffect(() => {
    if (!prompt) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [prompt]);

  if (!prompt) return null;

  const resolvedPrompt = applyArguments(prompt.final_prompt, argValues);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedPrompt);
      setCopied(true);
      toast.success('Prompt copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Unable to copy prompt');
    }
  };

  const handleUseInWorkbench = () => {
    const mode: PromptMode = prompt.input_image_required
      ? 'image-to-image'
      : 'text-to-image';
    const detail = {
      prompt: resolvedPrompt,
      mode,
      modelKey: 'gpt-image-2',
      // 可选 reference 图：如果是 image-to-image 模式，把示例图作为参考
      referenceImage: prompt.input_image_required
        ? new URL(prompt.final_image_url, window.location.origin).toString()
        : undefined,
    };

    window.sessionStorage.setItem(
      PENDING_PROMPT_STORAGE_KEY,
      JSON.stringify(detail),
    );
    const workbenchHref =
      locale === 'en' ? '/#workbench' : `/${locale}/#workbench`;
    window.location.href = workbenchHref;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-4 backdrop-blur-sm sm:px-6"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#15161B] text-zinc-100 shadow-2xl shadow-black/70 md:h-[calc(100vh-5rem)] md:max-h-[820px] md:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
          aria-label="Close"
        >
          <X className="size-6" />
        </button>

        {/* 左：大图，object-contain 不裁切 */}
        <div className="relative h-[42vh] min-h-[260px] bg-black md:h-full">
          {prompt.final_image_url ? (
            <Image
              src={prompt.final_image_url}
              alt={prompt.title}
              fill
              sizes="(min-width: 768px) 56vw, 100vw"
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-500">
              No preview
            </div>
          )}
          {/* 角标 */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${tierStyle.badge}`}
            >
              {tierStyle.label}
            </span>
            {prompt.sub_scene_tag && (
              <span className="inline-flex items-center rounded-full border border-white/15 bg-zinc-950/70 px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-300 backdrop-blur">
                {prompt.sub_scene_tag}
              </span>
            )}
          </div>
        </div>

        {/* 右：信息区，可滚动 */}
        <div className="flex max-h-[calc(58vh-2rem)] flex-col gap-5 overflow-y-auto p-6 md:max-h-none md:p-8">
          <div className="space-y-2 pr-10">
            <h3 className="text-xl leading-tight font-semibold text-white md:text-2xl">
              {prompt.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
              <span className="rounded-md bg-white/5 px-2 py-0.5">
                {getResolution(prompt)}
              </span>
              <span className="rounded-md bg-white/5 px-2 py-0.5">
                {prompt.estimated_credits} credits
              </span>
              <span className="rounded-md bg-white/5 px-2 py-0.5">
                {prompt.input_image_required ? 'Image-to-Image' : 'Text-to-Image'}
              </span>
              {prompt.json_template_ref && (
                <span className="rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-violet-300">
                  JSON template
                </span>
              )}
            </div>
          </div>

          {/* 参数表单 */}
          {args.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">
                  Customize ({args.length} {args.length === 1 ? 'arg' : 'args'})
                </h4>
                <span className="text-[10px] tracking-wider text-zinc-500 uppercase">
                  {'{argument}'} live preview
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {args.map((arg) => (
                  <label key={arg.name} className="block">
                    <span className="mb-1 block text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                      {arg.name}
                    </span>
                    <input
                      type="text"
                      value={argValues[arg.name] ?? ''}
                      onChange={(e) =>
                        setArgValues((v) => ({
                          ...v,
                          [arg.name]: e.target.value,
                        }))
                      }
                      placeholder={arg.default}
                      className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Prompt 文本，flex 拉伸到底部填满剩余空间 */}
          <div className="flex min-h-[280px] flex-1 flex-col">
            <h4 className="mb-2 text-sm font-semibold text-white">Prompt</h4>
            <div className="flex-1 overflow-y-auto rounded-lg border border-white/10 bg-zinc-950/80 p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-zinc-300">
              {resolvedPrompt}
            </div>
          </div>

          {/* CTA 区 */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy Prompt
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleUseInWorkbench}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              <Wand2 className="size-4" />
              Try in Workbench
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
