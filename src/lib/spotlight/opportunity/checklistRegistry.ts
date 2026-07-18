import type { OptimizationChecklistItem, OpportunityCategory } from '../../../types/spotlight/opportunity';

export interface ChecklistDefinition {
  id: string;
  label: string;
  category: OpportunityCategory;
  auditRuleId: string;
}

export const CHECKLIST_REGISTRY: ChecklistDefinition[] = [
  { id: 'media_hero', label: 'Hero image or video', category: 'media', auditRuleId: 'media.thumbnail' },
  { id: 'media_gallery', label: 'Gallery or additional media', category: 'media', auditRuleId: 'media.gallery' },
  { id: 'seo_title', label: 'Meta title and description', category: 'seo', auditRuleId: 'seo.meta' },
  { id: 'seo_schema', label: 'Schema markup type', category: 'seo', auditRuleId: 'seo.schema' },
  { id: 'commerce_products', label: 'Products linked', category: 'commerce', auditRuleId: 'commerce.products' },
  { id: 'commerce_cta', label: 'Call-to-action button', category: 'commerce', auditRuleId: 'commerce.cta' },
  { id: 'commerce_compare', label: 'Compare enabled', category: 'commerce', auditRuleId: 'commerce.compare' },
  { id: 'discovery_tags', label: 'Discovery tags (3–5)', category: 'discovery', auditRuleId: 'discovery.tags' },
  { id: 'discovery_categories', label: 'Categories linked', category: 'discovery', auditRuleId: 'discovery.categories' },
  { id: 'creator_collab', label: 'Creator collaboration', category: 'creator', auditRuleId: 'creator.collaboration' },
  { id: 'brand_link', label: 'Brand linked', category: 'brand', auditRuleId: 'brand.link' },
  { id: 'internal_links', label: 'Related Spotlight content', category: 'discovery', auditRuleId: 'discovery.related' },
  { id: 'accessibility_alt', label: 'Alt text on images', category: 'accessibility', auditRuleId: 'accessibility.alt' },
  { id: 'trust_signals', label: 'Trust score above 70', category: 'trust', auditRuleId: 'trust.score' },
];

export function checklistByCategory(category: OpportunityCategory): ChecklistDefinition[] {
  return CHECKLIST_REGISTRY.filter((c) => c.category === category);
}
