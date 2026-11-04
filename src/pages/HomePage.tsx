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
import { HomeAdSpot, HomeSponsoredBannerSection } from '../components/home/sections/HomeSponsoredBannerSection';

/** Ads Studio homepage spot after each section (spotlight / trending already carry theirs). */
const AD_SPOT_AFTER: Record<string, string> = {
  categories: 'after-categories',
  deals: 'after-deals',
  compare: 'after-compare',
  recommended: 'after-guides',
  'featured-brands': 'after-featured-brands',
  services: 'after-services',
  'recently-viewed': 'after-recently-viewed',
};
import { HomeFeaturedBrandsSection } from '../components/home/sections/HomeFeaturedBrandsSection';
import { HomePopularServicesSection } from '../components/home/sections/HomePopularServicesSection';
import { HomeRecentlyViewedSection } from '../components/home/sections/HomeRecentlyViewedSection';
import { getOrderedHomeSectionIds } from '../utils/homepageCms';
import { CtaBannerSlot } from '../components/CtaBannerSlot';
import { SITE_TAGLINE } from '../lib/seoConfig';

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

  // Viral Today keeps its place even with no real media yet (it shows an empty note).
  const showSpotlight = data.sectionVisible('spotlight');
  const showStandaloneTrending = data.sectionVisible('trending') && !showSpotlight;

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
          <React.Fragment key="deals">
            <CtaBannerSlot page="home" section="home-deals" position="before" className="max-w-7xl mx-auto px-6 mb-6" />
            <HomeTodaysDealsSection tiles={data.promoTiles} />
            <CtaBannerSlot page="home" section="home-deals" position="after" className="max-w-7xl mx-auto px-6 mt-6" />
          </React.Fragment>
        ) : null;

      case 'compare':
        return data.sectionVisible('compare') ? <HomeCompareSection key="compare" /> : null;

      case 'recommended':
        return data.sectionVisible('recommended') ? (
          <HomeBuyingGuidesSection key="recommended" guideSlides={data.homeFeaturedGuideSlides} />
        ) : null;

      case 'featured-brands':
        return data.sectionVisible('featured-brands') ? (
          <React.Fragment key="featured-brands">
            <CtaBannerSlot page="home" section="home-featured-brands" position="before" className="max-w-7xl mx-auto px-6 mb-6" />
            <HomeFeaturedBrandsSection
              featuredBrands={data.spotlightBrands}
              brandFallback={data.brandFallback}
            />
            <CtaBannerSlot page="home" section="home-featured-brands" position="after" className="max-w-7xl mx-auto px-6 mt-6" />
          </React.Fragment>
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
      {/* The hero is image/video only, so the page heading is for screen readers and crawlers. */}
      <h1 className="sr-only">{SITE_TAGLINE}</h1>
      {/* Hero locked at top when visible — not reordered with main sections */}
      {data.sectionVisible('hero') && (
        <div id="home-top">
          <Hero variant="homepage" />
        </div>
      )}
      {/* Top Categories pulls itself up over the hero (up to 56px); give it that room under the ad. */}
      <HomeAdSpot position="after-hero" className="mb-[40px] sm:mb-[48px] md:mb-[64px] lg:mb-[80px]" />

      <main className="pb-8">
        {sectionOrder.map((sectionId) => {
          const node = renderSection(sectionId);
          const spot = AD_SPOT_AFTER[sectionId];
          return node && spot ? (
            <React.Fragment key={`${sectionId}-with-ad`}>
              {node}
              <HomeAdSpot position={spot} />
            </React.Fragment>
          ) : (
            node
          );
        })}
        {/* If neither spotlight nor standalone trending rendered, still show sponsored once */}
        {!showSpotlight && !showStandaloneTrending && <HomeSponsoredBannerSection />}
        <HomeAdSpot position="page-end" />
        <CtaBannerSlot page="home" section="home-end" position="after" className="max-w-7xl mx-auto px-6 mt-8" />
      </main>
    </HomepageLayout>
  );
}
