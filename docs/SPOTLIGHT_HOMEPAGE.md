# Spotlight Homepage — LE-005.5

Homepage Spotlight experience: premium carousel section between Hero and Recommendations.

## Homepage Placement

- **Section ID:** `section-spotlight` / `home-spotlight`
- **Position:** First block in the center feed (after `PageHeroBanner` + `HeroMarqueeTicker`, before Trending Brands)
- **Visibility:** Hidden when no published campaigns target the `homepage` surface within active schedule
- **Lazy loaded:** `SpotlightHomeSection` is code-split via `React.lazy`

## Carousel Behavior

- Reuses `PremiumCarousel` (mouse drag, touch swipe, arrow nav, dot indicators, keyboard when hovered)
- **Smart hero rotation** (`applyRotationOrder`): configurable strategy stack — sponsored → priority → new launch → trending → AI (future)
- **Featured Today** strip above carousel (`pickFeaturedCampaignOfDay`)
- Filter chips persist in `sessionStorage` (`choosify_spotlight_home_filter`)

## Responsive Rules

| Breakpoint | Visible cards | Card width |
|------------|---------------|------------|
| Mobile `<640px` | 1 | viewport − 40px (max 320) |
| Small tablet | 2–3 | 300px |
| Tablet `<1024px` | 2–3 | 280px |
| Desktop `<1280px` | 3–4 | 260px |
| Large desktop | 4–5 | 240px |

## Display Profiles Used

- **Profile key:** `homepage_carousel` (LE-005.2)
- **Homepage override:** `getHomepageSpotlightMediaProfile()` sets `autoplay: false`, `lazyVideo: true`, `muted: true`
- Videos: poster until hover (desktop) or tap (mobile); no forced autoplay
- Images/carousels: `MediaRenderer` with lazy loading

## Campaign Card

`SpotlightCampaignCard` composes:

- Media, badges, brand, headline, primary product price, `+X Products`
- Context-aware CTA from campaign type (`getSpotlightExploreCtaLabel`)
- Actions: Explore Campaign, Product Details, Shop Now, Wishlist, Compare, Share
- Seasonal theme ring via `data-seasonal` attribute

## Performance Strategy

- Section lazy-loaded on homepage
- Media lazy-loaded per card; only visible carousel items mount
- IntersectionObserver impression hook fires once per card (`threshold: 0.4`)
- No virtualization yet — revisit if campaign count exceeds ~20

## Impression Hooks (ES-008 prep)

`useSpotlightImpression` + `createSpotlightImpressionLogger`:

- `onVisible`, `onClicked`, `onPreviewStarted`, `onPreviewCompleted`
- Dev mode logs to `console.debug`; production wiring deferred

## Continue Watching (Future)

- Types: `SpotlightContinueWatchingPlaceholder`
- Storage key: `choosify_spotlight_continue_watching`
- `SpotlightContinueWatchingPlaceholder` component reserves DOM slot — no UI in v1

## Public Routes

| Route | Page |
|-------|------|
| `/spotlight` | `SpotlightDiscoverPage` — grid discovery (not full feed) |
| `/spotlight/:slug` | `SpotlightCampaignPublicPage` — placeholder until campaign landing sprint |

CMS remains at `/marketing/spotlight`.

## Future Enhancements

- Full Spotlight Feed + Campaign Landing Page
- ES-008 analytics pipeline
- AI ranking for rotation and Featured Today
- Continue Watching / Recently Viewed UI
- Firestore-backed campaign API (LE-005.3.2 contracts ready)
- Virtualized carousel for large catalogs

## Integration

| Module | Usage |
|--------|-------|
| LE-005.2 Media Engine | `MediaRenderer`, `homepage_carousel` profile |
| LE-005.3 Campaign Manager | `listCampaignRecords`, localStorage CMS data |
| LE-005.4 Merchandising | Product resolution via catalog IDs on cards |
| LE-005.3.2 API Contracts | Impression event shape matches ES-008 prep |
