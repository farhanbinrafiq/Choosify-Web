/** Emi AI placeholder actions — Phase 5.6 wiring (no generation in 5.5) */
export interface EmiActionDefinition {
  id: string;
  label: string;
  description: string;
  icon: string;
  phase: '5.6';
  category: string;
}

export const EMI_ACTION_REGISTRY: EmiActionDefinition[] = [
  { id: 'optimize_headline', label: 'Optimize Headline', description: 'Emi will suggest a stronger headline', icon: '✍', phase: '5.6', category: 'content' },
  { id: 'generate_summary', label: 'Generate Summary', description: 'Auto-write a compelling summary', icon: '📝', phase: '5.6', category: 'content' },
  { id: 'improve_seo', label: 'Improve SEO', description: 'Optimize meta title, description, and schema', icon: '🔍', phase: '5.6', category: 'seo' },
  { id: 'suggest_products', label: 'Suggest Products', description: 'Recommend relevant products to link', icon: '🛒', phase: '5.6', category: 'commerce' },
  { id: 'suggest_creator', label: 'Suggest Creator', description: 'Match a creator for collaboration', icon: '⭐', phase: '5.6', category: 'creator' },
  { id: 'suggest_cta', label: 'Suggest CTA', description: 'Recommend the best call-to-action', icon: '👆', phase: '5.6', category: 'commerce' },
  { id: 'suggest_tags', label: 'Suggest Tags', description: 'Generate discovery tags', icon: '🏷', phase: '5.6', category: 'discovery' },
  { id: 'suggest_collection', label: 'Suggest Collection', description: 'Place in the right collection', icon: '📚', phase: '5.6', category: 'discovery' },
  { id: 'suggest_series', label: 'Suggest Series', description: 'Add to an episodic series', icon: '📺', phase: '5.6', category: 'discovery' },
  { id: 'translate', label: 'Translate', description: 'Localize content for new markets', icon: '🌐', phase: '5.6', category: 'localization' },
];
