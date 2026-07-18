import React, { useMemo } from 'react';
import type { HomepageSpotlightCardModel } from '../../../types/spotlight/homepage';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { homepageCardToSpotlightContent } from '../../../utils/spotlightContentResolver';
import { SpotlightContentCard } from '../experience/SpotlightContentCard';

interface SpotlightCampaignCardProps {
  card: HomepageSpotlightCardModel;
  impressionCallbacks?: SpotlightImpressionCallbacks;
  className?: string;
  brandLogos?: Record<string, string>;
}

/** Thin adapter — delegates to universal SpotlightContentCard */
export function SpotlightCampaignCard({
  card,
  impressionCallbacks,
  className,
  brandLogos = {},
}: SpotlightCampaignCardProps) {
  const { allCatalogProducts } = useGlobalState();
  const content = useMemo(
    () => homepageCardToSpotlightContent(card, allCatalogProducts, brandLogos),
    [card, allCatalogProducts, brandLogos],
  );

  return (
    <SpotlightContentCard
      content={content}
      impressionCallbacks={impressionCallbacks}
      className={className}
    />
  );
}
