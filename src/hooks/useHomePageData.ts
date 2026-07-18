import { useMemo, useCallback } from 'react';
import { BRANDS } from '../constants';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useHomepageSpotlight } from './useHomepageSpotlight';
import { useSponsoredFeedEntries } from './useSponsoredFeedEntries';
import { getSectionItemIds, isHomeSectionVisible } from '../utils/homepageCms';
import { pickByCatalogIds, orderByCatalogIds } from '../utils/catalogMatch';
import { isPlacementActive } from '../utils/editorialMappers';
import { buildCategoryDisplayList } from '../utils/categoryDisplay';
import { getHomeLivePulseItems } from '../lib/home/homepageLivePulse';
import { buildHomeViralTodayItems } from '../utils/homeViralToday';
import type { HomePromoTile } from '../components/home/sections/HomeTodaysDealsSection';

type HomeGuideCarouselKind = 'youtube' | 'reels' | 'blog';

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

  const brandsList = allCatalogBrands.length > 0 ? allCatalogBrands : allBrands.length > 0 ? allBrands : BRANDS;

  const livePulseItems = useMemo(
    () => getHomeLivePulseItems(homepageConfig, siteConfig),
    [homepageConfig, siteConfig],
  );

  const categories = useMemo(
    () => buildCategoryDisplayList(allCategories ?? [], allCatalogProducts ?? []).slice(0, 12),
    [allCategories, allCatalogProducts],
  );

  const { cards: spotlightCards, hasCampaigns: hasSpotlight } = useHomepageSpotlight(
    allCatalogProducts,
    BRAND_IMAGES,
  );

  const viralTodayItems = useMemo(
    () => buildHomeViralTodayItems(spotlightCards, allGuides ?? [], allCatalogProducts),
    [spotlightCards, allGuides, allCatalogProducts],
  );

  const featuredProducts = useMemo(() => {
    const featuredIds = homepageConfig?.featuredProductIds?.length
      ? homepageConfig.featuredProductIds
      : getSectionItemIds(homepageConfig, 'trending');
    if (featuredIds.length) {
      const ordered = orderByCatalogIds(allCatalogProducts, featuredIds);
      if (ordered.length) return ordered.slice(0, 8);
    }
    return allCatalogProducts
      .filter((p) => p.isNewArrival || Number.parseInt(String(p.id).replace(/\D/g, ''), 10) % 3 === 0)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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
      href: item.href ?? (item.id ? `/products/${item.id}` : '/deals'),
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
    if (placementBrands.length) return placementBrands.slice(0, 8);

    const featuredIds = homepageConfig?.featuredBrandIds?.length
      ? homepageConfig.featuredBrandIds
      : getSectionItemIds(homepageConfig, 'featured-brands');
    if (featuredIds.length) {
      const picked = pickByCatalogIds(brandsList as any[], featuredIds);
      if (picked.length) return picked.slice(0, 8);
    }
    return brandsList.filter((b: any) => b.ratings >= 4.7 || b.featuredFlag || b.sponsoredFlag).slice(0, 8);
  }, [brandsList, homepageConfig, allPlacements]);

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
    brandFallback: BRANDS,
  };
}
