import type { PlatformRole } from './roles';

/** Module ownership for Phase 5.2 Intelligence Dashboard and future platforms */
export type PlatformModule =
  | 'spotlight.experience'
  | 'spotlight.discovery'
  | 'spotlight.interactive'
  | 'spotlight.merchandising'
  | 'spotlight.intelligence'
  | 'spotlight.opportunity'
  | 'spotlight.monetization'
  | 'commerce.catalog'
  | 'commerce.orders'
  | 'content.guides'
  | 'content.reviews'
  | 'marketing.campaigns'
  | 'moderation.trust'
  | 'admin.cms';

export interface ModuleOwnership {
  module: PlatformModule;
  label: string;
  ownerRoles: PlatformRole[];
  dashboardHome?: string;
  publicSurface?: string;
  phase?: string;
}

export const OWNERSHIP_REGISTRY: ModuleOwnership[] = [
  { module: 'spotlight.experience', label: 'Spotlight Experience', ownerRoles: ['brand', 'admin'], publicSurface: '/spotlight', phase: '4' },
  { module: 'spotlight.discovery', label: 'Spotlight Discovery', ownerRoles: ['buyer', 'brand', 'creator', 'admin'], publicSurface: '/spotlight/explore', phase: '4' },
  { module: 'spotlight.interactive', label: 'Live & Interactive Commerce', ownerRoles: ['brand', 'admin'], publicSurface: '/spotlight/live', phase: '3' },
  { module: 'spotlight.merchandising', label: 'Campaign Merchandising', ownerRoles: ['brand', 'admin'], dashboardHome: '/marketing/studio', phase: '2' },
  { module: 'spotlight.intelligence', label: 'Spotlight Intelligence', ownerRoles: ['brand', 'admin', 'moderator'], dashboardHome: '/marketing/intelligence', phase: '5.4' },
  { module: 'spotlight.opportunity', label: 'Spotlight Opportunity Center', ownerRoles: ['brand', 'admin'], dashboardHome: '/marketing/opportunity', phase: '5.5' },
  { module: 'spotlight.monetization', label: 'Spotlight Monetization', ownerRoles: ['admin'], phase: 'future' },
  { module: 'commerce.catalog', label: 'Product Catalog', ownerRoles: ['seller', 'brand', 'admin'], publicSurface: '/products' },
  { module: 'commerce.orders', label: 'Orders', ownerRoles: ['buyer', 'seller', 'admin'], dashboardHome: '/profile/orders' },
  { module: 'content.guides', label: 'Spotlight Editorial', ownerRoles: ['buyer', 'creator', 'admin'], publicSurface: '/spotlight?tab=guides' },
  { module: 'content.reviews', label: 'Spotlight Reviews', ownerRoles: ['buyer', 'creator', 'admin'], publicSurface: '/spotlight?tab=reviews' },
  { module: 'marketing.campaigns', label: 'Spotlight Publisher Studio', ownerRoles: ['brand', 'admin'], dashboardHome: '/marketing/studio' },
  { module: 'moderation.trust', label: 'Trust & Safety', ownerRoles: ['moderator', 'admin'] },
  { module: 'admin.cms', label: 'Website & Product CMS Studio', ownerRoles: ['admin'] },
];

export function modulesForRole(role: PlatformRole): ModuleOwnership[] {
  if (role === 'admin') return OWNERSHIP_REGISTRY;
  return OWNERSHIP_REGISTRY.filter((m) => m.ownerRoles.includes(role));
}
