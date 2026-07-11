/**
 * Emi AI Platform — LE-005 Phase 5.6
 * Copilot-style contextual intelligence (not a destination chatbot).
 */

export type EmiAssistantId =
  | 'shopping'
  | 'spotlight'
  | 'compare'
  | 'search'
  | 'publisher'
  | 'creator'
  | 'brand'
  | 'seller'
  | 'discovery'
  | 'opportunity';

export type EmiCapabilityId =
  | 'explain'
  | 'summarize'
  | 'compare'
  | 'recommend'
  | 'optimize'
  | 'generate'
  | 'rewrite'
  | 'translate'
  | 'categorize'
  | 'moderate'
  | 'schedule';

export type EmiActionId =
  | 'optimize_headline'
  | 'generate_summary'
  | 'improve_seo'
  | 'generate_seo'
  | 'suggest_products'
  | 'suggest_creator'
  | 'suggest_cta'
  | 'suggest_tags'
  | 'suggest_collection'
  | 'suggest_series'
  | 'translate'
  | 'generate_headline'
  | 'generate_tags'
  | 'rewrite'
  | 'suggest_related'
  | 'suggest_blueprint'
  | 'explain_product'
  | 'compare_alternatives'
  | 'summarize_spotlight'
  | 'shopping_coach';

export type EmiPageId =
  | 'product'
  | 'brand'
  | 'compare'
  | 'spotlight'
  | 'spotlight_content'
  | 'search'
  | 'category'
  | 'creator'
  | 'dashboard'
  | 'publisher_studio'
  | 'opportunity_center'
  | 'marketing'
  | 'orders'
  | 'messages'
  | 'collection'
  | 'series'
  | 'home';

export type EmiPanelKind =
  | 'did_you_know'
  | 'buying_tip'
  | 'warning'
  | 'recommendation'
  | 'alternative'
  | 'money_saving'
  | 'expert_advice'
  | 'summary'
  | 'coach';

export type EmiConfidenceLevel = 'high' | 'medium' | 'low' | 'placeholder';

export interface EmiPageContext {
  pageId: EmiPageId;
  pathname: string;
  title?: string;
  entityId?: string;
  entityLabel?: string;
  productIds?: string[];
  brandIds?: string[];
  contentId?: string;
  compareIds?: string[];
  query?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

export interface EmiRecommendation {
  id: string;
  kind: EmiPanelKind;
  title: string;
  body: string;
  confidence: EmiConfidenceLevel;
  confidenceScore?: number;
  why?: string;
  dataConsidered?: string[];
  relatedProductIds?: string[];
  relatedContentIds?: string[];
  actionId?: EmiActionId;
  suggestedAction?: string;
  estimatedImpact?: string;
}

export interface EmiActionResult {
  actionId: EmiActionId;
  label: string;
  suggestion: string;
  confidence: EmiConfidenceLevel;
  why: string;
  applyHint?: string;
}

export interface EmiCoachOption {
  id: string;
  label: string;
  reasoning: string;
  confidence: EmiConfidenceLevel;
  productId?: string;
}

export interface EmiAssistantState {
  assistantId: EmiAssistantId;
  context: EmiPageContext;
  recommendations: EmiRecommendation[];
  actions: EmiActionResult[];
  coachOptions: EmiCoachOption[];
  isLoading: boolean;
}
