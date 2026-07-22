import React from 'react';
import { cn } from '../../../lib/utils';
import type { ContentDetailSectionConfig } from '../../../types/spotlight/experience/contentDetailSections';
import type { ContentDetailSectionContext } from '../contentDetailSectionContext';

const DEFAULT_CHIPS = [
  {
    text: 'Industry-Leading Reliability',
    icon: '✓',
    color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
  },
  {
    text: 'Best-in-Class Hardware Specification',
    icon: '✦',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
  },
  {
    text: 'Double-Inspected Sourcing Trust',
    icon: '🛡️',
    color: 'bg-[#EB4501]/10 border-[#EB4501]/20 text-[#EB4501]',
  },
  {
    text: 'Zero Interest Monthly EMI Approved',
    icon: '৳',
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-600',
  },
  {
    text: 'Immediate Metro Shipping Certified',
    icon: '🗲',
    color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 font-bold',
  },
  {
    text: 'Longer Extended Manufacturer Support',
    icon: '⏳',
    color: 'bg-teal-500/10 border-teal-500/20 text-teal-600',
  },
];

export function ContentDetailWhyWonSection({
  section,
}: {
  section: ContentDetailSectionConfig;
  ctx: ContentDetailSectionContext;
}) {
  const custom = section.data?.whyWonChips;
  const chips = custom?.length
    ? custom.map((text, i) => ({
        text,
        icon: DEFAULT_CHIPS[i % DEFAULT_CHIPS.length].icon,
        color: DEFAULT_CHIPS[i % DEFAULT_CHIPS.length].color,
      }))
    : DEFAULT_CHIPS;

  return (
    <div id="why-won" className="scroll-mt-36">
      <div className="mb-4 text-left">
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-0.5">Why this won</h2>
        <p className="text-[13px] font-bold text-[#9AA0AC]">
          Crucial hardware & testing decision signals
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip, idx) => (
          <span
            key={`${chip.text}-${idx}`}
            className={cn(
              'px-4 py-2 text-[11px] font-bold border rounded-xl flex items-center gap-1.5',
              chip.color,
            )}
          >
            <span>{chip.icon}</span> {chip.text}
          </span>
        ))}
      </div>
    </div>
  );
}
