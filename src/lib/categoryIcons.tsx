import React from 'react';
import {
  Baby,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  CalendarCheck,
  Car,
  Cpu,
  Download,
  Dumbbell,
  Factory,
  Gamepad2,
  Gavel,
  Gem,
  HeartHandshake,
  HeartPulse,
  Home,
  Key,
  Landmark,
  Monitor,
  Package,
  PartyPopper,
  PawPrint,
  Plane,
  Recycle,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Tv,
  Utensils,
  Wrench,
} from 'lucide-react';

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string; color?: string }>> = {
  Baby,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  CalendarCheck,
  Car,
  Cpu,
  Download,
  Dumbbell,
  Factory,
  Gamepad2,
  Gavel,
  Gem,
  HeartHandshake,
  HeartPulse,
  Home,
  Key,
  Landmark,
  Monitor,
  Package,
  PartyPopper,
  PawPrint,
  Plane,
  Recycle,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Tv,
  Utensils,
  Wrench,
};

/** Gradient id referenced by every category icon's stroke — keep in sync with <CategoryIconGradientDefs>. */
export const CATEGORY_ICON_GRADIENT_ID = 'choosify-category-icon-gradient';

/** Mount once per page — defines the shared stroke gradient (matches footer-brand-gradient's warm-to-dark tone). */
export function CategoryIconGradientDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <linearGradient id={CATEGORY_ICON_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EB4501" />
          <stop offset="55%" stopColor="#CF4400" />
          <stop offset="100%" stopColor="#1A1D4E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * All category icons share the same gradient stroke — no per-category colors, stays outline/stroke style.
 * Pass `colorOverride` (e.g. "#fff") when the icon sits on a surface already using the gradient as a background.
 */
export function getCategoryIconComponent(_catName: string, iconName: string, colorOverride?: string) {
  const IconComponent = CATEGORY_ICON_MAP[iconName] || Package;
  return <IconComponent className="w-full h-full" color={colorOverride ?? `url(#${CATEGORY_ICON_GRADIENT_ID})`} />;
}
