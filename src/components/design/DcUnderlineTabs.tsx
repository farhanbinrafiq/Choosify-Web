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
  /**
   * When true, skip own max-width + side gutters — parent already provides
   * the page content shell (e.g. Product Detail DC_CONTENT_MAX column).
   */
  flush?: boolean;
}

/** Choosify.dc.html Product Detail sticky underline tabs */
export function DcUnderlineTabs({
  tabs,
  activeId,
  onNavigate,
  className,
  maxWidthClass = 'max-w-[1280px]',
  flush = false,
}: DcUnderlineTabsProps) {
  if (!tabs.length) return null;

  return (
    <div
      className={cn(
        'choosify-sticky-section-nav sticky z-40 w-full mb-4',
        // Padding outside max-width made the tab bar wider than feed cards;
        // keep gutters on the same box as max-width so edges match page content.
        !flush && cn(maxWidthClass, 'mx-auto px-5 sm:px-8 lg:px-10'),
        className,
      )}
    >
      <div
        className={cn(
          'w-full flex border border-[#E8EDF2] border-b-[#E8EDF2] rounded-t-xl bg-white overflow-x-auto',
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
                  ? 'text-[#EB4501] border-[#EB4501]'
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
