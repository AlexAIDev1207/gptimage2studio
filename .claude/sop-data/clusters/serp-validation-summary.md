# Phase 2: SERP Validation Summary

Generated at: 2026-05-02T18:01:51.355Z

## Final clusters

| Batch | URL | H1 | Intent grade | KD est. |
|---|---|---|---|---|
| 1 | `/gpt-image-2-prompts/for-product-photography/` | GPT Image 2 Prompts for Product Photography | strong-commercial | 24 |
| 1 | `/gpt-image-2-prompts/for-action-figure/` | GPT Image 2 Action Figure Prompts | strong-viral | 18 |
| 1 | `/gpt-image-2-prompts/for-old-photo-restoration/` | GPT Image 2 Prompts for Old Photo Restoration | strong-problem | 20 |
| 1 | `/gpt-image-2-prompts/for-ui-mockups/` | GPT Image 2 Prompts for UI Mockups | strong-design | 22 |
| 1 | `/gpt-image-2-prompts/for-poster-design/` | GPT Image 2 Prompts for Poster Design | strong-design | 25 |
| 2 | `/gpt-image-2-prompts/for-ecommerce-product-photos/` | GPT Image 2 Prompts for Ecommerce Product Photos | strong-commercial | 23 |
| 2 | `/gpt-image-2-prompts/for-infographics/` | GPT Image 2 Prompts for Infographics | strong-informational | 21 |
| 2 | `/gpt-image-2-prompts/for-stickers/` | GPT Image 2 Prompts for Stickers | medium-viral | 19 |
| 2 | `/gpt-image-2-prompts/for-instagram-photo-editing/` | GPT Image 2 Prompts for Instagram Photo Editing | trend-medium | 27 |
| 2 | `/gpt-image-2-prompts/for-character-design/` | GPT Image 2 Prompts for Character Design | strong-creative | 24 |

## Non-selected candidates

- `portrait-prompts`: broad-overlaps-cinematic — Strong demand but too broad; merge into cinematic portrait and Instagram/photo-edit sections for now.
- `anime-style-prompts`: medium-ip-risk — Search demand exists, but style/IP risk and model-comparison ambiguity make it a later candidate.
- `logo-design-prompts`: medium-tool-competitive — Demand exists, but SERP leans toward logo-maker tools; better P1 unless a real logo workflow ships.
- `cinematic-portrait-prompts`: merge-into-instagram — Strong evidence but overlaps with portrait and Instagram photo editing; use as sub-scene initially.
- `text-rendering-prompts`: strong-capability-not-use-case — Important capability; use as sections inside poster, infographic, UI, and product pages first.
- `social-media-ad-prompts`: p1-commercial — Good commercial P1 candidate, but product/ecommerce pages should absorb first version.
- `interior-design-prompts`: p1-niche — Visible SERP demand; keep for P1 after core GPT Image 2 prompt cluster ships.
- `multi-image-consistency-prompts`: capability-page-later — Important but best handled as a guide/capability page after cluster hubs exist.

## Method

- Google Suggest was fetched through the public suggestqueries endpoint with `hl=en&gl=us`.
- SERP notes and competitor domains were validated through live web search snapshots during Phase 2.
- `kd_estimate` is a coarse relative estimate, not a paid keyword-difficulty metric.
