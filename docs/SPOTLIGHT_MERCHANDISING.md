# Spotlight Merchandising Engine

**Sprint:** LE-005.4 — Campaign Merchandising Engine  
**Status:** CMS merchandising layer — not public feed, homepage, or landing pages

---

## Overview

Transforms Spotlight campaigns from simple product attachment into **intelligent merchandising experiences**. Catalog remains SSOT — campaigns store product IDs, roles, slots, and rules only.

```
Campaign
├── Merchandising Slots (CTO)
│   ├── Hero Product
│   ├── Featured Products
│   ├── Recommended
│   ├── Accessories
│   ├── Bundles
│   └── Alternatives
├── Product Links (role + order + pin)
├── Collections (manual, brand, category, smart)
├── Bundles (campaign-only)
├── Rule Engine (smart + conditional)
└── Quality Score (completeness)
```

---

## Product Merchandising

| Attach mode | Description |
|-------------|-------------|
| Single / Multi product | Catalog picker |
| Entire brand | All products matching `brandId` |
| Entire category | All products matching `categoryId` |
| Saved collection | Campaign-scoped collection |
| Dynamic collection | Smart rules (architecture only) |

---

## Product Roles

| Role | Slot | Limit |
|------|------|-------|
| Hero | `hero` | **1 only** |
| Featured | `featured` | — |
| Accessory | `accessories` | — |
| Bundle | `bundles` | — |
| Recommended | `recommended` | — |
| Alternative | `alternatives` | — |
| Upsell / Cross-sell | featured / recommended | — |
| Limited offer | featured | — |
| AI recommended | `ai_picks` | Future |

---

## Product Search

Filters: name, SKU, brand, category, seller, tag, price, status, stock, recently updated, verified seller.

Sort: newest, oldest, popularity, alphabetical, price, rating.

Selection: single, multi, bulk attach/remove, pin, role assignment, duplicate detection.

---

## Campaign Slots (CTO)

Default slots defined in `SPOTLIGHT_DEFAULT_MERCHANDISING_SLOTS`. Landing page renderer (future) reads slots — not hard-coded positions.

---

## Collection Types

| Type | Description |
|------|-------------|
| `manual` | Hand-picked products |
| `brand` | Brand-scoped |
| `category` | Category-scoped |
| `campaign` | Campaign grouping |
| `saved` | Reusable saved collection |
| `smart` | Rule-driven (no execution yet) |

Manager supports: create, rename, duplicate, delete, assign, move, merge.

---

## Smart Collections (Architecture)

```typescript
interface SpotlightSmartCollectionRule {
  includeRules: SpotlightMerchandisingRuleGroup;
  excludeRules?: SpotlightMerchandisingRuleGroup;
  priorityRules?: SpotlightMerchandisingRuleGroup;
  aiRules?: SpotlightMerchandisingRuleGroup;
}
```

Example: `Brand = Samsung AND Category = Phones AND Stock > 0`

---

## Rule Engine

Fields: brand, category, seller, price_range, discount, rating, review_count, availability, stock, verified_seller, campaign_tags, dates, ai_score, trust_score, popularity_score.

Operators: equals, not_equals, contains, greater_than, less_than, between, in, not_in.

---

## Conditional Merchandising (CTO)

Architecture only — examples:

- Product out of stock → replace with alternative OR hide
- Campaign ended → remove homepage placement → archive

See `SpotlightConditionalMerchandisingRule`.

---

## Bundle Model

Campaign-only bundles — never modify catalog:

```
Bundle
├── heroProductId
├── accessoryProductIds[]
├── recommendedProductIds[]
└── upsellProductIds[]
```

---

## Validation Rules

Publish checks:

- Product exists in catalog
- Product status `live`
- Hero product assigned (exactly one)
- No duplicate product IDs
- Stock available for hero
- Media present
- Brand/category active (when linked)

---

## Product Health Warnings

Out of stock, low inventory, low rating, hidden, draft, archived, deleted, pending review, trust/performance (future).

---

## Campaign Quality Score (CTO)

Measures **completeness** (not performance):

| Factor | Weight |
|--------|--------|
| Hero media | Core |
| Hero product | Core |
| CTA configured | Core |
| Schedule | Core |
| Placements | Core |
| Brand linked | Core |
| Products verified | Core |
| Accessories / bundles | Bonus |

---

## Merchant Guidance (CTO)

Rule-based CMS tips:

- "Your campaign is missing a Hero Product."
- "Adding accessories typically improves conversion."
- "Consider adding a landscape image for homepage placement."

Future: Emi AI-generated guidance via ES-012.

---

## AI Preparation (ES-012)

`SpotlightAiMerchandisingServiceContract` — frequently bought together, alternatives, bundle suggestions, trending, seasonal, best value.

---

## Analytics Preparation (ES-008)

Per-product metrics: views, CTR, wishlist, compare, purchases, bundle purchases, revenue, conversion.

---

## Discovery Preparation (ES-010)

Featured, recommended, trending products, campaign ranking, collection ranking.

---

## Module Map

```
src/types/spotlight/merchandising/
src/utils/spotlightMerchandising*.ts
src/utils/spotlightProductSearch.ts
src/utils/spotlightProductHealth.ts
src/utils/spotlightCampaignQuality.ts
src/hooks/useSpotlightMerchandising.ts
src/hooks/useSpotlightProductSearch.ts
src/components/spotlight/merchandising/
src/services/spotlightMerchandisingStorage.ts
```

---

## Scalability

| Scale | Strategy |
|-------|----------|
| 1–10 products | Inline `productLinks[]` on campaign doc |
| 100 products | Paginated search, ordered links |
| 1,000 products | Cursor search, slot-based rendering, collection subdocs |
| 1,000+ collection | `spotlight_campaign_collections` subcollection |

---

## Related Docs

- [SPOTLIGHT_CAMPAIGN_MANAGER.md](./SPOTLIGHT_CAMPAIGN_MANAGER.md)
- [SPOTLIGHT_API.md](./SPOTLIGHT_API.md)
- [SPOTLIGHT_ARCHITECTURE.md](./SPOTLIGHT_ARCHITECTURE.md)
