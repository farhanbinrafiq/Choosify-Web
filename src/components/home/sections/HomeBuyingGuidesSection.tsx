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

/** Design tile is 190×130 — keep that ratio as columns fluidly resize. */
const GUIDE_IMAGE_ASPECT = 'aspect-[190/130]';

function guideHref(guide: any): string {
  if (guide?.slug || guide?.id) return catalogGuideHref(guide);
  return '/spotlight?tab=guides';
}

/**
 * Top Buying Guides — responsive grid that scales each card as a unit.
 * Image uses a locked aspect ratio (not a fixed height) so proportions stay
 * stable from 1-col mobile through multi-col desktop.
 */
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

      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 mb-2 items-start">
        {slides.slice(0, 10).map(({ guide }) => (
          <Link
            key={String(guide.id)}
            to={guideHref(guide)}
            className="group cursor-pointer min-w-0 w-full flex flex-col bg-white rounded-[10px] overflow-hidden border border-[#E8EDF2] hover:border-[#FF5B00]/35 transition-colors"
          >
            <div className={`${GUIDE_IMAGE_ASPECT} w-full shrink-0 overflow-hidden bg-[#F4F7F9]`}>
              <img
                src={guide.image || PLACEHOLDER_IMAGE}
                alt=""
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
            </div>
            {/* Fixed text slot so cards don’t stretch unevenly when a grid row equalizes height */}
            <div className="h-[3.25rem] shrink-0 px-3 py-2.5 box-border">
              <div className="text-xs font-semibold text-[#1A1A2E] leading-snug line-clamp-2">
                {guide.title || guide.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DcHomeBlock>
  );
}
