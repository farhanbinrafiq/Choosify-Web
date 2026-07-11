import type { SpotlightContent, SpotlightDiscoverSection, SpotlightDiscoverSectionId } from '../types/spotlight/experience/content';
import { SPOTLIGHT_DISCOVER_SECTION_META } from '../types/spotlight/experience/content';
import type { SpotlightCollection } from '../types/spotlight/discovery/collections';
import type { SpotlightSeries } from '../types/spotlight/discovery/series';
import type { SpotlightHistoryEntry } from '../types/spotlight/discovery/history';
import { pickFeaturedCampaignOfDay } from './spotlightHomepage';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';
import type { SpotlightDiscoverFilters } from '../types/spotlight/experience/filters';
import { sortByDiscoveryScore } from './spotlightDiscoveryScore';
import { maxItemsForSection, sortCommerceFirst, orderedSectionIds } from '../lib/spotlight/experience/sectionRegistry';

const MS_DAY = 86_400_000;
const MS_WEEK = MS_DAY * 7;
const NOW = () => Date.now();

function byPopularity(a: SpotlightContent, b: SpotlightContent): number {
  return (b.popularityScore ?? 0) - (a.popularityScore ?? 0);
}

function byNewest(a: SpotlightContent, b: SpotlightContent): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

function byEndingSoon(a: SpotlightContent, b: SpotlightContent): number {
  const aEnd = a.endsAt ? new Date(a.endsAt).getTime() : Infinity;
  const bEnd = b.endsAt ? new Date(b.endsAt).getTime() : Infinity;
  return aEnd - bEnd;
}

function sortItems(items: SpotlightContent[], sort: SpotlightDiscoverFilters['sort']): SpotlightContent[] {
  const copy = [...items];
  switch (sort) {
    case 'newest':
      return copy.sort(byNewest);
    case 'ending_soon':
      return copy.sort(byEndingSoon);
    case 'ai_score':
      return copy.sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));
    case 'priority':
    case 'trending':
    default:
      return copy.sort(sortByDiscoveryScore);
  }
}

function filterItems(items: SpotlightContent[], filters: SpotlightDiscoverFilters): SpotlightContent[] {
  return items.filter((item) => {
    if (filters.contentTypes.length && !filters.contentTypes.includes(item.contentType)) return false;
    if (filters.brandIds.length && !item.connections.brandIds.some((id) => filters.brandIds.includes(id))) return false;
    if (filters.publisherIds.length && !filters.publisherIds.includes(item.publisher.publisherId)) return false;
    if (filters.publisherTypes.length && !filters.publisherTypes.includes(item.publisher.publisherType)) return false;
    if (filters.categoryIds.length && !item.connections.categoryIds.some((id) => filters.categoryIds.includes(id))) return false;
    if (filters.creatorIds.length && !item.connections.creatorIds.some((id) => filters.creatorIds.includes(id))) return false;
    if (filters.liveOnly && !item.isLive && item.contentType !== 'live') return false;
    if (filters.promotionsOnly && !['promotion', 'campaign', 'new_launch'].includes(item.contentType)) return false;
    if (filters.sponsoredOnly && !item.isSponsored) return false;
    if (filters.verifiedOnly && !item.isVerified) return false;
    if (filters.trendingOnly && (item.discoveryScore?.overall ?? item.popularityScore ?? 0) < 60) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${item.headline} ${item.description ?? ''} ${item.publisher.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function pickSection(
  id: SpotlightDiscoverSectionId,
  items: SpotlightContent[],
  maxItems?: number,
  viewAllHref?: string,
): SpotlightDiscoverSection | null {
  const meta = SPOTLIGHT_DISCOVER_SECTION_META[id];
  const limit = maxItems ?? maxItemsForSection(id);
  const sorted = sortCommerceFirst(items);
  const slice = sorted.slice(0, limit);
  if (!slice.length) return null;
  return {
    id,
    title: meta.title,
    subtitle: meta.subtitle,
    layout: meta.layout,
    items: slice,
    maxItems: limit,
    viewAllHref,
  };
}

function withinWeek(iso: string): boolean {
  return NOW() - new Date(iso).getTime() <= MS_WEEK;
}

function withinMonth(iso: string): boolean {
  return NOW() - new Date(iso).getTime() <= MS_WEEK * 4;
}

export interface BuildDiscoverSectionsOptions {
  history?: SpotlightHistoryEntry[];
  collections?: SpotlightCollection[];
  series?: SpotlightSeries[];
}

export function buildSpotlightDiscoverSections(
  allItems: SpotlightContent[],
  filters: SpotlightDiscoverFilters,
  options: BuildDiscoverSectionsOptions = {},
): SpotlightDiscoverSection[] {
  const filtered = sortItems(filterItems(allItems, filters), filters.sort);
  const now = NOW();
  const history = options.history ?? [];
  const historyIds = new Set(history.map((h) => h.contentId));

  const featuredCamp = pickFeaturedCampaignOfDay(listCampaignRecords());
  const featured = featuredCamp
    ? filtered.find((i) => i.sourceId === featuredCamp.campaignId)
    : filtered.sort(sortByDiscoveryScore)[0];

  const liveNow = filtered.filter((i) => i.isLive || i.contentType === 'live' || i.live?.status === 'live');
  const trendingNow = filtered.filter((i) => (i.discoveryScore?.overall ?? i.popularityScore ?? 0) >= 55).sort(sortByDiscoveryScore);
  const editorsPicks = filtered
    .filter((i) => (i.discoveryScore?.factors.editorialPriority ?? 0) >= 65 || i.isSponsored)
    .sort(sortByDiscoveryScore);
  const recommendedPlaceholder = filtered.sort(sortByDiscoveryScore).slice(0, 6);
  const continueBrowsing = filtered.filter((i) => historyIds.has(i.contentId)).sort(byNewest);
  const continueWatching = filtered.filter((i) =>
    history.some((h) => h.contentId === i.contentId && h.kind === 'watch' && (h.progress ?? 0) < 1),
  );
  const newLaunches = filtered.filter((i) => i.contentType === 'new_launch').sort(byNewest);
  const recentlyAdded = filtered.filter((i) => NOW() - new Date(i.publishedAt).getTime() <= MS_WEEK * 2).sort(byNewest);
  const popularWeek = filtered.filter((i) => withinWeek(i.publishedAt)).sort(byPopularity);
  const popularMonth = filtered.filter((i) => withinMonth(i.publishedAt)).sort(byPopularity);
  const topCampaigns = filtered.filter((i) => ['campaign', 'promotion', 'new_launch'].includes(i.contentType)).sort(sortByDiscoveryScore);
  const topCreators = filtered.filter((i) => i.publisher.publisherType === 'creator').sort(sortByDiscoveryScore);
  const topBrands = filtered.filter((i) => i.publisher.publisherType === 'brand').sort(sortByDiscoveryScore);
  const topServices = filtered.filter((i) => i.connections.serviceIds.length > 0).sort(sortByDiscoveryScore);
  const campaigns = filtered.filter((i) => ['campaign', 'promotion'].includes(i.contentType));
  const creatorPicks = filtered.filter((i) =>
    ['creator_review', 'community_pick'].includes(i.contentType) || i.publisher.publisherType === 'creator',
  );
  const creatorReviews = filtered.filter((i) => ['product_review', 'creator_review'].includes(i.contentType)).sort(byNewest);
  const brandStories = filtered.filter((i) => i.contentType === 'brand_story');
  const recommendations = filtered.filter((i) => i.contentType === 'recommendation');
  const buyingGuides = filtered.filter((i) => ['buying_guide', 'tutorial', 'tips'].includes(i.contentType));
  const whatsOn = filtered.filter((i) => i.contentType === 'whats_on');
  const events = filtered.filter((i) => i.contentType === 'event');
  const announcements = filtered.filter((i) => i.contentType === 'announcement').sort(byNewest);
  const latestReviews = creatorReviews;
  const latestVideos = filtered.filter((i) =>
    i.media?.videoUrl || i.contentType === 'live' || i.live?.embedUrl,
  ).sort(byNewest);
  const endingSoon = filtered
    .filter((i) => i.endsAt && new Date(i.endsAt).getTime() > now)
    .sort(byEndingSoon);
  const upcoming = filtered
    .filter((i) => i.live?.status === 'upcoming' || (i.endsAt && new Date(i.publishedAt).getTime() > now))
    .sort(byNewest);

  const seriesItems: SpotlightContent[] = (options.series ?? [])
    .map((s) => {
      const ep = s.episodes.find((e) => e.contentId);
      return ep?.contentId ? filtered.find((c) => c.contentId === ep.contentId) : undefined;
    })
    .filter(Boolean) as SpotlightContent[];

  const sections: SpotlightDiscoverSection[] = [];

  if (featured) {
    sections.push({
      id: 'featured_today',
      title: SPOTLIGHT_DISCOVER_SECTION_META.featured_today.title,
      subtitle: SPOTLIGHT_DISCOVER_SECTION_META.featured_today.subtitle,
      layout: 'hero',
      items: [featured],
      maxItems: 1,
    });
  }

  const sectionBuckets: Partial<Record<SpotlightDiscoverSectionId, [SpotlightContent[], string?]>> = {
    continue_watching: [continueWatching],
    continue_browsing: [continueBrowsing],
    live_now: [liveNow],
    trending_now: [trendingNow],
    editors_picks: [editorsPicks],
    recommended_for_you: [recommendedPlaceholder],
    upcoming: [upcoming],
    ending_soon: [endingSoon],
    recently_added: [recentlyAdded],
    popular_this_week: [popularWeek],
    popular_this_month: [popularMonth],
    top_campaigns: [topCampaigns],
    top_creators: [topCreators],
    top_brands: [topBrands],
    top_services: [topServices],
    new_launches: [newLaunches],
    campaigns: [campaigns, '/spotlight/explore?tab=campaigns'],
    creator_picks: [creatorPicks],
    creator_reviews: [creatorReviews],
    brand_stories: [brandStories],
    recommendations: [recommendations],
    buying_guides: [buyingGuides, '/spotlight?tab=guides'],
    whats_on: [whatsOn, '/whats-on'],
    events: [events],
    announcements: [announcements],
    latest_reviews: [latestReviews],
    latest_videos: [latestVideos],
    latest_announcements: [announcements],
    trending: [trendingNow],
    series: [seriesItems, '/spotlight/explore?tab=series'],
  };

  for (const id of orderedSectionIds()) {
    if (id === 'featured_today' || id === 'collections') continue;
    const bucket = sectionBuckets[id];
    if (!bucket) continue;
    const [items, viewAll] = bucket;
    const section = pickSection(id, items, undefined, viewAll);
    if (section) sections.push(section);
  }

  const collections = options.collections ?? [];
  if (collections.length) {
    sections.push({
      id: 'collections',
      title: SPOTLIGHT_DISCOVER_SECTION_META.collections.title,
      subtitle: SPOTLIGHT_DISCOVER_SECTION_META.collections.subtitle,
      layout: 'collection_row',
      items: [],
      collectionIds: collections.slice(0, 8).map((c) => c.collectionId),
      viewAllHref: '/spotlight/explore?tab=collections',
      maxItems: 8,
    });
  }

  return sections;
}
