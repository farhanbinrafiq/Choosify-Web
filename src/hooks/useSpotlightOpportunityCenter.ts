import { useCallback, useMemo, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useSpotlightExperience } from './useSpotlightExperience';
import { listIntelligenceCampaigns } from '../utils/spotlightIntelligenceData';
import type { OpportunityCenterFilters, OpportunityWorkflowStatus, SpotlightOpportunityInstance } from '../types/spotlight/opportunity';
import {
  auditCampaign,
  buildCampaignScorecard,
  buildChecklist,
  buildContentScorecard,
  buildPublishingReadiness,
  estimateTotalImpact,
  groupOpportunitiesByAuditType,
} from '../utils/spotlightOpportunityEngine';
import { getPanelOpportunities, RECOMMENDATION_PANEL_REGISTRY } from '../lib/spotlight/opportunity/recommendationRegistry';
import { loadWizardDraft } from '../services/spotlightCampaignStorage';

const DEFAULT_FILTERS: OpportunityCenterFilters = {
  entityType: 'all',
  category: 'all',
  priority: 'all',
  status: 'open',
};

export function useSpotlightOpportunityCenter() {
  const { allCatalogProducts, allCreators } = useGlobalState();
  const { allContent } = useSpotlightExperience();
  const [filters, setFilters] = useState<OpportunityCenterFilters>(DEFAULT_FILTERS);
  const [workflowState, setWorkflowState] = useState<Record<string, OpportunityWorkflowStatus>>({});

  const campaigns = useMemo(() => listIntelligenceCampaigns(), []);

  const rawOpportunities = useMemo(() => {
    const wizardDraft = loadWizardDraft();
    return campaigns.flatMap((c) => {
      const draft = wizardDraft?.campaignId === c.campaignId ? wizardDraft.experienceDraft : undefined;
      return auditCampaign({ campaign: c, experienceDraft: draft }).opportunities;
    });
  }, [campaigns]);

  const opportunities = useMemo(() => {
    return rawOpportunities.map((o) => ({
      ...o,
      status: workflowState[o.opportunityId] ?? o.status,
    }));
  }, [rawOpportunities, workflowState]);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (filters.entityType && filters.entityType !== 'all' && o.entityType !== filters.entityType) return false;
      if (filters.category && filters.category !== 'all' && o.category !== filters.category) return false;
      if (filters.priority && filters.priority !== 'all' && o.priority !== filters.priority) return false;
      if (filters.status && filters.status !== 'all' && o.status !== filters.status) return false;
      if (filters.campaignId && o.entityId !== filters.campaignId) return false;
      return true;
    });
  }, [opportunities, filters]);

  const auditGroups = useMemo(() => groupOpportunitiesByAuditType(filtered), [filtered]);

  const panels = useMemo(() => {
    const open = opportunities.filter((o) => o.status === 'open');
    return RECOMMENDATION_PANEL_REGISTRY.map((p) => ({
      ...p,
      opportunities: getPanelOpportunities(p.id, open),
    }));
  }, [opportunities]);

  const primaryCampaign = campaigns[0];
  const primaryAudit = primaryCampaign
    ? auditCampaign({ campaign: primaryCampaign, experienceDraft: loadWizardDraft()?.experienceDraft })
    : { failedRules: new Set<string>(), opportunities: [] };

  const scorecard = useMemo(() => {
    if (primaryCampaign) return buildCampaignScorecard(primaryCampaign, primaryAudit.failedRules);
    if (allContent[0]) return buildContentScorecard(allContent[0]);
    return { discovery: 0, trust: 0, commerce: 0, seo: 0, accessibility: 0, media: 0, health: 0, readiness: 0, overall: 0 };
  }, [primaryCampaign, primaryAudit.failedRules, allContent]);

  const checklist = useMemo(
    () => buildChecklist(primaryAudit.failedRules, primaryCampaign ? `/marketing/studio/${primaryCampaign.campaignId}` : undefined),
    [primaryAudit.failedRules, primaryCampaign],
  );

  const readiness = useMemo(
    () => (primaryCampaign ? buildPublishingReadiness(primaryAudit.failedRules, primaryCampaign.status) : []),
    [primaryAudit.failedRules, primaryCampaign],
  );

  const estimatedImpact = useMemo(() => estimateTotalImpact(opportunities), [opportunities]);
  const openCount = opportunities.filter((o) => o.status === 'open').length;
  const topRecommendation = opportunities.filter((o) => o.status === 'open').sort((a, b) => b.estimatedImpactPercent - a.estimatedImpactPercent)[0];

  const setWorkflow = useCallback((id: string, status: OpportunityWorkflowStatus) => {
    setWorkflowState((prev) => ({ ...prev, [id]: status }));
  }, []);

  const dismiss = useCallback((id: string) => setWorkflow(id, 'dismissed'), [setWorkflow]);
  const resolve = useCallback((id: string) => setWorkflow(id, 'resolved'), [setWorkflow]);
  const pin = useCallback((id: string) => setWorkflow(id, 'pinned'), [setWorkflow]);
  const complete = useCallback((id: string) => setWorkflow(id, 'complete'), [setWorkflow]);
  const archive = useCallback((id: string) => setWorkflow(id, 'archived'), [setWorkflow]);

  const updateFilters = useCallback((patch: Partial<OpportunityCenterFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    filters,
    updateFilters,
    resetFilters,
    opportunities: filtered,
    allOpportunities: opportunities,
    auditGroups,
    panels,
    scorecard,
    checklist,
    readiness,
    estimatedImpact,
    openCount,
    topRecommendation,
    campaigns,
    allContent,
    allCreators,
    allCatalogProducts,
    dismiss,
    resolve,
    pin,
    complete,
    archive,
  };
}

export type SpotlightOpportunityCenterState = ReturnType<typeof useSpotlightOpportunityCenter>;
