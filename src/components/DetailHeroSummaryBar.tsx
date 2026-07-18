import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export type DetailHeroMetaItem = {
  id: string;
  icon: LucideIcon;
  label: React.ReactNode;
  /** Allow this item to span wider columns when text is long (e.g. location). */
  wide?: boolean;
};

type DetailHeroSummaryBarProps = {
  items: DetailHeroMetaItem[];
  actions?: React.ReactNode;
  /** Where action buttons sit — campaign pages use centered row below meta. */
  actionsPlacement?: 'end' | 'bottom-center';
  className?: string;
};

export function DetailHeroSummaryBar({
  items,
  actions,
  actionsPlacement = 'end',
  className,
}: DetailHeroSummaryBarProps) {
  const actionsCentered = actionsPlacement === 'bottom-center';

  return (
    <div
      className={cn(
        'w-full bg-white text-[#1A1A2E] border-y border-[#E8EDF2]',
        className,
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div
          className={cn(
            'flex flex-col gap-4',
            !actionsCentered && 'lg:flex-row lg:items-start lg:justify-between lg:gap-6',
          )}
        >
          <ul className="choosify-detail-hero-summary__meta flex-1 min-w-0 list-none m-0 p-0">
            {items.map(({ id, icon: Icon, label, wide }) => (
              <li
                key={id}
                className={cn(
                  'flex items-start gap-2 min-w-0',
                  wide && 'choosify-detail-hero-summary__item--wide',
                )}
              >
                <Icon
                  size={14}
                  strokeWidth={2.5}
                  className="text-[#FF5B00] shrink-0 mt-[3px]"
                  aria-hidden
                />
                <span className="text-[12px] sm:text-[13px] font-semibold tracking-tight leading-snug text-[#1A1A2E]/90 break-words whitespace-normal">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {actions ? (
            <div
              className={cn(
                'flex flex-wrap items-center gap-2 shrink-0',
                actionsCentered
                  ? 'justify-center w-full pt-1'
                  : 'justify-center lg:justify-end',
              )}
            >
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Shared pill buttons for detail hero summary bars. */
export const detailHeroSummaryActionClass =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer';

export const detailHeroSummaryActionSecondaryClass = cn(
  detailHeroSummaryActionClass,
  'bg-[#F4F7F9] hover:bg-[#E8EDF2] border border-[#E8EDF2] text-[#1A1A2E]',
);

export const detailHeroSummaryActionPrimaryClass = cn(
  detailHeroSummaryActionClass,
  'bg-[#FF5B00] hover:brightness-110 text-white border border-[#FF5B00]/30',
);
