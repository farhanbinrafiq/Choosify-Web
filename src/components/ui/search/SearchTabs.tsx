import React from 'react';
import { FilterChip } from '../navigation/FilterChip';

export interface TabConfig {
  key: string;
  label: string;
  count: number;
}

interface SearchTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SearchTabs: React.FC<SearchTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="w-full border-b border-gray-200 bg-white sticky top-20 z-40 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-start gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <FilterChip
              key={tab.key}
              isActive={isActive}
              onClick={() => onTabChange(tab.key)}
              className={`h-11 px-4 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap inline-flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-[#0A0A1F] text-white !border-transparent hover:!bg-[#0A0A1F] hover:!text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-800 !border-transparent'
              }`}
              rightIcon={
                <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-[#FF5B00] text-white' : 'bg-gray-250 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              }
            >
              {tab.label}
            </FilterChip>
          );
        })}
      </div>
    </div>
  );
};
