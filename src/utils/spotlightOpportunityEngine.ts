import type { SpotlightCampaignRecord } from '../types/spotlight/cms';
import type {
  OptimizationChecklistItem,
  SpotlightOpportunityInstance,
  SpotlightScorecard,
} from '../types/spotlight/opportunity';
import { SPOTLIGHT_OPPORTUNITY_REGISTRY, getOpportunityDefinition } from '../lib/spotlight/opportunity/opportunityRegistry';
import { CHECKLIST_REGISTRY } from '../lib/spotlight/opportunity/checklistRegistry';
import { evaluateReadiness } from '../lib/spotlight/opportunity/readinessRegistry';
import {
  resolveHealthScore,
  resolveReadinessScore,
  resolveTrustScore,
} from '../lib/spotlight/intelligence/scoreRegistry';
import { computeDiscoveryScore } from './spotlightDiscoveryScore';
import type { SpotlightContent } from '../types/spotlight/experience/content';
import { seededValue } from './spotlightIntelligenceBenchmark';

export interface CampaignAuditContext {
  campaign: SpotlightCampaignRecord;
  experienceDraft?: { blocks?: { type: string }[]; seo?: { metaDescription?: string; slug?: string }; discovery?: { tags?: string[]; featured?: boolean } };
}

function hasBlockType(blocks: { type: string }[] | undefined, ...types: string[]): boolean {
  if (!blocks?.length) return false;
  return types.some((t) => blocks.some((b) => b.type === t || b.type.includes(t)));
}

export function auditCampaign(ctx: CampaignAuditContext): { failedRules: Set<string>; opportunities: SpotlightOpportunityInstance[] } {
  const { campaign, experienceDraft } = ctx;
  const blocks = experienceDraft?.blocks ?? [];
  const failed = new Set<string>();
  const now = Date.now();
  const weekMs = 7 * 86400000;

  const checks: { ruleId: string; defId: string; pass: boolean }[] = [
    { ruleId: 'content.hero', defId: 'missing_hero', pass: Boolean(campaign.headline?.trim()) },
    { ruleId: 'media.thumbnail', defId: 'missing_thumbnail', pass: campaign.media.length > 0 },
    { ruleId: 'media.video', defId: 'missing_video', pass: hasBlockType(blocks, 'video', 'embed_youtube', 'embedded_video') },
    { ruleId: 'media.gallery', defId: 'missing_gallery', pass: hasBlockType(blocks, 'gallery', 'single_image') },
    { ruleId: 'content.comparison', defId: 'missing_comparison', pass: hasBlockType(blocks, 'comparison_table', 'pros_cons', 'compare_table') },
    { ruleId: 'content.guide', defId: 'missing_guide', pass: hasBlockType(blocks, 'checklist', 'faq', 'feature_list') },
    { ruleId: 'content.review', defId: 'missing_review', pass: hasBlockType(blocks, 'quote', 'pros_cons') || campaign.campaignType.includes('review') },
    { ruleId: 'content.live', defId: 'missing_live', pass: hasBlockType(blocks, 'live_session', 'replay') || campaign.campaignType === 'livestream' },
    { ruleId: 'commerce.products', defId: 'missing_products', pass: campaign.linkedProductIds.length > 0 },
    { ruleId: 'commerce.cta', defId: 'missing_cta', pass: Boolean(campaign.cta?.label?.trim()) || hasBlockType(blocks, 'cta', 'button') },
    { ruleId: 'commerce.buy', defId: 'missing_buy_button', pass: /shop|buy/i.test(campaign.cta?.label ?? '') || hasBlockType(blocks, 'cta') },
    { ruleId: 'commerce.compare', defId: 'missing_compare', pass: hasBlockType(blocks, 'compare_table', 'comparison_table') },
    { ruleId: 'commerce.wishlist', defId: 'missing_wishlist', pass: hasBlockType(blocks, 'wishlist') },
    { ruleId: 'commerce.offers', defId: 'missing_offers', pass: hasBlockType(blocks, 'offer', 'coupon') },
    { ruleId: 'commerce.cross_sell', defId: 'missing_cross_sell', pass: campaign.linkedProductIds.length >= 2 },
    { ruleId: 'commerce.bundle', defId: 'missing_bundle', pass: hasBlockType(blocks, 'bundle') },
    { ruleId: 'seo.basic', defId: 'missing_seo', pass: Boolean(campaign.campaignSlug?.trim()) },
    { ruleId: 'seo.meta', defId: 'missing_meta', pass: Boolean(campaign.shortDescription?.trim() || experienceDraft?.seo?.metaDescription?.trim()) },
    { ruleId: 'seo.schema', defId: 'missing_schema', pass: Boolean(experienceDraft?.seo?.slug) },
    { ruleId: 'discovery.tags', defId: 'missing_tags', pass: (campaign.campaignTags?.length ?? 0) >= 3 || (experienceDraft?.discovery?.tags?.length ?? 0) >= 3 },
    { ruleId: 'discovery.categories', defId: 'missing_categories', pass: campaign.linkedCategoryIds.length > 0 },
    { ruleId: 'discovery.collections', defId: 'missing_collections', pass: false },
    { ruleId: 'discovery.series', defId: 'missing_series', pass: false },
    { ruleId: 'discovery.featured', defId: 'missing_featured', pass: Boolean(campaign.isSponsored || experienceDraft?.discovery?.featured) },
    { ruleId: 'discovery.related', defId: 'missing_related', pass: hasBlockType(blocks, 'related_content') },
    { ruleId: 'creator.collaboration', defId: 'missing_creator', pass: campaign.campaignType.includes('creator') },
    { ruleId: 'brand.link', defId: 'missing_brand', pass: campaign.linkedBrandIds.length > 0 || Boolean(campaign.brandName) },
    { ruleId: 'trust.score', defId: 'low_trust', pass: (campaign.campaignHealthScore ?? 75) >= 70 },
    { ruleId: 'health.freshness', defId: 'stale_content', pass: now - new Date(campaign.updatedAt).getTime() < 30 * 86400000 },
    { ruleId: 'localization.missing', defId: 'missing_localization', pass: false },
    { ruleId: 'accessibility.alt', defId: 'accessibility_gaps', pass: campaign.media.length > 0 },
    { ruleId: 'publishing.expiring', defId: 'expiring_campaign', pass: !(new Date(campaign.schedule.endAt).getTime() - now < weekMs && new Date(campaign.schedule.endAt).getTime() > now) },
    { ruleId: 'ai.readiness', defId: 'ai_readiness_low', pass: blocks.length >= 3 && campaign.linkedProductIds.length > 0 },
  ];

  checks.forEach((c) => { if (!c.pass) failed.add(c.ruleId); });

  const opportunities: SpotlightOpportunityInstance[] = [];
  checks.filter((c) => !c.pass).forEach((c) => {
    const def = getOpportunityDefinition(c.defId);
    if (!def) return;
    opportunities.push({
      opportunityId: `${campaign.campaignId}-${def.id}`,
      definitionId: def.id,
      entityType: 'campaign',
      entityId: campaign.campaignId,
      entityLabel: campaign.campaignName,
      title: def.title,
      coachingMessage: def.coachingMessage,
      category: def.category,
      severity: def.severity,
      priority: def.priority,
      suggestedAction: def.suggestedAction,
      estimatedImpactPercent: def.estimatedImpactPercent,
      effort: def.effort,
      status: 'open',
      futureAiCapability: def.futureAiCapability,
      href: `/marketing/studio/${campaign.campaignId}`,
    });
  });

  return { failedRules: failed, opportunities };
}

export function auditAllCampaigns(campaigns: SpotlightCampaignRecord[]): SpotlightOpportunityInstance[] {
  return campaigns.flatMap((c) => auditCampaign({ campaign: c }).opportunities);
}

export function buildChecklist(failedRules: Set<string>, href?: string): OptimizationChecklistItem[] {
  return CHECKLIST_REGISTRY.map((item) => ({
    id: item.id,
    label: item.label,
    category: item.category,
    completed: !failedRules.has(item.auditRuleId),
    href,
  }));
}

export function buildCampaignScorecard(campaign: SpotlightCampaignRecord, failedRules: Set<string>): SpotlightScorecard {
  const health = campaign.campaignHealthScore ?? resolveHealthScore(80, failedRules.size);
  const discovery = Math.round(seededValue(`${campaign.campaignId}-disc`, 55, 92));
  const trust = Math.round(seededValue(`${campaign.campaignId}-trust`, 60, 96));
  const commerce = campaign.linkedProductIds.length > 0 ? Math.min(100, 40 + campaign.linkedProductIds.length * 12) : 25;
  const seo = failedRules.has('seo.basic') || failedRules.has('seo.meta') ? 45 : 82;
  const media = campaign.media.length > 0 ? 85 : 30;
  const accessibility = failedRules.has('accessibility.alt') ? 55 : 78;
  const readiness = resolveReadinessScore(
    !failedRules.has('content.hero'),
    !failedRules.has('commerce.products'),
    !failedRules.has('seo.basic'),
  );
  const overall = Math.round((discovery + trust + commerce + seo + media + health + readiness) / 7);
  return { discovery, trust, commerce, seo, accessibility, media, health, readiness, overall };
}

export function buildContentScorecard(content: SpotlightContent): SpotlightScorecard {
  const discovery = computeDiscoveryScore(content).overall;
  const trust = resolveTrustScore(content);
  const commerce = content.connections.productIds.length > 0 ? 75 : 30;
  const seo = content.description ? 70 : 45;
  const media = content.media ? 85 : 35;
  const health = resolveHealthScore(78);
  const accessibility = 72;
  const readiness = resolveReadinessScore(Boolean(content.headline), content.connections.productIds.length > 0, Boolean(content.description));
  const overall = Math.round((discovery + trust + commerce + seo + media + health + readiness) / 7);
  return { discovery, trust, commerce, seo, accessibility, media, health, readiness, overall };
}

export function estimateTotalImpact(opportunities: SpotlightOpportunityInstance[]): number {
  const open = opportunities.filter((o) => o.status === 'open');
  if (!open.length) return 0;
  const sum = open.reduce((acc, o) => acc + o.estimatedImpactPercent, 0);
  return Math.min(85, Math.round(sum * 0.35));
}

export function buildPublishingReadiness(failedRules: Set<string>, status: string) {
  return evaluateReadiness(failedRules, status);
}

export function groupOpportunitiesByAuditType(opportunities: SpotlightOpportunityInstance[]) {
  const contentIds = new Set(['content_quality', 'media', 'creator', 'brand', 'accessibility']);
  const commerceIds = new Set(['commerce']);
  const discoveryIds = new Set(['seo', 'discovery', 'localization']);
  return {
    content: opportunities.filter((o) => contentIds.has(o.category)),
    commerce: opportunities.filter((o) => commerceIds.has(o.category)),
    discovery: opportunities.filter((o) => discoveryIds.has(o.category)),
    health: opportunities.filter((o) => ['trust', 'health', 'publishing', 'ai_readiness'].includes(o.category)),
  };
}
