import React from 'react';
import type { SpotlightIntelligenceState } from '../../../hooks/useSpotlightIntelligence';
import { getWidgetDefinition } from '../../../lib/spotlight/intelligence/widgetRegistry';
import { INTELLIGENCE_LAYOUT_REGISTRY } from '../../../lib/spotlight/intelligence/layoutRegistry';
import type { IntelligenceSectionId } from '../../../types/spotlight/intelligence';
import { SpotlightMissionControl } from './SpotlightMissionControl';
import { SpotlightFunnelChart } from './SpotlightFunnelChart';
import { SpotlightHeatmapCard } from './SpotlightHeatmapCard';
import { SpotlightMetricCard } from './SpotlightMetricCard';
import { SpotlightChartCard } from './SpotlightChartCard';
import { SpotlightLeaderboard } from './SpotlightLeaderboard';
import { SpotlightInsightCard } from './SpotlightInsightCard';
import { SpotlightHealthCard } from './SpotlightHealthCard';
import { SpotlightEmptyState } from './SpotlightEmptyState';

interface SpotlightWidgetRendererProps {
  section: IntelligenceSectionId;
  intel: SpotlightIntelligenceState;
  widgetIds?: string[];
}

/** Pluggable widget renderer — assembles dashboards from registries (Phase 5.4) */
export function SpotlightWidgetRenderer({ section, intel, widgetIds }: SpotlightWidgetRendererProps) {
  const ids = widgetIds ?? INTELLIGENCE_LAYOUT_REGISTRY[section] ?? [];

  return (
    <div className="space-y-6">
      {ids.map((widgetId) => {
        const def = getWidgetDefinition(widgetId);
        if (!def) return null;

        if (widgetId === 'mission-control-grid') {
          return <SpotlightMissionControl key={widgetId} data={intel.missionControl} />;
        }
        if (widgetId === 'funnel-analytics') {
          return (
            <div key={widgetId} className="bg-white border border-[#e8edf2] rounded-xl p-6">
              <SpotlightFunnelChart steps={intel.funnel} title="Conversion Funnel" />
            </div>
          );
        }
        if (widgetId === 'heatmap-grid') {
          return (
            <div key={widgetId} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {intel.heatmaps.map((hm) => (
                <SpotlightHeatmapCard key={hm.kind} title={hm.title} kind={hm.kind} cells={hm.cells} description={hm.description} />
              ))}
            </div>
          );
        }
        if (widgetId === 'views-trend-chart') {
          return (
            <SpotlightChartCard
              key={widgetId}
              title="Views Over Time"
              data={intel.overview.viewsTrend}
              chartKind="area"
            />
          );
        }
        if (widgetId === 'discovery-timeline') {
          return (
            <SpotlightChartCard
              key={widgetId}
              title="Discovery Timeline"
              data={intel.discoveryTimeline}
              chartKind="line"
            />
          );
        }
        if (widgetId === 'creator-leaderboard') {
          return <SpotlightLeaderboard key={widgetId} title="Top Creators" rows={intel.leaderboards.creators} />;
        }
        if (widgetId === 'campaign-leaderboard') {
          return <SpotlightLeaderboard key={widgetId} title="Top Campaigns" rows={intel.leaderboards.campaigns} />;
        }
        if (widgetId === 'leaderboard-grid') {
          return (
            <div key={widgetId} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SpotlightLeaderboard title="Top Campaigns" rows={intel.leaderboards.campaigns} />
              <SpotlightLeaderboard title="Top Creators" rows={intel.leaderboards.creators} />
            </div>
          );
        }
        if (widgetId === 'insight-panels') {
          return (
            <div key={widgetId} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {intel.insights.slice(0, 6).map((ins) => (
                <SpotlightInsightCard key={ins.id} {...ins} value={ins.value} metricHint={ins.metricHint} variant={ins.id === 'needs_attention' || ins.id === 'weak_content' ? 'alert' : ins.id === 'ai_placeholder' ? 'ai' : 'default'} />
              ))}
            </div>
          );
        }
        if (widgetId === 'health-center') {
          return (
            <SpotlightHealthCard
              key={widgetId}
              title="Platform Health"
              overallScore={intel.trustHealth.health}
              factors={[
                { label: 'SEO Score', score: intel.trustHealth.seo },
                { label: 'Accessibility', score: intel.trustHealth.accessibility },
                { label: 'Media Completeness', score: intel.trustHealth.mediaCompleteness },
                { label: 'Commerce Completeness', score: intel.trustHealth.commerce },
                { label: 'Freshness', score: intel.trustHealth.freshness },
                { label: 'AI Readiness', score: intel.trustHealth.ai },
              ]}
            />
          );
        }

        return (
          <div key={widgetId} className="bg-[#F8FBFD] border border-dashed border-[#e8edf2] rounded-lg p-4 text-xs text-gray-400">
            Widget <strong className="text-navy">{def.title}</strong> — rendered via section view
          </div>
        );
      })}
      {!ids.length && <SpotlightEmptyState title="No widgets" description="No widgets registered for this section." />}
    </div>
  );
}
