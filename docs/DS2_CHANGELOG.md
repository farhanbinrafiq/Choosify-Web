# DS-2.0 Changelog

## Source correction — Choosify 3.0 handoff (authoritative)

**Authoritative design:** `Choosify 3.0-handoff.zip` → `docs/design/choosify-3-0/`  
Primary file: **`Choosify.dc.html`** (+ `Header.dc.html`, `Footer.dc.html`). See `docs/design/choosify-3-0/SOURCE.md`.

Do **not** use older PNG mocks or prior Downloads copies as layout authority.

### Changed (pass 33 — Search Results DC)

- **Search page** — Choosify.dc.html layout: dark gradient hero + breadcrumb, orange pill tabs (All / Products / Brands / Guides / Deals / Creators), TOP PRODUCTS 5-col + advertise tile, TOP BRANDS name cards; removed StickySectionNav mega-sections

### Changed (pass 32 — Creator Profile feed cards)

- **Creator Profile feed** — Videos/Guides/Reviews tabs use DC Featured Content cards (`CreatorContentCard`: 150px media, tag chip, gradient title); removed legacy `rounded-[5px]` StudioWrap grids
- **Reviews tab** — Product review list + Community Says cards (DC), not brand `PublicReviewCard`
- **Overview** — Featured grid shares same card component; latest review thumbs filled

### Changed (pass 31 — favicon eyes mark)

- **Favicon** — Official Choosify eyes SVG in `favicon.svg` + Safari `masked-icon.svg`; cache-bust `?v=5`; `ChoosifyIconLogo` synced to same paths

### Changed (pass 30 — Emi AI mascot logo)

- **Emi AI** — Official mascot SVG (`EmiAiLogo`) on floating FABs, chat header, `/emi` page, assistant cards, and Ask Emi CTAs (product/guide/compare/login)

### Changed (pass 29 — creator feed, infinite lists, floating FABs)

- **Creator Profile** — DC Overview tab feed (Featured Content, Expertise/Latest Reviews, Why Follow, Overview columns, Community Says) with green sticky tabs; Videos/Guides/Reviews as tab panels
- **Brands / Creators lists** — Infinite scroll (`useInfiniteListBatch`), pagination removed; brands show “Showing 1–N of M”
- **PaginationBar** — Restyled to DC `pageNums` (32×32, 6px radius, `#FF5B00`, no arrows by default)
- **PopularSearchKeywords** — Removed from listing/detail page bottoms
- **Floating overlays** — EMI / Quick Cart / Messages are circular FABs; panels use 16px radius; message bubbles peach outgoing; accents `#FF5B00`

### Changed (pass 28 — official Choosify wordmark)

- **Navbar** — Left logo uses official SVG wordmark (eyes + choosify + ®) instead of ring icon + text
- **Footer** — Top-left brand link uses text-only wordmark (`ChoosifyTextWordmarkLogo`); giant bottom watermark uses full mark with eyes (`ChoosifyWordmarkLogo`)

### Changed (pass 27 — Deals + Home missing DC sections)

- **Deals** — Restored Choosify.dc.html blocks: horizontal SPONSORED AD banner, Top Coupons rail, authentication/trust strip (`100% Authentic`…), Popular Deal Categories, Brand Deals row, subscribe CTA; vertical portrait advertise card in right rail; removed duplicate legacy Featured Brand Deals band
- **Home** — Full-width sponsored banner after Featured Products; Top Buying Guides always rendered (DC demo titles when catalog empty)

### Changed (pass 26 — unify all formats on Guide Detail)

- **Single detail shell** — TikTok/reels/shorts, YouTube/video, blog/editorial, live/replay, What’s On posts, and comparisons all open `/spotlight/:slug` → `GuideDetailPage`
- **Redirects** — `/spotlight/live/:slug` and `/whats-on/:slug` → Guide Detail; legacy `/guides|blogs|reviews/:id` already redirected
- **Card hrefs** — RecommendationCard, GuidesPage, Home buying guides, Viral Today, BrandPostCard, category guides, placements, calendar/hub live links use `catalogGuideHref` / `spotlightContentHref`
- **Live CTA** — Watch Live scrolls to `#spotlight-content-hero` on the same Guide Detail page (no separate player layout)
- **Renderer registry** — all content types marked `reusesGuideDetail: true`

### Changed (pass 25 — Brands/Creators flat grids)

- **Brands / Creators lists** — Removed “Choosify.bd Recommends” blocks and A–Z alphabetical folders; one flat grid of all filtered cards (same logic both pages)
- **Grid density** — Brand/creator grids: 4 cols @ 1024px, 5 cols @ 1280px+

### Changed (pass 24 — Discover lower feed + list ads + home cats + nav)

- **Discover** — Restored Choosify.dc.html lower sections after YouTube/Reels/Live/Blog: Guides by Product Type, Expert’s Picks + Editor’s Pick, Top Creators, From Our Community (+ rating summary), Choosify trust statement strip (`DiscoverLowerSections`)
- **Products list** — Full-width 190px `ProductsSponsoredBanner` (SPONSORED AD) above the grid; in-grid sponsored cells removed to match dc
- **Brands / Creators lists** — In-feed slots use dashed orange `AdvertiseHereCard` (“Become a Featured Brand/Creator · ADVERTISE HERE →”)
- **Home Top Categories** — Icon/emoji chips in colored circles (no category photos), per dc `categoryIconMap`
- **Navbar categories row** — Same chrome radial gradient as header with translucent navy base (was fully transparent / nearly invisible)

### Changed (pass 6 — handoff alignment)

- **Navbar** — Header.dc.html: ring logo + “choosify”, solid `#FF5B00` DISCOVER, Wishlist→Cart→Messages with badges, light profile dropdown; nav row shares chrome blur
- **Footer** — Footer.dc.html socials (FB/TikTok/YT); LEGAL/COMPANY links without FAQ injection; About anchors
- **About** — sticky left nav + light hero panel + Why/Company/Legal rows
- **Order Tracking** — compact `#000435` header + vertical timeline + side cards
- **Messages** — 3-column shell + filter tabs + right rail
- **Dashboard** — light sticky sidebar, orange active, Premium navy card, welcome header

### Changed (pass 7 — sticky listing / PD chrome)

- **DcListingStickyFilters** — white 88px icon+label sticky bar (`src/components/design/DcListingStickyFilters.tsx`)
- **DcUnderlineTabs** — Product Detail underline tabs (`src/components/design/DcUnderlineTabs.tsx`)
- **Products / Brands / Creators / Deals** — replace dark StickySectionNav + editorial shells with DC sticky filter cards; Deals drops `#000435` countdown strip
- **Product Detail** — white sticky Specs / Creator Reviews / Public Reviews / Overview tabs

### Changed (pass 8 — Categories sticky + light section nav)

- **StickySectionNav** — light white card chrome (orange active) for Brand/Creator/Guide/Search/Discover/Guides/etc.
- **Categories** — letter-circle sticky quick nav via `DcListingStickyFilters`; removed TrustStrip not in dc.html
- **Brand Deals** — `DcListingHero` + sticky filters; `#F4F7F9` canvas (no PageHeroBanner/marquee)
- Softened Product Detail “Public Reviews” heading freight typography

### Changed (pass 9 — Guides / What’s On / Review Detail)

- **Guides** — `DcListingHero` + sticky filters; `#F4F7F9` canvas
- **What’s On** — same listing chrome pattern; softened feed H2
- **Guide Detail** — freight section/winner/verdict/takeaways typography softened
- **Search** — empty-state titles sentence case
- **Review Detail** — navy header + light body (no PageHeroBanner)
- **Brand Detail / Brand Post Detail** — section H2s softened; post body `#F4F7F9`

### Changed (pass 10 — Cart / static / leftovers)

- **Retail Cart** — compact `#000435` header + `#F4F7F9` body; soft Inter-like type (matches Checkout)
- **Guide Products** — navy header + light grid (no PageHeroHeader)
- **StaticPageHero** — compact `#000435` (FAQ/Contact/Terms/Privacy/etc.)
- **FAQ** — softened hero; page `#F4F7F9`
- **Creator Profile / Brand Post Detail** — body freight softened; post hero `#000435`
- **Brand Deals** — CTA band softened + wired to About/Deals

### Changed (pass 11 — PostOffer / EMI / 404 / PD)

- **EMI** — compact `#000435` header + `#F4F7F9` chat shell
- **404** — solid `#000435` page; soft sentence-case copy + search
- **Post Offer** — navy header + light form card; softened step titles/labels/CTAs
- **Product Detail** — softened overview/trust titles; brand card solid `#000435`

### Changed (pass 12 — summary bar / orders / static type)

- **DetailHeroSummaryBar** — white meta bar + soft type; light action pills
- **Brand Post Detail** — softened title/excerpt (sentence case, no freight italic)
- **Customer Orders** — compact `#000435` header + `#F4F7F9` cards (was dark workspace)
- **Static heroes** (Contact/Terms/Privacy/Advertise/Partnership/Suggest Brand) — soft H1 type
- **Guides / Brand Deals** — residual card/CTA titles softened

### Changed (pass 13 — Spotlight / Guide / Dashboard)

- **Spotlight** — empty state `#F4F7F9`; filter bar light canvas + soft chips; details section titles softened; brand mini card solid `#000435`; live status chips softened
- **Guide Detail** — winner card solid `#000435` (no hero-gradient)
- **Dashboard** — Inbox/Notifications/settings/empty-state freight softened
- **Addresses** — AddressBook + form drawer titles softened
- **Brand Deals** — sidebar spotlight promo card softened

### Changed (pass 14 — Compare / modals)

- **CompareEngine** — decision matrix / section / community / search modal freight softened; search list `#F4F7F9`
- **SignInModal** — solid `#000435` card, soft labels/CTAs (no freight “protocol” copy)
- **ReportModal** — light white card, sentence-case titles/actions
- **ClaimProfileModal** — gate/success titles + primary CTAs softened
- **PageHeroBanner / ModernCarousel** — unused by live pages (legacy only)

### Changed (pass 15 — modals / static body / error)

- **ErrorBoundary** — solid `#000435` + soft sentence-case recovery UI
- **StudioEditPanel / SizeGuideModal** — soft titles, labels, actions
- **ClaimProfileModal** — section titles + form labels softened (~68 class swaps)
- **Terms / Privacy / Suggest Brand / Contact / Advertise / Partnership** — body H2/H3 freight softened
- **Dashboard** — empty-state CTAs + notification empty copy softened
- **Brand Post Detail** — hero status chips softened

### Changed (pass 16 — listing empties / nav / residual CTAs)

- **ClaimProfile** — step-nav labels softened
- **Brands / Creators / Products** — empty-state titles + clear-filters CTA
- **Navbar / App maintenance** — soft Browse/Account + maintenance title
- **Addresses / Dashboard / Creator / Brand Deals / Deals** — residual CTA/label freight
- **Guides / FilterEngine / InfluencerReviews / CardEngagementStrip** — soft section labels
- **Product Detail / Brand Detail** — review write box + key CTAs softened

### Changed (pass 17 — PD overlays / shared chrome)

- **Product Detail** — trust/sidebar/brand card + order/negotiate overlay labels & CTAs softened (~41 swaps)
- **FollowButton / PublicReviewCard / PageBreadcrumbs / LoadingFallback / GlobalSearchBar** — soft shared type
- **Search** live badge + home carousels title type
- **ProductCard** price-row type (no layout change)
- **Marketing list shell + page H1s / Spotlight admin titles** — light sentence-case soften
- **ModernCarousel** — legacy chrome softened

### Changed (pass 18 — ProductCard = Choosify.dc.html)

- **ProductCard grid** — rebuilt to match dc.html tile: 170px image, discount badge, wishlist heart, green rating pill, title/variant/price/cashback, official shield + compare + orange cart footer
- **ProductCard list** — same visual language
- **HomeProductCard** — now wraps shared `ProductCard` (no divergent home tile)
- **Home Featured** — 6-col grid gap `14px` (dc.html)
- **Listing grid** — `choosify-product-grid` gap `16px`, 5-col at xl (dc Products List)

### Changed (pass 23 — spotlight cleanup + addons / categories / ads)

- **Featured Spotlight rails removed** from Brand Detail, Product Detail, Categories, Category panel, Creator Profile (not in Choosify.dc.html feeds); `featured_today` renamed to Featured Today
- **Product Detail Add-on Items** — DC checklist (checkbox + thumb + price) with category seeds + always-on fallback
- **Categories** — Show all expands inline (orange), cards navigate to products; category grid capped at **4** cols; portrait vertical sponsored rail
- **Brand Detail** — Overview before Products; feed grid max **4** cols; Spotlight section removed
- **Brands / Creators / Guides** — sidebar sponsored ads switched to portrait vertical banners

### Changed (pass 22 — detail heroes + review cards)

- **DetailSliverMediaGallery** — Choosify.dc.html 6%/14%/46%/32% photo carousel on `#000435` (zoom, dots, prev/next); wired to Product Detail, Guide Detail, Spotlight content hero
- **PublicReviewCard** — DC card chrome (circular avatar, Verified Buyer, score+stars, 64px photos, Helpful footer)
- **CreatorReviewsPreview** — wide 170px YouTube row + tall 260px/190px Reels row (Product + Brand)
- **Product Detail Public Reviews** — list → Load more → Write review order

### Changed (pass 21 — detail page feeds)

- **Product Detail** — EXPLAIN panel kept; Overview cards `#F4F7F9`; BOX CONTENT | PHYSICAL SPECS `1fr 1fr`; Brand mini + PRICE ACROSS STORES `1fr 1.8fr`; Spotlight rail after stores
- **Brand Detail** — sticky tabs Overview → Products → Deals → Creators → Public → Store → FAQ; Coupons / Where to Buy / FAQ sections
- **Guide Detail** — HOW THIS REVIEW WAS MADE | WHAT IS DISCUSSED; ABOUT THE AUTHOR | IN THIS GUIDE; softened section headers; You May Also Like 5-up retained
- **Compare** — product mode `260px | 1fr | 260px` rails (YOUR COMPARISON + QUICK FILTERS | matrix | SUMMARY + Ask Emi)

### Changed (pass 20 — deep audit: Categories / Social / Deals / Discover)

- **CategoryPremiumCard** — dc anatomy: 120px image, Products·Brands, inline subcats + Show all, `#2323FF` Featured Brand footer
- **ProfileSocialPills** — Facebook / TikTok / YouTube pills on Brand Detail + Creator Profile heroes
- **Deals** — Flash Deals 3-up + Deal of the Day navy panel (`FlashDealCard` / `DealOfTheDayCard`); countdown boxes
- **Discover** — structured lanes (YouTube / Reels / Live + Blog Stories) via `DiscoverStructuredFeed` (replaces flat mixed feed body)
- **Brands / Creators lists** — navy FOLLOW BRANDS / JOIN AS CREATOR CTA bands; Creators trust banner
- **Home Viral Today** — guide fallback already wired (`viralTodayItems` / `hasViralToday`)

### Status

P0 listing/detail chrome gaps addressed for Categories, social icons, Deals cards, Discover layout. Guide/Product gallery sliver + Compare rail remain follow-ups.

### Changed (pass 19 — full-site cards = Choosify.dc.html)

- **UniversalCommerceCard** — YouTube (16:9 + avatar/channel/views + Products), Reels (150px / 9:16 + title/creator/likes), Blog (4:3 + Byline), Live (LIVE + WATCH LIVE); bookmark chrome; badges YOUTUBE/REELS/LIVE
- **BrandCardDesign** — dc Brands List tile (100px color banner, Best For / Price Range / Success ring, View Brand)
- **CreatorCardDesign** — dc Creators List tile (72px avatar + ✓, Reviews/Followers/Rating, View Profile)
- **Brand/Creator grids** — capped at 4 cols, gap `16px`
- **Spotlight feed / related rail** — dc card body (no FB publisher header on Viral-style tiles)
- **Guide Detail related** — 5-up 120px thumbs (You May Also Like)
- **Adapters** — badge labels YOUTUBE / REELS aligned with dc

### Status

Card system phase complete for Product + Spotlight/content + Brand/Creator directory tiles (ES-004 / ES-006).

### Changed (Homepage → dc.html Home)

- Page canvas `#F4F7F9`
- Hero: image-only carousel (~460px) with diagonal clip-path, arrows + dots (no headline/stats overlay)
- Top Categories: overlapping white panel (−70px), 6-col bordered icon tiles
- Viral Today: YouTube 4-col + Reels horizontal strip (replaces “Trending in Spotlight” carousel)
- Featured Products: 6-col grid + Advertise slot inside elevated white panel
- Today’s Deals / Compare / Guides / Brands / Services / Recently Viewed: match dc.html structure
- Removed Trust strip + Popular Searches from Home (not in dc.html Home)

### Changed (Listings + Product Detail + Discover — pass 3)

- **DcListingHero** — shared navy gradient hero with gradient pill title, glass search, quick chips (`src/components/design/DcListingHero.tsx`)
- **Categories / Products / Brands / Creators / Deals** — use `DcListingHero` + `#F4F7F9` page canvas
- **Discover** — hero matches dc.html (“DISCOVER.” + Simplify Your Shopping Discovery)
- **Product Detail** — breadcrumbs, `#000435` gallery band, white stats strip, 1.6fr/1fr buy box (ADD TO CART / Wishlist / Compare / Message Seller) via `ProductDetailBuyBox`

### Changed (Brand / Guide / Search / Sign In — pass 4)

- **Brand Detail** — cover banner + circular logo overlap, light identity/CTAs, Brand Score + Facts cards, white info bar (`BrandDetailHero`)
- **Guide Detail** — breadcrumbs, `#000435` media band, white engagement strip + title/author/actions card
- **Search** — dark gradient results header (no PageHeroBanner); body `#F4F7F9`
- **Sign In** — `#000435` full-page with marketing column + white auth card + trust strip

### Changed (Compare / Checkout / Order Success / Creator — pass 5)

- **Compare** — light `#F4F7F9` shell, breadcrumbs, Share/Save/Clear actions (no PageHeroBanner)
- **Checkout** — `#000435` header, `#F4F7F9` body, white form/summary cards
- **Order Success** — dark success header, overlapping white summary card on `#F4F7F9`
- **Creator Profile** — cover + circular avatar overlap, Trust Score (green bars) + Creator Info cards, light CTAs (`CreatorProfileHero`); white content summary bar; page canvas `#F4F7F9`

### Still pending (next)

- Messages, Order Tracking, Dashboard, About from remaining `data-screen-label` blocks

---

## Choosify 3.0 — Full-Site React Rebuild (pass 2)

### Added

- **DiscoverHero** — `src/components/spotlight/discovery/DiscoverHero.tsx` (navy hero, orange “Decisions”, in-feed search)
- **Chrome tokens** — `src/design-system/tokens/chrome.ts` (header/footer radial chrome, discover pill, section rhythm)
- **CSS utilities** — `.choosify-chrome-header`, `.choosify-discover-pill`, updated `.footer-brand-gradient`

### Changed

- **Homepage** — Section order matches Home Page.png; circular category tiles; Featured Brands logo marquee only; removed ticker/sticky nav/stats chrome not in mock
- **Navbar** — Compare + Wishlist icons beside cart; DISCOVER search CTA; Discover gradient pill
- **Footer** — 3.0 layout: logo mark, Connect With Us, DISCOVER/COMPANY/LEGAL, giant italic wordmark
- **Listings** — Soft `#F7F8FA` bodies; white `rounded-2xl` / `border-[#eef2f6]` filter cards; CategoriesDiscoveryHero circular premium tiles
- **Product Detail** — Light buy box under gallery; BUY NOW / Wishlist / COMPARE CTAs; `#F7F8FA` page body
- **Brand Detail** — Explore Products + Follow primary CTAs
- **Discover** — Full DiscoverHero; user-facing Discover labels; feed logic unchanged
- **Search / Login** — Soft-gray Search shell; Login centered modal + USP strip
- **Tokens** — orange primary `#FF5B00`

### Deprecated

- None

### Removed

- Homepage: HeroMarqueeTicker, StickySectionNav, What’s Happening Today strip, hero stats (not in Home Page.png)

### Fixed

- Nav label “Spotlight” → “Discover” for `/spotlight` (URL unchanged)

### Performance

- No new heavy dependencies; lazy PopularSearchKeywords retained

### Known Issues

- Product gallery still theater/dark; buy box is light (mock is fully light 3-column)
- Marketing/admin (`/marketing/*`) and messaging shells not in Choosify 3.0 mock coverage

### Future Work

- Full light Product Detail gallery + true 3-column buy box
- Folder migration to Document 01 `src/sections/` structure

---

## ES-002 — Homepage Implementation (Canonical DS-2.0 Reference)

### Added

- **Hero system (ADR-001)** — `src/components/hero/` with `Hero`, `HeroContent`, `HeroMedia`, `HeroActions`, `HeroStats`, `HeroSearch`, `HeroBackground`, `useHomepageHeroSlides`
- **Carousel system (ADR-002)** — `src/components/carousel/` with `ChoosifyCarousel`, `CarouselControls`, `CarouselIndicators`, `CarouselMedia`
- **Section header (ADR-003 layout)** — `src/components/section/SectionHeader.tsx` — canonical section title/subtitle/action/viewAll pattern
- **Homepage layout** — `src/components/home/HomepageLayout.tsx` with DS-2.0 section rhythm (40 / 48 / 64px)
- **Brand logo rail** — `src/components/home/BrandLogoRail.tsx`
- **Trust strip** — `src/components/home/TrustStrip.tsx`
- **Compare hero** — `src/components/home/CompareHero.tsx`
- **Homepage stats utility** — `src/utils/homepageStats.ts` (CMS-aware hero stats with demo fallbacks)
- **Discovery navigation** — `src/lib/home/homeDiscoveryNav.ts` (sticky ribbon + scroll spy sections)

### Changed

- **HomePage** — Single editorial flow: Hero → Breaking News Marquee → Sticky Discovery Nav → sections (no sidebars)
- **Hero** — Replaced `HomeEditorialHero` with `<Hero variant="homepage" />` including stats, search, CTAs, gradient, carousel
- **Featured Products** — Uses existing `ProductCard` inside `ChoosifyCarousel` (sponsored injection preserved)
- **Top Categories** — Premium horizontal carousel with rounded cards and hover lift
- **Trending in Discover** — Spotlight preview cards capped at 8; `ChoosifyCarousel` track mode
- **Buying Guides** — Editorial carousel layout
- **Featured Brands** — Logo rail + maximum 3 curated `BrandCardDesign` picks
- **Compare Anything** — Dual search VS layout via `CompareHero`
- **Trust** — Premium six-card trust strip
- **Section spacing** — `HOME_SECTION_PY` updated to `py-10 md:py-12 lg:py-16`
- **Design tokens (homepage only)** — Hero stats, trust, compare, categories, brand rail use `src/design-system/tokens/*`

### Deprecated

- `src/components/home/HomeEditorialHero.tsx` — superseded by `src/components/hero/Hero.tsx`
- `src/components/home/sections/HomeSectionHeader.tsx` — thin wrapper; use `SectionHeader` directly on new pages

### Removed

- None (additive refactor per sprint scope)

### Fixed

- Homepage section order aligned to approved DS-2.0 editorial sequence
- Sticky discovery ribbon restored with eight canonical items
- JSX removed from `useHomepageHeroSlides.ts` (headline rendering lives in `Hero.tsx`)

### Performance

- Lazy loading preserved on carousel media, brand logos, guide tiles, category images
- Suspense boundary retained for `PopularSearchKeywords`
- Sponsored feed injection unchanged (`useSponsoredFeedEntries`)

### Known Issues

- `HomeSectionHeader` wrapper remains for backward compatibility in legacy section imports
- `ChoosifyCarousel` paginated mode keyboard navigation requires carousel hover (matches prior `PremiumCarousel` behavior)
- Hero stats CMS field `homepageConfig.stats` is optional; falls back to catalog counts

### Future Work (ES-003+)

- Migrate non-homepage heroes to `Hero` variants (`category`, `product`, `brand`, `discover`, `search`, `dashboard`)
- Replace `UniversalCarousel` / `PremiumCarousel` usages on other pages with `ChoosifyCarousel`
- ProductCard visual redesign (ES-004)
- Global token migration beyond homepage (`DS2_TOKEN_MIGRATION.md` roadmap)
