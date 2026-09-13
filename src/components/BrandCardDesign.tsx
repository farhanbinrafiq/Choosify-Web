import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { toast } from '../lib/notify';
import { cn } from '../lib/utils';
import { BrandLogo, isBrandLogoUrl } from './brand/BrandLogo';

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
    /** `null` = honestly unknown, omit that stat cell. `undefined` keeps the
     *  legacy directory-tile placeholder for older callers. */
    priceRange?: string | null;
    minPrice?: number;
    maxPrice?: number;
    successScore?: number | null;
    recommended?: string;
    isHot?: boolean;
    isFeatured?: boolean;
    coverImage?: string;
    brandColor?: string;
    /** Highest active %-off among this brand's live deals; omit when none */
    maxDiscountPercent?: number;
    /** Defaults to true (existing directory-tile behavior) when omitted. */
    verified?: boolean;
  };
  onClick?: () => void;
  /**
   * Quick Comparison only: marks this card as the brand currently being viewed —
   * disables the link-through, swaps the CTA to "This Brand", and adds a badge/accent
   * border instead of the normal navigable card treatment. Does not affect any other caller.
   */
  isCurrentInComparison?: boolean;
}

const BRAND_COLORS = [
  '#18154C',
  '#FF5B00',
  '#2323FF',
  '#07A828',
  '#FF5B00',
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

  // `null` on the input is an explicit "honestly unknown" signal (omit);
  // `undefined` keeps the legacy directory-tile placeholder fallback.
  const priceRangeOut = brand.priceRange === null ? null : priceRange;
  const successScoreOut =
    brand.successScore === null
      ? null
      : brand.successScore ||
        (brand.recommended ? parseInt(String(brand.recommended), 10) : undefined) ||
        Math.round((brand.rating || 4.8) * 20);

  return {
    id: brand.id,
    name: brand.name,
    logo: brand.logo || brand.avatar || brand.name?.slice(0, 2)?.toUpperCase() || 'BR',
    category,
    bestFor,
    priceRange: priceRangeOut,
    rating: brand.rating || brand.ratings || 4.8,
    reviewCount:
      (brand.reviewCount ?? brand.reviews ?? Math.floor((brand.followers || 8400) * 0.1)) || 840,
    isFeatured: !!(brand.isFeatured || brand.featuredFlag),
    isHot: !!brand.isHot,
    successScore: successScoreOut,
    tagline:
      brand.tagline ||
      brand.description ||
      originalBrand?.description ||
      'Traditional & contemporary clothing',
    coverImage: brand.coverImage,
    brandColor: brand.brandColor || brand.primaryColor,
    verified: brand.verified ?? brand.verifiedStatus,
  };
}

/** Choosify.dc.html Brands List directory tile */
export const BrandCardDesign = memo(function BrandCardDesign({
  brand,
  onClick,
  isCurrentInComparison,
}: BrandCardDesignProps) {
  const { savedBrands, setSavedBrands } = useDashboard();
  const verified = brand.verified !== false;
  const bestForText = brand.bestFor ?? brand.category ?? 'Fashion';
  const scoreKnown = brand.successScore !== null;
  const score = !scoreKnown
    ? null
    : brand.successScore ||
      (brand.recommended ? parseInt(String(brand.recommended), 10) : null) ||
      Math.round((brand.rating || 4.5) * 20);

  const priceKnown = brand.priceRange !== null;
  let priceText: string | null = '৳500-2000';
  if (!priceKnown) priceText = null;
  else if (brand.priceRange) priceText = brand.priceRange;
  else if (brand.minPrice !== undefined && brand.maxPrice !== undefined) {
    priceText = `৳${formatNumber(brand.minPrice)}-${formatNumber(brand.maxPrice)}`;
  } else if (brand.minPrice !== undefined) {
    priceText = `From ৳${formatNumber(brand.minPrice)}`;
  }

  const isSaved = savedBrands?.some((b: any) => String(b.id) === String(brand.id));

  const circumference = 2 * Math.PI * 18;
  const dashOffset = score === null ? 0 : circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

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

  const CardWrapper: any = isCurrentInComparison ? 'div' : Link;
  // Always the plain profile URL -- the "X% Off" badge above is a decorative,
  // non-interactive (pointer-events-none) overlay on this same whole-card
  // link, not a distinct "View Deals" affordance, so the entire card must
  // never carry the #deals-section deep-link hash. Every brand with any
  // live discount was landing on the deals section instead of the top.
  const wrapperProps = isCurrentInComparison
    ? {}
    : {
        to: `/brands/${brand.id}`,
        onClick,
      };

  return (
    <CardWrapper
      {...(wrapperProps as any)}
      className={cn(
        'block w-full min-w-0 h-full bg-white rounded-[10px] border overflow-hidden relative group select-none',
        isCurrentInComparison ? 'border-[#FF5B00] ring-1 ring-[#FF5B00]/30' : 'border-[#E8EDF2]',
      )}
    >
      {isCurrentInComparison && (
        <span className="absolute top-2 left-2 z-[11] rounded-full bg-[#FF5B00] text-white text-[9px] font-black uppercase tracking-wide px-2.5 py-1 leading-none shadow-sm pointer-events-none">
          This Brand
        </span>
      )}
      {/* Wide brand header — a landscape visual, never the logo stretched:
          real uploaded cover → brand colour → tasteful Choosify gradient. */}
      <div className="relative h-[92px] overflow-hidden">
        {isBrandLogoUrl(brand.coverImage) ? (
          <img src={brand.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : brand.brandColor ? (
          <div className="w-full h-full" style={{ background: brand.brandColor }} />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${hashColor(brand.name)} 0%, #1A1D4E 100%)` }}
          />
        )}
        {!isCurrentInComparison && brand.maxDiscountPercent != null && brand.maxDiscountPercent >= 1 && (
          <span className="absolute top-2 left-2 z-[11] rounded-full bg-[#FF000D] text-white text-[9px] font-extrabold px-2 py-0.5 leading-none shadow-sm pointer-events-none">
            {Math.round(brand.maxDiscountPercent)}% Off
          </span>
        )}
        <button
          type="button"
          onClick={toggleWish}
          className="absolute top-2 right-2 w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center border-0 cursor-pointer z-10 shadow-sm"
          aria-label={isSaved ? 'Unsave brand' : 'Save brand'}
        >
          <Heart
            size={12}
            strokeWidth={2}
            className="text-[#FF5B00]"
            fill={isSaved ? '#FF5B00' : 'none'}
          />
        </button>
      </div>

      {/* Circular brand identity badge overlapping the header's lower edge */}
      <div className="relative p-4 pt-9 text-center flex flex-col flex-1">
        <BrandLogo
          src={isBrandLogoUrl(brand.logo) ? brand.logo : undefined}
          name={brand.name}
          size={68}
          ring
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-[2]"
        />
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <h3 className="text-[14px] font-extrabold text-[#1A1A2E] truncate">{brand.name}</h3>
          {verified && (
            <span className="text-[#2323FF] text-[12px] font-extrabold" aria-label="Verified">
              ✓
            </span>
          )}
        </div>
        {verified && <p className="text-[11px] text-[#2323FF] mb-3">✓ Verified Brand</p>}

        {/* Stats — dc Brands List: Best For | Price Range | Success ring.
            Price Range / Success are omitted (not fabricated) when the
            caller explicitly passes null for real-but-unknown data. */}
        <div className="flex items-center justify-between gap-1 px-1 py-3.5 mb-3.5">
          <div className="min-w-0 text-left">
            <div className="text-[13px] font-extrabold text-[#1A1A2E] leading-tight">Best For</div>
            <div className="text-[12px] font-bold text-[#8A00C4] truncate">{bestForText}</div>
          </div>
          {priceText !== null && (
            <div className="min-w-0 text-center px-1">
              <div className="text-[15px] font-extrabold text-[#2323FF] truncate leading-tight">
                {priceText.replace(/^From\s+/i, '').split('-')[0] || priceText}
              </div>
              <div className="text-[9.5px] text-[#4B5563]">Price Range</div>
            </div>
          )}
          {score !== null && (
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
          )}
        </div>

        <span
          className={cn(
            'mt-auto block w-full text-center py-[9px] rounded-lg text-[11.5px] font-bold transition-[filter]',
            isCurrentInComparison
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'choosify-dark-surface hover:brightness-110 text-white',
          )}
        >
          {isCurrentInComparison ? 'This Brand' : 'View Brand'}
        </span>
      </div>
    </CardWrapper>
  );
});
