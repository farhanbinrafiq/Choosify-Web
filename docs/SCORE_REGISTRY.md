# Score Registry

LE-005 Phase 5.4 — Reusable Spotlight score definitions and resolvers.

## Location

`src/lib/spotlight/intelligence/scoreRegistry.ts`

## Scores (9)

| ID | Title | Source | Resolver |
|----|-------|--------|----------|
| discovery | Discovery Score | ES-010 | `resolveDiscoveryScore()` |
| trust | Trust Score | ES-009 | `resolveTrustScore()` |
| health | Health Score | computed | `resolveHealthScore()` |
| growth | Growth Score | computed | `resolveGrowthScore()` |
| commerce | Commerce Score | ES-008 | `resolveCommerceScore()` |
| engagement | Engagement Score | ES-008 | `resolveEngagementScore()` |
| quality | Quality Score | computed | `resolveQualityScore()` |
| readiness | Readiness Score | computed | `resolveReadinessScore()` |
| ai | AI Readiness Score | computed | `resolveAiReadinessScore()` |

## Contract

```typescript
interface IntelligenceScoreDefinition {
  id: ScoreKind;
  title: string;
  description: string;
  formula: string;
  source: 'ES-009' | 'ES-010' | 'ES-008' | 'computed';
  maxValue: number;
}
```

## UI Component

`SpotlightScoreCard` reads definitions from this registry and renders progress bars with drill-down links.

## Future

Phase 5.5 (Emi AI) will use `ai` and `readiness` scores to recommend publishing actions.
