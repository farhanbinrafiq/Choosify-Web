/**
 * Category → section title dictionary for Content Detail.
 * Add a row here when introducing a new vertical — section components do not hardcode titles.
 */

import { CATEGORIES_LIST } from '../../../data/categoriesData';

export interface CategorySectionLabels {
  /** Ranked framing when ≥3 top picks (never used for live) */
  top3Title: string;
  /** Unranked "mentioned" list framing */
  itemsMentionedTitle: string;
  /** Brands list (buying guides) */
  brandsMentionedTitle: string;
  /** Singular noun for copy ("gadget", "stay") */
  itemNounSingular: string;
  itemNounPlural: string;
}

const DEFAULT_LABELS: CategorySectionLabels = {
  top3Title: 'Top 3 Picks',
  itemsMentionedTitle: 'Products Mentioned',
  brandsMentionedTitle: 'Brands Mentioned',
  itemNounSingular: 'product',
  itemNounPlural: 'products',
};

/**
 * Primary keys match CATEGORIES_LIST names.
 * Aliases (Tech, Hotels & Travel, Pets & Kids) normalize publisher/admin shorthand.
 */
export const CATEGORY_SECTION_LABELS: Record<string, CategorySectionLabels> = {
  'Tech & Electronics': {
    top3Title: 'Top 3 Gadgets',
    itemsMentionedTitle: 'Gadgets Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'gadget',
    itemNounPlural: 'gadgets',
  },
  'Mobile & Wearable': {
    top3Title: 'Top 3 Devices',
    itemsMentionedTitle: 'Devices Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'device',
    itemNounPlural: 'devices',
  },
  'Fashion & Lifestyle': {
    top3Title: 'Top 3 Looks',
    itemsMentionedTitle: 'Looks Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'look',
    itemNounPlural: 'looks',
  },
  'Beauty & Personal Care': {
    top3Title: 'Top 3 Beauty Picks',
    itemsMentionedTitle: 'Beauty Products Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'product',
    itemNounPlural: 'products',
  },
  'Travel & Hospitality': {
    top3Title: 'Top 3 Stays',
    itemsMentionedTitle: 'Stays Mentioned',
    brandsMentionedTitle: 'Brands & Properties Mentioned',
    itemNounSingular: 'stay',
    itemNounPlural: 'stays',
  },
  'Family & Kids': {
    top3Title: 'Top Picks for Little Ones',
    itemsMentionedTitle: 'Products Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'product',
    itemNounPlural: 'products',
  },
  'Home & Living': {
    top3Title: 'Top 3 Home Picks',
    itemsMentionedTitle: 'Home Products Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'product',
    itemNounPlural: 'products',
  },
  'Gaming & Entertainment': {
    top3Title: 'Top 3 Games & Gear',
    itemsMentionedTitle: 'Games & Gear Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'title',
    itemNounPlural: 'titles',
  },
  'Food & Essentials': {
    top3Title: 'Top 3 Essentials',
    itemsMentionedTitle: 'Essentials Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'item',
    itemNounPlural: 'items',
  },
  'Health & Wellness': {
    top3Title: 'Top 3 Wellness Picks',
    itemsMentionedTitle: 'Wellness Products Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'product',
    itemNounPlural: 'products',
  },
  'Jewelry & Accessories': {
    top3Title: 'Top 3 Pieces',
    itemsMentionedTitle: 'Pieces Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'piece',
    itemNounPlural: 'pieces',
  },
  'Vehicles & Automotive': {
    top3Title: 'Top 3 Vehicles',
    itemsMentionedTitle: 'Vehicles Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'vehicle',
    itemNounPlural: 'vehicles',
  },
  'TV & Appliances': {
    top3Title: 'Top 3 Appliances',
    itemsMentionedTitle: 'Appliances Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'appliance',
    itemNounPlural: 'appliances',
  },
  'Eyewear & Fragrances': {
    top3Title: 'Top 3 Picks',
    itemsMentionedTitle: 'Products Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'product',
    itemNounPlural: 'products',
  },
  'Hobbies & Creativity': {
    top3Title: 'Top 3 Hobby Picks',
    itemsMentionedTitle: 'Hobby Products Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'product',
    itemNounPlural: 'products',
  },
  'Education & Learning': {
    top3Title: 'Top 3 Learning Picks',
    itemsMentionedTitle: 'Learning Products Mentioned',
    brandsMentionedTitle: 'Brands Mentioned',
    itemNounSingular: 'product',
    itemNounPlural: 'products',
  },
};

/** Admin / publisher shorthand → canonical CATEGORIES_LIST name */
const CATEGORY_ALIASES: Record<string, string> = {
  tech: 'Tech & Electronics',
  'tech & electronics': 'Tech & Electronics',
  technology: 'Tech & Electronics',
  gadgets: 'Tech & Electronics',
  mobile: 'Mobile & Wearable',
  'mobile & wearable': 'Mobile & Wearable',
  phones: 'Mobile & Wearable',
  fashion: 'Fashion & Lifestyle',
  'fashion & lifestyle': 'Fashion & Lifestyle',
  lifestyle: 'Fashion & Lifestyle',
  beauty: 'Beauty & Personal Care',
  'beauty & personal care': 'Beauty & Personal Care',
  hotels: 'Travel & Hospitality',
  'hotels & travel': 'Travel & Hospitality',
  'hotels & hospitality': 'Travel & Hospitality',
  travel: 'Travel & Hospitality',
  'travel & hospitality': 'Travel & Hospitality',
  stays: 'Travel & Hospitality',
  'pets & kids': 'Family & Kids',
  'pets and kids': 'Family & Kids',
  kids: 'Family & Kids',
  'family & kids': 'Family & Kids',
  baby: 'Family & Kids',
  home: 'Home & Living',
  'home & living': 'Home & Living',
  gaming: 'Gaming & Entertainment',
  'gaming & entertainment': 'Gaming & Entertainment',
  food: 'Food & Essentials',
  health: 'Health & Wellness',
  jewelry: 'Jewelry & Accessories',
  auto: 'Vehicles & Automotive',
  automotive: 'Vehicles & Automotive',
};

/** Ensure every taxonomy category has at least default labels (extendable). */
for (const cat of CATEGORIES_LIST) {
  if (!CATEGORY_SECTION_LABELS[cat.name]) {
    CATEGORY_SECTION_LABELS[cat.name] = { ...DEFAULT_LABELS };
  }
}

export function resolveCategoryKey(category?: string | null): string | null {
  if (!category?.trim()) return null;
  const raw = category.trim();
  if (CATEGORY_SECTION_LABELS[raw]) return raw;
  const aliased = CATEGORY_ALIASES[raw.toLowerCase()];
  if (aliased) return aliased;
  // Fuzzy: category contains a known key
  const lower = raw.toLowerCase();
  for (const [alias, key] of Object.entries(CATEGORY_ALIASES)) {
    if (lower.includes(alias)) return key;
  }
  for (const key of Object.keys(CATEGORY_SECTION_LABELS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return key;
    }
  }
  return null;
}

export function getCategorySectionLabels(
  category?: string | null,
): CategorySectionLabels {
  const key = resolveCategoryKey(category);
  if (key && CATEGORY_SECTION_LABELS[key]) {
    return CATEGORY_SECTION_LABELS[key];
  }
  return DEFAULT_LABELS;
}

/**
 * Items Mentioned title rules:
 * - live → always plain unranked variant
 * - ≥3 top picks → Top 3 / category ranked variant
 * - else → plain mentioned variant
 */
export function resolveItemsMentionedTitle(opts: {
  category?: string | null;
  contentType?: string | null;
  topPickCount: number;
}): { title: string; ranked: boolean } {
  const labels = getCategorySectionLabels(opts.category);
  const isLive =
    opts.contentType === 'live' || opts.contentType === 'livestream_replay';
  if (isLive) {
    return { title: labels.itemsMentionedTitle, ranked: false };
  }
  if (opts.topPickCount >= 3) {
    return { title: labels.top3Title, ranked: true };
  }
  return { title: labels.itemsMentionedTitle, ranked: false };
}

export function getBrandsMentionedTitle(category?: string | null): string {
  return getCategorySectionLabels(category).brandsMentionedTitle;
}
