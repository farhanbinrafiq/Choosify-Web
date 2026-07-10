import type {
  SpotlightCampaign,
  SpotlightCampaignPage,
  SpotlightCampaignSummary,
} from './campaign';
import type { SpotlightCampaignType } from './campaignTypes';
import type { SpotlightCampaignStatus } from './lifecycle';
import type { SpotlightMedia } from './media';
import type { SpotlightPlacement, SpotlightPlacementSurface } from './placement';
import type { SpotlightCampaignTemplate } from './template';

/**
 * Read-only API contract for Spotlight campaigns.
 * Implementation deferred to backend sprint — types only.
 */
export interface SpotlightApi {
  listCampaigns(params: SpotlightListCampaignsParams): Promise<SpotlightCampaignPage>;
  getCampaign(campaignId: string): Promise<SpotlightCampaign | null>;
  getCampaignBySlug(slug: string): Promise<SpotlightCampaign | null>;
  listPlacements(surface: SpotlightPlacementSurface): Promise<SpotlightPlacement[]>;
  getMedia(mediaId: string): Promise<SpotlightMedia | null>;
  listTemplates(): Promise<SpotlightCampaignTemplate[]>;
}

export interface SpotlightListCampaignsParams {
  status?: SpotlightCampaignStatus | SpotlightCampaignStatus[];
  campaignType?: SpotlightCampaignType;
  surface?: SpotlightPlacementSurface;
  cursor?: string;
  pageSize?: number;
  /** ISO date — campaigns active at this instant */
  activeAt?: string;
}

export type { SpotlightCampaignSummary };
