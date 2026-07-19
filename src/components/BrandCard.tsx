import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Brand {
  id: string | number;
  name: string;
  logo: string;
  description?: string;
  tagline?: string;
  rating: number;
  reviews?: number | string;
  reviewCount?: number | string;
  category?: string;
  bestFor?: string;
  priceRange?: string;
  minPrice?: number;
  maxPrice?: number;
  successScore?: number;
  recommended?: string;
  isHot?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  coverImage?: string;
  productsCount?: number;
  followersCount?: number;
  verified?: boolean;
}

interface BrandCardProps {
  brand: Brand;
  onClick?: () => void;
  className?: string;
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

export const BrandCard = memo(function BrandCard({ brand, onClick, className }: BrandCardProps) {
  const reviewsCount = brand.reviews ?? brand.reviewCount ?? 840;
  const taglineText = brand.tagline || brand.description || 'Traditional & contemporary clothing';
  
  const coverUrl = brand.coverImage 
    || BRAND_COVERS[brand.name] 
    || CATEGORY_COVERS[brand.category || ''] 
    || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80";

  return (
    <Link
      to={`/brands/${brand.id}`}
      onClick={onClick}
      className={cn(
        "block w-[335px] max-w-[335px] min-w-[335px] bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group select-none flex flex-col justify-between relative shrink-0 text-left",
        className
      )}
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
      <div className="relative w-full h-[136px] bg-gradient-to-r from-[#000435]/10 to-[#EB4501]/10 overflow-hidden shrink-0">
        <img 
          src={coverUrl}
          alt={`${brand.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
      </div>

      {/* LOGO - overlapping cover at bottom-left */}
      <div className="absolute top-[96px] left-4 z-10">
        <div className="w-[80px] h-[80px] rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden shadow-lg">
          {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
            <img 
              src={brand.logo} 
              className="w-full h-full object-cover" 
              alt={brand.name}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-2xl font-black text-[#000435] tracking-tight">{brand.logo || 'B'}</span>
          )}
        </div>
      </div>

      {/* BRAND INFO SECTION */}
      <div className="px-4 pt-14 pb-3 flex-1 flex flex-col justify-center min-w-0">
        <h3 className="text-base font-black text-[#000435] uppercase line-clamp-1 mb-1 leading-tight tracking-tight flex items-center gap-1.5">
          {brand.name}
        </h3>
        
        {/* Verified Brand Checkmark Badge under the name */}
        {brand.verified && (
          <div className="text-[10px] font-bold text-[#2323FF] bg-[#EEF0FF] border border-[#2323FF]/20 px-2 py-0.5 rounded-full w-fit mb-1.5 flex items-center gap-1">
            <Check size={10} strokeWidth={3.5} />
            <span>Verified Brand</span>
          </div>
        )}
        
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
          <span className="text-xs font-bold text-[#000435]">
            {brand.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-gray-400">
            ({typeof reviewsCount === 'number' ? formatNumber(reviewsCount) : reviewsCount} reviews)
          </span>
        </div>
      </div>

      {/* STATS SECTION - 3 COLUMNS */}
      <div className="border-t border-b border-[#e8edf2] px-4 py-3 bg-[#F4F7F9] shrink-0">
        <div className="grid grid-cols-3 gap-1">
          {/* Column 1: Products */}
          <div className="text-center min-w-0">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none">
              Products
            </div>
            <div className="text-xs font-black text-[#000435] truncate leading-tight">
              {brand.productsCount !== undefined ? formatNumber(brand.productsCount) : "—"}
            </div>
          </div>
          
          {/* Column 2: Rating */}
          <div className="text-center border-l border-r border-[#e8edf2] min-w-0 px-1">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none">
              Rating
            </div>
            <div className="text-xs font-black text-[#EB4501] truncate leading-tight flex items-center justify-center gap-0.5">
              <span>{brand.rating.toFixed(1)}</span>
              <span className="text-[9px]">★</span>
            </div>
          </div>
          
          {/* Column 3: Followers */}
          <div className="text-center min-w-0">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 leading-none">
              Followers
            </div>
            <div className="text-xs font-black text-[#000435] truncate leading-tight">
              {brand.followersCount !== undefined ? formatNumber(brand.followersCount) : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="px-4 py-3 shrink-0 bg-white">
        <div 
          className="w-full py-2 bg-white border-2 border-[#000435] text-[#000435] hover:bg-[#000435] hover:text-white text-[11px] font-black uppercase rounded-[5px] transition-all duration-200 flex items-center justify-center gap-1.5 group cursor-pointer"
        >
          Visit Brand
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </div>
      </div>
    </Link>
  );
});
