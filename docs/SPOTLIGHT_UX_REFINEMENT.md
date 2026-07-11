# Spotlight UX Refinement — LE-005 Phase 5.5.1

Commerce-first shopping discovery refinement. **Not a redesign** — the Spotlight architecture from Phases 5.1–5.5 remains; this sprint changes hierarchy, card behavior, and feed organization so users feel they are **browsing products and services**, not another social video platform.

---

## Commerce-first philosophy

Every design decision answers:

> Does this help users discover products or services?

**Correct hierarchy**

```
Product / Service
    ↓
Shopping Content (video, guide, review, live)
    ↓
Brand / Creator / Publisher (secondary)
```

**Wrong hierarchy (pre-5.5.1)**

```
Creator → Video → Product
```

Spotlight should feel like Instagram Shopping, TikTok Shop, or Amazon Inspire — **not** YouTube or Facebook Watch.

---

## Architecture

New registries in `src/lib/spotlight/experience/`:

| Registry | Purpose |
|----------|---------|
| `adaptiveCardRegistry` | 20 card modes by content/media type |
| `contentDensityRegistry` | Compact / Standard / Featured (CTO upgrade) |
| `mediaPresentationRegistry` | Natural aspect ratios (9:16, 16:9, 1:1, 4:5) — no forced crop |
| `commerceCtaRegistry` | Shop Now before Watch/Read |
| `sectionRegistry` | Commerce-first section order + item limits |
| `feedRegistry` | Feed config, floating filter IDs |
| `index.ts` | `SPOTLIGHT_EXPERIENCE_REGISTRY` master index |

---

## Adaptive cards

Cards adapt automatically — one layout is never forced:

- Portrait Reel, Landscape Video, Square Post
- Live Card, Campaign Banner, Product Launch, Offer
- Guide, Review, Comparison, Product/Service Highlight
- And more (see `adaptiveCardRegistry.ts`)

Each card exposes `data-card-mode` and `data-density` for debugging and future AI.

---

## Content Density System (CTO upgrade)

| Density | Use case | Card width |
|---------|----------|------------|
| **Compact** | Carousels, reels, announcements | 240px |
| **Standard** | Default grid cards | 280px |
| **Featured** | Hero, launches, live, sponsored | 360px |

Sections assign default density; carousels mix compact cards; Featured Today uses featured density.

---

## Card body order (commerce-first)

1. Primary media (natural orientation)
2. Product/service strip (`SpotlightCommerceStrip`)
3. Shop Now + Product Details + content CTA
4. Headline + short description
5. Compare / Wishlist / Share
6. Publisher row (demoted, no profile link on cards)

Cards always link to **`/spotlight/content/:slug`** — not creator profiles.

---

## Universal Content Page

One reusable page for all content types:

- Route: `/spotlight/content/:slug`
- Guide-rich types delegate to `GuideDetailPage` (already commerce-heavy)
- Campaign/creator types use `CampaignContentBody` with **featured product hero first**

No separate Guide Details, Review Details, or Video Details routes.

---

## Shopping discovery feed

Organized sections (not one endless scroll):

- Featured Spotlight → New Launches → Live → Campaigns → Trending → Reviews → Guides → Services → Collections → …
- Each section capped (typically 6–8 items)
- **View More** links where appropriate
- Lazy-loaded sections below the fold (`SpotlightLazySection`)
- Commerce-sorted items within sections (`sortCommerceFirst`)

---

## Floating filters

Spotlight registers with Choosify's global floating filter system (`useSpotlightFloatingFilters`):

All · Products · Live · Reviews · Guides · Videos · Reels · Collections · Offers · Trending · Saved · Following

---

## Natural media presentation

`SpotlightContentMedia` uses `mediaPresentationRegistry`:

- Vertical video → 9:16, `object-contain`
- Landscape → 16:9, `object-contain`
- Square → 1:1
- No unnecessary cropping

---

## Homepage consistency

Spotlight reuses Choosify design tokens:

- Border radius `rounded-[5px]`
- Navy `#1a1a2e`, accent `#E8500A`
- Card borders `#e8edf2`
- Typography scale matches Products/Categories pages

---

## Future roadmap

| Phase | Focus |
|-------|-------|
| 5.5 | Opportunity Center (publisher optimization) |
| **5.5.1** | **Shopping discovery UX (this sprint)** |
| 5.6 | Emi AI — automate recommendations |

No further architectural redesign required before Emi AI.

---

## Related docs

- [SPOTLIGHT_EXPERIENCE_BUILDER.md](./SPOTLIGHT_EXPERIENCE_BUILDER.md)
- [SPOTLIGHT_OPPORTUNITY_CENTER.md](./SPOTLIGHT_OPPORTUNITY_CENTER.md)
- [SPOTLIGHT_ARCHITECTURE.md](./SPOTLIGHT_ARCHITECTURE.md)
