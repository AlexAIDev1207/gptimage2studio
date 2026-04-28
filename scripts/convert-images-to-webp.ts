/**
 * 把 public/imgs 下所有 PNG/JPG 批量转成 WebP（同路径、扩展名替换）
 *
 * - 默认 quality 82（content 图够用）
 * - logo/icon 类（小于 100KB 且文件名含 logo/icon）走 lossless
 * - 已存在同名 .webp 则跳过（idempotent）
 *
 * Usage:
 *   pnpm tsx scripts/convert-images-to-webp.ts
 *   pnpm tsx scripts/convert-images-to-webp.ts --dry-run
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.join(process.cwd(), 'public', 'imgs');
const DRY = process.argv.includes('--dry-run');

const exts = ['.png', '.jpg', '.jpeg'];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (exts.includes(path.extname(name).toLowerCase())) out.push(p);
  }
  return out;
}

function isIconish(file: string): boolean {
  const lower = file.toLowerCase();
  return /logo|icon|favicon/.test(lower);
}

async function convert(src: string) {
  const dst = src.replace(/\.(png|jpe?g)$/i, '.webp');
  if (existsSync(dst)) return { src, dst, status: 'skipped' as const };

  const srcSize = statSync(src).size;
  const lossless = isIconish(src) && srcSize < 100 * 1024;

  if (DRY) return { src, dst, status: 'would-write' as const, srcSize, dstSize: 0, lossless };

  const buf = await sharp(src)
    .webp(lossless ? { lossless: true } : { quality: 82, effort: 5 })
    .toBuffer();
  await sharp(buf).toFile(dst);
  const dstSize = statSync(dst).size;
  return { src, dst, status: 'written' as const, srcSize, dstSize, lossless };
}

async function main() {
  if (!existsSync(ROOT)) {
    console.error('public/imgs not found');
    process.exit(1);
  }

  const files = walk(ROOT);
  console.log(`Found ${files.length} images. ${DRY ? '[dry run]' : ''}\n`);

  let totalSrc = 0;
  let totalDst = 0;
  let written = 0;
  let skipped = 0;

  for (const f of files) {
    const r = await convert(f);
    const rel = path.relative(process.cwd(), r.src);
    if (r.status === 'skipped') {
      skipped++;
      console.log(`⊝ skip   ${rel}  (.webp exists)`);
    } else if (r.status === 'would-write') {
      console.log(`◯ would  ${rel}  (${(r.srcSize! / 1024).toFixed(0)}KB${r.lossless ? ', lossless' : ''})`);
    } else {
      written++;
      const ratio = (r.dstSize / r.srcSize) * 100;
      totalSrc += r.srcSize;
      totalDst += r.dstSize;
      console.log(
        `✓ wrote  ${rel}  ${(r.srcSize / 1024).toFixed(0)}KB → ${(r.dstSize / 1024).toFixed(0)}KB (${ratio.toFixed(0)}%)${r.lossless ? ' [lossless]' : ''}`
      );
    }
  }

  console.log(
    `\n--- Done. wrote=${written} skipped=${skipped} ---\n` +
      (written > 0
        ? `Reduced ${(totalSrc / 1024 / 1024).toFixed(1)} MB → ${(totalDst / 1024 / 1024).toFixed(1)} MB ` +
          `(saved ${((1 - totalDst / totalSrc) * 100).toFixed(0)}%)`
        : '')
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
