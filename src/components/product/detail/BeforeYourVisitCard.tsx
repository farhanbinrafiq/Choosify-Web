import React from 'react';
import { cn } from '../../../lib/utils';
import { BEFORE_VISIT_FIELD_DEFS } from '../../../utils/listingRelatedInfo';
import type { BeforeVisitFieldKey, BeforeYourVisitData } from '../../../types/listingRelatedInfo';

export interface BeforeYourVisitCardProps {
  data?: BeforeYourVisitData;
  /** Subset of fields for this service category (e.g. doctors include insurance). */
  fields: BeforeVisitFieldKey[];
  className?: string;
}

/** Sidebar "Before Your Visit" — CMS text fields per service category. */
export function BeforeYourVisitCard({ data, fields, className }: BeforeYourVisitCardProps) {
  const fieldDefs = BEFORE_VISIT_FIELD_DEFS.filter((def) => fields.includes(def.key));

  return (
    <div className={cn('bg-[#F4F7F9] rounded-[10px] p-4 text-left', className)}>
      <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">BEFORE YOUR VISIT</div>
      <div className="space-y-3">
        {fieldDefs.map((field) => {
          const value = String(data?.[field.key] || '').trim();
          return (
            <div key={field.key}>
              <div className="text-[10.5px] font-bold text-[#EB4501] uppercase tracking-wide mb-1">
                {field.label}
              </div>
              <p className="text-[11.5px] text-[#4B5563] leading-relaxed m-0">
                {value || <span className="text-[#9AA0AC] italic">Not listed yet</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
