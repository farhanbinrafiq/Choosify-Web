import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useDragScroll } from './FilterEngine';
import type { SectionNavItem } from '../hooks/useSectionScrollSpy';
import {
  MobileVerticalNavDock,
  MobileDockStickySentinel,
  inferSectionDockIcon,
} from './design/MobileVerticalNavDock';

interface StickySectionNavProps {
  sections: SectionNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  allLabel?: string;
  allId?: string;
  /** Left label — compare page "Decision profile" strip */
  profileLabel?: string;
  className?: string;
  /** Override inner max-width shell (e.g. match page feed column) */
  contentClassName?: string;
}

function NavButton({
  active,
  onClick,
  icon,
  label,
  itemId,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  itemId?: string;
}) {
  return (
    <button
      type="button"
      data-section-nav-item={itemId}
      onClick={onClick}
      className={cn(
        'shrink-0 px-4 py-2.5 sm:py-2 rounded-none text-[12px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap relative touch-manipulation min-h-[40px] sm:min-h-0 border-0',
        active
          ? 'bg-[#FFF3EA] text-[#EB4501]'
          : 'bg-transparent text-[#4B5563] hover:bg-[#F4F7F9] hover:text-[#1A1A2E]',
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/** Light sticky section nav — matches Choosify.dc.html white chrome (not dark header) */
export function StickySectionNav({
  sections,
  activeId,
  onNavigate,
  allLabel = 'Overview',
  allId = 'all',
  profileLabel = 'On this page',
  className,
  contentClassName,
}: StickySectionNavProps) {
  const items = sections.filter((s) => !s.hidden);
  const { ref: scrollTrackRef, props: scrollTrackProps } = useDragScroll({ grabCursor: false });
  const userScrollUntilRef = useRef(0);

  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;
    if (track.scrollWidth <= track.clientWidth + 4) return;
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

  if (items.length === 0) return null;

  const markUserScroll = () => {
    userScrollUntilRef.current = Date.now() + 1500;
  };

  const dockItems = [
    {
      id: allId,
      icon: inferSectionDockIcon(allId, allLabel),
      label: allLabel,
      active: activeId === allId,
      onClick: () => onNavigate(allId),
    },
    ...items.map((section) => ({
      id: section.id,
      icon: section.icon ?? inferSectionDockIcon(section.id, section.label),
      label: section.label,
      active: activeId === section.id,
      onClick: () => onNavigate(section.id),
    })),
  ];

  return (
    <>
      {items.length > 0 && (
        <>
          <MobileDockStickySentinel />
          <MobileVerticalNavDock
            items={dockItems}
            ariaLabel="Page sections"
            preferenceKey="section-nav"
          />
        </>
      )}

      <nav
        aria-label="Page sections"
        data-mobile-dock-trigger
        className={cn(
          'choosify-sticky-section-nav sticky z-40 w-full px-4 sm:px-5 lg:px-6 py-2 bg-[#F4F7F9]/90 backdrop-blur-sm hidden sm:block',
          className,
        )}
      >
        <div className={cn('max-w-[1440px] mx-auto', contentClassName)}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between min-w-0 bg-white border border-[#E8EDF2] rounded-none px-3 sm:px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 shrink-0 min-w-0 select-none">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-[#9AA0AC] whitespace-nowrap truncate">
                {profileLabel}
              </span>
            </div>

            <div className="relative min-w-0 w-full md:w-auto md:max-w-full">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white to-transparent z-10 md:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-white to-transparent z-10 md:hidden"
                aria-hidden
              />
              <div
                ref={scrollTrackRef}
                {...scrollTrackProps}
                onTouchStart={markUserScroll}
                onTouchMove={markUserScroll}
                onWheel={markUserScroll}
                className="choosify-sticky-nav-track flex items-center gap-1 min-w-0 w-full md:w-auto"
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
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
