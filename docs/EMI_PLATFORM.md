# Emi AI Platform — LE-005 Phase 5.6

Emi is Choosify's **intelligence layer** — not a destination chatbot. Emi appears as contextual Copilot panels throughout the platform (product pages, Spotlight, Compare, Search, Publisher Studio, Opportunity Center).

**Philosophy:** Users encounter Emi as embedded intelligence. Full chat at `/emi` and the floating "Ask Emi" panel remain available but are secondary surfaces.

---

## Architecture

```
src/types/emi/                    — Contracts
src/lib/emi/                      — Registries + context/recommendation engines
src/hooks/useEmiAssistant.ts      — Page-aware recommendations
src/hooks/useEmiActions.ts        — Publisher action suggestions (no auto-apply)
src/components/emi/               — Reusable Copilot UI
api/emi/chat.js                  — Existing Gemini chat (unchanged)
```

### Master registry

`EMI_PLATFORM_REGISTRY` in `src/lib/emi/index.ts` indexes:

- 10 assistant types
- 11 capabilities
- 17 page contexts
- 20+ unified actions

---

## Assistant types

| ID | Role |
|----|------|
| shopping | Product explain, reviews, alternatives |
| spotlight | Summarize content, products mentioned |
| compare | Differences, who should buy what |
| search | Conversational discovery hints |
| publisher | Headline, SEO, CTA, tags (Studio) |
| creator | Products, campaigns, schedule |
| brand | Campaign ideas, launches |
| seller | Inventory, bundles, cross-sell |
| discovery | Trending, related Spotlight |
| opportunity | Explain improvements + impact |

---

## Surfaces

| Surface | Component | Pages |
|---------|-----------|-------|
| Context panel | `EmiContextPanel` | Product, Search, Spotlight |
| Shopping coach | `EmiShoppingCoach` | Product |
| Compare panel | `EmiComparePanel` | Compare |
| Publisher panel | `EmiPublisherPanel` | Studio, Opportunity Center |
| Opportunity insight | `EmiOpportunityInsight` | Opportunity cards |
| Sidecar | `EmiSidecar` | Global (non-marketing) |
| Chat | `EmiChatPanel` | `/emi`, floating FAB |

---

## ES integration (reuse, no schema changes)

| Contract | Use |
|----------|-----|
| ES-007 Seller Intelligence | Seller assistant context |
| ES-008 Marketplace Analytics | Performance explanations |
| ES-009 Trust Platform | Trust score copy on products |
| ES-010 Discovery Engine | Discovery assistant + memory |
| ES-011 Communication Platform | Messages (future) |
| ES-012 Emi AI Platform | `SpotlightAiServiceContract` types |

---

## Future AI

Architecture reserved for:

- Multi-provider AI (Gemini + others)
- RAG / vector search
- Persistent memory (`emiShoppingMemory` localStorage today)
- `/api/emi/action` structured generation endpoint
- Auto-apply in Publisher Studio (not Phase 5.6)

---

## Related docs

- [EMI_CONTEXT_SYSTEM.md](./EMI_CONTEXT_SYSTEM.md)
- [EMI_ASSISTANTS.md](./EMI_ASSISTANTS.md)
- [EMI_CAPABILITIES.md](./EMI_CAPABILITIES.md)
