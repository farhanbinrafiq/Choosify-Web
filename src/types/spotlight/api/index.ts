/**
 * Spotlight API contracts barrel — LE-005.3.2
 */

export * from './common';
export * from './errors';
export * from './routes';
export * from './campaigns';
export * from './upload';
export * from './events';
export * from './webhooks';
export * from './sharedDto';

/** Legacy read-only client contract (LE-005.1) — superseded by service interfaces */
import type { SpotlightCampaign, SpotlightCampaignPage } from '../campaign';
import type { SpotlightCampaignType } from '../campaignTypes';
import type { SpotlightCampaignStatus } from '../lifecycle';
import type { SpotlightMedia } from '../media';
import type { SpotlightPlacement, SpotlightPlacementSurface } from '../placement';
import type { SpotlightCampaignTemplate } from '../template';

export interface SpotlightListCampaignsParams {
  status?: SpotlightCampaignStatus | SpotlightCampaignStatus[];
  campaignType?: SpotlightCampaignType;
  surface?: SpotlightPlacementSurface;
  cursor?: string;
  pageSize?: number;
  activeAt?: string;
}

export interface SpotlightApiClient {
  listCampaigns(params: SpotlightListCampaignsParams): Promise<SpotlightCampaignPage>;
  getCampaign(campaignId: string): Promise<SpotlightCampaign | null>;
  getCampaignBySlug(slug: string): Promise<SpotlightCampaign | null>;
  listPlacements(surface: SpotlightPlacementSurface): Promise<SpotlightPlacement[]>;
  getMedia(mediaId: string): Promise<SpotlightMedia | null>;
  listTemplates(): Promise<SpotlightCampaignTemplate[]>;
}

/** @deprecated Use SpotlightApiClient */
export type SpotlightApi = SpotlightApiClient;
