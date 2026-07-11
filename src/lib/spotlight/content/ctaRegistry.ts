import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';

export interface SpotlightCtaDefinition {
  contentType: SpotlightContentType | '*';
  label: string;
  secondaryLabel?: string;
}

export const CTA_REGISTRY: SpotlightCtaDefinition[] = [
  { contentType: 'creator_review', label: 'Watch Review', secondaryLabel: 'View Creator' },
  { contentType: 'product_review', label: 'Watch Review' },
  { contentType: 'buying_guide', label: 'Read Guide' },
  { contentType: 'tutorial', label: 'Read Guide' },
  { contentType: 'recommendation', label: 'View Recommendation' },
  { contentType: 'editorial', label: 'Read Article' },
  { contentType: 'campaign', label: 'Open Campaign' },
  { contentType: 'promotion', label: 'View Promotion' },
  { contentType: 'new_launch', label: 'View Launch' },
  { contentType: 'announcement', label: 'View Announcement' },
  { contentType: 'live', label: 'Watch Live' },
  { contentType: 'livestream_replay', label: 'Watch Replay' },
  { contentType: 'event', label: 'View Event' },
  { contentType: 'brand_story', label: 'Read Story' },
  { contentType: 'whats_on', label: 'Learn More' },
  { contentType: 'comparison', label: 'Compare Products' },
  { contentType: '*', label: 'Explore Spotlight' },
];

export function resolveCtaLabel(contentType: SpotlightContentType): string {
  const rule = CTA_REGISTRY.find((c) => c.contentType === contentType);
  return rule?.label ?? CTA_REGISTRY.find((c) => c.contentType === '*')!.label;
}
