import type { SiteConfig, SiteProductBadge } from '../types/catalog';

function productBadgeLabels(product: Record<string, unknown>): string[] {
  const labels: string[] = [];
  if (product.isNewArrival) labels.push('New');
  if (product.isBestseller) labels.push('Trending');
  if (product.featuredFlag) labels.push('Featured');
  if (product.isDeal || product.dealType) labels.push('Flash Sale');
  if (product.verifiedStatus || product.verified) labels.push('Verified');
  return labels;
}

export function resolveProductBadges(
  product: Record<string, unknown>,
  siteConfig: SiteConfig | null,
  limit = 2,
): SiteProductBadge[] {
  const configured = (siteConfig?.productBadges ?? []).filter((badge) => badge.isActive);
  if (!configured.length) return [];

  const labels = productBadgeLabels(product);
  return configured
    .filter((badge) => labels.includes(badge.label))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
}
