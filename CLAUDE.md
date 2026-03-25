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

### Git 提交规则

**核心纪律：`.claude/` 的改动和 `src/` 的改动必须在不同的 commit 中。**

```bash
# SOP 改动（.claude/ 目录）单独提交
git add .claude/
git commit -m "chore(SOP): {具体改了什么}"

# 业务代码单独提交
git add src/ content/ public/ ...
git commit -m "feat(xxx): {功能描述}"
```

为什么：后续同步 SOP 改进回 starter 仓库时使用 cherry-pick，独立提交才能保证只带走 SOP 改动，不混入业务代码。

### SOP 改进同步回 Starter

当项目中优化了 SOP（改了 `.claude/` 下的文件），评估是否为通用改进。如果是，同步回 starter：

```bash
# 1. 切到 starter 仓库的 sop-updates 分支
cd ../webdev-sop-starter
git checkout sop-updates

# 2. 把项目仓库注册为远程源（首次需要，后续跳过）
git remote add {项目名} git@github.com:AlexAIDev1207/{项目名}.git

# 3. 拉取项目的提交历史
git fetch {项目名}

# 4. 筛选项目中只改了 .claude/ 的提交
git log {项目名}/main --oneline -- .claude/

# 5. cherry-pick 需要的 SOP 提交（可多个）
git cherry-pick {hash}

# 6. 推送到 starter 的 sop-updates 分支
git push origin sop-updates

# 7. 在 GitHub 上创建 PR：sop-updates → main，审查后合并
# 8. 清理临时 remote
git remote remove {项目名}
```

### ShipAny 模板更新同步到 Starter

当 ShipAny 官方发布新版本：

```bash
cd webdev-sop-starter
git checkout main
git fetch upstream
git merge upstream/main    # .claude/ 不会冲突（官方模板没有这个目录）
pnpm build                 # 验证合并结果
git push origin main
```

### 已有项目获取最新 SOP

```bash
# 在老项目中
git fetch starter
git checkout starter/main -- .claude/rules/ .claude/skills/ .claude/sop-keyword-to-launch.md
# 注意：不要 checkout .claude/sop-data/（那是项目特有数据）
git commit -m "chore(SOP): 从 starter 同步最新 SOP"
```

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
