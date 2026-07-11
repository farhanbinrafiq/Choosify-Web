/**
 * Follow system — architecture only (localStorage prep, no backend).
 */

export type SpotlightFollowTargetKind =
  | 'publisher'
  | 'creator'
  | 'brand'
  | 'campaign'
  | 'series'
  | 'collection'
  | 'topic';

export interface SpotlightFollowRecord {
  targetKind: SpotlightFollowTargetKind;
  targetId: string;
  followedAt: string;
}

export const SPOTLIGHT_FOLLOWS_KEY = 'choosify_spotlight_follows';
