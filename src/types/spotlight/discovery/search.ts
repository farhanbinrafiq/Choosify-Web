/**
 * Dedicated Spotlight Search.
 */

export type SpotlightSearchEntityKind =
  | 'campaign'
  | 'creator'
  | 'publisher'
  | 'brand'
  | 'series'
  | 'collection'
  | 'event'
  | 'guide'
  | 'review'
  | 'announcement'
  | 'live';

export interface SpotlightSearchResult {
  kind: SpotlightSearchEntityKind;
  entityId: string;
  contentId?: string;
  title: string;
  subtitle?: string;
  href: string;
  score: number;
  isTrending?: boolean;
}

export interface SpotlightSearchSuggestion {
  label: string;
  query: string;
  kind: 'recent' | 'popular' | 'trending' | 'suggested';
}

export interface SpotlightSearchState {
  query: string;
  results: SpotlightSearchResult[];
  suggestions: SpotlightSearchSuggestion[];
  recentSearches: string[];
}

export const SPOTLIGHT_SEARCH_RECENT_KEY = 'choosify_spotlight_search_recent';
