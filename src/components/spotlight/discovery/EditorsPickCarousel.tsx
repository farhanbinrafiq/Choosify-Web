import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { PLACEHOLDER_IMAGE } from '../../../constants';
import { SponsoredCardChrome } from '../../commerce/SponsoredCardChrome';
import { AdSlotPaginationRail } from '../../commerce/AdSlotCarousel';
import type { SpotlightContentType } from '../../../types/spotlight/experience/contentTypes';
import { getSpotlightContentCtaLabel } from '../../../types/spotlight/experience/cta';

export type EditorsPickItem = {
  id: string;
  title: string;
  href: string;
  image?: string;
  /** Publisher / channel — used for logo badge + pagination label */
  sourceName: string;
  sourceLogoUrl?: string;
  meta?: string;
  contentType?: SpotlightContentType;
  isLive?: boolean;
  mediaKind?: 'image' | 'video';
  /** Pre-resolved platform CTA; used when contentType is absent */
  ctaLabel?: string;
};

export type EditorsPickCarouselProps = {
  items: EditorsPickItem[];
  autoplayMs?: number;
  className?: string;
};

/**
 * CTA copy for Editor's Pick — aligns with Universal Content Detail /
 * `getSpotlightContentCtaLabel`, with explicit video / live verbs.
 *
 * Live is supported in the mapper if an item is ever live-flagged, but the
 * Discover feed currently builds this carousel from blog/editorial lanes only
 * (not the Live lane).
 */
export function resolveEditorsPickCtaLabel(item: EditorsPickItem): string {
  if (item.isLive || item.contentType === 'live') return 'Watch Live';
  if (item.contentType === 'livestream_replay') return 'Watch Replay';
  if (item.mediaKind === 'video') return 'Watch Now';
  if (item.contentType) return getSpotlightContentCtaLabel(item.contentType);
  return item.ctaLabel || 'Read Guide';
}

/** Same rhythm as Deal of the Day — readable, not rushy */
const EDITORS_PICK_AUTOPLAY_MS = 5500;

/**
 * Fixed frame (Deal of the Day pattern) — height never changes between slides.
 * Same navy / accent color treatment as Deal of the Day; editorial label + carousel content stay distinct.
 */
const CARD_HEIGHT = 'h-[460px]';
const IMAGE_HEIGHT = 'h-[220px]';

export function EditorsPickCarousel({
  items,
  autoplayMs = EDITORS_PICK_AUTOPLAY_MS,
  className,
}: EditorsPickCarouselProps) {
  const slides = items.slice(0, 5);
  const slidesKey = slides.map((d) => d.id).join('|');
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setIndex(0);
    setFadeKey((k) => k + 1);
  }, [slidesKey]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
      setFadeKey((k) => k + 1);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [slides.length, autoplayMs, slidesKey]);

  if (slides.length === 0) return null;

  const pick = slides[Math.min(index, slides.length - 1)];

  const goTo = (next: number) => {
    setIndex(next);
    setFadeKey((k) => k + 1);
  };

  return (
    <div
      className={cn(
        'choosify-dark-surface rounded-xl p-4 text-white w-full overflow-hidden flex flex-col',
        CARD_HEIGHT,
        className,
      )}
      aria-roledescription="carousel"
      aria-label="Editor's Pick"
    >
      <div className="flex justify-between items-center gap-2 mb-3 h-[16px] shrink-0">
        <div className="text-[12px] font-extrabold text-[#FF5B00] tracking-[0.3px] truncate">
          EDITOR&apos;S PICK
        </div>
        <div className="text-[10px] font-bold text-white/50 shrink-0">
          {slides.length > 1 ? `${index + 1}/${slides.length}` : null}
        </div>
      </div>

      <div key={fadeKey} className="flex flex-col flex-1 min-h-0 overflow-hidden animate-fade-in">
        <Link
          to={pick.href}
          className={cn(
            'relative w-full shrink-0 rounded-[10px] overflow-hidden mb-3 block',
            IMAGE_HEIGHT,
          )}
        >
          <img
            src={pick.image || PLACEHOLDER_IMAGE}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <SponsoredCardChrome
            brandName={pick.sourceName}
            logoUrl={pick.sourceLogoUrl || pick.image}
            size="sm"
            badgeLabel="EDITOR'S PICK"
          />
        </Link>

        <div className="h-[36px] mb-1.5 shrink-0 text-[13px] font-bold text-white leading-snug line-clamp-2 overflow-hidden">
          {pick.title}
        </div>

        <div className="h-[16px] mb-3 shrink-0 text-[11px] text-white/50 truncate overflow-hidden">
          {pick.meta || pick.sourceName || '\u00a0'}
        </div>

        <Link
          to={pick.href}
          className="mt-auto block w-full shrink-0 text-center bg-[#FF5B00] text-white py-2.5 rounded-lg text-[12px] font-bold no-underline hover:brightness-110 transition-[filter]"
        >
          {resolveEditorsPickCtaLabel(pick)}
        </Link>
      </div>

      <div className="mt-3 h-9 shrink-0 flex items-center justify-center overflow-hidden">
        {slides.length > 1 ? (
          <AdSlotPaginationRail
            items={slides.map((slide) => ({
              label: slide.sourceName || slide.title,
              imageUrl: slide.sourceLogoUrl || slide.image,
            }))}
            activeIndex={index}
            position="below"
            ariaLabel="Editor's Pick slides"
            ringOffsetClassName="ring-offset-[#1a1a2e]"
            className="mt-0"
            getKey={(icon, i) => `${slides[i]?.id ?? i}-${icon.label}`}
            onSelect={goTo}
          />
        ) : null}
      </div>
    </div>
  );
}
