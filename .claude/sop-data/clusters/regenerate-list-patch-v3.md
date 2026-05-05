# Phase 5 patch v3：3 张 prompt 主动要求 CJK 文字

生成时间：2026-05-04T11:08:50.937Z

之前的 patch v1 漏了 3 张 prompt **文本中明确要求** CJK visible text 的图：

| prompt_id | 原指令 | 修复 |
|---|---|---|
| `poster-design-prompts-012` | "Japanese kanji" 标题 | 改为英文标题 |
| `infographic-prompts-003` | "Simplified Chinese" + 12 个中文 label | 全部改英文 |
| `infographic-prompts-009` | "Simplified Chinese labels" | 改英文（参考 #001 模式）|

## 给 codex 的任务

从对应 `prompts.jsonl` 读这 3 个 prompt_id 的（已改写的）`final_prompt`：
- `poster-design-prompts-012`（**2K**）
- `infographic-prompts-003`（**2K**）
- `infographic-prompts-009`（**2K**）

生成后保存到 `{cluster}/images/{prompt_id}.png`，**追加**到 `media.jsonl`。

完成后我会重新跑 webp 压缩这 3 张 + 写回 prompts.jsonl 的 `final_image_*` 字段。

## 注意

`prompts.jsonl` 里这 3 条已删除 `final_image_url` 等字段，以避免引用到已删除的 webp 旧版本。