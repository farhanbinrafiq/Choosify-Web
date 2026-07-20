import React from 'react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../../../constants';
import { DcHomeBlock } from '../DcHomePanel';
import { ViewAllLink } from '../../design/ViewAllLink';
import { catalogGuideHref } from '../../../lib/spotlight/content';

interface HomeBuyingGuidesSectionProps {
  guideSlides: Array<{ guide: any; kind: string }>;
}

/** Choosify.dc.html Top Buying Guides — demo titles when catalog empty */
const FALLBACK_GUIDES = [
  { id: 'demo-g1', title: 'Best Phones Under 30K in BD' },
  { id: 'demo-g2', title: "Best Hotels in Cox's Bazar" },
  { id: 'demo-g3', title: 'Best Air Conditioners for Home' },
  { id: 'demo-g4', title: 'Best Running Shoes for Men' },
  { id: 'demo-g5', title: 'Best Laptops for Students' },
  { id: 'demo-g6', title: 'How to Choose the Right Camera' },
  { id: 'demo-g7', title: 'Top DSLR vs Mirrorless Guide' },
  { id: 'demo-g8', title: 'Choosing a Home Wi-Fi Router' },
];

function guideHref(guide: any): string {
  if (guide?.slug || guide?.id) return catalogGuideHref(guide);
  return '/spotlight?tab=guides';
}

/** Choosify.dc.html — horizontal scroll guide cards (190px) */
export function HomeBuyingGuidesSection({ guideSlides }: HomeBuyingGuidesSectionProps) {
  const slides =
    guideSlides.length > 0
      ? guideSlides
      : FALLBACK_GUIDES.map((guide) => ({ guide, kind: 'blog' }));

  return (
    <DcHomeBlock id="section-buying-guides">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h2
          id="section-buying-guides-heading"
          className="text-[19px] font-extrabold text-[#1A1A2E]"
        >
          Top Buying Guides
        </h2>
        <ViewAllLink href="/spotlight?tab=guides" label="DISCOVER ALL ›" />
      </div>
      <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory mb-2 pb-1 scrollbar-hide">
        {slides.slice(0, 10).map(({ guide }) => (
          <Link
            key={String(guide.id)}
            to={guideHref(guide)}
            className="cursor-pointer flex-[0_0_190px] snap-start"
          >
            <div className="h-[130px] rounded-[10px] overflow-hidden mb-2.5 bg-white">
              <img
                src={guide.image || PLACEHOLDER_IMAGE}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-xs font-semibold text-[#1A1A2E] leading-snug line-clamp-2">
              {guide.title || guide.name}
            </div>
          </Link>
        ))}
      </div>
    </DcHomeBlock>
  );
}
