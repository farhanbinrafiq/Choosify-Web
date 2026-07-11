/**
 * Unified Publisher Reputation (CTO) — one trust framework for all publisher types
 */

import type { SpotlightPublisherProfileType } from './profile';

export type SpotlightReputationTier =
  | 'emerging'
  | 'trusted'
  | 'established'
  | 'premier'
  | 'official';

export interface SpotlightUnifiedReputation {
  entityId: string;
  entityType: SpotlightPublisherProfileType;
  /** 0–100 composite score */
  score: number;
  tier: SpotlightReputationTier;
  factors: {
    verification: number;
    contentQuality: number;
    engagement: number;
    commerceOutcomes: number;
    collaborationTrust: number;
    moderationHistory: number;
  };
  calculatedAt: string;
}

export function resolveReputationTier(score: number): SpotlightReputationTier {
  if (score >= 90) return 'official';
  if (score >= 75) return 'premier';
  if (score >= 60) return 'established';
  if (score >= 40) return 'trusted';
  return 'emerging';
}

export function buildDefaultReputation(
  entityId: string,
  entityType: SpotlightPublisherProfileType,
  baseScore = 65,
): SpotlightUnifiedReputation {
  const score = Math.min(100, Math.max(0, baseScore));
  return {
    entityId,
    entityType,
    score,
    tier: resolveReputationTier(score),
    factors: {
      verification: entityType === 'brand' ? 80 : 60,
      contentQuality: 65,
      engagement: 55,
      commerceOutcomes: 50,
      collaborationTrust: 60,
      moderationHistory: 90,
    },
    calculatedAt: new Date().toISOString(),
  };
}
