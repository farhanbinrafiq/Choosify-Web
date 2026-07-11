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
}

export function SpotlightPublisherRow({ publisher, className, compact }: SpotlightPublisherRowProps) {
  const inner = (
    <>
      {publisher.logoUrl ? (
        <img src={publisher.logoUrl} alt="" className={cn('rounded-full object-cover border border-gray-100 shrink-0', compact ? 'w-6 h-6' : 'w-7 h-7')} />
      ) : (
        <span className={cn('rounded-full bg-[#E8500A]/10 text-[#E8500A] font-black flex items-center justify-center shrink-0', compact ? 'w-6 h-6 text-[9px]' : 'w-7 h-7 text-[10px]')}>
          {publisher.name.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <span className={cn('font-bold text-[#1a1a2e] truncate', compact ? 'text-[10px]' : 'text-xs')}>{publisher.name}</span>
          {publisher.isVerified && <BadgeCheck size={compact ? 10 : 12} className="text-[#E8500A] shrink-0" aria-label="Verified" />}
        </div>
        {!compact && (
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">
            {SPOTLIGHT_PUBLISHER_TYPE_LABELS[publisher.publisherType]}
          </p>
        )}
      </div>
    </>
  );

  if (publisher.profileHref) {
    return (
      <Link to={publisher.profileHref} className={cn('flex items-center gap-2 min-w-0 hover:opacity-80', className)}>
        {inner}
      </Link>
    );
  }

  return <div className={cn('flex items-center gap-2 min-w-0', className)}>{inner}</div>;
}
