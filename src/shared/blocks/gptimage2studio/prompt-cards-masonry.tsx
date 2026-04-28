'use client';

import Image from 'next/image';
import { Check, Copy } from 'lucide-react';

import { type PromptCard } from './content';

export function PromptCardsMasonry({
  cards,
  copied,
  copyKeyPrefix,
  onOpen,
  onCopy,
}: {
  cards: PromptCard[];
  copied: string | null;
  copyKeyPrefix: string;
  onOpen: (card: PromptCard) => void;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div className="mt-10 columns-1 gap-3 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4">
      {cards.map((card) => {
        const key = `${copyKeyPrefix}-${card.title}`;

        return (
          <figure
            key={card.title}
            className="group relative mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_22px_60px_-44px_rgba(15,23,42,0.25)] transition dark:border-white/10 dark:bg-[#101218] dark:shadow-none"
          >
            <button
              type="button"
              aria-label={`Open prompt: ${card.title}`}
              onClick={() => onOpen(card)}
              className="block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
            >
              <div className="relative w-full">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-300 group-focus-within:scale-[1.02] group-hover:scale-[1.02]"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/55 to-black/5 p-4 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
                <figcaption className="translate-y-2 transition-transform duration-200 group-focus-within:translate-y-0 group-hover:translate-y-0">
                  <p className="line-clamp-1 text-sm font-semibold text-white">
                    {card.title}
                  </p>
                  <p className="mt-2 line-clamp-5 text-sm leading-5 text-zinc-100">
                    {card.fullPrompt}
                  </p>
                </figcaption>
              </div>
            </button>

            <button
              type="button"
              aria-label={`Copy prompt: ${card.title}`}
              title="Copy prompt"
              onClick={(event) => {
                event.stopPropagation();
                onCopy(card.fullPrompt, key);
              }}
              className="absolute top-2 right-2 z-10 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-slate-700 opacity-0 shadow-sm backdrop-blur transition group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100 hover:bg-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:border-white/20 dark:bg-black/70 dark:text-white dark:hover:bg-black/85 dark:focus-visible:ring-offset-black"
            >
              {copied === key ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
            </button>
          </figure>
        );
      })}
    </div>
  );
}
