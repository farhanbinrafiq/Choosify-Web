import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import type { ResolvedPlacement } from '../utils/resolvePlacementContent';

export type SponsoredPlacementVariant = 'portrait' | 'landscape' | 'infeed';

type SponsoredPlacementCardProps = {
  placement: ResolvedPlacement;
  variant?: SponsoredPlacementVariant;
  className?: string;
  description?: string;
};

const aspectByVariant: Record<SponsoredPlacementVariant, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-video',
  infeed: 'aspect-[4/3]',
};

function PlacementCta({
  placement,
  className,
}: {
  placement: ResolvedPlacement;
  className?: string;
}) {
  const classes = cn(
    'w-full py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-0',
    className,
  );

  if (placement.isExternal) {
    return (
      <a
        href={placement.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={classes}
      >
        {placement.ctaLabel}
      </a>
    );
  }

  return (
    <Link to={placement.href} className={classes}>
      {placement.ctaLabel}
    </Link>
  );
}

export function SponsoredPlacementCard({
  placement,
  variant = 'portrait',
  className,
  description,
}: SponsoredPlacementCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-[5px] border border-dashed border-[#E8500A]/25 p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden w-full flex flex-col items-center',
        variant === 'infeed' && 'h-full justify-between text-left items-stretch',
        className,
      )}
    >
      <div className="relative z-10 w-full flex flex-col flex-1">
        {variant !== 'infeed' ? (
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
            <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">
              Sponsored
            </h3>
          </div>
        ) : (
          <span className="text-[8px] font-black uppercase tracking-widest text-[#E8500A] mb-2">
            Sponsored
          </span>
        )}

        <div
          className={cn(
            'w-full overflow-hidden border border-[#e8edf2] shadow-inner shrink-0 relative mb-4',
            aspectByVariant[variant],
            variant === 'portrait' ? 'rounded-xl' : 'rounded-[5px]',
          )}
        >
          <img
            src={placement.image}
            alt={placement.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        <h4 className="font-sans text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider mb-0.5 line-clamp-2">
          {placement.title}
        </h4>
        {placement.subtitle ? (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2 line-clamp-1">
            {placement.subtitle}
          </p>
        ) : null}
        {description ? (
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4 px-1 text-center line-clamp-3">
            {description}
          </p>
        ) : null}

        <div className={variant === 'infeed' ? 'mt-auto' : undefined}>
          <PlacementCta placement={placement} />
        </div>
      </div>
    </div>
  );
}

/** Compact in-grid sponsored cell — matches product/brand card footprint. */
export function InfeedSponsoredCard({
  placement,
  className,
}: {
  placement: ResolvedPlacement;
  className?: string;
}) {
  return (
    <SponsoredPlacementCard
      placement={placement}
      variant="infeed"
      className={cn('min-h-full', className)}
    />
  );
}
