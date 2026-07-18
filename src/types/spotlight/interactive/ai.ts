/**
 * ES-012 AI preparation — interactive commerce (no implementation)
 */

export type SpotlightInteractiveAiFeature =
  | 'highlight_chapters'
  | 'auto_summary'
  | 'best_moments'
  | 'suggested_products'
  | 'suggested_timeline'
  | 'suggested_offers'
  | 'recommended_creators';

export interface SpotlightInteractiveAiSuggestion {
  feature: SpotlightInteractiveAiFeature;
  eventId: string;
  payload: Record<string, unknown>;
  confidence?: number;
}

export interface SpotlightInteractiveAiContract {
  suggestTimeline(eventId: string): Promise<SpotlightInteractiveAiSuggestion>;
  suggestProducts(eventId: string, timestampSeconds?: number): Promise<SpotlightInteractiveAiSuggestion>;
}
