/**
 * Live content preparation — no streaming implementation
 */

export type SpotlightLiveStatus = 'live' | 'upcoming' | 'replay' | 'ended';

export type SpotlightLivePlatform =
  | 'youtube'
  | 'facebook'
  | 'tiktok'
  | 'instagram'
  | 'vimeo'
  | 'native';

export interface SpotlightLiveConfig {
  status: SpotlightLiveStatus;
  platform: SpotlightLivePlatform;
  /** YouTube / Facebook live embed URL */
  embedUrl?: string;
  replayUrl?: string;
  scheduledAt?: string;
  endedAt?: string;
  notifyMeEnabled?: boolean;
  productIds: string[];
  serviceIds: string[];
  pinnedProductIds: string[];
  pinnedOfferIds: string[];
  /** Reserved for live commerce timeline */
  timelinePlaceholder?: boolean;
}

export interface SpotlightLiveNotifyRequest {
  contentId: string;
  userId?: string;
  email?: string;
  requestedAt: string;
}
