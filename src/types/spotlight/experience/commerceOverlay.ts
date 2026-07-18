/**
 * Commerce Overlay (CTO) — commerce enhances content, not replaces it
 */

export interface SpotlightCommerceCta {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface SpotlightCommerceOverlay {
  featuredProductIds: string[];
  featuredServiceIds: string[];
  offerIds: string[];
  couponIds: string[];
  bundleIds: string[];
  primaryCta?: SpotlightCommerceCta;
  secondaryCta?: SpotlightCommerceCta;
  pinnedProductIds?: string[];
  pinnedOfferIds?: string[];
}

export const EMPTY_SPOTLIGHT_COMMERCE: SpotlightCommerceOverlay = {
  featuredProductIds: [],
  featuredServiceIds: [],
  offerIds: [],
  couponIds: [],
  bundleIds: [],
};
