import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { CartIconButton } from '../commerce/CartIconButton';
import { SponsoredCardChrome } from '../commerce/SponsoredCardChrome';
import { AdSlotPaginationRail } from '../commerce/AdSlotCarousel';

export interface FlashDealCardProps {
  id: string | number;
  name: string;
  image?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  claimedPct?: number;
  likes?: string | number;
  href?: string;
  onAddToCart?: (e: React.MouseEvent) => void;
  onToggleWish?: (e: React.MouseEvent) => void;
  wished?: boolean;
  className?: string;
}

/** Choosify.dc.html Deals — Flash Deal tile */
export function FlashDealCard({
  id,
  name,
  image,
  category = 'Deals',
  price,
  originalPrice,
  badge,
  claimedPct,
  href,
  onAddToCart,
  className,
}: FlashDealCardProps) {
  const to = href ?? `/products/${id}`;
  const discountBadge =
    badge ??
    (originalPrice != null && originalPrice > price
      ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
      : undefined);

  return (
    <Link
      to={to}
      className={cn(
        'block bg-white rounded-[10px] overflow-hidden border border-[#E8EDF2] group',
        className,
      )}
    >
      <div className="relative h-[150px] bg-[#F4F7F9]">
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {discountBadge && (
          <span className="absolute top-2 left-2 bg-[#FF000D] text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full pointer-events-none">
            {discountBadge}
          </span>
        )}
        <span className="absolute top-2 right-2 bg-black/55 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none">
          FLASH DEAL
        </span>
      </div>
      <div className="px-3 pt-2.5 pb-3.5">
        <div className="text-[9px] font-bold text-[#9AA0AC] mb-1">{category}</div>
        <div className="text-[12px] font-normal text-[#1A1A2E] mb-2 leading-snug line-clamp-2">
          {name}
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <div className="text-[14px] font-extrabold text-[#FF5B00]">
            ৳{price.toLocaleString()}
          </div>
          {originalPrice != null && originalPrice > price && (
            <div className="text-[10px] text-[#9AA0AC] line-through">
              ৳{originalPrice.toLocaleString()}
            </div>
          )}
        </div>
        {typeof claimedPct === 'number' && (
          <div className="h-1 rounded bg-[#F1F1F3] overflow-hidden mb-2.5">
            <div
              className="h-full bg-[#FF5B00] rounded"
              style={{ width: `${Math.min(100, Math.max(0, claimedPct))}%` }}
            />
          </div>
        )}
        <div className="flex justify-end items-center">
          <CartIconButton
            size={26}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(e);
            }}
          />
        </div>
      </div>
    </Link>
  );
}

export interface DealOfTheDayItem {
  id: string | number;
  name: string;
  image?: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating?: number;
  reviews?: number;
  sold?: string;
  claimedPct?: number;
  refreshLabel?: string;
  validUntil?: string;
  href?: string;
  /** Brand mark for SponsoredCardChrome */
  brandName?: string;
  brandLogoUrl?: string;
}

export interface DealOfTheDayCardProps {
  /** 1–5 deals shown one-at-a-time inside the same card frame */
  deals: DealOfTheDayItem[];
  /** Auto-advance interval in ms (default 5.5s — readable, not rushy) */
  autoplayMs?: number;
  className?: string;
}

const DOTD_AUTOPLAY_MS = 5500;

function endsInLabel(refreshLabel?: string, validUntil?: string): string | null {
  if (refreshLabel) return refreshLabel;
  if (!validUntil) return null;
  try {
    const diff = new Date(validUntil).getTime() - Date.now();
    if (diff <= 0) return 'ended';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } catch {
    return null;
  }
}

/**
 * Fixed outer frame for Deal of the Day — height/width never change between slides.
 * Internal slots use reserved heights + ellipsis / line-clamp so content cannot grow the card.
 * Vertical budget (460px total): padding 40 + header 32 + body ~334 + pagination 44 ≈ 450.
 */
const DOTD_CARD_HEIGHT = 'h-[460px]';
/** Slightly under prior 185px so title/price/progress/CTA + dots fit without overlap */
const DOTD_IMAGE_HEIGHT = 'h-[170px]';

/** Choosify.dc.html Deals — Deal of the Day navy panel (stacked auto-rotate slideshow) */
export function DealOfTheDayCard({
  deals,
  autoplayMs = DOTD_AUTOPLAY_MS,
  className,
}: DealOfTheDayCardProps) {
  const slides = deals.slice(0, 5);
  const slidesKey = slides.map((d) => String(d.id)).join('|');
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setIndex(0);
    setFadeKey((k) => k + 1);
  }, [slidesKey]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
      setFadeKey((k) => k + 1);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [slides.length, autoplayMs, slidesKey]);

  if (slides.length === 0) return null;

  const deal = slides[Math.min(index, slides.length - 1)];
  const to = deal.href ?? `/products/${deal.id}`;
  const discountBadge =
    deal.badge ??
    (deal.originalPrice != null && deal.originalPrice > deal.price
      ? `${Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF`
      : undefined);

  const endsLabel = endsInLabel(deal.refreshLabel, deal.validUntil);
  const endsText =
    endsLabel == null
      ? '\u00a0'
      : endsLabel === 'ended'
        ? 'Deal ended'
        : `Ends in ${endsLabel}`;

  const metaParts: string[] = [];
  if (typeof deal.rating === 'number') {
    metaParts.push(
      `★ ${deal.rating}${typeof deal.reviews === 'number' ? ` (${deal.reviews})` : ''}`,
    );
  }
  if (deal.sold) metaParts.push(`${deal.sold} Sold`);
  const metaText = metaParts.length > 0 ? metaParts.join(' · ') : '\u00a0';
  const claimedPct =
    typeof deal.claimedPct === 'number'
      ? Math.min(100, Math.max(0, deal.claimedPct))
      : 0;
  const showOriginal =
    deal.originalPrice != null && deal.originalPrice > deal.price;

  const goTo = (next: number) => {
    setIndex(next);
    setFadeKey((k) => k + 1);
  };

  return (
    <div
      className={cn(
        'choosify-dark-surface rounded-xl p-5 text-white w-full overflow-hidden flex flex-col',
        DOTD_CARD_HEIGHT,
        className,
      )}
      aria-roledescription="carousel"
      aria-label="Deal of the Day"
    >
      <div className="flex justify-between items-center gap-2 mb-3 h-[18px] shrink-0">
        <div className="text-[12px] font-extrabold text-[#FF5B00] flex items-center gap-1 truncate">
          🏅 DEAL OF THE DAY
        </div>
        <div
          className={cn(
            'text-[9.5px] text-white/50 shrink-0 max-w-[45%] truncate text-right',
            endsLabel == null && 'invisible',
          )}
        >
          {endsText}
        </div>
      </div>

      <div key={fadeKey} className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
        <Link
          to={to}
          className={cn(
            'relative w-full shrink-0 rounded-[10px] overflow-hidden mb-2.5 block',
            DOTD_IMAGE_HEIGHT,
          )}
        >
          <img
            src={deal.image || PLACEHOLDER_IMAGE}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <SponsoredCardChrome
            brandName={deal.brandName || deal.name}
            logoUrl={deal.brandLogoUrl}
            size="md"
          />
          {discountBadge && (
            <span className="absolute bottom-2 right-2 z-[4] bg-[#FF000D] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full pointer-events-none max-w-[70%] truncate">
              {discountBadge}
            </span>
          )}
        </Link>

        {/* Details + CTA share remaining height; CTA is a reserved bottom slot (no overlap) */}
        <div className="flex flex-col flex-1 min-h-0 justify-between gap-2">
          <div className="flex flex-col min-h-0 gap-1.5 overflow-hidden">
            <div className="h-[34px] shrink-0 text-[12.5px] font-bold text-white leading-snug line-clamp-2 overflow-hidden">
              {deal.name}
            </div>

            <div className="flex items-baseline gap-2 h-[22px] shrink-0 overflow-hidden">
              <div className="text-base font-extrabold text-[#FF5B00] truncate">
                ৳{deal.price.toLocaleString()}
              </div>
              <div
                className={cn(
                  'text-[11px] text-white/50 line-through truncate',
                  !showOriginal && 'invisible',
                )}
              >
                {showOriginal ? `৳${deal.originalPrice!.toLocaleString()}` : '৳0'}
              </div>
            </div>

            <div className="h-[16px] shrink-0 text-[10.5px] text-white/50 truncate overflow-hidden">
              {metaText}
            </div>

            <div className="h-[5px] rounded bg-white/12 overflow-hidden shrink-0">
              <div
                className="h-full bg-[#FF5B00] rounded transition-[width] duration-300"
                style={{ width: `${claimedPct}%` }}
              />
            </div>
          </div>

          <Link
            to={to}
            className="relative z-10 block w-full shrink-0 text-center bg-[#FF5B00] text-white py-2.5 rounded-lg text-[12px] font-bold no-underline hover:brightness-110"
          >
            VIEW DEAL
          </Link>
        </div>
      </div>

      <div className="mt-3 h-8 shrink-0 flex items-center justify-center overflow-hidden">
        {slides.length > 1 ? (
          <AdSlotPaginationRail
            items={slides.map((slide) => ({
              label: slide.brandName || slide.name,
              imageUrl: slide.brandLogoUrl || slide.image,
            }))}
            activeIndex={index}
            position="below"
            ariaLabel="Deal of the Day slides"
            ringOffsetClassName="ring-offset-[#1a1a2e]"
            className="mt-0"
            getKey={(icon, i) => `${slides[i]?.id ?? i}-${icon.label}`}
            onSelect={goTo}
          />
        ) : null}
      </div>
    </div>
  );
}
