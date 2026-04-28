'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Check, Copy, Image as ImageIcon, Wand2, X } from 'lucide-react';
import { useTheme } from 'next-themes';

import { type PromptCard } from './content';

export function PromptDetailDialog({
  card,
  copied,
  onClose,
  onCopy,
  onUsePrompt,
  onUseReference,
}: {
  card: PromptCard;
  copied: string | null;
  onClose: () => void;
  onCopy: (text: string, key: string) => void;
  onUsePrompt: (card: PromptCard) => void;
  onUseReference: (card: PromptCard) => void;
}) {
  const copyKey = `dialog-${card.title}`;
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-dialog-title"
      className={
        isLightTheme
          ? 'fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-3 py-4 backdrop-blur-sm sm:px-6'
          : 'fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-sm sm:px-6'
      }
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={
          isLightTheme
            ? 'relative grid max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfffe_45%,#f0fdf4_100%)] shadow-[0_28px_80px_-46px_rgba(15,23,42,0.32)] md:h-[calc(100vh-5rem)] md:max-h-[820px] md:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]'
            : 'relative grid max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#15161B] shadow-2xl shadow-black/70 md:h-[calc(100vh-5rem)] md:max-h-[820px] md:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]'
        }
      >
        <button
          type="button"
          aria-label="Close prompt details"
          onClick={onClose}
          className={
            isLightTheme
              ? 'absolute top-4 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
              : 'absolute top-4 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
          }
        >
          <X className="size-6" />
        </button>

        <div
          className={
            isLightTheme
              ? 'relative h-[42vh] min-h-[260px] bg-slate-100 md:h-full md:border-r md:border-slate-200/80'
              : 'relative h-[42vh] min-h-[260px] bg-black md:h-full'
          }
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(min-width: 768px) 56vw, 100vw"
            className="object-contain"
            priority
          />
        </div>

        <div
          className={
            isLightTheme
              ? 'flex max-h-[calc(58vh-2rem)] flex-col overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,255,252,0.98)_100%)] px-5 py-6 sm:px-8 md:max-h-none md:px-10 md:py-12'
              : 'flex max-h-[calc(58vh-2rem)] flex-col overflow-y-auto px-5 py-6 sm:px-8 md:max-h-none md:px-10 md:py-12'
          }
        >
          <div className="flex flex-wrap items-center gap-3 pr-10">
            <span
              className={
                isLightTheme
                  ? 'inline-flex items-center rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm'
                  : 'inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-zinc-100'
              }
            >
              GPT Image 2 Studio
            </span>
            <span
              className={
                isLightTheme
                  ? 'inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700'
                  : 'inline-flex items-center rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300'
              }
            >
              {card.category}
            </span>
          </div>

          <h3
            id="prompt-dialog-title"
            className={
              isLightTheme
                ? 'mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-4xl'
                : 'mt-8 text-3xl font-black tracking-tight text-white md:text-4xl'
            }
          >
            {card.title}
          </h3>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p
              className={
                isLightTheme
                  ? 'text-sm font-bold tracking-[0.2em] text-slate-500 uppercase'
                  : 'text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase'
              }
            >
              Prompt
            </p>
            <button
              type="button"
              onClick={() => onCopy(card.fullPrompt, copyKey)}
              className={
                isLightTheme
                  ? 'inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
                  : 'inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
              }
            >
              {copied === copyKey ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              Copy Prompt
            </button>
          </div>

          {isLightTheme ? (
            <div className="mt-6 min-h-[220px] rounded-[24px] border border-emerald-100/80 bg-white p-5 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.16)]">
              <p className="font-mono text-base leading-8 whitespace-pre-wrap text-slate-800 md:text-lg">
                {card.fullPrompt}
              </p>
            </div>
          ) : (
            <p className="mt-6 font-mono text-base leading-8 whitespace-pre-wrap text-zinc-100 md:text-lg">
              {card.fullPrompt}
            </p>
          )}

          <div className="mt-auto grid gap-4 pt-10">
            <button
              type="button"
              onClick={() => onUsePrompt(card)}
              className={
                isLightTheme
                  ? 'inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-cyan-950/20 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
                  : 'inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-4 text-lg font-black text-zinc-950 transition hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:outline-none'
              }
            >
              <Wand2 className="size-6" />
              Use This Prompt
            </button>
            <button
              type="button"
              onClick={() => onUseReference(card)}
              className={
                isLightTheme
                  ? 'inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-5 py-4 text-base font-black text-slate-700 transition hover:bg-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
                  : 'inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-base font-black text-zinc-100 transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
              }
            >
              <ImageIcon className="size-5" />
              Use as Reference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
