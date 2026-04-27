'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Layers,
  Layout as LayoutIcon,
  Menu,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';

import { AnimatedThemeToggler } from '@/shared/components/magicui/animated-theme-toggler';
import { useAppContext } from '@/shared/contexts/app';

import {
  benefits,
  comparison,
  comparisonCta,
  comparisonHero,
  comparisonIntro,
  coreFeatures,
  editDemos,
  faqs,
  finalCta,
  footer,
  hero,
  howToUse,
  howToUseSubtitle,
  nav,
  pricing,
  promoBar,
  promptCards,
  promptCategories,
  testimonials,
  testimonialsDisclaimer,
  testimonialsIntro,
  type Testimonial,
  useCases,
  whatIsCards,
  whatIsIntro,
  whyChooseCta,
  whyChooseSubtitle,
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
  const { user, setIsShowSignModal } = useAppContext();

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
          {/* Left: logo + nav */}
          <div className="flex items-center gap-8">
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
            <nav className="hidden items-center gap-6 md:flex">
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
          </div>
          {/* Right: theme toggle + sign in */}
          <div className="flex items-center gap-2">
            <AnimatedThemeToggler className="inline-flex size-9 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/10 hover:text-white [&_svg]:size-4" />
            {user ? (
              <Link
                href="/settings/profile"
                className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10 sm:inline-flex"
              >
                {user.name?.split(' ')[0] ?? 'Account'}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsShowSignModal(true)}
                className="hidden rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 sm:inline-flex"
              >
                Sign In
              </button>
            )}
            <button
              className="rounded-md p-2 text-zinc-300 hover:bg-white/10 md:hidden"
              aria-label="Toggle navigation"
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
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
              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    setNavOpen(false);
                    setIsShowSignModal(true);
                  }}
                  className="mt-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 sm:hidden"
                >
                  Sign In
                </button>
              )}
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
              What You Can Create with GPT Image 2
            </h2>
            <p className="mt-4 text-zinc-400">
              From clean ecommerce product shots to multilingual posters,
              vertical social ads, and labeled UI mockups — these are the
              most common briefs creators bring to GPT Image 2 today.
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
                    <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                      {u.title}
                    </h3>
                    <p className="mt-4 text-zinc-400">{u.copy}</p>
                    <a
                      href={u.href}
                      className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-br ${palette.accent} px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:opacity-90`}
                    >
                      {u.cta}
                      <ArrowRight className="size-4" />
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
              Edit Images with GPT Image 2
            </h2>
            <p className="mt-4 max-w-3xl text-zinc-400">
              Upload an image, describe the change. The Studio handles the rest.
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
            </div>
            <div className="border-t border-white/10 bg-[#0B0D12] p-5 md:p-6">
              <div className="rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-zinc-300">
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
            <p className="mt-4 text-zinc-400">{whatIsIntro}</p>
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
              GPT Image 2 vs Nano Banana
            </h2>
            <p className="mt-4 text-zinc-400">{comparisonIntro}</p>
          </div>

          <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#101218]">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={comparisonHero.src}
                alt={comparisonHero.alt}
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101218]">
            <div className="hidden grid-cols-[0.8fr_1.2fr_1.2fr] border-b border-white/10 bg-white/5 text-[11px] font-semibold tracking-wide uppercase md:grid">
              <div className="px-4 py-3 text-zinc-300">Dimension</div>
              <div className={`px-4 py-3 ${palette.badgeText}`}>
                GPT Image 2
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
                    GPT Image 2
                  </span>
                  <p className="mt-1 leading-6 text-zinc-300 md:mt-0">
                    {row.gptImage2}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase md:hidden">
                    Nano Banana
                  </span>
                  <p className="mt-1 leading-6 text-zinc-400 md:mt-0">
                    {row.nanoBanana}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href={comparisonCta.href}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${palette.badgeText} hover:underline`}
            >
              {comparisonCta.label}
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
              Why Choose GPT Image 2
            </h2>
            <p className="mt-4 text-zinc-400">{whyChooseSubtitle}</p>
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
                  {[<LayoutIcon key="0" className="size-5" />, <Sparkles key="1" className="size-5" />, <Layers key="2" className="size-5" />][i]}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{b.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href={whyChooseCta.href}
              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-br ${palette.accent} px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:opacity-90`}
            >
              {whyChooseCta.label}
              <ArrowRight className="size-4" />
            </a>
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
            <p className="mt-4 text-zinc-400">{howToUseSubtitle}</p>
          </div>
          <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-12 md:gap-16">
            {howToUse.map((s) => (
              <article
                key={s.step}
                className="flex flex-col items-center text-center"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101218] shadow-2xl shadow-black/40">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 768px) 880px, 100vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <span
                  className={`mt-6 text-3xl font-bold bg-gradient-to-br ${palette.accent} bg-clip-text text-transparent`}
                >
                  {s.step}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-2xl text-zinc-400">{s.copy}</p>
              </article>
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

      {/* Testimonials — creator quotes (auto-scrolling marquee, constrained to max-w-7xl) */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 pt-14 md:px-8 md:pt-20">
          <div className="flex flex-col items-center text-center">
            <SectionEyebrow palette={palette}>Creator Voices</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              What Creators Say About GPT Image 2
            </h2>
            <p className="mt-4 max-w-3xl text-zinc-400">
              {testimonialsIntro}
            </p>
          </div>
        </div>

        <div className="group relative mx-auto mt-10 max-w-7xl overflow-hidden px-4 md:px-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0B0D12] to-transparent md:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0B0D12] to-transparent md:w-20" />

          <div
            className="flex w-max gap-6 will-change-transform [animation:testimonial-scroll_60s_linear_infinite] motion-reduce:[animation:none] group-hover:[animation-play-state:paused]"
            aria-label="Creator testimonials"
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <a
                key={`${t.url}-${i}`}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-hidden={i >= testimonials.length}
                className="relative flex w-[300px] flex-shrink-0 flex-col gap-4 rounded-2xl border border-white/10 bg-[#101218] p-6 transition hover:border-white/30 hover:bg-[#151821] sm:w-[360px]"
              >
                <div className="flex items-center justify-between">
                  <SocialLogo source={t.source} className="size-5 text-white" />
                </div>
                <blockquote className="text-sm leading-relaxed text-zinc-200">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="text-xs text-zinc-500">
                  {t.engagement} · {t.date}
                </div>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-4">
                  <TestimonialAvatar testimonial={t} />
                  <div className="leading-tight">
                    <div className="flex items-center gap-1 text-sm font-semibold text-white">
                      {t.name}
                      {t.verified && (
                        <Check
                          className={`size-3.5 ${palette.badgeText}`}
                          aria-label="Verified account"
                        />
                      )}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {t.role} · <span className="text-zinc-500">{t.handle}</span>
                    </div>
                  </div>
                </figcaption>
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 md:px-8 md:pb-20">
          <p className="mt-10 text-center text-xs text-zinc-500">
            {testimonialsDisclaimer}
          </p>
        </div>

        <style>{`
          @keyframes testimonial-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-50% - 0.75rem)); }
          }
        `}</style>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/5 bg-[#0B0D12]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.a,
                },
              })),
            }),
          }}
        />
        <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow palette={palette}>FAQ</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Frequently Asked Questions About GPT Image 2
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
        id="get-started"
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
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr]">
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

function SocialLogo({
  source,
  className,
}: {
  source: 'X' | 'Reddit';
  className?: string;
}) {
  if (source === 'X') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-label="X"
        className={className}
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      aria-label="Reddit"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function TestimonialAvatar({ testimonial }: { testimonial: Testimonial }) {
  const [errored, setErrored] = useState(false);
  const showFallback = errored || !testimonial.avatarUrl;

  if (showFallback) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-sm font-bold text-white`}
      >
        {testimonial.initial}
      </span>
    );
  }
  return (
    <img
      src={testimonial.avatarUrl}
      alt={testimonial.name}
      onError={() => setErrored(true)}
      className="size-10 shrink-0 rounded-full border border-white/10 object-cover"
      loading="lazy"
    />
  );
}
