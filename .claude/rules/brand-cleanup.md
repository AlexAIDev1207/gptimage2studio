# 品牌清理检查清单

> 来源：.claude/sop-keyword-to-launch.md Phase 2.2
> 始终生效：项目初始化和编辑模板文件时自动检查。

## 必须清理的位置

- [ ] package.json: name, description, author, repository
- [ ] Footer: 移除模板品牌标识
- [ ] Footer: `landing.json` 中设置 `"show_built_with": false`（隐藏 "Built with ❤️ ShipAny"）
- [ ] Admin Sidebar: 替换品牌名
- [ ] 所有页面中的模板占位文案
- [ ] 示例内容/示例图片替换
- [ ] 聊天功能（如不需要则隐藏路由）
- [ ] 根据 MVP 范围，禁用不需要的模板模块

## 验证方法

全局搜索以下关键词确保零残留：
- `ShipAny`
- `shipany`
- `Ship Any`
- `template-two`

## 注意

写入或编辑模板相关文件时，不要引入新的模板品牌引用。
