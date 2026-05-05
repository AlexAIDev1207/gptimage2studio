# Phase 5 补丁：3 张 product-photography 图错位

校验时发现 codex 重生 product cluster 时把 002/004/005 这 3 张图写成了**其他 cluster 图的复制**（MD5 完全一致）。

| 错误图 | 当时写入的内容（错的） | 应有内容 |
|---|---|---|
| `product-photography-prompts-002` | instagram-photo-edit-005 副本 | Cyberpunk Fashion Magazine Cover |
| `product-photography-prompts-004` | infographic-002 副本 | Chibi Witch Owl Figurine |
| `product-photography-prompts-005` | food-photography-001 副本 | Iced Coffee Brand Vertical Poster |

错图已删除，media.jsonl 对应 3 条已清理。

## 给 codex 的任务

从 `product-photography-prompts/prompts.jsonl` 读这 3 个 prompt_id 的 `final_prompt`：
- `product-photography-prompts-002`
- `product-photography-prompts-004`
- `product-photography-prompts-005`

每条单独喂给 GPT Image 2 生成（**不要复用其他 cluster 的输出**），保存到 `product-photography-prompts/images/{prompt_id}.png`，**追加** 一行到 `product-photography-prompts/media.jsonl`。

期望分辨率：**2K**（与 cluster 其他图一致）

完成后我会再做一次 MD5 重复检查。
