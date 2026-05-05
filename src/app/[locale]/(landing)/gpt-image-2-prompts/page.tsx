import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { ClustersOverviewPage } from '@/shared/blocks/gptimage2studio/clusters-overview-page';
import {
  getAllClusters,
  getClusterStats,
} from '@/shared/blocks/gptimage2studio/clusters-helpers';
import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'GPT Image 2 Prompts — 130 Tested Templates Across 10 Use Cases',
  description:
    'Copy-paste GPT Image 2 prompts for action figures, old photo restoration, Instagram edits, stickers, YouTube thumbnails, posters, infographics and more. 130 tested templates ready to use.',
  canonicalUrl: '/gpt-image-2-prompts',
});

export default async function GptImage2PromptsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appUrl = envConfigs.app_url.replace(/\/$/, '');
  const clusters = getAllClusters();
  const stats = getClusterStats();

  // CollectionPage JSON-LD
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'GPT Image 2 Prompts',
    description: `${stats.totalPrompts} tested GPT Image 2 prompt templates across ${stats.totalClusters} use cases.`,
    url: `${appUrl}/gpt-image-2-prompts`,
    hasPart: clusters.map((c) => ({
      '@type': 'CollectionPage',
      name: c.spec.h1,
      url: `${appUrl}/gpt-image-2-prompts/${c.spec.slug}`,
    })),
  };

  // FAQPage JSON-LD（与组件内 FAQ 同步）
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        q: 'How is GPT Image 2 different from Midjourney or Stable Diffusion?',
        a: 'GPT Image 2 has three clear advantages: (1) pixel-level text rendering — readable poster titles and infographic labels in one generation, (2) cross-image consistency — same character or product across multiple frames, (3) strong image-to-image identity preservation. Use Midjourney for pure aesthetic; use GPT Image 2 when text, identity, or product accuracy matters.',
      },
      {
        q: 'Can I use these prompts commercially?',
        a: 'Yes — generated images are typically usable for commercial purposes (review your Studio plan terms for specifics). The prompt templates are derived from community sources and curated. We replace any specific celebrity or brand names with placeholders so your output is unique to you.',
      },
      {
        q: 'What is the {argument} syntax I see in some prompts?',
        a: 'Some prompts include placeholders like {argument name="product name" default="laptop"}. In the Workbench, these become editable input fields — change the value and the prompt updates automatically.',
      },
      {
        q: 'Are these prompts free to use?',
        a: 'All prompt templates are free to copy and adapt. Generation requires Studio credits — new users get a free trial allowance. 1K resolution costs 6 credits, 2K costs 10 credits.',
      },
      {
        q: "What's the difference between text-to-image and image-to-image prompts?",
        a: 'Text-to-image prompts (poster, infographic, food shot) generate from scratch. Image-to-image prompts (action figure, sticker, photo restore, cinematic portrait) need you to upload a reference photo — the model preserves the identity while applying the new style.',
      },
      {
        q: 'Why are some prompts JSON and others plain text?',
        a: 'Complex compositions (infographics, posters, thumbnails, product shots) use a structured JSON format that gives the model clearer instructions for layout, text positioning, and components. Simpler prompts use natural language.',
      },
    ].map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <ClustersOverviewPage />
    </>
  );
}
