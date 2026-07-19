import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import type { HomepageSpotlightCardModel } from '../../../types/spotlight/homepage';
import { getSpotlightExploreCtaLabel } from '../../../utils/spotlightHomepage';

interface SpotlightFeaturedTodayProps {
  card: HomepageSpotlightCardModel;
  onWatch?: () => void;
}

export function SpotlightFeaturedToday({ card, onWatch }: SpotlightFeaturedTodayProps) {
  const label = getSpotlightExploreCtaLabel(card.campaign.campaignType);

  return (
    <div
      className="mb-4 rounded-lg border border-[#EB4501]/20 bg-gradient-to-r from-[#FFF8F4] to-white p-4 flex flex-wrap items-center justify-between gap-3"
      data-seasonal={card.seasonalTheme !== 'none' ? card.seasonalTheme : undefined}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[#EB4501] shrink-0" aria-hidden>
          <Star size={16} className="fill-[#EB4501]" />
        </span>
        <div className="min-w-0 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#EB4501]">Featured Today</p>
          <p className="text-sm font-bold text-navy truncate">{card.campaign.headline}</p>
          {card.campaign.brandName && (
            <p className="text-[11px] text-gray-500">{card.campaign.brandName}</p>
          )}
        </div>
      </div>
      <Link
        to={`/spotlight/${card.campaign.campaignSlug}`}
        onClick={onWatch}
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#EB4501] hover:underline shrink-0"
      >
        {label}
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}
