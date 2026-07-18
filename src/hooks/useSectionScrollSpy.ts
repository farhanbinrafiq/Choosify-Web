import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export interface SectionNavItem {
  id: string;
  label: string;
  /** When true, item is omitted from nav (section not rendered) */
  hidden?: boolean;
  icon?: ReactNode;
}

interface UseSectionScrollSpyOptions {
  /** Pixel offset for scroll-to (navbar + sticky nav) */
  scrollOffset?: number;
  /** Scroll Y below which active section is "all" */
  topThreshold?: number;
  /** Id used for top-of-page / hero */
  allId?: string;
}

export function useSectionScrollSpy(
  sections: SectionNavItem[],
  options: UseSectionScrollSpyOptions = {},
) {
  const {
    scrollOffset = 200,
    topThreshold = 200,
    allId = 'all',
  } = options;

  const visibleSections = useMemo(
    () => sections.filter((s) => !s.hidden && s.id !== allId),
    [sections, allId],
  );
  const [activeId, setActiveId] = useState(allId);

  // While a programmatic smooth scroll is in flight, the spy is locked onto
  // the clicked section so intermediate sections don't flash as active.
  const lockRef = useRef<{ locked: boolean; releaseTimer: number }>({
    locked: false,
    releaseTimer: 0,
  });

  const scrollToSection = useCallback(
    (id: string) => {
      const lock = lockRef.current;
      const engageLock = () => {
        lock.locked = true;
        window.clearTimeout(lock.releaseTimer);
        // Released early by the scroll handler once scrolling settles; this
        // is a fallback in case no scroll events fire (already at target).
        lock.releaseTimer = window.setTimeout(() => {
          lock.locked = false;
        }, 700);
      };

      if (id === allId) {
        engageLock();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveId(allId);
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
      engageLock();
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      setActiveId(id);
    },
    [allId, scrollOffset],
  );

  useEffect(() => {
    let rafId = 0;

    const compute = () => {
      rafId = 0;
      if (window.scrollY < topThreshold) {
        setActiveId(allId);
        return;
      }

      const probe = window.scrollY + scrollOffset + 8;
      const doc = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 4;

      // Pick the last section whose top is above the probe line, so gaps
      // between sections don't flicker back to "Overview".
      let current = allId;
      let lastRenderedId: string | null = null;
      for (const section of visibleSections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        lastRenderedId = section.id;
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        if (probe >= top) {
          current = section.id;
        }
      }

      if (atBottom && lastRenderedId) {
        current = lastRenderedId;
      }

      setActiveId(current);
    };

    const handleScroll = () => {
      const lock = lockRef.current;
      if (lock.locked) {
        // Keep the lock alive while the smooth scroll is still moving;
        // release shortly after scroll events stop.
        window.clearTimeout(lock.releaseTimer);
        lock.releaseTimer = window.setTimeout(() => {
          lock.locked = false;
          if (!rafId) rafId = window.requestAnimationFrame(compute);
        }, 140);
        return;
      }
      if (!rafId) rafId = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
      window.clearTimeout(lockRef.current.releaseTimer);
    };
  }, [allId, scrollOffset, topThreshold, visibleSections]);

  return { activeId, scrollToSection, visibleSections };
}
