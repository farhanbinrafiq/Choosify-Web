/**
 * Discovery filter architecture — client-side only in Phase 1
 */

import type { SpotlightContentType } from './contentTypes';
import type { SpotlightPublisherType } from './publisher';

export type SpotlightDiscoverSort =
  | 'trending'
  | 'newest'
  | 'ending_soon'
  | 'priority'
  | 'ai_score';

export interface SpotlightDiscoverFilters {
  contentTypes: SpotlightContentType[];
  brandIds: string[];
  publisherIds: string[];
  publisherTypes: SpotlightPublisherType[];
  categoryIds: string[];
  serviceIds: string[];
  campaignIds: string[];
  creatorIds: string[];
  liveOnly: boolean;
  promotionsOnly: boolean;
  sponsoredOnly: boolean;
  verifiedOnly: boolean;
  trendingOnly: boolean;
  sort: SpotlightDiscoverSort;
  query?: string;
}

export const DEFAULT_SPOTLIGHT_DISCOVER_FILTERS: SpotlightDiscoverFilters = {
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
};

export const SPOTLIGHT_DISCOVER_FILTER_KEY = 'choosify_spotlight_discover_filters';
