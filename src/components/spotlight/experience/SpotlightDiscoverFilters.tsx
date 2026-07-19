import React from 'react';
import type { SpotlightDiscoverFilters } from '../../../types/spotlight/experience/filters';
import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import { SPOTLIGHT_CONTENT_TYPE_META } from '../../../types/spotlight/experience/contentTypes';
import { cn } from '../../../lib/utils';

const QUICK_TYPES: SpotlightContentType[] = [
  'campaign',
  'promotion',
  'new_launch',
  'live',
  'buying_guide',
  'recommendation',
  'creator_review',
  'event',
  'brand_story',
];

interface SpotlightDiscoverFiltersProps {
  filters: SpotlightDiscoverFilters;
  onChange: (filters: SpotlightDiscoverFilters) => void;
}

export function SpotlightDiscoverFiltersPanel({ filters, onChange }: SpotlightDiscoverFiltersProps) {
  const toggleType = (type: SpotlightContentType) => {
    const has = filters.contentTypes.includes(type);
    onChange({
      ...filters,
      contentTypes: has
        ? filters.contentTypes.filter((t) => t !== type)
        : [...filters.contentTypes, type],
    });
  };

  const toggleFlag = (key: keyof Pick<SpotlightDiscoverFilters, 'liveOnly' | 'sponsoredOnly' | 'verifiedOnly' | 'trendingOnly' | 'promotionsOnly'>) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="mb-8 space-y-4" role="search" aria-label="Spotlight filters">
      <div className="flex flex-wrap gap-2">
        {QUICK_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleType(type)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors',
              filters.contentTypes.includes(type)
                ? 'bg-[#EB4501] text-white border-[#EB4501]'
                : 'bg-white text-gray-500 border-[#e8edf2] hover:border-[#EB4501]/40',
            )}
          >
            {SPOTLIGHT_CONTENT_TYPE_META[type].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['liveOnly', 'Live'],
            ['promotionsOnly', 'Promotions'],
            ['sponsoredOnly', 'Sponsored'],
            ['verifiedOnly', 'Verified'],
            ['trendingOnly', 'Trending'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleFlag(key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border',
              filters[key]
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-500 border-[#e8edf2]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search experiences..."
          value={filters.query ?? ''}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-[#e8edf2] rounded-[5px] focus:outline-none focus:border-[#EB4501]/50"
          aria-label="Search Spotlight"
        />
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as SpotlightDiscoverFilters['sort'] })}
          className="px-3 py-2 text-xs font-bold uppercase border border-[#e8edf2] rounded-[5px] bg-white"
          aria-label="Sort Spotlight"
        >
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="ending_soon">Ending Soon</option>
          <option value="priority">Priority</option>
          <option value="ai_score">AI Score</option>
        </select>
        <button
          type="button"
          onClick={() => onChange({ ...filters, contentTypes: [], liveOnly: false, sponsoredOnly: false, verifiedOnly: false, trendingOnly: false, promotionsOnly: false, query: '' })}
          className="text-[10px] font-bold uppercase text-gray-400 hover:text-[#CF4400]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
