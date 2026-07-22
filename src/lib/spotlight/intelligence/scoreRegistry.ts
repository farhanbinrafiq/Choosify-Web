import type { IntelligenceScoreDefinition, ScoreKind } from '../../../types/spotlight/intelligence';
import { computeDiscoveryScore } from '../../../utils/spotlightDiscoveryScore';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';

/** Score registry — one source of truth for all Spotlight scores */
export const SCORE_REGISTRY: IntelligenceScoreDefinition[] = [
  { id: 'discovery', title: 'Discovery Score', description: 'Freshness, engagement, trust, quality, editorial, AI relevance', formula: 'weighted factors + optional sponsored boost', source: 'ES-010', maxValue: 100 },
  { id: 'trust', title: 'Trust Score', description: 'Verification, reputation, moderation signals', formula: 'ES-009 trust aggregate', source: 'ES-009', maxValue: 100 },
  { id: 'health', title: 'Health Score', description: 'Catalog readiness, media completeness, stock', formula: 'product health + campaign quality', source: 'computed', maxValue: 100 },
  { id: 'growth', title: 'Growth Score', description: 'Momentum vs prior period', formula: 'normalized growth percentile', source: 'computed', maxValue: 100 },
  { id: 'commerce', title: 'Commerce Score', description: 'CTR, conversions, revenue attribution', formula: 'commerce funnel composite', source: 'ES-008', maxValue: 100 },
  { id: 'engagement', title: 'Engagement Score', description: 'Watch time, completion, shares', formula: 'engagement event weights', source: 'ES-008', maxValue: 100 },
  { id: 'quality', title: 'Quality Score', description: 'Content, media, and SEO quality', formula: 'quality factors composite', source: 'computed', maxValue: 100 },
  { id: 'readiness', title: 'Readiness Score', description: 'Publishing pipeline readiness', formula: 'blocks + merchandising + metadata', source: 'computed', maxValue: 100 },
  { id: 'ai', title: 'AI Readiness Score', description: 'Future Emi. A.I integration readiness', formula: 'placeholder — metadata completeness', source: 'computed', maxValue: 100 },
];

export function getScoreDefinition(kind: ScoreKind): IntelligenceScoreDefinition {
  return SCORE_REGISTRY.find((s) => s.id === kind)!;
}

export function resolveDiscoveryScore(content: SpotlightContent): number {
  return computeDiscoveryScore(content).overall;
}

export function resolveTrustScore(content: SpotlightContent): number {
  return content.isVerified ? 92 : Math.min(100, content.publisher.trustScore ?? content.publisher.reputation ?? 65);
}

export function resolveHealthScore(seed: number, warnings = 0): number {
  return Math.max(0, Math.min(100, seed - warnings * 8));
}

export function resolveCommerceScore(ctr: number, conversionRate: number): number {
  return Math.min(100, ctr * 8 + conversionRate * 40);
}

export function resolveEngagementScore(completionRate: number, avgWatchSec: number): number {
  return Math.min(100, completionRate * 0.6 + Math.min(avgWatchSec / 120, 1) * 40);
}

export function resolveGrowthScore(changePercent: number): number {
  return Math.min(100, Math.max(0, 50 + changePercent));
}

export function resolveAiReadinessScore(hasMetadata: boolean, hasMedia: boolean): number {
  return (hasMetadata ? 50 : 20) + (hasMedia ? 50 : 10);
}

export function resolveQualityScore(seoScore: number, mediaScore: number, contentScore: number): number {
  return Math.round(seoScore * 0.25 + mediaScore * 0.35 + contentScore * 0.4);
}

export function resolveReadinessScore(hasBlocks: boolean, hasProducts: boolean, hasSeo: boolean): number {
  return (hasBlocks ? 35 : 10) + (hasProducts ? 35 : 10) + (hasSeo ? 30 : 5);
}
