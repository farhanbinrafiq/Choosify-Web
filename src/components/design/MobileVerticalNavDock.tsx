import React, { useEffect, useId, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface MobileVerticalNavDockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  sub?: string;
  badge?: number | string;
  active?: boolean;
  bg?: string;
  onClick: () => void;
}

/** Append/prepend Clear Filters when page filters are active. */
export function withClearFiltersDockItem(
  items: MobileVerticalNavDockItem[],
  options?: {
    onClear?: (() => void) | null;
    hasActiveFilters?: boolean;
    /** Prefer top so clear is visible without scrolling the dock */
    placement?: 'start' | 'end';
  },
): MobileVerticalNavDockItem[] {
  const onClear = options?.onClear;
  const hasActive = Boolean(options?.hasActiveFilters && onClear);
  if (!hasActive || !onClear) return items;

  const clearItem: MobileVerticalNavDockItem = {
    id: '__clear-filters',
    icon: '↺',
    label: 'Clear Filters',
    sub: 'Reset all',
    bg: '#FFF3EA',
    onClick: onClear,
  };

  return options?.placement === 'end'
    ? [...items, clearItem]
    : [clearItem, ...items];
}

interface MobileVerticalNavDockProps {
  items: MobileVerticalNavDockItem[];
  ariaLabel?: string;
  className?: string;
  expandBeforeSelect?: boolean;
  /**
   * Storage key for minimize preference (session). Defaults to a stable id.
   */
  preferenceKey?: string;
}

const MINIMIZE_PREFIX = 'choosify-mobile-dock-minimized:';

/**
 * Mobile-only left floating vertical dock.
 * Hidden until sticky page nav / filter pills engage; sits above the filter FAB.
 */
export function MobileVerticalNavDock({
  items,
  ariaLabel = 'Page navigation',
  className,
  expandBeforeSelect = false,
  preferenceKey = 'default',
}: MobileVerticalNavDockProps) {
  const visible = items.filter(Boolean);
  const activeId = visible.find((i) => i.active)?.id ?? null;
  const [expandedId, setExpandedId] = useState<string | null>(activeId);
  const [stickyActive, setStickyActive] = useState(false);
  const [minimized, setMinimized] = useState(() => {
    try {
      return sessionStorage.getItem(MINIMIZE_PREFIX + preferenceKey) === '1';
    } catch {
      return false;
    }
  });
  const reactId = useId();

  useEffect(() => {
    if (activeId && !minimized) setExpandedId(activeId);
  }, [activeId, minimized]);

  useEffect(() => {
    try {
      sessionStorage.setItem(MINIMIZE_PREFIX + preferenceKey, minimized ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [minimized, preferenceKey]);

  // Show when any page sticky trigger has engaged (sentinel left the viewport above)
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let raf = 0;

    const nodesOf = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-mobile-dock-sentinel]'));

    const update = () => {
      const nodes = nodesOf();
      if (nodes.length === 0) {
        setStickyActive(false);
        return;
      }
      const engaged = nodes.some((n) => n.getBoundingClientRect().bottom < 1);
      setStickyActive(engaged);
    };

    const sync = () => {
      observer?.disconnect();
      const nodes = nodesOf();
      if (nodes.length === 0) {
        setStickyActive(false);
        return;
      }
      observer = new IntersectionObserver(update, { threshold: [0, 1], rootMargin: '0px' });
      nodes.forEach((n) => observer!.observe(n));
      update();
    };

    sync();
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reactId, visible.length]);

  if (visible.length === 0) return null;

  const handlePress = (item: MobileVerticalNavDockItem) => {
    if (minimized) {
      item.onClick();
      return;
    }
    if (expandBeforeSelect) {
      if (expandedId !== item.id) {
        setExpandedId(item.id);
        return;
      }
    } else {
      setExpandedId(item.id);
    }
    item.onClick();
  };

  return (
    <AnimatePresence>
      {stickyActive && (
        <motion.nav
          key="mobile-vertical-dock"
          aria-label={ariaLabel}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={cn(
            'choosify-mobile-vertical-dock fixed z-[210] sm:hidden',
            'left-[max(0.4rem,env(safe-area-inset-left,0px))]',
            // Sit above the mobile filter FAB (3.5rem) + gap
            'bottom-[calc(1rem+3.5rem+0.75rem+env(safe-area-inset-bottom,0px))]',
            // Chevron stays bottom; items expand upward
            'flex flex-col-reverse items-start gap-1.5',
            'max-h-[min(62vh,calc(100dvh-9.5rem))]',
            'pointer-events-none',
            className,
          )}
        >
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? 'Show navigation' : 'Hide navigation'}
            aria-expanded={!minimized}
            className={cn(
              'pointer-events-auto shrink-0 w-9 h-9 rounded-full border shadow-[0_6px_18px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer transition-colors touch-manipulation',
              minimized
                ? 'border-[#EB4501]/40 bg-[#EB4501] text-white hover:brightness-110'
                : 'border-[#E8EDF2] bg-white/95 backdrop-blur-sm text-[#8a9bb0] hover:text-[#EB4501] hover:border-[#EB4501]/35',
            )}
          >
            {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence initial={false}>
            {!minimized && (
              <motion.div
                key="dock-items"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="pointer-events-auto flex flex-col items-start gap-1.5 overflow-y-auto overflow-x-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-h-[min(54vh,calc(100dvh-11rem))]"
              >
                {visible.map((item) => {
                  const showLabel = expandedId === item.id;
                  const active = Boolean(item.active);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePress(item)}
                      aria-current={active ? 'true' : undefined}
                      aria-expanded={showLabel}
                      aria-label={item.label}
                      title={item.label}
                      className={cn(
                        'group flex items-center gap-2 h-11 min-w-11 rounded-full border shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out touch-manipulation cursor-pointer shrink-0',
                        showLabel ? 'pl-1.5 pr-3.5' : 'px-0 justify-center w-11',
                        active
                          ? 'bg-[#EB4501] border-[#EB4501] text-white'
                          : 'bg-white/95 backdrop-blur-sm border-[#E8EDF2] text-[#1A1A2E] hover:border-[#EB4501]/35',
                      )}
                    >
                      <span
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-[15px] shrink-0 font-bold leading-none',
                          active ? 'bg-white/20 text-white' : 'text-[#1A1A2E]',
                        )}
                        style={
                          !active && item.bg
                            ? { background: item.bg }
                            : !active
                              ? { background: '#F4F7F9' }
                              : undefined
                        }
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          'overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200',
                          showLabel ? 'max-w-[9.5rem] opacity-100' : 'max-w-0 opacity-0',
                        )}
                      >
                        <span
                          className={cn(
                            'block text-[11.5px] font-bold leading-tight',
                            active ? 'text-white' : 'text-[#1A1A2E]',
                          )}
                        >
                          {item.label}
                          {item.badge != null && item.badge !== 0 && item.badge !== '' ? (
                            <span
                              className={cn(
                                'ml-1 inline-flex min-w-[14px] h-3.5 px-1 rounded-full text-[8px] font-black items-center justify-center align-middle',
                                active ? 'bg-white/25 text-white' : 'bg-[#EB4501] text-white',
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </span>
                        {item.sub ? (
                          <span
                            className={cn(
                              'block text-[9.5px] font-semibold leading-tight truncate',
                              active ? 'text-white/75' : 'text-[#9AA0AC]',
                            )}
                          >
                            {item.sub}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/** Sensible emoji fallbacks for common section ids / labels. */
export function inferSectionDockIcon(id: string, label?: string): string {
  const key = `${id} ${label ?? ''}`.toLowerCase();
  if (/deal|coupon|offer/.test(key)) return '🏷';
  if (/product|catalog|item/.test(key)) return '📦';
  if (/public.?review|community/.test(key)) return '💬';
  if (/creator.?review|influencer/.test(key)) return '⭐';
  if (/overview|about|all\b/.test(key)) return '◉';
  if (/where.?to.?buy|store|location|buy/.test(key)) return '📍';
  if (/faq|question/.test(key)) return '❓';
  if (/brand.?story|story/.test(key)) return '📖';
  if (/guide/.test(key)) return '📖';
  if (/video/.test(key)) return '▶';
  if (/review/.test(key)) return '⭐';
  if (/collection/.test(key)) return '📚';
  if (/spec/.test(key)) return '⚏';
  if (/discuss|verdict|winner|takeaway|method/.test(key)) return '✦';
  if (/event|post/.test(key)) return '📢';
  return '●';
}

/** 1px sentinel — place immediately before sticky nav/pills to drive dock visibility. */
export function MobileDockStickySentinel({ className }: { className?: string }) {
  return (
    <div
      data-mobile-dock-sentinel
      aria-hidden
      className={cn('h-px w-px overflow-hidden pointer-events-none', className)}
    />
  );
}
