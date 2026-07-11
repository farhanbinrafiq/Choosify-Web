import type { SpotlightActorContext, SpotlightApiResponse, SpotlightApiListResponse, SpotlightPaginatedRequest } from './common';
import type { SpotlightCampaign, SpotlightCampaignSummary } from '../campaign';
import type { SpotlightCampaignStatus } from '../lifecycle';
import type { SpotlightCampaignType } from '../campaignTypes';
import type { SpotlightCampaignObjective } from '../objectives';
import type { SpotlightApprovalStage } from '../approval';
import type { SpotlightCampaignSeo } from '../seo';
import type { SpotlightCampaignLocalization } from '../localization';
import type { SpotlightAudienceTargeting } from '../targeting';
import type { SpotlightCampaignHealth } from '../health';
import type { SpotlightCampaignVersionSnapshot } from '../versioning';
import type { SpotlightCampaignAsset } from '../assets';
import type { SpotlightCampaignTemplate } from '../template';
import type { SpotlightMedia } from '../media';
import type { SpotlightCampaignSchedule } from '../lifecycle';

/** Writable campaign payload — omits server-managed fields */
export type SpotlightCampaignCreateInput = Omit<
  SpotlightCampaign,
  'campaignId' | 'createdAt' | 'updatedAt' | 'status'
> & { status?: 'draft' };

export type SpotlightCampaignUpdateInput = Partial<
  Omit<SpotlightCampaign, 'campaignId' | 'createdBy' | 'createdAt'>
>;

export interface SpotlightCreateCampaignRequest {
  campaign: SpotlightCampaignCreateInput;
  actor: SpotlightActorContext;
}

export interface SpotlightUpdateCampaignRequest {
  campaignId: string;
  patch: SpotlightCampaignUpdateInput;
  actor: SpotlightActorContext;
}

export interface SpotlightDeleteCampaignRequest {
  campaignId: string;
  actor: SpotlightActorContext;
  hardDelete?: boolean;
}

export interface SpotlightDuplicateCampaignRequest {
  campaignId: string;
  newName?: string;
  actor: SpotlightActorContext;
}

export interface SpotlightWorkflowActionRequest {
  campaignId: string;
  actor: SpotlightActorContext;
  comment?: string;
  reason?: string;
}

export interface SpotlightPublishCampaignRequest extends SpotlightWorkflowActionRequest {
  publishAt?: string;
}

export interface SpotlightScheduleCampaignRequest extends SpotlightWorkflowActionRequest {
  schedule: SpotlightCampaignSchedule;
}

export interface SpotlightListCampaignsRequest extends SpotlightPaginatedRequest {
  status?: SpotlightCampaignStatus | SpotlightCampaignStatus[];
  campaignType?: SpotlightCampaignType;
  objective?: SpotlightCampaignObjective;
  approvalStage?: SpotlightApprovalStage;
  brandId?: string;
  sellerId?: string;
  folderId?: string;
  query?: string;
  sortBy?: 'updatedAt' | 'createdAt' | 'priority' | 'campaignHealthScore';
  sortDir?: 'asc' | 'desc';
}

export interface SpotlightSearchCampaignsRequest extends SpotlightListCampaignsRequest {
  q: string;
  seoKeywords?: boolean;
  searchKeywords?: boolean;
}

export interface SpotlightCampaignDetailsResponse extends SpotlightApiResponse<SpotlightCampaign> {}
export interface SpotlightCampaignListResponse extends SpotlightApiListResponse<SpotlightCampaignSummary> {}
export interface SpotlightCampaignMutationResponse extends SpotlightApiResponse<SpotlightCampaign> {}

export interface SpotlightCampaignPreviewRequest {
  campaignId?: string;
  draft?: SpotlightCampaignUpdateInput;
  surface?: string;
  locale?: string;
}

export interface SpotlightCampaignPreviewResponse extends SpotlightApiResponse<{
  campaign: SpotlightCampaign;
  resolvedProductIds: string[];
  primaryMediaId?: string;
}> {}

export interface SpotlightCampaignMetricsRequest {
  campaignId: string;
  from?: string;
  to?: string;
  granularity?: 'hour' | 'day' | 'week';
}

export interface SpotlightCampaignMetricsResponse extends SpotlightApiResponse<{
  campaignId: string;
  impressions: number;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  period: { from: string; to: string };
}> {}

export interface SpotlightCampaignProductsRequest {
  campaignId: string;
  reorder?: string[];
  primaryProductId?: string;
  attach?: string[];
  detach?: string[];
}

export interface SpotlightCampaignProductsResponse extends SpotlightApiResponse<{
  linkedProductIds: string[];
  primaryProductId?: string;
}> {}

export interface SpotlightCampaignMediaRequest {
  campaignId: string;
  mediaIds?: string[];
  primaryMediaId?: string;
}

export interface SpotlightCampaignMediaResponse extends SpotlightApiResponse<{
  media: SpotlightMedia[];
  primaryMediaId?: string;
}> {}

export interface SpotlightCampaignAssetsResponse extends SpotlightApiResponse<SpotlightCampaignAsset[]> {}
export interface SpotlightCampaignTemplatesResponse extends SpotlightApiListResponse<SpotlightCampaignTemplate> {}
export interface SpotlightCampaignHealthResponse extends SpotlightApiResponse<SpotlightCampaignHealth> {}
export interface SpotlightCampaignVersionsResponse extends SpotlightApiListResponse<SpotlightCampaignVersionSnapshot> {}
export interface SpotlightCampaignSeoResponse extends SpotlightApiResponse<SpotlightCampaignSeo> {}
export interface SpotlightCampaignLocalizationResponse extends SpotlightApiResponse<SpotlightCampaignLocalization> {}
export interface SpotlightCampaignTargetingResponse extends SpotlightApiResponse<SpotlightAudienceTargeting> {}

export interface SpotlightUpdateSeoRequest {
  campaignId: string;
  seo: SpotlightCampaignSeo;
  actor: SpotlightActorContext;
}

export interface SpotlightUpdateLocalizationRequest {
  campaignId: string;
  localization: SpotlightCampaignLocalization;
  actor: SpotlightActorContext;
}

export interface SpotlightUpdateTargetingRequest {
  campaignId: string;
  targeting: SpotlightAudienceTargeting;
  actor: SpotlightActorContext;
}
