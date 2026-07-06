import React, { useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { useOpenPageFilters, useDragScroll } from './FilterEngine';
import type { SectionNavItem } from '../hooks/useSectionScrollSpy';

interface StickySectionNavProps {
  sections: SectionNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  allLabel?: string;
  allId?: string;
  /** Left label — compare page "Decision profile" strip */
  profileLabel?: string;
  className?: string;
  /** Override auto-detect; hide Filter shortcut when false */
  showFilter?: boolean;
}

function NavButton({
  active,
  onClick,
  icon,
  label,
  badge,
  itemId,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  badge?: number;
  itemId?: string;
}) {
  return (
    <button
      type="button"
      data-section-nav-item={itemId}
      onClick={onClick}
      className={cn(
        'shrink-0 px-4 py-2.5 sm:py-2 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap relative touch-manipulation min-h-[40px] sm:min-h-0',
        active
          ? 'bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/25'
          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20',
      )}
    >
      {icon}
      <span>{label}</span>
      {badge != null && badge > 0 && (
        <span
          className={cn(
            'min-w-[16px] h-4 px-1 rounded-full text-[8px] font-black flex items-center justify-center leading-none',
            active ? 'bg-white text-[#E8500A]' : 'bg-[#E8500A] text-white',
          )}
        >
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}

export function StickySectionNav({
  sections,
  activeId,
  onNavigate,
  allLabel = 'Overview',
  allId = 'all',
  profileLabel = 'On this page',
  className,
  showFilter,
}: StickySectionNavProps) {
  const items = sections.filter((s) => !s.hidden);
  const { canOpenFilters, openFilters, isFiltersOpen, activeFilterCount } = useOpenPageFilters();
  const filterVisible = showFilter ?? canOpenFilters;
  const { ref: scrollTrackRef, props: scrollTrackProps } = useDragScroll({ grabCursor: false });
  const userScrollUntilRef = useRef(0);

  // Auto-center the active pill in the horizontal track as the page scrolls
  // between sections, so on mobile the current section is always visible.
  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;
    if (track.scrollWidth <= track.clientWidth + 4) return;
    // Don't fight the user while they are actively swiping the track.
    if (Date.now() < userScrollUntilRef.current) return;

    const target = track.querySelector<HTMLElement>(
      `[data-section-nav-item="${CSS.escape(activeId)}"]`,
    );
    if (!target) return;

    const desired =
      target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
    const max = track.scrollWidth - track.clientWidth;
    const next = Math.max(0, Math.min(desired, max));
    if (Math.abs(next - track.scrollLeft) < 2) return;
    track.scrollTo({ left: next, behavior: 'smooth' });
  }, [activeId, scrollTrackRef]);

  if (items.length === 0 && !filterVisible) return null;

  const markUserScroll = () => {
    userScrollUntilRef.current = Date.now() + 1500;
  };

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        'choosify-sticky-section-nav sticky z-40 w-full border-t border-white/10 bg-[#000435]/90 backdrop-blur-md',
        className,
      )}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-3">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between min-w-0">
          <div className="flex items-center gap-2 shrink-0 min-w-0 select-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap truncate">
              {profileLabel}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#E8500A] animate-pulse shrink-0" />
          </div>

          <div className="relative min-w-0 w-full md:w-auto md:max-w-full">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#000435] to-transparent z-10 md:hidden"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-[#000435] to-transparent z-10 md:hidden"
              aria-hidden
            />
            <div
              ref={scrollTrackRef}
              {...scrollTrackProps}
              onTouchStart={markUserScroll}
              onTouchMove={markUserScroll}
              onWheel={markUserScroll}
              className="choosify-sticky-nav-track flex items-center gap-2 min-w-0 w-full md:w-auto"
            >
            <NavButton
              active={activeId === allId}
              onClick={() => onNavigate(allId)}
              label={allLabel}
              itemId={allId}
            />
            {items.map((section) => (
              <NavButton
                key={section.id}
                active={activeId === section.id}
                onClick={() => onNavigate(section.id)}
                icon={section.icon}
                label={section.label}
                itemId={section.id}
              />
            ))}
            {filterVisible && (
              <>
                <div className="w-px h-6 bg-white/10 shrink-0 mx-0.5" aria-hidden />
                <NavButton
                  active={isFiltersOpen}
                  onClick={openFilters}
                  icon={<SlidersHorizontal size={13} />}
                  label="Filter"
                  badge={activeFilterCount}
                />
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
