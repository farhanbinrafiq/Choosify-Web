/**
 * Spotlight Section Registry — LE-005 UX-02
 * Commerce-first section ordering with 6–10 item caps.
 */

export {
  FEED_SECTION_REGISTRY as SPOTLIGHT_SECTION_REGISTRY,
  sectionDefinition as spotlightSectionDefinition,
  maxItemsForSection as spotlightMaxItemsForSection,
  orderedSectionIds as spotlightOrderedSectionIds,
  sortCommerceFirst as spotlightSortCommerceFirst,
  type FeedSectionDefinition as SpotlightSectionDefinition,
} from '../experience/sectionRegistry';

/** UX-02 primary feed sections in display order */
export const UX02_PRIMARY_SECTIONS = [
  'featured_today',
  'trending_now',
  'recently_added',
  'live_now',
  'creator_reviews',
  'buying_guides',
  'collections',
  'series',
  'campaigns',
] as const;
