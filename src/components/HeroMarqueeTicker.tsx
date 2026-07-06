import React, { useEffect, useRef, useState } from 'react';
import type { PageHeroBannerKey } from './PageHeroBanner';
import type { SiteConfig } from '../types/catalog';
import { getHeroTickerItems } from '../utils/heroTickers';
import { cn } from '../lib/utils';

/** Pixels per second — keeps marquee speed consistent across pages regardless of content length */
const MARQUEE_SPEED_PX_PER_SEC = 60;

interface HeroMarqueeTickerProps {
  pageKey: PageHeroBannerKey;
  siteConfig?: SiteConfig | null;
  className?: string;
}

function TickerSegment({
  text,
  emphasis,
}: {
  text: string;
  emphasis?: boolean;
}) {
  if (emphasis) {
    return (
      <span className="inline-flex items-center mx-1">
        <span className="bg-[#E8500A] text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
          {text}
        </span>
      </span>
    );
  }
  return <span className="text-white font-semibold">{text}</span>;
}

function TickerLine({
  segments,
}: {
  segments: { text: string; emphasis?: boolean }[];
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-space tracking-wide whitespace-nowrap">
      {segments.map((segment, idx) => (
        <TickerSegment key={`${segment.text}-${idx}`} {...segment} />
      ))}
      <span className="text-white/30 mx-4" aria-hidden>
        •
      </span>
    </span>
  );
}

export function HeroMarqueeTicker({ pageKey, siteConfig, className }: HeroMarqueeTickerProps) {
  const items = getHeroTickerItems(pageKey, siteConfig);
  const trackRef = useRef<HTMLDivElement>(null);
  const [durationSec, setDurationSec] = useState(30);

  const doubled = [...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !items.length) return;

    const updateDuration = () => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth <= 0) return;
      setDurationSec(Math.max(12, halfWidth / MARQUEE_SPEED_PX_PER_SEC));
    };

    updateDuration();

    const observer = new ResizeObserver(updateDuration);
    observer.observe(track);
    return () => observer.disconnect();
  }, [items, pageKey]);

  if (!items.length) return null;

  return (
    <div
      className={cn(
        'w-full overflow-hidden py-2.5 border-b border-white/5 bg-[#000435] relative z-20',
        className,
      )}
      aria-hidden
    >
      <div
        ref={trackRef}
        className="flex w-max whitespace-nowrap gap-0"
        style={{
          animation: `marquee ${durationSec}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <TickerLine key={`${item.id}-${i}`} segments={item.segments} />
        ))}
      </div>
    </div>
  );
}
