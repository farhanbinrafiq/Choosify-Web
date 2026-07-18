import type { OpportunityPanelGroup, SpotlightOpportunityInstance } from '../../../types/spotlight/opportunity';

export const RECOMMENDATION_PANEL_REGISTRY: OpportunityPanelGroup[] = [
  {
    id: 'top_opportunities',
    title: 'Top Opportunities',
    description: 'Highest estimated impact improvements',
    filter: (o) => o.status === 'open' && (o.priority === 'critical' || o.priority === 'high'),
  },
  {
    id: 'quick_wins',
    title: 'Quick Wins',
    description: 'Low effort, meaningful impact',
    filter: (o) => o.status === 'open' && o.effort === 'low' && o.estimatedImpactPercent >= 10,
  },
  {
    id: 'highest_roi',
    title: 'Highest ROI',
    description: 'Best impact-to-effort ratio',
    filter: (o) => o.status === 'open' && o.estimatedImpactPercent >= 15,
  },
  {
    id: 'low_effort',
    title: 'Low Effort',
    description: 'Fix in under 5 minutes',
    filter: (o) => o.status === 'open' && o.effort === 'low',
  },
  {
    id: 'critical_issues',
    title: 'Critical Issues',
    description: 'Must fix before publishing',
    filter: (o) => o.status === 'open' && o.severity === 'critical',
  },
  {
    id: 'expiring_campaigns',
    title: 'Expiring Campaigns',
    description: 'Ending within 7 days',
    filter: (o) => o.definitionId === 'expiring_campaign' && o.status === 'open',
  },
  {
    id: 'stale_content',
    title: 'Stale Content',
    description: 'Needs refresh',
    filter: (o) => o.definitionId === 'stale_content' && o.status === 'open',
  },
  {
    id: 'underperforming',
    title: 'Underperforming',
    description: 'Low health or trust scores',
    filter: (o) => (o.definitionId === 'low_trust' || o.definitionId === 'missing_products') && o.status === 'open',
  },
];

export function getPanelOpportunities(
  panelId: string,
  opportunities: SpotlightOpportunityInstance[],
): SpotlightOpportunityInstance[] {
  const panel = RECOMMENDATION_PANEL_REGISTRY.find((p) => p.id === panelId);
  if (!panel) return [];
  return opportunities.filter(panel.filter).slice(0, 6);
}
