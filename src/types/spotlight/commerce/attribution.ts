/**
 * Creator attribution (CTO) — outcome-based marketplace prep
 */

export interface SpotlightCreatorAttributionMetrics {
  creatorPublisherId: string;
  contentId: string;
  campaignId?: string;
  views: number;
  productClicks: number;
  wishlistAdds: number;
  compareActions: number;
  purchasesInfluenced: number;
  revenueInfluenced: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
}

export interface SpotlightCreatorAttributionEvent {
  type: 'view' | 'product_click' | 'wishlist' | 'compare' | 'purchase' | 'revenue';
  creatorPublisherId: string;
  contentId: string;
  productId?: string;
  value?: number;
  timestamp: string;
}

export interface SpotlightCreatorAttributionContract {
  track(event: SpotlightCreatorAttributionEvent): Promise<void>;
  getMetrics(creatorPublisherId: string, from: string, to: string): Promise<SpotlightCreatorAttributionMetrics[]>;
}
