/**
 * Save system — architecture only (localStorage prep, future offline).
 */

export type SpotlightSaveTargetKind =
  | 'campaign'
  | 'live'
  | 'replay'
  | 'guide'
  | 'recommendation'
  | 'collection'
  | 'series'
  | 'event';

export interface SpotlightSaveRecord {
  targetKind: SpotlightSaveTargetKind;
  targetId: string;
  contentId?: string;
  savedAt: string;
}

export const SPOTLIGHT_SAVES_KEY = 'choosify_spotlight_saves';
