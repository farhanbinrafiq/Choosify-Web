import type { SiteConfig, SiteContentBadge } from '../types/catalog';
import type { BrandPost, BrandPostKind } from '../types/brandPost';
import { BRAND_POST_KIND_LABELS } from '../types/brandPost';

const DEFAULT_EVENT_BADGES: SiteContentBadge[] = [
  { id: 'event', label: 'Event', color: '#E8500A', entityType: 'event', mapsTo: 'event', priority: 1, isActive: true },
  { id: 'announcement', label: 'Announcement', color: '#1A1D4E', entityType: 'event', mapsTo: 'announcement', priority: 2, isActive: true },
  { id: 'festival', label: 'Festival', color: '#CF4400', entityType: 'event', mapsTo: 'festival', priority: 3, isActive: true },
  { id: 'carnival', label: 'Carnival', color: '#FF5B00', entityType: 'event', mapsTo: 'carnival', priority: 4, isActive: true },
  { id: 'launch', label: 'Product Launch', color: '#1A1D4E', entityType: 'event', mapsTo: 'launch', priority: 5, isActive: true },
  { id: 'campaign', label: 'Brand Promotion', color: '#8a9bb0', entityType: 'event', mapsTo: 'campaign', priority: 6, isActive: true },
  { id: 'store_moment', label: 'Store Moment', color: '#1A1D4E', entityType: 'event', mapsTo: 'store_moment', priority: 7, isActive: true },
  { id: 'sponsored', label: 'Sponsored', color: '#E8500A', entityType: 'event', mapsTo: 'sponsored', priority: 0, isActive: true },
];

function getConfiguredEventBadges(siteConfig: SiteConfig | null): SiteContentBadge[] {
  const cms = (siteConfig?.contentBadges ?? []).filter(
    (badge) => badge.isActive && badge.entityType === 'event',
  );
  return cms.length > 0 ? cms : DEFAULT_EVENT_BADGES;
}

export function resolveEventKindBadge(
  kind: BrandPostKind,
  siteConfig: SiteConfig | null,
): SiteContentBadge | null {
  const badges = getConfiguredEventBadges(siteConfig);
  const match =
    badges.find((badge) => badge.mapsTo === kind) ??
    badges.find((badge) => badge.label === BRAND_POST_KIND_LABELS[kind]);

  if (match) return match;

  return {
    id: `fallback-${kind}`,
    label: BRAND_POST_KIND_LABELS[kind] ?? kind,
    color: '#1A1D4E',
    entityType: 'event',
    mapsTo: kind,
    priority: 99,
    isActive: true,
  };
}

export function resolveSponsoredBadge(siteConfig: SiteConfig | null): SiteContentBadge | null {
  const badges = getConfiguredEventBadges(siteConfig);
  return badges.find((badge) => badge.mapsTo === 'sponsored') ?? DEFAULT_EVENT_BADGES.find((b) => b.mapsTo === 'sponsored') ?? null;
}

export function resolveEventBadges(
  post: BrandPost,
  siteConfig: SiteConfig | null,
  limit = 2,
): SiteContentBadge[] {
  const results: SiteContentBadge[] = [];

  if (post.sponsored) {
    const sponsored = resolveSponsoredBadge(siteConfig);
    if (sponsored) results.push(sponsored);
  }

  const kindBadge = resolveEventKindBadge(post.kind, siteConfig);
  if (kindBadge && !results.some((b) => b.id === kindBadge.id)) {
    results.push(kindBadge);
  }

  return results.slice(0, limit);
}
