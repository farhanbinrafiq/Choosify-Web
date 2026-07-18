# DS-2.0 Component Inventory — Cards

**Sprint:** ES-001  
**Total card-related components:** 35+

---

## Commerce

| Component | Path | Role | Migration Priority |
|-----------|------|------|-------------------|
| `ProductCard` | `src/components/ProductCard.tsx` | Primary catalog product card (grid/list/featured) | ES-004 — keep; extract variants |
| `HomeProductCard` | `src/components/home/cards/HomeProductCard.tsx` | Homepage-only premium product card | ES-002 — canonical home variant |
| `UniversalCommerceCard` | `src/components/content/UniversalCommerceCard.tsx` | Unified commerce/editorial card engine | ES-004 — target adapter |
| `RecommendationCard` | `src/components/RecommendationCard.tsx` | AI/recommendation product card | ES-004 |
| `ChoosifySponsoredCard` | `src/components/commerce/ChoosifySponsoredCard.tsx` | Sponsored placement card | ES-004 |
| `SponsoredPlacementCard` | `src/components/SponsoredPlacementCard.tsx` | Legacy sponsored card (duplicate?) | ES-004 — consolidate |
| `CardEngagementStrip` | `src/components/CardEngagementStrip.tsx` | Engagement actions on cards | Shared |
| `PublicReviewCard` | `src/components/PublicReviewCard.tsx` | User review card | ES-009 |

---

## Marketing / Spotlight / Editorial

| Component | Path | Role |
|-----------|------|------|
| `SpotlightContentCard` | `src/components/spotlight/experience/SpotlightContentCard.tsx` | Universal spotlight content card |
| `SpotlightCampaignCard` | `src/components/spotlight/homepage/SpotlightCampaignCard.tsx` | Homepage campaign adapter |
| `HomeSpotlightEditorialCard` | `src/components/home/cards/HomeSpotlightEditorialCard.tsx` | Homepage editorial spotlight |
| `SpotlightShoppingFeedCard` | `src/components/spotlight/feed/SpotlightShoppingFeedCard.tsx` | Shopping feed card |
| `SpotlightCardRenderer` | `src/components/spotlight/experience/SpotlightCardRenderer.tsx` | Card type router |
| `SpotlightSeriesCard` | `src/components/spotlight/discovery/SpotlightSeriesCard.tsx` | Series discovery |
| `SpotlightCollectionCard` | `src/components/spotlight/discovery/SpotlightCollectionCard.tsx` | Collection discovery |
| `BrandPostCard` | `src/components/BrandPostCard.tsx` | Brand social post card |
| `UniversalContentCard` | `src/components/content/UniversalContentCard.tsx` | Generic content card |
| `GuideMediaCards` | `src/components/guide/GuideMediaCards.tsx` | Deprecated — wraps UniversalCommerceCard |
| `HomeGuideCarouselCard` | `src/components/guide/HomeGuideCarouselCard.tsx` | Guide carousel adapter |

---

## Dashboard / Intelligence (Admin)

| Component | Path |
|-----------|------|
| `SpotlightMetricCard` | `src/components/spotlight/intelligence/SpotlightMetricCard.tsx` |
| `SpotlightChartCard` | `src/components/spotlight/intelligence/SpotlightChartCard.tsx` |
| `SpotlightHealthCard` | `src/components/spotlight/intelligence/SpotlightHealthCard.tsx` |
| `SpotlightScoreCard` | `src/components/spotlight/intelligence/SpotlightScoreCard.tsx` |
| `SpotlightTrendCard` | `src/components/spotlight/intelligence/SpotlightTrendCard.tsx` |
| `SpotlightInsightCard` | `src/components/spotlight/intelligence/SpotlightInsightCard.tsx` |
| `SpotlightHeatmapCard` | `src/components/spotlight/intelligence/SpotlightHeatmapCard.tsx` |
| `SpotlightOpportunityCard` | `src/components/spotlight/opportunity/SpotlightOpportunityCard.tsx` |
| `SpotlightAuditCard` | `src/components/spotlight/opportunity/SpotlightAuditCard.tsx` |
| `SpotlightReadinessCard` | `src/components/spotlight/opportunity/SpotlightReadinessCard.tsx` |
| `SpotlightRecommendationCard` | `src/components/spotlight/opportunity/SpotlightRecommendationCard.tsx` |
| `EmiAssistantCard` | `src/components/emi/EmiAssistantCard.tsx` |

---

## Messaging

| Component | Path | Notes |
|-----------|------|-------|
| Inline message product cards | `src/pages/MessagesPage.tsx` | Embedded in chat — not extracted |
| `MessagesPreviewPanel` | `src/components/MessagesPreviewPanel.tsx` | Preview cards |

---

## Admin / CMS / Publisher

| Component | Path |
|-----------|------|
| `PublisherContributionCard` | `src/components/spotlight/publisher/PublisherContributionCard.tsx` |
| `SpotlightBrandMiniCard` | `src/components/spotlight/experience/SpotlightBrandMiniCard.tsx` |
| `CmsPreviewPanel` | `src/components/marketing/CmsPreviewPanel.tsx` | Preview surfaces |

---

## Shared / Directory

| Component | Path | Role |
|-----------|------|------|
| `BrandCardDesign` | `src/components/BrandCardDesign.tsx` | Brand directory card |
| `CreatorCardDesign` | `src/components/CreatorCardDesign.tsx` | Creator directory card |
| `CategoryPhotoCard` | `src/components/CategoryPhotoCard.tsx` | Legacy category tile |
| `CategoryPremiumCard` | `src/components/categories/CategoryPremiumCard.tsx` | DS-V2.1 category tile |

---

## Consolidation Targets (Future)

```
UniversalCommerceCard
  ├── ProductCard (catalog)
  ├── HomeProductCard (homepage)
  ├── SpotlightContentCard (editorial)
  └── ChoosifySponsoredCard (sponsored)

UniversalDirectoryCard (proposed)
  ├── BrandCardDesign
  ├── CreatorCardDesign
  └── CategoryPremiumCard
```

---

## Skeleton / Loading

| Component | Path |
|-----------|------|
| `CategoryCardSkeleton` | `src/components/Skeleton.tsx` |
| `LoadingFallback` | `src/components/LoadingFallback.tsx` |
