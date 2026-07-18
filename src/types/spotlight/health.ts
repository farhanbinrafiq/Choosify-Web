/**
 * Campaign health score — reserved for seller dashboard insights.
 * Calculated from completion, CTR, purchases, reviews, media quality, AI score.
 */

export interface SpotlightCampaignHealthFactors {
  completionRate?: number;
  ctr?: number;
  purchases?: number;
  reviewQuality?: number;
  mediaQuality?: number;
  aiOptimizationScore?: number;
}

export interface SpotlightCampaignHealth {
  /** Composite score 0–100 — denormalized on campaign root as campaignHealthScore */
  score?: number;
  factors?: SpotlightCampaignHealthFactors;
  calculatedAt?: string;
  modelVersion?: string;
}
