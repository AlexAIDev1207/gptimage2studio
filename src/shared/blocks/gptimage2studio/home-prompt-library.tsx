'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';

import { PromptCardsMasonry } from './prompt-cards-masonry';
import { promptCards, type PromptCard } from './content';
import type { HomePalette } from './home-theme';
import { SectionEyebrow } from './section-eyebrow';

// dialog chunk 仅在用户首次点 prompt card 时下载
type DialogProps = {
  card: PromptCard;
  copied: string | null;
  onClose: () => void;
  onCopy: (text: string, key: string) => void;
  onUsePrompt: (card: PromptCard) => void;
  onUseReference: (card: PromptCard) => void;
};
type DialogComponent = ComponentType<DialogProps>;

const PENDING_PROMPT_STORAGE_KEY = 'gptimage2studio:pending-prompt';
const INITIAL_PROMPT_COUNT = 12;
const PROMPT_BATCH_SIZE = 8;

function getReferenceImage(
  card: PromptCard,
  mode: 'text-to-image' | 'image-to-image'
) {
  if (mode !== 'image-to-image') return undefined;
  return new URL(card.image, window.location.origin).toString();
}

export function HomePromptLibrary({
  palette,
}: {
  palette: HomePalette;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptCard | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PROMPT_COUNT);
  const [PromptDetailDialog, setDialog] = useState<DialogComponent | null>(null);

  useEffect(() => {
    if (!selectedPrompt || PromptDetailDialog) return;
    let cancelled = false;
    import('./prompt-detail-dialog')
      .then((mod) => {
        if (!cancelled) {
          setDialog(() => mod.PromptDetailDialog as DialogComponent);
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[home-prompt-library] dialog import failed', err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedPrompt, PromptDetailDialog]);

  const visibleCards = promptCards.slice(0, visibleCount);
  const hasMore = visibleCount < promptCards.length;

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success('Prompt copied');
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error('Unable to copy prompt');
    }
  };

  const handleUsePrompt = (
    card: PromptCard,
    mode: 'text-to-image' | 'image-to-image'
  ) => {
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
    window.dispatchEvent(
      new CustomEvent('gptimage2studio:use-prompt', { detail })
    );
    setSelectedPrompt(null);
    document
      .getElementById('workbench')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="prompts"
      className="border-b border-white/5"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1400px' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="flex flex-col items-center text-center">
          <SectionEyebrow badgeTextClassName={palette.badgeText}>
            Prompt Library
          </SectionEyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
            GPT Image 2 Prompts for Real Projects
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-300">
            Browse prompt patterns for product photos, posters, social ads, UI
            mockups, infographics, and editable image workflows. Copy a prompt,
            adjust the details, and turn it into a reusable creative brief.
          </p>
        </div>

        <PromptCardsMasonry
          cards={visibleCards}
          copied={copied}
          copyKeyPrefix="home-prompt"
          onOpen={setSelectedPrompt}
          onCopy={handleCopy}
        />

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {hasMore && (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + PROMPT_BATCH_SIZE, promptCards.length)
                )
              }
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:outline-none"
            >
              Load More Prompts
            </button>
          )}
          <Link
            href="/prompts"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore All Prompts
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {selectedPrompt && PromptDetailDialog ? (
        <PromptDetailDialog
          card={selectedPrompt}
          copied={copied}
          onClose={() => setSelectedPrompt(null)}
          onCopy={handleCopy}
          onUsePrompt={(card) => handleUsePrompt(card, 'text-to-image')}
          onUseReference={(card) => handleUsePrompt(card, 'image-to-image')}
        />
      ) : null}
    </section>
  );
}
