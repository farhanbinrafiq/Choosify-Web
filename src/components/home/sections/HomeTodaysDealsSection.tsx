import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DcHomeBlock } from '../DcHomePanel';
import { PremiumCarousel } from '../PremiumCarousel';
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

/** Fallback image banners when API has none yet (same card shell as before). */
const FALLBACK_BANNERS: HomeDealsBannerCard[] = [
  {
    id: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=320&fit=crop',
    destinationType: 'custom-url',
    destinationRef: '/deals',
    order: 0,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    href: '/deals',
  },
  {
    id: 'fallback-2',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=320&fit=crop',
    destinationType: 'custom-url',
    destinationRef: '/deals',
    order: 1,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    href: '/deals',
  },
  {
    id: 'fallback-3',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=320&fit=crop',
    destinationType: 'custom-url',
    destinationRef: '/brands',
    order: 2,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    href: '/brands',
  },
  {
    id: 'fallback-4',
    image: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800&h=320&fit=crop',
    destinationType: 'custom-url',
    destinationRef: '/products',
    order: 3,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    href: '/products',
  },
];

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
        setFetched(list.length > 0 ? list : FALLBACK_BANNERS);
      })
      .catch(() => {
        if (!cancelled) setFetched(FALLBACK_BANNERS);
      });
    return () => {
      cancelled = true;
    };
  }, [bannersProp]);

  const banners = useMemo(() => {
    const source = fetched && fetched.length > 0 ? fetched : FALLBACK_BANNERS;
    return source
      .filter((b) => b.isActive !== false && Boolean(b.image))
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [fetched]);

  return (
    <DcHomeBlock id="section-deals">
      <h2 className="text-[19px] font-extrabold text-[#1A1A2E] mb-4">Today&apos;s Deals</h2>
      <PremiumCarousel
        items={banners}
        itemWidth={280}
        gap={16}
        paginationStyle="ring"
        paginationAlign="center"
        showArrows={false}
        renderCard={(banner: HomeDealsBannerCard) => {
          const href = resolveDealsBannerHref(banner);
          return (
            <BannerCardLink
              href={href}
              className="block w-full rounded-xl min-h-[120px] h-[120px] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]/50"
            >
              <img
                src={banner.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </BannerCardLink>
          );
        }}
      />
    </DcHomeBlock>
  );
}
