import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryImage } from '../../lib/categoryImages';
import type { TaxonomyLevel2 } from '../../data/categoryTaxonomy';
import { slugifyPathSegment } from '../../lib/seoHelpers';

const LEVEL3_PREVIEW = 6;

export type CategorySubgroupCardProps = {
  /** Level-1 category name this subgroup belongs to (used to build the products link). */
  categoryName: string;
  group: TaxonomyLevel2;
};

/** Anchor id used by the mobile vertical dock to scroll-jump to a subgroup card. */
export function subgroupDockAnchorId(groupName: string): string {
  return `subgroup-card-${slugifyPathSegment(groupName)}`;
}

function subgroupHref(categoryName: string, groupName: string) {
  return `/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(groupName)}&q=${encodeURIComponent(groupName)}`;
}

function leafItemHref(categoryName: string, groupName: string, itemName: string) {
  return `/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(groupName)}&q=${encodeURIComponent(itemName)}`;
}

/** One Level-2 subcategory group card, shown when a sidebar category is selected on /categories. */
export function CategorySubgroupCard({ categoryName, group }: CategorySubgroupCardProps) {
  const href = subgroupHref(categoryName, group.name);
  const visible = group.items.slice(0, LEVEL3_PREVIEW);
  const hasMore = group.items.length > LEVEL3_PREVIEW;

  return (
    <div
      id={subgroupDockAnchorId(group.name)}
      className="bg-white rounded-xl overflow-hidden border border-[#E8EDF2] flex flex-col h-full scroll-mt-24"
    >
      <Link to={href} className="block no-underline">
        <div className="relative h-[120px] w-full overflow-hidden bg-[#F4F7F9]">
          <img
            src={getCategoryImage(group.name)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="px-4 pt-5 pb-4 flex-1 flex flex-col">
        <Link
          to={href}
          className="text-left text-[14px] font-bold text-[#1A1A2E] mb-2 no-underline hover:text-[#EF3C23]"
        >
          {group.name}
        </Link>

        {visible.map((item) => (
          <Link
            key={item}
            to={leafItemHref(categoryName, group.name, item)}
            className="block text-left text-[12px] text-[#4B5563] mb-2 truncate no-underline hover:text-[#EF3C23] hover:underline"
          >
            {item}
          </Link>
        ))}

        {hasMore && (
          <Link
            to={href}
            className="text-left text-[11.5px] font-bold text-orange-primary mt-0.5 no-underline hover:underline"
          >
            Show all ({group.items.length})
          </Link>
        )}
      </div>
    </div>
  );
}
