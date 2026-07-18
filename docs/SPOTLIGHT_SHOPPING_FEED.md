# Spotlight Shopping Feed — LE-005 UX-02

**Master UX refinement.** Spotlight is Choosify's **Shopping Discovery Feed** — not a social video platform, creator hub, or YouTube clone.

All existing Spotlight architecture (CMS, content model, intelligence, opportunity center, experience builder) is **reused**. Nothing was deleted; the experience was reorganized around commerce.

---

## Shopping-first philosophy

Every interaction should answer:

> What product or service is being promoted, and how do I buy with confidence?

**Correct hierarchy**

```
Media
    ↓
Product / Service
    ↓
Primary CTA (Shop Now)
    ↓
Brand
    ↓
Creator (small, secondary)
```

Content exists **only** to support buying decisions. Users should feel *"I found a product"* — not *"I watched another video."*

Reference inspirations (principles only, not copies): Instagram Shopping, TikTok Shop, Amazon Inspire, Pinterest Shopping.

---

## Feed architecture

| Layer | Location | Role |
|-------|----------|------|
| **Feed config** | `src/lib/spotlight/feed/feedRegistry.ts` | Philosophy, lazy sections, filter IDs |
| **Section registry** | `src/lib/spotlight/feed/sectionRegistry.ts` | Commerce-first order, 6–10 items per section |
| **Card registry** | `src/lib/spotlight/feed/cardRegistry.ts` | 20+ adaptive card modes + vertical hints |
| **Media registry** | `src/lib/spotlight/feed/mediaRegistry.ts` | Natural ratios (9:16, 16:9, 1:1, 4:5, 3:4) |
| **Layout registry** | `src/lib/spotlight/feed/layoutRegistry.ts` | Structured grid (NOT masonry) + mobile vertical |
| **Content renderer** | `src/lib/spotlight/feed/contentRendererRegistry.ts` | Universal content page hero variants |

Master index: `SPOTLIGHT_FEED_MASTER_REGISTRY` in `src/lib/spotlight/feed/index.ts`.

Phase 5.5.1 experience registries (`src/lib/spotlight/experience/`) remain the implementation layer; UX-02 feed registries are the canonical CTO naming.

---

## Adaptive layout strategy

### Mobile (primary)

- **Vertical scroll feed** — one card per row
- Each card keeps **native media aspect ratio** (Instagram/TikTok familiarity)
- Commerce CTAs remain visible; product association never hidden
- Component: `SpotlightCommerceFeedGrid` → mobile column via `MOBILE_VERTICAL_FEED_CLASS`

### Desktop

- **Structured 4-column commerce grid** — portrait, landscape, square, and feature cards mixed with defined column spans
- **NOT Pinterest masonry** — explicit `md:col-span-*` placement from `layoutRegistry.ts`
- Portrait reels: 1 col × 2 rows; landscape/live: 2 cols × 1 row
- Component: `SpotlightCommerceFeedGrid` → desktop grid via `DESKTOP_COMMERCE_GRID_CLASS`

Carousels and hero sections unchanged for featured/trending rows.

---

## Card types

Supported via `SPOTLIGHT_CARD_REGISTRY` (extends Phase 5.5.1 adaptive cards):

| Category | Modes |
|----------|-------|
| Video | `portrait_reel`, `landscape_video`, `square_post`, `live_card` |
| Static | `image_card`, `carousel_card`, `announcement` |
| Commerce | `product_highlight`, `service_highlight`, `offer_card`, `product_launch`, `campaign_banner` |
| Editorial | `guide_card`, `review_card`, `comparison_card`, `brand_feature`, `collection_feature`, `series_episode` |

Vertical industry hints (restaurant, hotel, travel, healthcare, etc.) resolve from category/headline for future vertical cards.

Renderer: `SpotlightCardRenderer` — commerce-first body order, `data-card-mode` / `data-density` attributes.

---

## Universal Spotlight Content Page

**One destination** for all card types — no separate Guide/Review/Campaign detail routes.

Route: `/spotlight/:slug` → `SpotlightContentPage`

| Content type | Hero variant |
|--------------|--------------|
| Reel | Portrait player |
| Video | Landscape player |
| Square video | Square player |
| Gallery / carousel | Carousel |
| Live | Live player |
| Replay | Replay player |
| Article / guide | Hero image |

Rich guides still delegate to `GuideDetailPage` when `reusesGuideDetail` is set in `rendererRegistry.ts`.

Page section order (from `contentRendererRegistry.ts`):

1. Hero media → Title → Brand card → Creator (small) → Description  
2. Associated products / services → Offers → Compare → Wishlist  
3. Related Spotlight → Brand profile → Creator profile → Related content  

Renderer: `SpotlightContentRenderer`

---

## Feed sections (UX-02 order)

Primary visible sections (6–10 items each, View More links):

1. Featured Spotlight  
2. Trending  
3. Latest  
4. Live  
5. Popular Reviews  
6. Buying Guides  
7. Collections  
8. Series  
9. Offers & Campaigns  

Lazy-loaded below the fold via `SpotlightLazySection`.

---

## Floating filters

Persistent Choosify floating filter (`useSpotlightFloatingFilters`) with full UX-02 set:

All · Products · Services · Videos · Reels · Shorts · Live · Reviews · Guides · Brands · Offers · Collections · Series · Nearby · Trending · Saved · Following

Scroll target: `#spotlight-feed`

---

## Commerce CTAs

Primary: **Shop Now**  
Secondary: Product Details · Compare · Wishlist · Save · Share  

Commerce actions appear **before** social/creator actions on every card and content page.

---

## Reuse (no duplication)

- `SpotlightCommerceStrip`, `ProductCard`, `SpotlightPublisherRow`
- `GuideDetailPage` for rich guide/review layouts
- `PremiumCarousel`, `FilterEngine` floating filters
- Existing impression tracking, lazy sections, Emi `EmiSpotlightAssistant`

---

## Future AI integration

Registries expose stable IDs (`data-card-mode`, `data-grid-placement`, hero `variant`) for:

- Emi feed ranking and "why this product" explanations  
- Opportunity Center commerce gap detection  
- Publisher Experience Builder preview modes  

No backend or Firestore changes in UX-02.

---

## What did NOT change

- Homepage, Products, Brands, Categories  
- Spotlight CMS, backend contracts, intelligence, opportunity center  
- Choosify color palette and global design tokens  

---

## Version

`SPOTLIGHT_SHOPPING_FEED.version` = **UX-06**

---

## Universal Commerce Card (UX-06)

**Master design:** Original Recommendation page cards (`RecommendationCard.tsx`, `GuideMediaCards`).

Spotlight Feed cards were restored to Choosify's premium commerce card language — not a generic editorial/CMS card.

| Component | Path | Role |
|-----------|------|------|
| **UniversalCommerceCard** | `src/components/content/UniversalCommerceCard.tsx` | Single card for all mixed-media surfaces |
| **Media renderer** | `CommerceCardMedia` (internal) | Only layer that changes per content type |
| **Adapters** | `src/components/content/contentCardAdapters.ts` | Spotlight / Guide / Creator preview → card model |
| **Legacy alias** | `UniversalContentCard` | Thin wrapper delegating to `UniversalCommerceCard` |

### Variants (media only)

Layout, typography, spacing, badges, metadata, footer, and hover model stay **identical**. Only the media area adapts:

| Variant | Aspect | Use |
|---------|--------|-----|
| `landscape-video` | 16:10 | YouTube reviews, landscape video |
| `portrait-reel` | 9:16 | Instagram / TikTok reels (slightly taller card) |
| `blog` / `guide` | 16:10 | Buying guides, editorials (no play icon when no video) |
| `image` | 16:10 | Image stories, carousel covers |
| `square` | 1:1 | Square posts |
| `live` | 16:10 | Live thumbnail / embed |

Resolve variant: `resolveCommerceCardVariant(layoutVariant, aspectRatio)`.

### Card hierarchy (commerce / preview body)

```
Media → Content Badge → Title → Short Description → Product → Price → Creator → Date → Views → Compact CTA
```

- **CTA:** Compact secondary label + arrow circle (Recommendation footer style). No full-width orange buttons.
- **Footer:** Heart · Eye · Share stats + small `Read Review` / `Watch Review` / `Read Guide` label.
- **Editorial reels:** Media-only overlay (matches Recommendation reel cards on Guides page).

### Surfaces using one card

- Spotlight Feed (`SpotlightMixedFeed` → `mode="commerce"`)
- Recommendation / Guides grid (`GuideMediaCards` → `mode="editorial"`)
- Creator Reviews preview (`CreatorReviewsPreview` → `mode="preview"`)
- Future mixed-media discovery feeds

Grid: `GUIDE_MEDIA_GRID` — 1 col mobile, 2–3 tablet, 4–5 desktop. Mixed media interleaved via `mixSpotlightFeedItems()`.

### Removed (UX-06)

- Oversized orange `Shop Now` CTA buttons on feed cards
- Giant `Watch Review` primary buttons
- Editorial italic headline styling on feed cards
- Spotlight-only card fork (`SpotlightShoppingFeedCard` now re-exports `UniversalCommerceCard`)

### What did NOT change (UX-06)

- Spotlight Details page, Guide Details page, Homepage, Navigation, Filters
- Spotlight CMS, intelligence, opportunity center architecture

---

## Creator Reviews Preview (UX-05)

Compact **Spotlight Preview** on Product Details and Brand Details — not a second feed inside the page.

| Surface | Component | Grid |
|---------|-----------|------|
| Product Details | `CreatorReviewsPreview` (`context="product"`) | `GUIDE_MEDIA_GRID` (max 4 visible) |
| Brand Details | `CreatorReviewsPreview` (`context="brand"`) | `GUIDE_MEDIA_GRID` (max 6 visible) |

Utilities: `src/utils/creatorReviewsPreview.ts`

Cards reuse `UniversalCommerceCard` with `mode="preview"` — same visual language as Spotlight feed cards, without oversized CTAs.

### Adaptive review limits (Product)

| Total reviews | Visible cards | View All |
|---------------|---------------|----------|
| 1 | 1 | Hidden |
| 2 | 2 | Hidden |
| 3 | 3 | Hidden |
| 4 | 4 | Hidden |
| 5+ | Best 4 | Shown → `/spotlight?tab=reviews&product={id}` |

Pool capped at **10 uploads** per product (recommended default **5** in CMS).

### Brand pages

Up to **6** preview cards. View All when more exist → `/spotlight?tab=reviews&brand={id}`.

### Featured Review (CTO)

Sellers/admins may pin one featured review via `featuredContentId` prop (Spotlight `contentId` or `sourceId`), or badge `featured` / `Featured Review`. Featured item always ranks first; remaining slots fill by discovery score, popularity, and recency.

### Mixed media

One grid — reels, landscape video, guides, comparisons, live replays interleaved via `mixSpotlightFeedItems()` (no type-separated sections).

### View All Reviews

Opens Spotlight on the **reviews** tab with `product` or `brand` query params. Discover page applies entity filter client-side (no feed redesign).

### What did NOT change (UX-05)

- Product / Brand page layout outside Creator Reviews section  
- Spotlight Feed, Homepage, Recommendation pages  
- Legacy `InfluencerReviews.tsx` retained for reference; detail pages use `CreatorReviewsPreview`

---

## Commerce Feed Evolution — LE-006 Phase 1

Frontend-only upgrade of the Spotlight Feed into a premium commerce discovery feed. No backend, CMS, API, routing, or data-model changes.

### Sticky filter bar

`SpotlightFeedFilterBar` (`src/components/spotlight/feed/SpotlightFeedFilterBar.tsx`) — sticky chip navigation below the navbar on `/spotlight`, sharing state with the floating filter drawer via `useSpotlightFloatingFilters` (single source of truth).

Chips in order: All · Reels · Videos · Guides · Brands · Collections · Offers · Campaigns · Reviews · Blogs · Live · Services · Trending · Following · Saved · Nearby (`SPOTLIGHT_STICKY_FILTER_IDS`).

### Publisher header (Facebook-style)

`UniversalCommerceCard` gained an **opt-in** `showPublisherHeader` prop — brand/creator identity renders **above the media**:

```
Publisher avatar + name → Verified badge → Sponsored label → Media → Content Badge → Title → Product Preview → Stats → CTA
```

Only `SpotlightMixedFeed` opts in. Guides page, Creator Reviews preview, and Product Details previews keep their existing layout untouched.

### Sponsored posts

- Same card dimensions as organic posts — no layout break
- Small bordered `Sponsored` pill in the header + "Sponsored" subline (replaces date)
- `isVerified` + `publisherTypeLabel` added to `UniversalCommerceCardModel` (adapter: `spotlightToContentCardModel`)

### Feed mixing (de-clustering v2)

`mixSpotlightFeedItems()` now de-clusters by **content type AND card variant** (reel/landscape/blog/square/live), and re-inserts deferred items at the first non-clustering slot instead of appending them at the tail — reels, blogs, and videos interleave through the entire feed.

### Grid (unchanged, verified)

`choosify-guide-media-grid`: 1 col mobile → 2 @520px → 3 @768px → 4 @1024px → 5 @1280px. Aligned rows (`align-items: start`), natural media heights, **no masonry**. Batched lazy loading (24 initial / +12) with scroll restore retained.

### What did NOT change (LE-006 P1)

- Card visual design (colors, typography, spacing, radius, compact CTA footer)
- Homepage, Recommendations, Deals, Categories, Brands, Product Details, Guide Details, Creator Reviews, Dashboard
- Backend, CMS, APIs, routing, data models, floating filter drawer

