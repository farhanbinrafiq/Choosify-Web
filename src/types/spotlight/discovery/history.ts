/**
 * Browsing history — recently viewed, continue watching/reading.
 */

export type SpotlightHistoryEntryKind =
  | 'view'
  | 'watch'
  | 'read'
  | 'save';

export interface SpotlightHistoryEntry {
  contentId: string;
  kind: SpotlightHistoryEntryKind;
  /** Progress 0–1 for continue watching */
  progress?: number;
  lastSeenAt: string;
  href: string;
  headline: string;
}

export const SPOTLIGHT_HISTORY_KEY = 'choosify_spotlight_history';
export const SPOTLIGHT_HISTORY_MAX = 50;
