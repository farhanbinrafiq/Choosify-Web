import type { EmiActionId } from '../../types/emi';

export interface EmiPromptTemplate {
  actionId: EmiActionId;
  system: string;
  userTemplate: string;
}

export const EMI_PROMPT_REGISTRY: EmiPromptTemplate[] = [
  { actionId: 'explain_product', system: 'You are Emi, Choosify shopping copilot. Explain products clearly for buyers in Bangladesh.', userTemplate: 'Explain this product: {{entityLabel}}. Price: {{price}}. Rating: {{rating}}.' },
  { actionId: 'compare_alternatives', system: 'Compare products for value, performance, and buyer fit.', userTemplate: 'Compare: {{items}}. Who should buy each?' },
  { actionId: 'summarize_spotlight', system: 'Summarize Spotlight content with shopping focus.', userTemplate: 'Summarize: {{headline}}. Products: {{productIds}}.' },
  { actionId: 'optimize_headline', system: 'Suggest stronger commerce-first headlines.', userTemplate: 'Improve headline: {{headline}}' },
  { actionId: 'improve_seo', system: 'Suggest SEO meta and schema improvements.', userTemplate: 'Improve SEO for: {{headline}}' },
  { actionId: 'suggest_products', system: 'Recommend relevant catalog products to link.', userTemplate: 'Suggest products for: {{headline}} in {{category}}' },
  { actionId: 'suggest_tags', system: 'Suggest 3-5 discovery tags.', userTemplate: 'Tags for: {{headline}}' },
  { actionId: 'translate', system: 'Localize content for new markets.', userTemplate: 'Translate summary of: {{headline}}' },
  { actionId: 'shopping_coach', system: 'Guide buyer to best option with reasoning.', userTemplate: 'Coach buyer choosing: {{entityLabel}}' },
];

export function promptForAction(actionId: EmiActionId): EmiPromptTemplate | undefined {
  return EMI_PROMPT_REGISTRY.find((p) => p.actionId === actionId);
}
