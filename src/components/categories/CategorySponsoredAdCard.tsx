import React from 'react';
import { Link } from 'react-router-dom';
import type { SponsoredPlacementItem } from '../../types/commerce/sponsoredPlacement';
import { PLACEHOLDER_IMAGE } from '../../constants';

/** Sponsored ad tile for the Categories grid — matches CategoryPremiumCard's exact footprint. */
export function CategorySponsoredAdCard({ item }: { item: SponsoredPlacementItem }) {
  const inner = (
    <div className="bg-white rounded-xl overflow-hidden border border-[#E8EDF2] flex flex-col h-full">
      <div className="relative h-[120px] w-full overflow-hidden bg-[#F4F7F9]">
        <img
          src={item.image ?? PLACEHOLDER_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider bg-white/90 text-[#8a9bb0] px-1.5 py-0.5 rounded-full">
          Ad
        </span>
      </div>

      <div className="px-4 pt-5 pb-4 flex-1 flex flex-col">
        <span className="text-[14px] font-bold text-[#1A1A2E] mb-0.5 line-clamp-2">
          {item.title || item.sponsorName}
        </span>
        {item.subtitle && (
          <span className="text-[12px] text-[#4B5563] line-clamp-2">{item.subtitle}</span>
        )}
      </div>

      <div className="mt-auto choosify-dark-surface text-white px-4 py-3 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-extrabold shrink-0 overflow-hidden">
          {item.sponsorLogoUrl ? (
            <img src={item.sponsorLogoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            item.sponsorName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="text-[11px] text-white font-bold min-w-0 flex-1 truncate">
          {item.ctaLabel || 'Sponsored'}
        </div>
        <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-white/70 border border-white/25 rounded px-1.5 py-0.5">
          Ad
        </span>
      </div>
    </div>
  );

  if (item.isExternal) {
    return (
      <a href={item.href} target="_blank" rel="sponsored noopener noreferrer" className="block h-full no-underline">
        {inner}
      </a>
    );
  }

  return (
    <Link to={item.href} className="block h-full no-underline">
      {inner}
    </Link>
  );
}
