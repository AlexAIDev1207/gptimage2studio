#!/usr/bin/env tsx
/**
 * Phase 5.5：把 130 张 PNG 压缩为 webp 放到 public/，写回 prompts.jsonl
 *
 * - viral cluster (1K)：quality 82，目标 ~150KB
 * - 2K cluster：quality 85，目标 ~250KB
 *
 * 输入：.claude/sop-data/clusters/{slug}/images/{prompt_id}.png
 * 输出：public/imgs/gpt-image-2-prompts/{slug}/{prompt_id}.webp
 *      .claude/sop-data/clusters/{slug}/prompts.jsonl 加 final_image_* 字段
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import sharp from 'sharp';

const ROOT_PROJECT = '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize';
const ROOT_DATA = `${ROOT_PROJECT}/.claude/sop-data/clusters`;
const PUBLIC_BASE = `${ROOT_PROJECT}/public/imgs/gpt-image-2-prompts`;

const CLUSTERS = [
  { slug: 'action-figure-prompts', tier: 'viral' },
  { slug: 'old-photo-restore-prompts', tier: 'viral' },
  { slug: 'instagram-photo-edit-prompts', tier: 'viral' },
  { slug: 'sticker-prompts', tier: 'viral' },
  { slug: 'thumbnail-prompts', tier: '2k-text' }, // 文字密集
  { slug: 'cinematic-portrait-prompts', tier: 'viral' },
  { slug: 'product-photography-prompts', tier: '2k' },
  { slug: 'poster-design-prompts', tier: '2k-text' }, // 文字密集
  { slug: 'food-photography-prompts', tier: 'viral' },
  { slug: 'infographic-prompts', tier: '2k-text' }, // 文字密集
];

const QUALITY_BY_TIER: Record<string, number> = {
  viral: 82,        // 1K，目标 ~150KB
  '2k': 85,         // 2K 视觉，目标 ~250KB
  '2k-text': 88,    // 2K 文字密集，目标 ~300KB（保文字清晰）
};

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function main() {
  ensureDir(PUBLIC_BASE);

  const stats: Array<{
    cluster: string;
    prompt_id: string;
    quality: number;
    png_bytes: number;
    webp_bytes: number;
    width: number;
    height: number;
  }> = [];

  for (const { slug, tier } of CLUSTERS) {
    const clusterPng = `${ROOT_DATA}/${slug}/images`;
    const clusterWebp = `${PUBLIC_BASE}/${slug}`;
    ensureDir(clusterWebp);

    // 读 prompts.jsonl
    const promptsPath = `${ROOT_DATA}/${slug}/prompts.jsonl`;
    const records = readFileSync(promptsPath, 'utf-8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));

    const quality = QUALITY_BY_TIER[tier];
    let clusterTotal = 0;
    let clusterCount = 0;

    for (const r of records) {
      const pngPath = `${clusterPng}/${r.prompt_id}.png`;
      if (!existsSync(pngPath)) {
        console.warn(`  ⚠ ${r.prompt_id}: PNG 不存在`);
        continue;
      }
      const webpPath = `${clusterWebp}/${r.prompt_id}.webp`;
      const pngStat = statSync(pngPath);

      const meta = await sharp(pngPath).metadata();
      const buf = await sharp(pngPath)
        .webp({ quality, effort: 6 })
        .toBuffer();
      writeFileSync(webpPath, buf);

      const width = meta.width || 0;
      const height = meta.height || 0;

      // 写回 prompts.jsonl 字段
      r.final_image_url = `/imgs/gpt-image-2-prompts/${slug}/${r.prompt_id}.webp`;
      r.final_image_width = width;
      r.final_image_height = height;
      r.final_image_bytes = buf.length;

      stats.push({
        cluster: slug,
        prompt_id: r.prompt_id,
        quality,
        png_bytes: pngStat.size,
        webp_bytes: buf.length,
        width,
        height,
      });
      clusterTotal += buf.length;
      clusterCount++;
    }

    // 写回 jsonl
    writeFileSync(
      promptsPath,
      records.map((r) => JSON.stringify(r)).join('\n') + '\n',
    );

    const avgKB = clusterCount > 0 ? clusterTotal / clusterCount / 1024 : 0;
    console.log(
      `✓ ${slug.padEnd(42)} q=${quality} count=${clusterCount} total=${(clusterTotal / 1024 / 1024).toFixed(2)}MB avg=${avgKB.toFixed(0)}KB`,
    );
  }

  // 全局统计
  console.log('\n=== 全局统计 ===');
  const totalPng = stats.reduce((s, r) => s + r.png_bytes, 0);
  const totalWebp = stats.reduce((s, r) => s + r.webp_bytes, 0);
  console.log(`PNG 原图总:  ${(totalPng / 1024 / 1024).toFixed(1)} MB`);
  console.log(`webp 总:    ${(totalWebp / 1024 / 1024).toFixed(1)} MB`);
  console.log(`压缩比:     ${(totalPng / totalWebp).toFixed(1)}x`);

  // 找 outliers
  console.log('\n=== webp 体积 > 400KB 的图（可能要降质量）===');
  const outliers = stats.filter((s) => s.webp_bytes > 400 * 1024).sort((a, b) => b.webp_bytes - a.webp_bytes);
  for (const o of outliers.slice(0, 10)) {
    console.log(`  ${o.prompt_id.padEnd(42)} ${(o.webp_bytes / 1024).toFixed(0)}KB  ${o.width}×${o.height}`);
  }
  if (outliers.length === 0) console.log('  (无)');

  // 找太小的可能是降低过头
  console.log('\n=== webp 体积 < 50KB 的图（可能压过头）===');
  const tiny = stats.filter((s) => s.webp_bytes < 50 * 1024);
  for (const o of tiny) {
    console.log(`  ${o.prompt_id.padEnd(42)} ${(o.webp_bytes / 1024).toFixed(0)}KB  ${o.width}×${o.height}`);
  }
  if (tiny.length === 0) console.log('  (无)');

  // 写汇总
  const summary: string[] = [];
  summary.push('# Phase 5.5 webp 压缩汇总');
  summary.push('');
  summary.push(`生成时间：${new Date().toISOString()}`);
  summary.push('');
  summary.push('## 总体');
  summary.push(`- PNG 原图：${(totalPng / 1024 / 1024).toFixed(1)} MB`);
  summary.push(`- webp 输出：${(totalWebp / 1024 / 1024).toFixed(1)} MB`);
  summary.push(`- 压缩比：${(totalPng / totalWebp).toFixed(1)}x`);
  summary.push('');
  summary.push('## 各 cluster');
  summary.push('| Cluster | tier | quality | 数量 | 总大小 | 平均 |');
  summary.push('|---|---|---|---|---|---|');
  for (const c of CLUSTERS) {
    const cs = stats.filter((s) => s.cluster === c.slug);
    if (cs.length === 0) continue;
    const tot = cs.reduce((s, r) => s + r.webp_bytes, 0);
    summary.push(
      `| \`${c.slug}\` | ${c.tier} | ${QUALITY_BY_TIER[c.tier]} | ${cs.length} | ${(tot / 1024 / 1024).toFixed(2)} MB | ${(tot / cs.length / 1024).toFixed(0)} KB |`,
    );
  }
  summary.push('');
  summary.push('## 字段写入');
  summary.push('每条 prompt 加 4 字段：');
  summary.push('- `final_image_url`: `/imgs/gpt-image-2-prompts/{slug}/{prompt_id}.webp`');
  summary.push('- `final_image_width`: 原图宽');
  summary.push('- `final_image_height`: 原图高');
  summary.push('- `final_image_bytes`: webp 体积');
  writeFileSync(`${ROOT_DATA}/phase5.5-webp-summary.md`, summary.join('\n'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
