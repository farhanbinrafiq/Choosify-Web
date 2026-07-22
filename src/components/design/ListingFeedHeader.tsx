import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useOpenPageFilters } from '../FilterEngine';

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
  /** Optional controls beside the filter button (e.g. Reset). */
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Listing feed heading: eyebrow + title(count) + Showing X–Y of Z,
 * with a top-right filter control that opens the same floating filter popup as the FAB.
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
  const { canOpenFilters, toggleFilters, isFiltersOpen, activeFilterCount } = useOpenPageFilters();

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

      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
        {actions}
        {canOpenFilters ? (
          <button
            type="button"
            onClick={toggleFilters}
            className={cn(
              'relative w-11 h-11 rounded-full bg-white border border-[#e8edf2] shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none',
              isFiltersOpen && 'ring-2 ring-[#EB4501]/30',
            )}
            aria-label="Open filters"
            title="Filters"
          >
            <SlidersHorizontal
              size={18}
              strokeWidth={2}
              className={cn(
                'transition-colors shrink-0',
                isFiltersOpen ? 'text-[#EB4501]' : 'text-[#8a9bb0]',
              )}
            />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-lg bg-[#EB4501] text-white text-[8px] font-bold flex items-center justify-center leading-none">
                {activeFilterCount > 9 ? '9+' : activeFilterCount}
              </span>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
