/** Homepage tokens — sourced from Choosify.dc.html (authoritative design) */

export type HomeSectionTone =
  | 'white'
  | 'soft-gray'
  | 'soft-blue'
  | 'soft-orange'
  | 'dark-band';

export const HOME_SECTION_TONE_CLASS: Record<HomeSectionTone, string> = {
  white: 'bg-white',
  'soft-gray': 'bg-[#F4F7F9]',
  'soft-blue': 'bg-[#F4F8FC]',
  'soft-orange': 'bg-gradient-to-b from-[#FFF9F5] via-[#FFFCFA] to-white',
  'dark-band': 'choosify-dark-surface text-white',
};

/** Page canvas from Choosify.dc.html */
export const HOME_PAGE_BG = '#F4F7F9';

/** max-width:1280px; padding:0 40px — Choosify.dc.html Home */
export const HOME_CONTENT_MAX = 'max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10';

/** Elevated white section card from dc.html */
export const HOME_PANEL =
  'bg-white rounded-[14px] px-5 pt-[22px] pb-1.5 sm:px-6 shadow-[0_16px_40px_rgba(0,0,0,0.12)]';

export const HOME_PANEL_GAP = 'mt-6';

/** Vertical rhythm — tighter to match dc.html panel stacking */
export const HOME_SECTION_PY = 'py-0';

export const HOME_CARD_HOVER =
  'transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md';

export const HOME_SECTION_SEQUENCE: HomeSectionTone[] = [
  'white',
  'soft-gray',
  'white',
  'soft-gray',
  'white',
  'soft-blue',
  'white',
  'soft-gray',
  'white',
  'soft-gray',
  'soft-orange',
];

/** Category icon chip palette (dc.html circular badges) */
export const HOME_CATEGORY_CHIP_COLORS = [
  '#FFE8DC',
  '#E8F0FF',
  '#E8FFF0',
  '#FFF0E8',
  '#F0E8FF',
  '#E8FFFA',
  '#FFF8E8',
  '#FFE8F0',
  '#E8F8FF',
  '#F5FFE8',
  '#FFEDE8',
  '#EDE8FF',
] as const;
