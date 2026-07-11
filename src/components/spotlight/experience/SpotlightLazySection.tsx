import React, { useEffect, useRef, useState } from 'react';

interface SpotlightLazySectionProps {
  children: React.ReactNode;
  enabled?: boolean;
  rootMargin?: string;
  minHeight?: number;
}

/** Lazy-mount feed sections below the fold */
export function SpotlightLazySection({
  children,
  enabled = true,
  rootMargin = '200px',
  minHeight = 280,
}: SpotlightLazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!enabled);

  useEffect(() => {
    if (!enabled || visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, visible, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : (
        <div className="animate-pulse bg-gray-50 border border-[#e8edf2] rounded-[5px] h-48" aria-hidden />
      )}
    </div>
  );
}
