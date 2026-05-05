#!/usr/bin/env tsx
/**
 * Phase 5 patch v3：修复 3 张 prompt 文本要求 CJK visible text 的图
 * - poster-012: 日文电影海报 → 英文版
 * - infographic-003: 中文心脏图 → 英文版
 * - infographic-009: 中文霸王龙 → 英文版
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  unlinkSync,
} from 'node:fs';

const ROOT_DATA =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/.claude/sop-data/clusters';
const PUBLIC_BASE =
  '/Users/moxiao/Documents/web-outbound/sites/gptimage2studio-claude-optimize/public/imgs/gpt-image-2-prompts';

type Patch = {
  cluster: string;
  prompt_id: string;
  new_prompt: string;
  reason: string;
};

const PATCHES: Patch[] = [
  {
    cluster: 'poster-design-prompts',
    prompt_id: 'poster-design-prompts-012',
    new_prompt:
      'A stunning anime theatrical movie poster in portrait format. Studio Ghibli meets Makoto Shinkai visual language. A teenage girl in a tattered white robe stands on the wing of a crumbling giant stone deity — an ancient colossus covered in moss and glowing golden runic script, slowly falling through a sea of clouds. Her long black hair streams upward against gravity. She reaches one hand toward the sky where a vast celestial rift tears open the heavens — beyond it, an inverted ocean floats above the clouds, ancient wooden cities hanging upside down from its surface, lanterns drifting like stars. The sky transitions from deep twilight blue at the bottom to a luminous peach and rose gold at the top. Volumetric god rays pierce through cloud layers. Cherry blossom petals and torn paper charms spiral everywhere. Her expression is calm determination. Art style: hand-drawn 2D animation, ultra-detailed background painting, expressive linework, rich cel shading. Palette: deep indigo, peach, rose gold, warm amber, soft white. Bottom title block: large elegant English display serif title reading "{argument name=\\"main title\\" default=\\"THE SKY BEYOND THE RIFT\\"}", with smaller subtitle beneath in clean modern English font reading "{argument name=\\"subtitle\\" default=\\"When the world falls, her wish will rise.\\"}", and release info "{argument name=\\"release info\\" default=\\"SPRING 2026 · NATIONWIDE\\"}". Mood: mythological, spiritual, bittersweet wonder. Theatrical release quality.',
    reason: '日文 kanji + 日文标题 → 全英文动漫电影海报',
  },
  {
    cluster: 'infographic-prompts',
    prompt_id: 'infographic-prompts-003',
    new_prompt:
      '{"type":"children\'s educational medical infographic poster","topic":"{argument name=\\"headline text\\" default=\\"THE HUMAN HEART\\"}","subtitle":"{argument name=\\"subtitle text\\" default=\\"Your Body\'s Super Pump — works 24/7 to deliver blood everywhere!\\"}","style":"publication-quality cute science encyclopedia cutaway illustration for children, warm pastel cream background with hearts, stars, clouds and rounded annotation boxes, glossy 3D cartoon rendering mixed with clean vector labels, high detail, friendly and non-scary anatomy, modern English educational poster typography","main_visual":{"subject":"large central anatomical cross-section of a human heart","position":"center-left, occupying most of the page","colors":"blue right heart and veins for oxygen-poor blood, red left heart and arteries for oxygen-rich blood","details":"transparent cutaway chambers, valves, septum, thick ventricular walls, large red aorta arch, blue pulmonary artery, vena cava tubes, pulmonary veins, white directional arrows showing blood flow, small smiling red blood cell mascots inside chambers","main_labels_count":12,"main_labels":["Superior Vena Cava","Pulmonary Artery","Right Atrium","Tricuspid Valve","Right Ventricle","Inferior Vena Cava","Aorta","Pulmonary Vein","Left Atrium","Mitral Valve","Left Ventricle","Septum"]},"layout":{"format":"vertical portrait infographic, 4:5 aspect ratio","top_header":"large red handwritten-style English title \\"THE HUMAN HEART\\", blue subtitle \\"Your Super Pump\\", small mascot heart/blood-cell character near title","right_column":{"sections_count":4,"sections":[{"title":"Blood Circulation Map","position":"top-right","content":"mini schematic with heart, lungs, body icon, red and blue flow arrows"},{"title":"Valves Open & Close","position":"middle-right","content":"two small panels: open valve allowing flow, closed valve preventing backflow"},{"title":"Heart Muscle Layers","position":"lower-middle-right","content":"cross-section of myocardium showing endocardium, myocardium, epicardium with friendly cartoon doctor pointing"},{"title":"Heart Rhythm","position":"bottom-right","content":"ECG waveform showing normal heart rate 60-100 BPM, with running figure for exercise note"}]},"bottom_strip":{"left":"Color tips: BLUE = oxygen-poor blood, RED = oxygen-rich blood","right":"Heart facts: beats ~100,000 times per day, pumps ~7,500 liters daily","mascots":"two small cartoon kids and a heart mascot saying \\"Thanks for keeping me healthy!\\""}},"output":"4:5 vertical 2K, all visible text in English"}',
    reason: '中文标题+中文标签+中文徽语 → 全英文 children\'s heart infographic',
  },
  {
    cluster: 'infographic-prompts',
    prompt_id: 'infographic-prompts-009',
    new_prompt:
      '{"type":"publication-quality educational science encyclopedia cutaway poster","language":"English visible text","main_title":"{argument name=\\"headline text\\" default=\\"INSIDE THE T. REX\\"}","subtitle":"{argument name=\\"subtitle text\\" default=\\"One of Earth\'s Most Powerful Predators\\"}","subject":{"species":"{argument name=\\"dinosaur species\\" default=\\"Tyrannosaurus rex\\"}","pose":"large roaring side-view dinosaur walking left to right, mouth open, tail extended for balance, one hind leg forward, tiny forearms raised","style":"highly detailed semi-realistic scientific illustration, vintage natural history encyclopedia plate, rich watercolor and gouache texture, crisp ink outlines, warm parchment paper background","cutaway":"left half shows external scaly skin and skull; right and central body are anatomically cut open to reveal skeleton, red muscles, ribs, lungs, heart, intestines, stomach, tendons, and leg musculature with spatially coherent cross-section layers","skin_color":"{argument name=\\"skin color\\" default=\\"olive brown and ochre scales with darker striping\\"}","anatomy_colors":"ivory bones, crimson and pink muscles, blue-purple lungs, bright red heart, orange-brown digestive organs"},"layout":{"composition":"portrait poster layout with the dinosaur dominating the center, numbered callout arrows radiating around the body, small inset diagrams in rounded cream cards, forest and volcano landscape behind","background":"Mesozoic forest with conifers, ferns, rocky stream, misty mountains and distant pterosaurs flying"},"callouts":{"count":10,"items":["1 Skull — massive jaw with bone-crushing strength","2 Teeth — 6-inch serrated banana-shaped teeth","3 Neck Muscles — anchor for biting power","4 Lungs (with air sacs) — bird-like one-way airflow","5 Stomach — digests up to 230kg of meat","6 Pelvis","7 Ribs and Chest Cavity","8 Tiny Forelimbs — possibly for grappling","9 Hip Bones","10 Hindlimb Muscles — for sprinting at ~30km/h"]},"side_facts":{"top_left":{"title":"Bite Force","content":"~6-8 metric tons — equal to crushing a small car"},"bottom_left":{"title":"Why Tiny Arms?","content":"Likely used for holding mates or pinning prey"},"bottom_right":{"title":"Size Comparison","content":"12-13m long, 4m tall at hip, ~6-8 metric tons"},"top_right":{"title":"File Card","content":"Name: T. rex · Era: Late Cretaceous (~68-66 mya) · Weight: ~6-8 tons"}},"output":"3:4 vertical poster, 2K print quality, English text rendering"}',
    reason: '中文标签+中文徽语 → 全英文 T. Rex encyclopedia',
  },
];

function main() {
  // 应用 patch
  const byCluster: Record<string, Patch[]> = {};
  for (const p of PATCHES) {
    if (!byCluster[p.cluster]) byCluster[p.cluster] = [];
    byCluster[p.cluster].push(p);
  }

  for (const [cluster, patches] of Object.entries(byCluster)) {
    const path = `${ROOT_DATA}/${cluster}/prompts.jsonl`;
    const records = readFileSync(path, 'utf-8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
    let modified = 0;
    for (const p of patches) {
      const r = records.find((x) => x.prompt_id === p.prompt_id);
      if (r) {
        r.final_prompt = p.new_prompt;
        r._patched_v3 = true;
        r._patch_reason_v3 = p.reason;
        // 清理旧的 final_image_* 字段，等重生后重新写
        delete r.final_image_url;
        delete r.final_image_width;
        delete r.final_image_height;
        delete r.final_image_bytes;
        modified++;
      }
    }
    writeFileSync(path, records.map((r) => JSON.stringify(r)).join('\n') + '\n');
    console.log(`✓ ${cluster}: 修改 ${modified} 条`);
  }

  // 删除 webp + PNG
  for (const p of PATCHES) {
    const png = `${ROOT_DATA}/${p.cluster}/images/${p.prompt_id}.png`;
    const webp = `${PUBLIC_BASE}/${p.cluster}/${p.prompt_id}.webp`;
    if (existsSync(png)) {
      unlinkSync(png);
      console.log(`✓ 删除 PNG: ${p.prompt_id}`);
    }
    if (existsSync(webp)) {
      unlinkSync(webp);
      console.log(`✓ 删除 webp: ${p.prompt_id}`);
    }
  }

  // 清 media.jsonl
  const byClusterIds: Record<string, Set<string>> = {};
  for (const p of PATCHES) {
    if (!byClusterIds[p.cluster]) byClusterIds[p.cluster] = new Set();
    byClusterIds[p.cluster].add(p.prompt_id);
  }
  for (const [cluster, ids] of Object.entries(byClusterIds)) {
    const mp = `${ROOT_DATA}/${cluster}/media.jsonl`;
    if (!existsSync(mp)) continue;
    const lines = readFileSync(mp, 'utf-8').split('\n').filter((l) => l.trim());
    const kept = lines.filter((l) => !ids.has(JSON.parse(l).prompt_id));
    writeFileSync(mp, kept.join('\n') + (kept.length > 0 ? '\n' : ''));
    console.log(`✓ ${cluster}/media.jsonl: 移除 ${lines.length - kept.length} 条`);
  }

  // 输出 patch v3 markdown
  const md = [
    '# Phase 5 patch v3：3 张 prompt 主动要求 CJK 文字',
    '',
    `生成时间：${new Date().toISOString()}`,
    '',
    '之前的 patch v1 漏了 3 张 prompt **文本中明确要求** CJK visible text 的图：',
    '',
    '| prompt_id | 原指令 | 修复 |',
    '|---|---|---|',
    '| `poster-design-prompts-012` | "Japanese kanji" 标题 | 改为英文标题 |',
    '| `infographic-prompts-003` | "Simplified Chinese" + 12 个中文 label | 全部改英文 |',
    '| `infographic-prompts-009` | "Simplified Chinese labels" | 改英文（参考 #001 模式）|',
    '',
    '## 给 codex 的任务',
    '',
    '从对应 `prompts.jsonl` 读这 3 个 prompt_id 的（已改写的）`final_prompt`：',
    '- `poster-design-prompts-012`（**2K**）',
    '- `infographic-prompts-003`（**2K**）',
    '- `infographic-prompts-009`（**2K**）',
    '',
    '生成后保存到 `{cluster}/images/{prompt_id}.png`，**追加**到 `media.jsonl`。',
    '',
    '完成后我会重新跑 webp 压缩这 3 张 + 写回 prompts.jsonl 的 `final_image_*` 字段。',
    '',
    '## 注意',
    '',
    '`prompts.jsonl` 里这 3 条已删除 `final_image_url` 等字段，以避免引用到已删除的 webp 旧版本。',
  ].join('\n');
  writeFileSync(`${ROOT_DATA}/regenerate-list-patch-v3.md`, md);
  console.log(`\n✓ 输出: ${ROOT_DATA}/regenerate-list-patch-v3.md`);
}

main();
