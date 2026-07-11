import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { SpotlightDiscoverSection } from '../../../types/spotlight/experience/content';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { PremiumCarousel } from '../../home/PremiumCarousel';
import { SpotlightContentCard } from './SpotlightContentCard';
import { SpotlightCollectionRow } from '../discovery/SpotlightCollectionCard';
import type { SpotlightCollection } from '../../../types/spotlight/discovery/collections';

interface SpotlightDiscoverSectionBlockProps {
  section: SpotlightDiscoverSection;
  impressionCallbacks?: SpotlightImpressionCallbacks;
  collections?: SpotlightCollection[];
}

export function SpotlightDiscoverSectionBlock({
  section,
  impressionCallbacks,
  collections = [],
}: SpotlightDiscoverSectionBlockProps) {
  if (!section.items.length) return null;

  return (
    <section className="mb-10" aria-labelledby={`spotlight-section-${section.id}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="text-left">
          <h2 id={`spotlight-section-${section.id}`} className="text-base font-semibold text-[#1a1a2e]">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-[12px] text-[#8a9bb0] mt-1">{section.subtitle}</p>
          )}
        </div>
        {section.viewAllHref && (
          <Link
            to={section.viewAllHref}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#E8500A] hover:underline shrink-0"
          >
            View All <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {section.layout === 'hero' && (
        <SpotlightContentCard
          content={section.items[0]}
          impressionCallbacks={impressionCallbacks}
          variant="hero"
        />
      )}

      {section.layout === 'carousel' && (
        <PremiumCarousel
          items={section.items.map((item) => ({ ...item, id: item.contentId }))}
          itemWidth={280}
          gap={16}
          renderCard={(item) => (
            <SpotlightContentCard
              content={item}
              impressionCallbacks={impressionCallbacks}
              variant="compact"
              className="w-full"
            />
          )}
        />
      )}

      {section.layout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {section.items.map((item) => (
            <SpotlightContentCard
              key={item.contentId}
              content={item}
              impressionCallbacks={impressionCallbacks}
            />
          ))}
        </div>
      )}

      {section.layout === 'list' && (
        <ul className="divide-y divide-gray-100 border border-[#e8edf2] rounded-[5px] overflow-hidden">
          {section.items.map((item) => (
            <li key={item.contentId} className="p-4 hover:bg-gray-50/50">
              <SpotlightContentCard
                content={item}
                impressionCallbacks={impressionCallbacks}
                variant="compact"
              />
            </li>
          ))}
        </ul>
      )}

      {section.layout === 'collection_row' && section.collectionIds && (
        <SpotlightCollectionRow
          collections={collections.filter((c) => section.collectionIds?.includes(c.collectionId))}
        />
      )}
    </section>
  );
}
