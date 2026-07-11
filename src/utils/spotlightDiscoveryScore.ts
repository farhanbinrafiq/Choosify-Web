import type { SpotlightContent } from '../types/spotlight/experience/content';
import type { SpotlightDiscoveryScore, SpotlightDiscoveryScoreFactors } from '../types/spotlight/discovery/discoveryScore';

const MS_DAY = 86_400_000;
const MS_WEEK = MS_DAY * 7;

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

function freshnessScore(publishedAt: string): number {
  const age = Date.now() - new Date(publishedAt).getTime();
  if (age < MS_DAY) return 100;
  if (age < MS_WEEK) return 85;
  if (age < MS_WEEK * 4) return 65;
  return 40;
}

export function computeDiscoveryScore(content: SpotlightContent): SpotlightDiscoveryScore {
  const factors: SpotlightDiscoveryScoreFactors = {
    freshness: freshnessScore(content.publishedAt),
    engagement: clamp(content.popularityScore ?? 50),
    trust: content.isVerified ? 90 : content.publisher.trustScore ?? 60,
    quality: clamp(content.aiScore ?? content.publisher.reputation ?? 70),
    editorialPriority: content.isSponsored ? 75 : clamp((content.popularityScore ?? 50) * 0.8),
    aiRelevance: clamp(content.aiScore ?? 50),
    sponsoredBoost: content.isSponsored ? 15 : 0,
  };

  const organic = clamp(
    factors.freshness * 0.2 +
      factors.engagement * 0.25 +
      factors.trust * 0.15 +
      factors.quality * 0.15 +
      factors.editorialPriority * 0.1 +
      factors.aiRelevance * 0.15,
  );

  return {
    overall: clamp(organic + factors.sponsoredBoost),
    organic,
    factors,
    computedAt: new Date().toISOString(),
  };
}

export function enrichContentWithDiscoveryScore(content: SpotlightContent): SpotlightContent {
  return { ...content, discoveryScore: computeDiscoveryScore(content) };
}

export function sortByDiscoveryScore(a: SpotlightContent, b: SpotlightContent): number {
  return (b.discoveryScore?.overall ?? 0) - (a.discoveryScore?.overall ?? 0);
}
