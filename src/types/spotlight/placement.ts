import type { SpotlightCampaignCta } from './lifecycle';

/**
 * Surfaces where Spotlight campaigns can be placed.
 * Legacy CatalogPlacement (`spotlight_section`) coexists until migration sprints.
 */
export type SpotlightPlacementSurface =
  | 'homepage'
  | 'spotlight_feed'
  | 'brand_page'
  | 'product_page'
  | 'category_page'
  | 'search_results'
  | 'recommendation_rail'
  | 'homepage_hero';

export const SPOTLIGHT_PLACEMENT_SURFACES: Record<
  SpotlightPlacementSurface,
  { label: string; implemented: boolean }
> = {
  homepage: { label: 'Homepage', implemented: false },
  spotlight_feed: { label: 'Spotlight Feed', implemented: false },
  brand_page: { label: 'Brand Page', implemented: false },
  product_page: { label: 'Product Page', implemented: false },
  category_page: { label: 'Category Page', implemented: false },
  search_results: { label: 'Search Results', implemented: false },
  recommendation_rail: { label: 'Recommendation Rail', implemented: false },
  homepage_hero: { label: 'Homepage Hero', implemented: false },
};

/**
 * Resolved placement record — links a campaign to a surface slot.
 * Stored in `spotlight_placements` collection.
 */
export interface SpotlightPlacement {
  placementId: string;
  campaignId: string;
  surface: SpotlightPlacementSurface;
  /** DOM / route anchor when applicable */
  slotKey?: string;
  priority: number;
  isActive: boolean;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}

/** View model: campaign + placement context for a specific surface */
export interface SpotlightResolvedPlacement {
  placement: SpotlightPlacement;
  campaignId: string;
  campaignSlug: string;
  headline: string;
  primaryProductId?: string;
  mediaIds: string[];
  cta: SpotlightCampaignCta;
  isSponsored: boolean;
}
