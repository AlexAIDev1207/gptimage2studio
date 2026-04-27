import { setRequestLocale } from 'next-intl/server';

import GptImagePricingPage from '@/shared/blocks/gptimage2studio/pricing-page';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.pricing.metadata',
  canonicalUrl: '/pricing',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GptImagePricingPage locale={locale} />;
}
