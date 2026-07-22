import React from 'react';
import type { ContentDetailSectionConfig } from '../../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from '../contentDetailSectionContext';

/** How This Review Was Made — review content types. */
export function ContentDetailHowReviewWasMadeSection({
  section,
  ctx,
}: {
  section: ContentDetailSectionConfig;
  ctx: ContentDetailSectionContext;
}) {
  const steps =
    section.data?.reviewMethodSteps?.length
      ? section.data.reviewMethodSteps
      : [
          'Tested for 30 days',
          `Compared with ${Math.max(ctx.products.length, 3)} competitors`,
          'Real world usage',
          'No sponsored placement',
        ];

  return (
    <div id="how-review-was-made" className="scroll-mt-36">
      <div className="bg-white rounded-[10px] p-5 border border-[#E8EDF2] text-center max-w-xl">
        <div className="text-[13px] font-extrabold text-[#1A1A2E] mb-4">
          HOW <span className="text-[#EB4501]">THIS REVIEW</span> WAS MADE
        </div>
        <div className="h-px bg-[#F1F1F3] mb-4" />
        <div className="flex flex-col gap-3.5 text-left">
          {steps.map((label) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="text-[#EB4501] text-base shrink-0">●</span>
              <span className="text-[13px] font-bold italic text-[#1A1A2E]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
