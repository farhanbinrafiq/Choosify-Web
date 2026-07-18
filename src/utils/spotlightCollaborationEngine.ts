import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type {
  SpotlightCampaignCollaborationGraph,
  SpotlightCampaignContribution,
} from '../types/spotlight/collaboration/campaign';
import type { SpotlightCollaborationMember } from '../types/spotlight/collaboration/engine';
import { COLLABORATION_ROLE_PERMISSIONS } from '../types/spotlight/collaboration/engine';
import type { SpotlightBrandCreatorCollaboration } from '../types/spotlight/collaboration/engine';
import { publisherFromCampaign } from './spotlightPublisherResolver';
import type { CatalogProduct } from '../types/catalog';

/** Build campaign collaboration graph from campaign + linked creators */
export function buildCampaignCollaborationGraph(
  campaign: SpotlightCampaignRecord,
  catalog: CatalogProduct[],
  brandLogos: Record<string, string>,
): SpotlightCampaignCollaborationGraph {
  const owner = publisherFromCampaign(campaign, brandLogos, catalog);
  const contributions: SpotlightCampaignContribution[] = [
    {
      contributionId: `contrib-owner-${campaign.campaignId}`,
      campaignId: campaign.campaignId,
      publisherId: owner.publisherId,
      publisherName: owner.name,
      publisherLogoUrl: owner.logoUrl,
      role: 'publisher',
      contributionType: 'campaign_owner',
      isVerified: owner.isVerified,
      headline: campaign.headline,
      productIds: campaign.linkedProductIds,
      serviceIds: [],
      sortOrder: 0,
      createdAt: campaign.createdAt,
    },
  ];

  (campaign.linkedCreatorIds ?? []).forEach((creatorId, idx) => {
    contributions.push({
      contributionId: `contrib-creator-${creatorId}-${campaign.campaignId}`,
      campaignId: campaign.campaignId,
      publisherId: `creator-${creatorId}`,
      publisherName: 'Creator',
      role: 'creator',
      contributionType: campaign.campaignType === 'creator_review' ? 'creator_review' : 'creator_tutorial',
      isVerified: true,
      productIds: campaign.linkedProductIds.slice(0, 2),
      serviceIds: [],
      sortOrder: idx + 1,
      createdAt: campaign.createdAt,
    });
  });

  campaign.linkedBrandIds.forEach((brandId, idx) => {
    if (brandId === campaign.linkedBrandIds[0]) return;
    contributions.push({
      contributionId: `contrib-brand-${brandId}-${campaign.campaignId}`,
      campaignId: campaign.campaignId,
      publisherId: `brand-${brandId}`,
      publisherName: campaign.brandName ?? 'Brand Partner',
      role: 'brand',
      contributionType: 'brand_partner',
      isVerified: true,
      productIds: [],
      serviceIds: [],
      sortOrder: 10 + idx,
      createdAt: campaign.createdAt,
    });
  });

  return {
    campaignId: campaign.campaignId,
    ownerPublisherId: owner.publisherId,
    brandPublisherIds: campaign.linkedBrandIds.map((id) => `brand-${id}`),
    creatorPublisherIds: (campaign.linkedCreatorIds ?? []).map((id) => `creator-${id}`),
    sellerPublisherIds: campaign.sellerId ? [`seller-${campaign.sellerId}`] : [],
    partnerPublisherIds: [],
    contributions,
  };
}

export function contributionsToMembers(
  contributions: SpotlightCampaignContribution[],
): SpotlightCollaborationMember[] {
  return contributions.map((c) => ({
    publisherId: c.publisherId,
    name: c.publisherName,
    logoUrl: c.publisherLogoUrl,
    role: c.role,
    isVerified: c.isVerified,
    permissions: COLLABORATION_ROLE_PERMISSIONS[c.role],
    contributionTypes: [c.contributionType],
    profileHref: `/publisher/${c.publisherId.replace(/^(brand|creator|seller)-/, '')}`,
    joinedAt: c.createdAt,
  }));
}

/** Samsung × Creator A/B/C collaboration hub (CTO demo architecture) */
export function buildBrandCreatorCollaborationDemo(
  campaign: SpotlightCampaignRecord,
  creatorIds: string[],
): SpotlightBrandCreatorCollaboration {
  const owner = campaign.brandName ?? campaign.campaignName;
  return {
    collaborationId: `collab-${campaign.campaignId}`,
    brandPublisherId: `brand-${campaign.linkedBrandIds[0] ?? 'samsung'}`,
    campaignId: campaign.campaignId,
    campaignName: campaign.campaignName,
    invitedCreators: creatorIds.map((id, i) => ({
      creatorPublisherId: `creator-${id}`,
      creatorName: `Creator ${String.fromCharCode(65 + i)}`,
      role: 'creator',
      contributionType: ['creator_review', 'creator_tutorial', 'creator_live'][i % 3]!,
      status: i === 0 ? 'accepted' : 'pending',
      contentId: i === 0 ? `guide-creator-${id}` : undefined,
    })),
    status: 'active',
    createdAt: campaign.createdAt,
  };
}
