import React, { useState, memo } from 'react';
import {
  Star,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  ArrowLeftRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import { resolveProductBadges } from '../utils/productBadges';
import { CardEngagementStrip } from './CardEngagementStrip';
import { ProductStatusBadge, ProductStatusBadgeStack, collectProductBadgeLabels } from './ProductStatusBadge';
import toast from 'react-hot-toast';

/** Choosify.dc.html product tile tokens */
const DC = {
  border: '#E8EDF2',
  ink: '#1A1A2E',
  muted: '#6B7280',
  mutedLight: '#9AA0AC',
  orange: '#EB4501',
  ratingGreen: '#07A828',
  officialBlue: '#2323FF',
  footerBorder: '#F1F1F3',
  discountRed: '#FF000D',
  newGreen: '#07DD05',
  dealAmber: '#D97706',
} as const;

function formatBdt(value: number | string | undefined): string {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^\d.]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return '';
  return `৳${Math.round(n).toLocaleString('en-BD')}`;
}

function parsePrice(value: unknown): number {
  if (typeof value === 'number') return value;
  return Number(String(value ?? '').replace(/[^\d.]/g, '')) || 0;
}

function resolveDcBadge(product: any): { label: string; bg: string } | null {
  const discount =
    product.discountPercent ??
    (typeof product.discount === 'string'
      ? parseInt(String(product.discount).replace(/[^\d]/g, ''), 10)
      : undefined);
  if (discount && discount > 0) {
    return { label: `-${discount}%`, bg: DC.discountRed };
  }
  if (product.isNewArrival) return { label: 'NEW', bg: DC.newGreen };
  if (product.isBestseller) return { label: 'BESTSELLER', bg: DC.orange };
  if (product.featuredFlag) return { label: 'FEATURED', bg: DC.orange };
  if (product.isDeal || product.dealType || product.tag === 'SALE') {
    return { label: 'BEST DEAL', bg: DC.dealAmber };
  }
  return null;
}

function resolveVariantLine(product: any): string {
  if (product.variant && typeof product.variant === 'string') return product.variant;
  if (Array.isArray(product.specs) && product.specs.length) {
    return product.specs
      .slice(0, 2)
      .map((s: any) => (typeof s === 'string' ? s : s?.value || s?.key))
      .filter(Boolean)
      .join(', ');
  }
  const cat = String(product.category || '').toLowerCase();
  if (cat.includes('mobile') || cat.includes('phone')) return 'Official Warranty';
  if (cat.includes('audio') || cat.includes('headphone')) return 'Wireless, Bluetooth 5.3';
  if (cat.includes('laptop')) return '16GB RAM, 512GB SSD';
  if (product.brand) return String(product.brand);
  return 'Official Warranty';
}

function resolveCashbackLabel(price: number): string {
  if (price <= 0) return '';
  const cashback = Math.round((price * 0.05) / 100) * 100;
  if (cashback <= 0) return '';
  return `৳${cashback.toLocaleString('en-BD')}`;
}

function resolveRating(product: any): number | null {
  const r = Number(product.rating);
  if (Number.isFinite(r) && r > 0) return Math.min(5, Math.round(r * 10) / 10);
  const seed = Number.parseInt(String(product.id ?? '').replace(/\D/g, ''), 10);
  if (!Number.isFinite(seed)) return 4.8;
  return Math.round((4 + (seed % 10) / 10) * 10) / 10;
}

function getProductCardImages(product: any): string[] {
  const mainImage = product.image || product.images?.[0] || PLACEHOLDER_IMAGE;
  return [mainImage];
}

function getRecommendationData(product: any) {
  const title = (product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  if (product.id === 1 || title.includes('s24') || title.includes('s25') || title.includes('s26')) {
    return {
      tags: ['#BEST_CAMERA', '#BEST_DISPLAY', '#CONTENT_CREATION', '#PREMIUM_PICK', '#FLAGSHIP'],
      verdict: 'Best for premium users seeking ultimate camera zoom and brightness.',
    };
  }
  if (product.id === 2 || title.includes('wh-1000xm5') || title.includes('sony')) {
    return {
      tags: ['#PREMIUM_PICK', '#EDITOR_CHOICE', '#TRAVEL_FRIENDLY', '#QUALITY_DRIVEN'],
      verdict: 'Outstanding long-session active noise cancellation for frequent travelers.',
    };
  }
  if (product.id === 3 || title.includes('macbook') || title.includes('m3')) {
    return {
      tags: ['#PREMIUM_PICK', '#LONG_BATTERY', '#CREATOR_FRIENDLY', '#EDITOR_CHOICE'],
      verdict: 'Perfect fanless everyday carrying laptop for modern remote creatives.',
    };
  }

  const tags: string[] = [];
  let verdict = 'Excellent all-rounder delivering dependable regular service.';
  const priceVal = parsePrice(product.price);

  if (cat.includes('phone') || cat.includes('mobile')) {
    tags.push('#BEST_DISPLAY', '#BUSINESS_USERS');
    if (priceVal && priceVal < 50000) tags.push('#UNDER_50000', '#BEST_VALUE');
    else tags.push('#FLAGSHIP', '#PREMIUM_PICK');
  } else if (cat.includes('fashion') || brand.includes('nike') || brand.includes('apex')) {
    tags.push('#QUALITY_DRIVEN', '#TRAVEL_FRIENDLY', '#BEST_VALUE');
  } else {
    tags.push('#QUALITY_DRIVEN', '#EDITOR_CHOICE');
  }
  while (tags.length < 3) tags.push('#EDITOR_CHOICE');
  return { tags: Array.from(new Set(tags)).slice(0, 6), verdict };
}

function ProductCardImageCarousel({
  images,
  alt,
  containerClassName,
}: {
  images: string[];
  alt: string;
  containerClassName?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const list = images.length ? images : [PLACEHOLDER_IMAGE];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((prev) => (prev - 1 + list.length) % list.length);
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((prev) => (prev + 1) % list.length);
  };

  return (
    <div
      className={cn(
        'relative w-full h-full select-none overflow-hidden group/carousel flex items-center justify-center',
        containerClassName,
      )}
      onTouchStart={(e) => setStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX === null) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 30) setIdx((prev) => (prev + 1) % list.length);
        else if (diff < -30) setIdx((prev) => (prev - 1 + list.length) % list.length);
        setStartX(null);
      }}
    >
      <img
        src={list[idx]}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
        className="w-full h-full object-cover object-center"
      />
      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/75 hover:bg-white border-0 flex items-center justify-center text-navy shadow-sm opacity-0 group-hover/carousel:opacity-100 z-30"
          >
            <ChevronLeft size={12} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/75 hover:bg-white border-0 flex items-center justify-center text-navy shadow-sm opacity-0 group-hover/carousel:opacity-100 z-30"
          >
            <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </>
      )}
    </div>
  );
}

export const ProductCard = memo(function ProductCard({
  product,
  variant: variantProp = 'grid',
  showCountdown: _showCountdown = false,
  imageContainerStyle,
  titleStyle,
  isGuideDetail = false,
}: {
  product: any;
  variant?: 'grid' | 'list' | 'compact' | 'featured';
  showCountdown?: boolean;
  key?: React.Key;
  imageContainerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  isGuideDetail?: boolean;
}) {
  const variant = variantProp === 'compact' ? 'grid' : variantProp;
  const isCompactGrid = variantProp === 'compact';
  const navigate = useNavigate();
  const { savedProducts, setSavedProducts, addToCompare, comparedProducts } = useDashboard();
  const { allBrands, addToCart, siteConfig } = useGlobalState();

  const brandObj = allBrands?.find((b: any) => b.id === product.brandId);
  const brandName = brandObj ? brandObj.name : product.brand || 'Choosify';
  const cmsBadges = resolveProductBadges(product, siteConfig);
  const statusBadgeLabels = collectProductBadgeLabels(product, cmsBadges);

  const isSaved = savedProducts.some((p) => p.id === product.id);
  const isInCompare = comparedProducts.some((p) => p.id === product.id);
  const engagementType = product.tag === 'SALE' ? ('deal' as const) : ('product' as const);

  const priceNum = parsePrice(product.price);
  const origNum = parsePrice(product.originalPrice);
  const priceLabel = formatBdt(priceNum) || String(product.price ?? '');
  const origLabel =
    origNum > priceNum ? formatBdt(origNum) : product.originalPrice ? formatBdt(product.originalPrice) : '';
  const badge = resolveDcBadge(product);
  const variantLine = resolveVariantLine(product);
  const cashback = resolveCashbackLabel(priceNum);
  const rating = resolveRating(product);
  const isOfficial = product.official !== false && product.verified !== false;
  const productHref = `/products/${product.slug ?? product.id}`;
  const imageSrc = product.image || product.images?.[0] || PLACEHOLDER_IMAGE;

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isSaved) {
      setSavedProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success('Removed from wishlist');
    } else {
      setSavedProducts((prev) => [...prev, product]);
      toast.success('Added to wishlist');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCompare(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isGuideDetail) {
      navigate(productHref);
      return;
    }
    addToCart(product, 1);
    toast.success(`Successfully added ${product.title} to your cart!`);
  };

  const openProduct = () => navigate(productHref);

  /* ── Featured (wide) — keep business wiring, softer dc chrome ── */
  if (variant === 'featured') {
    return (
      <div
        onClick={openProduct}
        className="bg-white rounded-[10px] p-5 md:p-6 h-full flex flex-col md:flex-row gap-6 relative overflow-hidden group border border-[#E8EDF2] cursor-pointer"
      >
        <div
          className="relative z-20 flex-shrink-0 w-full md:w-[45%] xl:w-[40%] aspect-[16/10] md:h-full bg-[#F4F7F9] rounded-[10px] flex items-center justify-center overflow-hidden"
          style={imageContainerStyle}
        >
          <ProductCardImageCarousel
            images={getProductCardImages(product)}
            alt={product.title}
            containerClassName="absolute inset-0 z-10"
          />
          {statusBadgeLabels.length > 0 && (
            <ProductStatusBadgeStack
              labels={statusBadgeLabels}
              className="absolute top-3 left-3 z-20"
              align="start"
              size="sm"
            />
          )}
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center py-2 px-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-semibold text-[#9AA0AC]">{brandName}</span>
            <span className="bg-[#EB4501]/10 text-[#EB4501] text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Star size={11} className="fill-current" /> Featured
            </span>
          </div>
          <h3
            className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight leading-snug mb-4 group-hover:text-[#CF4400] transition-colors line-clamp-2"
            style={titleStyle}
          >
            {product.title}
          </h3>
          <div className="flex items-end justify-between gap-4 pt-4 border-t border-[#F1F1F3]">
            <span className="text-2xl font-extrabold text-[#1A1A2E] leading-none">{priceLabel}</span>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full text-white bg-[#EB4501] cursor-pointer transition-all shrink-0 border-0 flex items-center justify-center hover:brightness-110"
              aria-label={isGuideDetail ? 'Shop Now' : 'Add to cart'}
            >
              {isGuideDetail ? <ArrowRight size={16} /> : <ShoppingCart size={16} />}
            </button>
          </div>
          <CardEngagementStrip
            entityType={engagementType}
            entityId={product.id}
            payload={product}
            onClickCapture={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  }

  /* ── List ── */
  if (variant === 'list') {
    return (
      <div
        className="bg-white rounded-[10px] border border-[#E8EDF2] hover:border-[#EB4501]/30 transition-all flex gap-5 p-4 group cursor-pointer text-left"
        onClick={openProduct}
      >
        <div className="w-36 md:w-40 h-[170px] flex-shrink-0 bg-[#F4F7F9] rounded-[10px] relative overflow-hidden">
          <img
            src={imageSrc}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
          {badge && (
            <div
              className="absolute top-2 left-2 text-white text-[9px] font-extrabold px-[7px] py-[3px] rounded pointer-events-none"
              style={{ background: badge.bg }}
            >
              {badge.label}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
          <div>
            <h3 className="text-[12.5px] font-bold text-[#1A1A2E] leading-snug truncate mb-1 group-hover:text-[#CF4400] transition-colors">
              {product.title}
            </h3>
            <p className="text-[10px] text-[#6B7280] truncate mb-2">{variantLine}</p>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-[13.5px] font-extrabold text-[#1A1A2E]">{priceLabel}</span>
              {origLabel && (
                <span className="text-[10px] text-[#9AA0AC] line-through">{origLabel}</span>
              )}
            </div>
            {cashback && (
              <p className="text-[10px] text-[#6B7280]">
                Up to <span className="text-[#EB4501] font-bold">{cashback}</span> cashback
              </p>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#F1F1F3] mt-3">
            <div className="flex items-center gap-2">
              {isOfficial && <ShieldCheck size={13} className="text-[#2323FF]" strokeWidth={1.8} />}
              <button
                type="button"
                onClick={handleCompare}
                className={cn(
                  'w-7 h-7 rounded-full border-0 cursor-pointer inline-flex items-center justify-center bg-white shadow-sm',
                  isInCompare && 'bg-[#07A828] text-white',
                )}
                aria-label="Compare"
              >
                <ArrowLeftRight
                  size={13}
                  strokeWidth={1.7}
                  stroke={isInCompare ? 'currentColor' : 'url(#choosify-emi-icon-grad)'}
                />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-7 h-7 rounded-full bg-[#EB4501] text-white border-0 flex items-center justify-center cursor-pointer hover:brightness-110"
              aria-label={isGuideDetail ? 'Shop Now' : 'Add to cart'}
            >
              {isGuideDetail ? <ArrowRight size={13} /> : <ShoppingCart size={13} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Grid — Choosify.dc.html ProductCard (Home + Products List) ── */
  return (
    <div
      className="bg-white rounded-[10px] overflow-hidden border border-[#E8EDF2] cursor-pointer w-full max-w-full min-w-0 h-full self-stretch flex flex-col group"
      onClick={openProduct}
      id={`product-${product.id}`}
    >
      {/* Image plane — fixed 170px (compact: 118px) */}
      <div className={cn('relative w-full shrink-0 bg-[#F4F7F9]', isCompactGrid ? 'h-[118px]' : 'h-[170px]')}>
        <img
          src={imageSrc}
          alt={product.title || 'Product'}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />

        {badge && (
          <div
            className="absolute top-2 left-2 z-20 text-white text-[9px] font-extrabold px-[7px] py-[3px] rounded pointer-events-none"
            style={{ background: badge.bg }}
          >
            {badge.label}
          </div>
        )}

        <button
          type="button"
          onClick={toggleSave}
          className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer border-0 p-0 shadow-sm"
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={12}
            strokeWidth={2}
            className="text-[#EB4501]"
            fill={isSaved ? '#EB4501' : 'none'}
          />
        </button>

        {rating != null && (
          <div className="absolute bottom-2 left-2 z-20 bg-[#07A828] text-white text-[10px] font-extrabold px-[7px] py-[3px] rounded-xl pointer-events-none">
            {rating.toFixed(1)} ★
          </div>
        )}
      </div>

      {/* Body */}
      <div className={cn('px-3 flex flex-col flex-1 min-h-0 text-left', isCompactGrid ? 'pt-2 pb-2.5' : 'pt-[11px] pb-3')}>
        <div
          className={cn(
            'font-bold text-[#1A1A2E] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#CF4400] transition-colors',
            isCompactGrid ? 'text-[11px]' : 'text-[12.5px]',
          )}
          style={titleStyle}
        >
          {product.title}
        </div>

        {variantLine && (
          <div className="text-[10px] text-[#6B7280] mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
            {variantLine}
          </div>
        )}

        <div className="flex items-baseline gap-1.5 flex-wrap mb-[3px]">
          <div className={cn('font-extrabold text-[#1A1A2E]', isCompactGrid ? 'text-[12px]' : 'text-[13.5px]')}>{priceLabel}</div>
          {origLabel && (
            <div className="text-[10px] text-[#9AA0AC] line-through">{origLabel}</div>
          )}
        </div>

        {cashback && (
          <div className="text-[10px] text-[#6B7280] mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
            Up to <span className="text-[#EB4501] font-bold">{cashback}</span> cashback
          </div>
        )}

        {isGuideDetail &&
          (() => {
            const recData = getRecommendationData(product);
            return (
              <div className="mb-2 pt-1.5 border-t border-dashed border-[#E8EDF2]">
                <div className="flex flex-wrap gap-1 max-h-[30px] overflow-hidden">
                  {recData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="choosify-best-for-tag px-1 py-0.5 text-[6.5px] font-bold rounded-full border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

        {/* Action footer — official + compare + cart */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#F1F1F3]">
          <div className="flex items-center gap-2">
            {isOfficial && (
              <span title="Official" aria-label="Official seller">
                <ShieldCheck size={13} className="text-[#2323FF]" strokeWidth={1.8} />
              </span>
            )}
            <button
              type="button"
              onClick={handleCompare}
              title="Add to Compare"
              aria-label="Add to Compare"
              className={cn(
                'w-7 h-7 rounded-full border-0 cursor-pointer inline-flex items-center justify-center bg-white shadow-sm',
                isInCompare && 'bg-[#07A828] text-white',
              )}
            >
              <ArrowLeftRight
                size={13}
                strokeWidth={1.7}
                stroke={isInCompare ? 'currentColor' : 'url(#choosify-emi-icon-grad)'}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-7 h-7 rounded-full bg-[#EB4501] text-white border-0 flex items-center justify-center cursor-pointer shrink-0 hover:brightness-110 active:scale-95 transition-all"
            aria-label={isGuideDetail ? 'Shop Now' : 'Add to cart'}
            title={isGuideDetail ? 'Shop Now' : 'Add to cart'}
          >
            {isGuideDetail ? (
              <ArrowRight size={13} strokeWidth={2} />
            ) : (
              <ShoppingCart size={13} strokeWidth={1.7} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
