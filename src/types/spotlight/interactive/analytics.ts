/**
 * ES-008 analytics contract — interactive commerce events (no implementation)
 */

export type SpotlightInteractiveAnalyticsEventType =
  | 'live_started'
  | 'replay_started'
  | 'chapter_viewed'
  | 'pinned_product_click'
  | 'buy_click'
  | 'offer_click'
  | 'guide_click'
  | 'compare_click'
  | 'reminder_click'
  | 'replay_completion'
  | 'source_switched'
  | 'notify_me_click';

export interface SpotlightInteractiveAnalyticsEvent {
  type: SpotlightInteractiveAnalyticsEventType;
  eventId: string;
  contentId: string;
  timestamp: string;
  chapterId?: string;
  productId?: string;
  sourceId?: string;
  metadata?: Record<string, unknown>;
}

export interface SpotlightInteractiveAnalyticsContract {
  track(event: SpotlightInteractiveAnalyticsEvent): Promise<void>;
}
