/**
 * LE-006.3 — Sponsored placement surface configuration (frontend placeholders)
 */

import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../placements';
import type { SponsoredPlacementSurface } from '../../types/commerce/sponsoredPlacement';
import type { PlacementKey } from '../placements';

export interface SponsoredSurfaceConfig {
  placementKey: PlacementKey | string;
  interval: number;
  maxPerPage: number;
  /** Search: never insert before this organic index */
  minOrganicBeforeFirst?: number;
  neverFirst?: boolean;
}

export const SPONSORED_SURFACE_CONFIG: Record<SponsoredPlacementSurface, SponsoredSurfaceConfig> = {
  home: {
    placementKey: PLACEMENT_KEYS.INFEED_PRODUCT,
    interval: 9,
    maxPerPage: 2,
  },
  products: {
    placementKey: PLACEMENT_KEYS.INFEED_PRODUCT,
    interval: INFEED_INTERVAL.product,
    maxPerPage: INFEED_MAX_PER_PAGE,
  },
  categories: {
    placementKey: 'infeed_category',
    interval: 12,
    maxPerPage: 1,
  },
  brands: {
    placementKey: PLACEMENT_KEYS.INFEED_BRAND,
    interval: INFEED_INTERVAL.brand,
    maxPerPage: INFEED_MAX_PER_PAGE,
  },
  deals: {
    placementKey: PLACEMENT_KEYS.INFEED_DEAL,
    interval: INFEED_INTERVAL.deal,
    maxPerPage: INFEED_MAX_PER_PAGE,
  },
  search: {
    placementKey: 'infeed_search',
    interval: 8,
    maxPerPage: 1,
    minOrganicBeforeFirst: 8,
    neverFirst: true,
  },
  spotlight: {
    placementKey: PLACEMENT_KEYS.SPOTLIGHT_SECTION,
    interval: 8,
    maxPerPage: 2,
  },
  compare: {
    placementKey: 'compare_rail',
    interval: 1,
    maxPerPage: 2,
  },
};
