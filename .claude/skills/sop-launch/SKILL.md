---
name: sop-launch
description: 执行 SOP Phase 5 全站验证+性能优化+上线。检查内链完整性、Schema 一致性、Sitemap 覆盖率，PageSpeed 4 项得分 ≥ 90。当用户说"上线检查"、"发布前检查"、"launch"、"上线"时触发。
---

# SOP Phase 5: 全站验证 + 性能优化 + 上线

## 前置条件

检查 `.claude/sop-data/progress.md`，确认 Phase 3 和 Phase 4 有进度（至少部分完成）。

## 执行流程

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 5** 章节。

### Step 5.1: 全站交叉验证

可启动 `seo-researcher` subagent 并行检查各维度：

**内链完整性**（对照 `.claude/sop-data/internal-links.md`）：
- 逐行验证映射表：每个工具页被 ≥ 2 篇博客内链
- 每篇博客内链 ≥ 1 工具页 + ≥ 1 博客
- 首页链接到所有核心工具页
- Footer 和面包屑导航

**Schema 一致性**：
- 首页: WebSite + Organization
- 工具页: WebApplication + FAQPage
- 聚合页: CollectionPage + FAQPage
- 博客页: Article + BreadcrumbList
- About 页: Organization

**Sitemap 覆盖率**：
- 所有工具页、博客页、聚合页已包含
- noindex 页面已排除
- 认证页面已排除

**Robots.txt**：
- 允许公开页面 / 禁止 /api/, /admin/, /_next/

输出验证报告，标记通过/未通过项。

### Step 5.2: 性能优化

引导用户在 https://pagespeed.web.dev/ 测试以下页面：
- 首页
- 核心工具页（P0 关键词）
- 1 篇博客页（抽检）

达标标准：移动端 + PC 端 4 项得分均 ≥ 90。
未达标项按 SOP Phase 5.2 的修复指南逐项处理。

### Step 5.3: 部署上线

输出部署检查清单：
- 部署前：pnpm build、页面访问、环境变量、DNS+SSL、分析工具
- 部署后：提交 sitemap、请求索引、验证 PageSpeed、配置监控

## 输出

将验证报告写入 `.claude/sop-data/launch-report.md`。
完成后更新 `.claude/sop-data/progress.md` Phase 5 状态为 ✅。
