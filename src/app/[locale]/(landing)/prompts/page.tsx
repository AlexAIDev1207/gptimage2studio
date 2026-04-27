import Image from 'next/image';
import Link from 'next/link';

import { promptCards } from '@/shared/blocks/gptimage2studio/content';

export const metadata = {
  title: 'Prompts Library | GPT Image 2 Studio',
  description:
    'Browse the GPT Image 2 Studio prompt library — product photos, posters, social ads, UI mockups, infographics, and more. Click any card to see the full prompt and load it into the workbench.',
};

export default function PromptsListPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-200">
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-zinc-400">
            Prompt Library
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            All GPT Image 2 Prompts
          </h1>
          <p className="mt-4 text-zinc-400">
            Click any prompt to see the full structured brief, copy it, or send
            it directly to the workbench as a text prompt or reference image.
          </p>
        </div>

        <div className="mt-10 columns-1 gap-3 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4">
          {promptCards.map((card) => (
            <figure
              key={card.title}
              className="group relative mb-3 inline-block w-full break-inside-avoid overflow-hidden rounded-lg bg-[#101218] transition"
            >
              <Link
                href={card.href}
                aria-label={`Open prompt: ${card.title}`}
                className="block outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
              </Link>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
