'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Crown,
  Flame,
  Gift,
  Loader2,
  Menu,
  Sparkles,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { PaymentModal } from '@/shared/blocks/payment/payment-modal';
import { AnimatedThemeToggler } from '@/shared/components/magicui/animated-theme-toggler';
import { useAppContext } from '@/shared/contexts/app';
import { getCookie } from '@/shared/lib/cookie';
import { cn } from '@/shared/lib/utils';
import type { PricingItem } from '@/shared/types/blocks/pricing';

import {
  creditPacks,
  launchOffer,
  pricingFaqs,
  pricingPlansByBilling,
  promoBar,
  type PricingBilling,
  type PricingPlan,
} from './content';

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
};

const pricingNav = [
  { label: 'Generator', href: '/#workbench' },
  { label: 'Prompts', href: '/#prompts' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
];

const billingOptions: { value: PricingBilling; label: string; note?: string }[] =
  [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly', note: 'Save 50%' },
    { value: 'packs', label: 'Credits Packs' },
  ];

const initialCountdown: CountdownValue = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  ended: false,
};

function getCountdownValue(): CountdownValue {
  const diff = new Date(launchOffer.endsAt).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    ended: false,
  };
}

function getCreditsAmount(plan: PricingPlan) {
  const match = plan.credits.replace(/,/g, '').match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getPricingItem(plan: PricingPlan): PricingItem | null {
  if (!plan.productId || !plan.amount || !plan.interval) {
    return null;
  }

  return {
    title: plan.name,
    description: plan.description,
    currency: 'USD',
    amount: plan.amount,
    price: plan.price,
    original_price: plan.originalPrice,
    unit: plan.unit,
    features_title: plan.name.includes('Credits')
      ? 'Top-up includes'
      : 'Plan includes',
    features: plan.features,
    interval: plan.interval,
    product_id: plan.productId,
    product_name: `GPT Image 2 Studio ${plan.name}`,
    credits: getCreditsAmount(plan),
    valid_days: plan.validDays,
    plan_name: plan.name,
    group: plan.interval === 'one-time' ? 'packs' : plan.interval,
    button: {
      title: plan.cta,
      url: '/pricing',
      icon: 'RiFlashlightFill',
    },
  };
}

export default function GptImagePricingPage({ locale }: { locale: string }) {
  const {
    user,
    configs,
    setIsShowSignModal,
    setIsShowPaymentModal,
  } = useAppContext();
  const [promoOpen, setPromoOpen] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [billing, setBilling] = useState<PricingBilling>('yearly');
  const [countdown, setCountdown] =
    useState<CountdownValue>(initialCountdown);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [pricingItem, setPricingItem] = useState<PricingItem | null>(null);

  const visiblePlans =
    billing === 'packs' ? creditPacks : pricingPlansByBilling[billing];

  useEffect(() => {
    setCountdown(getCountdownValue());

    const timer = window.setInterval(() => {
      setCountdown(getCountdownValue());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const offerStats = useMemo(
    () => [
      ['H', countdown.hours],
      ['M', countdown.minutes],
      ['S', countdown.seconds],
    ],
    [countdown]
  );

  const handleStartFree = () => {
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    window.location.href = '/#workbench';
  };

  const getAffiliateMetadata = ({
    paymentProvider,
  }: {
    paymentProvider: string;
  }) => {
    const affiliateMetadata: Record<string, string> = {};

    if (
      configs.affonso_enabled === 'true' &&
      ['stripe', 'creem'].includes(paymentProvider)
    ) {
      affiliateMetadata.affonso_referral = getCookie('affonso_referral') || '';
    }

    if (
      configs.promotekit_enabled === 'true' &&
      ['stripe'].includes(paymentProvider)
    ) {
      affiliateMetadata.promotekit_referral =
        typeof window !== 'undefined' && (window as any).promotekit_referral
          ? (window as any).promotekit_referral
          : getCookie('promotekit_referral') || '';
    }

    return affiliateMetadata;
  };

  const handleCheckout = async (
    item: PricingItem,
    paymentProvider?: string
  ) => {
    try {
      if (!user) {
        setIsShowSignModal(true);
        return;
      }

      setIsLoading(true);
      setLoadingProductId(item.product_id);

      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.product_id,
          currency: item.currency,
          locale: locale || 'en',
          payment_provider: paymentProvider || '',
          metadata: getAffiliateMetadata({
            paymentProvider: paymentProvider || '',
          }),
        }),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setLoadingProductId(null);
        setIsShowSignModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`request failed with status ${response.status}`);
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        throw new Error(message);
      }

      if (!data?.checkoutUrl) {
        throw new Error('checkout url not found');
      }

      window.location.href = data.checkoutUrl;
    } catch (error: any) {
      toast.error(`Checkout failed: ${error.message}`);
      setIsLoading(false);
      setLoadingProductId(null);
    }
  };

  const handlePlanAction = (plan: PricingPlan) => {
    if (!plan.productId) {
      handleStartFree();
      return;
    }

    const item = getPricingItem(plan);
    if (!item) {
      toast.error('Pricing item is not ready');
      return;
    }

    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    if (configs.select_payment_enabled === 'true') {
      setPricingItem(item);
      setIsShowPaymentModal(true);
      return;
    }

    handleCheckout(item, configs.default_payment_provider);
  };

  return (
    <div className="min-h-screen bg-[#050606] text-zinc-200 antialiased selection:bg-cyan-400/30 selection:text-white">
      {promoOpen && (
        <div className="relative border-b border-amber-300/70 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-zinc-950 shadow-[0_8px_24px_rgba(250,204,21,0.18)]">
          <Link
            href={promoBar.href}
            className="block pr-10 transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-zinc-950/40 focus-visible:outline-none"
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
            aria-label="Close promo bar"
            onClick={() => setPromoOpen(false)}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-zinc-700/70 hover:bg-zinc-950/10 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950/40 focus-visible:outline-none"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/20">
                <Sparkles className="size-4" />
              </span>
              <span className="text-sm font-semibold text-white sm:text-base">
                GPT Image 2 Studio
              </span>
            </Link>
            <nav className="hidden items-center gap-6 lg:flex">
              {pricingNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-zinc-400 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedThemeToggler className="inline-flex size-9 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/10 hover:text-white [&_svg]:size-4" />
            {user ? (
              <a
                href="#plans"
                className="hidden min-h-9 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10 sm:inline-flex"
              >
                Top Up Credits
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setIsShowSignModal(true)}
                className="hidden min-h-9 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100 sm:inline-flex"
              >
                Get 20 Free Credits
              </button>
            )}
            <button
              className="rounded-md p-2 text-zinc-300 hover:bg-white/10 lg:hidden"
              aria-label="Toggle navigation"
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="border-t border-white/5 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {pricingNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className="rounded-md px-2 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setNavOpen(false);
                  user
                    ? (window.location.href = '#plans')
                    : setIsShowSignModal(true);
                }}
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
              >
                {user ? 'Top Up Credits' : 'Get 20 Free Credits'}
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="px-4 pt-8 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl border border-amber-400/35 bg-[radial-gradient(circle_at_40%_0%,rgba(245,158,11,0.20),transparent_34%),linear-gradient(110deg,rgba(24,24,27,0.98),rgba(13,14,18,0.98))] px-5 py-6 shadow-2xl shadow-amber-950/25 md:grid-cols-[auto_auto] md:items-center md:justify-center md:gap-16 md:px-8 md:py-8 lg:gap-24 xl:gap-36">
            <div>
              <div className="text-base font-bold text-amber-100 md:text-lg">
                🎉 Congrats! You&apos;ve unlocked special pricing
              </div>
              <div className="mt-4 text-3xl font-black tracking-tight text-[#ffd000] sm:text-4xl md:text-5xl">
                {countdown.ended ? 'OFFER ENDED' : launchOffer.title}
              </div>
            </div>

            <div className="md:min-w-[300px]">
              <div className="mb-3 text-center text-xs font-black tracking-[0.35em] text-amber-400 uppercase">
                Ends in
              </div>
              <div className="flex items-start justify-center gap-2 sm:gap-4">
                {offerStats.map(([label, value], index) => (
                  <div key={label} className="flex items-start gap-2 sm:gap-4">
                    <div>
                      <div className="flex h-14 w-16 items-center justify-center rounded-xl border border-amber-400/20 bg-white/[0.04] font-mono text-2xl font-black text-[#ffd000] shadow-[0_0_45px_rgba(250,204,21,0.10)] tabular-nums sm:h-16 sm:w-20 sm:text-3xl">
                        {String(value).padStart(2, '0')}
                      </div>
                      <div className="mt-3 text-center text-xs font-bold tracking-wider text-zinc-500 uppercase">
                        {label}
                      </div>
                    </div>
                    {index < offerStats.length - 1 && (
                      <span className="pt-3 text-2xl font-black text-amber-500/50 sm:pt-4">
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="mx-auto max-w-5xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl">
              GPT Image 2 Studio pricing
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-zinc-400 md:text-base">
              Choose the perfect plan for your AI image creation needs.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-2xl rounded-xl border border-emerald-400/20 bg-[#081915]/80 p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
              {billingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={billing === option.value}
                  onClick={() => setBilling(option.value)}
                  className={cn(
                    'relative flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg px-2 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none md:text-base',
                    billing === option.value
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  )}
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

            <div className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-white">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Cancel anytime
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-7xl gap-5 lg:grid-cols-3">
            {visiblePlans.map((plan) => (
              <PlanCard
                key={`${billing}-${plan.name}`}
                plan={plan}
                isLoading={isLoading && loadingProductId === plan.productId}
                onAction={() => handlePlanAction(plan)}
              />
            ))}
          </div>
        </section>

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl text-center">
            <span className="inline-flex min-h-8 items-center rounded-lg bg-emerald-100 px-4 text-sm font-bold text-emerald-700">
              FAQ
            </span>
            <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-emerald-100 md:text-4xl">
              Frequently Asked Questions About GPT Image 2 Studio Payments
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
              Have more questions about GPT Image 2 Studio payments? Contact
              our support team for help.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl space-y-4">
            {pricingFaqs.map((item, index) => (
              <article
                key={item.q}
                className="grid gap-4 rounded-2xl border border-white/10 bg-[#0d1320] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:grid-cols-[56px_1fr] md:p-6"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/70 to-cyan-500/50 text-base font-black text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white md:text-lg">{item.q}</h3>
                  <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-400 md:text-base md:leading-7">
                    {item.a}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8 md:pb-24">
          <div className="mx-auto max-w-7xl rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 px-6 py-14 text-center shadow-[0_0_40px_rgba(16,185,129,0.35)] md:px-10 md:py-20">
            <h2 className="mx-auto max-w-4xl text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              Transform Your Creative Workflow with GPT Image 2 Studio
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
              Experience the future of AI image generation and editing. Start
              creating with GPT Image 2 Studio today.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleStartFree}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-emerald-700 shadow-lg shadow-zinc-950/15 transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                Try GPT Image 2 Now
              </button>
              <a
                href="#plans"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-zinc-800/70 px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                View Pricing
              </a>
            </div>
          </div>
        </section>
      </main>

      <PaymentModal
        isLoading={isLoading}
        pricingItem={pricingItem}
        onCheckout={(item, paymentProvider) =>
          handleCheckout(item, paymentProvider)
        }
      />
    </div>
  );
}

function PlanCard({
  plan,
  isLoading,
  onAction,
}: {
  plan: PricingPlan;
  isLoading: boolean;
  onAction: () => void;
}) {
  const featured = Boolean(plan.featured);

  return (
    <article
      className={cn(
        'relative flex min-h-[480px] flex-col overflow-visible rounded-2xl border p-5 transition md:p-6',
        featured
          ? 'border-emerald-500/60 bg-[#092316] shadow-[0_0_55px_rgba(16,185,129,0.20)] ring-1 ring-emerald-400/25'
          : 'border-white/10 bg-[#090e1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/20'
      )}
    >
      {plan.badge && (
        <span className="absolute -top-4 left-1/2 inline-flex min-h-8 -translate-x-1/2 items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 text-xs font-bold text-white shadow-lg shadow-cyan-950/35">
          <Crown className="size-3.5" />
          {plan.badge}
        </span>
      )}

      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl',
            featured
              ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'
              : 'bg-emerald-500/15 text-emerald-500'
          )}
        >
          {plan.icon === 'crown' ? (
            <Crown className="size-6" />
          ) : (
            <Zap className="size-6" />
          )}
        </div>
        <h3
          className={cn(
            'text-lg font-black text-white md:text-xl',
            featured && 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
          )}
        >
          {plan.name}
        </h3>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-baseline gap-2">
          {plan.originalPrice && (
            <span className="text-base font-black text-zinc-500 line-through">
              {plan.originalPrice}
            </span>
          )}
          <span
            className={cn(
              'text-3xl font-black tracking-tight text-white md:text-4xl',
              featured &&
                'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
            )}
          >
            {plan.price}
          </span>
          {plan.unit && (
            <span className="text-base font-black text-zinc-400">
              {plan.unit}
            </span>
          )}
        </div>

        {(plan.annualPrice || plan.discountLabel) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {plan.annualPrice && (
              <span className="inline-flex min-h-8 items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 text-xs font-black text-emerald-400">
                {plan.annualPrice}
              </span>
            )}
            {plan.discountLabel && (
              <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-600 px-3 text-xs font-black text-amber-100">
                <Flame className="size-3 fill-amber-200 text-amber-200" />
                {plan.discountLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 text-sm font-semibold text-zinc-400 underline decoration-dotted underline-offset-4">
        {plan.creditValue}
      </div>
      <p className="mt-5 min-h-16 text-sm leading-6 text-zinc-400">
        {plan.description}
      </p>

      <button
        type="button"
        onClick={onAction}
        disabled={isLoading}
        className={cn(
          'mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60',
          featured
            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-950/35 hover:brightness-110 focus-visible:ring-emerald-200'
            : 'border border-zinc-300/30 bg-zinc-100 text-zinc-950 hover:bg-white focus-visible:ring-cyan-300'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Processing
          </>
        ) : (
          <>
            {plan.cta}
            <Zap className="size-5 fill-current" />
          </>
        )}
      </button>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="text-sm font-black text-white">{plan.credits}</div>
        <div className="mt-1 text-sm font-medium text-zinc-500">
          {plan.billingNote}
        </div>
        <ul className="mt-5 space-y-3 text-sm">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-zinc-300">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
