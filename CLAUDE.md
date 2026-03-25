# CLAUDE.md

## 项目概述

基于 ShipAny Template Two 的工具站模板，内置建站 SOP 系统。

## 技术栈

- **框架**: Next.js (App Router) + React + TypeScript (strict)
- **样式**: Tailwind CSS + Shadcn/UI (New York style) + Framer Motion
- **数据库**: Drizzle ORM，支持 SQLite/Turso/PostgreSQL/MySQL/Cloudflare D1
- **认证**: Better Auth (Email + Google + GitHub OAuth)
- **支付**: Stripe / PayPal / Creem (PaymentManager 插件架构)
- **i18n**: next-intl，消息文件在 `src/config/locale/messages/{locale}/`
- **内容**: Fumadocs MDX (`content/` 目录)
- **包管理器**: pnpm

## 常用命令

```bash
pnpm dev                # 开发服务器
pnpm build              # 生产构建
pnpm lint               # ESLint 检查
pnpm db:generate        # 生成 Drizzle schema
pnpm db:migrate         # 运行迁移
```

## SOP 工作流

本项目内置 `.claude/sop-keyword-to-launch.md` 建站 SOP。

### 命令清单

| 命令 | Phase | 作用 |
|------|-------|------|
| `/sop` | — | 查看 SOP 进度，获取下一步指引 |
| `/sop-research {种子词}` | 0 | 关键词调研：竞对速写+拓词+评估+内链映射 |
| `/sop-align` | 1 | 产品方案对齐：8 个决策项逐一确认 |
| `/sop-init` | 2 | 项目初始化：模板配置+品牌清理+支付 |
| `/sop-tool-page {关键词}` | 3 | 创建精品工具页：统一 H 结构+SEO 内容 |
| `/sop-blog` | 4 | 博客主题规划（无参数）或逐篇写作（带 slug） |
| `/sop-launch` | 5 | 上线前验证：内链+Schema+Sitemap+PageSpeed |
| `/sop-refresh` | 6 | 内容更新分析：排名监测+更新建议 |

### 数据目录

`.claude/sop-data/` 存放本项目的 Phase 输出数据（进度、关键词矩阵、产品方案等）。

### 规则（始终生效）

`.claude/rules/` 中的规则在所有操作中自动遵守：
- `seo-redlines.md` — 新站 SEO 红线
- `content-quality.md` — 内容质量标准 + CTA 规则
- `tool-page-structure.md` — 精品工具页 H 层级规范
- `internal-links.md` — 内链数量/位置/锚文本规则
- `brand-cleanup.md` — 品牌清理检查清单

### 迭代约定

- 改 SOP 或 Rules → 评估是否通用 → 通用改进同步回 starter 仓库的 `sop-updates` 分支
- 项目特有的调整 → 只改本项目，不同步
- SOP 改动单独提交：`git add .claude/ && git commit -m "chore(SOP): xxx"`

## 架构分层

```
src/
├── core/        # 框架基础设施 (auth, db, i18n, theme, rbac)
├── config/      # 全局配置 + 数据库 schema + 样式 + 国际化消息
├── extensions/  # 可插拔提供商 (payment, ai, storage, email)
├── shared/      # 可复用业务逻辑 (blocks, components, hooks, lib, models, services)
├── themes/      # 主题样式
└── app/         # Next.js 路由
```

## 代码规范

- **导入顺序**: React/Next → 第三方 → @/core → @/config → @/extensions → @/shared → 相对路径
- **路径别名**: `@/*` → `src/*`
- **数据库 schema 修改**: 需同时更新对应后端的 schema 文件，然后 `pnpm db:generate && pnpm db:migrate`
