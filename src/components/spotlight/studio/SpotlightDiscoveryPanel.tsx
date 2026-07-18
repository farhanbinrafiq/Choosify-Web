import React from 'react';
import type { SpotlightExperienceDiscovery } from '../../../types/spotlight/studio';

const PLACEMENT_OPTIONS = [
  'homepage_carousel', 'spotlight_featured', 'brand_page', 'category_page',
  'product_page', 'creator_page', 'spotlight_reviews', 'spotlight_travel', 'deals_page',
];

interface SpotlightDiscoveryPanelProps {
  discovery: SpotlightExperienceDiscovery;
  onChange: (patch: Partial<SpotlightExperienceDiscovery>) => void;
}

export function SpotlightDiscoveryPanel({ discovery, onChange }: SpotlightDiscoveryPanelProps) {
  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h2 className="text-sm font-black text-navy uppercase">Discovery</h2>
      <div className="flex flex-wrap gap-3">
        {(['featured', 'trending', 'pinned', 'recommended'] as const).map((flag) => (
          <label key={flag} className="flex items-center gap-2 text-xs font-bold text-gray-500 capitalize">
            <input type="checkbox" checked={discovery[flag]} onChange={(e) => onChange({ [flag]: e.target.checked })} />
            {flag}
          </label>
        ))}
      </div>
      <label className="block text-xs font-bold text-gray-500">
        Tags (comma-separated)
        <input className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm" value={discovery.tags.join(', ')} onChange={(e) => onChange({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
      </label>
      <fieldset>
        <legend className="text-xs font-bold text-gray-500 mb-2">Placements</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PLACEMENT_OPTIONS.map((p) => (
            <label key={p} className="flex items-center gap-2 text-[10px] text-gray-500">
              <input
                type="checkbox"
                checked={discovery.placements.includes(p)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...discovery.placements, p]
                    : discovery.placements.filter((x) => x !== p);
                  onChange({ placements: next });
                }}
              />
              {p.replace(/_/g, ' ')}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
