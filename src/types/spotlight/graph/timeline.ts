/**
 * Event Timeline (CTO) — campaigns, live, announcements evolve over time
 */

export type SpotlightTimelineEventType =
  | 'launch_announced'
  | 'collaboration_invited'
  | 'collaboration_accepted'
  | 'live_scheduled'
  | 'live_started'
  | 'live_ended'
  | 'product_revealed'
  | 'offer_activated'
  | 'winner_announced'
  | 'campaign_started'
  | 'campaign_ended'
  | 'content_published'
  | 'replay_available';

export interface SpotlightTimelineEvent {
  eventId: string;
  type: SpotlightTimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  publisherId?: string;
  publisherName?: string;
  productIds?: string[];
  liveSessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface SpotlightContentTimeline {
  contentId: string;
  campaignId?: string;
  events: SpotlightTimelineEvent[];
  updatedAt: string;
}

export const TIMELINE_EVENT_LABELS: Record<SpotlightTimelineEventType, string> = {
  launch_announced: 'Launch Announced',
  collaboration_invited: 'Collaboration Invited',
  collaboration_accepted: 'Collaboration Accepted',
  live_scheduled: 'Live Scheduled',
  live_started: 'Live Started',
  live_ended: 'Live Ended',
  product_revealed: 'Product Revealed',
  offer_activated: 'Offer Activated',
  winner_announced: 'Winner Announced',
  campaign_started: 'Campaign Started',
  campaign_ended: 'Campaign Ended',
  content_published: 'Content Published',
  replay_available: 'Replay Available',
};
