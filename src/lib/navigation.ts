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

/** Canonical primary navigation — single source for navbar, hamburger, and hero titles */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { id: 'home', path: '/', label: 'Home', heroTitle: 'Home' },
  { id: 'categories', path: '/categories', label: 'Categories', heroTitle: 'Categories' },
  { id: 'products', path: '/products', label: 'Products', heroTitle: 'Products' },
  { id: 'brands', path: '/brands', label: 'Brands', heroTitle: 'Brands' },
  {
    id: 'guides',
    path: '/guides',
    label: 'Guides',
    labelWide: 'Recommendations',
    heroTitle: 'Guides',
  },
  { id: 'compare', path: '/compare', label: 'Compare', heroTitle: 'Compare' },
  { id: 'deals', path: '/deals', label: 'Deals', heroTitle: 'Deals' },
  {
    id: 'whats-on',
    path: '/whats-on',
    label: "What's On",
    labelWide: "What's On Discovery",
    heroTitle: "What's On",
  },
  { id: 'creators', path: '/creators', label: 'Creators', heroTitle: 'Creators' },
];

export function getNavItemByPath(path: string): PrimaryNavItem | undefined {
  if (path === '/') return PRIMARY_NAV_ITEMS.find((item) => item.path === '/');
  return PRIMARY_NAV_ITEMS.find(
    (item) => item.path !== '/' && path.startsWith(item.path),
  );
}

export function getNavLabel(item: PrimaryNavItem, wide = false): string {
  return wide && item.labelWide ? item.labelWide : item.label;
}
