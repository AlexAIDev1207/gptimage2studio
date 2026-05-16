---
doc_id: architecture
project_id: gptimage2studio
last_updated: 2026-05-15
last_decision:
related_tasks: []
---

# Architecture

<!-- brainctl:section:start name="overview" -->
**架构分层**：基于 ShipAny Template Two 的 Next.js AI SaaS 工具站，核心业务是「GPT Image 2」图像生成。整体五层结构（src 目录即分层）：

```
[Presentation]   Next.js App Router  src/app/[locale]/(landing|chat|auth|admin)
                 + Fumadocs MDX (content/)
       │  HTTP / Server Component
       ▼
[API/Route]      src/app/api/**/route.ts   ← 鉴权、参数校验、积分扣减、组装响应
       │
       ▼
[Business]       src/shared/services/*   编排（ai / payment / storage / rbac）
       │         src/shared/models/*     表级数据访问 + 业务规则
       ▼
[Core/Data]      src/core/db (Drizzle ORM)  → SQLite/Turso/PG/MySQL/D1
       │         src/config/db/schema*.ts    （schema 真源）
       ▼
[Extensions]     src/extensions/*  可插拔提供商适配
                 ai: Kie/Replicate/Fal/Gemini   payment: Stripe/PayPal/Creem
                 storage: R2/S3   email / ads / analytics / affiliate
       │
       ▼
[External]       Kie.ai 等图像 API · Better Auth(OAuth) · Cloudflare R2 · 支付网关
```

## 模块边界

| 模块 | 职责 | 真源/派生 |
|---|---|---|
| `src/app/[locale]` | 页面路由（落地/生成器/聊天/后台），i18n 由 `[locale]` 段驱动 | 派生（UI） |
| `src/app/api/**` | HTTP 入口：鉴权、校验、积分门禁、回调验签 | 派生（编排） |
| `src/shared/services/*` | 业务编排，如 `getAIService` 按 config 装配 `AIManager` | 派生 |
| `src/shared/models/*` | 表级读写 + 规则（ai_task / image_asset / credit / order...） | 数据访问 |
| `src/core/db` | 多后端 Drizzle 连接装配（`index.ts` 选库） | 基础设施 |
| `src/config/db/schema*.ts` | 数据库表定义（19 张表，按后端分文件） | **schema 真源** |
| `src/core/auth` | Better Auth（Email + Google + GitHub OAuth） | 基础设施 |
| `src/extensions/ai` | 提供商适配，默认 Kie.ai；`AIManager` 统一抽象 | 派生（适配器） |
| `src/extensions/payment` | `PaymentManager` 多渠道支付适配 | 派生（适配器） |
| `src/extensions/storage` | R2 / S3 对象存储抽象 | 派生（适配器） |
| `src/themes` / `src/shared/blocks` | 主题与可复用区块组件 | 派生（UI） |
| `content/` | Fumadocs MDX 博客/文档内容 | **内容真源** |
| Vault `docs/` | 本活文档体系 | 真源 |

## 数据流

**图像生成（核心链路，异步镜像模式）**：

1. 入口 `POST /api/ai/generate/route.ts`：读 `getAllConfigs` → `getAIService` 装配 `AIManager` → 校验 provider/mediaType/scene。
2. 门禁：`getUserInfo` 鉴权 → `getMediaCostCredits` 算价 → `getRemainingCredits` 比对，积分不足直接 reject。
3. 调用 `aiProvider.generate()`（默认 Kie.ai，`customStorage=false` 走快速预览），拿到 `taskId`。
4. `createAITask` 落 `aiTask` 表，回 `respData` 给前端（此时图片是 Kie 临时 URL）。
5. 异步回调 `POST /api/ai/notify/kie/route.ts`：HMAC-SHA256 验签 → `updateAITaskById` 更新状态 → `syncImageAssetsFromAITask` 写 `imageAsset` → `mirrorImageAssetsForTask` 把图像镜像落地到 Cloudflare R2。
6. 前端可经 `/api/ai/query`、`/api/ai/list-image-history`、`/api/images/mirror` 轮询/补镜像。

**支付链路**：`POST /api/payment/checkout` 下单 → 网关回调 `POST /api/payment/notify/[provider]` 验签 → `handleCheckoutSuccess` 等事件处理器更新 `order`/`subscription`，并 `grantCreditsForUser` 发放积分。

## 不变量

- **schema 真源在 `src/config/db/schema*.ts`**：改表必须同步对应后端 schema 文件，再 `pnpm db:generate && pnpm db:migrate`，禁止手改迁移文件。
- **积分先扣后用**：`/api/ai/generate` 必须先 `getRemainingCredits` 通过才调用提供商，余额不足零调用、零落库。
- **回调必须验签**：`notify/kie` 用 HMAC-SHA256 + 常量时间比较，`payment/notify` 按 provider 验签，未验签事件不得改库。
- **provider 可插拔**：新增 AI/支付/存储渠道只在 `src/extensions/` 加适配器并接入对应 Manager，业务层不感知。
- **图像异步镜像**：生成响应可先返回提供商临时 URL，最终真源由回调链路镜像到 R2 后写入 `imageAsset`；前端不得假设首响应即永久地址。
- **路径别名 `@/*` → `src/*`**；多后端连接在 `src/core/db/index.ts` 按环境选库，业务代码只 import `db`。
<!-- brainctl:section:end name="overview" -->
