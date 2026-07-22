/**
 * Config-driven Content Detail Page (Guide Details shell).
 *
 * Separation of concerns:
 * - contentType  → which optional sections are *available* by default
 * - category     → how sections are *labeled* (dictionary lookup)
 * - sections[]   → which optional sections are *enabled* for this item (+ data)
 *
 * Fixed sections always render; optional sections render from `sections` only.
 */

import type { SpotlightPageSectionId } from './pageSections';

/** Always render — not toggled per content item */
export const CONTENT_DETAIL_FIXED_SECTION_IDS = [
  'hero_media',
  'media_gallery',
  'what_is_discussed',
  'related_spotlight',
  'profile_card',
] as const;

export type ContentDetailFixedSectionId =
  (typeof CONTENT_DETAIL_FIXED_SECTION_IDS)[number];

/**
 * Optional blocks — toggled + ordered per content item from creator admin.
 * IDs align with SpotlightPageSectionId where possible; aliases normalize legacy CMS ids.
 */
export const CONTENT_DETAIL_OPTIONAL_SECTION_IDS = [
  'winner',
  'why_it_won',
  'verdict',
  'takeaways',
  'items_mentioned',
  'brands_mentioned',
  'how_review_was_made',
] as const;

export type ContentDetailOptionalSectionId =
  (typeof CONTENT_DETAIL_OPTIONAL_SECTION_IDS)[number];

/** Human labels for admin toggles */
export const CONTENT_DETAIL_OPTIONAL_SECTION_LABELS: Record<
  ContentDetailOptionalSectionId,
  string
> = {
  winner: 'Winner / Top Pick(s)',
  why_it_won: 'Why This Won',
  verdict: 'Recommendation & Quick Verdict',
  takeaways: 'Key Takeaways',
  items_mentioned: 'Items Mentioned',
  brands_mentioned: 'Brands Mentioned',
  how_review_was_made: 'How This Review Was Made',
};

/** Payload stored with each enabled optional section (from publisher admin) */
export interface ContentDetailSectionData {
  /** Winner / top-pick product or brand ids (1–N) */
  winnerIds?: string[];
  /** Items tagged as top picks (drives Top 3 vs plain mentioned title) */
  topPickIds?: string[];
  /** Explicit item ids for items_mentioned (falls back to connections.productIds) */
  itemIds?: string[];
  /** Brand ids for brands_mentioned */
  brandIds?: string[];
  /** Why-this-won chip labels */
  whyWonChips?: string[];
  /** Verdict lists */
  bestFor?: string[];
  notFor?: string[];
  whatWeLike?: string[];
  whatToConsider?: string[];
  /** Takeaways body */
  takeawayTitle?: string;
  takeawayBody?: string;
  /** How this review was made checklist */
  reviewMethodSteps?: string[];
}

export interface ContentDetailSectionConfig {
  id: ContentDetailOptionalSectionId;
  /** When false, section is skipped even if present in the array */
  enabled: boolean;
  /** Sort key — lower first. Admin reorder writes this. */
  order: number;
  data?: ContentDetailSectionData;
}

/**
 * Map legacy pageSections ids → optional content-detail ids.
 * Allows existing CMS records to drive the new renderer without migration.
 */
export const LEGACY_PAGE_SECTION_TO_OPTIONAL: Partial<
  Record<SpotlightPageSectionId, ContentDetailOptionalSectionId>
> = {
  winner: 'winner',
  why_it_won: 'why_it_won',
  verdict: 'verdict',
  pros: 'verdict',
  cons: 'verdict',
  takeaways: 'takeaways',
  top_3: 'items_mentioned',
  top_5: 'items_mentioned',
  top_picks: 'items_mentioned',
  associated_products: 'items_mentioned',
  products_reviewed: 'how_review_was_made',
  related_brands: 'brands_mentioned',
};

/** Sticky / in-page nav targets for optional (+ fixed discussed/profile) */
export const CONTENT_DETAIL_NAV_IDS: Record<ContentDetailOptionalSectionId, string> = {
  winner: 'winner',
  why_it_won: 'why-won',
  verdict: 'quick-verdict',
  takeaways: 'takeaways',
  items_mentioned: 'items-mentioned',
  brands_mentioned: 'brands-mentioned',
  how_review_was_made: 'how-review-was-made',
};
