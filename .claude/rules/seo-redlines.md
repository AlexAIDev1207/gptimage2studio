# 新站 SEO 红线

> 来源：.claude/sop-keyword-to-launch.md「🚫 新站 SEO 红线」
> 始终生效：创建页面、发布内容、配置索引策略时自动遵守。

## 适用条件

网站上线后 6 个月内（DA < 10）。

## 页面数量

- ❌ 一次性发布 50+ 页面
- ❌ 每条用户输入生成独立索引页面
- ✅ 工具页按 P0 → P1 顺序逐步上线，首批 ≤ 5 个
- ✅ 聚合页面控制在 10-20 个以内

## 内容发布

- ❌ 一次性发布所有博客（谷歌判定 AI 垃圾内容）
- ❌ 为高竞争关键词创建大量相似页面
- ✅ 博客分批发布，模拟自然写作节奏
- ✅ 优先发布零/低竞争词内容
- ✅ 工作日（周二-周四）早 8-10 点发布

## UGC（用户生成内容）

- ❌ 用户生成页面参与索引
- ✅ 用户个人结果页：noindex, nofollow
- ✅ 只有白名单聚合页面才允许索引
- ✅ 聚合页面准入门槛：月搜索量 ≥ 10 + 可展示结果 ≥ 5 + SEO 文案 ≥ 300 字

## Schema 类型规范

- 首页：WebSite + Organization
- 工具页：WebApplication + FAQPage + BreadcrumbList
- 聚合页：CollectionPage + FAQPage
- 博客页：Article + BreadcrumbList
- About 页：Organization（详细版）
