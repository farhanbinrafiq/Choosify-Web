import React from 'react';
import type { SpotlightPublisherTrustProfile } from '../../../types/spotlight/publisher/trust';
import { cn } from '../../../lib/utils';

interface SpotlightPublisherTrustBadgesProps {
  trust: SpotlightPublisherTrustProfile;
  className?: string;
}

export function SpotlightPublisherTrustBadges({ trust, className }: SpotlightPublisherTrustBadgesProps) {
  if (!trust.badges.length) return null;
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {trust.badges.map((badge) => (
        <span
          key={badge.type}
          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-[#E8500A]/10 text-[#E8500A] border border-[#E8500A]/20"
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
