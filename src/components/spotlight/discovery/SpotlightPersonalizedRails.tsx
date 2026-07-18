import React from 'react';
import type { SpotlightPersonalizedRail } from '../../../types/spotlight/discovery/relatedRails';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { PremiumCarousel } from '../../home/PremiumCarousel';
import { SpotlightContentCard } from '../experience/SpotlightContentCard';

interface SpotlightPersonalizedRailsProps {
  rails: SpotlightPersonalizedRail[];
  allContent: SpotlightContent[];
  impressionCallbacks?: SpotlightImpressionCallbacks;
}

export function SpotlightPersonalizedRails({ rails, allContent, impressionCallbacks }: SpotlightPersonalizedRailsProps) {
  const byId = new Map(allContent.map((c) => [c.contentId, c]));

  return (
    <div className="space-y-10">
      {rails.map((rail) => {
        const items = rail.contentIds.map((id) => byId.get(id)).filter(Boolean) as SpotlightContent[];
        if (!items.length) return null;

        return (
          <section key={rail.kind} aria-labelledby={`rail-${rail.kind}`}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <h2 id={`rail-${rail.kind}`} className="text-base font-semibold text-[#1a1a2e]">
                {rail.title}
              </h2>
              {rail.isPlaceholder && (
                <span className="text-[9px] font-bold uppercase text-gray-400">Placeholder</span>
              )}
            </div>
            <PremiumCarousel
              items={items.map((item) => ({ ...item, id: item.contentId }))}
              itemWidth={280}
              gap={16}
              renderCard={(item) => (
                <SpotlightContentCard content={item} impressionCallbacks={impressionCallbacks} variant="compact" className="w-full" />
              )}
            />
          </section>
        );
      })}
    </div>
  );
}
