import React from 'react';
import { useRegisterPageFilters } from '../components/FilterEngine';
import { useHomePageData } from '../hooks/useHomePageData';
import { Hero } from '../components/hero';
import { HomepageLayout } from '../components/home/HomepageLayout';
import { HomeTopCategoriesSection } from '../components/home/sections/HomeTopCategoriesSection';
import { HomeSpotlightPreviewSection } from '../components/home/sections/HomeSpotlightPreviewSection';
import { HomeFeaturedProductsSection } from '../components/home/sections/HomeFeaturedProductsSection';
import { HomeTodaysDealsSection } from '../components/home/sections/HomeTodaysDealsSection';
import { HomeCompareSection } from '../components/home/sections/HomeCompareSection';
import { HomeBuyingGuidesSection } from '../components/home/sections/HomeBuyingGuidesSection';
import { HomeSponsoredBannerSection } from '../components/home/sections/HomeSponsoredBannerSection';
import { HomeFeaturedBrandsSection } from '../components/home/sections/HomeFeaturedBrandsSection';
import { HomePopularServicesSection } from '../components/home/sections/HomePopularServicesSection';
import { HomeRecentlyViewedSection } from '../components/home/sections/HomeRecentlyViewedSection';

/**
 * Homepage — layout sourced from Choosify.dc.html Home screen.
 * Business data via useHomePageData; Footer from App shell.
 */
export function HomePage() {
  const data = useHomePageData();

  useRegisterPageFilters(
    {
      pageName: 'Home',
      renderSearch: null,
      renderFilters: null,
      activeFilterCount: 0,
      onClearAll: () => {},
      quickFilters: [],
    },
    [],
  );

  return (
    <HomepageLayout>
      {data.sectionVisible('hero') && (
        <div id="home-top">
          <Hero variant="homepage" />
        </div>
      )}

      <main className="pb-8">
        {data.sectionVisible('categories') && (
          <HomeTopCategoriesSection categories={data.categories} />
        )}

        {data.sectionVisible('spotlight') && data.hasViralToday && (
          <HomeSpotlightPreviewSection items={data.viralTodayItems} />
        )}

        {data.sectionVisible('trending') && (
          <HomeFeaturedProductsSection feed={data.featuredProductFeed} />
        )}

        {/* Choosify.dc.html — sponsored banner after featured products */}
        <HomeSponsoredBannerSection />

        {data.sectionVisible('deals') && (
          <HomeTodaysDealsSection tiles={data.promoTiles} />
        )}

        {data.sectionVisible('compare') && <HomeCompareSection />}

        {/* Top Buying Guides — Choosify.dc.html (demo fallback when catalog empty) */}
        <HomeBuyingGuidesSection guideSlides={data.homeFeaturedGuideSlides} />

        {data.sectionVisible('featured-brands') && (
          <HomeFeaturedBrandsSection
            featuredBrands={data.spotlightBrands}
            brandFallback={data.brandFallback}
          />
        )}

        {data.sectionVisible('services') && <HomePopularServicesSection />}

        {data.recentlyViewed.length > 0 && data.sectionVisible('recently-viewed') && (
          <HomeRecentlyViewedSection products={data.recentlyViewed} />
        )}
      </main>
    </HomepageLayout>
  );
}
