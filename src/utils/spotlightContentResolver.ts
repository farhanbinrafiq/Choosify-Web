import type { CatalogProduct } from '../types/catalog';
import type { CatalogGuide } from '../types/catalog';
import type { BrandPost } from '../types/brandPost';
import type { Creator } from '../data/creators';
import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type { SpotlightCampaignType } from '../types/spotlight/campaignTypes';
import type { HomepageSpotlightCardModel } from '../types/spotlight/homepage';
import type {
  SpotlightContent,
} from '../types/spotlight/experience/content';
import type { SpotlightContentType } from '../types/spotlight/experience/contentTypes';
import type { SpotlightContentConnections } from '../types/spotlight/experience/connections';
import { EMPTY_SPOTLIGHT_CONNECTIONS } from '../types/spotlight/experience/connections';
import { EMPTY_SPOTLIGHT_GRAPH } from '../types/spotlight/experience/contentGraph';
import { EMPTY_SPOTLIGHT_COMMERCE } from '../types/spotlight/experience/commerceOverlay';
import { getSpotlightContentCtaLabel } from '../types/spotlight/experience/cta';
import type { SpotlightLiveConfig } from '../types/spotlight/experience/live';
import { enrichContentWithDiscoveryScore } from './spotlightDiscoveryScore';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';
import { creatorReviewHref, resolveContentHref } from '../lib/platform/contentRegistry';
import { spotlightContentHref } from '../lib/spotlight/content';
import {
  buildHomepageSpotlightCard,
  listHomepageSpotlightCampaigns,
} from './spotlightHomepage';
import {
  publisherFromBrand,
  publisherFromCreator,
  publisherFromEditorial,
  publisherFromCampaign,
} from './spotlightPublisherResolver';
import { slugifyPublisher } from './spotlightPublisherProfile';
import { buildCampaignCollaborationGraph, contributionsToMembers } from './spotlightCollaborationEngine';
import { enrichCommerceOverlay } from '../types/spotlight/commerce/overlay';
import { brandPostToUniversalMedia, detectEmbedPlatform, guideToUniversalMedia, toEmbedUrl } from './spotlightMediaAdapters';
import {
  buildDemoSpotlightFeed,
  getDemoSpotlightContentBySlug,
} from '../data/spotlight/spotlightDemoFeedFactory';
import type { SpotlightCollaborator } from '../types/spotlight/experience/collaboration';
import type { SpotlightCollaborationRole } from '../types/spotlight/collaboration/engine';
import type { SpotlightCollaboratorRole } from '../types/spotlight/experience/collaboration';
import type { SpotlightCollaborationMember } from '../types/spotlight/collaboration/engine';

const COLLAB_ROLE_MAP: Partial<Record<SpotlightCollaborationRole, SpotlightCollaboratorRole>> = {
  brand: 'collaborating_brand',
  creator: 'creator',
  official_partner: 'official_distributor',
  distributor: 'official_distributor',
  editor: 'marketplace_editor',
  sponsor: 'sponsor',
};

function toExperienceCollaborators(
  members: SpotlightCollaborationMember[],
  ownerId: string,
): SpotlightCollaborator[] {
  return members
    .filter((m) => m.publisherId !== ownerId)
    .map((m) => ({
      publisherId: m.publisherId,
      role: COLLAB_ROLE_MAP[m.role] ?? 'creator',
      name: m.name,
      logoUrl: m.logoUrl,
      isVerified: m.isVerified,
      profileHref: m.profileHref,
    }));
}

const CAMPAIGN_TYPE_TO_CONTENT: Partial<Record<SpotlightCampaignType, SpotlightContentType>> = {
  single_product: 'campaign',
  multi_product: 'campaign',
  brand_campaign: 'campaign',
  category_campaign: 'campaign',
  promotion: 'promotion',
  discount: 'promotion',
  new_launch: 'new_launch',
  brand_story: 'brand_story',
  announcement: 'announcement',
  festival_campaign: 'event',
  seasonal_campaign: 'event',
  buying_guide: 'buying_guide',
  editors_pick: 'recommendation',
  creator_review: 'creator_review',
  creator_campaign: 'creator_review',
  livestream: 'live',
};

function mapGuideTypeToContent(guide: CatalogGuide): SpotlightContentType {
  const cat = (guide.category ?? '').toLowerCase();
  const tags = (guide.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes('comparison')) || cat.includes('comparison')) return 'comparison';
  if (tags.some((t) => t.includes('tutorial')) || cat.includes('tutorial')) return 'tutorial';
  if (tags.some((t) => t.includes('tip')) || cat.includes('tip')) return 'tips';
  if (guide.type === 'reels' || guide.type === 'shorts') return 'recommendation';
  if (guide.type === 'video') {
    if (tags.some((t) => t.includes('review'))) return 'product_review';
    return 'product_review';
  }
  if (guide.type === 'article') {
    if (cat.includes('buying') || tags.some((t) => t.includes('buying'))) return 'buying_guide';
    return 'editorial';
  }
  if (cat.includes('buying') || tags.some((t) => t.includes('buying'))) return 'buying_guide';
  return 'editorial';
}

function mapBrandPostKind(post: BrandPost): SpotlightContentType {
  if (post.kind === 'event' || post.kind === 'festival' || post.kind === 'carnival') return 'event';
  if (post.kind === 'announcement') return 'announcement';
  if (post.kind === 'launch') return 'new_launch';
  if (post.kind === 'campaign') return 'promotion';
  return 'whats_on';
}

function buildConnections(partial: Partial<SpotlightContentConnections>): SpotlightContentConnections {
  return { ...EMPTY_SPOTLIGHT_CONNECTIONS, ...partial };
}

function buildLiveFromGuide(guide: CatalogGuide): SpotlightLiveConfig | undefined {
  if (!guide.videoUrl) return undefined;
  const platform = detectEmbedPlatform(guide.videoUrl);
  if (!platform) return undefined;
  const productIds = (guide.productIds ?? []).map(String);
  return {
    status: 'replay',
    platform,
    embedUrl: toEmbedUrl(guide.videoUrl, platform),
    replayUrl: guide.videoUrl,
    productIds,
    serviceIds: [],
    pinnedProductIds: productIds.slice(0, 3),
    pinnedOfferIds: [],
    timelinePlaceholder: true,
  };
}

export function campaignToSpotlightContent(
  campaign: SpotlightCampaignRecord,
  catalog: CatalogProduct[],
  brandLogos: Record<string, string>,
): SpotlightContent {
  const card = buildHomepageSpotlightCard(campaign, catalog, brandLogos);
  const contentType = CAMPAIGN_TYPE_TO_CONTENT[campaign.campaignType] ?? 'campaign';
  const linkedProductIds = campaign.linkedProductIds ?? [];
  const linkedBrandIds = campaign.linkedBrandIds ?? [];
  const linkedCategoryIds = campaign.linkedCategoryIds ?? [];
  const primaryId = campaign.primaryProductId ?? linkedProductIds[0];
  const product = primaryId ? catalog.find((p) => p.id === primaryId) : undefined;
  const collabGraph = buildCampaignCollaborationGraph(campaign, catalog, brandLogos);
  const members = contributionsToMembers(collabGraph.contributions);
  const ownerPublisher = publisherFromCampaign(campaign, brandLogos, catalog);
  ownerPublisher.profileHref = `/publisher/${slugifyPublisher(campaign.brandName ?? ownerPublisher.name)}`;

  const live: SpotlightLiveConfig | undefined =
    campaign.campaignType === 'livestream'
      ? {
          status: 'upcoming',
          platform: 'youtube',
          productIds: linkedProductIds,
          serviceIds: [],
          pinnedProductIds: linkedProductIds.slice(0, 3),
          pinnedOfferIds: [],
          notifyMeEnabled: true,
          timelinePlaceholder: true,
        }
      : undefined;

  return {
    contentId: `campaign-${campaign.campaignId}`,
    slug: campaign.campaignSlug,
    contentType,
    sourceKind: 'campaign',
    sourceId: campaign.campaignId,
    publisher: ownerPublisher,
    collaborators: toExperienceCollaborators(members, ownerPublisher.publisherId),
    headline: campaign.headline,
    description: campaign.shortDescription,
    media: card.media,
    connections: buildConnections({
      productIds: linkedProductIds,
      brandIds: linkedBrandIds,
      categoryIds: linkedCategoryIds,
      creatorIds: campaign.linkedCreatorIds ?? [],
      guideIds: campaign.linkedGuideIds ?? [],
      campaignIds: [campaign.campaignId],
      spotlightContentIds: campaign.relationships?.relatedCampaignIds ?? [],
    }),
    graph: {
      ...EMPTY_SPOTLIGHT_GRAPH,
      relatedCampaignIds: campaign.relationships?.relatedCampaignIds ?? [],
      relatedProductIds: linkedProductIds,
      relatedBrandIds: linkedBrandIds,
      relatedGuideIds: campaign.linkedGuideIds ?? [],
      relatedCreatorIds: campaign.linkedCreatorIds ?? [],
    },
    commerce: enrichCommerceOverlay({
      ...EMPTY_SPOTLIGHT_COMMERCE,
      featuredProductIds: linkedProductIds,
      bundleIds: campaign.merchandising?.bundles?.map((b) => b.bundleId) ?? [],
      primaryCta: campaign.cta
        ? { label: campaign.cta.label, href: campaign.cta.url ?? `/spotlight/${campaign.campaignSlug}` }
        : undefined,
      pinnedProductIds: primaryId ? [primaryId] : [],
    }),
    live,
    badges: card.badges,
    isSponsored: campaign.isSponsored,
    isLive: campaign.campaignType === 'livestream',
    isVerified: true,
    ctaLabel: campaign.campaignType === 'livestream' ? 'Watch Live' : (card.ctaLabel || getSpotlightContentCtaLabel(contentType)),
    href: spotlightContentHref(campaign.campaignSlug),
    publishedAt: campaign.createdAt,
    endsAt: campaign.schedule?.endAt,
    popularityScore: campaign.campaignHealthScore ?? campaign.priority,
    aiScore: campaign.aiMetadata?.optimizationScore,
    extraProductCount: card.extraProductCount,
    seasonalTheme: card.seasonalTheme,
  };
}

export function guideToSpotlightContent(guide: CatalogGuide, catalog: CatalogProduct[]): SpotlightContent {
  const contentType = mapGuideTypeToContent(guide);
  const publisher = guide.creatorId
    ? publisherFromCreator(guide.creatorId, guide.author, guide.authorAvatar, 85)
    : publisherFromEditorial(guide.author);

  const productIds = (guide.productIds ?? []).map(String);
  const products = productIds
    .map((id) => catalog.find((p) => p.id === String(id) || p.id === id))
    .filter(Boolean) as CatalogProduct[];

  const slug = guide.slug || guide.id;
  const href = resolveContentHref(contentType, String(slug));
  const viewsRaw = String(guide.views ?? '0');

  return {
    contentId: `guide-${guide.id}`,
    slug: guide.slug || guide.id,
    contentType,
    sourceKind: 'guide',
    sourceId: guide.id,
    publisher,
    headline: guide.title ?? '',
    description: guide.excerpt ?? '',
    media: guideToUniversalMedia(guide),
    connections: buildConnections({
      productIds,
      guideIds: [guide.id],
      creatorIds: guide.creatorId ? [guide.creatorId] : [],
      recommendationIds: contentType === 'recommendation' ? [guide.id] : [],
    }),
    graph: {
      ...EMPTY_SPOTLIGHT_GRAPH,
      relatedGuideIds: [guide.id],
      relatedProductIds: productIds,
      relatedCreatorIds: guide.creatorId ? [guide.creatorId] : [],
    },
    commerce: {
      ...EMPTY_SPOTLIGHT_COMMERCE,
      featuredProductIds: productIds,
      primaryCta: { label: getSpotlightContentCtaLabel(contentType), href },
    },
    live: buildLiveFromGuide(guide),
    badges: [contentType.replace('_', ' ')],
    isSponsored: false,
    isLive: false,
    isVerified: publisher.isVerified,
    ctaLabel: getSpotlightContentCtaLabel(contentType),
    href,
    publishedAt: guide.publishedAt,
    popularityScore: Number.parseInt(viewsRaw.replace(/\D/g, ''), 10) || 0,
    extraProductCount: Math.max(0, products.length - 1),
  };
}

export function brandPostToSpotlightContent(post: BrandPost): SpotlightContent {
  const contentType = mapBrandPostKind(post);
  return {
    contentId: `brand-post-${post.id}`,
    slug: post.slug,
    contentType,
    sourceKind: 'brand_post',
    sourceId: post.id,
    publisher: publisherFromBrand(String(post.brandId), post.brandName, post.brandLogo, true),
    headline: post.title,
    description: post.excerpt,
    media: brandPostToUniversalMedia(post),
    connections: buildConnections({
      productIds: (post.linkedProductIds ?? []).map(String),
      brandIds: [String(post.brandId)],
      eventIds: contentType === 'event' ? [post.id] : [],
    }),
    graph: {
      ...EMPTY_SPOTLIGHT_GRAPH,
      relatedBrandIds: [String(post.brandId)],
      relatedProductIds: (post.linkedProductIds ?? []).map(String),
    },
    commerce: {
      ...EMPTY_SPOTLIGHT_COMMERCE,
      featuredProductIds: (post.linkedProductIds ?? []).map(String),
      primaryCta: post.ctaUrl
        ? { label: post.ctaLabel ?? getSpotlightContentCtaLabel(contentType), href: post.ctaUrl }
        : { label: getSpotlightContentCtaLabel(contentType), href: spotlightContentHref(post.slug) },
    },
    badges: [contentType.replace('_', ' ')],
    isSponsored: post.sponsored,
    isLive: post.status === 'live',
    isVerified: true,
    ctaLabel: post.ctaLabel ?? getSpotlightContentCtaLabel(contentType),
    href: spotlightContentHref(post.slug),
    publishedAt: post.publishedAt,
    endsAt: post.endDate,
    popularityScore: post.sponsored ? 80 : 50,
  };
}

export function creatorToSpotlightContent(creator: Creator): SpotlightContent {
  const latestVideo = creator.videos[0] ?? creator.reels[0];
  return {
    contentId: `creator-pick-${creator.id}`,
    slug: String(creator.id),
    contentType: 'creator_review',
    sourceKind: 'creator',
    sourceId: String(creator.id),
    publisher: publisherFromCreator(String(creator.id), creator.name, creator.avatar, creator.score),
    headline: latestVideo?.title ?? `${creator.name} — Creator Pick`,
    description: creator.bio,
    media: latestVideo
      ? {
          mediaId: `creator-media-${creator.id}`,
          mediaType: 'landscape_video',
          orientation: 'landscape',
          aspectRatio: '16:9',
          thumbnail: creator.avatar,
          posterImage: creator.avatar,
          previewImage: creator.avatar,
          videoUrl: latestVideo.url,
          imageUrls: [creator.avatar],
          displayOrder: 0,
          altText: creator.name,
        }
      : null,
    connections: buildConnections({ creatorIds: [String(creator.id)] }),
    graph: { ...EMPTY_SPOTLIGHT_GRAPH, relatedCreatorIds: [String(creator.id)] },
    commerce: EMPTY_SPOTLIGHT_COMMERCE,
    badges: ['Creator Pick'],
    isSponsored: false,
    isLive: false,
    isVerified: creator.score >= 75,
    ctaLabel: getSpotlightContentCtaLabel('creator_review'),
    href: creatorReviewHref(String(creator.id)),
    publishedAt: new Date().toISOString(),
    popularityScore: creator.score,
  };
}

export function homepageCardToSpotlightContent(
  card: HomepageSpotlightCardModel,
  catalog: CatalogProduct[],
  brandLogos: Record<string, string>,
): SpotlightContent {
  return campaignToSpotlightContent(card.campaign, catalog, brandLogos);
}

export interface SpotlightExperienceSources {
  catalog: CatalogProduct[];
  guides: CatalogGuide[];
  creators: Creator[];
  brandPosts: BrandPost[];
  brandLogos: Record<string, string>;
}

export function resolveSpotlightExperience(sources: SpotlightExperienceSources): SpotlightContent[] {
  const demoFeed = buildDemoSpotlightFeed();

  const campaigns = listHomepageSpotlightCampaigns();
  const campaignContent = campaigns.flatMap((c) => {
    try {
      return [campaignToSpotlightContent(c, sources.catalog, sources.brandLogos)];
    } catch (error) {
      console.warn('[spotlight] Skipping broken campaign', c?.campaignId, error);
      return [];
    }
  });

  const liveGuides = (sources.guides ?? []).filter((g) => g && g.status !== 'draft' && g.status !== 'archived');
  const guideContent = liveGuides.flatMap((g) => {
    try {
      return [guideToSpotlightContent(g, sources.catalog)];
    } catch (error) {
      console.warn('[spotlight] Skipping broken guide', g?.id, error);
      return [];
    }
  });

  const postContent = (sources.brandPosts ?? []).flatMap((post) => {
    try {
      return [brandPostToSpotlightContent(post)];
    } catch (error) {
      console.warn('[spotlight] Skipping broken brand post', post?.id, error);
      return [];
    }
  });

  const byId = new Map<string, SpotlightContent>();
  [...demoFeed, ...campaignContent, ...guideContent, ...postContent].forEach((item) => {
    if (!byId.has(item.contentId)) {
      byId.set(item.contentId, item);
    }
  });

  return Array.from(byId.values()).map(enrichContentWithDiscoveryScore);
}

export function getSpotlightContentById(
  contentId: string,
  sources: SpotlightExperienceSources,
): SpotlightContent | undefined {
  return resolveSpotlightExperience(sources).find((c) => c.contentId === contentId);
}

export function getSpotlightContentBySlug(
  slug: string,
  sources: SpotlightExperienceSources,
): SpotlightContent | undefined {
  const fromDemoRegistry = getDemoSpotlightContentBySlug(slug);
  if (fromDemoRegistry) return fromDemoRegistry;

  const all = resolveSpotlightExperience(sources);
  const bySlug = all.find((c) => c.slug === slug);
  if (bySlug) return bySlug;

  if (slug.startsWith('creator-')) {
    const creatorId = slug.replace('creator-', '');
    return all.find((c) => c.sourceKind === 'creator' && c.sourceId === creatorId);
  }

  const campaign = listCampaignRecords().find((c) => c.campaignSlug === slug);
  if (campaign) return campaignToSpotlightContent(campaign, sources.catalog, sources.brandLogos);

  const guide = sources.guides.find((g) => String(g.slug || g.id) === slug || String(g.id) === slug);
  if (guide) return guideToSpotlightContent(guide, sources.catalog);

  return undefined;
}
