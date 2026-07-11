# Spotlight Experience Builder

LE-005 Phase 5.3 — Universal Publisher Studio architecture.

## Vision

Spotlight is Choosify's **Discovery Platform**. Publishers create **Spotlight Experiences** — not separate guides, reviews, or campaigns. Content type only changes how the experience renders on `/spotlight/content/:slug`.

## CMS Rename

| Before | After |
|--------|-------|
| Spotlight Campaign Manager | **Spotlight Publisher Studio** |
| New Campaign | **Create Spotlight Content** |
| Campaign-only mental model | Campaign is one of 22+ content types |

Routes:

- Primary: `/marketing/studio`, `/marketing/studio/new`, `/marketing/studio/:id`
- Legacy aliases: `/marketing/spotlight/*` (same UI)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              SpotlightPublisherStudioPage                    │
│  Content Type Picker → Universal Editor → Save/Publish     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
    useSpotlightExperienceBuilder    useSpotlightCampaignWizard
    (blocks, SEO, discovery)         (campaign persistence)
               │                              │
               └──────────┬───────────────────┘
                          ▼
              spotlightCampaignStorage (local)
              experienceDraft in wizard session
```

### Registries (pluggable)

| Registry | Path | Purpose |
|----------|------|---------|
| Block Registry | `src/lib/spotlight/studio/blockRegistry.ts` | 48 block types |
| Content Registry | `src/lib/spotlight/studio/publisherContentTypeRegistry.ts` | 22 publisher types |
| Template Registry | `src/lib/spotlight/studio/templateRegistry.ts` | 15 starter layouts |
| Blueprint Registry | `src/lib/spotlight/studio/blueprintRegistry.ts` | 7 workflow blueprints |
| Preview Registry | `src/lib/spotlight/studio/previewRegistry.ts` | 11 preview modes |
| Commerce Registry | `previewRegistry.ts` → `COMMERCE_BLOCK_TYPES` | Shoppable blocks |

### Reusable Components

Located in `src/components/spotlight/studio/`:

- `SpotlightEditorShell` — toolbar + sidebar + canvas layout
- `SpotlightToolbar` — save, preview, submit, status
- `SpotlightSidebar` — panel navigation
- `SpotlightBlockLibrary` — add blocks by category
- `SpotlightBlockRenderer` — editable/read-only block canvas
- `SpotlightTemplatePicker` — templates + blueprints
- `SpotlightSeoPanel`, `SpotlightDiscoveryPanel`, `SpotlightAiPanel`
- `SpotlightRelationshipPanel`, `SpotlightPreview`
- `SpotlightCommercePanel`, `SpotlightMediaPanel`

### Hook

`useSpotlightExperienceBuilder` manages:

- Block CRUD and reorder
- Template/blueprint application
- Panel state (editor, media, commerce, links, SEO, discovery, AI, preview)
- Revision history (client-side, last 20)
- Status workflow

Campaign metadata syncs via `useSpotlightCampaignWizard` + optional `experienceDraft` on wizard draft (session/local only — no Firestore schema change).

## Content Types

22 publisher-facing types map to `SpotlightContentType` and optionally `SpotlightCampaignType` for persistence:

Guide, Review, Recommendation, Creator Pick, Video, Reel, Blog, Campaign, Announcement, Product Launch, Live Event, Replay, Collection, Series, Story, Article, Educational, Service Showcase, Restaurant Feature, Hotel Feature, Travel Guide, Brand Story.

## Templates vs Blueprints

**Templates** pre-fill block layouts (e.g. Electronics Review, Buying Guide).

**Blueprints** (CTO upgrade) define business workflow:

- Recommended blocks
- Required media orientations
- SEO checklist
- Suggested CTAs and product linking strategy
- Spotlight placements
- Workflow: draft → review → schedule → publish

Future: Emi AI can recommend or generate blueprints dynamically.

## Relationships

Publishers link products, brands, creators, categories, collections, series, campaigns, guides, and reviews via `SpotlightRelationshipPanel`. Syncs to campaign `linkedProductIds`, `linkedBrandIds`, etc.

## Future Phases

- **Phase 5.4 — Spotlight Intelligence**: AI-assisted publishing using `AI_ACTIONS_REGISTRY`
- **Monetization**: Commerce blocks render shoppable experiences on public content page
- **Block renderer on public page**: Wire `SpotlightBlockRenderer` into `SpotlightContentPage` read path

## Constraints (Phase 5.3)

- No backend / Firestore / breaking API changes
- No branding or color palette changes
- Reuses Phase 5.2 Spotlight Content architecture
- Legacy 6-step wizard preserved at `/marketing/spotlight/legacy/:campaignId`
