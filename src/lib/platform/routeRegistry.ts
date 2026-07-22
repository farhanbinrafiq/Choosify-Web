import type { PlatformRole } from './roles';

export type RouteKind = 'public' | 'auth' | 'role-gated' | 'redirect' | 'deprecated';

export interface RouteDefinition {
  path: string;
  kind: RouteKind;
  /** Roles allowed when kind is role-gated; admin always allowed */
  roles?: PlatformRole[];
  label: string;
  noindex?: boolean;
  notes?: string;
}

export const ROUTE_REGISTRY: RouteDefinition[] = [
  { path: '/', kind: 'public', label: 'Home' },
  { path: '/categories', kind: 'public', label: 'Categories' },
  { path: '/spotlight', kind: 'public', label: 'Spotlight' },
  { path: '/products', kind: 'public', label: 'Browse' },
  { path: '/brands', kind: 'public', label: 'Brands' },
  { path: '/guides', kind: 'redirect', label: 'Spotlight (legacy guides)', notes: 'Redirects to /spotlight?tab=guides' },
  { path: '/spotlight/:slug', kind: 'public', label: 'Spotlight Content' },
  { path: '/spotlight/content/:slug', kind: 'public', label: 'Spotlight Content (legacy redirect)' },
  { path: '/recommendations', kind: 'redirect', label: 'Discover & Learn (legacy)', notes: 'Redirects to /guides' },
  { path: '/compare', kind: 'public', label: 'Compare' },
  { path: '/deals', kind: 'public', label: 'Deals' },
  { path: '/creators', kind: 'public', label: 'Creators' },
  { path: '/search', kind: 'public', label: 'Discover' },
  { path: '/reviews/:slug', kind: 'public', label: 'Review Details' },
  { path: '/dashboard', kind: 'auth', label: 'Dashboard', noindex: true },
  { path: '/profile/orders', kind: 'auth', label: 'Orders', noindex: true, roles: ['buyer', 'seller', 'brand', 'creator', 'moderator', 'admin'] },
  { path: '/messages', kind: 'auth', label: 'Messages', noindex: true },
  { path: '/marketing', kind: 'role-gated', label: 'Marketing Hub', roles: ['brand', 'moderator', 'admin'], noindex: true },
  { path: '/marketing/opportunity', kind: 'role-gated', label: 'Spotlight Opportunity Center', roles: ['brand', 'admin'], noindex: true },
  { path: '/marketing/studio/new', kind: 'role-gated', label: 'Create Spotlight Content', roles: ['brand', 'admin'], noindex: true },
  { path: '/marketing/studio/:id', kind: 'role-gated', label: 'Universal Publisher Editor', roles: ['brand', 'admin'], noindex: true },
  { path: '/marketing/spotlight', kind: 'role-gated', label: 'Spotlight Publisher Studio', roles: ['brand', 'admin'], noindex: true },
  { path: '/marketing/spotlight/new', kind: 'role-gated', label: 'Create Spotlight Content', roles: ['brand', 'admin'], noindex: true },
  { path: '/marketing/spotlight/:campaignId', kind: 'role-gated', label: 'Universal Publisher Editor', roles: ['brand', 'admin'], noindex: true },
  { path: '/marketing/intelligence', kind: 'role-gated', label: 'Spotlight Intelligence', roles: ['brand', 'admin', 'moderator'], noindex: true },
  { path: '/marketing/intelligence/:section', kind: 'role-gated', label: 'Intelligence Section', roles: ['brand', 'admin', 'moderator'], noindex: true },
  { path: '/marketing/intelligence/:section/:entityId', kind: 'role-gated', label: 'Intelligence Drill-down', roles: ['brand', 'admin', 'moderator'], noindex: true },
  { path: '/checkout', kind: 'auth', label: 'Checkout', noindex: true },
  { path: '/post-offer', kind: 'auth', label: 'Post Offer', noindex: true, roles: ['seller', 'brand', 'admin'] },
];

export function getRouteDefinition(path: string): RouteDefinition | undefined {
  const normalized = path.split('?')[0];
  return ROUTE_REGISTRY.find((r) => {
    if (r.path === normalized) return true;
    const pattern = r.path.replace(/:[^/]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`).test(normalized);
  });
}

export function routeRequiresRoles(path: string): PlatformRole[] | null {
  const def = getRouteDefinition(path);
  if (!def || def.kind !== 'role-gated') return null;
  return def.roles ?? [];
}

export function isNoindexRoute(path: string): boolean {
  const def = getRouteDefinition(path);
  if (def?.noindex) return true;
  return path.startsWith('/marketing') || path.startsWith('/dashboard');
}
