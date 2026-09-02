import React from 'react';
import { cn } from '../../lib/utils';

export type SponsoredCardChromeSize = 'sm' | 'md';

type SponsoredCardChromeProps = {
  /** Brand / sponsor mark shown in the top-left badge */
  logoUrl?: string;
  /** Used for initials fallback and accessible label */
  brandName?: string;
  /** `sm` for compact tiles / thumbs; `md` for standard cards & banners */
  size?: SponsoredCardChromeSize;
  /**
   * Top-right pill text. Defaults to PROMOTED.
   * Use e.g. "EDITOR'S PICK" for editorial / curated surfaces.
   */
  badgeLabel?: string;
  /**
   * `promoted` = bold royal-blue paid-placement pill (default).
   * `editorial` = toned-down white/orange pill for curation, not ads.
   */
  tone?: 'promoted' | 'editorial';
  className?: string;
};

/**
 * Shared sponsored-card branding chrome:
 * - circular logo badge (top-left, overlaps media)
 * - status pill (top-right) — PROMOTED by default, overridable for editorial
 *
 * Parent must be `position: relative`. Does not affect card size.
 */
export function SponsoredCardChrome({
  logoUrl,
  brandName = 'Sponsor',
  size = 'md',
  badgeLabel = 'PROMOTED',
  tone = 'promoted',
  className,
}: SponsoredCardChromeProps) {
  const initial = brandName.trim().charAt(0).toUpperCase() || 'C';
  const avatar =
    size === 'sm'
      ? 'h-7 w-7 text-[9px]'
      : 'h-9 w-9 text-[11px] sm:h-10 sm:w-10';
  const pillPos =
    size === 'sm'
      ? 'top-1.5 right-1.5 text-[8px] px-1.5 py-0.5'
      : 'top-2.5 right-2.5 text-[9px] px-2.5 py-1';
  const logoPos = size === 'sm' ? 'top-1.5 left-1.5' : 'top-2.5 left-2.5';
  const pillTone =
    tone === 'editorial'
      ? 'bg-white/95 text-[#FF5B00] border border-[#FF5B00]/25 shadow-sm'
      : 'bg-[#2323FF] text-white shadow-sm';

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-[3]', className)}
      aria-hidden={false}
    >
      <div
        className={cn(
          'absolute rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)] border border-black/[0.06] overflow-hidden flex items-center justify-center',
          logoPos,
          avatar,
        )}
        role="img"
        aria-label={`${brandName} logo`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        ) : (
          <span className="font-black text-[#1a1a2e] leading-none select-none">{initial}</span>
        )}
      </div>

      <span
        className={cn(
          'absolute rounded-full font-extrabold uppercase tracking-wider leading-none',
          pillPos,
          pillTone,
        )}
        aria-label={badgeLabel}
      >
        {badgeLabel}
      </span>
    </div>
  );
}
