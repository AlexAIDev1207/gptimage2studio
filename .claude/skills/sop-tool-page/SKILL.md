---
name: sop-tool-page
description: 执行 SOP Phase 3 创建精品工具页。输入工具关键词，统一设计 H 层级 + 生成 SEO 内容 + 创建路由。当用户说"创建工具页"、"做落地页"、"精品页面"、"tool page"时触发。
---

# SOP Phase 3: 精品工具页

## 前置条件

检查 `.claude/sop-data/progress.md`，确认 Phase 2 已完成（✅）。

## 输入

- `$ARGUMENTS`: 工具关键词（如 "LinkedIn Translator"）
- `.claude/sop-data/keyword-matrix.md`（确认该词在工具词列表中）
- `.claude/sop-data/internal-links.md`（该页面的内链映射）
- `.claude/sop-data/product-brief.md`（差异化策略 + 工具方案 + 转化路径）

## 执行流程

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 3** 章节。
严格遵守 `.claude/rules/tool-page-structure.md` 的 H 层级规范。

### Step 3.1: 统一 H 层级设计 + SEO 内容生成

基于关键词设计整页的 H 树（H1 唯一，所有区域的 H2/H3 在同一棵树下）。

可启动 `content-writer` subagent 生成 SEO 内容（≥1200 字），包含：
- Title/Description（Title ≤60 字符，Description ≤160 字符）
- 各 Section 内容（How It Works / Why Use / Use Cases / FAQ / Testimonials）
- Related Articles（按内链映射表）
- JSON-LD Schema（WebApplication + FAQPage + BreadcrumbList）
- 配图（产品截图 > 信息图 > Unsplash 素材）

输出为 locale JSON 文件或页面组件 props。

### Step 3.2: 页面路由创建

按路由决策树：
- 需要可交互工具 → 手动创建 Code-based Route: `src/app/[locale]/(landing)/{tool}/page.tsx`
- 纯 SEO 落地页 → 调用 `/shipany-page-builder` 创建 JSON 动态页面

### Step 3.3: 工具交互组件（需用户手动开发）

提示用户按 `product-brief.md` 的工具方案手动开发：
- 组件封装为 `'use client'`
- 遵守 SOP Phase 3「工具交互区」的开发检查清单
- 包含状态管理（加载/成功/错误/空状态/限次）
- 包含无障碍支持

### Step 3.4: 结果展示区

如果工具需要展示结果：
- 创建通用组件（ResultCard / ResultGrid / ResultFilter）
- 配置 UGC 策略（noindex 用户页 + 白名单聚合页）

## 输出

- 页面路由文件或 locale JSON
- SEO 内容（已嵌入页面）
- Schema 配置
- 工具组件框架（如需手动开发，输出待办清单）

完成后更新 `.claude/sop-data/progress.md` Phase 3 状态。
注：Phase 3 可多次执行（每个工具关键词一次），状态标记为"🔄 进行中 (N/M)"。
