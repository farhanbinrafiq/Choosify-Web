import React, { useEffect, useMemo, useState } from 'react';
import { useHomeSectionCopy } from '../useHomeSectionCopy';
import { Link } from 'react-router-dom';
import { DcHomeBlock } from '../DcHomePanel';
import { PremiumCarousel } from '../PremiumCarousel';
import { HomeEmptyNote } from './HomeEmptyNote';
import { SponsoredCardChrome } from '../../commerce/SponsoredCardChrome';
import { catalogApi } from '../../../services/catalogApi';
import { resolveDealsBannerHref } from '../../../lib/home/dealsBannerUtils';
import type { CatalogDealsBanner } from '../../../types/catalog';

export interface HomePromoTile {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
  kind: 'flash' | 'bank' | 'cashback' | 'coupon' | 'weekend' | 'campaign' | 'sponsored';
  image?: string;
}

export type HomeDealsBannerCard = CatalogDealsBanner & { href?: string };

/** Max ads shown in one Today's Deals horizontal row (matches admin studio cap). */
export const TODAYS_DEALS_BANNER_MAX = 5;

/**
 * The four stock "deals-banner-N" banners the catalog seeds on first run (stock
 * photos, no real advertiser). They are placeholders, so the homepage never shows
 * them; a banner staff replaced with a real image under the same id still shows.
 */
const SEEDED_PLACEHOLDER_IMAGES = new Set([
  'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=320&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=320&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=320&fit=crop',
  'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800&h=320&fit=crop',
]);

function isSeededPlaceholder(banner: HomeDealsBannerCard): boolean {
  return /^deals-banner-\d+$/.test(String(banner.id)) && SEEDED_PLACEHOLDER_IMAGES.has(String(banner.image));
}

interface HomeTodaysDealsSectionProps {
  /** @deprecated Text/product promo tiles — image banners come from deals-banners API */
  tiles?: HomePromoTile[];
  banners?: HomeDealsBannerCard[];
}

function BannerCardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

/** Today's Deals — image-only carousel (card shell keeps prior min-h / rounded size). */
export function HomeTodaysDealsSection({ banners: bannersProp }: HomeTodaysDealsSectionProps) {
  const copy = useHomeSectionCopy('deals', "Today's Deals");
  const [fetched, setFetched] = useState<HomeDealsBannerCard[] | null>(
    bannersProp && bannersProp.length > 0 ? bannersProp : null,
  );

  useEffect(() => {
    if (bannersProp && bannersProp.length > 0) {
      setFetched(bannersProp);
      return;
    }
    let cancelled = false;
    catalogApi
      .listDealsBanners({ active: true })
      .then((list) => {
        if (cancelled) return;
        setFetched(list);
      })
      .catch(() => {
        if (!cancelled) setFetched([]);
      });
    return () => {
      cancelled = true;
    };
  }, [bannersProp]);

  const banners = useMemo(() => {
    return (fetched ?? [])
      .filter((b) => b.isActive !== false && Boolean(b.image) && !isSeededPlaceholder(b))
      .slice()
      .sort((a, b) => a.order - b.order)
      .slice(0, TODAYS_DEALS_BANNER_MAX);
  }, [fetched]);

  return (
    <DcHomeBlock id="section-deals">
      <h2 className="text-[19px] font-extrabold text-[#1A1A2E] mb-4">{copy.title}</h2>
      {copy.subtitle && <p className="text-[12.5px] text-[#6B7280] -mt-2 mb-4">{copy.subtitle}</p>}
      {fetched !== null && banners.length === 0 && <HomeEmptyNote text="No deals running right now." linkHref="/deals" linkLabel="See all deals" />}
      {banners.length > 0 && (
      <PremiumCarousel
        items={banners}
        itemWidth={280}
        gap={16}
        paginationStyle="logos"
        paginationAlign="center"
        showArrows={false}
        autoplay
        autoplayMs={4000}
        getPaginationIcon={(banner: HomeDealsBannerCard) => ({
          label: banner.brandName || 'Deal',
          imageUrl: banner.brandLogoUrl || banner.image,
        })}
        renderCard={(banner: HomeDealsBannerCard) => {
          const href = resolveDealsBannerHref(banner);
          return (
            <BannerCardLink
              href={href}
              className="relative block w-full rounded-xl min-h-[120px] h-[120px] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00]/50"
            >
              <img
                src={banner.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
              {/* Editorial deals banner (Website Studio), not a paid ad — never labelled PROMOTED */}
              <SponsoredCardChrome
                brandName={banner.brandName || 'Deal'}
                logoUrl={banner.brandLogoUrl}
                size="sm"
                badgeLabel="TODAY'S DEAL"
                tone="editorial"
              />
            </BannerCardLink>
          );
        }}
      />
      )}
    </DcHomeBlock>
  );
}
