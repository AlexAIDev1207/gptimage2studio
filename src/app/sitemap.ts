import { MetadataRoute } from 'next';

import { postsSource } from '@/core/docs/source';
import { envConfigs } from '@/config';
import { getClusterSlugs } from '@/shared/blocks/gptimage2studio/clusters-helpers';

const STATIC_PATHS: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/gpt-image-2-prompts', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
];

const CLUSTER_PATHS: typeof STATIC_PATHS = getClusterSlugs().map((slug) => ({
  path: `/gpt-image-2-prompts/${slug}`,
  priority: 0.8,
  changeFrequency: 'weekly',
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = envConfigs.app_url.replace(/\/$/, '');
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [...STATIC_PATHS, ...CLUSTER_PATHS].map((item) => ({
    url: `${appUrl}${item.path}`,
    lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // Enumerate posts via fumadocs source (bundled at build time, works on
  // Cloudflare Workers — fs.readdirSync on process.cwd() does not).
  const blogEntries: MetadataRoute.Sitemap = postsSource
    .getPages(envConfigs.locale || 'en')
    .map((page) => ({
      url: `${appUrl}/blog/${page.slugs.join('/')}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...staticEntries, ...blogEntries];
}
