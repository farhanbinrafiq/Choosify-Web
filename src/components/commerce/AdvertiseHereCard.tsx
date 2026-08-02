import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { SponsoredPlacementItem } from '../../types/commerce/sponsoredPlacement';
import { AdSlotCarousel } from './AdSlotCarousel';
import { SponsoredCardChrome } from './SponsoredCardChrome';

export type AdvertiseHereVariant = 'brand' | 'creator' | 'product-tile';

export type SponsoredBannerSlide = {
  id: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  imageUrl?: string;
  /** Small brand/sponsor mark shown in the pagination rail (falls back to initials) */
  logo?: string;
};

/** Demo / fallback horizontal banners when CMS has fewer than 2 ads */
export const DEMO_SPONSORED_BANNER_SLIDES: SponsoredBannerSlide[] = [
  {
    id: 'banner-samsung',
    title: 'Samsung Galaxy Buds3 Pro — Pre-order now',
    subtitle: 'Official Samsung store · Free case with pre-order',
    href: '/advertise',
    ctaLabel: 'Shop Now →',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200',
  },
  {
    id: 'banner-walton',
    title: 'Walton WD Series — Now with 0% EMI',
    subtitle: 'Official Walton store · Free nationwide delivery',
    href: '/advertise',
    ctaLabel: 'Shop Now →',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200',
  },
  {
    id: 'banner-xiaomi',
    title: 'Xiaomi Mega Sale — Up to 40% off',
    subtitle: 'Official Xiaomi store · Limited stock',
    href: '/advertise',
    ctaLabel: 'Shop Now →',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200',
  },
];

const COPY: Record<
  AdvertiseHereVariant,
  { headline: string; sub: string; bannerLabel: string; brandName: string }
> = {
  brand: {
    headline: 'Become a Featured Brand',
    sub: 'Get discovered by 2M+ verified shoppers on Choosify',
    bannerLabel: 'YOUR BRAND',
    brandName: 'Your Brand',
  },
  creator: {
    headline: 'Become a Featured Creator',
    sub: 'Grow your audience on Choosify',
    bannerLabel: '',
    brandName: 'Creator',
  },
  'product-tile': {
    headline: 'Advertise your product here',
    sub: '',
    bannerLabel: 'PROMOTED',
    brandName: 'Sponsor',
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
        'choosify-dark-surface rounded-[10px] overflow-hidden relative flex flex-col h-full min-h-[300px]',
        className,
      )}
    >
      <div
        className={cn(
          'bg-gradient-to-br from-[#EB4501] to-[#2323FF] flex items-center justify-center flex-[7] min-h-0 relative',
          variant !== 'product-tile' && 'items-end pb-2.5',
        )}
      >
        <SponsoredCardChrome brandName={copy.brandName} size="md" />
        {copy.bannerLabel ? (
          <span
            className={cn(
              'text-white font-extrabold text-center px-2.5 relative z-[1]',
              variant === 'product-tile' ? 'text-[10.5px]' : 'text-[13px]',
            )}
          >
            {copy.bannerLabel}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          'flex-[3] min-h-0 flex flex-col justify-center',
          variant === 'creator' ? 'px-3.5 py-4' : variant === 'product-tile' ? 'px-3 py-2.5' : 'p-3.5',
        )}
      >
        <div
          className={cn(
            'font-bold text-white leading-snug',
            variant === 'product-tile' ? 'text-[11.5px] mb-2' : 'text-[13.5px] mb-1',
          )}
        >
          {copy.headline}
        </div>
        {copy.sub ? (
          <div className="text-[11px] text-white/60 mb-3 leading-snug">{copy.sub}</div>
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

  return (
    <div
      className={cn(
        'choosify-dark-surface rounded-[10px] overflow-hidden relative flex flex-col h-full min-h-[260px]',
        className,
      )}
    >
      <div className="flex-[7] min-h-0 bg-gradient-to-br from-[#EB4501] to-[#2323FF] flex items-center justify-center overflow-hidden relative">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" loading="lazy" />
        ) : (
          <span className="text-white font-extrabold text-[10.5px] text-center px-2.5 relative z-[1]">
            {item.sponsorName}
          </span>
        )}
        <SponsoredCardChrome
          brandName={item.sponsorName}
          logoUrl={item.sponsorLogoUrl}
          size="md"
        />
      </div>
      <div className="px-3 pt-2.5 pb-3.5 flex flex-col flex-[3] min-h-0 justify-center">
        <div className="text-[11.5px] font-bold text-white leading-snug line-clamp-2 mb-2">{headline}</div>
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
  logoUrl,
  brandName,
  className,
}: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  imageUrl?: string;
  logoUrl?: string;
  brandName?: string;
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
          draggable={false}
        />
      ) : null}
      <SponsoredCardChrome
        brandName={brandName || title || 'Sponsor'}
        logoUrl={logoUrl}
        size="md"
      />
      <div className="absolute inset-x-0 bottom-0 h-[22%] min-h-[60px] bg-gradient-to-t from-black/85 to-transparent flex items-center justify-between gap-4 px-5 z-[1]">
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

function slidesFromPlacementItems(items: SponsoredPlacementItem[]): SponsoredBannerSlide[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title || item.sponsorName,
    subtitle: item.subtitle || item.sponsoredLabel,
    href: item.href,
    imageUrl: item.image,
    logo: item.sponsorLogoUrl || item.image,
    ctaLabel: item.ctaLabel
      ? `${item.ctaLabel}${item.ctaLabel.includes('→') ? '' : ' →'}`
      : 'Shop Now →',
  }));
}

/**
 * Full-width sponsored banner carousel — same h-[190px] (or override) footprint,
 * vertical auto-slide (bottom→top) with a brand-logo pagination rail on the right,
 * supports multiple brand/sponsor ads.
 */
export function ProductsSponsoredBannerCarousel({
  items,
  className,
  bannerClassName,
  autoplay = true,
  autoplayMs = 5500,
  withDemoFallback = true,
}: {
  items?: SponsoredBannerSlide[] | SponsoredPlacementItem[];
  className?: string;
  /** Applied to each banner slide (e.g. home `mb-0 h-[200px]`) */
  bannerClassName?: string;
  autoplay?: boolean;
  autoplayMs?: number;
  withDemoFallback?: boolean;
}) {
  const slides = useMemo(() => {
    const raw = items ?? [];
    const normalized: SponsoredBannerSlide[] =
      raw.length > 0 && 'sponsorName' in (raw[0] as SponsoredPlacementItem)
        ? slidesFromPlacementItems(raw as SponsoredPlacementItem[])
        : (raw as SponsoredBannerSlide[]);

    if (normalized.length >= 2) return normalized;
    if (!withDemoFallback) {
      return normalized.length ? normalized : DEMO_SPONSORED_BANNER_SLIDES.slice(0, 1);
    }
    if (normalized.length === 1) {
      const rest = DEMO_SPONSORED_BANNER_SLIDES.filter((d) => d.id !== normalized[0].id);
      return [normalized[0], ...rest].slice(0, 4);
    }
    return DEMO_SPONSORED_BANNER_SLIDES;
  }, [items, withDemoFallback]);

  return (
    <AdSlotCarousel
      items={slides}
      getKey={(slide) => slide.id}
      axis="y"
      paginationPosition="end"
      autoplay={autoplay}
      autoplayMs={autoplayMs}
      className={className}
      ariaLabel="Promoted banner ads"
      getIcon={(slide) => ({ label: slide.title || 'Sponsor', imageUrl: slide.logo })}
      renderSlide={(slide) => (
        <ProductsSponsoredBanner
          title={slide.title}
          subtitle={slide.subtitle}
          href={slide.href}
          imageUrl={slide.imageUrl}
          logoUrl={slide.logo}
          brandName={slide.title}
          ctaLabel={slide.ctaLabel}
          className={cn('mb-0', bannerClassName)}
        />
      )}
    />
  );
}
