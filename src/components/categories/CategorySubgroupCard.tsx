import React from 'react';
import { Link } from 'react-router-dom';
import { slugifyPathSegment } from '../../lib/seoHelpers';
import type { CategorySubcategory } from '../../utils/categoryDisplay';

export type CategorySubgroupCardProps = {
  /** Main category this subcategory belongs to (used to build the products link). */
  categoryName: string;
  subcategory: CategorySubcategory;
};

/** Anchor id used by the mobile vertical dock to scroll-jump to a subgroup card. */
export function subgroupDockAnchorId(groupName: string): string {
  return `subgroup-card-${slugifyPathSegment(groupName)}`;
}

function subcategoryHref(categoryName: string, subName: string) {
  return `/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subName)}`;
}

/** One subcategory card, shown when a main category is selected on /categories. Real counts only. */
export function CategorySubgroupCard({ categoryName, subcategory }: CategorySubgroupCardProps) {
  const href = subcategoryHref(categoryName, subcategory.name);
  const initial = subcategory.name.trim().charAt(0).toUpperCase() || '•';

  return (
    <Link
      to={href}
      id={subgroupDockAnchorId(subcategory.name)}
      className="bg-white rounded-xl overflow-hidden border border-[#E8EDF2] flex flex-col h-full scroll-mt-24 no-underline group"
    >
      <div className="h-[96px] w-full flex items-center justify-center bg-gradient-to-br from-[#FFF4EC] to-[#F4F7F9]">
        <span className="w-12 h-12 rounded-full bg-white text-[#FF5B00] text-lg font-extrabold flex items-center justify-center shadow-sm">
          {initial}
        </span>
      </div>
      <div className="px-4 pt-4 pb-4 flex-1 flex flex-col">
        <span className="text-left text-[14px] font-bold text-[#1A1A2E] mb-1 group-hover:text-[#EF3C23]">
          {subcategory.name}
        </span>
        <span className="text-left text-[12px] text-[#6B7280]">
          {subcategory.count === 0
            ? 'No products yet'
            : `${subcategory.count} product${subcategory.count === 1 ? '' : 's'}`}
          {subcategory.brands > 0 ? ` · ${subcategory.brands} brand${subcategory.brands === 1 ? '' : 's'}` : ''}
        </span>
      </div>
    </Link>
  );
}
