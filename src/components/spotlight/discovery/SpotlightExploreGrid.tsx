import React from 'react';
import { Link } from 'react-router-dom';
import type { SpotlightExploreSection } from '../../../types/spotlight/discovery/explore';
import type { SpotlightCollection } from '../../../types/spotlight/discovery/collections';
import type { SpotlightSeries } from '../../../types/spotlight/discovery/series';
import { SpotlightCollectionCard } from './SpotlightCollectionCard';
import { SpotlightSeriesCard } from './SpotlightSeriesCard';

interface SpotlightExploreGridProps {
  sections: SpotlightExploreSection[];
  collections?: SpotlightCollection[];
  series?: SpotlightSeries[];
  activeTab?: string;
}

export function SpotlightExploreGrid({ sections, collections = [], series = [], activeTab }: SpotlightExploreGridProps) {
  if (activeTab === 'collections' && collections.length) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {collections.map((c) => (
          <SpotlightCollectionCard key={c.collectionId} collection={c} />
        ))}
      </div>
    );
  }

  if (activeTab === 'series' && series.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {series.map((s) => (
          <SpotlightSeriesCard key={s.seriesId} series={s} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`explore-${section.id}`}>
          <h2 id={`explore-${section.id}`} className="text-base font-semibold text-[#1a1a2e] mb-4">
            {section.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {section.tiles.map((tile) => (
              <Link
                key={`${tile.dimension}-${tile.label}`}
                to={tile.href}
                className="flex flex-col items-center justify-center min-h-[100px] p-4 border border-[#e8edf2] rounded-[5px] hover:border-[#E8500A]/40 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8500A]"
              >
                <span className="text-[10px] font-black uppercase text-[#E8500A]">{tile.dimension}</span>
                <span className="text-sm font-bold text-[#1a1a2e] mt-1">{tile.label}</span>
                {tile.count != null && (
                  <span className="text-[10px] text-gray-400 mt-0.5">{tile.count}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
