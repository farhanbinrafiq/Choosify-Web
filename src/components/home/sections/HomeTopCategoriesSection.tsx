import React from 'react';
import { Link } from 'react-router-dom';
import { DcHomePanel } from '../DcHomePanel';
import { ViewAllLink } from '../../design/ViewAllLink';
import { cn } from '../../../lib/utils';
import { HOME_CATEGORY_CHIP_COLORS } from '../../../lib/design/homeTokens';

export interface HomeCategoryItem {
  id?: string;
  name: string;
  count: number;
  image?: string;
}

/** Choosify.dc.html Top Categories — emoji/icon in colored circle (not photos) */
const CATEGORY_ICON_MAP: Record<string, string> = {
  Electronics: '🎧',
  Fashion: '👗',
  'Mobile & Accessories': '📱',
  'Home & Living': '🛋',
  'Beauty & Health': '💆',
  'Sports & Outdoors': '🏀',
  Automotive: '🚗',
  Restaurants: '🍽',
  Hotels: '🏨',
  'Travel & Tours': '✈️',
  Education: '🎓',
  More: '⋯',
};

function categoryIcon(name: string): string {
  if (CATEGORY_ICON_MAP[name]) return CATEGORY_ICON_MAP[name];
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return icon;
    }
  }
  return '🏷';
}

interface HomeTopCategoriesSectionProps {
  categories: HomeCategoryItem[];
}

/** Choosify.dc.html — overlapping white panel, 6-col icon tiles */
export function HomeTopCategoriesSection({ categories }: HomeTopCategoriesSectionProps) {
  if (!categories.length) return null;

  const display = categories.slice(0, 12);

  return (
    <DcHomePanel id="section-categories" overlapHero>
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h2
          id="section-categories-heading"
          className="text-[19px] font-extrabold text-[#1A1A2E]"
        >
          Top Categories
        </h2>
        <ViewAllLink href="/categories" label="VIEW ALL CATEGORIES ›" className="text-xs font-bold" />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5 mb-8">
        {display.map((cat, i) => {
          const chip = HOME_CATEGORY_CHIP_COLORS[i % HOME_CATEGORY_CHIP_COLORS.length];
          const icon = categoryIcon(cat.name);
          return (
            <Link
              key={cat.id ?? cat.name}
              to={`/categories?category=${encodeURIComponent(cat.name)}`}
              className={cn(
                'bg-white rounded-[10px] px-3 py-5 flex flex-col items-center gap-2.5 border border-[#E8EDF2]',
                'hover:border-[#FF5B00]/35 hover:shadow-sm transition-all',
              )}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[18px] leading-none"
                style={{ backgroundColor: chip }}
                aria-hidden
              >
                {icon}
              </div>
              <span className="text-xs font-semibold text-[#1A1A2E] text-center line-clamp-2 leading-tight">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </DcHomePanel>
  );
}
