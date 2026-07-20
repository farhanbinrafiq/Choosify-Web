import type { PlatformRole } from './roles';

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  group: 'platform' | 'account' | 'workspace';
  roles: PlatformRole[];
}

export const DASHBOARD_NAV_REGISTRY: DashboardNavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', group: 'platform', roles: ['buyer', 'seller', 'brand', 'creator', 'moderator', 'admin'] },
  { id: 'saved-products', label: 'Saved Products', icon: 'Heart', group: 'platform', roles: ['buyer'] },
  { id: 'saved-brands', label: 'Saved Brands', icon: 'Store', group: 'platform', roles: ['buyer'] },
  { id: 'loved-brands', label: 'Loved Brands', icon: 'Heart', group: 'platform', roles: ['buyer'] },
  { id: 'followed-brands', label: 'Following', icon: 'CheckCircle2', group: 'platform', roles: ['buyer'] },
  { id: 'recently-viewed', label: 'Recently Viewed', icon: 'Clock', group: 'platform', roles: ['buyer'] },
  { id: 'saved-recommendations', label: 'Saved Contents', icon: 'Bookmark', group: 'platform', roles: ['buyer'] },
  { id: 'orders', label: 'Orders', icon: 'ShoppingBag', group: 'platform', roles: ['buyer'] },
  { id: 'seller-products', label: 'My Products', icon: 'Package', group: 'workspace', roles: ['seller'] },
  { id: 'seller-orders', label: 'Orders', icon: 'ShoppingBag', group: 'workspace', roles: ['seller'] },
  { id: 'spotlight-requests', label: 'Spotlight Requests', icon: 'Send', group: 'workspace', roles: ['seller'] },
  { id: 'seller-performance', label: 'Performance', icon: 'TrendingUp', group: 'workspace', roles: ['seller'] },
  { id: 'brand-spotlight', label: 'Spotlight Publisher Studio', icon: 'Megaphone', group: 'workspace', roles: ['brand', 'admin'], href: '/marketing/studio' },
  { id: 'brand-opportunity', label: 'Opportunity Center', icon: 'Lightbulb', group: 'workspace', roles: ['brand', 'admin'], href: '/marketing/opportunity' },
  { id: 'brand-analytics', label: 'Spotlight Intelligence', icon: 'BarChart3', group: 'workspace', roles: ['brand', 'admin'], href: '/marketing/intelligence' },
  { id: 'creator-studio', label: 'Creator Studio', icon: 'Sparkles', group: 'workspace', roles: ['creator'] },
  { id: 'creator-collaborations', label: 'Collaborations', icon: 'Users', group: 'workspace', roles: ['creator'] },
  { id: 'creator-spotlight', label: 'Creator Spotlight', icon: 'Flame', group: 'workspace', roles: ['creator'] },
  { id: 'mod-queues', label: 'Moderation Queues', icon: 'ShieldCheck', group: 'workspace', roles: ['moderator', 'admin'] },
  { id: 'mod-approvals', label: 'Approvals', icon: 'CheckCircle2', group: 'workspace', roles: ['moderator', 'admin'] },
  { id: 'admin-marketing', label: 'Marketing Admin', icon: 'Megaphone', group: 'workspace', roles: ['admin'], href: '/marketing/studio' },
  { id: 'messages', label: 'Messages', icon: 'MessageSquare', group: 'account', roles: ['buyer', 'seller', 'brand', 'creator', 'moderator', 'admin'] },
  { id: 'my-reviews', label: 'My Reviews', icon: 'Star', group: 'account', roles: ['buyer'] },
  { id: 'addresses', label: 'Addresses', icon: 'MapPin', group: 'account', roles: ['buyer', 'seller', 'brand', 'creator', 'moderator', 'admin'] },
  { id: 'settings', label: 'Profile Settings', icon: 'Settings', group: 'account', roles: ['buyer', 'seller', 'brand', 'creator', 'moderator', 'admin'] },
];

export function getDashboardNavForRole(role: PlatformRole): {
  platform: DashboardNavItem[];
  workspace: DashboardNavItem[];
  account: DashboardNavItem[];
} {
  const allowed = role === 'admin'
    ? DASHBOARD_NAV_REGISTRY
    : DASHBOARD_NAV_REGISTRY.filter((item) => item.roles.includes(role));

  return {
    platform: allowed.filter((i) => i.group === 'platform'),
    workspace: allowed.filter((i) => i.group === 'workspace'),
    account: allowed.filter((i) => i.group === 'account'),
  };
}

export function isDashboardTabAllowed(tabId: string, role: PlatformRole): boolean {
  if (role === 'admin') return true;
  const item = DASHBOARD_NAV_REGISTRY.find((i) => i.id === tabId);
  if (!item) return tabId === 'overview';
  return item.roles.includes(role);
}
