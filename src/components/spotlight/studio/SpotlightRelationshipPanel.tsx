import React from 'react';
import type { SpotlightExperienceRelationships } from '../../../types/spotlight/studio';

interface SpotlightRelationshipPanelProps {
  relationships: SpotlightExperienceRelationships;
  onChange: (patch: Partial<SpotlightExperienceRelationships>) => void;
}

function IdListField({
  label,
  value,
  onUpdate,
}: {
  label: string;
  value: string[];
  onUpdate: (ids: string[]) => void;
}) {
  return (
    <label className="block text-xs font-bold text-gray-500">
      {label}
      <input
        className="w-full mt-1 border border-[#e8edf2] rounded px-3 py-2 text-sm"
        value={value.join(', ')}
        onChange={(e) => onUpdate(e.target.value.split(',').map((id) => id.trim()).filter(Boolean))}
        placeholder="IDs comma-separated"
      />
    </label>
  );
}

export function SpotlightRelationshipPanel({ relationships, onChange }: SpotlightRelationshipPanelProps) {
  return (
    <div className="p-6 space-y-4 max-w-xl">
      <h2 className="text-sm font-black text-navy uppercase">Content Relationships</h2>
      <p className="text-xs text-gray-500">Connect products, brands, creators, collections, and related Spotlight content.</p>
      <IdListField label="Products" value={relationships.productIds} onUpdate={(productIds) => onChange({ productIds })} />
      <IdListField label="Brands" value={relationships.brandIds} onUpdate={(brandIds) => onChange({ brandIds })} />
      <IdListField label="Creators" value={relationships.creatorIds} onUpdate={(creatorIds) => onChange({ creatorIds })} />
      <IdListField label="Categories" value={relationships.categoryIds} onUpdate={(categoryIds) => onChange({ categoryIds })} />
      <IdListField label="Collections" value={relationships.collectionIds} onUpdate={(collectionIds) => onChange({ collectionIds })} />
      <IdListField label="Series" value={relationships.seriesIds} onUpdate={(seriesIds) => onChange({ seriesIds })} />
      <IdListField label="Related Campaigns" value={relationships.campaignIds} onUpdate={(campaignIds) => onChange({ campaignIds })} />
    </div>
  );
}
