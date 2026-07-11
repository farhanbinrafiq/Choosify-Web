# Interactive Commerce Experience — Phase 3

Choosify Phase 3 delivers **interactive shopping experiences** around external content. Choosify is **not** a streaming platform — it is the commerce layer that surrounds YouTube, Facebook, and future embed providers.

## Vision

Users watch content on external platforms. Commerce surrounds the content. Every live, replay, and interactive session becomes instantly shoppable.

## Architecture

```
External Provider (YouTube / Facebook / Website iframe)
    └── LiveEmbedPlayer (unified embed renderer — no custom player)
            ├── LiveExperienceHeader (badges, title, publisher)
            ├── MultiSourceHub (CTO — multiple perspectives, one event)
            ├── ShoppableOverlay (hero, pinned, buy, compare, wishlist)
            ├── LiveTimeline (synchronized commerce chapters)
            ├── LiveCollaboratorsStrip (verified contributors)
            └── RelatedContentRail (campaigns, guides, products, live)
```

**Route:** `/spotlight/live/:slug` → `InteractiveCommercePage`

**Resolver:** `spotlightInteractiveCommerce.ts` — `campaignToInteractiveEvent()`, `getInteractiveEventBySlug()`, `buildMultiSourceEventHub()`

**Hook:** `useInteractiveCommerce(slug)` — source selection, chapter jumps, pinned products, related content

**Types:** `src/types/spotlight/interactive/` — experience, sources, event, timeline, pinning, replay, upcoming, cta, analytics, ai, monetization

## Reused Engines

| Engine | Phase | Usage |
|--------|-------|-------|
| Spotlight Experience | 1 | Content model, discovery, `SpotlightContentCard` |
| Publisher Ecosystem | 2 | Collaborators, trust badges, publisher profile links |
| Commerce Overlay | 2 | Products, bundles, offers, pinned items |
| Media Engine | LE-005 | Embed URLs via `spotlightMediaAdapters` |
| Campaign Engine | CMS | `listCampaignRecords()` → livestream campaigns |

## Experience Kinds

Live · Upcoming Live · Replay · Scheduled Live · Ended Live · Cancelled Live · Winner Announcement · Product Launch · Campaign Reveal · Press Conference · Webinar · Workshop · Product Demo · Creator Live · Brand Live · Partner Live

Mapped in `SpotlightLiveExperienceKind` (`experience.ts`).

## Cross-Domain Support (CTO)

`SpotlightInteractiveCommerceDomain` — same architecture for electronics, hotels, restaurants, travel, education, healthcare, automotive, real estate. Domain inferred from campaign tags in `inferDomain()`.

## Multi-Source Event Hub (CTO)

One Spotlight event supports multiple content sources:

- Official YouTube Live
- Official Facebook Live
- Creator Reaction / Review streams
- Media Coverage embed

User selects perspective via `MultiSourceHub`; commerce and timeline remain in the same campaign ecosystem.

## Synchronized Commerce Timeline (CTO)

Every chapter and pin is tied to `timestampSeconds`:

| Time | Event | Commerce |
|------|-------|----------|
| 00:00 | Introduction | — |
| 03:15 | Hero Product | Product card |
| 08:30 | Demo | Product |
| 14:20 | Accessories | Accessory products |
| 18:50 | Offer | Coupon / offer |
| 22:00 | Winner | Announcement |
| 30:00 | Q&A | — |

`LiveTimeline` + `jumpToChapter()` update `ShoppableOverlay` dynamically. Replay preserves full timeline.

## Live Collaboration (CTO)

`LiveCollaboratorsStrip` displays verified contributors — official brand, retail partner, creator, editor — from `SpotlightCollaborationMember[]`.

## Shoppable Overlay

Beside or beneath the embed (`InteractiveCommerceLayout` grid):

- Hero product (chapter-linked or pinned)
- Pinned products
- Buy · Compare · Wishlist · Share
- Services, bundles, coupons (via commerce overlay IDs)

## Replay Experience

`ReplayExperienceLayout` wraps the same layout as live. Timeline, pins, offers, and related content are preserved. Status `replay` or `ended` triggers replay analytics contract.

## Upcoming Events

`LiveCountdown` + Notify Me button (UI only — no notification backend). Calendar placeholder reserved.

## Commerce CTA

Adaptive labels in `SpotlightInteractiveCtaKind`: Watch Live · Watch Replay · Notify Me · Explore Campaign · Buy · Compare · Wishlist · Contact Seller · View Brand · Read Guide

Live campaigns link to `/spotlight/live/:slug` from `SpotlightContentCard` and campaign public pages.

## Related Content

`RelatedContentRail` — related campaigns, creator videos, products, guides, reviews, comparisons, events, live sessions via `resolveRelatedExperience()`.

## Analytics Contract (ES-008)

Prepared in `interactive/analytics.ts`. Dev hook: `trackInteractiveEvent()` logs in development.

Events: Live Started · Replay Started · Chapter Viewed · Pinned Product Click · Buy Click · Offer Click · Guide Click · Compare Click · Reminder Click · Replay Completion · Source Switched

No production analytics implementation in Phase 3.

## AI Preparation (ES-012)

`interactive/ai.ts` — highlight chapters, auto summary, best moments, suggested products/timeline/offers, recommended creators. Contract only.

## Monetization Preparation

`interactive/monetization.ts` — featured live, homepage live, premium replay, sponsored chapter, pinned offer/product, creator/brand sponsorship, premium analytics. No billing.

## Components

| Component | Purpose |
|-----------|---------|
| `LiveEmbedPlayer` | Provider iframe embed |
| `LiveCountdown` | Upcoming event countdown |
| `LiveExperienceHeader` | Title, badges, publisher, status |
| `MultiSourceHub` | Perspective switcher |
| `ShoppableOverlay` | Commerce beside live |
| `LiveTimeline` | Chapter navigation |
| `LiveCollaboratorsStrip` | Verified contributors |
| `RelatedContentRail` | Related experiences |
| `InteractiveCommerceLayout` | Live layout |
| `ReplayExperienceLayout` | Replay wrapper (identical UX) |

## What We Did NOT Build

- Video streaming / hosting
- Chat
- Custom video player
- Notification delivery
- Billing / monetization enforcement
- Production analytics pipeline

## File Map

```
src/types/spotlight/interactive/
src/utils/spotlightInteractiveCommerce.ts
src/hooks/useInteractiveCommerce.ts
src/components/spotlight/interactive/
src/pages/InteractiveCommercePage.tsx
docs/LIVE_COMMERCE.md
```
