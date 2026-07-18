import { PRIMARY_NAV_ITEMS } from '../navigation';

/** Public storefront navigation — canonical order (LE-005 Phase 5.2) */
export const STOREFRONT_NAV_ORDER = [
  'home',
  'categories',
  'spotlight',
  'products',
  'brands',
  'compare',
  'deals',
  'creators',
] as const;

/** UI labels that must not appear in primary navigation */
export const BANNED_NAV_LABELS = ['Recommendations', 'recommendations', 'Discover'] as const;

export const SPOTLIGHT_UI = {
  navLabel: 'Spotlight',
  pageTitle: 'Spotlight',
  searchPlaceholder: 'Discover products, brands, campaigns, guides...',
  spotlightSearchTitle: 'Search Spotlight',
  emptyState: 'Explore Spotlight — guides, reviews, campaigns, and live experiences',
} as const;

/** @deprecated Discover module retired — use SPOTLIGHT_UI */
export const DISCOVER_UI = {
  navLabel: SPOTLIGHT_UI.navLabel,
  pageTitle: SPOTLIGHT_UI.pageTitle,
  searchPageTitle: 'Search',
  searchPlaceholder: SPOTLIGHT_UI.searchPlaceholder,
  spotlightSearchTitle: SPOTLIGHT_UI.spotlightSearchTitle,
  mobileSearchLabel: 'Search',
  emptyState: SPOTLIGHT_UI.emptyState,
} as const;

export function getPublicNavItems() {
  return PRIMARY_NAV_ITEMS.filter((item) => STOREFRONT_NAV_ORDER.includes(item.id as typeof STOREFRONT_NAV_ORDER[number]));
}

/** @deprecated Use SPOTLIGHT_UI — Discover merged into Spotlight */
export function getDiscoverDestinationLabel(context: 'nav' | 'page' | 'footer' | 'breadcrumb'): string {
  switch (context) {
    case 'nav':
      return SPOTLIGHT_UI.navLabel;
    case 'page':
    case 'footer':
    case 'breadcrumb':
      return SPOTLIGHT_UI.pageTitle;
    default:
      return SPOTLIGHT_UI.navLabel;
  }
}
