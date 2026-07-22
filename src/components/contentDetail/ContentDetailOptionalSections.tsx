import React from 'react';
import type { ContentDetailSectionConfig } from '../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from './contentDetailSectionContext';
import { ContentDetailWinnerSection } from './sections/ContentDetailWinnerSection';
import { ContentDetailWhyWonSection } from './sections/ContentDetailWhyWonSection';
import { ContentDetailVerdictSection } from './sections/ContentDetailVerdictSection';
import { ContentDetailTakeawaysSection } from './sections/ContentDetailTakeawaysSection';
import { ContentDetailItemsMentionedSection } from './sections/ContentDetailItemsMentionedSection';
import { ContentDetailBrandsMentionedSection } from './sections/ContentDetailBrandsMentionedSection';
import { ContentDetailHowReviewWasMadeSection } from './sections/ContentDetailHowReviewWasMadeSection';

export type { ContentDetailSectionContext } from './contentDetailSectionContext';

interface ContentDetailOptionalSectionsProps {
  sections: ContentDetailSectionConfig[];
  ctx: ContentDetailSectionContext;
}

/**
 * Maps enabled optional sections in config order → reusable section components.
 * No contentType branching here — the config array drives what renders.
 */
export function ContentDetailOptionalSections({
  sections,
  ctx,
}: ContentDetailOptionalSectionsProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section.id) {
          case 'winner':
            return (
              <ContentDetailWinnerSection
                key={section.id}
                section={section}
                ctx={ctx}
              />
            );
          case 'why_it_won':
            return (
              <ContentDetailWhyWonSection
                key={section.id}
                section={section}
                ctx={ctx}
              />
            );
          case 'verdict':
            return (
              <ContentDetailVerdictSection
                key={section.id}
                section={section}
                ctx={ctx}
              />
            );
          case 'takeaways':
            return (
              <ContentDetailTakeawaysSection
                key={section.id}
                section={section}
                ctx={ctx}
              />
            );
          case 'items_mentioned':
            return (
              <ContentDetailItemsMentionedSection
                key={section.id}
                section={section}
                ctx={ctx}
              />
            );
          case 'brands_mentioned':
            return (
              <ContentDetailBrandsMentionedSection
                key={section.id}
                section={section}
                ctx={ctx}
              />
            );
          case 'how_review_was_made':
            return (
              <ContentDetailHowReviewWasMadeSection
                key={section.id}
                section={section}
                ctx={ctx}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
