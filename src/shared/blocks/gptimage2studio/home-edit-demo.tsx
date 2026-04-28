'use client';

import Image from 'next/image';
import { useState } from 'react';

import { editDemos } from './content';
import type { HomePalette } from './home-theme';
import { SectionEyebrow } from './section-eyebrow';

export function HomeEditDemo({
  palette,
}: {
  palette: HomePalette;
}) {
  const [activeEditDemo, setActiveEditDemo] = useState(0);
  const activeEdit = editDemos[activeEditDemo];

  return (
    <section
      className="border-b border-white/5"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '980px' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <div className="flex flex-col items-center text-center">
          <SectionEyebrow badgeTextClassName={palette.badgeText}>
            Editing
          </SectionEyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
            Edit Images with GPT Image 2
          </h2>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Upload an image, describe the change. The Studio handles the rest.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {editDemos.map((demo, index) => (
            <button
              key={demo.title}
              type="button"
              onClick={() => setActiveEditDemo(index)}
              aria-pressed={activeEditDemo === index}
              className={`min-h-11 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                activeEditDemo === index
                  ? `border-transparent bg-gradient-to-r ${palette.accent} text-zinc-950`
                  : 'border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10'
              }`}
            >
              {demo.title}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101218] shadow-2xl shadow-black/40">
          <div className="relative aspect-[16/9] w-full">
            <Image
              key={activeEdit.title}
              src={activeEdit.image}
              alt={activeEdit.title}
              fill
              sizes="(min-width: 1024px) 1100px, 100vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
          <div className="border-t border-white/10 bg-[#0B0D12] p-5 md:p-6">
            <div className="rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-zinc-200">
              {activeEdit.prompt}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
