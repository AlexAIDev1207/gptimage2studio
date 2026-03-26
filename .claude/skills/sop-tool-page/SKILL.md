---
name: sop-tool-page
description: 执行 SOP Phase 3 创建精品工具页。输入工具关键词，统一设计 H 层级 + 生成 SEO 内容 + 创建路由。当用户说"创建工具页"、"做落地页"、"精品页面"、"tool page"时触发。
---

# SOP Phase 3: 精品工具页

## 前置条件

检查 `.claude/sop-data/progress.md`，确认 Phase 2 已完成（✅）。

## 输入

- `$ARGUMENTS`: 工具关键词（如 "linkedin speak translator"）
- `.claude/sop-data/keyword-matrix.md`（确认该词在工具词列表中）
- `.claude/sop-data/internal-links.md`（内链规则）
- `.claude/sop-data/product-brief.md`（差异化策略 + 工具方案 + 转化路径）
- `.claude/sop-data/competitor-sketch.md`（竞对 UX 交互亮点，作为设计参考）

## 执行流程

**⚠️ 核心原则：设计先行，用户确认后才开发。**

严格遵守 `.claude/rules/tool-page-structure.md` 的 H 层级规范。
严格遵守 `.claude/rules/content-quality.md` 的内容质量标准。

### Step 3.1: 页面设计（用户 review 确认后才进入 3.2）

参考 `competitor-sketch.md` 的竞对 UX 交互亮点和 `product-brief.md` 的差异化策略，输出完整的页面设计方案。

可使用 `ui-ux-pro-max` 和 `frontend-design` skill 辅助设计。

设计文档需包含：

1. **H 树结构**：完整的 H1→H2→H3 层级（符合 tool-page-structure 规范）
2. **区域布局**：每个区域（工具区/SEO 内容区）的位置、大小、排列方式
3. **工具交互设计**：
   - 输入→输出的完整交互流程
   - UI 组件选型（输入框/输出框/按钮/选择器的具体形式）
   - 功能选项设计（翻译方向切换、风格选择、语言选择）
   - 结果操作（复制/分享/重试）
   - 错误处理和边界情况
   - 限次引导 UI
4. **视觉风格**：色彩、间距、动画、响应式断点
5. **竞对参考**：标注哪些设计借鉴了竞对亮点、哪些是差异化

**⏸ 用户确认点：展示设计方案，等待用户 review 确认后才继续。**

### Step 3.2: SEO 内容生成

基于确认的设计方案，生成 SEO 内容：

- Title（≤60 字符，含主关键词）
- Description（≤160 字符，含主关键词）
- 各 Section 文案（How It Works / Why Use / Use Cases / FAQ）
- 总字数 ≥1200 字
- 关键词密度 3-5%
- 关键词首次出现 ≤100 字内
- JSON-LD Schema（WebApplication + FAQPage + BreadcrumbList）
- 内链 ≥3 条（按 internal-links.md 规则）

可启动 `content-writer` subagent 或使用 `seo-page` skill。

### Step 3.3: 开发

按确认的设计方案创建页面：

1. **路由创建**：`src/app/[locale]/(landing)/{tool}/page.tsx`（Code-based Route）
2. **工具交互组件**：
   - 封装为 `'use client'` 客户端组件
   - 包含状态管理（加载/成功/错误/空状态/限次）
   - 包含无障碍支持
   - OpenAI API 对接
   - 限次逻辑（游客 localStorage / 登录用户服务端）
3. **SEO 内容区**：SSR 渲染完整 HTML（不能 JS 动态加载）
4. **Schema 嵌入**：JSON-LD 在 head 中

### Step 3.4: 自动 SEO 校验

开发完成后，自动执行以下校验并输出报告：

```
TDH 三要素（最高优先级，缺任何一项不能上线）：
  [ ] Title ≤60 字符，必须含完整核心词 "linkedin speak translator"
  [ ] Description ≤160 字符，必须含完整核心词
  [ ] H1 唯一，必须含完整核心词（不能只含部分如 "linkedin speak"）

SEO 内容校验：
  [ ] H2/H3 严格递进不跳级（无跳级，如 H1→H3）
  [ ] 关键词密度 3-5%（"linkedin speak translator" 及变体）
  [ ] 关键词首次出现 ≤100 字内
  [ ] SEO 内容总字数 ≥1200 字
  [ ] 内链 ≥3 条（工具页链博客、博客链工具页）

技术 SEO 校验：
  [ ] JSON-LD Schema 包含 WebApplication + FAQPage + BreadcrumbList
  [ ] OG image + OG description 已设置
  [ ] SSR 渲染验证（HTML 源码中包含 SEO 内容，非客户端渲染）
  [ ] 移动端响应式（工具区和 SEO 内容区在手机上正常显示）
```

校验方式：读取生成的页面文件，逐项检查并输出通过/不通过报告。

## 输出

- 页面设计文档（Step 3.1，用户确认后归档）
- 页面路由文件 + 组件代码
- SEO 内容（嵌入页面）
- Schema 配置
- SEO 校验报告（全部通过才算完成）

完成后：
- 更新 `.claude/sop-data/internal-links.md` 的页面级映射表（填充该工具页的内链）
- 更新 `.claude/sop-data/progress.md` Phase 3 状态

注：Phase 3 可多次执行（每个工具关键词一次），状态标记为"🔄 进行中 (N/M)"。
