# DS-2.0 Hero Inventory

**Sprint:** ES-001

---

## Primary Hero Components

| Component | Path | Height / Style | Used On |
|-----------|------|----------------|---------|
| `PageHeroBanner` | `src/components/PageHeroBanner.tsx` | 220–360px carousel | Products, Deals, Brands, Guides, Compare, Whats-on, Creators, Search (legacy listing pages) |
| `HomeEditorialHero` | `src/components/home/HomeEditorialHero.tsx` | 75–82vh split editorial | `/` (Homepage) |
| `CategoriesDiscoveryHero` | `src/components/categories/CategoriesDiscoveryHero.tsx` | Stat hero + gradient | `/categories` |
| `StaticPageHero` | `src/components/StaticPageHero.tsx` | Compact static | About, FAQ, Contact, Terms, Privacy, Partnership, Advertise |
| `PageHeroHeader` | `src/components/PageHeroHeader.tsx` | Text-only compact | Sub-page headers |
| `DetailHeroSummaryBar` | `src/components/DetailHeroSummaryBar.tsx` | Summary strip | Product detail, brand detail |
| `SpotlightContentHero` | `src/components/spotlight/feed/SpotlightContentHero.tsx` | Media-first | Spotlight content/feed pages |

---

## Hero-Adjacent Components

| Component | Path | Role |
|-----------|------|------|
| `HeroMarqueeTicker` | `src/components/HeroMarqueeTicker.tsx` | Animated ticker below hero (legacy listing) |
| `HeroSearchBar` | `src/components/HeroSearchBar.tsx` | Search-focused hero input |
| `SpotlightHeroCarousel` | `src/components/home/SpotlightHeroCarousel.tsx` | Legacy home spotlight hero |
| `CampaignBannerCarousel` | `src/components/CampaignBannerCarousel.tsx` | Campaign rotation |

---

## Page-Embedded Heroes (Inline)

| Page | Pattern |
|------|---------|
| `CheckoutPage.tsx` | Checkout step hero band |
| `OrderSuccessPage.tsx` | Confirmation hero |
| `OrderTrackingPage.tsx` | Status hero |
| `LoginSignUpPage.tsx` | Auth hero split |
| `NotFoundPage.tsx` | Error hero |
| `EmiPage.tsx` | EMI assistant hero |
| `SpotlightDiscoverPage.tsx` | Discover hub hero + filters |
| `GuideDetailPage.tsx` | Guide media hero |
| `BrandPostDetailPage.tsx` | Post banner hero |
| `ReviewDetailPage.tsx` | Review header hero |

---

## Duplication Analysis

| Issue | Details |
|-------|---------|
| **3 hero architectures** | Carousel (`PageHeroBanner`), Editorial split (`HomeEditorialHero`), Stat discovery (`CategoriesDiscoveryHero`) |
| **CMS overlap** | `PageHeroBanner` and `HomeEditorialHero` both read `homepageConfig.heroBanners` |
| **Ticker coupling** | `HeroMarqueeTicker` paired with `PageHeroBanner` on many pages — removed from Home/Categories |
| **No shared primitive** | No `Hero`, `HeroContent`, `HeroStats`, `HeroActions` subcomponents |

---

## Proposed DS-2.0 Hero API (ES-002+)

```
Hero
├── HeroBackground (gradient | image | video)
├── HeroContent (title, subtitle, actions)
├── HeroStats (optional stat grid)
├── HeroMedia (optional right column)
└── HeroNav (optional quick pills)
```

**Migration order:** ES-002 Homepage → ES-003 Categories → listing pages share `PageHeroBanner` refactor → ES-009 detail heroes.

---

## Registry / Config References

| File | Role |
|------|------|
| `src/lib/navigation.ts` | Nav hero titles |
| `src/utils/homepageCms.ts` | Homepage hero CMS visibility |
| `src/utils/heroTickers.ts` | Marquee content |
| `src/types/catalog.ts` | `HomepageConfig.heroBanners` |
