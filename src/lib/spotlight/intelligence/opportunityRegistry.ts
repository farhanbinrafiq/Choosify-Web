import type { IntelligenceSectionId } from '../../../types/spotlight/intelligence';

export interface OpportunityDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  section: IntelligenceSectionId;
  metricHint?: string;
  priority: 'high' | 'medium' | 'low';
}

/** Spotlight Mission Control — opportunity registry (CTO upgrade Phase 5.4) */
export const OPPORTUNITY_REGISTRY: OpportunityDefinition[] = [
  { id: 'best_performer', title: 'Best Performer', description: 'Top content by composite score this period', icon: '📈', section: 'content', priority: 'high' },
  { id: 'needs_attention', title: 'Needs Attention', description: 'Low health, trust, or engagement scores', icon: '⚠️', section: 'health', priority: 'high' },
  { id: 'trending_now', title: 'Trending Now', description: 'Fastest rising discovery scores', icon: '🚀', section: 'discovery', priority: 'high' },
  { id: 'live_active', title: 'Live Active', description: 'Currently live Spotlight events', icon: '🔴', section: 'live', priority: 'high' },
  { id: 'commerce_drivers', title: 'Commerce Drivers', description: 'Campaigns driving most product clicks', icon: '💰', section: 'campaigns', priority: 'medium' },
  { id: 'creator_impact', title: 'Creator Impact', description: 'Creators with highest influence', icon: '⭐', section: 'creators', priority: 'medium' },
  { id: 'product_exposure', title: 'Product Exposure', description: 'Products with most Spotlight visibility', icon: '🛒', section: 'products', priority: 'medium' },
  { id: 'expiring_soon', title: 'Expiring Soon', description: 'Campaigns ending within 7 days', icon: '⏳', section: 'campaigns', priority: 'medium' },
  { id: 'scheduled_7d', title: 'Scheduled (7 Days)', description: 'Content publishing in the next week', icon: '📅', section: 'overview', priority: 'low' },
];

export function opportunitiesByPriority(priority: OpportunityDefinition['priority']): OpportunityDefinition[] {
  return OPPORTUNITY_REGISTRY.filter((o) => o.priority === priority);
}
