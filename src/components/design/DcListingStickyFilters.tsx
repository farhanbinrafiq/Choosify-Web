import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DC_LISTING_HERO_BG, LISTING_PAGE_MAX_WIDTH } from '../../lib/design/dcListingTokens';

export interface DcStickyFilterItem {
  id: string;
  icon: string;
  name: string;
  sub: string;
  bg?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface DcListingStickySearchProps {
  searchPlaceholder?: string;
  quickChips?: string[];
  onSearch?: (query: string) => void;
  onChipClick?: (chip: string) => void;
}

interface DcListingStickyFiltersProps extends DcListingStickySearchProps {
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
   * Must match the sibling `DcListingHero` `maxWidthClass` so the sticky
   * card aligns flush with the navy hero silhouette (same outer gutters + max-width).
   * Defaults to the Deals master listing width.
   */
  maxWidthClass?: string;
  /** Extra classes on the white card (e.g. items-end for underline tabs) */
  cardClassName?: string;
  /** When false, omit the dark search/chips top row (legacy filter-only bar). Default true when search props given. */
  showSearch?: boolean;
}

function StickySearchRow({
  searchPlaceholder = 'Search...',
  quickChips = [],
  onSearch,
  onChipClick,
}: DcListingStickySearchProps) {
  const [query, setQuery] = useState('');

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <div
      className="choosify-dark-surface px-4 sm:px-[26px] py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3"
      style={{ background: DC_LISTING_HERO_BG }}
    >
      <form
        onSubmit={submit}
        className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-[400px] sm:flex-1 bg-white/10 backdrop-blur-[14px] border border-white/22 rounded-full p-1 flex items-center gap-1 min-w-0"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="flex-1 min-w-0 h-8 border-none bg-transparent rounded-full px-3 sm:px-4 text-xs text-white placeholder:text-white/50 outline-none"
        />
        <button
          type="submit"
          className="bg-white/14 border border-white/25 text-white h-8 px-3 sm:px-4 rounded-full text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 shrink-0 hover:bg-white/20 transition-colors whitespace-nowrap"
        >
          <Search size={12} aria-hidden />
          Search
        </button>
      </form>

      {quickChips.length > 0 && (
        <div className="flex justify-start sm:justify-end gap-2.5 flex-wrap sm:ml-auto">
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQuery(chip);
                onChipClick?.(chip);
                onSearch?.(chip);
              }}
              className="bg-white/8 border border-white/16 text-white/85 text-[11px] font-semibold px-3.5 py-1.5 rounded-full hover:bg-white/14 transition-colors"
            >
              🔍 {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Choosify listing sticky chrome — merged search/chips + icon filter nav
 * in one sticky card (top:104px under navbar).
 */
export function DcListingStickyFilters({
  items = [],
  children,
  overlapHero = false,
  className,
  maxWidthClass = LISTING_PAGE_MAX_WIDTH,
  cardClassName,
  searchPlaceholder,
  quickChips,
  onSearch,
  onChipClick,
  showSearch,
}: DcListingStickyFiltersProps) {
  if (!children && !items.length && !showSearch && !onSearch && !quickChips?.length) {
    return null;
  }

  const hasSearch =
    showSearch ?? Boolean(onSearch || (quickChips && quickChips.length > 0) || searchPlaceholder);

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
          'mx-auto bg-white border border-[#E8EDF2] rounded-[14px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden',
          cardClassName,
        )}
      >
        {hasSearch && (
          <StickySearchRow
            searchPlaceholder={searchPlaceholder}
            quickChips={quickChips}
            onSearch={onSearch}
            onChipClick={onChipClick}
          />
        )}

        {hasSearch && (children || items.length > 0) && (
          <div className="h-px bg-[#E8EDF2]" aria-hidden />
        )}

        {(children || items.length > 0) && (
          <div
            className={cn(
              'flex overflow-x-auto',
              children
                ? 'items-end h-[88px] px-[18px] sm:px-[26px]'
                : 'items-center h-[88px] px-[18px] sm:px-[26px]',
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
        )}
      </div>
    </div>
  );
}
