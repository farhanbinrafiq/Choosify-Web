import React from 'react';
import type { SpotlightRelatedExperienceBundle } from '../../../types/spotlight/graph/relatedExperience';

interface RelatedContentRailProps {
  related?: SpotlightRelatedExperienceBundle;
}

export function RelatedContentRail({ related }: RelatedContentRailProps) {
  if (!related?.sections.length) return null;
  return (
    <section className="mt-10 text-left border-t border-gray-100 pt-8">
      <h2 className="text-base font-semibold text-[#1a1a2e] mb-4">Related Experiences</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {related.sections.map((section) => (
          <div key={section.kind} className="p-4 border border-[#e8edf2] rounded-[5px] bg-white">
            <p className="text-sm font-bold text-[#1a1a2e]">{section.title}</p>
            <p className="text-xs text-gray-500 mt-1">{section.contentIds.length} items</p>
          </div>
        ))}
      </div>
    </section>
  );
}
