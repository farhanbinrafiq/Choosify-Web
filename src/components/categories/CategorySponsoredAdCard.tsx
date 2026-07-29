import React from 'react';
import { Link } from 'react-router-dom';
import type { SponsoredPlacementItem } from '../../types/commerce/sponsoredPlacement';
import { PLACEHOLDER_IMAGE } from '../../constants';

/** Sponsored ad tile for the Categories grid — dark gradient ad treatment (matches CategoryPremiumCard's footprint). */
export function CategorySponsoredAdCard({ item }: { item: SponsoredPlacementItem }) {
  const inner = (
    <div className="choosify-dark-surface rounded-xl overflow-hidden flex flex-col h-full p-4 min-h-[380px]">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10.5px] font-extrabold text-[#EB4501] uppercase tracking-wide flex items-center gap-1">
          🏷️ Sponsored Ad
        </span>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 overflow-hidden">
          {item.sponsorLogoUrl ? (
            <img src={item.sponsorLogoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            item.sponsorName.charAt(0).toUpperCase()
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg bg-black/20 mb-3.5 flex-[7] min-h-0">
        <img
          src={item.image ?? PLACEHOLDER_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-[3] min-h-0 shrink-0 flex flex-col justify-center">
        <span className="text-[13px] font-bold text-white mb-0.5 line-clamp-2">
          {item.title || item.sponsorName}
        </span>
        {item.subtitle && (
          <span className="text-[11px] text-white/50 line-clamp-2 mb-3">{item.subtitle}</span>
        )}

        <span className="mt-auto block w-full text-center bg-[#EB4501] text-white py-2.5 rounded-lg text-[11.5px] font-bold hover:brightness-110 transition-[filter]">
          {item.ctaLabel || 'Shop Now'}
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
