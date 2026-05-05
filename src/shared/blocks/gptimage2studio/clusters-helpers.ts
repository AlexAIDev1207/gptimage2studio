// Cluster 数据访问辅助函数。
// 数据来自编译期生成的 clusters-data.ts。
// 业务代码统一从这里 import，避免直接依赖 clusters-data.ts 文件结构。

import {
  ALL_CLUSTERS,
  CLUSTER_ORDER,
  PROMPT_CLUSTERS,
  type Cluster,
  type ClusterSpec,
  type ClusterTier,
  type FaqItem,
  type InternalLink,
  type PromptItem,
  type StepItem,
  type SubScene,
  type TipItem,
  type UseCaseItem,
} from './clusters-data';

export type {
  Cluster,
  ClusterSpec,
  ClusterTier,
  FaqItem,
  InternalLink,
  PromptItem,
  StepItem,
  SubScene,
  TipItem,
  UseCaseItem,
};

/** 按 slug 取 cluster，找不到返回 null */
export function getCluster(slug: string): Cluster | null {
  return PROMPT_CLUSTERS[slug] ?? null;
}

/** 所有 P0 cluster（按 P0-1 → P0-10 顺序） */
export function getAllClusters(): Cluster[] {
  return ALL_CLUSTERS;
}

/** 所有 cluster slug（generateStaticParams 用） */
export function getClusterSlugs(): string[] {
  return [...CLUSTER_ORDER];
}

/** 该 cluster 的内链目标 cluster（用于 Related Prompt Clusters section） */
export function findRelatedClusters(slug: string): Cluster[] {
  const cluster = getCluster(slug);
  if (!cluster) return [];
  return cluster.spec.internal_links
    .map((link) => getCluster(link.to))
    .filter((c): c is Cluster => c !== null);
}

/** 按 sub_scene 分组 prompts，sub_scene 顺序与 spec 一致；未分配的归到 _other */
export function groupPromptsBySubScene(
  cluster: Cluster,
): Array<{ subScene: SubScene | null; prompts: PromptItem[] }> {
  const groups: Array<{ subScene: SubScene | null; prompts: PromptItem[] }> = [];
  for (const ss of cluster.spec.sub_scenes) {
    groups.push({ subScene: ss, prompts: [] });
  }
  const otherGroup = { subScene: null as SubScene | null, prompts: [] as PromptItem[] };
  for (const prompt of cluster.prompts) {
    const tag = prompt.sub_scene_tag;
    const found = groups.find((g) => g.subScene?.slug_anchor === tag);
    if (found) {
      found.prompts.push(prompt);
    } else {
      otherGroup.prompts.push(prompt);
    }
  }
  if (otherGroup.prompts.length > 0) groups.push(otherGroup);
  return groups.filter((g) => g.prompts.length > 0);
}

/** 按 tier 分组 cluster（总入口页 grid 用） */
export function groupClustersByTier(): Record<ClusterTier, Cluster[]> {
  const out: Record<ClusterTier, Cluster[]> = {
    viral: [],
    commercial: [],
    creative: [],
  };
  for (const c of ALL_CLUSTERS) {
    out[c.spec.tier].push(c);
  }
  return out;
}

/** Cluster URL（保持与 sitemap / 路由一致） */
export function getClusterUrl(slug: string): string {
  return `/gpt-image-2-prompts/${slug}`;
}

export const PROMPTS_HUB_URL = '/gpt-image-2-prompts';

/** 解析 prompt 文本里的 {argument name="X" default="Y"} 占位符 */
export type PromptArgument = {
  name: string;
  default: string;
  position: number;
};

const ARGUMENT_PATTERN =
  /\{argument\s+name=["']([^"']+)["']\s+default=["']([^"']*)["']\s*\}/g;

export function extractArguments(prompt: string): PromptArgument[] {
  const out: PromptArgument[] = [];
  const seen = new Set<string>();
  ARGUMENT_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ARGUMENT_PATTERN.exec(prompt)) !== null) {
    const name = match[1];
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, default: match[2] ?? '', position: match.index });
  }
  return out;
}

/** 用用户填的值替换 {argument} 占位符；缺失字段使用 default */
export function applyArguments(
  prompt: string,
  values: Record<string, string>,
): string {
  ARGUMENT_PATTERN.lastIndex = 0;
  return prompt.replace(ARGUMENT_PATTERN, (_match, name, def) => {
    const filled = values[name];
    return (filled ?? def ?? '').toString();
  });
}

/** 提取「干净的」prompt（用 default 值填好所有 argument），用作 Copy 按钮内容 */
export function getCleanPrompt(prompt: string): string {
  return applyArguments(prompt, {});
}

/** Cluster 三档 tier 的展示样式 — 与现有 home-theme palette 对齐（dark-first） */
export const TIER_STYLE: Record<
  ClusterTier,
  {
    label: string;
    accentText: string; // 渐变文字（cluster 标题强调用）
    accentBg: string; // CTA 按钮
    badge: string; // 卡片右上角小标签
    border: string; // 卡片描边/glow
    glow: string; // 模块背景柔光
  }
> = {
  viral: {
    label: 'Viral Trend',
    accentText: 'from-rose-300 via-pink-300 to-orange-300',
    accentBg: 'bg-rose-500 hover:bg-rose-400 text-zinc-950',
    badge:
      'border-rose-400/30 bg-rose-500/15 text-rose-300',
    border: 'ring-rose-400/30',
    glow: 'bg-rose-500/15',
  },
  commercial: {
    label: 'Commercial',
    accentText: 'from-emerald-300 via-teal-300 to-cyan-300',
    accentBg: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
    badge:
      'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
    border: 'ring-emerald-400/30',
    glow: 'bg-emerald-500/15',
  },
  creative: {
    label: 'Creative',
    accentText: 'from-violet-300 via-fuchsia-300 to-indigo-300',
    accentBg: 'bg-violet-500 hover:bg-violet-400 text-white',
    badge:
      'border-violet-400/30 bg-violet-500/15 text-violet-300',
    border: 'ring-violet-400/30',
    glow: 'bg-violet-500/15',
  },
};

/** Cluster 统计（总入口页头部展示用） */
export function getClusterStats() {
  const byTier = groupClustersByTier();
  const totalPrompts = ALL_CLUSTERS.reduce((s, c) => s + c.prompts.length, 0);
  return {
    totalClusters: ALL_CLUSTERS.length,
    totalPrompts,
    byTier: {
      viral: byTier.viral.length,
      commercial: byTier.commercial.length,
      creative: byTier.creative.length,
    },
  };
}

/** 给 cluster 卡片选一张代表图（用第一个 prompt 的 final_image_url） */
export function getClusterCoverImage(cluster: Cluster): {
  url: string;
  width: number;
  height: number;
} | null {
  const first = cluster.prompts[0];
  if (!first || !first.final_image_url) return null;
  return {
    url: first.final_image_url,
    width: first.final_image_width,
    height: first.final_image_height,
  };
}
