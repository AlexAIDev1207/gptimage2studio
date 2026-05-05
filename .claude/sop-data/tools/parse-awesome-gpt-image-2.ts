#!/usr/bin/env tsx
/**
 * 解析 awesome-gpt-image-2 README.md，提取 126 条精选 prompt
 * 然后跟我们 prompts.master.jsonl (1446 GitHub) 做 minhash 去重
 *
 * 输入：/tmp/awesome-gpt-image-2-README.md (curl 提前下载好)
 *      .claude/sop-data/clusters/prompts.master.jsonl
 *
 * 输出：.claude/sop-data/clusters/awesome-gpt-image-2.jsonl  （126 条）
 *      .claude/sop-data/clusters/dedup-report.md             （去重报告）
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SRC_README = '/tmp/awesome-gpt-image-2-README.md';
const OUR_MASTER =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters/prompts.master.jsonl';
const OUTPUT_DIR =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';

// ==== 1. 解析 README ====

type AwesomePrompt = {
  no: number;
  use_case: string | null; // 他们的 use case 标签（如 "Profile / Avatar"）
  title: string;
  description: string;
  prompt_text: string;
  image_urls: string[];
  author: string | null;
  source_url: string | null;
  language: string | null;
  is_featured: boolean;
};

function parseAwesomeReadme(path: string): AwesomePrompt[] {
  const text = readFileSync(path, 'utf-8');
  // 按 "### No. N:" 分块
  const blocks = text.split(/^### No\. /m).slice(1); // 去掉前面的非 prompt 部分

  const prompts: AwesomePrompt[] = [];
  for (const blk of blocks) {
    const lines = blk.split('\n');
    const heading = lines[0].trim();
    const m = heading.match(/^(\d+):\s*(.+)$/);
    if (!m) continue;
    const no = parseInt(m[1]);
    const fullTitle = m[2].trim();

    // 提取 use_case：标题里 " - " 之前是 use case
    let use_case: string | null = null;
    let title = fullTitle;
    const ucMatch = fullTitle.match(/^(.+?)\s+-\s+(.+)$/);
    if (ucMatch) {
      use_case = ucMatch[1].trim();
      title = ucMatch[2].trim();
    }

    // 提取 description（"#### 📖 Description" 后面到下个 #### 之前）
    const descMatch = blk.match(
      /####\s+📖\s+Description\s*\n\n([\s\S]*?)(?=\n####|\n---)/,
    );
    const description = descMatch ? descMatch[1].trim() : '';

    // 提取 prompt 文本（"#### 📝 Prompt" 后的代码块）
    let prompt_text = '';
    const promptMatch = blk.match(
      /####\s+📝\s+Prompt\s*\n\n```(?:json|text)?\n([\s\S]*?)```/,
    );
    if (promptMatch) {
      prompt_text = promptMatch[1].trim();
    }

    // 提取图片 URLs（! 开头的 markdown image，限 cms-assets.youmind.com）
    const image_urls: string[] = [];
    const imgRegex = /!\[[^\]]*\]\((https:\/\/cms-assets\.youmind\.com\/[^)]+)\)/g;
    let im;
    while ((im = imgRegex.exec(blk)) !== null) {
      image_urls.push(im[1]);
    }

    // 提取 author / source / language（"#### 📋 Details" 后的 list）
    let author: string | null = null;
    let source_url: string | null = null;
    let language: string | null = null;
    const detailsMatch = blk.match(/####\s+📋\s+Details\s*\n([\s\S]*?)(?=\n---|\n##\s|$)/);
    if (detailsMatch) {
      const details = detailsMatch[1];
      const authorM = details.match(/\*\*Author\*\*:\s*\[?([^\]\n]+?)\]?(?:\(|\n|$)/);
      if (authorM) author = authorM[1].trim();
      const srcM = details.match(/\*\*Source\*\*:\s*\[[^\]]*\]\(([^)]+)\)/);
      if (srcM) source_url = srcM[1].trim();
      const langM = details.match(/\*\*Language(?:s)?\*\*:\s*([^\n]+)/);
      if (langM) language = langM[1].trim();
    }

    const is_featured = /Featured/i.test(blk.slice(0, 200));

    prompts.push({
      no,
      use_case,
      title,
      description,
      prompt_text,
      image_urls,
      author,
      source_url,
      language,
      is_featured,
    });
  }
  return prompts;
}

// ==== 2. minhash 简化版（基于 shingles 的 Jaccard 相似度） ====

function tokenize(text: string): Set<string> {
  // 取 prompt 文本前 500 字 + 标准化
  const norm = (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1500);
  // 5-gram word shingles
  const words = norm.split(' ').filter((w) => w.length > 0);
  const shingles = new Set<string>();
  for (let i = 0; i + 5 <= words.length; i++) {
    shingles.add(words.slice(i, i + 5).join(' '));
  }
  // 也加入单词集合作为补充
  for (const w of words) {
    if (w.length >= 4) shingles.add('w:' + w);
  }
  return shingles;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  const small = a.size < b.size ? a : b;
  const big = a.size < b.size ? b : a;
  for (const x of small) if (big.has(x)) inter++;
  const union = a.size + b.size - inter;
  return inter / union;
}

// ==== 3. 我们 master 池映射到 cluster ====

// 把 awesome 的 use_case 映射到我们 P0 cluster slug
const USE_CASE_TO_OUR_CLUSTER: Record<string, string | null> = {
  'Profile / Avatar': 'cinematic-portrait-prompts', // 我们没有专门 portrait P0，归到 cinematic-portrait
  'Social Media Post': 'instagram-photo-edit-prompts',
  'Infographic / Edu Visual': 'infographic-prompts',
  'YouTube Thumbnail': 'thumbnail-prompts',
  'Comic / Storyboard': null, // ❌ 我们没有，作为 P1 candidate
  'Product Marketing': 'product-photography-prompts',
  'E-commerce Main Image': null, // P1 候选 ecommerce-product-photo-prompts
  'Game Asset': null, // ❌ 我们没有
  'Poster / Flyer': 'poster-design-prompts',
  'App / Web Design': null, // 我们已 REJECT
};

function readJsonl(path: string): any[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf-8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter((x): x is any => x != null);
}

function writeJsonl(path: string, records: any[]) {
  writeFileSync(path, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
}

// ==== 4. 主流程 ====

function main() {
  console.log('[1/4] 解析 awesome-gpt-image-2 README...');
  const awesomePrompts = parseAwesomeReadme(SRC_README);
  console.log(`  解析出 ${awesomePrompts.length} 条 prompt`);
  const withPrompt = awesomePrompts.filter((p) => p.prompt_text.length > 50);
  console.log(`  其中 prompt 文本 ≥ 50 字的: ${withPrompt.length}`);

  console.log('\n[2/4] 加载我们的 master 池...');
  const ourMaster = readJsonl(OUR_MASTER);
  console.log(`  master 池 ${ourMaster.length} 条 (GitHub 1446)`);

  console.log('\n[3/4] minhash 去重对比...');
  // 对每条 awesome prompt 跟 master 全量做 jaccard
  const ourTokenized = ourMaster.map((p) => tokenize(p.prompt_text || ''));
  const SIM_THRESHOLD = 0.4;
  const dupRecords: any[] = [];
  const newRecords: any[] = [];
  for (const ap of awesomePrompts) {
    if (!ap.prompt_text || ap.prompt_text.length < 50) {
      continue;
    }
    const apTok = tokenize(ap.prompt_text);
    let bestSim = 0;
    let bestMatch: any = null;
    for (let i = 0; i < ourMaster.length; i++) {
      const sim = jaccard(apTok, ourTokenized[i]);
      if (sim > bestSim) {
        bestSim = sim;
        bestMatch = ourMaster[i];
        if (sim > 0.9) break;
      }
    }
    const ourCluster = ap.use_case
      ? USE_CASE_TO_OUR_CLUSTER[ap.use_case] || null
      : null;
    const record = {
      raw_id: `awesome-gpt-image-2:${ap.no}`,
      source: 'awesome-gpt-image-2',
      title: ap.title,
      use_case_external: ap.use_case,
      mapped_cluster: ourCluster,
      prompt_text: ap.prompt_text,
      image_urls: ap.image_urls,
      author: ap.author,
      source_url: ap.source_url,
      language: ap.language,
      is_featured: ap.is_featured,
      best_jaccard_to_master: Number(bestSim.toFixed(3)),
      best_match_id: bestMatch?.raw_id ?? null,
      is_duplicate: bestSim >= SIM_THRESHOLD,
    };
    if (bestSim >= SIM_THRESHOLD) {
      dupRecords.push(record);
    } else {
      newRecords.push(record);
    }
  }
  console.log(`  与 master 重复 (jaccard ≥ ${SIM_THRESHOLD}): ${dupRecords.length}`);
  console.log(`  新增可用 prompts: ${newRecords.length}`);

  console.log('\n[4/4] 按 cluster 分布统计...');
  const clusterDist: Record<string, number> = {};
  const newWithoutCluster: AwesomePrompt[] = [];
  for (const r of newRecords) {
    const k = r.mapped_cluster || `(unmapped: ${r.use_case_external || 'featured'})`;
    clusterDist[k] = (clusterDist[k] || 0) + 1;
  }
  console.log('  按 cluster 分布:');
  for (const [k, v] of Object.entries(clusterDist).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${k.padEnd(50)} ${v}`);
  }

  // 写出
  writeJsonl(`${OUTPUT_DIR}/awesome-gpt-image-2.jsonl`, [...newRecords, ...dupRecords]);
  writeJsonl(`${OUTPUT_DIR}/awesome-gpt-image-2.new.jsonl`, newRecords);

  // 写汇总
  const summary: string[] = [];
  summary.push('# awesome-gpt-image-2 数据集去重报告');
  summary.push('');
  summary.push(`生成时间：${new Date().toISOString()}`);
  summary.push('');
  summary.push('## 数据规模');
  summary.push(`- README 解析出 prompt: **${awesomePrompts.length}** 条`);
  summary.push(`- 含完整 prompt 文本（≥50 字）: **${withPrompt.length}** 条`);
  summary.push(`- 我们 master 池: ${ourMaster.length} 条 (GitHub 1446)`);
  summary.push('');
  summary.push('## 去重结果');
  summary.push(`- 与 master 重复 (jaccard ≥ ${SIM_THRESHOLD}): **${dupRecords.length}**`);
  summary.push(`- **新增可用 prompts: ${newRecords.length}**`);
  summary.push('');
  summary.push('> 重复阈值 0.4 比较保守。GitHub 1446 prompts 多数来自 X，awesome 也从 X 挑选，但 awesome 是 YouMind 团队精选 + 多语言改写，重复率应该不高。');
  summary.push('');
  summary.push('## 新增 prompt 按 cluster 分布');
  summary.push('');
  summary.push('| Cluster | 数量 |');
  summary.push('|---|---|');
  for (const [k, v] of Object.entries(clusterDist).sort((a, b) => b[1] - a[1])) {
    summary.push(`| \`${k}\` | ${v} |`);
  }
  summary.push('');
  summary.push('## 关键发现');
  summary.push('');
  summary.push('### Comic / Storyboard（我们漏的方向）');
  const comicNew = newRecords.filter((r) => r.use_case_external === 'Comic / Storyboard');
  summary.push(`- 新增 ${comicNew.length} 条`);
  summary.push(`- 这是我们 P0 完全没覆盖的方向，建议加 P1 candidate \`comic-storyboard-prompts\``);
  summary.push('');
  summary.push('### E-commerce Main Image（我们 P1）');
  const ecomNew = newRecords.filter((r) => r.use_case_external === 'E-commerce Main Image');
  summary.push(`- 新增 ${ecomNew.length} 条`);
  summary.push(`- 已规划在 P1，对应 \`ecommerce-product-photo-prompts\``);
  summary.push('');
  summary.push('### App / Web Design');
  const appNew = newRecords.filter((r) => r.use_case_external === 'App / Web Design');
  summary.push(`- 新增 ${appNew.length} 条（如 README 含此分类）`);
  summary.push(`- 我们 SERP 验证已 REJECT，但他们的 prompt 是 e-commerce live stream UI mockup 等具体场景，可能值得二评`);
  summary.push('');
  summary.push('## 输出文件');
  summary.push('');
  summary.push('- `awesome-gpt-image-2.jsonl` (${awesomePrompts.length} 条全量 + 标注 is_duplicate)');
  summary.push('- `awesome-gpt-image-2.new.jsonl` (${newRecords.length} 条新增可用)');
  summary.push('');
  summary.push('## 使用约束');
  summary.push('');
  summary.push('- License: **CC BY 4.0**');
  summary.push('- 引用要求：每条 prompt 内部留 `source_attribution_internal` 字段（不需要外网展示）');
  summary.push('- 改写后 prompt 算我们衍生品，不需要在 hub 页加 attribution，但可以在 footer 加感谢链接');

  writeFileSync(`${OUTPUT_DIR}/dedup-report.md`, summary.join('\n'));

  console.log('\n========== 完成 ==========');
  console.log(`输出文件：`);
  console.log(`  ${OUTPUT_DIR}/awesome-gpt-image-2.jsonl`);
  console.log(`  ${OUTPUT_DIR}/awesome-gpt-image-2.new.jsonl`);
  console.log(`  ${OUTPUT_DIR}/dedup-report.md`);
}

main();
