import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import type { HomeLivePulseItem } from '../../../lib/home/homepageLivePulse';
import { livePulseDotClass } from '../../../lib/home/homepageLivePulse';
import { SectionHeader } from '../../section/SectionHeader';
import { HomeSectionShell } from './HomeSectionShell';
import { colors } from '../../../design-system/tokens/colors';
import { radius } from '../../../design-system/tokens/radius';

interface WhatsHappeningTodayStripProps {
  items: HomeLivePulseItem[];
}

export function WhatsHappeningTodayStrip({ items }: WhatsHappeningTodayStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length < 2) return;

    let frame = 0;
    let offset = 0;
    const step = () => {
      offset += 0.25;
      if (offset >= track.scrollWidth / 2) offset = 0;
      track.style.transform = `translateX(-${offset}px)`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [items.length]);

  if (!items.length) return null;

  const loopItems = [...items, ...items];

  return (
    <HomeSectionShell
      id="section-whats-happening"
      sectionId="home-whats-happening"
      tone="white"
      className="border-b border-[#eef2f6]"
      innerClassName="!pb-8"
    >
      <SectionHeader
        id="section-whats-happening-heading"
        title="What's Happening Today"
        subtitle="Live updates across news, campaigns, deals, and trending discovery"
        compact
        icon={Zap}
      />
      <div className="overflow-hidden mask-fade-x -mt-2" aria-label="What's happening today">
        <div ref={trackRef} className="flex gap-3 w-max will-change-transform">
          {loopItems.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              to={item.href}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 shrink-0 min-h-[44px] transition-colors"
              style={{
                borderRadius: radius.full,
                backgroundColor: colors.surface.muted,
                color: colors.text.body,
              }}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${livePulseDotClass(item.tone)}`} aria-hidden />
              <span className="text-xs font-semibold whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </HomeSectionShell>
  );
}
