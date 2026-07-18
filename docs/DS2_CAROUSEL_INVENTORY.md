# DS-2.0 Carousel Inventory

**Sprint:** ES-001

---

## UI Carousels (Horizontal Scroll)

| Component | Path | Engine | Item Width | Used By |
|-----------|------|--------|------------|---------|
| `PremiumCarousel` | `src/components/home/PremiumCarousel.tsx` | Custom scroll + arrows | Configurable | Home sections, SpotlightIntegrationRail |
| `UniversalCarousel` | `src/components/design/UniversalCarousel.tsx` | Custom scroll + arrows | Configurable | Home spotlight (new), DS proto |
| `ModernCarousel` | `src/components/ModernCarousel.tsx` | Legacy | Fixed | Unknown/legacy consumers |
| `SpotlightCarousel` | `src/components/spotlight/homepage/SpotlightCarousel.tsx` | Wraps PremiumCarousel | Responsive | Homepage spotlight (legacy path) |
| `SpotlightHeroCarousel` | `src/components/home/SpotlightHeroCarousel.tsx` | Custom | Large | Legacy home |
| `CampaignBannerCarousel` | `src/components/CampaignBannerCarousel.tsx` | Custom | Full-width | Campaign surfaces |
| `BrandPostCarouselSection` | `src/components/BrandPostCarouselSection.tsx` | Custom | Medium | Brand detail |
| `TrendingBrandsCarousel` | `src/components/home/TrendingBrandsCarousel.tsx` | Custom | Logo tiles | Home brands (legacy) |
| `DiscoverAndLearnSection` | `src/components/home/DiscoverAndLearnSection.tsx` | Embeds carousel | Guide cards | Home guides (legacy) |

---

## Media Engine Carousels

| Component | Path | Role |
|-----------|------|------|
| `CarouselRenderer` | `src/components/media/renderers/CarouselRenderer.tsx` | Universal media carousel |
| `MixedMediaRenderer` | `src/components/media/renderers/MixedMediaRenderer.tsx` | Mixed media with carousel slides |
| `MediaRenderer` | `src/components/media/renderers/MediaRenderer.tsx` | Routes to carousel renderer |
| `ChoosifyCommerceMediaGallery` | `src/components/commerce/ChoosifyCommerceMediaGallery.tsx` | Product media gallery carousel |
| `ProductCard` (internal) | `src/components/ProductCard.tsx` | Image carousel within card |

---

## Spotlight / Feed Carousels

| Component | Path |
|-----------|------|
| `SpotlightPersonalizedRails` | `src/components/spotlight/discovery/SpotlightPersonalizedRails.tsx` |
| `SpotlightDiscoverSection` | `src/components/spotlight/experience/SpotlightDiscoverSection.tsx` |
| `SpotlightIntegrationRail` | `src/components/spotlight/SpotlightIntegrationRail.tsx` |
| `PublisherPageSection` | `src/components/spotlight/publisher/PublisherPageSection.tsx` |
| `SpotlightDiscoveryPanel` | `src/components/spotlight/studio/SpotlightDiscoveryPanel.tsx` |
| `MerchandisingPreviewPanel` | `src/components/spotlight/merchandising/MerchandisingPreviewPanel.tsx` |
| `CampaignPreviewPanel` | `src/components/spotlight/cms/CampaignPreviewPanel.tsx` |

---

## Hooks

| Hook | Path | Overlap |
|------|------|---------|
| `useCarousel` | `src/hooks/useCarousel.ts` | Generic carousel state |
| `useMediaCarousel` | `src/components/media/hooks/useMediaCarousel.ts` | Media-specific |

---

## Duplication Issues

1. **PremiumCarousel vs UniversalCarousel** — nearly identical; merge in ES-002
2. **Responsive width logic** duplicated in `SpotlightCarousel` and `UniversalCarousel`
3. **Arrow styling** inconsistent (circles vs chevrons vs hidden)
4. **Snap scroll** — some use `snap-x`, others don't

---

## Proposed DS-2.0 Carousel API

```
Carousel
├── CarouselTrack
├── CarouselItem
├── CarouselPrev / CarouselNext
└── CarouselDots (optional)

Props: itemWidth, gap, snap, showArrows, ariaLabel
```

**Target sprint:** ES-002 (extract from UniversalCarousel + PremiumCarousel)

---

## Registry References

| File | Role |
|------|------|
| `src/lib/spotlight/feed/layoutRegistry.ts` | Feed layout carousel configs |
| `src/utils/spotlightHeroCarousel.ts` | Hero carousel data |
| `src/lib/spotlight/experience/mediaPresentationRegistry.ts` | Media presentation |
