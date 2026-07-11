import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { SpotlightDiscoverSection } from '../../../types/spotlight/experience/content';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { PremiumCarousel } from '../../home/PremiumCarousel';
import { SpotlightCardRenderer } from './SpotlightCardRenderer';
import { SpotlightCommerceFeedGrid } from './SpotlightCommerceFeedGrid';
import { SpotlightCollectionRow } from '../discovery/SpotlightCollectionCard';
import { SpotlightLazySection } from './SpotlightLazySection';
import type { SpotlightCollection } from '../../../types/spotlight/discovery/collections';
import { sectionDefinition } from '../../../lib/spotlight/experience/sectionRegistry';
import { CONTENT_DENSITY_REGISTRY } from '../../../lib/spotlight/experience/contentDensityRegistry';

interface SpotlightDiscoverSectionBlockProps {
  section: SpotlightDiscoverSection;
  impressionCallbacks?: SpotlightImpressionCallbacks;
  collections?: SpotlightCollection[];
  lazyLoad?: boolean;
}

export function SpotlightDiscoverSectionBlock({
  section,
  impressionCallbacks,
  collections = [],
  lazyLoad = true,
}: SpotlightDiscoverSectionBlockProps) {
  if (!section.items.length && section.layout !== 'collection_row') return null;

  const def = sectionDefinition(section.id);
  const density = def?.defaultDensity ?? 'standard';
  const densityDef = CONTENT_DENSITY_REGISTRY[density];
  const cardVariant = density === 'featured' ? 'hero' : density === 'compact' ? 'compact' : 'default';

  const body = (
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
            View More <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {section.layout === 'hero' && (
        <SpotlightCardRenderer
          content={section.items[0]}
          impressionCallbacks={impressionCallbacks}
          variant="hero"
          sectionLayout="hero"
          feedMode="hero"
        />
      )}

      {section.layout === 'carousel' && (
        <PremiumCarousel
          items={section.items.map((item) => ({ ...item, id: item.contentId }))}
          itemWidth={densityDef.cardWidth}
          gap={16}
          renderCard={(item) => (
            <SpotlightCardRenderer
              content={item}
              impressionCallbacks={impressionCallbacks}
              variant={cardVariant === 'hero' ? 'compact' : cardVariant}
              sectionLayout="carousel"
              feedMode="carousel"
              className="w-full"
            />
          )}
        />
      )}

      {section.layout === 'grid' && (
        <SpotlightCommerceFeedGrid
          items={section.items}
          impressionCallbacks={impressionCallbacks}
          sectionLayout="grid"
        />
      )}

      {section.layout === 'list' && (
        <ul className="divide-y divide-gray-100 border border-[#e8edf2] rounded-[5px] overflow-hidden">
          {section.items.map((item) => (
            <li key={item.contentId} className="p-4 hover:bg-gray-50/50">
              <SpotlightCardRenderer
                content={item}
                impressionCallbacks={impressionCallbacks}
                variant="compact"
                sectionLayout="list"
                feedMode="list"
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

  if (lazyLoad && def?.lazyLoad) {
    return <SpotlightLazySection enabled>{body}</SpotlightLazySection>;
  }

  return body;
}
