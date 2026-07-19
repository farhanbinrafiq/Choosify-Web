import type { CatalogProduct } from '../types/catalog';
import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type { SpotlightCampaignType } from '../types/spotlight/campaignTypes';
import type {
  HomepageSpotlightCardModel,
  SpotlightCampaignBadgeType,
  SpotlightHomepageFilter,
  SpotlightHomepageSort,
  SpotlightRotationConfig,
  SpotlightSeasonalTheme,
} from '../types/spotlight/homepage';
import { getMediaById, listCampaignRecords } from '../services/spotlightCampaignStorage';
import type { UniversalMedia } from '../components/media/types/mediaModel';

const NOW = () => Date.now();

function isCampaignActive(c: SpotlightCampaignRecord): boolean {
  if (c.status !== 'published' && c.status !== 'scheduled') return false;
  const surfaces = c.placementRules?.surfaces ?? [];
  if (surfaces.length && !surfaces.includes('homepage')) return false;
  const start = new Date(c.schedule.startAt).getTime();
  const end = new Date(c.schedule.endAt).getTime();
  const now = NOW();
  return start <= now && end >= now;
}

export function listHomepageSpotlightCampaigns(): SpotlightCampaignRecord[] {
  return listCampaignRecords().filter(isCampaignActive);
}

function matchesFilter(c: SpotlightCampaignRecord, filter: SpotlightHomepageFilter): boolean {
  if (filter === 'all') return true;
  const type = c.campaignType;
  if (filter === 'new_launches') return ['new_launch', 'single_product'].includes(type);
  if (filter === 'promotions') return ['promotion', 'discount', 'festival_campaign'].includes(type);
  if (filter === 'featured') return c.isSponsored || type === 'editors_pick';
  if (filter === 'brand_stories') return type === 'brand_story' || type === 'brand_campaign';
  if (filter === 'events') return type === 'festival_campaign' || type === 'seasonal_campaign';
  if (filter === 'buying_guides') return type === 'buying_guide';
  return true;
}

function sortCampaigns(items: SpotlightCampaignRecord[], sort: SpotlightHomepageSort): SpotlightCampaignRecord[] {
  const copy = [...items];
  copy.sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'ending_soon':
        return new Date(a.schedule.endAt).getTime() - new Date(b.schedule.endAt).getTime();
      case 'sponsored':
        return (b.isSponsored ? 1 : 0) - (a.isSponsored ? 1 : 0);
      case 'trending':
        return (b.campaignHealthScore ?? 0) - (a.campaignHealthScore ?? 0);
      case 'priority':
      default:
        return b.priority - a.priority;
    }
  });
  return copy;
}

function scoreForRotation(
  c: SpotlightCampaignRecord,
  strategy: SpotlightRotationConfig['strategies'][number],
): number {
  switch (strategy) {
    case 'sponsored_first':
      return c.isSponsored ? 1000 : 0;
    case 'priority':
      return c.priority;
    case 'new_launch':
      return c.campaignType === 'new_launch' ? 500 : 0;
    case 'trending':
      return c.campaignHealthScore ?? 0;
    case 'ai_recommended':
      return c.aiMetadata?.optimizationScore ?? 0;
    default:
      return 0;
  }
}

/** Smart hero rotation — first card is not always newest (CTO) */
export function applyRotationOrder(
  campaigns: SpotlightCampaignRecord[],
  config: SpotlightRotationConfig = { strategies: ['sponsored_first', 'priority', 'new_launch', 'trending', 'ai_recommended'] },
): SpotlightCampaignRecord[] {
  if (campaigns.length <= 1) return campaigns;
  const [hero, ...rest] = [...campaigns].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    for (const s of config.strategies) {
      scoreA += scoreForRotation(a, s);
      scoreB += scoreForRotation(b, s);
    }
    return scoreB - scoreA;
  });
  return [hero!, ...rest.filter((c) => c.campaignId !== hero!.campaignId)];
}

export function filterAndSortHomepageCampaigns(
  filter: SpotlightHomepageFilter,
  sort: SpotlightHomepageSort,
  rotation?: SpotlightRotationConfig,
): SpotlightCampaignRecord[] {
  let items = listHomepageSpotlightCampaigns().filter((c) => matchesFilter(c, filter));
  items = sortCampaigns(items, sort);
  return applyRotationOrder(items, rotation);
}

export function getSpotlightExploreCtaLabel(type: SpotlightCampaignType): string {
  const map: Partial<Record<SpotlightCampaignType, string>> = {
    new_launch: 'Discover Launch',
    single_product: 'Watch Campaign',
    multi_product: 'Explore Collection',
    promotion: 'View Promotion',
    discount: 'View Promotion',
    brand_story: 'See Brand Story',
    brand_campaign: 'See Brand Story',
    buying_guide: 'Read Buying Guide',
    editors_pick: 'Explore Pick',
    festival_campaign: 'Explore Event',
    seasonal_campaign: 'Explore Seasonal',
    creator_review: 'Watch Review',
    announcement: 'Learn More',
  };
  return map[type] ?? 'Explore Campaign';
}

export function getSpotlightCampaignBadges(c: SpotlightCampaignRecord): SpotlightCampaignBadgeType[] {
  const badges: SpotlightCampaignBadgeType[] = [];
  if (c.isSponsored) badges.push('sponsored');
  if (c.campaignType === 'new_launch') badges.push('new_launch');
  if (['promotion', 'discount'].includes(c.campaignType)) badges.push('promotion');
  if (c.campaignType === 'editors_pick') badges.push('editors_pick');
  if (c.campaignType === 'brand_story') badges.push('brand_story');
  if ((c.campaignHealthScore ?? 0) > 70) badges.push('trending');
  if (c.priority >= 80) badges.push('featured');
  const endsIn = new Date(c.schedule.endAt).getTime() - NOW();
  if (endsIn > 0 && endsIn < 7 * 86400000) badges.push('limited_time');
  if (c.campaignType === 'discount') badges.push('sale');
  return badges.length ? badges : ['featured'];
}

export function resolveSeasonalTheme(c: SpotlightCampaignRecord): SpotlightSeasonalTheme {
  const tags = [...(c.campaignTags ?? []), ...(c.keywords?.campaignTags ?? [])].map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes('eid'))) return 'eid';
  if (tags.some((t) => t.includes('ramadan'))) return 'ramadan';
  if (tags.some((t) => t.includes('christmas'))) return 'christmas';
  if (tags.some((t) => t.includes('new year'))) return 'new_year';
  if (tags.some((t) => t.includes('summer'))) return 'summer_sale';
  if (tags.some((t) => t.includes('school'))) return 'back_to_school';
  if (c.campaignType === 'festival_campaign') return 'eid';
  return 'none';
}

export function resolveCampaignMedia(c: SpotlightCampaignRecord): UniversalMedia | null {
  const primaryId = c.media[0];
  if (!primaryId) return null;
  return getMediaById(primaryId) ?? null;
}

export function buildHomepageSpotlightCard(
  campaign: SpotlightCampaignRecord,
  catalog: CatalogProduct[],
  brandLogos: Record<string, string>,
): HomepageSpotlightCardModel {
  const linkedProductIds = campaign.linkedProductIds ?? [];
  const primaryId = campaign.primaryProductId ?? linkedProductIds[0];
  const primaryProduct = primaryId ? catalog.find((p) => p.id === primaryId) : undefined;
  const extra = Math.max(0, linkedProductIds.length - 1);
  const brandName = campaign.brandName ?? primaryProduct?.brandName;

  return {
    campaign,
    media: resolveCampaignMedia(campaign),
    primaryProduct,
    extraProductCount: extra,
    badges: getSpotlightCampaignBadges(campaign),
    ctaLabel: getSpotlightExploreCtaLabel(campaign.campaignType),
    exploreLabel: campaign.cta?.label || 'Shop Now',
    seasonalTheme: resolveSeasonalTheme(campaign),
    brandLogoUrl: brandName ? brandLogos[brandName] : undefined,
  };
}

export function pickFeaturedCampaignOfDay(
  campaigns: SpotlightCampaignRecord[],
): SpotlightCampaignRecord | undefined {
  const rotated = applyRotationOrder(campaigns);
  return rotated[0];
}
