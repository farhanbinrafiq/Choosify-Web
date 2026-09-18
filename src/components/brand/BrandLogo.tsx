import React from 'react';
import { cn } from '../../lib/utils';

const URL_RE = /^(https?:|data:|\/)/;

/** True when a value is a usable image reference (URL / data URI / absolute path). */
export function isBrandLogoUrl(value?: string | null): value is string {
  return typeof value === 'string' && URL_RE.test(value.trim());
}

export function brandInitials(name?: string): string {
  const n = (name || '').trim();
  if (!n) return 'BR';
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return n.slice(0, 2).toUpperCase();
}

/**
 * The image-fitting rule for a brand logo. The mark fills the whole avatar
 * canvas — no width/height cap, no padding, centred — so there is never an
 * artificial CSS gap between the logo and its (usually circular) frame. A
 * full-bleed square logo has its corners trimmed by the frame's `overflow:
 * hidden`, exactly like an avatar should; `object-contain` (never `cover`)
 * keeps wide or tall marks intact instead of cropping the brand mark.
 */
export const BRAND_LOGO_IMG_CLASS = 'w-full h-full object-contain';

export interface BrandLogoProps {
  src?: string | null;
  name: string;
  /** px size of the square avatar box */
  size?: number;
  shape?: 'circle' | 'rounded';
  /** soft drop shadow for separation from a colored/gradient header (no border stroke) */
  ring?: boolean;
  className?: string;
}

/**
 * Shared brand identity image — one circular (or softly-rounded) avatar used by
 * Brand listing cards and the public Brand Details header so logo fitting can
 * never diverge again. Neutral Choosify initials fallback when there is no
 * usable logo (or the image fails to load).
 */
export function BrandLogo({
  src,
  name,
  size = 64,
  shape = 'circle',
  ring = false,
  className,
}: BrandLogoProps) {
  const hasImg = isBrandLogoUrl(src);
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden bg-white shrink-0 select-none',
        shape === 'circle' ? 'rounded-full' : 'rounded-xl',
        ring && 'shadow-[0_4px_10px_rgba(0,0,0,0.14)]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {hasImg ? (
        <img
          src={src as string}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={BRAND_LOGO_IMG_CLASS}
          onError={(e) => {
            const el = e.currentTarget;
            el.style.display = 'none';
            el.nextElementSibling?.removeAttribute('hidden');
          }}
        />
      ) : null}
      <span
        hidden={hasImg}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1D4E] to-[#2A2E6B] font-extrabold text-white"
        style={{ fontSize: Math.max(11, Math.round(size * 0.34)) }}
      >
        {brandInitials(name)}
      </span>
    </span>
  );
}
