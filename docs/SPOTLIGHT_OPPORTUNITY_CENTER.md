# Spotlight Opportunity Center — LE-005 Phase 5.5

The operational bridge between **Spotlight Intelligence** (Phase 5.4) and **Emi AI** (Phase 5.6). Instead of reporting metrics alone, Spotlight answers:

> **What should I improve next?**

**Location:** Dashboard → Marketing → Opportunity Center (`/marketing/opportunity`)

---

## Vision

Publishers receive **actionable coaching recommendations**, not warnings. Every opportunity includes a **Publisher Success Coach** message that explains *why* the improvement matters and *how* it helps buyers, brands, and creators make better decisions.

Example coaching tone:

- Instead of "Missing Product Tags" → *"Increase discoverability by adding 3–5 relevant product tags. Campaigns with complete tagging typically perform better in search and Spotlight recommendations."*
- Instead of "No CTA" → *"Add a Shop Now or Compare Products button to help visitors continue their buying journey."*

---

## Architecture

```
MarketingLayout
├── Publisher Studio (/marketing/studio)
├── Spotlight Intelligence (/marketing/intelligence)
└── Spotlight Opportunity Center (/marketing/opportunity)
    ├── Content Scorecard (9 gauges)
    ├── Publishing Readiness
    ├── Optimization Checklist
    ├── Audit Panels (Content / Commerce / Discovery / Health)
    ├── Recommendation Panels (8 groups)
    ├── Opportunity Cards + Workflow
    └── Emi AI Placeholders (Phase 5.6)
```

### Layer stack

| Layer | Path | Purpose |
|-------|------|---------|
| Types | `src/types/spotlight/opportunity/` | Opportunity, audit, checklist, readiness contracts |
| Registries | `src/lib/spotlight/opportunity/` | Centralized definitions (see below) |
| Engine | `src/utils/spotlightOpportunityEngine.ts` | Audit, scorecard, checklist, readiness, impact |
| Hook | `src/hooks/useSpotlightOpportunityCenter.ts` | Filters, workflow, panel aggregation |
| Components | `src/components/spotlight/opportunity/` | Reusable UI |
| Page | `src/pages/marketing/SpotlightOpportunityCenterPage.tsx` | Full dashboard |

No backend API, Firestore schema, or breaking route changes. Data is derived from existing campaign storage, experience builder drafts, and catalog state.

---

## Opportunity Types (13 categories)

| Category | Examples |
|----------|----------|
| Content Quality | Hero, comparison, guide, review |
| SEO | Meta, schema, basic SEO panel |
| Commerce | Products, CTA, buy, compare, offers, bundles |
| Media | Thumbnail, video, gallery |
| Creator | Collaboration links |
| Brand | Brand association |
| Discovery | Tags, categories, collections, series, featured |
| Trust | Trust score threshold |
| Health | Freshness, accessibility |
| Localization | Multi-language readiness |
| Accessibility | Alt text |
| Publishing | Expiring campaigns, stale content |
| AI Readiness | Prepared for Emi AI (Phase 5.6) |

---

## Registries

| Registry | File | Count | Purpose |
|----------|------|-------|---------|
| Opportunity | `opportunityRegistry.ts` | 33 | Definitions + coaching messages |
| Audit | `auditRegistry.ts` | 33 | Content/commerce/discovery rules |
| Checklist | `checklistRegistry.ts` | 14 | Optimization checklist items |
| Recommendation | `recommendationRegistry.ts` | 8 | Panel groups (Top, Quick Wins, ROI, etc.) |
| Readiness | `readinessRegistry.ts` | 8 | Publishing gates |
| Priority | `priorityRegistry.ts` | — | Severity → priority mapping |
| Emi Actions | `emiActionRegistry.ts` | 10 | Phase 5.6 placeholder buttons |

> **Note:** Phase 5.4 also has `src/lib/spotlight/intelligence/opportunityRegistry.ts` for Mission Control panels. Phase 5.5 uses the dedicated `src/lib/spotlight/opportunity/` module for the full audit engine.

---

## Workflow Actions

Each opportunity instance supports:

- **Dismiss** — hide from active list
- **Resolve** — mark addressed
- **Pin** — keep visible at top
- **Complete** — checklist item done
- **Archive** — long-term storage
- **Future AI Action** — reserved for Emi (Phase 5.6)

Workflow state is client-side (session) in Phase 5.5.

---

## Filters

- Entity type: Campaign, Guide, Review, Video, Creator, Brand, Product, Collection, Series
- Category, Priority, Status
- Campaign ID (when scoped)

---

## Reusable Components

| Component | Purpose |
|-----------|---------|
| `SpotlightOpportunityCard` | Single opportunity with coaching + actions |
| `SpotlightChecklist` | Optimization checklist |
| `SpotlightAuditCard` | Audit section summary |
| `SpotlightOptimizationPanel` | Recommendation panel group |
| `SpotlightScoreGauge` | Circular score display |
| `SpotlightReadinessCard` | Publishing gate status |
| `SpotlightRecommendationCard` | Top recommendation highlight |
| `SpotlightPriorityBadge` | Priority/severity badge |

---

## Future: Phase 5.6 Emi AI

Emi will automate recommendations from this layer:

- Wire `futureAiCapability` on opportunity definitions to `EMI_ACTION_REGISTRY`
- Implement generation/optimization behind placeholder buttons
- Extend workflow with "Apply with Emi" actions

See [OPTIMIZATION_ENGINE.md](./OPTIMIZATION_ENGINE.md) and [READINESS_SCORING.md](./READINESS_SCORING.md).

---

## Related docs

- [SPOTLIGHT_INTELLIGENCE.md](./SPOTLIGHT_INTELLIGENCE.md) — upstream analytics
- [SPOTLIGHT_EXPERIENCE_BUILDER.md](./SPOTLIGHT_EXPERIENCE_BUILDER.md) — content source for audits
- [OPTIMIZATION_ENGINE.md](./OPTIMIZATION_ENGINE.md) — audit engine details
- [READINESS_SCORING.md](./READINESS_SCORING.md) — scorecard formulas
