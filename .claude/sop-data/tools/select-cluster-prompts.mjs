#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLUSTER_DIR = join(__dirname, '..', 'clusters');
const TARGET_PER_CLUSTER = 14;

const BLACKLIST = [
  /\b(disney|marvel|pixar|lego|simpsons?|pokemon|barbie|star\s+wars|nintendo|mickey|batman|spider-?man)\b/i,
  /\b(taylor\s+swift|elon\s+musk|messi|ronaldo|beyonce|zendaya|kardashian)\b/i,
  /\b(nike|adidas|apple|tesla|coca-?cola|starbucks|nescaf[eé]|louis\s+vuitton|gucci)\b/i,
];

const FOCUS = [
  'hero result',
  'detail clarity',
  'social crop',
  'premium lighting',
  'before-and-after clarity',
  'conversion use',
  'editorial polish',
  'template reuse',
  'clean negative space',
  'readable text areas',
  'consistent identity',
  'realistic material texture',
  'mobile-first crop',
  'variation set',
];

const PROMPT_CONFIG = {
  'product-photography': {
    placeholder: '[product or uploaded product image]',
    examples: [
      'matte ceramic skincare serum bottle',
      'wireless earbuds charging case',
      'stainless steel travel tumbler',
      'trail running shoe with textured sole',
      'minimalist desk lamp',
      'organic loose leaf tea pouch',
      'premium candle jar',
      'modular backpack organizer',
      'glass olive oil bottle',
      'handmade ceramic mug',
      'protein snack bar wrapper',
      'compact espresso grinder',
      'linen home fragrance box',
      'reusable water filter pitcher',
    ],
    styles: ['commercial studio photography', 'premium product photography', 'clean catalog photography', 'editorial advertising photo'],
    promptVerb: 'Create',
    subjectLine: 'product photo',
    details: [
      'softbox reflections, crisp shadow, true material texture, readable front label',
      'controlled highlights, realistic scale, clean surface, no extra logos',
      'macro detail, subtle reflections, premium packaging finish, balanced negative space',
      'high-key lighting, sharp focus, natural contact shadow, ecommerce-ready clarity',
    ],
    constraint: 'Preserve the exact product shape, label placement, material finish, and proportions; avoid invented brand marks or unreadable text.',
  },
  'action-figure': {
    placeholder: '[uploaded photo or character description]',
    examples: [
      'indie game developer with hoodie and laptop',
      'streetwear fashion creator with camera',
      'retro space explorer mascot',
      'coffee shop founder in apron',
      'fitness coach with jump rope',
      'cyber courier with utility jacket',
      'podcast host with headphones',
      'friendly robot assistant mascot',
      'skateboard designer with helmet',
      'plant shop owner with watering can',
      'minimalist office worker avatar',
      'fantasy map maker with scroll tube',
      'chef character with wooden spoon',
      'travel vlogger with compact camera',
    ],
    styles: ['collectible toy photography', 'premium action figure product shot', 'retail toy packaging render', 'vinyl figurine studio photo'],
    promptVerb: 'Turn',
    subjectLine: 'action figure concept',
    details: [
      'molded plastic texture, accessory tray, front-facing blister package, clean retail lighting',
      'visible joints, toy-scale proportions, cardboard backing, short readable package title',
      'collector edition box, small accessories, clear plastic window, studio shadow',
      'tabletop product photo, premium toy finish, crisp edges, simple label blocks',
    ],
    constraint: 'Keep the subject identity cues consistent; avoid real brand logos, copyrighted franchises, and long package copy.',
  },
  'old-photo-restoration': {
    placeholder: '[uploaded old photo]',
    examples: [
      'creased 1940s family portrait',
      'faded black-and-white wedding photo',
      'damaged school graduation portrait',
      'sepia grandparents studio photograph',
      'torn childhood snapshot on paper',
      'low-resolution archival street photo',
      'scratched military service portrait',
      'sun-faded beach vacation photo',
      'worn passport-style portrait',
      'old family dinner photograph',
      'blurry historical building photo',
      'creased couple portrait from the 1960s',
      'damaged baby photo in an album',
      'faded village group portrait',
    ],
    styles: ['careful photo restoration', 'natural archive restoration', 'historically plausible colorization', 'conservative image repair'],
    promptVerb: 'Restore',
    subjectLine: 'old photo restoration',
    details: [
      'remove scratches and dust, preserve face structure, keep original pose and clothing',
      'natural skin tones, repaired paper damage, period-accurate color, soft grain retained',
      'recover contrast and clarity, keep age and expression unchanged, avoid modern styling',
      'subtle sharpening, balanced exposure, authentic vintage texture, no added objects',
    ],
    constraint: 'Do not beautify or alter identity; repair visible damage only and preserve the original composition.',
  },
  'ui-mockups': {
    placeholder: '[product or app idea]',
    examples: [
      'AI meeting notes SaaS dashboard',
      'mobile habit tracker app',
      'finance analytics admin panel',
      'developer API monitoring tool',
      'creator newsletter landing page',
      'team project management app',
      'health appointment booking app',
      'ecommerce inventory dashboard',
      'AI image editor settings screen',
      'travel planning mobile app',
      'customer support CRM view',
      'course platform student dashboard',
      'pricing page for a B2B tool',
      'design system component board',
    ],
    styles: ['modern product UI mockup', 'high-fidelity SaaS interface', 'mobile app screen design', 'clean design system presentation'],
    promptVerb: 'Design',
    subjectLine: 'UI mockup',
    details: [
      'clear navigation, real component hierarchy, readable labels, restrained color palette',
      'dense but organized layout, tables and cards aligned to an 8px grid, accessible contrast',
      'native controls, realistic spacing, polished typography, no decorative clutter',
      'dashboard charts, sidebar navigation, focused primary action, consistent component states',
    ],
    constraint: 'Use short readable UI copy; avoid overlapping components, fake logos, and marketing-poster composition.',
  },
  'poster-design': {
    placeholder: '[event, movie, product launch, or campaign]',
    examples: [
      'independent sci-fi film festival',
      'jazz night rooftop concert',
      'city marathon weekend',
      'new productivity app launch',
      'local food market event',
      'environmental documentary screening',
      'night photography workshop',
      'minimalist architecture exhibition',
      'retro arcade tournament',
      'summer surf club party',
      'book release reading night',
      'indie game announcement',
      'museum technology lecture',
      'community theater premiere',
    ],
    styles: ['print poster design', 'editorial typography poster', 'cinematic campaign poster', 'retro risograph poster'],
    promptVerb: 'Create',
    subjectLine: 'poster design',
    details: [
      'bold headline hierarchy, one hero subject, strong contrast, print-ready spacing',
      'large readable title, limited palette, textured paper, balanced negative space',
      'dramatic lighting, clear date and venue blocks, strong visual motif',
      'grid-based layout, poster-scale typography, no tiny unreadable copy',
    ],
    constraint: 'Keep text short and legible; avoid copied brand marks, celebrity likenesses, and cluttered layouts.',
  },
  'ecommerce-product-photos': {
    placeholder: '[product or SKU]',
    examples: [
      'insulated stainless steel bottle',
      'linen button-down shirt',
      'ceramic dinnerware set',
      'portable standing desk lamp',
      'natural deodorant tube',
      'foldable travel backpack',
      'premium dog grooming brush',
      'cotton yoga mat',
      'smart garden sensor',
      'handmade soap bar bundle',
      'minimal wall clock',
      'coffee brewing starter kit',
      'reusable silicone food bags',
      'wooden desk organizer',
    ],
    styles: ['ecommerce listing photography', 'marketplace product image', 'conversion-focused product visual', 'PDP gallery image'],
    promptVerb: 'Create',
    subjectLine: 'ecommerce product image',
    details: [
      'centered product, clean shadow, marketplace-safe composition, readable packaging area',
      'PDP hero framing, feature callout space, realistic scale, simple background',
      'bundle arrangement, consistent SKU spacing, true colors, no misleading props',
      'lifestyle usage context, product remains dominant, clear benefit focus',
    ],
    constraint: 'Do not invent claims, badges, or brand logos; keep the product recognizable and listing-safe.',
  },
  infographics: {
    placeholder: '[topic, product, process, or concept]',
    examples: [
      'how a compact heat pump works',
      'AI image generation workflow',
      'coffee brewing variables',
      'home battery backup system',
      'remote team onboarding process',
      'sourdough fermentation timeline',
      'electric bicycle component map',
      'skincare routine comparison chart',
      'small business sales funnel',
      'solar panel installation steps',
      'mobile app security checklist',
      'camera exposure triangle',
      'recycling lifecycle diagram',
      'language learning roadmap',
    ],
    styles: ['clean educational infographic', 'technical diagram poster', 'editorial explainer graphic', 'structured visual guide'],
    promptVerb: 'Create',
    subjectLine: 'infographic',
    details: [
      '5 labeled sections, clear arrows, icon-like illustrations, readable short labels',
      'top-down information hierarchy, balanced grid, simple captions, strong contrast',
      'numbered steps, concise callouts, white space, accurate relationships',
      'diagrammatic layout, restrained palette, large headings, no decorative filler',
    ],
    constraint: 'Use short labels and clear logic; avoid dense paragraphs, random arrows, and unreadable microtext.',
  },
  stickers: {
    placeholder: '[character, pet, mascot, object, or phrase]',
    examples: [
      'happy corgi holding a coffee cup',
      'sleepy cloud mascot',
      'tiny cactus saying hello',
      'friendly robot waving',
      'angry toast character',
      'cozy cat in a scarf',
      'sparkling avocado mascot',
      'planner notebook with smiling face',
      'duck with rain boots',
      'wizard frog character',
      'mountain badge mascot',
      'retro camera with heart eyes',
      'tea cup character cheering',
      'tiny ghost giving thumbs up',
    ],
    styles: ['die-cut sticker illustration', 'chibi sticker art', 'messenger sticker pack style', 'bold mascot sticker'],
    promptVerb: 'Create',
    subjectLine: 'sticker',
    details: [
      'thick white outline, transparent-background intent, simple pose, high contrast',
      'cute expression, clean silhouette, minimal details, sticker-sheet ready',
      'bold shape language, limited palette, readable at small sizes',
      'isolated subject, no background scene, crisp vector-like edges',
    ],
    constraint: 'Avoid copyrighted characters, busy backgrounds, tiny details, and long text.',
  },
  'instagram-photo-editing': {
    placeholder: '[uploaded photo]',
    examples: [
      'street portrait at golden hour',
      'travel selfie near a cafe',
      'outfit mirror photo',
      'couple photo on a city walk',
      'creator portrait with laptop',
      'beach vacation snapshot',
      'night market phone photo',
      'fitness progress portrait',
      'graduation day photo',
      'musician backstage portrait',
      'fashion lookbook photo',
      'birthday dinner snapshot',
      'coffee shop lifestyle photo',
      'urban rooftop portrait',
    ],
    styles: ['viral Instagram photo edit', 'cinematic portrait retouch', 'editorial social feed image', 'retro film photo treatment'],
    promptVerb: 'Edit',
    subjectLine: 'Instagram photo edit',
    details: [
      'preserve identity, natural skin, cinematic lighting, 4:5 crop, subtle color grade',
      'multi-frame collage layout, realistic shadows, clean feed-ready composition',
      'film grain, flash feel, authentic texture, no face distortion',
      'editorial cover framing, strong focal point, polished but realistic finish',
    ],
    constraint: 'Do not change face, body shape, clothing, or important background details unless requested.',
  },
  'character-design': {
    placeholder: '[character idea]',
    examples: [
      'forest courier with leaf-shaped satchel',
      'space botanist in practical suit',
      'friendly bookkeeping mascot',
      'desert ranger with solar backpack',
      'cozy bakery apprentice',
      'retro-futurist train conductor',
      'mountain rescue drone pilot',
      'library wizard with floating notes',
      'ocean cartographer with shell compass',
      'playful productivity app mascot',
      'rpg healer with lantern staff',
      'city cyclist messenger',
      'miniature robot gardener',
      'festival mask maker',
    ],
    styles: ['character design sheet', 'mascot concept art', 'stylized 3D character concept', 'RPG character model sheet'],
    promptVerb: 'Design',
    subjectLine: 'character concept',
    details: [
      'front view, side view, back view, expression row, signature prop, consistent palette',
      'strong silhouette, readable outfit layers, personality cues, clean turnaround layout',
      'pose sheet with neutral stance and action pose, consistent facial features',
      'model-sheet layout, accessory callouts, material notes, no background clutter',
    ],
    constraint: 'Avoid copyrighted styles or characters; preserve the same face, outfit, colors, and props across views.',
  },
};

function parseJsonl(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function sourceScore(record) {
  const sourceBoost = record.source === 'github' ? 100000 : record.source === 'x' ? 50000 : record.source === 'reddit' ? 20000 : 0;
  return sourceBoost + (record.github_score ?? record.x_likes ?? record.reddit_score ?? record.youtube_views ?? 0);
}

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function hasBlockedText(text) {
  return BLACKLIST.some((pattern) => pattern.test(text));
}

function compactTitle(sceneLabel, example) {
  const title = `${sceneLabel}: ${example}`;
  return title.length <= 80 ? title : `${sceneLabel}: ${example.slice(0, Math.max(12, 77 - sceneLabel.length))}...`;
}

function buildPrompt(config, scene, style, details, subject, focus) {
  const common = `Style/medium: ${style}. Desired result: ${scene.user_intent} Use a clear focal point, practical framing, and enough negative space for reuse. Variation focus: ${focus}. Lighting/details: ${details}. Constraints: ${config.constraint}`;
  if (config.promptVerb === 'Turn') {
    return `Turn ${subject} into an ${config.subjectLine}. Format: ${scene.label}. ${common}`;
  }
  if (config.promptVerb === 'Restore') {
    return `Restore ${subject} with a ${config.subjectLine} workflow. Mode: ${scene.label}. ${common}`;
  }
  if (config.promptVerb === 'Edit') {
    return `Edit ${subject} into an ${config.subjectLine}. Format: ${scene.label}. ${common}`;
  }
  if (config.promptVerb === 'Design') {
    return `Design a ${config.subjectLine} for ${subject}. Use case: ${scene.label}. ${common}`;
  }
  return `Create a ${config.subjectLine} for ${subject}. Use case: ${scene.label}. ${common}`;
}

function buildUserPrompt(config, scene, style, details, focus) {
  return buildPrompt(config, scene, style, details, config.placeholder, focus);
}

function buildImagePrompt(config, scene, style, details, example, focus) {
  return buildPrompt(config, scene, style, details, example, focus);
}

function chooseEvidence(pool, sourceCandidateSlug) {
  return pool
    .filter((record) => Array.isArray(record.matched_clusters) && record.matched_clusters.includes(sourceCandidateSlug))
    .sort((a, b) => sourceScore(b) - sourceScore(a));
}

const pool = [
  ...parseJsonl(join(CLUSTER_DIR, 'prompts.master.jsonl')),
  ...parseJsonl(join(CLUSTER_DIR, 'prompts.supplemental.jsonl')),
];

const specSlugs = readdirSync(CLUSTER_DIR)
  .filter((name) => existsSync(join(CLUSTER_DIR, name, 'spec.json')))
  .sort();

const summary = [];

for (const slug of specSlugs) {
  const spec = JSON.parse(readFileSync(join(CLUSTER_DIR, slug, 'spec.json'), 'utf8'));
  const config = PROMPT_CONFIG[slug];
  if (!config) throw new Error(`Missing prompt config for ${slug}`);

  const evidence = chooseEvidence(pool, spec.source_candidate_slug);
  if (evidence.length === 0) throw new Error(`No evidence prompts found for ${slug}`);

  const records = [];
  const seen = new Set();
  for (let index = 0; records.length < TARGET_PER_CLUSTER && index < TARGET_PER_CLUSTER * 3; index += 1) {
    const scene = spec.sub_scenes[index % spec.sub_scenes.length];
    const example = config.examples[index % config.examples.length];
    const style = config.styles[index % config.styles.length];
    const details = config.details[index % config.details.length];
    const focus = FOCUS[index % FOCUS.length];
    const title = compactTitle(scene.label, example);
    const finalPrompt = buildUserPrompt(config, scene, style, details, focus);
    const imagePrompt = buildImagePrompt(config, scene, style, details, example, focus);
    const signature = normalizeText(`${scene.slug} ${style} ${details} ${focus}`);
    if (seen.has(signature)) continue;
    seen.add(signature);
    if (hasBlockedText(`${title}\n${finalPrompt}\n${imagePrompt}`)) continue;

    const source = evidence[records.length % evidence.length];
    records.push({
      prompt_id: `${slug}-${String(records.length + 1).padStart(2, '0')}`,
      title,
      sub_scene_tag: scene.slug,
      final_prompt: finalPrompt,
      image_prompt: imagePrompt,
      source_attribution_internal: {
        source: source.source,
        raw_id: source.raw_id,
        source_url: source.source_url,
        source_score: sourceScore(source),
        matched_cluster: spec.source_candidate_slug,
      },
    });
  }

  if (records.length < 12) throw new Error(`${slug} produced only ${records.length} prompts`);

  writeFileSync(
    join(CLUSTER_DIR, slug, 'prompts.jsonl'),
    `${records.map((record) => JSON.stringify(record)).join('\n')}\n`,
  );

  summary.push({
    slug,
    prompt_count: records.length,
    evidence_count: evidence.length,
    sub_scene_count: new Set(records.map((record) => record.sub_scene_tag)).size,
    min_title_length_ok: records.every((record) => record.title.length <= 80),
  });
}

writeFileSync(join(CLUSTER_DIR, 'prompts.index.json'), `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify({
  clusters: summary.length,
  target_per_cluster: TARGET_PER_CLUSTER,
  total_prompts: summary.reduce((sum, item) => sum + item.prompt_count, 0),
  min_prompts: Math.min(...summary.map((item) => item.prompt_count)),
  max_prompts: Math.max(...summary.map((item) => item.prompt_count)),
  output: '.claude/sop-data/clusters/{slug}/prompts.jsonl',
}, null, 2));
