import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, Sparkles, Wand2 } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

import {
  benefits,
  comparison,
  comparisonCta,
  comparisonHero,
  comparisonIntro,
  coreFeatures,
  faqs,
  finalCta,
  hero,
  howToUse,
  howToUseSubtitle,
  testimonials,
  testimonialsDisclaimer,
  testimonialsIntro,
  useCases,
  whatIsCards,
  whatIsIntro,
  whyChooseCta,
  whyChooseSubtitle,
} from './content';
import { GptImageStudioSiteFooter } from './site-footer';
import { GptImageStudioSiteHeader } from './site-header';
import { HomeEditDemo } from './home-edit-demo';
import { HomePricingSection } from './home-pricing-section';
import { HomePromoBar } from './home-promo-bar';
import { HomePromptLibrary } from './home-prompt-library';
import { palettes, type HomePalette, type Variant } from './home-theme';
import { LazyWorkbench } from './lazy-workbench';
import { SectionEyebrow } from './section-eyebrow';

const deferredSectionStyle: CSSProperties = {
  contentVisibility: 'auto',
  containIntrinsicSize: '1200px',
};

const comparisonSectionStyle: CSSProperties = {
  contentVisibility: 'auto',
  containIntrinsicSize: '1400px',
};

export default function HomePage({ variant = 'A' }: { variant?: Variant }) {
  const palette = palettes[variant];

  return (
    <div className="gpt-studio-page min-h-screen bg-[#09090B] text-zinc-200 antialiased selection:bg-cyan-400/30 selection:text-white">
      <HomePromoBar />
      <GptImageStudioSiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-white/5">
          <div
            className={`pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full blur-[140px] ${palette.glow} opacity-60`}
          />
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 md:px-8 md:pt-12 md:pb-20">
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold tracking-wider uppercase">
              {hero.trustLabels.map((label, index) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
                    index === 0
                      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/10 bg-white/5 text-zinc-200'
                  }`}
                >
                  {index === 0 && (
                    <span className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-400" />
                  )}
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium ${palette.badgeText}`}
              >
                <Sparkles className="size-3" />
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="mt-5 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span
                className={`bg-gradient-to-r ${palette.accent} bg-clip-text text-transparent`}
              >
                {hero.title}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-center text-base text-zinc-300 md:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={hero.primaryCta.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${palette.accentBg} transition`}
              >
                <Wand2 className="size-4" />
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {hero.secondaryCta.label}
              </a>
            </div>

            <div
              id="workbench"
              className="mx-auto mt-10 max-w-3xl scroll-mt-28 text-center"
            >
              <SectionEyebrow badgeTextClassName={palette.badgeText}>
                Workbench
              </SectionEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Create Images with GPT Image 2 Studio
              </h2>
              <p className="mt-4 text-zinc-300">
                Start from a prompt or reference image, choose a model, and
                preview image ideas for product, marketing, and content
                workflows. The MVP interface is designed around reusable
                prompts, clear settings, and fast creative iteration.
              </p>
            </div>

            <LazyWorkbench palette={palette} variant={variant} />
          </div>
        </section>

        <HomePromptLibrary palette={palette} />

        <section
          className="border-b border-white/5 bg-[#0B0D12]"
          style={deferredSectionStyle}
        >
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <SectionEyebrow badgeTextClassName={palette.badgeText}>
                Use Cases
              </SectionEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                What You Can Create with GPT Image 2
              </h2>
              <p className="mt-4 text-zinc-300">
                From clean ecommerce product shots to multilingual posters,
                vertical social ads, and labeled UI mockups — these are the most
                common briefs creators bring to GPT Image 2 today.
              </p>
            </div>
            <div className="mt-12 flex flex-col gap-16 md:gap-24">
              {useCases.map((useCase, index) => {
                const reverse = index % 2 === 1;

                return (
                  <article
                    key={useCase.title}
                    className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
                      reverse ? 'lg:[&>div:first-child]:order-2' : ''
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#101218] shadow-2xl shadow-black/40">
                      <Image
                        src={useCase.image}
                        alt={useCase.title}
                        fill
                        sizes="(min-width: 1024px) 600px, 100vw"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                        {useCase.title}
                      </h3>
                      <p className="mt-4 text-zinc-300">{useCase.copy}</p>
                      <a
                        href={useCase.href}
                        className={`mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-gradient-to-br ${palette.accent} px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:opacity-90`}
                      >
                        {useCase.cta}
                        <ArrowRight className="size-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <HomeEditDemo palette={palette} />

        <section
          id="comparison"
          className="border-b border-white/5 bg-[#0B0D12]"
          style={comparisonSectionStyle}
        >
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <SectionEyebrow badgeTextClassName={palette.badgeText}>
                About
              </SectionEyebrow>
              <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                What Is GPT Image 2 Studio?
              </h2>
              <p className="mt-4 text-zinc-300">{whatIsIntro}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {whatIsCards.map((card, index) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-[#101218] p-5"
                >
                  <span
                    className={`inline-flex size-9 items-center justify-center rounded-lg bg-gradient-to-br ${palette.accent} text-xs font-bold text-zinc-950`}
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {card.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-20 max-w-3xl text-center">
              <SectionEyebrow badgeTextClassName={palette.badgeText}>
                Comparison
              </SectionEyebrow>
              <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                GPT Image 2 vs Nano Banana
              </h2>
              <p className="mt-4 text-zinc-300">{comparisonIntro}</p>
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
                <div className="px-4 py-3 text-zinc-200">Dimension</div>
                <div className={`px-4 py-3 ${palette.badgeText}`}>
                  GPT Image 2
                </div>
                <div className="px-4 py-3 text-zinc-300">Nano Banana</div>
              </div>
              {comparison.map((row, index) => (
                <div
                  key={row.dimension}
                  className={`grid gap-3 px-4 py-4 text-sm md:grid-cols-[0.8fr_1.2fr_1.2fr] ${
                    index !== comparison.length - 1
                      ? 'border-b border-white/5'
                      : ''
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase md:hidden">
                      Dimension
                    </span>
                    <p className="mt-1 font-semibold text-zinc-100 md:mt-0">
                      {row.dimension}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-semibold tracking-wider uppercase md:hidden ${palette.badgeText}`}
                    >
                      GPT Image 2
                    </span>
                    <p className="mt-1 text-zinc-200 md:mt-0">
                      {row.gptImage2}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase md:hidden">
                      Nano Banana
                    </span>
                    <p className="mt-1 text-zinc-300 md:mt-0">
                      {row.nanoBanana}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href={comparisonCta.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-br ${palette.accent} px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:opacity-90`}
              >
                {comparisonCta.label}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-b border-white/5" style={deferredSectionStyle}>
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <SectionEyebrow badgeTextClassName={palette.badgeText}>
                Benefits
              </SectionEyebrow>
              <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                Why Choose GPT Image 2
              </h2>
              <p className="mt-4 text-zinc-300">{whyChooseSubtitle}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-[#101218] p-6"
                >
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {benefit.copy}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <a
                href={whyChooseCta.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-br ${palette.accent} px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:opacity-90`}
              >
                {whyChooseCta.label}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="border-b border-white/5 bg-[#0B0D12]"
          style={deferredSectionStyle}
        >
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <SectionEyebrow badgeTextClassName={palette.badgeText}>
                How To Use
              </SectionEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                How to Use GPT Image 2 Studio
              </h2>
              <p className="mt-4 text-zinc-300">{howToUseSubtitle}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {howToUse.map((step) => (
                <div
                  key={step.step}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#101218]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      sizes="(min-width: 1280px) 280px, (min-width: 768px) 50vw, 100vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-sm font-black tracking-[0.18em] text-cyan-300 uppercase">
                      {step.step}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                      {step.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/5" style={deferredSectionStyle}>
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <SectionEyebrow badgeTextClassName={palette.badgeText}>
                Core Features
              </SectionEyebrow>
              <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                Core Features of GPT Image 2
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {coreFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#101218] p-5 transition hover:border-white/20 hover:bg-[#151821]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 ${palette.badgeText}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-zinc-300">{feature.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomePricingSection palette={palette} />

        <TestimonialsSection palette={palette} />
        <FaqSection palette={palette} />

        <section
          id="get-started"
          className={`relative overflow-hidden border-b border-white/5 bg-gradient-to-br ${palette.accentSoft}`}
          style={deferredSectionStyle}
        >
          <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8 md:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              {finalCta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-zinc-200">
              {finalCta.subcopy}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={finalCta.primary.href}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${palette.accentBg}`}
              >
                <Wand2 className="size-4" />
                {finalCta.primary.label}
              </a>
              <Link
                href={finalCta.secondary.href}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {finalCta.secondary.label}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <GptImageStudioSiteFooter />
    </div>
  );
}

function TestimonialsSection({ palette }: { palette: HomePalette }) {
  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      className="border-b border-white/5"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '920px' }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-14 md:px-8 md:pt-20">
        <div className="flex flex-col items-center text-center">
          <SectionEyebrow badgeTextClassName={palette.badgeText}>
            Creator Voices
          </SectionEyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white md:text-4xl">
            What Creators Say About GPT Image 2
          </h2>
          <p className="mt-4 max-w-3xl text-zinc-300">{testimonialsIntro}</p>
        </div>
      </div>

      <div className="group relative mx-auto mt-10 max-w-7xl overflow-hidden px-4 md:px-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0B0D12] to-transparent md:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0B0D12] to-transparent md:w-20" />

        <div
          className="flex w-max gap-6 will-change-transform motion-reduce:[animation:none] [animation:testimonial-scroll_60s_linear_infinite] group-hover:[animation-play-state:paused]"
          aria-label="Creator testimonials"
        >
          {loopedTestimonials.map((testimonial, index) => {
            const isDuplicate = index >= testimonials.length;

            return (
              <a
                key={`${testimonial.url}-${index}`}
                href={testimonial.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-hidden={isDuplicate}
                tabIndex={isDuplicate ? -1 : undefined}
                className="relative flex w-[300px] flex-shrink-0 flex-col gap-4 rounded-2xl border border-white/10 bg-[#101218] p-6 transition hover:border-white/30 hover:bg-[#151821] sm:w-[360px]"
              >
                <div className="flex items-center justify-between">
                  <SocialLogo
                    source={testimonial.source}
                    className="size-5 text-white"
                  />
                </div>
                <blockquote className="text-sm leading-relaxed text-zinc-200">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="text-xs text-zinc-400">
                  {testimonial.engagement} · {testimonial.date}
                </div>
                <div className="mt-auto flex items-center gap-3 border-t border-white/5 pt-4">
                  <span
                    aria-hidden="true"
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-sm font-bold text-white`}
                  >
                    {testimonial.initial}
                  </span>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1 text-sm font-semibold text-white">
                      {testimonial.name}
                      {testimonial.verified && (
                        <Check
                          className={`size-3.5 ${palette.badgeText}`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="text-xs text-zinc-300">
                      {testimonial.role} ·{' '}
                      <span className="text-zinc-400">{testimonial.handle}</span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-14 md:px-8 md:pb-20">
        <p className="mt-10 text-center text-xs text-zinc-400">
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
  );
}

function FaqSection({ palette }: { palette: HomePalette }) {
  return (
    <section
      className="border-b border-white/5 bg-[#0B0D12]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '720px' }}
    >
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow badgeTextClassName={palette.badgeText}>
            FAQ
          </SectionEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Frequently Asked Questions About GPT Image 2
          </h2>
        </div>
        <div className="mt-8 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-[#101218]">
          {faqs.map((faq, index) => (
            <details key={faq.q} className="group" open={index === 0}>
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5">
                <span className="text-sm font-semibold text-white sm:text-base">
                  {faq.q}
                </span>
                <span
                  aria-hidden="true"
                  className="text-lg text-zinc-400 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-zinc-300">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
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
        aria-hidden="true"
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
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}
