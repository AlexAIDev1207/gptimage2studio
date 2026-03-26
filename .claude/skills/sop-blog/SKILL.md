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
   - ≥ 1200 字，关键词密度 3-5%
   - 首 50 字回答核心问题
   - 句长 ≤ 20 字，段落 ≤ 5 行
3. 内链：按映射表，首段/中段/末段各 1 条
4. CTA 植入：按 product-brief.md 的 CTA 风格和 content-quality.md 的 CTA 矩阵

### MDX frontmatter 规范

```yaml
---
title: {SEO 标题，≤60 字符，含核心词}
description: {SEO 描述，≤160 字符，含核心词}
created_at: {YYYY-MM-DD}
image: {封面图 URL，Unsplash 或本地路径}
tags: ["tag1", "tag2", "tag3"]
---
```

**⚠️ 不要包含以下字段（会导致页面显示丑陋的作者栏）：**
- ❌ `author_name` — 移除，不需要显示作者名
- ❌ `author_image` — 移除，不需要显示作者头像/Logo

### 正文配图格式

由于 ShipAny 的 Remark Image 插件不支持远程 Markdown 图片语法，**正文配图必须使用 HTML `<img>` 标签**：

```html
<!-- ✅ 正确：HTML img 标签，可使用远程 URL -->
<img src="https://images.unsplash.com/photo-xxx?w=800&h=450&fit=crop" alt="描述含关键词" width="800" height="450" />

<!-- ❌ 错误：Markdown 语法 + 远程 URL，构建会报错 -->
![alt](https://images.unsplash.com/photo-xxx)
```

封面图在 frontmatter `image` 字段中使用远程 URL 是安全的（不经过 Remark 处理）。
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

## 模式 C: Browser MCP 视觉检查（全部博客写完后必做）

使用 Browser MCP 访问开发服务器，逐页检查博客并修复问题：

### 博客列表页检查（/blog）
- [ ] 所有博客卡片正常显示（封面图+标题+描述+日期）
- [ ] 封面图加载正常（非蓝色占位块、非破碎图标）
- [ ] 无 author 头像/名称显示（确认 frontmatter 无 author_name/author_image）
- [ ] 卡片点击可跳转到博客详情页

### 博客详情页检查（每篇抽检）
- [ ] H1 标题正常显示
- [ ] 正文配图加载正常（2-4 张，非占位块）
- [ ] 正文排版无异常（无多余的作者栏、无破碎布局）
- [ ] 内链可点击且跳转正确（工具页链接→首页，博客链接→对应博客）
- [ ] Related Articles 区域正常显示
- [ ] Table of Contents（左侧目录）正常显示

### 导航和全局检查
- [ ] Header 导航：博客页可通过导航访问
- [ ] Footer：博客链接存在且可跳转
- [ ] 面包屑导航正常（Blog → 文章标题）
- [ ] 深色模式下博客页面对比度正常
- [ ] 移动端博客列表和详情页排版正常

发现的问题分类：
- **阻塞问题**：立即修复（链接 404、图片不加载、布局破碎）
- **视觉优化**：记录并修复（间距不合理、字体不协调）

**⏸ 用户验收点：展示检查结果，等待用户确认后才标记 Phase 4 完成。**

## 进度管理

- 规划完成后更新 progress.md Phase 4 为"🔄 规划完成，待写作"
- 每篇写完后记录已完成篇数
- 视觉检查通过后标记为 ✅
