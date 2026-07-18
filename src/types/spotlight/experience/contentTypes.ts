/**
 * Unified Spotlight content types — Phase 1 Experience Platform
 */

export type SpotlightContentType =
  | 'campaign'
  | 'promotion'
  | 'new_launch'
  | 'brand_story'
  | 'announcement'
  | 'event'
  | 'whats_on'
  | 'live'
  | 'creator_review'
  | 'product_review'
  | 'buying_guide'
  | 'tutorial'
  | 'tips'
  | 'comparison'
  | 'recommendation'
  | 'editorial'
  | 'community_pick'
  /** Future-ready */
  | 'ai_content'
  | 'podcast'
  | 'webinar'
  | 'livestream_replay';

export type SpotlightContentSourceKind =
  | 'campaign'
  | 'guide'
  | 'creator'
  | 'brand_post'
  | 'placement'
  | 'synthetic';

export const SPOTLIGHT_CONTENT_TYPE_META: Record<
  SpotlightContentType,
  { label: string; group: 'commerce' | 'editorial' | 'live' | 'community' | 'future' }
> = {
  campaign: { label: 'Campaign', group: 'commerce' },
  promotion: { label: 'Promotion', group: 'commerce' },
  new_launch: { label: 'New Launch', group: 'commerce' },
  brand_story: { label: 'Brand Story', group: 'editorial' },
  announcement: { label: 'Announcement', group: 'editorial' },
  event: { label: 'Event', group: 'editorial' },
  whats_on: { label: "What's On", group: 'editorial' },
  live: { label: 'Live', group: 'live' },
  creator_review: { label: 'Creator Review', group: 'community' },
  product_review: { label: 'Product Review', group: 'community' },
  buying_guide: { label: 'Buying Guide', group: 'editorial' },
  tutorial: { label: 'Tutorial', group: 'editorial' },
  tips: { label: 'Tips', group: 'editorial' },
  comparison: { label: 'Comparison', group: 'editorial' },
  recommendation: { label: 'Recommendation', group: 'editorial' },
  editorial: { label: 'Editorial', group: 'editorial' },
  community_pick: { label: 'Community Pick', group: 'community' },
  ai_content: { label: 'AI Content', group: 'future' },
  podcast: { label: 'Podcast', group: 'future' },
  webinar: { label: 'Webinar', group: 'future' },
  livestream_replay: { label: 'Live Replay', group: 'live' },
};
