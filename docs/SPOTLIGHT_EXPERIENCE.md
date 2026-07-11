# Spotlight Experience Platform — Phase 1

Choosify Spotlight transforms from a campaign listing into a unified discovery experience. Users browse **experiences** — campaigns, guides, live sessions, creator reviews, events, and recommendations — through one architecture.

## Publisher Model

Every Spotlight item has an owner (`SpotlightPublisher`):

| Field | Purpose |
|-------|---------|
| `publisherId` | Stable reference |
| `name` / `logoUrl` | Display identity |
| `publisherType` | Brand, Creator, Editorial, Retailer, etc. |
| `isVerified` / `badges` | Trust signals |
| `reputation` / `trustScore` | Future ranking |
| `followers` | Future social graph |

Resolvers: `spotlightPublisherResolver.ts` — builds publishers from brands, creators, campaigns, editorial.

## Content Graph (CTO)

`SpotlightContentGraph` on every `SpotlightContent` document:

- `relatedContentIds`, `relatedProductIds`, `relatedBrandIds`
- `relatedCreatorIds`, `relatedGuideIds`, `relatedCampaignIds`
- `relatedLiveSessionIds`

`SpotlightContentConnections` holds entity references (products, brands, guides, campaigns, live sessions, other Spotlight nodes).

No duplicated catalog data — IDs only, resolved at render time.

## Unified Content Model

`SpotlightContent` is the single document consumed by `SpotlightContentCard`.

**Sources resolved in `spotlightContentResolver.ts`:**

| Source | Maps to types |
|--------|----------------|
| Campaigns (localStorage CMS) | campaign, promotion, new_launch, brand_story, live, … |
| Catalog guides | buying_guide, tutorial, tips, recommendation, comparison, editorial |
| Brand posts (What's On) | event, announcement, whats_on, promotion |
| Creators | creator_review |

## Discovery Architecture

**Route:** `/spotlight` → `SpotlightDiscoverPage`

**Hook:** `useSpotlightExperience()` aggregates sources, applies filters, builds sections.

**Sections** (`buildSpotlightDiscoverSections.ts`):

Featured Today · Live Now · Trending · New Launches · Campaigns · Creator Picks · Brand Stories · Recommendations · Buying Guides · What's On · Events · Latest Reviews · Latest Videos · Latest Announcements · Ending Soon · Upcoming

Layouts: `hero` | `carousel` | `grid` | `list` — premium modular sections, not infinite scroll only.

## Content Types

22 types in `contentTypes.ts` including future-ready: `ai_content`, `podcast`, `webinar`, `livestream_replay`.

## Universal Renderer

`SpotlightContentCard` — one card for all types:

- Publisher row, content type badge, live/sponsored badges
- `SpotlightContentMedia` (LE-005.2 `homepage_carousel` profile + embed support)
- Commerce overlay (products, CTAs)
- Contextual CTA from `cta.ts`
- Wishlist / compare / share actions

`SpotlightCampaignCard` is a thin adapter for homepage backward compatibility.

## Contextual CTA

`getSpotlightContentCtaLabel(type)` — no generic buttons:

- Campaign → Explore Campaign
- Live → Watch Live
- Guide → Read Guide
- Comparison → Compare Now
- Recommendation → View Recommendation

## Filters (Client-Side)

`SpotlightDiscoverFilters` — content type, brand, publisher, live, sponsored, verified, trending, sort, search. Persisted in `sessionStorage`.

## Related Content Engine (CTO)

`SpotlightRelatedContentBundle` + `resolveRelatedContentStub()` — rule-based matching by shared products/brands/creators. Contract ready for ES-010 / AI personalization.

## Collaboration Model (CTO)

`SpotlightCollaborator` roles: owner, collaborating_brand, creator, official_distributor, marketplace_editor, sponsor.

`SpotlightCreatorCollaborationInvite` — brand ↔ creator invites (architecture only).

## Commerce Overlay (CTO)

`SpotlightCommerceOverlay` on every content node — featured products/services, offers, coupons, bundles, pinned products, primary/secondary CTAs. Content-first; commerce enhances.

## Live Preparation

`SpotlightLiveConfig` — YouTube/Facebook embed, replay, upcoming, notify-me placeholder, pinned products/offers, timeline placeholder. No streaming backend.

## Guide & Recommendation Integration

- Guides: `guideToSpotlightContent()` reuses `CatalogGuide` + existing `/guides` and `/recommendations` routes
- Recommendations: guide type mapping + `recommendation` content type; no duplicated recommendation engine logic
- Homepage recommendations section unchanged; Spotlight surfaces same guides as experience cards

## Brand Experience (Future)

`SpotlightBrandExperienceConfig` maps brand pages to Spotlight sections: campaigns, live, recommendations, guides, reviews, announcements, events.

## Future Integrations

| System | Status |
|--------|--------|
| ES-008 Analytics | Impression hooks from LE-005.5 |
| ES-010 Discovery / AI | `aiScore`, related content contract |
| Firestore API | LE-005.3.2 contracts |
| Live commerce | `SpotlightLiveConfig` + embed renderer |
| Monetization | Commerce overlay + sponsored flags |
| Creator collaboration | Invite model + publishable types |

## Performance

- Discover page: modular sections lazy-render per block
- Media: lazy load, hover/tap preview, embed iframes lazy
- Resolver: in-memory merge; no extra network in Phase 1
- Code-split: experience components separate chunk from homepage

## Scalability

- Add new content types: extend `SpotlightContentType` + resolver branch + CTA map
- Add new sources: implement `*ToSpotlightContent()` adapter
- Backend: replace `resolveSpotlightExperience` data sources with API calls; types unchanged
- Related content: swap stub for `SpotlightRelatedContentEngineContract` implementation

## Breaking Changes

**None.** Homepage Spotlight section uses adapter to universal card. CMS routes unchanged.

## Technical Debt

- Campaign data still localStorage
- Related content UI not fully built (stub message on public page)
- Live "Notify Me" not wired
- Service entity IDs reserved but no service catalog yet
- Full brand page Spotlight consumption not implemented
