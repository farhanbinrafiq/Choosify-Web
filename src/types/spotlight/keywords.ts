/**
 * Separated keyword/label types — do not merge.
 * Root `campaignTags` remains for backward compatibility.
 */

export interface SpotlightCampaignKeywords {
  /** Operator-facing campaign tags (may mirror root campaignTags) */
  campaignTags?: string[];
  /** SEO meta keywords */
  seoKeywords?: string[];
  /** On-site search indexing */
  searchKeywords?: string[];
  /** Internal CMS labels (not public) */
  internalLabels?: string[];
  /** AI-generated labels (future ES-012) */
  aiLabels?: string[];
  /** Recommendation engine labels (future ES-010) */
  recommendationLabels?: string[];
}
