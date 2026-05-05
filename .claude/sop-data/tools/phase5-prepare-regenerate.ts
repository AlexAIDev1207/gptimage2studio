#!/usr/bin/env tsx
/**
 * Phase 5 重生准备：
 * 1. 删除需要重生的 49 张 PNG
 * 2. 从 media.jsonl 移除对应 49 条记录（保留其他 81 条）
 * 3. 输出 regenerate-list.md 给 codex 喂任务
 *
 * 全本地文件操作，无任何 API 调用
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
  readdirSync,
} from 'node:fs';

const ROOT =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';

type RegenItem = {
  cluster: string;
  prompt_id: string;
  reason: string;
  expected_resolution?: '1K' | '2K';
};

const REGEN_LIST: RegenItem[] = [];

// 1. cinematic-portrait 全 cluster 13 张（全部重选了 prompt）
const cineRecords = readFileSync(
  `${ROOT}/cinematic-portrait-prompts/prompts.jsonl`,
  'utf-8',
)
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));
for (const r of cineRecords) {
  REGEN_LIST.push({
    cluster: 'cinematic-portrait-prompts',
    prompt_id: r.prompt_id,
    reason: 'cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类）',
    expected_resolution: '1K',
  });
}

// 2. instagram 4 张
for (const id of ['002', '005', '006', '010']) {
  REGEN_LIST.push({
    cluster: 'instagram-photo-edit-prompts',
    prompt_id: `instagram-photo-edit-prompts-${id}`,
    reason: id === '010'
      ? '完全替换偏题（中文道符 → split-screen edit）'
      : '改写避免人脸打码（删 privacy mask / 用具体描述代替 placeholder）',
    expected_resolution: '1K',
  });
}

// 3. food 2 张
REGEN_LIST.push({
  cluster: 'food-photography-prompts',
  prompt_id: 'food-photography-prompts-001',
  reason: '替换偏题创意拼贴 → 标准 hero shot pizza',
  expected_resolution: '1K',
});
REGEN_LIST.push({
  cluster: 'food-photography-prompts',
  prompt_id: 'food-photography-prompts-002',
  reason: '替换 4-grid 广告 → 单一 hero shot burger',
  expected_resolution: '1K',
});

// 4. thumbnail 3 张多语言 → 英文
for (const id of ['005', '008', '010']) {
  REGEN_LIST.push({
    cluster: 'thumbnail-prompts',
    prompt_id: `thumbnail-prompts-${id}`,
    reason: '日文 → 英文版重生',
    expected_resolution: '2K',
  });
}

// 5. infographic 全 13 张（001 中文已改英文，其他 12 张要 2K 重生）
const infoRecords = readFileSync(
  `${ROOT}/infographic-prompts/prompts.jsonl`,
  'utf-8',
)
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));
for (const r of infoRecords) {
  const isPatched = r._patched === true;
  REGEN_LIST.push({
    cluster: 'infographic-prompts',
    prompt_id: r.prompt_id,
    reason: isPatched ? '中文 → 英文 + 升 2K' : '升级为 2K 分辨率',
    expected_resolution: '2K',
  });
}

// 6. product-photography 全 14 张（005 改了 prompt + 全部要 2K）
const prodRecords = readFileSync(
  `${ROOT}/product-photography-prompts/prompts.jsonl`,
  'utf-8',
)
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => JSON.parse(l));
for (const r of prodRecords) {
  const isPatched = r._patched === true;
  REGEN_LIST.push({
    cluster: 'product-photography-prompts',
    prompt_id: r.prompt_id,
    reason: isPatched
      ? '替换 Dunkin 品牌 + 删除遮脸 + 升 2K'
      : '升级为 2K 分辨率',
    expected_resolution: '2K',
  });
}

console.log(`\n=== 重生清单：${REGEN_LIST.length} 张 ===`);

// 删除 PNG
let deletedCount = 0;
for (const item of REGEN_LIST) {
  const path = `${ROOT}/${item.cluster}/images/${item.prompt_id}.png`;
  if (existsSync(path)) {
    unlinkSync(path);
    deletedCount++;
  }
}
console.log(`已删除旧 PNG: ${deletedCount} / ${REGEN_LIST.length}`);

// 清理 media.jsonl
const regenIdsByCluster: Record<string, Set<string>> = {};
for (const item of REGEN_LIST) {
  if (!regenIdsByCluster[item.cluster]) regenIdsByCluster[item.cluster] = new Set();
  regenIdsByCluster[item.cluster].add(item.prompt_id);
}

let mediaRemoved = 0;
let mediaKept = 0;
for (const [cluster, ids] of Object.entries(regenIdsByCluster)) {
  const mediaPath = `${ROOT}/${cluster}/media.jsonl`;
  if (!existsSync(mediaPath)) continue;
  const lines = readFileSync(mediaPath, 'utf-8')
    .split('\n')
    .filter((l) => l.trim());
  const kept = lines.filter((l) => {
    try {
      const r = JSON.parse(l);
      if (ids.has(r.prompt_id)) {
        mediaRemoved++;
        return false;
      }
      mediaKept++;
      return true;
    } catch {
      return true;
    }
  });
  writeFileSync(mediaPath, kept.join('\n') + (kept.length > 0 ? '\n' : ''));
}
console.log(`media.jsonl 移除 ${mediaRemoved} 条，保留 ${mediaKept} 条`);

// 输出 regenerate-list.md
const lines: string[] = [];
lines.push('# Phase 5 重生清单');
lines.push('');
lines.push(`生成时间：${new Date().toISOString()}`);
lines.push('');
lines.push(`需要 codex 重新生成 **${REGEN_LIST.length} 张图**。原图已删除，media.jsonl 对应条目已清理。`);
lines.push('');
lines.push('## 给 codex 的执行指引');
lines.push('');
lines.push('1. 遍历下面 6 个 cluster，从对应 `prompts.jsonl` 读取每条要重生的 `prompt_id` 的 `final_prompt`');
lines.push('2. 用 GPT Image 2 生成图（按 expected_resolution 决定 1K/2K）');
lines.push('3. 保存到 `{cluster}/images/{prompt_id}.png`');
lines.push('4. **追加** 一行到 `{cluster}/media.jsonl`（不要覆盖现有条目）');
lines.push('');
lines.push('media.jsonl 字段格式（与之前一致）：');
lines.push('```json');
lines.push('{');
lines.push('  "prompt_id": "...",');
lines.push('  "image_path": "images/{prompt_id}.png",');
lines.push('  "width": 1024 | 1672 | 2048,');
lines.push('  "height": 1024 | 1536 | ...,');
lines.push('  "bytes_size": ...,');
lines.push('  "generated_at": "ISO timestamp",');
lines.push('  "model": "gpt-image-2",');
lines.push('  "resolution_label": "1K" | "2K",');
lines.push('  "status": "success",');
lines.push('  "error": null');
lines.push('}');
lines.push('```');
lines.push('');
lines.push('## 重生清单（按 cluster 分组）');
lines.push('');

const grouped: Record<string, RegenItem[]> = {};
for (const item of REGEN_LIST) {
  if (!grouped[item.cluster]) grouped[item.cluster] = [];
  grouped[item.cluster].push(item);
}

for (const [cluster, items] of Object.entries(grouped)) {
  lines.push(`### \`${cluster}\` — ${items.length} 张`);
  lines.push('');
  lines.push(`从 \`${cluster}/prompts.jsonl\` 找以下 prompt_id 的 \`final_prompt\` 喂给 GPT Image 2:`);
  lines.push('');
  lines.push('| # | prompt_id | 期望分辨率 | 重生原因 |');
  lines.push('|---|---|---|---|');
  items.forEach((it, idx) => {
    lines.push(`| ${idx + 1} | \`${it.prompt_id}\` | ${it.expected_resolution} | ${it.reason} |`);
  });
  lines.push('');
}

lines.push('## 总览');
lines.push('');
lines.push('| Cluster | 重生数 | 期望分辨率 |');
lines.push('|---|---|---|');
for (const [cluster, items] of Object.entries(grouped)) {
  const res = items[0].expected_resolution;
  const allSameRes = items.every((i) => i.expected_resolution === res);
  lines.push(`| \`${cluster}\` | ${items.length} | ${allSameRes ? res : '混合'} |`);
}
lines.push(`| **合计** | **${REGEN_LIST.length}** | — |`);

writeFileSync(`${ROOT}/regenerate-list.md`, lines.join('\n'));
console.log(`\n已输出: ${ROOT}/regenerate-list.md`);
