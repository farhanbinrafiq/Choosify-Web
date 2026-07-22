import type { IntelligenceInsightDefinition } from '../../../types/spotlight/intelligence';

export const INSIGHT_REGISTRY: IntelligenceInsightDefinition[] = [
  { id: 'top_campaign', title: 'Top Campaign', description: 'Highest performing campaign by composite score', drillDownSection: 'campaigns', drillDownEntityType: 'campaign' },
  { id: 'top_brand', title: 'Top Brand', description: 'Leading brand by engagement', drillDownSection: 'brands', drillDownEntityType: 'brand' },
  { id: 'top_creator', title: 'Top Creator', description: 'Creator with highest reach', drillDownSection: 'creators', drillDownEntityType: 'creator' },
  { id: 'top_product', title: 'Top Product', description: 'Most clicked product from Spotlight', drillDownSection: 'products', drillDownEntityType: 'product' },
  { id: 'fastest_growing', title: 'Fastest Growing', description: 'Highest growth % this period', drillDownSection: 'discovery' },
  { id: 'highest_ctr', title: 'Highest CTR', description: 'Best click-through rate', drillDownSection: 'campaigns', drillDownEntityType: 'campaign' },
  { id: 'needs_attention', title: 'Needs Attention', description: 'Low health or trust scores', drillDownSection: 'health' },
  { id: 'lowest_engagement', title: 'Lowest Engagement', description: 'Underperforming vs platform average', drillDownSection: 'campaigns' },
  { id: 'top_opportunity', title: 'Top Opportunity', description: 'Highest upside content to optimize', drillDownSection: 'content' },
  { id: 'weak_content', title: 'Weak Content', description: 'Low quality or incomplete experiences', drillDownSection: 'health' },
  { id: 'upcoming_trends', title: 'Upcoming Trends', description: 'Emerging topics and categories', drillDownSection: 'discovery' },
  { id: 'live_active', title: 'Live Active', description: 'Currently broadcasting events', drillDownSection: 'live' },
  { id: 'expiring_campaigns', title: 'Expiring Campaigns', description: 'Campaigns ending within 7 days', drillDownSection: 'campaigns' },
  { id: 'scheduled_7d', title: 'Scheduled (7 Days)', description: 'Publishing calendar next week', drillDownSection: 'overview' },
  { id: 'ai_placeholder', title: 'AI Suggestions', description: 'Future Emi. A.I recommendations — architecture placeholder', drillDownSection: 'insights' },
];
