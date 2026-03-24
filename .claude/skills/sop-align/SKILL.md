---
name: sop-align
description: 执行 SOP Phase 1 产品方案对齐。通过 AskUserQuestion 逐项对齐 8 个产品决策，输出 product-brief.md。当用户说"产品对齐"、"对齐需求"、"产品方案"时触发。
---

# SOP Phase 1: 产品方案对齐

## 前置条件

检查 `.claude/sop-data/progress.md`，确认 Phase 0 已完成（✅）。
如果未完成，提示用户先执行 `/sop-research {种子词}`。

## 输入

- `.claude/sop-data/competitor-sketch.md`（Phase 0 输出，竞对产品速写）
- `.claude/sop-data/keyword-matrix.md`（Phase 0 输出，了解目标关键词）

## 执行流程

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 1** 章节，
通过 AskUserQuestion 逐项和用户对齐以下 8 个决策：

### 对齐顺序

1. **目标用户** — 核心用户、痛点、现有替代方案、核心期望
2. **差异化策略** — 基于竞对速写，确认竞对弱点和我们的独特卖点
3. **工具交互方案** — 核心流程、同步/异步、第三方依赖
4. **变现模型** — Free/Pro 边界、定价方案
5. **MVP 范围** — v1 做什么/不做什么、用户系统/支付系统是否需要
6. **部署与技术方案** — 先选部署方式，再反推数据库选择
7. **用户转化路径** — 限次实现方式、限次后引导策略、博客 CTA 风格
8. **数据分析需求** — 分析工具选型、关键事件、转化路径追踪

### 对齐方式

- 每个决策项使用 AskUserQuestion 提问（2-4 个选项 + Other）
- 展示竞对速写中的相关信息作为参考
- 用户回答后记录到 product-brief.md

## 输出

写入 `.claude/sop-data/product-brief.md`，格式：

```markdown
# 产品方案：{项目名}

## 目标用户
- 核心用户：xxx
- 痛点：xxx
- 核心期望：xxx

## 差异化策略
- 竞对弱点：xxx
- 独特卖点：xxx
- 差异化重点：xxx

## 工具交互方案
- 核心流程：输入 → 处理 → 输出
- 处理方式：同步 / 异步
- 第三方依赖：xxx

## 变现模型
- Free：xxx
- Pro：xxx
- 定价：xxx

## MVP 范围
- v1 做：xxx
- v1 不做：xxx
- 用户系统 ✅/❌ | 支付系统 ✅/❌

## 部署与技术方案
- 部署方式：xxx → 数据库：xxx
- 队列/缓存：xxx

## 用户转化路径
- 限次方式：xxx
- 限次后引导：xxx
- 博客 CTA 风格：xxx

## 数据分析
- 分析工具：xxx
- 关键事件：xxx
```

完成后更新 `.claude/sop-data/progress.md` Phase 1 状态为 ✅。

## 消费方提示

完成后告知用户：
- Phase 2（/sop-init）将读取此文档配置项目
- Phase 3 将读取工具方案和转化路径
- Phase 4 将读取目标用户调整博客风格
