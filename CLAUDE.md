# CLAUDE.md

## 项目概述

基于 ShipAny Template Two 的工具站，内置建站 SOP 系统。

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

## SOP 系统

本项目内置建站 SOP，输入 `/sop` 查看当前进度和下一步指引。

- SOP 文档：`.claude/sop-keyword-to-launch.md`
- 规则（始终生效）：`.claude/rules/`
- Phase 输出数据：`.claude/sop-data/`
- 人工操作指南：`.claude/GUIDE.md`

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
