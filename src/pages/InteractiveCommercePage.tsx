import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useInteractiveCommerce } from '../hooks/useInteractiveCommerce';
import { InteractiveCommerceLayout, ReplayExperienceLayout } from '../components/spotlight/interactive';

export function InteractiveCommercePage() {
  const { slug } = useParams<{ slug: string }>();
  const {
    event,
    activeSource,
    pinnedProducts,
    activeChapter,
    related,
    selectSource,
    jumpToChapter,
    isReplay,
  } = useInteractiveCommerce(slug);

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-[#1a1a2e]">Interactive experience not found</h1>
        <p className="text-sm text-gray-500 mt-2">
          This live or replay event may not exist. Publish a livestream campaign in Spotlight CMS to preview.
        </p>
        <Link to="/spotlight" className="inline-flex items-center gap-1 mt-6 text-[#E8500A] text-sm font-bold uppercase">
          Browse Spotlight <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  const Layout = isReplay ? ReplayExperienceLayout : InteractiveCommerceLayout;

  return (
    <div className="px-4 py-8">
      <nav className="max-w-7xl mx-auto text-left mb-4">
        <Link to={`/spotlight/${event.slug}`} className="text-xs font-bold uppercase text-gray-400 hover:text-[#E8500A]">
          ← Campaign
        </Link>
      </nav>
      <Layout
        event={event}
        activeSource={activeSource}
        pinnedProducts={pinnedProducts}
        activeChapter={activeChapter}
        related={related}
        collaborators={event.collaborators}
        onSelectSource={selectSource}
        onSelectChapter={jumpToChapter}
      />
    </div>
  );
}
