import React from 'react';
import { motion } from 'motion/react';
import { Construction, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { getCategoryIconComponent } from '../lib/categoryIcons';
import { CATEGORY_CARD_GRID } from '../lib/pageLayout';
import type { CategoryDisplayItem } from '../utils/categoryDisplay';
import { PopularSearchKeywords } from './PopularSearchKeywords';
import { buildCategoryPopularSearchTerms } from '../utils/categoryPopularSearches';

import type { CatalogProduct, SitePopularSearch } from '../types/catalog';

type CategorySubcategoryPanelProps = {
  category: CategoryDisplayItem;
  onClose: () => void;
  className?: string;
  popularSearchTerms?: string[];
  products?: CatalogProduct[];
  cmsTerms?: SitePopularSearch[];
};

export function CategorySubcategoryPanel({
  category,
  onClose,
  className,
  popularSearchTerms,
  products = [],
  cmsTerms,
}: CategorySubcategoryPanelProps) {
  const terms =
    popularSearchTerms ??
    buildCategoryPopularSearchTerms({
      categoryName: category.name,
      cmsTerms,
      products,
      subcategoryNames: category.subcategories.map((sub) => sub.name),
      limit: 12,
    });

  return (
    <motion.div
      key={`subpanel-${category.name}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'col-span-full bg-white shadow-md rounded-[5px] p-6 md:p-8 border border-[#e8edf2] overflow-hidden z-10 text-left mt-4',
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16, delay: 0.03, ease: 'easeOut' }}
        className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
            {getCategoryIconComponent(category.name, category.icon)}
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-[#1a1a2e] uppercase tracking-tight">
              {category.name} <span className="text-[#E8500A]">SUBCATEGORIES</span>
            </h2>
            <p className="text-[10px] text-[#8a9bb0] font-semibold uppercase tracking-[0.2em] mt-1">
              {category.count} Products Across {category.subcategories.length || 1} Sections
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-8 h-8 rounded-full border border-[#e8edf2] hover:border-[#E8500A]/30 flex items-center justify-center text-gray-400 hover:text-[#E8500A] transition-all active:scale-95 cursor-pointer bg-white"
          aria-label="Close subcategories"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>

      <div className={CATEGORY_CARD_GRID}>
        {category.subcategories.length > 0 ? (
          category.subcategories.map((sub, index) => (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.14, delay: index * 0.012, ease: 'easeOut' }}
              className="choosify-category-card bg-white border border-[#e8edf2] rounded-[5px] p-4 flex flex-col items-start hover:border-gray-200/90 transition-[border-color] duration-200 cursor-pointer group text-left"
            >
              <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center mb-4 shrink-0">
                {getCategoryIconComponent(sub.name, sub.icon)}
              </div>

              <div className="w-full text-left">
                <h4 className="font-medium text-xs text-[#1a1a2e] group-hover:text-[#E8500A] transition-colors leading-tight mb-1 uppercase tracking-tight line-clamp-2">
                  {sub.name}
                </h4>
                <p className="text-[10px] text-red-500 font-semibold leading-none uppercase font-mono mt-1">
                  {sub.count} Products • {sub.brands} Brands
                </p>
                <p className="text-[9px] text-[#8a9bb0] font-medium leading-none uppercase mt-1.5">
                  Verified Options
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <Construction className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">
              Subcategories coming soon
            </p>
          </div>
        )}
      </div>

      <PopularSearchKeywords
        className="mt-8 pt-6 border-t border-gray-100"
        title={`Popular searches in ${category.name}`}
        terms={terms}
      />
    </motion.div>
  );
}
