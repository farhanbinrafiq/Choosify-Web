/**
 * Campaign Quality Score — CTO addition, LE-005.4
 * Measures campaign completeness, not performance.
 */

export interface SpotlightCampaignQualityFactors {
  heroMediaPresent?: boolean;
  heroProductAssigned?: boolean;
  seoCompleted?: boolean;
  localizationAvailable?: boolean;
  ctaConfigured?: boolean;
  scheduleConfigured?: boolean;
  validPlacements?: boolean;
  brandLinked?: boolean;
  productsVerified?: boolean;
  accessoriesPresent?: boolean;
  bundleConfigured?: boolean;
}

export interface SpotlightCampaignQualityScore {
  /** Composite score 0–100 */
  score: number;
  factors: SpotlightCampaignQualityFactors;
  calculatedAt: string;
}

export type SpotlightMerchantGuidanceSeverity = 'info' | 'suggestion' | 'warning';

export interface SpotlightMerchantGuidance {
  id: string;
  message: string;
  severity: SpotlightMerchantGuidanceSeverity;
  field?: string;
  actionLabel?: string;
}
