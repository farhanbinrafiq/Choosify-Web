/** CMS placement slot identifiers — configure matching keys in the admin dashboard. */
export const PLACEMENT_KEYS = {
  SIDEBAR_PORTRAIT: 'sidebar_portrait',
  SIDEBAR_LANDSCAPE: 'sidebar_landscape',
  INFEED_PRODUCT: 'infeed_product',
  INFEED_BRAND: 'infeed_brand',
  INFEED_CREATOR: 'infeed_creator',
  INFEED_DEAL: 'infeed_deal',
  INFEED_GUIDE: 'infeed_guide',
  SPOTLIGHT_SECTION: 'spotlight_section',
  TRENDING_SECTION: 'trending_section',
  DEALS_SECTION: 'deals_section',
} as const;

export type PlacementKey = (typeof PLACEMENT_KEYS)[keyof typeof PLACEMENT_KEYS];

/** Organic items between in-feed sponsored cards (~1 sponsored : 5 organic). */
export const INFEED_INTERVAL = {
  product: 5,
  brand: 5,
  creator: 5,
  deal: 5,
  guide: 8,
} as const;

export const INFEED_MAX_PER_PAGE = 2;
