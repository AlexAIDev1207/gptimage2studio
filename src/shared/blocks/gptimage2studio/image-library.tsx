'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { useAppContext } from '@/shared/contexts/app';

interface ImageAsset {
  id: string;
  imageUrl: string;
  prompt?: string | null;
  model?: string | null;
  source?: string | null;
  createdAt?: string | Date | null;
}

export default function ImageLibrary() {
  const { user, setIsShowSignModal } = useAppContext();
  const [items, setItems] = useState<ImageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadImages = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const resp = await fetch('/api/images?limit=18', { cache: 'no-store' });
      const { code, data } = await resp.json();
      if (code === 0) {
        setItems(data?.items || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">Your GPT Image 2 library</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
            Sign in to save uploaded references and generated images to your
            private Cloudflare R2 library.
          </p>
          <Button className="mt-6" onClick={() => setIsShowSignModal(true)}>
            Sign in to view library
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Your image library</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Recent uploaded references and GPT Image 2 outputs stored on R2.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-white/20 bg-transparent text-white hover:bg-white/10"
          onClick={loadImages}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center text-zinc-300">
          {isLoading ? 'Loading images...' : 'No saved images yet.'}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <div className="aspect-square bg-black/30">
                <img
                  src={item.imageUrl}
                  alt={item.prompt || 'Generated image'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-violet-300">
                  {item.source || 'image'} · {item.model || 'gpt-image-2'}
                </div>
                {item.prompt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-200">
                    {item.prompt}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
