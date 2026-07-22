import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from '../lib/notify';
import { cn } from '../lib/utils';

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
    brandColor?: string;
  };
  onClick?: () => void;
}

const BRAND_COLORS = [
  '#000435',
  '#EB4501',
  '#2323FF',
  '#07A828',
  '#EB4501',
  '#6C4CFF',
  '#0F766E',
  '#BE123C',
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function hashColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return BRAND_COLORS[Math.abs(h) % BRAND_COLORS.length];
}

export function mapBrandToCardDesign(brand: any, fallback?: any) {
  const originalBrand = fallback || brand;
  const category = brand.category || originalBrand?.category || 'Fashion';
  const bestFor =
    category === 'Fashion'
      ? 'Footwear'
      : category === 'Tech' || category === 'Electronics'
        ? 'Electronics'
        : category;
  const priceRange =
    originalBrand?.priceRange ||
    (category === 'Fashion' ? '৳500-2000' : '৳5000-25000');

  return {
    id: brand.id,
    name: brand.name,
    logo: brand.logo || brand.avatar || brand.name?.slice(0, 2)?.toUpperCase() || 'BR',
    category,
    bestFor,
    priceRange,
    rating: brand.rating || brand.ratings || 4.8,
    reviewCount:
      (brand.reviewCount ?? brand.reviews ?? Math.floor((brand.followers || 8400) * 0.1)) || 840,
    isFeatured: !!(brand.isFeatured || brand.featuredFlag),
    isHot: !!brand.isHot,
    successScore:
      brand.successScore ||
      (brand.recommended ? parseInt(String(brand.recommended), 10) : undefined) ||
      Math.round((brand.rating || 4.8) * 20),
    tagline:
      brand.tagline ||
      brand.description ||
      originalBrand?.description ||
      'Traditional & contemporary clothing',
    coverImage: brand.coverImage,
    brandColor: brand.brandColor || brand.primaryColor,
  };
}

/** Choosify.dc.html Brands List directory tile */
export const BrandCardDesign = memo(function BrandCardDesign({
  brand,
  onClick,
}: BrandCardDesignProps) {
  const { savedBrands, setSavedBrands } = useDashboard();
  const bestForText = brand.bestFor ?? brand.category ?? 'Fashion';
  const score =
    brand.successScore ||
    (brand.recommended ? parseInt(String(brand.recommended), 10) : null) ||
    Math.round((brand.rating || 4.5) * 20);

  let priceText = '৳500-2000';
  if (brand.priceRange) priceText = brand.priceRange;
  else if (brand.minPrice !== undefined && brand.maxPrice !== undefined) {
    priceText = `৳${formatNumber(brand.minPrice)}-${formatNumber(brand.maxPrice)}`;
  } else if (brand.minPrice !== undefined) {
    priceText = `From ৳${formatNumber(brand.minPrice)}`;
  }

  const bannerBg = brand.brandColor || hashColor(brand.name);
  const isSaved = savedBrands?.some((b: any) => String(b.id) === String(brand.id));

  const circumference = 2 * Math.PI * 18;
  const dashOffset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!setSavedBrands) return;
    if (isSaved) {
      setSavedBrands((prev: any[]) => prev.filter((b) => String(b.id) !== String(brand.id)));
      toast.success('Removed from saved brands');
    } else {
      setSavedBrands((prev: any[]) => [...prev, brand]);
      toast.success('Saved brand');
    }
  };

  return (
    <Link
      to={`/brands/${brand.id}`}
      onClick={onClick}
      className="block w-full min-w-0 h-full bg-white rounded-[10px] border border-[#E8EDF2] overflow-hidden relative group select-none"
    >
      {/* Color banner — Choosify.dc.html */}
      <div
        className="relative h-[100px] flex items-center justify-center px-3"
        style={{ background: bannerBg }}
      >
        <div className="text-[22px] font-extrabold text-white text-center leading-tight line-clamp-2">
          {brand.name}
        </div>
        <button
          type="button"
          onClick={toggleWish}
          className="absolute top-2 right-2 w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center border-0 cursor-pointer z-10 shadow-sm"
          aria-label={isSaved ? 'Unsave brand' : 'Save brand'}
        >
          <Heart
            size={12}
            strokeWidth={2}
            className="text-[#EB4501]"
            fill={isSaved ? '#EB4501' : 'none'}
          />
        </button>
      </div>

      <div className="p-4 text-center flex flex-col flex-1">
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <h3 className="text-[14px] font-extrabold text-[#1A1A2E] truncate">{brand.name}</h3>
          <span className="text-[#2323FF] text-[12px] font-extrabold" aria-label="Verified">
            ✓
          </span>
        </div>
        <p className="text-[11px] text-[#2323FF] mb-3">✓ Verified Brand</p>

        {/* Stats — dc Brands List: Best For | Price Range | Success ring */}
        <div className="flex items-center justify-between gap-1 px-1 py-3.5 mb-3.5">
          <div className="min-w-0 text-left">
            <div className="text-[13px] font-extrabold text-[#1A1A2E] leading-tight">Best For</div>
            <div className="text-[12px] font-bold text-[#8A00C4] truncate">{bestForText}</div>
          </div>
          <div className="min-w-0 text-center px-1">
            <div className="text-[15px] font-extrabold text-[#2323FF] truncate leading-tight">
              {priceText.replace(/^From\s+/i, '').split('-')[0] || priceText}
            </div>
            <div className="text-[9.5px] text-[#4B5563]">Price Range</div>
          </div>
          <div className="min-w-0 flex flex-col items-center text-center">
            <div className="relative w-11 h-11 mb-0.5">
              <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#F1F1F3" strokeWidth="4" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#07DD05"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-[#1A1A2E]">{score}%</span>
              </div>
            </div>
            <div className="text-[9px] text-[#9AA0AC]">Success</div>
          </div>
        </div>

        <span className="mt-auto block w-full choosify-dark-surface hover:brightness-110 text-white text-center py-[9px] rounded-lg text-[11.5px] font-bold transition-[filter]">
          View Brand
        </span>
      </div>
    </Link>
  );
});
