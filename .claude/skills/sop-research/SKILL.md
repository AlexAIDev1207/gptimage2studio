---
name: sop-research
description: 执行 SOP Phase 0 关键词调研。输入种子关键词，输出关键词矩阵+内链映射+竞对速写 3 份文档到 sop-data/。当用户说"关键词调研"、"keyword research"、"分析关键词"、"调研竞对"时触发。
---

# SOP Phase 0: 关键词调研与分类

## 输入

- `$ARGUMENTS`: 种子关键词（如 "LinkedIn Translator"）
- 如果未提供种子词，通过 AskUserQuestion 询问

## 执行流程

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 0** 章节，按以下步骤执行：

### Step 0.1: 竞对产品速写

使用 WebSearch 搜索种子词，记录 SERP 前 10 名网站。

对 3-5 个主要竞对，可并行启动 `seo-researcher` subagent 分别分析：
- 产品形态（工具交互形式、功能范围、定价策略）
- 首页结构（Section 列表、内容量、是否嵌入工具）
- 竞对话题清单（博客标题列表 + 话题分类 + 更新频率）
- 新站排名机会（SERP 中是否有新站/小站排名）

汇总结果写入 `competitor-sketch.md`（模板见 `references/02-competitor-sketch-template.md`）。

### Step 0.2: 种子词拓展

使用 WebSearch 执行：
1. Google 搜索自动补全建议（10-20 个）
2. People Also Ask 问题（5-10 个）
3. Related Searches（8 个）
4. 对前 3 个高潜力变体词重复 1-3
5. Google Trends 相关查询中的热门和上升词
6. 补充竞对覆盖但我们未拓展到的关键词（来自 Step 0.1）

### Step 0.3: 评估与分类

对每个关键词评估 3 个维度（SOP 中有详细标准）：
1. 搜索热度（Google Trends 对比）
2. 竞争度（手动 SERP 分析）
3. 搜索意图（TOOL / BLOG / SKIP）

按 P0/P1/P2 优先级排序，分类为工具词和博客词。

写入 `keyword-matrix.md`（模板见 `references/00-keyword-matrix-template.md`）。

### Step 0.4: 内链映射

基于关键词矩阵中的工具页和博客主题，规划页面间的链接关系。
遵守 `.claude/rules/internal-links.md` 中的数量和锚文本规则。

写入 `internal-links.md`（模板见 `references/01-internal-links-template.md`）。

## 输出

3 份文件写入 `.claude/sop-data/`：
- `keyword-matrix.md`
- `internal-links.md`
- `competitor-sketch.md`

完成后更新 `.claude/sop-data/progress.md` Phase 0 状态为 ✅。

## 用户确认点

- Step 0.3 完成后：展示关键词矩阵，等待用户确认优先级和分类
- Step 0.4 完成后：展示内链映射表，等待用户确认
