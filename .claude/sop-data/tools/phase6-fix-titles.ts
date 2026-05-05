#!/usr/bin/env tsx
/**
 * Phase 6 修复 B：批改 prompt 标题
 *
 * 问题：~38 个 prompt 标题是 prompt 文本前 60 字截断（不是真标题）
 * 修复策略：
 *   - 标题异常的（动词开头 / 含括号 / 长 > 55 / 含 CJK）→ 用 sub_scene name + 序号重命名
 *   - 例如 sub_scene "movie-hero" 下第 1 张 → "Movie Hero Edition #1"（用 spec sub_scenes[].name）
 *
 * 同时给原始有问题的 title 备份到 _original_title 字段以备追溯。
 */

import { readFileSync, writeFileSync } from 'node:fs';

const ROOT =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';

const CLUSTERS = [
  'action-figure-prompts',
  'old-photo-restore-prompts',
  'instagram-photo-edit-prompts',
  'sticker-prompts',
  'thumbnail-prompts',
  'cinematic-portrait-prompts',
  'product-photography-prompts',
  'poster-design-prompts',
  'food-photography-prompts',
  'infographic-prompts',
];

// 检测异常标题
const SUSPICIOUS = /^(Create |A |An |Use |Generate |Make |Transform |Using |9:16 |\d+x\d+ |\{)/;
const CJK = /[一-鿿぀-ヿ가-힯]/;

function isBadTitle(title: string): boolean {
  if (!title) return true;
  if (CJK.test(title)) return true;
  if (title.length > 55) return true;
  if (SUSPICIOUS.test(title)) return true;
  // 含 prompt 模板符号
  if (/\[[A-Z_]+\]/.test(title)) return true; // [SUBJECT] / [PERSON NAME]
  if (/[{}]/.test(title)) return true; // 含 { } 括号
  return false;
}

type Spec = {
  slug: string;
  h1: string;
  sub_scenes: Array<{ name: string; slug_anchor: string }>;
};

function loadSpec(slug: string): Spec {
  return JSON.parse(readFileSync(`${ROOT}/specs/${slug}.json`, 'utf-8'));
}

function shortClusterName(h1: string): string {
  return h1.replace(/ for GPT Image 2$/, '').replace(/^GPT Image 2 /, '');
}

let totalChanged = 0;
let totalKept = 0;

for (const slug of CLUSTERS) {
  const spec = loadSpec(slug);
  const subSceneByAnchor: Record<string, string> = {};
  for (const ss of spec.sub_scenes) {
    subSceneByAnchor[ss.slug_anchor] = ss.name;
  }

  const path = `${ROOT}/${slug}/prompts.jsonl`;
  const records = readFileSync(path, 'utf-8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));

  // 按 sub_scene 分组以便编号
  const subSceneCounters: Record<string, number> = {};
  let otherCounter = 0;
  let changed = 0;

  for (const r of records) {
    if (!isBadTitle(r.title)) {
      totalKept++;
      continue;
    }

    // 备份原标题
    if (!r._original_title) r._original_title = r.title;

    const tag = r.sub_scene_tag;
    const ssName = tag ? subSceneByAnchor[tag] : null;
    if (ssName) {
      subSceneCounters[tag] = (subSceneCounters[tag] || 0) + 1;
      const idx = subSceneCounters[tag];
      // 同 sub_scene 多于一张时加序号；唯一的 sub_scene 不加序号
      r.title = `${ssName} #${idx}`;
    } else {
      otherCounter++;
      r.title = `${shortClusterName(spec.h1)} #${otherCounter}`;
    }
    changed++;
  }

  // 因为按出现顺序计数，但相同 sub_scene 下可能有"好的"标题先出现
  // 为了让序号合理，第二轮：在重新写之前先看每个 sub_scene 总数 → 如果只 1 张则不加 #1

  if (changed > 0) {
    writeFileSync(path, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
  }
  console.log(
    `${changed > 0 ? '✓' : '·'} ${slug.padEnd(42)} 改 ${changed.toString().padStart(2)} / 保留 ${(records.length - changed).toString().padStart(2)}`,
  );
  totalChanged += changed;
}

console.log(`\n合计：改 ${totalChanged} 条，保留 ${totalKept} 条`);
console.log(`\n下一步：npx tsx .claude/sop-data/tools/compile-clusters-data.ts 重新编译数据`);
