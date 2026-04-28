'use client';

import { useMemo, useState } from 'react';
import { Check, Crown, Flame, Zap } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';

import {
  creditPacks,
  pricingPlansByBilling,
  type PricingBilling,
} from './content';
import type { HomePalette } from './home-theme';
import { SectionEyebrow } from './section-eyebrow';

const pricingBillingOptions: {
  value: PricingBilling;
  label: string;
  note?: string;
}[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly', note: 'Save 50%' },
  { value: 'packs', label: 'Credits Packs' },
];

export function HomePricingSection({
  palette,
}: {
  palette: HomePalette;
}) {
  const [pricingBilling, setPricingBilling] =
    useState<PricingBilling>('yearly');

  const visiblePricingPlans = useMemo(
    () =>
      pricingBilling === 'packs'
        ? creditPacks
        : pricingPlansByBilling[pricingBilling],
    [pricingBilling]
  );

  return (
    <section
      id="pricing"
      className="border-b border-slate-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fffd_40%,#ecfdf5_100%)] dark:border-white/5 dark:bg-[#0B0D12]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1500px' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow badgeTextClassName="text-emerald-600 dark:text-emerald-300">
            Pricing
          </SectionEyebrow>
          <h2 className="mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl dark:bg-none dark:text-white">
            GPT Image 2 Studio pricing
          </h2>
          <p className="mt-4 text-slate-600 dark:text-zinc-300">
            Choose the perfect plan for your AI image creation needs.
          </p>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-2xl rounded-[20px] border border-transparent bg-[linear-gradient(rgba(255,255,255,0.94),rgba(255,255,255,0.94))_padding-box,linear-gradient(135deg,rgba(16,185,129,0.30),rgba(34,211,238,0.35),rgba(148,163,184,0.30))_border-box] p-1.5 shadow-[0_18px_55px_-40px_rgba(14,165,233,0.28)] dark:border-emerald-400/20 dark:bg-[#081915]/80 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          {pricingBillingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={pricingBilling === option.value}
              onClick={() => setPricingBilling(option.value)}
              className={`relative flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg px-2 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none md:text-base ${
                pricingBilling === option.value
                  ? `bg-gradient-to-r ${palette.accent} text-zinc-950 dark:text-white`
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              <span>{option.label}</span>
              {option.note && (
                <span className="hidden items-center gap-1 rounded-md bg-gradient-to-r from-red-500 to-orange-600 px-2 py-1 text-xs font-black text-amber-100 shadow-lg shadow-orange-950/40 lg:inline-flex">
                  <Flame className="size-3 fill-amber-200 text-amber-200" />
                  {option.note}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Cancel anytime
          </span>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {visiblePricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex min-h-[520px] flex-col rounded-2xl border p-6 transition ${
                plan.featured
                  ? 'border-transparent bg-[linear-gradient(rgba(248,250,252,0.98),rgba(236,253,245,0.96))_padding-box,linear-gradient(135deg,rgba(16,185,129,0.68),rgba(34,211,238,0.46),rgba(148,163,184,0.34))_border-box] shadow-[0_30px_70px_-40px_rgba(16,185,129,0.35)] ring-1 ring-emerald-300/35 dark:border-emerald-500/50 dark:bg-[#0b2517] dark:shadow-2xl dark:shadow-emerald-950/25 dark:ring-emerald-400/25'
                  : 'border-slate-200/80 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.28)] hover:border-emerald-200 dark:border-white/10 dark:bg-[#090e1a] dark:hover:border-white/20'
              }`}
            >
              {plan.featured && (
                <span
                  className={`absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-gradient-to-r ${palette.accent} px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-950 uppercase dark:text-white`}
                >
                  <Crown className="size-3" />
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex size-12 shrink-0 items-center justify-center rounded-xl ${
                    plan.featured
                      ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'
                      : 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                  }`}
                >
                  {plan.featured ? (
                    <Crown className="size-6" />
                  ) : (
                    <Zap className="size-6" />
                  )}
                </span>
                <h3 className="text-xl font-black text-slate-950 dark:text-white">
                  {plan.name}
                </h3>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-baseline gap-2">
                  {plan.originalPrice && (
                    <span className="text-base font-black text-slate-400 line-through dark:text-zinc-400">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span
                    className={`text-4xl font-black tracking-tight ${
                      plan.featured
                        ? `bg-gradient-to-r ${palette.accent} bg-clip-text text-transparent`
                        : 'text-slate-950 dark:text-white'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-base font-bold text-slate-500 dark:text-zinc-400">
                    {plan.unit}
                  </span>
                </div>
                {(plan.annualPrice || plan.discountLabel) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {plan.annualPrice && (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">
                        {plan.annualPrice}
                      </span>
                    )}
                    {plan.discountLabel && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-600 px-3 py-1 text-xs font-black text-amber-100">
                        <Flame className="size-3 fill-amber-200 text-amber-200" />
                        {plan.discountLabel}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-5 text-sm font-semibold text-slate-500 underline decoration-dotted underline-offset-4 dark:text-zinc-400">
                  {plan.creditValue}
                </p>
              </div>
              <p className="mt-5 min-h-16 text-sm leading-6 text-slate-600 dark:text-zinc-300">
                {plan.description}
              </p>
              <Link
                href="/pricing"
                className={`mt-6 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-black transition ${
                  plan.featured
                    ? `bg-gradient-to-r ${palette.accent} text-zinc-950 hover:brightness-110 dark:text-white`
                    : 'border border-emerald-200 bg-white text-emerald-700 shadow-[0_18px_40px_-32px_rgba(16,185,129,0.18)] hover:border-cyan-300 hover:bg-emerald-50 dark:border-zinc-300/30 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white'
                }`}
              >
                {plan.cta}
                <Zap className="size-4 fill-current" />
              </Link>
              <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/85 p-5 dark:border-white/10 dark:bg-black/20">
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  {plan.credits}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-zinc-400">
                  {plan.billingNote}
                </p>
                <ul className="mt-5 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-slate-700 dark:text-zinc-300"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
