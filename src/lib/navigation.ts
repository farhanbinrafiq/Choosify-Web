import type { SiteNavItem } from '../types/catalog';

export type PrimaryNavItem = {
  id: string;
  path: string;
  /** Default label — used in hamburger menu and compact navbar */
  label: string;
  /** Wider navbar label at 2xl+ when set */
  labelWide?: string;
  /** Uppercase hero heading */
  heroTitle: string;
};

/**
 * Canonical primary navigation — Choosify storefront header order.
 * Recommendations links straight to /spotlight (the neutral Discover feed,
 * "All" active, no filter) rather than /guides (/spotlight?tab=guides) --
 * a navbar entry point should not silently pre-apply a content-type filter
 * the user never asked for. /guides remains a valid deep link elsewhere
 * (e.g. "View All" on a Buying Guides rail) for when a filter is the point.
 */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { id: 'home', path: '/', label: 'Home', heroTitle: 'Home' },
  { id: 'categories', path: '/categories', label: 'Categories', heroTitle: 'Categories' },
  {
    id: 'products',
    path: '/products',
    label: 'Products & Services',
    heroTitle: 'Products & Services',
  },
  { id: 'brands', path: '/brands', label: 'Brands', heroTitle: 'Brands' },
  {
    id: 'recommendations',
    path: '/spotlight',
    label: 'Recommendations',
    heroTitle: 'Recommendations',
  },
  { id: 'deals', path: '/deals', label: 'Deals', heroTitle: 'Deals' },
  { id: 'creators', path: '/creators', label: 'Creators', heroTitle: 'Creators' },
  { id: 'compare', path: '/compare', label: 'Compare', heroTitle: 'Compare' },
];

/** Paths that must never appear in the main storefront navbar. */
const RETIRED_MAIN_NAV_PATHS = new Set([
  '/whats-on',
  '/recommendations', // legacy alias — use /spotlight as Recommendations
]);

/** Force storefront labels even when CMS nav still says "Browse" / "Discover". */
const NAV_PATH_LABEL_OVERRIDES: Record<string, string> = {
  '/products': 'Products & Services',
  '/spotlight': 'Recommendations',
  '/guides': 'Recommendations',
};

/** Normalize nav labels from CMS. */
export function getNavigationLabel(path: string, fallback: string): string {
  return NAV_PATH_LABEL_OVERRIDES[path] ?? fallback;
}

/**
 * Authoritative storefront navigation.
 * Always returns the canonical PRIMARY_NAV_ITEMS order/labels so CMS cannot
 * reintroduce Discover or leave Browse as the /products label.
 */
export function resolveSiteNavigation(_cmsNav?: SiteNavItem[]): SiteNavItem[] {
  return PRIMARY_NAV_ITEMS.map((primary, index) => ({
    id: primary.id,
    path: primary.path,
    label: getNavigationLabel(primary.path, primary.label),
    order: index,
  }));
}

/** @deprecated kept for callers that still filter CMS rows */
export function isRetiredMainNavPath(path: string): boolean {
  if (RETIRED_MAIN_NAV_PATHS.has(path)) return true;
  if (path.startsWith('/whats-on/') || path.startsWith('/spotlight/')) return true;
  return false;
}

export function getNavItemByPath(path: string): PrimaryNavItem | undefined {
  if (path === '/') return PRIMARY_NAV_ITEMS.find((item) => item.path === '/');
  // /guides is a deep link into Recommendations (/spotlight?tab=guides) --
  // resolve it to the same nav item as /spotlight for active-state purposes.
  if (path.startsWith('/spotlight') || path.startsWith('/guides')) {
    return PRIMARY_NAV_ITEMS.find((item) => item.id === 'recommendations');
  }
  return PRIMARY_NAV_ITEMS.find(
    (item) => item.path !== '/' && path.startsWith(item.path),
  );
}

export function getNavLabel(item: PrimaryNavItem, wide = false): string {
  return wide && item.labelWide ? item.labelWide : item.label;
}
