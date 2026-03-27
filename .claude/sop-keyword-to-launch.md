# SOP：从关键词到网站上线

> 基于 linkedintranslator 和 songfromlink 两个项目的实战经验提炼，适用于基于 ShipAny Two 模板的工具站建设。

---

## 全局流程概览

```
输入：一个种子关键词（如 "LinkedIn Translator"）
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  Pre-flight: 账号准备                                        │
│  第三方平台注册 + 凭证获取（与 Phase 0 并行）                   │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 0: 关键词调研与分类                                    │
│  种子词 → 竞对速写 → 拓词 → 评估 → 分类为工具词 + 博客词       │
│  ⭐ 建议新建 Skill: keyword-research                         │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: 产品方案对齐                                       │
│  目标用户 → 差异化 → 工具方案 → 变现模型 → MVP 范围            │
│  🤝 通过 AskUserQuestion 与用户逐项对齐                       │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 2: 项目初始化                                         │
│  ShipAny 模板 → 品牌定制 → 基础 SEO                          │
│  ⚙️ Skill: shipany-quick-start                              │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
          ┌─────────────┴──────────────┐
          ↓                            ↓
┌──────────────────────┐   ┌──────────────────────┐
│ Phase 3: 精品工具页   │   │ Phase 4: 博客内容体系 │
│ 工具词 → 精品页面     │   │ 博客词 → 内容矩阵    │
│ ⚙️ seo-page + 手动   │   │ ⚙️ seo-blog-page     │
└──────────┬───────────┘   └──────────┬───────────┘
           └─────────────┬────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 5: 全站验证 + 性能优化 + 上线                           │
│  全站交叉验证 → PageSpeed ≥ 90 → 部署 → 监测                  │
│  ⭐ 建议新建 Skill: launch-checklist                         │
└───────────────────────┬─────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 6: 持续运营                                           │
│  统一发布节奏 → 排名监测 → 聚合页扩展 → 外链建设              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚫 新站 SEO 红线（全局约束，所有 Phase 通用）

### 聚合页面定义

```
聚合页面 = 围绕一个有搜索量的标签，策展相关的用户生成结果 + SEO 文案 + 工具入口

与工具页的区别：
  - 工具页：Phase 0 规划的关键词，上线前创建，SEO 文案为主
  - 聚合页：运营中发现有搜索量的标签，上线后有足够 UGC 数据后创建，策展结果为主

页面结构（本质是精品工具页的一种）：
  ┌────────────────────────────────┐
  │ H1: 包含标签关键词的标题        │
  │ [工具入口] ← 可直接使用         │
  │ SEO 文案（≥ 300 字）           │
  │ 策展的用户结果列表（≥ 5 条）    │
  │ FAQ + 内链                     │
  └────────────────────────────────┘

Schema 类型：CollectionPage + FAQPage（注意：聚合页用 CollectionPage，工具页用 WebApplication）

示例：
  linkedintranslator:
    /examples/linkedin-congratulations → 策展"恭喜新工作"类翻译结果
    /examples/linkedin-job-announcement → 策展"入职公告"类翻译结果
  songfromlink:
    /discover/tiktok-trending-songs → 策展 TikTok 热门识别结果
    /discover/instagram-reel-songs → 策展 Instagram Reels 识别结果
```

### 为什么需要这些红线？（Google 沙箱效应）

```
新站在上线后 3-6 个月内，即使 SEO 完美也难以在竞争词排名前 10。
这不是惩罚，而是 Google 对新域名的保护机制（防止垃圾站批量注册刷排名）。

因此新站策略的核心：
  1. 前 3 个月：集中做零/低竞争词，快速占领
  2. 利用这些排名获得初始流量和权重积累（DA ↑）
  3. DA > 10 后，才适合挑战中/高竞争词

违反红线的后果：
  - 一次发布 50+ 页 → Google 判定为"内容农场" → 沙箱延长
  - 大量 UGC 页面索引 → 低质内容信号 → 整站信任度下降
  - 激进外链 → 过度优化信号 → 可能被 Google 惩罚
```

### 约束规则

```
以下规则适用于网站上线后 6 个月内（DA < 10）：

页面数量：
  ❌ 一次性发布 50+ 页面
  ❌ 每条用户输入生成独立索引页面
  ✅ 工具页按 P0 → P1 顺序逐步上线，首批 ≤ 5 个
  ✅ 聚合页面控制在 10-20 个以内

内容发布：
  ❌ 一次性发布所有博客（谷歌会判为 AI 垃圾内容）
  ❌ 为高竞争关键词创建大量相似页面
  ✅ 博客分批发布，模拟自然写作节奏
  ✅ 优先发布零/低竞争词内容

UGC（用户生成内容）：
  ❌ 用户生成页面参与索引（noindex, nofollow）
  ✅ 只有白名单聚合页面才允许索引
  ✅ 聚合页面准入门槛：月搜索量 ≥ 10 + 可展示结果 ≥ 5 + SEO 文案 ≥ 300 字

外链建设（上线即可开始，力度随权重递增）：
  上线即做：目录站提交、Product Hunt、社交媒体、论坛回答
  Month 2+：行业博客互链、资源页收录申请
  DA > 10 后：guest post、媒体合作等规模化外链

半年后（DA > 10）可逐步放开：
  → 扩展 P2 高竞争关键词
  → 增加聚合页面数量
  → 规模化外链投放
```

---

## Pre-flight: 账号准备（与 Phase 0 并行）

> **经验教训**：linkedinspeaktranslator 项目中，Stripe 激活和 API Key 配置被推迟到上线后才做，导致核心功能无法验证。
> 这些账号注册不依赖关键词调研结果，应在 Phase 0 期间并行完成。

### 目标

提前注册所有第三方平台账号并获取凭证，避免后续 Phase 因等待账号审核而阻塞。

### 账号注册清单

```
以下账号在 Phase 0 调研期间并行注册（总计约 1 小时）：

先通过 2 个问题判断需要哪些账号：
  1. 工具是否依赖 AI/LLM API？→ 是：注册对应 API 服务
  2. 是否需要付费功能？→ 是：注册 Stripe（⚠️ 激活审核需 1-3 天，确认后立即提交）

必须（所有项目）：
  □ 域名注册（Namecheap / Cloudflare / 其他）
  □ 部署平台（Vercel / Cloudflare Pages）→ 连接 GitHub 仓库

按需（取决于上面的回答）：
  □ 数据库服务 — 如需用户系统/数据存储 → Supabase / PlanetScale
  □ LLM API — 如工具依赖 AI → OpenAI / OpenRouter
  □ 支付平台 — 如需付费 → Stripe（⚠️ 激活审核需 1-3 天，确认需要后立即提交）
  □ OAuth / 邮件 / 分析 — Phase 2 再配置即可，不阻塞

特别提醒：
  ⚠️ Stripe 商户激活需要填写商业信息、银行账户，审核周期不可控
  ⚠️ 如已有其他项目的 Stripe 账号，新项目仍需单独激活（Hobby 账号不支持协作者）
  ⚠️ 不需要的服务不要注册，避免增加管理成本
```

### 凭证保管

```
获取凭证后的处理方式：
  1. 将所有凭证记录到本地 .env.development（不提交到 Git）
  2. 生产凭证记录到密码管理器（1Password / Bitwarden），Phase 5 部署时填入部署平台
  3. 运行 openssl rand -base64 32 生成 AUTH_SECRET

⚠️ 安全红线：
  ❌ 绝不将 .env.development（含真实密钥）提交到 Git
  ❌ 绝不在代码中硬编码任何密钥
  ✅ .gitignore 必须包含 .env*（除 .env.example）
  ✅ .env.example 只包含变量名和注释，不含真实值
```

---

## Phase 0: 关键词调研与分类

### 目标

输出 3 份文档，作为后续所有 Phase 的唯一策略输入。竞对分析不是独立输出，而是服务于这 3 份文档的手段。

```
输出文档 ①: 关键词矩阵（工具词 + 博客词 + 优先级）
  → Phase 3 消费工具词，逐个创建精品工具页
  → Phase 4 消费博客词，规划博客主题和写作顺序
  → Phase 6 按优先级控制发布节奏（P0 先行 → P1 跟进 → P2 半年后）

输出文档 ②: 内链映射表
  → Phase 3 每个工具页的 Related Articles 按映射表链接博客
  → Phase 4 每篇博客按映射表链接工具页和其他博客
  → Phase 5 全站验证时检查映射表的执行完整性

输出文档 ③: 竞对产品速写
  → Phase 1 参考竞对产品形态，对齐差异化策略和工具方案
  → Phase 3 参考竞对首页 Section 结构，设计落地页布局
```

### 输入
- 种子关键词（英文），如 `LinkedIn Translator`
- 目标市场/语言

### 步骤

#### Step 0.1: 竞对产品速写

> 不是全面的竞对分析报告，只提取对建站决策有直接影响的信息。
> 博客深度分析（H 结构、字数等）留给 Phase 4 的 seo-blog-page Skill。
> 技术 SEO 基准（页面速度、Sitemap 等）留给 Phase 5 自行检测。

**工具**：Google 搜索 + WebSearch

```
操作：
1. 搜索种子词，记录前 10 名的网站（竞对列表，取 3-5 个主要竞对）
2. 对每个竞对快速扫描两个维度：

   a) 产品形态（→ 喂给输出文档 ③，支撑 Phase 1 产品方案对齐）
      - 工具交互形式：页面内嵌入 / 跳转新页面 / 需要注册
      - 功能范围：核心功能 + 附加功能
      - 定价策略：免费 / Freemium / 付费

   b) 首页结构（→ 喂给输出文档 ③，支撑 Phase 3 落地页设计）
      - 有哪些 Section（Hero / How It Works / FAQ / Testimonials 等）
      - 是否有工具直接嵌入首页
      - 大致内容量（少于 500 字 / 500-1000 / 1000+）

3. 扫描竞对覆盖的话题（→ 喂给 Step 0.2 补充关键词 + 喂给 Phase 4 博客规划）
   - 快速浏览竞对博客列表页，记录文章标题和话题分类
   - 记录竞对有但我们种子词未覆盖的话题方向
   - 统计竞对博客总数和大致更新频率（不需要深入分析内容结构）
   - 输出「竞对话题清单」作为文档③的附录，供 Phase 4 直接使用（避免重复爬取）

4. 识别新站排名机会
   - SERP 前 10 中是否有新站/小站/论坛帖排名
   - 有 → 该词标记为低竞争，优先攻

输出：输出文档 ③（竞对产品速写）
```

#### Step 0.2: 种子词拓展

**工具**：Google 搜索建议 + People Also Ask + Google Trends

```
操作：
1. 在 Google 搜索栏输入种子词，记录自动补全建议（10-20 个）
2. 搜索种子词，记录 "People Also Ask" 中的问题（5-10 个）
3. 搜索种子词，翻到底部记录 "Related Searches"（8 个）
4. 对前 3 个高潜力变体词重复步骤 1-3
5. 在 Google Trends 中输入种子词，查看"相关查询"中的热门和上升词
6. 补充竞对覆盖但我们未拓展到的关键词（来自 Step 0.1 第 3 点）

输出：原始关键词列表（50-100 个）
```

#### Step 0.3: 评估与分类

**工具**：Google Trends + 手动 SERP 分析

```
对每个关键词评估三个维度：

1. 搜索热度（Google Trends）：
   - 将关键词分组（最多 5 个一组）输入 Trends 对比相对热度
   - 关注趋势方向：上升 ↑ / 稳定 → / 下降 ↓
   - 注意地域差异：按目标市场筛选国家/地区
   - 热度评级：高（持续有量）/ 中（季节性或波动）/ 低（几乎无量）

2. 竞争度（手动 SERP 分析）：
   - 搜索该关键词，观察前 10 结果
   - 低竞争：有新站/小站/论坛帖排名，或结果质量明显低
   - 中竞争：前 10 全是正规站但非大品牌
   - 高竞争：前 10 全是高权重站（Wikipedia、大品牌等）

3. 搜索意图：
   - 工具意图（用户想用工具做某事）→ 标记为 [TOOL]
   - 信息意图（用户想了解某个知识）→ 标记为 [BLOG]
   - 导航意图（用户找特定品牌/网站）→ 标记为 [SKIP]
   - 商业意图（用户在比较/准备购买）→ 标记为 [TOOL] 或 [BLOG]

然后按统一优先级排序：
  P0 — 低竞争 + 有搜索量 + 意图明确 + 竞对未覆盖（新站首攻）
  P1 — 中竞争 + 中搜索量 + 有差异化空间
  P2 — 高竞争 + 高搜索量（半年后再做）

分类为两大类：
  工具关键词：包含动词（translate, find, generate）或 "tool/online/free"
  博客关键词：包含疑问词（how to, what is, why）或对比词（vs, alternative）

输出：输出文档 ①（关键词矩阵）
```

#### Step 0.4: 内链映射

```
基于输出文档 ① 中的工具页和博客主题，规划页面间的链接关系：

规则：
  1. 每个工具页被 ≥ 2 篇博客内链
  2. 每篇博客内链 ≥ 1 个工具页 + ≥ 1 篇相关博客
  3. 首页链接到所有核心工具页
  4. Footer 包含重要页面链接
  5. 面包屑导航覆盖所有页面

输出：输出文档 ②（内链映射表）
```

### 输出产物模板

#### 输出文档 ①: 关键词矩阵

```markdown
# 关键词矩阵：{项目名}

## 核心指标
- 种子词：xxx
- 总拓展词数：xx 个（工具词 xx | 博客词 xx）

## 工具关键词（按优先级）
| 优先级 | 关键词 | 搜索热度 | 竞争度 | 对应页面路径 |
|--------|--------|---------|--------|------------|

## 博客关键词（按优先级）
| 优先级 | 关键词 | 搜索热度 | 竞争度 | 对应博客 slug |
|--------|--------|---------|--------|-------------|
```

> **消费方**：Phase 3 读取工具词创建精品页 → Phase 4 读取博客词规划内容 → Phase 6 按 P0/P1/P2 控制节奏

#### 输出文档 ②: 内链映射表

```markdown
# 内链映射：{项目名}

| 源页面 | 链出目标 | 链接类型 |
|--------|---------|---------|
| / (首页) | /tool-a, /tool-b | 导航链接 |
| /tool-a | blog-x, blog-y | Related Articles |
| blog-x | /tool-a, blog-y | 正文内链 |
```

> **消费方**：Phase 3 seo-page 按表填 Related Articles → Phase 4 seo-blog-page 按表插入内链 → Phase 5 逐行验证执行完整性

#### 输出文档 ③: 竞对产品速写

```markdown
# 竞对产品速写：{项目名}

## 竞对列表
| 竞对 | URL | 工具形式 | 定价 | 首页 Section 数 | 内容量 |
|------|-----|---------|------|----------------|-------|

## 产品设计参考
- 交互形式共性：xxx
- 定价策略共性：xxx
- 我们的差异化机会：xxx

## 首页结构参考
- 竞对普遍有的 Section：xxx
- 竞对普遍缺的 Section：xxx（我们的差异化机会）
```

> **消费方**：Phase 1 读取产品设计参考对齐差异化和工具方案 → Phase 3 读取首页结构参考设计落地页 Section 组合

### ⚙️ 自动化可能性
> **建议新建 Skill: `keyword-research`**
> - 自动化：Google 搜索建议抓取、People Also Ask 提取、竞对首页结构扫描（WebSearch）
> - 人工：最终优先级确认、业务判断、竞对产品形态评估
> - 输出：3 份标准化 Markdown 文件

---

## Phase 1: 产品方案对齐

### 目标

在动手建项目之前，通过 AskUserQuestion 与用户逐项对齐产品需求，输出 `product_brief.md`。
这是唯一需要大量用户输入的 Phase，后续 Phase 可基于此文档自主执行。

### 输入
- Phase 0 输出文档 ③（竞对产品速写）
- Phase 0 输出文档 ①（关键词矩阵，了解目标关键词）

### 需要和用户对齐的内容

#### 1. 目标用户

```
🤝 AskUserQuestion:
  - 核心用户是谁？（职业、场景、痛点）
  - 用户目前怎么解决这个问题？（现有替代方案）
  - 用户对工具的核心期望是什么？（快/准/免费/一站式）

输出示例：
  目标用户：LinkedIn 求职者和职场人，苦于读不懂 LinkedIn 上的"黑话"
  现有替代方案：手动 Google 搜、问朋友、ChatGPT
  核心期望：粘贴即翻译，秒出结果，免费可用

→ 影响：Phase 3 落地页文案风格、Phase 4 博客选题角度
```

#### 2. 差异化策略

```
🤝 AskUserQuestion（基于 Phase 0 文档③竞对速写）：
  - 竞对产品的主要弱点是什么？（我们可以做得更好的地方）
  - 我们的独特卖点是什么？（竞对没有的功能/体验）
  - 在精品工具页上，哪些方面需要和竞对拉开差距？

输出示例：
  竞对弱点：需要注册才能使用、结果不够准确、无多语言支持
  我们的独特卖点：无需注册即可体验、工具直接嵌入页面、支持多种翻译风格
  差异化重点：首页工具可直接使用（非 CTA 按钮跳转）

→ 影响：Phase 3 工具页设计（嵌入 vs 跳转）、落地页 Why Section 文案
```

#### 3. 工具交互方案

```
🤝 AskUserQuestion:
  - 工具的核心流程是什么？（用户输入什么 → 得到什么）
  - 处理方式：同步即时返回 or 异步队列轮询？
  - 需要依赖哪些第三方服务？（AI API、外部数据源等）

输出示例（linkedintranslator）：
  核心流程：粘贴 LinkedIn 文本 → 选择翻译风格 → 得到"人话"翻译
  处理方式：同步（OpenRouter API 直接返回）
  第三方依赖：OpenRouter（AI 翻译）

输出示例（songfromlink）：
  核心流程：粘贴视频链接 → 后台提取音频 → 识别歌曲 → 返回歌曲信息
  处理方式：异步（BullMQ 队列 + 前端 2s 轮询）
  第三方依赖：yt-dlp（音频提取）、AudD（歌曲识别）、Spotify API（补充链接）

→ 影响：Phase 2 项目初始化时选择技术栈、Phase 3 工具组件开发
```

#### 4. 变现模型

```
🤝 AskUserQuestion:
  - 免费用户可以用多少次？（每天/每月限制）
  - Pro 用户额外解锁什么功能？
  - 定价方案：订阅制 / 积分包 / 一次性付费？
  - 价格区间？

输出示例：
  免费：每天 5 次翻译，基础风格
  Pro：无限次，解锁全部风格 + 批量翻译 + 导出
  定价：$9.99/月 或 $79.99/年

→ 影响：Phase 3 工具组件的门控逻辑、落地页 Pricing Section
```

#### 5. MVP 范围

```
🤝 AskUserQuestion:
  - v1 必须做的功能是什么？（最小可行产品）
  - v1 明确不做的功能是什么？（避免 linkedintranslator 的功能冗余问题）
  - 是否需要用户系统（注册/登录）？支付系统？

输出示例：
  v1 必须做：翻译核心功能 + 首页落地页 + 3 篇博客
  v1 不做：批量翻译、API 接口、Chrome 插件
  用户系统：需要（Free/Pro 区分）
  支付系统：需要（Stripe）

→ 影响：Phase 2 模板配置（启用/禁用哪些模块）、Phase 3 工具开发范围
```

#### 6. 部署与技术方案

```
🤝 AskUserQuestion（先决定部署方式，再反推数据库选择）：

  部署方式选择（决定后续技术栈）：
    A. Vercel（最简单，推荐快速上线）→ 数据库 = Supabase PostgreSQL
    B. Cloudflare Workers（边界计算，高性能）→ 数据库 = D1
    C. VPS Docker（完全控制）→ 数据库 = PostgreSQL 或 MySQL

  追问：
  - 是否需要队列系统？（异步工具需要）
  - 是否需要缓存层？（高频请求需要）

输出示例（songfromlink）：
  部署：VPS Docker + Cloudflare CDN → 数据库：Supabase（PostgreSQL）
  队列：BullMQ + Redis（Upstash）
  缓存：Redis 缓存识别结果（避免重复调用 AudD）

→ 影响：Phase 2 .env 配置（DATABASE_PROVIDER）、依赖安装、Docker 配置
```

##### 部署方案预验证（必做）

> **经验教训**：linkedinspeaktranslator 在 Phase 5 才发现 Cloudflare Pages 与 Next.js SSR 深度不兼容，
> 耗费 9 小时、12 个 commit 试错后被迫切换到 Vercel。应在此阶段提前验证。

```
确定部署方案后，立即执行一次空项目部署验证：

验证步骤（30 分钟内完成，不通过则换方案）：
  1. 用选定的 Next.js 版本 + 数据库驱动创建最小化项目
  2. 添加一个 SSR 页面 + 一个 API Route + 一个数据库查询
  3. 部署到选定平台，验证以下功能：
     □ SSR 页面正常渲染
     □ API Route 正常响应
     □ 数据库连接正常
     □ 中间件（middleware.ts）正常工作
     □ 图片优化（next/image）正常
  4. 不通过 → 立即切换到备选方案（Vercel 作为通用后备）

已知兼容性问题（避坑清单）：
  ⚠️ Cloudflare Pages + Next.js：middleware 限制、Node.js API 不完整、需 @opennextjs/cloudflare 适配
  ⚠️ Cloudflare D1 + Drizzle：部分 SQL 功能不支持、迁移工具链不稳定
  ⚠️ Next.js 降级（为适配平台）：可能引发依赖冲突、功能回退

推荐默认方案：
  Next.js SSR 项目 → Vercel + Supabase PostgreSQL（零配置，兼容性最好）
  静态站 / 轻 API → Cloudflare Pages + D1（成本低，边缘计算快）
  需要后台任务 → VPS Docker + Supabase（完全控制）
```

#### 7. 用户转化路径

```
🤝 AskUserQuestion:
  - 未登录用户"限次体验"如何实现？（cookie / localStorage / 服务端计数）
  - 限次用完后的引导策略？（弹窗注册 / 模糊结果 / 倒计时解锁）
  - 注册后是否有免费额度或邀请奖励？
  - 从博客到工具页的转化 CTA 是什么风格？（按钮 / 内文链接 / 嵌入式工具预览）

输出示例：
  限次实现：服务端计数（绑定 IP，每天 5 次）
  限次后引导：弹窗 + 模糊效果，展示"注册解锁"
  增长策略：注册送 10 次额度，邀请好友各得 5 次
  博客 CTA：How-to 文章中段放"Try Free"按钮，其他文章用内文链接

→ 影响：Phase 3 工具门控逻辑、Phase 4 博客 CTA 设计、Phase 6 转化监测
```

#### 8. 数据分析需求

```
🤝 AskUserQuestion:
  - 分析工具选型：GA4 / PostHog / 其他？
  - 需要追踪的关键事件：工具使用、CTA 点击、注册转化、付费转化
  - 是否需要从博客到工具页的转化路径追踪？

输出示例：
  分析工具：GA4
  关键事件：tool_use（工具使用）、cta_click（CTA 点击）、signup（注册）、purchase（付费）
  转化路径：blog_to_tool（博客→工具页停留 >10s）

→ 影响：Phase 2 分析工具集成、Phase 5 部署后配置、Phase 6 监测指标
```

### 输出产物

```markdown
# 产品方案：{项目名}

## 目标用户
- 核心用户：xxx
- 痛点：xxx
- 核心期望：xxx

## 差异化策略
- 竞对弱点：xxx
- 我们的独特卖点：xxx
- 精品工具页差异化重点：xxx

## 工具交互方案
- 核心流程：输入 → 处理 → 输出
- 处理方式：同步 / 异步
- 第三方依赖：xxx
- 前端交互：登录前/后差异化逻辑
- 状态管理：加载/成功/失败/重试

## 变现模型
- Free：xxx
- Pro：xxx
- 定价：xxx

## MVP 范围
- v1 做：xxx
- v1 不做：xxx
- 技术模块：用户系统 ✅/❌ | 支付系统 ✅/❌

## 部署与技术方案
- 部署方式：xxx → 数据库：xxx
- 队列/缓存：xxx
- API 端点列表：xxx

## 用户转化路径
- 限次方式：xxx
- 限次后引导：xxx
- 增长策略：xxx
- 博客 CTA 风格：xxx

## 数据分析
- 分析工具：xxx
- 关键事件：xxx
```

> **消费方**：
> - Phase 2 读取 MVP 范围和技术方案，配置模板、依赖和支付系统
> - Phase 3 读取工具方案、变现模型和转化路径，开发工具组件、门控和 CTA
> - Phase 3 读取差异化策略，写落地页 Why Section 和 Testimonials
> - Phase 4 读取目标用户和博客 CTA 风格，调整博客选题和转化设计
> - Phase 5 读取分析需求，配置 GA 事件追踪
> - Phase 6 读取转化路径，监测博客→工具转化率

---

## Phase 2: 项目初始化

### 目标
基于 ShipAny Two 模板，快速完成品牌定制和基础配置。

### 输入
- Phase 0 输出文档 ①（关键词矩阵，提取主关键词写 SEO metadata）
- Phase 1 输出（产品方案，提取项目名/域名/功能列表/主色调）

### 步骤

#### Step 2.1: 模板 Fork + 基础配置

```
⚙️ 使用 Skill: shipany-quick-start

输入项目描述（从 Phase 1 产品方案提取）：
  - projectName: 项目名
  - tagline: 一句话描述（包含主关键词）
  - description: 产品描述（100-200 字, 自然包含 3-5 个关键词）
  - primaryFeatures: 核心功能列表
  - domain / appUrl: 域名
  - primaryColor: 主色调

Skill 自动完成：
  ✅ .env 环境变量配置
  ✅ SEO metadata（Title/Description 包含主关键词）
  ✅ 首页内容框架
  ✅ 主题样式（颜色、Logo、Favicon）
  ✅ Sitemap 基础配置
  ✅ 法律页面（Privacy Policy, Terms of Service）
```

#### Step 2.2: 品牌清理

> **经验**：linkedintranslator 品牌清理分散多次提交，songfromlink 改进为一次性批量完成。

```
必须一次性完成的清理项：
  □ package.json: name, description, author, repository
  □ Footer: 移除模板品牌标识
  □ Admin Sidebar: 替换品牌名
  □ 所有页面中的模板占位文案
  □ 示例内容/示例图片替换
  □ 聊天功能（如不需要则隐藏路由）
  □ 根据 Phase 1 MVP 范围，禁用不需要的模板模块

验证：全局搜索 "ShipAny" / "shipany" 确保零残留
```

#### Step 2.3: 支付系统配置（仅当 Phase 1 MVP 标记"支付系统: 需要"时）

> shipany-quick-start v1 不配置支付，此步骤需手动完成。

```
1. 选择支付提供商（基于 Phase 1 部署方案）：
   - Stripe：全球覆盖，推荐首选
   - PayPal：补充方案（部分地区覆盖更好）
   - Creem：中文市场特化

2. 配置步骤：
   □ 在支付提供商控制台创建生产账号
   □ 获取 API Key / Secret Key
   □ 在 ShipAny admin panel → Settings → Payment 添加提供商
   □ 创建产品和定价（对应 Phase 1 变现模型）
   □ 配置 Webhook URL（用于支付通知回调）
   □ 测试支付流程（使用测试卡号）

注意：密钥存储在 .env.production 或 admin panel，不要硬编码在代码中。
```

#### Step 2.4: 环境变量完整性检查

> **经验教训**：linkedinspeaktranslator 上线后发现 DATABASE_URL、AUTH_SECRET、OPENAI_API_KEY 均未配置到生产环境，
> 导致数据库、认证、翻译功能全部不可用。应在初始化阶段就建立完整的变量清单。

```
检查流程：

1. 盘点本项目所有必需的环境变量（基于 Phase 1 产品方案）：

   基础设施（所有项目必须）：
     □ NEXT_PUBLIC_APP_URL — 已配？值是否正确？
     □ DATABASE_URL — 已配？数据库可连接？
     □ AUTH_SECRET — 已生成？（openssl rand -base64 32）

   AI/工具服务（按需）：
     □ OPENAI_API_KEY / 其他 LLM API Key — 已配？配额充足？
     □ 其他第三方 API Key（按项目需求）

   支付（按需）：
     □ STRIPE_SECRET_KEY — 已配？（先用 test key）
     □ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — 已配？
     □ STRIPE_SIGNING_SECRET — Webhook 配置后获取

   认证（按需）：
     □ GOOGLE_CLIENT_ID / SECRET — OAuth 登录用
     □ GITHUB_CLIENT_ID / SECRET — OAuth 登录用
     □ RESEND_API_KEY — 邮箱验证用

   分析（Phase 5 前配好即可）：
     □ GA_MEASUREMENT_ID — Google Analytics

2. 环境分层检查：
     □ .env.development — 开发环境全部填写（使用 test key）
     □ .env.production — 标记必填项（值留空，上线前通过部署平台配置）
     □ .env.example — 包含所有变量名 + 注释说明（不含真实值）

3. 安全检查：
     □ .gitignore 包含 .env*（除 .env.example）
     □ git log 中无历史提交的密钥（如有，立即撤销并从历史清除）

4. 本地验证：
     □ pnpm dev 启动无报错
     □ 数据库连接正常（访问需要数据库的页面验证）
     □ 工具核心功能可用（如 AI 翻译、识别等）

输出：.env.example 文件更新完成，所有必填变量有注释标记
```

### 输出产物
- 可运行的 ShipAny 项目（品牌已定制）
- 基础 SEO metadata 已配置（Phase 3 会用深度 SEO 内容覆盖首页部分）
- 支付系统已配置（如需要）
- 环境变量清单完整（.env.example 已更新）

---

## Phase 3: 精品工具页（Tool Pages）

### 核心理念

```
一个工具关键词 = 一个精品页面
三部分（工具区 + 结果展示 + SEO 落地页）合并为一个页面，共享同一套 H 层级和关键词策略。

合一的目的：
  → 所有用户行为数据集中在同一 URL
  → 搜索引擎从 H 层级理解完整页面主题
  → 登录前/后体验连贯
```

### 整页统一设计

> 先设计一个页面的完整 H 层级和内容流，再按区域分工实现。
> H 结构是页面的骨架，三个区域的 H 标签必须在同一棵树下连贯递进。

#### 统一 H 层级结构

```
⚙️ 使用 Skill: seo-page 统一规划整页的 H 结构和 SEO 内容

输入：工具关键词 + 页面路径 + Phase 1 产品方案
输出：整页的 H 层级 + 各 Section 内容 + Schema + 内链

URL: /{tool-slug}
Title: 包含主关键词（≤60 字符）
Description: 核心价值 + 主关键词（≤160 字符）

H1: {主关键词标题}（唯一，整页只有一个）
│
├─ [工具区] ← 无独立 H 标签，嵌入 Hero 区域内
│   副标题（非 H 标签，用 <p> 描述价值主张）
│   可交互工具表单
│   工具输出/结果区域
│
├─ H2: Popular Examples / Showcase ← 结果展示区
│   精选结果列表 / 示例 / 白名单策展内容
│
├─ H2: How It Works ← SEO 落地页区域开始
│   ├─ H3: Step 1 ...
│   ├─ H3: Step 2 ...
│   └─ H3: Step 3 ...
│
├─ H2: Why Use {Tool Name}
│   4-6 个价值点（差异化策略来自 Phase 1）
│
├─ H2: Use Cases
│   3-5 个使用场景
│
├─ H2: FAQ
│   ├─ H3: 问题 1（覆盖长尾词）
│   ├─ H3: 问题 2
│   └─ H3: ... （6-10 个问题）
│
├─ H2: What Users Say / Testimonials
│   3-5 条用户评价
│
├─ H2: Related Articles
│   内链博客（按 Phase 0 映射表）
│
└─ [CTA] ← 无独立 H 标签，最终转化区

Schema: WebApplication + FAQPage + BreadcrumbList
SEO 内容总量: ≥ 1200 字（不含工具区 UI 文案）
内链: 按 Phase 0 映射表执行

注：seo-page Skill 基于以上结构统一生成所有 Section 内容 + 质检。
    工具区和结果展示区的 SEO 内容与落地页区域是一个整体，不是三份独立文件。
```

#### 登录状态差异化

```
未登录（SEO 爬虫看到的版本）：
  H1 + 工具区（可体验，限次）+ 结果展示（精选示例）
  + 完整 SEO 落地页内容（How It Works → FAQ → Related Articles → CTA）

已登录：
  H1 + 工具区（完整功能）+ 个人历史结果
  + SEO 落地页内容折叠（aria-expanded 控制，非 display:none 完全移除）

技术要点：
  - 同一 URL，SSR 始终渲染完整 HTML（包含所有 H 标签和 SEO 内容）
  - 客户端 JS 根据登录状态折叠 SEO 区域（保留在 DOM 中，爬虫可读）
  - SEO 内容必须在 HTML 源码中（不能 JS 动态加载）
```

### 各区域实现指南

> 以下是同一页面三个区域的分工实现方式，H 层级由上方统一设计确定。

#### 工具交互区（手动开发 — Phase 1 工具方案驱动）

```
🔧 按业务需求定制开发，嵌入 H1 下方的 Hero 区域

设计原则：
  1. 直接嵌入页面 Hero 区，不跳转（参考 Canva AI 工具落地页）
  2. 输入区 + 操作按钮 + 输出区 = 一屏可见
  3. 未登录用户也能体验（限次，非完全屏蔽）
  4. 结果可分享（分享页设置 noindex）

交互模式参考：
  - 翻译器类（linkedintranslator）：双栏输入/输出 + 风格选择
  - 识别器类（songfromlink）：URL 输入 + 异步队列 + 轮询结果
  - 生成器类：提示词输入 + 参数配置 + 结果预览
  - 转换器类：文件上传 + 选项 + 下载

开发检查清单：
  基础：
  □ 工具组件独立封装（'use client'，不影响外层 SSR 和 H 层级）
  □ 移动端适配（触摸目标 ≥ 48x48px）
  □ 积分/次数限制（按 Phase 1 转化路径设计）

  状态与边界场景：
  □ 加载中：骨架屏 + aria-busy="true"（非空白等待）
  □ 成功：结果展示 + "继续使用"引导
  □ 错误：分级处理（网络错误→重试 / API 限流→等待 / 不可用→降级）
  □ 空状态：引导文案 + CTA（"从这里开始…"）
  □ 限次用完：按 Phase 1 引导策略（弹窗/模糊/倒计时）

  无障碍（a11y）：
  □ 输入框 label 关联（<label htmlFor>）
  □ 错误提示 role="alert" + aria-live="polite"
  □ Tab 键导航可达所有交互元素
  □ 颜色对比度 ≥ 4.5:1（文字）/ ≥ 3:1（图形元素）
  □ 屏幕阅读器测试（VoiceOver / NVDA）
```

#### 结果展示区（H2: Popular Examples — 组件化）

```
位于 H1 + 工具区下方，H2 "How It Works" 上方。
展示精选结果/示例，为页面贡献动态内容和用户行为数据。

通用组件规范：
  ResultCard（单条结果卡片）：
    - 数据字段：标题、描述/预览、标签列表、创建时间、操作按钮
    - 响应式：桌面 3 列 / 平板 2 列 / 手机 1 列
    - 最小高度固定（避免 CLS）

  ResultGrid（结果列表容器）：
    - 布局：CSS Grid，gap 统一
    - 分页：默认每页 12 条，"加载更多"按钮（SEO 友好）
    - 空状态：引导文案 + CTA

  ResultFilter（标签筛选）：
    - 水平标签栏，支持多选
    - URL 参数同步（如 ?tag=congratulations）

UGC 策略（遵守「新站 SEO 红线」）：
  - 用户个人结果页 → noindex, nofollow（token-based URL: /share/{token}）
  - 白名单聚合页面 → 允许索引（独立路由: /examples/{tag-slug}）
  - 内容审核：上聚合页的结果需人工或自动过滤

聚合页面 URL 结构：
  路由：/examples/{tag-slug}（独立路由，非查询参数）
  面包屑：首页 > 工具页 > 聚合页
  Schema：CollectionPage + FAQPage（区别于工具页的 WebApplication）
```

#### SEO 落地页区域（Skill 自动生成 — 从 H2 "How It Works" 开始）

```
从 H2 "How It Works" 到 CTA 的所有 Section 由 seo-page Skill 统一生成。
这些 Section 的 H2/H3 是整页 H 层级树的一部分（见上方统一设计）。

Sections 列表（均为 H2 级别）：
  1. How It Works — 3 步骤图解（H3 子步骤）
  2. Why Use {Tool Name} — 4-6 个价值点
  3. Use Cases — 3-5 个使用场景
  4. FAQ — 6-10 个问题（H3 子问题，覆盖长尾词）
  5. Testimonials — 3-5 条用户评价
  6. Related Articles — 内链博客（按 Phase 0 映射表）
  7. CTA — 最终转化区（无 H 标签）

配图：按优先级选择
  1. 产品截图（如有）
  2. 自制信息图
  3. Unsplash/Pexels 素材
```

### 执行流程

```
针对每个工具关键词（按 P0 → P1 → P2 顺序）：

Step 3.1: 落地页 SEO 内容 → ⚙️ seo-page（含内置质检）

Step 3.2: 页面路由创建 → 按以下决策树选择方式：
  需要可交互工具组件？
    YES → Code-based Route: src/app/[locale]/(landing)/{tool}/page.tsx
          （需要手动创建路由文件，支持 SSR + 客户端交互）
    NO  → shipany-page-builder: JSON 动态页面
          （仅修改 locale JSON + 注册路由，适合纯 SEO 落地页）

  需要数据库存储（用户结果、历史记录、聚合页数据）？
    YES → Code-based Route + API 路由 + 数据库查询
    NO  → 静态 JSON 页面即可

Step 3.3: 工具交互组件 → 🔧 手动开发（按 Phase 1 工具方案）
Step 3.4: 结果展示集成 → 🔧 通用组件 + 白名单聚合页规划
```

---

## Phase 4: 博客内容体系

### 核心策略

```
博客的作用：
  1. 覆盖信息类长尾关键词（工具页覆盖不了的）
  2. 为工具页提供内链支持（按 Phase 0 内链映射表）
  3. 建立领域权威性（E-E-A-T 信号）
  4. 持续产出新内容（保持网站活跃度）
```

### 执行流程

#### Step 4.1: 博客主题规划

```
⚙️ Skill: seo-blog-page

输入：
  - Phase 0 输出文档 ①（博客关键词列表，已含优先级）
  - Phase 0 输出文档 ③ 附录（竞对话题清单，直接使用，无需重复爬取）
  - Phase 0 输出文档 ②（内链映射表）
  - Phase 1 输出（目标用户 + 博客 CTA 风格）

注：seo-blog-page Skill 的竞对深度分析（H 结构、字数等）基于 Phase 0 的话题清单进行，
    不需要重新爬取竞对博客列表。

规划 10-15 篇文章，按 Phase 0 定义的 P0/P1/P2 优先级排列。

内容类型矩阵（7 种）：
  1. How-to 教程: "How to [action] from [platform]"（用户导向）
  2. 对比评测: "[Tool] vs [Competitor]"（决策支持）
  3. 技巧列表: "10 tips for..."（价值输出）
  4. 问题解答: "Why does [pain point]..."（痛点解决）
  5. 跨领域创意: "[Topic A] meets [Topic B]"（差异化）
  6. 产品故事: "How We Built [Tool]" / "Why [Tool] Exists"（品牌权威）
  7. 趋势洞察: "[Topic] in 2025" / "Trending [Topic]"（时效性长尾）

输出：博客主题清单 → 等待用户确认
```

#### Step 4.2: 逐篇写作

```
⚙️ Skill: seo-blog-page（逐篇模式）

对每篇文章执行：
  1. TD + H 层级设计 → 用户确认
  2. 正文写作
  3. 内链（按 Phase 0 映射表执行）
  4. CTA 植入（按 Phase 1 定义的博客 CTA 风格）
  5. 配图

内容质量标准：
  SEO 格式：
    - 总字数 ≥ 1200 字（深度优先于篇幅，避免超 3000 字）
    - 关键词密度 1-2%（自然融合，避免堆砌）
    - 关键词首次出现 ≤ 100 字内
    - H1 唯一，H2/H3 严格递进不跳级
    - 内链 ≥ 3 条（首段 1 条 + 中段 1 条 + 末段 Related Articles）
  可读性：
    - 平均句长 ≤ 20 字
    - 段落 ≤ 5 行
    - 首 50 字回答核心问题
  原创性：
    - 至少 1 个竞对未提及的角度或 FAQ
    - 不同文章间相同段落 < 30%

CTA 植入规则（按 Phase 1 转化路径设计）：
  | 文章类型 | CTA 强度 | 位置 |
  |---------|---------|------|
  | How-to | 强 | 中段"Try Free"按钮 + 末尾 CTA |
  | 对比评测 | 中 | 对比表格中工具链接 |
  | 技巧列表 | 弱 | 末尾 Related Articles |
  | 问题解答 | 中 | 答案末尾内文链接 |
  | 产品故事 | 强 | 开头+末尾品牌 CTA |
  | 趋势洞察 | 弱 | 末尾工具推荐链接 |
  每篇文章 CTA 总数 ≤ 3 个（避免广告感）

配图优先级：
  1. 产品截图（如有工具界面截图，优先使用）
  2. 自制信息图（技巧列表类文章适用，Figma/Canva 制作）
  3. Unsplash/Pexels 素材（通用场景图）
  配图 SEO：文件名含关键词（如 step-1-copy-link.jpg）、alt 描述性文本、压缩至 <100KB

注：seo-blog-page Skill 内置单篇质检（25+ 指标），无需额外质检步骤。

输出：
  - content/posts/{slug}.mdx
  - public/imgs/blog/{slug}/（3-4 张配图）
```

#### Step 4.3: 发布节奏

```
遵守「新站 SEO 红线」，博客分批发布：
  - P0 文章先行，P1 文章跟进
  - 不要一次性发布所有文章，模拟自然写作节奏
  - 具体时间线见 Phase 6 统一排期
```

---

## Phase 5: 全站验证 + 性能优化 + 上线

> Phase 3/4 的 Skill 已完成单页/单篇级别的质检。Phase 5 只做**全站级别的交叉验证**。

### Step 5.1: 全站交叉验证

```
内链完整性（验证 Phase 0 内链映射表的执行情况）：
  □ 每个工具页被 ≥ 2 篇博客内链 — 检查实际链入数
  □ 每篇博客内链 ≥ 1 工具页 + ≥ 1 博客 — 检查实际链出数
  □ 首页链接到所有核心工具页
  □ Footer 包含重要页面链接
  □ 面包屑导航覆盖所有页面

Schema 一致性：
  □ 首页: WebSite + Organization
  □ 工具页: WebApplication + FAQPage
  □ 聚合页: CollectionPage + FAQPage
  □ 博客页: Article + BreadcrumbList
  □ About 页: Organization（详细版）

Sitemap 覆盖率：
  □ 所有工具页、博客页、聚合页已包含
  □ noindex 页面已排除
  □ 认证页面已排除
  □ 默认语言路径无 307 重定向

Robots.txt：
  □ 允许公开页面 / 禁止 /api/, /admin/, /_next/
  □ 指向 sitemap.xml
```

### Step 5.2: 功能完整性验证

> **经验教训**：linkedinspeaktranslator 完成了全站 SEO 验证和 PageSpeed 优化，但上线后发现翻译功能（API Key 未配）、
> 支付功能（Stripe 未激活）、数据库（URL 未配）均不可用。SEO 验证不等于功能可用。

```
在部署前，逐项验证生产环境的功能完整性：

核心工具功能（必须全部通过）：
  □ 工具核心流程端到端可用（输入 → 处理 → 输出）
  □ 工具限次逻辑正确（未登录限次 → 提示注册）
  □ 工具错误处理友好（API 超时、输入异常等场景）

用户系统（如启用）：
  □ 邮箱注册 + 登录正常
  □ OAuth 登录正常（Google / GitHub / 其他）
  □ 邮箱验证流程正常（如启用）
  □ 登出后状态正确清除

支付系统（如启用）：
  □ 定价页展示正确（产品名、价格、货币）
  □ Stripe 产品/价格已在 Dashboard 创建，Price ID 已配置到项目
  □ 支付流程端到端可用（选产品 → 跳转 Stripe → 支付成功 → 回调）
  □ Webhook 回调正常（支付后用户权限/额度正确更新）
  □ 建议用 Stripe test mode 的测试卡先验证，上线后再切 live mode

生产环境变量（逐项确认已配置到部署平台）：
  □ DATABASE_URL — 数据库可连接
  □ AUTH_SECRET — 已生成且唯一
  □ OPENAI_API_KEY — API 可调用且配额充足
  □ STRIPE_SECRET_KEY — live key（或 test key 先验证）
  □ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — 对应的公钥
  □ STRIPE_SIGNING_SECRET — Webhook 签名密钥
  □ 其他项目特有的环境变量

多端验证：
  □ 桌面浏览器正常
  □ 移动端浏览器正常（响应式布局）
  □ 不同网络环境正常（WiFi / 4G 模拟）
```

### Step 5.3: 性能优化（PageSpeed Insights 交互式优化）

> 建议先在本地用 Lighthouse CLI 测试基准分数，避免「部署 → 测分 → 改码 → 重新部署」的低效循环。

**工具**：https://pagespeed.web.dev/

**达标标准：移动端 + PC 端 4 项得分均 ≥ 90**

```
优化流程（循环执行直到达标）：

1. 在 PageSpeed Insights 输入页面 URL，分别测试移动端和 PC 端
2. 查看 4 项得分，定位未达 90 的项：

   Performance（性能）：
     常见问题 → 修复方式：
     - LCP 过高 → Hero 图片加 priority、关键 CSS 内联、字体 next/font 预加载
     - CLS 过高 → 图片设 width/height、广告位预留空间、字体 swap 策略
     - INP 过高 → 工具组件 React.lazy 动态导入、去除首页不必要 JS
     - JS 过大 → Block 显式导入、tree-shaking、第三方库按需引入
     - 未用 JS → ANALYZE=true pnpm build 分析 bundle 后裁剪

   Accessibility（无障碍）：
     常见问题 → 修复方式：
     - 图片缺 alt → 补充描述性 alt 文本
     - 对比度不足 → 调整文字/背景颜色
     - 缺 aria 标签 → 交互元素补充 aria-label
     - 缺 lang 属性 → html 标签确认 lang 设置

   Best Practices（最佳实践）：
     常见问题 → 修复方式：
     - 使用 HTTP 而非 HTTPS → 确保全站 HTTPS
     - 控制台有错误 → 修复 JS 报错
     - 图片分辨率不匹配 → 使用 next/image 自动适配

   SEO：
     常见问题 → 修复方式：
     - 缺 meta description → 补充（Phase 3 seo-page 应已生成）
     - 不可爬取 → 检查 robots.txt 和 meta robots
     - 字体过小 → 移动端 font-size ≥ 16px
     - 点击目标过小 → 按钮/链接最小 48x48px

3. 修复后重新测试，确认得分提升
4. 重复直到移动端和 PC 端 4 项得分均 ≥ 90

需要测试的页面（至少覆盖）：
  □ 首页
  □ 核心工具页（P0 关键词对应的页面）
  □ 1 篇博客页（抽检）
```

### Step 5.4: 部署上线

```
部署前：
  □ pnpm build 无错误
  □ 所有工具页/博客页可正常访问
  □ 移动端适配正常
  □ 环境变量已配置（生产）
  □ 域名 DNS + SSL 已配置
  □ 分析工具已集成（GA / Search Console）

部署后（24 小时内）：
  □ 提交 sitemap 到 Google Search Console
  □ 请求索引核心页面
  □ 验证 PageSpeed（移动端 + PC 端 4 项得分均 ≥ 90）
  □ 配置 Uptime 监控
```

---

## Phase 6: 持续运营（统一时间线）

> 整合新内容发布、旧内容更新、工具页扩展、聚合页建设为一条统一的时间线。

### 发布节奏

```
发布时间建议：优先工作日（周二-周四），早 8-10 点发布（爬虫活跃高峰）。
避免周五-周日发布（爬虫活动低，索引延迟）。

Week 1-2（首批内容上线）:
  - 发布 P0 博客（3-5 篇），每天 1 篇
  - 监测 Search Console 索引状态
  - 修复发现的 SEO 问题
  - 外链：提交目录站、Product Hunt、社交媒体分享

Week 3-4（补充内容）:
  - 发布 P1 博客（3-5 篇），每 2 天 1 篇
  - 分析哪些页面开始获得曝光
  - 外链：论坛回答、社区互动（附工具链接）

Month 2-3（稳定期）:
  - 每周 1 篇新博客 + 每月 1 篇旧文更新
  - 优化已有排名的页面（从第 2 页冲第 1 页）
  - 考虑上线 P1 工具关键词页面
  - 外链：行业博客互链、资源页收录申请

Month 4-6（扩展期）:
  - 每 1-2 周 1 篇新博客 + 每月 2 篇旧文更新
  - 开始建设白名单聚合页面（如有足够 UGC）
  - 扩展 P1 工具关键词

Month 6+（规模化，DA > 10 后）:
  - 开始做 P2 高竞争关键词
  - 可适当增加页面数量
  - 规模化外链：guest post、媒体合作
```

### 内容更新策略

```
更新旧内容的 ROI 远高于创建新内容（1-2 小时 vs 6-8 小时），Month 2 起必须执行。

触发条件（满足任一即触发更新）：
  - 排名下滑 ≥ 5 位（如从第 5 跌到第 10）
  - 排名停滞 ≥ 3 个月（未上升也未下降）
  - CTR 下滑 > 20%（Title/Description 可能需优化）
  - 竞对发布了同话题更好的内容
  - 产品功能更新（博客需同步截图/文案）

更新执行步骤：
  1. 检查哪些信息过时（数据、例子、功能截图）
  2. 补充新内容（新技巧、新工具、最新数据）
  3. 改进结构（更清晰的 H 层级、补充内链）
  4. 刷新 Frontmatter 的 updated_at 字段
  5. 提交 Search Console 请求重新爬取

更新优先级：
  P0：排名 1-5 且下滑 ≥ 5 位（快速止跌）
  P1：排名 6-15 的文章（冲顶准备）
  P2：排名 16+ 的文章（长期维护）
```

### 监测指标

```
每周:
  - Search Console: 曝光/点击/排名 + 索引状态 + 404 错误
  - GA: 博客→工具页转化事件（blog_to_tool）

每月:
  - 关键词排名趋势（标记上升/下滑词）
  - 博客流量 Top 10 + 转化率
  - 识别需要更新的文章（排名下滑 / CTR 下滑）
  - Core Web Vitals 趋势
```

---

## 附录: Skill 体系规划

### 现有 Skill

| Skill | 阶段 | 用途 |
|-------|------|------|
| `shipany-quick-start` | Phase 2 | 项目初始化 + 品牌定制 |
| `seo-page` | Phase 3 | 工具页落地页 SEO 内容生成（含精品工具页模式 + 内置质检） |
| `seo-blog-page` | Phase 4 | 竞对分析 + 主题规划 + 逐篇写作（含内置质检） |
| `shipany-page-builder` | Phase 3 | 快速创建动态页面（JSON 配置） |

### 建议新建的 Skill

| Skill | 阶段 | 用途 | 优先级 |
|-------|------|------|--------|
| `keyword-research` | Phase 0 | 竞对分析 + 关键词拓展 + 分类 + 内链规划 | P0 |
| `launch-checklist` | Phase 5 | 全站交叉验证（内链完整性/Schema 一致性/Sitemap 覆盖率/性能） | P1 |

### Skill 流水线

```
[keyword-research] → 关键词矩阵 + 内链映射表 + 竞对速写
        ↓
  🤝 AskUserQuestion → 产品方案对齐（product_brief.md）
        ↓
[shipany-quick-start] → 项目初始化
        ↓
[seo-page] → 精品工具页 SEO 内容（含单页质检）
        ↓
  🔧 手动 → 工具交互组件（按产品方案）
        ↓
[seo-blog-page] → 博客内容体系（含单篇质检）
        ↓
[launch-checklist] → 全站交叉验证
        ↓
  🚀 部署上线
```

---

## 附录: 两个项目的经验教训速查

### 从 linkedintranslator 学到的

| 问题 | 教训 | SOP 改进 |
|------|------|---------|
| 品牌清理分散 | 应一次性批量完成 | Phase 2.2 清理检查清单 |
| 无设计文档 | 边做边改，返工多 | Phase 1 产品方案对齐 |
| SEO 逐步修补 | Schema/内链多次补充 | Skill 内置质检 + Phase 5 全站验证 |
| 模板功能冗余 | 包含不需要的模块 | Phase 1 MVP 范围明确 |

### 从 songfromlink 学到的

| 实践 | 效果 | SOP 对应 |
|------|------|---------|
| 设计文档先行 | 开发效率高 | Phase 1 产品方案对齐 |
| 品牌清理一次完成 | 1 提交 vs 多次 | Phase 2.2 |
| 博客分批发布 | 符合搜索引擎预期 | Phase 6 统一时间线 |
| 性能最后优化 | 避免被后续改动覆盖 | Phase 5.2 |
| 零竞争词优先 | 快速获得首批排名 | Phase 0 P0 优先级 |
