# Spotlight Media Engine

**Sprint:** LE-005.2 — Universal Spotlight Media Engine  
**Status:** Foundation complete — no page integrations in this sprint

---

## Overview

The Universal Media Engine renders every Spotlight campaign format consistently using **metadata-driven layout selection** and **display profiles**. Pages never hardcode layouts — they call:

```tsx
import { renderMedia } from '../components/media';

renderMedia(media, 'homepage_carousel');
renderMedia(media, 'spotlight_feed');
renderMedia(media, 'product_embed');
```

The same `UniversalMedia` document adapts to homepage carousel, feed, product embed, and mini widgets without duplicating components.

---

## Supported Formats

| # | Type | Aspect ratio | Examples |
|---|------|--------------|----------|
| 1 | Vertical video | 9:16 | TikTok, Reels, Shorts |
| 2 | Landscape video | 16:9 | Commercials, reviews, demos |
| 3 | Square video | 1:1 | Social square clips |
| 4 | Portrait image | 4:5 | Story-style stills |
| 5 | Landscape image | 16:9 | Banners, hero stills |
| 6 | Square image | 1:1 | Product tiles |
| 7 | Image carousel | Mixed | Multi-image swipe |
| 8 | Mixed media | Mixed | Video + images |
| 9 | Future | — | Creator reviews, 360°, AR, livestream, interactive demo |

### MIME support

| Kind | Formats |
|------|---------|
| Video | MP4, WebM, MOV (future-ready via `video/quicktime`) |
| Image | JPEG, PNG, WEBP, AVIF (future-ready) |

---

## Display Profiles (CTO Architecture)

| Profile | Used in | Autoplay | Typical aspect |
|---------|---------|----------|----------------|
| `homepage_carousel` | Homepage Spotlight carousel | Yes (muted) | 16:9 |
| `spotlight_feed` | Full Spotlight page | Yes (muted) | 9:16 |
| `campaign_details` | Campaign details | No | Adaptive |
| `product_embed` | Product page section | No | 1:1 |
| `brand_embed` | Brand page | No | 16:9 |
| `category_embed` | Category page | No | 4:5 |
| `mini_card` | Widgets / recommendations | No | 1:1 |

Profiles live in `src/components/media/types/displayProfile.ts`.

---

## Rendering Rules

```
UniversalMedia metadata
        ↓
resolveRendererKind()
        ↓
┌──────────┬──────────┬───────────┬──────────┐
│  video   │  image   │ carousel  │  mixed   │
└──────────┴──────────┴───────────┴──────────┘
        ↓
MediaRenderer + MediaDisplayProfile
        ↓
VideoRenderer | ImageRenderer | CarouselRenderer | MixedMediaRenderer
```

**No hardcoded page layouts.** Profile controls autoplay, controls visibility, lazy loading, gestures, indicators, max height, and object fit.

---

## Orientation Matrix

| Orientation | Detection rule | Typical media types |
|-------------|----------------|---------------------|
| `portrait` | width < height | vertical_video, portrait_image |
| `landscape` | width > height | landscape_video, landscape_image |
| `square` | width ≈ height | square_video, square_image |
| `panorama` | width/height > 2.2 | Future ultra-wide |

Auto-classification: `classifyMedia()` in `utils/classifyMedia.ts`.

---

## Media Lifecycle

```
Upload / probe
    ↓
classifyMedia() → type, orientation, aspect ratio, duration, resolution
    ↓
validateMedia() → descriptive errors (no silent failures)
    ↓
Save UniversalMedia / SpotlightMedia document
    ↓
renderMedia(media, profile) at consumption time
```

### Media object fields

`mediaId`, `mediaType`, `orientation`, `aspectRatio`, `duration`, `resolution`, `fileSize`, `mimeType`, `thumbnail`, `posterImage`, `previewImage`, `previewGif`, `videoUrl`, `imageUrls[]`, `displayOrder`, `isPrimary`, `altText`, `caption`, `transcriptPlaceholder`

---

## Validation Rules

| Rule | Default |
|------|---------|
| Max file size | 100 MB |
| Max video duration | 600 s (10 min) |
| Min short-edge resolution | 320 px |
| Required source | `videoUrl` OR `imageUrls[]` |
| Unsupported MIME | Descriptive `unsupported_format` error |

Configurable via `MediaValidationRuleSet` in `validators/mediaValidation.ts`.

---

## Optimization Strategy (interfaces only)

Future CDN pipeline contracts in `types/optimization.ts`:

- `MediaCompressionPreset`
- `ResponsiveImageSource`
- `AdaptiveStreamVariant`
- `MediaOptimizationPlan`
- `ThumbnailGenerationRequest`

No external CDN service implemented in LE-005.2.

---

## Accessibility

- `altText` / `caption` on all renderers
- `transcriptPlaceholder` for future subtitles
- Keyboard carousel navigation (ArrowLeft / ArrowRight)
- `role="alert"` on errors, `role="status"` on loading
- Profile flag `requireAltText` for strict surfaces

---

## Performance

- Images: `loading="lazy"`, `decoding="async"` via `OptimizedImage`
- Videos: `preload="none"` when `lazyVideo` profile enabled
- Click-to-play for lazy video surfaces
- Lightweight `MediaLoading` pulse placeholder
- Videos not loaded until needed on lazy profiles

---

## Module Structure

```
src/components/media/
├── index.ts
├── types/
│   ├── mediaModel.ts
│   ├── displayProfile.ts
│   ├── optimization.ts
│   └── playback.ts
├── utils/
│   ├── aspectRatio.ts
│   └── classifyMedia.ts
├── validators/
│   └── mediaValidation.ts
├── hooks/
│   ├── useMediaCarousel.ts
│   └── useMediaPlayback.ts
└── renderers/
    ├── MediaRenderer.tsx      ← entry point + renderMedia()
    ├── VideoRenderer.tsx
    ├── ImageRenderer.tsx
    ├── CarouselRenderer.tsx
    ├── MixedMediaRenderer.tsx
    ├── MediaPlaceholder.tsx
    ├── MediaLoading.tsx
    ├── MediaError.tsx
    └── MediaPreview.tsx
```

---

## Future Expansion

| Capability | Status |
|------------|--------|
| Picture-in-picture | Video element ready; UI hook future |
| Adaptive streaming (HLS/DASH) | `AdaptiveStreamVariant` interface |
| AVIF images | MIME allowed; renderer uses `<img>` |
| MOV uploads | `video/quicktime` in allowed list |
| 360° / AR / Livestream | Types + `mixed` renderer path |
| Subtitle tracks | `transcriptPlaceholder` + future `<track>` |
| CDN compression | `MediaOptimizationPlan` contract |

---

## Related Docs

- `docs/SPOTLIGHT_ARCHITECTURE.md` — LE-005.1 campaign platform
- `src/types/spotlight/media.ts` — Firestore-compatible media document

---

## Breaking Changes

**None.** New module only. `SpotlightMedia` extended with optional fields (backward compatible).
