/**
 * Campaign budget architecture — no payment or billing integration.
 */

export type SpotlightCurrencyCode = 'BDT' | 'USD' | 'EUR' | string;

export interface SpotlightCampaignBudget {
  budget?: number;
  currency?: SpotlightCurrencyCode;
  estimatedReach?: number;
  estimatedClicks?: number;
  estimatedSales?: number;
  actualSpend?: number;
  /** Reserved for post-campaign ROI calculation (future monetization) */
  futureROI?: number;
}
