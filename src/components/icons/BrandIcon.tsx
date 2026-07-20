import React from 'react';
import { BRAND_ICON, type BrandIconKey, socialIconSrc } from './brandIcons';

interface BrandIconProps {
  name?: BrandIconKey;
  platform?: string;
  size?: number;
  className?: string;
  alt?: string;
}

/** Renders a provided brand PNG (Google, Facebook, payment marks, etc.). */
export function BrandIcon({ name, platform, size = 20, className, alt }: BrandIconProps) {
  const src = name ? BRAND_ICON[name] : platform ? socialIconSrc(platform) : undefined;
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt ?? ''}
      width={size}
      height={size}
      className={className ?? 'object-contain'}
      draggable={false}
      aria-hidden={alt ? undefined : true}
    />
  );
}
