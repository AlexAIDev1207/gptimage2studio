---
name: sop-blog
description: 执行 SOP Phase 4 博客内容体系。无参数时规划主题矩阵，带 slug 参数时逐篇写作。当用户说"写博客"、"博客规划"、"blog"、"写文章"时触发。
---

# SOP Phase 4: 博客内容体系

## 前置条件

检查 `.claude/sop-data/progress.md`，确认 Phase 0 已完成（✅）。

## 输入

- `$ARGUMENTS`: 为空时进入规划模式，传入 slug 时进入写作模式
- `.claude/sop-data/keyword-matrix.md`（博客关键词列表）
- `.claude/sop-data/internal-links.md`（内链映射）
- `.claude/sop-data/competitor-sketch.md`（竞对话题清单，附录部分）
- `.claude/sop-data/product-brief.md`（目标用户 + 博客 CTA 风格）

## 模式 A: 主题规划（`/sop-blog`，无参数）

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 4 Step 4.1** 章节。

1. 读取博客关键词列表（已含优先级）
2. 读取竞对话题清单（来自 Phase 0，直接使用不重复爬取）
3. 如需竞对深度分析（H 结构、字数），启动 `seo-researcher` subagent
4. 规划 10-15 篇文章，覆盖 7 种内容类型：
   - How-to 教程 / 对比评测 / 技巧列表 / 问题解答
   - 跨领域创意 / 产品故事 / 趋势洞察
5. 输出博客主题清单 → 等待用户确认

## 模式 B: 逐篇写作（`/sop-blog {slug}`）

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 4 Step 4.2** 章节。
严格遵守 `.claude/rules/content-quality.md` 的所有标准。

可启动 `content-writer` subagent 执行：

1. TD + H 层级设计 → 用户确认
2. 正文写作：
   - ≥ 1200 字，关键词密度 1-2%
   - 首 50 字回答核心问题
   - 句长 ≤ 20 字，段落 ≤ 5 行
3. 内链：按映射表，首段/中段/末段各 1 条
4. CTA 植入：按 product-brief.md 的 CTA 风格和 content-quality.md 的 CTA 矩阵
5. 配图（必须）：
   - **封面图**（1 张）：写入 frontmatter `image` 字段，显示在博客列表卡片上
     - 尺寸建议 1200×630（OG 比例）
     - 文件路径：`/imgs/blog/{slug}/cover.png`
   - **正文配图**（2-4 张）：用 Markdown `![alt](src)` 插入正文中
     - 分布在不同 section（开头/中段/末段）
     - 优先级：产品截图 > 自制信息图 > Unsplash/Pexels 素材
   - 所有图片要求：文件名含关键词，alt 描述性且含关键词，压缩至 < 100KB

输出：
- `content/posts/{slug}.mdx`（含 frontmatter image 封面图）
- `public/imgs/blog/{slug}/`（1 张封面 + 2-4 张正文配图）

## 进度管理

- 规划完成后更新 progress.md Phase 4 为"🔄 规划完成，待写作"
- 每篇写完后记录已完成篇数
- 全部写完后标记为 ✅
