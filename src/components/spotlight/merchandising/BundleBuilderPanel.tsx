import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { SpotlightCampaignBundle } from '../../../types/spotlight/merchandising/bundles';
import type { SpotlightCampaignProductLink } from '../../../types/spotlight/merchandising/productLink';

interface BundleBuilderPanelProps {
  bundles: SpotlightCampaignBundle[];
  productLinks: SpotlightCampaignProductLink[];
  productTitles: Record<string, string>;
  onChange: (bundles: SpotlightCampaignBundle[]) => void;
}

export function BundleBuilderPanel({
  bundles,
  productLinks,
  productTitles,
  onChange,
}: BundleBuilderPanelProps) {
  const [name, setName] = useState('');

  const addBundle = () => {
    const hero = productLinks.find((l) => l.role === 'hero');
    if (!hero || !name.trim()) return;
    const now = new Date().toISOString();
    const bundle: SpotlightCampaignBundle = {
      bundleId: `bundle-${Date.now()}`,
      name: name.trim(),
      heroProductId: hero.productId,
      accessoryProductIds: productLinks.filter((l) => l.role === 'accessory').map((l) => l.productId),
      recommendedProductIds: productLinks.filter((l) => l.role === 'recommended').map((l) => l.productId),
      upsellProductIds: productLinks.filter((l) => l.role === 'upsell').map((l) => l.productId),
      displayOrder: bundles.length,
      createdAt: now,
      updatedAt: now,
    };
    onChange([...bundles, bundle]);
    setName('');
  };

  return (
    <div className="space-y-3 border border-[#e8edf2] rounded p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Bundle Builder</p>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bundle name"
          className="flex-grow px-2 py-1 border rounded text-sm"
        />
        <button type="button" onClick={addBundle} className="px-3 py-1 bg-navy text-white text-xs rounded flex items-center gap-1">
          <Plus size={12} /> Add
        </button>
      </div>
      <ul className="space-y-2">
        {bundles.map((b) => (
          <li key={b.bundleId} className="text-xs p-2 bg-gray-50 rounded flex justify-between">
            <div>
              <p className="font-bold">{b.name}</p>
              <p className="text-gray-500">Hero: {productTitles[b.heroProductId] ?? b.heroProductId}</p>
              <p className="text-[10px] text-gray-400">
                +{b.accessoryProductIds.length} accessories · {b.recommendedProductIds.length} recommended
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange(bundles.filter((x) => x.bundleId !== b.bundleId))}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
