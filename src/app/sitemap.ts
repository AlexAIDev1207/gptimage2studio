import fs from 'node:fs';
import path from 'node:path';

import { MetadataRoute } from 'next';

import { envConfigs } from '@/config';
import { promptCards } from '@/shared/blocks/gptimage2studio/content';

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/prompts', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
];

function listBlogSlugs(): string[] {
  const dir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx') && !file.endsWith('.zh.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = envConfigs.app_url.replace(/\/$/, '');
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((item) => ({
    url: `${appUrl}${item.path}`,
    lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = listBlogSlugs().map((slug) => ({
    url: `${appUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const promptEntries: MetadataRoute.Sitemap = promptCards
    .filter((card) => typeof card.href === 'string' && card.href.startsWith('/prompts/'))
    .map((card) => ({
      url: `${appUrl}${card.href}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticEntries, ...blogEntries, ...promptEntries];
}
