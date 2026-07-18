# Spotlight Content Page — LE-005 UX-08

## Universal Architecture

Choosify uses **one** Spotlight Content Page for every content type. There are no separate detail pages for guides, reviews, blogs, reels, live events, or comparisons.

| Canonical route | Page component |
|-----------------|----------------|
| `/spotlight/:slug` | `src/pages/SpotlightContentPage.tsx` |

Every Spotlight card, search result, and legacy redirect resolves to this route via `spotlightContentHref()`.

**Legacy redirect:** `/spotlight/content/:slug` → `/spotlight/:slug` (`LegacySpotlightContentRedirect`)

---

## Design Constraint

The approved **Guide Details** visual shell is preserved. UX-08 is architecture only — no layout, spacing, typography, or hero redesign.

Rendering shell: `GuideDetailPage` with Spotlight overrides and a CMS-driven section manifest.

---

## Page Shell Order (Fixed)

The visual structure never changes. Only which sections appear varies per content record:

1. Hero Media
2. Content Summary
3. Dynamic Content Sections
4. Associated Products / Services
5. Publisher Information
6. Related Spotlight Content

---

## Section-Driven Rendering Engine

**Enterprise rule:** Sections are **not** determined solely by `contentType`.

Each `SpotlightContent` record may include a `pageSections` configuration from the CMS:

```ts
pageSections?: SpotlightPageSectionConfig[];

interface SpotlightPageSectionConfig {
  id: SpotlightPageSectionId;
  visible: boolean;
  order?: number;
}
```

### Resolution flow

1. If `content.pageSections` exists → use CMS configuration.
2. Otherwise → fall back to `defaultSectionsForContentType(contentType)` templates.
3. Filter to sections where `visible === true` **and** `sectionHasData(content, id)` is true.
4. Sort by explicit `order`, then `SPOTLIGHT_PAGE_SHELL_ORDER`.

**Registry:** `src/lib/spotlight/content/sectionManifestRegistry.ts`  
**Section IDs:** `src/types/spotlight/experience/pageSections.ts`

### No empty placeholders

If a section has no data, it is not rendered — even when marked visible in CMS.

---

## Supported Sections

| Section ID | Purpose |
|------------|---------|
| `hero_media` | Image, landscape/portrait/square video, embeds |
| `content_summary` | Headline / summary block |
| `media_gallery` | Attached gallery |
| `description` | Body / article text |
| `live_status` | Live / upcoming / replay badge |
| `schedule` | Event timing |
| `countdown` | End-date countdown |
| `winner` | Guide winner block |
| `why_it_won` | Winner rationale |
| `verdict` | Quick verdict |
| `takeaways` | Key takeaways |
| `pros` / `cons` | Review pros and cons |
| `top_picks` / `top_3` / `top_5` | Ranked picks |
| `products_reviewed` | Products in review context |
| `comparison_table` | Side-by-side comparison |
| `associated_products` | Product cards (reuse existing) |
| `associated_services` | Service attachments |
| `brand_profile_card` | Brand mini profile |
| `creator_profile_card` | Creator mini profile |
| `related_spotlight` | Related content rail |
| `tags` / `share` | Metadata and share |
| … | See `SPOTLIGHT_PAGE_SECTION_IDS` for full list |

Future sections (discussion, comments) are reserved in the type union.

---

## Content Type Default Templates

Defaults in `sectionManifestRegistry.ts` are **starting templates only**. CMS overrides always win.

| Content type | Typical visible sections |
|--------------|-------------------------|
| `live` | hero, summary, live_status, schedule, description, products, brand card, related |
| `buying_guide` | hero, gallery, winner, why_it_won, pros/cons, verdict, takeaways, top picks, products reviewed, creator card, products, related |
| `product_review` | hero, gallery, pros/cons, verdict, products reviewed, products, brand/creator cards, related |
| `recommendation` / reel-style | hero, gallery, description, products, brand card, related |
| `editorial` | hero, gallery, article, products, creator card, related |
| `comparison` | hero, comparison table, products compared, winner, pros/cons, verdict, takeaways, creator card |

Editors can add or remove sections on any individual record without frontend changes.

---

## Publisher Types

| `publisherType` | Section rendered |
|-----------------|------------------|
| `brand` | `brand_profile_card` → `SpotlightBrandMiniCard` (Product Details pattern) |
| `creator` / `influencer` | `creator_profile_card` → existing Guide Details reviewer profile |

Brand and creator cards are not shown together unless both are explicitly enabled in `pageSections` and data exists.

---

## Associated Products

When `associated_products` (or related product sections) are visible and product IDs exist:

- Reuses existing **ProductCard** components from Guide Details
- Supports View Product, Compare, Wishlist, Add to Cart, Buy Now — no card redesign

---

## Media Hero

Hero auto-detects media from `SpotlightContent.media` and live embeds:

- Images, landscape video, portrait reel, square video
- YouTube, Facebook, Instagram, TikTok, Vimeo embeds
- Mixed media / gallery fallback

Variant resolution: `resolveHeroVariant()` in `src/utils/spotlightMixedFeed.ts`

---

## CMS Relationship

| CMS controls | Frontend responsibility |
|--------------|-------------------------|
| Content type | Default section template |
| `pageSections` | Authoritative section manifest |
| Attached products/services | Product/service sections |
| Publisher type | Brand vs creator card |
| Media & attachments | Hero and gallery sections |

**The CMS controls the page. The frontend renders the page.**

---

## Key Files

| File | Role |
|------|------|
| `src/pages/SpotlightContentPage.tsx` | Universal page entry |
| `src/pages/GuideDetailPage.tsx` | Approved visual shell + conditional sections |
| `src/lib/spotlight/content/sectionManifestRegistry.ts` | Manifest resolution |
| `src/lib/spotlight/content/index.ts` | `spotlightContentHref()` |
| `src/utils/spotlightContentResolver.ts` | Slug → `SpotlightContent` |
| `src/components/spotlight/experience/SpotlightLiveStatusSection.tsx` | Live status block |
| `src/components/spotlight/experience/SpotlightBrandMiniCard.tsx` | Brand publisher card |

---

## Legacy Routes

| Legacy path | Behavior |
|-------------|----------|
| `/guides/:id` | `LegacyGuideContentRedirect` → `/spotlight/:slug` |
| `/reviews/:slug` | Same |
| `/blogs/:id` | Same |
| `/recommendations/:id` | `/spotlight/:slug` |
| `/spotlight/content/:slug` | Redirect to `/spotlight/:slug` |

`/spotlight/live/:slug` remains the interactive live commerce route (registered before `/spotlight/:slug`).

---

## Future Extensibility

1. Add a new `SpotlightPageSectionId` to `pageSections.ts`.
2. Implement the section UI in `GuideDetailPage` or a dedicated section component.
3. Register default visibility in `sectionManifestRegistry.ts` (optional).
4. Enable per-record via CMS `pageSections` — **no new routes or page layouts required.**

---

## Out of Scope (UX-08)

- Homepage, Recommendation feed, Spotlight feed cards, Product Details, Brand Details, Creator Reviews — unchanged
- Visual redesign of the content page
- Discussion / comments sections (future)

---

## Details Intelligence Framework — LE-006.2 Phase 2

Frontend-only extension of the universal page. **One layout, intelligent sections.**

### Page shell (fixed order)

```
Hero Media Gallery → Content Information → Associated Products → Associated Services (optional)
→ Brand or Creator Profile → Guide Sections (if guide) → Related Spotlight → Related Products → Share
```

### Section intelligence

| Archetype | Visible sections | Hidden |
|-----------|------------------|--------|
| Buying Guide | Hero, winner, why it won, verdict, takeaways, pros/cons, top picks, products reviewed, creator card, products, related | Live status |
| Product Review | Hero, summary, description, pros/cons, verdict, specs, products, brand + creator cards, related products | Winner, top picks |
| Live Event | Hero, live status, description, products, services, brand/creator cards, related | Winner, guide sections |
| Brand Campaign | Hero, description, products, brand card, related | Guide sections, verdict |
| Offer | Hero, description, pricing/offer, products, brand card | Guide sections |
| Collection | Hero, description, gallery, products, brand card, related | Guide sections |
| Editorial | Hero, article, products, author/creator, optional brand | Guide sections |
| Service | Hero, description, pricing, services, brand card, contact CTA | Guide sections |

Templates: `src/lib/spotlight/content/sectionManifestRegistry.ts`  
Demo manifests: `src/data/spotlight/spotlightDetailsDemos.ts`

### Demo slugs (placeholder until CMS)

| Slug | Archetype |
|------|-----------|
| `/spotlight/demo-guide` | Buying Guide |
| `/spotlight/demo-campaign` | Brand Campaign |
| `/spotlight/demo-review` | Product Review |
| `/spotlight/demo-offer` | Offer |
| `/spotlight/demo-live` | Live Event |
| `/spotlight/demo-collection` | Collection |

Demo overlay applied in `SpotlightContentPage` via `applySpotlightDetailsDemoOverlay()`.

### New section components

| Component | Role |
|-----------|------|
| `SpotlightDetailsDescriptionSection` | Article / campaign / event body |
| `SpotlightDetailsServicesSection` | Associated services strip |
| `SpotlightDetailsRelatedRail` | Related Spotlight cards (4 desktop / 2 tablet / 1 mobile) |

### Hero media

`SpotlightContentHero` receives full `media` + `live` from `SpotlightContent` — supports portrait reels, landscape video, carousel, embeds via `ChoosifyCommerceMediaGallery`. Natural aspect ratios preserved.

### Publisher cards

- Brand: `SpotlightBrandMiniCard` (Product Details pattern)
- Creator: existing Guide Details reviewer profile
- Mutual exclusion: brand publisher shows brand card only; creator shows creator card; both only when data supports each (`shouldShowBrandProfileCard` / `shouldShowCreatorProfileCard`)

### Related content

`SpotlightDetailsRelatedRail` uses `UniversalCommerceCard` with publisher header. Links stay on Spotlight (`/spotlight/:slug`) — never loops users back unnecessarily. Grid class: `choosify-spotlight-related-grid`.

### What did NOT change (LE-006.2)

- Routing (`/spotlight/:slug` only)
- Backend, CMS, APIs, Firestore
- Homepage, feed, product/brand/creator pages, checkout, dashboard
- Guide Details visual design (hero, typography, spacing)
