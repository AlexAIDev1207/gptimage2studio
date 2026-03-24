# 内链规则

> 来源：.claude/sop-keyword-to-launch.md Phase 0.4
> 始终生效：创建页面、写博客、添加内链时自动遵守。

## 数量规则

- 每个工具页被 ≥ 2 篇博客内链
- 每篇博客内链 ≥ 1 个工具页 + ≥ 1 篇相关博客
- 首页链接到所有核心工具页
- Footer 包含重要页面链接
- 面包屑导航覆盖所有页面
- 工具页 Related Articles ≤ 5 篇
- 博客页 Related Articles ≤ 4 篇

## 位置规则

- 第 1 条内链：引入段（前 300 字），自然提及工具页
- 第 2-3 条内链：分散在中段和末段
- Related Articles：独立 H2 段落，在 Conclusion 之后

## 锚文本规则

工具页链接锚文本：
- ✅ 功能词："Free LinkedIn Translator Tool"
- ✅ 品牌词："Try SongFromLink"
- ❌ 通用词："Click here"

博客链接锚文本：
- ✅ 问题词："How to find songs from TikTok"
- ✅ 对比词："LinkedIn Translator Alternatives"
- ❌ 通用词："Learn more"

## 执行方式

所有内链按 `.claude/sop-data/internal-links.md` 映射表执行。
创建新页面或博客时，先查阅映射表确认链出目标。
