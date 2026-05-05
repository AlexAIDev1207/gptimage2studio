# Phase 6 patch v5：1 个图重生

生成时间：2026-05-06

## 问题

`infographic-prompts-010 Ancient Greek Philosophers Gathering` 图片含中文文本（"两千五百年前的雅典 / 文明的源头在这里诞生"），违反纯英文要求。

注：`cinematic-portrait-prompts-011 Sims 4 to CCD Carnival Selfie` 已直接删除（脸部安全过滤无法解决 + 主题错配），不需要重生。

## 给 codex 的任务

读 `.claude/sop-data/clusters/infographic-prompts/prompts.jsonl` 中 `infographic-prompts-010` 的 `final_prompt`，重新生图：

- 期望分辨率：2K
- 输出路径：`.claude/sop-data/clusters/infographic-prompts/images/infographic-prompts-010.png`
- 关键约束：所有可见文字必须是英文，**禁止任何中文/日文/韩文字符**

完成后我会自动跑 webp 压缩 + 写回 `final_image_*`。
