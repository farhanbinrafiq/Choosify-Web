import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

interface BrandCardDesignProps {
  brand: {
    id: string | number;
    name: string;
    logo: string;
    description?: string;
    tagline?: string;
    rating: number;
    reviews?: number;
    reviewCount?: number;
    category?: string;
    bestFor?: string;
    priceRange?: string;
    minPrice?: number;
    maxPrice?: number;
    successScore?: number;
    recommended?: string;
    isHot?: boolean;
    isFeatured?: boolean;
    coverImage?: string;
  };
  onClick?: () => void;
}

const BRAND_COVERS: Record<string, string> = {
  "Samsung": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  "Apple": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80",
  "Apex": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "Bata": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
  "Sony": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "Lotto": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80",
  "La Reve": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "Le Reve": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "Perfume World": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
  "Pickaboo": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  "Aarong": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
  "Yellow": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "Sailor": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  "Ecstasy": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  "Richman": "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80",
  "Star Tech": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&q=80",
  "Choosify": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80",
  "FFF Sourcing Ltd": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80"
};

const CATEGORY_COVERS: Record<string, string> = {
  "Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  "Tech": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  "Electronics": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  "Beauty": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
  "Sports": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80",
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export const BrandCardDesign = memo(function BrandCardDesign({ brand, onClick }: BrandCardDesignProps) {
  const reviewsCount = brand.reviews ?? brand.reviewCount ?? 840;
  const bestForText = brand.bestFor ?? brand.category ?? 'Fashion';
  const taglineText = brand.tagline || brand.description || 'Traditional & contemporary clothing';
  
  let priceText = '৳500-2000';
  if (brand.priceRange) {
    priceText = brand.priceRange;
  } else if (brand.minPrice !== undefined && brand.maxPrice !== undefined) {
    priceText = `৳${formatNumber(brand.minPrice)}-${formatNumber(brand.maxPrice)}`;
  } else if (brand.minPrice !== undefined) {
    priceText = `৳${formatNumber(brand.minPrice)}`;
  }

  const score = brand.successScore 
    || (brand.recommended ? parseInt(brand.recommended) : null)
    || Math.round((brand.rating || 4.5) * 20);

  const coverUrl = brand.coverImage 
    || BRAND_COVERS[brand.name] 
    || CATEGORY_COVERS[brand.category || ''] 
    || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80";

  return (
    <Link
      to={`/brands/${brand.id}`}
      onClick={onClick}
      className="block w-[335px] max-w-[335px] min-w-[335px] bg-white rounded-[12px] border border-[#e8edf2] hover:shadow-lg hover:border-[#FF5B00]/40 transition-all duration-300 overflow-hidden group select-none flex flex-col justify-between relative shrink-0"
    >
      {/* FEATURED BADGE */}
      {brand.isFeatured && (
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Featured
          </span>
        </div>
      )}
      {brand.isHot && !brand.isFeatured && (
        <div className="absolute top-3 right-3 z-20">
          <span className="bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Hot
          </span>
        </div>
      )}

      {/* COVER PHOTO SECTION */}
      <div className="relative w-full h-[136px] bg-gradient-to-r from-[#1A1D4E]/10 to-[#FF5B00]/10 overflow-hidden shrink-0">
        <img 
          src={coverUrl}
          alt={`${brand.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
      </div>

      {/* LOGO - overlapping cover at bottom-left */}
      <div className="absolute top-[96px] left-4 z-10">
        <div className="w-[80px] h-[80px] rounded-[8px] border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg">
          {brand.logo.startsWith('http') || brand.logo.startsWith('/') ? (
            <img 
              src={brand.logo} 
              className="w-full h-full object-cover" 
              alt={brand.name}
              loading="lazy"
            />
          ) : (
            <span className="text-2xl font-black text-[#1A1D4E] tracking-tight">{brand.logo}</span>
          )}
        </div>
      </div>

      {/* BRAND INFO SECTION */}
      <div className="px-4 pt-14 pb-3 text-left flex-1 flex flex-col justify-center min-w-0">
        <h3 className="text-base font-black text-[#1A1D4E] uppercase line-clamp-1 mb-1 leading-tight tracking-tight">
          {brand.name}
        </h3>
        
        <p className="text-xs text-gray-500 mb-2 line-clamp-1 leading-normal font-medium">
          {taglineText}
        </p>
        
        <div className="flex items-center gap-1.5 leading-none mt-0.5">
          <div className="flex items-center text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={11} 
                className={cn(
                  "fill-current", 
                  i < Math.floor(brand.rating) ? "text-yellow-400" : "text-gray-200 fill-none"
                )} 
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#1A1D4E]">
            {brand.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-gray-400">
            ({formatNumber(reviewsCount)} reviews)
          </span>
        </div>
      </div>

      {/* STATS SECTION - 3 COLUMNS */}
      <div className="border-t border-b border-[#e8edf2] px-4 py-3 bg-[#F8FBFD] shrink-0">
        <div className="grid grid-cols-3 gap-1">
          {/* Column 1: Best For */}
          <div className="text-center min-w-0">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 leading-none">
              Best For
            </div>
            <div className="text-xs font-black text-[#1A1D4E] truncate leading-tight">
              {bestForText}
            </div>
          </div>
          
          {/* Column 2: Price Range */}
          <div className="text-center border-l border-r border-[#e8edf2] min-w-0 px-1">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 leading-none">
              Price Range
            </div>
            <div className="text-xs font-black text-[#FF5B00] truncate leading-tight">
              {priceText}
            </div>
          </div>
          
          {/* Column 3: Success Score — circular SVG meter */}
          <div className="text-center min-w-0 flex flex-col items-center justify-center">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 leading-none">
              Success
            </div>
            <div className="relative w-11 h-11 shrink-0">
              <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
                {/* Background track */}
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                />
                {/* Progress arc */}
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - score / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black text-emerald-600 leading-none">
                  {score}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="px-4 py-3 shrink-0 bg-white">
        <button 
          type="button"
          className="w-full py-2.5 bg-[#1A1D4E] hover:bg-[#0F0F2E] text-white text-[11px] font-black uppercase rounded-[5px] transition-all duration-200 flex items-center justify-center gap-1.5 group"
        >
          Visit Brand
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>
      </div>
    </Link>
  );
});

// Simple cn utility local helper in case not fully defined
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
