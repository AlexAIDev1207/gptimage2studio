#!/usr/bin/env tsx
/**
 * Phase 5 修复：修改有质量问题的 prompts，使其能正确生成图
 *
 * 修复内容：
 * 1. instagram 002 / 005 / 006 / 010：删除触发安全过滤的 "privacy mask" 指令 / 改写为具体描述
 * 2. food 001 / 002：改写偏题的 prompt 为标准 hero-shot
 * 3. thumbnail 005 / 008 / 010：日文 → 英文版
 * 4. infographic 001：中文 → 英文版
 * 5. product 005：删除遮脸 + 替换 Dunkin 品牌
 */

import { readFileSync, writeFileSync } from 'node:fs';

const ROOT =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';

type Patch = {
  cluster: string;
  prompt_id: string;
  new_title?: string;
  new_prompt: string;
  new_language?: string;
  reason: string;
};

const PATCHES: Patch[] = [
  // ==========  instagram-photo-edit ==========
  {
    cluster: 'instagram-photo-edit-prompts',
    prompt_id: 'instagram-photo-edit-prompts-002',
    new_title: 'Awards Ceremony Acceptance Photo',
    new_prompt:
      'Create a cinematic photorealistic awards-ceremony still of {argument name="subject" default="a distinguished silver-haired man in his fifties"} in a black tuxedo with a white shirt and pale silver tie, standing behind an elegant black-and-gold podium on a grand theater stage. He holds an ornate trophy resembling a Vitruvian-Man golden statuette mounted on a black marble base. The audience behind shows a soft-focus crowd in formal attire, gentle bokeh, applauding. Stage lighting: warm key light from above-front, golden rim light from behind. Backdrop: deep red velvet curtains and large American flag draped behind. Style: cinematic editorial photo, shallow depth of field, photorealistic faces with natural detail. Output: 16:9 widescreen, magazine-cover quality.',
    reason: '删除触发安全过滤的 "privacy mask" 指令',
  },
  {
    cluster: 'instagram-photo-edit-prompts',
    prompt_id: 'instagram-photo-edit-prompts-005',
    new_title: 'Cozy Cafe Editorial Lifestyle Shot',
    new_prompt:
      'Create a realistic editorial lifestyle photograph of a 25-year-old woman with dark hair tied in a loose messy bun, sitting at a rustic wooden table in a cozy vintage cafe, positioned beside tall old-fashioned window panes with soft daylight streaming in from the left. She wears a cream cable-knit midi dress with a light blue oversized denim jacket draped over her shoulders. A handwritten chalkboard menu reading "DAILY SPECIALS" hangs on the back wall. A small ceramic latte cup with foam art rests on the table. Style: warm window-light editorial portrait, shallow depth of field, soft golden tones, photorealistic natural skin and clothing detail. Output: 9:16 vertical lifestyle photograph.',
    reason: '改用具体外表描述代替 placeholder，避免安全过滤误判',
  },
  {
    cluster: 'instagram-photo-edit-prompts',
    prompt_id: 'instagram-photo-edit-prompts-006',
    new_title: 'Cozy Window-Light Cafe Portrait',
    new_prompt:
      'Create a highly realistic editorial lifestyle photograph of a 26-year-old woman sitting at a rustic wooden cafe table beside a large old-fashioned window in a cozy wood-paneled coffee shop. She has dark hair tied in a loose messy bun and wears a cream-colored knitted sleeveless V-neck dress with a light blue denim jacket draped over her shoulders. She holds a delicate cup of latte and gazes thoughtfully out the window. Wisps of steam rise from the latte. Sunlight casts soft directional warm rays across her arm and the table. Background: warm wood tones, framed prints, hanging plants. Style: warm editorial photograph, shallow depth of field, photorealistic. Output: 9:16 vertical.',
    reason: '改用具体描述避免安全过滤',
  },
  {
    cluster: 'instagram-photo-edit-prompts',
    prompt_id: 'instagram-photo-edit-prompts-010',
    new_title: 'Before-After Photo Edit Split-Screen',
    new_prompt:
      'Create a vertical 9:16 Instagram split-screen photo edit composition showing a "before vs after" transformation. Top half labeled "BEFORE" in subtle white sans-serif text: a casual selfie of {argument name="subject" default="a young woman"} taken on a phone, dim indoor lighting, plain background, no styling. Bottom half labeled "AFTER" in bold white sans-serif: the same subject transformed into a cinematic editorial portrait — golden hour outdoor light, dreamy bokeh sunset background, hair styled with soft waves, clean color-graded skin tones, magazine-cover finish. Center divider: thin white horizontal line with arrow pointing down. Style: trending Instagram before/after edit, photorealistic, viral-ready aesthetic.',
    reason: '完全替换中文道符偏题 prompt 为标准 split-screen edit',
  },

  // ==========  food-photography ==========
  {
    cluster: 'food-photography-prompts',
    prompt_id: 'food-photography-prompts-001',
    new_title: 'Hero Shot Wood-Fired Pizza',
    new_prompt:
      'Create a hero-shot food photograph of a freshly baked wood-fired Margherita pizza on a rustic wooden board. Composition: 45-degree elevated angle, pizza centered, warm golden cheese with bubbling crust, fresh basil leaves, vivid red tomato sauce, sprinkle of olive oil glistening. Background: out-of-focus rustic Italian kitchen with copper pans and herbs. Lighting: warm directional window light from upper-left, soft natural shadow under the pizza, warm color temperature. Details: visible cheese pull from one slice being lifted, tiny char marks on crust, steam rising. Style: hyperrealistic restaurant menu photography, shallow depth of field, magazine-cover quality. Output: 1:1 square, 1024×1024.',
    reason: '替换创意拼贴（披萨变路）为标准 hero shot',
  },
  {
    cluster: 'food-photography-prompts',
    prompt_id: 'food-photography-prompts-002',
    new_title: 'Single Hero Shot Gourmet Burger',
    new_prompt:
      'Create a single hero-shot food photograph of a gourmet double cheeseburger. Composition: low-angle 30-degree shot, burger centered on a slate stone board. Subject details: thick juicy beef patty with visible char marks, melting yellow cheddar cascading over the edge, crisp green lettuce, ripe tomato slice, red onion ring, brioche bun with sesame seeds, glossy slight glaze. Background: deep moody dark wood with soft amber rim light. Steam rising gently from the patty. Lighting: dramatic single key light from upper-right, deep shadows for cinematic feel. Style: high-end commercial food photography, shot on 105mm macro lens, shallow depth of field, hyperrealistic textures. Output: 1:1 square, 1024×1024.',
    reason: '替换 4-grid 广告拼图为单一 hero shot',
  },

  // ==========  thumbnail（日文 → 英文）==========
  {
    cluster: 'thumbnail-prompts',
    prompt_id: 'thumbnail-prompts-005',
    new_title: 'Retro 8-Bit Game Style Event Thumbnail',
    new_prompt:
      'Create a bold YouTube thumbnail in retro 8-bit video game style on a clean white background with black, white, and vivid yellow color palette. Composition: a single highly graphic poster packed with pixel-art decorations, thick black outlines, comic halftone dots, drop shadows, and arcade-inspired stickers. In the center, place an enormous headline reading "{argument name=\\"main title\\" default=\\"LEVEL UP!\\"}" in chunky pixel-art display font, vivid yellow with thick black outline. On the left side: a young anime-style hero character in heroic dynamic pose, jumping mid-air, fist raised. On the right: a chibi sidekick character with cap. Decorative elements: lightning bolts, "GAME ON!" speech bubble, "1UP" health icon, retro game controller, sword icon, halftone explosion bursts. Bottom: smaller subtitle reading "{argument name=\\"subtitle\\" default=\\"Press Start to Continue\\"}" with date and speaker name. Output: 16:9, 1280×720, sharp text rendering.',
    reason: '日文 → 英文版（保持 retro game 视觉风格）',
    new_language: 'en',
  },
  {
    cluster: 'thumbnail-prompts',
    prompt_id: 'thumbnail-prompts-008',
    new_title: 'Healthy Diet Cooking YouTube Thumbnail',
    new_prompt:
      'Create a bright, high-impact YouTube thumbnail about healthy diet-friendly eating, in a clean split composition (16:9). Left half: white background filled with oversized bold sans-serif English headline text stacked diagonally for maximum readability. Top line: huge "EAT SMART" in vivid orange with thick white outline and soft drop shadow. Below: "STAY FIT" in dark brown chunky display font. Bottom: "5 PROVEN TRICKS" in red with small star burst. Add a small cartoon health-conscious chef illustration on the lower-left, smiling, giving an "OK" hand sign. Decorative icons: salad bowl, scale, exercising figure, water glass, clock. Right half: photorealistic close-up shot of a healthy donburi rice bowl with grilled chicken, soft-boiled egg, fresh greens, sprinkled herbs. Soft shallow depth of field. Top-right corner sticker: "TASTY & GUILT-FREE!" in handwriting style on a yellow burst. Output: 1280×720, sharp text.',
    reason: '日文 → 英文版（保持 健康饮食 视觉风格）',
    new_language: 'en',
  },
  {
    cluster: 'thumbnail-prompts',
    prompt_id: 'thumbnail-prompts-010',
    new_title: 'Food TV Show Variety Screen Thumbnail',
    new_prompt:
      'Create a 16:9 TV-screen capture style YouTube thumbnail mimicking a food variety show. Main visual: extreme close-up of {argument name="food item" default="rich miso ramen"} from {argument name="restaurant name" default="a hidden local diner"}, showing rising steam, glossy chashu pork slices, scattered green onions, perfectly halved soft-boiled egg with golden yolk. Top-left telop sticker: bold "WORLD\'S HIDDEN GEMS" red logo with white outline. Top-right corner: small "REC" indicator with red dot, "VTR" timestamp. Bottom: large bold text overlays "ONLY 18 YEARS OLD?!" in vivid orange-yellow with thick black stroke, and below "THE LEGENDARY CHEF GIRL" in white with red shadow. Bottom-right corner: a small picture-in-picture frame showing a shocked male reaction host expression. Style: high-CTR Japanese-style TV variety thumbnail aesthetic but in English. Output: 1672×941, sharp text rendering.',
    reason: '日文 → 英文版（保持 TV variety 视觉风格）',
    new_language: 'en',
  },

  // ==========  infographic（中文 → 英文）==========
  {
    cluster: 'infographic-prompts',
    prompt_id: 'infographic-prompts-001',
    new_title: 'Submarine Cutaway Encyclopedia Poster',
    new_prompt:
      '{"type":"publication-quality educational cutaway science encyclopedia poster","topic":"{argument name=\\"poster topic\\" default=\\"submarine internal structure\\"}","language":"English visible text","aspect_ratio":"3:4 vertical poster","style":"richly colored semi-realistic illustrated infographic for children, detailed cross-section engineering diagram, clean vector-like labels mixed with painterly underwater background, high-resolution print design","main_title":"{argument name=\\"headline text\\" default=\\"INSIDE THE SUBMARINE\\"}","subtitle":"— The Hidden Explorer of the Deep Sea —","scene":{"background":"deep blue underwater scene with subtle bubbles, faint coral, and soft light rays from above","centerpiece":"large horizontal cross-section of a modern submarine, showing 10 numbered internal compartments with crew figures inside"},"callouts":{"count":10,"items":["1 Bow Room — torpedo storage","2 Bridge / Control Room — periscope and command","3 Living Quarters — bunks and dining","4 Galley — kitchen for crew meals","5 Power Plant — nuclear reactor or diesel","6 Engine Room — propulsion machinery","7 Sonar Room — listening equipment","8 Battery Bay — backup power","9 Ballast Tanks — diving and surfacing","10 Stern — propeller and rudder"]},"footer":{"left":"Length: ~60-100m","center":"Crew: ~50-90","right":"Max depth: ~200-500m"},"output":"3:4 vertical poster, 2048×2731 print quality, sharp English text rendering"}',
    reason: '中文 visible text → 英文版（保持 submarine encyclopedia 风格）',
    new_language: 'en',
  },

  // ==========  product-photography ==========
  {
    cluster: 'product-photography-prompts',
    prompt_id: 'product-photography-prompts-005',
    new_title: 'Iced Coffee Brand Vertical Poster',
    new_prompt:
      '{"type":"vertical commercial poster for a coffee brand","brand":"{argument name=\\"brand name\\" default=\\"[your coffee brand]\\"}","aspect_ratio":"4:5","style":"hyper-detailed premium advertising composite, cinematic product photography mixed with 3D typography, glossy orange-and-brown color grading, energetic motion, shallow depth of field, sparkling particles, floating coffee beans and donut crumbs","main_subject":{"description":"a smiling cafe worker shown from chest up on the right side, face fully visible with natural warm expression, wearing a brown apron with brand logo patch, holding a tall iced coffee cup forward","details":"clean uniform, neat hairstyle, photorealistic skin texture"},"hero_product":{"description":"large iced coffee cup centered-left, cup branding visible, ice cubes glistening, cream swirl floating into coffee, condensation droplets","action":"droplets and floating coffee beans frozen in mid-air around the cup"},"typography":{"top_label":"{argument name=\\"top label\\" default=\\"FRESHLY BREWED\\"}","headline":"{argument name=\\"headline\\" default=\\"BREW JOY DAILY\\"}","tagline_strip":"Fresh Brew · Sweet Energy · Creamy Finish · Daily Delight"},"output":"4:5 vertical poster, 2048×2560 print quality, sharp text rendering, faces fully visible"}',
    reason: '替换 Dunkin 为占位符 + 删除遮脸要求 + 显式要求"face fully visible"',
  },
];

// =================== 执行 ===================

function main() {
  // 按 cluster 分组 patches
  const byCluster: Record<string, Patch[]> = {};
  for (const p of PATCHES) {
    if (!byCluster[p.cluster]) byCluster[p.cluster] = [];
    byCluster[p.cluster].push(p);
  }

  for (const [cluster, patches] of Object.entries(byCluster)) {
    const path = `${ROOT}/${cluster}/prompts.jsonl`;
    const lines = readFileSync(path, 'utf-8').split('\n').filter((l) => l.trim());
    const records = lines.map((l) => JSON.parse(l));
    let modified = 0;

    for (const patch of patches) {
      const idx = records.findIndex((r) => r.prompt_id === patch.prompt_id);
      if (idx === -1) {
        console.warn(`  ⚠ ${patch.prompt_id} 未找到`);
        continue;
      }
      records[idx].final_prompt = patch.new_prompt;
      if (patch.new_title) records[idx].title = patch.new_title;
      if (patch.new_language) records[idx].language = patch.new_language;
      records[idx]._patched = true;
      records[idx]._patch_reason = patch.reason;
      modified++;
    }

    writeFileSync(path, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
    console.log(`✓ ${cluster}: 修改 ${modified} 条`);
  }
}

main();
