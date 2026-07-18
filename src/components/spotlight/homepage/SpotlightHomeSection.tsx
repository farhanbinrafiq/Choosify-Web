import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { CatalogProduct } from '../../../types/catalog';
import { useHomepageSpotlight } from '../../../hooks/useHomepageSpotlight';
import { createSpotlightImpressionLogger } from '../../../hooks/useSpotlightImpression';
import { listHomepageSpotlightCampaigns } from '../../../utils/spotlightHomepage';
import { StudioWrap } from '../../studio/StudioWrap';
import { SpotlightFeaturedToday } from './SpotlightFeaturedToday';
import { SpotlightFilterChips } from './SpotlightFilterChips';
import { SpotlightCarousel } from './SpotlightCarousel';
import { SpotlightEmptyState } from './SpotlightEmptyState';
import { SpotlightContinueWatchingPlaceholder } from './SpotlightContinueWatchingPlaceholder';

interface SpotlightHomeSectionProps {
  catalog: CatalogProduct[];
  brandLogos: Record<string, string>;
}

export function SpotlightHomeSection({ catalog, brandLogos }: SpotlightHomeSectionProps) {
  const hasAnyCampaigns = useMemo(() => listHomepageSpotlightCampaigns().length > 0, []);
  const { filter, setFilter, cards, featured } = useHomepageSpotlight(catalog, brandLogos);
  const impressionCallbacks = useMemo(() => createSpotlightImpressionLogger(), []);

  if (!hasAnyCampaigns) return null;

  return (
    <div id="section-spotlight">
    <StudioWrap
      sectionId="home-spotlight"
      className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm"
    >
      <SpotlightContinueWatchingPlaceholder />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="text-left">
          <h2 className="text-base font-semibold text-[#1a1a2e]">
            🔥 SPOTLIGHT
          </h2>
          <p className="text-[12px] text-[#8a9bb0] mt-1">
            Discover New Launches, Promotions &amp; Featured Campaigns
          </p>
        </div>
        <Link
          to="/spotlight"
          className="inline-flex items-center gap-1.5 text-[#E8500A] hover:text-[#CF4400] text-xs font-bold uppercase tracking-wider transition-all shrink-0"
        >
          Explore Spotlight
          <ChevronRight size={14} />
        </Link>
      </div>

      {featured && cards.length > 0 && (
        <SpotlightFeaturedToday
          card={featured}
          onWatch={() => impressionCallbacks.onClicked?.(featured.campaign.campaignId)}
        />
      )}

      <SpotlightFilterChips active={filter} onChange={setFilter} />

      {cards.length === 0 ? (
        <SpotlightEmptyState />
      ) : (
        <SpotlightCarousel cards={cards} impressionCallbacks={impressionCallbacks} />
      )}
    </StudioWrap>
    </div>
  );
}
