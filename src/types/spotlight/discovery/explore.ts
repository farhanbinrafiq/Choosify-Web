/**
 * Explore page — browse dimensions.
 */

export type SpotlightExploreDimension =
  | 'category'
  | 'publisher'
  | 'creator'
  | 'brand'
  | 'campaign'
  | 'product'
  | 'service'
  | 'guide'
  | 'recommendation'
  | 'live'
  | 'collection'
  | 'series'
  | 'trending';

export interface SpotlightExploreTile {
  dimension: SpotlightExploreDimension;
  label: string;
  href: string;
  count?: number;
  imageUrl?: string;
}

export interface SpotlightExploreSection {
  id: string;
  title: string;
  tiles: SpotlightExploreTile[];
}
