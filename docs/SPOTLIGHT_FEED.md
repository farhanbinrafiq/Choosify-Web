# Spotlight Feed — LE-006.3.1 Demo Experience

Frontend-only demo feed for UX validation. No backend, CMS, or analytics.

---

## Supported Demo Content

The **Spotlight Demo Factory** (`src/data/spotlight/spotlightDemoFeedFactory.ts`) generates a balanced commerce discovery feed.

| Category | Examples |
|----------|----------|
| Creator Reviews | Nafis Anjum, Tasnim Rahman, Farhan Rafiq |
| Buying Guides | Best Smartphones 2026, Laptop Guide |
| Editorial | Choosify Editorial commerce journalism |
| Brand Stories | Aarong, Samsung, Bata, Pran |
| Campaigns | Tech Week, Galaxy Launch, Pickaboo Flash |
| Product Reviews | iPhone, Redmi, Galaxy Watch |
| Launches | Galaxy S25, Domino's, KFC |
| Live Shopping | Samsung unboxing, Aarong fashion show |
| Offers | Flash sales, BOGO, hotel deals |
| Collections | Festive edits, campus kits |
| Services | Booking.com, Airbnb, Radisson, Sea Pearl |
| Sponsored | Samsung, Apple, Pickaboo, Bata (subtle badge only) |

**Demo brands:** Samsung, Apple, Xiaomi, Walton, Pickaboo, Bata, Aarong, Le Reve, Domino's, KFC, Unilever, Pran.

### Regenerating the feed

```typescript
import { buildDemoSpotlightFeed } from '@/data/spotlight/spotlightDemoFeedFactory';

buildDemoSpotlightFeed({
  reels: 12,
  landscapeVideos: 8,
  blogs: 6,
  buyingGuides: 5,
  sponsoredProducts: 6,
  sponsoredBrands: 4,
  brandCampaigns: 5,
  liveShopping: 3,
  collections: 4,
  services: 5,
});
```

Defaults live in `DEFAULT_DEMO_SPOTLIGHT_FEED_CONFIG`.

---

## Mixed Feed Philosophy

1. **Commerce-first** — products and services attached to every card where relevant.
2. **Natural interleaving** — `mixSpotlightFeedItems()` de-clusters by content type and card variant (reels, landscape, blog, square, live, carousel).
3. **Never group by type** — no reels block followed by guides block; order feels organic.
4. **Same card chrome** — sponsored items use identical cards; only the publisher strip shows "Sponsored".
5. **Universal details** — every card opens `/spotlight/:slug` via the Universal Spotlight Details page.

---

## Mixed Media Demonstration

| Profile | Aspect | Media type |
|---------|--------|------------|
| Portrait Reel | 9:16 | `vertical_video` |
| Landscape Video | 16:9 | `landscape_video` |
| Square Post | 1:1 | `square_image` |
| Blog / Guide | 16:9 cover | `landscape_image` |
| Carousel | 1:1 multi-image | `carousel` |
| Live | 16:9 | `livestream` |

Heights are **not forced identical** — the adaptive grid respects natural ratios.

---

## Sponsored Demonstration

- Organic sponsored flags (`isSponsored: true`) on demo factory items
- LE-006.3 placement injection in `SpotlightMixedFeed` (unchanged in this sprint)
- Publisher header: brand/creator logo, name, verified badge, "Sponsored" label
- No dashed borders, no oversized CTAs

---

## Filter Behaviour

**Sticky chip bar** — `SpotlightFeedFilterBar` on the page.

**Global floating filter** — `useSpotlightFloatingFilters` registers with `useRegisterPageFilters`:

- Page search (headline, brand, creator)
- Content type chips in drawer
- Discovery toggles: Trending, Sponsored, Live, Offers
- Quick filters: All, Reels, Videos, Live, Guides, Collections, Campaigns, Offers, Reviews, Brands, Services, Trending, Saved, Following, Nearby

Collections filter uses mock query token `__collection__` (badge match).

Tab presets sync via `contentTypesForTab()` and URL `?tab=`.

---

## Integration Points

| File | Role |
|------|------|
| `spotlightDemoFeedFactory.ts` | Demo feed generator + slug registry |
| `spotlightContentResolver.ts` | Merges demo feed with campaigns, guides, brand posts |
| `spotlightMixedFeed.ts` | Filter + de-cluster mix utilities |
| `SpotlightDiscoverPage.tsx` | Feed page entry |
| `SpotlightMixedFeed.tsx` | Renders mixed grid + lazy load |
| `useSpotlightFloatingFilters.tsx` | Floating filter registration |

---

## Performance

- Lazy batch loading via `SPOTLIGHT_FEED_BATCH` (24 initial, +12 on scroll)
- Demo factory runs once per session; registry enables O(1) slug lookup
- No change to placement engine or card renderers in this sprint
