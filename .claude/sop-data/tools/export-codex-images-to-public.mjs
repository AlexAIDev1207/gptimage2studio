#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(join(__dirname, '..', '..', '..'));
const SOP_DIR = join(ROOT, '.claude', 'sop-data');
const CLUSTER_DIR = join(SOP_DIR, 'clusters');
const GENERATED_DIR = join(SOP_DIR, 'generated-images');
const PUBLIC_BASE = join(ROOT, 'public', 'imgs', 'gptimage2studio', 'prompt-clusters');
const PUBLIC_URL_BASE = '/imgs/gptimage2studio/prompt-clusters';

async function importSharp() {
  const candidates = [
    join(ROOT, 'node_modules', 'sharp', 'lib', 'index.js'),
    join(ROOT, '..', 'gptimage2studio', 'node_modules', 'sharp', 'lib', 'index.js'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      const module = await import(pathToFileURL(candidate).href);
      return module.default || module;
    }
  }
  throw new Error('sharp not found. Run pnpm install or ensure sibling gptimage2studio/node_modules exists.');
}

function parseJsonl(file) {
  return readFileSync(file, 'utf8')
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJsonl(file, rows) {
  writeFileSync(file, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
}

const sharp = await importSharp();
const clusters = JSON.parse(readFileSync(join(CLUSTER_DIR, 'clusters.final.json'), 'utf8'));
const allRows = [];
const failures = [];

for (const cluster of clusters) {
  const spec = JSON.parse(readFileSync(join(CLUSTER_DIR, cluster.slug, 'spec.json'), 'utf8'));
  const prompts = parseJsonl(join(CLUSTER_DIR, cluster.slug, 'prompts.jsonl'));
  const outputDir = join(PUBLIC_BASE, cluster.slug);
  mkdirSync(outputDir, { recursive: true });

  const mediaRows = [];
  for (const [index, prompt] of prompts.entries()) {
    const inputPath = join(GENERATED_DIR, cluster.slug, `${prompt.prompt_id}.png`);
    const fileName = `${prompt.prompt_id}.webp`;
    const outputPath = join(outputDir, fileName);
    const publicUrl = `${PUBLIC_URL_BASE}/${cluster.slug}/${fileName}`;

    if (!existsSync(inputPath)) {
      failures.push(`${cluster.slug}:${prompt.prompt_id}: missing source ${inputPath}`);
      continue;
    }

    let best = null;
    for (const width of [1100, 1000, 900, 820, 760, 700]) {
      for (const quality of [78, 70, 62, 54, 46, 38, 32, 28, 24, 20]) {
        const buffer = await sharp(inputPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();
        const metadata = await sharp(buffer).metadata();
        best = { buffer, quality, width: metadata.width || null, height: metadata.height || null };
        if (buffer.byteLength <= 100 * 1024) break;
      }
      if (best?.buffer.byteLength <= 100 * 1024) break;
    }

    writeFileSync(outputPath, best.buffer);
    const row = {
      prompt_id: prompt.prompt_id,
      title: prompt.title,
      cluster_slug: cluster.slug,
      image: publicUrl,
      alt: `${spec.tdh.h1} example ${index + 1}: ${prompt.title}`,
      width: best.width,
      height: best.height,
      size_bytes: best.buffer.byteLength,
      webp_quality: best.quality,
      source_model: 'codex-gpt-image-2',
      status: 'exported',
    };
    mediaRows.push(row);
    allRows.push(row);
  }

  writeJsonl(join(CLUSTER_DIR, cluster.slug, 'media.public.jsonl'), mediaRows);
}

writeFileSync(join(CLUSTER_DIR, 'media.public.index.json'), `${JSON.stringify({
  generated_at: new Date().toISOString(),
  expected: clusters.length * 14,
  actual: allRows.length,
  failures,
  output_base: PUBLIC_BASE,
  public_url_base: PUBLIC_URL_BASE,
  by_cluster: clusters.map((cluster) => ({
    slug: cluster.slug,
    count: allRows.filter((row) => row.cluster_slug === cluster.slug).length,
  })),
}, null, 2)}\n`);

console.log(JSON.stringify({
  expected: clusters.length * 14,
  actual: allRows.length,
  failures,
  output_base: PUBLIC_BASE,
}, null, 2));
