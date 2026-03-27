---
name: sop-research
description: 执行 SOP Phase 0 关键词调研。输入种子关键词，输出关键词矩阵+内链映射+竞对速写 3 份文档到 sop-data/。当用户说"关键词调研"、"keyword research"、"分析关键词"、"调研竞对"时触发。
---

# SOP Phase 0: 关键词调研与分类

## 输入

- `$ARGUMENTS`: 种子关键词（如 "LinkedIn Translator"）
- 如果未提供种子词，通过 AskUserQuestion 询问

## 工具链

**核心工具：Browser MCP（操作真实 Google 搜索）**

所有搜索数据必须来自 Google，不使用 WebSearch（Brave Search）。
通过 `mcp__browsermcp__browser_*` 系列工具操作浏览器访问 Google。

### Browser MCP 操作模式

```
搜索操作：
1. browser_navigate → https://www.google.com/search?q={encoded_query}&hl=en
2. browser_snapshot → 解析 SERP 结构（排名、标题、URL、描述）
3. 如需翻页/展开 → browser_click 对应元素

Autocomplete 操作：
1. browser_navigate → https://www.google.com
2. browser_type → 在搜索框输入种子词（submit=false）
3. browser_snapshot → 捕获下拉建议列表

Google Trends 操作：
1. browser_navigate → https://trends.google.com/trends/explore?q={encoded_query}
2. browser_wait → 等待 3 秒（图表加载）
3. browser_snapshot → 捕获趋势数据和相关查询
4. ⚠️ 如果 Trends 页面加载失败或被拦截，通过 AskUserQuestion 请求用户手动截图
```

### 反爬注意事项

- 每次 Google 搜索间隔 ≥ 3 秒（browser_wait）
- 如果遇到验证码，通过 AskUserQuestion 通知用户手动处理后继续
- 优先使用 URL 参数搜索（`/search?q=`），减少交互步骤

## 执行流程

### Pre-flight: 账号准备检查

在开始调研前，检查第三方账号是否已准备就绪（这些注册可与调研并行）：

```
通过 AskUserQuestion 逐项确认：
  □ 域名是否已购买？（如未购买，建议现在注册，调研期间 DNS 可能需要传播时间）
  □ 数据库服务是否已注册？（Supabase / PlanetScale / 其他）
  □ 部署平台是否已注册并连接 GitHub？（Vercel / Cloudflare Pages）
  □ 工具依赖的 API 是否已注册？（OpenAI / 其他 LLM，如工具需要 AI）
  □ 支付平台是否已注册？（Stripe 商户激活需 1-3 天审核，建议尽早提交）

如果有未注册的账号，建议用户在调研进行的同时并行注册。
不阻塞调研流程，但需记录到 progress.md 备注中。
```

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 0** 章节，按以下步骤执行：

### Step 0.1: 竞对产品速写 + SERP 分析

使用 Browser MCP 在 Google 搜索种子词，**记录 SERP 前 10 名并采集结构化数据**：

对每条 SERP 结果采集：
- **排名位置**（1-10）
- **页面标题** + **URL**
- **是否首页**（域名根路径 vs 内页路径）
- **网站类型**（工具站 / 博客 / 论坛 / 问答 / 聚合 / 大品牌 / 其他）
- **注册域名**（提取主域名，如 `example.com`）

将 SERP 前 10 数据写入 `competitor-sketch.md` 的 SERP 分析表。

从 SERP 中选 3-5 个主要竞对（工具站优先），可并行启动 `seo-researcher` subagent 分别分析：

**⚠️ 竞对分析应同时使用 WebSearch 和 Browser MCP：**
- Browser MCP：访问竞对网站，重点分析**工具功能和交互设计**
- WebSearch：搜索竞对评价、第三方评测、社交媒体讨论、反链来源等外部信息
- seo-researcher agent 的 prompt 中须明确要求使用两种工具

**Browser MCP 重点分析（按优先级）：**

1. **工具功能与交互**（最重要）：
   - 输入→输出的完整交互流程（步骤数、等待时间、动画反馈）
   - 功能选项设计（语言选择、风格切换、强度调节等）
   - 用户引导方式（示例文本、placeholder、新手引导）
   - 结果展示（格式化、高亮差异、一键复制）
   - 错误处理和边界情况（空输入、超长文本、网络异常）
   - 分享/导出功能
   - 每个亮点标注"可借鉴"或"可超越"

2. **产品形态**：定价策略、注册门槛、免费额度设计

3. **SEO 结构**（次要）：首页 Section 列表、H 标签层级、内容量、Schema

4. **内容覆盖**：博客/话题清单、更新频率

新站排名机会判断：
- SERP 前 10 中有新站/小站/论坛帖 → 该词标记为低竞争
- 前 10 全是首页 + 高权重站 → 高竞争

汇总结果写入 `competitor-sketch.md`（模板见 `references/02-competitor-sketch-template.md`）。

### Step 0.2: 种子词拓展

**⚠️ 纵深原则：所有拓展必须围绕已确认的主攻词，不搜索意图不同的泛词。**

如果主攻词是 "linkedin speak translator"，只拓展其变体（同义、场景、修饰词），不搜索 "how to translate linkedin post"（语言翻译意图）等意图偏离的词。

全部通过 Browser MCP 从 Google 获取：

1. **Autocomplete**：导航到 google.com，输入主攻词及 2-3 个近义变体（不提交），捕获下拉建议
2. **People Also Ask**：搜索主攻词后，从 snapshot 中提取 PAA 问题
3. **Related Searches**：同一 SERP 页底部提取相关搜索
4. 对 2-3 个高潜力**同意图**变体词重复步骤 1-3
5. **Google Trends**：导航到 trends.google.com 查看相关查询中的热门和上升词
   - ⚠️ 如果 Trends 加载失败，通过 AskUserQuestion 请求用户截图辅助
6. 补充竞对覆盖但我们未拓展到的关键词（来自 Step 0.1）

Autocomplete 中出现意图偏离的词（如语言翻译、求职类），标记为 SKIP 不纳入关键词池。

### Step 0.3: 评估与分类

对每个关键词评估 3 个维度：

1. **搜索热度**（Google Trends）：
   - 通过 Browser MCP 访问 Trends，将关键词分组（≤ 5 个一组）对比
   - 热度评级：高 / 中 / 低，标注趋势方向：↑ / → / ↓

2. **竞争度**（Browser MCP SERP 分析）：
   - 搜索每个关键词，采集 SERP 前 10 结构化数据（同 Step 0.1 格式）
   - 低竞争：有内页/论坛/小站排名，非首页结果占比 > 30%
   - 中竞争：全是正规站但非大品牌，首页占比高
   - 高竞争：前 10 全是高权重站首页

3. **搜索意图**：TOOL / BLOG / SKIP

按 P0/P1/P2 优先级排序，分类为工具词和博客词。

写入 `keyword-matrix.md`（模板见 `references/00-keyword-matrix-template.md`）。

### Step 0.4: 内链规则确认

确认 `.claude/rules/internal-links.md` 中的规则适用于本项目。
如有项目特殊需求（如特定的锚文本策略），追加到 `internal-links-rules.md`。

> 注意：具体的页面级内链映射表在 Phase 1（产品对齐）确定页面架构后，由 Phase 3/4 在创建页面时逐步填充到 `internal-links.md`。

## 输出

2 份文件写入 `.claude/sop-data/`：
- `keyword-matrix.md` — 关键词评估数据（不含页面路径映射）
- `competitor-sketch.md` — 竞对分析 + SERP 数据

完成后更新 `.claude/sop-data/progress.md` Phase 0 状态为 ✅。

## 用户确认点

- Step 0.1 完成后：展示 SERP 前 10 分析表，等待用户确认竞对选择
- Step 0.3 完成后：展示关键词矩阵，等待用户确认优先级和分类
