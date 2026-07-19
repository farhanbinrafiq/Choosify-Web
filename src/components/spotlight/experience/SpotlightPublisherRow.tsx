import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import type { SpotlightPublisher } from '../../../types/spotlight/experience/publisher';
import { SPOTLIGHT_PUBLISHER_TYPE_LABELS } from '../../../types/spotlight/experience/publisher';
import { cn } from '../../../lib/utils';

interface SpotlightPublisherRowProps {
  publisher: SpotlightPublisher;
  className?: string;
  compact?: boolean;
  /** Demote publisher below commerce — smaller, muted */
  secondary?: boolean;
  /** Cards open content page; publisher profile is secondary destination */
  linkToProfile?: boolean;
}

export function SpotlightPublisherRow({
  publisher,
  className,
  compact,
  secondary,
  linkToProfile = true,
}: SpotlightPublisherRowProps) {
  const inner = (
    <>
      {publisher.logoUrl ? (
        <img
          src={publisher.logoUrl}
          alt=""
          className={cn(
            'rounded-full object-cover border border-gray-100 shrink-0',
            secondary || compact ? 'w-5 h-5' : 'w-7 h-7',
          )}
        />
      ) : (
        <span
          className={cn(
            'rounded-full bg-[#EB4501]/10 text-[#EB4501] font-black flex items-center justify-center shrink-0',
            secondary || compact ? 'w-5 h-5 text-[8px]' : 'w-7 h-7 text-[10px]',
          )}
        >
          {publisher.name.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'font-bold text-[#1a1a2e] truncate',
              secondary ? 'text-[9px] text-gray-500 font-semibold' : compact ? 'text-[10px]' : 'text-xs',
            )}
          >
            {publisher.name}
          </span>
          {publisher.isVerified && !secondary && (
            <BadgeCheck size={compact ? 10 : 12} className="text-[#EB4501] shrink-0" aria-label="Verified" />
          )}
        </div>
        {!compact && !secondary && (
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">
            {SPOTLIGHT_PUBLISHER_TYPE_LABELS[publisher.publisherType]}
          </p>
        )}
      </div>
    </>
  );

  if (linkToProfile && publisher.profileHref) {
    return (
      <Link to={publisher.profileHref} className={cn('flex items-center gap-2 min-w-0 hover:opacity-80', className)}>
        {inner}
      </Link>
    );
  }

  return <div className={cn('flex items-center gap-2 min-w-0', className)}>{inner}</div>;
}
