import type { CatalogProduct } from '../types/catalog';
import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type { SpotlightCampaignType } from '../types/spotlight/campaignTypes';
import type { SpotlightPublisher } from '../types/spotlight/experience/publisher';
import type { SpotlightPublisherType } from '../types/spotlight/experience/publisher';

export function publisherFromBrand(
  brandId: string,
  brandName: string,
  logoUrl?: string,
  verified = true,
): SpotlightPublisher {
  return {
    publisherId: `brand-${brandId}`,
    name: brandName,
    logoUrl,
    publisherType: 'brand',
    isVerified: verified,
    badges: verified ? ['Verified Brand'] : [],
    trustScore: verified ? 85 : 60,
    profileHref: `/brands/${brandId}`,
  };
}

export function publisherFromCreator(
  creatorId: string,
  name: string,
  avatar?: string,
  score = 80,
): SpotlightPublisher {
  return {
    publisherId: `creator-${creatorId}`,
    name,
    logoUrl: avatar,
    publisherType: 'creator',
    isVerified: score >= 75,
    badges: score >= 90 ? ['Top Creator'] : ['Creator'],
    reputation: score,
    profileHref: `/creators/${creatorId}`,
  };
}

export function publisherFromEditorial(name = 'Choosify Editorial'): SpotlightPublisher {
  return {
    publisherId: 'editorial-choosify',
    name,
    publisherType: 'editorial_team',
    isVerified: true,
    badges: ['Editorial'],
    trustScore: 95,
  };
}

export function publisherFromCampaign(
  campaign: SpotlightCampaignRecord,
  brandLogos: Record<string, string>,
  catalog: CatalogProduct[],
): SpotlightPublisher {
  const brandName = campaign.brandName;
  const primaryId = campaign.primaryProductId ?? campaign.linkedProductIds[0];
  const product = primaryId ? catalog.find((p) => p.id === primaryId) : undefined;
  const name = brandName ?? product?.brandName ?? campaign.sellerName ?? 'Choosify Partner';
  const brandId = campaign.linkedBrandIds[0] ?? product?.brandId ?? name;
  const logo = brandLogos[name] ?? brandLogos[product?.brandName ?? ''];

  if (campaign.campaignType === 'creator_review' || campaign.campaignType === 'creator_campaign') {
    const creatorId = campaign.linkedCreatorIds?.[0] ?? 'unknown';
    return publisherFromCreator(creatorId, name, logo, campaign.campaignHealthScore ?? 80);
  }

  return publisherFromBrand(String(brandId), name, logo, true);
}

export function inferPublisherTypeFromCampaignType(type: SpotlightCampaignType): SpotlightPublisherType {
  if (['creator_review', 'creator_campaign', 'livestream'].includes(type)) return 'creator';
  if (type === 'editors_pick') return 'editorial_team';
  return 'brand';
}
