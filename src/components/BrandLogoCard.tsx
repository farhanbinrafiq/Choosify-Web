import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface Brand {
  id: string | number;
  name: string;
  logo?: string;
  rating: number;
  reviews?: number;
  reviewCount?: number;
}

interface BrandLogoCardProps {
  brand: Brand;
  onClick?: () => void;
  className?: string;
}

export const BrandLogoCard = memo(function BrandLogoCard({ brand, onClick, className }: BrandLogoCardProps) {
  const reviewsCount = brand.reviews ?? brand.reviewCount ?? 120;
  
  return (
    <Link
      to={`/brands/${brand.id}`}
      onClick={onClick}
      id={`brand-logo-card-${brand.id}`}
      className={cn(
        "block bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group select-none text-center flex flex-col items-center justify-between gap-3 cursor-pointer",
        className
      )}
    >
      {/* Wordmark Logo Container */}
      <div className="w-16 h-16 rounded-full border border-slate-100 bg-slate-50/50 flex items-center justify-center overflow-hidden shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
        {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
          <img 
            src={brand.logo} 
            alt={`${brand.name} logo`} 
            className="w-12 h-12 object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-2xl font-black text-[#000435] tracking-tight">
            {brand.logo || brand.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Brand Wordmark Style Name & Rating Info */}
      <div className="flex flex-col items-center min-w-0">
        <h3 className="text-sm font-black text-[#000435] uppercase line-clamp-1 mb-1 tracking-tight group-hover:text-[#CF4400] transition-colors">
          {brand.name}
        </h3>
        
        {/* Rating and review section */}
        <div className="flex items-center gap-1.5 justify-center">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={11}
                className={cn(
                  "shrink-0",
                  star <= Math.round(brand.rating) 
                    ? "fill-[#EB4501] text-[#EB4501]" 
                    : "text-slate-200"
                )}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-[#000435] leading-none">
            {brand.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-none">
            ({reviewsCount})
          </span>
        </div>
      </div>
    </Link>
  );
});
