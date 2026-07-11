import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';
import { useSpotlightHistory } from '../hooks/useSpotlightHistory';
import {
  SpotlightDiscoverSectionBlock,
} from '../components/spotlight/experience';
import { SpotlightEmptyState } from '../components/spotlight/homepage/SpotlightEmptyState';
import {
  SpotlightDiscoveryNav,
  SpotlightPersonalizedRails,
  SpotlightStoryRail,
  SpotlightStoryViewer,
  SpotlightUniversalFiltersPanel,
} from '../components/spotlight/discovery';
import { buildDemoStoryGroups } from '../utils/spotlightStory';

export function SpotlightDiscoverPage() {
  const {
    sections,
    filters,
    setFilters,
    hasContent,
    allContent,
    collections,
    personalizedRails,
  } = useSpotlightExperience();
  const { recordView } = useSpotlightHistory(allContent);
  const impressionCallbacks = useMemo(() => createSpotlightImpressionLogger(), []);
  const storyGroups = useMemo(() => buildDemoStoryGroups(allContent), [allContent]);
  const [storyOpen, setStoryOpen] = useState<number | null>(null);
  const [replayOnly, setReplayOnly] = useState(false);
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  const displaySections = useMemo(() => {
    if (!replayOnly && !upcomingOnly) return sections;
    return sections.map((s) => ({
      ...s,
      items: s.items.filter((item) => {
        if (replayOnly && item.live?.status !== 'replay' && item.live?.status !== 'ended') return false;
        if (upcomingOnly && item.live?.status !== 'upcoming') return false;
        return true;
      }),
    })).filter((s) => s.layout === 'collection_row' || s.items.length > 0);
  }, [sections, replayOnly, upcomingOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-4 text-left">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Spotlight</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
          Choosify&apos;s discovery home — endlessly browse campaigns, live sessions, creators, guides, and collections.
        </p>
      </header>

      <SpotlightDiscoveryNav />

      {storyGroups.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Stories</p>
          <SpotlightStoryRail groups={storyGroups} onOpen={setStoryOpen} />
        </div>
      )}

      <SpotlightUniversalFiltersPanel
        filters={filters}
        onChange={setFilters}
        replayOnly={replayOnly}
        upcomingOnly={upcomingOnly}
        onReplayToggle={() => setReplayOnly((v) => !v)}
        onUpcomingToggle={() => setUpcomingOnly((v) => !v)}
      />

      {!hasContent ? (
        <SpotlightEmptyState />
      ) : displaySections.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e8edf2] rounded-lg">
          <p className="text-sm text-gray-500">No experiences match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setFilters({ ...filters, contentTypes: [], query: '', liveOnly: false, sponsoredOnly: false, verifiedOnly: false, trendingOnly: false, promotionsOnly: false });
              setReplayOnly(false);
              setUpcomingOnly(false);
            }}
            className="mt-4 text-xs font-bold uppercase text-[#E8500A] hover:underline min-h-[44px] px-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <SpotlightPersonalizedRails
            rails={personalizedRails.slice(0, 2)}
            allContent={allContent}
            impressionCallbacks={impressionCallbacks}
          />

          {displaySections.map((section) => (
            <SpotlightDiscoverSectionBlock
              key={section.id}
              section={section}
              impressionCallbacks={{
                ...impressionCallbacks,
                onClicked: (id) => {
                  impressionCallbacks.onClicked?.(id);
                  const item = allContent.find((c) => c.contentId === id || c.sourceId === id);
                  if (item) recordView(item);
                },
              }}
              collections={collections}
            />
          ))}

          <SpotlightPersonalizedRails
            rails={personalizedRails.slice(2)}
            allContent={allContent}
            impressionCallbacks={impressionCallbacks}
          />
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8500A] hover:underline min-h-[44px]"
        >
          Back to Home
          <ChevronRight size={14} />
        </Link>
      </div>

      {storyOpen != null && (
        <SpotlightStoryViewer
          groups={storyGroups}
          initialGroupIndex={storyOpen}
          onClose={() => setStoryOpen(null)}
        />
      )}
    </div>
  );
}
