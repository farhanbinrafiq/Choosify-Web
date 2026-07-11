import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';
import { PremiumCarousel } from './PremiumCarousel';
import { CreatorCardDesign } from '../CreatorCardDesign';
import { StudioWrap } from '../studio/StudioWrap';
import { cn } from '../../lib/utils';

type DiscoverTab = 'guides' | 'recommendations' | 'creators';

interface DiscoverAndLearnSectionProps {
  guideSlides: Array<{ guide: any; kind: string }>;
  renderGuideCard: (slide: { guide: any; kind: string }) => React.ReactNode;
  creators: any[];
}

export function DiscoverAndLearnSection({
  guideSlides,
  renderGuideCard,
  creators,
}: DiscoverAndLearnSectionProps) {
  const [tab, setTab] = useState<DiscoverTab>('guides');

  const recommendationSlides = guideSlides.filter((s) =>
    s.guide?.type === 'recommendation' || s.guide?.category?.toLowerCase?.().includes('recommend'),
  );
  const guideOnlySlides = guideSlides.filter((s) => !recommendationSlides.includes(s));

  const tabs: { id: DiscoverTab; label: string; count: number }[] = [
    { id: 'guides', label: 'Guides', count: guideOnlySlides.length || guideSlides.length },
    { id: 'recommendations', label: 'Recommendations', count: recommendationSlides.length || Math.min(guideSlides.length, 6) },
    { id: 'creators', label: 'Creator Picks', count: creators.length },
  ];

  const activeItems =
    tab === 'creators'
      ? creators
      : tab === 'recommendations'
        ? (recommendationSlides.length ? recommendationSlides : guideSlides)
        : (guideOnlySlides.length ? guideOnlySlides : guideSlides);

  return (
    <StudioWrap sectionId="home-discover-learn" className="bg-white rounded-[5px] border border-[#e8edf2] p-5 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="text-left">
          <h2 className="text-base font-semibold text-[#1a1a2e] flex items-center gap-2">
            <BookOpen size={18} className="text-[#E8500A]" aria-hidden />
            Discover &amp; Learn
          </h2>
          <p className="text-[12px] text-[#8a9bb0] mt-1">Guides, recommendations, and creator picks to decide with confidence.</p>
        </div>
        <Link to="/guides" className="inline-flex items-center gap-1.5 text-[#E8500A] text-xs font-bold uppercase tracking-wider shrink-0 hover:underline">
          View All <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Discover and learn tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-3 py-2 min-h-[44px] text-[10px] font-bold uppercase tracking-wide rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8500A]',
              tab === t.id ? 'bg-[#E8500A] text-white border-[#E8500A]' : 'bg-white text-gray-500 border-[#e8edf2]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'creators' ? (
        <PremiumCarousel
          items={activeItems as any[]}
          itemWidth={260}
          gap={16}
          renderCard={(creator: any) => (
            <div className="w-[260px] shrink-0">
              <CreatorCardDesign creator={creator} />
            </div>
          )}
        />
      ) : (
        <PremiumCarousel
          items={activeItems as any[]}
          itemWidth={252}
          gap={16}
          renderCard={(slide) => (
            <div className="w-full h-full flex items-start">{renderGuideCard(slide)}</div>
          )}
        />
      )}
    </StudioWrap>
  );
}
