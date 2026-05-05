#!/usr/bin/env node
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLUSTER_DIR = join(__dirname, '..', 'clusters');

function parseJsonl(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const finalClusters = JSON.parse(readFileSync(join(CLUSTER_DIR, 'clusters.final.json'), 'utf8'));
const rows = [];
const failures = [];

for (const cluster of finalClusters) {
  const prompts = parseJsonl(join(CLUSTER_DIR, cluster.slug, 'prompts.jsonl'));
  const media = parseJsonl(join(CLUSTER_DIR, cluster.slug, 'media.codex.jsonl'));
  const mediaByPrompt = new Map(media.map((item) => [item.prompt_id, item]));

  for (const prompt of prompts) {
    const item = mediaByPrompt.get(prompt.prompt_id);
    if (!item) {
      failures.push(`${cluster.slug}:${prompt.prompt_id}: missing media row`);
      continue;
    }
    if (!item.local_path || !existsSync(item.local_path)) {
      failures.push(`${cluster.slug}:${prompt.prompt_id}: missing file ${item.local_path || '(empty)'}`);
      continue;
    }
    const size = statSync(item.local_path).size;
    rows.push({
      cluster_slug: cluster.slug,
      prompt_id: prompt.prompt_id,
      title: prompt.title,
      local_path: item.local_path,
      alt: item.alt || `${cluster.h1} example: ${prompt.title}`,
      source_model: item.source_model || 'codex-gpt-image-2',
      status: item.status || 'generated',
      size_bytes: size,
    });
  }
}

writeFileSync(join(CLUSTER_DIR, 'media.codex.index.json'), `${JSON.stringify({
  generated_at: new Date().toISOString(),
  expected: finalClusters.length * 14,
  actual: rows.length,
  failures,
  by_cluster: finalClusters.map((cluster) => ({
    slug: cluster.slug,
    count: rows.filter((row) => row.cluster_slug === cluster.slug).length,
  })),
}, null, 2)}\n`);

console.log(JSON.stringify({
  expected: finalClusters.length * 14,
  actual: rows.length,
  failures,
}, null, 2));
