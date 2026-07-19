import React from 'react';
import { LucideIcon } from 'lucide-react';
import { FilterChip } from '../navigation/FilterChip';

export interface CategoryItem {
  label: string;
  icon: LucideIcon;
}

export interface DiscoverCategoryNavProps {
  categories: CategoryItem[];
  activeCategory: string;
  onCategoryChange: (label: string) => void;
}

export function DiscoverCategoryNav({
  categories = [],
  activeCategory,
  onCategoryChange,
}: DiscoverCategoryNavProps) {
  return (
    <section className="bg-white border-b border-slate-200/60 sticky top-0 z-30 shadow-sm animate-fade-in" id="category-nav-bar-component">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 sm:space-x-2 py-3.5 shrink-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.label;
            return (
              <FilterChip
                key={cat.label}
                isActive={isSelected}
                variant="pill"
                onClick={() => onCategoryChange(cat.label)}
                leftIcon={<Icon size={12} className={isSelected ? 'text-[#EB4501]' : 'text-slate-400'} />}
                className="shrink-0"
              >
                {cat.label}
              </FilterChip>
            );
          })}
        </div>
      </div>
    </section>
  );
}
