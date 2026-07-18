/**
 * Enhanced related experience rails — Phase 4.
 */

export type SpotlightPersonalizedRailKind =
  | 'because_you_viewed'
  | 'because_you_follow'
  | 'because_you_saved'
  | 'trending_near_you'
  | 'editors_picks'
  | 'popular_among_creators'
  | 'popular_among_brands';

export interface SpotlightPersonalizedRail {
  kind: SpotlightPersonalizedRailKind;
  title: string;
  contentIds: string[];
  isPlaceholder?: boolean;
}
