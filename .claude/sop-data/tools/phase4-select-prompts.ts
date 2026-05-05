#!/usr/bin/env tsx
/**
 * Phase 4: Prompt 选品 + 去重 + 去敏 + 改写 + 按 cluster 分配
 *
 * 输入：
 *   .claude/sop-data/clusters/prompts.master.jsonl       (GitHub 1446)
 *   .claude/sop-data/clusters/prompts.supplemental.jsonl (Reddit/X 34)
 *   .claude/sop-data/clusters/awesome-gpt-image-2.new.jsonl (awesome 126)
 *   .claude/sop-data/clusters/specs/{slug}.json (10 P0 specs)
 *
 * 输出：
 *   .claude/sop-data/clusters/{slug}/prompts.jsonl (10 文件)
 *   .claude/sop-data/clusters/phase4-summary.md
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { join } from 'node:path';

const ROOT =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';
const SPECS_DIR = `${ROOT}/specs`;

// ==================================================
// 1. 配置：cluster 关键词 / awesome use_case 映射 / 黑名单
// ==================================================

// awesome 的 use_case → 我们 P0 cluster
const AWESOME_USECASE_MAP: Record<string, string | null> = {
  'Profile / Avatar': 'cinematic-portrait-prompts',
  'Social Media Post': 'instagram-photo-edit-prompts',
  'Infographic / Edu Visual': 'infographic-prompts',
  'YouTube Thumbnail': 'thumbnail-prompts',
  'Comic / Storyboard': null, // P1 候选
  'Product Marketing': 'product-photography-prompts',
  'E-commerce Main Image': null, // P1 候选
  'Game Asset': null,
  'Poster / Flyer': 'poster-design-prompts',
  'App / Web Design': null, // REJECT
};

// GitHub 6 大类 → 我们 P0 cluster（多映射，每条 prompt 可能命中多个）
const GITHUB_CATEGORY_MAP: Record<string, string[]> = {
  Photography: [
    'cinematic-portrait-prompts',
    'product-photography-prompts',
    'food-photography-prompts',
  ],
  'Illustration & 3D': [
    'sticker-prompts',
    'cinematic-portrait-prompts',
  ],
  'Product & Brand': ['product-photography-prompts'],
  'Food & Drink': ['food-photography-prompts'],
  'Poster Design': ['poster-design-prompts'],
  'UI & Graphic': ['infographic-prompts', 'poster-design-prompts'],
};

// 每个 cluster 的关键词（搜文本时用）— 与 normalize-clusters.ts 对齐但更专注
type ClusterKeywords = {
  slug: string;
  text_match: RegExp;
  exclude_keywords?: RegExp; // 命中即排除，用于 cinematic-portrait 等需要严格过滤的 cluster
  tier: 'viral' | 'commercial' | 'creative';
  input_image_required: boolean;
};

const CLUSTERS: ClusterKeywords[] = [
  {
    slug: 'action-figure-prompts',
    text_match:
      /\b(action\s+figure|figurine|funko|toy\s+(packaging|figure)|collectible\s+toy|blister\s+pack|3d\s+(action\s+figure|toy)|1\/7\s+scale)\b/i,
    tier: 'viral',
    input_image_required: true,
  },
  {
    slug: 'old-photo-restore-prompts',
    text_match:
      /\b(restore|colorize|colorise|old\s+photo|vintage\s+photo|black\s?and\s?white\s+photo|grandparent|grandma|grandfather|deblur|denoise|repair\s+(damage|scratch|tear)|family\s+photo)\b/i,
    tier: 'viral',
    input_image_required: true,
  },
  {
    slug: 'instagram-photo-edit-prompts',
    text_match:
      /\b(instagram|reel|tiktok|trending|aesthetic\s+(filter|edit|portrait)|viral\s+edit|saree|aura\s+farm|butterfly\s+effect|childhood|collage|golden\s+hour\s+(girl|boy)|cinematic\s+(boy|girl|edit))\b/i,
    tier: 'viral',
    input_image_required: true,
  },
  {
    slug: 'sticker-prompts',
    text_match:
      /\b(sticker|chibi|kawaii|line\s+sticker|telegram\s+sticker|whatsapp\s+sticker|emoji\s+sticker|die[\s-]?cut|cute\s+(sticker|character|portrait))\b/i,
    tier: 'viral',
    input_image_required: true,
  },
  {
    slug: 'thumbnail-prompts',
    text_match:
      /\b(youtube\s+thumbnail|thumbnail|click[\s-]?bait|video\s+thumbnail|reaction\s+thumbnail)\b/i,
    tier: 'viral',
    input_image_required: true,
  },
  {
    slug: 'cinematic-portrait-prompts',
    text_match:
      /\b(cinematic\s+portrait|film\s+noir|chiaroscuro|noir\s+portrait|editorial\s+portrait|movie\s+portrait|moody\s+portrait|dramatic\s+(portrait|lighting)|professional\s+(headshot|portrait)|magazine\s+cover|golden\s+hour\s+portrait|window\s+light\s+portrait|neon\s+(rain|portrait)|fashion\s+editorial|studio\s+portrait|head\s?shot)\b/i,
    // 排除 anime/chibi/illustration/sticker 等非真人摄影风格
    // 解决 awesome-gpt-image-2 的 "Profile / Avatar" 类目被错误归类问题
    exclude_keywords:
      /\b(anime|chibi|kawaii|pixar|disney|cartoon|sticker|doodle|crayon|halo|wings|manga|sketch|big\s+eyes|plush|ghibli|line\s+sticker|character\s+(sheet|design)|q[\s-]?style|illustrated\s+character|hand[\s-]?drawn|3d\s+render|3d\s+character|3d\s+mascot|robot\s+mascot|cute\s+(little|chibi|character)|cartoon\s+style|toy\s+figure|caricature|line\s+art\s+portrait|crayon\s+style|sketchbook|notebook\s+collage|y2k\s+aesthetic\s+collage|shih\s?tzu|golden\s+retriever|labrador|bulldog|poodle|husky|shiba\s+inu|corgi|pet\s+portrait|dog\s+photo|cat\s+photo|animal\s+portrait)\b/i,
    tier: 'commercial',
    input_image_required: true,
  },
  {
    slug: 'product-photography-prompts',
    text_match:
      /\b(product\s+(photo|shot|photography)|white\s+background|catalog\s+(photo|shot)|on\s+model|model\s+try\s?on|lifestyle\s+shot|packshot|studio\s+(lighting|product)|flat\s?lay|hero\s+shot|exploded\s+view)\b/i,
    tier: 'commercial',
    input_image_required: true,
  },
  {
    slug: 'poster-design-prompts',
    text_match:
      /\b(poster|movie\s+poster|concert\s+poster|propaganda|retro\s+poster|minimal(?:ist)?\s+poster|vintage\s+poster|event\s+poster|art\s+poster|swiss\s+design|bauhaus|typography\s+poster)\b/i,
    tier: 'creative',
    input_image_required: false,
  },
  {
    slug: 'food-photography-prompts',
    text_match:
      /\b(food\s+(photo|photography|shot)|dish\s+photo|restaurant\s+menu|recipe|drink\s+photo|coffee\s+art|cocktail|dessert\s+photo|cake\s+photo|ramen|burger|pizza|sushi|smoothie|food\s+styling|flat\s?lay\s+food)\b/i,
    tier: 'commercial',
    input_image_required: false,
  },
  {
    slug: 'infographic-prompts',
    text_match:
      /\b(infographic|chart|diagram|data\s+(visualization|viz)|process\s+diagram|step\s+by\s+step\s+diagram|venn\s+diagram|isometric\s+(infographic|breakdown|render|view)|exploded\s+view|technical\s+(diagram|illustration)|comparison\s+chart|timeline\s+(infographic|diagram)|callout\s+labels|annotated)\b/i,
    tier: 'creative',
    input_image_required: false,
  },
];

const CLUSTER_BY_SLUG: Record<string, ClusterKeywords> = Object.fromEntries(
  CLUSTERS.map((c) => [c.slug, c]),
);

// 黑名单：明星 / 品牌 IP / 政治人物 → 用 [placeholder] 替换
const SENSITIVE_REPLACEMENTS: Array<[RegExp, string]> = [
  // tech CEO
  [/\b(Sam\s+Altman|sam\s+altman)\b/g, '[tech CEO]'],
  [/\b(Elon\s+Musk|elon\s+musk)\b/g, '[tech billionaire]'],
  [/\b(Mark\s+Zuckerberg)\b/g, '[social media CEO]'],
  [/\b(Jensen\s+Huang)\b/g, '[chip company CEO]'],
  [/\b(Steve\s+Jobs)\b/g, '[iconic tech founder]'],
  // 政治人物
  [/\b(Donald\s+Trump|trump)\b/g, '[politician]'],
  [/\b(Joe\s+Biden|biden)\b/g, '[politician]'],
  [/\b(Xi\s+Jinping|Vladimir\s+Putin)\b/g, '[head of state]'],
  // 影视/明星
  [/\b(Taylor\s+Swift|Beyonce|Beyoncé|Lady\s+Gaga|Ariana\s+Grande|Rihanna)\b/g, '[pop star]'],
  [/\b(Leonardo\s+DiCaprio|Brad\s+Pitt|Tom\s+Cruise|Scarlett\s+Johansson)\b/g, '[Hollywood actor]'],
  [/\b(Ryan\s+Reynolds|Will\s+Smith|Jennifer\s+Lawrence|Margot\s+Robbie|Sydney\s+Sweeney|Zendaya|Emma\s+Stone|Emma\s+Watson|Anne\s+Hathaway|Gal\s+Gadot|Florence\s+Pugh)\b/g, '[Hollywood actor]'],
  [/\b(Kim\s+Kardashian|Kylie\s+Jenner|Kendall\s+Jenner)\b/g, '[reality TV celebrity]'],
  [/\b(Cristiano\s+Ronaldo|Lionel\s+Messi|LeBron\s+James|Michael\s+Jordan)\b/g, '[athlete]'],
  // 日韩明星
  [/\b(BTS|BLACKPINK|TWICE|NewJeans|aespa)\b/g, '[K-pop group]'],
  // 品牌 IP
  [/\b(Funko\s+Pop|funko)\b/gi, '[collectible toy brand]'],
  [/\b(Disney|disney|Pixar|pixar)\b/g, '[major animation studio]'],
  [/\b(Marvel|marvel|DC\s+Comics)\b/g, '[major comics studio]'],
  [/\b(Lego|lego|LEGO)\b/g, '[building block brand]'],
  [/\b(Pokemon|Pokémon|pokemon)\b/g, '[anime monster franchise]'],
  // 影视角色
  [/\b(Spider[\s-]?Man|Iron\s+Man|Batman|Superman|Wonder\s+Woman)\b/g, '[superhero character]'],
  [/\b(Mickey\s+Mouse|Donald\s+Duck|Bugs\s+Bunny)\b/g, '[classic cartoon character]'],
  // 商业品牌
  [/\b(Coca[\s-]?Cola|Pepsi|McDonald'?s|Starbucks)\b/g, '[major beverage/food brand]'],
  [/\b(Nike|Adidas|Puma|Reebok)\b/g, '[athletic apparel brand]'],
  [/\b(iPhone\s+\d+|MacBook|AirPods|Apple\s+Watch)\b/g, '[premium consumer electronics]'],
  [/\b(Meta\s+Quest|PlayStation|Xbox|Nintendo\s+Switch)\b/g, '[gaming/VR device]'],
];

// 占位符，用户复制后自己填
function applySanitization(text: string): { sanitized: string; replaced: string[] } {
  let out = text;
  const replaced: string[] = [];
  for (const [pat, repl] of SENSITIVE_REPLACEMENTS) {
    if (pat.test(out)) {
      const matches = out.match(pat) || [];
      replaced.push(...matches);
      out = out.replace(pat, repl);
    }
  }
  return { sanitized: out, replaced: Array.from(new Set(replaced)) };
}

// ==================================================
// 2. 数据加载
// ==================================================

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

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJsonl(path: string, records: any[]) {
  writeFileSync(path, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
}

function ensureDir(p: string) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

// ==================================================
// 3. 候选归类
// ==================================================

type Candidate = {
  raw_id: string;
  source: 'github' | 'reddit' | 'x_chrome' | 'x_search' | 'awesome-gpt-image-2';
  prompt_text: string;
  image_urls: string[];
  source_url: string | null;
  // GitHub 字段
  github_score?: number;
  github_likes?: number;
  github_views?: number;
  github_categories?: string[];
  github_model?: string;
  // awesome 字段
  use_case_external?: string | null;
  mapped_cluster?: string | null;
  is_featured?: boolean;
  language?: string;
  title?: string;
  // reddit 字段
  reddit_score?: number;
};

type Assignment = {
  cluster_slug: string;
  sub_scene_tag: string | null;
  match_score: number;
};

function loadAllCandidates(): Candidate[] {
  const all: Candidate[] = [];

  // GitHub master
  const master = readJsonl(`${ROOT}/prompts.master.jsonl`);
  for (const r of master) {
    all.push({
      raw_id: r.raw_id,
      source: 'github',
      prompt_text: r.prompt_text || '',
      image_urls: r.image_urls || [],
      source_url: r.source_url || null,
      github_score: r.github_score,
      github_likes: r.github_likes,
      github_views: r.github_views,
      github_categories: r.github_categories || [],
      github_model: r.github_model,
    });
  }

  // Reddit + X supplemental
  const supp = readJsonl(`${ROOT}/prompts.supplemental.jsonl`);
  for (const r of supp) {
    all.push({
      raw_id: r.raw_id,
      source: r.source,
      prompt_text: r.prompt_text || '',
      image_urls: r.image_urls || [],
      source_url: r.source_url || null,
      reddit_score: r.reddit_score,
    });
  }

  // awesome-gpt-image-2 (only new, deduped)
  const awesome = readJsonl(`${ROOT}/awesome-gpt-image-2.new.jsonl`);
  for (const r of awesome) {
    all.push({
      raw_id: r.raw_id,
      source: 'awesome-gpt-image-2',
      prompt_text: r.prompt_text || '',
      image_urls: r.image_urls || [],
      source_url: r.source_url || null,
      use_case_external: r.use_case_external,
      mapped_cluster: r.mapped_cluster,
      is_featured: r.is_featured,
      language: r.language,
      title: r.title,
    });
  }

  return all;
}

// 给 candidate 打分 vs 每个 cluster
function scoreCandidateForCluster(c: Candidate, cluster: ClusterKeywords): number {
  const text = c.prompt_text.toLowerCase();
  const matches = (text.match(new RegExp(cluster.text_match.source, 'gi')) || []).length;

  // 关键约束 1：awesome 中 mapped_cluster=null 的（如 Comic/Storyboard / Game Asset / App Web Design / E-commerce），
  // 不进 P0 选品池（避免被错误归类）
  if (c.source === 'awesome-gpt-image-2' && c.mapped_cluster === null) {
    return 0;
  }

  // 关键约束 2：awesome 中有 mapped_cluster 但跟当前 cluster 不一致 → 0 分
  // （awesome 使用 use_case 作为权威标签，避免跨 cluster 误归类）
  if (
    c.source === 'awesome-gpt-image-2' &&
    c.mapped_cluster &&
    c.mapped_cluster !== cluster.slug
  ) {
    return 0;
  }

  // 关键约束 3：非 awesome 来源（GitHub / Reddit / X），必须有文本关键词命中
  // 否则 GitHub 1446 里大量泛通用 prompt 会污染所有 cluster
  if (c.source !== 'awesome-gpt-image-2' && matches === 0) {
    return 0;
  }

  // 关键约束 4：exclude_keywords 命中即排除（用于风格严格过滤）
  if (cluster.exclude_keywords && cluster.exclude_keywords.test(text)) {
    return 0;
  }

  let score = 0;

  // 直接 awesome 映射 → 最高分
  if (c.source === 'awesome-gpt-image-2' && c.mapped_cluster === cluster.slug) {
    score += 1000;
  }

  // GitHub 分类映射（只在文本关键词也命中时加分）
  if (c.source === 'github' && c.github_categories && matches > 0) {
    for (const cat of c.github_categories) {
      const targets = GITHUB_CATEGORY_MAP[cat] || [];
      if (targets.includes(cluster.slug)) {
        score += 100;
      }
    }
  }

  // 文本关键词匹配
  score += matches * 30;

  // 加成分：来源
  if (c.source === 'awesome-gpt-image-2') score += 50; // 精品起步
  if (c.source === 'github' && (c.github_score ?? 0) > 50) score += 20;

  // GitHub model 加成
  if (c.source === 'github' && c.github_model === 'gptimage') score += 5;

  return score;
}

// 选 sub_scene
function pickSubScene(c: Candidate, spec: any): string | null {
  const text = c.prompt_text.toLowerCase();
  const subScenes: any[] = spec.sub_scenes || [];
  let best = null;
  let bestScore = 0;
  for (const ss of subScenes) {
    const desc = (ss.description || '').toLowerCase();
    const name = (ss.name || '').toLowerCase();
    let s = 0;
    // 拆分 description 关键词
    const keywords = (name + ' ' + desc)
      .replace(/[^a-z0-9\s一-鿿]/gi, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4);
    for (const kw of keywords) {
      if (text.includes(kw)) s++;
    }
    if (s > bestScore) {
      bestScore = s;
      best = ss.slug_anchor;
    }
  }
  return best;
}

// ==================================================
// 4. minhash 简化版去重
// ==================================================

function tokenize(text: string): Set<string> {
  const norm = (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1500);
  const words = norm.split(' ').filter((w) => w.length > 0);
  const shingles = new Set<string>();
  for (let i = 0; i + 5 <= words.length; i++) {
    shingles.add(words.slice(i, i + 5).join(' '));
  }
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

// 不同 tier 用不同去重阈值
// viral cluster 模板化严重（很多人复制 viral prompt 套用），用更宽容的阈值避免误删
const DEDUP_THRESHOLDS: Record<string, number> = {
  viral: 0.78,
  commercial: 0.65,
  creative: 0.65,
};
const DEFAULT_DEDUP_THRESHOLD = 0.65;

function dedup(candidates: Candidate[], threshold = DEFAULT_DEDUP_THRESHOLD): Candidate[] {
  const kept: Candidate[] = [];
  const tokens: Set<string>[] = [];
  for (const c of candidates) {
    const t = tokenize(c.prompt_text);
    let dup = false;
    for (const existing of tokens) {
      if (jaccard(t, existing) >= threshold) {
        dup = true;
        break;
      }
    }
    if (!dup) {
      kept.push(c);
      tokens.push(t);
    }
  }
  return kept;
}

// ==================================================
// 5. 标题生成（如果没有原标题）
// ==================================================

function deriveTitle(c: Candidate, fallback: string): string {
  if (c.title) return c.title;
  // 取 prompt 第一行前 60 字
  const firstLine = c.prompt_text.split('\n')[0] || '';
  const cleaned = firstLine
    .replace(/^[\{\["#`]+/, '')
    .replace(/['"]+/g, '')
    .slice(0, 60)
    .trim();
  if (cleaned.length > 10) return cleaned;
  return fallback;
}

// ==================================================
// 6. 主流程
// ==================================================

function main() {
  console.log('[1/6] 加载候选池...');
  const allCandidates = loadAllCandidates();
  console.log(
    `  github=${allCandidates.filter((c) => c.source === 'github').length}, ` +
      `supp=${allCandidates.filter((c) => c.source === 'reddit' || c.source === 'x_chrome' || c.source === 'x_search').length}, ` +
      `awesome=${allCandidates.filter((c) => c.source === 'awesome-gpt-image-2').length}`,
  );

  console.log('\n[2/6] 加载 10 P0 specs...');
  const specs: Record<string, any> = {};
  for (const c of CLUSTERS) {
    specs[c.slug] = readJson(`${SPECS_DIR}/${c.slug}.json`);
  }
  console.log(`  ${Object.keys(specs).length} specs loaded`);

  console.log('\n[3/6] 给每条候选打分（vs 每个 cluster）...');
  const candidatesWithBest = allCandidates
    .filter((c) => c.prompt_text && c.prompt_text.length >= 50)
    .map((c) => {
      let bestCluster: string | null = null;
      let bestScore = 0;
      for (const cluster of CLUSTERS) {
        const s = scoreCandidateForCluster(c, cluster);
        if (s > bestScore) {
          bestScore = s;
          bestCluster = cluster.slug;
        }
      }
      return { candidate: c, best_cluster: bestCluster, best_score: bestScore };
    })
    .filter((x) => x.best_cluster && x.best_score > 0);
  console.log(`  ${candidatesWithBest.length} 条候选被分配到 cluster`);

  console.log('\n[4/6] 按 cluster + sub_scene 配额选品 + 去重 + 去敏...');
  const clusterDist: Record<string, number> = {};
  const finalByCluster: Record<string, any[]> = {};
  const sanitizeStats: Record<string, number> = {};

  for (const cluster of CLUSTERS) {
    const spec = specs[cluster.slug];
    const targetCount = spec.estimated_prompt_count || 12;
    const subScenes: any[] = spec.sub_scenes || [];
    const dedupThreshold = DEDUP_THRESHOLDS[cluster.tier] || DEFAULT_DEDUP_THRESHOLD;

    // 加载手动 seed（如果存在）— 最高优先级直接进 final
    const seedPath = `${ROOT}/seed-prompts/${cluster.slug}.jsonl`;
    const seedRecords: Array<{ candidate: Candidate; sub_scene_tag: string | null; is_seed: boolean }> = [];
    if (existsSync(seedPath)) {
      const seedRaw = readJsonl(seedPath);
      for (const s of seedRaw) {
        seedRecords.push({
          candidate: {
            raw_id: `seed:${cluster.slug}:${seedRecords.length + 1}`,
            source: 'awesome-gpt-image-2', // seed 视为最高质量来源
            prompt_text: s.prompt_text || '',
            image_urls: [],
            source_url: null,
            title: s.title,
          },
          sub_scene_tag: s.sub_scene_tag || null,
          is_seed: true,
        });
      }
    }

    // 该 cluster 全部候选（按 score 降序）
    const pool = candidatesWithBest
      .filter((x) => x.best_cluster === cluster.slug)
      .sort((a, b) => {
        // 优先级：awesome > github score > others
        const sa = a.candidate.source === 'awesome-gpt-image-2' ? 1000 : 0;
        const sb = b.candidate.source === 'awesome-gpt-image-2' ? 1000 : 0;
        if (sa !== sb) return sb - sa;
        return b.best_score - a.best_score;
      })
      .map((x) => x.candidate);

    clusterDist[cluster.slug] = pool.length;

    // 分配 sub_scene
    const subBuckets: Record<string, Candidate[]> = {};
    for (const ss of subScenes) {
      subBuckets[ss.slug_anchor] = [];
    }
    subBuckets['_unassigned'] = [];

    for (const c of pool) {
      const ss = pickSubScene(c, spec);
      if (ss && subBuckets[ss]) {
        subBuckets[ss].push(c);
      } else {
        subBuckets['_unassigned'].push(c);
      }
    }

    // 先把 seed 直接放入 selected（最高优先级）
    const selected: Array<{ candidate: Candidate; sub_scene_tag: string | null; is_seed?: boolean }> = [
      ...seedRecords,
    ];

    // 按 sub_scene 配额取，要扣掉 seed 已占的位置
    for (const ss of subScenes) {
      const bucket = subBuckets[ss.slug_anchor] || [];
      const quota = ss.prompt_count_target || 2;
      const seedCount = seedRecords.filter((s) => s.sub_scene_tag === ss.slug_anchor).length;
      const remaining = Math.max(0, quota - seedCount);
      if (remaining === 0) continue;
      const deduped = dedup(bucket, dedupThreshold);
      const picked = deduped.slice(0, remaining);
      for (const p of picked) {
        selected.push({ candidate: p, sub_scene_tag: ss.slug_anchor });
      }
    }

    // 不够补 unassigned
    if (selected.length < targetCount) {
      const need = targetCount - selected.length;
      const dedupedUnassigned = dedup(subBuckets['_unassigned'] || [], dedupThreshold);
      for (const c of dedupedUnassigned.slice(0, need)) {
        selected.push({ candidate: c, sub_scene_tag: null });
      }
    }

    // 全局再去一次重（跨 sub_scene），但 seed 一定保留
    const finalCands: Array<{ candidate: Candidate; sub_scene_tag: string | null; is_seed?: boolean }> = [];
    const seenTokens: Set<string>[] = [];
    for (const sel of selected) {
      const t = tokenize(sel.candidate.prompt_text);
      let dup = false;
      // seed 永不被去重淘汰
      if (!sel.is_seed) {
        for (const e of seenTokens) {
          if (jaccard(t, e) >= dedupThreshold) {
            dup = true;
            break;
          }
        }
      }
      if (!dup) {
        finalCands.push(sel);
        seenTokens.push(t);
      }
    }

    // 去敏 + 改写为输出格式
    const useJsonTemplate = !!spec.json_template;
    const finalRecords = finalCands.slice(0, targetCount).map((sel, idx) => {
      const c = sel.candidate;
      const { sanitized, replaced } = applySanitization(c.prompt_text);
      if (replaced.length > 0) {
        sanitizeStats[cluster.slug] =
          (sanitizeStats[cluster.slug] || 0) + replaced.length;
      }
      const title = deriveTitle(c, `${spec.h1.replace(/ for GPT Image 2$/, '')} #${idx + 1}`);

      // 50/50 JSON template 决策（仅复杂构图 cluster）
      // 偶数 idx → 用 json_template；奇数 idx → 自然语言
      const shouldUseJsonTemplate = useJsonTemplate && idx % 2 === 0;
      const jsonTemplateRef = shouldUseJsonTemplate
        ? spec.json_template._pattern || 'main'
        : null;

      // credits 估算
      const isHighRes = ['thumbnail-prompts', 'poster-design-prompts'].includes(
        cluster.slug,
      );
      const creds = isHighRes ? 10 : 6;

      return {
        prompt_id: `${cluster.slug}-${String(idx + 1).padStart(3, '0')}`,
        cluster_slug: cluster.slug,
        sub_scene_tag: sel.sub_scene_tag,
        title,
        final_prompt: sanitized,
        json_template_ref: jsonTemplateRef,
        input_image_required: cluster.input_image_required,
        estimated_credits: creds,
        source: sel.is_seed ? 'manual-seed' : c.source,
        source_attribution_internal: c.raw_id,
        source_url_internal: c.source_url,
        original_image_urls: c.image_urls.slice(0, 2),
        sanitized_terms: replaced,
        language: c.language || 'en',
      };
    });

    finalByCluster[cluster.slug] = finalRecords;
  }

  console.log('\n[5/6] 写出 prompts.jsonl...');
  // 支持 ONLY_CLUSTER 环境变量：只重写指定 cluster，其他保留
  const onlyCluster = process.env.ONLY_CLUSTER;
  if (onlyCluster) {
    console.log(`  ONLY_CLUSTER=${onlyCluster} —— 只重写这一个 cluster`);
  }
  for (const cluster of CLUSTERS) {
    if (onlyCluster && cluster.slug !== onlyCluster) {
      console.log(`  skip ${cluster.slug}`);
      continue;
    }
    const records = finalByCluster[cluster.slug];
    const dir = `${ROOT}/${cluster.slug}`;
    ensureDir(dir);
    writeJsonl(`${dir}/prompts.jsonl`, records);
    console.log(`  wrote ${cluster.slug}/prompts.jsonl (${records.length} records)`);
  }

  console.log('\n[6/6] 写汇总...');
  const summary: string[] = [];
  summary.push('# Phase 4: Prompt 选品汇总');
  summary.push('');
  summary.push(`生成时间：${new Date().toISOString()}`);
  summary.push('');
  summary.push('## 输入');
  summary.push(`- 候选池总数: ${allCandidates.length}`);
  summary.push(`- 含完整 prompt 文本 (≥ 50 字): ${candidatesWithBest.length} 条被分配到 cluster`);
  summary.push('');
  summary.push('## 配置');
  summary.push(`- minhash 去重阈值: viral=${DEDUP_THRESHOLDS.viral} / commercial=${DEDUP_THRESHOLDS.commercial} / creative=${DEDUP_THRESHOLDS.creative}`);
  summary.push(`- 黑名单替换规则: ${SENSITIVE_REPLACEMENTS.length} 条`);
  summary.push('');
  summary.push('## 每 cluster 选品结果');
  summary.push('');
  summary.push('| Cluster | 候选池 | 选中 | 目标 | 含 JSON 模板 | 去敏次数 | 来源分布 |');
  summary.push('|---|---|---|---|---|---|---|');

  let grandTotal = 0;
  let grandCredits = 0;
  for (const cluster of CLUSTERS) {
    const records = finalByCluster[cluster.slug];
    const spec = specs[cluster.slug];
    const target = spec.estimated_prompt_count;
    const withJson = records.filter((r) => r.json_template_ref).length;
    const sources = records.reduce(
      (acc: Record<string, number>, r: any) => {
        acc[r.source] = (acc[r.source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const sourceStr = Object.entries(sources)
      .map(([k, v]) => `${k}=${v}`)
      .join(' ');
    const credits = records.reduce((s: number, r: any) => s + r.estimated_credits, 0);
    grandTotal += records.length;
    grandCredits += credits;
    summary.push(
      `| \`${cluster.slug}\` | ${clusterDist[cluster.slug]} | **${records.length}** | ${target} | ${withJson} | ${sanitizeStats[cluster.slug] || 0} | ${sourceStr} |`,
    );
  }
  summary.push(`| **合计** | — | **${grandTotal}** | 131 | — | — | credits=${grandCredits} |`);
  summary.push('');
  summary.push('## 改写策略（已采纳推荐方案）');
  summary.push('');
  summary.push('- **(a) 最小改写**：保留原 prompt 风格，只去敏');
  summary.push('- **(a) 50/50 JSON 混搭**：4 个复杂构图 cluster 偶数 idx 标记 `json_template_ref`，奇数保持自然语言');
  summary.push('- **(b) 占位符替换**：明星/品牌/IP/政治人物 → `[placeholder]`');
  summary.push('- **(a) 全自动跑完**：完成后给汇总，未做人工 QA');
  summary.push('');
  summary.push('## 输出文件');
  summary.push('');
  for (const cluster of CLUSTERS) {
    summary.push(`- \`clusters/${cluster.slug}/prompts.jsonl\`（${finalByCluster[cluster.slug].length} 条）`);
  }
  summary.push('');
  summary.push('## 字段 schema');
  summary.push('');
  summary.push('```json');
  summary.push(JSON.stringify({
    prompt_id: 'action-figure-prompts-001',
    cluster_slug: 'action-figure-prompts',
    sub_scene_tag: 'blister-pack',
    title: 'Office Worker Action Figure',
    final_prompt: 'Create a 3D action figure of [name]...',
    json_template_ref: null,
    input_image_required: true,
    estimated_credits: 6,
    source: 'awesome-gpt-image-2',
    source_attribution_internal: 'awesome-gpt-image-2:42',
    source_url_internal: 'https://x.com/...',
    original_image_urls: ['https://...'],
    sanitized_terms: ['Sam Altman'],
    language: 'en',
  }, null, 2));
  summary.push('```');
  summary.push('');
  summary.push('## 下一步');
  summary.push('Phase 5：Kie.ai 图片重生（131 张，credits 估算 ~1130）');

  writeFileSync(`${ROOT}/phase4-summary.md`, summary.join('\n'));

  console.log('\n========== 完成 ==========');
  console.log(`总选品: ${grandTotal} 条`);
  console.log(`总 credits 预算: ${grandCredits}`);
  console.log(`\n按 cluster 选品数:`);
  for (const cluster of CLUSTERS) {
    const r = finalByCluster[cluster.slug];
    const target = specs[cluster.slug].estimated_prompt_count;
    const flag = r.length === target ? '✓' : '⚠';
    console.log(
      `  ${flag} ${cluster.slug.padEnd(40)} ${r.length}/${target} (pool=${clusterDist[cluster.slug]})`,
    );
  }
}

main();
