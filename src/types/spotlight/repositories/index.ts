/**
 * Repository contracts — persistence layer interfaces only, LE-005.3.2
 */

import type { SpotlightCampaign, SpotlightCampaignSummary } from '../campaign';
import type { SpotlightMedia } from '../media';
import type { SpotlightCampaignAsset } from '../assets';
import type { SpotlightCampaignTemplate } from '../template';
import type { SpotlightCampaignVersionSnapshot } from '../versioning';
import type { SpotlightCampaignCollection } from '../relationships';
import type { SpotlightListCampaignsRequest } from '../api/campaigns';
import type { SpotlightPaginatedResponse } from '../api/common';

export interface CampaignRepository {
  create(campaign: SpotlightCampaign): Promise<SpotlightCampaign>;
  update(campaignId: string, patch: Partial<SpotlightCampaign>): Promise<SpotlightCampaign>;
  delete(campaignId: string, hardDelete?: boolean): Promise<void>;
  findById(campaignId: string): Promise<SpotlightCampaign | null>;
  findBySlug(slug: string): Promise<SpotlightCampaign | null>;
  list(params: SpotlightListCampaignsRequest): Promise<SpotlightPaginatedResponse<SpotlightCampaignSummary>>;
  search(q: string, params: SpotlightListCampaignsRequest): Promise<SpotlightPaginatedResponse<SpotlightCampaignSummary>>;
}

export interface CampaignMediaRepository {
  findById(mediaId: string): Promise<SpotlightMedia | null>;
  findByCampaignId(campaignId: string): Promise<SpotlightMedia[]>;
  save(media: SpotlightMedia): Promise<SpotlightMedia>;
  delete(mediaId: string): Promise<void>;
  linkToCampaign(campaignId: string, mediaIds: string[]): Promise<void>;
}

export interface CampaignVersionRepository {
  saveSnapshot(snapshot: SpotlightCampaignVersionSnapshot): Promise<SpotlightCampaignVersionSnapshot>;
  list(campaignId: string): Promise<SpotlightCampaignVersionSnapshot[]>;
  find(campaignId: string, version: number): Promise<SpotlightCampaignVersionSnapshot | null>;
}

export interface CampaignAnalyticsRepository {
  getMetrics(campaignId: string, from: string, to: string): Promise<{
    impressions: number;
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
  appendEvent(event: Record<string, unknown>): Promise<void>;
}

export interface CampaignAssetRepository {
  findByCampaignId(campaignId: string): Promise<SpotlightCampaignAsset[]>;
  save(asset: SpotlightCampaignAsset): Promise<SpotlightCampaignAsset>;
  delete(assetId: string): Promise<void>;
}

export interface CampaignTemplateRepository {
  list(): Promise<SpotlightCampaignTemplate[]>;
  findById(templateId: string): Promise<SpotlightCampaignTemplate | null>;
  save(template: SpotlightCampaignTemplate): Promise<SpotlightCampaignTemplate>;
}

export interface CampaignCollectionRepository {
  findById(collectionId: string): Promise<SpotlightCampaignCollection | null>;
  listByParent(parentCollectionId?: string): Promise<SpotlightCampaignCollection[]>;
  save(collection: SpotlightCampaignCollection): Promise<SpotlightCampaignCollection>;
  addCampaign(collectionId: string, campaignId: string): Promise<void>;
  removeCampaign(collectionId: string, campaignId: string): Promise<void>;
}

/** Aggregated repository registry */
export interface SpotlightRepositoryRegistry {
  campaigns: CampaignRepository;
  media: CampaignMediaRepository;
  versions: CampaignVersionRepository;
  analytics: CampaignAnalyticsRepository;
  assets: CampaignAssetRepository;
  templates: CampaignTemplateRepository;
  collections: CampaignCollectionRepository;
}

export type { SpotlightMerchandisingRepositoryRegistry } from '../merchandising/repository';
