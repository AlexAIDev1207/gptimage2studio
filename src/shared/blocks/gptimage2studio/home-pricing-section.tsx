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
      className="border-b border-white/5 bg-[#0B0D12]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1500px' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow badgeTextClassName="text-emerald-300">
            Pricing
          </SectionEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            GPT Image 2 Studio pricing
          </h2>
          <p className="mt-4 text-zinc-300">
            Choose the perfect plan for your AI image creation needs.
          </p>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-2xl rounded-xl border border-emerald-400/20 bg-[#081915]/80 p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          {pricingBillingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={pricingBilling === option.value}
              onClick={() => setPricingBilling(option.value)}
              className={`relative flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg px-2 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none md:text-base ${
                pricingBilling === option.value
                  ? `bg-gradient-to-r ${palette.accent} text-white shadow-lg shadow-cyan-950/40`
                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
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
          <span className="inline-flex items-center gap-2 text-base font-semibold text-white">
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
                  ? 'border-emerald-500/50 bg-[#0b2517] shadow-2xl shadow-emerald-950/25 ring-1 ring-emerald-400/25'
                  : 'border-white/10 bg-[#090e1a] hover:border-white/20'
              }`}
            >
              {plan.featured && (
                <span
                  className={`absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-gradient-to-r ${palette.accent} px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase`}
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
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                >
                  {plan.featured ? (
                    <Crown className="size-6" />
                  ) : (
                    <Zap className="size-6" />
                  )}
                </span>
                <h3 className="text-xl font-black text-white">
                  {plan.name}
                </h3>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-baseline gap-2">
                  {plan.originalPrice && (
                    <span className="text-base font-black text-zinc-400 line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span
                    className={`text-4xl font-black tracking-tight ${
                      plan.featured
                        ? `bg-gradient-to-r ${palette.accent} bg-clip-text text-transparent`
                        : 'text-white'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-base font-bold text-zinc-400">
                    {plan.unit}
                  </span>
                </div>
                {(plan.annualPrice || plan.discountLabel) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {plan.annualPrice && (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
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
                <p className="mt-5 text-sm font-semibold text-zinc-400 underline decoration-dotted underline-offset-4">
                  {plan.creditValue}
                </p>
              </div>
              <p className="mt-5 min-h-16 text-sm leading-6 text-zinc-300">
                {plan.description}
              </p>
              <Link
                href="/pricing"
                className={`mt-6 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-black transition ${
                  plan.featured
                    ? `bg-gradient-to-r ${palette.accent} text-white hover:brightness-110`
                    : 'border border-zinc-300/30 bg-zinc-100 text-zinc-950 hover:bg-white'
                }`}
              >
                {plan.cta}
                <Zap className="size-4 fill-current" />
              </Link>
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-black text-white">
                  {plan.credits}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-400">
                  {plan.billingNote}
                </p>
                <ul className="mt-5 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-zinc-300"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
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
