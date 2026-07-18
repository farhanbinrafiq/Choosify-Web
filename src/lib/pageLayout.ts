/**
 * Choosify progressive layout — breakpoint plan
 * =============================================
 *
 * Goal: stop squeezing the center feed on ~13" laptops (1024–1535px) by
 * delaying the right promo rail until there is enough horizontal room.
 *
 * Layout modes (viewport width)
 * -------------------------------
 * | Mode   | Range (px)   | Page shell        | Left rail | Right rail | Card grid (in shell) |
 * |--------|--------------|-------------------|-----------|------------|----------------------|
 * | stack  | < 1024       | 1 column          | drawer    | hidden     | 2 cols               |
 * | browse | 1024 – 1535  | 2 columns         | sticky    | hidden     | 3 cols max           |
 * | full   | ≥ 1536       | 3 columns         | sticky    | sticky     | 5 product / 4 brand  |
 *
 * Tailwind alignment: lg = 1024, xl = 1280, 2xl = 1536
 *
 * Center feed width (approx., 1440px max-width shell)
 * -----------------------------------------------------
 * | Mode   | Sidebars consumed | Center ~px @ 1440 | Center ~px @ 1280 |
 * |--------|-------------------|-------------------|-------------------|
 * | stack  | 0                 | full width        | full width        |
 * | browse | ~204–228 left     | ~1210             | ~1050             |
 * | full   | ~434–508 both     | ~930              | ~770              |
 *
 * Page profiles
 * -------------
 * - listing (products, deals, categories, brands, guides, whats-on):
 *   default progressive shell — filters left, feed center, promos right @ 2xl+
 * - detail (product, brand, guide, creator): same shell; sidebars hold specs/related
 * - home: progressive shell today; optional `PAGE_SHELL_FEED_ONLY` hides both rails @ lg+
 * - compare: `PAGE_SHELL_NO_RIGHT_RAIL` — never allocate a third column
 *
 * Implementation notes
 * --------------------
 * - Shell behavior lives in `index.css` under `.choosify-page-shell` media queries.
 * - Right rail is hidden in browse mode via CSS (`aside:last-of-type`) so existing
 *   pages do not need per-file `2xl:` visibility classes.
 * - Prefer `SIDEBAR_LEFT` / `SIDEBAR_RIGHT` on new markup for explicit intent.
 * - Product grids: `.choosify-product-grid` (max 5 cols @ 1280px+)
 * - Brand/creator grids: `.choosify-brand-grid` / `.choosify-creator-grid` (4 cols @ 1024px, 5 @ 1280px+)
 */

/** Matches Tailwind defaults — keep in sync with tailwind.config if customized */
export const LAYOUT_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type LayoutMode = 'stack' | 'browse' | 'full';

/** Resolve layout mode from viewport width (useful for JS-driven UI, e.g. drawer vs rail) */
export function getLayoutMode(width: number): LayoutMode {
  if (width >= LAYOUT_BREAKPOINTS['2xl']) return 'full';
  if (width >= LAYOUT_BREAKPOINTS.lg) return 'browse';
  return 'stack';
}

/** Product card grid column counts per layout mode (brand/creator cap at 4 — see CSS) */
export const SHELL_GRID_COLUMNS: Record<LayoutMode, number> = {
  stack: 2,
  browse: 3,
  full: 5,
};

export const SHELL_BRAND_GRID_COLUMNS: Record<LayoutMode, number> = {
  stack: 1,
  browse: 2,
  full: 4,
};

export type PageLayoutProfile = 'listing' | 'detail' | 'home' | 'compare';

export const PAGE_LAYOUT_PROFILES: Record<string, PageLayoutProfile> = {
  '/': 'home',
  '/products': 'listing',
  '/categories': 'listing',
  '/brands': 'listing',
  '/deals': 'listing',
  '/guides': 'listing',
  '/whats-on': 'listing',
  '/compare': 'compare',
};

/** Default progressive shell — 1 → 2 → 3 columns via CSS in index.css */
export const PAGE_THREE_COL_SHELL =
  'choosify-page-shell choosify-page-grid grid grid-cols-1 gap-5 xl:gap-6 2xl:gap-7 items-start w-full relative';

/** Compare and other wide-center pages — right rail never appears */
export const PAGE_SHELL_DETAIL_PRODUCT = `${PAGE_THREE_COL_SHELL} choosify-page-shell--detail-product`;

/** Future: home feed-only — both sidebars hidden @ lg+, single full-width column */
export const PAGE_SHELL_FEED_ONLY = `${PAGE_THREE_COL_SHELL} choosify-page-shell--feed-only`;

export const PAGE_SHELL_WRAPPER =
  'max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-5 w-full';

export const PAGE_SHELL_WRAPPER_WIDE =
  'max-w-[1680px] mx-auto px-4 sm:px-5 lg:px-6 xl:px-8 py-5 w-full';

export const PAGE_MIDDLE_FEED =
  'choosify-middle-feed min-w-0 w-full';

/** Stacked full-width blocks below the catalog shell on detail pages */
export const DETAIL_FEED_STACK = 'choosify-detail-feed w-full';

export const DETAIL_SIDEBAR_LEFT =
  'choosify-sidebar-left hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 min-w-0 w-full max-w-full self-start overflow-hidden';

export const DETAIL_SIDEBAR_RIGHT =
  'choosify-sidebar-right hidden 2xl:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 min-w-0 w-full max-w-full self-start overflow-hidden';

/** Product detail pricing rail — visible from lg; pairs with left specs in a 2-col shell */
export const DETAIL_SIDEBAR_RIGHT_PRODUCT =
  'choosify-sidebar-right choosify-sidebar-right--product hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 min-w-0 w-full max-w-full self-start overflow-hidden';

/** Left filter / quick-access rail — visible from lg (browse + full modes) */
export const SIDEBAR_LEFT =
  'choosify-sidebar-left hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 min-w-0 w-full max-w-full self-start';

/** Right promo / deals rail — only visible in full mode (2xl+); CSS also hides in browse */
export const SIDEBAR_RIGHT =
  'choosify-sidebar-right hidden 2xl:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 min-w-0 w-full max-w-full';

/** Single-column scroll feed for brand/product detail pages (no side rails) */
export const DETAIL_SINGLE_FEED =
  'choosify-detail-single-feed w-full flex flex-col gap-8';

/** Product grids on detail feed pages — same 5-col cap as listing (alias class) */
export const DETAIL_FEED_GRID_5 = 'choosify-detail-feed-grid choosify-product-grid w-full';

/** Listing/browse pages — full-width feed, sidebars hidden via CSS */
export const PAGE_LISTING_SINGLE_SHELL =
  `${PAGE_THREE_COL_SHELL} choosify-listing-feed-only`;

export const LISTING_SINGLE_FEED =
  'choosify-listing-single-feed w-full flex flex-col gap-8 min-w-0';

/** Alias — same 5-col grid on listing feeds */
export const LISTING_FEED_GRID_5 = DETAIL_FEED_GRID_5;

/** Product grids: 2 → 3 → 4 → 5 cols by breakpoint (see index.css) */
export const PRODUCT_CARD_GRID = 'choosify-product-grid w-full';

/** Brand profile card grids: 1 → 2 → 3 → 4 cols max */
export const BRAND_CARD_GRID = 'choosify-brand-grid w-full';

/** Creator profile card grids — same breakpoints as brand cards */
export const CREATOR_CARD_GRID = 'choosify-creator-grid w-full';

/** Guide page media cards (YouTube, Reels, Blogs) — max 4 cols per row */
export const GUIDE_MEDIA_GRID = 'choosify-guide-media-grid w-full';

/** Category browse cards — 2 → 3 → 4 → 5 cols; fixed card size, grid adds/removes columns */
export const CATEGORY_CARD_GRID = 'choosify-category-grid w-full';

/** Home popular categories — always 5 cards per row from lg+ (mobile stays 2 cols) */
export const HOME_POPULAR_CATEGORY_GRID = 'choosify-home-category-grid w-full';

/** What's On brand post cards — 1 → 2 → 3 → 4 cols by breakpoint; max 4 per row */
export const WHATS_ON_CARD_GRID = 'choosify-whats-on-grid w-full';

/** Creator review hybrid feed — row 1: max 3 (1 → 2 → 3 cols); row 2+: max 4 reels per row */
export const CREATOR_HYBRID_GRID = 'choosify-creator-hybrid-grid w-full';
