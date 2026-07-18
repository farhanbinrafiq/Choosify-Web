import React from 'react';
import type { SpotlightHomepageFilter } from '../../../types/spotlight/homepage';
import { cn } from '../../../lib/utils';

const FILTERS: { id: SpotlightHomepageFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new_launches', label: 'New Launches' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'featured', label: 'Featured' },
  { id: 'brand_stories', label: 'Brand Stories' },
  { id: 'events', label: 'Events' },
  { id: 'buying_guides', label: 'Buying Guides' },
];

interface SpotlightFilterChipsProps {
  active: SpotlightHomepageFilter;
  onChange: (f: SpotlightHomepageFilter) => void;
}

export function SpotlightFilterChips({ active, onChange }: SpotlightFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Filter Spotlight campaigns">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={active === f.id}
          onClick={() => onChange(f.id)}
          className={cn(
            'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors',
            active === f.id
              ? 'bg-[#E8500A] text-white border-[#E8500A]'
              : 'bg-white text-gray-500 border-[#e8edf2] hover:border-[#E8500A]/40',
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
