import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import HomePage from '@/shared/blocks/gptimage2studio/home-page';
import { faqs } from '@/shared/blocks/gptimage2studio/content';

const SITE_URL = 'https://gptimage2studio.com';

export const metadata: Metadata = {
  title: 'GPT Image 2 Studio - AI Image Generator and Editor Online',
  description:
    'Create and edit images with GPT Image 2 Studio. Explore GPT Image 2 and Nano Banana prompts for product photos, posters, ads, infographics, UI mockups, and text-rich visuals.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'GPT Image 2 Studio - AI Image Generator and Editor Online',
    description:
      'Prompt-first AI image generator and editor for product photos, posters, social ads, infographics, UI mockups, and text-rich visuals.',
    url: SITE_URL,
    siteName: 'GPT Image 2 Studio',
    images: [
      {
        url: '/imgs/gptimage2studio/png/workbench-primary-hydra-glow-serum.webp',
        width: 1200,
        height: 800,
        alt: 'GPT Image 2 Studio workbench preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPT Image 2 Studio - AI Image Generator and Editor Online',
    description:
      'Prompt-first AI image generator and editor for product, marketing, and content visuals.',
  },
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GPT Image 2 Studio',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description:
      'Create and edit product photos, posters, social ads, infographics, UI mockups, and text-rich visuals with prompt-first AI image workflows.',
  };

  const faqSchema = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage variant="A" />
    </>
  );
}
