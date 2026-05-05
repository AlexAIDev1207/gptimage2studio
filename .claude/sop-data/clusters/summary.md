# Phase 1: 候选 cluster 打分汇总

生成时间：2026-05-02T17:54:48.273Z

## 数据规模
- GitHub prompt 数据集：1446 条
- 跨源记录总数：1714
- prompts.master.jsonl（GitHub 已分类）：1446 条
- prompts.supplemental.jsonl（非 GitHub 含 prompt）：34 条

## 候选 cluster 排名

| # | slug | score | 总证据 | 多源数 | github | reddit | x | youtube | competitor | sup. | gh_avg |
|---|------|-------|--------|--------|--------|--------|---|---------|------------|------|--------|
| 1 | `poster-design-prompts` | 0.864 | 300 | 5 | 212 | 6 | 1 | 6 | 75 | 0 | 48.2198 |
| 2 | `portrait-prompts` | 0.682 | 667 | 5 | 618 | 3 | 1 | 3 | 42 | 0 | 28.5473 |
| 3 | `anime-style-prompts` | 0.601 | 426 | 4 | 394 | 3 | 0 | 3 | 26 | 0 | 30.3843 |
| 4 | `logo-design-prompts` | 0.588 | 396 | 5 | 371 | 1 | 2 | 7 | 15 | 0 | 37.5343 |
| 5 | `product-photography-prompts` | 0.571 | 1040 | 6 | 1013 | 12 | 2 | 8 | 4 | 1 | 31.7876 |
| 6 | `cinematic-portrait-prompts` | 0.537 | 598 | 5 | 585 | 1 | 1 | 3 | 8 | 0 | 27.9492 |
| 7 | `text-rendering-prompts` | 0.535 | 274 | 5 | 265 | 3 | 1 | 2 | 3 | 0 | 40.9709 |
| 8 | `character-design-prompts` | 0.533 | 389 | 5 | 374 | 3 | 1 | 0 | 10 | 1 | 30.6052 |
| 9 | `infographic-prompts` | 0.524 | 131 | 5 | 113 | 2 | 0 | 5 | 10 | 1 | 41.499 |
| 10 | `ecommerce-product-photo-prompts` | 0.513 | 264 | 4 | 245 | 11 | 0 | 6 | 2 | 0 | 37.6775 |
| 11 | `3d-render-prompts` | 0.498 | 389 | 2 | 388 | 0 | 0 | 0 | 1 | 0 | 30.8398 |
| 12 | `ui-mockup-prompts` | 0.479 | 59 | 3 | 54 | 3 | 2 | 0 | 0 | 0 | 49.7883 |
| 13 | `old-photo-restore-prompts` | 0.436 | 23 | 4 | 2 | 4 | 0 | 3 | 14 | 0 | 40.445 |
| 14 | `food-photography-prompts` | 0.435 | 164 | 1 | 164 | 0 | 0 | 0 | 0 | 0 | 28.8754 |
| 15 | `social-media-ad-prompts` | 0.428 | 7 | 3 | 1 | 0 | 0 | 2 | 4 | 0 | 59.89 |
| 16 | `sticker-prompts` | 0.425 | 47 | 4 | 39 | 3 | 0 | 1 | 4 | 0 | 38.1 |
| 17 | `thumbnail-prompts` | 0.412 | 6 | 2 | 1 | 0 | 0 | 5 | 0 | 0 | 61.45 |
| 18 | `interior-design-prompts` | 0.370 | 28 | 4 | 16 | 1 | 0 | 3 | 8 | 0 | 29.4681 |
| 19 | `action-figure-prompts` | 0.368 | 45 | 5 | 38 | 2 | 1 | 3 | 1 | 0 | 29.4616 |
| 20 | `multi-image-consistency-prompts` | 0.307 | 10 | 4 | 5 | 1 | 0 | 2 | 2 | 0 | 33.078 |
| 21 | `instagram-photo-edit-prompts` | 0.216 | 6 | 4 | 2 | 2 | 1 | 1 | 0 | 0 | 21.255 |

## 评分公式
```
score = 0.4 × log10(total_evidence + 1) / log10(max_total + 1)
      + 0.3 × competitor_evidence / max_competitor
      + 0.3 × github_avg_score / max_github_avg
```

## 多源数 ≥ 3 的候选
共 18 个 / 21

- **poster-design-prompts**：5 源支撑（github=212 reddit=6 x=1 youtube=6 competitor=75 sup=0）
- **portrait-prompts**：5 源支撑（github=618 reddit=3 x=1 youtube=3 competitor=42 sup=0）
- **anime-style-prompts**：4 源支撑（github=394 reddit=3 x=0 youtube=3 competitor=26 sup=0）
- **logo-design-prompts**：5 源支撑（github=371 reddit=1 x=2 youtube=7 competitor=15 sup=0）
- **product-photography-prompts**：6 源支撑（github=1013 reddit=12 x=2 youtube=8 competitor=4 sup=1）
- **cinematic-portrait-prompts**：5 源支撑（github=585 reddit=1 x=1 youtube=3 competitor=8 sup=0）
- **text-rendering-prompts**：5 源支撑（github=265 reddit=3 x=1 youtube=2 competitor=3 sup=0）
- **character-design-prompts**：5 源支撑（github=374 reddit=3 x=1 youtube=0 competitor=10 sup=1）
- **infographic-prompts**：5 源支撑（github=113 reddit=2 x=0 youtube=5 competitor=10 sup=1）
- **ecommerce-product-photo-prompts**：4 源支撑（github=245 reddit=11 x=0 youtube=6 competitor=2 sup=0）
- **ui-mockup-prompts**：3 源支撑（github=54 reddit=3 x=2 youtube=0 competitor=0 sup=0）
- **old-photo-restore-prompts**：4 源支撑（github=2 reddit=4 x=0 youtube=3 competitor=14 sup=0）
- **social-media-ad-prompts**：3 源支撑（github=1 reddit=0 x=0 youtube=2 competitor=4 sup=0）
- **sticker-prompts**：4 源支撑（github=39 reddit=3 x=0 youtube=1 competitor=4 sup=0）
- **interior-design-prompts**：4 源支撑（github=16 reddit=1 x=0 youtube=3 competitor=8 sup=0）
- **action-figure-prompts**：5 源支撑（github=38 reddit=2 x=1 youtube=3 competitor=1 sup=0）
- **multi-image-consistency-prompts**：4 源支撑（github=5 reddit=1 x=0 youtube=2 competitor=2 sup=0）
- **instagram-photo-edit-prompts**：4 源支撑（github=2 reddit=2 x=1 youtube=1 competitor=0 sup=0）

## 下一步（Phase 2）

对 top 15-20 候选用 browsermcp 跑 Google SERP 验证（主词 + autocomplete + PAA + related + intitle 数），剔除 SERP 已被 Reddit/Pinterest 锁死或主词被歧义占领的，敲定 10 P0。