/**
 * Contextual "Sort By" registry for storefront listing pages.
 *
 * Pure / framework-free by design (no React) so it is independently
 * testable — see scripts/probe-sort-registry.ts.
 *
 * Each entity/page gets a stable list of `{ id, label, comparator? }`
 * options plus a documented default option id. The default option has NO
 * comparator — it means "keep using the page's existing rank*() call
 * unmodified" (Featured/Recommended, or the static authored order for
 * Categories). All other options compare a small, normalized "sort item"
 * shape that the page derives from its real entities before sorting.
 *
 * `Array.prototype.sort` has been a *stable* sort per spec since ES2019
 * (all engines this app targets — evergreen Chrome/Firefox/Safari/Edge —
 * implement it that way), so every comparator below only needs to return 0
 * on a tie; the original relative order of tied items is preserved
 * automatically. No secondary index tie-break is layered on top.
 */

export interface SortOption<T> {
  id: string;
  label: string;
  /**
   * Omitted for the default/"Featured" option — the page must keep using
   * its existing rank*() call unmodified for that option instead of this
   * comparator.
   */
  comparator?: (a: T, b: T) => number;
}

function parseTsSafe(value?: string | number | null): number {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const ms = Date.parse(String(value));
  return Number.isFinite(ms) ? ms : 0;
}

function localeCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
}

/**
 * Apply a registry's chosen sort to `items`.
 * - If `sortId` resolves to the default option (or an option with no
 *   comparator), calls `applyDefault(items)` (the page's existing rank*()).
 * - Otherwise decorates each item with its normalized sort key (via
 *   `toSortKey`), sorts by the matching comparator, then unwraps — so the
 *   real entity type (e.g. CatalogProduct) never has to structurally match
 *   the registry's minimal sort-item shape.
 * Falls back to the default when `sortId` doesn't match any known option.
 */
export function applySortOption<TItem, TSortKey>(
  items: TItem[],
  options: SortOption<TSortKey>[],
  sortId: string,
  defaultId: string,
  applyDefault: (items: TItem[]) => TItem[],
  toSortKey: (item: TItem) => TSortKey,
): TItem[] {
  const match = options.find((o) => o.id === sortId);
  if (!match || !match.comparator || match.id === defaultId) {
    return applyDefault(items);
  }
  const comparator = match.comparator;
  const decorated = items.map((item) => ({ item, key: toSortKey(item) }));
  decorated.sort((a, b) => comparator(a.key, b.key));
  return decorated.map((d) => d.item);
}

/** Validate a `?sort=` URL value against a page's known option ids; falls back to the default silently. */
export function resolveSortIdFromParam<T>(
  options: SortOption<T>[],
  defaultId: string,
  raw: string | null | undefined,
): string {
  if (!raw) return defaultId;
  return options.some((o) => o.id === raw) ? raw : defaultId;
}

// ─── Products (AllProductsPage) ─────────────────────────────────────────────

export interface ProductSortItem {
  createdAt?: string | null;
  price: number;
}

export const PRODUCT_SORT_DEFAULT = 'featured';

export const PRODUCT_SORT_OPTIONS: SortOption<ProductSortItem>[] = [
  { id: 'featured', label: 'Featured / Recommended' },
  {
    id: 'newest',
    label: 'Newest First',
    comparator: (a, b) => parseTsSafe(b.createdAt) - parseTsSafe(a.createdAt),
  },
  {
    id: 'oldest',
    label: 'Oldest First',
    comparator: (a, b) => parseTsSafe(a.createdAt) - parseTsSafe(b.createdAt),
  },
  { id: 'price_asc', label: 'Price: Low to High', comparator: (a, b) => a.price - b.price },
  { id: 'price_desc', label: 'Price: High to Low', comparator: (a, b) => b.price - a.price },
];

// ─── Search (SearchPage, products only) ─────────────────────────────────────

export type SearchSortItem = ProductSortItem;

export const SEARCH_SORT_DEFAULT = 'relevance';

export const SEARCH_SORT_OPTIONS: SortOption<SearchSortItem>[] = [
  { id: 'relevance', label: 'Relevance' },
  {
    id: 'newest',
    label: 'Newest First',
    comparator: (a, b) => parseTsSafe(b.createdAt) - parseTsSafe(a.createdAt),
  },
  {
    id: 'oldest',
    label: 'Oldest First',
    comparator: (a, b) => parseTsSafe(a.createdAt) - parseTsSafe(b.createdAt),
  },
  { id: 'price_asc', label: 'Price: Low to High', comparator: (a, b) => a.price - b.price },
  { id: 'price_desc', label: 'Price: High to Low', comparator: (a, b) => b.price - a.price },
];

// ─── Brands (BrandsPage) ─────────────────────────────────────────────────────

export interface BrandSortItem {
  createdAt?: string | null;
  name: string;
  /** Live count of products where brandId matches — computed from allCatalogProducts */
  productCount: number;
}

export const BRAND_SORT_DEFAULT = 'featured';

export const BRAND_SORT_OPTIONS: SortOption<BrandSortItem>[] = [
  { id: 'featured', label: 'Featured / Recommended' },
  {
    id: 'newest',
    label: 'Newest First',
    comparator: (a, b) => parseTsSafe(b.createdAt) - parseTsSafe(a.createdAt),
  },
  { id: 'az', label: 'Name: A to Z', comparator: (a, b) => localeCompare(a.name, b.name) },
  { id: 'za', label: 'Name: Z to A', comparator: (a, b) => localeCompare(b.name, a.name) },
  {
    id: 'most_products',
    label: 'Most Products',
    comparator: (a, b) => b.productCount - a.productCount,
  },
];

// ─── Brand Detail catalog (BrandDetailPage) ─────────────────────────────────

export interface BrandDetailSortItem {
  price: number;
  /** Real % off, from productDiscountPercent()/dealDiscountPercent()-style computation — never a raw stored field */
  discountPercent: number;
}

export const BRAND_DETAIL_SORT_DEFAULT = 'default';

export const BRAND_DETAIL_SORT_OPTIONS: SortOption<BrandDetailSortItem>[] = [
  { id: 'default', label: 'Featured / Recommended' },
  { id: 'price_asc', label: 'Price: Low to High', comparator: (a, b) => a.price - b.price },
  { id: 'price_desc', label: 'Price: High to Low', comparator: (a, b) => b.price - a.price },
  {
    id: 'discount_desc',
    label: 'Best Discount',
    comparator: (a, b) => b.discountPercent - a.discountPercent,
  },
];

// ─── Creators (CreatorsPage) ─────────────────────────────────────────────────

export interface CreatorSortItem {
  createdAt?: string | null;
  name: string;
  /** Live count of videos.length + reels.length + blogs.length */
  contentCount: number;
}

export const CREATOR_SORT_DEFAULT = 'featured';

export const CREATOR_SORT_OPTIONS: SortOption<CreatorSortItem>[] = [
  { id: 'featured', label: 'Featured / Recommended' },
  {
    id: 'newest',
    label: 'Newest First',
    comparator: (a, b) => parseTsSafe(b.createdAt) - parseTsSafe(a.createdAt),
  },
  { id: 'az', label: 'Name: A to Z', comparator: (a, b) => localeCompare(a.name, b.name) },
  { id: 'za', label: 'Name: Z to A', comparator: (a, b) => localeCompare(b.name, a.name) },
  {
    id: 'most_content',
    label: 'Most Content',
    comparator: (a, b) => b.contentCount - a.contentCount,
  },
];

// ─── Categories (CategoriesPage) ────────────────────────────────────────────

export interface CategorySortItem {
  name: string;
  /** Live per-category product count */
  count: number;
}

export const CATEGORY_SORT_DEFAULT = 'default';

export const CATEGORY_SORT_OPTIONS: SortOption<CategorySortItem>[] = [
  { id: 'default', label: 'Default Order' },
  { id: 'az', label: 'Name: A to Z', comparator: (a, b) => localeCompare(a.name, b.name) },
  { id: 'za', label: 'Name: Z to A', comparator: (a, b) => localeCompare(b.name, a.name) },
  {
    id: 'most_products',
    label: 'Most Products',
    comparator: (a, b) => b.count - a.count,
  },
];

// ─── Deals (DealsPage) ───────────────────────────────────────────────────────

export interface DealSortItem {
  createdAt?: string | null;
  price: number;
  /** From dealDiscountPercent() — never a raw stored discountPercent/discountValue field */
  discountPercent: number;
  /** ms epoch resolved the same way scoreDeal()/FlashDealCountdown do; null when no end date */
  endsAt: number | null;
}

export const DEAL_SORT_DEFAULT = 'featured';

export const DEAL_SORT_OPTIONS: SortOption<DealSortItem>[] = [
  { id: 'featured', label: 'Featured / Recommended' },
  {
    id: 'ending_soon',
    label: 'Ending Soon',
    comparator: (a, b) => {
      const aEnds = a.endsAt ?? Number.POSITIVE_INFINITY;
      const bEnds = b.endsAt ?? Number.POSITIVE_INFINITY;
      return aEnds - bEnds;
    },
  },
  {
    id: 'newest',
    label: 'Newest First',
    comparator: (a, b) => parseTsSafe(b.createdAt) - parseTsSafe(a.createdAt),
  },
  { id: 'price_asc', label: 'Price: Low to High', comparator: (a, b) => a.price - b.price },
  { id: 'price_desc', label: 'Price: High to Low', comparator: (a, b) => b.price - a.price },
  {
    id: 'discount_desc',
    label: 'Best Discount',
    comparator: (a, b) => b.discountPercent - a.discountPercent,
  },
];
