import React from 'react';
import { cn } from '../../lib/utils';

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
  items: DcStickyFilterItem[];
  /** Overlap hero slightly like dc.html products list */
  overlapHero?: boolean;
  className?: string;
  maxWidthClass?: string;
}

/** Choosify.dc.html listing sticky bar — white 88px icon + name + sub row */
export function DcListingStickyFilters({
  items,
  overlapHero = false,
  className,
  maxWidthClass = 'max-w-[1280px]',
}: DcListingStickyFiltersProps) {
  if (!items.length) return null;

  return (
    <div
      className={cn(
        'choosify-sticky-section-nav sticky z-40 w-full px-5 sm:px-8 lg:px-10',
        overlapHero ? '-mt-[30px] mb-5' : 'mb-5 mt-0',
        className,
      )}
    >
      <div
        className={cn(
          maxWidthClass,
          'mx-auto flex items-center bg-white border border-[#E8EDF2] rounded-[14px] min-h-[88px] px-[18px] sm:px-[26px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-x-auto',
        )}
      >
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
                    active ? 'font-extrabold text-[#FF5B00]' : 'font-extrabold text-[#1A1A2E]',
                  )}
                  style={{ background: item.bg || (active ? '#FFF3EA' : '#F4F7F9') }}
                >
                  {item.icon}
                </div>
                <div className="whitespace-nowrap">
                  <div
                    className={cn(
                      'text-[12.5px] font-bold leading-tight',
                      active ? 'text-[#FF5B00]' : 'text-[#1A1A2E]',
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
      </div>
    </div>
  );
}
