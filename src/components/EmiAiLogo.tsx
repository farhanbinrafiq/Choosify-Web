import React from 'react';
import { cn } from '../lib/utils';

type EmiAiLogoProps = {
  className?: string;
  size?: number;
  title?: string;
  /**
   * `icon` — square padded asset for avatars/FABs (default).
   * `full` — original portrait SVG (large heroes / 404).
   */
  variant?: 'icon' | 'full';
};

const ICON_SRC = '/emi-ai-logo-icon.png';
const FULL_SRC = '/emi-ai-logo.svg';

/**
 * Canonical Emi AI mascot presentation — the ONLY component that renders the
 * Emi artwork. Every call site (chat panel header, FAB, 404 page, compare
 * bar, product assistant, discovery filters, etc.) renders through this one
 * component, so a fix here reaches all of them; there is no second logo
 * implementation anywhere in the app.
 *
 * Deliberately simple, self-contained rendering model — no shared/global CSS
 * classes, no transforms, no negative positioning, no crop-dependent sizing:
 *   - A fixed-size square outer box (`size` controls both dimensions).
 *   - `icon` variant: a white, rounded-square shell. The artwork sits on an
 *     inset padded box *inside* that shell (not flush against the rounded
 *     corners), so the corner radius can only ever clip the plain white
 *     background — never the artwork itself.
 *   - `full` variant: no shell/background/clipping at all — the raw portrait
 *     artwork at `object-fit: contain`, so the complete mark (eye, a.i.
 *     dots, lower circular body, emi wordmark/notch) is always fully
 *     visible with even margin on every side.
 * Use `full` for large portrait displays (404, heroes); `icon` (default) for
 * avatars/FABs/inline chips.
 */
export function EmiAiLogo({
  className,
  size = 28,
  title = 'Emi. A.I',
  variant = 'icon',
}: EmiAiLogoProps) {
  const isIcon = variant === 'icon';
  const src = isIcon ? ICON_SRC : FULL_SRC;
  // Keeps the artwork clear of the icon shell's rounded corners — the
  // asset itself already has margin, this is an extra guarantee so the
  // radius/overflow-hidden below can never touch the mark.
  const padding = isIcon ? Math.max(2, Math.round(size * 0.12)) : 0;

  return (
    <span
      className={cn('inline-flex items-center justify-center shrink-0', className)}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        boxSizing: 'border-box',
        padding,
        borderRadius: isIcon ? '22%' : undefined,
        backgroundColor: isIcon ? '#FFFFFF' : undefined,
        overflow: isIcon ? 'hidden' : undefined,
      }}
      role="img"
      aria-label={title}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        title={title}
        draggable={false}
        className="block w-full h-full object-contain object-center pointer-events-none select-none"
      />
    </span>
  );
}
