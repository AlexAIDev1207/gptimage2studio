import Image from 'next/image';
import { ArrowRight, Sparkles, Type, Layers, ImageIcon } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

import {
  getAllClusters,
  groupClustersByTier,
  getClusterStats,
  getClusterCoverImage,
  getClusterUrl,
  PROMPTS_HUB_URL,
  TIER_STYLE,
  type Cluster,
  type ClusterTier,
} from './clusters-helpers';
import { GptImageStudioSiteFooter } from './site-footer';
import { GptImageStudioSiteHeader } from './site-header';
import { SectionEyebrow } from './section-eyebrow';

const WORKBENCH_HREF = '/#workbench';

const WHY_ITEMS = [
  {
    icon: Type,
    title: 'Pixel-Perfect Text Rendering',
    body: 'Posters, thumbnails, and infographics get readable headlines and labels in one shot. No more Photoshop overlays or garbled text.',
  },
  {
    icon: Layers,
    title: 'Cross-Image Consistency',
    body: 'The same character, product, or style holds across multiple panels. Build storyboards, product series, and IP characters that stay on model.',
  },
  {
    icon: ImageIcon,
    title: 'Image-to-Image Identity',
    body: 'Upload a reference photo and the model keeps the face, product SKU, or pose intact. Great for headshots, restoration, and on-model shots.',
  },
];

const HOW_TO_STEPS = [
  {
    title: 'Pick a use case',
    body: 'Browse 10 clusters covering viral trends, commercial photography, and editorial design.',
  },
  {
    title: 'Copy a prompt',
    body: 'Each card includes the full prompt, customizable arguments, and an example output.',
  },
  {
    title: 'Generate in Workbench',
    body: 'One-click pre-fills the prompt in the Workbench. Add your photo (if needed) and hit generate.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How do you write a good GPT Image 2 prompt?',
    a: 'Most templates here follow a four-part structure: subject + style/medium + composition + lighting and details. For text-heavy outputs (posters, thumbnails, infographics), wrap that structure in a JSON block so the model knows exactly which strings go where. Keep one sentence per intent, and reserve adjectives for things the model can actually render — material, mood, focal length, time of day — instead of vague aesthetic words.',
  },
  {
    q: 'How do I make text and labels readable in AI images?',
    a: "GPT Image 2's biggest leap is pixel-level text rendering, but it still needs guidance. Quote the exact strings you want (e.g. `headline: \"FROM 0 TO 10K FANS\"`), specify font weight and size hierarchy, and limit each composition to 2-3 distinct text blocks. For posters and infographics, use the JSON-format prompts in this library — they lock typography, position, and language together so the result stays legible.",
  },
  {
    q: 'How do I keep a character or face consistent across images?',
    a: 'For one-shot edits (action figure, sticker, photo restore, cinematic portrait), upload a clean front-facing reference and the model preserves identity automatically. For a recurring character across multiple frames, pin one master reference, then repeat the same identifying tokens in every prompt — hairstyle, build, distinctive accessories, signature outfit. Ambiguity is the enemy: the more deterministic your description, the tighter the consistency.',
  },
  {
    q: 'What kind of reference photo gives the best image-to-image result?',
    a: 'Front-facing, well-lit, single subject, ≥1024px on the short edge, minimal filters. Sunglasses, group shots, harsh side-light, and heavy-grain selfies all degrade identity preservation. For action-figure and sticker prompts a plain background helps; for portrait restyle, natural daylight beats studio flash. If a generation feels off-model, try a different reference before tweaking the prompt.',
  },
  {
    q: 'What is the {argument} syntax I see in some prompts?',
    a: 'Placeholders like {argument name="product name" default="laptop"} turn into editable fields when you open the prompt in Workbench. Change the value, the full prompt updates, and one template can cover dozens of variations — different brands, products, dish names, character traits — without rewriting the whole thing.',
  },
  {
    q: 'When should I use a JSON-format prompt vs plain text?',
    a: 'Pick JSON when layout, text content, or component positioning matters — posters with headlines, infographics with labeled sections, product cards, UI mockups, multi-panel storyboards. Pick plain text for single-subject scenes where the look is more important than the structure — portraits, food shots, lifestyle stickers, atmospheric photo edits. Both formats are first-class; the cluster pages call out which one fits each prompt.',
  },
];

const TIER_ORDER: ClusterTier[] = ['viral', 'commercial', 'creative'];

// 每行卡片数 = 该 tier 下 cluster 数量，正好填满一行避免空格
const GRID_BY_COUNT: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
};

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const cover = getClusterCoverImage(cluster);
  const url = getClusterUrl(cluster.spec.slug);
  const promptCount = cluster.prompts.length;

  return (
    <Link
      href={url}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 ring-1 ring-transparent transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-900/70 hover:shadow-2xl hover:ring-2 hover:ring-offset-0 hover:shadow-black/40 motion-reduce:transform-none"
    >
      {/* 封面图 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
        {cover && (
          <Image
            src={cover.url}
            alt={cluster.spec.h1}
            width={cover.width}
            height={cover.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/30 to-transparent" />
        {/* prompt 数 */}
        <span className="absolute right-3 bottom-3 rounded-md bg-zinc-950/70 px-2 py-1 text-[11px] font-medium text-zinc-200 backdrop-blur">
          {promptCount} prompts
        </span>
      </div>

      {/* 文字区 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-white md:text-lg">
          {cluster.spec.h1.replace(' for GPT Image 2', '')}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-400">
          {cluster.spec.meta_description}
        </p>
        <div className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-zinc-300 group-hover:text-white">
          View prompts
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function TierSection({
  tier,
  clusters,
}: {
  tier: ClusterTier;
  clusters: Cluster[];
}) {
  if (clusters.length === 0) return null;
  const style = TIER_STYLE[tier];
  const gridClass = GRID_BY_COUNT[clusters.length] ?? GRID_BY_COUNT[4];
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wider uppercase ${style.badge}`}
        >
          <span className="size-1.5 animate-pulse rounded-full bg-current" />
          {style.label}
        </span>
        <span className="text-sm text-zinc-500">
          {clusters.length} cluster{clusters.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className={`grid gap-4 ${gridClass}`}>
        {clusters.map((cluster) => (
          <ClusterCard key={cluster.spec.slug} cluster={cluster} />
        ))}
      </div>
    </section>
  );
}

export function ClustersOverviewPage() {
  const stats = getClusterStats();
  const byTier = groupClustersByTier();

  return (
    <div className="gpt-studio-page min-h-screen bg-[#09090B] text-zinc-200 antialiased selection:bg-cyan-400/30 selection:text-white">
      <GptImageStudioSiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-cyan-500/15 opacity-60 blur-[140px]" />
          <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 md:px-8 md:pt-20 md:pb-24">
            <div className="mx-auto max-w-3xl text-center">
              <SectionEyebrow badgeTextClassName="text-cyan-300">
                <Sparkles className="size-3" />
                Prompt Library
              </SectionEyebrow>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  GPT Image 2 Prompts
                </span>
                <br />
                <span className="text-3xl text-zinc-200 sm:text-4xl md:text-5xl">
                  {stats.totalPrompts} Tested Templates Across {stats.totalClusters} Use Cases
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-300 md:text-lg">
                Copy-paste prompts for action figures, posters, infographics, YouTube
                thumbnails, cinematic portraits, and more. Every template tested with
                the real GPT Image 2 model — paste, customize, generate.
              </p>

              {/* stats badges */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold tracking-wider uppercase">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-rose-300">
                  <span className="inline-flex size-1.5 animate-pulse rounded-full bg-rose-400" />
                  {stats.byTier.viral} Viral
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                  {stats.byTier.commercial} Commercial
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-violet-300">
                  {stats.byTier.creative} Creative
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={WORKBENCH_HREF}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
                >
                  Try in Workbench
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#use-cases"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 backdrop-blur transition-colors hover:bg-white/10"
                >
                  Browse use cases
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Cluster Grid by Tier */}
        <section
          id="use-cases"
          className="relative scroll-mt-24 border-b border-white/5"
        >
          <div className="mx-auto max-w-7xl space-y-12 px-4 py-16 md:px-8 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow badgeTextClassName="text-zinc-400">
                All Categories
              </SectionEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Browse 10 GPT Image 2 prompt categories
              </h2>
              <p className="mt-3 text-zinc-400">
                Each category includes 12-14 tested GPT Image 2 prompts, FAQ, and
                one-click Workbench integration.
              </p>
            </div>

            {TIER_ORDER.map((tier) => (
              <TierSection
                key={tier}
                tier={tier}
                clusters={byTier[tier]}
              />
            ))}
          </div>
        </section>

        {/* Why GPT Image 2 */}
        <section className="border-b border-white/5 bg-zinc-950/40">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow badgeTextClassName="text-emerald-300">
                Why GPT Image 2?
              </SectionEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Three things GPT Image 2 does better
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {WHY_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-colors hover:border-white/20"
                  >
                    <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow badgeTextClassName="text-violet-300">
                How It Works
              </SectionEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                How to use GPT Image 2 prompts in 3 steps
              </h2>
            </div>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {HOW_TO_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-white/10 bg-zinc-900/50 p-6"
                >
                  <span className="absolute -top-3 left-6 inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-sm font-bold text-white shadow-lg">
                    {i + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-white/5 bg-zinc-950/40">
          <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow badgeTextClassName="text-zinc-400">FAQ</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                GPT Image 2 prompts FAQ
              </h2>
            </div>
            <div className="mt-10 space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-white/10 bg-zinc-900/50 px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white">
                    <span>{item.q}</span>
                    <span className="text-zinc-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
          <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8 md:py-28">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Start using GPT Image 2 prompts now
            </h2>
            <p className="mt-4 text-zinc-300 md:text-lg">
              Open the Workbench and try any GPT Image 2 prompt in 30 seconds.
            </p>
            <Link
              href={WORKBENCH_HREF}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3.5 text-base font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              Open Workbench
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </main>

      <GptImageStudioSiteFooter />
    </div>
  );
}
