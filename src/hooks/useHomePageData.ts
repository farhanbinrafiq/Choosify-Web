import { productPath } from '../../lib/publicUrls';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { catalogApi } from '../services/catalogApi';
import { BRANDS } from '../constants';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useHomepageSpotlight } from './useHomepageSpotlight';
import { useSponsoredFeedEntries } from './useSponsoredFeedEntries';
import { getSectionItemIds, isHomeSectionVisible } from '../utils/homepageCms';
import { pickByCatalogIds, orderByCatalogIds } from '../utils/catalogMatch';
import { isPlacementActive } from '../utils/editorialMappers';
import { buildCategoryDisplayList } from '../utils/categoryDisplay';
import { slugifyPathSegment } from '../lib/seoHelpers';
import { getHomeLivePulseItems } from '../lib/home/homepageLivePulse';
import { buildHomeViralTodayItems, type ViralTodayItem } from '../utils/homeViralToday';
import { usePriorityClockMs } from './usePriorityClockMs';
import { resolveSpotlightExperience } from '../utils/spotlightContentResolver';
import { getAllBrandPosts } from '../lib/brandPosts';
import { isVerifiedBrand, recommendedBrandOrder } from '../lib/sorting/brandRecommendedOrder';
import type { HomePromoTile } from '../components/home/sections/HomeTodaysDealsSection';
import type { HomeCategoryItem } from '../components/home/sections/HomeTopCategoriesSection';
import type { HomepageConfig } from '../types/catalog';

type HomeGuideCarouselKind = 'youtube' | 'reels' | 'blog';

/** Prototype brands/demo content are for local dev only; production homepage shows real data or an empty section. */
const ALLOW_DEMO = import.meta.env.DEV;

const BRAND_IMAGES: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
  Apex: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
  Bata: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80',
  Sony: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
  Aarong: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80',
  Walton: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
};

function getHomeGuideKind(guide: any): HomeGuideCarouselKind {
  if (guide?.type === 'reels' || guide?.type === 'shorts') return 'reels';
  if (guide?.type === 'video') return 'youtube';
  return 'blog';
}

function mapCmsViralTodayItems(
  items: NonNullable<HomepageConfig['viralTodayItems']>,
): ViralTodayItem[] {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      id: item.id,
      href: '#',
      title: item.title,
      image: item.thumbnailUrl || item.mediaUrl,
      channel: 'Choosify',
      productCount: 0,
      // CMS badge surfaces via card title chrome in HomeSpotlightPreviewSection
      kind: 'youtube' as const,
    }));
}

export function useHomePageData() {
  const {
    allCatalogProducts,
    allCatalogBrands,
    allBrands,
    allDeals,
    allCategories,
    allGuides,
    allPlacements,
    allCreators,
    homepageConfig,
    siteConfig,
    isLoggedIn,
  } = useGlobalState();
  const { recentlyViewed } = useDashboard();

  const sectionVisible = useCallback(
    (sectionId: string) => isHomeSectionVisible(homepageConfig, sectionId),
    [homepageConfig],
  );

  // Same Super Admin pins the Brands page uses for its default order.
  const [pinnedBrandIds, setPinnedBrandIds] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    catalogApi
      .getBrandsCuration()
      .then((c) => !cancelled && setPinnedBrandIds(c.pinnedBrandIds || []))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const brandsList =
    allCatalogBrands.length > 0 ? allCatalogBrands : allBrands.length > 0 ? allBrands : ALLOW_DEMO ? BRANDS : [];

  const livePulseItems = useMemo(
    () => getHomeLivePulseItems(homepageConfig, siteConfig),
    [homepageConfig, siteConfig],
  );

  const categories = useMemo((): HomeCategoryItem[] => {
    const cmsCats = homepageConfig?.topCategories;
    if (cmsCats?.length) {
      return [...cmsCats]
        .sort((a, b) => a.order - b.order)
        .map((item) => {
          // Prefer the real catalog slug when the CMS entry points at a known
          // catalog category; otherwise derive one from the label. Never the raw
          // label — the Categories page resolves by canonical slug/id.
          const catalogMatch = (allCategories ?? []).find((c) => c.id === item.id);
          return {
            id: item.id,
            slug: catalogMatch?.slug || slugifyPathSegment(item.label),
            name: item.label,
            count: 0,
            image: item.image,
          };
        });
    }
    return buildCategoryDisplayList(allCategories ?? [], allCatalogProducts ?? []).slice(0, 12);
  }, [allCategories, allCatalogProducts, homepageConfig?.topCategories]);

  const { cards: spotlightCards, viralTodayCards, hasCampaigns: hasSpotlight } = useHomepageSpotlight(
    allCatalogProducts,
    BRAND_IMAGES,
  );

  const priorityNowMs = usePriorityClockMs();

  const spotlightExperience = useMemo(
    () =>
      resolveSpotlightExperience({
        catalog: allCatalogProducts,
        guides: allGuides ?? [],
        creators: allCreators ?? [],
        brandPosts: getAllBrandPosts(),
        brandLogos: BRAND_IMAGES,
      }).filter((item) => ALLOW_DEMO || item.sourceKind !== 'synthetic'),
    [allCatalogProducts, allGuides, allCreators],
  );

  const viralTodayItems = useMemo(() => {
    const cmsItems = homepageConfig?.viralTodayItems;
    if (cmsItems?.length) {
      return mapCmsViralTodayItems(cmsItems);
    }
    return buildHomeViralTodayItems(
      viralTodayCards,
      allGuides ?? [],
      allCatalogProducts,
      priorityNowMs,
      spotlightExperience,
    );
  }, [
    homepageConfig?.viralTodayItems,
    viralTodayCards,
    allGuides,
    allCatalogProducts,
    priorityNowMs,
    spotlightExperience,
  ]);

  const featuredProducts = useMemo(() => {
    const featuredIds = homepageConfig?.featuredProductIds?.length
      ? homepageConfig.featuredProductIds
      : getSectionItemIds(homepageConfig, 'trending');
    if (featuredIds.length) {
      const ordered = orderByCatalogIds(allCatalogProducts, featuredIds);
      if (ordered.length) return ordered.slice(0, 8);
    }
    // No staff picks yet: the newest real products.
    return [...allCatalogProducts]
      .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))
      .slice(0, 8);
  }, [allCatalogProducts, homepageConfig]);

  const featuredProductFeed = useSponsoredFeedEntries(
    'home',
    featuredProducts,
    (product) => `home-featured-${product.id}`,
  );

  const promoTiles = useMemo((): HomePromoTile[] => {
    const featuredDealIds = homepageConfig?.featuredDealIds?.length
      ? homepageConfig.featuredDealIds
      : getSectionItemIds(homepageConfig, 'deals');

    const dealSource = featuredDealIds.length
      ? pickByCatalogIds(allCatalogProducts, featuredDealIds)
      : allDeals.length
        ? allDeals
        : allCatalogProducts.filter((p) => p.isDeal || p.originalPrice);

    const kinds: HomePromoTile['kind'][] = ['flash', 'bank', 'cashback', 'coupon', 'weekend', 'campaign', 'sponsored'];

    return dealSource.slice(0, 8).map((item: any, idx) => ({
      id: String(item.id ?? item.dealId ?? idx),
      title: item.title ?? item.name ?? 'Special Offer',
      subtitle: item.description ?? item.brandName ?? 'Limited time promotion on Choosify',
      href: item.href ?? (item.id ? productPath(item) : '/deals'),
      badge: kinds[idx % kinds.length].replace('_', ' '),
      kind: kinds[idx % kinds.length],
      image: item.image,
    }));
  }, [allCatalogProducts, allDeals, homepageConfig]);

  const spotlightBrands = useMemo(() => {
    const placementBrands = allPlacements
      .filter((p) => isPlacementActive(p) && p.placement === 'spotlight_section' && p.entityType === 'brand')
      .map((p) => brandsList.find((b: any) => String(b.id) === p.entityId))
      .filter(Boolean);
    // Up to 12: the home grid shows only whole rows (8 / 9 / 8 / 12 by screen width).
    if (placementBrands.length) return placementBrands.slice(0, 12);

    const featuredIds = homepageConfig?.featuredBrandIds?.length
      ? homepageConfig.featuredBrandIds
      : getSectionItemIds(homepageConfig, 'featured-brands');
    if (featuredIds.length) {
      const picked = pickByCatalogIds(brandsList as any[], featuredIds);
      if (picked.length) return picked.slice(0, 12);
    }
    // No staff picks yet: real brands with an uploaded logo (the storefront fills a missing
    // logo with initials, so require an image URL). Promoted brands first (Super Admin pins,
    // Featured/Sponsored, verified owners — the Brands page order); every other brand gets a
    // daily rotation: one shuffle per Bangladesh day, the same for everyone all day, so every
    // brand gets homepage exposure over time instead of only the first letters of A–Z.
    const withLogo = (brandsList as any[]).filter((b) => /^(https?:|\/|data:image)/i.test(String(b?.logo || '')));
    const pinned = new Set(pinnedBrandIds);
    const promoted = (b: any) =>
      pinned.has(String(b.catalogId ?? b.id)) || pinned.has(String(b.id)) || b.sponsoredFlag || b.featuredFlag || isVerifiedBrand(b);
    const dayKey = new Date(Date.now() + 6 * 3600_000).toISOString().slice(0, 10);
    const dailyRank = (b: any) => {
      let h = 2166136261;
      for (const ch of `${dayKey}:${b.catalogId ?? b.id}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
      return h >>> 0;
    };
    const front = recommendedBrandOrder(withLogo.filter(promoted), pinnedBrandIds);
    const rotating = withLogo.filter((b) => !promoted(b)).sort((a, b) => dailyRank(a) - dailyRank(b));
    return [...front, ...rotating].slice(0, 12);
  }, [brandsList, homepageConfig, allPlacements, pinnedBrandIds]);

  const trendingBrandTab = useMemo(
    () => [...brandsList].sort((a: any, b: any) => (b.ratings ?? 0) - (a.ratings ?? 0)).slice(0, 24),
    [brandsList],
  );

  const bangladeshiBrandTab = useMemo(
    () =>
      brandsList
        .filter((b: any) => !b.category?.toLowerCase().includes('international'))
        .slice(0, 24),
    [brandsList],
  );

  const internationalBrandTab = useMemo(
    () =>
      brandsList
        .filter((b: any) =>
          ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Unilever'].some((n) =>
            String(b.name).toLowerCase().includes(n.toLowerCase()),
          ),
        )
        .slice(0, 24),
    [brandsList],
  );

  const newBrandTab = useMemo(
    () => [...brandsList].sort((a: any, b: any) => String(b.id).localeCompare(String(a.id))).slice(0, 24),
    [brandsList],
  );

  const homepageGuides = useMemo(() => {
    const featuredIds = homepageConfig?.featuredGuideIds?.length
      ? homepageConfig.featuredGuideIds
      : getSectionItemIds(homepageConfig, 'recommended');
    if (featuredIds.length) {
      const picked = pickByCatalogIds(allGuides, featuredIds);
      if (picked.length) return picked.slice(0, 12);
    }
    return allGuides.slice(0, 12);
  }, [allGuides, homepageConfig]);

  const homeFeaturedGuideSlides = useMemo(() => {
    const youtube = homepageGuides.filter((g: any) => g?.type === 'video');
    const reels = homepageGuides.filter((g: any) => g?.type === 'reels' || g?.type === 'shorts');
    const blogs = homepageGuides.filter((g: any) => !['video', 'reels', 'shorts'].includes(g?.type));
    const lanes = [
      { list: youtube, kind: 'youtube' as const },
      { list: reels, kind: 'reels' as const },
      { list: blogs, kind: 'blog' as const },
    ];
    const seen = new Set<string | number>();
    const slides: Array<{ guide: any; kind: HomeGuideCarouselKind }> = [];
    const maxRounds = Math.max(...lanes.map((l) => l.list.length), 0);
    for (let round = 0; round < maxRounds && slides.length < 12; round += 1) {
      for (const lane of lanes) {
        const guide = lane.list[round];
        if (!guide?.id || seen.has(guide.id)) continue;
        seen.add(guide.id);
        slides.push({ guide, kind: lane.kind });
        if (slides.length >= 12) break;
      }
    }
    if (!slides.length) {
      homepageGuides.slice(0, 8).forEach((guide: any) => {
        if (guide?.id) slides.push({ guide, kind: getHomeGuideKind(guide) });
      });
    }
    return slides;
  }, [homepageGuides]);

  const featuredCreators = useMemo(() => {
    const featuredIds = homepageConfig?.featuredCreatorIds?.length
      ? homepageConfig.featuredCreatorIds
      : getSectionItemIds(homepageConfig, 'creators');
    if (featuredIds.length) {
      const picked = pickByCatalogIds(allCreators, featuredIds);
      if (picked.length) return picked.slice(0, 8);
    }
    return allCreators.filter((c: any) => c.isFeatured || c.featuredFlag).slice(0, 8);
  }, [allCreators, homepageConfig]);

  return {
    homepageConfig,
    sectionVisible,
    livePulseItems,
    categories,
    spotlightCards,
    viralTodayItems,
    hasSpotlight,
    hasViralToday: viralTodayItems.length > 0,
    featuredProductFeed,
    promoTiles,
    spotlightBrands,
    trendingBrandTab,
    bangladeshiBrandTab,
    internationalBrandTab,
    newBrandTab,
    homeFeaturedGuideSlides,
    featuredCreators,
    recentlyViewed: isLoggedIn ? recentlyViewed : [],
    brandFallback: ALLOW_DEMO ? BRANDS : [],
  };
}
