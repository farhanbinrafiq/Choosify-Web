import type { EmiCapabilityId } from '../../types/emi';

export interface EmiCapabilityDefinition {
  id: EmiCapabilityId;
  label: string;
  description: string;
  executionMode: 'contextual' | 'action' | 'future_auto';
}

export const EMI_CAPABILITY_REGISTRY: EmiCapabilityDefinition[] = [
  { id: 'explain', label: 'Explain', description: 'Explain why and what data was considered', executionMode: 'contextual' },
  { id: 'summarize', label: 'Summarize', description: 'Condense content into key takeaways', executionMode: 'contextual' },
  { id: 'compare', label: 'Compare', description: 'Highlight differences between options', executionMode: 'contextual' },
  { id: 'recommend', label: 'Recommend', description: 'Suggest products, Spotlight, or next steps', executionMode: 'contextual' },
  { id: 'optimize', label: 'Optimize', description: 'Suggest improvements for publishers', executionMode: 'action' },
  { id: 'generate', label: 'Generate', description: 'Reserved — generate new copy (architecture only)', executionMode: 'future_auto' },
  { id: 'rewrite', label: 'Rewrite', description: 'Reserved — rewrite existing copy', executionMode: 'future_auto' },
  { id: 'translate', label: 'Translate', description: 'Reserved — localize content', executionMode: 'future_auto' },
  { id: 'categorize', label: 'Categorize', description: 'Suggest categories and tags', executionMode: 'action' },
  { id: 'moderate', label: 'Moderate', description: 'Reserved — trust and safety checks', executionMode: 'future_auto' },
  { id: 'schedule', label: 'Schedule', description: 'Reserved — publishing schedule suggestions', executionMode: 'future_auto' },
];
