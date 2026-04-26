'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Image as ImageIcon,
  Layers,
  Layout as LayoutIcon,
  Menu,
  Quote,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';

import {
  benefits,
  comparison,
  coreFeatures,
  editDemos,
  faqs,
  finalCta,
  footer,
  hero,
  howToUse,
  nav,
  pricing,
  promoBar,
  promptCards,
  promptCategories,
  testimonials,
  useCases,
  whatIsCards,
  workbench,
} from './content';
import Workbench from './workbench';

type Variant = 'A' | 'B';

const palettes: Record<
  Variant,
  {
    accent: string;
    accentSoft: string;
    accentRing: string;
    accentBg: string;
    badgeText: string;
    glow: string;
  }
> = {
  A: {
    accent: 'from-emerald-400 via-teal-400 to-cyan-400',
    accentSoft: 'from-emerald-500/20 via-teal-500/15 to-cyan-500/20',
    accentRing: 'ring-emerald-400/40',
    accentBg: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
    badgeText: 'text-emerald-300',
    glow: 'bg-emerald-500/20',
  },
  B: {
    accent: 'from-fuchsia-400 via-violet-500 to-indigo-500',
    accentSoft: 'from-fuchsia-500/20 via-violet-500/15 to-indigo-500/20',
    accentRing: 'ring-violet-400/40',
    accentBg: 'bg-violet-500 hover:bg-violet-400 text-white',
    badgeText: 'text-violet-300',
    glow: 'bg-violet-500/25',
  },
};

export default function HomePage({ variant = 'A' }: { variant?: Variant }) {
  const palette = palettes[variant];

  const [promoOpen, setPromoOpen] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  const [activeEditDemo, setActiveEditDemo] = useState(0);

  const [filter, setFilter] = useState('All');
  const [copied, setCopied] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredPrompts = useMemo(() => {
    if (filter === 'All') return promptCards;
    return promptCards.filter((p) => p.category === filter);
  }, [filter]);
  const activeEdit = editDemos[activeEditDemo];

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-200 antialiased selection:bg-cyan-400/30 selection:text-white">
      {/* Promo bar */}
      {promoOpen && (
        <div
          className={`relative border-b border-white/5 bg-gradient-to-r ${palette.accentSoft}`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:text-sm md:px-8">
            <div className="flex items-center gap-2 truncate">
              <span
                className={`inline-flex h-5 items-center rounded-full border border-white/10 bg-white/5 px-2 text-[10px] font-semibold tracking-wider uppercase ${palette.badgeText}`}
              >
                Launch
              </span>
              <span className="truncate text-zinc-300">{promoBar.text}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={promoBar.href}
                className="inline-flex items-center gap-1 rounded-full bg-white text-zinc-950 px-3 py-1 text-xs font-semibold transition hover:bg-zinc-200"
              >
                {promoBar.cta}
                <ArrowRight className="size-3" />
              </a>
              <button
                aria-label="Close promo bar"
                onClick={() => setPromoOpen(false)}
                className="rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="#" className="flex items-center gap-2">
            <span
              className={`inline-flex size-7 items-center justify-center rounded-md bg-gradient-to-br ${palette.accent} text-zinc-950 shadow-lg shadow-cyan-500/20`}
            >
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-semibold text-white sm:text-base">
              GPT Image 2 Studio
            </span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className="rounded-md p-2 text-zinc-300 hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {navOpen && (
          <div className="border-t border-white/5 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className="rounded-md px-2 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero + Workbench (centered, single column to match nanobanana) */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className={`pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full blur-[140px] ${palette.glow} opacity-60`}
        />
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-8 md:pt-12 md:pb-20">
          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold tracking-wider uppercase">
            {hero.trustLabels.map((label, i) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
                  i === 0
                    ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-zinc-300'
                }`}
              >
                {i === 0 && (
                  <span className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
                )}
                {label}
              </span>
            ))}
          </div>

          {/* Eyebrow */}
          <div className="mt-5 flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium ${palette.badgeText}`}
            >
              <Sparkles className="size-3" />
              {hero.eyebrow}
            </span>
          </div>

          {/* H1 centered */}
          <h1 className="mt-5 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span
              className={`bg-gradient-to-r ${palette.accent} bg-clip-text text-transparent`}
            >
              {hero.title}
            </span>
          </h1>

          {/* Subtitle centered */}
          <p className="mx-auto mt-5 max-w-2xl text-center text-base text-zinc-400 md:text-lg">
            {hero.subtitle}
          </p>

          {/* CTAs centered */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={hero.primaryCta.href}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${palette.accentBg} transition`}
            >
              <Wand2 className="size-4" />
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {hero.secondaryCta.label}
            </a>
          </div>

          {/* Workbench section header (centered) */}
          <div id="workbench" className="mx-auto mt-10 max-w-3xl scroll-mt-28 text-center">
            <SectionEyebrow palette={palette}>Workbench</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              {workbench.title}
            </h2>
            <p className="mt-4 text-zinc-400">{workbench.subcopy}</p>
          </div>

          {/* Workbench card: real generator (left form + right carousel/progress/results) */}
          <Workbench variant={variant === 'B' ? 'studio' : 'banana'} />
        </div>
      </section>

      {/* Prompt waterfall */}
      <section id="prompts" className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="flex flex-col items-center text-center">
            <SectionEyebrow palette={palette}>Prompt Library</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              GPT Image 2 Prompts for Real Projects
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-400">
              Browse prompt patterns for product photos, posters, social ads, UI mockups, infographics, and editable image workflows. Copy a prompt, adjust the details, and turn it into a reusable creative brief.
            </p>
            <a
              href="#prompts"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore All Prompts
              <ArrowRight className="size-3.5" />
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {promptCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filter === cat
                    ? `border-transparent bg-gradient-to-r ${palette.accent} text-zinc-950`
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]">
            {filteredPrompts.map((card) => {
              const key = `card-${card.title}`;
              return (
                <article
                  key={card.title}
                  className="mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-[#101218] transition hover:border-white/20"
                >
                  <div className="relative w-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={800}
                      height={1000}
                      sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${palette.badgeText}`}
                      >
                        {card.category}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
                        GPT Image 2
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-3">
                      {card.prompt}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(card.fullPrompt, key)}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
                    >
                      {copied === key ? (
                        <>
                          <Check className="size-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b border-white/5 bg-[#0B0D12]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>Use Cases</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              What You Can Create with GPT Image 2 Studio
            </h2>
            <p className="mt-4 text-zinc-400">
              GPT Image 2 Studio is built for practical creative work: product
              visuals, marketing assets, educational graphics, UI concepts, and
              prompt libraries that can be reused across campaigns.
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-16 md:gap-24">
            {useCases.map((u, i) => {
              const reverse = i % 2 === 1;
              return (
                <article
                  key={u.title}
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                    reverse ? 'lg:[&>div:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#101218] shadow-2xl shadow-black/40">
                    <Image
                      src={u.image}
                      alt={u.title}
                      fill
                      sizes="(min-width: 1024px) 600px, 100vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase ${palette.badgeText}`}
                    >
                      Use case 0{i + 1}
                    </span>
                    <h3 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                      {u.title}
                    </h3>
                    <p className="mt-4 text-zinc-400">{u.copy}</p>
                    <div className="mt-5 rounded-xl border border-white/10 bg-[#0B0D12] p-4 text-sm text-zinc-300">
                      <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                        Prompt snippet
                      </span>
                      <p className="mt-2 text-zinc-300">{u.snippet}</p>
                    </div>
                    <a
                      href={u.href}
                      className={`mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10`}
                    >
                      {u.cta}
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editing demo — image-driven tab switcher (cross-fade between scenarios) */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
          <div className="flex flex-col items-center text-center">
            <SectionEyebrow palette={palette}>Editing</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Edit Images with GPT Image 2 Studio
            </h2>
            <p className="mt-4 max-w-3xl text-zinc-400">
              Use natural-language edits to change backgrounds, relight scenes, replace objects, and refine text-heavy layouts without rebuilding the image from scratch.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {editDemos.map((d, i) => (
              <button
                key={d.title}
                type="button"
                onClick={() => setActiveEditDemo(i)}
                aria-pressed={activeEditDemo === i}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  activeEditDemo === i
                    ? `border-transparent bg-gradient-to-r ${palette.accent} text-zinc-950`
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>

          {/* Active tab — large image with cross-fade + 1-line copy + monospace prompt */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101218] shadow-2xl shadow-black/40">
            <div className="relative aspect-[16/9] w-full">
              {editDemos.map((d, i) => (
                <div
                  key={d.title}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    i === activeEditDemo ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={i !== activeEditDemo}
                >
                  <Image
                    src={d.image}
                    alt={d.title}
                    fill
                    sizes="(min-width: 1024px) 1100px, 100vw"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-zinc-100 backdrop-blur">
                <span className={palette.badgeText}>
                  Demo {String(activeEditDemo + 1).padStart(2, '0')}
                </span>
                <span className="size-1 rounded-full bg-zinc-500" />
                <span>{activeEdit.title}</span>
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#0B0D12] p-5 md:p-6">
              <p className="text-sm text-zinc-300">{activeEdit.copy}</p>
              <div className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-zinc-300">
                {activeEdit.prompt}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Is + Comparison (stacked, centered) */}
      <section className="border-b border-white/5 bg-[#0B0D12]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          {/* What Is */}
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>About</SectionEyebrow>
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
              What Is GPT Image 2 Studio?
            </h2>
            <p className="mt-4 text-zinc-400">
              GPT Image 2 Studio is an independent AI image generator and
              editor workspace built around GPT Image 2, Nano Banana, and
              reusable prompt workflows. It helps creators start from a text
              prompt or reference image, choose the right model for the job,
              and create visuals for ecommerce, marketing, education, UI
              concepts, and text-rich design tasks.
            </p>
            <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-zinc-400">
              GPT Image 2 Studio is an independent product and is not an
              official OpenAI or Google website.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {whatIsCards.map((c, i) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-[#101218] p-5"
              >
                <span
                  className={`inline-flex size-9 items-center justify-center rounded-lg bg-gradient-to-br ${palette.accent} text-xs font-bold text-zinc-950`}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {c.copy}
                </p>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="mx-auto mt-20 max-w-3xl text-center">
            <SectionEyebrow palette={palette}>Comparison</SectionEyebrow>
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
              GPT Image 2 Studio vs Nano Banana
            </h2>
            <p className="mt-4 text-zinc-400">
              GPT Image 2 Studio is the workflow layer. GPT Image 2 and Nano
              Banana are model options that can be used for different image
              tasks. This comparison helps users choose a starting point, not
              to rank one model as universally better.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101218]">
            <div className="hidden grid-cols-[0.8fr_1.2fr_1.2fr] border-b border-white/10 bg-white/5 text-[11px] font-semibold tracking-wide uppercase md:grid">
              <div className="px-4 py-3 text-zinc-300">Dimension</div>
              <div className={`px-4 py-3 ${palette.badgeText}`}>
                GPT Image 2 Studio
              </div>
              <div className="px-4 py-3 text-zinc-400">Nano Banana</div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={row.dimension}
                className={`grid gap-3 px-4 py-4 text-sm md:grid-cols-[0.8fr_1.2fr_1.2fr] ${
                  i !== comparison.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-zinc-600 uppercase md:hidden">
                    Dimension
                  </span>
                  <p className="mt-1 font-semibold text-zinc-200 md:mt-0">
                    {row.dimension}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-[10px] font-semibold tracking-wider uppercase md:hidden ${palette.badgeText}`}
                  >
                    GPT Image 2 Studio
                  </span>
                  <p className="mt-1 leading-6 text-zinc-300 md:mt-0">
                    {row.studio}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase md:hidden">
                    Nano Banana
                  </span>
                  <p className="mt-1 leading-6 text-zinc-400 md:mt-0">
                    {row.nano}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href="#prompts"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${palette.badgeText} hover:underline`}
            >
              Compare Prompt Workflows
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>Benefits</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Why Choose GPT Image 2 Studio
            </h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-[#101218] p-6"
              >
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${palette.accent} text-zinc-950`}
                >
                  {[<LayoutIcon key="0" className="size-5" />, <ImageIcon key="1" className="size-5" />, <Layers key="2" className="size-5" />][i]}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{b.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="border-b border-white/5 bg-[#0B0D12]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>How To Use</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              How to Use GPT Image 2 Studio
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howToUse.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-white/10 bg-[#101218] p-5"
              >
                <span
                  className={`text-3xl font-bold bg-gradient-to-br ${palette.accent} bg-clip-text text-transparent`}
                >
                  {s.step}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>Core Features</SectionEyebrow>
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
              Core Features of GPT Image 2
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-[#101218] p-5 transition hover:border-white/20 hover:bg-[#151821]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 ${palette.badgeText}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {f.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-zinc-400">{f.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-b border-white/5 bg-[#0B0D12]"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>Pricing</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Simple Plans for GPT Image 2 Studio
            </h2>
            <p className="mt-4 text-zinc-400">
              Choose a plan for testing prompts, generating campaign visuals, and building repeatable image workflows. Final credits, pricing, and limits will be shown before launch.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition ${
                  p.featured
                    ? `border-white/30 bg-[#151821] ring-1 ${palette.accentRing}`
                    : 'border-white/10 bg-[#101218]'
                }`}
              >
                {p.featured && (
                  <span
                    className={`absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-gradient-to-r ${palette.accent} px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-950 uppercase`}
                  >
                    Recommended
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{p.body}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white">—</span>
                  <span className="text-xs text-zinc-500">
                    Plan details TBA
                  </span>
                </div>
                <button
                  type="button"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    p.featured
                      ? palette.accentBg
                      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-zinc-500">
            Plan details are placeholders for the MVP and should be replaced before paid launch.
          </p>
        </div>
      </section>

      {/* Testimonials — creator quotes */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <div className="flex flex-col items-center text-center">
            <SectionEyebrow palette={palette}>Creator Voices</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              What Creators Are Exploring
            </h2>
            <p className="mt-4 max-w-3xl text-zinc-400">
              Early users of GPT Image 2 and Nano Banana share how they fold AI image workflows into product launches, marketing campaigns, packaging, UI concepts, and content production.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.handle}
                className="relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#101218] p-6 transition hover:border-white/20"
              >
                <Quote
                  className={`size-6 ${palette.badgeText} opacity-70`}
                  aria-hidden="true"
                />
                <blockquote className="text-sm leading-relaxed text-zinc-200">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-4">
                  <span
                    aria-hidden="true"
                    className={`inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}
                  >
                    {t.initial}
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-white">
                      {t.name}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {t.role} · <span className="text-zinc-500">{t.handle}</span>
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-zinc-500">
            Quotes are illustrative creator personas reflecting public discussions about GPT Image 2 and Nano Banana workflows.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/5 bg-[#0B0D12]">
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>FAQ</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-8 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#101218]">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
                  >
                    <span className="text-sm font-semibold text-white sm:text-base">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-zinc-400 transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-zinc-400">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="blog"
        className={`relative overflow-hidden border-b border-white/5 bg-gradient-to-br ${palette.accentSoft}`}
      >
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-zinc-300">
            {finalCta.subcopy}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={finalCta.primary.href}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${palette.accentBg}`}
            >
              <Wand2 className="size-4" />
              {finalCta.primary.label}
            </a>
            <a
              href={finalCta.secondary.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {finalCta.secondary.label}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#09090B]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="max-w-md">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex size-7 items-center justify-center rounded-md bg-gradient-to-br ${palette.accent} text-zinc-950`}
                >
                  <Sparkles className="size-4" />
                </span>
                <span className="text-base font-semibold text-white">
                  {footer.brand}
                </span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">{footer.description}</p>
              <p className="mt-4 text-sm text-zinc-500">
                Contact:{' '}
                <a
                  href={`mailto:${footer.contact}`}
                  className="text-zinc-300 hover:text-white"
                >
                  {footer.contact}
                </a>
              </p>
            </div>
            <FooterColumn title="Product" items={footer.product} />
            <FooterColumn title="Resources" items={footer.resource} />
            <FooterColumn title="Legal" items={footer.legal} />
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <span>{footer.disclaimer}</span>
            <span>
              © {new Date().getFullYear()} {footer.brand}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionEyebrow({
  children,
  palette,
}: {
  children: React.ReactNode;
  palette: (typeof palettes)['A'];
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase ${palette.badgeText}`}
    >
      <span className="size-1 rounded-full bg-current" />
      {children}
    </span>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-zinc-400 transition hover:text-white"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
