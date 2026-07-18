import type { CatalogBrand } from '../types/catalog';
import type { Creator } from '../data/creators';
import type { SpotlightPublisherProfile } from '../types/spotlight/publisher/profile';
import type { SpotlightPublisherTrustProfile } from '../types/spotlight/publisher/trust';
import type { SpotlightTrustBadge } from '../types/spotlight/publisher/trust';
import { buildDefaultReputation } from '../types/spotlight/publisher/reputation';
import { slugifyCampaignName } from '../services/spotlightCampaignStorage';

const BRAND_COVERS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1600&q=80',
};

export function slugifyPublisher(name: string): string {
  return slugifyCampaignName(name);
}

export function brandToPublisherProfile(brand: CatalogBrand): SpotlightPublisherProfile {
  const slug = brand.slug || slugifyPublisher(brand.name);
  const reputation = buildDefaultReputation(brand.id, 'brand', brand.verifiedStatus ? 82 : 68);
  return {
    publisherId: `brand-${brand.id}`,
    slug,
    name: brand.name,
    publisherType: 'brand',
    logoUrl: brand.logo,
    coverUrl: BRAND_COVERS[brand.name],
    description: brand.description,
    isVerified: brand.verifiedStatus,
    officialWebsite: undefined,
    socialLinks: [],
    badges: brand.verifiedStatus ? ['Official Brand', 'Verified'] : [],
    trustScore: reputation.score,
    reputation: reputation.score,
    stats: {
      campaignCount: brand.featuredFlag ? 3 : 1,
      liveCount: 0,
      reviewCount: Math.floor(brand.ratings * 10),
      contentCount: brand.featuredFlag ? 12 : 4,
      collaborationCount: brand.sponsoredFlag ? 2 : 0,
      productCount: 0,
    },
    followers: brand.followers,
    sourceKind: 'brand',
    sourceId: brand.id,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  };
}

export function creatorToPublisherProfile(creator: Creator): SpotlightPublisherProfile {
  const slug = slugifyPublisher(creator.handle || creator.name);
  const reputation = buildDefaultReputation(String(creator.id), 'creator', creator.score);
  return {
    publisherId: `creator-${creator.id}`,
    slug,
    name: creator.name,
    publisherType: creator.score >= 85 ? 'influencer' : 'creator',
    logoUrl: creator.avatar,
    coverUrl: creator.avatar,
    description: creator.bio,
    isVerified: creator.score >= 75,
    socialLinks: (creator.platforms ?? []).map((p) => ({
      platform: p.toLowerCase().includes('youtube')
        ? 'youtube' as const
        : p.toLowerCase().includes('instagram')
          ? 'instagram' as const
          : p.toLowerCase().includes('facebook')
            ? 'facebook' as const
            : 'website' as const,
      url: '#',
      label: p,
    })),
    badges: creator.score >= 90 ? ['Official Creator', 'Top Creator'] : ['Creator'],
    trustScore: reputation.score,
    reputation: reputation.score,
    stats: {
      campaignCount: 0,
      liveCount: creator.reels?.length ? 1 : 0,
      reviewCount: creator.videos?.length ?? 0,
      contentCount: (creator.videos?.length ?? 0) + (creator.blogs?.length ?? 0) + (creator.reels?.length ?? 0),
      collaborationCount: 0,
      productCount: 0,
    },
    followers: undefined,
    sourceKind: 'creator',
    sourceId: String(creator.id),
  };
}

export function buildPublisherTrustProfile(profile: SpotlightPublisherProfile): SpotlightPublisherTrustProfile {
  const badges: SpotlightTrustBadge[] = [];
  if (profile.publisherType === 'brand' && profile.isVerified) {
    badges.push({ type: 'official_brand', label: 'Official Brand' });
    badges.push({ type: 'verified_business', label: 'Verified Business' });
  }
  if (profile.publisherType === 'creator' || profile.publisherType === 'influencer') {
    if (profile.isVerified) badges.push({ type: 'official_creator', label: 'Official Creator' });
    badges.push({ type: 'verified_creator', label: 'Verified Creator' });
  }
  if (profile.isVerified) badges.push({ type: 'official_publisher', label: 'Official Publisher' });

  return {
    publisherId: profile.publisherId,
    badges,
    es009TrustScore: profile.trustScore,
    moderationStatus: 'clear',
  };
}

export function findPublisherBySlug(
  slug: string,
  brands: CatalogBrand[],
  creators: Creator[],
): SpotlightPublisherProfile | undefined {
  const brand = brands.find((b) => (b.slug || slugifyPublisher(b.name)) === slug);
  if (brand) return brandToPublisherProfile(brand);
  const creator = creators.find(
    (c) => slugifyPublisher(c.handle || c.name) === slug || String(c.id) === slug,
  );
  if (creator) return creatorToPublisherProfile(creator);
  return undefined;
}
