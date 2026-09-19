import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { openEmiPanel } from '../../lib/emi';
import { useOpenPageFilters } from '../FilterEngine';

export interface ListingFilterPillItem {
  id: string;
  label: string;
  active?: boolean;
  onClick: () => void;
  /** Special LIVE-style pill */
  variant?: 'default' | 'live';
  /** Never show active styling (e.g. Filters opener) */
  neverActive?: boolean;
}

export interface ListingFilterPillsProps {
  pills: ListingFilterPillItem[];
  /** Show Clear Filters when true */
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  /** Opens Emi AI chat (default). Pass false to hide. */
  showAiDiscover?: boolean;
  aiDiscoverLabel?: string;
  aiDiscoverPrompt?: string;
  /** Prepend the Filters opener pill (opens floating drawer) */
  showFiltersPill?: boolean;
  className?: string;
  /** Sticky under-header chrome (triggers mobile dock show/hide) */
  sticky?: boolean;
  /** Optional control (e.g. SortDropdown) rendered immediately to the left of the AI Discover button, in the same right-aligned toolbar group. */
  sortSlot?: React.ReactNode;
}

const pillBase =
  'px-3.5 py-2 rounded-full text-[11.5px] font-bold cursor-pointer border transition-all min-h-[36px]';

/** Idle sticky filter pills */
const pillSurface =
  'bg-white text-[#1A1A2E] border-[#E5E7EB] hover:border-[#FF5B00]/40';

/** Selected — same dark surface as the site footer */
const pillActive =
  'footer-brand-gradient text-white border-transparent hover:brightness-110';

/**
 * Discover-style under-header filter pills — desktop/tablet only. On mobile
 * this row is hidden entirely; the canonical Filters FAB (bottom-left) is
 * the single mobile filter entry point instead (its drawer includes the
 * same browse/quick filters). The old left vertical floating dock this used
 * to defer to on mobile has been removed — not replaced with anything, per
 * product decision to keep mobile to one filter action, not a pill row.
 */
export function ListingFilterPills({
  pills,
  hasActiveFilters = false,
  onClearFilters,
  showAiDiscover = true,
  aiDiscoverLabel = '✦ AI Discover',
  aiDiscoverPrompt,
  showFiltersPill = true,
  className,
  sticky = true,
  sortSlot,
}: ListingFilterPillsProps) {
  const { canOpenFilters, toggleFilters } = useOpenPageFilters();

  const handleAi = () => {
    openEmiPanel(aiDiscoverPrompt);
  };

  return (
      <div
        className={cn(
          'choosify-listing-filter-pills choosify-sticky-section-nav w-full hidden sm:block',
          sticky && 'sticky z-40 bg-[#F4F7F9]/95 backdrop-blur-sm',
          className,
        )}
      >
        <div className="flex items-center justify-between flex-wrap gap-2.5 py-4 pb-6">
          <div className="flex gap-2.5 flex-wrap">
            {showFiltersPill && canOpenFilters && (
              <button
                type="button"
                onClick={toggleFilters}
                className={cn(
                  pillBase,
                  'inline-flex items-center gap-1.5 bg-white text-[#1A1A2E] border-[#E5E7EB] hover:border-[#FF5B00]/40',
                )}
              >
                <SlidersHorizontal size={14} strokeWidth={2.25} className="text-[#FF5B00] shrink-0" />
                Filters
              </button>
            )}
            {pills.map((pill) => {
              const isLive = pill.variant === 'live';
              const active = pill.neverActive ? false : Boolean(pill.active);
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={pill.onClick}
                  aria-pressed={active}
                  className={cn(
                    pillBase,
                    active ? pillActive : pillSurface,
                    isLive && !active && 'border-[#FF000D]/35',
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {hasActiveFilters && onClearFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(
                  pillBase,
                  'rounded-full bg-white text-[#FF5B00] border-[#FF5B00]/40 hover:bg-[#FF5B00]/5 hover:border-[#FF5B00]',
                )}
              >
                Clear Filters
              </button>
            ) : null}
            {sortSlot}
            {showAiDiscover ? (
              <button
                type="button"
                onClick={handleAi}
                className="choosify-emi-gradient text-white text-[11.5px] font-bold px-4 py-2 rounded-full cursor-pointer border-0 min-h-[36px] hover:brightness-110 transition-all"
              >
                {aiDiscoverLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
  );
}
