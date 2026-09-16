import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export interface SortDropdownOption {
  id: string;
  label: string;
}

export interface SortDropdownProps {
  options: SortDropdownOption[];
  value: string;
  onChange: (id: string) => void;
  /** Overrides the trigger's leading text — defaults to "Sort by" */
  triggerLabel?: string;
  className?: string;
}

/**
 * Compact "Sort by: {label} ▾" pill that opens a bordered/shadowed listbox
 * menu. Visually adjacent to (never a replacement for) ListingFilterPills /
 * QuickFilterBar — reuses the same rounded-full pill / orange-primary accent
 * language as those components and AllProductsPage's legacy sort <select>.
 *
 * Fully keyboard accessible: Tab to focus the trigger, Enter/Space to open,
 * ArrowUp/ArrowDown to move between options, Enter/Space to choose, Escape
 * to close and return focus to the trigger. Uses the listbox/option ARIA
 * pattern (role="listbox" / role="option" / aria-selected / aria-expanded).
 */
export function SortDropdown({ options, value, onChange, triggerLabel = 'Sort by', className }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.id === value));
  const selected = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex]);

  const choose = (id: string) => {
    onChange(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt) choose(opt.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const listboxId = 'sort-dropdown-listbox';

  return (
    <div ref={containerRef} className={cn('relative inline-block shrink-0', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11.5px] font-bold cursor-pointer',
          'bg-white text-[#1A1A2E] border border-[#E5E7EB] hover:border-[#FF5B00]/40',
          'min-h-[36px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B00]/40',
        )}
      >
        <span className="text-[#8a9bb0] font-black uppercase tracking-wide text-[9.5px]">{triggerLabel}:</span>
        <span className="text-[#1A1A2E]">{selected?.label ?? ''}</span>
        <ChevronDown size={13} className={cn('text-[#FF5B00] transition-transform', open && 'rotate-180')} />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-${options[activeIndex]?.id ?? ''}`}
          onKeyDown={onListKeyDown}
          ref={(el) => {
            // autofocus the list on open for keyboard users
            if (el) el.focus();
          }}
          className={cn(
            'absolute right-0 z-50 mt-1.5 min-w-[190px] max-w-[calc(100vw-32px)]',
            'bg-white border border-[#eef2f6] rounded-2xl shadow-lg py-1.5',
            'max-h-72 overflow-y-auto no-scrollbar focus:outline-none',
          )}
        >
          {options.map((opt, i) => {
            const isSelected = opt.id === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={opt.id}
                id={`${listboxId}-${opt.id}`}
                role="option"
                aria-selected={isSelected}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => choose(opt.id)}
                className={cn(
                  'flex items-center justify-between gap-2 px-3.5 py-2 text-[12px] font-semibold cursor-pointer',
                  isSelected ? 'text-[#FF5B00]' : 'text-[#1A1A2E]',
                  isActive ? 'bg-[#FFF3EA]' : 'bg-transparent',
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected ? <Check size={13} className="text-[#FF5B00] shrink-0" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
