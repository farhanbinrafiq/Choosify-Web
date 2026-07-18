/**
 * Service layer contracts — interfaces only, LE-005.3.2
 */

import type {
  SpotlightCreateCampaignRequest,
  SpotlightUpdateCampaignRequest,
  SpotlightDeleteCampaignRequest,
  SpotlightDuplicateCampaignRequest,
  SpotlightWorkflowActionRequest,
  SpotlightPublishCampaignRequest,
  SpotlightScheduleCampaignRequest,
  SpotlightListCampaignsRequest,
  SpotlightSearchCampaignsRequest,
  SpotlightCampaignDetailsResponse,
  SpotlightCampaignListResponse,
  SpotlightCampaignMutationResponse,
  SpotlightCampaignPreviewRequest,
  SpotlightCampaignPreviewResponse,
  SpotlightCampaignMetricsRequest,
  SpotlightCampaignMetricsResponse,
  SpotlightCampaignProductsRequest,
  SpotlightCampaignProductsResponse,
  SpotlightUpdateSeoRequest,
  SpotlightUpdateLocalizationRequest,
  SpotlightUpdateTargetingRequest,
  SpotlightCampaignSeoResponse,
  SpotlightCampaignLocalizationResponse,
  SpotlightCampaignTargetingResponse,
  SpotlightCampaignHealthResponse,
  SpotlightCampaignVersionsResponse,
  SpotlightCampaignAssetsResponse,
  SpotlightCampaignTemplatesResponse,
  SpotlightCampaignMediaRequest,
  SpotlightCampaignMediaResponse,
} from '../api/campaigns';
import type {
  SpotlightInitUploadRequest,
  SpotlightInitUploadResponse,
  SpotlightCompleteUploadRequest,
  SpotlightCompleteUploadResponse,
  SpotlightUploadStatusResponse,
} from '../api/upload';
import type { SpotlightPlacementSurface } from '../placement';
import type { SpotlightPlacement } from '../placement';
import type { SpotlightCampaignTemplate } from '../template';
import type { SpotlightActorContext } from '../api/common';
import type {
  SpotlightAiGenerateResponse,
  SpotlightAiSeoResponse,
  SpotlightAiImprovementResponse,
  SpotlightAiPredictionResponse,
} from '../integrations/ai';
import type { SpotlightAnalyticsTrackRequest } from '../integrations/analytics';
import type { SpotlightModerationHistoryResponse } from '../integrations/moderation';

export interface CampaignService {
  create(req: SpotlightCreateCampaignRequest): Promise<SpotlightCampaignMutationResponse>;
  update(req: SpotlightUpdateCampaignRequest): Promise<SpotlightCampaignMutationResponse>;
  delete(req: SpotlightDeleteCampaignRequest): Promise<void>;
  duplicate(req: SpotlightDuplicateCampaignRequest): Promise<SpotlightCampaignMutationResponse>;
  submit(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  approve(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  reject(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  archive(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  restore(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  getById(campaignId: string): Promise<SpotlightCampaignDetailsResponse>;
  getBySlug(slug: string): Promise<SpotlightCampaignDetailsResponse>;
  list(req: SpotlightListCampaignsRequest): Promise<SpotlightCampaignListResponse>;
  search(req: SpotlightSearchCampaignsRequest): Promise<SpotlightCampaignListResponse>;
  preview(req: SpotlightCampaignPreviewRequest): Promise<SpotlightCampaignPreviewResponse>;
}

export interface CampaignPublishingService {
  publish(req: SpotlightPublishCampaignRequest): Promise<SpotlightCampaignMutationResponse>;
  unpublish(campaignId: string, actor: SpotlightActorContext): Promise<SpotlightCampaignMutationResponse>;
}

export interface CampaignSchedulingService {
  schedule(req: SpotlightScheduleCampaignRequest): Promise<SpotlightCampaignMutationResponse>;
  cancelSchedule(campaignId: string, actor: SpotlightActorContext): Promise<SpotlightCampaignMutationResponse>;
}

export interface CampaignMediaService {
  listForCampaign(campaignId: string): Promise<SpotlightCampaignMediaResponse>;
  updateCampaignMedia(req: SpotlightCampaignMediaRequest): Promise<SpotlightCampaignMediaResponse>;
  initUpload(req: SpotlightInitUploadRequest): Promise<SpotlightInitUploadResponse>;
  completeUpload(req: SpotlightCompleteUploadRequest): Promise<SpotlightCompleteUploadResponse>;
  getUploadStatus(uploadId: string): Promise<SpotlightUploadStatusResponse>;
}

export interface CampaignProductService {
  updateLinks(req: SpotlightCampaignProductsRequest): Promise<SpotlightCampaignProductsResponse>;
}

export interface CampaignPlacementService {
  list(surface: SpotlightPlacementSurface): Promise<SpotlightPlacement[]>;
  assign(campaignId: string, surfaces: SpotlightPlacementSurface[], actor: SpotlightActorContext): Promise<void>;
}

export interface CampaignAssetService {
  list(campaignId: string): Promise<SpotlightCampaignAssetsResponse>;
  attach(campaignId: string, assetId: string, actor: SpotlightActorContext): Promise<SpotlightCampaignAssetsResponse>;
  detach(campaignId: string, assetId: string, actor: SpotlightActorContext): Promise<SpotlightCampaignAssetsResponse>;
}

export interface CampaignTemplateService {
  list(): Promise<SpotlightCampaignTemplatesResponse>;
  get(templateId: string): Promise<SpotlightCampaignTemplate | null>;
}

export interface CampaignVersionService {
  list(campaignId: string): Promise<SpotlightCampaignVersionsResponse>;
  get(campaignId: string, version: number): Promise<SpotlightCampaignVersionsResponse>;
  rollback(campaignId: string, version: number, actor: SpotlightActorContext): Promise<SpotlightCampaignMutationResponse>;
}

export interface CampaignSeoService {
  get(campaignId: string): Promise<SpotlightCampaignSeoResponse>;
  update(req: SpotlightUpdateSeoRequest): Promise<SpotlightCampaignSeoResponse>;
}

export interface CampaignLocalizationService {
  get(campaignId: string): Promise<SpotlightCampaignLocalizationResponse>;
  update(req: SpotlightUpdateLocalizationRequest): Promise<SpotlightCampaignLocalizationResponse>;
}

export interface CampaignTargetingService {
  get(campaignId: string): Promise<SpotlightCampaignTargetingResponse>;
  update(req: SpotlightUpdateTargetingRequest): Promise<SpotlightCampaignTargetingResponse>;
}

export interface CampaignHealthService {
  get(campaignId: string): Promise<SpotlightCampaignHealthResponse>;
  recalculate(campaignId: string, actor: SpotlightActorContext): Promise<SpotlightCampaignHealthResponse>;
}

export interface CampaignAnalyticsService {
  getMetrics(req: SpotlightCampaignMetricsRequest): Promise<SpotlightCampaignMetricsResponse>;
  trackEvent(event: SpotlightAnalyticsTrackRequest): Promise<void>;
}

export interface CampaignModerationService {
  submit(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  approve(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  reject(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  requestChanges(req: SpotlightWorkflowActionRequest): Promise<SpotlightCampaignMutationResponse>;
  getHistory(campaignId: string): Promise<SpotlightModerationHistoryResponse>;
}

export interface CampaignSearchService {
  search(req: SpotlightSearchCampaignsRequest): Promise<SpotlightCampaignListResponse>;
  autocomplete(q: string, limit?: number): Promise<string[]>;
}

export interface CampaignRecommendationService {
  getForUser(userId: string, limit?: number): Promise<SpotlightCampaignListResponse>;
  getRelated(campaignId: string, limit?: number): Promise<SpotlightCampaignListResponse>;
}

export interface CampaignAiService {
  generateSummary(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateHeadline(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateDescription(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateCta(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateTags(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateKeywords(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateSeo(campaignId: string): Promise<SpotlightAiSeoResponse>;
  suggestImprovements(campaignId: string): Promise<SpotlightAiImprovementResponse>;
  predictPerformance(campaignId: string): Promise<SpotlightAiPredictionResponse>;
}

/** Aggregated service registry for DI containers */
export interface SpotlightServiceRegistry {
  campaign: CampaignService;
  publishing: CampaignPublishingService;
  scheduling: CampaignSchedulingService;
  media: CampaignMediaService;
  products: CampaignProductService;
  placement: CampaignPlacementService;
  assets: CampaignAssetService;
  templates: CampaignTemplateService;
  versions: CampaignVersionService;
  seo: CampaignSeoService;
  localization: CampaignLocalizationService;
  targeting: CampaignTargetingService;
  health: CampaignHealthService;
  analytics: CampaignAnalyticsService;
  moderation: CampaignModerationService;
  search: CampaignSearchService;
  recommendation: CampaignRecommendationService;
  ai: CampaignAiService;
}
