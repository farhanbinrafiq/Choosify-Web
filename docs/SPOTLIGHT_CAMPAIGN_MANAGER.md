# Spotlight Campaign Manager (LE-005.3)

CMS-only marketing campaign management for Choosify Spotlight. This module is **independent from Product Studio** and does not implement public discovery surfaces (homepage carousel, spotlight feed, campaign details page).

## CMS Structure

```
Dashboard
└── Marketing
    └── Spotlight Campaigns     → /marketing/spotlight
        ├── New Campaign        → /marketing/spotlight/new
        └── Edit Campaign       → /marketing/spotlight/:campaignId
```

**Product Studio entry:** When a product page is opened with `?studioEdit=1`, a Product Studio toolbar appears with **Create Spotlight Campaign**, which deep-links to the wizard with the current product pre-attached.

## Campaign Dashboard

| Feature | Implementation |
|---------|----------------|
| Grid / Table views | `SpotlightCampaignsPage` |
| Search | Name, headline, brand |
| Sort | `updatedAt`, `campaignName`, `priority`, `status` |
| Filter | Status, type, sponsor, schedule, folder |
| Pagination | 12 per page |
| Duplicate | Copies all fields except ID, dates, status |
| Folders | System + custom folders via sidebar |

### Campaign Status

`draft` → `pending_review` → `approved` → `scheduled` → `published` → `expired` → `archived`

Also: `paused`, `rejected`

### Campaign Types

Single Product, Multi Product, Brand, Category, New Launch, Promotion, Discount, Festival, Seasonal, Brand Story, Buying Guide, Creator Review, Editor's Pick (+ future types in `campaignTypes.ts`).

## Wizard Steps

| Step | Panel | Key fields |
|------|-------|------------|
| 1 — Basics | Inline form | Name, type, brand, seller, description |
| 2 — Media | `MediaManagerPanel` | Upload, reorder, primary, validation (LE-005.2) |
| 3 — Products | `ProductLinkerPanel` | Catalog search, attach, reorder, primary product |
| 4 — Placement | `PlacementManagerPanel` | Homepage, Spotlight Feed, Brand, Product, Category |
| 5 — Schedule | Inline form | Start/end, priority, sponsored, visibility |
| 6 — Review | `CampaignPreviewPanel` | Live preview, validation, submit |

## Campaign Preview

`CampaignPreviewPanel` uses LE-005.2 display profiles:

- Homepage card (`homepage_carousel`)
- Spotlight feed card (`spotlight_feed`)
- Campaign details, brand section, product section profiles

## Product Linking

Campaigns store **catalog product IDs only** (`linkedProductIds`, `primaryProductId`). Product data is resolved at render time from the catalog — never duplicated on the campaign record.

## Placement Manager

Each surface is toggled independently: `homepage`, `spotlight_feed`, `brand_page`, `product_page`, `category_page`, plus future placements (`search`, `recommendation`, `homepage_hero`).

## Media Manager

Reuses LE-005.2 media engine: classify, validate, preview, reorder, replace, set primary media.

## Validation Rules

### Per-step (wizard navigation)

1. Name, type, description required
2. At least one media asset
3. At least one linked product
4. At least one placement surface
5. Start and end dates required

### Publish / submit

- Campaign name and headline
- Media exists and resolves in storage
- Primary product selected from linked set
- Valid date range (end > start)
- At least one placement surface
- Required fields complete

Validation lives in `src/utils/spotlightCampaignValidation.ts`.

## Permissions

| Action | Seller | Moderator | Admin |
|--------|--------|-----------|-------|
| Create campaign | ✓ (own) | — | ✓ |
| Edit draft / rejected | ✓ (own) | — | ✓ |
| Submit for review | ✓ (own) | — | ✓ |
| Approve / reject | — | ✓ | ✓ |
| Schedule / publish | — | — | ✓ |
| Archive | ✓ (own) | — | ✓ |
| Delete | — | — | ✓ |

> **Note:** Moderator role maps to `admin` in the current auth model; dedicated moderator role wiring is a future extension.

## Workflow

```
Draft
  ↓ Submit
Pending Review
  ↓ Approve          ↘ Reject → Draft (with comments, future UI)
Approved
  ↓ Schedule
Scheduled
  ↓ Publish
Published
  ↓ End date
Expired
  ↓ Archive
Archived
```

Rejected campaigns return to draft for revision.

## Campaign Folders (CTO Upgrade)

System folders: All, My Campaigns, Drafts, Sponsored, Archived.

Users can create custom folders (e.g. Eid 2027, Samsung, Flash Sales). Folder assignment is a `folderId` on the campaign record — no schema change required.

## Campaign Duplicate (CTO Upgrade)

`duplicateCampaign()` copies all campaign content except:

- `campaignId` (new ID generated)
- `schedule` (reset to defaults)
- `status` (reset to `draft`)

## Storage

Local persistence via `spotlightCampaignStorage.ts` (localStorage). Designed for Firestore migration per LE-005.1 architecture.

## Future Extensions

- Homepage carousel integration (LE-005.4+)
- Spotlight feed rendering
- Campaign details public page
- Analytics dashboard
- AI recommendations
- Backend API + Firestore sync
- Dedicated moderator role
- Reject-with-comments UI
- Schedule automation (cron / Cloud Functions)

## Related Docs

- [SPOTLIGHT_ARCHITECTURE.md](./SPOTLIGHT_ARCHITECTURE.md) — types, Firestore design
- [SPOTLIGHT_MEDIA_ENGINE.md](./SPOTLIGHT_MEDIA_ENGINE.md) — renderers and display profiles
