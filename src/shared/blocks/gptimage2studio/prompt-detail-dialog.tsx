'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Check, Copy, Image as ImageIcon, Wand2, X } from 'lucide-react';

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
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-3 py-4 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative grid max-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#15161B] shadow-2xl shadow-black/70 md:h-[calc(100vh-5rem)] md:max-h-[820px] md:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <button
          type="button"
          aria-label="Close prompt details"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 inline-flex size-10 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
        >
          <X className="size-6" />
        </button>

        <div className="relative h-[42vh] min-h-[260px] bg-black md:h-full">
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(min-width: 768px) 56vw, 100vw"
            className="object-contain"
            priority
          />
        </div>

        <div className="flex max-h-[calc(58vh-2rem)] flex-col overflow-y-auto px-5 py-6 sm:px-8 md:max-h-none md:px-10 md:py-12">
          <div className="flex flex-wrap items-center gap-3 pr-10">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-zinc-100">
              GPT Image 2 Studio
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
              {card.category}
            </span>
          </div>

          <h3
            id="prompt-dialog-title"
            className="mt-8 text-3xl font-black tracking-tight text-white md:text-4xl"
          >
            {card.title}
          </h3>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase">
              Prompt
            </p>
            <button
              type="button"
              onClick={() => onCopy(card.fullPrompt, copyKey)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
            >
              {copied === copyKey ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              Copy Prompt
            </button>
          </div>

          <p className="mt-6 font-mono text-base leading-8 whitespace-pre-wrap text-zinc-100 md:text-lg">
            {card.fullPrompt}
          </p>

          <div className="mt-auto grid gap-4 pt-10">
            <button
              type="button"
              onClick={() => onUsePrompt(card)}
              className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-4 text-lg font-black text-zinc-950 transition hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:outline-none"
            >
              <Wand2 className="size-6" />
              Use This Prompt
            </button>
            <button
              type="button"
              onClick={() => onUseReference(card)}
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-base font-black text-zinc-100 transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
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
