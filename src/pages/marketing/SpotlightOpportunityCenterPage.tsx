import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, BarChart3, Megaphone } from 'lucide-react';
import { useSpotlightOpportunityCenter } from '../../hooks/useSpotlightOpportunityCenter';
import {
  SpotlightAuditCard,
  SpotlightChecklist,
  SpotlightOptimizationPanel,
  SpotlightReadinessCard,
  SpotlightRecommendationCard,
  SpotlightScoreGauge,
} from '../../components/spotlight/opportunity';
import { SpotlightDashboardSection } from '../../components/spotlight/intelligence/SpotlightDashboardSection';
import { EmiPublisherPanel } from '../../components/emi/EmiPublisherPanel';
import { buildPageContext } from '../../lib/emi/emiContextEngine';
import { opportunitiesByCategory } from '../../lib/spotlight/opportunity/opportunityRegistry';
import type { OpportunityCategory, OpportunityCenterFilters } from '../../types/spotlight/opportunity';

const CATEGORIES: { value: OpportunityCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'content_quality', label: 'Content' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'seo', label: 'SEO' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'media', label: 'Media' },
  { value: 'trust', label: 'Trust' },
  { value: 'health', label: 'Health' },
];

export default function SpotlightOpportunityCenterPage() {
  const center = useSpotlightOpportunityCenter();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy uppercase italic flex items-center gap-2">
            <Lightbulb size={24} className="text-[#E8500A]" aria-hidden />
            Spotlight Opportunity Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            What should you improve next? Actionable recommendations — not just analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/marketing/intelligence" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400 hover:text-[#E8500A]">
            <BarChart3 size={12} aria-hidden /> Intelligence
          </Link>
          <Link to="/marketing/studio" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400 hover:text-[#E8500A]">
            <Megaphone size={12} aria-hidden /> Publisher Studio
          </Link>
        </div>
      </div>

      <SpotlightRecommendationCard
        estimatedTotalImpact={center.estimatedImpact}
        missingCount={center.openCount}
      />

      {center.topRecommendation && (
        <SpotlightRecommendationCard opportunity={center.topRecommendation} />
      )}

      <div className="bg-white border border-[#e8edf2] rounded-lg p-3 flex flex-wrap gap-3 items-center">
        <select
          value={center.filters.campaignId ?? ''}
          onChange={(e) => center.updateFilters({ campaignId: e.target.value || undefined })}
          className="text-xs border border-[#e8edf2] rounded px-2 py-1.5 min-w-[140px]"
          aria-label="Filter by campaign"
        >
          <option value="">All Campaigns</option>
          {center.campaigns.map((c) => (
            <option key={c.campaignId} value={c.campaignId}>{c.campaignName}</option>
          ))}
        </select>
        <select
          value={center.filters.category ?? 'all'}
          onChange={(e) => center.updateFilters({ category: e.target.value as OpportunityCenterFilters['category'] })}
          className="text-xs border border-[#e8edf2] rounded px-2 py-1.5"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={center.filters.priority ?? 'all'}
          onChange={(e) => center.updateFilters({ priority: e.target.value as OpportunityCenterFilters['priority'] })}
          className="text-xs border border-[#e8edf2] rounded px-2 py-1.5"
          aria-label="Filter by priority"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={center.filters.status ?? 'open'}
          onChange={(e) => center.updateFilters({ status: e.target.value as OpportunityCenterFilters['status'] })}
          className="text-xs border border-[#e8edf2] rounded px-2 py-1.5"
          aria-label="Filter by status"
        >
          <option value="open">Open</option>
          <option value="pinned">Pinned</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
          <option value="all">All Status</option>
        </select>
        <button type="button" onClick={center.resetFilters} className="text-[10px] font-bold uppercase text-gray-400 hover:text-[#E8500A] ml-auto">
          Reset
        </button>
      </div>

      <SpotlightDashboardSection title="Content Scorecard" description="Overall Spotlight quality scores">
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4 bg-white border border-[#e8edf2] rounded-xl p-6">
          <SpotlightScoreGauge label="Overall" value={center.scorecard.overall} size="lg" />
          <SpotlightScoreGauge label="Discovery" value={center.scorecard.discovery} />
          <SpotlightScoreGauge label="Trust" value={center.scorecard.trust} />
          <SpotlightScoreGauge label="Commerce" value={center.scorecard.commerce} />
          <SpotlightScoreGauge label="SEO" value={center.scorecard.seo} />
          <SpotlightScoreGauge label="Media" value={center.scorecard.media} />
          <SpotlightScoreGauge label="Health" value={center.scorecard.health} />
          <SpotlightScoreGauge label="Readiness" value={center.scorecard.readiness} />
          <SpotlightScoreGauge label="A11y" value={center.scorecard.accessibility} />
        </div>
      </SpotlightDashboardSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpotlightChecklist items={center.checklist} />
        <SpotlightReadinessCard gates={center.readiness} />
      </div>

      <SpotlightDashboardSection title="Content, Commerce & Discovery Audits">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightAuditCard title="Content Audit" description="Hero, media, guides, reviews" opportunities={center.auditGroups.content} icon="📝" />
          <SpotlightAuditCard title="Commerce Audit" description="Products, CTA, compare, offers" opportunities={center.auditGroups.commerce} icon="🛒" />
          <SpotlightAuditCard title="Discovery Audit" description="SEO, tags, collections, placement" opportunities={center.auditGroups.discovery} icon="🔍" />
          <SpotlightAuditCard title="Health Audit" description="Trust, freshness, AI readiness" opportunities={center.auditGroups.health} icon="💚" />
        </div>
      </SpotlightDashboardSection>

      {center.panels.slice(0, 4).map((panel) => (
        <SpotlightOptimizationPanel
          key={panel.id}
          title={panel.title}
          description={panel.description}
          opportunities={panel.opportunities}
          onDismiss={center.dismiss}
          onResolve={center.resolve}
          onPin={center.pin}
        />
      ))}

      <SpotlightDashboardSection title="Emi Publisher Assistant" description="Contextual optimization suggestions">
        <EmiPublisherPanel context={buildPageContext('/marketing/opportunity', { pageId: 'opportunity_center' })} />
      </SpotlightDashboardSection>

      <div className="text-[9px] text-gray-400 border-t border-[#e8edf2] pt-4">
        {opportunitiesByCategory('content_quality').length}+ opportunity types · Emi AI Publisher Success Coach active
      </div>
    </div>
  );
}
