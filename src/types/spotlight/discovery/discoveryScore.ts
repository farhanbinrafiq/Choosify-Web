/**
 * Universal DiscoveryScore (CTO) — architecture for ranking across Spotlight.
 * Combines freshness, engagement, trust, quality, editorial priority, AI relevance, sponsored boost.
 */

export interface SpotlightDiscoveryScoreFactors {
  freshness: number;
  engagement: number;
  trust: number;
  quality: number;
  editorialPriority: number;
  aiRelevance: number;
  /** Clearly labeled sponsored boost — separate from organic score */
  sponsoredBoost: number;
}

export interface SpotlightDiscoveryScore {
  /** Composite 0–100 ranking score */
  overall: number;
  /** Organic score excluding sponsored boost */
  organic: number;
  factors: SpotlightDiscoveryScoreFactors;
  /** When score was computed */
  computedAt: string;
}

export const EMPTY_DISCOVERY_SCORE_FACTORS: SpotlightDiscoveryScoreFactors = {
  freshness: 0,
  engagement: 0,
  trust: 0,
  quality: 0,
  editorialPriority: 0,
  aiRelevance: 0,
  sponsoredBoost: 0,
};
