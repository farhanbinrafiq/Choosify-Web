import React, { useMemo, useState } from 'react';
import { useSpotlightExperience } from '../hooks/useSpotlightExperience';
import { SpotlightDiscoveryNav, SpotlightStoryRail, SpotlightStoryViewer } from '../components/spotlight/discovery';
import { buildDemoStoryGroups } from '../utils/spotlightStory';

/** Dedicated story mode entry — architecture demo */
export function SpotlightStoryPage() {
  const { allContent } = useSpotlightExperience();
  const storyGroups = useMemo(() => buildDemoStoryGroups(allContent), [allContent]);
  const [storyOpen, setStoryOpen] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-4 text-left">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Spotlight Stories</h1>
        <p className="text-sm text-gray-500 mt-2">Full-screen story mode — tap to navigate, swipe between publishers.</p>
      </header>

      <SpotlightDiscoveryNav />

      <SpotlightStoryRail groups={storyGroups} onOpen={setStoryOpen} />

      {storyOpen != null && (
        <SpotlightStoryViewer groups={storyGroups} initialGroupIndex={storyOpen} onClose={() => setStoryOpen(null)} />
      )}
    </div>
  );
}
