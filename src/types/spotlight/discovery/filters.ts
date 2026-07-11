/**
 * Extended universal filters — Phase 4 discovery layer.
 */

import type { SpotlightDiscoverFilters, SpotlightDiscoverSort } from '../experience/filters';

export type SpotlightUniversalFilterMedia = 'image' | 'video' | 'live' | 'carousel';

export interface SpotlightUniversalFilters extends SpotlightDiscoverFilters {
  mediaTypes: SpotlightUniversalFilterMedia[];
  collectionIds: string[];
  seriesIds: string[];
  replayOnly: boolean;
  upcomingOnly: boolean;
  highestRated: boolean;
  mostPopular: boolean;
}

export type SpotlightUniversalSort = SpotlightDiscoverSort | 'discovery_score' | 'most_popular' | 'highest_rated';

export const DEFAULT_UNIVERSAL_FILTERS: SpotlightUniversalFilters = {
  contentTypes: [],
  brandIds: [],
  publisherIds: [],
  publisherTypes: [],
  categoryIds: [],
  serviceIds: [],
  campaignIds: [],
  creatorIds: [],
  liveOnly: false,
  promotionsOnly: false,
  sponsoredOnly: false,
  verifiedOnly: false,
  trendingOnly: false,
  sort: 'trending',
  mediaTypes: [],
  collectionIds: [],
  seriesIds: [],
  replayOnly: false,
  upcomingOnly: false,
  highestRated: false,
  mostPopular: false,
};

export const SPOTLIGHT_UNIVERSAL_FILTER_KEY = 'choosify_spotlight_universal_filters';
