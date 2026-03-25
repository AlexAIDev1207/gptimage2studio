---
name: sop-init
description: 执行 SOP Phase 2 项目初始化。调用 shipany-quick-start 完成基础配置，然后执行品牌清理和支付配置。当用户说"初始化项目"、"项目初始化"、"开始搭建"时触发。
---

# SOP Phase 2: 项目初始化

## 前置条件

检查 `.claude/sop-data/progress.md`，确认 Phase 0 和 Phase 1 已完成（✅）。
如果未完成，提示用户先执行对应 Skill。

## 输入

- `.claude/sop-data/keyword-matrix.md`（Phase 0 输出，提取主关键词写 SEO metadata）
- `.claude/sop-data/product-brief.md`（Phase 1 输出，提取项目名/域名/功能/主色调）

## 执行流程

读取 `.claude/sop-keyword-to-launch.md` 的 **Phase 2** 章节，按以下步骤执行：

### Step 2.1: 模板基础配置

从 `product-brief.md` 提取以下信息，调用 `/shipany-quick-start`：
- projectName、tagline（含主关键词）、description、primaryFeatures
- domain / appUrl、primaryColor

等待 shipany-quick-start 完成后继续。

### Step 2.2: 品牌清理

按 `.claude/rules/brand-cleanup.md` 检查清单逐项执行：
- package.json 元数据
- Footer / Admin Sidebar 品牌名
- 模板占位文案和示例内容
- 根据 product-brief.md 的 MVP 范围禁用不需要的模块

验证：全局搜索 "ShipAny" / "shipany" 确保零残留。

### Step 2.3: 支付系统配置（仅当 product-brief.md 标记"支付系统: 需要"时）

按 SOP Phase 2 Step 2.3 的指引：
1. 根据 product-brief.md 的部署方案选择支付提供商
2. 引导用户配置 API Key（通过 AskUserQuestion 确认）
3. 创建产品和定价（对应 product-brief.md 变现模型）
4. 提示用户测试支付流程

## 输出

- 可运行的项目（品牌已定制）
- 基础 SEO metadata 已配置
- 支付系统已配置（如需要）

完成后更新 `.claude/sop-data/progress.md` Phase 2 状态为 ✅。
