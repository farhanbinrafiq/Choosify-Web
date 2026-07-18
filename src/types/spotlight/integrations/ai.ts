/**
 * ES-012 Emi AI contract — LE-005.3.2
 */

import type { SpotlightApiMeta, SpotlightApiResponse } from '../api/common';
import type { SpotlightCampaignAiMetadata } from '../aiMetadata';
import type { SpotlightCampaignSeo } from '../seo';
import type { SpotlightCampaignHealth } from '../health';

export interface SpotlightAiGenerateResponse extends SpotlightApiResponse<{
  text: string;
  modelVersion: string;
  generatedAt: string;
}> {}

export interface SpotlightAiSeoResponse extends SpotlightApiResponse<SpotlightCampaignSeo> {}

export interface SpotlightAiImprovementResponse extends SpotlightApiResponse<{
  suggestions: Array<{ field: string; current: string; suggested: string; reason: string }>;
  optimizationScore: number;
}> {}

export interface SpotlightAiPredictionResponse extends SpotlightApiResponse<{
  performancePrediction: number;
  recommendedPublishTime?: string;
  factors: Record<string, number>;
}> {}

export interface SpotlightAiServiceContract {
  generateSummary(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateHeadline(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateDescription(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateCta(campaignId: string): Promise<SpotlightAiGenerateResponse>;
  generateTags(campaignId: string): Promise<SpotlightApiResponse<string[]>>;
  generateKeywords(campaignId: string): Promise<SpotlightApiResponse<string[]>>;
  generateSeo(campaignId: string): Promise<SpotlightAiSeoResponse>;
  suggestImprovements(campaignId: string): Promise<SpotlightAiImprovementResponse>;
  calculateHealth(campaignId: string): Promise<SpotlightApiResponse<SpotlightCampaignHealth>>;
  predictPerformance(campaignId: string): Promise<SpotlightAiPredictionResponse>;
  applyMetadata(campaignId: string, metadata: SpotlightCampaignAiMetadata): Promise<void>;
}

/** @deprecated Use SpotlightAiServiceContract */
export interface SpotlightAiRef extends SpotlightCampaignAiMetadata {
  campaignId: string;
  recommendedProductIds?: string[];
}

export interface SpotlightMonetizationRef {
  campaignId: string;
  isSponsored: boolean;
  budgetId?: string;
  cpm?: number;
  cpc?: number;
  spendCap?: number;
}
