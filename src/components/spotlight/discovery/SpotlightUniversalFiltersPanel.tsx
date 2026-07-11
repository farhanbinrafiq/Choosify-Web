import React from 'react';
import type { SpotlightDiscoverFilters } from '../../../types/spotlight/experience/filters';
import type { SpotlightUniversalFilterMedia } from '../../../types/spotlight/discovery/filters';
import { SpotlightDiscoverFiltersPanel } from '../experience/SpotlightDiscoverFilters';
import { cn } from '../../../lib/utils';

interface SpotlightUniversalFiltersPanelProps {
  filters: SpotlightDiscoverFilters;
  onChange: (filters: SpotlightDiscoverFilters) => void;
  replayOnly?: boolean;
  upcomingOnly?: boolean;
  mediaTypes?: SpotlightUniversalFilterMedia[];
  onReplayToggle?: () => void;
  onUpcomingToggle?: () => void;
  onMediaToggle?: (m: SpotlightUniversalFilterMedia) => void;
}

/** Extended filters — wraps Phase 1 panel + Phase 4 universal dimensions */
export function SpotlightUniversalFiltersPanel({
  filters,
  onChange,
  replayOnly,
  upcomingOnly,
  mediaTypes = [],
  onReplayToggle,
  onUpcomingToggle,
  onMediaToggle,
}: SpotlightUniversalFiltersPanelProps) {
  return (
    <div className="space-y-4">
      <SpotlightDiscoverFiltersPanel filters={filters} onChange={onChange} />

      <div className="flex flex-wrap gap-2" aria-label="Extended filters">
        {onReplayToggle && (
          <FilterChip active={replayOnly} label="Replay" onClick={onReplayToggle} />
        )}
        {onUpcomingToggle && (
          <FilterChip active={upcomingOnly} label="Upcoming" onClick={onUpcomingToggle} />
        )}
        {(['video', 'live', 'image'] as SpotlightUniversalFilterMedia[]).map((m) =>
          onMediaToggle ? (
            <FilterChip
              key={m}
              active={mediaTypes.includes(m)}
              label={m}
              onClick={() => onMediaToggle(m)}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, label, onClick }: { active?: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 min-h-[44px] rounded-full text-[10px] font-bold uppercase border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8500A]',
        active ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-[#e8edf2]',
      )}
    >
      {label}
    </button>
  );
}
