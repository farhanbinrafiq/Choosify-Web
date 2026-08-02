import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import type { ResolvedPlacement } from '../utils/resolvePlacementContent';
import { ChoosifySponsoredCardFromResolved } from './commerce/ChoosifySponsoredCard';
import { SponsoredCardChrome } from './commerce/SponsoredCardChrome';

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
    'w-full py-2.5 bg-[#EB4501] hover:brightness-110 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-[filter] cursor-pointer border-0 no-underline',
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
  const tallImage = variant === 'portrait' || variant === 'infeed';
  const brandName = placement.subtitle || placement.title;

  return (
    <div
      className={cn(
        'choosify-dark-surface rounded-xl p-4.5 text-white text-center relative overflow-hidden w-full flex flex-col items-center',
        variant === 'infeed' && 'h-full justify-between text-left items-stretch',
        variant === 'portrait' && 'min-h-[440px]',
        className,
      )}
    >
      <div className="relative z-10 w-full flex flex-col flex-1 min-h-0">
        <div
          className={cn(
            'w-full overflow-hidden relative mb-4',
            tallImage ? 'flex-[7] min-h-0' : cn('shrink-0', aspectByVariant[variant]),
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
          <SponsoredCardChrome brandName={brandName} logoUrl={placement.image} size="md" />
        </div>

        <div className={tallImage ? 'flex-[3] min-h-0 shrink-0 flex flex-col justify-center' : undefined}>
          <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-0.5 line-clamp-2">
            {placement.title}
          </h4>
          {placement.subtitle ? (
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-2 line-clamp-1">
              {placement.subtitle}
            </p>
          ) : null}
          {description ? (
            <p className="text-[11px] text-white/60 font-medium leading-relaxed mb-4 px-1 text-center line-clamp-3">
              {description}
            </p>
          ) : null}

          <div className={variant === 'infeed' ? 'mt-auto' : undefined}>
            <PlacementCta placement={placement} />
          </div>
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
    <ChoosifySponsoredCardFromResolved
      placement={placement}
      sponsorName={placement.subtitle}
      className={cn('min-h-full', className)}
    />
  );
}
