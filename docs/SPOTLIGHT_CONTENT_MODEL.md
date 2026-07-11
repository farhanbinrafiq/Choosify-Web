# Spotlight Content Model — LE-005 Phase 5.2

## Vision

**Spotlight** is Choosify's single discovery ecosystem. The standalone **Discover** module is retired. Every discoverable artifact is a `SpotlightContent` record with a `contentType`.

| Public brand | Internal model |
|--------------|----------------|
| Spotlight | `SpotlightContent` |

---

## Unified Content Model

Each `SpotlightContent` item contains:

| Field | Source |
|-------|--------|
| Content Type | `contentType` — determines rendering |
| Publisher | `publisher` — brand, creator, editorial |
| Products | `connections.productIds` |
| Media | `media` — UniversalMedia |
| Body / description | `description`, guide detail for rich types |
| CTA | `ctaLabel`, `commerce.primaryCta` |
| Tags / badges | `badges`, campaign tags |
| Collections / Series | graph + discovery surfaces |
| Status / visibility | campaign status, `isVerified`, `isSponsored` |
| Metrics | `popularityScore`, `discoveryScore` |
| SEO / AI | campaign SEO, `aiScore`, `aiMetadata` |

**Types:** `src/types/spotlight/experience/content.ts`  
**Content types:** `src/types/spotlight/experience/contentTypes.ts`

---

## Registries (`src/lib/spotlight/content/`)

| Registry | Purpose |
|----------|---------|
| `contentTypeRegistry` | All content types, tab mapping, legacy guide mapping |
| `rendererRegistry` | Layout strategy per content type |
| `ctaRegistry` | CTA labels |
| `publisherRegistry` | Publisher profiles (secondary destinations) |
| `mediaRegistry` | Media type metadata |
| `relationshipGraph` | Product/brand/creator/campaign edges |

Platform routing: `src/lib/platform/contentRegistry.ts` → all primary routes use `/spotlight/content/:slug`

---

## Universal Content Page

**Route:** `/spotlight/content/:slug`  
**Page:** `src/pages/SpotlightContentPage.tsx`

- Resolves `SpotlightContent` via `getSpotlightContentBySlug()`
- **Guide-rich types** delegate to `GuideDetailPage` (reuses existing layout)
- **Campaign / brand post / creator** use unified Spotlight shell
- Publisher profiles linked as **secondary** destinations

Legacy redirects (no content deleted):

| Legacy | Redirect |
|--------|----------|
| `/guides` | `/spotlight?tab=guides` |
| `/guides/:id` | `/spotlight/content/:slug` |
| `/reviews/:slug` | `/spotlight/content/:slug` |
| `/recommendations` | `/spotlight?tab=recommendations` |
| `/blogs` | `/spotlight?tab=blogs` |

---

## Routing Philosophy

Every Spotlight card opens **Spotlight Content Page** — not creator/brand/seller profiles directly.

Profiles become **libraries** with links into Spotlight Content.

Resolver: `src/utils/spotlightContentResolver.ts`  
Href builder: `spotlightContentHref()` in `src/lib/spotlight/content/index.ts`

---

## Navigation

Primary nav (no Discover):

Home · Categories · **Spotlight** · Products · Brands · Compare · Deals · Creators

Spotlight tabs (`SPOTLIGHT_CONTENT_TABS`):

Featured, Campaigns, Live, Reviews, Guides, Recommendations, Videos, Reels, Blogs, Collections, Series, Announcements, Launches, Following, Saved

---

## CMS

Single editor: **Spotlight Campaign CMS** (`SpotlightCampaignEditorPage`)

Publisher selects **campaign type** → maps to `SpotlightContentType` via `CAMPAIGN_TYPE_TO_CONTENT`. No separate editors per content type.

---

## Search

Global search UI keeps "Discover..." placeholder. Results return unified **Spotlight Content** plus products, brands, categories, collections, series.

---

## Future AI (Phase 6)

Emi AI only needs to understand:

1. `SpotlightContent`
2. `contentType`

---

## Future Monetization (Phase 7)

All sponsored placements become **Sponsored Spotlight Content** — one billing architecture.
