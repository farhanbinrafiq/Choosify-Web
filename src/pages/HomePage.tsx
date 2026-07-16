import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { BRANDS } from '../constants';
import {
  CATEGORY_ITEMS,
  SPOTLIGHT_CARDS,
  FEATURED_PRODUCTS_MOCK,
  BUYING_GUIDES
} from '../data/homeData';
import { 
  MarketplaceHero, 
  CompareSection, 
  ServicesSection,
  FeaturedProductsSection,
  DealsSection,
  FeaturedBrandsSection,
  SpotlightSection,
  BuyingGuidesSection,
  RecentlyViewedSection,
  CreatorHighlightsSection,
  CommunityReviewsSection,
  TrustSection,
  CategoriesSection
} from '../components/ui/home';
import { CalloutCard } from '../components/ui/content/CalloutCard';

export function HomePage() {
  const navigate = useNavigate();
  const { recentlyViewed } = useDashboard();

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans pb-20">
      {/* 1. HERO SECTION (Edge-to-edge) */}
      <MarketplaceHero 
        onCta1Click={(idx) => navigate(idx === 0 ? '/discover' : '/discover')}
        onCta2Click={(idx) => navigate(idx === 0 ? '/about' : '/about')}
      />

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 space-y-16 py-16">
        
        {/* 2. TOP CATEGORIES */}
        <CategoriesSection categories={CATEGORY_ITEMS} />

        {/* 3. TRENDING IN SPOTLIGHT */}
        <SpotlightSection cards={SPOTLIGHT_CARDS} />

        {/* 4. FEATURED PRODUCTS */}
        <FeaturedProductsSection products={FEATURED_PRODUCTS_MOCK} />

        {/* 5. TODAY'S DEALS */}
        <DealsSection />

        {/* 6. COMPARE ANYTHING */}
        <CompareSection />

        {/* 7. TOP BUYING GUIDES */}
        <BuyingGuidesSection guides={BUYING_GUIDES} />

        {/* 8. FEATURED BRANDS */}
        <FeaturedBrandsSection brands={BRANDS} />

        {/* 9. CREATOR HIGHLIGHTS */}
        <CreatorHighlightsSection />

        {/* 10. COMMUNITY REVIEWS */}
        <CommunityReviewsSection />

        {/* 11. TRUST LAYER */}
        <TrustSection />
        
        {/* EDITORIAL CALLOUT */}
        <div className="py-8">
          <CalloutCard 
            variant="expert" 
            content="Every recommendation on Choosify combines verified product data, creator expertise, community reviews, and marketplace intelligence to help buyers make informed decisions." 
          />
        </div>

        {/* 12. POPULAR SERVICES */}
        <ServicesSection onServiceClick={(id) => navigate('/categories')} />

        {/* 13. RECENTLY VIEWED */}
        <RecentlyViewedSection recentlyViewed={recentlyViewed} />

      </div>
    </div>
  );
}
