/**
 * Spotlight Opportunity Center — LE-005 Phase 5.5
 * Operational layer between Intelligence and Emi AI.
 */

export type OpportunityCategory =
  | 'content_quality'
  | 'seo'
  | 'commerce'
  | 'media'
  | 'creator'
  | 'brand'
  | 'discovery'
  | 'trust'
  | 'health'
  | 'localization'
  | 'accessibility'
  | 'publishing'
  | 'ai_readiness';

export type OpportunitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type OpportunityPriority = 'critical' | 'high' | 'medium' | 'low';

export type OpportunityWorkflowStatus =
  | 'open'
  | 'dismissed'
  | 'resolved'
  | 'pinned'
  | 'assigned'
  | 'archived'
  | 'complete';

export type ReadinessGate =
  | 'ready_to_publish'
  | 'needs_review'
  | 'needs_media'
  | 'needs_seo'
  | 'needs_commerce'
  | 'needs_approval'
  | 'needs_localization'
  | 'needs_products';

export type OpportunityEntityType =
  | 'campaign'
  | 'guide'
  | 'review'
  | 'video'
  | 'content'
  | 'collection'
  | 'series';

export interface SpotlightOpportunityDefinition {
  id: string;
  title: string;
  description: string;
  /** Publisher Success Coach — actionable guidance (CTO upgrade) */
  coachingMessage: string;
  category: OpportunityCategory;
  severity: OpportunitySeverity;
  priority: OpportunityPriority;
  owner: 'publisher' | 'brand' | 'creator' | 'admin';
  suggestedAction: string;
  estimatedImpactPercent: number;
  effort: 'low' | 'medium' | 'high';
  futureAiCapability?: string;
  auditRuleId: string;
}

export interface SpotlightOpportunityInstance {
  opportunityId: string;
  definitionId: string;
  entityType: OpportunityEntityType;
  entityId: string;
  entityLabel: string;
  title: string;
  coachingMessage: string;
  category: OpportunityCategory;
  severity: OpportunitySeverity;
  priority: OpportunityPriority;
  suggestedAction: string;
  estimatedImpactPercent: number;
  effort: 'low' | 'medium' | 'high';
  status: OpportunityWorkflowStatus;
  futureAiCapability?: string;
  href?: string;
}

export interface OptimizationChecklistItem {
  id: string;
  label: string;
  category: OpportunityCategory;
  completed: boolean;
  href?: string;
}

export interface SpotlightScorecard {
  discovery: number;
  trust: number;
  commerce: number;
  seo: number;
  accessibility: number;
  media: number;
  health: number;
  readiness: number;
  overall: number;
}

export interface PublishingReadiness {
  gate: ReadinessGate;
  label: string;
  met: boolean;
  blockers: string[];
}

export interface OpportunityPanelGroup {
  id: string;
  title: string;
  description: string;
  filter: (o: SpotlightOpportunityInstance) => boolean;
}

export interface OpportunityCenterFilters {
  entityType?: OpportunityEntityType | 'all';
  category?: OpportunityCategory | 'all';
  priority?: OpportunityPriority | 'all';
  status?: OpportunityWorkflowStatus | 'all';
  campaignId?: string;
  brandId?: string;
  creatorId?: string;
}
