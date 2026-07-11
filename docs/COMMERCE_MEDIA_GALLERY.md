# Commerce Media Gallery

LE-005 UX-04.1 — architecture and usage guide.

## Why the Homepage Hero stays independent

The **Homepage Spotlight Hero** (`SpotlightHeroCarousel`) is a **marketing carousel**:

- Multi-slide peek layout (far-prev / prev / active / next)
- Image-only slides with gradient overlays and CTA
- Dot indicators, prev/next controls, swipe on mobile
- Auto-advance driven by `HomePage` (not the carousel itself)
- **No** thumbnail strip, zoom, or product gallery behaviour

It is the approved visual benchmark for Choosify premium presentation, but it is **not** a reusable media engine.

The **Commerce Media Gallery** (`ChoosifyCommerceMediaGallery`) is a **detail-page shopping media viewer**:

- Mixed media in publisher order (video → image → reel → …)
- Thumbnail strip under the hero (Product Details + Spotlight Content only)
- Image zoom, fullscreen, inline video, portrait reels at natural aspect ratio

These are **different user experiences** with different goals. They share **design language** (colors, radius, typography, transitions) but **not** React implementation.

## Three related experiences (design system)

| Surface | Component | Purpose |
|---------|-----------|---------|
| Homepage Hero | `SpotlightHeroCarousel` | Marketing discovery carousel |
| Detail heroes | `ChoosifyCommerceMediaGallery` | Commerce media (Product, Spotlight, future verticals) |
| Feed cards | `UniversalContentCard` | Browsing / discovery grid |

## Commerce Media Gallery architecture

```
src/components/commerce/
  ChoosifyCommerceMediaGallery.tsx   # UI + interactions
  commerceMediaTypes.ts              # Props / item alias
  index.ts

src/components/media/
  choosifyMediaAdapters.ts           # buildProductGalleryItems, buildSpotlightContentGalleryItems, …
  choosifyMediaTypes.ts              # Shared media item model
```

Detail wrappers:

- `ProductMediaGallery` → builds product items → `ChoosifyCommerceMediaGallery`
- `SpotlightContentHero` → builds spotlight/guide items → `ChoosifyCommerceMediaGallery`

## Supported media

| Kind | Behaviour |
|------|-----------|
| Image | Hover zoom (desktop), pinch/double-tap zoom (mobile), click fullscreen (desktop) |
| Landscape video | Inline play, mute/unmute, fullscreen |
| Portrait reel / video | Natural 9:16, `object-contain`, no stretch |
| Square video | 1:1 aspect container |
| GIF | Treated as video kind |
| Live embed | iframe inline |
| Carousel (future) | Thumbnail labelled “Gallery” |
| 360° / AR (future) | Placeholder slot |

Media order follows adapter output — **no grouping, no tabs**.

## Thumbnail behaviour

- Rendered **below** the theater (same position as prior Product Details layout)
- Portrait thumbs: `w-14 h-24`; landscape/square: `w-20 h-20`
- Active: `#E8500A` border, slight scale, shadow
- Labels: Video, Reel, Gallery when applicable
- Dot indicators mirror homepage hero accent colour

## Zoom behaviour

- **Images only** — videos/reels are never zoomed
- Desktop: hover magnify (2.2×), transform origin follows cursor
- Mobile: pinch zoom (up to 3×), double-tap toggle zoom
- Zoom resets when changing slides

## Fullscreen behaviour

- Toolbar button (homepage-style circular control)
- Images: click hero on desktop enters fullscreen
- Videos/reels: fullscreen preserves `object-contain` quality
- `Escape` exits; listens to `fullscreenchange`

## Performance

- Lazy `loading="lazy"` on images
- Preloads **adjacent** slide URLs only (prev/next)
- Commerce gallery is imported only on detail routes (Product, Spotlight Content)
- Homepage bundle does not include `ChoosifyCommerceMediaGallery`

## Future extensibility

Same gallery can power Hotels, Restaurants, Real Estate, Travel, Vehicles, Healthcare by adding adapters in `choosifyMediaAdapters.ts` — no Homepage changes required.

## Do not use on

- Homepage (`SpotlightHeroCarousel` only)
- Spotlight Feed (`UniversalContentCard`)
- Recommendation listing page
