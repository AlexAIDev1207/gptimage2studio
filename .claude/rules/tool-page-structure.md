# 精品工具页结构规范

> 来源：.claude/sop-keyword-to-launch.md Phase 3「整页统一设计」
> 始终生效：创建或修改工具页时自动遵守。

## 核心原则

一个工具关键词 = 一个精品页面。
三区域（工具区 + 结果展示 + SEO 落地页）共享同一套 H 层级。

### 首屏即工具

用户打开页面第一眼必须看到可交互的工具区域，不需要滚动即可开始使用。
- 工具区嵌入 Hero 区域内（替代或在 Hero 图片位置）
- 不要用大段文字、图片或 CTA 按钮占满首屏后把工具推到 below-the-fold
- 首屏的目标是让用户产生「输入试一下」的冲动

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

## 页面配图规则

每个工具页必须包含 3-5 张配图，分布在不同 section：

- 工具区/Hero：1 张产品界面截图或示意图
- How It Works / Examples：1-2 张步骤示意图或 Before/After 对比图
- Why Use / Use Cases：1 张场景插图
- CTA 区域（可选）：1 张背景图

配图要求：
- 文件名含关键词（如 `linkedin-speak-translator-demo.png`）
- alt 文本描述性且含关键词
- 压缩至 < 100KB
- 优先使用产品截图 > 自制信息图 > Unsplash/Pexels 素材

## 登录状态差异化

- SSR 始终渲染完整 HTML（包含所有 H 标签和 SEO 内容）
- 已登录：客户端折叠 SEO 区域（aria-expanded 控制，保留在 DOM 中）
- SEO 内容必须在 HTML 源码中（不能 JS 动态加载）

## 路由决策

- 需要可交互工具 → Code-based Route: `src/app/[locale]/(landing)/{tool}/page.tsx`
- 纯 SEO 落地页 → shipany-page-builder: JSON 动态页面
- 需要数据库存储 → Code-based Route + API 路由
