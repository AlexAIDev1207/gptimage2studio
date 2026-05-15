# gptimage2studio docs

> 一句话定位：见 `product.md`

## 文档体系（按需加载）

| 问题类型 | 第一站 | 备援 |
|---|---|---|
| 架构 | docs/architecture.md | docs/decisions.md |
| 项目是干啥的 | docs/product.md | — |
| 技术选型 | docs/tech-stack.md | docs/decisions.md |
| 决策历史 | docs/decisions.md | — |

## 加载约定

LLM 处理任务前先读对应「第一站」。第一站 frontmatter `last_decision` 链到 ADR。
仍不足才回溯 L2（agent_manage Vault `Efforts/gptimage2studio/T*.md`）。

## 文档体系新增 doc

- 可选 doc：`brainctl doc add <type> --project gptimage2studio`
  type ∈ {roadmap, design-system, seo, monetization, operations, content-strategy}
- 业务模块：`brainctl doc add feature <name> --project gptimage2studio`
