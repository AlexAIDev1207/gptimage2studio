# Phase 5.5 webp 压缩汇总

生成时间：2026-05-05T17:09:17.523Z

## 总体
- PNG 原图：293.3 MB
- webp 输出：26.8 MB
- 压缩比：10.9x

## 各 cluster
| Cluster | tier | quality | 数量 | 总大小 | 平均 |
|---|---|---|---|---|---|
| `action-figure-prompts` | viral | 82 | 12 | 1.88 MB | 160 KB |
| `old-photo-restore-prompts` | viral | 82 | 12 | 1.42 MB | 121 KB |
| `instagram-photo-edit-prompts` | viral | 82 | 13 | 2.40 MB | 189 KB |
| `sticker-prompts` | viral | 82 | 14 | 2.42 MB | 177 KB |
| `thumbnail-prompts` | 2k-text | 88 | 11 | 3.11 MB | 289 KB |
| `cinematic-portrait-prompts` | viral | 82 | 12 | 1.59 MB | 136 KB |
| `product-photography-prompts` | 2k | 85 | 12 | 2.07 MB | 176 KB |
| `poster-design-prompts` | 2k-text | 88 | 17 | 5.80 MB | 349 KB |
| `food-photography-prompts` | viral | 82 | 12 | 2.20 MB | 188 KB |
| `infographic-prompts` | 2k-text | 88 | 11 | 3.91 MB | 364 KB |

## 字段写入
每条 prompt 加 4 字段：
- `final_image_url`: `/imgs/gpt-image-2-prompts/{slug}/{prompt_id}.webp`
- `final_image_width`: 原图宽
- `final_image_height`: 原图高
- `final_image_bytes`: webp 体积