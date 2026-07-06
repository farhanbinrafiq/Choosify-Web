import React from 'react';
import type { PageHeroBannerKey } from './PageHeroBanner';
import type { SiteConfig } from '../types/catalog';
import { getHeroTickerItems } from '../utils/heroTickers';
import { cn } from '../lib/utils';

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
  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        'w-full overflow-hidden py-2.5 border-b border-white/5 bg-[#000435] relative z-20',
        className,
      )}
      aria-hidden
    >
      <div className="flex w-max animate-marquee whitespace-nowrap gap-0 px-4">
        {doubled.map((item, i) => (
          <TickerLine key={`${item.id}-${i}`} segments={item.segments} />
        ))}
      </div>
    </div>
  );
}
