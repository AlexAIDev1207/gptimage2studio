'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { promptCards, type PromptCard } from './content';
import { PromptDetailDialog } from './prompt-detail-dialog';

type PromptMode = 'text-to-image' | 'image-to-image';

const PENDING_PROMPT_STORAGE_KEY = 'gptimage2studio:pending-prompt';

function getReferenceImage(card: PromptCard, mode: PromptMode) {
  if (mode !== 'image-to-image') return undefined;
  return new URL(card.image, window.location.origin).toString();
}

export default function PromptsListPageClient() {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptCard | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success('Prompt copied');
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error('Unable to copy prompt');
    }
  };

  const handleUsePrompt = (card: PromptCard, mode: PromptMode) => {
    const detail = {
      prompt: card.fullPrompt,
      mode,
      modelKey: 'gpt-image-2',
      referenceImage: getReferenceImage(card, mode),
    };

    window.sessionStorage.setItem(
      PENDING_PROMPT_STORAGE_KEY,
      JSON.stringify(detail)
    );
    window.location.href = '/#workbench';
  };

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-200">
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">
            Prompt Library
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            All GPT Image 2 Prompts
          </h1>
          <p className="mt-4 text-zinc-400">
            Click any prompt to preview the full structured brief in place, copy
            it, or load it into the homepage workbench.
          </p>
        </div>

        <div className="mt-10 columns-1 gap-3 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4">
          {promptCards.map((card) => {
            const key = `prompts-page-${card.title}`;

            return (
              <figure
                key={card.title}
                className="group relative mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-lg bg-[#101218] transition"
              >
                <button
                  type="button"
                  aria-label={`Open prompt: ${card.title}`}
                  onClick={() => setSelectedPrompt(card)}
                  className="block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
                    handleCopy(card.fullPrompt, key);
                  }}
                  className="absolute top-2 right-2 z-10 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-black/70 text-white opacity-0 shadow-sm backdrop-blur transition group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100 hover:bg-black/85 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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
      </section>

      {selectedPrompt && (
        <PromptDetailDialog
          card={selectedPrompt}
          copied={copied}
          onClose={() => setSelectedPrompt(null)}
          onCopy={handleCopy}
          onUsePrompt={(card) => handleUsePrompt(card, 'text-to-image')}
          onUseReference={(card) => handleUsePrompt(card, 'image-to-image')}
        />
      )}
    </main>
  );
}
