import React from 'react';
import { Link } from 'react-router-dom';
import { DcHomeBlock } from '../DcHomePanel';

export interface HomePromoTile {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
  kind: 'flash' | 'bank' | 'cashback' | 'coupon' | 'weekend' | 'campaign' | 'sponsored';
  image?: string;
}

const DEFAULT_DEALS = [
  {
    kind: 'flash' as const,
    tag: 'FLASH SALE',
    title: 'Up to 60% Off Electronics',
    cta: 'Shop Now',
    href: '/deals',
    bg: 'linear-gradient(135deg,#EB4501,#CF4400)',
  },
  {
    kind: 'bank' as const,
    tag: 'BANK OFFER',
    title: '20% Cashback on Cards',
    cta: 'Claim Offer',
    href: '/deals',
    bg: 'linear-gradient(135deg,#2323FF,#000435)',
  },
  {
    kind: 'coupon' as const,
    tag: 'COUPON',
    title: 'Extra 10% Off Sitewide',
    cta: 'Grab Coupon',
    href: '/deals',
    bg: 'linear-gradient(135deg,#07A828,#059669)',
  },
  {
    kind: 'sponsored' as const,
    tag: 'SPONSORED',
    title: 'Partner Mega Deals',
    cta: 'Explore',
    href: '/deals',
    bg: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
  },
];

interface HomeTodaysDealsSectionProps {
  tiles?: HomePromoTile[];
}

/** Choosify.dc.html — 4 colored deal tiles on soft canvas */
export function HomeTodaysDealsSection({ tiles = [] }: HomeTodaysDealsSectionProps) {
  const deals = DEFAULT_DEALS.map((d, i) => {
    const override = tiles[i];
    return {
      ...d,
      title: override?.title || d.title,
      href: override?.href || d.href,
      tag: override?.badge || d.tag,
    };
  });

  return (
    <DcHomeBlock id="section-deals">
      <h2 className="text-[19px] font-extrabold text-[#1A1A2E] mb-4">Today&apos;s Deals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {deals.map((d) => (
          <Link
            key={d.kind}
            to={d.href}
            className="rounded-xl p-[22px] text-white min-h-[120px] flex flex-col justify-between"
            style={{ background: d.bg }}
          >
            <div>
              <span className="text-[9px] font-extrabold bg-white/22 inline-block px-2 py-0.5 rounded mb-2.5 tracking-wide">
                {d.tag}
              </span>
              <div className="text-base font-extrabold leading-snug">{d.title}</div>
            </div>
            <div className="text-[11px] font-bold mt-3">{d.cta} ›</div>
          </Link>
        ))}
      </div>
    </DcHomeBlock>
  );
}
