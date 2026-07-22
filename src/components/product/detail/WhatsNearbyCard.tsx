import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  NEARBY_CATEGORY_DEFS,
  nearbyEntriesForCategory,
} from '../../../utils/listingRelatedInfo';
import type { WhatsNearbyData } from '../../../types/listingRelatedInfo';

export interface WhatsNearbyCardProps {
  data?: WhatsNearbyData;
  className?: string;
}

/** Sidebar "What's Nearby" — five fixed categories, CMS-driven entries per bucket. */
export function WhatsNearbyCard({ data, className }: WhatsNearbyCardProps) {
  return (
    <div className={cn('bg-[#F4F7F9] rounded-[10px] p-4 text-left', className)}>
      <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">WHAT&apos;S NEARBY</div>
      <div className="space-y-3">
        {NEARBY_CATEGORY_DEFS.map((category) => {
          const entries = nearbyEntriesForCategory(data, category.key);
          return (
            <div key={category.key}>
              <div className="text-[10.5px] font-bold text-[#EB4501] uppercase tracking-wide mb-1.5">
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
