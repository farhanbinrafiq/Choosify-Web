/**
 * Future AI metadata — all fields optional, no AI implementation.
 */

export interface SpotlightCampaignAiMetadata {
  aiGeneratedHeadline?: string;
  aiGeneratedSummary?: string;
  aiGeneratedTags?: string[];
  aiGeneratedCTA?: string;
  /** Predicted performance score 0–100 */
  performancePrediction?: number;
  recommendedPublishTime?: string;
  /** Composite AI optimization score 0–100 */
  optimizationScore?: number;
  modelVersion?: string;
  generatedAt?: string;
}
