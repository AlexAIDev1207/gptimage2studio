# SOP 操作指南（给人看的）

## 新项目执行顺序

```
1. /sop-research {种子关键词}     → 输出 3 份文档，确认关键词优先级
2. /sop-align                    → 回答 8 个产品决策问题
3. /sop-init                     → 模板配置 + 品牌清理 + 支付，项目可 pnpm dev
4. /sop-tool-page {P0 工具词}    → 生成精品工具页（每个关键词执行一次，先做 P0）
   ↳ 手动开发工具交互组件（翻译器/识别器等核心功能）
5. /sop-blog                     → 规划博客主题矩阵
   /sop-blog {slug}              → 逐篇写作（每篇执行一次）
6. /sop-launch                   → 上线前验证，PageSpeed 4 项 ≥ 90 后部署
7. /sop-refresh                  → 上线后定期执行，监测排名+内容更新
```

随时输入 `/sop` 查看当前进度和下一步指引。

## 需要手动的环节

| Phase | 手动工作 |
|-------|---------|
| 0 | 确认关键词优先级 |
| 1 | 回答 8 个产品决策问题 |
| 2 | 提供 Logo/Favicon 素材、支付 API Key |
| 3 | 开发工具交互组件（翻译器/识别器等核心功能） |
| 4 | 确认博客主题、审阅生成的文章 |
| 5 | pagespeed.web.dev 测试、修复性能、执行部署 |
| 6 | 从 Search Console 导出排名数据 |

## 命令清单

| 命令 | Phase | 作用 |
|------|-------|------|
| `/sop` | — | 查看进度，获取下一步指引 |
| `/sop-research {种子词}` | 0 | 关键词调研：竞对速写+拓词+评估+内链映射 |
| `/sop-align` | 1 | 产品方案对齐：8 个决策项逐一确认 |
| `/sop-init` | 2 | 项目初始化：模板配置+品牌清理+支付 |
| `/sop-tool-page {关键词}` | 3 | 创建精品工具页：统一 H 结构+SEO 内容 |
| `/sop-blog` | 4 | 博客主题规划（无参数）或逐篇写作（带 slug） |
| `/sop-launch` | 5 | 上线前验证：内链+Schema+Sitemap+PageSpeed |
| `/sop-refresh` | 6 | 内容更新分析：排名监测+更新建议 |

## 数据目录

`.claude/sop-data/` 存放本项目的 Phase 输出数据：

| 文件 | 产出 Phase | 用途 |
|------|-----------|------|
| `progress.md` | 全局 | 各 Phase 完成状态 |
| `keyword-matrix.md` | Phase 0 | 工具词+博客词+优先级 |
| `internal-links.md` | Phase 0 | 页面间内链映射 |
| `competitor-sketch.md` | Phase 0 | 竞对产品速写+话题清单 |
| `product-brief.md` | Phase 1 | 8 个产品决策的结论 |
| `launch-report.md` | Phase 5 | 上线前验证报告 |

## 规则（始终生效）

`.claude/rules/` 中的规则在所有操作中自动遵守：
- `seo-redlines.md` — 新站 SEO 红线
- `content-quality.md` — 内容质量标准 + CTA 规则
- `tool-page-structure.md` — 精品工具页 H 层级规范
- `internal-links.md` — 内链数量/位置/锚文本规则
- `brand-cleanup.md` — 品牌清理检查清单

---

## Git 操作规范

### 提交规则

**核心纪律：SOP 通用改进和业务代码必须在不同的 commit 中。**

```bash
# SOP 通用改进（可 cherry-pick 回 starter）单独提交
# 仅包含 skills、rules 等可跨项目复用的改动
git add .claude/skills/ .claude/rules/ .claude/GUIDE.md .claude/sop-keyword-to-launch.md
git commit -m "chore(SOP): {具体改了什么}"

# 业务代码 + 项目数据单独提交
# 包含 sop-data（本项目专属数据）和所有 src/ 改动
git add .claude/sop-data/ src/ content/ public/ .env* package.json
git commit -m "feat(xxx): {功能描述}"
```

分类标准：
- `.claude/skills/`、`.claude/rules/`、`.claude/GUIDE.md`、`.claude/sop-keyword-to-launch.md` → **SOP 通用**（跨项目复用）
- `.claude/sop-data/` → **项目数据**（关键词矩阵、竞对分析、产品方案，归入业务 commit）

原因：同步 SOP 改进回 starter 时使用 cherry-pick，独立提交才能保证只带走通用改进，不混入项目专属数据和业务代码。

### SOP 改进同步回 Starter

项目中优化了 SOP → 评估是否通用 → 是则同步回 starter：

```bash
# 在 starter 仓库操作
cd ../webdev-sop-starter
git checkout sop-updates

# 首次需要注册项目为远程源
git remote add {项目名} git@github.com:AlexAIDev1207/{项目名}.git

git fetch {项目名}
git log {项目名}/main --oneline -- .claude/    # 筛选 SOP 提交
git cherry-pick {hash}                          # 挑选需要的提交
git push origin sop-updates

# GitHub PR: sop-updates → main，审查后合并
git remote remove {项目名}
```

### ShipAny 模板更新同步到 Starter

```bash
cd webdev-sop-starter
git checkout main
git fetch upstream
git merge upstream/main    # .claude/ 不会冲突
pnpm build
git push origin main
```

### 老项目获取最新 SOP

```bash
# 在老项目中（首次需要 git remote add starter {starter-url}）
git fetch starter
git checkout starter/main -- .claude/rules/ .claude/skills/ .claude/sop-keyword-to-launch.md
# 不要 checkout .claude/sop-data/（项目特有数据）
git commit -m "chore(SOP): 从 starter 同步最新 SOP"
```
