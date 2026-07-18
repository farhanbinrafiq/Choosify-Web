import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const ADSENSE_CLIENT =
  import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-3012630938814139';

export type AdSenseFormat = 'sidebar' | 'infeed' | 'responsive';

const SLOT_BY_FORMAT: Record<AdSenseFormat, string | undefined> = {
  sidebar: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR,
  infeed: import.meta.env.VITE_ADSENSE_SLOT_INFEED,
  responsive: import.meta.env.VITE_ADSENSE_SLOT_RESPONSIVE,
};

const MIN_HEIGHT: Record<AdSenseFormat, number> = {
  sidebar: 280,
  infeed: 120,
  responsive: 200,
};

type AdSenseSlotProps = {
  format?: AdSenseFormat;
  /** Override env slot id for this instance */
  slotId?: string;
  className?: string;
  label?: string;
};

export function AdSenseSlot({
  format = 'responsive',
  slotId,
  className,
  label = 'Advertisement',
}: AdSenseSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  const resolvedSlot = slotId || SLOT_BY_FORMAT[format];

  useEffect(() => {
    if (!resolvedSlot || !containerRef.current) return;

    const node = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [resolvedSlot]);

  useEffect(() => {
    if (!isVisible || !resolvedSlot || pushedRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Ad blockers or script not loaded — fail silently
    }
  }, [isVisible, resolvedSlot]);

  if (!resolvedSlot) return null;

  return (
    <aside
      aria-label={label}
      className={cn(
        'bg-white rounded-[5px] border border-[#e8edf2] p-4 shadow-sm w-full',
        className,
      )}
    >
      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-3 text-center">
        {label}
      </p>
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{ minHeight: MIN_HEIGHT[format] }}
      >
        {isVisible ? (
          <ins
            className="adsbygoogle block w-full"
            style={{ display: 'block', minHeight: MIN_HEIGHT[format] }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={resolvedSlot}
            data-ad-format={format === 'sidebar' ? 'vertical' : 'auto'}
            data-full-width-responsive={format !== 'sidebar' ? 'true' : undefined}
          />
        ) : null}
      </div>
    </aside>
  );
}
