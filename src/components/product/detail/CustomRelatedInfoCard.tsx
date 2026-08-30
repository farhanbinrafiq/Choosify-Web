import React from 'react';
import { cn } from '../../../lib/utils';
import type { CustomRelatedInfoData } from '../../../types/listingRelatedInfo';

export interface CustomRelatedInfoCardProps {
  data?: CustomRelatedInfoData;
  className?: string;
}

/**
 * Sidebar "Related Information" — seller-defined section for listings that don't
 * fit the three presets (Where to Buy / What's Nearby / Before Your Visit).
 * A title plus one or more heading + bullet columns.
 */
export function CustomRelatedInfoCard({ data, className }: CustomRelatedInfoCardProps) {
  const title = String(data?.title || '').trim();
  const blocks = (data?.blocks || []).filter(
    (b) => String(b?.heading || '').trim() || (b?.items || []).some((i) => String(i).trim()),
  );
  if (!title && !blocks.length) return null;

  return (
    <div className={cn('bg-[#F4F7F9] rounded-[10px] p-4 text-left', className)}>
      <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3 uppercase">
        {title || 'Related Information'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        {blocks.map((b) => (
          <div key={b.id}>
            <div className="text-[10.5px] font-bold text-[#EB4501] uppercase tracking-wide mb-1">
              {String(b.heading || 'Details').trim()}
            </div>
            <ul className="m-0 pl-4 list-disc text-[11.5px] text-[#4B5563] leading-relaxed space-y-0.5">
              {(b.items || [])
                .map((i) => String(i).trim())
                .filter(Boolean)
                .map((it) => (
                  <li key={it}>{it}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
