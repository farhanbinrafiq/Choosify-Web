import type { PublishingReadiness, ReadinessGate } from '../../../types/spotlight/opportunity';

export interface ReadinessGateDefinition {
  gate: ReadinessGate;
  label: string;
  description: string;
  requiredAuditRules: string[];
}

export const READINESS_REGISTRY: ReadinessGateDefinition[] = [
  { gate: 'ready_to_publish', label: 'Ready to Publish', description: 'All critical gates passed', requiredAuditRules: ['media.thumbnail', 'commerce.products', 'commerce.cta', 'seo.basic', 'discovery.tags'] },
  { gate: 'needs_review', label: 'Needs Review', description: 'Pending editorial or brand review', requiredAuditRules: [] },
  { gate: 'needs_media', label: 'Needs Media', description: 'Hero image or video required', requiredAuditRules: ['media.thumbnail'] },
  { gate: 'needs_seo', label: 'Needs SEO', description: 'Meta and schema incomplete', requiredAuditRules: ['seo.basic', 'seo.meta'] },
  { gate: 'needs_commerce', label: 'Needs Commerce', description: 'Products or CTA missing', requiredAuditRules: ['commerce.products', 'commerce.cta'] },
  { gate: 'needs_approval', label: 'Needs Approval', description: 'Awaiting moderator approval', requiredAuditRules: [] },
  { gate: 'needs_localization', label: 'Needs Localization', description: 'Translation not configured', requiredAuditRules: ['localization.missing'] },
  { gate: 'needs_products', label: 'Needs Products', description: 'At least one product required', requiredAuditRules: ['commerce.products'] },
];

export function evaluateReadiness(
  passedRules: Set<string>,
  status: string,
): PublishingReadiness[] {
  return READINESS_REGISTRY.map((def) => {
    const blockers = def.requiredAuditRules.filter((r) => !passedRules.has(r));
    let met = blockers.length === 0;
    if (def.gate === 'needs_review') met = status === 'pending_review';
    if (def.gate === 'needs_approval') met = status === 'draft' || status === 'pending_review';
    if (def.gate === 'ready_to_publish') met = blockers.length === 0 && (status === 'approved' || status === 'published' || status === 'draft');
    return {
      gate: def.gate,
      label: def.label,
      met,
      blockers: blockers.map((id) => READINESS_REGISTRY.find((r) => r.requiredAuditRules.includes(id))?.label ?? id),
    };
  });
}
