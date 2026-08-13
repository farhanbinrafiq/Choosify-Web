import React, { useMemo } from 'react';
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
import { getOrderedHomeSectionIds } from '../utils/homepageCms';

/**
 * Homepage — layout sourced from Choosify.dc.html Home screen.
 * Business data via useHomePageData; Footer from App shell.
 * Section order/visibility driven by CMS homepageConfig (published or draft preview).
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

  const sectionOrder = useMemo(
    () => getOrderedHomeSectionIds(data.homepageConfig),
    [data.homepageConfig],
  );

  const showSpotlight = data.sectionVisible('spotlight') && data.hasViralToday;
  const showStandaloneTrending =
    data.sectionVisible('trending') && !(showSpotlight && data.hasViralToday);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'categories':
        return data.sectionVisible('categories') ? (
          <HomeTopCategoriesSection key="categories" categories={data.categories} />
        ) : null;

      case 'spotlight':
        return showSpotlight ? (
          <React.Fragment key="spotlight">
            <HomeSpotlightPreviewSection
              items={data.viralTodayItems}
              productFeed={
                data.sectionVisible('trending') ? data.featuredProductFeed : undefined
              }
            />
            <HomeSponsoredBannerSection />
          </React.Fragment>
        ) : null;

      case 'trending':
        return showStandaloneTrending ? (
          <React.Fragment key="trending">
            <HomeFeaturedProductsSection feed={data.featuredProductFeed} />
            {/* Sponsored banner after featured products when spotlight did not already render it */}
            {!showSpotlight && <HomeSponsoredBannerSection />}
          </React.Fragment>
        ) : null;

      case 'deals':
        return data.sectionVisible('deals') ? (
          <HomeTodaysDealsSection key="deals" tiles={data.promoTiles} />
        ) : null;

      case 'compare':
        return data.sectionVisible('compare') ? <HomeCompareSection key="compare" /> : null;

      case 'recommended':
        return data.sectionVisible('recommended') ? (
          <HomeBuyingGuidesSection key="recommended" guideSlides={data.homeFeaturedGuideSlides} />
        ) : null;

      case 'featured-brands':
        return data.sectionVisible('featured-brands') ? (
          <HomeFeaturedBrandsSection
            key="featured-brands"
            featuredBrands={data.spotlightBrands}
            brandFallback={data.brandFallback}
          />
        ) : null;

      case 'services':
        return data.sectionVisible('services') ? (
          <HomePopularServicesSection key="services" />
        ) : null;

      case 'recently-viewed':
        return data.recentlyViewed.length > 0 && data.sectionVisible('recently-viewed') ? (
          <HomeRecentlyViewedSection key="recently-viewed" products={data.recentlyViewed} />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <HomepageLayout>
      {/* Hero locked at top when visible — not reordered with main sections */}
      {data.sectionVisible('hero') && (
        <div id="home-top">
          <Hero variant="homepage" />
        </div>
      )}

      <main className="pb-8">
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
        {/* If neither spotlight nor standalone trending rendered, still show sponsored once */}
        {!showSpotlight && !showStandaloneTrending && <HomeSponsoredBannerSection />}
      </main>
    </HomepageLayout>
  );
}
