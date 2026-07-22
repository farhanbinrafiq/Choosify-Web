import type { PlatformRole } from './roles';

export type FeatureId =
  | 'buyer.dashboard'
  | 'buyer.orders'
  | 'buyer.wishlist'
  | 'buyer.compare'
  | 'buyer.saved-spotlight'
  | 'buyer.following'
  | 'buyer.messages'
  | 'buyer.reviews'
  | 'buyer.browsing-history'
  | 'seller.products'
  | 'seller.orders'
  | 'seller.inventory'
  | 'seller.promotions'
  | 'seller.spotlight-requests'
  | 'seller.performance'
  | 'brand.marketing'
  | 'brand.spotlight-campaigns'
  | 'brand.collections'
  | 'brand.announcements'
  | 'brand.launches'
  | 'brand.live-events'
  | 'brand.campaign-analytics'
  | 'creator.studio'
  | 'creator.collaborations'
  | 'creator.spotlight'
  | 'creator.guides'
  | 'creator.review-library'
  | 'moderator.queues'
  | 'moderator.reports'
  | 'moderator.approvals'
  | 'moderator.trust'
  | 'admin.full-access'
  | 'admin.studio-edit'
  | 'admin.cms'
  | 'admin.marketing'
  | 'marketing.campaign-manager'
  | 'marketing.campaign-wizard'
  | 'marketing.campaign-editor'
  | 'marketing.scheduling'
  | 'marketing.analytics'
  | 'marketing.intelligence'
  | 'marketing.opportunity'
  | 'marketing.product-studio'
  | 'marketing.website-cms';

export interface FeatureVisibility {
  id: FeatureId;
  label: string;
  visibleTo: PlatformRole[];
  /** Route or dashboard tab id when applicable */
  route?: string;
  dashboardTab?: string;
}

const BUYER_ONLY: PlatformRole[] = ['buyer'];
const SELLER: PlatformRole[] = ['seller'];
const BRAND: PlatformRole[] = ['brand'];
const CREATOR: PlatformRole[] = ['creator'];
const MODERATOR: PlatformRole[] = ['moderator'];
const ADMIN: PlatformRole[] = ['admin'];
const BRAND_ADMIN: PlatformRole[] = ['brand', 'admin'];
const MOD_ADMIN: PlatformRole[] = ['moderator', 'admin'];

export const FEATURE_VISIBILITY: FeatureVisibility[] = [
  { id: 'buyer.dashboard', label: 'Buyer Dashboard', visibleTo: BUYER_ONLY, route: '/dashboard' },
  { id: 'buyer.orders', label: 'Orders', visibleTo: BUYER_ONLY, route: '/profile/orders', dashboardTab: 'orders' },
  { id: 'buyer.wishlist', label: 'Saved Items', visibleTo: BUYER_ONLY, dashboardTab: 'saved-items' },
  { id: 'buyer.compare', label: 'Compare', visibleTo: BUYER_ONLY, route: '/compare' },
  { id: 'buyer.saved-spotlight', label: 'Saved Items', visibleTo: BUYER_ONLY, dashboardTab: 'saved-items' },
  { id: 'buyer.following', label: 'Following', visibleTo: BUYER_ONLY, dashboardTab: 'following' },
  { id: 'buyer.messages', label: 'Messages', visibleTo: [...BUYER_ONLY, ...SELLER, ...CREATOR], route: '/messages' },
  { id: 'buyer.reviews', label: 'My Reviews', visibleTo: BUYER_ONLY, dashboardTab: 'my-reviews' },
  { id: 'buyer.browsing-history', label: 'Recently Viewed', visibleTo: BUYER_ONLY, dashboardTab: 'recently-viewed' },
  { id: 'seller.products', label: 'My Products', visibleTo: SELLER, dashboardTab: 'seller-products' },
  { id: 'seller.orders', label: 'Seller Orders', visibleTo: SELLER, dashboardTab: 'seller-orders' },
  { id: 'seller.spotlight-requests', label: 'Spotlight Requests', visibleTo: SELLER, dashboardTab: 'spotlight-requests' },
  { id: 'seller.performance', label: 'Performance', visibleTo: SELLER, dashboardTab: 'seller-performance' },
  { id: 'brand.marketing', label: 'Brand Marketing', visibleTo: BRAND_ADMIN, route: '/marketing' },
  { id: 'brand.spotlight-campaigns', label: 'Spotlight Publisher Studio', visibleTo: BRAND_ADMIN, route: '/marketing/studio', dashboardTab: 'brand-spotlight' },
  { id: 'brand.campaign-analytics', label: 'Spotlight Intelligence', visibleTo: BRAND_ADMIN, route: '/marketing/intelligence', dashboardTab: 'brand-analytics' },
  { id: 'creator.studio', label: 'Creator Studio', visibleTo: CREATOR, dashboardTab: 'creator-studio' },
  { id: 'creator.collaborations', label: 'Collaborations', visibleTo: CREATOR, dashboardTab: 'creator-collaborations' },
  { id: 'creator.spotlight', label: 'Creator Spotlight', visibleTo: CREATOR, dashboardTab: 'creator-spotlight' },
  { id: 'moderator.queues', label: 'Moderation Queues', visibleTo: MOD_ADMIN, dashboardTab: 'mod-queues' },
  { id: 'moderator.approvals', label: 'Approvals', visibleTo: MOD_ADMIN, dashboardTab: 'mod-approvals' },
  { id: 'admin.full-access', label: 'Full Platform Access', visibleTo: ADMIN },
  { id: 'admin.studio-edit', label: 'Website & Product CMS Studio', visibleTo: ADMIN },
  { id: 'admin.marketing', label: 'Marketing Administration', visibleTo: ADMIN, route: '/marketing/studio' },
  { id: 'marketing.campaign-manager', label: 'Publisher Studio', visibleTo: BRAND_ADMIN, route: '/marketing/studio' },
  { id: 'marketing.campaign-wizard', label: 'Create Spotlight Content', visibleTo: BRAND_ADMIN, route: '/marketing/studio/new' },
  { id: 'marketing.campaign-editor', label: 'Universal Publisher Editor', visibleTo: BRAND_ADMIN, route: '/marketing/studio/:id' },
  { id: 'marketing.analytics', label: 'Spotlight Intelligence', visibleTo: [...BRAND_ADMIN, ...MOD_ADMIN], route: '/marketing/intelligence' },
  { id: 'marketing.intelligence', label: 'Intelligence Dashboard', visibleTo: [...BRAND_ADMIN, ...MOD_ADMIN], route: '/marketing/intelligence' },
  { id: 'marketing.opportunity', label: 'Spotlight Opportunity Center', visibleTo: BRAND_ADMIN, route: '/marketing/opportunity', dashboardTab: 'brand-opportunity' },
  { id: 'marketing.website-cms', label: 'Website CMS Studio', visibleTo: ADMIN },
];

export function isFeatureVisible(featureId: FeatureId, role: PlatformRole): boolean {
  if (role === 'admin') return true;
  const feature = FEATURE_VISIBILITY.find((f) => f.id === featureId);
  if (!feature) return false;
  return feature.visibleTo.includes(role);
}

export function featuresForRole(role: PlatformRole): FeatureVisibility[] {
  if (role === 'admin') return FEATURE_VISIBILITY;
  return FEATURE_VISIBILITY.filter((f) => f.visibleTo.includes(role));
}
