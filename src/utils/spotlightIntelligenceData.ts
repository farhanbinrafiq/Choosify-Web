import type {
  IntelligenceGlobalFilters,
  IntelligenceFunnelStep,
  IntelligenceHeatmapCell,
  IntelligenceLeaderboardRow,
  IntelligenceMetricValue,
  IntelligenceOverviewSnapshot,
  IntelligenceTimeSeriesPoint,
  IntelligenceContentRow,
  IntelligenceLiveSnapshot,
  IntelligenceMissionControlSnapshot,
  HeatmapKind,
} from '../types/spotlight/intelligence';
import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import { listCampaignRecords } from '../services/spotlightCampaignStorage';
import { buildBenchmark, formatMetricValue, seededValue } from './spotlightIntelligenceBenchmark';
import { getMetricDefinition } from '../lib/spotlight/intelligence/metricRegistry';
import {
  resolveAiReadinessScore,
  resolveCommerceScore,
  resolveDiscoveryScore,
  resolveEngagementScore,
  resolveGrowthScore,
  resolveHealthScore,
  resolveQualityScore,
  resolveReadinessScore,
  resolveTrustScore,
} from '../lib/spotlight/intelligence/scoreRegistry';
import { computeDiscoveryScore } from './spotlightDiscoveryScore';

function metricValue(id: string, seed: string, min: number, max: number): IntelligenceMetricValue {
  const def = getMetricDefinition(id);
  const value = Math.round(seededValue(`${seed}-${id}`, min, max) * 100) / 100;
  const unit = def?.unit === 'percent' || def?.unit === 'score' ? def.unit : def?.unit === 'currency' ? 'currency' : def?.unit === 'duration' ? 'duration' : 'count';
  return {
    metricId: id,
    value,
    benchmark: buildBenchmark(`${seed}-${id}`, value),
    formatted: formatMetricValue(value, unit as 'count' | 'percent' | 'score' | 'currency' | 'duration'),
  };
}

function timeRangeMultiplier(range: IntelligenceGlobalFilters['timeRange']): number {
  switch (range) {
    case 'today': return 0.08;
    case '7d': return 0.35;
    case '30d': return 1;
    case '90d': return 2.4;
    case '12m': return 8;
    default: return 1;
  }
}

function buildViewsTrend(seed: string, range: IntelligenceGlobalFilters['timeRange']): IntelligenceTimeSeriesPoint[] {
  const points = range === 'today' ? 12 : range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 12 : 12;
  const labels = range === 'today'
    ? Array.from({ length: 12 }, (_, i) => `${i * 2}h`)
    : range === '7d'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : range === '90d' || range === '12m'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, points)
        : Array.from({ length: points }, (_, i) => `D${i + 1}`);

  return labels.map((label, i) => ({
    label,
    value: Math.round(seededValue(`${seed}-trend-${i}`, 800, 4200)),
  }));
}

export function countCampaignStatuses(campaigns: SpotlightCampaignRecord[]) {
  const now = Date.now();
  let published = 0;
  let scheduled = 0;
  let live = 0;
  let upcoming = 0;
  campaigns.forEach((c) => {
    if (c.status === 'published' || c.status === 'approved') published += 1;
    if (c.status === 'scheduled') scheduled += 1;
    const start = new Date(c.schedule.startAt).getTime();
    const end = new Date(c.schedule.endAt).getTime();
    if (start <= now && end >= now && c.status !== 'draft' && c.status !== 'archived') live += 1;
    if (start > now) upcoming += 1;
  });
  return { published, scheduled, live, upcoming };
}

export function buildOverviewSnapshot(
  filters: IntelligenceGlobalFilters,
  campaigns: SpotlightCampaignRecord[],
  content: SpotlightContent[],
  collections: number,
  series: number,
  brands: number,
  creators: number,
  products: number,
): IntelligenceOverviewSnapshot {
  const mult = timeRangeMultiplier(filters.timeRange);
  const seed = `overview-${filters.timeRange}-${filters.campaignId ?? 'all'}`;
  const statusCounts = countCampaignStatuses(campaigns);
  const guides = content.filter((c) => c.contentType.includes('guide') || c.contentType === 'buying_guide' || c.contentType === 'tutorial').length;
  const reviews = content.filter((c) => c.contentType.includes('review')).length;
  const videos = content.filter((c) => c.media?.mediaType?.includes('video') || c.media?.mediaType === 'livestream').length;
  const campaignContent = content.filter((c) => c.sourceKind === 'campaign').length;
  const liveContent = content.filter((c) => c.contentType === 'live' || c.contentType === 'livestream_replay').length;
  const drafts = campaigns.filter((c) => c.status === 'draft').length;

  return {
    totalContent: content.length + campaigns.length,
    drafts,
    campaigns: statusCounts,
    contentByType: { guides, reviews, videos, campaigns: campaignContent, live: liveContent },
    collections,
    series,
    brands,
    creators,
    products,
    views: metricValue('views', seed, 12000 * mult, 89000 * mult),
    uniqueVisitors: metricValue('unique_visitors', seed, 8000 * mult, 52000 * mult),
    clicks: metricValue('clicks', seed, 900 * mult, 6800 * mult),
    ctr: metricValue('ctr', seed, 2.1, 6.8),
    growth: metricValue('growth_pct', seed, 4, 28),
    avgWatchTime: metricValue('avg_watch_time', seed, 18, 94),
    discoveryScore: metricValue('discovery_score', seed, 62, 88),
    trustScore: metricValue('trust_score', seed, 71, 94),
    healthScore: metricValue('health_score', seed, 68, 91),
    commerceScore: metricValue('engagement_score', seed, 58, 86),
    revenue: metricValue('revenue', seed, 45000 * mult, 320000 * mult),
    viewsTrend: buildViewsTrend(seed, filters.timeRange),
  };
}

export interface CampaignIntelligenceRow {
  campaignId: string;
  name: string;
  status: string;
  views: IntelligenceMetricValue;
  reach: IntelligenceMetricValue;
  ctr: IntelligenceMetricValue;
  completionRate: IntelligenceMetricValue;
  avgWatchTime: IntelligenceMetricValue;
  productsClicked: IntelligenceMetricValue;
  wishlist: IntelligenceMetricValue;
  compare: IntelligenceMetricValue;
  discoveryScore: number;
  trustScore: number;
  healthScore: number;
  growth: IntelligenceMetricValue;
  topReferrers: { label: string; value: number }[];
  topDevices: { label: string; value: number }[];
  topPlacements: { label: string; value: number }[];
}

export function buildCampaignIntelligence(
  campaigns: SpotlightCampaignRecord[],
  filters: IntelligenceGlobalFilters,
): CampaignIntelligenceRow[] {
  return campaigns.map((c) => {
    const seed = c.campaignId;
    const ctrVal = seededValue(`${seed}-ctr`, 1.8, 7.2);
    const completion = seededValue(`${seed}-comp`, 22, 78);
    const watch = seededValue(`${seed}-watch`, 15, 110);
    return {
      campaignId: c.campaignId,
      name: c.campaignName,
      status: c.status,
      views: metricValue('views', seed, 1200, 48000),
      reach: metricValue('campaign_reach', seed, 800, 32000),
      ctr: metricValue('ctr', seed, ctrVal, ctrVal),
      completionRate: metricValue('completion_rate', seed, completion, completion),
      avgWatchTime: metricValue('avg_watch_time', seed, watch, watch),
      productsClicked: metricValue('clicks', seed, 40, 920),
      wishlist: metricValue('wishlist', seed, 12, 280),
      compare: metricValue('compare', seed, 5, 95),
      discoveryScore: Math.round(seededValue(`${seed}-disc`, 55, 92)),
      trustScore: Math.round(seededValue(`${seed}-trust`, 60, 96)),
      healthScore: c.campaignHealthScore ?? Math.round(seededValue(`${seed}-health`, 58, 94)),
      growth: metricValue('growth_pct', seed, -4, 38),
      topReferrers: [
        { label: 'Homepage Hero', value: Math.round(seededValue(`${seed}-ref1`, 18, 42)) },
        { label: 'Discover Feed', value: Math.round(seededValue(`${seed}-ref2`, 12, 28)) },
        { label: 'Brand Page', value: Math.round(seededValue(`${seed}-ref3`, 8, 22)) },
      ],
      topDevices: [
        { label: 'Mobile', value: Math.round(seededValue(`${seed}-dev1`, 52, 72)) },
        { label: 'Desktop', value: Math.round(seededValue(`${seed}-dev2`, 18, 38)) },
        { label: 'Tablet', value: Math.round(seededValue(`${seed}-dev3`, 4, 14)) },
      ],
      topPlacements: (c.placementRules?.surfaces ?? []).slice(0, 3).map((p, i) => ({
        label: p.replace(/_/g, ' '),
        value: Math.round(seededValue(`${seed}-pl-${i}`, 10, 35)),
      })),
    };
  });
}

export function buildLeaderboard(
  kind: 'campaigns' | 'brands' | 'creators' | 'products' | 'collections' | 'series' | 'categories' | 'publishers' | 'growth' | 'engagement',
  items: { id: string; label: string; subtitle?: string; seed: string }[],
  metricId: string,
  hrefPrefix?: string,
): IntelligenceLeaderboardRow[] {
  return items
    .map((item, idx) => {
      const value = seededValue(`${item.seed}-${metricId}`, 100, 10000);
      const change = seededValue(`${item.seed}-chg`, -12, 45);
      return {
        rank: idx + 1,
        id: item.id,
        label: item.label,
        subtitle: item.subtitle,
        value: Math.round(value),
        valueLabel: formatMetricValue(value, metricId === 'ctr' ? 'percent' : 'count'),
        changePercent: Math.round(change * 10) / 10,
        href: hrefPrefix ? `${hrefPrefix}/${item.id}` : undefined,
      };
    })
    .sort((a, b) => b.value - a.value)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

export function buildDiscoveryTrending(content: SpotlightContent[]) {
  const scored = content.map((c) => ({
    content: c,
    score: computeDiscoveryScore(c).overall,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8);
}

export function buildTrustHealthBreakdown(content: SpotlightContent[], campaigns: SpotlightCampaignRecord[]) {
  const sample = content[0];
  const discovery = sample ? resolveDiscoveryScore(sample) : 72;
  const trust = sample ? resolveTrustScore(sample) : 78;
  const health = resolveHealthScore(82, campaigns.filter((c) => (c.campaignHealthScore ?? 100) < 70).length);
  const ctr = seededValue('platform-ctr', 2.4, 4.1);
  const commerce = resolveCommerceScore(ctr, seededValue('platform-conv', 0.8, 2.4));
  const engagement = resolveEngagementScore(seededValue('platform-comp', 35, 62), seededValue('platform-watch', 28, 72));
  const growth = resolveGrowthScore(seededValue('platform-growth', 4, 28));
  const ai = resolveAiReadinessScore(true, true);

  return {
    discovery,
    trust,
    health,
    commerce,
    engagement,
    growth,
    ai,
    seo: Math.round(seededValue('seo', 68, 92)),
    accessibility: Math.round(seededValue('a11y', 72, 96)),
    mediaCompleteness: Math.round(seededValue('media', 75, 98)),
    localization: Math.round(seededValue('l10n', 55, 88)),
    freshness: Math.round(seededValue('fresh', 60, 94)),
  };
}

export function listIntelligenceCampaigns(): SpotlightCampaignRecord[] {
  return listCampaignRecords();
}

export function buildContentIntelligence(
  content: SpotlightContent[],
  filters: IntelligenceGlobalFilters,
): IntelligenceContentRow[] {
  let items = content;
  if (filters.contentType) items = items.filter((c) => c.contentType === filters.contentType);

  return items.slice(0, 24).map((c) => {
    const seed = c.contentId;
    const ctrVal = seededValue(`${seed}-ctr`, 1.5, 8.2);
    const completion = seededValue(`${seed}-comp`, 18, 82);
    const watch = seededValue(`${seed}-watch`, 12, 120);
    const read = seededValue(`${seed}-read`, 45, 420);
    return {
      contentId: c.contentId,
      title: c.headline,
      contentType: c.contentType,
      status: c.sourceKind === 'campaign' ? 'published' : 'published',
      views: metricValue('views', seed, 800, 42000),
      reach: metricValue('content_reach', seed, 500, 28000),
      uniqueVisitors: metricValue('unique_visitors', seed, 400, 22000),
      avgReadTime: metricValue('avg_read_time', seed, read, read),
      avgWatchTime: metricValue('avg_watch_time', seed, watch, watch),
      completionRate: metricValue('completion_rate', seed, completion, completion),
      ctr: metricValue('ctr', seed, ctrVal, ctrVal),
      productsClicked: metricValue('clicks', seed, 20, 680),
      wishlist: metricValue('wishlist', seed, 8, 220),
      compare: metricValue('compare', seed, 3, 85),
      shares: metricValue('shares', seed, 5, 180),
      saves: metricValue('saves', seed, 10, 320),
      engagementScore: Math.round(resolveEngagementScore(completion, watch)),
      discoveryScore: Math.round(resolveDiscoveryScore(c)),
      trustScore: Math.round(resolveTrustScore(c)),
      healthScore: Math.round(resolveHealthScore(seededValue(`${seed}-health`, 62, 94))),
      growthTrend: metricValue('growth_pct', seed, -6, 42),
      href: c.href,
    };
  });
}

export function buildLiveIntelligence(
  content: SpotlightContent[],
  campaigns: SpotlightCampaignRecord[],
  filters: IntelligenceGlobalFilters,
): IntelligenceLiveSnapshot {
  const seed = `live-${filters.timeRange}`;
  const liveItems = content.filter((c) => c.contentType === 'live' || c.contentType === 'livestream_replay');
  const now = Date.now();
  let upcoming = 0;
  let live = 0;
  let replay = 0;
  campaigns.forEach((c) => {
    const start = new Date(c.schedule.startAt).getTime();
    const end = new Date(c.schedule.endAt).getTime();
    if (c.campaignType === 'livestream') {
      if (start > now) upcoming += 1;
      else if (start <= now && end >= now) live += 1;
      else replay += 1;
    }
  });
  replay += liveItems.filter((c) => c.contentType === 'livestream_replay').length;

  const activeEvents = [
    ...campaigns.filter((c) => c.campaignType === 'livestream').slice(0, 4).map((c) => {
      const start = new Date(c.schedule.startAt).getTime();
      const end = new Date(c.schedule.endAt).getTime();
      const status = start > now ? 'upcoming' as const : start <= now && end >= now ? 'live' as const : 'replay' as const;
      return { id: c.campaignId, title: c.campaignName, status, href: `/spotlight/${c.campaignSlug}` };
    }),
  ];

  return {
    upcoming: upcoming || Math.max(1, Math.round(seededValue(`${seed}-up`, 2, 8))),
    live: live || Math.round(seededValue(`${seed}-live`, 0, 3)),
    replay: replay || Math.round(seededValue(`${seed}-rep`, 4, 18)),
    peakViewers: metricValue('peak_viewers', seed, 120, 4800),
    avgDuration: metricValue('avg_watch_time', seed, 420, 3600),
    pinnedProductsClicked: metricValue('clicks', seed, 40, 920),
    timelineEngagement: metricValue('engagement_score', seed, 45, 88),
    replayViews: metricValue('replay_views', seed, 800, 24000),
    commerceClicks: metricValue('buy_clicks', seed, 60, 1200),
    activeEvents,
  };
}

export function buildFunnelAnalytics(filters: IntelligenceGlobalFilters): IntelligenceFunnelStep[] {
  const seed = `funnel-${filters.timeRange}`;
  const impression = Math.round(seededValue(`${seed}-imp`, 85000, 320000));
  const spotlightView = Math.round(impression * seededValue(`${seed}-sv`, 0.42, 0.68));
  const contentOpen = Math.round(spotlightView * seededValue(`${seed}-co`, 0.35, 0.58));
  const productClick = Math.round(contentOpen * seededValue(`${seed}-pc`, 0.12, 0.28));
  const compare = Math.round(productClick * seededValue(`${seed}-cmp`, 0.08, 0.22));
  const wishlist = Math.round(productClick * seededValue(`${seed}-wl`, 0.15, 0.35));
  const buy = Math.round(productClick * seededValue(`${seed}-buy`, 0.04, 0.12));

  const steps: IntelligenceFunnelStep[] = [
    { id: 'impression', label: 'Impression', value: impression },
    { id: 'spotlight_view', label: 'Spotlight View', value: spotlightView },
    { id: 'content_open', label: 'Content Open', value: contentOpen },
    { id: 'product_click', label: 'Product Click', value: productClick },
    { id: 'compare', label: 'Compare', value: compare },
    { id: 'wishlist', label: 'Wishlist', value: wishlist },
    { id: 'buy', label: 'Buy', value: buy },
  ];

  return steps.map((step, i) => {
    if (i === 0) return step;
    const prev = steps[i - 1].value;
    const dropoff = prev > 0 ? Math.round((1 - step.value / prev) * 1000) / 10 : 0;
    return { ...step, dropoffPercent: dropoff };
  });
}

export function buildHeatmapData(kind: HeatmapKind, seed: string): IntelligenceHeatmapCell[] {
  const rows = kind === 'timeline' ? ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const cols = kind === 'commerce' ? ['Products', 'CTA', 'Compare', 'Wishlist', 'Buy'] : kind === 'category' ? ['Electronics', 'Fashion', 'Home', 'Travel', 'Food'] : ['Morning', 'Afternoon', 'Evening', 'Night'];
  const cells: IntelligenceHeatmapCell[] = [];
  rows.forEach((row) => {
    cols.forEach((col) => {
      cells.push({
        row,
        col,
        value: Math.round(seededValue(`${seed}-${kind}-${row}-${col}`, 0, 100)),
      });
    });
  });
  return cells;
}

export function buildMissionControlSnapshot(
  content: SpotlightContent[],
  campaigns: SpotlightCampaignRecord[],
  campaignRows: CampaignIntelligenceRow[],
  trending: ReturnType<typeof buildDiscoveryTrending>,
  allCreators: { id: string; name: string }[],
  allProducts: { id: string; title: string }[],
): IntelligenceMissionControlSnapshot {
  const now = Date.now();
  const weekMs = 7 * 86400000;

  const bestCampaign = [...campaignRows].sort((a, b) => b.views.value - a.views.value)[0];
  const worstHealth = campaignRows.filter((c) => c.healthScore < 70);
  const topTrend = trending[0];

  return {
    bestPerforming: [
      { label: 'Top Content', value: topTrend?.content.headline ?? '—', href: topTrend?.content.href, metric: `${Math.round(topTrend?.score ?? 0)} discovery` },
      { label: 'Top Campaign', value: bestCampaign?.name ?? '—', href: bestCampaign ? `/marketing/intelligence/campaigns/${bestCampaign.campaignId}` : undefined, metric: `${bestCampaign?.views.formatted ?? '—'} views` },
      { label: 'Highest CTR', value: [...campaignRows].sort((a, b) => b.ctr.value - a.ctr.value)[0]?.name ?? '—', metric: `${[...campaignRows].sort((a, b) => b.ctr.value - a.ctr.value)[0]?.ctr.value ?? 0}%` },
    ],
    needsAttention: [
      ...worstHealth.slice(0, 3).map((c) => ({ label: c.name, value: `Health ${c.healthScore}`, href: `/marketing/intelligence/campaigns/${c.campaignId}`, severity: c.healthScore < 55 ? 'critical' as const : 'warn' as const })),
    ],
    trendingNow: trending.slice(0, 5).map(({ content: c, score }) => ({ label: c.headline, score: Math.round(score), href: c.href })),
    liveActive: campaigns.filter((c) => c.campaignType === 'livestream').slice(0, 4).map((c) => ({
      label: c.campaignName,
      status: new Date(c.schedule.startAt).getTime() <= now && new Date(c.schedule.endAt).getTime() >= now ? 'LIVE' : 'Scheduled',
      href: `/spotlight/${c.campaignSlug}`,
    })),
    commerceDrivers: campaignRows.sort((a, b) => b.productsClicked.value - a.productsClicked.value).slice(0, 5).map((c) => ({
      label: c.name,
      clicks: Math.round(c.productsClicked.value),
      href: `/marketing/intelligence/campaigns/${c.campaignId}`,
    })),
    topCreators: allCreators.slice(0, 5).map((cr, i) => ({
      label: cr.name,
      impact: Math.round(seededValue(`${cr.id}-impact`, 60, 98)),
      href: `/marketing/intelligence/creators/${cr.id}`,
    })),
    topProducts: allProducts.slice(0, 5).map((p) => ({
      label: p.title,
      exposure: Math.round(seededValue(`${p.id}-exp`, 500, 12000)),
      href: `/marketing/intelligence/products/${p.id}`,
    })),
    expiringSoon: campaigns.filter((c) => {
      const end = new Date(c.schedule.endAt).getTime();
      return end > now && end - now < weekMs;
    }).slice(0, 5).map((c) => ({
      label: c.campaignName,
      daysLeft: Math.ceil((new Date(c.schedule.endAt).getTime() - now) / 86400000),
      href: `/marketing/studio/${c.campaignId}`,
    })),
    scheduledNext7: campaigns.filter((c) => {
      const start = new Date(c.schedule.startAt).getTime();
      return start > now && start - now < weekMs;
    }).slice(0, 5).map((c) => ({
      label: c.campaignName,
      date: new Date(c.schedule.startAt).toLocaleDateString(),
      href: `/marketing/studio/${c.campaignId}`,
    })),
  };
}

export function buildDiscoveryTimeline(filters: IntelligenceGlobalFilters): number[] {
  const seed = `disc-timeline-${filters.timeRange}`;
  return Array.from({ length: 12 }, (_, i) => Math.round(seededValue(`${seed}-${i}`, 42, 95)));
}
