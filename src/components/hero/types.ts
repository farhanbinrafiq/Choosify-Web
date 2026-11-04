import type { LucideIcon } from 'lucide-react';

export type HeroVariant = 'homepage' | 'category' | 'product' | 'brand' | 'discover' | 'search' | 'dashboard';

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  /** Still image / poster (used alone for photo slides, or as video poster). */
  image?: string;
  /** Optional muted looping background video — hybrid banner support. */
  videoUrl?: string;
  /** Website Studio: phone-specific image / video (same type as the desktop media). */
  mobileImage?: string;
  mobileVideoUrl?: string;
  /** Image description for screen readers (empty = decorative). */
  alt?: string;
  /** Focal point in % (object-position) — which part stays visible when cropped. */
  focalX?: number;
  focalY?: number;
  gradient?: string;
};

export type HeroStatItem = {
  id: string;
  label: string;
  value: string;
  icon?: LucideIcon;
};

export type HeroAction = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
};
