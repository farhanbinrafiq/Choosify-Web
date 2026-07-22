import React from 'react';
import type { ContentDetailSectionConfig } from '../../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from '../contentDetailSectionContext';

export function ContentDetailTakeawaysSection({
  section,
}: {
  section: ContentDetailSectionConfig;
  ctx: ContentDetailSectionContext;
}) {
  const title = section.data?.takeawayTitle || 'The verdict';
  const body =
    section.data?.takeawayBody ||
    'If you value pristine hardware stability, direct sourcing authenticity, and optimal value return on your premium hardware spend, the overall winner remains our absolute recommendation for this year. Do not settle for unverified alternatives.';

  return (
    <div id="takeaways" className="scroll-mt-36">
      <div className="mb-3.5 text-left">
        <h2 className="text-[13px] font-extrabold text-[#1A1A2E] tracking-wide uppercase">
          Key Takeaways
        </h2>
      </div>
      <div className="bg-white text-[#1A1A2E] rounded-[10px] p-6 text-left border border-[#E8EDF2]">
        <p className="text-[13px] font-extrabold text-[#EB4501] mb-2 leading-none">{title}</p>
        <p className="text-[13px] font-bold text-[#4B5563] leading-relaxed max-w-2xl text-left">
          {body}
        </p>
      </div>
    </div>
  );
}
