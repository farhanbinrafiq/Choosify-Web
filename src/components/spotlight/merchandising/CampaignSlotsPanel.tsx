import React from 'react';
import type { SpotlightMerchandisingSlot } from '../../../types/spotlight/merchandising/slots';
import type { SpotlightCampaignProductLink } from '../../../types/spotlight/merchandising/productLink';
import { getProductsBySlot } from '../../../utils/spotlightMerchandisingOrdering';

interface CampaignSlotsPanelProps {
  slots: SpotlightMerchandisingSlot[];
  productLinks: SpotlightCampaignProductLink[];
  productTitles: Record<string, string>;
}

export function CampaignSlotsPanel({ slots, productLinks, productTitles }: CampaignSlotsPanelProps) {
  const enabled = [...slots].filter((s) => s.enabled).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-3 border border-[#e8edf2] rounded p-3 bg-gray-50/50">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Campaign Slots</p>
      {enabled.map((slot) => {
        const items = getProductsBySlot(productLinks, slot.slotId);
        return (
          <div key={slot.slotId} className="border-l-2 border-[#E8500A]/40 pl-3">
            <p className="text-xs font-bold text-navy">{slot.label}</p>
            <p className="text-[10px] text-gray-400 mb-1">
              {items.length}{slot.maxItems ? ` / ${slot.maxItems}` : ''} products
            </p>
            {items.length === 0 ? (
              <p className="text-[10px] text-gray-400 italic">Empty slot</p>
            ) : (
              <ul className="text-[10px] text-gray-600 space-y-0.5">
                {items.slice(0, 5).map((l) => (
                  <li key={l.productId}>• {productTitles[l.productId] ?? l.productId} ({l.role})</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
