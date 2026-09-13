import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import type { CtaBannerItem } from '../types/catalog';
import { resolveCtaDestination } from '../lib/ctaBanners';

/**
 * Single rendering for every Admin-managed editorial CTA strip
 * (Website Manager → CTA & Banners). Only style variants that already have a
 * real surface treatment in the design system are offered — no arbitrary CSS.
 */
const STYLE_CLASSNAMES: Record<NonNullable<CtaBannerItem['style']>, string> = {
  navy: 'choosify-dark-surface text-white',
  orange: 'orange-brand-gradient text-white',
  light: 'bg-white border border-[#E8EDF2] text-[#1A1A2E]',
  // No existing "purple" surface treatment exists in the current design
  // system to reuse without inventing new CSS — falls back to navy.
  purple: 'choosify-dark-surface text-white',
};

export interface CtaBannerStripProps {
  item: CtaBannerItem;
  className?: string;
  /** Extra action element rendered alongside the primary button (e.g. a second existing action). */
  secondaryAction?: React.ReactNode;
  onButtonClick?: () => void;
}

export function CtaBannerStrip({ item, className, secondaryAction, onButtonClick }: CtaBannerStripProps) {
  const destination = resolveCtaDestination(item);
  const subtitleClass = item.style === 'light' ? 'text-[#6B7280]' : 'text-white/55';
  const buttonClass =
    'bg-[#FF5B00] text-white px-[22px] py-3 rounded-lg text-[12px] font-bold no-underline hover:brightness-110 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div
      className={cn(
        STYLE_CLASSNAMES[item.style ?? 'navy'],
        'rounded-xl px-7 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4',
        className,
      )}
    >
      <div>
        <div className="text-[15px] font-bold mb-1">{item.title}</div>
        {item.subtitle && <div className={cn('text-[12px]', subtitleClass)}>{item.subtitle}</div>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {secondaryAction}
        {destination && !destination.isExternal && (
          <Link
            to={destination.href}
            className={buttonClass}
            onClick={onButtonClick}
            {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.buttonLabel}
          </Link>
        )}
        {destination && destination.isExternal && (
          <a
            href={destination.href}
            target={item.openInNewTab ? '_blank' : undefined}
            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
            className={buttonClass}
            onClick={onButtonClick}
          >
            {item.buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
}
