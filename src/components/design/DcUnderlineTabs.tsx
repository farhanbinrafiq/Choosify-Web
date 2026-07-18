import React from 'react';
import { cn } from '../../lib/utils';

export interface DcUnderlineTabItem {
  id: string;
  label: string;
  icon?: string;
}

interface DcUnderlineTabsProps {
  tabs: DcUnderlineTabItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  className?: string;
  maxWidthClass?: string;
}

/** Choosify.dc.html Product Detail sticky underline tabs */
export function DcUnderlineTabs({
  tabs,
  activeId,
  onNavigate,
  className,
  maxWidthClass = 'max-w-[1280px]',
}: DcUnderlineTabsProps) {
  if (!tabs.length) return null;

  return (
    <div className={cn('choosify-sticky-section-nav sticky z-40 w-full px-5 sm:px-8 lg:px-10 mb-4', className)}>
      <div
        className={cn(
          maxWidthClass,
          'mx-auto flex border border-[#E8EDF2] border-b-[#E8EDF2] rounded-t-xl bg-white overflow-x-auto',
        )}
      >
        {tabs.map((tab) => {
          const active = tab.id === activeId || (activeId === 'all' && tab === tabs[0]);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={cn(
                'shrink-0 px-4 sm:px-5 py-4 text-[12.5px] font-bold cursor-pointer whitespace-nowrap border-0 border-b-2 bg-transparent transition-colors',
                active
                  ? 'text-[#FF5B00] border-[#FF5B00]'
                  : 'text-[#6B7280] border-transparent hover:text-[#1A1A2E]',
              )}
            >
              {tab.icon ? `${tab.icon} ` : ''}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
