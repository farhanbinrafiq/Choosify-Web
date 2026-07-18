import type { EmiPageId } from '../../types/emi';

export interface EmiPageDefinition {
  id: EmiPageId;
  label: string;
  pathPattern: RegExp;
  sidecarEnabled: boolean;
  panelPlacement: 'inline' | 'aside' | 'studio' | 'none';
}

export const EMI_PAGE_REGISTRY: EmiPageDefinition[] = [
  { id: 'home', label: 'Home', pathPattern: /^\/$/, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'product', label: 'Product', pathPattern: /^\/products\//, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'brand', label: 'Brand', pathPattern: /^\/brands\//, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'compare', label: 'Compare', pathPattern: /^\/compare/, sidecarEnabled: true, panelPlacement: 'aside' },
  { id: 'spotlight', label: 'Spotlight', pathPattern: /^\/spotlight\/?(\?|$)/, sidecarEnabled: false, panelPlacement: 'inline' },
  { id: 'spotlight_content', label: 'Spotlight Content', pathPattern: /^\/spotlight\/content\//, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'search', label: 'Search', pathPattern: /^\/search/, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'category', label: 'Categories', pathPattern: /^\/categories/, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'creator', label: 'Creator', pathPattern: /^\/creators\//, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'dashboard', label: 'Dashboard', pathPattern: /^\/dashboard/, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'publisher_studio', label: 'Publisher Studio', pathPattern: /^\/marketing\/studio/, sidecarEnabled: false, panelPlacement: 'studio' },
  { id: 'opportunity_center', label: 'Opportunity Center', pathPattern: /^\/marketing\/opportunity/, sidecarEnabled: false, panelPlacement: 'studio' },
  { id: 'marketing', label: 'Marketing', pathPattern: /^\/marketing/, sidecarEnabled: false, panelPlacement: 'studio' },
  { id: 'collection', label: 'Collection', pathPattern: /^\/spotlight\/collections\//, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'series', label: 'Series', pathPattern: /^\/spotlight\/series\//, sidecarEnabled: true, panelPlacement: 'inline' },
  { id: 'orders', label: 'Orders', pathPattern: /^\/profile\/orders/, sidecarEnabled: false, panelPlacement: 'inline' },
  { id: 'messages', label: 'Messages', pathPattern: /^\/messages/, sidecarEnabled: false, panelPlacement: 'none' },
];

export function resolveEmiPageId(pathname: string): EmiPageId {
  const match = EMI_PAGE_REGISTRY.find((p) => p.pathPattern.test(pathname));
  return match?.id ?? 'home';
}

export function pageDefinition(pageId: EmiPageId): EmiPageDefinition | undefined {
  return EMI_PAGE_REGISTRY.find((p) => p.id === pageId);
}
