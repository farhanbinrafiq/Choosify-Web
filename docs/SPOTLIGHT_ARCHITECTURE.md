# Spotlight Architecture

> **Phase 5.2 update:** Spotlight is now Choosify's **complete discovery ecosystem** — not only campaigns. Internal model: `SpotlightContent` + `contentType`. Universal detail page: `/spotlight/content/:slug`. See [SPOTLIGHT_CONTENT_MODEL.md](./SPOTLIGHT_CONTENT_MODEL.md).

**Sprint:** LE-005.1 — Spotlight Foundation & Architecture  
**Status:** Architecture only — no UI, no data migration, no feed implementation

---

## Product Vision

Spotlight is Choosify's **Marketing & Product Discovery Platform**. It is **not** social media.

Spotlight is a **Campaign Platform** that promotes:

- Products and product collections
- Brands and seasonal promotions
- Sales, launches, and events
- Buying guides
- Creator reviews (future)

The **Catalog remains the Single Source of Truth** for all merchandising data: name, price, specifications, images, brand, category, and inventory. Campaign documents store references (`linkedProductIds`, `primaryProductId`) — never duplicated product payloads.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CATALOG (Source of Truth)                    │
│  products · brands · categories · guides · creators · deals      │
└───────────────────────────────┬─────────────────────────────────┘
                                │ referenced by ID only
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SPOTLIGHT CAMPAIGN LAYER                       │
│  spotlight_campaigns — metadata, lifecycle, links, schedule      │
│  spotlight_media     — video/image assets                        │
│  spotlight_templates — reusable presets (future CMS)             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CAMPAIGN PLACEMENTS                            │
│  spotlight_placements — surface slots + priority + schedule      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
   Homepage              Spotlight Feed            Brand / Product
   (future)              (future)                  / Category (future)
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                    Future: Search · Recommendation · AI · Creator Hub
```

---

## Relationship Diagram

```
CatalogProduct (id: "prod-123")
        │
        │ linkedProductIds: ["prod-123", "prod-456"]
        │ primaryProductId: "prod-123"  ← card thumbnail, price, CTA
        ▼
SpotlightCampaign (campaignId: "camp-abc")
        │
        │ media: ["media-1", "media-2"]
        ▼
SpotlightMedia (mediaId: "media-1")
        │
        │ placementRules.surfaces: ["homepage", "spotlight_feed"]
        ▼
SpotlightPlacement (placementId: "place-xyz")
        │
        ▼
Surface Renderer (future sprint) → resolves CatalogProduct at render time
```

**Rules:**

1. One campaign may reference **one or many** catalog products.
2. When multiple products exist, exactly one may be marked `primaryProductId`.
3. Primary product drives homepage card, campaign thumbnail, displayed price, and CTA target.
4. Remaining products appear in campaign detail views (future sprint).

---

## Firestore Collection Structure

| Collection | Purpose | Document ID |
|------------|---------|-------------|
| `spotlight_campaigns` | Core campaign documents | `campaignId` |
| `spotlight_campaign_versions` | Immutable version snapshots (LE-005.3.1) | `campaignId` + `version` |
| `spotlight_campaign_collections` | Named campaign groupings (LE-005.3.1) | `collectionId` |
| `spotlight_campaign_localizations` | Locale-specific content (LE-005.3.1) | `campaignId` + `locale` |
| `spotlight_media` | Normalized media metadata | `mediaId` |
| `spotlight_templates` | Reusable layout presets | `templateId` |
| `spotlight_categories` | Campaign taxonomy (seasonal, vertical) | `categoryId` |
| `spotlight_placements` | Surface slot assignments | `placementId` |
| `spotlight_campaign_metrics` | Aggregated metrics snapshots | `campaignId` + date |
| `spotlight_moderation_events` | Audit trail for lifecycle | `eventId` |

**No migration or seed data in LE-005.1.**

### Recommended Indexes

| Collection | Fields | Use case |
|------------|--------|----------|
| `spotlight_campaigns` | `status`, `schedule.startAt`, `priority` DESC | Published campaigns for a surface |
| `spotlight_campaigns` | `campaignSlug` | Slug lookup |
| `spotlight_campaigns` | `linkedBrandIds` array-contains | Brand page campaigns |
| `spotlight_campaigns` | `primaryProductId` | Product page campaigns |
| `spotlight_placements` | `surface`, `isActive`, `priority` DESC | Placement resolution |
| `spotlight_media` | `mediaType`, `displayOrder` | Media carousel assembly |

Constants are defined in `src/types/spotlight/collections.ts`.

---

## Campaign Lifecycle

```
Draft
  ↓ submit
Pending Review
  ↓ approve          ↓ reject
Approved            Rejected → Draft
  ↓ schedule
Scheduled
  ↓ publish (manual or cron)
Published
  ↓ end date
Expired
  ↓ archive
Archived
```

State transitions are enforced via `SPOTLIGHT_CAMPAIGN_STATUS_TRANSITIONS` in `src/types/spotlight/lifecycle.ts`.

---

## Campaign Types

| Type | Entity focus |
|------|--------------|
| `single_product` | One catalog product |
| `multi_product` | Product collection |
| `brand_campaign` | Brand promotion |
| `category_campaign` | Category promotion |
| `seasonal_campaign` | Seasonal merchandising |
| `festival_campaign` | Festival/event |
| `promotion` | Sale/discount focus |
| `announcement` | Informational |
| `buying_guide` | Linked guide |
| `editors_pick` | Curated selection |
| `creator_campaign` | Future creator hub |
| `livestream` | Future live commerce |

---

## Media Model

Supported types (architecture):

| Type | Orientation | Use |
|------|-------------|-----|
| `vertical_video` | portrait | Reels-style feed |
| `landscape_video` | landscape | Hero / detail |
| `square_video` | square | Grid cards |
| `portrait_image` | portrait | Story cards |
| `landscape_image` | landscape | Banners |
| `square_image` | square | Thumbnails |
| `carousel` | mixed | Multi-slide |
| `mixed_media` | mixed | Video + image combo |
| `three_sixty` | — | Future |
| `ar` | — | Future |
| `livestream` | — | Future |

Media objects live in `spotlight_media`. Campaigns reference media by ID in the `media[]` array.

---

## Placement Strategy

| Surface | Status | Notes |
|---------|--------|-------|
| `homepage` | Planned | Replaces legacy `spotlight_section` placement |
| `spotlight_feed` | Planned | Dedicated discovery feed |
| `brand_page` | Planned | Contextual to `linkedBrandIds` |
| `product_page` | Planned | Contextual to `linkedProductIds` |
| `category_page` | Planned | Contextual to `linkedCategoryIds` |
| `search_results` | Future | ES-010 Discovery |
| `recommendation_rail` | Future | ES-010 Discovery |
| `homepage_hero` | Future | Full-width hero slot |

**Legacy coexistence:** Existing `CatalogPlacement` with `placement: 'spotlight_section'` and `sponsorType: 'spotlight_brand'` remains unchanged until a migration sprint.

Placement resolution priority: `priority` DESC → `featuredUntil` → `schedule.startAt`.

---

## CMS Architecture (Design Only)

### Current state

Homepage uses `CatalogPlacement` filtering for spotlight brands. No dedicated Spotlight CMS exists.

### Future CMS entry point

Replace conceptual **"Enable Spotlight"** toggle with **"Create Spotlight Campaign"** — a guided workflow:

| Editor section | Fields |
|----------------|--------|
| Campaign basics | name, slug, type, headline, sub-headline, description |
| Catalog links | product picker (multi), primary product selector, brand/category pickers |
| Media | upload/reorder video & images |
| CTA & schedule | CTA label/URL, start/end, timezone |
| Placement | surface checkboxes, priority, sponsored flag |
| Review | lifecycle status, approver, rejection reason |

Studio registry will gain a `spotlight` `StudioKind` in a future sprint. **No UI implemented in LE-005.1.**

---

## Future Integration Points

| Sprint | Interface | Location |
|--------|-----------|----------|
| ES-008 Analytics | `SpotlightAnalyticsRef`, `SpotlightAnalyticsEvent` | `integrations.ts` |
| ES-009 Moderation | `SpotlightModerationRef`, `SpotlightModerationEvent` | `integrations.ts` |
| ES-010 Discovery | `SpotlightDiscoveryRef` | `integrations.ts` |
| ES-011 Communication | `SpotlightCommunicationRef` | `integrations.ts` |
| ES-012 Emi AI | `SpotlightAiRef` | `integrations.ts` |
| Monetization | `SpotlightMonetizationRef` | `integrations.ts` |

API contract (read-only): `SpotlightApi` in `src/types/spotlight/api.ts`.

---

## Scalability

| Scale | Strategy |
|-------|----------|
| 1 campaign | Direct document read |
| 100 campaigns | Indexed queries by `status` + `surface` |
| 100,000 campaigns | Cursor pagination (`SpotlightCampaignPage`), summary documents (`SpotlightCampaignSummary`), metrics denormalized to `spotlight_campaign_metrics` |

Guardrails:

- `SPOTLIGHT_DEFAULT_PAGE_SIZE = 24`
- `SPOTLIGHT_MAX_LINKED_PRODUCTS = 50`
- Media normalized to separate collection (avoid large campaign docs)
- Product data always resolved at render time from catalog API

---

## TypeScript Module Map

```
src/types/spotlight/
├── index.ts           — barrel export
├── collections.ts     — Firestore names, indexes, guardrails
├── campaignTypes.ts   — campaign type union + metadata
├── campaign.ts        — SpotlightCampaign, summary, pagination
├── lifecycle.ts       — status, schedule, CTA, placement rules
├── scheduling.ts      — recurrence, blackout dates (LE-005.3.1)
├── versioning.ts      — version history, snapshots (LE-005.3.1)
├── objectives.ts      — campaign objectives (LE-005.3.1)
├── seo.ts             — SEO model (LE-005.3.1)
├── localization.ts    — multi-language content (LE-005.3.1)
├── targeting.ts       — audience targeting (LE-005.3.1)
├── budget.ts          — budget & ROI fields (LE-005.3.1)
├── relationships.ts   — parent/child/collections (LE-005.3.1)
├── assets.ts          — extended assets beyond media (LE-005.3.1)
├── keywords.ts        — separated keyword types (LE-005.3.1)
├── landingPage.ts     — dedicated landing page config (LE-005.3.1)
├── audit.ts           — extended audit metadata (LE-005.3.1)
├── approval.ts        — multi-stage approval levels (LE-005.3.1)
├── aiMetadata.ts      — future AI fields (LE-005.3.1)
├── health.ts          — campaign health score (LE-005.3.1)
├── media.ts           — media types + SpotlightMedia
├── placement.ts       — surfaces, placement records
├── template.ts        — template presets
├── integrations.ts    — future ES hook interfaces
├── resolvers.ts       — catalog resolution helpers
├── cms.ts             — CMS record, wizard, folders
└── api.ts             — read-only API contract
```

Import:

```typescript
import type { SpotlightCampaign, SpotlightCampaignType } from '../types/spotlight';
import { resolvePrimaryProductId } from '../types/spotlight';
```

---

## Future Roadmap

| Sprint | Scope |
|--------|-------|
| LE-005.2 | Spotlight Feed UI |
| LE-005.3 | Homepage carousel integration |
| LE-005.4 | Product / Brand / Category page placements |
| LE-005.5 | CMS campaign editor |
| ES-008 | Analytics pipeline |
| ES-009 | Moderation workflow |
| ES-010 | Discovery & search surfacing |
| ES-011 | Campaign notifications |
| ES-012 | Emi AI campaign assist |

---

## LE-005.3.1 — Enterprise Architecture Extensions

**Sprint:** LE-005.3.1 — Architecture enhancement only. No UI, no workflow changes, no breaking changes.

All new fields on `SpotlightCampaign` are **optional**. Existing CMS and storage continue to work without migration.

### Versioning

| Field | Purpose |
|-------|---------|
| `versioning.version` | Monotonic save counter |
| `versioning.publishedVersion` | Last published snapshot |
| `versioning.draftVersion` | Working draft version |
| `versioning.lastPublishedAt` | ISO timestamp |
| `versioning.lastPublishedBy` | Actor ID |
| `versioning.lastEditedBy` | Last editor |

Immutable snapshots stored in `spotlight_campaign_versions` (`SpotlightCampaignVersionSnapshot`). Rollback UI deferred.

### Campaign Objectives

`objective: SpotlightCampaignObjective` — product launch, brand awareness, sales, traffic, promotion, collection launch, seasonal, festival, event, creator, announcement, lead generation, custom.

Used by future analytics to segment performance by intent.

### SEO Architecture

`seo: SpotlightCampaignSeo` — meta title/description, slug, slug history, canonical URL, OpenGraph, Twitter card, robots directive, JSON-LD structured data.

No frontend SEO rendering in this sprint.

### Localization

`localization: SpotlightCampaignLocalization` — default language, available languages, per-locale headline/description/CTA/SEO.

Supported locale codes: `en`, `bn`, `ar`, `hi` (+ extensible). Large locale payloads may move to `spotlight_campaign_localizations`.

### Audience Targeting

`targeting: SpotlightAudienceTargeting` — everyone flag, gender, age groups, geo (country/division/district), audience segments (buyer, seller, wholesale, gaming, fashion, etc.).

No filtering implementation — architecture only.

### Campaign Budget

`budget: SpotlightCampaignBudget` — budget, currency, estimated reach/clicks/sales, actual spend, future ROI.

Aligns with `SpotlightMonetizationRef` in integrations. No payment integration.

### Campaign Hierarchy

`relationships: SpotlightCampaignRelationships` — parent campaign, child campaigns, collection membership, related campaigns.

Example hierarchy:

```
Samsung Launch (parent)
├── Galaxy Phone (child)
├── Galaxy Watch (child)
└── Galaxy Buds (child)
```

Collections stored in `spotlight_campaign_collections`.

### Campaign Assets

`assets: SpotlightCampaignAsset[]` — extends media with PDF, spec sheet, manual, coupon, external link, download, brochure, AR package, 3D model, interactive demo.

Media references use `mediaId`; files use `url`.

### Campaign Keywords (Separated)

`keywords: SpotlightCampaignKeywords` — distinct arrays:

| Key | Purpose |
|-----|---------|
| `campaignTags` | Operator tags |
| `seoKeywords` | Meta keywords |
| `searchKeywords` | On-site search |
| `internalLabels` | CMS-only |
| `aiLabels` | Future AI |
| `recommendationLabels` | Future discovery |

Root `campaignTags` retained for backward compatibility.

### Campaign Landing Pages

`landingPage: SpotlightCampaignLandingPageConfig` — dedicated public page at `/spotlight/{slug}`.

Sections: hero, media, campaign story, featured products, collection, buying guide, related campaigns, brand info, CTA, reviews (future).

No frontend implementation.

### Audit Fields

`audit: SpotlightCampaignAudit` — updatedBy, publishedBy, archivedBy, moderatedBy, lastModeratedAt, approvalComment, rejectionReason, approvalHistory.

Root `createdBy` / `approvedBy` / `rejectedReason` remain for Firestore index queries.

### Multi-Stage Approval (CTO)

`approvalStage: SpotlightApprovalStage` tracks granular progress alongside existing `status`:

```
draft → seller_review → moderator_review → marketing_review → legal_review (future) → approved → published
```

`approvalHistory` records each stage transition. Existing single-step workflow unchanged.

### Enhanced Scheduling (CTO)

`schedule` extended with:

| Field | Purpose |
|-------|---------|
| `startAt` / `endAt` | Active window (aliases: startDate/endDate) |
| `timezone` | IANA timezone |
| `recurrence` | Daily/weekly/monthly/yearly/custom |
| `blackoutDates` | Suppressed dates within window |
| `autoExpire` | Auto-transition to expired |

### Campaign Health Score (CTO)

`campaignHealthScore` (0–100) denormalized on campaign root for list queries.

`health: SpotlightCampaignHealth` holds factor breakdown: completion rate, CTR, purchases, review quality, media quality, AI optimization score.

Calculated by future seller dashboard — field reserved now.

### Future AI Metadata

`aiMetadata: SpotlightCampaignAiMetadata` — aiGeneratedHeadline/Summary/Tags/CTA, performancePrediction, recommendedPublishTime, optimizationScore.

Aligns with `SpotlightAiRef` in integrations. No AI implementation.

### Future Monetization

`budget` + `SpotlightMonetizationRef` prepare for sponsored campaigns, CPM/CPC, spend caps. No billing integration.

### Interface Consolidation (Section 13)

- `SpotlightCampaignRecord` now extends `SpotlightCampaign` + `SpotlightCampaignCmsMeta` (removed field duplication)
- Enterprise fields grouped in optional nested objects (Firestore-friendly)
- Root fields kept where indexed queries need them (`campaignSlug`, `status`, `createdBy`)
- Deprecated markers on `campaignTags` / `rejectedReason` — prefer `keywords` / `audit` going forward

### New Firestore Collections

| Collection | Purpose |
|------------|---------|
| `spotlight_campaign_versions` | Immutable version snapshots |
| `spotlight_campaign_collections` | Named campaign groupings |
| `spotlight_campaign_localizations` | Large locale payloads |

---

## Breaking Changes

**None.** LE-005.1 and LE-005.3.1 add optional type modules and fields only. No existing types, APIs, routes, CMS workflow, or UI were modified.

---

## Related Docs

- `src/types/catalog.ts` — `CatalogProduct`, legacy `CatalogPlacement`
- `src/lib/placements.ts` — legacy placement slot keys
- `docs/COMPONENT_ARCHITECTURE.md` — storefront component structure (LE-004)
