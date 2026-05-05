#!/usr/bin/env tsx
/**
 * Phase 6 修复 A：8 个 prompt 含 CJK 内嵌文字 → 改写英文版
 *
 * 这些 prompt 在文本中嵌入了大量日/中文 visible text，导致生成图含 CJK 文字。
 * 全部改写为英文等效版本（保留构图主题，文字内容英文化）。
 *
 * 同时删除对应 PNG / webp + media.jsonl 行，输出 codex 重生清单。
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';

const ROOT_DATA =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';
const PUBLIC_BASE =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/public/imgs/gpt-image-2-prompts';

type Patch = {
  cluster: string;
  prompt_id: string;
  new_title: string;
  new_prompt: string;
};

const PATCHES: Patch[] = [
  {
    cluster: 'action-figure-prompts',
    prompt_id: 'action-figure-prompts-009',
    new_title: 'Politician Satire Action Figure',
    new_prompt:
      'Create a 3D action figure of [the public figure or politician in the photo] in a clear blister pack, with satirical accessory blisters arranged around the figure. Each accessory has a small printed label and is sealed in its own bubble:\n1) A book titled "[POLICY NAME]" with bold cover typography.\n2) A three-headed dog accessory with a tag reading "[FOREIGN ALLIANCE]" and a small bone at its feet labeled "AUSTERITY".\n3) A three-headed hydra accessory with a tag reading "[COALITION NAME]".\n4) A second book titled "[HISTORICAL FIGURE]" with vintage gold-leaf cover.\nNo accessory may repeat. The blister card backing is a strong saturated orange color. The packaging top shows the politician\'s name in bold sans-serif white text, with the subtitle "PARTY ACTION FIGURE" beneath it in a smaller serif font. The figure and all accessories must be sealed inside individual transparent bubbles. Style: ultra-realistic 3D render, satirical commentary toy aesthetic, dramatic studio lighting, premium collectible photography. Output: 1024×1536 portrait.',
  },
  {
    cluster: 'instagram-photo-edit-prompts',
    prompt_id: 'instagram-photo-edit-prompts-007',
    new_title: 'Hidden Character City Crowd Scene',
    new_prompt:
      '{"type":"highly detailed isometric 3D hidden-object city scene","title_text":"{argument name=\\"headline text\\" default=\\"FIND RUHIA IN THE CITY\\"}","setting":"a bright sunny holiday weekend special scene in a busy Tokyo-style intersection, viewed from a high elevated wide angle like a miniature diorama, with a tall red landmark tower and skyscrapers in the blue-sky background","main_goal":"create a find-the-character puzzle image where the viewer searches for a specific named chibi character among a huge chibi crowd","style":"GPT Image 2 style, ultra-detailed toy-like 3D render, anime chibi figures, crisp daylight, shallow miniature depth of field, vibrant commercial colors, dense urban signage, playful travel poster mood","layout":{"camera":"high-angle wide shot looking down into a famous Shibuya-style crossing packed with chibi pedestrians","foreground":"zebra crosswalks, small cars and buses, trees, street lamps, shop entrances, crowds of chibi anime people","midground":"large central building with cafe and bookstore signs (English text), surrounded by many vertical signs and billboards (all English copy)","background":"large department store building on the left, tall red landmark tower behind it, modern office towers and commercial buildings filling the skyline","top_right_corner":"sun and small white clouds with a pastel rainbow"},"text_treatment":"all visible signs, billboards, posters, and shop fronts use ENGLISH TEXT only — no Japanese characters","characters":{"main_target":"highlight one chibi character named in the headline (e.g. yellow-haired girl in red coat) hiding among the crowd","crowd_count":"approximately 200 diverse chibi pedestrians","props":"shopping bags, ice cream cones, dogs on leashes, bikes"},"output":"1080×1920 vertical 2K, sharp text rendering"}',
  },
  {
    cluster: 'instagram-photo-edit-prompts',
    prompt_id: 'instagram-photo-edit-prompts-014',
    new_title: 'Viral 2x2 Grid Ad Concept',
    new_prompt:
      'Create a high-impact viral social media advertising visual on a 1:1 square canvas. Place 4 fictional ads in a "2×2 grid" layout, each in a different category designed to stop scrolling on Instagram or TikTok.\n\nGenres: (1) Tech / AI app, (2) Beauty / cosmetics, (3) Food & drink, (4) Fitness / wellness. All visible copy in ENGLISH. All brands fictional.\n\nViral design requirements:\n- Eye-catching attention-stopping headlines\n- Emotion-triggering hooks (surprise, urgency, FOMO, desire)\n- High-contrast color palettes (neon, vivid, black + fluorescent)\n- Bold layouts (overflow, diagonal placement, oversized typography)\n- Thumbnail-friendly composition (centered hero, face close-up, gaze direction)\n- "Salesy" social-ad cues (arrows, highlight frames, speech bubbles)\n\nDesign style:\n- 2026 trending social ad aesthetic\n- TikTok / Instagram ad look\n- Mobile readability priority\n- Photorealistic OR high-quality illustration\n- Each ad includes a CTA (e.g. "Free for 24 hrs", "Limited", "3 days left")\n\nRandomized viral elements (pick one from each list, embed in headlines):\n(A) Forbidden words: "Don\'t miss out", "99% are doing it wrong", "Stop doing this now"\n(B) Gap-reveal hooks: "Looks cute but…", "It seems normal but actually…", "This isn\'t what you think"\n(C) Numbers / scarcity: "3 days only", "1 spot left", "Free → $0"\n\nImportant:\n- 4 ads must each have clearly different vibes\n- Keep the 2×2 grid structure intact\n- All text legible and readable\n- Intentionally include a "scroll-stopping anomaly"\n\nOutput: 1080×1080 single-image with 4 ads, all visible text in ENGLISH.',
  },
  {
    cluster: 'thumbnail-prompts',
    prompt_id: 'thumbnail-prompts-004',
    new_title: 'Fiery Growth Marketing Thumbnail',
    new_prompt:
      '{"type":"YouTube thumbnail","style":"high-impact flashy growth-marketing thumbnail, dramatic, glossy, fiery, attention-grabbing","canvas":{"aspect_ratio":"16:9","background":"black with orange fire sparks, glowing particles, light streaks, and lens flare"},"headline":{"top_text":"{argument name=\\"top text\\" default=\\"THE FASTEST PATH TO\\"}","main_text":["FROM 0 TO","10K FANS","IN 30 DAYS"],"sub_text":"Plus the mistakes EVERYONE makes — fully exposed","main_text_style":{"font":"extra bold English display font","colors":["white","glowing orange-gold"],"effects":"thick black shadow, strong outer glow, metallic heat texture on the orange text, slight distress texture on the white text"}},"graphics":{"count":6,"items":[{"type":"giant upward arrow","position":"top-right sweeping diagonally upward","color":"bright orange-gold","effect":"intense glow, spark trail"},{"type":"bar chart","position":"right side behind character","count":4,"labels":["5K","7K","10K",""],"color":"orange-gold glow"},{"type":"lens flare starburst","position":"top-left","color":"golden orange"},{"type":"diagonal energy streak","position":"bottom-left to center","color":"orange"},{"type":"small spark particles","position":"across entire background"},{"type":"red urgency badge","position":"top-right","text":"MUST WATCH"}]},"character":{"position":"left side, chest-up","subject":"young creator pointing forward with confident grin and shocked expression","outfit":"white tee, casual jacket","lighting":"warm rim light, dramatic side key"},"output":"1280×720, all text in English, sharp text rendering"}',
  },
  {
    cluster: 'thumbnail-prompts',
    prompt_id: 'thumbnail-prompts-011',
    new_title: 'Surreal Pyramid Sushi Conductor Thumbnail',
    new_prompt:
      'A dramatic, absurdist clickbait-style YouTube thumbnail at sunset in the desert, with the Great Pyramid serving as a massive stone tabletop in the foreground. A messy-haired man in a dark navy kimono-style robe kneels behind a black plate of translucent squid sashimi, delicately arranging the food with chopsticks. His face is fully visible with a focused calm expression, while his wild windblown hair is sharply silhouetted against a glowing orange sky with low sun and scattered clouds. On the plate are neatly piled pale pink squid pieces, a large green shiso leaf, and a small yellow garnish flower. To the right sits a wooden compartment tray with condiments and small dishes. On the left edge of the pyramid surface, show 1 giant human thumbnail standing upright like a monument, and in front of it 1 tiny orchestra of about 10 formally dressed musicians with string instruments and a conductor, staged as if performing on the stone. The visual joke is that the man was supposedly going to conduct an orchestra inside a thumbnail, but is instead decorating sashimi on top of a pyramid. Use hyper-detailed photoreal compositing, exaggerated scale contrast, cinematic sunset lighting, golden hour highlights, dramatic atmosphere. Add bold English overlay text: "{argument name=\\"main title\\" default=\\"WAIT, WHAT IS HE DOING?\\"}" in the upper-right with thick black stroke and yellow fill. Output: 1280×720 thumbnail with sharp ENGLISH text rendering only.',
  },
  {
    cluster: 'infographic-prompts',
    prompt_id: 'infographic-prompts-006',
    new_title: 'Underground City Cutaway Storybook',
    new_prompt:
      '{"type":"cute anime educational cutaway illustration poster","format":"vertical 2:3 poster","style":"high-detail hand-painted anime, warm storybook lighting, clean infographic labels, whimsical yet realistic urban geology cross-section","scene":{"concept":"A calico kitten waking up in a cozy deep-underground room directly beneath a famous retro entertainment district, shown as a vertical cutaway from street level to about -80 meters.","location":"{argument name=\\"location\\" default=\\"Old downtown entertainment district, directly below the iconic Tower\\"}","surface_city":"bright blue sky with small clouds, crowded retro entertainment district, central tall observation tower with large vertical English sign reading TOWER, colorful shop buildings and billboards on both sides (all signage in English), a large cartoon pufferfish restaurant sign on the left, lively retro era signage","underground_room":"rock cavern bedroom at great depth, rough stone walls, exposed pipes, warm lanterns, small bed and blanket, mug on a low table, chalkboard map, storage chest, cozy secret base atmosphere"},"main_subject":{"species":"{argument name=\\"animal\\" default=\\"sleepy calico kitten\\"}","appearance":"round fluffy kitten with orange, white, and dark brown fur patches, large sleepy eyes, stretching out from under a tiny blanket","mood":"adorable, just-woke-up, slow blink"},"vertical_layers":{"label_count":6,"items":[{"depth":"0m","label":"Street level — neon shops"},{"depth":"-10m","label":"Subway tunnels"},{"depth":"-25m","label":"Old water pipes & sewer"},{"depth":"-40m","label":"Bedrock layer"},{"depth":"-60m","label":"Ancient cave system"},{"depth":"-80m","label":"Secret kitten room"}]},"typography":"all visible labels and signage in ENGLISH only","output":"vertical 2:3 storybook poster, 2K print quality"}',
  },
  {
    cluster: 'infographic-prompts',
    prompt_id: 'infographic-prompts-007',
    new_title: 'Fashion Tablet Brand Concept Sheet',
    new_prompt:
      '{"type":"fashion product concept art sheet","format":"single-page vertical concept board on warm off-white paper","overall_style":"soft watercolor and pencil illustration, delicate hand-drawn fashion design rendering, muted beige background washes, fine ink annotations, editorial concept-art layout, gentle natural lighting, premium lifestyle branding","language":"all visible headings and notes in English","main_subject":{"character":"young woman model with face fully visible, soft natural makeup, gentle confident expression","hair":"{argument name=\\"hair color\\" default=\\"dark brown\\"} hair parted center and gathered into a low messy bun","outfit":"{argument name=\\"outfit description\\" default=\\"white puff-sleeve blouse with lace front, pink suspender pinafore dress with pleated mini skirt, white ankle socks, beige Mary Jane shoes\\"}","pose":"standing gracefully while holding a thin tablet beside her face, calm friendly school-to-lifestyle brand mood"},"product":{"device":"{argument name=\\"device name\\" default=\\"AURA\\"} thin tablet","appearance":"simple sleek metallic gray tablet, rounded corners, small camera dot, subtle logo on back","screen":"showing a soft pastel UI"},"layout":{"top":"hand-lettered brand title in English serif","middle":"main illustrated character at left, exploded product views at right with arrow callouts","bottom":"3 small lifestyle vignettes (cafe / classroom / bedroom) with handwritten English captions","annotations":"thin pencil arrows pointing to fabric details, button placements, and tablet features, each with short English notes"},"output":"vertical 2:3 concept board, 2K print quality, all text in English"}',
  },
  {
    cluster: 'infographic-prompts',
    prompt_id: 'infographic-prompts-008',
    new_title: 'Retro Game News Newspaper Front Page',
    new_prompt:
      '{"type":"front page game news daily newspaper infographic","format":"single-page vertical poster, print newspaper style, English editorial design","canvas":{"orientation":"portrait","aspect_ratio":"3:4","background":"warm off-white newsprint paper with subtle grain","border":"thin black outer rule with a bold yellow corner accent at top left"},"masthead":{"position":"top","headline":"{argument name=\\"newspaper headline\\" default=\\"GAME NEWS DAILY\\"}","typography":"huge bold black English newspaper serif characters","date":"{argument name=\\"date\\" default=\\"2026.05.05\\"}","icon":"large yellow pixel heart to the left of the date","right_badge":{"text":"GAME NEWS DAILY","color":"royal blue box with white uppercase text","issue":"VOL.2026-122","code":"A01","barcode":"black barcode below"},"weekday_strip":"vertical green strip reading SATURDAY with a black triangle arrow","category_bar":{"count":5,"labels":["ALL NEWS","RELEASE","INDUSTRY","ESPORTS","UPDATE"],"style":"small colored squares and black sans-serif labels"}},"layout":{"grid":"three-column newspaper dashboard layout beneath the masthead","left_column":{"title":"main stories","count":3,"items":[{"number":"01","headline":"Mystery Studio Announces Major Expansion","subhead":"Behind-the-scenes look at the next breakout title","kicker":"INDUSTRY"},{"number":"02","headline":"Indie Hit Crosses 5 Million Sales","subhead":"From garage prototype to global phenomenon","kicker":"RELEASE"},{"number":"03","headline":"World Championship Final This Weekend","subhead":"Top teams gather in Seoul Arena","kicker":"ESPORTS"}]},"middle_column":{"title":"editor\'s pick","content":"large hero illustration of a stylized game controller and a glowing trophy on a dark background, with a 3-paragraph English editorial below"},"right_column":{"title":"sidebar","sections":[{"label":"PATCH NOTES","items":["Game A v3.2.1","Game B v1.8","Game C hotfix"]},{"label":"COMMUNITY POLL","items":["GotY frontrunner — vote now"]},{"label":"AD SLOT","items":["fictional in-paper ad with English copy"]}]}},"footer":{"text":"Page A1 — continued on A2 →","copyright":"© 2026 Game News Daily","page_num":"01"},"typography":"all visible headlines, body text, and labels in English serif/sans-serif newspaper fonts","output":"3:4 vertical print quality, English text rendering throughout"}',
  },
];

// 应用 patch
const byCluster: Record<string, Patch[]> = {};
for (const p of PATCHES) {
  if (!byCluster[p.cluster]) byCluster[p.cluster] = [];
  byCluster[p.cluster].push(p);
}

let patched = 0;
for (const [cluster, patches] of Object.entries(byCluster)) {
  const path = `${ROOT_DATA}/${cluster}/prompts.jsonl`;
  const records = readFileSync(path, 'utf-8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
  for (const p of patches) {
    const r = records.find((x) => x.prompt_id === p.prompt_id);
    if (!r) {
      console.warn(`  ⚠ ${p.prompt_id} 未找到`);
      continue;
    }
    r.title = p.new_title;
    r.final_prompt = p.new_prompt;
    r._patched_v4 = true;
    delete r.final_image_url;
    delete r.final_image_width;
    delete r.final_image_height;
    delete r.final_image_bytes;
    patched++;
  }
  writeFileSync(path, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
}
console.log(`✓ 改写 ${patched} 个 prompt 为英文版`);

// 删除 PNG / webp + 清 media
let pngDeleted = 0, webpDeleted = 0, mediaRemoved = 0;
const idsByCluster: Record<string, Set<string>> = {};
for (const p of PATCHES) {
  if (!idsByCluster[p.cluster]) idsByCluster[p.cluster] = new Set();
  idsByCluster[p.cluster].add(p.prompt_id);
}
for (const [cluster, ids] of Object.entries(idsByCluster)) {
  for (const id of ids) {
    const png = `${ROOT_DATA}/${cluster}/images/${id}.png`;
    const webp = `${PUBLIC_BASE}/${cluster}/${id}.webp`;
    if (existsSync(png)) { unlinkSync(png); pngDeleted++; }
    if (existsSync(webp)) { unlinkSync(webp); webpDeleted++; }
  }
  const mp = `${ROOT_DATA}/${cluster}/media.jsonl`;
  if (existsSync(mp)) {
    const lines = readFileSync(mp, 'utf-8').split('\n').filter((l) => l.trim());
    const kept = lines.filter((l) => !ids.has(JSON.parse(l).prompt_id));
    writeFileSync(mp, kept.join('\n') + (kept.length > 0 ? '\n' : ''));
    mediaRemoved += lines.length - kept.length;
  }
}
console.log(`✓ 删除 ${pngDeleted} PNG / ${webpDeleted} webp / ${mediaRemoved} media records`);

// 输出补丁清单
const md = [
  '# Phase 6 patch v4：8 个 CJK prompt → 英文版',
  '',
  `生成时间：${new Date().toISOString()}`,
  '',
  '页面视觉审核发现 8 个 prompt 内嵌大量中/日文 visible text，导致生成图含 CJK 文字。已改写为英文等效版本。',
  '',
  '## 给 codex 的任务',
  '',
  '从对应 `prompts.jsonl` 读这 8 个 prompt_id 的（已改写为英文的）`final_prompt`：',
  '',
  '| prompt_id | 期望分辨率 | 新标题 |',
  '|---|---|---|',
  ...PATCHES.map((p) => {
    const res = ['thumbnail-prompts','poster-design-prompts','product-photography-prompts','infographic-prompts'].includes(p.cluster) ? '2K' : '1K';
    return `| \`${p.prompt_id}\` | ${res} | ${p.new_title} |`;
  }),
  '',
  '生成后保存到 `{cluster}/images/{prompt_id}.png`，**追加** 到 `{cluster}/media.jsonl`。',
  '',
  '完成后我会自动跑 webp 压缩 + 写回 prompts.jsonl 的 `final_image_*` 字段。',
].join('\n');
writeFileSync(`${ROOT_DATA}/regenerate-list-patch-v4.md`, md);
console.log(`\n✓ 输出: ${ROOT_DATA}/regenerate-list-patch-v4.md`);
