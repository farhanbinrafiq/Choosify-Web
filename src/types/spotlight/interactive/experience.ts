/**
 * Interactive Commerce — live experience taxonomy (Phase 3)
 */

export type SpotlightLiveExperienceKind =
  | 'live'
  | 'upcoming_live'
  | 'replay'
  | 'scheduled_live'
  | 'ended_live'
  | 'cancelled_live'
  | 'winner_announcement'
  | 'product_launch'
  | 'campaign_reveal'
  | 'press_conference'
  | 'webinar'
  | 'workshop'
  | 'product_demo'
  | 'creator_live'
  | 'brand_live'
  | 'partner_live';

export type SpotlightOfficialLiveKind =
  | 'official_brand'
  | 'official_distributor'
  | 'official_partner'
  | 'official_event'
  | 'official_webinar'
  | 'official_announcement';

export type SpotlightCreatorLiveKind =
  | 'review'
  | 'tutorial'
  | 'hands_on'
  | 'comparison'
  | 'buying_guide'
  | 'reaction';

/** Cross-domain categories (CTO) */
export type SpotlightInteractiveCommerceDomain =
  | 'electronics'
  | 'hotel'
  | 'restaurant'
  | 'travel'
  | 'education'
  | 'healthcare'
  | 'automotive'
  | 'real_estate'
  | 'general';

export const LIVE_EXPERIENCE_LABELS: Record<SpotlightLiveExperienceKind, string> = {
  live: 'Live',
  upcoming_live: 'Upcoming Live',
  replay: 'Replay',
  scheduled_live: 'Scheduled Live',
  ended_live: 'Ended',
  cancelled_live: 'Cancelled',
  winner_announcement: 'Winner Announcement',
  product_launch: 'Product Launch',
  campaign_reveal: 'Campaign Reveal',
  press_conference: 'Press Conference',
  webinar: 'Webinar',
  workshop: 'Workshop',
  product_demo: 'Product Demo',
  creator_live: 'Creator Live',
  brand_live: 'Brand Live',
  partner_live: 'Partner Live',
};

export const OFFICIAL_LIVE_BADGE_LABELS: Record<SpotlightOfficialLiveKind, string> = {
  official_brand: 'Official Brand Live',
  official_distributor: 'Official Distributor',
  official_partner: 'Official Partner',
  official_event: 'Official Event',
  official_webinar: 'Official Webinar',
  official_announcement: 'Official Announcement',
};
