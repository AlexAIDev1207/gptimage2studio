# Phase 3: 10 P0 单页 IA Spec 汇总

生成时间：2026-05-02

每个 cluster 都有：H1 + Meta + 5-6 个 sub_scenes + 5 个 FAQ + 内链 + 页面结构 note + Kie credits 估算。

## 10 P0 一览（按上线优先级）

| # | slug | tier | H1 | 子场景 | FAQ | prompts | 图片 | credits |
|---|------|------|----|--------|-----|---------|------|---------|
| 1 | `action-figure-prompts` | viral | Action Figure Prompts for GPT Image 2 | 5 | 5 | 12 | 12 | 72 |
| 2 | `old-photo-restore-prompts` | viral | Old Photo Restoration Prompts for GPT Image 2 | 5 | 5 | 12 | 12 | 96 |
| 3 | `instagram-photo-edit-prompts` | viral | Instagram Trending Photo Edit Prompts for GPT Image 2 | 6 | 5 | 14 | 14 | 84 |
| 4 | `sticker-prompts` | viral | Sticker Prompts for GPT Image 2 | 6 | 5 | 13 | 13 | 78 |
| 5 | `thumbnail-prompts` | viral | YouTube Thumbnail Prompts for GPT Image 2 | 6 | 5 | 13 | 13 | 130 |
| 6 | `cinematic-portrait-prompts` | commercial | Cinematic Portrait Prompts for GPT Image 2 | 6 | 5 | 13 | 13 | 130 |
| 7 | `product-photography-prompts` | commercial | GPT Image 2 Product Photography Prompts | 6 | 5 | 14 | 14 | 140 |
| 8 | `poster-design-prompts` | creative | Poster Design Prompts for GPT Image 2 | 6 | 5 | 14 | 14 | 140 |
| 9 | `food-photography-prompts` | commercial | Food Photography Prompts for GPT Image 2 | 6 | 5 | 13 | 13 | 130 |
| 10 | `infographic-prompts` | creative | Infographic Prompts for GPT Image 2 | 6 | 5 | 13 | 13 | 130 |
| **合计** | | | | **58** | **50** | **131** | **131** | **1130** |

## Phase 5 图片重生预算

- 总 prompt 数：**131 条**
- 总图片数：**131 张**（每 prompt 1 张主图）
- 总 Kie credits：**1130** （≈ ¥80-100，按当前定价估算）
- 上线后批次：viral cluster (1-5) 用 1K 出图省 credits；commercial/creative cluster 用 2K 出图保印刷质量

## 内链网络

每个 cluster 配 3 条内链到其他 P0，形成网状结构：

- **viral 聚类内链**：action-figure ↔ sticker ↔ thumbnail ↔ instagram-photo-edit ↔ cinematic-portrait
- **commercial 聚类内链**：product-photography ↔ ecommerce-product (P1) ↔ food-photography ↔ social-media-ad (P1)
- **creative 聚类内链**：poster-design ↔ infographic ↔ thumbnail
- **跨聚类内链**：old-photo-restore → cinematic-portrait（情感→艺术）；infographic → product-photography（产品分解）

## 关键差异化叙事（GPT Image 2 vs Midjourney/SDXL）

每个 spec 都把以下 3 个卖点至少强调一次：

1. **像素级文字渲染**：thumbnail / poster / infographic / sticker 标签 / social-ad 文案 — Midjourney 文字糊，我们清晰
2. **image-to-image 保持主体**：action-figure / old-photo-restore / cinematic-portrait / sticker / product-photography — 上传照片不变形
3. **多图一致性**：character consistency / multi-frame collage / 同一产品多场景 — Midjourney 容易跑偏

## 页面结构通用模板

```
H1: <主关键词> for GPT Image 2
[Hero + 1 句价值主张]
[Workbench CTA — 第一屏 above-the-fold 必须有]
[3-6 张 viral 案例对比图（before/after 或子场景预览）]

H2: Sub-scenes（4-6 个 anchor tab）
[Masonry prompt cards] → click → modal: 大图 + prompt 全文 + Copy + 'Try in Workbench' 深链

H2: How to write a <X> prompt（3 步教程）
H2: FAQ（5 条）
H2: Related Prompt Clusters（3-4 内链卡片）
[CTA + Breadcrumb]
```

## 已识别的特殊页面布局需求

| Cluster | 特殊布局 |
|---|---|
| `old-photo-restore` | 首屏必须 Workbench CTA + 上传入口（用户搜的是工具，不是 prompt） |
| `instagram-photo-edit` | 顶部加『今日 viral edit』Carousel + 月度更新机制（content velocity 是关键） |
| `sticker` | 双 CTA 抓两类用户：viral 自照 + Etsy 卖家变现 |
| `thumbnail` | 演示『同主体 × 多 niche prompt』生成多张 thumbnail（YouTuber 一周需多张） |
| `poster-design` | 实时输入 demo（输入 title → 立刻看预览，强化文字渲染卖点） |
| `infographic` | 案例对比图『Midjourney 文字糊 vs GPT Image 2 文字清晰』（视觉冲击差异化） |

## 下一步（Phase 4：Prompt 选品）

进入 Phase 4 前需要确认：

1. ✅ 10 P0 锁定（已完成）
2. ✅ 每 cluster 子场景定义（已完成）
3. ✅ 每 cluster 期望 prompt 数量（已完成，合计 131 条）

Phase 4 任务：
- 从 `prompts.master.jsonl`（1446 条 GitHub）+ `prompts.supplemental.jsonl`（34 条 Reddit/X）+ 必要时新增创作
- 按每个 cluster 子场景分配 prompt（minhash 去重 + 黑名单去敏 + 改写为统一句式）
- 输出 `clusters/{slug}/prompts.jsonl` 共 10 个文件，合计 131 条精选 prompt
- 每条 prompt 含 `final_prompt` + `sub_scene_tag` + `source_attribution_internal`

预计耗时：**1-2 天**（脚本自动归类 + 人工 QA 改写）

Phase 5（图片重生）和 Phase 6（代码实施）依赖 Phase 4 产出。
