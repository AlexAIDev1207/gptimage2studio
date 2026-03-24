---
name: sop
description: 查看 SOP 执行进度，获取下一步指引。输入 `/sop` 查看全局状态，或 `/sop Phase 3` 跳转到指定阶段。
---

# SOP 编排器

## 执行逻辑

1. 读取 `.claude/sop-data/progress.md`，展示当前各 Phase 的完成状态
2. 根据进度判断下一步：
   - 如果用户指定了 Phase（如 `/sop Phase 3`）→ 提示调用对应 Skill 命令
   - 如果未指定 → 找到第一个未完成的 Phase，建议下一步操作

3. 展示格式：

```
📋 SOP 进度：{项目名}

Phase 0 ✅ 关键词调研     → keyword-matrix.md ✅
Phase 1 ✅ 产品方案对齐   → product-brief.md ✅
Phase 2 🔄 项目初始化     ← 当前阶段
Phase 3 ⬜ 精品工具页
Phase 4 ⬜ 博客内容体系
Phase 5 ⬜ 全站验证+上线
Phase 6 ⬜ 持续运营

👉 下一步：执行 /sop-init 完成项目初始化
```

4. 如果所有 Phase 都已完成，展示完成摘要

## 参考文档

完整 SOP 流程定义：`.claude/sop-keyword-to-launch.md`

## 注意

- 本 Skill 只负责展示进度和指引，不执行具体工作
- 具体工作由对应的 Phase Skill 执行
- 进度状态由各 Phase Skill 执行完毕后自动更新到 progress.md
