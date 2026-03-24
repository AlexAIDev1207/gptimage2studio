# 内链映射：{项目名}

## 映射表

| 源页面 | 链出目标 | 锚文本类型 | 链接位置 |
|--------|---------|-----------|---------|
| / (首页) | /tool-a, /tool-b | 导航链接 | Header + Hero |
| /tool-a | blog-x, blog-y | Related Articles | 页面底部 H2 |
| blog-x | /tool-a | 功能词锚文本 | 正文首段 |
| blog-x | blog-y | 问题词锚文本 | 正文中段 |

## 规则（来自 .claude/rules/internal-links.md）

- 每个工具页被 ≥ 2 篇博客内链
- 每篇博客内链 ≥ 1 个工具页 + ≥ 1 篇相关博客
- 工具页 Related Articles ≤ 5 篇
- 博客页 Related Articles ≤ 4 篇
