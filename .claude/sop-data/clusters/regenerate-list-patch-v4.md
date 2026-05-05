# Phase 6 patch v4：8 个 CJK prompt → 英文版

生成时间：2026-05-04T21:43:25.771Z

页面视觉审核发现 8 个 prompt 内嵌大量中/日文 visible text，导致生成图含 CJK 文字。已改写为英文等效版本。

## 给 codex 的任务

从对应 `prompts.jsonl` 读这 8 个 prompt_id 的（已改写为英文的）`final_prompt`：

| prompt_id | 期望分辨率 | 新标题 |
|---|---|---|
| `action-figure-prompts-009` | 1K | Politician Satire Action Figure |
| `instagram-photo-edit-prompts-007` | 1K | Hidden Character City Crowd Scene |
| `instagram-photo-edit-prompts-014` | 1K | Viral 2x2 Grid Ad Concept |
| `thumbnail-prompts-004` | 2K | Fiery Growth Marketing Thumbnail |
| `thumbnail-prompts-011` | 2K | Surreal Pyramid Sushi Conductor Thumbnail |
| `infographic-prompts-006` | 2K | Underground City Cutaway Storybook |
| `infographic-prompts-007` | 2K | Fashion Tablet Brand Concept Sheet |
| `infographic-prompts-008` | 2K | Retro Game News Newspaper Front Page |

生成后保存到 `{cluster}/images/{prompt_id}.png`，**追加** 到 `{cluster}/media.jsonl`。

完成后我会自动跑 webp 压缩 + 写回 prompts.jsonl 的 `final_image_*` 字段。