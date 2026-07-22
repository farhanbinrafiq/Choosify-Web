/** Audit rule registry — maps rules to opportunity detection */
export interface AuditRuleDefinition {
  id: string;
  label: string;
  auditType: 'content' | 'commerce' | 'discovery' | 'health' | 'publishing';
  description: string;
}

export const AUDIT_REGISTRY: AuditRuleDefinition[] = [
  { id: 'content.hero', label: 'Hero Content', auditType: 'content', description: 'Headline and hero section present' },
  { id: 'content.comparison', label: 'Comparison Table', auditType: 'content', description: 'Comparison or pros/cons block' },
  { id: 'content.guide', label: 'Guide Content', auditType: 'content', description: 'Educational blocks present' },
  { id: 'content.review', label: 'Review Content', auditType: 'content', description: 'Review or rating content' },
  { id: 'content.live', label: 'Live Experience', auditType: 'content', description: 'Live or replay block' },
  { id: 'media.thumbnail', label: 'Primary Media', auditType: 'content', description: 'Hero thumbnail attached' },
  { id: 'media.video', label: 'Video', auditType: 'content', description: 'Video block or media' },
  { id: 'media.gallery', label: 'Gallery', auditType: 'content', description: 'Image gallery block' },
  { id: 'commerce.products', label: 'Products', auditType: 'commerce', description: 'At least one product linked' },
  { id: 'commerce.cta', label: 'CTA', auditType: 'commerce', description: 'Call-to-action configured' },
  { id: 'commerce.buy', label: 'Buy Button', auditType: 'commerce', description: 'Shop Now or Buy action' },
  { id: 'commerce.compare', label: 'Compare', auditType: 'commerce', description: 'Compare action available' },
  { id: 'commerce.wishlist', label: 'Wishlist', auditType: 'commerce', description: 'Wishlist integration' },
  { id: 'commerce.offers', label: 'Offers', auditType: 'commerce', description: 'Offer or coupon block' },
  { id: 'commerce.cross_sell', label: 'Cross-sell', auditType: 'commerce', description: 'Related products linked' },
  { id: 'commerce.bundle', label: 'Bundle', auditType: 'commerce', description: 'Bundle block present' },
  { id: 'seo.basic', label: 'SEO Basics', auditType: 'discovery', description: 'Slug and meta configured' },
  { id: 'seo.meta', label: 'Meta Description', auditType: 'discovery', description: 'Meta description filled' },
  { id: 'seo.schema', label: 'Schema', auditType: 'discovery', description: 'Structured data type set' },
  { id: 'discovery.tags', label: 'Tags', auditType: 'discovery', description: '3+ discovery tags' },
  { id: 'discovery.categories', label: 'Categories', auditType: 'discovery', description: 'Category links' },
  { id: 'discovery.collections', label: 'Collections', auditType: 'discovery', description: 'Collection membership' },
  { id: 'discovery.series', label: 'Series', auditType: 'discovery', description: 'Series membership' },
  { id: 'discovery.featured', label: 'Featured', auditType: 'discovery', description: 'Featured flag set' },
  { id: 'discovery.related', label: 'Related Content', auditType: 'discovery', description: 'Related Spotlight links' },
  { id: 'creator.collaboration', label: 'Creator', auditType: 'content', description: 'Creator linked' },
  { id: 'brand.link', label: 'Brand', auditType: 'content', description: 'Brand linked' },
  { id: 'trust.score', label: 'Trust', auditType: 'health', description: 'Trust score threshold' },
  { id: 'health.freshness', label: 'Freshness', auditType: 'health', description: 'Updated within 30 days' },
  { id: 'localization.missing', label: 'Localization', auditType: 'health', description: 'Multi-language support' },
  { id: 'accessibility.alt', label: 'Accessibility', auditType: 'health', description: 'Alt text present' },
  { id: 'publishing.expiring', label: 'Expiring', auditType: 'publishing', description: 'Schedule ending soon' },
  { id: 'ai.readiness', label: 'AI Readiness', auditType: 'publishing', description: 'Ready for Emi. A.I' },
];

export function auditsByType(type: AuditRuleDefinition['auditType']): AuditRuleDefinition[] {
  return AUDIT_REGISTRY.filter((a) => a.auditType === type);
}
