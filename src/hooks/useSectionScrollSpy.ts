import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

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

  const scrollToSection = useCallback(
    (id: string) => {
      if (id === allId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveId(allId);
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    },
    [allId, scrollOffset],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < topThreshold) {
        setActiveId(allId);
        return;
      }

      const probe = window.scrollY + scrollOffset + 8;
      let current = allId;

      for (const section of visibleSections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        const bottom = top + el.offsetHeight;
        if (probe >= top && probe < bottom) {
          current = section.id;
        }
      }

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allId, scrollOffset, topThreshold, visibleSections]);

  return { activeId, scrollToSection, visibleSections };
}
