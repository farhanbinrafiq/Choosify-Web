import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { SpotlightDiscoveryNav, SpotlightExploreGrid } from '../components/spotlight/discovery';
import { buildExploreSections } from '../utils/spotlightExplore';

export function SpotlightExplorePage() {
  const { allContent, collections, series } = useSpotlightExperience();
  const [params] = useSearchParams();
  const tab = params.get('tab') ?? undefined;

  const sections = useMemo(() => buildExploreSections(allContent), [allContent]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-4 text-left">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Explore Spotlight</h1>
        <p className="text-sm text-gray-500 mt-2">Browse by category, publisher, creator, brand, campaign, and more.</p>
      </header>

      <SpotlightDiscoveryNav />

      <SpotlightExploreGrid
        sections={sections}
        collections={collections}
        series={series}
        activeTab={tab}
      />
    </div>
  );
}
