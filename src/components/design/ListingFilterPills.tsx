import React from 'react';
import { cn } from '../../lib/utils';
import { openEmiPanel } from '../../lib/emi';
import { useOpenPageFilters } from '../FilterEngine';
import { MobileDockStickySentinel } from './MobileVerticalNavDock';

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
}

const pillBase =
  'px-3.5 py-2 rounded-[18px] text-[11.5px] font-bold cursor-pointer border transition-all min-h-[36px]';

/** Same dark surface as the site footer (.footer-brand-gradient). */
const pillSurface =
  'footer-brand-gradient text-white border-white/15 hover:border-white/35 hover:brightness-110';

const pillActive =
  'footer-brand-gradient text-white border-[#EB4501] ring-1 ring-[#EB4501]/45 brightness-110';

/**
 * Discover-style under-header filter pills — desktop/tablet only.
 * On mobile the bar is hidden; browse filters live in the left vertical dock.
 * A sentinel stays mounted so the mobile dock still knows when to appear.
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
}: ListingFilterPillsProps) {
  const { canOpenFilters, toggleFilters } = useOpenPageFilters();

  const handleAi = () => {
    openEmiPanel(aiDiscoverPrompt);
  };

  return (
    <>
      {/* Always mounted — drives mobile left-dock show/hide even when pills are hidden */}
      {sticky ? <MobileDockStickySentinel /> : null}

      <div
        data-mobile-dock-trigger
        className={cn(
          'choosify-listing-filter-pills choosify-sticky-section-nav w-full hidden sm:block',
          sticky && 'sticky z-40 bg-[#F4F7F9]/95 backdrop-blur-sm',
          className,
        )}
      >
        <div className="flex justify-between items-center py-4 pb-6 flex-wrap gap-2.5">
          <div className="flex gap-2.5 flex-wrap">
            {showFiltersPill && canOpenFilters && (
              <button
                type="button"
                onClick={toggleFilters}
                className={cn(pillBase, pillSurface)}
              >
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
                    isLive
                      ? cn(
                          'bg-[#FF000D] text-white border-[#FF000D] hover:brightness-110',
                          active && 'ring-2 ring-offset-1 ring-[#FF000D]/40',
                        )
                      : active
                        ? pillActive
                        : pillSurface,
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
                  'rounded-[20px] bg-white text-[#EB4501] border-[#EB4501]/40 hover:bg-[#EB4501]/5 hover:border-[#EB4501]',
                )}
              >
                Clear Filters
              </button>
            ) : null}
            {showAiDiscover ? (
              <button
                type="button"
                onClick={handleAi}
                className="choosify-emi-gradient text-white text-[11.5px] font-bold px-4 py-2 rounded-[20px] cursor-pointer border-0 min-h-[36px] hover:brightness-110 transition-all"
              >
                {aiDiscoverLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
