# Spotlight Editor

Universal block-based editor for all Spotlight content types.

## One Editor Rule

There is **one** editor. Separate Guide Editor, Review Editor, Video Editor, Campaign Editor, and Blog Editor must **not** exist.

The editor adapts dynamically based on `publisherContentType` selected at creation.

## Entry Flow

1. **Publisher Studio list** — `/marketing/studio`
2. **Create Spotlight Content** — `/marketing/studio/new`
3. **Content type picker** — 22 types in a grid
4. **Universal editor** — block canvas + side panels

## Layout

```
┌──────────────────────────────────────────────────────────┐
│ SpotlightToolbar — title, status, save, preview, submit │
├──────────┬───────────────────────────────┬───────────────┤
│ Sidebar  │ Main canvas                   │ Block Library │
│ panels   │ (blocks / panel content)        │ (editor only) │
└──────────┴───────────────────────────────┴───────────────┘
```

## Panels

| Panel | Component | Purpose |
|-------|-----------|---------|
| Editor | Block canvas + template picker | Block composition |
| Media | `SpotlightMediaPanel` | Media library, orientation-agnostic |
| Commerce | `SpotlightCommercePanel` | Product merchandising |
| Links | `SpotlightRelationshipPanel` | Cross-content relationships |
| SEO | `SpotlightSeoPanel` | Slug, meta, schema, index/follow |
| Discovery | `SpotlightDiscoveryPanel` | Placements, featured, tags |
| AI | `SpotlightAiPanel` | Architecture placeholder (Phase 5.4+) |
| Preview | `SpotlightPreview` | 11 viewport/surface previews |

## Persistence

On **Save**:

1. `SpotlightExperienceDraft` stored in wizard `experienceDraft` (localStorage session)
2. Campaign record upserted via existing `spotlightCampaignStorage`
3. Revision appended to client-side history

On **Submit**:

1. Validates via existing `validateCampaignForPublish`
2. Sets status `pending_review`
3. Returns to Publisher Studio list

## Content Status Workflow

Supported statuses on `SpotlightExperienceDraft`:

`draft` → `pending_review` → `scheduled` → `published` → `live` → `expired` → `archived` | `revision` | `rejected`

Campaign storage statuses remain unchanged; studio maps submit to `pending_review`.

## Extending the Editor

To add a new panel:

1. Add `StudioPanelId` in `useSpotlightExperienceBuilder.ts`
2. Add nav item in `SpotlightSidebar.tsx`
3. Render panel in `SpotlightPublisherStudioPage.tsx` switch

No changes to block registry required.

## Legacy Wizard

The original 6-step campaign wizard (`SpotlightCampaignEditorPage`) remains available at:

`/marketing/spotlight/legacy/:campaignId`

Use for backward compatibility or deep campaign-specific flows until fully migrated.
