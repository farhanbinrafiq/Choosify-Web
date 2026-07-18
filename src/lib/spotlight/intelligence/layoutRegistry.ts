import type { IntelligenceSectionId } from '../../../types/spotlight/intelligence';
import type { PlatformRole } from '../../platform/roles';

export interface IntelligenceNavItem {
  id: IntelligenceSectionId;
  label: string;
  path: string;
  roles: PlatformRole[];
}

export const INTELLIGENCE_NAV: IntelligenceNavItem[] = [
  { id: 'mission_control', label: 'Mission Control', path: '/marketing/intelligence', roles: ['brand', 'admin', 'moderator'] },
  { id: 'overview', label: 'Overview', path: '/marketing/intelligence/overview', roles: ['brand', 'admin', 'moderator'] },
  { id: 'executive', label: 'Executive', path: '/marketing/intelligence/executive', roles: ['admin', 'brand'] },
  { id: 'content', label: 'Content', path: '/marketing/intelligence/content', roles: ['brand', 'admin', 'creator'] },
  { id: 'campaigns', label: 'Campaigns', path: '/marketing/intelligence/campaigns', roles: ['brand', 'admin'] },
  { id: 'brands', label: 'Brands', path: '/marketing/intelligence/brands', roles: ['brand', 'admin'] },
  { id: 'creators', label: 'Creators', path: '/marketing/intelligence/creators', roles: ['brand', 'admin', 'creator'] },
  { id: 'products', label: 'Products', path: '/marketing/intelligence/products', roles: ['brand', 'admin', 'seller'] },
  { id: 'live', label: 'Live', path: '/marketing/intelligence/live', roles: ['brand', 'admin'] },
  { id: 'discovery', label: 'Discovery', path: '/marketing/intelligence/discovery', roles: ['brand', 'admin'] },
  { id: 'funnel', label: 'Funnel', path: '/marketing/intelligence/funnel', roles: ['brand', 'admin'] },
  { id: 'heatmaps', label: 'Heatmaps', path: '/marketing/intelligence/heatmaps', roles: ['brand', 'admin'] },
  { id: 'trust', label: 'Trust', path: '/marketing/intelligence/trust', roles: ['brand', 'admin', 'moderator'] },
  { id: 'health', label: 'Health', path: '/marketing/intelligence/health', roles: ['brand', 'admin', 'moderator'] },
  { id: 'leaderboards', label: 'Leaderboards', path: '/marketing/intelligence/leaderboards', roles: ['brand', 'admin'] },
  { id: 'insights', label: 'Insights', path: '/marketing/intelligence/insights', roles: ['brand', 'admin'] },
];

export const INTELLIGENCE_LAYOUT_REGISTRY: Record<IntelligenceSectionId, string[]> = {
  mission_control: ['mission-control-grid', 'insight-panels'],
  overview: ['kpi-overview-grid', 'executive-summary', 'views-trend-chart'],
  executive: ['executive-summary', 'kpi-overview-grid', 'views-trend-chart'],
  content: ['content-intelligence-table'],
  campaigns: ['campaign-performance-table'],
  brands: ['brand-score-cards'],
  creators: ['creator-leaderboard'],
  products: ['product-exposure-grid'],
  live: ['live-intelligence-panel'],
  discovery: ['discovery-timeline', 'trending-lists'],
  funnel: ['funnel-analytics'],
  heatmaps: ['heatmap-grid'],
  trust: ['trust-health-panel'],
  health: ['health-center', 'trust-health-panel'],
  leaderboards: ['leaderboard-grid', 'creator-leaderboard', 'campaign-leaderboard'],
  insights: ['insight-panels'],
};

export function navForRole(role: PlatformRole): IntelligenceNavItem[] {
  if (role === 'admin') return INTELLIGENCE_NAV;
  return INTELLIGENCE_NAV.filter((n) => n.roles.includes(role));
}

/** Role dashboard presets — widget sets per role */
export const ROLE_DASHBOARD_PRESETS: Record<PlatformRole, IntelligenceSectionId[]> = {
  buyer: [],
  seller: ['products', 'insights', 'mission_control'],
  brand: ['mission_control', 'overview', 'content', 'campaigns', 'brands', 'discovery', 'leaderboards', 'insights'],
  creator: ['mission_control', 'creators', 'content', 'leaderboards'],
  moderator: ['mission_control', 'trust', 'health', 'insights'],
  admin: ['mission_control', 'executive', 'overview', 'content', 'campaigns', 'brands', 'creators', 'products', 'live', 'discovery', 'funnel', 'heatmaps', 'trust', 'health', 'leaderboards', 'insights'],
};

/** Intelligence dashboard registry — maps dashboard surfaces to default sections */
export const INTELLIGENCE_DASHBOARD_REGISTRY = [
  { dashboardId: 'spotlight-intelligence', label: 'Spotlight Intelligence', defaultSection: 'mission_control' as IntelligenceSectionId, route: '/marketing/intelligence' },
  { dashboardId: 'executive', label: 'Executive Dashboard', defaultSection: 'executive' as IntelligenceSectionId, route: '/marketing/intelligence/executive' },
  { dashboardId: 'brand-dashboard', label: 'Brand Dashboard', defaultSection: 'brands' as IntelligenceSectionId, widgets: ['brand-score-cards', 'campaign-performance-table'] },
  { dashboardId: 'creator-dashboard', label: 'Creator Dashboard', defaultSection: 'creators' as IntelligenceSectionId, widgets: ['creator-leaderboard', 'content-intelligence-table'] },
  { dashboardId: 'seller-dashboard', label: 'Seller Dashboard', defaultSection: 'products' as IntelligenceSectionId, widgets: ['product-exposure-grid'] },
  { dashboardId: 'admin-dashboard', label: 'Admin Dashboard', defaultSection: 'executive' as IntelligenceSectionId, widgets: ['executive-summary', 'mission-control-grid'] },
  { dashboardId: 'partner-portal', label: 'Partner Portal', defaultSection: 'overview' as IntelligenceSectionId, phase: 'future' },
];
