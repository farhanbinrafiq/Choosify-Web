/**
 * Per-product campaign metrics — ES-008 preparation, LE-005.4
 */

export interface SpotlightProductCampaignMetrics {
  productId: string;
  campaignId: string;
  views: number;
  ctr: number;
  wishlistAdds: number;
  compareAdds: number;
  purchases: number;
  bundlePurchases: number;
  revenue: number;
  conversionRate: number;
  period: { from: string; to: string };
}

export interface SpotlightProductMetricsServiceContract {
  getProductMetrics(campaignId: string, productId: string, from: string, to: string): Promise<SpotlightProductCampaignMetrics>;
  getCampaignProductMetrics(campaignId: string, from: string, to: string): Promise<SpotlightProductCampaignMetrics[]>;
}
