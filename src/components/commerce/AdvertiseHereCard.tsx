import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { SponsoredPlacementItem } from '../../types/commerce/sponsoredPlacement';

export type AdvertiseHereVariant = 'brand' | 'creator' | 'product-tile';

const COPY: Record<
  AdvertiseHereVariant,
  { headline: string; sub: string; bannerLabel: string }
> = {
  brand: {
    headline: 'Become a Featured Brand',
    sub: 'Get discovered by 2M+ verified shoppers on Choosify',
    bannerLabel: 'YOUR BRAND',
  },
  creator: {
    headline: 'Become a Featured Creator',
    sub: 'Grow your audience on Choosify',
    bannerLabel: '',
  },
  'product-tile': {
    headline: 'Advertise your product here',
    sub: '',
    bannerLabel: 'SPONSORED',
  },
};

/**
 * Choosify.dc.html — dashed orange “ADVERTISE HERE” grid tile
 * (Brands / Creators / Featured Products).
 */
export function AdvertiseHereCard({
  variant,
  className,
  href = '/advertise',
}: {
  variant: AdvertiseHereVariant;
  className?: string;
  href?: string;
}) {
  const copy = COPY[variant];

  return (
    <div
      className={cn(
        'bg-[#FFF6EF] rounded-[10px] overflow-hidden border-[1.5px] border-dashed border-[#EB4501] relative flex flex-col min-h-full',
        className,
      )}
    >
      <div className="absolute top-1.5 left-1.5 bg-[#1A1A2E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm z-[1]">
        {variant === 'product-tile' ? 'AD' : 'SPONSORED'}
      </div>
      <div
        className={cn(
          'bg-gradient-to-br from-[#EB4501] to-[#2323FF] flex items-center justify-center',
          variant === 'product-tile' ? 'h-[170px]' : 'h-[100px] items-end pb-2.5',
        )}
      >
        {copy.bannerLabel ? (
          <span
            className={cn(
              'text-white font-extrabold text-center px-2.5',
              variant === 'product-tile' ? 'text-[10.5px]' : 'text-[13px]',
            )}
          >
            {copy.bannerLabel}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          'flex-1 flex flex-col',
          variant === 'creator' ? 'px-3.5 pt-7 pb-4' : variant === 'product-tile' ? 'px-3 pt-2.5 pb-3.5' : 'p-3.5',
        )}
      >
        <div
          className={cn(
            'font-bold text-[#1A1A2E] leading-snug',
            variant === 'product-tile' ? 'text-[11.5px] mb-2' : 'text-[13.5px] mb-1',
          )}
        >
          {copy.headline}
        </div>
        {copy.sub ? (
          <div className="text-[11px] text-[#4B5563] mb-3 leading-snug">{copy.sub}</div>
        ) : variant === 'product-tile' ? null : (
          <div className="mb-3" />
        )}
        <Link
          to={href}
          className={cn(
            'mt-auto w-full bg-[#EB4501] text-white text-center border-none rounded-md font-extrabold hover:brightness-110 transition-[filter] no-underline',
            variant === 'product-tile' ? 'py-2 text-[10px] rounded-md' : 'py-2.5 text-[11.5px] font-bold',
          )}
        >
          {variant === 'product-tile' ? 'LEARN MORE' : 'ADVERTISE HERE →'}
        </Link>
      </div>
    </div>
  );
}

/**
 * Unified in-grid sponsored product tile — same gradient shell as Deals/Products grids.
 * Used for compare rail and other product sponsored slots.
 */
export function SponsoredProductTile({
  item,
  className,
}: {
  item: SponsoredPlacementItem;
  className?: string;
}) {
  const headline = item.title ?? item.subtitle ?? 'Featured product';
  const imageUrl = item.image;
  const href = item.href ?? '/advertise';
  const isExternal = item.isExternal ?? href.startsWith('http');

  const ctaClass =
    'mt-auto w-full bg-[#EB4501] text-white text-center border-none rounded-md font-extrabold hover:brightness-110 transition-[filter] no-underline py-2 text-[10px]';

  const inner = (
    <div
      className={cn(
        'bg-[#FFF6EF] rounded-[10px] overflow-hidden border-[1.5px] border-dashed border-[#EB4501] relative flex flex-col min-h-full h-full',
        className,
      )}
    >
      <div className="absolute top-1.5 left-1.5 bg-[#1A1A2E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm z-[1]">
        SPONSORED
      </div>
      <div className="h-[100px] bg-gradient-to-br from-[#EB4501] to-[#2323FF] flex items-center justify-center overflow-hidden relative">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" loading="lazy" />
        ) : (
          <span className="text-white font-extrabold text-[10.5px] text-center px-2.5 relative z-[1]">
            {item.sponsorName}
          </span>
        )}
      </div>
      <div className="px-3 pt-2.5 pb-3.5 flex flex-col flex-1 min-h-0">
        <div className="text-[11.5px] font-bold text-[#1A1A2E] leading-snug line-clamp-2 mb-2">{headline}</div>
        {isExternal ? (
          <a href={href} target="_blank" rel="sponsored noopener noreferrer" className={ctaClass}>
            {item.ctaLabel ?? 'LEARN MORE'}
          </a>
        ) : (
          <Link to={href} className={ctaClass}>
            {item.ctaLabel ?? 'LEARN MORE'}
          </Link>
        )}
      </div>
    </div>
  );

  return inner;
}

/**
 * Choosify.dc.html Products list — full-width 190px sponsored banner above the grid.
 */
export function ProductsSponsoredBanner({
  title = 'Samsung Galaxy Buds3 Pro — Pre-order now',
  subtitle = 'Official Samsung store · Free case with pre-order',
  ctaLabel = 'Shop Now →',
  href = '/advertise',
  imageUrl,
  className,
}: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  imageUrl?: string;
  className?: string;
}) {
  const isExternal = href.startsWith('http');

  const ctaClass =
    'bg-[#EB4501] text-white border-none px-[18px] py-2 rounded-[20px] text-[11.5px] font-bold shrink-0 whitespace-nowrap hover:brightness-110 no-underline inline-flex items-center';

  return (
    <div
      className={cn(
        'relative h-[190px] rounded-xl overflow-hidden mb-6 choosify-dark-surface',
        className,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : null}
      <div className="absolute top-3.5 left-3.5 bg-[#EB4501] text-white text-[9px] font-extrabold tracking-[0.4px] px-2.5 py-1 rounded z-[1]">
        SPONSORED AD
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[22%] min-h-[60px] bg-gradient-to-t from-black/85 to-transparent flex items-center justify-between gap-4 px-5">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-white whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </div>
          <div className="text-[11px] text-white/70 whitespace-nowrap overflow-hidden text-ellipsis">
            {subtitle}
          </div>
        </div>
        {isExternal ? (
          <a href={href} target="_blank" rel="sponsored noopener noreferrer" className={ctaClass}>
            {ctaLabel}
          </a>
        ) : (
          <Link to={href} className={ctaClass}>
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
