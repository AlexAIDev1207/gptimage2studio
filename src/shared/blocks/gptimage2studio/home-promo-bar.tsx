'use client';

import { useState } from 'react';
import { ArrowRight, Gift, X } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

import { promoBar } from './content';

export function HomePromoBar() {
  const [promoOpen, setPromoOpen] = useState(true);

  if (!promoOpen) return null;

  return (
    <div className="relative border-b border-amber-300/70 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-zinc-950 shadow-[0_8px_24px_rgba(250,204,21,0.18)]">
      <Link
        href={promoBar.href}
        className="block pr-14 transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-zinc-950/40 focus-visible:outline-none"
      >
        <div className="mx-auto flex min-h-11 max-w-7xl items-center justify-center px-4 py-2 text-xs font-bold leading-5 sm:text-sm md:px-8">
          <span className="text-center">
            <Gift className="mr-1 inline-block size-4 align-[-3px] text-amber-800 sm:size-5" />
            {promoBar.text}{' '}
            <span className="inline-flex min-h-7 items-center gap-1 rounded-full bg-zinc-950 px-3 py-1 text-xs font-black text-amber-100 align-middle">
              {promoBar.cta}
              <ArrowRight className="size-3" />
            </span>
          </span>
        </div>
      </Link>
      <button
        type="button"
        aria-label="Close promo bar"
        onClick={() => setPromoOpen(false)}
        className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-zinc-700/70 hover:bg-zinc-950/10 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950/40 focus-visible:outline-none"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
