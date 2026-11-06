import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useHomepageHeroSlides } from './useHomepageHeroSlides';
import type { HeroStatItem, HeroVariant } from './types';

interface HeroProps {
  variant: HeroVariant;
  /** @deprecated Choosify.dc.html Home hero is image-only */
  stats?: HeroStatItem[];
  /** @deprecated Choosify.dc.html Home hero has no search */
  showSearch?: boolean;
  className?: string;
}

const PHOTO_AUTOPLAY_MS = 6000;
const MOBILE_QUERY = '(max-width: 767px)';

/** True on phone-width screens — picks a slide's mobile video (images use <picture>). */
function useIsMobileViewport(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(MOBILE_QUERY).matches : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const on = () => setMobile(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return mobile;
}

const focalStyle = (x?: number, y?: number): React.CSSProperties | undefined =>
  typeof x === 'number' || typeof y === 'number' ? { objectPosition: `${x ?? 50}% ${y ?? 50}%` } : undefined;
const VIDEO_AUTOPLAY_MS = 10000;

/**
 * Homepage hero — hybrid sliding banner:
 * full-bleed photo and/or muted looping video per slide,
 * straight bottom edge, arrows + dots.
 */
export function Hero({ variant, className }: HeroProps) {
  const slides = useHomepageHeroSlides();
  const isMobile = useIsMobileViewport();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  // Desktop / tablet: the hero takes the EXACT shape of the slide's design (edge to edge, never
  // zoomed or cropped). Ratios are read from the loaded image / video.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const noteRatio = (id: string, w: number, h: number) => {
    if (!w || !h) return;
    const r = w / h;
    setRatios((prev) => (prev[id] && Math.abs(prev[id] - r) < 0.001 ? prev : { ...prev, [id]: r }));
  };
  const sectionRef = useRef<HTMLElement | null>(null);
  // The first panel overlaps only the faded bottom 20% of the hero (DcHomePanel reads this).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--home-hero-overlap', `${Math.round(h * 0.2)}px`);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--home-hero-overlap');
    };
  }, [slides.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  // Play active video slide; pause & reset the rest.
  useEffect(() => {
    slides.forEach((slide, i) => {
      const el = videoRefs.current.get(slide.id);
      if (!el) return;
      if (i === currentIndex && slide.videoUrl) {
        void el.play().catch(() => {
          /* autoplay may be blocked until gesture — poster still shows */
        });
      } else {
        el.pause();
        try {
          el.currentTime = 0;
        } catch {
          /* ignore seek errors on unloaded media */
        }
      }
    });
  }, [currentIndex, slides]);

  useEffect(() => {
    if (variant !== 'homepage' || slides.length <= 1 || !autoplay) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }
    const current = slides[currentIndex];
    const delay = current?.videoUrl ? VIDEO_AUTOPLAY_MS : PHOTO_AUTOPLAY_MS;
    autoplayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, delay);
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [slides, slides.length, autoplay, variant, currentIndex]);

  if (variant !== 'homepage' || !slides.length) return null;

  const goPrev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // One steady frame (no page jump between slides): the FIRST slide's exact shape. A slide of a
  // different shape is shown whole (fitted) over a soft blurred copy of itself — never zoomed or cut.
  const first = slides[0];
  const frameRatio = Math.min(4.5, Math.max(1.6, (first && ratios[first.id]) || 1920 / 750));
  const phoneCrop = isMobile && slides.some((s) => s.mobileImage);
  const fits = (id: string) => {
    const r = ratios[id];
    return !r || Math.abs(r - frameRatio) / frameRatio < 0.04;
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        // Phones: fixed height (phone image or centred crop). From tablets up: the slide's own shape,
        // full width — the design shows whole; its bottom fades into the page under the first panel.
        'relative isolate z-0 w-full overflow-hidden select-none',
        phoneCrop ? 'h-[320px] sm:h-[400px]' : '[aspect-ratio:var(--hero-ratio)]',
        className,
      )}
      style={{ ['--hero-ratio' as string]: String(frameRatio) } as React.CSSProperties}
      aria-label="Homepage hero"
      aria-roledescription="carousel"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {slides.map((slide, i) => {
        const isActive = i === currentIndex;
        return (
          <div
            key={slide.id}
            {...(isActive && slide.adId ? { 'data-ad-id': slide.adId, 'data-ad-slot': 'HOME_HERO' } : {})}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none',
            )}
            aria-hidden={!isActive}
          >
            {slide.videoUrl ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current.set(slide.id, el);
                  else videoRefs.current.delete(slide.id);
                }}
                src={isMobile && slide.mobileVideoUrl ? slide.mobileVideoUrl : slide.videoUrl}
                poster={slide.image}
                muted
                loop
                playsInline
                preload={i === 0 ? 'auto' : 'metadata'}
                onLoadedMetadata={(e) => noteRatio(slide.id, e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
                className="w-full h-full object-cover"
                style={focalStyle(slide.focalX, slide.focalY)}
                aria-label={slide.title || 'Hero video'}
              />
            ) : slide.image ? (
              <picture className="relative block w-full h-full">
                {slide.mobileImage && <source media={MOBILE_QUERY} srcSet={slide.mobileImage} />}
                {!phoneCrop && !fits(slide.id) ? (
                  <img src={slide.image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-80" />
                ) : null}
                <img
                  src={slide.image}
                  alt={slide.alt || ''}
                  className={cn('relative w-full h-full', phoneCrop || fits(slide.id) ? 'object-cover' : 'object-contain object-top')}
                  style={phoneCrop ? focalStyle(slide.focalX, slide.focalY) : undefined}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  data-testid="hero-slide-image"
                  onLoad={(e) => noteRatio(slide.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                />
              </picture>
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    slide.gradient ||
                    'linear-gradient(135deg, var(--choosify-navy) 0%, #1A1D4E 50%, var(--choosify-orange) 160%)',
                }}
              />
            )}
            {/* Uploaded designs are shown clean (no tint); only the built-in fallback gets the branded wash. */}
            {!slide.image && !slide.videoUrl ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5 pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--choosify-hero-overlay)' }} />
              </>
            ) : null}
            {slide.sponsoredLabel && (
              <span className="absolute left-4 top-4 z-[2] rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white" data-testid="hero-sponsored-chip">
                {slide.sponsoredLabel}
              </span>
            )}
            {slide.primaryCtaLink && isActive ? (
              <span
                className="pointer-events-none absolute bottom-[30%] right-4 z-[3] inline-flex items-center gap-1.5 rounded-full bg-[#FF5B00] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-lg sm:right-8 sm:px-5 sm:py-2.5 sm:text-[13px] md:bottom-[26%] lg:right-[120px]"
                data-testid="hero-slide-button"
              >
                {slide.buttonText || 'Learn more'}
                <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            ) : null}
            {slide.primaryCtaLink && isActive && (slide.externalLink ? (
              <a
                href={slide.primaryCtaLink}
                target="_blank"
                rel={slide.sponsoredLabel ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
                className="absolute inset-0 z-[1]"
                aria-label={slide.primaryCtaText || slide.title || 'View campaign'}
              />
            ) : (
              <Link
                to={slide.primaryCtaLink}
                className="absolute inset-0 z-[1]"
                aria-label={slide.primaryCtaText || slide.title || 'View campaign'}
              />
            ))}
          </div>
        );
      })}

      {/* Soft bottom fade: a progressive blur + the page colour, so the hero melts into the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[22%] backdrop-blur-[5px]"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 85%)', maskImage: 'linear-gradient(to bottom, transparent, #000 85%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[26%] bg-gradient-to-b from-transparent via-[#F0F8FF]/50 to-[#F0F8FF]"
        data-testid="hero-bottom-fade"
      />

      {slides.length > 1 && (
        <>
          {/* No arrow buttons: round picture icons switch slides (same style as the banner-ad switcher). */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[30%] md:bottom-[24%] z-20 flex items-center gap-2 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-sm" data-testid="hero-slide-icons">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setAutoplay(false);
                  setCurrentIndex(i);
                }}
                title={slide.title || `Slide ${i + 1}`}
                className={cn(
                  'shrink-0 overflow-hidden rounded-full border-0 p-0 transition-all duration-300 h-7 w-7 sm:h-9 sm:w-9',
                  i === currentIndex
                    ? 'ring-2 ring-[#FF5B00] ring-offset-1 ring-offset-black/20 scale-110'
                    : 'opacity-60 hover:opacity-90 grayscale-[30%]',
                )}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === currentIndex}
              >
                {slide.image ? (
                  <img src={slide.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#1A1D4E] text-[10px] font-extrabold text-white">
                    {(slide.title || String(i + 1)).trim().charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
