/**
 * Campaign Journey (CTO) — lifecycle stages for discovery navigation.
 */

export type SpotlightCampaignJourneyStage =
  | 'announcement'
  | 'coming_soon'
  | 'launch'
  | 'live'
  | 'offer'
  | 'winner'
  | 'replay'
  | 'archive';

export interface SpotlightCampaignJourneyStep {
  stage: SpotlightCampaignJourneyStage;
  label: string;
  contentId?: string;
  href?: string;
  isActive: boolean;
  isComplete: boolean;
}

export const CAMPAIGN_JOURNEY_ORDER: SpotlightCampaignJourneyStage[] = [
  'announcement',
  'coming_soon',
  'launch',
  'live',
  'offer',
  'winner',
  'replay',
  'archive',
];

export const CAMPAIGN_JOURNEY_LABELS: Record<SpotlightCampaignJourneyStage, string> = {
  announcement: 'Announcement',
  coming_soon: 'Coming Soon',
  launch: 'Launch',
  live: 'Live',
  offer: 'Offer',
  winner: 'Winner',
  replay: 'Replay',
  archive: 'Archive',
};
