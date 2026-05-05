# Phase 2: SERP 验证汇总

生成时间：2026-05-02
共验证 21 个候选（4 个用 browsermcp+Google 实跑，17 个用 WebSearch 跑）

## 判定分布

| Verdict | 数量 | 候选 |
|---|---|---|
| **PASS** | 12 | poster-design / product-photography / cinematic-portrait / infographic / ecommerce-product-photo / old-photo-restore / sticker / instagram-photo-edit / action-figure / food-photography / thumbnail / social-media-ad |
| **SOFT-PASS** | 7 | portrait / anime-style / logo-design / text-rendering / interior-design / 3d-render / multi-image-consistency |
| **REJECT** | 2 | character-design (传统手绘社区主导) / ui-mockup (search intent mismatch) |

## 后补充：comic-storyboard-prompts（来自 awesome-gpt-image-2 借鉴）

2026-05-04 追加：参考 awesome-gpt-image-2 仓库后发现 Comic/Storyboard 是漏网方向，已跑 SERP 验证。

- **verdict: SOFT-PASS**（10 unique domains，0 UGC，7 个 specialist 林立但 prompt-template 角度有差异化空间）
- 已有数据：awesome-gpt-image-2 提供 18 条精选 ready-to-use prompts
- 决策：**P1 候选**（P0 上线 2-4 周后视 GSC 表现决定）
- 详细 SERP 数据：`serp-validation/comic-storyboard-prompts.json`

## ✅ PASS（12 个，按转化潜力分 Tier）

### Tier 1：强 viral 玩法（高 CTR + 强情感共鸣）

| slug | 关键卖点 | 直接竞品 |
|---|---|---|
| **action-figure-prompts** | viral 现象级（自己→盒装手办） | actionfiguregenerator.ai |
| **old-photo-restore-prompts** | 情感价值（修复祖辈照片） | Adobe Firefly / VanceAI |
| **instagram-photo-edit-prompts** | 高 viral + 印度低质 SEO 易超 | media.io |
| **sticker-prompts** | 自照→可爱贴纸 | Canva / Adobe |
| **thumbnail-prompts** | YouTuber 必需 + 文字渲染优势 | thumbprompt.com |

### Tier 2：commercial 强转化

| slug | 关键卖点 | 直接竞品 |
|---|---|---|
| **product-photography-prompts** | 卖家通用（studio/packshot） | claid.ai / media.io |
| **ecommerce-product-photo-prompts** | listing/on-model（与 product-photo 重叠） | photoroom.com |
| **cinematic-portrait-prompts** | 电影感人像（高质量内容） | promptplum.com |
| **food-photography-prompts** | 餐厅+美食博主 | foodphoto.ai / aimenuphoto.com |
| **social-media-ad-prompts** | 营销人（与 GPT Image 2 文字渲染契合） | mindstudio.ai |

### Tier 3：设计/教育创作

| slug | 关键卖点 | 直接竞品 |
|---|---|---|
| **poster-design-prompts** | 设计师 + AI 海报最热 | promptbase.com / lovart.ai |
| **infographic-prompts** | 商务/教育（pixel-level 文字渲染优势） | atlabs.ai |

## 🟡 SOFT-PASS（7 个，建议 P1 备选）

| slug | 不进 P0 的理由 |
|---|---|
| portrait-prompts | 词意宽泛 + 直接竞品 nanobananaprompt.org 已在前 10 |
| anime-style-prompts | Reddit + Facebook 都带 sitelinks，竞争被 Midjourney 主导 |
| logo-design-prompts | SERP 偏 Midjourney/Leonardo 教程，Reddit sitelinks |
| text-rendering-prompts | 搜索意图偏技术术语，felo.ai 已有 GPT Image 2 specific 页面 |
| interior-design-prompts | 5 个 specialist hub 在 top 10（decor8/spacely/fenestra...）|
| 3d-render-prompts | 7 个 specialist hub 在 top 10 |
| multi-image-consistency-prompts | 技术性主题搜索量小，Ideogram Character 是直接对手 |

## ❌ REJECT（2 个，不做）

- **character-design-prompts**：top 10 被传统手绘 OC 社区占据（tumblr/characterhub/toyhou.se/rangen），AI 用户不在这里
- **ui-mockup-prompts**：top 10 全是 UI 生成器工具（Figma/Uizard/Motiff），用户要的是『一键生成完整 UI』而非 prompt 列表，search intent mismatch

## 📋 推荐 10 P0（按上线顺序）

每个都满足：PASS verdict + 与 GPT Image 2 强项契合 + commercial/viral 转化清晰。

| # | slug | H1 | 主要 sub-scenes |
|---|---|---|---|
| 1 | `action-figure-prompts` | Action Figure Prompts for GPT Image 2 | funko / blister / collector / movie hero |
| 2 | `old-photo-restore-prompts` | Old Photo Restoration Prompts for GPT Image 2 | colorize / scratch repair / family portrait / vintage tone |
| 3 | `instagram-photo-edit-prompts` | Instagram Trending Photo Edit Prompts for GPT Image 2 | butterfly / flash / Y2K / aura / saree / couple |
| 4 | `sticker-prompts` | Sticker Prompts for GPT Image 2 | chibi / die-cut / kawaii / line sticker / telegram |
| 5 | `thumbnail-prompts` | YouTube Thumbnail Prompts for GPT Image 2 | reaction face / vs / arrow + text / clickbait |
| 6 | `cinematic-portrait-prompts` | Cinematic Portrait Prompts for GPT Image 2 | noir / golden hour / neon rain / editorial |
| 7 | `product-photography-prompts` | GPT Image 2 Product Photography Prompts | studio packshot / lifestyle / hands-only / gradient |
| 8 | `poster-design-prompts` | Poster Design Prompts for GPT Image 2 | minimal / vintage / movie / concert / propaganda |
| 9 | `food-photography-prompts` | Food Photography Prompts for GPT Image 2 | flat lay / hero / restaurant menu / drink / dessert |
| 10 | `infographic-prompts` | Infographic Prompts for GPT Image 2 | technical isometric / process diagram / data viz / educational |

### 为什么不选 ecommerce-product-photo-prompts 进 P0

虽然它 PASS，但与 #7 product-photography 重叠 80%。先做 product-photography（更宽泛覆盖），ecommerce-product 作为 P1 优先备选。

### 为什么不选 social-media-ad-prompts 进 P0

虽然它 PASS，但 #3 instagram-photo-edit 已经覆盖了大部分社媒 intent，且 instagram 的 viral 转化更强。social-media-ad 偏 B2B 营销人，可作为 P1。

## 总览表

| slug | verdict | div | reddit | pinterest | comp | tier | recommend |
|---|---|---|---|---|---|---|---|
| action-figure-prompts | PASS | 10 | 0 | 0 | 1 | T1 viral | **P0 #1** |
| old-photo-restore-prompts | PASS | 10 | 0 | 0 | 0 | T1 viral | **P0 #2** |
| instagram-photo-edit-prompts | PASS | 7 | 0 | 0 | 1 | T1 viral | **P0 #3** |
| sticker-prompts | PASS | 9 | 0 | 0 | 0 | T1 viral | **P0 #4** |
| thumbnail-prompts | PASS | 9 | 0 | 0 | 1 | T1 viral | **P0 #5** |
| cinematic-portrait-prompts | PASS | 9 | 0 | 0 | 2 | T2 commercial | **P0 #6** |
| product-photography-prompts | PASS | 7 | 0 | 1 | 2 | T2 commercial | **P0 #7** |
| poster-design-prompts | PASS | 8 | 0 | 1 | 0 | T3 creative | **P0 #8** |
| food-photography-prompts | PASS | 10 | 0 | 0 | 4 | T2 commercial | **P0 #9** |
| infographic-prompts | PASS | 10 | 0 | 0 | 1 | T3 creative | **P0 #10** |
| ecommerce-product-photo-prompts | PASS | 10 | 0 | 0 | 1 | T2 | P1 (与 product-photo 重叠) |
| social-media-ad-prompts | PASS | 9 | 0 | 0 | 1 | T2 | P1 |
| portrait-prompts | SOFT-PASS | 10 | 1 | 1 | 1 | — | P1 |
| anime-style-prompts | SOFT-PASS | 8 | 1 | 0 | 0 | — | P1 |
| logo-design-prompts | SOFT-PASS | 9 | 1 | 1 | 1 | — | P1 |
| text-rendering-prompts | SOFT-PASS | 9 | 0 | 0 | 2 | — | P2 |
| interior-design-prompts | SOFT-PASS | 10 | 0 | 0 | 5 | — | P2 |
| 3d-render-prompts | SOFT-PASS | 10 | 0 | 0 | 7 | — | P2 |
| multi-image-consistency-prompts | SOFT-PASS | 10 | 0 | 0 | 2 | — | P2 |
| character-design-prompts | REJECT | 10 | 0 | 1 | 0 | — | ❌ 不做 |
| ui-mockup-prompts | REJECT | 10 | 0 | 0 | 0 | — | ❌ 不做 |

## 下一步（Phase 3）

待用户确认 10 P0 后：
1. 用 browsermcp 给 10 P0 单独跑一次 Google 抓 PAA + Related Searches，喂给 hub 页 FAQ + sub-scenes
2. 设计每个 cluster 的 IA spec（H1 / sub-scenes / FAQ / 内链）
3. 输出到 `.claude/sop-data/clusters/{slug}/spec.json`
