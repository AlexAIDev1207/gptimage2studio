'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageOff, Loader2, LogIn } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

export type HistoryImage = {
  taskId: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

type LoadState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'unauth' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; images: HistoryImage[] };

export function HistoryPickerDialog({
  open,
  onOpenChange,
  onSelect,
  isLoggedIn,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (image: HistoryImage) => void;
  isLoggedIn: boolean;
}) {
  const [state, setState] = useState<LoadState>({ kind: 'idle' });

  useEffect(() => {
    if (!open) return;
    if (!isLoggedIn) {
      setState({ kind: 'unauth' });
      return;
    }

    let cancelled = false;
    setState({ kind: 'loading' });

    (async () => {
      try {
        const resp = await fetch('/api/ai/list-image-history', {
          method: 'POST',
        });
        const json = (await resp.json()) as {
          code: number;
          message: string;
          data?: { images: HistoryImage[] };
        };
        if (cancelled) return;
        if (json.code === 0 && json.data?.images) {
          setState({ kind: 'ready', images: json.data.images });
        } else if (json.message?.toLowerCase().includes('no auth')) {
          setState({ kind: 'unauth' });
        } else {
          setState({
            kind: 'error',
            message: json.message || 'Failed to load history',
          });
        }
      } catch (e) {
        if (cancelled) return;
        setState({
          kind: 'error',
          message: 'Network error, please try again',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, isLoggedIn]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-white/10 bg-[#0B0D12] p-0 text-white sm:max-w-3xl">
        <DialogHeader className="border-b border-white/10 px-6 py-4">
          <DialogTitle className="text-base font-semibold text-white">
            Select from History
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] min-h-[280px] overflow-y-auto px-6 py-6">
          {state.kind === 'loading' && (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-zinc-400">
              <Loader2 className="size-7 animate-spin" />
              <p className="text-sm">Loading your history…</p>
            </div>
          )}

          {state.kind === 'unauth' && (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-zinc-400">
              <span className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <LogIn className="size-6" />
              </span>
              <p className="text-sm">Sign in to view your generation history</p>
            </div>
          )}

          {state.kind === 'error' && (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-zinc-400">
              <span className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <ImageOff className="size-6" />
              </span>
              <p className="text-sm">{state.message}</p>
            </div>
          )}

          {state.kind === 'ready' && state.images.length === 0 && (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-zinc-400">
              <span className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <ImageOff className="size-6" />
              </span>
              <p className="text-sm">No completed generations yet</p>
            </div>
          )}

          {state.kind === 'ready' && state.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {state.images.map((img) => (
                <button
                  key={`${img.taskId}-${img.imageUrl}`}
                  type="button"
                  onClick={() => {
                    onSelect(img);
                    onOpenChange(false);
                  }}
                  title={img.prompt || undefined}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/40 transition hover:border-emerald-400/60 focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:outline-none"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.prompt || 'Generated image'}
                    fill
                    sizes="(min-width: 768px) 180px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 py-1.5 text-left text-[10px] font-medium text-white/80 opacity-0 transition group-hover:opacity-100">
                    Use as reference
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
