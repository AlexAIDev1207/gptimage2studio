import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { ClusterHubPage } from '@/shared/blocks/gptimage2studio/cluster-hub-page';
import {
  getCluster,
  getClusterSlugs,
  getClusterUrl,
} from '@/shared/blocks/gptimage2studio/clusters-helpers';

export const revalidate = 3600;

export function generateStaticParams() {
  return getClusterSlugs().map((slug) => ({ cluster: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string; locale: string }>;
}): Promise<Metadata> {
  const { cluster: slug } = await params;
  const cluster = getCluster(slug);
  if (!cluster) return {};

  const canonical = getClusterUrl(slug);
  return {
    title: cluster.spec.meta_title,
    description: cluster.spec.meta_description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: cluster.spec.meta_title,
      description: cluster.spec.meta_description,
    },
    twitter: {
      card: 'summary_large_image',
      title: cluster.spec.meta_title,
      description: cluster.spec.meta_description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ClusterRoute({
  params,
}: {
  params: Promise<{ cluster: string; locale: string }>;
}) {
  const { cluster: slug, locale } = await params;
  setRequestLocale(locale);

  const cluster = getCluster(slug);
  if (!cluster) notFound();

  const appUrl = envConfigs.app_url.replace(/\/$/, '');
  const url = `${appUrl}${getClusterUrl(slug)}`;

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: appUrl + '/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Prompts',
        item: `${appUrl}/gpt-image-2-prompts`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cluster.spec.h1.replace(' for GPT Image 2', ''),
        item: url,
      },
    ],
  };

  // FAQPage JSON-LD
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cluster.spec.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  // CollectionPage with WebApplication mainEntity
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cluster.spec.h1,
    description: cluster.spec.meta_description,
    url,
    mainEntity: {
      '@type': 'WebApplication',
      name: cluster.spec.h1,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
    },
    hasPart: cluster.prompts.slice(0, 12).map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      image: p.final_image_url
        ? `${appUrl}${p.final_image_url}`
        : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <ClusterHubPage cluster={cluster} />
    </>
  );
}
