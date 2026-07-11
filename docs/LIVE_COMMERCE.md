# Live Commerce — Provider & Player Guide

Phase 3 embed-only live commerce. Streaming remains on external platforms; Choosify wraps commerce around the embed.

## Live Player

**Component:** `LiveEmbedPlayer`

Unified renderer — displays provider iframe only. No Choosify custom player.

### Display Elements

| Element | Component |
|---------|-----------|
| Poster | `LiveExperienceHeader` / upcoming placeholder |
| Countdown | `LiveCountdown` |
| Live Badge | `LiveExperienceHeader` |
| Viewer Count | Reserved (future) |
| Publisher | `LiveExperienceHeader` |
| Title / Description / Tags | `LiveExperienceHeader` |
| Products / Services / Offers | `ShoppableOverlay` |
| CTA | Primary actions in overlay + header |
| Replay / Upcoming / Ended badges | Status-driven in header |

## Live Sources

**Types:** `SpotlightLiveSource` in `interactive/sources.ts`

### Supported (Phase 3)

| Provider | Embed |
|----------|-------|
| `youtube_live` | YouTube iframe embed |
| `facebook_live` | Facebook video plugin |
| `embedded_website` | Generic iframe URL |
| `custom_embed` | Custom embed URL |

Adapter: `toEmbedUrl()` in `spotlightMediaAdapters.ts`

### Future (Architecture Only)

TikTok Live · Instagram Live · LinkedIn Live · Zoom · Google Meet · Microsoft Teams

Provider enum reserved; no UI or embed logic until integrations ship.

## Multi-Source Hub

**Component:** `MultiSourceHub`

One event (`SpotlightInteractiveCommerceEvent`) exposes `sources[]`. Each source has:

- `sourceId`, `label`, `provider`, `embedUrl`
- `contributorPublisherId`, `contributorRole` (official_brand, creator, editor, partner)
- `isPrimary`, `status`

Demo hub in `buildMultiSourceHub()` — Samsung-style launch with YouTube + Facebook + creator streams + media coverage.

## Timeline & Pinning

### Timeline Chapters

`SpotlightLiveTimelineChapter` — `timestampSeconds`, `timestampLabel`, `title`, `links[]`

Links connect to products, offers, services, guides, comparisons, announcements.

**Component:** `LiveTimeline` — click chapter → `jumpToChapter()` → overlay updates

### Live Product Pinning

`SpotlightLivePinRecord` — publisher pins product/service/bundle/coupon/offer/announcement/guide/comparison at `timestampSeconds`.

`preservedOnReplay: true` — replay shows full pin history.

Demo pins: `buildDemoPins()` in `spotlightInteractiveCommerce.ts`

## Replay

Replay behaves exactly like live:

- Same `InteractiveCommerceLayout` via `ReplayExperienceLayout`
- Timeline preserved
- Pins preserved
- Offers and related content preserved
- Status `replay` or `ended` → "Watch Replay" CTA

## Upcoming Events

When `status === 'upcoming'`:

- Poster preview (no embed until live)
- `LiveCountdown` with timezone
- Notify Me button (tracks `notify_me_click` in dev — no backend)
- Calendar placeholder text

Fields: `scheduledAt`, `timezone`, `notifyMeEnabled`, `calendarPlaceholder`

## Official Live Badges

`SpotlightOfficialLiveKind` — official brand, distributor, partner, event, webinar, announcement.

Rendered via publisher trust badges and collaborator roles from Phase 2 collaboration engine.

## Creator Live

Creators publish review, live, tutorial, hands-on, comparison, buying guide, reaction content. Commerce overlay identical to brand live — same `ShoppableOverlay` and timeline model.

## Commerce Overlay Layout

```
┌─────────────────────────────┬──────────────┐
│  MultiSourceHub             │              │
│  LiveEmbedPlayer            │  Shoppable   │
│  LiveTimeline               │  Overlay     │
└─────────────────────────────┴──────────────┘
│  LiveCollaboratorsStrip                      │
│  RelatedContentRail                          │
└──────────────────────────────────────────────┘
```

Mobile: overlay stacks beneath player (`grid lg:grid-cols-[1fr_340px]`).

## Entry Points

| Route | Page |
|-------|------|
| `/spotlight/live/:slug` | Full interactive commerce experience |
| `/spotlight/:slug` | Campaign overview + "Watch Live" link for livestream campaigns |
| `/spotlight` | Discovery — Live Now section links to live routes |

Livestream campaigns resolve `href` to `/spotlight/live/:slug` and CTA "Watch Live".

## Campaign Requirements

CMS campaign with `campaignType: 'livestream'` generates:

- Interactive event via `campaignToInteractiveEvent()`
- Multi-source hub demo
- Demo timeline and pins
- Commerce from linked products

## Performance Notes

- Lazy-loaded page: `InteractiveCommercePage` in `App.tsx`
- Embeds load only when source selected and not upcoming
- Product resolution from catalog IDs — no duplicate product data in event model

## Accessibility

- iframe `title` from event title
- Timeline chapters as keyboard-accessible buttons
- Wishlist/compare buttons with `aria-label`
- Status badges with semantic text (Live, Upcoming, Replay, Ended)

## Scalability

- Event model is provider-agnostic — add sources without layout changes
- Timeline/pin records are append-only for replay fidelity
- Domain field supports cross-category marketplace expansion
- Analytics and AI contracts ready for backend wiring
