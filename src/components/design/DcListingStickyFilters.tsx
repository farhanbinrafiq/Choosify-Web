import React from 'react';
import { cn } from '../../lib/utils';
import { LISTING_PAGE_MAX_WIDTH } from '../../lib/design/dcListingTokens';

export interface DcStickyFilterItem {
  id: string;
  icon: string;
  name: string;
  sub: string;
  bg?: string;
  active?: boolean;
  onClick?: () => void;
}

interface DcListingStickyFiltersProps {
  /** Icon + name + sub chips (Deals / Products / Brands / …). Omit when using `children`. */
  items?: DcStickyFilterItem[];
  /**
   * Custom sticky content (e.g. Discover underline format tabs).
   * Uses the same Deals white-card shell — do not reimplement the outer chrome.
   */
  children?: React.ReactNode;
  /** Overlap hero slightly like dc.html products list */
  overlapHero?: boolean;
  className?: string;
  /**
   * Must match the sibling `DcListingHero` `maxWidthClass` so the white overlapping
   * card aligns flush with the navy hero silhouette (same outer gutters + max-width).
   * Defaults to the Deals master listing width.
   */
  maxWidthClass?: string;
  /** Extra classes on the white card (e.g. items-end for underline tabs) */
  cardClassName?: string;
}

/**
 * Choosify listing sticky bar — single shared shell from Deals:
 * outer gutters + max-width white 88px card overlapping the navy hero.
 */
export function DcListingStickyFilters({
  items = [],
  children,
  overlapHero = false,
  className,
  maxWidthClass = LISTING_PAGE_MAX_WIDTH,
  cardClassName,
}: DcListingStickyFiltersProps) {
  if (!children && !items.length) return null;

  return (
    <div
      className={cn(
        'choosify-sticky-section-nav sticky z-40 w-full px-5 sm:px-8 lg:px-10',
        overlapHero ? '-mt-[16px] sm:-mt-[24px] md:-mt-[30px] mb-5' : 'mb-5 mt-0',
        className,
      )}
    >
      <div
        className={cn(
          maxWidthClass,
          'mx-auto flex bg-white border border-[#E8EDF2] rounded-[14px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-x-auto',
          children
            ? 'items-end h-[88px] px-[18px] sm:px-[26px]'
            : 'items-center min-h-[88px] px-[18px] sm:px-[26px]',
          cardClassName,
        )}
      >
        {children ?? (
          <div className="flex items-center gap-4 sm:gap-[22px] flex-nowrap py-3">
            {items.map((item) => {
              const active = Boolean(item.active);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  className="flex items-center gap-2.5 shrink-0 cursor-pointer bg-transparent border-0 p-0 text-left"
                >
                  <div
                    className={cn(
                      'w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm shrink-0',
                      active ? 'font-extrabold text-[#EB4501]' : 'font-extrabold text-[#1A1A2E]',
                    )}
                    style={{ background: item.bg || (active ? '#FFF3EA' : '#F4F7F9') }}
                  >
                    {item.icon}
                  </div>
                  <div className="whitespace-nowrap">
                    <div
                      className={cn(
                        'text-[12.5px] font-bold leading-tight',
                        active ? 'text-[#EB4501]' : 'text-[#1A1A2E]',
                      )}
                    >
                      {item.name}
                    </div>
                    <div className="text-[10.5px] text-[#9AA0AC] leading-tight">{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
