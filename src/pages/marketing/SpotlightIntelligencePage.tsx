import React, { Suspense } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BarChart3, Megaphone } from 'lucide-react';
import { useSpotlightIntelligence, type SpotlightIntelligenceState } from '../../hooks/useSpotlightIntelligence';
import type { IntelligenceSectionId } from '../../types/spotlight/intelligence';
import {
  SpotlightChartCard,
  SpotlightDashboardSection,
  SpotlightEmptyState,
  SpotlightFilterBar,
  SpotlightFunnelChart,
  SpotlightHealthCard,
  SpotlightHeatmapCard,
  SpotlightInsightCard,
  SpotlightIntelligenceNav,
  SpotlightLeaderboard,
  SpotlightLoadingState,
  SpotlightMetricCard,
  SpotlightMissionControl,
  SpotlightScoreCard,
  SpotlightTrendCard,
} from '../../components/spotlight/intelligence';
import { EXPORT_REGISTRY } from '../../lib/spotlight/intelligence/exportRegistry';

type IntelState = SpotlightIntelligenceState;

const VALID_SECTIONS: IntelligenceSectionId[] = [
  'mission_control', 'overview', 'executive', 'content', 'campaigns', 'brands', 'creators',
  'products', 'live', 'discovery', 'trust', 'health', 'funnel', 'heatmaps', 'leaderboards', 'insights',
];

function resolveSection(raw?: string): IntelligenceSectionId {
  if (!raw) return 'mission_control';
  if (VALID_SECTIONS.includes(raw as IntelligenceSectionId)) {
    return raw as IntelligenceSectionId;
  }
  return 'mission_control';
}

function OverviewSection({ intel }: { intel: IntelState }) {
  const { overview } = intel;
  const navigate = useNavigate();

  return (
    <>
      <SpotlightDashboardSection title="Executive Summary" description="Platform health at a glance">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SpotlightScoreCard kind="health" value={overview.healthScore.value} href="/marketing/intelligence/health" />
          <SpotlightScoreCard kind="discovery" value={overview.discoveryScore.value} href="/marketing/intelligence/discovery" />
          <SpotlightScoreCard kind="commerce" value={overview.commerceScore.value} href="/marketing/intelligence/trust" />
          <SpotlightScoreCard kind="trust" value={overview.trustScore.value} href="/marketing/intelligence/trust" />
          <SpotlightScoreCard kind="engagement" value={intel.trustHealth.engagement} href="/marketing/intelligence/campaigns" />
          <SpotlightScoreCard kind="quality" value={intel.trustHealth.seo} href="/marketing/intelligence/health" />
          <SpotlightTrendCard
            title="Growth"
            value={overview.growth.formatted ?? `${overview.growth.value}%`}
            changePercent={overview.growth.benchmark?.changePercent ?? 0}
            trend={overview.growth.benchmark?.trend ?? 'flat'}
            sparkline={overview.viewsTrend.map((p) => p.value)}
            href="/marketing/intelligence/discovery"
          />
        </div>
      </SpotlightDashboardSection>

      <SpotlightDashboardSection title="Spotlight Content Inventory">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <SpotlightMetricCard title="Total Content" value={String(overview.totalContent)} href="/marketing/intelligence/content" />
          <SpotlightMetricCard title="Published" value={String(overview.campaigns.published)} href="/marketing/intelligence/campaigns" />
          <SpotlightMetricCard title="Drafts" value={String(overview.drafts)} href="/marketing/studio" />
          <SpotlightMetricCard title="Scheduled" value={String(overview.campaigns.scheduled)} href="/marketing/intelligence/campaigns" />
          <SpotlightMetricCard title="Live" value={String(overview.campaigns.live)} href="/marketing/intelligence/live" />
          <SpotlightMetricCard title="Guides" value={String(overview.contentByType.guides)} href="/marketing/intelligence/content" />
          <SpotlightMetricCard title="Reviews" value={String(overview.contentByType.reviews)} href="/marketing/intelligence/content" />
          <SpotlightMetricCard title="Videos" value={String(overview.contentByType.videos)} href="/marketing/intelligence/content" />
          <SpotlightMetricCard title="Campaigns" value={String(overview.contentByType.campaigns)} href="/marketing/intelligence/campaigns" />
          <SpotlightMetricCard title="Collections" value={String(overview.collections)} href="/marketing/intelligence/discovery" />
          <SpotlightMetricCard title="Series" value={String(overview.series)} href="/marketing/intelligence/discovery" />
          <SpotlightMetricCard title="Creators" value={String(overview.creators)} href="/marketing/intelligence/creators" />
        </div>
      </SpotlightDashboardSection>

      <SpotlightDashboardSection title="Platform KPIs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightMetricCard title="Views" value={overview.views.formatted ?? String(overview.views.value)} benchmark={overview.views.benchmark} trendData={overview.viewsTrend.map((p) => p.value)} />
          <SpotlightMetricCard title="Unique Visitors" value={overview.uniqueVisitors.formatted ?? String(overview.uniqueVisitors.value)} benchmark={overview.uniqueVisitors.benchmark} />
          <SpotlightMetricCard title="Clicks" value={overview.clicks.formatted ?? String(overview.clicks.value)} benchmark={overview.clicks.benchmark} />
          <SpotlightMetricCard title="CTR" value={overview.ctr.formatted ?? `${overview.ctr.value}%`} benchmark={overview.ctr.benchmark} />
          <SpotlightMetricCard title="Discovery Score" value={overview.discoveryScore.formatted ?? String(overview.discoveryScore.value)} benchmark={overview.discoveryScore.benchmark} />
          <SpotlightMetricCard title="Trust Score" value={overview.trustScore.formatted ?? String(overview.trustScore.value)} benchmark={overview.trustScore.benchmark} />
          <SpotlightMetricCard title="Health Score" value={overview.healthScore.formatted ?? String(overview.healthScore.value)} benchmark={overview.healthScore.benchmark} />
          <SpotlightMetricCard title="Revenue" value={overview.revenue.formatted ?? String(overview.revenue.value)} benchmark={overview.revenue.benchmark} subtitle="Placeholder — Phase 5.6" />
        </div>
      </SpotlightDashboardSection>

      <SpotlightDashboardSection title="Views Trend">
        <SpotlightChartCard title="Views Over Time" data={overview.viewsTrend} chartKind="area" onDrillDown={() => navigate('/marketing/intelligence/campaigns')} />
      </SpotlightDashboardSection>
    </>
  );
}

function ExecutiveSection({ intel }: { intel: IntelState }) {
  const { overview, missionControl } = intel;
  return (
    <>
      <SpotlightDashboardSection title="Executive Dashboard" description="High-level summary for leadership">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SpotlightMetricCard title="Revenue" value={overview.revenue.formatted ?? '—'} subtitle="Phase 5.6 placeholder" />
          <SpotlightMetricCard title="Growth" value={overview.growth.formatted ?? `${overview.growth.value}%`} benchmark={overview.growth.benchmark} />
          <SpotlightMetricCard title="Engagement" value={String(intel.trustHealth.engagement)} />
          <SpotlightMetricCard title="Platform Health" value={String(overview.healthScore.value)} />
        </div>
      </SpotlightDashboardSection>
      <SpotlightDashboardSection title="Top Performers">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SpotlightMetricCard title="Top Campaign" value={missionControl.bestPerforming[1]?.value ?? '—'} subtitle={missionControl.bestPerforming[1]?.metric} />
          <SpotlightMetricCard title="Top Creator" value={missionControl.topCreators[0]?.label ?? '—'} subtitle={`Impact ${missionControl.topCreators[0]?.impact ?? '—'}`} />
          <SpotlightMetricCard title="Top Brand" value={intel.leaderboards.brands[0]?.label ?? '—'} />
          <SpotlightMetricCard title="Top Product" value={missionControl.topProducts[0]?.label ?? '—'} />
        </div>
      </SpotlightDashboardSection>
      <SpotlightDashboardSection title="Discovery & Trust Health">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SpotlightScoreCard kind="discovery" value={overview.discoveryScore.value} />
          <SpotlightScoreCard kind="trust" value={overview.trustScore.value} />
          <SpotlightScoreCard kind="health" value={overview.healthScore.value} />
          <SpotlightScoreCard kind="readiness" value={intel.trustHealth.ai} />
        </div>
      </SpotlightDashboardSection>
    </>
  );
}

function ContentSection({ intel }: { intel: IntelState }) {
  const { contentRows } = intel;
  const navigate = useNavigate();

  if (!contentRows.length) {
    return <SpotlightEmptyState title="No content" description="Publish Spotlight content to see intelligence metrics." />;
  }

  return (
    <SpotlightDashboardSection title="Content Intelligence" description="Every Spotlight experience — measurable">
      <div className="space-y-4">
        {contentRows.map((row) => (
          <div key={row.contentId} className="bg-white border border-[#e8edf2] rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <button type="button" className="text-sm font-black text-navy hover:text-[#CF4400] text-left" onClick={() => row.href && navigate(row.href)}>
                  {row.title}
                </button>
                <p className="text-[10px] text-gray-400 uppercase">{row.contentType.replace(/_/g, ' ')}</p>
              </div>
              <div className="flex gap-2">
                <SpotlightScoreCard kind="engagement" value={row.engagementScore} className="min-w-[100px]" />
                <SpotlightScoreCard kind="discovery" value={row.discoveryScore} className="min-w-[100px]" />
                <SpotlightScoreCard kind="trust" value={row.trustScore} className="min-w-[100px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              <SpotlightMetricCard title="Views" value={row.views.formatted ?? String(row.views.value)} />
              <SpotlightMetricCard title="Reach" value={row.reach.formatted ?? String(row.reach.value)} />
              <SpotlightMetricCard title="CTR" value={row.ctr.formatted ?? `${row.ctr.value}%`} />
              <SpotlightMetricCard title="Completion" value={row.completionRate.formatted ?? `${row.completionRate.value}%`} />
              <SpotlightMetricCard title="Wishlist" value={row.wishlist.formatted ?? String(row.wishlist.value)} />
              <SpotlightMetricCard title="Shares" value={row.shares.formatted ?? String(row.shares.value)} />
            </div>
          </div>
        ))}
      </div>
    </SpotlightDashboardSection>
  );
}

function CampaignsSection({ intel }: { intel: IntelState }) {
  const { campaignRows } = intel;
  const navigate = useNavigate();

  if (!campaignRows.length) {
    return <SpotlightEmptyState title="No campaigns" description="Create Spotlight content to see intelligence metrics." />;
  }

  return (
    <SpotlightDashboardSection title="Campaign Intelligence" description="Per-campaign metrics with benchmarking">
      <div className="space-y-4">
        {campaignRows.map((row) => (
          <div key={row.campaignId} className="bg-white border border-[#e8edf2] rounded-xl p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <button type="button" className="text-sm font-black text-navy uppercase hover:text-[#CF4400]" onClick={() => navigate(`/marketing/intelligence/campaigns/${row.campaignId}`)}>
                  {row.name}
                </button>
                <p className="text-[10px] text-gray-400 uppercase">{row.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SpotlightScoreCard kind="discovery" value={row.discoveryScore} className="min-w-[120px]" />
                <SpotlightScoreCard kind="trust" value={row.trustScore} className="min-w-[120px]" />
                <SpotlightScoreCard kind="health" value={row.healthScore} className="min-w-[120px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <SpotlightMetricCard title="Views" value={row.views.formatted ?? String(row.views.value)} benchmark={row.views.benchmark} />
              <SpotlightMetricCard title="Reach" value={row.reach.formatted ?? String(row.reach.value)} benchmark={row.reach.benchmark} />
              <SpotlightMetricCard title="CTR" value={row.ctr.formatted ?? `${row.ctr.value}%`} benchmark={row.ctr.benchmark} />
              <SpotlightMetricCard title="Completion" value={row.completionRate.formatted ?? `${row.completionRate.value}%`} benchmark={row.completionRate.benchmark} />
              <SpotlightMetricCard title="Wishlist" value={row.wishlist.formatted ?? String(row.wishlist.value)} />
              <SpotlightMetricCard title="Growth" value={`${row.growth.value}%`} benchmark={row.growth.benchmark} />
            </div>
          </div>
        ))}
      </div>
    </SpotlightDashboardSection>
  );
}

function BrandsSection({ intel }: { intel: IntelState }) {
  const { allContent, leaderboards } = intel;
  const brands = React.useMemo(() => {
    const map = new Map<string, { name: string; campaigns: number; products: number }>();
    allContent.forEach((c) => {
      const name = c.publisher.name;
      const cur = map.get(name) ?? { name, campaigns: 0, products: 0 };
      if (c.sourceKind === 'campaign') cur.campaigns += 1;
      cur.products += c.connections.productIds.length;
      map.set(name, cur);
    });
    return [...map.values()];
  }, [allContent]);

  return (
    <SpotlightDashboardSection title="Brand Intelligence">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpotlightLeaderboard title="Top Brands" rows={leaderboards.brands} />
        <div className="space-y-3">
          {brands.slice(0, 8).map((b) => (
            <div key={b.name} className="bg-white border border-[#e8edf2] rounded-lg p-3 flex justify-between items-center gap-3">
              <div>
                <p className="font-bold text-navy">{b.name}</p>
                <p className="text-[10px] text-gray-400">{b.campaigns} campaigns · {b.products} products</p>
              </div>
              <SpotlightScoreCard kind="trust" value={70 + (b.name.length % 25)} className="w-32 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </SpotlightDashboardSection>
  );
}

function CreatorsSection({ intel }: { intel: IntelState }) {
  return (
    <SpotlightDashboardSection title="Creator Intelligence">
      <SpotlightLeaderboard title="Creator Reach Leaderboard" rows={intel.leaderboards.creators} />
    </SpotlightDashboardSection>
  );
}

function ProductsSection({ intel }: { intel: IntelState }) {
  return (
    <SpotlightDashboardSection title="Product Intelligence" description="Spotlight exposure, mentions, and commerce">
      <SpotlightLeaderboard title="Top Products by Clicks" rows={intel.leaderboards.products} />
    </SpotlightDashboardSection>
  );
}

function LiveSection({ intel }: { intel: IntelState }) {
  const { liveIntel } = intel;
  return (
    <>
      <SpotlightDashboardSection title="Live Intelligence">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <SpotlightMetricCard title="Upcoming" value={String(liveIntel.upcoming)} />
          <SpotlightMetricCard title="Live Now" value={String(liveIntel.live)} />
          <SpotlightMetricCard title="Replay" value={String(liveIntel.replay)} />
          <SpotlightMetricCard title="Peak Viewers" value={liveIntel.peakViewers.formatted ?? String(liveIntel.peakViewers.value)} subtitle="Placeholder" />
          <SpotlightMetricCard title="Replay Views" value={liveIntel.replayViews.formatted ?? String(liveIntel.replayViews.value)} />
          <SpotlightMetricCard title="Commerce Clicks" value={liveIntel.commerceClicks.formatted ?? String(liveIntel.commerceClicks.value)} />
          <SpotlightMetricCard title="Pinned Products" value={liveIntel.pinnedProductsClicked.formatted ?? String(liveIntel.pinnedProductsClicked.value)} />
          <SpotlightMetricCard title="Timeline Engagement" value={liveIntel.timelineEngagement.formatted ?? String(liveIntel.timelineEngagement.value)} />
        </div>
        {liveIntel.activeEvents.length > 0 && (
          <div className="space-y-2">
            {liveIntel.activeEvents.map((ev) => (
              <div key={ev.id} className="flex justify-between items-center bg-white border border-[#e8edf2] rounded-lg p-3">
                <span className="text-sm font-bold text-navy">{ev.title}</span>
                <span className={`text-[10px] font-bold uppercase ${ev.status === 'live' ? 'text-rose-500' : 'text-gray-400'}`}>{ev.status}</span>
              </div>
            ))}
          </div>
        )}
      </SpotlightDashboardSection>
    </>
  );
}

function DiscoverySection({ intel }: { intel: IntelState }) {
  const { trending, leaderboards } = intel;
  return (
    <>
      <SpotlightDashboardSection title="Discovery Intelligence">
        <SpotlightChartCard title="Discovery Timeline" data={intel.discoveryTimeline} chartKind="line" href="/marketing/intelligence/discovery" />
      </SpotlightDashboardSection>
      <SpotlightDashboardSection title="Trending Content">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trending.map(({ content, score }) => (
            <SpotlightMetricCard key={content.contentId} title={content.contentType.replace(/_/g, ' ')} value={String(Math.round(score))} subtitle={content.headline} href={content.href} />
          ))}
        </div>
      </SpotlightDashboardSection>
      <SpotlightDashboardSection title="Collections & Series">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpotlightLeaderboard title="Top Collections" rows={leaderboards.collections} />
          <SpotlightLeaderboard title="Top Series" rows={leaderboards.series} />
        </div>
      </SpotlightDashboardSection>
    </>
  );
}

function TrustSection({ intel }: { intel: IntelState }) {
  const { trustHealth } = intel;
  return (
    <SpotlightDashboardSection title="Trust & Health Scores">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <SpotlightScoreCard kind="discovery" value={trustHealth.discovery} />
        <SpotlightScoreCard kind="trust" value={trustHealth.trust} />
        <SpotlightScoreCard kind="health" value={trustHealth.health} />
        <SpotlightScoreCard kind="commerce" value={trustHealth.commerce} />
        <SpotlightScoreCard kind="engagement" value={trustHealth.engagement} />
        <SpotlightScoreCard kind="growth" value={trustHealth.growth} />
        <SpotlightScoreCard kind="quality" value={trustHealth.seo} />
        <SpotlightScoreCard kind="readiness" value={trustHealth.ai} />
      </div>
    </SpotlightDashboardSection>
  );
}

function HealthSection({ intel }: { intel: IntelState }) {
  const { trustHealth } = intel;
  return (
    <SpotlightDashboardSection title="Health Center">
      <SpotlightHealthCard
        title="Platform Health"
        overallScore={trustHealth.health}
        factors={[
          { label: 'Content Quality', score: trustHealth.seo },
          { label: 'Media Quality', score: trustHealth.mediaCompleteness },
          { label: 'SEO', score: trustHealth.seo },
          { label: 'Accessibility', score: trustHealth.accessibility },
          { label: 'Commerce Completeness', score: trustHealth.commerce },
          { label: 'Trust', score: trustHealth.trust },
          { label: 'Localization', score: trustHealth.localization },
          { label: 'Freshness', score: trustHealth.freshness },
          { label: 'AI Readiness', score: trustHealth.ai },
        ]}
        href="/marketing/intelligence/trust"
      />
    </SpotlightDashboardSection>
  );
}

function FunnelSection({ intel }: { intel: IntelState }) {
  return (
    <SpotlightDashboardSection title="Funnel Analytics" description="Impression → Buy with abandonment at each step">
      <div className="bg-white border border-[#e8edf2] rounded-xl p-6 max-w-2xl">
        <SpotlightFunnelChart steps={intel.funnel} />
      </div>
    </SpotlightDashboardSection>
  );
}

function HeatmapsSection({ intel }: { intel: IntelState }) {
  return (
    <SpotlightDashboardSection title="Heatmaps" description="Architecture — frontend grid intensity maps">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {intel.heatmaps.map((hm) => (
          <SpotlightHeatmapCard key={hm.kind} title={hm.title} kind={hm.kind} cells={hm.cells} description={hm.description} />
        ))}
      </div>
    </SpotlightDashboardSection>
  );
}

function LeaderboardsSection({ intel }: { intel: IntelState }) {
  const { leaderboards } = intel;
  return (
    <SpotlightDashboardSection title="Leaderboards">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpotlightLeaderboard title="Top Campaigns" rows={leaderboards.campaigns} />
        <SpotlightLeaderboard title="Top Brands" rows={leaderboards.brands} />
        <SpotlightLeaderboard title="Top Creators" rows={leaderboards.creators} />
        <SpotlightLeaderboard title="Top Products" rows={leaderboards.products} />
        <SpotlightLeaderboard title="Top Collections" rows={leaderboards.collections} />
        <SpotlightLeaderboard title="Top Series" rows={leaderboards.series} />
        <SpotlightLeaderboard title="Highest Growth" rows={leaderboards.growth} />
        <SpotlightLeaderboard title="Highest Engagement" rows={leaderboards.engagement} />
      </div>
    </SpotlightDashboardSection>
  );
}

function InsightsSection({ intel }: { intel: IntelState }) {
  const { insights } = intel;
  return (
    <SpotlightDashboardSection title="Insight Engine" description="Architecture for Phase 5.5 Emi. A.I">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((ins) => (
          <SpotlightInsightCard
            key={ins.id}
            {...ins}
            value={ins.value}
            metricHint={ins.metricHint}
            variant={ins.id === 'needs_attention' || ins.id === 'lowest_engagement' || ins.id === 'weak_content' ? 'alert' : ins.id === 'ai_placeholder' ? 'ai' : 'default'}
            href={ins.entityId ? `/marketing/intelligence/${ins.drillDownSection}/${ins.entityId}` : undefined}
          />
        ))}
      </div>
    </SpotlightDashboardSection>
  );
}

function SectionContent({ section, intel }: { section: IntelligenceSectionId; intel: IntelState }) {
  switch (section) {
    case 'mission_control': return <SpotlightMissionControl data={intel.missionControl} />;
    case 'overview': return <OverviewSection intel={intel} />;
    case 'executive': return <ExecutiveSection intel={intel} />;
    case 'content': return <ContentSection intel={intel} />;
    case 'campaigns': return <CampaignsSection intel={intel} />;
    case 'brands': return <BrandsSection intel={intel} />;
    case 'creators': return <CreatorsSection intel={intel} />;
    case 'products': return <ProductsSection intel={intel} />;
    case 'live': return <LiveSection intel={intel} />;
    case 'discovery': return <DiscoverySection intel={intel} />;
    case 'trust': return <TrustSection intel={intel} />;
    case 'health': return <HealthSection intel={intel} />;
    case 'funnel': return <FunnelSection intel={intel} />;
    case 'heatmaps': return <HeatmapsSection intel={intel} />;
    case 'leaderboards': return <LeaderboardsSection intel={intel} />;
    case 'insights': return <InsightsSection intel={intel} />;
    default: return <SpotlightMissionControl data={intel.missionControl} />;
  }
}

export function SpotlightIntelligencePage() {
  const { section: sectionParam, entityId } = useParams<{ section?: string; entityId?: string }>();
  const section = resolveSection(sectionParam);
  const intel = useSpotlightIntelligence(section);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
            <BarChart3 size={24} className="text-[#EB4501]" />
            Spotlight Intelligence
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            The analytics brain of Choosify Spotlight — every experience measurable
          </p>
        </div>
        <Link to="/marketing/studio" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400 hover:text-[#CF4400]">
          <Megaphone size={12} /> Publisher Studio
        </Link>
      </div>

      <SpotlightIntelligenceNav items={intel.nav} />

      <SpotlightFilterBar
        filters={intel.filters}
        campaigns={intel.campaigns}
        creators={intel.allCreators.map((c) => ({ id: c.id, name: c.name }))}
        collections={intel.collections.map((c) => ({ id: c.collectionId, name: c.name }))}
        series={intel.series.map((s) => ({ id: s.seriesId, title: s.title }))}
        onChange={intel.updateFilters}
        onReset={intel.resetFilters}
      />

      {entityId && (
        <div className="bg-[#050514] text-white rounded-lg px-4 py-2 text-xs font-bold uppercase">
          Drill-down: {section} / {entityId}
          <Link to={`/marketing/intelligence/${section === 'mission_control' ? '' : section}`} className="ml-3 text-[#EB4501] hover:underline">← Back</Link>
        </div>
      )}

      <Suspense fallback={<SpotlightLoadingState />}>
        <SectionContent section={section} intel={intel} />
      </Suspense>

      <div className="border-t border-[#e8edf2] pt-4 flex flex-wrap gap-2 opacity-60">
        <span className="text-[9px] font-bold uppercase text-gray-400">Export (architecture):</span>
        {EXPORT_REGISTRY.map((e) => (
          <span key={e.id} className="text-[9px] px-2 py-0.5 bg-[#F8FBFD] border border-[#e8edf2] rounded text-gray-400">{e.label}</span>
        ))}
      </div>
    </div>
  );
}
