import React from 'react';
import { cn } from '../../../lib/utils';
import { SPOTLIGHT_STICKY_FILTER_IDS } from '../../../lib/spotlight/feed/feedRegistry';

export interface SpotlightFeedFilterChip {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

/**
 * LE-006 Phase 1 — sticky filter navigation for the Spotlight commerce feed.
 * Reuses the shared quick-filter state; existing Choosify chip styling only.
 */
export function SpotlightFeedFilterBar({
  chips,
  className,
}: {
  chips: SpotlightFeedFilterChip[];
  className?: string;
}) {
  const ordered = SPOTLIGHT_STICKY_FILTER_IDS
    .map((id) => chips.find((chip) => chip.id === id))
    .filter((chip): chip is SpotlightFeedFilterChip => Boolean(chip));

  if (!ordered.length) return null;

  return (
    <nav
      aria-label="Spotlight feed filters"
      className={cn(
        'choosify-sticky-section-nav sticky z-30 -mx-4 sm:-mx-5 lg:-mx-6 px-4 sm:px-5 lg:px-6 bg-[#F4F7F9]/95 backdrop-blur-md border-b border-[#E8EDF2] py-2.5',
        className,
      )}
    >
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" role="tablist">
        {ordered.map((chip) => (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={chip.active}
            onClick={chip.onClick}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-lg text-[12px] font-bold tracking-tight border transition-colors min-h-[32px]',
              chip.active
                ? 'bg-[#EB4501] text-white border-[#EB4501]'
                : 'bg-white text-[#9AA0AC] border-[#E8EDF2] hover:border-[#d5dce5] hover:text-[#1A1A2E]',
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
