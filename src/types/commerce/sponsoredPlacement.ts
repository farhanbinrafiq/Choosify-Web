/**
 * LE-006.3 — Universal sponsored placement types (frontend only)
 */

export type SponsoredPlacementSurface =
  | 'home'
  | 'products'
  | 'categories'
  | 'brands'
  | 'deals'
  | 'search'
  | 'spotlight'
  | 'compare';

export type SponsoredPlacementKind =
  | 'product'
  | 'brand'
  | 'collection'
  | 'spotlight'
  | 'creator_review'
  | 'guide'
  | 'service'
  | 'deal'
  | 'event'
  | 'launch';

/** One sponsored placement — same shape for every surface */
export interface SponsoredPlacementItem {
  id: string;
  kind: SponsoredPlacementKind;
  sponsorName: string;
  sponsorLogoUrl?: string;
  isVerified?: boolean;
  /** "Sponsored" or "Sponsored by Samsung" */
  sponsoredLabel: string;
  href: string;
  ctaLabel: string;
  isExternal?: boolean;
  title?: string;
  subtitle?: string;
  image?: string;
  /** Resolved catalog entity ids for card reuse */
  productId?: string;
  brandId?: string;
  guideId?: string;
  creatorId?: string;
  spotlightSlug?: string;
}
