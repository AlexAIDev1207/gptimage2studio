# Phase 5 补丁 v3：2 张 product 主动遮脸 prompt 修复

product-photography-prompts-002 和 004 的**原 prompt 文本本身**含主动遮脸指令（"face covered by privacy block" / "faceless area"），导致重生后人脸仍然被遮。

| prompt_id | 修复内容 |
|---|---|
| product-photography-prompts-002 | 删除 "face covered by privacy block"，改为"face fully visible 编辑摄影" |
| product-photography-prompts-004 | 删除 "faceless brown area"，改为"cute owl face with two round black eyes" |

## 给 codex 的任务

从 `product-photography-prompts/prompts.jsonl` 读这 2 个 prompt_id 的（已修改的）`final_prompt`：
- `product-photography-prompts-002`
- `product-photography-prompts-004`

用 GPT Image 2 生成 **2K** 分辨率，保存到 `product-photography-prompts/images/{prompt_id}.png`，**追加** 一行到 `product-photography-prompts/media.jsonl`。
