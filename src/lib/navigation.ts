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

/** Canonical primary navigation — Choosify 3.0 order */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { id: 'home', path: '/', label: 'Home', heroTitle: 'Home' },
  { id: 'categories', path: '/categories', label: 'Categories', heroTitle: 'Categories' },
  { id: 'products', path: '/products', label: 'Products', heroTitle: 'Products' },
  { id: 'brands', path: '/brands', label: 'Brands', heroTitle: 'Brands' },
  { id: 'spotlight', path: '/spotlight', label: 'Discover', heroTitle: 'Discover' },
  { id: 'creators', path: '/creators', label: 'Creators', heroTitle: 'Creators' },
  { id: 'deals', path: '/deals', label: 'Deals', heroTitle: 'Deals' },
  { id: 'compare', path: '/compare', label: 'Compare', heroTitle: 'Compare' },
];

const NAV_PATH_LABEL_OVERRIDES: Record<string, string> = {};

/** Normalize nav labels from CMS. */
export function getNavigationLabel(path: string, fallback: string): string {
  return NAV_PATH_LABEL_OVERRIDES[path] ?? fallback;
}

/**
 * Merge CMS navigation with canonical primary items so production never drops
 * primary routes when the dashboard nav list is incomplete.
 * Drops retired /whats-on entries (services live on /products).
 */
export function resolveSiteNavigation(cmsNav?: SiteNavItem[]): SiteNavItem[] | null {
  if (!cmsNav?.length) return null;

  const byPath = new Map<string, SiteNavItem>();
  cmsNav.forEach((item) => {
    if (item.path === '/whats-on' || item.path.startsWith('/whats-on/')) return;
    byPath.set(item.path, {
      ...item,
      label: getNavigationLabel(item.path, item.label),
    });
  });

  PRIMARY_NAV_ITEMS.forEach((primary, index) => {
    if (byPath.has(primary.path)) return;
    byPath.set(primary.path, {
      id: primary.id,
      path: primary.path,
      label: getNavigationLabel(primary.path, primary.label),
      order: cmsNav.length + index,
    });
  });

  return [...byPath.values()].sort((a, b) => a.order - b.order);
}

export function getNavItemByPath(path: string): PrimaryNavItem | undefined {
  if (path === '/') return PRIMARY_NAV_ITEMS.find((item) => item.path === '/');
  return PRIMARY_NAV_ITEMS.find(
    (item) => item.path !== '/' && path.startsWith(item.path),
  );
}

export function getNavLabel(item: PrimaryNavItem, wide = false): string {
  return wide && item.labelWide ? item.labelWide : item.label;
}
