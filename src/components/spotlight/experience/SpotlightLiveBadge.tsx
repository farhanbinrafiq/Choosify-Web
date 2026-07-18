import React from 'react';
import { Radio } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SpotlightLiveBadgeProps {
  status?: 'live' | 'upcoming' | 'replay';
  className?: string;
}

export function SpotlightLiveBadge({ status = 'live', className }: SpotlightLiveBadgeProps) {
  const label = status === 'upcoming' ? 'Upcoming' : status === 'replay' ? 'Replay' : 'Live';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider',
        status === 'live' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white',
        className,
      )}
    >
      {status === 'live' && <Radio size={10} className="animate-pulse" />}
      {label}
    </span>
  );
}
