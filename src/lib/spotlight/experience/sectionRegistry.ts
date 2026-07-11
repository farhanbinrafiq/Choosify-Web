/**
 * Feed Section Registry — commerce-first section ordering and limits
 */

import type { SpotlightDiscoverSectionId } from '../../../types/spotlight/experience/content';
import type { ContentDensity } from './contentDensityRegistry';

export interface FeedSectionDefinition {
  id: SpotlightDiscoverSectionId;
  priority: number;
  maxItems: number;
  defaultDensity: ContentDensity;
  commerceFirst: boolean;
  lazyLoad: boolean;
}

/** Commerce-first ordering — products & shopping content before editorial */
export const FEED_SECTION_REGISTRY: FeedSectionDefinition[] = [
  { id: 'featured_today', priority: 1, maxItems: 1, defaultDensity: 'featured', commerceFirst: true, lazyLoad: false },
  { id: 'new_launches', priority: 2, maxItems: 6, defaultDensity: 'featured', commerceFirst: true, lazyLoad: false },
  { id: 'live_now', priority: 3, maxItems: 6, defaultDensity: 'featured', commerceFirst: true, lazyLoad: false },
  { id: 'top_campaigns', priority: 4, maxItems: 8, defaultDensity: 'standard', commerceFirst: true, lazyLoad: false },
  { id: 'trending_now', priority: 5, maxItems: 8, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'popular_this_week', priority: 6, maxItems: 8, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'creator_reviews', priority: 7, maxItems: 6, defaultDensity: 'standard', commerceFirst: true, lazyLoad: true },
  { id: 'buying_guides', priority: 8, maxItems: 6, defaultDensity: 'standard', commerceFirst: true, lazyLoad: true },
  { id: 'top_services', priority: 9, maxItems: 6, defaultDensity: 'standard', commerceFirst: true, lazyLoad: true },
  { id: 'campaigns', priority: 10, maxItems: 8, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'upcoming', priority: 11, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'collections', priority: 12, maxItems: 8, defaultDensity: 'standard', commerceFirst: true, lazyLoad: true },
  { id: 'series', priority: 13, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'top_brands', priority: 14, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'creator_picks', priority: 15, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'top_creators', priority: 16, maxItems: 6, defaultDensity: 'compact', commerceFirst: false, lazyLoad: true },
  { id: 'recommendations', priority: 17, maxItems: 6, defaultDensity: 'standard', commerceFirst: true, lazyLoad: true },
  { id: 'editors_picks', priority: 18, maxItems: 6, defaultDensity: 'standard', commerceFirst: true, lazyLoad: true },
  { id: 'brand_stories', priority: 19, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'announcements', priority: 20, maxItems: 4, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'latest_reviews', priority: 21, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'latest_videos', priority: 22, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'continue_watching', priority: 23, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'continue_browsing', priority: 24, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'recommended_for_you', priority: 25, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'ending_soon', priority: 26, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'recently_added', priority: 27, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'popular_this_month', priority: 28, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'whats_on', priority: 29, maxItems: 4, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'events', priority: 30, maxItems: 4, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'latest_announcements', priority: 31, maxItems: 4, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
  { id: 'trending', priority: 32, maxItems: 6, defaultDensity: 'compact', commerceFirst: true, lazyLoad: true },
];

export function sectionDefinition(id: SpotlightDiscoverSectionId): FeedSectionDefinition | undefined {
  return FEED_SECTION_REGISTRY.find((s) => s.id === id);
}

export function maxItemsForSection(id: SpotlightDiscoverSectionId, fallback = 6): number {
  return sectionDefinition(id)?.maxItems ?? fallback;
}

export function orderedSectionIds(): SpotlightDiscoverSectionId[] {
  return [...FEED_SECTION_REGISTRY].sort((a, b) => a.priority - b.priority).map((s) => s.id);
}

/** Prefer items with linked products when building commerce sections */
export function sortCommerceFirst(items: import('../../../types/spotlight/experience/content').SpotlightContent[]): import('../../../types/spotlight/experience/content').SpotlightContent[] {
  return [...items].sort((a, b) => {
    const aScore = (a.commerce.featuredProductIds.length ? 2 : 0) + (a.commerce.featuredServiceIds.length ? 1 : 0);
    const bScore = (b.commerce.featuredProductIds.length ? 2 : 0) + (b.commerce.featuredServiceIds.length ? 1 : 0);
    if (bScore !== aScore) return bScore - aScore;
    return (b.discoveryScore?.overall ?? b.popularityScore ?? 0) - (a.discoveryScore?.overall ?? a.popularityScore ?? 0);
  });
}
