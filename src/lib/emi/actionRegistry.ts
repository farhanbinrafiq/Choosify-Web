import type { EmiActionId } from '../../types/emi';

export interface EmiUnifiedActionDefinition {
  id: EmiActionId;
  label: string;
  description: string;
  icon: string;
  category: 'content' | 'seo' | 'commerce' | 'discovery' | 'localization' | 'shopping' | 'publisher';
  assistant: 'shopping' | 'spotlight' | 'publisher' | 'opportunity' | 'compare' | 'search';
  execution: 'contextual' | 'suggest_only';
}

/** Unified action registry — merges opportunity emiActionRegistry + studio AI_ACTIONS_REGISTRY */
export const EMI_ACTION_REGISTRY: EmiUnifiedActionDefinition[] = [
  { id: 'explain_product', label: 'Explain Product', description: 'What this product offers and who it suits', icon: '🔍', category: 'shopping', assistant: 'shopping', execution: 'contextual' },
  { id: 'compare_alternatives', label: 'Compare Alternatives', description: 'Similar products worth considering', icon: '⚖️', category: 'shopping', assistant: 'shopping', execution: 'contextual' },
  { id: 'summarize_spotlight', label: 'Summarize Spotlight', description: 'Key takeaways and products mentioned', icon: '📝', category: 'content', assistant: 'spotlight', execution: 'contextual' },
  { id: 'shopping_coach', label: 'Shopping Coach', description: 'Best for budget, premium, or specific use case', icon: '🛒', category: 'shopping', assistant: 'shopping', execution: 'contextual' },
  { id: 'optimize_headline', label: 'Optimize Headline', description: 'Suggest a stronger commerce-first headline', icon: '✍', category: 'content', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'generate_headline', label: 'Generate Headline', description: 'Draft headline options', icon: '✍', category: 'content', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'generate_summary', label: 'Generate Summary', description: 'Auto-write a compelling summary', icon: '📝', category: 'content', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'improve_seo', label: 'Improve SEO', description: 'Optimize meta title, description, and schema', icon: '🔍', category: 'seo', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'generate_seo', label: 'Generate SEO', description: 'Draft SEO metadata', icon: '🔍', category: 'seo', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'generate_tags', label: 'Suggest Tags', description: 'Generate discovery tags', icon: '🏷', category: 'discovery', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_tags', label: 'Suggest Tags', description: 'Recommend 3–5 discovery tags', icon: '🏷', category: 'discovery', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_products', label: 'Suggest Products', description: 'Recommend relevant products to link', icon: '🛒', category: 'commerce', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_creator', label: 'Suggest Creator', description: 'Match a creator for collaboration', icon: '⭐', category: 'commerce', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_cta', label: 'Suggest CTA', description: 'Recommend the best call-to-action', icon: '👆', category: 'commerce', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_collection', label: 'Suggest Collection', description: 'Place in the right collection', icon: '📚', category: 'discovery', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_series', label: 'Suggest Series', description: 'Add to an episodic series', icon: '📺', category: 'discovery', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_related', label: 'Suggest Related', description: 'Related Spotlight content', icon: '🔗', category: 'discovery', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'suggest_blueprint', label: 'Suggest Blueprint', description: 'Recommend experience blueprint', icon: '📐', category: 'content', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'translate', label: 'Translate', description: 'Localize content for new markets', icon: '🌐', category: 'localization', assistant: 'publisher', execution: 'suggest_only' },
  { id: 'rewrite', label: 'Rewrite', description: 'Improve description copy', icon: '✏️', category: 'content', assistant: 'publisher', execution: 'suggest_only' },
];

export function actionDefinition(actionId: EmiActionId): EmiUnifiedActionDefinition | undefined {
  return EMI_ACTION_REGISTRY.find((a) => a.id === actionId);
}

/** Map opportunity futureAiCapability → unified action id */
export function mapFutureAiCapability(capability?: string): EmiActionId | undefined {
  if (!capability) return undefined;
  const map: Record<string, EmiActionId> = {
    optimize_headline: 'optimize_headline',
    generate_summary: 'generate_summary',
    improve_seo: 'improve_seo',
    suggest_products: 'suggest_products',
    suggest_creator: 'suggest_creator',
    suggest_cta: 'suggest_cta',
    suggest_tags: 'suggest_tags',
    suggest_collection: 'suggest_collection',
    suggest_series: 'suggest_series',
    translate: 'translate',
  };
  return map[capability];
}

export function actionsForAssistant(assistant: EmiUnifiedActionDefinition['assistant']): EmiUnifiedActionDefinition[] {
  return EMI_ACTION_REGISTRY.filter((a) => a.assistant === assistant);
}
