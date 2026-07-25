import React from 'react';
import { cn } from '../../lib/utils';
import { getCategoryIconComponent } from '../../lib/categoryIcons';
import type { CategoryDisplayItem } from '../../utils/categoryDisplay';

export type CategorySidebarNavProps = {
  categories: CategoryDisplayItem[];
  activeCategory: string | null;
  onSelect: (name: string) => void;
  className?: string;
};

/** Main-category quick nav for the Categories page — filters the card feed to one category. */
export function CategorySidebarNav({
  categories,
  activeCategory,
  onSelect,
  className,
}: CategorySidebarNavProps) {
  if (!categories.length) return null;

  return (
    <aside
      aria-label="Category navigation"
      className={cn(
        'hidden lg:block w-[216px] shrink-0 self-start lg:sticky lg:top-28',
        'bg-white border border-[#E8EDF2] rounded-[14px] overflow-hidden',
        className,
      )}
    >
      <nav className="py-2 max-h-[calc(100vh-140px)] overflow-y-auto">
        {categories.map((cat) => {
          const active = activeCategory === cat.name;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.name)}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-[11px] text-left border-l-[3px] transition-colors cursor-pointer',
                active
                  ? 'bg-[#F7F8FA] border-orange-primary'
                  : 'bg-transparent border-transparent hover:bg-[#FAFBFC]',
              )}
            >
              <span className="shrink-0 flex items-center justify-center w-5 h-5">
                {getCategoryIconComponent(cat.name, cat.icon)}
              </span>
              <span
                className={cn(
                  'text-[13px] leading-snug truncate',
                  active ? 'font-bold text-[#1A1A2E]' : 'font-normal text-[#4B5563]',
                )}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
