import React, { useEffect, useState } from 'react';
import type { HomepageSpotlightCardModel } from '../../../types/spotlight/homepage';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { PremiumCarousel } from '../../home/PremiumCarousel';
import { SpotlightCampaignCard } from './SpotlightCampaignCard';

function resolveItemWidth(viewportWidth: number): number {
  if (viewportWidth < 640) return Math.min(viewportWidth - 40, 320);
  if (viewportWidth < 768) return 300;
  if (viewportWidth < 1024) return 280;
  if (viewportWidth < 1280) return 260;
  return 240;
}

interface SpotlightCarouselProps {
  cards: HomepageSpotlightCardModel[];
  impressionCallbacks?: SpotlightImpressionCallbacks;
}

export function SpotlightCarousel({ cards, impressionCallbacks }: SpotlightCarouselProps) {
  const [itemWidth, setItemWidth] = useState(() =>
    typeof window !== 'undefined' ? resolveItemWidth(window.innerWidth) : 280,
  );

  useEffect(() => {
    const onResize = () => setItemWidth(resolveItemWidth(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!cards.length) return null;

  return (
    <PremiumCarousel
      items={cards.map((card) => ({ ...card, id: card.campaign.campaignId }))}
      itemWidth={itemWidth}
      gap={16}
      renderCard={(card: HomepageSpotlightCardModel) => (
        <SpotlightCampaignCard
          card={card}
          impressionCallbacks={impressionCallbacks}
          className="w-full"
        />
      )}
    />
  );
}
