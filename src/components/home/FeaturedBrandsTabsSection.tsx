import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PremiumCarousel } from './PremiumCarousel';
import { BrandCardDesign, mapBrandToCardDesign } from '../BrandCardDesign';
import { cn } from '../../lib/utils';

type BrandTab = 'featured' | 'trending' | 'verified' | 'new';

interface FeaturedBrandsTabsSectionProps {
  featuredBrands: any[];
  trendingBrands: any[];
  verifiedBrands: any[];
  newBrands: any[];
  brandFallback?: any[];
}

export function FeaturedBrandsTabsSection({
  featuredBrands,
  trendingBrands,
  verifiedBrands,
  newBrands,
  brandFallback = [],
}: FeaturedBrandsTabsSectionProps) {
  const [tab, setTab] = useState<BrandTab>('featured');

  const datasets: Record<BrandTab, any[]> = {
    featured: featuredBrands,
    trending: trendingBrands,
    verified: verifiedBrands,
    new: newBrands,
  };

  const activeBrands = datasets[tab].length ? datasets[tab] : featuredBrands;

  const tabs: { id: BrandTab; label: string }[] = [
    { id: 'featured', label: 'Featured' },
    { id: 'trending', label: 'Trending' },
    { id: 'verified', label: 'Verified' },
    { id: 'new', label: 'New' },
  ];

  return (
    <div id="section-featured-brands" className="p-6 md:p-8 shadow-sm text-left bg-white rounded-[5px] border border-[#e8edf2] mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#1a1a2e]">
            Featured <span className="text-[#E8500A]">Brands</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Trusted brands — featured, trending, verified, and new on Choosify.</p>
        </div>
        <Link to="/brands" className="text-[12px] font-medium text-[#E8500A] shrink-0 hover:underline">
          View All Brands
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Brand filters">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3 py-2 min-h-[44px] text-[10px] font-bold uppercase tracking-wide rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8500A]',
              tab === t.id ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-[#e8edf2]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PremiumCarousel
        items={activeBrands}
        itemWidth={280}
        gap={20}
        renderCard={(brand) => {
          const fallback = brandFallback.find((b) => b.id === brand.id);
          return (
            <div className="shrink-0 w-[280px]">
              <BrandCardDesign brand={mapBrandToCardDesign(brand, fallback)} />
            </div>
          );
        }}
      />
    </div>
  );
}
