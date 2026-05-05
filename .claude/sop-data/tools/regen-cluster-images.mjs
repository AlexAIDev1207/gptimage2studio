#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLUSTER_DIR = join(__dirname, '..', 'clusters');
const DEFAULT_BASE_URL = 'https://api.kie.ai/api/v1';

function parseArgs(argv) {
  const args = {
    live: false,
    poll: false,
    mirrorR2: false,
    envFile: '',
    cluster: '',
    limit: 0,
    concurrency: 1,
    resolution: '1K',
    aspectRatio: '4:3',
    pollAttempts: 90,
    pollIntervalMs: 10000,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--live') args.live = true;
    else if (arg === '--poll') args.poll = true;
    else if (arg === '--mirror-r2') args.mirrorR2 = true;
    else if (arg === '--env-file') args.envFile = argv[++i] || '';
    else if (arg === '--cluster') args.cluster = argv[++i] || '';
    else if (arg === '--limit') args.limit = Number(argv[++i] || 0);
    else if (arg === '--concurrency') args.concurrency = Math.max(1, Number(argv[++i] || 1));
    else if (arg === '--resolution') args.resolution = argv[++i] || args.resolution;
    else if (arg === '--aspect-ratio') args.aspectRatio = argv[++i] || args.aspectRatio;
    else if (arg === '--poll-attempts') args.pollAttempts = Math.max(1, Number(argv[++i] || args.pollAttempts));
    else if (arg === '--poll-interval-ms') args.pollIntervalMs = Math.max(1000, Number(argv[++i] || args.pollIntervalMs));
  }
  return args;
}

function loadEnvFile(file) {
  if (!file) return;
  const resolved = resolve(file);
  if (!existsSync(resolved)) throw new Error(`env file not found: ${resolved}`);
  const lines = readFileSync(resolved, 'utf8').split(/\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function parseJsonl(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split(/\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function getPromptRows(clusterSlug) {
  const spec = JSON.parse(readFileSync(join(CLUSTER_DIR, clusterSlug, 'spec.json'), 'utf8'));
  return parseJsonl(join(CLUSTER_DIR, clusterSlug, 'prompts.jsonl')).map((prompt, index) => ({
    cluster_slug: clusterSlug,
    prompt_id: prompt.prompt_id,
    title: prompt.title,
    sub_scene_tag: prompt.sub_scene_tag,
    image_prompt: prompt.image_prompt,
    alt: `${spec.tdh.h1} example ${index + 1}: ${prompt.title}`,
    file_name: `${prompt.prompt_id}.webp`,
    r2_key: `gpt-image-2-prompts/${clusterSlug}/${prompt.prompt_id}.webp`,
  }));
}

function getClusterSlugs(selectedCluster) {
  return readdirSync(CLUSTER_DIR)
    .filter((name) => existsSync(join(CLUSTER_DIR, name, 'spec.json')))
    .filter((name) => !selectedCluster || name === selectedCluster)
    .sort();
}

function writeJsonl(file, rows) {
  writeFileSync(file, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);
}

function extractUrls(value, urls = []) {
  if (!value) return urls;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^[\[{]/.test(trimmed)) {
      try {
        extractUrls(JSON.parse(trimmed), urls);
      } catch {
        // Ignore non-JSON strings.
      }
    }
    if (/^https?:\/\/.+\.(png|jpe?g|webp)(\?.*)?$/i.test(trimmed)) {
      urls.push(trimmed);
    }
  } else if (Array.isArray(value)) {
    value.forEach((item) => extractUrls(item, urls));
  } else if (typeof value === 'object') {
    Object.values(value).forEach((item) => extractUrls(item, urls));
  }
  return [...new Set(urls)];
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function importWorkspaceModule(modulePath) {
  const candidates = [
    join(process.cwd(), 'node_modules', modulePath),
    join(process.cwd(), '..', 'gptimage2studio', 'node_modules', modulePath),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return import(pathToFileURL(candidate).href);
  }
  throw new Error(`Cannot find module ${modulePath}. Run pnpm install in this worktree or set up sibling gptimage2studio/node_modules.`);
}

async function createKieTask(row, args) {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error('KIE_API_KEY is required for --live');
  const baseUrl = (process.env.KIE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const payload = {
    model: 'gpt-image-2-text-to-image',
    input: {
      prompt: row.image_prompt,
      aspect_ratio: args.aspectRatio,
      resolution: args.resolution,
    },
  };
  const response = await fetch(`${baseUrl}/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.code !== 200 || !body?.data?.taskId) {
    throw new Error(body?.msg || body?.message || `Kie task creation failed: ${response.status}`);
  }
  return {
    ...row,
    status: 'submitted',
    provider: 'kie',
    model: payload.model,
    task_id: body.data.taskId,
    request: payload,
    submitted_at: new Date().toISOString(),
  };
}

async function queryKieTask(taskId) {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error('KIE_API_KEY is required for polling');
  const baseUrl = (process.env.KIE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.code !== 200) {
    throw new Error(body?.msg || body?.message || `Kie query failed: ${response.status}`);
  }
  const imageUrls = extractUrls(body?.data);
  return {
    state: body?.data?.state || 'unknown',
    image_urls: imageUrls,
    response: body?.data || body,
  };
}

async function pollKieTask(taskId, args) {
  let last = null;
  for (let attempt = 1; attempt <= args.pollAttempts; attempt += 1) {
    last = await queryKieTask(taskId);
    if (last.state === 'success' || last.state === 'fail' || last.image_urls.length > 0) return last;
    await sleep(args.pollIntervalMs);
  }
  return last || { state: 'timeout', image_urls: [], response: null };
}

async function compressToWebp(buffer) {
  const sharpModule = await importWorkspaceModule('sharp/lib/index.js');
  const sharp = sharpModule.default || sharpModule;
  let best = null;
  for (const quality of [82, 74, 66, 58, 50, 42]) {
    const image = sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality });
    const output = await image.toBuffer();
    const metadata = await sharp(output).metadata();
    best = {
      buffer: output,
      contentType: 'image/webp',
      width: metadata.width || null,
      height: metadata.height || null,
      sizeBytes: output.byteLength,
      quality,
    };
    if (output.byteLength <= 100 * 1024) return best;
  }
  return best;
}

async function uploadToR2({ key, body, contentType }) {
  const required = ['R2_ACCESS_KEY', 'R2_SECRET_KEY', 'R2_BUCKET_NAME'];
  for (const name of required) {
    if (!process.env[name]) throw new Error(`${name} is required for --mirror-r2`);
  }

  const endpoint = (process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`).replace(/\/$/, '');
  const bucket = process.env.R2_BUCKET_NAME;
  const uploadPath = (process.env.R2_UPLOAD_PATH || 'uploads').replace(/^\/|\/$/g, '');
  const uploadKey = `${uploadPath}/${key}`.replace(/^\/+/, '');
  const uploadUrl = `${endpoint}/${bucket}/${uploadKey}`;
  const awsModule = await importWorkspaceModule('aws4fetch/dist/aws4fetch.esm.mjs');
  const client = new awsModule.AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
    region: process.env.R2_REGION || 'auto',
  });
  const response = await client.fetch(new Request(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Content-Length': String(body.byteLength),
    },
    body,
  }));
  if (!response.ok) throw new Error(`R2 upload failed: ${response.status} ${response.statusText}`);
  const publicDomain = process.env.R2_DOMAIN?.replace(/\/$/, '');
  const r2Url = publicDomain ? `${publicDomain}/${uploadKey}` : uploadUrl;
  return { r2_url: r2Url, storage_key: uploadKey, storage_bucket: bucket };
}

async function mirrorProviderImage(row, providerUrl) {
  const response = await fetch(providerUrl);
  if (!response.ok) throw new Error(`image download failed: ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const webp = await compressToWebp(input);
  const uploaded = await uploadToR2({
    key: row.r2_key,
    body: webp.buffer,
    contentType: webp.contentType,
  });
  return {
    ...uploaded,
    width: webp.width,
    height: webp.height,
    size_bytes: webp.sizeBytes,
    webp_quality: webp.quality,
    size_limit_ok: webp.sizeBytes <= 100 * 1024,
  };
}

async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function next() {
    const index = cursor;
    cursor += 1;
    if (index >= items.length) return;
    try {
      results[index] = await worker(items[index], index);
    } catch (error) {
      results[index] = { ...items[index], status: 'failed', error: error instanceof Error ? error.message : String(error) };
    }
    await next();
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => next()));
  return results;
}

const args = parseArgs(process.argv.slice(2));
loadEnvFile(args.envFile);
const clusterSlugs = getClusterSlugs(args.cluster);
const rows = clusterSlugs.flatMap(getPromptRows).slice(0, args.limit || undefined);

if (rows.length === 0) {
  throw new Error(args.cluster ? `No prompt rows found for ${args.cluster}` : 'No prompt rows found');
}

for (const slug of clusterSlugs) {
  mkdirSync(join(CLUSTER_DIR, slug), { recursive: true });
}

if (!args.live) {
  const todo = rows.map((row) => ({
    ...row,
    status: 'pending_generation',
    provider: 'kie',
    model: 'gpt-image-2-text-to-image',
    resolution: args.resolution,
    aspect_ratio: args.aspectRatio,
    r2_url: null,
    width: null,
    height: null,
    size_bytes: null,
  }));
  for (const slug of clusterSlugs) {
    const clusterRows = todo.filter((row) => row.cluster_slug === slug);
    if (clusterRows.length) writeJsonl(join(CLUSTER_DIR, slug, 'media.todo.jsonl'), clusterRows);
  }
  writeFileSync(join(CLUSTER_DIR, 'media.index.json'), `${JSON.stringify({
    generated_at: new Date().toISOString(),
    mode: 'dry-run',
    clusters: clusterSlugs.length,
    total_images: todo.length,
    resolution: args.resolution,
    aspect_ratio: args.aspectRatio,
    live_command_example: 'node .claude/sop-data/tools/regen-cluster-images.mjs --env-file ../gptimage2studio/.env.local --live --poll --mirror-r2 --cluster product-photography --limit 2',
  }, null, 2)}\n`);
  console.log(JSON.stringify({ mode: 'dry-run', clusters: clusterSlugs.length, total_images: todo.length, output: '.claude/sop-data/clusters/{slug}/media.todo.jsonl' }, null, 2));
  process.exit(0);
}

const submitted = await runWithConcurrency(rows, args.concurrency, (row) => createKieTask(row, args));
for (const slug of clusterSlugs) {
  const clusterRows = submitted.filter((row) => row.cluster_slug === slug);
  if (clusterRows.length) writeJsonl(join(CLUSTER_DIR, slug, 'media.tasks.jsonl'), clusterRows);
}

if (args.poll) {
  const completed = [];
  for (const task of submitted) {
    if (!task.task_id) {
      completed.push(task);
      continue;
    }
    const query = await pollKieTask(task.task_id, args);
    const row = {
      ...task,
      status: query.state,
      provider_urls: query.image_urls,
      r2_url: null,
      width: null,
      height: null,
      size_bytes: null,
      response: query.response,
    };
    if (args.mirrorR2 && query.image_urls[0]) {
      try {
        Object.assign(row, await mirrorProviderImage(task, query.image_urls[0]), { status: 'stored' });
      } catch (error) {
        row.storage_error = error instanceof Error ? error.message : String(error);
      }
    }
    completed.push(row);
  }
  for (const slug of clusterSlugs) {
    const clusterRows = completed.filter((row) => row.cluster_slug === slug);
    if (clusterRows.length) writeJsonl(join(CLUSTER_DIR, slug, 'media.jsonl'), clusterRows);
  }
}

console.log(JSON.stringify({
  mode: 'live',
  clusters: clusterSlugs.length,
  submitted: submitted.length,
  failed: submitted.filter((row) => row.status === 'failed').length,
  polled: args.poll,
}, null, 2));
