#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(join(__dirname, '..', '..', '..'));
const CLUSTER_DIR = join(ROOT, '.claude', 'sop-data', 'clusters');
const OUT_FILE = join(ROOT, 'src', 'shared', 'blocks', 'gptimage2studio', 'clusters.ts');

function parseJsonl(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function normalizePath(path) {
  if (!path || path === '/') return '/';
  return path.replace(/\/+$/, '');
}

function pickSpec(spec) {
  const urlPath = normalizePath(spec.url_path);
  const parentUrl = normalizePath(spec.parent_url);

  return {
    slug: spec.slug,
    routeSegment: spec.url_path.split('/').filter(Boolean).at(-1),
    urlPath,
    parentUrl,
    breadcrumb: spec.breadcrumb.map((item) => ({
      ...item,
      href: normalizePath(item.href),
    })),
    tdh: spec.tdh,
    seo: spec.seo,
    hTree: spec.h_tree,
    hero: spec.hero,
    subScenes: spec.sub_scenes,
    promptPack: spec.prompt_pack,
    howTo: spec.how_to,
    variations: spec.variations,
    troubleshooting: spec.troubleshooting,
    faq: spec.faq,
    relatedClusters: spec.related_clusters.map((item) => ({
      ...item,
      href: normalizePath(item.href),
    })),
  };
}

const finalClusters = JSON.parse(readFileSync(join(CLUSTER_DIR, 'clusters.final.json'), 'utf8'));
const clusters = finalClusters.map((cluster) => {
  const spec = pickSpec(JSON.parse(readFileSync(join(CLUSTER_DIR, cluster.slug, 'spec.json'), 'utf8')));
  const prompts = parseJsonl(join(CLUSTER_DIR, cluster.slug, 'prompts.jsonl'));
  const media = parseJsonl(join(CLUSTER_DIR, cluster.slug, 'media.public.jsonl'));
  const mediaByPrompt = new Map(media.map((item) => [item.prompt_id, item]));

  return {
    ...spec,
    label: spec.breadcrumb.at(-1)?.label || cluster.h1.replace(/^GPT Image 2 Prompts? for /, ''),
    prompts: prompts.map((prompt) => {
      const image = mediaByPrompt.get(prompt.prompt_id);
      if (!image) throw new Error(`Missing media for ${prompt.prompt_id}`);

      return {
        id: prompt.prompt_id,
        title: prompt.title,
        category: spec.breadcrumb.at(-1)?.label || 'GPT Image 2 Prompt',
        image: image.image,
        imageAlt: image.alt,
        imageWidth: image.width,
        imageHeight: image.height,
        prompt: prompt.final_prompt,
        fullPrompt: prompt.final_prompt,
        href: spec.urlPath,
        subSceneTag: prompt.sub_scene_tag,
      };
    }),
  };
});

const source = `import { type PromptCard } from './content';

export type PromptClusterPrompt = PromptCard & {
  id: string;
  imageAlt: string;
  imageWidth: number | null;
  imageHeight: number | null;
  subSceneTag: string;
};

export type PromptCluster = {
  slug: string;
  routeSegment: string;
  urlPath: string;
  parentUrl: string;
  label: string;
  breadcrumb: Array<{ label: string; href: string }>;
  tdh: {
    title: string;
    description: string;
    h1: string;
  };
  seo: {
    primary_query: string;
    query_variants: string[];
    related_searches: string[];
    intent_grade: string;
    kd_estimate: number;
    search_intent: string;
    launch_batch: number;
    schema_types: string[];
    indexable: boolean;
  };
  hTree: Array<{ level: string; text: string }>;
  hero: {
    eyebrow: string;
    intro: string;
    primary_cta: { label: string; href: string; behavior: string };
    secondary_cta: { label: string; href: string };
    visual_strategy: string;
  };
  subScenes: Array<{
    slug: string;
    label: string;
    anchor: string;
    search_modifier: string;
    user_intent: string;
    prompt_count_target: number;
    visual_brief: string;
  }>;
  promptPack: Array<{
    label: string;
    prompt_count_target: number;
    description: string;
    sub_scene_slugs: string[];
  }>;
  howTo: Array<{ heading: string; body: string }>;
  variations: Array<{ label: string; instruction: string }>;
  troubleshooting: Array<{ problem: string; fix: string }>;
  faq: Array<{ question: string; answer_intent: string }>;
  relatedClusters: Array<{
    slug: string;
    label: string;
    href: string;
    relationship: string;
  }>;
  prompts: PromptClusterPrompt[];
};

export const promptClusters = ${JSON.stringify(clusters, null, 2)} satisfies PromptCluster[];

export const promptClusterRouteSegments = promptClusters.map(
  (cluster) => cluster.routeSegment
);

export function getPromptClusterBySlug(slug: string) {
  return promptClusters.find((cluster) => cluster.slug === slug);
}

export function getPromptClusterByRouteSegment(routeSegment: string) {
  return promptClusters.find((cluster) => cluster.routeSegment === routeSegment);
}

export function getPromptClusterByLegacyPromptSlug(promptSlug: string) {
  const prompt = promptClusters
    .flatMap((cluster) =>
      cluster.prompts.map((item) => ({ cluster, item }))
    )
    .find(({ item }) => item.id === promptSlug);

  return prompt?.cluster || promptClusters[0];
}
`;

writeFileSync(OUT_FILE, source);

console.log(JSON.stringify({
  clusters: clusters.length,
  prompts: clusters.reduce((sum, cluster) => sum + cluster.prompts.length, 0),
  output: OUT_FILE,
}, null, 2));
