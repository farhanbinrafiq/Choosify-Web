import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { usePublisherProfile } from '../hooks/usePublisherProfile';
import { createSpotlightImpressionLogger } from '../hooks/useSpotlightImpression';
import {
  PublisherProfileHeader,
  PublisherStatsBar,
  PublisherPageSection,
  PublisherSectionNav,
} from '../components/spotlight/publisher';

export function PublisherProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { profile, trust, page } = usePublisherProfile(slug);
  const [activeSection, setActiveSection] = useState('overview');
  const impressionCallbacks = useMemo(() => createSpotlightImpressionLogger(), []);

  if (!profile || !page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-[#1a1a2e]">Publisher not found</h1>
        <p className="text-sm text-gray-500 mt-2">This publisher profile may not exist yet.</p>
        <Link to="/spotlight" className="inline-flex items-center gap-1 mt-6 text-[#EB4501] text-sm font-bold uppercase">
          Browse Spotlight <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  const visibleSection =
    page.sections.find((s) => s.id === activeSection) ?? page.sections[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-left mb-4">
        <Link to="/spotlight" className="text-xs font-bold uppercase text-gray-400 hover:text-[#CF4400]">
          ← Spotlight
        </Link>
      </nav>

      <PublisherProfileHeader profile={profile} trust={trust} />
      <PublisherStatsBar profile={profile} />
      <PublisherSectionNav
        sections={page.sections}
        activeId={activeSection}
        onSelect={setActiveSection}
      />

      {visibleSection && (
        <PublisherPageSection section={visibleSection} impressionCallbacks={impressionCallbacks} />
      )}
    </div>
  );
}
