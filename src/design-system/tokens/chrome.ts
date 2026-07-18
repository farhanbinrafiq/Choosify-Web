/**
 * Choosify 3.0 shared chrome class strings — Navbar / Footer / listing heroes.
 */
import { colors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { contentWidth } from './spacing';

export const chrome = {
  headerBg: colors.chrome.headerBg,
  footerBg: colors.chrome.footerBg,
  maxWidth: contentWidth.shell,
  searchPillRadius: radius.full,
  cardRadius: radius['2xl'],
  cardShadow: shadows.sm,
  discoverPillBg: colors.brand.accent.discoverGradient,
  orange: colors.brand.orange.primary,
  navy: colors.brand.navy.ink,
} as const;

/** Section vertical rhythm — mobile 40 / tablet 48 / desktop 64 */
export const sectionPy = 'py-10 md:py-12 lg:py-16';

export const contentMax = 'max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10';
