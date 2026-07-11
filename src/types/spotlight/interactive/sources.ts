/**
 * Live sources — embed providers only (no Choosify streaming)
 */

export type SpotlightLiveSourceProvider =
  | 'youtube_live'
  | 'facebook_live'
  | 'embedded_website'
  | 'custom_embed'
  | 'tiktok_live'
  | 'instagram_live'
  | 'linkedin_live'
  | 'zoom'
  | 'google_meet'
  | 'microsoft_teams'
  | 'vimeo';

export type SpotlightLiveSourceStatus = 'active' | 'future' | 'replay_only';

export interface SpotlightLiveSource {
  sourceId: string;
  provider: SpotlightLiveSourceProvider;
  label: string;
  embedUrl: string;
  posterUrl?: string;
  status: SpotlightLiveSourceStatus;
  isPrimary?: boolean;
  contributorPublisherId?: string;
  contributorRole?: string;
}

export const LIVE_SOURCE_PROVIDER_LABELS: Record<SpotlightLiveSourceProvider, string> = {
  youtube_live: 'YouTube Live',
  facebook_live: 'Facebook Live',
  embedded_website: 'Embedded Website',
  custom_embed: 'Custom Embed',
  tiktok_live: 'TikTok Live',
  instagram_live: 'Instagram Live',
  linkedin_live: 'LinkedIn Live',
  zoom: 'Zoom',
  google_meet: 'Google Meet',
  microsoft_teams: 'Microsoft Teams',
  vimeo: 'Vimeo',
};

export const ACTIVE_EMBED_PROVIDERS: SpotlightLiveSourceProvider[] = [
  'youtube_live',
  'facebook_live',
  'embedded_website',
  'custom_embed',
];

export const FUTURE_LIVE_PROVIDERS: SpotlightLiveSourceProvider[] = [
  'tiktok_live',
  'instagram_live',
  'linkedin_live',
  'zoom',
  'google_meet',
  'microsoft_teams',
  'vimeo',
];
