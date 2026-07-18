/**
 * Live commerce preparation — Phase 2
 */

import type { SpotlightLiveConfig, SpotlightLivePlatform, SpotlightLiveStatus } from '../experience/live';

export type SpotlightLiveContentKind =
  | 'official_live'
  | 'creator_live'
  | 'partner_live'
  | 'upcoming_live'
  | 'replay'
  | 'winner_announcement'
  | 'launch_event';

export type SpotlightLiveCommercePlatform =
  | SpotlightLivePlatform
  | 'zoom_webinar'
  | 'tiktok'
  | 'instagram'
  | 'vimeo';

export interface SpotlightLiveCommerceSession extends SpotlightLiveConfig {
  sessionId: string;
  contentId: string;
  kind: SpotlightLiveContentKind;
  title: string;
  hostPublisherId: string;
  collaboratorPublisherIds: string[];
  pinnedCouponIds: string[];
  timelineEnabled: boolean;
  /** Future platforms */
  supportedPlatforms: SpotlightLiveCommercePlatform[];
}

export interface SpotlightLiveNotifySubscription {
  sessionId: string;
  userId?: string;
  email?: string;
  subscribedAt: string;
}

export const LIVE_KIND_LABELS: Record<SpotlightLiveContentKind, string> = {
  official_live: 'Official Live',
  creator_live: 'Creator Live',
  partner_live: 'Partner Live',
  upcoming_live: 'Upcoming Live',
  replay: 'Replay',
  winner_announcement: 'Winner Announcement',
  launch_event: 'Launch Event',
};
