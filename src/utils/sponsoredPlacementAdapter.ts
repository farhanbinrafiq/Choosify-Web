import type { ResolvedPlacement } from './resolvePlacementContent';
import type {
  SponsoredPlacementItem,
  SponsoredPlacementKind,
} from '../types/commerce/sponsoredPlacement';
import type { UniversalCommerceCardModel } from '../components/content/universalCommerceCardTypes';
import type { ContentCardLayoutVariant } from '../components/content/universalContentCardTypes';

const ENTITY_TO_KIND: Partial<Record<ResolvedPlacement['entityType'], SponsoredPlacementKind>> = {
  product: 'product',
  brand: 'brand',
  deal: 'deal',
  guide: 'guide',
  creator: 'creator_review',
};

const KIND_LAYOUT: Partial<Record<SponsoredPlacementKind, ContentCardLayoutVariant>> = {
  spotlight: 'landscape',
  guide: 'blog',
  collection: 'square',
  creator_review: 'landscape',
  launch: 'landscape',
  event: 'blog',
  service: 'blog',
};

export function resolvedPlacementToSponsoredItem(
  placement: ResolvedPlacement,
  sponsorName?: string,
): SponsoredPlacementItem {
  const kind = ENTITY_TO_KIND[placement.entityType] ?? 'spotlight';
  const sponsor = sponsorName ?? placement.subtitle ?? 'Choosify Partner';

  return {
    id: placement.id,
    kind,
    sponsorName: sponsor,
    sponsorLogoUrl: placement.image,
    isVerified: true,
    sponsoredLabel: sponsorName ? `Sponsored by ${sponsorName}` : 'Sponsored',
    href: placement.href,
    ctaLabel: placement.ctaLabel,
    isExternal: placement.isExternal,
    title: placement.title,
    subtitle: placement.subtitle,
    image: placement.image,
    productId: placement.entityType === 'product' ? placement.placementId : undefined,
    brandId: placement.entityType === 'brand' ? placement.placementId : undefined,
    guideId: placement.entityType === 'guide' ? placement.placementId : undefined,
    creatorId: placement.entityType === 'creator' ? placement.placementId : undefined,
  };
}

export function sponsoredItemsFromResolved(
  placements: ResolvedPlacement[],
): SponsoredPlacementItem[] {
  return placements.map((p) => resolvedPlacementToSponsoredItem(p, p.subtitle));
}

/** Build UniversalCommerceCard model from sponsored placement demo/CMS data */
export function sponsoredItemToCommerceCardModel(
  item: SponsoredPlacementItem,
): UniversalCommerceCardModel {
  const layoutVariant = KIND_LAYOUT[item.kind] ?? 'blog';

  return {
    id: item.id,
    href: item.href,
    title: item.title ?? item.sponsorName,
    excerpt: item.subtitle,
    layoutVariant,
    aspectRatio: '16/10',
    image: item.image,
    badgeLabel: item.kind.replace('_', ' ').toUpperCase(),
    platform: 'blog',
    platformLabel: 'Spotlight',
    brandName: item.sponsorName,
    isSponsored: true,
    isVerified: item.isVerified,
    ctaLabel: item.ctaLabel,
    primaryCta: { label: item.ctaLabel, href: item.href },
  };
}
