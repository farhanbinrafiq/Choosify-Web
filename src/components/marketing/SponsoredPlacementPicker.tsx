import React from 'react';
import type { SponsoredPlacementSurface } from '../../types/commerce/sponsoredPlacement';
import { cn } from '../../lib/utils';

export const SPONSORED_PLACEMENT_OPTIONS: { id: SponsoredPlacementSurface; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'categories', label: 'Categories' },
  { id: 'products', label: 'Products' },
  { id: 'brands', label: 'Brands' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'search', label: 'Search' },
  { id: 'compare', label: 'Compare' },
  { id: 'deals', label: 'Deals' },
];

interface SponsoredPlacementPickerProps {
  selected: SponsoredPlacementSurface[];
  onChange: (placements: SponsoredPlacementSurface[]) => void;
}

export function SponsoredPlacementPicker({ selected, onChange }: SponsoredPlacementPickerProps) {
  const toggle = (id: SponsoredPlacementSurface) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {SPONSORED_PLACEMENT_OPTIONS.map(({ id, label }) => (
        <label
          key={id}
          className={cn(
            'flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm font-semibold transition-colors',
            selected.includes(id) ? 'border-[#EB4501] bg-[#EB4501]/5 text-[#EB4501]' : 'border-[#e8edf2] text-gray-600',
          )}
        >
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={() => toggle(id)}
            className="accent-[#EB4501]"
          />
          {label}
        </label>
      ))}
    </div>
  );
}
