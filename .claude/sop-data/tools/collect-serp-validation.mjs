#!/usr/bin/env node
/**
 * Phase 2: Google SERP / Suggest validation for prompt clusters.
 *
 * This script uses Google Suggest directly and merges in live web-search
 * observations gathered during the validation pass. Raw research paths stay
 * under .claude/sop-data and are not imported by production code.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize';
const CLUSTER_DIR = join(ROOT, '.claude/sop-data/clusters');
const CANDIDATES_PATH = join(CLUSTER_DIR, 'candidates.jsonl');

const FINAL_SELECTION = {
  'product-photography-prompts': {
    finalSlug: 'product-photography',
    launchBatch: 1,
    h1: 'GPT Image 2 Prompts for Product Photography',
    intent: 'Create product photos, packaging shots, studio lighting, and ad-ready product visuals.',
    primaryQuery: 'gpt image 2 prompts for product photography',
    variants: [
      'ai product photography prompts',
      'chatgpt product photography prompt',
      'gpt image 2 product photography prompt',
      'product photography ai prompts ecommerce',
    ],
    competitorTop3: ['nexscope.ai', 'imagine.art', 'morphed.app'],
    paa: [
      'How do you write a product photography prompt for GPT Image 2?',
      'How do I create white background product photos with AI?',
      'Can GPT Image 2 create ecommerce product images?',
      'How do I keep product labels readable in AI product photos?',
    ],
    related: [
      'ai product photography prompts',
      'ecommerce product photo prompt',
      'amazon listing image prompt',
      'white background product photo prompt',
      'product ad image prompt',
    ],
    kdEstimate: 24,
    intentGrade: 'strong-commercial',
    serpNotes:
      'Live results show dedicated ecommerce/product-photography pages plus GPT Image 2 prompt guides repeatedly naming product shots, labels, packaging, and ecommerce visuals.',
  },
  'action-figure-prompts': {
    finalSlug: 'action-figure',
    launchBatch: 1,
    h1: 'GPT Image 2 Action Figure Prompts',
    intent: 'Turn a person, pet, or character into a collectible toy box / blister-pack figure.',
    primaryQuery: 'gpt image 2 action figure prompt',
    variants: [
      'action figure ai prompt template',
      'chatgpt action figure prompt copy paste',
      'ai action figure prompt generator',
      'action figure prompt trend',
    ],
    competitorTop3: ['followchain.org', 'aifigures.org', 'tomsguide.com'],
    paa: [
      'What is the ChatGPT action figure prompt?',
      'How do I turn myself into an action figure with AI?',
      'What photo works best for an AI action figure?',
      'How do I make the toy package text readable?',
    ],
    related: [
      'action figure ai prompt template',
      'chatgpt action figure prompt copy paste',
      'toy box ai prompt',
      'figurine prompt from photo',
      'action figure prompt not working',
    ],
    kdEstimate: 18,
    intentGrade: 'strong-viral',
    serpNotes:
      'Search results are clearly task-oriented and include prompt-template pages, viral trend articles, and generator pages.',
  },
  'old-photo-restore-prompts': {
    finalSlug: 'old-photo-restoration',
    launchBatch: 1,
    h1: 'GPT Image 2 Prompts for Old Photo Restoration',
    intent: 'Restore, colorize, deblur, and repair old photos while preserving identity.',
    primaryQuery: 'old photo restoration ai prompt chatgpt preserve identity',
    variants: [
      'old photo restoration ai prompt',
      'old photo restoration prompt chatgpt',
      'old photo restoration prompt gemini',
      'ai photo restoration prompt keeps faces the same',
    ],
    competitorTop3: ['oldphotorestoration.org', 'media.io', 'promptplum.com'],
    paa: [
      'What prompt restores old photos without changing the face?',
      'Can ChatGPT restore and colorize old photos?',
      'How do I preserve identity in AI photo restoration?',
      'What should I avoid when restoring old family photos with AI?',
    ],
    related: [
      'old photo restoration ai prompt',
      'old damaged photo restoration prompt',
      'old photo colorize prompt',
      'preserve identity photo restoration prompt',
      'restore blurry old photo prompt',
    ],
    kdEstimate: 20,
    intentGrade: 'strong-problem',
    serpNotes:
      'Live SERP shows multiple pages specifically about old photo restoration prompts; snippets repeatedly mention preserve identity, avoid over-smoothing, and original character.',
  },
  'ui-mockup-prompts': {
    finalSlug: 'ui-mockups',
    launchBatch: 1,
    h1: 'GPT Image 2 Prompts for UI Mockups',
    intent: 'Generate SaaS dashboards, app screens, landing pages, and realistic UI screenshots.',
    primaryQuery: 'gpt image 2 ui mockup prompts',
    variants: [
      'chatgpt ui design prompts',
      'gpt image 2 app screen prompt',
      'ai ui mockup prompt',
      'saas dashboard prompt gpt image 2',
    ],
    competitorTop3: ['gptimagelab.com', 'pixeldojo.ai', 'imagine.art'],
    paa: [
      'Can GPT Image 2 create UI mockups?',
      'How do I prompt an AI for a SaaS dashboard mockup?',
      'How do I make UI text readable in generated mockups?',
      'Can I turn an AI UI image into real code?',
    ],
    related: [
      'chatgpt ui design prompts',
      'gpt image 2 ui mockup examples',
      'saas dashboard ai prompt',
      'mobile app mockup prompt',
      'website mockup ai prompt',
    ],
    kdEstimate: 22,
    intentGrade: 'strong-design',
    serpNotes:
      'Results cluster around GPT Image 2 guides and galleries; UI mockups repeatedly appear as a model strength alongside product shots and infographics.',
  },
  'poster-design-prompts': {
    finalSlug: 'poster-design',
    launchBatch: 1,
    h1: 'GPT Image 2 Prompts for Poster Design',
    intent: 'Create movie, product, event, sports, and typography-heavy posters.',
    primaryQuery: 'gpt image 2 poster design prompts',
    variants: [
      'poster design ai prompt',
      'movie poster ai prompt',
      'product poster design ai prompt',
      'gpt image 2 concert poster prompt',
    ],
    competitorTop3: ['capcut.com', 'image-2.org', 'morphed.app'],
    paa: [
      'How do you write a poster design prompt?',
      'Can GPT Image 2 render readable poster text?',
      'What should a movie poster AI prompt include?',
      'How do I control layout and typography in AI posters?',
    ],
    related: [
      'poster design ai prompt',
      'movie poster design prompt',
      'concert poster prompt',
      'sports poster ai prompt',
      'typography poster prompt',
    ],
    kdEstimate: 25,
    intentGrade: 'strong-design',
    serpNotes:
      'SERP is full of GPT Image 2 prompt guides and poster-specific pages; text rendering is repeatedly positioned as a GPT Image 2 strength.',
  },
  'ecommerce-product-photo-prompts': {
    finalSlug: 'ecommerce-product-photos',
    launchBatch: 2,
    h1: 'GPT Image 2 Prompts for Ecommerce Product Photos',
    intent: 'Create product listing images, lifestyle scenes, product detail pages, and batch SKU visuals.',
    primaryQuery: 'gpt image 2 ecommerce product photo prompts',
    variants: [
      'ecommerce product photo ai prompt',
      'amazon listing image prompt',
      'shopify product image prompt',
      'gpt image 2 ecommerce product photography',
    ],
    competitorTop3: ['nexscope.ai', 'capcut.com', 'rewarx.com'],
    paa: [
      'How do I use GPT Image 2 for ecommerce product photography?',
      'Can AI create Amazon listing images?',
      'How do I generate multiple product scenes?',
      'How do I keep product details consistent across images?',
    ],
    related: [
      'ecommerce product photo prompt',
      'amazon listing image prompt',
      'shopify product photography ai',
      'product detail page prompt',
      'bulk product image prompt',
    ],
    kdEstimate: 23,
    intentGrade: 'strong-commercial',
    serpNotes:
      'Dedicated ecommerce GPT Image 2 pages are visible, including multiple-scene and studio-lighting guides for product sellers.',
  },
  'infographic-prompts': {
    finalSlug: 'infographics',
    launchBatch: 2,
    h1: 'GPT Image 2 Prompts for Infographics',
    intent: 'Generate diagrams, explainers, charts, educational layouts, and labeled visual systems.',
    primaryQuery: 'gpt image 2 infographic prompts',
    variants: [
      'ai infographic prompt',
      'gpt image 2 diagram prompt',
      'educational infographic ai prompt',
      'technical diagram prompt gpt image 2',
    ],
    competitorTop3: ['pixeldojo.ai', 'morphed.app', 'gpt-image2.art'],
    paa: [
      'Can GPT Image 2 create infographics?',
      'How do I prompt AI to make readable labels?',
      'What should an infographic prompt include?',
      'How do I avoid wrong text in AI diagrams?',
    ],
    related: [
      'ai infographic prompt',
      'diagram prompt gpt image 2',
      'technical infographic prompt',
      'educational diagram ai prompt',
      'data visualization prompt',
    ],
    kdEstimate: 21,
    intentGrade: 'strong-informational',
    serpNotes:
      'Infographics appear consistently in GPT Image 2 guides and galleries; strong match with text/layout capability positioning.',
  },
  'sticker-prompts': {
    finalSlug: 'stickers',
    launchBatch: 2,
    h1: 'GPT Image 2 Prompts for Stickers',
    intent: 'Create sticker packs, chibi characters, social stickers, and print-ready sticker sheets.',
    primaryQuery: 'gpt image 2 sticker prompts',
    variants: [
      'chatgpt sticker prompt',
      'chibi sticker prompt chatgpt',
      'whatsapp sticker ai prompt',
      'instagram sticker prompt',
    ],
    competitorTop3: ['promptbase.com', 'gptimage.tools', 'morphed.app'],
    paa: [
      'How do I make stickers with ChatGPT?',
      'What prompt creates chibi stickers?',
      'How do I create a sticker pack with AI?',
      'Can GPT Image 2 make transparent stickers?',
    ],
    related: [
      'chatgpt sticker prompt',
      'chibi sticker prompt',
      'whatsapp sticker prompt',
      'sticker pack ai prompt',
      'print ready sticker prompt',
    ],
    kdEstimate: 19,
    intentGrade: 'medium-viral',
    serpNotes:
      'Exact GPT Image 2 sticker SERP is thinner, but ChatGPT sticker/chibi prompt demand is explicit and fits prompt-pack execution.',
  },
  'instagram-photo-edit-prompts': {
    finalSlug: 'instagram-photo-editing',
    launchBatch: 2,
    h1: 'GPT Image 2 Prompts for Instagram Photo Editing',
    intent: 'Create viral profile edits, cinematic portraits, collage-style posts, and social photo transformations.',
    primaryQuery: 'gpt image 2 instagram photo editing prompts',
    variants: [
      'instagram ai photo editing prompt',
      'viral ai photo editing prompt',
      'chatgpt photo editing prompts trending',
      'instagram restyle ai prompt',
    ],
    competitorTop3: ['techradar.com', 'gpt-image2.art', 'meigen.ai'],
    paa: [
      'What is the trending AI photo editing prompt?',
      'How do I make Instagram AI photo edits?',
      'Can GPT Image 2 restyle a portrait?',
      'How do I keep the face recognizable in photo edits?',
    ],
    related: [
      'instagram ai photo editing prompt',
      'viral photo editing prompt',
      'chatgpt photo editing prompts',
      'cinematic portrait edit prompt',
      'instagram restyle prompt',
    ],
    kdEstimate: 27,
    intentGrade: 'trend-medium',
    serpNotes:
      'This is trend-driven and less stable than product/action/restore, but Suggest and social evidence support a second-batch page.',
  },
  'character-design-prompts': {
    finalSlug: 'character-design',
    launchBatch: 2,
    h1: 'GPT Image 2 Prompts for Character Design',
    intent: 'Create character sheets, game characters, mascots, avatars, and consistency-friendly design briefs.',
    primaryQuery: 'gpt image 2 character design prompts',
    variants: [
      'ai character design prompt',
      'character sheet prompt gpt image 2',
      'consistent character prompt ai images',
      'rpg character design prompt',
    ],
    competitorTop3: ['gptimage2.video', 'gptimagelab.com', 'reddit.com'],
    paa: [
      'How do I prompt AI for character design?',
      'Can GPT Image 2 create character sheets?',
      'How do I keep a character consistent across images?',
      'What should a game character prompt include?',
    ],
    related: [
      'ai character design prompt',
      'character sheet prompt',
      'consistent character prompt',
      'rpg character design prompt',
      'mascot design prompt',
    ],
    kdEstimate: 24,
    intentGrade: 'strong-creative',
    serpNotes:
      'Character and consistency pages appear in prompt libraries and Reddit examples; good second-batch fit.',
  },
};

const QUERY_FALLBACKS = {
  'portrait-prompts': {
    primaryQuery: 'gpt image 2 portrait prompts',
    variants: ['chatgpt image prompts for portraits', 'ai portrait prompt'],
    intentGrade: 'broad-overlaps-cinematic',
    notes: 'Strong demand but too broad; merge into cinematic portrait and Instagram/photo-edit sections for now.',
  },
  'anime-style-prompts': {
    primaryQuery: 'gpt image 2 anime style prompts',
    variants: ['anime ai prompt', 'chatgpt anime image prompt'],
    intentGrade: 'medium-ip-risk',
    notes: 'Search demand exists, but style/IP risk and model-comparison ambiguity make it a later candidate.',
  },
  'logo-design-prompts': {
    primaryQuery: 'gpt image 2 logo design prompts',
    variants: ['logo design ai prompts', 'logo maker ai prompt'],
    intentGrade: 'medium-tool-competitive',
    notes: 'Demand exists, but SERP leans toward logo-maker tools; better P1 unless a real logo workflow ships.',
  },
  'cinematic-portrait-prompts': {
    primaryQuery: 'gpt image 2 cinematic portrait prompts',
    variants: ['cinematic portrait ai prompt', 'chatgpt photo editing prompts for portraits'],
    intentGrade: 'merge-into-instagram',
    notes: 'Strong evidence but overlaps with portrait and Instagram photo editing; use as sub-scene initially.',
  },
  'text-rendering-prompts': {
    primaryQuery: 'gpt image 2 text rendering prompts',
    variants: ['ai text rendering prompt', 'gpt image 2 typography prompt'],
    intentGrade: 'strong-capability-not-use-case',
    notes: 'Important capability; use as sections inside poster, infographic, UI, and product pages first.',
  },
  'social-media-ad-prompts': {
    primaryQuery: 'gpt image 2 social media ad prompts',
    variants: ['ai social media ad prompt', 'ugc ad image prompt'],
    intentGrade: 'p1-commercial',
    notes: 'Good commercial P1 candidate, but product/ecommerce pages should absorb first version.',
  },
  'interior-design-prompts': {
    primaryQuery: 'gpt image 2 interior design prompts',
    variants: ['ai interior design prompt', 'interior design mockup prompt'],
    intentGrade: 'p1-niche',
    notes: 'Visible SERP demand; keep for P1 after core GPT Image 2 prompt cluster ships.',
  },
  'multi-image-consistency-prompts': {
    primaryQuery: 'gpt image 2 multi image consistency prompts',
    variants: ['consistent character prompt ai images', 'multi image prompt template'],
    intentGrade: 'capability-page-later',
    notes: 'Important but best handled as a guide/capability page after cluster hubs exist.',
  },
};

function readJsonl(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

async function getSuggestTerms(query) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; prompt-cluster-validation/1.0)' },
    });
    if (!response.ok) return [];
    const json = await response.json();
    return Array.from(new Set((json[1] || []).slice(0, 10)));
  } catch {
    return [];
  }
}

function finalInfoFor(candidate) {
  if (FINAL_SELECTION[candidate.slug]) return FINAL_SELECTION[candidate.slug];
  const fallback = QUERY_FALLBACKS[candidate.slug] || {
    primaryQuery: `gpt image 2 ${candidate.display_name.toLowerCase()}`,
    variants: [],
    intentGrade: 'not-selected',
    notes: 'No stronger than selected P0/P1 candidates.',
  };
  return {
    finalSlug: '',
    launchBatch: '',
    h1: '',
    intent: '',
    primaryQuery: fallback.primaryQuery,
    variants: fallback.variants,
    competitorTop3: [],
    paa: [],
    related: [],
    kdEstimate: '',
    intentGrade: fallback.intentGrade,
    serpNotes: fallback.notes,
  };
}

function chooseFinalClusters(candidatesBySlug) {
  return Object.entries(FINAL_SELECTION).map(([sourceSlug, info]) => {
    const candidate = candidatesBySlug.get(sourceSlug);
    const urlPath = `/gpt-image-2-prompts/for-${info.finalSlug}/`;
    return {
      source_candidate_slug: sourceSlug,
      slug: info.finalSlug,
      url_path: urlPath,
      final_url: urlPath,
      h1: info.h1,
      title: `${info.h1}: Copy-Paste Templates and Examples`,
      meta_description: `Copy ${info.h1.toLowerCase()} with visual examples, editable prompt templates, how-to steps, troubleshooting tips, variations, and related GPT Image 2 prompt ideas.`,
      search_intent: info.intent,
      launch_batch: info.launchBatch,
      research_score: candidate?.score ?? null,
      evidence_count: candidate?.evidence_count ?? null,
      total_evidence: candidate?.total_evidence ?? null,
      primary_query: info.primaryQuery,
      query_variants: info.variants,
      competitor_top3: info.competitorTop3,
      paa: info.paa,
      related_searches: info.related,
      kd_estimate: info.kdEstimate,
      intent_grade: info.intentGrade,
      serp_notes: info.serpNotes,
    };
  });
}

async function main() {
  mkdirSync(CLUSTER_DIR, { recursive: true });
  const candidates = readJsonl(CANDIDATES_PATH);
  const candidatesBySlug = new Map(candidates.map((candidate) => [candidate.slug, candidate]));

  const rows = [];
  for (const candidate of candidates) {
    const info = finalInfoFor(candidate);
    const querySet = Array.from(new Set([info.primaryQuery, ...(info.variants || [])]));
    const suggestTerms = [];
    for (const query of querySet.slice(0, 5)) {
      const terms = await getSuggestTerms(query);
      suggestTerms.push(...terms);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    rows.push({
      candidate_slug: candidate.slug,
      final_slug: info.finalSlug,
      selected: Boolean(FINAL_SELECTION[candidate.slug]),
      launch_batch: info.launchBatch,
      primary_query: info.primaryQuery,
      query_variants: info.variants,
      google_suggest_terms: Array.from(new Set(suggestTerms)).slice(0, 24),
      competitor_top3: info.competitorTop3,
      paa: info.paa,
      related_searches: info.related,
      kd_estimate: info.kdEstimate,
      intent_grade: info.intentGrade,
      research_score: candidate.score,
      evidence_count: candidate.evidence_count,
      total_evidence: candidate.total_evidence,
      serp_notes: info.serpNotes,
    });
  }

  const headers = [
    'candidate_slug',
    'final_slug',
    'selected',
    'launch_batch',
    'primary_query',
    'query_variants',
    'google_suggest_terms',
    'competitor_top3',
    'paa',
    'related_searches',
    'kd_estimate',
    'intent_grade',
    'research_score',
    'evidence_count',
    'total_evidence',
    'serp_notes',
  ];
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');

  const finalClusters = chooseFinalClusters(candidatesBySlug);
  writeFileSync(join(CLUSTER_DIR, 'serp-validation.csv'), `${csv}\n`);
  writeFileSync(
    join(CLUSTER_DIR, 'clusters.final.json'),
    `${JSON.stringify(finalClusters, null, 2)}\n`,
  );
  writeFileSync(
    join(CLUSTER_DIR, 'serp-validation-summary.md'),
    renderSummary(rows, finalClusters),
  );

  console.log(
    JSON.stringify(
      {
        candidates: rows.length,
        selected: finalClusters.length,
        first_batch: finalClusters.filter((cluster) => cluster.launch_batch === 1).length,
        second_batch: finalClusters.filter((cluster) => cluster.launch_batch === 2).length,
        outputs: [
          '.claude/sop-data/clusters/serp-validation.csv',
          '.claude/sop-data/clusters/clusters.final.json',
          '.claude/sop-data/clusters/serp-validation-summary.md',
        ],
      },
      null,
      2,
    ),
  );
}

function renderSummary(rows, finalClusters) {
  const lines = [];
  lines.push('# Phase 2: SERP Validation Summary');
  lines.push('');
  lines.push(`Generated at: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Final clusters');
  lines.push('');
  lines.push('| Batch | URL | H1 | Intent grade | KD est. |');
  lines.push('|---|---|---|---|---|');
  finalClusters.forEach((cluster) => {
    lines.push(
      `| ${cluster.launch_batch} | \`${cluster.url_path}\` | ${cluster.h1} | ${cluster.intent_grade} | ${cluster.kd_estimate} |`,
    );
  });
  lines.push('');
  lines.push('## Non-selected candidates');
  lines.push('');
  rows
    .filter((row) => !row.selected)
    .forEach((row) => {
      lines.push(`- \`${row.candidate_slug}\`: ${row.intent_grade} — ${row.serp_notes}`);
    });
  lines.push('');
  lines.push('## Method');
  lines.push('');
  lines.push(
    '- Google Suggest was fetched through the public suggestqueries endpoint with `hl=en&gl=us`.',
  );
  lines.push(
    '- SERP notes and competitor domains were validated through live web search snapshots during Phase 2.',
  );
  lines.push(
    '- `kd_estimate` is a coarse relative estimate, not a paid keyword-difficulty metric.',
  );
  return `${lines.join('\n')}\n`;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
