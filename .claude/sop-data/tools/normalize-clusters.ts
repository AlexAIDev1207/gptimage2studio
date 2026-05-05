#!/usr/bin/env tsx
/**
 * Phase 1: 数据归一化与候选 cluster 打分
 *
 * 输入：sibling 项目 prompt-url-research/{parsed,raw}
 * 输出：当前项目 .claude/sop-data/clusters/
 *
 * 用法：
 *   cd /Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize
 *   npx tsx .claude/sop-data/tools/normalize-clusters.ts
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { join } from 'node:path';

// ==== 路径配置 ====

const SIBLING_DATA =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-prompt-optimize/.Codex/sop-data';
const OUTPUT_DIR =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';

// ==== 候选 cluster 定义 ====

type ClusterDef = {
  slug: string;
  display_name: string;
  tags: string[];
  keywords: RegExp;
  github_categories: string[];
  reddit_use_cases: string[];
};

const CLUSTERS: ClusterDef[] = [
  {
    slug: 'product-photography-prompts',
    display_name: 'Product Photography Prompts',
    tags: ['product-photo', 'photography'],
    keywords:
      /\b(product\s+(photo|shot|photography)|white\s+background|catalog\s+(photo|shot)|on\s+(white|gradient)|studio\s+lighting)\b/i,
    github_categories: ['Photography', 'Product & Brand'],
    reddit_use_cases: ['Product / E-commerce'],
  },
  {
    slug: 'ecommerce-product-photo-prompts',
    display_name: 'E-commerce Product Photo Prompts',
    tags: ['ecommerce-listing', 'product-photo'],
    keywords:
      /\b(amazon|shopify|etsy|ecommerce|listing|sku|on\s+model|model\s+try\s?on|catalog|lifestyle\s+shot)\b/i,
    github_categories: ['Product & Brand'],
    reddit_use_cases: ['Product / E-commerce'],
  },
  {
    slug: 'poster-design-prompts',
    display_name: 'Poster Design Prompts',
    tags: ['poster', 'graphic-design'],
    keywords:
      /\b(poster|movie\s+poster|concert\s+poster|propaganda|retro\s+poster|minimal\s+poster)\b/i,
    github_categories: ['Poster Design'],
    reddit_use_cases: ['Poster / Print'],
  },
  {
    slug: 'ui-mockup-prompts',
    display_name: 'UI Mockup Prompts',
    tags: ['ui-mockup', 'ui-design'],
    keywords:
      /\b(ui\s+mockup|app\s+mockup|website\s+mockup|wireframe|app\s+screen|landing\s+page|saas\s+ui|dashboard\s+design)\b/i,
    github_categories: ['UI & Graphic'],
    reddit_use_cases: ['UI Design / Mockup'],
  },
  {
    slug: 'infographic-prompts',
    display_name: 'Infographic Prompts',
    tags: ['infographic'],
    keywords:
      /\b(infographic|chart|diagram|data\s+visualization|step\s+by\s+step\s+diagram|process\s+diagram|venn\s+diagram)\b/i,
    github_categories: ['UI & Graphic'],
    reddit_use_cases: ['Infographic / Layout'],
  },
  {
    slug: 'action-figure-prompts',
    display_name: 'Action Figure Prompts',
    tags: ['action-figure'],
    keywords: /\b(action\s+figure|figurine|funko|toy\s+packaging|collectible)\b/i,
    github_categories: [],
    reddit_use_cases: ['Action Figure / Figurine'],
  },
  {
    slug: 'old-photo-restore-prompts',
    display_name: 'Old Photo Restore Prompts',
    tags: ['old-photo-restore', 'photo-edit'],
    keywords:
      /\b(restore|colorize|colorise|old\s+photo|vintage\s+photo|black[\s-]?and[\s-]?white\s+photo|grandparent|grandma|grandfather)\b/i,
    github_categories: [],
    reddit_use_cases: ['Old Photo Restore / Colorize'],
  },
  {
    slug: 'sticker-prompts',
    display_name: 'Sticker Prompts',
    tags: ['sticker', 'illustration'],
    keywords:
      /\b(sticker|emoji\s+sticker|chibi|kawaii\s+sticker|cute\s+sticker|line\s+sticker|telegram\s+sticker|whatsapp\s+sticker)\b/i,
    github_categories: [],
    reddit_use_cases: ['Sticker / Cartoon'],
  },
  {
    slug: 'instagram-photo-edit-prompts',
    display_name: 'Instagram Photo Edit Prompts',
    tags: ['photo-edit', 'social-trend'],
    keywords:
      /\b(instagram\s+(filter|edit|reel|story)|tiktok\s+trend|viral\s+edit|aesthetic\s+filter|reels?\b)\b/i,
    github_categories: [],
    reddit_use_cases: ['Social Photo Edit / Collage'],
  },
  {
    slug: 'character-design-prompts',
    display_name: 'Character Design Prompts',
    tags: ['character-design', 'illustration'],
    keywords:
      /\b(character\s+(design|sheet|reference)|original\s+character|game\s+character|hero\s+character|villain)\b/i,
    github_categories: ['Illustration & 3D'],
    reddit_use_cases: ['Style Transfer / Character'],
  },
  {
    slug: 'logo-design-prompts',
    display_name: 'Logo Design Prompts',
    tags: ['logo', 'graphic-design'],
    keywords: /\b(logo|brand\s?mark|wordmark|monogram|emblem)\b/i,
    github_categories: ['Product & Brand'],
    reddit_use_cases: [],
  },
  {
    slug: 'food-photography-prompts',
    display_name: 'Food Photography Prompts',
    tags: ['food-photo', 'photography'],
    keywords:
      /\b(food\s+(photo|photography|shot)|dish\s+photo|restaurant\s+menu|recipe\s+photo|drink\s+photo|coffee\s+art|cocktail|dessert\s+photo)\b/i,
    github_categories: ['Food & Drink'],
    reddit_use_cases: [],
  },
  {
    slug: 'text-rendering-prompts',
    display_name: 'Text Rendering Prompts',
    tags: ['text-render', 'typography'],
    keywords:
      /\b(typography|lettering|calligraphy|hand[\s-]?written\s+text|text\s+effect|3d\s+text|chrome\s+text|neon\s+text|glowing\s+text|metallic\s+text)\b/i,
    github_categories: ['UI & Graphic'],
    reddit_use_cases: [],
  },
  {
    slug: 'multi-image-consistency-prompts',
    display_name: 'Multi-Image Consistency Prompts',
    tags: ['multi-image-consistency'],
    keywords:
      /\b(consistent\s+character|same\s+character|multi[\s-]?image|character\s+consistency|series\s+of\s+(images|panels)|comic\s+panel)\b/i,
    github_categories: [],
    reddit_use_cases: [],
  },
  {
    slug: 'anime-style-prompts',
    display_name: 'Anime Style Prompts',
    tags: ['anime'],
    keywords:
      /\b(anime|manga|ghibli|shounen|shoujo|kawaii\s+anime|jujutsu|naruto|demon\s+slayer)\b/i,
    github_categories: ['Illustration & 3D'],
    reddit_use_cases: [],
  },
  {
    slug: 'portrait-prompts',
    display_name: 'Portrait Prompts',
    tags: ['portrait'],
    keywords:
      /\b(portrait|headshot|self[\s-]?portrait|profile\s+photo|linkedin\s+headshot|professional\s+photo)\b/i,
    github_categories: ['Photography'],
    reddit_use_cases: [],
  },
  {
    slug: 'cinematic-portrait-prompts',
    display_name: 'Cinematic Portrait Prompts',
    tags: ['portrait', 'cinematic'],
    keywords:
      /\b(cinematic\s+portrait|dramatic\s+(image|portrait|lighting)|editorial\s+portrait|fashion\s+editorial|mirror\s+selfie|instagram\s+portrait|profile\s+picture|headshot)\b/i,
    github_categories: ['Photography'],
    reddit_use_cases: ['Social Photo Edit / Collage'],
  },
  {
    slug: 'interior-design-prompts',
    display_name: 'Interior Design Prompts',
    tags: ['interior'],
    keywords:
      /\b(interior\s+design|room\s+design|home\s+decor|living\s+room|bedroom|kitchen\s+design|bathroom\s+design|office\s+space)\b/i,
    github_categories: [],
    reddit_use_cases: [],
  },
  {
    slug: '3d-render-prompts',
    display_name: '3D Render Prompts',
    tags: ['3d-render'],
    keywords:
      /\b(3d\s+render|cinema\s?4d|blender\s+render|claymation|claymorphic|isometric|low[\s-]?poly|pixar\s+style|disney\s+style)\b/i,
    github_categories: ['Illustration & 3D'],
    reddit_use_cases: [],
  },
  {
    slug: 'social-media-ad-prompts',
    display_name: 'Social Media Ad Prompts',
    tags: ['ad-creative', 'social-card'],
    keywords:
      /\b(facebook\s+ad|instagram\s+ad|social\s+(ad|banner)|ad\s+creative|banner\s+ad|sponsored\s+post|google\s+ad)\b/i,
    github_categories: [],
    reddit_use_cases: [],
  },
  {
    slug: 'thumbnail-prompts',
    display_name: 'YouTube Thumbnail Prompts',
    tags: ['thumbnail', 'social-card'],
    keywords:
      /\b(youtube\s+thumbnail|thumbnail|click[\s-]?bait\s+thumbnail|video\s+thumbnail)\b/i,
    github_categories: [],
    reddit_use_cases: [],
  },
];

// ==== 数据加载 ====

function readJsonl(path: string): any[] {
  if (!existsSync(path)) return [];
  const content = readFileSync(path, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim());
  const out: any[] = [];
  for (const line of lines) {
    try {
      out.push(JSON.parse(line));
    } catch (_e) {
      // 跳过坏行
    }
  }
  return out;
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// 归一化记录
type NormalizedRecord = {
  source: string;
  raw_id: string;
  url: string;
  prompt_text?: string;
  text_for_match: string;
  image_urls: string[];
  github_score?: number;
  github_categories?: string[];
  github_likes?: number;
  github_views?: number;
  github_model?: string;
  reddit_use_case?: string;
  reddit_persona?: string;
  reddit_score?: number;
  matched_clusters: string[];
};

function loadGithubPrompts(): NormalizedRecord[] {
  const path = `${SIBLING_DATA}/prompt-url-research/raw/json/raw.githubusercontent.com-prompts-prompts-json-9003fcd4f1.json`;
  const data = readJson(path);
  return data.map((p: any) => {
    const text = (p.prompt || '') + ' ' + (p.categories || []).join(' ');
    return {
      source: 'github',
      raw_id: `github:${p.id}`,
      url: p.source_url || '',
      prompt_text: p.prompt,
      text_for_match: text,
      image_urls: Array.isArray(p.images)
        ? p.images
        : p.image
          ? [p.image]
          : [],
      github_score: typeof p.score === 'number' ? p.score : 0,
      github_categories: Array.isArray(p.categories) ? p.categories : [],
      github_likes: typeof p.likes === 'number' ? p.likes : 0,
      github_views: typeof p.views === 'number' ? p.views : 0,
      github_model: p.model,
      matched_clusters: [],
    };
  });
}

function loadReddit(): NormalizedRecord[] {
  const path = `${SIBLING_DATA}/prompt-url-research/parsed/social_posts.jsonl`;
  const data = readJsonl(path);
  return data
    .filter((p) => p.platform === 'reddit')
    .map((p) => ({
      source: 'reddit',
      raw_id: `reddit:${p.url}`,
      url: p.url,
      prompt_text: p.body_excerpt,
      text_for_match: (p.title || '') + ' ' + (p.body_excerpt || ''),
      image_urls: [],
      reddit_use_case: p.detected_use_case,
      reddit_persona: p.detected_persona,
      reddit_score: p.engagement?.score ?? 0,
      matched_clusters: [],
    }));
}

function loadXChrome(): NormalizedRecord[] {
  const path = `${SIBLING_DATA}/prompt-url-research-v2/parsed/x_chrome_posts.jsonl`;
  const data = readJsonl(path);
  return data.map((p) => {
    const main = p.main_tweet || {};
    const replies = (p.replies || []) as any[];
    const text = [
      main.tweet_text,
      main.article_text,
      ...replies.map((r) => r.tweet_text),
    ]
      .filter(Boolean)
      .join(' \n ');
    const images = [
      ...(main.images || []),
      ...replies.flatMap((r: any) => r.images || []),
    ];
    return {
      source: 'x_chrome',
      raw_id: `x_chrome:${p.source_url}`,
      url: p.final_url || p.source_url,
      prompt_text: main.article_text || main.tweet_text,
      text_for_match: text,
      image_urls: images,
      matched_clusters: [],
    };
  });
}

function loadXSearch(): NormalizedRecord[] {
  const path = `${SIBLING_DATA}/prompt-url-research-v2/parsed/x_search_posts.jsonl`;
  const data = readJsonl(path);
  return data.flatMap((p) => {
    const articles = (p.top_articles || []) as any[];
    return articles.map((a) => ({
      source: 'x_search',
      raw_id: `x_search:${a.permalink || p.search_url + ':' + a.index}`,
      url: a.permalink || p.search_url,
      prompt_text: a.article_text || a.tweet_text,
      text_for_match: [a.tweet_text, a.article_text, p.label, p.query]
        .filter(Boolean)
        .join(' '),
      image_urls: a.images || [],
      matched_clusters: [],
    })) as NormalizedRecord[];
  });
}

function loadYoutube(): NormalizedRecord[] {
  const path = `${SIBLING_DATA}/prompt-url-research-v2/parsed/youtube_transcripts.jsonl`;
  const data = readJsonl(path);
  const transcriptDir = `${SIBLING_DATA}/prompt-url-research-v2/parsed/youtube_transcripts_text`;
  let dirFiles: string[] = [];
  try {
    dirFiles = readdirSync(transcriptDir);
  } catch (_e) {
    // 没有转录文件夹也照常进行
  }
  return data.map((v) => {
    let transcript = '';
    if (v.video_id) {
      const candidates = dirFiles.filter((f) => f.startsWith(v.video_id));
      if (candidates.length > 0) {
        try {
          transcript = readFileSync(
            join(transcriptDir, candidates[0]),
            'utf-8',
          );
        } catch (_e) {
          // ignore
        }
      }
    }
    return {
      source: 'youtube',
      raw_id: `youtube:${v.video_id}`,
      url: v.url,
      prompt_text: undefined,
      text_for_match: [
        v.title,
        v.excerpt,
        v.detected_use_case,
        transcript.slice(0, 8000),
      ]
        .filter(Boolean)
        .join(' '),
      image_urls: [],
      matched_clusters: [],
    };
  });
}

function loadCompetitorPages(): NormalizedRecord[] {
  const path = `${SIBLING_DATA}/prompt-url-research/parsed/pages.jsonl`;
  const data = readJsonl(path);
  return data.map((p) => ({
    source: 'competitor',
    raw_id: `competitor:${p.url}`,
    url: p.url,
    prompt_text: undefined,
    text_for_match: [
      p.title,
      p.h1,
      p.meta_description,
      ...((p.headings as any[]) || []).map((h: any) => h.text),
      ...((p.categories as string[]) || []),
    ]
      .filter(Boolean)
      .join(' '),
    image_urls: [],
    matched_clusters: [],
  }));
}

function loadXSearchSupplement(): NormalizedRecord[] {
  const path = `${SIBLING_DATA}/prompt-url-research/raw/serp/x-websearch-supplement.json`;
  if (!existsSync(path)) return [];
  const data = readJson(path);
  const results = (data.results || []) as any[];
  return results.map((r, i) => ({
    source: 'x_search_supplement',
    raw_id: `x_supp:${i}:${r.url || ''}`,
    url: r.url || '',
    prompt_text: undefined,
    text_for_match: [r.title, r.summary, r.query_group].filter(Boolean).join(' '),
    image_urls: [],
    matched_clusters: [],
  }));
}

// ==== 集群分配 ====

function assignClusters(record: NormalizedRecord): string[] {
  const matched: Set<string> = new Set();
  for (const c of CLUSTERS) {
    let hit = false;
    if (record.text_for_match && c.keywords.test(record.text_for_match))
      hit = true;
    if (
      record.github_categories?.some((g) => c.github_categories.includes(g))
    )
      hit = true;
    if (
      record.reddit_use_case &&
      c.reddit_use_cases.includes(record.reddit_use_case)
    )
      hit = true;
    if (hit) matched.add(c.slug);
  }
  return Array.from(matched);
}

// ==== 评分 ====

type ClusterStats = {
  slug: string;
  display_name: string;
  tags: string[];
  evidence: {
    github: number;
    reddit: number;
    x: number;
    youtube: number;
    competitor: number;
    supplement: number;
  };
  github_scores: number[];
  github_likes_total: number;
  sample_prompt_ids: string[];
};

function scoreClusters(records: NormalizedRecord[]) {
  const stats: Record<string, ClusterStats> = {};
  for (const c of CLUSTERS) {
    stats[c.slug] = {
      slug: c.slug,
      display_name: c.display_name,
      tags: c.tags,
      evidence: {
        github: 0,
        reddit: 0,
        x: 0,
        youtube: 0,
        competitor: 0,
        supplement: 0,
      },
      github_scores: [],
      github_likes_total: 0,
      sample_prompt_ids: [],
    };
  }

  for (const r of records) {
    for (const slug of r.matched_clusters) {
      const s = stats[slug];
      if (!s) continue;
      if (r.source === 'github') {
        s.evidence.github++;
        if (typeof r.github_score === 'number')
          s.github_scores.push(r.github_score);
        s.github_likes_total += r.github_likes ?? 0;
        if (s.sample_prompt_ids.length < 8)
          s.sample_prompt_ids.push(r.raw_id);
      } else if (r.source === 'reddit') s.evidence.reddit++;
      else if (r.source === 'x_chrome' || r.source === 'x_search')
        s.evidence.x++;
      else if (r.source === 'youtube') s.evidence.youtube++;
      else if (r.source === 'competitor') s.evidence.competitor++;
      else if (r.source === 'x_search_supplement') s.evidence.supplement++;
    }
  }

  const allFreq = Object.values(stats).map(
    (s) =>
      s.evidence.github +
      s.evidence.reddit +
      s.evidence.x +
      s.evidence.youtube +
      s.evidence.competitor +
      s.evidence.supplement,
  );
  const maxFreq = Math.max(...allFreq, 1);
  const allCompetitor = Object.values(stats).map((s) => s.evidence.competitor);
  const maxCompetitor = Math.max(...allCompetitor, 1);
  const allGithubAvg = Object.values(stats).map((s) =>
    s.github_scores.length
      ? s.github_scores.reduce((a, b) => a + b, 0) / s.github_scores.length
      : 0,
  );
  const maxGithubAvg = Math.max(...allGithubAvg, 0.001);

  const out = Object.values(stats).map((s) => {
    const total =
      s.evidence.github +
      s.evidence.reddit +
      s.evidence.x +
      s.evidence.youtube +
      s.evidence.competitor +
      s.evidence.supplement;
    const githubAvg = s.github_scores.length
      ? s.github_scores.reduce((a, b) => a + b, 0) / s.github_scores.length
      : 0;
    const freqNorm = Math.log10(total + 1) / Math.log10(maxFreq + 1);
    const compNorm = s.evidence.competitor / maxCompetitor;
    const ghNorm = githubAvg / maxGithubAvg;
    const score = 0.4 * freqNorm + 0.3 * compNorm + 0.3 * ghNorm;
    const evidence_count = Object.values(s.evidence).filter((v) => v > 0)
      .length;
    return {
      slug: s.slug,
      display_name: s.display_name,
      tags: s.tags,
      score: Number(score.toFixed(4)),
      total_evidence: total,
      evidence_count,
      evidence: s.evidence,
      github_avg_score: Number(githubAvg.toFixed(4)),
      github_likes_total: s.github_likes_total,
      sample_prompt_ids: s.sample_prompt_ids,
    };
  });

  out.sort((a, b) => b.score - a.score);
  return out;
}

// ==== 主流程 ====

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function writeJsonl(path: string, records: any[]) {
  writeFileSync(
    path,
    records.map((r) => JSON.stringify(r)).join('\n') + '\n',
  );
}

function generateSummary(
  candidates: any[],
  githubCount: number,
  allCount: number,
  masterCount: number,
  suppCount: number,
): string {
  const lines: string[] = [];
  lines.push('# Phase 1: 候选 cluster 打分汇总');
  lines.push('');
  lines.push(`生成时间：${new Date().toISOString()}`);
  lines.push('');
  lines.push('## 数据规模');
  lines.push(`- GitHub prompt 数据集：${githubCount} 条`);
  lines.push(`- 跨源记录总数：${allCount}`);
  lines.push(
    `- prompts.master.jsonl（GitHub 已分类）：${masterCount} 条`,
  );
  lines.push(
    `- prompts.supplemental.jsonl（非 GitHub 含 prompt）：${suppCount} 条`,
  );
  lines.push('');
  lines.push('## 候选 cluster 排名');
  lines.push('');
  lines.push(
    '| # | slug | score | 总证据 | 多源数 | github | reddit | x | youtube | competitor | sup. | gh_avg |',
  );
  lines.push(
    '|---|------|-------|--------|--------|--------|--------|---|---------|------------|------|--------|',
  );
  candidates.forEach((c, i) => {
    const e = c.evidence;
    lines.push(
      `| ${i + 1} | \`${c.slug}\` | ${c.score.toFixed(3)} | ${c.total_evidence} | ${c.evidence_count} | ${e.github} | ${e.reddit} | ${e.x} | ${e.youtube} | ${e.competitor} | ${e.supplement} | ${c.github_avg_score} |`,
    );
  });
  lines.push('');
  lines.push('## 评分公式');
  lines.push('```');
  lines.push(
    'score = 0.4 × log10(total_evidence + 1) / log10(max_total + 1)',
  );
  lines.push('      + 0.3 × competitor_evidence / max_competitor');
  lines.push('      + 0.3 × github_avg_score / max_github_avg');
  lines.push('```');
  lines.push('');
  lines.push('## 多源数 ≥ 3 的候选');
  const goodCandidates = candidates.filter((c) => c.evidence_count >= 3);
  lines.push(`共 ${goodCandidates.length} 个 / ${candidates.length}`);
  lines.push('');
  goodCandidates.forEach((c) => {
    const e = c.evidence;
    lines.push(
      `- **${c.slug}**：${c.evidence_count} 源支撑（github=${e.github} reddit=${e.reddit} x=${e.x} youtube=${e.youtube} competitor=${e.competitor} sup=${e.supplement}）`,
    );
  });
  lines.push('');
  lines.push('## 下一步（Phase 2）');
  lines.push('');
  lines.push(
    '对 top 15-20 候选用 browsermcp 跑 Google SERP 验证（主词 + autocomplete + PAA + related + intitle 数），剔除 SERP 已被 Reddit/Pinterest 锁死或主词被歧义占领的，敲定 10 P0。',
  );
  return lines.join('\n');
}

function main() {
  ensureDir(OUTPUT_DIR);

  console.log('[1/6] 读取 GitHub 1446 prompt 数据集...');
  const github = loadGithubPrompts();
  console.log(`  ${github.length} records`);

  console.log('[2/6] 读取 Reddit...');
  const reddit = loadReddit();
  console.log(`  ${reddit.length} records`);

  console.log('[3/6] 读取 X chrome + search...');
  const xChrome = loadXChrome();
  const xSearch = loadXSearch();
  console.log(`  x_chrome=${xChrome.length}, x_search=${xSearch.length}`);

  console.log('[4/6] 读取 YouTube transcripts...');
  const youtube = loadYoutube();
  console.log(`  ${youtube.length} videos`);

  console.log('[5/6] 读取竞品页 + supplement...');
  const competitor = loadCompetitorPages();
  const supplement = loadXSearchSupplement();
  console.log(
    `  competitor=${competitor.length}, supplement=${supplement.length}`,
  );

  const all: NormalizedRecord[] = [
    ...github,
    ...reddit,
    ...xChrome,
    ...xSearch,
    ...youtube,
    ...competitor,
    ...supplement,
  ];

  console.log('[6/6] 分配 cluster + 评分...');
  for (const r of all) {
    r.matched_clusters = assignClusters(r);
  }

  const allCandidates = scoreClusters(all);
  const candidates = allCandidates.filter((c) => c.evidence_count >= 3);

  // 写出 tag-map.json
  const tagMap = CLUSTERS.map((c) => ({
    slug: c.slug,
    display_name: c.display_name,
    tags: c.tags,
    keywords_pattern: c.keywords.source,
    keywords_flags: c.keywords.flags,
    github_categories: c.github_categories,
    reddit_use_cases: c.reddit_use_cases,
  }));
  writeFileSync(
    join(OUTPUT_DIR, 'tag-map.json'),
    JSON.stringify(tagMap, null, 2),
  );

  // candidates.all.jsonl keeps low-evidence topics for later review.
  writeJsonl(join(OUTPUT_DIR, 'candidates.all.jsonl'), allCandidates);

  // candidates.jsonl is the Phase 2 input and only includes multi-source topics.
  writeJsonl(join(OUTPUT_DIR, 'candidates.jsonl'), candidates);

  // prompts.master.jsonl - 只放 GitHub 数据集（主选品池）
  const master = github
    .filter((g) => g.matched_clusters.length > 0)
    .map((g) => ({
      raw_id: g.raw_id,
      source: g.source,
      prompt_text: g.prompt_text,
      image_urls: g.image_urls,
      github_score: g.github_score,
      github_likes: g.github_likes,
      github_views: g.github_views,
      github_model: g.github_model,
      github_categories: g.github_categories,
      matched_clusters: g.matched_clusters,
      source_url: g.url,
    }));
  writeJsonl(join(OUTPUT_DIR, 'prompts.master.jsonl'), master);

  // prompts.supplemental.jsonl - 非 GitHub 含 prompt 的线索
  const supp = [...reddit, ...xChrome, ...xSearch]
    .filter((r) => r.matched_clusters.length > 0 && r.prompt_text)
    .map((r) => ({
      raw_id: r.raw_id,
      source: r.source,
      prompt_text: r.prompt_text,
      image_urls: r.image_urls,
      matched_clusters: r.matched_clusters,
      source_url: r.url,
      reddit_score: r.reddit_score,
    }));
  writeJsonl(join(OUTPUT_DIR, 'prompts.supplemental.jsonl'), supp);

  // summary.md
  const summary = generateSummary(
    allCandidates,
    github.length,
    all.length,
    master.length,
    supp.length,
  );
  writeFileSync(join(OUTPUT_DIR, 'summary.md'), summary);

  console.log('\n========== 完成 ==========');
  console.log(`tag-map.json:                  ${tagMap.length} clusters`);
  console.log(`candidates.all.jsonl:          ${allCandidates.length} total candidates`);
  console.log(`candidates.jsonl:              ${candidates.length} multi-source candidates`);
  console.log(
    `prompts.master.jsonl:          ${master.length} GitHub prompts (matched)`,
  );
  console.log(
    `prompts.supplemental.jsonl:    ${supp.length} non-GitHub prompts`,
  );
  console.log(`总记录数：                       ${all.length}`);
  console.log('\n=== Top 10 候选 ===');
  for (let i = 0; i < Math.min(10, candidates.length); i++) {
    const c = candidates[i];
    const padded = (c.slug as string).padEnd(40);
    console.log(
      `${(i + 1).toString().padStart(2)}. ${padded} score=${c.score.toFixed(3)}  ev=${c.total_evidence.toString().padStart(4)}  src=${c.evidence_count}`,
    );
  }
}

main();
