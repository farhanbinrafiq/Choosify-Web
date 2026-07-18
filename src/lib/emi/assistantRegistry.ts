import type { EmiAssistantId, EmiPageId } from '../../types/emi';

export interface EmiAssistantDefinition {
  id: EmiAssistantId;
  label: string;
  description: string;
  pages: EmiPageId[];
  capabilities: string[];
}

export const EMI_ASSISTANT_REGISTRY: EmiAssistantDefinition[] = [
  { id: 'shopping', label: 'Shopping Assistant', description: 'Explain products, reviews, specs, and alternatives', pages: ['product', 'brand', 'category'], capabilities: ['explain', 'summarize', 'recommend', 'compare'] },
  { id: 'spotlight', label: 'Spotlight Assistant', description: 'Summarize content and highlight shoppable items', pages: ['spotlight', 'spotlight_content', 'collection', 'series'], capabilities: ['summarize', 'explain', 'recommend'] },
  { id: 'compare', label: 'Compare Assistant', description: 'Explain differences and who should buy what', pages: ['compare'], capabilities: ['compare', 'explain', 'recommend'] },
  { id: 'search', label: 'Search Assistant', description: 'Conversational discovery and category suggestions', pages: ['search', 'home'], capabilities: ['recommend', 'categorize'] },
  { id: 'publisher', label: 'Publisher Assistant', description: 'Optimize headlines, SEO, CTAs, and placement', pages: ['publisher_studio', 'marketing', 'opportunity_center'], capabilities: ['optimize', 'generate', 'rewrite'] },
  { id: 'creator', label: 'Creator Assistant', description: 'Products, campaigns, tags, and publishing schedule', pages: ['creator', 'dashboard'], capabilities: ['recommend', 'optimize'] },
  { id: 'brand', label: 'Brand Assistant', description: 'Campaign ideas, launches, and creator matching', pages: ['brand', 'marketing'], capabilities: ['recommend', 'optimize'] },
  { id: 'seller', label: 'Seller Assistant', description: 'Inventory highlights, bundles, and cross-sell', pages: ['dashboard', 'orders'], capabilities: ['recommend', 'optimize'] },
  { id: 'discovery', label: 'Discovery Assistant', description: 'Trending, related Spotlight, and personalized picks', pages: ['spotlight', 'home'], capabilities: ['recommend'] },
  { id: 'opportunity', label: 'Opportunity Coach', description: 'Explain why improvements matter and suggested actions', pages: ['opportunity_center'], capabilities: ['explain', 'optimize'] },
];

export function assistantForPage(pageId: EmiPageId): EmiAssistantDefinition | undefined {
  return EMI_ASSISTANT_REGISTRY.find((a) => a.pages.includes(pageId));
}
