import { useCallback, useMemo, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useSpotlightExperience } from './useSpotlightExperience';
import type { IntelligenceGlobalFilters, IntelligenceSectionId } from '../types/spotlight/intelligence';
import {
  buildCampaignIntelligence,
  buildContentIntelligence,
  buildDiscoveryTimeline,
  buildDiscoveryTrending,
  buildFunnelAnalytics,
  buildHeatmapData,
  buildLeaderboard,
  buildLiveIntelligence,
  buildMissionControlSnapshot,
  buildOverviewSnapshot,
  buildTrustHealthBreakdown,
  listIntelligenceCampaigns,
} from '../utils/spotlightIntelligenceData';
import { INSIGHT_REGISTRY } from '../lib/spotlight/intelligence/insightRegistry';
import { seededValue } from '../utils/spotlightIntelligenceBenchmark';
import { toPlatformRole } from '../lib/platform/roles';
import { navForRole, ROLE_DASHBOARD_PRESETS } from '../lib/spotlight/intelligence/layoutRegistry';

const DEFAULT_FILTERS: IntelligenceGlobalFilters = {
  timeRange: '30d',
  status: 'all',
};

export function useSpotlightIntelligence(section: IntelligenceSectionId = 'mission_control') {
  const { currentUser, allCatalogProducts, allCreators } = useGlobalState();
  const { allContent, collections, series } = useSpotlightExperience();
  const [filters, setFilters] = useState<IntelligenceGlobalFilters>(DEFAULT_FILTERS);

  const role = toPlatformRole(currentUser.role);
  const nav = useMemo(() => navForRole(role), [role]);
  const presetSections = ROLE_DASHBOARD_PRESETS[role];

  const campaigns = useMemo(() => {
    let list = listIntelligenceCampaigns();
    if (filters.campaignId) list = list.filter((c) => c.campaignId === filters.campaignId);
    if (filters.brandId) list = list.filter((c) => c.brandName === filters.brandId || c.linkedBrandIds.includes(filters.brandId!));
    if (filters.status && filters.status !== 'all') list = list.filter((c) => c.status === filters.status);
    return list;
  }, [filters.campaignId, filters.brandId, filters.status]);

  const brandSet = useMemo(() => {
    const names = new Set<string>();
    allContent.forEach((c) => { if (c.publisher.name) names.add(c.publisher.name); });
    campaigns.forEach((c) => { if (c.brandName) names.add(c.brandName); });
    return names.size;
  }, [allContent, campaigns]);

  const overview = useMemo(
    () =>
      buildOverviewSnapshot(
        filters,
        campaigns,
        allContent,
        collections.length,
        series.length,
        brandSet,
        allCreators.length,
        allCatalogProducts.length,
      ),
    [filters, campaigns, allContent, collections.length, series.length, brandSet, allCreators.length, allCatalogProducts.length],
  );

  const campaignRows = useMemo(() => buildCampaignIntelligence(campaigns, filters), [campaigns, filters]);

  const contentRows = useMemo(() => buildContentIntelligence(allContent, filters), [allContent, filters]);

  const liveIntel = useMemo(() => buildLiveIntelligence(allContent, campaigns, filters), [allContent, campaigns, filters]);

  const funnel = useMemo(() => buildFunnelAnalytics(filters), [filters]);

  const discoveryTimeline = useMemo(() => buildDiscoveryTimeline(filters), [filters]);

  const heatmaps = useMemo(() => {
    const seed = `hm-${filters.timeRange}`;
    return ([
      { kind: 'content' as const, title: 'Content Heatmap', description: 'Engagement by day and time slot' },
      { kind: 'commerce' as const, title: 'Commerce Heatmap', description: 'Shoppable action intensity' },
      { kind: 'engagement' as const, title: 'Engagement Heatmap', description: 'Interaction density' },
      { kind: 'category' as const, title: 'Category Heatmap', description: 'Category performance grid' },
      { kind: 'timeline' as const, title: 'Timeline Heatmap', description: 'Live session engagement' },
      { kind: 'live_interaction' as const, title: 'Live Interaction Heatmap', description: 'Pinned product clicks during live' },
    ]).map((hm) => ({ ...hm, cells: buildHeatmapData(hm.kind, seed) }));
  }, [filters.timeRange]);

  const trending = useMemo(() => buildDiscoveryTrending(allContent), [allContent]);

  const missionControl = useMemo(
    () => buildMissionControlSnapshot(allContent, campaigns, campaignRows, trending, allCreators, allCatalogProducts),
    [allContent, campaigns, campaignRows, trending, allCreators, allCatalogProducts],
  );

  const trustHealth = useMemo(
    () => buildTrustHealthBreakdown(allContent, campaigns),
    [allContent, campaigns],
  );

  const leaderboards = useMemo(() => {
    const campaignItems = campaigns.slice(0, 12).map((c) => ({
      id: c.campaignId,
      label: c.campaignName,
      subtitle: c.brandName,
      seed: c.campaignId,
    }));
    const brandItems = [...new Set(allContent.map((c) => c.publisher.name))].slice(0, 10).map((name, i) => ({
      id: `brand-${i}`,
      label: name,
      seed: name,
    }));
    const creatorItems = allCreators.slice(0, 10).map((cr) => ({
      id: cr.id,
      label: cr.name,
      subtitle: cr.bestFor,
      seed: cr.id,
    }));
    const productItems = allCatalogProducts.slice(0, 10).map((p) => ({
      id: p.id,
      label: p.title,
      subtitle: p.brandName,
      seed: p.id,
    }));

    return {
      campaigns: buildLeaderboard('campaigns', campaignItems, 'views', '/marketing/intelligence/campaigns'),
      brands: buildLeaderboard('brands', brandItems, 'ctr'),
      creators: buildLeaderboard('creators', creatorItems, 'creator_reach'),
      products: buildLeaderboard('products', productItems, 'clicks'),
      collections: buildLeaderboard('collections', collections.slice(0, 8).map((col, i) => ({
        id: col.collectionId,
        label: col.name,
        seed: col.collectionId ?? `col-${i}`,
      })), 'views'),
      series: buildLeaderboard('series', series.slice(0, 8).map((s, i) => ({
        id: s.seriesId,
        label: s.title,
        seed: s.seriesId ?? `ser-${i}`,
      })), 'views'),
      growth: buildLeaderboard('growth', campaignItems, 'growth_pct'),
      engagement: buildLeaderboard('engagement', campaignItems, 'ctr'),
    };
  }, [campaigns, allContent, allCreators, allCatalogProducts, collections, series]);

  const insights = useMemo(() => {
    const topCampaign = campaignRows[0];
    const topCreator = allCreators[0];
    const topProduct = allCatalogProducts[0];
    const topBrand = [...new Set(allContent.map((c) => c.publisher.name))][0];
    return INSIGHT_REGISTRY.map((def) => {
      let value = '—';
      let entityId: string | undefined;
      switch (def.id) {
        case 'top_campaign':
          value = topCampaign?.name ?? 'No campaigns';
          entityId = topCampaign?.campaignId;
          break;
        case 'top_brand':
          value = topBrand ?? '—';
          break;
        case 'top_creator':
          value = topCreator?.name ?? '—';
          entityId = topCreator?.id;
          break;
        case 'top_product':
          value = topProduct?.title ?? '—';
          entityId = topProduct?.id;
          break;
        case 'fastest_growing':
          value = campaignRows.sort((a, b) => b.growth.value - a.growth.value)[0]?.name ?? '—';
          break;
        case 'highest_ctr':
          value = campaignRows.sort((a, b) => b.ctr.value - a.ctr.value)[0]?.name ?? '—';
          break;
        case 'needs_attention':
          value = `${campaignRows.filter((c) => c.healthScore < 70).length} campaigns`;
          break;
        case 'lowest_engagement':
          value = campaignRows.sort((a, b) => a.ctr.value - b.ctr.value)[0]?.name ?? '—';
          break;
        case 'top_opportunity':
          value = trending[0]?.content.headline ?? '—';
          break;
        case 'weak_content':
          value = `${contentRows.filter((c) => c.healthScore < 65).length} items`;
          break;
        case 'upcoming_trends':
          value = trending.slice(0, 3).map((t) => t.content.contentType).join(', ') || '—';
          break;
        case 'live_active':
          value = `${liveIntel.live} live · ${liveIntel.upcoming} upcoming`;
          break;
        case 'expiring_campaigns':
          value = `${missionControl.expiringSoon.length} expiring`;
          break;
        case 'scheduled_7d':
          value = `${missionControl.scheduledNext7.length} scheduled`;
          break;
        case 'ai_placeholder':
          value = 'Emi AI — Phase 5.5';
          break;
        default:
          break;
      }
      return { ...def, value, entityId, metricHint: Math.round(seededValue(def.id, 10, 99)) };
    });
  }, [campaignRows, allCreators, allCatalogProducts, allContent, trending, contentRows, liveIntel, missionControl]);

  const updateFilters = useCallback((patch: Partial<IntelligenceGlobalFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    section,
    role,
    nav,
    presetSections,
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    overview,
    campaignRows,
    contentRows,
    liveIntel,
    funnel,
    discoveryTimeline,
    heatmaps,
    missionControl,
    trending,
    trustHealth,
    leaderboards,
    insights,
    campaigns,
    allContent,
    collections,
    series,
    allCreators,
    allCatalogProducts,
  };
}

export type SpotlightIntelligenceState = ReturnType<typeof useSpotlightIntelligence>;
