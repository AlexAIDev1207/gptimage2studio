---
doc_id: tech-stack
project_id: gptimage2studio
last_updated: 2026-05-15
last_decision:
related_tasks: []
---

# Tech Stack

<!-- brainctl:section:start name="overview" -->
**主体栈**：
- 语言：TypeScript `^5`（strict 模式开启），编译目标 ES2017，`moduleResolution: bundler`
- 运行时：Node.js 20（Dockerfile `node:20-alpine`），React `19.2.1` + React DOM `19.2.1`
- 框架：Next.js `15.5.15`，App Router；开发用 Turbopack，构建启用 React Compiler（`babel-plugin-react-compiler`）
- 项目来源：基于 ShipAny Template Two（`shipany-template-two` v1.8.2）的 AI SaaS 模板，分层为 `core / config / extensions / shared / themes / app`

**样式 / UI**：
- Tailwind CSS v4（`@tailwindcss/postcss`）+ Shadcn/UI（New York 风格，Radix UI 基础组件）
- 动效：Framer Motion / `motion` `^12.23`、`rough-notation`、Embla / Swiper 轮播
- 图标：lucide-react、Tabler、react-icons

**数据层**：
- ORM：Drizzle ORM `^0.44`（drizzle-kit `^0.31` 做 generate / migrate / studio）
- 多后端适配：Cloudflare D1（生产，sqlite 兼容）、Turso/libSQL（`@libsql/client`）、PostgreSQL（`postgres`）、MySQL（`mysql2`、PlanetScale）
- 生产数据库经 wrangler.toml 配置为 D1（`DATABASE_PROVIDER=d1`），迁移目录 `src/config/db/migrations_sqlite`
- 对象存储：Cloudflare R2（S3 API，`aws4fetch`），bucket `gptimage2studio-images`
- 无独立缓存层

**认证 / 支付 / 集成**：
- 认证：Better Auth `^1.3`（Email 验证 + Google OAuth）
- 支付：Stripe `^18.5`、PayPal、Creem 三选一（PaymentManager 插件架构，默认 stripe）
- AI：Vercel AI SDK `ai ^5.0` + `@ai-sdk/react`、Replicate、OpenRouter provider；图像生成走 KIE API（`api.kie.ai`）
- 邮件：Resend + React Email；i18n：next-intl `^4.3`
- 内容：Fumadocs MDX（`content/` 目录），博客/落地页用 MDX

**部署 / 运行时**：
- 主部署：Cloudflare（`@opennextjs/cloudflare`，`cf:deploy` 经 OpenNext 构建 + wrangler `^4.34`），绑定 D1 + R2，域名 `gptimage2studio.com`
- 备选：Vercel（`vercel.json`，framework nextjs）；Docker `node:20-alpine` standalone 多阶段构建
- CI：GitHub Actions `docker-build.yaml`，push/PR 到 main/dev 时构建并推送镜像到 ghcr.io（无 lint/test job）

**工具链**：
- 包管理：pnpm（`pnpm-lock.yaml`，Dockerfile 与 vercel.json 均用 pnpm `--frozen-lockfile`）
- Lint / 格式化：ESLint `^9`（`eslint-config-next`）+ Prettier `^3.6`（import 排序 + tailwind 插件）
- 脚本运行：tsx；图片处理：sharp
- 数据校验：Zod `^4.1`（配合 `@hookform/resolvers` + react-hook-form）

**不用什么**：
- ❌ 无测试栈（依赖中无 vitest / jest / playwright，CI 也无测试 job）—— 模板默认未配置自动化测试
- ❌ 无向量库 / Redis 等独立缓存或检索层
- ❌ 不用 npm / yarn / bun，统一 pnpm

**数据格式约定**：
- 内容数据为 MDX（Fumadocs，`source.config.ts`）
- 数据库 schema 改动需同步对应后端 schema 文件后 `pnpm db:generate && pnpm db:migrate`
- 路径别名 `@/*` → `src/*`；`@/.source` → 生成的 Fumadocs 索引
- ID 生成用 nanoid / uuid / simple-flakeid
<!-- brainctl:section:end name="overview" -->
