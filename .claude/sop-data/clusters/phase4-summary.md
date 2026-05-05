# Phase 4: Prompt 选品汇总

生成时间：2026-05-03T19:01:31.481Z

## 输入
- 候选池总数: 1606
- 含完整 prompt 文本 (≥ 50 字): 896 条被分配到 cluster

## 配置
- minhash 去重阈值: viral=0.78 / commercial=0.65 / creative=0.65
- 黑名单替换规则: 25 条

## 每 cluster 选品结果

| Cluster | 候选池 | 选中 | 目标 | 含 JSON 模板 | 去敏次数 | 来源分布 |
|---|---|---|---|---|---|---|
| `action-figure-prompts` | 14 | **12** | 12 | 0 | 0 | manual-seed=6 reddit=2 x_chrome=1 github=3 |
| `old-photo-restore-prompts` | 5 | **12** | 12 | 0 | 0 | manual-seed=12 |
| `instagram-photo-edit-prompts` | 77 | **14** | 14 | 0 | 1 | manual-seed=1 awesome-gpt-image-2=7 github=6 |
| `sticker-prompts` | 35 | **13** | 13 | 0 | 2 | manual-seed=6 github=6 reddit=1 |
| `thumbnail-prompts` | 21 | **12** | 13 | 6 | 0 | manual-seed=3 awesome-gpt-image-2=9 |
| `cinematic-portrait-prompts` | 161 | **13** | 13 | 0 | 1 | manual-seed=3 awesome-gpt-image-2=2 github=8 |
| `product-photography-prompts` | 363 | **14** | 14 | 7 | 2 | awesome-gpt-image-2=6 github=8 |
| `poster-design-prompts` | 73 | **14** | 14 | 7 | 0 | manual-seed=6 github=8 |
| `food-photography-prompts` | 100 | **13** | 13 | 0 | 0 | github=13 |
| `infographic-prompts` | 47 | **13** | 13 | 7 | 5 | awesome-gpt-image-2=9 github=4 |
| **合计** | — | **130** | 131 | — | — | credits=884 |

## 改写策略（已采纳推荐方案）

- **(a) 最小改写**：保留原 prompt 风格，只去敏
- **(a) 50/50 JSON 混搭**：4 个复杂构图 cluster 偶数 idx 标记 `json_template_ref`，奇数保持自然语言
- **(b) 占位符替换**：明星/品牌/IP/政治人物 → `[placeholder]`
- **(a) 全自动跑完**：完成后给汇总，未做人工 QA

## 输出文件

- `clusters/action-figure-prompts/prompts.jsonl`（12 条）
- `clusters/old-photo-restore-prompts/prompts.jsonl`（12 条）
- `clusters/instagram-photo-edit-prompts/prompts.jsonl`（14 条）
- `clusters/sticker-prompts/prompts.jsonl`（13 条）
- `clusters/thumbnail-prompts/prompts.jsonl`（12 条）
- `clusters/cinematic-portrait-prompts/prompts.jsonl`（13 条）
- `clusters/product-photography-prompts/prompts.jsonl`（14 条）
- `clusters/poster-design-prompts/prompts.jsonl`（14 条）
- `clusters/food-photography-prompts/prompts.jsonl`（13 条）
- `clusters/infographic-prompts/prompts.jsonl`（13 条）

## 字段 schema

```json
{
  "prompt_id": "action-figure-prompts-001",
  "cluster_slug": "action-figure-prompts",
  "sub_scene_tag": "blister-pack",
  "title": "Office Worker Action Figure",
  "final_prompt": "Create a 3D action figure of [name]...",
  "json_template_ref": null,
  "input_image_required": true,
  "estimated_credits": 6,
  "source": "awesome-gpt-image-2",
  "source_attribution_internal": "awesome-gpt-image-2:42",
  "source_url_internal": "https://x.com/...",
  "original_image_urls": [
    "https://..."
  ],
  "sanitized_terms": [
    "Sam Altman"
  ],
  "language": "en"
}
```

## 下一步
Phase 5：Kie.ai 图片重生（131 张，credits 估算 ~1130）