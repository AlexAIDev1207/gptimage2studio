---
name: sop-refresh
description: 执行 SOP Phase 6 内容更新分析。识别需要更新的文章、分析排名变化、建议发布节奏。当用户说"内容更新"、"刷新内容"、"排名下降"、"refresh"时触发。
---

# SOP Phase 6: 持续运营 — 内容更新分析

## 前置条件

检查 `.claude/sop-data/progress.md`，确认 Phase 5 已完成（✅）。

## 执行流程

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 6** 章节。

### 功能 A: 发布节奏建议

基于 `.claude/sop-data/keyword-matrix.md` 的 P0/P1/P2 优先级和当前时间：
- 计算当前应处于哪个发布阶段（Week 1-2 / Week 3-4 / Month 2-3 / ...）
- 建议下一步发布的文章
- 提醒发布时间（工作日 8-10 点）

### 功能 B: 内容更新识别

通过 AskUserQuestion 获取当前排名数据（用户从 Search Console 导出），分析：

**触发更新的条件**（满足任一）：
- 排名下滑 ≥ 5 位
- 排名停滞 ≥ 3 个月
- CTR 下滑 > 20%
- 竞对发布了同话题更好的内容
- 产品功能更新需同步文案

**更新优先级**：
- P0：排名 1-5 且下滑 ≥ 5 位（快速止跌）
- P1：排名 6-15 的文章（冲顶准备）
- P2：排名 16+ 的文章（长期维护）

### 功能 C: 更新执行

对需更新的文章，输出更新计划：
1. 哪些信息过时需刷新
2. 需补充的新内容
3. 需改进的结构/内链
4. 刷新 Frontmatter updated_at
5. 提交 Search Console 重新爬取

可调用 `/sop-blog {slug}` 执行具体更新。

## 输出

输出更新建议清单，用户确认后执行。
Phase 6 为持续状态，不标记 ✅。
