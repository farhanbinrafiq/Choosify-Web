# Optimization Engine — LE-005 Phase 5.5

Client-side audit and recommendation engine that powers the Spotlight Opportunity Center. **No AI generation** in Phase 5.5 — this layer identifies gaps and coaches publishers toward higher-quality Spotlight experiences.

---

## Engine location

`src/utils/spotlightOpportunityEngine.ts`

Primary entry points:

| Function | Output |
|----------|--------|
| `auditCampaign()` | Failed rules + opportunity instances for one campaign |
| `auditAllCampaigns()` | Flat list across all campaigns |
| `buildCampaignScorecard()` | 9 dimension scores + overall |
| `buildContentScorecard()` | Fallback for non-campaign content |
| `buildChecklist()` | Checklist items with pass/fail |
| `buildPublishingReadiness()` | Readiness gates (ready, needs SEO, etc.) |
| `estimateTotalImpact()` | Sum of open opportunity impact % |
| `groupOpportunitiesByAuditType()` | Content / Commerce / Discovery / Health groups |

---

## Audit pipeline

```
Campaign record + Experience draft blocks
        ↓
Run AUDIT_REGISTRY rules (33 rules)
        ↓
Collect failed rule IDs
        ↓
Map failures → SPOTLIGHT_OPPORTUNITY_REGISTRY (33 definitions)
        ↓
Instantiate SpotlightOpportunityInstance per campaign/entity
        ↓
Apply workflow filters + recommendation panels
```

### Input sources

- **Campaign metadata** — `listIntelligenceCampaigns()` from intelligence data layer
- **Experience blocks** — `experienceDraft` from wizard localStorage when campaign ID matches
- **Catalog state** — products, creators via `GlobalStateContext`
- **Content inventory** — `useSpotlightExperience()` for guides/reviews

---

## Audit types

| Audit type | Rules | Examples |
|------------|-------|----------|
| Content | 10+ | Hero, comparison, guide, review, creator, brand |
| Commerce | 8 | Products, CTA, buy, compare, wishlist, offers, cross-sell, bundle |
| Discovery | 8 | SEO, meta, schema, tags, categories, collections, series, featured |
| Health | 4 | Trust, freshness, localization, accessibility |
| Publishing | 2 | Expiring schedule, AI readiness |

Rules are defined in `auditRegistry.ts` and evaluated in the engine without duplicating logic in UI components.

---

## Opportunity instantiation

Each failed audit rule maps to an opportunity definition via `auditRuleId`. Definitions include:

- Title, description, category, severity, priority
- **coachingMessage** — Publisher Success Coach copy
- **suggestedAction** — next step label
- **estimatedImpactPercent** — engagement/conversion uplift estimate
- **effort** — low / medium / high
- **futureAiCapability** — optional Emi action ID (Phase 5.6)

---

## Recommendation panels

`recommendationRegistry.ts` defines 8 panel groups with filter predicates:

1. Top Opportunities
2. Quick Wins
3. Highest ROI
4. Low Effort
5. Critical Issues
6. Expiring Campaigns
7. Stale Content
8. Underperforming

`getPanelOpportunities()` applies filters and caps at 6 items per panel.

---

## Optimization checklist

`checklistRegistry.ts` — 14 reusable items across media, SEO, commerce, discovery, creator, brand, accessibility, and trust.

`buildChecklist(failedRules, editUrl)` marks items complete when the corresponding audit rule passes.

---

## Hook integration

`useSpotlightOpportunityCenter()` orchestrates:

- Campaign-wide audit across all intelligence campaigns
- Client-side workflow state (dismiss, resolve, pin, complete, archive)
- Filter state (entity type, category, priority, status, campaign)
- Scorecard/readiness for primary campaign
- Panel aggregation for dashboard sections

---

## Phase 5.6 extension points

| Extension | Registry / field |
|-----------|------------------|
| Auto-fix actions | `emiActionRegistry.ts` |
| Per-opportunity AI | `futureAiCapability` on definitions |
| Persisted workflow | Replace session state with backend (future) |
| Real impact tracking | Connect to intelligence metrics post-fix |

---

## Design principles

1. **Registry-first** — add opportunities by extending registries, not scattering conditionals
2. **Coaching over warnings** — every opportunity teaches, not scolds
3. **Reuse intelligence data** — no parallel campaign store
4. **Frontend-only** — safe for ChatGPT review without backend risk
