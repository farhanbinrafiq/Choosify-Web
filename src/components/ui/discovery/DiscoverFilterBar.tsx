import React from 'react';
import { LayoutGrid, Bot, Sparkles } from 'lucide-react';
import { Button } from '../buttons/Button';
import { FilterChip } from '../navigation/FilterChip';

export interface FilterItem {
  id: string;
  label: string;
}

export interface DiscoverFilterBarProps {
  filters: FilterItem[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  onFiltersClick?: () => void;
  aiDiscoverButton?: {
    text: string;
    onClick: () => void;
  };
}

export function DiscoverFilterBar({
  filters = [],
  activeFilter,
  onFilterChange,
  onFiltersClick,
  aiDiscoverButton,
}: DiscoverFilterBarProps) {
  return (
    <section className="bg-slate-50 border-b border-slate-200/50 py-3 px-6 md:px-10 animate-fade-in" id="filter-bar-component">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        
        {/* Filter pills group */}
        <div className="flex flex-wrap items-center gap-1.5">
          {onFiltersClick && (
            <>
              <Button 
                onClick={onFiltersClick}
                variant="outline"
                size="sm"
                leftIcon={<LayoutGrid size={11} className="text-slate-400" />}
                className="text-[11px] uppercase tracking-wider h-8.5 rounded-lg font-black"
              >
                Filters
              </Button>
              <div className="w-px bg-slate-200 h-5 mx-1.5 hidden sm:block" />
            </>
          )}

          {filters.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <FilterChip
                key={f.id}
                isActive={isSelected}
                onClick={() => onFilterChange(f.id)}
              >
                {f.label}
              </FilterChip>
            );
          })}
        </div>

        {/* AI Discover Button on the right */}
        {aiDiscoverButton && (
          <Button
            onClick={aiDiscoverButton.onClick}
            variant="outline"
            size="sm"
            leftIcon={<Bot size={13} className="text-indigo-500 animate-bounce" />}
            rightIcon={<Sparkles size={11} className="text-pink-500" />}
            className="bg-white hover:bg-indigo-50/50 border-indigo-200 text-indigo-700 text-[10px] uppercase tracking-wider rounded-full h-8.5"
          >
            {aiDiscoverButton.text}
          </Button>
        )}

      </div>
    </section>
  );
}
