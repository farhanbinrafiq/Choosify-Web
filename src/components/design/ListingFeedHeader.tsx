import React from 'react';
import { cn } from '../../lib/utils';

export type ListingFeedHeaderProps = {
  eyebrow: string;
  title: string;
  /** Total matching items shown in the title, e.g. All Brands (14) */
  count: number;
  /** First visible index (1-based). Defaults to 1 when total > 0. */
  showingFrom?: number;
  /** Last visible index (inclusive). Defaults to `count`. */
  showingTo?: number;
  /** Noun for the range line, e.g. "brands", "products". */
  itemLabel: string;
  /** Optional trailing controls (e.g. Reset). Filters live in pills / floating FAB. */
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Listing feed heading: eyebrow + title(count) + Showing X–Y of Z.
 * Filter access is via ListingFilterPills / floating filter FAB — not duplicated here.
 */
export function ListingFeedHeader({
  eyebrow,
  title,
  count,
  showingFrom,
  showingTo,
  itemLabel,
  actions,
  className,
}: ListingFeedHeaderProps) {
  const from = count <= 0 ? 0 : showingFrom ?? 1;
  const to = count <= 0 ? 0 : showingTo ?? count;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#eef2f6] font-sans',
        className,
      )}
    >
      <div className="min-w-0 text-left">
        <h3 className="text-[10px] font-bold text-[#8a9bb0] uppercase tracking-[0.2em] leading-none">
          {eyebrow}
        </h3>
        <h2 className="text-xl font-black text-[#1A1D4E] tracking-tight mt-2 leading-none">
          {title}
          <span className="text-[#8a9bb0] font-semibold"> ({count})</span>
        </h2>
        <p className="text-[12.5px] text-[#9AA0AC] font-semibold mt-2.5">
          {count <= 0
            ? `Showing 0 of 0 ${itemLabel}`
            : `Showing ${from}–${to} of ${count} ${itemLabel}`}
        </p>
      </div>

      {actions ? (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
