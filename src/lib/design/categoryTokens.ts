/** Categories page DS-V2.1 layout tokens */

import { LISTING_PAGE_MAX_WIDTH } from './dcListingTokens';

/** Alias — Categories hero + sticky quick-nav share the Deals listing silhouette */
export const CATEGORY_LISTING_MAX_WIDTH = LISTING_PAGE_MAX_WIDTH;

export const CATEGORY_CONTENT_MAX = `${LISTING_PAGE_MAX_WIDTH} mx-auto px-5 sm:px-8 lg:px-10`;

export const CATEGORY_CARD_RADIUS = 'rounded-[20px]';

export const CATEGORY_CARD_HOVER =
  'transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl';

export const CATEGORY_SECTION_PY = 'py-12 md:py-16 lg:py-20';

export const CATEGORY_QUICK_NAV_ITEMS = [
  { id: 'fashion', label: 'Fashion', sub: '230 Products', letter: 'F', bg: '#FFF3EA', filterType: 'Fashion' },
  { id: 'electronics', label: 'Tech & Electronics', sub: '270 Products', letter: 'T', bg: '#EAF1FD', filterType: 'Electronics' },
  { id: 'home', label: 'Home & Living', sub: '310 Products', letter: 'H', bg: '#E6F9EA', filterType: 'Home & Living' },
  { id: 'beauty', label: 'Beauty & Health', sub: '350 Products', letter: 'B', bg: '#FDECEC', filterType: 'Beauty' },
  { id: 'sports', label: 'Sports & Outdoors', sub: '390 Products', letter: 'S', bg: '#FEF3E2', filterType: 'Sports' },
  { id: 'more', label: 'More Categories', sub: 'Browse all', letter: '+', bg: '#F4F7F9', filterType: null as string | null },
] as const;
