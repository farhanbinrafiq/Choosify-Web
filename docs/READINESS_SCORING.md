# Readiness Scoring — LE-005 Phase 5.5

How the Spotlight Opportunity Center computes content health, publishing readiness, and the overall Spotlight scorecard.

---

## Content scorecard (9 dimensions)

Built by `buildCampaignScorecard()` / `buildContentScorecard()` in `spotlightOpportunityEngine.ts`.

| Score | What it measures |
|-------|------------------|
| Discovery | Tags, categories, collections, series, featured placement |
| Trust | Publisher trust / verification signals |
| Commerce | Products, CTA, buy, compare, offers readiness |
| SEO | Slug, meta, schema completeness |
| Accessibility | Alt text and basic a11y signals |
| Media | Thumbnail, video, gallery presence |
| Health | Freshness, localization, overall campaign health |
| Readiness | Publishing gate pass rate |
| **Overall** | Weighted composite of all dimensions |

Displayed via `SpotlightScoreGauge` components on the Opportunity Center dashboard.

### Scoring approach

- Start from baseline (typically 100 or category-weighted base)
- Subtract penalties for each failed audit rule in that category
- Clamp to 0–100
- Overall = weighted average (commerce and discovery weighted higher for shoppable campaigns)

Exact weights live in the engine to keep UI components dumb and reusable.

---

## Publishing readiness gates

Defined in `readinessRegistry.ts` — 8 gates:

| Gate | Meaning |
|------|---------|
| Ready to Publish | All critical rules passed |
| Needs Review | Editorial/brand review pending |
| Needs Media | Hero image or video required |
| Needs SEO | Meta and schema incomplete |
| Needs Commerce | Products or CTA missing |
| Needs Approval | Moderator approval pending |
| Needs Localization | Translation not configured |
| Needs Products | At least one product required |

`buildPublishingReadiness(failedRules, campaignStatus)` evaluates each gate against required audit rules and campaign status.

Displayed via `SpotlightReadinessCard`.

---

## Priority and severity

`priorityRegistry.ts` maps opportunity severity to display priority:

- **Critical** — blocks publishing or commerce
- **High** — significant engagement impact
- **Medium** — meaningful but not blocking
- **Low** — polish and optimization

Used by `SpotlightPriorityBadge` and recommendation panel filters.

---

## Estimated impact

Each opportunity definition includes `estimatedImpactPercent` — a projected uplift in engagement or conversion when addressed.

`estimateTotalImpact(opportunities)` sums impact for open opportunities (used in dashboard summary). These are **heuristic estimates** in Phase 5.5; Phase 5.6+ can replace with intelligence-backed before/after metrics.

---

## Audit rule → score mapping

Failed rules from `AUDIT_REGISTRY` (33 rules) drive both:

1. Individual opportunity cards
2. Category score deductions in the scorecard

Rule categories align with score dimensions:

- `content.*`, `media.*` → Media + Content Quality
- `commerce.*` → Commerce
- `seo.*`, `discovery.*` → Discovery + SEO
- `trust.*`, `health.*`, `accessibility.*` → Trust + Health + Accessibility
- `publishing.*` → Readiness

---

## AI readiness score

The `ai.readiness` audit rule checks whether enough structured content exists for Emi AI to act meaningfully in Phase 5.6:

- Headline and summary present
- Products or services linked
- SEO basics complete
- Tags and categories set

Campaigns scoring high on AI readiness will be first candidates for automated optimization.

---

## Future monetization hooks

Readiness scores enable future premium tiers:

- **Publisher Pro** — unlimited audits, priority coaching
- **Emi AI** — auto-apply fixes for high-readiness campaigns
- **Benchmark reports** — compare readiness vs. category leaders (intelligence integration)

No monetization UI in Phase 5.5 — architecture only.

---

## Related

- [SPOTLIGHT_OPPORTUNITY_CENTER.md](./SPOTLIGHT_OPPORTUNITY_CENTER.md) — dashboard overview
- [OPTIMIZATION_ENGINE.md](./OPTIMIZATION_ENGINE.md) — audit pipeline
- [SCORE_REGISTRY.md](./SCORE_REGISTRY.md) — intelligence platform scores (Phase 5.4)
