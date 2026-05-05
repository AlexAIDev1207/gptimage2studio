# awesome-gpt-image-2 数据集去重报告

生成时间：2026-05-03T16:11:25.033Z

## 数据规模
- README 解析出 prompt: **126** 条
- 含完整 prompt 文本（≥50 字）: **126** 条
- 我们 master 池: 1446 条 (GitHub 1446)

## 去重结果
- 与 master 重复 (jaccard ≥ 0.4): **0**
- **新增可用 prompts: 126**

> 重复阈值 0.4 比较保守。GitHub 1446 prompts 多数来自 X，awesome 也从 X 挑选，但 awesome 是 YouMind 团队精选 + 多语言改写，重复率应该不高。

## 新增 prompt 按 cluster 分布

| Cluster | 数量 |
|---|---|
| `cinematic-portrait-prompts` | 20 |
| `thumbnail-prompts` | 20 |
| `(unmapped: Comic / Storyboard)` | 18 |
| `instagram-photo-edit-prompts` | 16 |
| `infographic-prompts` | 16 |
| `product-photography-prompts` | 16 |
| `(unmapped: E-commerce Main Image)` | 14 |
| `(unmapped: featured)` | 6 |

## 关键发现

### Comic / Storyboard（我们漏的方向）
- 新增 18 条
- 这是我们 P0 完全没覆盖的方向，建议加 P1 candidate `comic-storyboard-prompts`

### E-commerce Main Image（我们 P1）
- 新增 14 条
- 已规划在 P1，对应 `ecommerce-product-photo-prompts`

### App / Web Design
- 新增 0 条（如 README 含此分类）
- 我们 SERP 验证已 REJECT，但他们的 prompt 是 e-commerce live stream UI mockup 等具体场景，可能值得二评

## 输出文件

- `awesome-gpt-image-2.jsonl` (${awesomePrompts.length} 条全量 + 标注 is_duplicate)
- `awesome-gpt-image-2.new.jsonl` (${newRecords.length} 条新增可用)

## 使用约束

- License: **CC BY 4.0**
- 引用要求：每条 prompt 内部留 `source_attribution_internal` 字段（不需要外网展示）
- 改写后 prompt 算我们衍生品，不需要在 hub 页加 attribution，但可以在 footer 加感谢链接