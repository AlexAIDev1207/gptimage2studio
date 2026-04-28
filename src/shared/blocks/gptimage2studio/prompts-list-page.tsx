'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

import { promptCards, type PromptCard } from './content';
import { PromptCardsMasonry } from './prompt-cards-masonry';
import { PromptDetailDialog } from './prompt-detail-dialog';
import { GptImageStudioSiteFooter } from './site-footer';
import { GptImageStudioSiteHeader } from './site-header';

type PromptMode = 'text-to-image' | 'image-to-image';

const PENDING_PROMPT_STORAGE_KEY = 'gptimage2studio:pending-prompt';

function getReferenceImage(card: PromptCard, mode: PromptMode) {
  if (mode !== 'image-to-image') return undefined;
  return new URL(card.image, window.location.origin).toString();
}

export default function PromptsListPageClient() {
  const locale = useLocale();
  const [selectedPrompt, setSelectedPrompt] = useState<PromptCard | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const workbenchHref = locale === 'en' ? '/#workbench' : `/${locale}/#workbench`;

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
    window.location.href = workbenchHref;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#09090B] dark:text-zinc-200">
      <GptImageStudioSiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-[11px] font-semibold tracking-widest text-slate-500 uppercase dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            Prompt Library
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
            All GPT Image 2 Prompts
          </h1>
          <p className="mt-4 text-slate-600 dark:text-zinc-400">
            Click any prompt to preview the full structured brief in place, copy
            it, or load it into the homepage workbench.
          </p>
        </div>

        <PromptCardsMasonry
          cards={promptCards}
          copied={copied}
          copyKeyPrefix="prompts-page"
          onOpen={setSelectedPrompt}
          onCopy={handleCopy}
        />
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
      <GptImageStudioSiteFooter />
    </main>
  );
}
