import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { getCollectionBySlug, resolveCollectionContent } from '../utils/spotlightCollections';
import { SpotlightBreadcrumbs, SpotlightDiscoveryNav } from '../components/spotlight/discovery';
import { SpotlightContentCard } from '../components/spotlight/experience';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';

export function SpotlightCollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { allContent } = useSpotlightExperience();
  const impressionCallbacks = useMemo(() => createSpotlightImpressionLogger(), []);

  const collection = useMemo(
    () => (slug ? getCollectionBySlug(slug, allContent) : undefined),
    [slug, allContent],
  );

  const items = useMemo(
    () => (collection ? resolveCollectionContent(collection, allContent) : []),
    [collection, allContent],
  );

  if (!collection) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Collection not found</h1>
        <Link to="/spotlight/explore?tab=collections" className="mt-4 inline-block text-[#E8500A] text-sm font-bold uppercase">
          Browse collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SpotlightDiscoveryNav />
      <SpotlightBreadcrumbs
        className="mb-4"
        items={[
          { label: 'Spotlight', href: '/spotlight' },
          { label: 'Collections', href: '/spotlight/explore?tab=collections' },
          { label: collection.name },
        ]}
      />
      <header className="mb-8 text-left">
        <span className="text-[10px] font-black uppercase text-[#E8500A]">{collection.kind}</span>
        <h1 className="text-2xl font-bold text-[#1a1a2e] mt-1">{collection.name}</h1>
        {collection.description && <p className="text-sm text-gray-500 mt-2">{collection.description}</p>}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <SpotlightContentCard key={item.contentId} content={item} impressionCallbacks={impressionCallbacks} />
        ))}
      </div>
    </div>
  );
}
