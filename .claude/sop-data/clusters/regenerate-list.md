# Phase 5 重生清单

生成时间：2026-05-03T19:05:14.677Z

需要 codex 重新生成 **49 张图**。原图已删除，media.jsonl 对应条目已清理。

## 给 codex 的执行指引

1. 遍历下面 6 个 cluster，从对应 `prompts.jsonl` 读取每条要重生的 `prompt_id` 的 `final_prompt`
2. 用 GPT Image 2 生成图（按 expected_resolution 决定 1K/2K）
3. 保存到 `{cluster}/images/{prompt_id}.png`
4. **追加** 一行到 `{cluster}/media.jsonl`（不要覆盖现有条目）

media.jsonl 字段格式（与之前一致）：
```json
{
  "prompt_id": "...",
  "image_path": "images/{prompt_id}.png",
  "width": 1024 | 1672 | 2048,
  "height": 1024 | 1536 | ...,
  "bytes_size": ...,
  "generated_at": "ISO timestamp",
  "model": "gpt-image-2",
  "resolution_label": "1K" | "2K",
  "status": "success",
  "error": null
}
```

## 重生清单（按 cluster 分组）

### `cinematic-portrait-prompts` — 13 张

从 `cinematic-portrait-prompts/prompts.jsonl` 找以下 prompt_id 的 `final_prompt` 喂给 GPT Image 2:

| # | prompt_id | 期望分辨率 | 重生原因 |
|---|---|---|---|
| 1 | `cinematic-portrait-prompts-001` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 2 | `cinematic-portrait-prompts-002` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 3 | `cinematic-portrait-prompts-003` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 4 | `cinematic-portrait-prompts-004` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 5 | `cinematic-portrait-prompts-005` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 6 | `cinematic-portrait-prompts-006` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 7 | `cinematic-portrait-prompts-007` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 8 | `cinematic-portrait-prompts-008` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 9 | `cinematic-portrait-prompts-009` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 10 | `cinematic-portrait-prompts-010` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 11 | `cinematic-portrait-prompts-011` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 12 | `cinematic-portrait-prompts-012` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |
| 13 | `cinematic-portrait-prompts-013` | 1K | cluster 全部重选 prompt（剔除 anime/chibi/Pixar/狗 等错误归类） |

### `instagram-photo-edit-prompts` — 4 张

从 `instagram-photo-edit-prompts/prompts.jsonl` 找以下 prompt_id 的 `final_prompt` 喂给 GPT Image 2:

| # | prompt_id | 期望分辨率 | 重生原因 |
|---|---|---|---|
| 1 | `instagram-photo-edit-prompts-002` | 1K | 改写避免人脸打码（删 privacy mask / 用具体描述代替 placeholder） |
| 2 | `instagram-photo-edit-prompts-005` | 1K | 改写避免人脸打码（删 privacy mask / 用具体描述代替 placeholder） |
| 3 | `instagram-photo-edit-prompts-006` | 1K | 改写避免人脸打码（删 privacy mask / 用具体描述代替 placeholder） |
| 4 | `instagram-photo-edit-prompts-010` | 1K | 完全替换偏题（中文道符 → split-screen edit） |

### `food-photography-prompts` — 2 张

从 `food-photography-prompts/prompts.jsonl` 找以下 prompt_id 的 `final_prompt` 喂给 GPT Image 2:

| # | prompt_id | 期望分辨率 | 重生原因 |
|---|---|---|---|
| 1 | `food-photography-prompts-001` | 1K | 替换偏题创意拼贴 → 标准 hero shot pizza |
| 2 | `food-photography-prompts-002` | 1K | 替换 4-grid 广告 → 单一 hero shot burger |

### `thumbnail-prompts` — 3 张

从 `thumbnail-prompts/prompts.jsonl` 找以下 prompt_id 的 `final_prompt` 喂给 GPT Image 2:

| # | prompt_id | 期望分辨率 | 重生原因 |
|---|---|---|---|
| 1 | `thumbnail-prompts-005` | 2K | 日文 → 英文版重生 |
| 2 | `thumbnail-prompts-008` | 2K | 日文 → 英文版重生 |
| 3 | `thumbnail-prompts-010` | 2K | 日文 → 英文版重生 |

### `infographic-prompts` — 13 张

从 `infographic-prompts/prompts.jsonl` 找以下 prompt_id 的 `final_prompt` 喂给 GPT Image 2:

| # | prompt_id | 期望分辨率 | 重生原因 |
|---|---|---|---|
| 1 | `infographic-prompts-001` | 2K | 中文 → 英文 + 升 2K |
| 2 | `infographic-prompts-002` | 2K | 升级为 2K 分辨率 |
| 3 | `infographic-prompts-003` | 2K | 升级为 2K 分辨率 |
| 4 | `infographic-prompts-004` | 2K | 升级为 2K 分辨率 |
| 5 | `infographic-prompts-005` | 2K | 升级为 2K 分辨率 |
| 6 | `infographic-prompts-006` | 2K | 升级为 2K 分辨率 |
| 7 | `infographic-prompts-007` | 2K | 升级为 2K 分辨率 |
| 8 | `infographic-prompts-008` | 2K | 升级为 2K 分辨率 |
| 9 | `infographic-prompts-009` | 2K | 升级为 2K 分辨率 |
| 10 | `infographic-prompts-010` | 2K | 升级为 2K 分辨率 |
| 11 | `infographic-prompts-011` | 2K | 升级为 2K 分辨率 |
| 12 | `infographic-prompts-012` | 2K | 升级为 2K 分辨率 |
| 13 | `infographic-prompts-013` | 2K | 升级为 2K 分辨率 |

### `product-photography-prompts` — 14 张

从 `product-photography-prompts/prompts.jsonl` 找以下 prompt_id 的 `final_prompt` 喂给 GPT Image 2:

| # | prompt_id | 期望分辨率 | 重生原因 |
|---|---|---|---|
| 1 | `product-photography-prompts-001` | 2K | 升级为 2K 分辨率 |
| 2 | `product-photography-prompts-002` | 2K | 升级为 2K 分辨率 |
| 3 | `product-photography-prompts-003` | 2K | 升级为 2K 分辨率 |
| 4 | `product-photography-prompts-004` | 2K | 升级为 2K 分辨率 |
| 5 | `product-photography-prompts-005` | 2K | 替换 Dunkin 品牌 + 删除遮脸 + 升 2K |
| 6 | `product-photography-prompts-006` | 2K | 升级为 2K 分辨率 |
| 7 | `product-photography-prompts-007` | 2K | 升级为 2K 分辨率 |
| 8 | `product-photography-prompts-008` | 2K | 升级为 2K 分辨率 |
| 9 | `product-photography-prompts-009` | 2K | 升级为 2K 分辨率 |
| 10 | `product-photography-prompts-010` | 2K | 升级为 2K 分辨率 |
| 11 | `product-photography-prompts-011` | 2K | 升级为 2K 分辨率 |
| 12 | `product-photography-prompts-012` | 2K | 升级为 2K 分辨率 |
| 13 | `product-photography-prompts-013` | 2K | 升级为 2K 分辨率 |
| 14 | `product-photography-prompts-014` | 2K | 升级为 2K 分辨率 |

## 总览

| Cluster | 重生数 | 期望分辨率 |
|---|---|---|
| `cinematic-portrait-prompts` | 13 | 1K |
| `instagram-photo-edit-prompts` | 4 | 1K |
| `food-photography-prompts` | 2 | 1K |
| `thumbnail-prompts` | 3 | 2K |
| `infographic-prompts` | 13 | 2K |
| `product-photography-prompts` | 14 | 2K |
| **合计** | **49** | — |