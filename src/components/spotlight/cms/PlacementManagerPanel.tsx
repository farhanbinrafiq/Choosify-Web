import React from 'react';
import { SPOTLIGHT_PLACEMENT_SURFACES } from '../../../types/spotlight/placement';
import type { SpotlightPlacementSurface } from '../../../types/spotlight/placement';
import { cn } from '../../../lib/utils';

interface PlacementManagerPanelProps {
  selected: SpotlightPlacementSurface[];
  onChange: (surfaces: SpotlightPlacementSurface[]) => void;
}

export function PlacementManagerPanel({ selected, onChange }: PlacementManagerPanelProps) {
  const toggle = (surface: SpotlightPlacementSurface) => {
    if (selected.includes(surface)) {
      onChange(selected.filter((s) => s !== surface));
    } else {
      onChange([...selected, surface]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {(Object.entries(SPOTLIGHT_PLACEMENT_SURFACES) as [SpotlightPlacementSurface, { label: string }][]).map(
        ([key, meta]) => (
          <label
            key={key}
            className={cn(
              'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
              selected.includes(key) ? 'border-[#EB4501] bg-[#EB4501]/5' : 'border-[#e8edf2]',
            )}
          >
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={() => toggle(key)}
              className="accent-[#EB4501]"
            />
            <div>
              <p className="text-sm font-semibold">{meta.label}</p>
              <p className="text-[10px] text-gray-400 uppercase">{key}</p>
            </div>
          </label>
        ),
      )}
    </div>
  );
}
