/**
 * Synchronized Commerce Timeline (CTO) — chapters with timestamp-linked commerce
 */

export type SpotlightTimelineChapterLinkKind =
  | 'product'
  | 'service'
  | 'offer'
  | 'coupon'
  | 'bundle'
  | 'guide'
  | 'comparison'
  | 'announcement';

export interface SpotlightTimelineChapterLink {
  kind: SpotlightTimelineChapterLinkKind;
  entityId: string;
  label?: string;
}

/** Alias for event model */
export type SpotlightLiveTimelineChapter = {
  chapterId: string;
  timestampSeconds: number;
  timestampLabel: string;
  title: string;
  description?: string;
  links: SpotlightTimelineChapterLink[];
};

export interface SpotlightLiveTimeline {
  eventId: string;
  contentId: string;
  chapters: SpotlightLiveTimelineChapter[];
  /** Preserved on replay */
  preservedOnReplay: boolean;
  updatedAt: string;
}

export function formatTimelineTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
