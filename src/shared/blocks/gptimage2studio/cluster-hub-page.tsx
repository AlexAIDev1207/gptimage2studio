'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Wand2, Lightbulb, Sparkles, Target } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

import {
  PROMPTS_HUB_URL,
  TIER_STYLE,
  findRelatedClusters,
  getClusterUrl,
  type Cluster,
  type PromptItem,
} from './clusters-helpers';
import { ClusterPromptDialog } from './cluster-prompt-dialog';
import { GptImageStudioSiteFooter } from './site-footer';
import { GptImageStudioSiteHeader } from './site-header';
import { SectionEyebrow } from './section-eyebrow';

const WORKBENCH_HREF = '/#workbench';

// Related Articles 用：站内 5 篇博客元数据。新博客上线时同步更新。
const BLOG_META: Record<
  string,
  { title: string; description: string; cover: string }
> = {
  'gpt-image-2-consistent-characters': {
    title: 'How to Keep Characters Consistent in GPT Image 2 Across Scenes and Angles',
    description:
      'A practical character consistency workflow for recurring faces, reference packs, scene changes, outfit swaps, and continuity repair.',
    cover: '/imgs/blog/gpt-image-2-consistent-characters-cover.webp',
  },
  'fix-gpt-image-2-artifacting-lighting-details': {
    title: 'GPT Image 2 Artifacting: Fix Bad Lighting, Muddy Textures, and Unnatural Details',
    description:
      'Fix GPT Image 2 artifacting, bad lighting, muddy textures, and unnatural details with better prompts, cleaner edits, and a smarter QA workflow.',
    cover: '/imgs/blog/fix-gpt-image-2-artifacting-lighting-details-cover.webp',
  },
  'gpt-image-2-pdf-to-slides-infographics': {
    title: 'How to Turn PDFs Into Slides and Infographics With GPT Image 2',
    description:
      'Turn reports, PDFs, white papers, and research documents into slide images, infographic layouts, and one-page poster summaries.',
    cover: '/imgs/blog/gpt-image-2-pdf-to-slides-infographics-cover.webp',
  },
  'gpt-image-2-seedance-2-workflow': {
    title: 'GPT Image 2 + Seedance 2 Workflow for Game Concepts, Storyboards, and Ads',
    description:
      'A keyframe-first GPT Image 2 and Seedance 2 workflow for game concepts, storyboards, title screens, and motion-ready visual planning.',
    cover: '/imgs/blog/gpt-image-2-seedance-2-workflow-cover.webp',
  },
  'is-gpt-image-2-free-pricing-access': {
    title: 'Is GPT Image 2 Free? Pricing, Access, and the Best Way to Use It Online',
    description:
      'GPT Image 2 pricing, free access, ChatGPT vs API costs, and the best way to use GPT Image 2 online without wasting budget.',
    cover: '/imgs/blog/is-gpt-image-2-free-pricing-access-cover.webp',
  },
};

// 网格列数：随筛选数量调整，2 张 → 2 列、3 张 → 3 列、>= 4 张 → 4 列
// Tailwind v4 JIT 需要静态 class string，故用 if/return 而非动态拼接
function gridColsClass(n: number): string {
  if (n <= 1) return 'grid-cols-1';
  if (n === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (n === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
}

// 卡片样式对齐首页 prompt-cards-masonry：figure + hover overlay + 圆角 22px
// inMasonry=true 时加 break-inside-avoid + mb-3，让 CSS columns 模式正确分列
function PromptCard({
  prompt,
  onSelect,
  inMasonry = false,
}: {
  prompt: PromptItem;
  onSelect: (p: PromptItem) => void;
  inMasonry?: boolean;
}) {
  const w = prompt.final_image_width || 1024;
  const h = prompt.final_image_height || 1536;

  return (
    <figure
      className={`group relative inline-block w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#101218] shadow-none transition ${inMasonry ? 'mb-3 break-inside-avoid' : ''}`}
    >
      <button
        type="button"
        aria-label={`Open prompt: ${prompt.title}`}
        onClick={() => onSelect(prompt)}
        className="block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative w-full">
          {prompt.final_image_url && (
            <Image
              src={prompt.final_image_url}
              alt={prompt.title}
              width={w}
              height={h}
              sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              className="h-auto w-full object-cover transition-transform duration-300 group-focus-within:scale-[1.02] group-hover:scale-[1.02]"
            />
          )}
          {prompt.json_template_ref && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded-md border border-violet-400/30 bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-violet-200 uppercase backdrop-blur">
              JSON
            </span>
          )}
        </div>

        {/* hover overlay with title + first lines of prompt */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/55 to-black/5 p-4 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
          <figcaption className="translate-y-2 transition-transform duration-200 group-focus-within:translate-y-0 group-hover:translate-y-0">
            <p className="line-clamp-1 text-sm font-semibold text-white">
              {prompt.title}
            </p>
            <p className="mt-2 line-clamp-5 text-sm leading-5 text-zinc-100">
              {prompt.final_prompt}
            </p>
          </figcaption>
        </div>
      </button>
    </figure>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 transition-colors'
          : 'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white'
      }
    >
      {label}
      <span className={active ? 'text-emerald-300/80' : 'text-zinc-500'}>·</span>
      <span className={active ? 'text-emerald-300/80' : 'text-zinc-500'}>
        {count}
      </span>
    </button>
  );
}

export function ClusterHubPage({ cluster }: { cluster: Cluster }) {
  const [selected, setSelected] = useState<PromptItem | null>(null);
  const tier = cluster.spec.tier;
  const tierStyle = TIER_STYLE[tier];
  const related = useMemo(
    () => findRelatedClusters(cluster.spec.slug),
    [cluster],
  );

  // 主关键词：从 H1 派生（如 "Old Photo Restoration Prompts" / "Action Figure Prompts"）
  // 用于内页所有 H2 / FAQ heading 聚焦同一关键词
  const mainKeyword = cluster.spec.h1
    .replace(/ for GPT Image 2$/, '')
    .replace(/^GPT Image 2 /, '');
  const keywordLower = mainKeyword.toLowerCase();

  // sub-scene filter（"all" = 不过滤）
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const filteredPrompts = useMemo(() => {
    if (activeFilter === 'all') return cluster.prompts;
    return cluster.prompts.filter((p) => p.sub_scene_tag === activeFilter);
  }, [cluster.prompts, activeFilter]);

  return (
    <div className="gpt-studio-page min-h-screen bg-[#09090B] text-zinc-200 antialiased selection:bg-cyan-400/30 selection:text-white">
      <GptImageStudioSiteHeader />

      <main>
        {/* Breadcrumb + Hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            className={`pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[1100px] -translate-x-1/2 rounded-full ${tierStyle.glow} opacity-60 blur-[140px]`}
          />
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-8 md:pt-12 md:pb-16">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-zinc-500"
            >
              <Link href="/" className="hover:text-zinc-300">
                Home
              </Link>
              <ChevronRight className="size-3" />
              <Link href={PROMPTS_HUB_URL} className="hover:text-zinc-300">
                Prompts
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-zinc-300">
                {cluster.spec.h1.replace(' for GPT Image 2', '')}
              </span>
            </nav>

            <div className="mt-8 flex flex-col items-center text-center">
              <SectionEyebrow badgeTextClassName={tierStyle.badge.replace(/border-[^\s]+\s|bg-[^\s]+\/\d+\s/g, '')}>
                {tierStyle.label}
              </SectionEyebrow>
              <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                <span
                  className={`bg-gradient-to-r ${tierStyle.accentText} bg-clip-text text-transparent`}
                >
                  {cluster.spec.h1}
                </span>
              </h1>
              <p className="mt-5 max-w-5xl text-left text-sm leading-relaxed text-zinc-400 md:text-base">
                {cluster.spec.intro_long ?? cluster.spec.meta_description}
              </p>
            </div>
          </div>
        </section>

        {/* Prompts grid: filter chips + 单一 masonry，对齐首页 prompt-cards-masonry 视觉 */}
        <section id="prompts" className="border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {cluster.prompts.length} {mainKeyword}
              </h2>
              <p className="text-sm text-zinc-400">
                Click any card to view the full prompt and customize.
              </p>
            </div>

            {/* Filter chips */}
            <nav className="mb-8 flex flex-wrap gap-2" aria-label="Filter prompts by sub-style">
              <FilterChip
                label="All"
                count={cluster.prompts.length}
                active={activeFilter === 'all'}
                onClick={() => setActiveFilter('all')}
              />
              {cluster.spec.sub_scenes.map((ss) => {
                const count = cluster.prompts.filter(
                  (p) => p.sub_scene_tag === ss.slug_anchor,
                ).length;
                if (count === 0) return null;
                return (
                  <FilterChip
                    key={ss.slug_anchor}
                    label={ss.name}
                    count={count}
                    active={activeFilter === ss.slug_anchor}
                    onClick={() => setActiveFilter(ss.slug_anchor)}
                  />
                );
              })}
            </nav>

            {/* 卡片布局：≤3 张用 grid（避免 columns 把它们都挤进第一列）； */}
            {/* ≥4 张用 CSS columns masonry，自然处理混合宽高比，不会留空格 */}
            {filteredPrompts.length >= 4 ? (
              <div className="columns-1 gap-3 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4">
                {filteredPrompts.map((p) => (
                  <PromptCard
                    key={p.prompt_id}
                    prompt={p}
                    onSelect={setSelected}
                    inMasonry
                  />
                ))}
              </div>
            ) : (
              <div className={`grid items-start gap-3 ${gridColsClass(filteredPrompts.length)}`}>
                {filteredPrompts.map((p) => (
                  <PromptCard key={p.prompt_id} prompt={p} onSelect={setSelected} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        {cluster.spec.how_it_works.length > 0 && (
          <section className="border-b border-white/5">
            <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow badgeTextClassName="text-violet-300">
                  How It Works
                </SectionEyebrow>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  How to Generate {mainKeyword} in {cluster.spec.how_it_works.length} Steps
                </h2>
              </div>
              <ol className="mt-12 grid gap-6 md:grid-cols-3">
                {cluster.spec.how_it_works.map((step, i) => (
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
        )}

        {/* Why Use */}
        {cluster.spec.why_use.length > 0 && (
          <section className="border-b border-white/5 bg-zinc-950/40">
            <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow badgeTextClassName="text-emerald-300">
                  Why GPT Image 2?
                </SectionEyebrow>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Why GPT Image 2 Beats Other Tools for {mainKeyword.replace(/ Prompts?$/, '')}
                </h2>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {cluster.spec.why_use.map((item, i) => {
                  const icons = [Target, Sparkles, Wand2];
                  const Icon = icons[i % icons.length];
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
        )}

        {/* Use Cases */}
        {cluster.spec.use_cases.length > 0 && (
          <section className="border-b border-white/5">
            <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow badgeTextClassName="text-cyan-300">
                  Use Cases
                </SectionEyebrow>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  When to Use {mainKeyword}
                </h2>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cluster.spec.use_cases.map((uc) => (
                  <div
                    key={uc.title}
                    className="rounded-xl border border-white/10 bg-zinc-900/50 p-5"
                  >
                    <h3 className="text-sm font-semibold text-white">
                      {uc.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {uc.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tips - PAA-driven Q&A */}
        {cluster.spec.tips.length > 0 && (
          <section className="border-b border-white/5 bg-zinc-950/40">
            <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow badgeTextClassName="text-amber-300">
                  <Lightbulb className="size-3" />
                  Tips
                </SectionEyebrow>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Tips for Writing {mainKeyword} in GPT Image 2
                </h2>
              </div>
              <div className="mt-10 space-y-6">
                {cluster.spec.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-zinc-900/40 p-5"
                  >
                    <h3 className="text-base font-semibold text-white">
                      {tip.q}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {tip.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {cluster.spec.faq.length > 0 && (
          <section className="border-b border-white/5 bg-zinc-950/40">
            <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <SectionEyebrow badgeTextClassName="text-zinc-400">
                  FAQ
                </SectionEyebrow>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {mainKeyword} FAQ
                </h2>
                <p className="mt-3 text-sm text-zinc-400">
                  Common questions about {keywordLower} for GPT Image 2.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                {cluster.spec.faq.map((item, i) => (
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
        )}

        {/* Related Articles (内链合规：每 hub ≥1 篇博客) */}
        {(() => {
          const articles = (cluster.spec.related_articles ?? [])
            .map((slug) => ({ slug, meta: BLOG_META[slug] }))
            .filter((a): a is { slug: string; meta: typeof BLOG_META[string] } => !!a.meta);
          if (articles.length === 0) return null;
          return (
            <section className="border-b border-white/5">
              <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
                <div className="mb-8">
                  <SectionEyebrow badgeTextClassName="text-zinc-400">
                    Read Next
                  </SectionEyebrow>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Read Next on GPT Image 2
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {articles.map(({ slug, meta }) => (
                    <Link
                      key={slug}
                      href={`/blog/${slug}`}
                      className="group flex overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60 transition-all hover:border-white/20 hover:bg-zinc-900/70"
                    >
                      <div className="relative aspect-[4/3] w-40 shrink-0 overflow-hidden bg-zinc-900">
                        <Image
                          src={meta.cover}
                          alt={meta.title}
                          width={1200}
                          height={630}
                          sizes="160px"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
                        <div>
                          <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-white">
                            {meta.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                            {meta.description}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-zinc-300 group-hover:text-white">
                          Read article
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* Related Clusters */}
        {related.length > 0 && (
          <section className="border-b border-white/5">
            <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
              <div className="mb-8">
                <SectionEyebrow badgeTextClassName="text-zinc-400">
                  Related Categories
                </SectionEyebrow>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Explore Other GPT Image 2 Prompt Categories
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((c) => {
                  const cover = c.prompts[0]?.final_image_url;
                  const cstyle = TIER_STYLE[c.spec.tier];
                  return (
                    <Link
                      key={c.spec.slug}
                      href={getClusterUrl(c.spec.slug)}
                      className="group relative flex overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60 transition-all hover:border-white/20 hover:bg-zinc-900/70"
                    >
                      <div className="relative aspect-square w-32 shrink-0 overflow-hidden bg-zinc-900">
                        {cover && (
                          <Image
                            src={cover}
                            alt={c.spec.h1}
                            width={c.prompts[0]?.final_image_width || 600}
                            height={c.prompts[0]?.final_image_height || 600}
                            sizes="128px"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
                        <div>
                          <span
                            className={`mb-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${cstyle.badge}`}
                          >
                            {cstyle.label}
                          </span>
                          <h3 className="text-sm font-semibold text-white group-hover:text-white">
                            {c.spec.h1.replace(' for GPT Image 2', '')}
                          </h3>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-200">
                          {c.prompts.length} prompts
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="relative overflow-hidden">
          <div
            className={`pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full ${tierStyle.glow} opacity-60 blur-[120px]`}
          />
          <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8 md:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Start Generating {mainKeyword} Now
            </h2>
            <p className="mt-3 text-zinc-300 md:text-lg">
              Open the Workbench and run any of the {cluster.prompts.length}{' '}
              {keywordLower} in 30 seconds.
            </p>
            <Link
              href={WORKBENCH_HREF}
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition-colors ${tierStyle.accentBg}`}
            >
              <Wand2 className="size-5" />
              Open Workbench
            </Link>
          </div>
        </section>
      </main>

      <GptImageStudioSiteFooter />

      <ClusterPromptDialog
        prompt={selected}
        clusterSlug={cluster.spec.slug}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
