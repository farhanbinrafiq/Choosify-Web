# Emi Assistants — Phase 5.6

Copilot-style assistants embedded per workflow.

---

## Shopping Assistant

**Pages:** Product, Brand, Category  
**Component:** `EmiProductAssistant`

- Explain product at a glance
- Buying tips, stock awareness
- Shopping Coach (Best value / budget / premium)
- Link to full Emi chat

---

## Spotlight Assistant

**Pages:** `/spotlight/content/:slug`  
**Component:** `EmiSpotlightAssistant`

- Key takeaways summary
- Products mentioned
- Shopping advice
- Related discovery hints

---

## Compare Assistant

**Pages:** `/compare`  
**Component:** `EmiComparePanel`

- Major differences
- Who should buy which
- Value for money guidance
- Confidence badges

---

## Search Assistant

**Pages:** `/search?q=`  
**Component:** `EmiSearchAssistant`

- Query-aware hints
- Category/brand/Spotlight suggestions
- Records queries in shopping memory

---

## Publisher Assistant

**Pages:** Publisher Studio (`SpotlightAiPanel`), Opportunity Center  
**Component:** `EmiPublisherPanel`

Actions (suggest only, no auto-apply):

- Optimize headline, summary, SEO
- Suggest products, tags, CTA, collection, series
- Translate (architecture placeholder)

---

## Opportunity Coach

**Pages:** Opportunity Center cards  
**Component:** `EmiOpportunityInsight`

- Explain why opportunity matters
- Estimated impact + confidence
- Wire `futureAiCapability` → unified action registry

---

## Discovery Assistant

**Pages:** Spotlight feed, Home (via sidecar)  
Uses discovery scores + shopping memory for "Because you viewed" architecture.

---

## Global sidecar

**Component:** `EmiSidecar`

- Non-intrusive pill bottom-left
- Context-aware tip from current page
- Hidden on marketing routes and `/emi`
- Dismissible per session

---

## Full chat (existing)

- `/emi` page
- Floating "Ask Emi" FAB
- Gemini backend via `/api/emi/chat`
- Handoff via `openEmiPanel('prompt')`
