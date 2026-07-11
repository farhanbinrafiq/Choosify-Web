# Emi Capabilities — Phase 5.6

Capability registry and future action architecture.

---

## Capability registry

`src/lib/emi/capabilityRegistry.ts`

| Capability | Mode | Phase 5.6 |
|------------|------|-----------|
| explain | contextual | ✅ Active |
| summarize | contextual | ✅ Active |
| compare | contextual | ✅ Active |
| recommend | contextual | ✅ Active |
| optimize | action (suggest) | ✅ Active |
| categorize | action | ✅ Active |
| generate | future_auto | Architecture only |
| rewrite | future_auto | Architecture only |
| translate | future_auto | Architecture only |
| moderate | future_auto | Architecture only |
| schedule | future_auto | Architecture only |

---

## Unified action registry

`src/lib/emi/actionRegistry.ts` — merges:

- Phase 5.5 `emiActionRegistry` (Opportunity Center)
- Studio `AI_ACTIONS_REGISTRY` (Publisher Studio)

20 actions with categories: content, seo, commerce, discovery, localization, shopping, publisher.

---

## Prompt registry

`promptRegistry.ts` — template strings for future `/api/emi/action` calls. Each action has `system` + `userTemplate` with `{{placeholders}}`.

---

## Confidence registry

`confidenceRegistry.ts`

| Level | Score | Use |
|-------|-------|-----|
| high | 80+ | Product summary, opportunity explain |
| medium | 55–79 | Compare fit, alternatives |
| low | 30–54 | Budget/premium coach |
| placeholder | <30 | Pre-AI publisher suggestions |

Displayed via `EmiConfidenceBadge`.

---

## Recommendation panels

`recommendationRegistry.ts` — panel kinds:

Did You Know · Buying Tip · Warning · Recommendation · Alternative · Money Saving · Expert Advice · Summary · Coach

---

## Explainability (mandatory)

Every recommendation includes:

- **Why** — what data was considered
- **Confidence** — level + optional score
- **Related products/content** — IDs when available

Publisher actions include **applyHint** — manual review required in Phase 5.6.

---

## Extension points

1. Add provider in `emiRecommendationEngine` without UI changes
2. Register new actions in `EMI_ACTION_REGISTRY`
3. Map opportunity `futureAiCapability` via `mapFutureAiCapability()`
4. Wire `promptRegistry` → `/api/emi/action` when backend ready
