# 精品工具页结构规范

> 来源：.claude/sop-keyword-to-launch.md Phase 3「整页统一设计」
> 始终生效：创建或修改工具页时自动遵守。

## 核心原则

一个工具关键词 = 一个精品页面。
三区域（工具区 + 结果展示 + SEO 落地页）共享同一套 H 层级。

## 统一 H 层级

```
H1: {主关键词标题}（唯一，整页只有一个）
│
├─ [工具区] ← 无独立 H 标签，嵌入 Hero 区域，用 <p> 描述价值主张
│
├─ H2: Popular Examples / Showcase ← 结果展示区
│
├─ H2: How It Works
│   ├─ H3: Step 1 / Step 2 / Step 3
│
├─ H2: Why Use {Tool Name}
│
├─ H2: Use Cases
│
├─ H2: FAQ
│   ├─ H3: 问题 1（覆盖长尾词）
│   ├─ H3: 问题 2 ...
│
├─ H2: Testimonials
│
├─ H2: Related Articles
│
└─ [CTA] ← 无独立 H 标签
```

## 登录状态差异化

- SSR 始终渲染完整 HTML（包含所有 H 标签和 SEO 内容）
- 已登录：客户端折叠 SEO 区域（aria-expanded 控制，保留在 DOM 中）
- SEO 内容必须在 HTML 源码中（不能 JS 动态加载）

## 路由决策

- 需要可交互工具 → Code-based Route: `src/app/[locale]/(landing)/{tool}/page.tsx`
- 纯 SEO 落地页 → shipany-page-builder: JSON 动态页面
- 需要数据库存储 → Code-based Route + API 路由
