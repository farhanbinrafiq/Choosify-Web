import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Radio, Clock, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import type { CommerceMediaItem } from './commerceMediaTypes';
import { isVideoKind, resolveItemAspectRatio } from '../media/choosifyMediaTypes';

export interface DetailSliverLiveBadge {
  label: string;
  isLive: boolean;
  isUpcoming: boolean;
  scheduledAt?: string;
  ctaLabel?: string;
}

const ZOOM_MAX = 4;
const ZOOM_TAP_SCALE = 2.5;
/** Horizontal travel (px) that counts as a deliberate swipe rather than a tap. */
const SWIPE_THRESHOLD = 44;
/** Any pointer travel beyond this (px, taxicab) is a drag — never a click. */
const DRAG_SLOP = 8;

/** Match platform carousel feel — short eased slide + fade (ChoosifyCarousel ~300–400ms range) */
const SLIDE_TRANSITION = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const };
/** Shared hero auto-advance (Product / Service / Guide / Spotlight detail heroes) */
const AUTO_ADVANCE_MS = 4500;
const AUTOPLAY_RESUME_MS = 5500;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

/**
 * Touch-friendly fullscreen image: tap to toggle zoom, pinch to zoom, drag to pan.
 * Horizontal swipe at 1x scale navigates the gallery when `onNavigate` is provided.
 */
function PinchZoomImage({
  src,
  alt,
  onNavigate,
}: {
  src: string;
  alt: string;
  onNavigate?: (dir: 1 | -1) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(true);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({
    startScale: 1,
    startX: 0,
    startY: 0,
    startDist: 0,
    startMid: { x: 0, y: 0 },
    origin: { x: 0, y: 0 },
    moved: false,
    downAt: 0,
  });

  const clampView = useCallback((scale: number, x: number, y: number) => {
    const el = containerRef.current;
    const maxX = el ? ((scale - 1) * el.clientWidth) / 2 : 0;
    const maxY = el ? ((scale - 1) * el.clientHeight) / 2 : 0;
    return {
      scale,
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const toLocal = (e: { clientX: number; clientY: number }) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // Keep pinch / pan / tap-zoom gestures inside the viewer — they must never
    // reach the backdrop's gesture tracking or close handler.
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 1) {
      g.startScale = view.scale;
      g.startX = view.x;
      g.startY = view.y;
      g.moved = false;
      g.downAt = Date.now();
      g.origin = { x: e.clientX, y: e.clientY };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.startDist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      g.startScale = view.scale;
      g.startX = view.x;
      g.startY = view.y;
      g.startMid = toLocal({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      g.moved = true;
    }
    setAnimate(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    e.stopPropagation();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const scale = Math.max(1, Math.min(ZOOM_MAX, (g.startScale * dist) / g.startDist));
      const mid = toLocal({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      const ratio = scale / g.startScale;
      const x = mid.x - (g.startMid.x - g.startX) * ratio;
      const y = mid.y - (g.startMid.y - g.startY) * ratio;
      setView(clampView(scale, x, y));
      return;
    }

    if (pointers.current.size === 1) {
      const dx = e.clientX - g.origin.x;
      const dy = e.clientY - g.origin.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      if (view.scale > 1) {
        setView(clampView(view.scale, g.startX + dx, g.startY + dy));
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size > 0) return;

    // Snap back to fit when pinch ends near 1x
    if (view.scale < 1.05) {
      setAnimate(true);
      setView({ scale: 1, x: 0, y: 0 });
    }

    const dx = e.clientX - g.origin.x;
    const dy = e.clientY - g.origin.y;

    // At fit scale, horizontal swipe changes the gallery image (keep viewer open)
    if (view.scale <= 1.05 && onNavigate && g.moved) {
      if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        onNavigate(dx < 0 ? 1 : -1);
        return;
      }
    }

    // Tap (no drag/pinch) toggles zoom around the tap point
    if (!g.moved && Date.now() - g.downAt < 350) {
      setAnimate(true);
      if (view.scale > 1) {
        setView({ scale: 1, x: 0, y: 0 });
      } else {
        const p = toLocal(e);
        setView(clampView(ZOOM_TAP_SCALE, p.x * (1 - ZOOM_TAP_SCALE), p.y * (1 - ZOOM_TAP_SCALE)));
      }
    }
  };

  // Reset pan/zoom when the media source changes (next/prev while fullscreen)
  useEffect(() => {
    setAnimate(false);
    setView({ scale: 1, x: 0, y: 0 });
  }, [src]);

  return (
    <div
      ref={containerRef}
      data-zoom-viewport
      className="relative w-full h-full overflow-hidden select-none"
      style={{ touchAction: 'none', cursor: view.scale > 1 ? 'zoom-out' : 'zoom-in' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-contain"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transition: animate ? 'transform 200ms ease-out' : 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

export interface DetailSliverMediaGalleryProps {
  items: CommerceMediaItem[];
  ariaLabel?: string;
  /** Show “+ Add Video” chrome (admin/studio surfaces) */
  showAddVideo?: boolean;
  onAddVideo?: () => void;
  className?: string;
  /** LIVE NOW / Upcoming / Replay badge overlaid on the media card */
  liveBadge?: DetailSliverLiveBadge;
  /** Auto-advance slides (default on for multi-image heroes) */
  autoplay?: boolean;
  /** Ms between auto-advances while playing (default 4500) */
  autoplayIntervalMs?: number;
}

/**
 * Explicit "contain within a width/height budget" fit — deliberately NOT
 * delegated to CSS `aspect-ratio` + `max-width`/`max-height` + auto/auto.
 * That CSS-only approach was tried and, per real browser QA, produced wrong
 * results on the active stage box: its only in-flow-eligible content is an
 * absolutely-positioned `motion.button` (taken out of flow entirely), so
 * the box has nothing concrete to size a "shrink-to-fit" width from, and
 * the browser's actual resolution of the dual max-constraint didn't match
 * the replaced-element "contain" behavior the CSS technique assumes.
 * Computing the final pixel box in JS removes that ambiguity: for landscape
 * content (ratio > 1) width is the driving constraint (use the full width
 * budget, derive height, only fall back to the height budget if that
 * derived height would overflow it); for portrait content the same
 * arithmetic naturally makes height the driving constraint instead — no
 * per-orientation branching needed, it falls out of the width-first-then-
 * clamp order.
 */
function containFit(ratio: number, maxWidth: number, maxHeight: number): { width: number; height: number } {
  const safeRatio = ratio > 0 ? ratio : 16 / 9;
  let width = maxWidth;
  let height = width / safeRatio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * safeRatio;
  }
  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Carousel row sizing: EVERY slide (center and peeks alike) shares one
 * height budget per its role/breakpoint; width is always DERIVED from that
 * item's own real ratio (`height * ratio`) — never the other way around.
 * This is what keeps the coverflow track's shape (arrows, dot position,
 * peek visibility) stable while a landscape/portrait/square item still
 * renders at its own true shape: the carousel only ever picks a HEIGHT for
 * a role, it never forces a WIDTH that would make an item's box disagree
 * with its actual content ratio. `maxWidth` is a rarely-binding safety cap
 * only, for pathologically wide ratios that would otherwise blow out the
 * row on narrow viewports.
 */
function ratioBoxSize(ratio: number, height: number, maxWidth: number): { width: number; height: number } {
  const safeRatio = ratio > 0 ? ratio : 16 / 9;
  let width = height * safeRatio;
  let h = height;
  if (width > maxWidth) {
    width = maxWidth;
    h = width / safeRatio;
  }
  return { width: Math.round(width), height: Math.round(h) };
}

/** Mirrors the center stage's former fixed max-width Tailwind classes (`min(Xvw, Ypx)` per breakpoint). */
function stageWidthBudget(viewportWidth: number): number {
  if (viewportWidth >= 1024) return Math.min(viewportWidth * 0.46, 860);
  if (viewportWidth >= 768) return Math.min(viewportWidth * 0.48, 780);
  if (viewportWidth >= 640) return Math.min(viewportWidth * 0.5, 720);
  return Math.min(viewportWidth * 0.78, 480);
}

/** Mirrors the center stage's former fixed max-height Tailwind classes — the viewport-height safety cap. */
function stageHeightBudget(viewportWidth: number): number {
  if (viewportWidth >= 1024) return 580;
  if (viewportWidth >= 768) return 460;
  if (viewportWidth >= 640) return 360;
  return 280;
}

function slideAt(items: CommerceMediaItem[], index: number, offset: number): CommerceMediaItem | null {
  if (!items.length) return null;
  const n = items.length;
  return items[(index + offset + n * 10) % n] ?? null;
}

function SliverMedia({
  item,
  className,
  playSize = 56,
  fit = 'cover',
  onMeasured,
}: {
  item: CommerceMediaItem;
  className?: string;
  playSize?: number;
  /** 'contain' when the parent box already matches this item's real aspect
   *  ratio (the active slide) — cropping isn't needed there. Peeks keep the
   *  default 'cover' since their box shape is independent of real content. */
  fit?: 'cover' | 'contain';
  /** Real pixel dimensions once the browser can report them (image `onLoad`
   *  / video `onLoadedMetadata`) — only wired for the active slide; peeks
   *  don't measure. */
  onMeasured?: (width: number, height: number) => void;
}) {
  const video = isVideoKind(item.kind);
  const src = item.posterUrl ?? item.url;
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
  // A real, directly-playable video file (uploaded /media clip or external .mp4/.webm)
  // — render it as a native <video>, not a broken <img src="…​.mp4">.
  const isPlayableVideoFile =
    video && item.kind !== 'live' && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(item.url || '');

  return (
    <div className={cn('relative w-full h-full bg-[#0a0c18]', className)}>
      {isPlayableVideoFile ? (
        <video
          src={item.url}
          poster={item.posterUrl || undefined}
          controls
          playsInline
          // Metadata-only fetch (a small byte-range request, not the whole
          // file) is required to read real videoWidth/videoHeight — only
          // requested when a caller actually wants to measure (the active
          // slide); peeks keep the original 'none' (no extra network cost
          // for previews that may never be viewed).
          preload={onMeasured ? 'metadata' : 'none'}
          className={cn('w-full h-full bg-black', fitClass)}
          onClick={(e) => e.stopPropagation()}
          onLoadedMetadata={
            onMeasured
              ? (e) => {
                  const v = e.currentTarget;
                  if (v.videoWidth > 0 && v.videoHeight > 0) onMeasured(v.videoWidth, v.videoHeight);
                }
              : undefined
          }
        />
      ) : video && item.kind !== 'live' ? (
        <>
          <img src={src} alt={item.alt ?? ''} className={cn('w-full h-full', fitClass)} loading="lazy" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full bg-[#FF000D] flex items-center justify-center"
              style={{ width: playSize, height: playSize }}
            >
              <div
                className="border-solid border-transparent border-l-white ml-0.5"
                style={{
                  width: 0,
                  height: 0,
                  borderWidth: `${playSize * 0.16}px 0 ${playSize * 0.16}px ${playSize * 0.27}px`,
                }}
              />
            </div>
          </div>
        </>
      ) : item.kind === 'live' && item.embedUrl ? (
        <iframe
          src={item.embedUrl}
          title={item.alt ?? 'Live'}
          // Explicit width/height attributes (not just CSS) — some provider
          // embeds (notably Facebook's plugins/video.php, which we call
          // without a `width=` query param per `videoEmbed.ts`) read the
          // iframe's own HTML sizing attributes for their internal
          // responsive layout, not only the CSS box. This is a same-origin,
          // Choosify-controlled change; it cannot be verified against the
          // provider's actual cross-origin internal layout without a real
          // browser (see the report's disclosed limitation).
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <img
          src={src}
          alt={item.alt ?? ''}
          className={cn('w-full h-full', fitClass)}
          loading="lazy"
          onLoad={
            onMeasured
              ? (e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth > 0 && img.naturalHeight > 0) onMeasured(img.naturalWidth, img.naturalHeight);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

type PeekSlot = {
  offset: number;
  /** Relative size within the side strip (near = larger) */
  size: 'near' | 'mid' | 'far';
};

/** Build left peeks far→near (fills toward the center) */
function leftPeekSlots(count: number): PeekSlot[] {
  const slots: PeekSlot[] = [];
  for (let i = count; i >= 1; i -= 1) {
    const size: PeekSlot['size'] = i === 1 ? 'near' : i === 2 ? 'mid' : 'far';
    slots.push({ offset: -i, size });
  }
  return slots;
}

/** Build right peeks near→far (fills toward the edge) */
function rightPeekSlots(count: number): PeekSlot[] {
  const slots: PeekSlot[] = [];
  for (let i = 1; i <= count; i += 1) {
    const size: PeekSlot['size'] = i === 1 ? 'near' : i === 2 ? 'mid' : 'far';
    slots.push({ offset: i, size });
  }
  return slots;
}

/**
 * Every slide — center AND peeks — is sized the SAME way: a shared height
 * budget (per slot/breakpoint) with WIDTH derived from that item's own real
 * aspect ratio (`ratioBoxSize`, defined below `containFit`). The carousel
 * only scales/positions cards via this height budget and peek opacity; it
 * never forces an item into a fixed box shape or crops it. A peek being
 * partially visible at the row's edge is the CAROUSEL VIEWPORT clipping the
 * card (natural `overflow-hidden` on the side strip) — never the card
 * itself cropping its own media.
 */
const PEEK_HEIGHT_PX: Record<PeekSlot['size'], [number, number, number, number]> = {
  near: [220, 300, 380, 510],
  mid: [200, 270, 340, 430],
  far: [180, 240, 300, 460],
};

function peekHeightBudget(size: PeekSlot['size'], viewportWidth: number): number {
  const [base, sm, md, lg] = PEEK_HEIGHT_PX[size];
  if (viewportWidth >= 1024) return lg;
  if (viewportWidth >= 768) return md;
  if (viewportWidth >= 640) return sm;
  return base;
}

/** Safety cap only — prevents one extreme-ratio peek from unbalancing the row; rarely binds. */
function peekWidthCap(size: PeekSlot['size'], viewportWidth: number): number {
  return Math.min(peekHeightBudget(size, viewportWidth) * 2.4, viewportWidth * 0.55);
}

const PEEK_OPACITY: Record<PeekSlot['size'], string> = {
  near: 'opacity-85 hover:opacity-95',
  mid: 'opacity-45 hover:opacity-60',
  far: 'opacity-40 hover:opacity-55',
};

/**
 * Shared detail-page hero gallery — full-bleed center stage + side peeks.
 * Used by Product/Service Details (`ProductMediaGallery`), Guide Details
 * (`RecommendationMediaGallery`), and Spotlight heroes (`SpotlightContentHero`).
 * Slide animation, mobile peek sizing, fullscreen viewer, and autoplay all live here
 * so every detail hero stays consistent.
 */
export function DetailSliverMediaGallery({
  items,
  ariaLabel = 'Media gallery',
  showAddVideo = false,
  onAddVideo,
  className,
  liveBadge,
  autoplay = true,
  autoplayIntervalMs = AUTO_ADVANCE_MS,
}: DetailSliverMediaGalleryProps) {
  const safeItems = items.length ? items : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  // Real pixel dimensions measured client-side (image `onLoad` / video
  // `onLoadedMetadata`) for the ACTIVE slide only, keyed by item id/url so
  // re-visiting an already-measured item doesn't need to re-measure. This
  // is the real-dimensions tier `resolveItemAspectCss` prefers over any
  // stored/preset aspect hint.
  const [measuredByKey, setMeasuredByKey] = useState<Record<string, { width: number; height: number }>>({});
  // Real available width/height budget for the active stage box, recomputed
  // on resize — feeds `containFit` so the box is sized in JS, not left to
  // CSS `aspect-ratio` auto-resolution (see `containFit`'s comment).
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );
  const total = safeItems.length;
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const swipeRef = useRef<
    { x: number; y: number; active: boolean; moved: boolean; axis: 'x' | 'y' | null } | null
  >(null);
  const suppressClickRef = useRef(false);
  const centerStageRef = useRef<HTMLDivElement>(null);
  const overlayGestureRef = useRef({ x: 0, y: 0, moved: false });
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverPausedRef = useRef(false);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  /** Pause autoplay; schedule resume after idle unless sticky hover/zoom holds it */
  const pauseAutoplayForInteraction = useCallback(() => {
    setAutoplayPaused(true);
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      if (!hoverPausedRef.current) setAutoplayPaused(false);
    }, AUTOPLAY_RESUME_MS);
  }, [clearResumeTimer]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  const goTo = useCallback(
    (nextIndex: number, dirHint?: number) => {
      if (total <= 1) return;
      const normalized = ((nextIndex % total) + total) % total;
      const current = activeIndexRef.current;
      if (normalized === current) return;
      if (dirHint != null) {
        setDirection(dirHint);
      } else {
        const forward = (normalized - current + total) % total;
        const backward = (current - normalized + total) % total;
        setDirection(forward <= backward ? 1 : -1);
      }
      setActiveIndex(normalized);
    },
    [total],
  );

  const goNext = useCallback(() => {
    if (total <= 1) return;
    pauseAutoplayForInteraction();
    goTo(activeIndexRef.current + 1, 1);
  }, [goTo, pauseAutoplayForInteraction, total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    pauseAutoplayForInteraction();
    goTo(activeIndexRef.current - 1, -1);
  }, [goTo, pauseAutoplayForInteraction, total]);

  const goToSlide = useCallback(
    (index: number) => {
      pauseAutoplayForInteraction();
      goTo(index);
    },
    [goTo, pauseAutoplayForInteraction],
  );

  // Auto-advance while idle (shared across all detail heroes)
  useEffect(() => {
    if (!autoplay || total <= 1 || autoplayPaused || zoomOpen) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    const id = window.setInterval(() => {
      if (document.hidden || hoverPausedRef.current) return;
      const current = activeIndexRef.current;
      setDirection(1);
      setActiveIndex((current + 1) % total);
    }, autoplayIntervalMs);

    return () => window.clearInterval(id);
  }, [autoplay, autoplayIntervalMs, autoplayPaused, total, zoomOpen]);

  // Pause when tab is hidden; resume after idle when visible again
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setAutoplayPaused(true);
        clearResumeTimer();
      } else if (!hoverPausedRef.current && !zoomOpen) {
        pauseAutoplayForInteraction();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [clearResumeTimer, pauseAutoplayForInteraction, zoomOpen]);

  // Hold autoplay while fullscreen zoom is open; resume after close + idle
  const wasZoomOpenRef = useRef(false);
  useEffect(() => {
    if (zoomOpen) {
      wasZoomOpenRef.current = true;
      setAutoplayPaused(true);
      clearResumeTimer();
      return;
    }
    if (wasZoomOpenRef.current) {
      wasZoomOpenRef.current = false;
      if (total > 1 && autoplay) pauseAutoplayForInteraction();
    }
  }, [zoomOpen, total, autoplay, clearResumeTimer, pauseAutoplayForInteraction]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomOpen && e.key === 'Escape') {
        setZoomOpen(false);
        return;
      }
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, zoomOpen]);

  // Lock page scroll while the fullscreen viewer is open (modal scroll-lock)
  useEffect(() => {
    if (!zoomOpen) return;
    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
    };

    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    // iOS / mobile: overflow alone often still allows rubber-band scroll
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    const preventTouchScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-zoom-viewport]')) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      html.style.overflow = prev.htmlOverflow;
      document.removeEventListener('touchmove', preventTouchScroll);
      window.scrollTo(0, scrollY);
    };
  }, [zoomOpen]);

  // Desktop: wheel / trackpad scroll navigates while fullscreen is open
  useEffect(() => {
    if (!zoomOpen || total <= 1) return;
    let lastNavAt = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastNavAt < 320) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX < 12 && absY < 12) return;
      e.preventDefault();
      lastNavAt = now;
      if (absX >= absY) {
        if (e.deltaX > 0) goNext();
        else goPrev();
      } else if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [zoomOpen, total, goNext, goPrev]);

  const zoomSwipeRef = useRef<{ x: number; y: number } | null>(null);

  const onZoomSwipeDown = (e: React.PointerEvent) => {
    if (total <= 1) return;
    if ((e.target as HTMLElement).closest('button, a, iframe, video, [data-zoom-viewport]')) return;
    zoomSwipeRef.current = { x: e.clientX, y: e.clientY };
  };

  const onZoomSwipeUp = (e: React.PointerEvent) => {
    const start = zoomSwipeRef.current;
    zoomSwipeRef.current = null;
    if (!start || total <= 1) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  /** Clear any live finger-follow offset on the centre stage. */
  const resetStageDrag = useCallback((withTransition: boolean) => {
    const el = centerStageRef.current;
    if (!el) return;
    el.style.transition = withTransition ? 'transform 220ms ease-out' : 'none';
    el.style.transform = '';
  }, []);

  const onSwipePointerDown = (e: React.PointerEvent) => {
    if (total <= 1 || zoomOpen) return;
    if ((e.target as HTMLElement).closest('a, iframe, video')) return;
    suppressClickRef.current = false;
    swipeRef.current = { x: e.clientX, y: e.clientY, active: true, moved: false, axis: null };
  };

  const onSwipePointerMove = (e: React.PointerEvent) => {
    const s = swipeRef.current;
    if (!s?.active) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) + Math.abs(dy) > DRAG_SLOP) {
      s.moved = true;
      if (!s.axis) s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    // Horizontal intent → damped drag feedback (the real slide plays on release).
    if (s.axis === 'x') {
      const el = centerStageRef.current;
      if (el) {
        el.style.transition = 'none';
        el.style.transform = `translateX(${Math.max(-64, Math.min(64, dx * 0.35))}px)`;
      }
    }
  };

  const onSwipePointerUp = (e: React.PointerEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    resetStageDrag(true);
    if (!start?.active || total <= 1) return;
    // A real drag is never a click (stops the tap from opening the fullscreen viewer).
    if (start.moved) suppressClickRef.current = true;
    if (start.axis === 'y') return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const withSwipeClickGuard = (action: () => void) => (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    action();
  };

  const onHeroMouseEnter = () => {
    hoverPausedRef.current = true;
    setAutoplayPaused(true);
    clearResumeTimer();
  };

  const onHeroMouseLeave = () => {
    hoverPausedRef.current = false;
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      if (!hoverPausedRef.current) setAutoplayPaused(false);
    }, AUTOPLAY_RESUME_MS);
  };

  const onHeroPointerDown = () => {
    // Touch / press — pause immediately; resume after idle (mouse hover uses enter/leave)
    if (hoverPausedRef.current) return;
    pauseAutoplayForInteraction();
  };

  const multi = total > 1;
  /** Mobile: one wider peek per side; desktop keeps the fuller strip */
  const peeksPerSide = useMemo(() => {
    if (total <= 1) return 0;
    if (isMobile) return 1;
    if (total === 2) return 2;
    return Math.min(3, total);
  }, [total, isMobile]);

  const leftSlots = useMemo(() => leftPeekSlots(peeksPerSide), [peeksPerSide]);
  const rightSlots = useMemo(() => rightPeekSlots(peeksPerSide), [peeksPerSide]);

  if (!safeItems.length) return null;

  const current = slideAt(safeItems, activeIndex, 0)!;
  const slideKey = current.url || current.id || String(activeIndex);
  // The active stage's ratio is decided by ONE function,
  // `resolveItemAspectRatio` — real measured pixel dimensions (once an
  // image finishes loading, or a video's metadata arrives) always win over
  // any stored/provider-based preset. This applies to EVERY item, photo or
  // video — an item can be exactly 1:1, 4:5, or any other real ratio, not
  // just a landscape/portrait binary. Peek slides are unaffected — only the
  // active slide's own box derives from this.
  //
  // Keyed by URL first (stable across re-renders even if an upstream
  // `useMemo` ever regenerates item ids) so a re-visited item's measurement
  // is never silently dropped/mismatched.
  const activeKey = current.url || current.id || String(activeIndex);
  const activeMeasured = measuredByKey[activeKey] ?? null;
  const activeRatio = resolveItemAspectRatio(current, activeMeasured);
  // Shared-height, ratio-derived-width (see `ratioBoxSize`) — the carousel
  // picks the HEIGHT for the center role; the active item's own real ratio
  // decides the width. Never the reverse (no fixed width forcing a ratio).
  const stageBudgetWidth = stageWidthBudget(viewportWidth);
  const stageBudgetHeight = stageHeightBudget(viewportWidth);
  const activeStageSize = ratioBoxSize(activeRatio, stageBudgetHeight, stageBudgetWidth);
  // Fullscreen viewer bounds: the OVERLAY stays full-viewport (that's correct
  // and unchanged), but the MEDIA WRAPPER inside it must be the fitted
  // rectangle for the active item's real ratio — not a fixed `86vw × 84vh`
  // box that leaves the actual (contain-fitted) media smaller than its own
  // wrapper. Fullscreen has no shared-height sibling to stay consistent
  // with, so it uses `containFit` (largest rectangle within the viewport
  // bounds) rather than `ratioBoxSize`.
  const zoomBoundsWidth = Math.min(viewportWidth * 0.94, 1400);
  const zoomBoundsHeight = viewportHeight * 0.88;
  const zoomMediaSize = containFit(activeRatio, zoomBoundsWidth, zoomBoundsHeight);
  const handleActiveMeasured = useCallback(
    (width: number, height: number) => {
      setMeasuredByKey((prev) => {
        const existing = prev[activeKey];
        if (existing && existing.width === width && existing.height === height) return prev;
        return { ...prev, [activeKey]: { width, height } };
      });
    },
    [activeKey],
  );
  // Peeks report their own real dimensions too, each keyed by ITS OWN item
  // key — never a single shared/global measurement slot — so the same
  // item keeps its own real ratio whether it's currently center or peek,
  // and a re-visited item doesn't need to re-measure.
  const makePeekMeasuredHandler = useCallback((key: string) => {
    return (width: number, height: number) => {
      setMeasuredByKey((prev) => {
        const existing = prev[key];
        if (existing && existing.width === width && existing.height === height) return prev;
        return { ...prev, [key]: { width, height } };
      });
    };
  }, []);
  const peekKeyFor = (item: CommerceMediaItem) => item.url || item.id || '';
  const peekSizeFor = (item: CommerceMediaItem, slot: PeekSlot) => {
    const key = peekKeyFor(item);
    const measured = measuredByKey[key] ?? null;
    const ratio = resolveItemAspectRatio(item, measured);
    return ratioBoxSize(ratio, peekHeightBudget(slot.size, viewportWidth), peekWidthCap(slot.size, viewportWidth));
  };

  return (
    <section
      className={cn('relative w-full overflow-x-clip', className)}
      aria-label={ariaLabel}
      onMouseEnter={onHeroMouseEnter}
      onMouseLeave={onHeroMouseLeave}
      onPointerDown={onHeroPointerDown}
    >
      <div
        className={cn(
          'flex w-full items-center gap-2.5 sm:gap-3 md:gap-3.5',
          multi ? 'justify-stretch' : 'justify-center px-4',
        )}
        // Browser owns vertical scroll; this row only claims horizontal gestures.
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onSwipePointerDown}
        onPointerMove={onSwipePointerMove}
        onPointerUp={onSwipePointerUp}
        onPointerCancel={() => {
          swipeRef.current = null;
          resetStageDrag(true);
        }}
      >
        {multi ? (
          <div className="flex flex-1 min-w-0 items-center justify-end gap-2.5 sm:gap-3 md:gap-3.5 overflow-hidden">
            {leftSlots.map((slot) => {
              const item = slideAt(safeItems, activeIndex, slot.offset);
              if (!item) return null;
              const peekSize = peekSizeFor(item, slot);
              return (
                <button
                  key={`L${slot.offset}`}
                  type="button"
                  onClick={withSwipeClickGuard(goPrev)}
                  className={cn(
                    'relative shrink-0 overflow-hidden cursor-pointer border-0 p-0 bg-transparent rounded-xl',
                    PEEK_OPACITY[slot.size],
                  )}
                  style={{ width: peekSize.width, height: peekSize.height }}
                  aria-label="Previous media"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${activeIndex}:${peekKeyFor(item)}:${slot.offset}`}
                      className="absolute inset-0"
                      initial={{ opacity: 0.55, x: direction >= 0 ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0.35, x: direction >= 0 ? -12 : 12 }}
                      transition={SLIDE_TRANSITION}
                    >
                      <SliverMedia
                        item={item}
                        playSize={slot.size === 'near' ? 36 : 28}
                        fit="contain"
                        onMeasured={makePeekMeasuredHandler(peekKeyFor(item))}
                      />
                    </motion.div>
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        ) : null}

        {/*
          Center slide: same model as a peek (`ratioBoxSize`) — a shared
          HEIGHT budget for the center role, WIDTH derived from the active
          item's own real ratio. Carousel role picks the height; content
          picks the width. No separate "stable stage" box around this one —
          every slide in the row (peeks included) already sizes itself the
          same way, so the row's shape follows real content consistently
          instead of one item being boxed differently from its neighbors.
        */}
        <div
          ref={centerStageRef}
          className="relative shrink-0 overflow-hidden rounded-2xl md:rounded-none"
          style={{ width: activeStageSize.width, height: activeStageSize.height }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.button
              key={slideKey}
              type="button"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SLIDE_TRANSITION}
              onClick={withSwipeClickGuard(() => setZoomOpen(true))}
              className="absolute inset-0 block w-full h-full border-0 p-0 bg-transparent cursor-zoom-in"
              aria-label="View media fullscreen"
            >
              <SliverMedia item={current} playSize={48} fit="contain" onMeasured={handleActiveMeasured} />
            </motion.button>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-black/50 border-0 text-white text-xs sm:text-sm cursor-pointer flex items-center justify-center z-10"
            aria-label="Zoom media"
          >
            🔍
          </button>

          {liveBadge && (
            <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10 flex flex-col items-start gap-2 max-w-[calc(100%-5rem)]">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-md backdrop-blur-sm',
                  liveBadge.isLive
                    ? 'bg-rose-600/90 text-white'
                    : 'bg-black/60 text-white',
                )}
              >
                <Radio size={12} className={liveBadge.isLive ? 'animate-pulse' : undefined} />
                {liveBadge.label}
              </span>
              {liveBadge.scheduledAt && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
                  <Clock size={11} /> {new Date(liveBadge.scheduledAt).toLocaleString()}
                </span>
              )}
              {liveBadge.ctaLabel && (
                <a
                  href="#spotlight-content-hero"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center min-h-[32px] px-3 py-1.5 bg-[#FF5B00] text-white text-[10px] font-black uppercase tracking-wider rounded-full hover:bg-[#EF3C23] no-underline shadow-md"
                >
                  {liveBadge.ctaLabel}
                </a>
              )}
            </div>
          )}
        </div>

        {multi ? (
          <div className="flex flex-1 min-w-0 items-center justify-start gap-2.5 sm:gap-3 md:gap-3.5 overflow-hidden">
            {rightSlots.map((slot) => {
              const item = slideAt(safeItems, activeIndex, slot.offset);
              if (!item) return null;
              const peekSize = peekSizeFor(item, slot);
              return (
                <button
                  key={`R${slot.offset}`}
                  type="button"
                  onClick={withSwipeClickGuard(goNext)}
                  className={cn(
                    'relative shrink-0 overflow-hidden cursor-pointer border-0 p-0 bg-transparent rounded-xl',
                    PEEK_OPACITY[slot.size],
                  )}
                  style={{ width: peekSize.width, height: peekSize.height }}
                  aria-label="Next media"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${activeIndex}:${peekKeyFor(item)}:${slot.offset}`}
                      className="absolute inset-0"
                      initial={{ opacity: 0.55, x: direction >= 0 ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0.35, x: direction >= 0 ? -12 : 12 }}
                      transition={SLIDE_TRANSITION}
                    >
                      <SliverMedia
                        item={item}
                        playSize={slot.size === 'near' ? 40 : 28}
                        fit="contain"
                        onMeasured={makePeekMeasuredHandler(peekKeyFor(item))}
                      />
                    </motion.div>
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {multi && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 sm:left-4 top-[calc(50%-12px)] -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 border-0 cursor-pointer text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center z-20 text-[#1A1A2E]"
            aria-label="Previous media"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 sm:right-4 top-[calc(50%-12px)] -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 border-0 cursor-pointer text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center z-20 text-[#1A1A2E]"
            aria-label="Next media"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <div className="flex flex-wrap justify-center items-center gap-1.5 mt-5 px-4 max-w-full">
        {safeItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            className={cn(
              'rounded-full border-0 p-0 cursor-pointer transition-all duration-300 ease-out',
              i === activeIndex ? 'w-5 h-2 bg-[#FF5B00]' : 'w-2 h-2 bg-white/35 hover:bg-white/55',
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex}
          />
        ))}
        {showAddVideo && (
          <button
            type="button"
            onClick={onAddVideo}
            className="ml-2.5 bg-white/10 border border-white/25 text-white text-[10.5px] font-bold px-3 py-1 rounded-full cursor-pointer"
          >
            + Add Video
          </button>
        )}
      </div>

      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center overscroll-none"
          onPointerDown={(e) => {
            overlayGestureRef.current = { x: e.clientX, y: e.clientY, moved: false };
            onZoomSwipeDown(e);
          }}
          onPointerMove={(e) => {
            const g = overlayGestureRef.current;
            if (Math.abs(e.clientX - g.x) + Math.abs(e.clientY - g.y) > DRAG_SLOP) g.moved = true;
          }}
          onPointerUp={onZoomSwipeUp}
          onPointerCancel={() => {
            zoomSwipeRef.current = null;
          }}
          onClick={(e) => {
            // Intentional close only: a still click that lands on the backdrop
            // itself. Never after a scroll / swipe / pan / pinch, and never from
            // a click that bubbled out of the media or a control.
            if (e.target === e.currentTarget && !overlayGestureRef.current.moved) {
              setZoomOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed media"
        >
          <div
            style={{ width: zoomMediaSize.width, height: zoomMediaSize.height }}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideoKind(current.kind) ? (
              <div
                className="w-full h-full"
                onPointerDown={(e) => {
                  if (total <= 1) return;
                  zoomSwipeRef.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerUp={onZoomSwipeUp}
              >
                <SliverMedia item={current} playSize={64} fit="contain" onMeasured={handleActiveMeasured} />
              </div>
            ) : (
              <PinchZoomImage
                src={current.url}
                alt={current.alt ?? ''}
                onNavigate={
                  total > 1
                    ? (dir) => {
                        if (dir > 0) goNext();
                        else goPrev();
                      }
                    : undefined
                }
              />
            )}
          </div>
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 border-0 text-white cursor-pointer flex items-center justify-center z-10"
                aria-label="Previous media"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 border-0 text-white cursor-pointer flex items-center justify-center z-10"
                aria-label="Next media"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-[calc(1rem+env(safe-area-inset-top,0px))] right-4 sm:top-6 sm:right-8 w-10 h-10 rounded-full bg-white/15 border-0 text-white text-lg cursor-pointer flex items-center justify-center z-10"
            aria-label="Close zoom"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
