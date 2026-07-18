import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { getSeriesBySlug, resolveSeriesEpisodeContent } from '../utils/spotlightSeries';
import { SpotlightBreadcrumbs, SpotlightDiscoveryNav, SpotlightSeriesCard } from '../components/spotlight/discovery';
import { SpotlightContentCard } from '../components/spotlight/experience';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';

export function SpotlightSeriesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { allContent, series: allSeries } = useSpotlightExperience();
  const impressionCallbacks = useMemo(() => createSpotlightImpressionLogger(), []);

  const seriesItem = useMemo(
    () => (slug ? getSeriesBySlug(slug, allContent) : undefined),
    [slug, allContent],
  );

  const episodes = useMemo(
    () => (seriesItem ? resolveSeriesEpisodeContent(seriesItem, allContent) : []),
    [seriesItem, allContent],
  );

  if (!seriesItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Series not found</h1>
        <Link to="/spotlight/explore?tab=series" className="mt-4 inline-block text-[#E8500A] text-sm font-bold uppercase">
          Browse series
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
          { label: 'Series', href: '/spotlight/explore?tab=series' },
          { label: seriesItem.title },
        ]}
      />
      <header className="mb-8 text-left">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">{seriesItem.title}</h1>
        {seriesItem.description && <p className="text-sm text-gray-500 mt-2">{seriesItem.description}</p>}
        <p className="text-[10px] font-bold uppercase text-gray-400 mt-2">{seriesItem.episodes.length} episodes</p>
      </header>

      <ol className="space-y-3 mb-10">
        {seriesItem.episodes.map((ep) => (
          <li key={ep.episodeId} className="flex items-center gap-3 p-3 border border-[#e8edf2] rounded-[5px]">
            <span className="text-xs font-black text-[#E8500A] w-8">E{ep.episodeNumber}</span>
            <span className="text-sm font-semibold text-[#1a1a2e]">{ep.title}</span>
          </li>
        ))}
      </ol>

      {episodes.length > 0 && (
        <>
          <h2 className="text-base font-semibold mb-4">Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((item) => (
              <SpotlightContentCard key={item.contentId} content={item} impressionCallbacks={impressionCallbacks} />
            ))}
          </div>
        </>
      )}

      {allSeries.length > 1 && (
        <div className="mt-12">
          <h2 className="text-base font-semibold mb-4">More Series</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSeries.filter((s) => s.slug !== slug).slice(0, 3).map((s) => (
              <SpotlightSeriesCard key={s.seriesId} series={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
