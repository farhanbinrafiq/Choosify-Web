/**
 * Emi AI merchandising recommendations — contracts only (ES-012), LE-005.4
 */

export type SpotlightAiMerchandisingRecommendationType =
  | 'frequently_bought_together'
  | 'alternatives'
  | 'bundle_suggestions'
  | 'trending'
  | 'seasonal'
  | 'best_value';

export interface SpotlightAiMerchandisingRecommendation {
  type: SpotlightAiMerchandisingRecommendationType;
  productIds: string[];
  confidence?: number;
  reason?: string;
  modelVersion?: string;
}

export interface SpotlightAiMerchandisingServiceContract {
  getFrequentlyBoughtTogether(productId: string): Promise<SpotlightAiMerchandisingRecommendation>;
  getAlternatives(productId: string): Promise<SpotlightAiMerchandisingRecommendation>;
  getBundleSuggestions(campaignId: string): Promise<SpotlightAiMerchandisingRecommendation>;
  getTrendingProducts(context?: { brandId?: string; categoryId?: string }): Promise<SpotlightAiMerchandisingRecommendation>;
  getSeasonalProducts(season?: string): Promise<SpotlightAiMerchandisingRecommendation>;
  getBestValueProducts(categoryId?: string): Promise<SpotlightAiMerchandisingRecommendation>;
}
