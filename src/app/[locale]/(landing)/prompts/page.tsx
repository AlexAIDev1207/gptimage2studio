import { setRequestLocale } from 'next-intl/server';

import PromptsListPageClient from '@/shared/blocks/gptimage2studio/prompts-list-page';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.prompts.metadata',
  canonicalUrl: '/prompts',
});

export default async function PromptsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PromptsListPageClient />;
}
