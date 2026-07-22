import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DcStickyFilterItem } from './DcListingStickyFilters';

export type { DcStickyFilterItem };

export interface ListingBrowseControlsProps {
  searchPlaceholder?: string;
  /** Controlled search value (preferred for floating drawer sync). */
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  quickChips?: string[];
  onChipClick?: (chip: string) => void;
  items?: DcStickyFilterItem[];
  /** Optional custom row (e.g. Discover format tabs) instead of `items`. */
  children?: React.ReactNode;
  className?: string;
  /** Hide the search field when the host drawer already renders Page Search. */
  showSearch?: boolean;
}

/**
 * Reusable browse controls for the floating filter popup:
 * search, keyword chips, and icon/nav presets formerly in DcListingStickyFilters.
 */
export function ListingBrowseControls({
  searchPlaceholder = 'Search...',
  searchQuery,
  onSearchQueryChange,
  onSearch,
  quickChips = [],
  onChipClick,
  items = [],
  children,
  className,
  showSearch = true,
}: ListingBrowseControlsProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery ?? '');

  useEffect(() => {
    if (searchQuery !== undefined) setLocalQuery(searchQuery);
  }, [searchQuery]);

  const value = searchQuery !== undefined ? searchQuery : localQuery;
  const setValue = (next: string) => {
    if (searchQuery === undefined) setLocalQuery(next);
    onSearchQueryChange?.(next);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch?.(value.trim());
  };

  const hasNav = Boolean(children) || items.length > 0;
  const hasChips = quickChips.length > 0;
  if (!showSearch && !hasChips && !hasNav) return null;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showSearch && (
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">
            Search
          </div>
          <form
            onSubmit={submit}
            className="flex items-center bg-white rounded-[5px] border border-[#e8edf2] overflow-hidden focus-within:border-[#EB4501]/40 transition-all"
          >
            <div className="pl-3.5 text-[#EB4501] shrink-0">
              <Search className="w-4 h-4" aria-hidden />
            </div>
            <input
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-11 bg-transparent outline-none pl-2.5 pr-3 text-[#1A1A2E] text-xs font-semibold placeholder:text-[#9AA0AC] border-none"
            />
            <button
              type="submit"
              className="shrink-0 h-11 px-3.5 bg-[#EB4501] text-white text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer hover:brightness-110"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {hasChips && (
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">
            Quick search
          </div>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setValue(chip);
                  onChipClick?.(chip);
                  onSearch?.(chip);
                }}
                className="bg-[#FFF3EA] border border-[#FFD8B8] text-[#CF4400] text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#FFE8D6] transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasNav && (
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">
            Browse
          </div>
          {children ?? (
            <div className="flex flex-col gap-1.5">
              {items.map((item) => {
                const active = Boolean(item.active);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      'flex items-center gap-3 w-full text-left rounded-xl border px-3 py-2.5 transition-colors cursor-pointer',
                      active
                        ? 'bg-[#FFF3EA] border-[#EB4501]/35'
                        : 'bg-white border-[#E8EDF2] hover:border-[#EB4501]/25',
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 font-extrabold',
                        active ? 'text-[#EB4501]' : 'text-[#1A1A2E]',
                      )}
                      style={{ background: item.bg || (active ? '#FFF3EA' : '#F4F7F9') }}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
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
  );
}
