/** Shared listing-page tokens from Choosify.dc.html */

export const DC_PAGE_BG = '#F4F7F9';

/**
 * Master listing silhouette (Deals page) — navy hero + overlapping white sticky
 * bar must share this max-width so edges align (no dark gaps on the sides).
 */
export const LISTING_PAGE_MAX_WIDTH = 'max-w-[1440px]';

/** Content column under listing heroes (max-width + side gutters) */
export const DC_CONTENT_MAX = `${LISTING_PAGE_MAX_WIDTH} mx-auto px-5 sm:px-8 lg:px-10`;
export const DC_CARD =
  'bg-white border border-[#E8EDF2] rounded-[14px] shadow-[0_12px_30px_rgba(0,0,0,0.08)]';
export const DC_STICKY_BAR = `${DC_CARD} sticky z-40 h-[88px] px-[26px] flex items-center gap-[22px] overflow-x-auto`;

/** Navy listing / discover hero background — shared dark-surface token (footer-sourced) */
export const DC_LISTING_HERO_BG = 'var(--gradient-dark-surface)';
export const DARK_SURFACE_GRADIENT_CLASS = 'choosify-dark-surface';
/**
 * Emi logo gradient — mirrors public/emi-ai-logo.svg primary radialGradient
 * (#3a7bd5 @ 0% → #ff0188 @ 99%). Prefer CSS `var(--gradient-emi)` / `.choosify-emi-gradient`.
 */
export const EMI_GRADIENT_FROM = '#3a7bd5';
export const EMI_GRADIENT_TO = '#ff0188';
export const EMI_GRADIENT =
  'radial-gradient(circle at 35% 30%, #3a7bd5 0%, #ff0188 99%)';
/** Tailwind/className for filled Emi gradient surfaces */
export const EMI_GRADIENT_CLASS = 'choosify-emi-gradient';
