#!/usr/bin/env node
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOP_DIR = join(__dirname, '..');
const CLUSTER_DIR = join(SOP_DIR, 'clusters');
const IMAGE_DIR = join(SOP_DIR, 'generated-images');

function parseJsonl(file) {
  return readFileSync(file, 'utf8')
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJsonl(file, rows) {
  writeFileSync(file, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
}

const clusters = JSON.parse(readFileSync(join(CLUSTER_DIR, 'clusters.final.json'), 'utf8'));
const index = [];
const failures = [];

for (const cluster of clusters) {
  const spec = JSON.parse(readFileSync(join(CLUSTER_DIR, cluster.slug, 'spec.json'), 'utf8'));
  const prompts = parseJsonl(join(CLUSTER_DIR, cluster.slug, 'prompts.jsonl'));
  const mediaRows = [];

  for (const [idx, prompt] of prompts.entries()) {
    const localPath = resolve(join(IMAGE_DIR, cluster.slug, `${prompt.prompt_id}.png`));
    if (!existsSync(localPath)) {
      failures.push(`${cluster.slug}:${prompt.prompt_id}: missing ${localPath}`);
      continue;
    }
    const stats = statSync(localPath);
    mediaRows.push({
      prompt_id: prompt.prompt_id,
      title: prompt.title,
      cluster_slug: cluster.slug,
      local_path: localPath,
      alt: `${spec.tdh.h1} example ${idx + 1}: ${prompt.title}`,
      source_model: 'codex-gpt-image-2',
      status: 'generated',
      format: 'png',
      size_bytes: stats.size,
    });
  }

  writeJsonl(join(CLUSTER_DIR, cluster.slug, 'media.codex.jsonl'), mediaRows);
  index.push({
    slug: cluster.slug,
    count: mediaRows.length,
    media_path: join(CLUSTER_DIR, cluster.slug, 'media.codex.jsonl'),
    image_dir: join(IMAGE_DIR, cluster.slug),
  });
}

writeFileSync(join(CLUSTER_DIR, 'media.codex.index.json'), `${JSON.stringify({
  generated_at: new Date().toISOString(),
  expected: clusters.length * 14,
  actual: index.reduce((sum, item) => sum + item.count, 0),
  failures,
  clusters: index,
}, null, 2)}\n`);

console.log(JSON.stringify({
  expected: clusters.length * 14,
  actual: index.reduce((sum, item) => sum + item.count, 0),
  failures,
}, null, 2));
