import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryImage } from '../../lib/categoryImages';
import type { TaxonomyLevel2 } from '../../data/categoryTaxonomy';

const LEVEL3_PREVIEW = 6;

export type CategorySubgroupCardProps = {
  /** Level-1 category name this subgroup belongs to (used to build the products link). */
  categoryName: string;
  group: TaxonomyLevel2;
};

function subgroupHref(categoryName: string, groupName: string) {
  return `/products?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(groupName)}`;
}

/** One Level-2 subcategory group card, shown when a sidebar category is selected on /categories. */
export function CategorySubgroupCard({ categoryName, group }: CategorySubgroupCardProps) {
  const href = subgroupHref(categoryName, group.name);
  const visible = group.items.slice(0, LEVEL3_PREVIEW);
  const hasMore = group.items.length > LEVEL3_PREVIEW;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#E8EDF2] flex flex-col h-full">
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
          className="text-left text-[14px] font-bold text-[#1A1A2E] mb-2 no-underline hover:text-[#CF4400]"
        >
          {group.name}
        </Link>

        {visible.map((item) => (
          <span key={item} className="block text-[12px] text-[#4B5563] mb-2 truncate">
            {item}
          </span>
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
