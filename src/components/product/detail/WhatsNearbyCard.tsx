import React from 'react';
import { Hospital, MapPin, Plane, ShoppingBag, Ticket, Utensils } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  NEARBY_CATEGORY_DEFS,
  nearbyEntriesForCategory,
} from '../../../utils/listingRelatedInfo';
import type { NearbyCategoryKey, WhatsNearbyData } from '../../../types/listingRelatedInfo';

export interface WhatsNearbyCardProps {
  data?: WhatsNearbyData;
  className?: string;
}

const NEARBY_CATEGORY_ICONS: Record<NearbyCategoryKey, LucideIcon> = {
  restaurant_cafe: Utensils,
  entertainment_attraction: Ticket,
  hospital_police: Hospital,
  transport_airport: Plane,
  shopping_atm: ShoppingBag,
};

/** Sidebar "What's Nearby" — five fixed categories, CMS-driven entries per bucket. */
export function WhatsNearbyCard({ data, className }: WhatsNearbyCardProps) {
  return (
    <div className={cn('bg-[#F4F7F9] rounded-[10px] p-4 text-left', className)}>
      <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">WHAT&apos;S NEARBY</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        {NEARBY_CATEGORY_DEFS.map((category) => {
          const entries = nearbyEntriesForCategory(data, category.key);
          const CategoryIcon = NEARBY_CATEGORY_ICONS[category.key];
          return (
            <div key={category.key}>
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#EB4501] uppercase tracking-wide mb-1.5">
                <CategoryIcon size={13} className="shrink-0" aria-hidden />
                {category.label}
              </div>
              {entries.length > 0 ? (
                <ul className="space-y-1.5">
                  {entries.map((entry, index) => (
                    <li
                      key={`${category.key}-${entry.name}-${index}`}
                      className="flex items-start gap-2 text-[11.5px] text-[#4B5563]"
                    >
                      <MapPin size={12} className="text-[#9AA0AC] shrink-0 mt-0.5" aria-hidden />
                      <span className="min-w-0">
                        <span className="font-semibold text-[#1A1A2E]">{entry.name}</span>
                        {entry.distance ? (
                          <span className="text-[#9AA0AC]"> · {entry.distance}</span>
                        ) : null}
                        {entry.note ? (
                          <span className="block text-[10.5px] text-[#9AA0AC] mt-0.5">{entry.note}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-[#9AA0AC] italic m-0">Not listed yet</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
