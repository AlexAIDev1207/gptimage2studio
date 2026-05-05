#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLUSTER_DIR = join(__dirname, '..', 'clusters');
const finalClusters = JSON.parse(readFileSync(join(CLUSTER_DIR, 'clusters.final.json'), 'utf8'));
const finalSlugSet = new Set(finalClusters.map((cluster) => cluster.slug));

const CONFIG = {
  'product-photography': {
    label: 'Product Photography',
    hero: 'Generate clean studio shots, packaging details, and campaign-ready product visuals from copy-paste GPT Image 2 prompts.',
    subScenes: [
      ['white-background', 'White Background Product Photos', 'Create marketplace-ready product shots with clean shadows and readable labels.', 'white background product photo prompt'],
      ['studio-lighting', 'Studio Lighting', 'Control softboxes, reflections, rim light, and product material texture.', 'studio product photography prompt'],
      ['lifestyle-scene', 'Lifestyle Product Scenes', 'Place products in realistic rooms, outdoor scenes, or tabletop environments.', 'lifestyle product image prompt'],
      ['packaging-labels', 'Packaging and Labels', 'Keep box copy, labels, and ingredient panels as legible as possible.', 'product label prompt'],
      ['ad-creatives', 'Product Ad Creatives', 'Turn a product into scroll-stopping hero ads and social placements.', 'product ad image prompt'],
      ['flat-lay', 'Flat Lay and Bundles', 'Build overhead arrangements, kits, and bundles for catalog or launch pages.', 'flat lay product prompt'],
    ],
    howTo: [
      ['Define the product precisely', 'Name the product type, material, color, label area, and any parts that must remain unchanged.'],
      ['Choose the selling context', 'Specify white background, ecommerce listing, lifestyle scene, premium ad, or bundle layout.'],
      ['Lock lighting and camera language', 'Add lens, angle, shadow, reflection, and surface details so the image feels photographed instead of generic.'],
    ],
    troubleshooting: [
      ['The label text is distorted', 'Ask for large readable label areas, front-facing packaging, simple typography, and avoid tiny secondary copy.'],
      ['The product shape changes', 'Add "preserve the exact silhouette, proportions, logo placement, and material finish".'],
      ['The scene looks like stock imagery', 'Use a concrete surface, props, lighting setup, camera angle, and commercial use context.'],
    ],
    variations: ['white background', 'premium studio lighting', 'Amazon main image', 'Shopify hero banner', 'lifestyle scene', 'social ad crop'],
    related: ['ecommerce-product-photos', 'poster-design', 'infographics', 'instagram-photo-editing'],
  },
  'action-figure': {
    label: 'Action Figure',
    hero: 'Turn a person, character, or mascot idea into collectible toy packaging, figurines, and viral action figure edits.',
    subScenes: [
      ['blister-pack', 'Blister Pack Figures', 'Create retail-style toy packaging with figure, accessories, and product card.', 'action figure ai prompt template'],
      ['from-photo', 'From Photo to Figure', 'Transform a selfie or portrait into a toy-like collectible while preserving identity cues.', 'figurine prompt from photo'],
      ['desk-toy', 'Desk Toy Figurines', 'Generate small premium figurines for creator avatars, founders, or mascots.', 'chatgpt action figure prompt copy paste'],
      ['retro-toy-box', 'Retro Toy Box', 'Use nostalgic package layouts, bold headers, and accessory callouts.', 'toy box ai prompt'],
      ['accessory-set', 'Accessory Sets', 'Add tools, props, alternate hands, badges, and character-specific extras.', 'action figure accessories prompt'],
    ],
    howTo: [
      ['Start with the figure identity', 'Describe the subject, clothing, pose, facial expression, and recognizable traits.'],
      ['Add packaging constraints', 'Specify blister pack, cardboard backing, product name, accessory slots, and display angle.'],
      ['Make it collectible', 'Include scale, plastic texture, studio lighting, premium toy photography, and limited-edition details.'],
    ],
    troubleshooting: [
      ['The result is too realistic', 'Ask for molded plastic texture, visible joints, toy-scale proportions, and packaging photography.'],
      ['The packaging text is messy', 'Keep package copy short: one title, two callouts, and simple label blocks.'],
      ['The likeness is weak', 'Name specific identity cues such as hairstyle, glasses, outfit colors, and pose.'],
    ],
    variations: ['blister pack', 'boxed collector edition', 'mini figurine', 'desk toy', 'retro toy card', 'mascot figure'],
    related: ['character-design', 'stickers', 'instagram-photo-editing', 'poster-design'],
  },
  'old-photo-restoration': {
    label: 'Old Photo Restoration',
    hero: 'Restore scratches, colorize black-and-white images, and preserve faces with prompt templates built for careful photo repair.',
    subScenes: [
      ['scratch-repair', 'Scratch and Tear Repair', 'Remove cracks, dust, stains, and paper damage without changing the subject.', 'old damaged photo restoration prompt'],
      ['colorize', 'Black and White Colorization', 'Add natural skin tones, clothing color, and period-appropriate environments.', 'old photo colorize prompt'],
      ['face-preservation', 'Preserve Identity', 'Improve clarity while keeping the same face structure, expression, and age.', 'preserve identity photo restoration prompt'],
      ['sharpen-blur', 'Sharpen Blurry Photos', 'Recover softness, motion blur, and low-resolution family photos carefully.', 'restore blurry old photo prompt'],
      ['historical-archive', 'Historical Archive Style', 'Restore documentary and archival photos while respecting the original context.', 'historical photo restoration prompt'],
    ],
    howTo: [
      ['Tell the model what must not change', 'Preserve identity, age, pose, clothing, background layout, and original composition.'],
      ['Separate repair from enhancement', 'Request scratch removal, color correction, and clarity improvements before asking for stylized output.'],
      ['Use conservative language', 'Prefer "natural restoration" and "historically plausible color" over dramatic makeover wording.'],
    ],
    troubleshooting: [
      ['The face changes too much', 'Use "do not beautify, do not alter facial structure, preserve original likeness".'],
      ['The photo becomes too modern', 'Ask for period-accurate colors, original clothing, and no modern accessories.'],
      ['Details look invented', 'Use "repair visible damage only; avoid adding new people, objects, or background elements".'],
    ],
    variations: ['scratch repair', 'colorize black and white', 'family portrait restore', 'wedding photo repair', 'archive restoration', 'soft sharpening'],
    related: ['instagram-photo-editing', 'portrait-prompts', 'character-design', 'infographics'],
  },
  'ui-mockups': {
    label: 'UI Mockups',
    hero: 'Create app screens, dashboards, landing pages, and polished product mockups with structured GPT Image 2 UI prompts.',
    subScenes: [
      ['saas-dashboard', 'SaaS Dashboard Mockups', 'Generate dense but readable analytics, CRM, finance, or admin interfaces.', 'saas dashboard ai prompt'],
      ['mobile-app', 'Mobile App Screens', 'Design iOS or Android app screens with native controls and clear hierarchy.', 'mobile app mockup prompt'],
      ['website-mockup', 'Website Mockups', 'Create landing pages, pricing pages, hero sections, and product pages.', 'website mockup ai prompt'],
      ['wireframe-to-ui', 'Wireframe to High-Fidelity UI', 'Turn a rough structure into a polished visual concept.', 'chatgpt ui design prompts'],
      ['component-system', 'Component and Design System', 'Explore cards, buttons, forms, tables, and navigation patterns.', 'ui component prompt'],
    ],
    howTo: [
      ['Specify product type and user goal', 'Say whether the screen is a dashboard, mobile app, onboarding flow, or landing page.'],
      ['Describe information density', 'Call out navigation, tables, forms, charts, cards, and what should be emphasized.'],
      ['Constrain the visual system', 'Add style, platform, typography feel, spacing, color palette, and accessibility requirements.'],
    ],
    troubleshooting: [
      ['Text is unreadable', 'Ask for fewer labels, larger UI text, short real words, and clearly separated sections.'],
      ['The layout looks like a landing page', 'Specify utilitarian product UI, dense content, persistent navigation, and repeated workflows.'],
      ['Components overlap', 'Ask for a clean grid, consistent spacing, fixed side navigation, and no floating decorative cards.'],
    ],
    variations: ['SaaS dashboard', 'mobile app', 'settings screen', 'pricing page', 'analytics UI', 'design system board'],
    related: ['infographics', 'poster-design', 'product-photography', 'ecommerce-product-photos'],
  },
  'poster-design': {
    label: 'Poster Design',
    hero: 'Build movie posters, event flyers, typography layouts, and campaign graphics with GPT Image 2 poster prompts.',
    subScenes: [
      ['movie-poster', 'Movie Posters', 'Use cinematic composition, title hierarchy, cast-like spacing, and dramatic lighting.', 'movie poster design prompt'],
      ['concert-flyer', 'Concert and Event Flyers', 'Create music, club, conference, and launch event posters.', 'concert poster prompt'],
      ['sports-poster', 'Sports Posters', 'Design action-heavy posters with athlete focus, team color, and bold type.', 'sports poster ai prompt'],
      ['typography-poster', 'Typography Posters', 'Control big type, hierarchy, negative space, and print layout style.', 'typography poster prompt'],
      ['vintage-print', 'Vintage Print Posters', 'Use retro paper, halftone, risograph, or editorial poster styles.', 'poster design ai prompt'],
    ],
    howTo: [
      ['Name the poster job', 'Specify movie, event, campaign, sports, editorial, or product launch poster.'],
      ['Define the visual hierarchy', 'Call out main subject, headline, subheadline, date/location, logo area, and CTA.'],
      ['Choose print and art direction', 'Add poster size, medium, color palette, texture, lighting, and typography references.'],
    ],
    troubleshooting: [
      ['The text is unusable', 'Keep copy short and ask for bold readable headline blocks with minimal small text.'],
      ['The design is too generic', 'Add a concrete genre, event type, audience, color contrast, and layout constraint.'],
      ['The poster lacks focus', 'Limit the scene to one hero subject, one headline, and one supporting visual motif.'],
    ],
    variations: ['movie poster', 'concert flyer', 'sports poster', 'typography poster', 'product launch poster', 'retro print'],
    related: ['infographics', 'instagram-photo-editing', 'product-photography', 'stickers'],
  },
  'ecommerce-product-photos': {
    label: 'Ecommerce Product Photos',
    hero: 'Create Amazon, Shopify, and product-detail-page visuals with prompts tuned for listings, bundles, and conversion assets.',
    subScenes: [
      ['amazon-main', 'Amazon Main Images', 'Generate clean primary images with product centered and marketplace-safe composition.', 'amazon listing image prompt'],
      ['shopify-hero', 'Shopify Hero Images', 'Create brand-forward ecommerce banners and PDP hero visuals.', 'shopify product photography ai'],
      ['detail-callouts', 'Product Detail Callouts', 'Show features, materials, scale, ingredients, and usage in clear visual frames.', 'product detail page prompt'],
      ['bundle-sets', 'Bundles and Variants', 'Arrange multi-SKU kits, colors, sizes, or starter packs.', 'bulk product image prompt'],
      ['ad-placement', 'Paid Social Product Ads', 'Turn listing assets into Meta/TikTok-ready creative variations.', 'ecommerce product photo prompt'],
    ],
    howTo: [
      ['Match the sales channel', 'State Amazon main image, Shopify PDP, social ad, email banner, or marketplace gallery.'],
      ['List conversion details', 'Mention scale, use case, ingredients, texture, included accessories, or benefit callouts.'],
      ['Control compliance and clarity', 'Use clean backgrounds, simple props, no misleading claims, and readable label areas.'],
    ],
    troubleshooting: [
      ['The image violates marketplace style', 'Ask for a pure white background, centered product, no extra props, and simple shadow.'],
      ['The product benefit is unclear', 'Add one benefit-focused scene and one close-up detail callout.'],
      ['Variants get mixed together', 'Describe each SKU color, quantity, and arrangement explicitly.'],
    ],
    variations: ['Amazon listing', 'Shopify hero', 'PDP detail image', 'bundle kit', 'lifestyle ecommerce', 'paid social ad'],
    related: ['product-photography', 'poster-design', 'instagram-photo-editing', 'infographics'],
  },
  'infographics': {
    label: 'Infographics',
    hero: 'Turn concepts, processes, comparisons, and educational topics into clear GPT Image 2 infographic prompts.',
    subScenes: [
      ['process-diagram', 'Process Diagrams', 'Explain workflows, funnels, cycles, and step-by-step systems.', 'diagram prompt gpt image 2'],
      ['comparison-chart', 'Comparison Charts', 'Create versus layouts, feature matrices, pros/cons, and option grids.', 'ai infographic prompt'],
      ['timeline', 'Timelines', 'Visualize historical, product, roadmap, or transformation timelines.', 'timeline infographic prompt'],
      ['technical-explainer', 'Technical Explainers', 'Break down products, AI systems, engineering topics, or mechanisms.', 'technical infographic prompt'],
      ['educational-poster', 'Educational Posters', 'Make classroom, training, and concept summary visuals.', 'educational diagram ai prompt'],
    ],
    howTo: [
      ['Choose the information shape', 'Use process, timeline, comparison, anatomy, checklist, or framework language.'],
      ['Limit the content load', 'Use 3-7 sections, short labels, and one core idea per block.'],
      ['Ask for layout discipline', 'Specify grid, icons, arrows, spacing, and readable hierarchy.'],
    ],
    troubleshooting: [
      ['Labels are garbled', 'Use fewer words, short section titles, and ask for large readable text blocks.'],
      ['The logic is unclear', 'Specify the direction of reading, numbered steps, and the relationship between blocks.'],
      ['The result is decorative only', 'Ask for accurate explanatory structure before style details.'],
    ],
    variations: ['process map', 'comparison chart', 'timeline', 'technical diagram', 'educational poster', 'data visualization'],
    related: ['ui-mockups', 'poster-design', 'product-photography', 'ecommerce-product-photos'],
  },
  'stickers': {
    label: 'Stickers',
    hero: 'Generate chibi characters, mascot stickers, reaction packs, and die-cut sticker sheets with copy-paste prompts.',
    subScenes: [
      ['chibi', 'Chibi Stickers', 'Create cute compact characters with expressive poses and clean outlines.', 'chibi sticker prompt'],
      ['mascot', 'Mascot Stickers', 'Turn a brand character, pet, or object into a sticker-ready mascot.', 'chatgpt sticker prompt'],
      ['reaction-pack', 'Reaction Sticker Packs', 'Build emotions, gestures, and meme-ready reaction variants.', 'sticker pack ai prompt'],
      ['messenger', 'WhatsApp and Telegram Stickers', 'Make simple high-contrast stickers for chat apps.', 'whatsapp sticker prompt'],
      ['print-ready', 'Print-Ready Die-Cut Stickers', 'Use borders, transparent-background intent, and bold silhouettes.', 'print ready sticker prompt'],
    ],
    howTo: [
      ['Pick the sticker subject', 'Define mascot, object, pet, face, phrase, or character before style.'],
      ['Control cutout readability', 'Ask for clean silhouette, thick outline, simple pose, and minimal background.'],
      ['Create pack variations', 'Request consistent character design across emotions, gestures, and captions.'],
    ],
    troubleshooting: [
      ['The sticker has a busy background', 'Ask for isolated subject, transparent-background intent, and no scene elements.'],
      ['The pack is inconsistent', 'Repeat the same character traits, palette, outline, and pose vocabulary.'],
      ['Small details disappear', 'Use bold shapes, high contrast, and limited accessories.'],
    ],
    variations: ['chibi', 'mascot', 'reaction pack', 'die-cut sticker', 'chat sticker', 'sticker sheet'],
    related: ['character-design', 'action-figure', 'instagram-photo-editing', 'poster-design'],
  },
  'instagram-photo-editing': {
    label: 'Instagram Photo Editing',
    hero: 'Create viral photo edits, collages, cinematic portraits, and feed-ready transformations with GPT Image 2 prompts.',
    subScenes: [
      ['viral-collage', 'Viral Photo Collages', 'Create multi-frame edits, scrapbook layouts, and trending collage looks.', 'instagram ai photo editing prompt'],
      ['cinematic-portrait', 'Cinematic Portrait Edits', 'Add dramatic lighting, editorial tone, and social-profile polish.', 'cinematic portrait edit prompt'],
      ['fashion-lifestyle', 'Fashion and Lifestyle Edits', 'Transform outfit shots, travel photos, and creator portraits.', 'viral photo editing prompt'],
      ['retro-film', 'Retro Film Looks', 'Use flash, disposable camera, grain, Y2K, or Polaroid aesthetics.', 'instagram restyle prompt'],
      ['cover-image', 'Carousel Cover Images', 'Design first-slide visuals that work as Instagram thumbnails.', 'chatgpt photo editing prompts'],
    ],
    howTo: [
      ['Start with the source photo role', 'Say whether the input is a selfie, couple photo, travel shot, outfit photo, or product-person image.'],
      ['Name the trend format', 'Use collage, cinematic portrait, film flash, editorial cover, or carousel opener.'],
      ['Preserve identity and composition', 'Ask for unchanged face, body shape, pose, clothing, and important background details.'],
    ],
    troubleshooting: [
      ['The person no longer looks the same', 'Use explicit preserve-identity wording and avoid beauty makeover terms.'],
      ['The edit is over-stylized', 'Ask for natural skin, realistic lighting, and subtle grade instead of surreal effects.'],
      ['The composition does not fit Instagram', 'Specify square, 4:5 portrait, or carousel cover crop.'],
    ],
    variations: ['viral collage', 'cinematic portrait', 'retro flash', 'editorial cover', 'travel postcard', 'fashion feed edit'],
    related: ['old-photo-restoration', 'poster-design', 'stickers', 'action-figure'],
  },
  'character-design': {
    label: 'Character Design',
    hero: 'Design consistent characters, mascots, RPG heroes, and expression sheets with GPT Image 2 prompt templates.',
    subScenes: [
      ['character-sheet', 'Character Sheets', 'Generate front, side, back, outfit, props, and expression references.', 'character sheet prompt'],
      ['mascot-design', 'Mascot Design', 'Create brand mascots with readable silhouette and repeatable traits.', 'mascot design prompt'],
      ['rpg-fantasy', 'RPG and Fantasy Characters', 'Build heroes, villains, classes, armor, and world-specific details.', 'rpg character design prompt'],
      ['consistent-character', 'Consistent Character Variations', 'Keep identity stable across poses, emotions, and scenes.', 'consistent character prompt'],
      ['avatar-3d', '3D Avatar Concepts', 'Make stylized 3D, game-ready, or collectible character concepts.', 'ai character design prompt'],
    ],
    howTo: [
      ['Define the character bible', 'List age range, silhouette, outfit, palette, personality, props, and setting.'],
      ['Ask for repeatable views', 'Use turnarounds, expression sheet, pose sheet, or model-sheet language.'],
      ['Separate style from identity', 'Lock consistent traits before asking for 3D, anime, cinematic, or sticker styles.'],
    ],
    troubleshooting: [
      ['The character changes between images', 'Repeat the same core traits and ask for a model sheet before scene variations.'],
      ['The design is generic', 'Add a role, backstory, signature prop, color rule, and strong silhouette.'],
      ['The pose hides important details', 'Ask for neutral standing pose, front view, and accessory callouts.'],
    ],
    variations: ['character sheet', 'brand mascot', 'RPG hero', 'villain concept', 'expression sheet', '3D avatar'],
    related: ['action-figure', 'stickers', 'instagram-photo-editing', 'ui-mockups'],
  },
};

function titleFor(slug) {
  return CONFIG[slug]?.label ?? slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function buildPromptPack(slug, subScenes) {
  return [
    {
      label: `${titleFor(slug)} Starter Pack`,
      prompt_count_target: 6,
      description: 'Broad templates that match the main search query and work as first-copy examples.',
      sub_scene_slugs: subScenes.slice(0, 3).map((scene) => scene.slug),
    },
    {
      label: `${titleFor(slug)} Advanced Variations`,
      prompt_count_target: 6,
      description: 'More specific long-tail variations pulled from related searches and community use cases.',
      sub_scene_slugs: subScenes.slice(3).map((scene) => scene.slug),
    },
  ];
}

function buildFaq(cluster, label) {
  const base = cluster.paa.slice(0, 5);
  const fallback = [
    `What should I include in a GPT Image 2 prompt for ${label.toLowerCase()}?`,
    `How can I make ${label.toLowerCase()} prompts look less generic?`,
    `Can I use these ${label.toLowerCase()} prompts for commercial work?`,
    `How do I create multiple variations from one ${label.toLowerCase()} prompt?`,
    `What should I avoid when writing ${label.toLowerCase()} prompts?`,
  ];
  const questions = [...base];
  for (const question of fallback) {
    if (questions.length >= 5) break;
    if (!questions.includes(question)) questions.push(question);
  }
  return questions.slice(0, 5).map((question) => ({
    question,
    answer_intent: `Answer directly using ${cluster.h1} examples, then point to the most relevant prompt pack or troubleshooting note.`,
  }));
}

function buildSpec(cluster) {
  const config = CONFIG[cluster.slug];
  if (!config) throw new Error(`Missing config for ${cluster.slug}`);

  const subScenes = config.subScenes.map(([slug, label, intent, keyword]) => ({
    slug,
    label,
    anchor: `#${slug}`,
    search_modifier: keyword,
    user_intent: intent,
    prompt_count_target: 2,
    visual_brief: `Show a direct generated result for ${label.toLowerCase()} with clear before/copy/use affordance.`,
  }));

  const faqQuestions = buildFaq(cluster, config.label);

  return {
    schema_version: 1,
    page_type: 'prompt_cluster_hub',
    slug: cluster.slug,
    source_candidate_slug: cluster.source_candidate_slug,
    parent_url: '/gpt-image-2-prompts/',
    url_path: cluster.final_url,
    breadcrumb: [
      { label: 'Home', href: '/' },
      { label: 'GPT Image 2 Prompts', href: '/gpt-image-2-prompts/' },
      { label: config.label, href: cluster.final_url },
    ],
    tdh: {
      title: cluster.title,
      description: cluster.meta_description,
      h1: cluster.h1,
    },
    seo: {
      primary_query: cluster.primary_query,
      query_variants: cluster.query_variants,
      related_searches: cluster.related_searches,
      intent_grade: cluster.intent_grade,
      kd_estimate: cluster.kd_estimate,
      search_intent: cluster.search_intent,
      launch_batch: cluster.launch_batch,
      schema_types: ['CollectionPage', 'WebApplication', 'FAQPage', 'BreadcrumbList'],
      indexable: true,
    },
    h_tree: [
      { level: 'H1', text: cluster.h1 },
      { level: 'Hero', text: 'Hero with visual example, short value prop, Try in Workbench CTA, and anchor tabs.' },
      { level: 'H2', text: `Browse ${config.label} Prompt Use Cases` },
      { level: 'H2', text: `Copy-Paste ${config.label} Prompt Examples` },
      { level: 'H2', text: `${config.label} Prompt Pack` },
      { level: 'H2', text: `How to Write ${config.label} Prompts` },
      { level: 'H2', text: `${config.label} Prompt Variations` },
      { level: 'H2', text: `${config.label} Troubleshooting` },
      { level: 'H2', text: `${config.label} FAQ` },
      { level: 'H2', text: 'Related GPT Image 2 Prompt Clusters' },
    ],
    hero: {
      eyebrow: 'GPT Image 2 prompt collection',
      intro: config.hero,
      primary_cta: { label: 'Try in Workbench', href: '/#generator', behavior: 'send_prompt_to_workbench' },
      secondary_cta: { label: 'Copy a prompt', href: '#prompt-examples' },
      visual_strategy: 'Use a regenerated R2-hosted example image from the highest-scoring prompt in this cluster.',
    },
    sub_scenes: subScenes,
    prompt_grid: {
      section_id: 'prompt-examples',
      target_count: 14,
      minimum_count: 12,
      card_title_rule: 'Use a short noun phrase under 80 characters derived from the first prompt sentence.',
      ssr_visibility: 'Render prompt titles, excerpts, sub-scene labels, and full prompt text in HTML; dialog is only an interaction layer.',
      modal_features: ['image', 'full_prompt', 'copy_prompt', 'try_in_workbench', 'variation_chips', 'related_prompts'],
    },
    prompt_pack: buildPromptPack(cluster.slug, subScenes),
    how_to: config.howTo.map(([heading, body]) => ({ heading, body })),
    variations: config.variations.map((label) => ({
      label,
      instruction: `Add "${label}" to the base prompt and adjust composition, lighting, and aspect ratio for that use case.`,
    })),
    troubleshooting: config.troubleshooting.map(([problem, fix]) => ({ problem, fix })),
    faq: faqQuestions,
    related_clusters: config.related
      .filter((slug) => slug !== cluster.slug && finalSlugSet.has(slug))
      .map((slug) => ({
        slug,
        label: titleFor(slug),
        href: `/gpt-image-2-prompts/for-${slug}/`,
        relationship: 'Use as an internal link from the related clusters section and contextual body copy.',
      })),
    content_requirements: {
      min_words: 1200,
      first_100_words_must_include: cluster.primary_query,
      images_required: { minimum: 12, source: 'Kie.ai regenerated, R2-hosted, no copied competitor/social images' },
      visible_prompt_text: true,
      no_individual_prompt_detail_pages: true,
    },
  };
}

const specs = finalClusters.map(buildSpec);

for (const spec of specs) {
  const dir = join(CLUSTER_DIR, spec.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'spec.json'), `${JSON.stringify(spec, null, 2)}\n`);
}

writeFileSync(
  join(CLUSTER_DIR, 'spec.index.json'),
  `${JSON.stringify(
    specs.map((spec) => ({
      slug: spec.slug,
      url_path: spec.url_path,
      launch_batch: spec.seo.launch_batch,
      h1: spec.tdh.h1,
      sub_scene_count: spec.sub_scenes.length,
      faq_count: spec.faq.length,
      related_count: spec.related_clusters.length,
    })),
    null,
    2,
  )}\n`,
);

console.log(JSON.stringify({
  specs: specs.length,
  output: '.claude/sop-data/clusters/{slug}/spec.json',
  index: '.claude/sop-data/clusters/spec.index.json',
  min_sub_scenes: Math.min(...specs.map((spec) => spec.sub_scenes.length)),
  min_faq: Math.min(...specs.map((spec) => spec.faq.length)),
  min_related: Math.min(...specs.map((spec) => spec.related_clusters.length)),
}, null, 2));
