import React from 'react';
import { Radio, Clock } from 'lucide-react';
import type { SpotlightContent } from '../../../types/spotlight/experience/content';
import { cn } from '../../../lib/utils';

export function SpotlightLiveStatusSection({
  content,
  className,
}: {
  content: SpotlightContent;
  className?: string;
}) {
  const status = content.live?.status ?? (content.isLive ? 'live' : 'ended');
  const isLive = status === 'live';
  const isUpcoming = status === 'upcoming';
  const label = isLive ? 'Live Now' : isUpcoming ? 'Upcoming Live' : 'Live Replay';

  return (
    <section
      className={cn(
        'max-w-[1080px] mx-auto px-6 py-4',
        className,
      )}
      aria-label="Live status"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[5px] border border-[#e8edf2] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight',
              isLive ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-[#FFF0E8] text-[#EB4501] border border-[#EB4501]/20',
            )}
          >
            <Radio size={12} className={isLive ? 'animate-pulse' : undefined} />
            {label}
          </span>
          {content.live?.scheduledAt && (
            <span className="text-[12px] font-medium text-[#9AA0AC] flex items-center gap-1">
              <Clock size={12} /> {new Date(content.live.scheduledAt).toLocaleString()}
            </span>
          )}
        </div>
        {content.live?.embedUrl && (
          <a
            href="#spotlight-content-hero"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-[#EB4501] text-white text-[10px] font-black uppercase tracking-wider rounded hover:bg-[#CF4400] no-underline"
          >
            {isLive ? 'Watch Live' : isUpcoming ? 'Notify Me' : 'Watch Replay'}
          </a>
        )}
      </div>
    </section>
  );
}
