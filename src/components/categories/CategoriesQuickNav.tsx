import React from 'react';
import { DcListingStickyFilters } from '../design/DcListingStickyFilters';
import { CATEGORY_QUICK_NAV_ITEMS } from '../../lib/design/categoryTokens';

interface CategoriesQuickNavProps {
  activeId: string;
  onSelect: (id: string, filterType: string | null) => void;
  className?: string;
}

/** Choosify.dc.html Categories sticky quick nav — letter circles in white 88px card */
export function CategoriesQuickNav({ activeId, onSelect, className }: CategoriesQuickNavProps) {
  const scrollToGrid = () => {
    document.getElementById('categories-main-display')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <DcListingStickyFilters
      className={className}
      overlapHero
      items={CATEGORY_QUICK_NAV_ITEMS.map((item) => ({
        id: item.id,
        icon: item.letter,
        name: item.label,
        sub: item.sub,
        bg: activeId === item.id ? '#FFF3EA' : item.bg,
        active: activeId === item.id,
        onClick: () => {
          onSelect(item.id, item.filterType);
          scrollToGrid();
        },
      }))}
    />
  );
}
