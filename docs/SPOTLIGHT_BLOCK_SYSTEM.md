# Spotlight Block System

Modular block architecture for the Universal Publisher Studio.

## Block Registry

All blocks register in `src/lib/spotlight/studio/blockRegistry.ts`.

```typescript
interface SpotlightBlockDefinition {
  type: SpotlightBlockType;
  category: SpotlightBlockCategory;
  label: string;
  description: string;
  icon: string;
  defaultData: Record<string, unknown>;
  suggestedFor?: string[];
}
```

### Categories

| Category | Examples |
|----------|----------|
| `content` | heading, paragraph, rich_text, quote, checklist, faq, pros_cons |
| `media` | gallery, single_image, video, embed_youtube, embed_tiktok, pdf, audio |
| `commerce` | products, product_card, offer, coupon, compare_table, bundle, wishlist |
| `live` | live_session, replay, countdown, timeline |
| `layout` | divider, highlight_box, alert, announcement |
| `relationship` | related_content, creator_profile, brand_profile, tags, collections, series |

## Block Types (48)

### Content Blocks
`heading`, `paragraph`, `rich_text`, `quote`, `checklist`, `faq`, `comparison_table`, `pros_cons`, `spec_table`, `feature_list`, `highlight_box`, `alert`, `announcement`

### Media Blocks
`gallery`, `single_image`, `video`, `embedded_video`, `embed_facebook`, `embed_youtube`, `embed_tiktok`, `embed_instagram`, `pdf`, `audio`

Media renderer adapts orientation (landscape, portrait, square, reels) — publishers do not pick separate layouts.

### Commerce Blocks
`button`, `cta`, `products`, `product_card`, `brand_card`, `compare_table`, `wishlist`, `bundle`, `offer`, `coupon`, `services`, `service_card`

Registered in `COMMERCE_BLOCK_TYPES` for commerce panel cross-reference.

### Live Blocks
`live_session`, `replay`, `countdown`, `timeline`

### Relationship Blocks
`related_content`, `creator_profile`, `brand_profile`, `location`, `contact`, `tags`, `collections`, `series`

## Block Instance

```typescript
interface SpotlightBlock {
  blockId: string;
  type: SpotlightBlockType;
  category: SpotlightBlockCategory;
  data: Record<string, unknown>;
  order: number;
}
```

Created via `createBlock(type, order)` — assigns UUID and default data from registry.

## Renderer

`SpotlightBlockRenderer` handles:

- **Edit mode**: inline inputs, move up/down, remove
- **Read mode**: static preview (`editable={false}`)

Used in editor canvas and preview panel. Public content page integration is Phase 5.4+.

## Adding a New Block (developer guide)

1. Add type to `SpotlightBlockType` in `src/types/spotlight/studio/index.ts`
2. Register in `BLOCK_REGISTRY` with category, label, defaultData
3. Add render branch in `SpotlightBlockRenderer.tsx` (or generic fallback)
4. Optionally add to templates/blueprints

**No editor shell changes required** — block appears automatically in `SpotlightBlockLibrary` via `blocksByCategory()`.

## Templates

15 templates in `templateRegistry.ts` pre-fill ordered `blockTypes`:

Electronics Review, Hotel Review, Restaurant Review, Buying Guide, Travel Guide, Campaign, Launch Event, Brand Story, Creator Recommendation, Mega Sale, Health Guide, Fashion Lookbook, Automotive Review, Real Estate, Service Feature.

## Blueprints

7 blueprints in `blueprintRegistry.ts` extend templates with workflow metadata:

Product Launch, Restaurant Promotion, Hotel Showcase, Travel Experience, Creator Review, Mega Sale Campaign, Event Announcement.

Each blueprint includes:

- `recommendedBlocks`
- `requiredMedia`
- `seoChecklist`
- `suggestedCtas`
- `productLinkStrategy`
- `suggestedPlacements`
- `workflowSteps`

## Future: Poll Block

`poll` reserved in spec — register when backend support exists.

## Future: AI Block Assistance

`AI_ACTIONS_REGISTRY` defines planned actions (generate headline, SEO, tags, suggest products, suggest blueprint). No generation in Phase 5.3 — architecture only.
