import { MetadataRoute } from 'next';

import { postsSource } from '@/core/docs/source';
import { envConfigs } from '@/config';
import { getClusterSlugs } from '@/shared/blocks/gptimage2studio/clusters-helpers';

const STATIC_PATHS: {
  path: string;
  lastModified: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}[] = [
  {
    path: '/',
    lastModified: '2026-04-28',
    priority: 1.0,
    changeFrequency: 'weekly',
  },
  {
    path: '/pricing',
    lastModified: '2026-04-28',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  {
    path: '/gpt-image-2-prompts',
    lastModified: '2026-04-28',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  {
    path: '/blog',
    lastModified: '2026-04-28',
    priority: 0.8,
    changeFrequency: 'weekly',
  },
];

const CLUSTER_PATHS: typeof STATIC_PATHS = getClusterSlugs().map((slug) => ({
  path: `/gpt-image-2-prompts/${slug}`,
  lastModified: '2026-04-28',
  priority: 0.8,
  changeFrequency: 'weekly',
}));

function toSitemapDate(date: string | undefined, fallback = '2026-04-28') {
  const parsedDate = new Date(date || fallback);
  return Number.isNaN(parsedDate.getTime()) ? new Date(fallback) : parsedDate;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = envConfigs.app_url.replace(/\/$/, '');

  const staticEntries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS,
    ...CLUSTER_PATHS,
  ].map((item) => ({
    url: `${appUrl}${item.path}`,
    lastModified: toSitemapDate(item.lastModified),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // Enumerate posts via fumadocs source (bundled at build time, works on
  // Cloudflare Workers — fs.readdirSync on process.cwd() does not).
  const blogEntries: MetadataRoute.Sitemap = postsSource
    .getPages(envConfigs.locale || 'en')
    .map((page) => {
      const frontmatter = page.data as {
        created_at?: string;
        updated_at?: string;
      };

      return {
        url: `${appUrl}/blog/${page.slugs.join('/')}`,
        lastModified: toSitemapDate(
          frontmatter.updated_at || frontmatter.created_at
        ),
        changeFrequency: 'monthly',
        priority: 0.7,
      };
    });

  return [...staticEntries, ...blogEntries];
}
