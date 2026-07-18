import React, { useRef, useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Star, ShieldCheck, HelpCircle, Check, Sparkles, Flame, Tag, DollarSign, Filter, Search, X, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFloatingPanelClassName } from './FloatingPanelShell';
import { AlphabetFilterStrip } from './AlphabetFilterStrip';
import type { SectionNavItem } from '../hooks/useSectionScrollSpy';

// ==========================================
// LAYER 1: FILTER ENGINE (GLOBAL DEFINITIONS)
// ==========================================

export type FilterValue = string | number | boolean | [number, number] | any;

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
  stars?: number;
}

export interface FilterDefinition {
  id: string;
  name: string;
  type: 'single_select' | 'multi_select' | 'range' | 'boolean' | 'alphabet' | 'price_custom';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface FilterProfile {
  entity: 'products' | 'brands' | 'deals' | 'creators' | 'recommendations' | 'guides' | 'whats-on';
  filters: FilterDefinition[];
}

// ==========================================
// DRAG SCROLL HELPER HOOK FOR HORIZONTAL SCROLL
// ==========================================
const DRAG_SCROLL_SWIPE_THRESHOLD_PX = 6;

/** Scroll to the page results section after closing the floating filter drawer. */
export function scrollToFilterResultsTarget(targetId?: string | null, offset = 200) {
  if (!targetId) return;
  const el = document.getElementById(targetId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export interface AlphabetFilterConfig {
  activeLetter: string | null;
  onLetterChange: (letter: string | null) => void;
}

export function useDragScroll(options?: { grabCursor?: boolean }) {
  const grabCursor = options?.grabCursor ?? true;
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    pointerDown: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
  });

  const endPointer = () => {
    dragState.current.pointerDown = false;
    setIsDragging(false);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    dragState.current.pointerDown = true;
    dragState.current.moved = false;
    dragState.current.startX = e.pageX - ref.current.offsetLeft;
    dragState.current.scrollLeft = ref.current.scrollLeft;
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.pointerDown || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    if (Math.abs(walk) > DRAG_SCROLL_SWIPE_THRESHOLD_PX) {
      dragState.current.moved = true;
    }
    ref.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Touch scrolling is left fully native (touch-action: pan-x +
    // -webkit-overflow-scrolling) so momentum/inertia is preserved.
    // We only observe movement to suppress accidental clicks after a swipe.
    const onTouchStart = (e: TouchEvent) => {
      dragState.current.pointerDown = true;
      dragState.current.moved = false;
      dragState.current.startX = e.touches[0]?.pageX ?? 0;
      dragState.current.scrollLeft = el.scrollLeft;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragState.current.pointerDown) return;
      const x = e.touches[0]?.pageX ?? dragState.current.startX;
      const walk = dragState.current.startX - x;
      if (Math.abs(walk) > DRAG_SCROLL_SWIPE_THRESHOLD_PX) {
        dragState.current.moved = true;
      }
    };

    const onTouchEnd = () => {
      endPointer();
    };

    const suppressClickAfterSwipe = (e: MouseEvent) => {
      if (!dragState.current.moved) return;
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);
    el.addEventListener('click', suppressClickAfterSwipe, true);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('click', suppressClickAfterSwipe, true);
    };
  }, []);

  return {
    ref,
    props: {
      onMouseDown,
      onMouseLeave: endPointer,
      onMouseUp: endPointer,
      onMouseMove,
      style: grabCursor
        ? ({ cursor: isDragging ? 'grabbing' : 'grab' } as React.CSSProperties)
        : undefined,
    },
  };
}

// ================================================
// DRAG/SWIPE SCROLL WRAPPER COMPONENT
// ================================================
interface ScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DragScrollContainer({ children, className, ...props }: ScrollContainerProps) {
  const { ref, props: dragProps } = useDragScroll();

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Scroll indicator gradient hints */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F8FBFD] to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F8FBFD] to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div
        ref={ref}
        {...dragProps}
        className={cn(
          "flex flex-row items-stretch gap-4 overflow-x-auto no-scrollbar select-none pb-1 py-1 w-full choosify-touch-scroll-row",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

// ==========================================
// LAYER 2: SYSTEM FILTER PROFILES DEFINITIONS
// ==========================================

export {
  PRODUCTS_PAGE_FILTER_PROFILE,
  DEALS_PAGE_FILTER_PROFILE,
  CREATORS_PAGE_FILTER_PROFILE,
} from './filter/filterProfiles';

// ==========================================
// LAYER 3: DEDICATED CUSTOM PRICE FILTER COMPONENT
// ==========================================

interface CustomPriceFilterProps {
  filter: FilterDefinition;
  customPriceInputs?: { min: string; max: string };
  setCustomPriceInputs?: (inputs: { min: string; max: string }) => void;
  onCustomPriceApply?: (min: number, max: number | null) => void;
  cardBaseStyle: string;
}

export function CustomPriceFilter({
  filter,
  customPriceInputs,
  setCustomPriceInputs,
  onCustomPriceApply,
  cardBaseStyle
}: CustomPriceFilterProps) {
  const [minVal, setMinVal] = useState(customPriceInputs?.min || '');
  const [maxVal, setMaxVal] = useState(customPriceInputs?.max || '');
  const [rangeError, setRangeError] = useState('');

  // Sync state if customPriceInputs changes externally
  useEffect(() => {
    if (customPriceInputs) {
      setMinVal(customPriceInputs.min || '');
      setMaxVal(customPriceInputs.max || '');
    }
  }, [customPriceInputs]);

  const presets = [
    { label: 'Under 1,000', min: 0, max: 1000 },
    { label: '1,000 – 5,000', min: 1000, max: 5000 },
    { label: '5,000 – 10,000', min: 5000, max: 10000 },
    { label: '10,000 – 20,000', min: 10000, max: 20000 },
    { label: '20,000 – 50,000', min: 20000, max: 50000 },
    { label: '50,000+', min: 50000, max: 99999999 }
  ];

  const handlePresetClick = (p: typeof presets[0]) => {
    setMinVal(p.min.toString());
    setMaxVal(p.max === 99999999 ? '' : p.max.toString());
    setRangeError('');
    
    if (setCustomPriceInputs) {
      setCustomPriceInputs({
        min: p.min.toString(),
        max: p.max === 99999999 ? '' : p.max.toString()
      });
    }

    if (onCustomPriceApply) {
      onCustomPriceApply(p.min, p.max === 99999999 ? null : p.max);
    }
  };

  const handleApply = () => {
    const minNum = parseFloat(minVal) || 0;
    const maxNum = maxVal ? parseFloat(maxVal) : null;

    if (minNum < 0) {
      setRangeError('Min must be positive');
      return;
    }
    if (maxNum !== null && minNum > maxNum) {
      setRangeError('Min score exceeds Max');
      return;
    }
    setRangeError('');

    if (setCustomPriceInputs) {
      setCustomPriceInputs({ min: minVal, max: maxVal });
    }
    if (onCustomPriceApply) {
      onCustomPriceApply(minNum, maxNum);
    }
  };

  return (
    <div className={cn(cardBaseStyle, "min-w-[250px] max-w-[310px]")}>
      <div className="flex items-center justify-between pb-2 border-b border-[#e8edf2]">
        <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">{filter.name}</h3>
        {(minVal || maxVal) && (
          <button
            onClick={() => {
              setMinVal('');
              setMaxVal('');
              setRangeError('');
              if (setCustomPriceInputs) setCustomPriceInputs({ min: '', max: '' });
              if (onCustomPriceApply) onCustomPriceApply(0, null);
            }}
            className="text-[9px] font-semibold text-red-500 uppercase cursor-pointer hover:text-red-650 transition-colors border-none bg-none"
          >
            Clear
          </button>
        )}
      </div>

      {/* Price limit presets */}
      <div className="grid grid-cols-2 gap-1.5 py-1">
        {presets.map((p, idx) => {
          const currentMin = parseFloat(minVal) || 0;
          const currentMax = maxVal ? parseFloat(maxVal) : 99999999;
          const isSelected = currentMin === p.min && currentMax === p.max;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(p)}
              className={cn(
                "py-1.5 px-2 text-[9.5px] font-semibold rounded-[4px] border text-center transition-colors truncate cursor-pointer",
                isSelected
                  ? "bg-orange-primary/10 border-orange-primary text-orange-primary"
                  : "bg-gray-50/50 border-[#e8edf2] text-gray-500 hover:bg-gray-100 hover:text-[#1A1D4E]"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Min - Max Input Range Box */}
      <div className="flex flex-col gap-2 pt-1 border-t border-[#e8edf2]">
        <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Custom Price Limit</span>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-[7px] text-[10px] text-gray-400 font-mono">৳</span>
            <input
              type="number"
              placeholder="Min"
              value={minVal}
              onChange={(e) => setMinVal(e.target.value)}
              className="w-full text-xs font-semibold h-8 pl-6 pr-2 border border-[#e8edf2] rounded-[4px] focus:outline-none focus:border-orange-primary bg-slate-50/20"
            />
          </div>
          <span className="text-gray-300 text-xs">to</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-[7px] text-[10px] text-gray-400 font-mono">৳</span>
            <input
              type="number"
              placeholder="Unlimited"
              value={maxVal}
              onChange={(e) => setMaxVal(e.target.value)}
              className="w-full text-xs font-semibold h-8 pl-6 pr-2 border border-[#e8edf2] rounded-[4px] focus:outline-none focus:border-orange-primary bg-slate-50/20"
            />
          </div>
        </div>

        {rangeError && (
          <p className="text-[9px] text-red-500 font-semibold leading-none">{rangeError}</p>
        )}

        <button
          type="button"
          onClick={handleApply}
          className="w-full py-1.5 mt-1 bg-orange-primary hover:bg-orange-deep text-white rounded-[4px] text-[10px] font-bold uppercase tracking-wider transition-colors border-0 cursor-pointer text-center"
        >
          Apply Custom Range
        </button>
      </div>
    </div>
  );
}

// ==========================================
// LAYER 3: UNIVERSAL FILTER RENDERER COMPONENT
// ==========================================

interface UniversalFilterRendererProps {
  profile: FilterProfile;
  activeFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  // Specific properties to sync with customized pricing
  customPriceInputs?: { min: string; max: string };
  setCustomPriceInputs?: (inputs: { min: string; max: string }) => void;
  onCustomPriceApply?: (min: number, max: number | null) => void;
}

export function UniversalFilterRenderer({
  profile,
  activeFilters,
  onFilterChange,
  customPriceInputs,
  setCustomPriceInputs,
  onCustomPriceApply
}: UniversalFilterRendererProps) {

  // For alphabetical initial selector
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Settle consistent sizes and paddings (5px rounded border styling system)
  const cardBaseStyle = "bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans flex flex-col gap-3 min-w-[230px] max-w-[280px] w-full shrink-0 select-none transition-all hover:border-[#1A1D4E]/10";

  return (
    <>
      {profile.filters.map((filter) => {
        // Render custom price range filter card
        if (filter.id === 'price_custom') {
          return (
            <CustomPriceFilter
              key={filter.id}
              filter={filter}
              customPriceInputs={customPriceInputs}
              setCustomPriceInputs={setCustomPriceInputs}
              onCustomPriceApply={onCustomPriceApply}
              cardBaseStyle={cardBaseStyle}
            />
          );
        }

        // Render Alphabet Index Filter Card
        if (filter.type === 'alphabet') {
          const activeVal = activeFilters[filter.id] || null;

          return (
            <div key={filter.id} className={cn(cardBaseStyle, "min-w-[270px] max-w-[310px]")}>
              <div className="flex flex-col gap-1">
                <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider leading-none">
                  Filter By <span className="text-orange-primary font-bold">Initial</span>
                </h3>
                <div className="w-full h-px bg-[#e8edf2] mt-1" />
              </div>

              <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto no-scrollbar py-0.5">
                <button
                  onClick={() => onFilterChange(filter.id, null)}
                  className={cn(
                    "col-span-6 py-1.5 rounded-[3px] text-[9.5px] font-black uppercase tracking-widest transition-all text-center cursor-pointer",
                    activeVal === null
                      ? "bg-orange-primary text-white shadow-sm shadow-orange-primary/10"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  )}
                >
                  All Items
                </button>
                {letters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => onFilterChange(filter.id, letter)}
                    className={cn(
                      "h-6 rounded-[3px] text-[10.5px] font-black transition-all flex items-center justify-center uppercase cursor-pointer",
                      activeVal === letter
                        ? "bg-orange-primary text-white shadow-xs"
                        : "bg-gray-50 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-100/70"
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        // Render Standard Single Select Dropdown/Button List
        const activeItem = activeFilters[filter.id];

        return (
          <div key={filter.id} className={cardBaseStyle}>
            <div className="flex items-center justify-between pb-2 border-b border-[#e8edf2]">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">{filter.name}</h3>
              {activeItem && activeItem !== 'all' && (
                <button
                  onClick={() => onFilterChange(filter.id, null)}
                  className="text-[9px] font-semibold text-red-500 uppercase cursor-pointer hover:text-red-655 transition-colors border-none bg-none"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar py-0.5">
              {filter.options?.map((opt, idx) => {
                const isSelected = activeItem === opt.value || (!activeItem && opt.value === 'all');
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onFilterChange(filter.id, opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors group text-xs font-semibold cursor-pointer",
                      isSelected
                        ? "bg-[#FFF0E8] text-orange-primary font-bold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ==========================================
// LAYER 1: QUICK FILTER BAR (GLOBAL COMPACT TOOLBAR)
// ==========================================

export interface QuickFilter {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface QuickFilterBarProps {
  filters: QuickFilter[];
  onOpenFullFilters?: () => void;
  title?: string;
}

export function QuickFilterBar({ filters, onOpenFullFilters, title = "Quick Filters" }: QuickFilterBarProps) {
  return (
    <div className="w-full bg-[#f8fbfd] border-b border-[#E8EDF2] py-3.5 transition-all duration-300 font-sans select-none shrink-0" id="global-quick-filters">
      <div className="max-w-[1440px] mx-auto px-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0] whitespace-nowrap">{title}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8500A]" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <DragScrollContainer className="gap-2 pb-0 py-0 items-center">
            {filters.map((filter) => {
              return (
                <button
                  key={filter.id}
                  onClick={filter.onClick}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 hover:scale-[1.02] active:scale-[0.98]",
                    filter.active
                      ? "bg-[#E8500A] text-white border-transparent shadow-xs font-black italic"
                      : "bg-white border-[#e8edf2] text-gray-550 hover:border-[#1A1D4E]/25 hover:text-[#1A1D4E]"
                  )}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </button>
              );
            })}

            {onOpenFullFilters && (
              <button
                onClick={onOpenFullFilters}
                className="px-4 py-2 rounded-full text-[10.5px] font-black uppercase tracking-widest text-[#E8500A] bg-orange-primary/5 hover:bg-orange-primary/10 border border-dashed border-[#E8500A]/30 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>More Filters</span>
                <span className="font-mono text-xs">▼</span>
              </button>
            )}
          </DragScrollContainer>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ACTIVE FILTER CHIPS COMPONENT
// ==========================================

export interface ActiveChipItem {
  id: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  chips: ActiveChipItem[];
  onClearAll: () => void;
}

export function ActiveFilterChips({ chips, onClearAll }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="w-full bg-white py-2 border-b border-[#E8EDF2]/40 font-sans tracking-wide">
      <div className="max-w-[1440px] mx-auto px-6 w-full flex flex-wrap items-center gap-2">
        <span className="text-[9.5px] font-black uppercase tracking-[0.12em] text-[#8a9bb0] mr-2">Active Spec Scope:</span>
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip, idx) => (
            <div
              key={`${chip.id}-${idx}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F8FA] border border-[#D9E6ED] rounded-[4px] text-[10px] font-black text-[#1A1D4E] uppercase tracking-wider shadow-2xs hover:border-[#E8500A]/30 transition-all"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="text-[#E8500A] hover:text-[#CF4400] transition-colors p-[1.5px] rounded-full hover:bg-red-500/10 cursor-pointer border-none bg-none flex items-center justify-center"
                aria-label={`Remove filter ${chip.label}`}
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          <button
            onClick={onClearAll}
            className="text-[10px] font-extrabold text-[#E8500A] uppercase tracking-widest hover:text-[#CF4400] ml-3 transition-colors cursor-pointer border-none bg-transparent hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE-SPECIFIC DYNAMIC SMART CATEGORY FILTERS
// ==========================================

interface SmartSpecsProps {
  category: string | null;
  activeSpecs: Record<string, string>;
  onSpecChange: (specKey: string, value: string | null) => void;
}

export function CategorySmartFilters({ category, activeSpecs, onSpecChange }: SmartSpecsProps) {
  if (!category) return null;

  const normalizedCat = category.toLowerCase();

  // Smartphones / Mobiles / Gadgets
  if (normalizedCat.includes('smartphone') || normalizedCat.includes('mobile') || normalizedCat.includes('gadg')) {
    const specs = [
      {
        key: 'ram',
        name: 'RAM Capacity',
        options: [
          { value: '4gb', label: '4 GB' },
          { value: '6gb', label: '6 GB' },
          { value: '8gb', label: '8 GB' },
          { value: '12gb', label: '12 GB' },
          { value: '16gb', label: '16 GB' }
        ]
      },
      {
        key: 'storage',
        name: 'Storage Memory',
        options: [
          { value: '64gb', label: '64 GB' },
          { value: '128gb', label: '128 GB' },
          { value: '256gb', label: '256 GB' },
          { value: '512gb', label: '512 GB' }
        ]
      },
      {
        key: 'battery',
        name: 'Battery Life',
        options: [
          { value: 'under4500', label: 'Under 4500 mAh' },
          { value: '4500-5000', label: '4500 - 5000 mAh' },
          { value: '5000plus', label: '5000 mAh & Up' }
        ]
      },
      {
        key: 'processor',
        name: 'Processor Chip',
        options: [
          { value: 'snapdragon', label: 'Snapdragon' },
          { value: 'mediatek', label: 'MediaTek' },
          { value: 'apple', label: 'Apple A-Series' },
          { value: 'exynos', label: 'Exynos' }
        ]
      }
    ];

    return (
      <div className="flex flex-col gap-3 font-sans">
        <div className="py-2.5 px-3 bg-gradient-to-r from-orange-primary/5 to-transparent rounded-[4px] border-l-2 border-orange-primary">
          <span className="text-[12px] font-bold tracking-tight text-[#FF5B00] block">Smartphone specs</span>
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wide block mt-0.5">Custom filters synced with Smartphone directory</span>
        </div>
        {specs.map((spec) => (
          <div key={spec.key} className="bg-white border border-[#e8edf2] rounded-[5px] p-4 text-left shadow-sm">
            <h4 className="text-[10.5px] font-extrabold text-gray-450 uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-2 flex items-center justify-between">
              <span>{spec.name}</span>
              {activeSpecs[spec.key] && (
                <button
                  type="button"
                  onClick={() => onSpecChange(spec.key, null)}
                  className="text-[8.5px] font-semibold text-red-500 uppercase hover:text-red-650 cursor-pointer border-none bg-none text-right"
                >
                  Clear
                </button>
              )}
            </h4>
            <div className="space-y-1">
              {spec.options.map((opt) => {
                const isSelected = activeSpecs[spec.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSpecChange(spec.key, isSelected ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      isSelected
                        ? "bg-[#FFF0E8] text-orange-primary font-bold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fashion / Clothing / Apparel
  if (normalizedCat.includes('fashion') || normalizedCat.includes('wear') || normalizedCat.includes('cloth') || normalizedCat.includes('perfume') || normalizedCat.includes('belt') || normalizedCat.includes('footwear')) {
    const specs = [
      {
        key: 'size',
        name: 'Apparel Size',
        options: [
          { value: 's', label: 'S (Small)' },
          { value: 'm', label: 'M (Medium)' },
          { value: 'l', label: 'L (Large)' },
          { value: 'xl', label: 'XL (Extra Large)' },
          { value: 'xxl', label: 'XXL (Double Extra Large)' }
        ]
      },
      {
        key: 'gender',
        name: 'Gender Division',
        options: [
          { value: 'men', label: 'Men' },
          { value: 'women', label: 'Women' },
          { value: 'unisex', label: 'Unisex Collection' }
        ]
      },
      {
        key: 'season',
        name: 'Season Theme',
        options: [
          { value: 'summer', label: 'Summer Air' },
          { value: 'winter', label: 'Winter Cozy' },
          { value: 'spring', label: 'Spring Floral' },
          { value: 'autumn', label: 'Autumn Earthy' }
        ]
      }
    ];

    return (
      <div className="flex flex-col gap-3 font-sans">
        <div className="py-2.5 px-3 bg-gradient-to-r from-orange-primary/5 to-transparent rounded-[4px] border-l-2 border-orange-primary">
          <span className="text-[12px] font-bold tracking-tight text-[#FF5B00] block">Fashion specs</span>
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wide block mt-0.5">Custom apparel scopes</span>
        </div>
        {specs.map((spec) => (
          <div key={spec.key} className="bg-white border border-[#e8edf2] rounded-[5px] p-4 text-left shadow-sm">
            <h4 className="text-[10.5px] font-extrabold text-gray-450 uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-2 flex items-center justify-between">
              <span>{spec.name}</span>
              {activeSpecs[spec.key] && (
                <button
                  type="button"
                  onClick={() => onSpecChange(spec.key, null)}
                  className="text-[8.5px] font-semibold text-red-500 uppercase hover:text-red-655 cursor-pointer border-none bg-none text-right"
                >
                  Clear
                </button>
              )}
            </h4>
            <div className="space-y-1">
              {spec.options.map((opt) => {
                const isSelected = activeSpecs[spec.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSpecChange(spec.key, isSelected ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      isSelected
                        ? "bg-[#FFF0E8] text-orange-primary font-bold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Eyewear / Glasses / Sunglasses
  if (normalizedCat.includes('eyewear') || normalizedCat.includes('glass') || normalizedCat.includes('sunglass')) {
    const specs = [
      {
        key: 'frame_shape',
        name: 'Frame Shape',
        options: [
          { value: 'round', label: 'Round Retro' },
          { value: 'square', label: 'Square Geek' },
          { value: 'aviator', label: 'Classic Aviator' },
          { value: 'cat-eye', label: 'Cat-Eye Elegance' }
        ]
      },
      {
        key: 'lens_type',
        name: 'Lens Spec',
        options: [
          { value: 'polarized', label: 'Polarized Dark' },
          { value: 'uv400', label: 'UV400 Shield' },
          { value: 'blue-light', label: 'Anti Blue-Light' },
          { value: 'photochromic', label: 'Photochromic Transitional' }
        ]
      }
    ];

    return (
      <div className="flex flex-col gap-3 font-sans">
        <div className="py-2.5 px-3 bg-gradient-to-r from-orange-primary/5 to-transparent rounded-[4px] border-l-2 border-orange-primary">
          <span className="text-[12px] font-bold tracking-tight text-[#FF5B00] block">Eyewear specs</span>
          <span className="text-[8.5px] text-gray-400 font-semibold uppercase tracking-wide block mt-0.5">Optimized dimensions for eyeglasses</span>
        </div>
        {specs.map((spec) => (
          <div key={spec.key} className="bg-white border border-[#e8edf2] rounded-[5px] p-4 text-left shadow-sm">
            <h4 className="text-[10.5px] font-extrabold text-gray-450 uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-2 flex items-center justify-between">
              <span>{spec.name}</span>
              {activeSpecs[spec.key] && (
                <button
                  type="button"
                  onClick={() => onSpecChange(spec.key, null)}
                  className="text-[8.5px] font-semibold text-red-500 uppercase hover:text-red-655 cursor-pointer border-none bg-none text-right"
                >
                  Clear
                </button>
              )}
            </h4>
            <div className="space-y-1">
              {spec.options.map((opt) => {
                const isSelected = activeSpecs[spec.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onSpecChange(spec.key, isSelected ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      isSelected
                        ? "bg-[#FFF0E8] text-orange-primary font-bold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// ===============================================
// COLLAPSIBLE FULL FILTER PANEL (SIDEBAR PANEL)
// WITH PROGRESSIVE DISCLOSURE ENGINES
// ===============================================

interface FullSidebarFilterPanelProps {
  children: React.ReactNode;
  advancedSection?: React.ReactNode;
  onReset?: () => void;
  title?: string;
  // Page search & layout props for global floating integration
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
  searchPlaceholder?: string;
  quickFilters?: React.ReactNode;
  activeChips?: React.ReactNode;
  sorting?: React.ReactNode;
}

export function FullSidebarFilterPanel({
  children,
  advancedSection,
  onReset,
  title = "Filter Scope",
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  searchPlaceholder,
  quickFilters,
  activeChips,
  sorting
}: FullSidebarFilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { registerPageFilters, setIsOpen, closeDrawer } = useFloatingFilters();

  useEffect(() => {
    const pageId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    return registerPageFilters(pageId, {
      searchQuery,
      setSearchQuery,
      onSearchSubmit,
      searchPlaceholder,
      quickFilters,
      activeChips,
      sorting,
      fullFilters: (
        <div className="flex flex-col gap-4 text-left">
          {children}
          {advancedSection && (
            <div className="flex flex-col gap-4 border-t border-[#e8edf2] pt-4 mt-1">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0] text-left">Advanced Refinements</div>
              {advancedSection}
            </div>
          )}
        </div>
      ),
      footerActions: (
        <>
          <button
            type="button"
            onClick={() => closeDrawer()}
            className="flex-1 py-3 bg-orange-primary text-white hover:bg-orange-deep font-sans text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs border-none"
          >
            Apply Filters
          </button>
          {onReset && (
            <button
              type="button"
              onClick={() => {
                onReset();
                setIsOpen(false);
              }}
              className="flex-1 py-3 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-sans text-[10px] font-black uppercase tracking-wider rounded-lg border border-[#e8edf2] hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer"
            >
              Reset All
            </button>
          )}
        </>
      )
    });
  }, [
    title,
    children,
    advancedSection,
    onReset,
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
    searchPlaceholder,
    quickFilters,
    activeChips,
    sorting
  ]);

  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in text-left font-sans">
      
      {/* Header element */}
      <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-primary animate-pulse" />
          <h3 className="text-[11.5px] font-black uppercase tracking-[0.12em] text-[#1a1a2e]">{title}</h3>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-[9px] font-bold text-[#E8500A] hover:text-[#CF4400] uppercase tracking-wider transition-colors border-none bg-none cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Primary segment (Always visible) */}
      <div className="flex flex-col gap-4">
        {children}
      </div>

      {/* Advanced segment (Progressive Disclosure) */}
      {advancedSection && (
        <div className="flex flex-col gap-4 border-t border-[#e8edf2] pt-4 mt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full py-2.5 px-3 bg-[#f8fbfd] hover:bg-[#ebf3f7] text-[#1a1a2e] rounded-[5px] border border-[#e8edf2] text-[10.5px] font-black uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>{showAdvanced ? "Hide Advanced Filters ▲" : "Show Advanced Filters ▼"}</span>
            <span className="text-[8.5px] font-bold text-orange-primary py-0.5 px-2 bg-orange-primary/10 rounded-full">SPEC</span>
          </button>

          {showAdvanced && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {advancedSection}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===============================================
// GLOBAL FLOATING FILTER CONTEXT & PROVIDER SYSTEM
// ===============================================

export interface FloatingFilterData {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
  searchPlaceholder?: string;
  sectionNav?: {
    items: SectionNavItem[];
    activeId: string;
    onNavigate: (id: string) => void;
    allLabel?: string;
    allId?: string;
    profileLabel?: string;
  } | null;
  quickFilters?: React.ReactNode;
  activeChips?: React.ReactNode;
  fullFilters?: React.ReactNode;
  sorting?: React.ReactNode;
  footerActions?: React.ReactNode;
  alphabetFilter?: AlphabetFilterConfig | null;
  scrollTargetId?: string | null;
}

interface DrawerFilterContextType {
  registerPageFilters: (id: string, data: FloatingFilterData) => () => void;
  activePageId: string | null;
  activeFiltersData: FloatingFilterData | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  closeDrawer: () => void;
}

const DrawerFilterContext = createContext<DrawerFilterContextType | undefined>(undefined);

export function DrawerFilterProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [activeFiltersMap, setActiveFiltersMap] = useState<Record<string, FloatingFilterData>>({});
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const filterDrawerRef = useRef<HTMLDivElement>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  const desktopDrawerTransition = { type: 'spring' as const, damping: 32, stiffness: 280, mass: 0.8 };
  const mobileDrawerTransition = { type: 'tween' as const, ease: [0.32, 0.72, 0, 1] as const, duration: 0.28 };

  useEffect(() => {
    const mobileMedia = window.matchMedia('(max-width: 640px)');
    const tabletMedia = window.matchMedia('(min-width: 641px) and (max-width: 1023px)');
    setIsMobile(mobileMedia.matches);
    setIsTablet(tabletMedia.matches);
    const onMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const onTablet = (e: MediaQueryListEvent) => setIsTablet(e.matches);
    mobileMedia.addEventListener('change', onMobile);
    tabletMedia.addEventListener('change', onTablet);
    return () => {
      mobileMedia.removeEventListener('change', onMobile);
      tabletMedia.removeEventListener('change', onTablet);
    };
  }, []);

  const registerPageFilters = (id: string, data: FloatingFilterData) => {
    setActiveFiltersMap((prev) => ({ ...prev, [id]: data }));
    setActivePageId(id);
    return () => {
      setActiveFiltersMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setActivePageId((prev) => (prev === id ? null : prev));
    };
  };

  const activeFiltersData = activePageId ? activeFiltersMap[activePageId] : null;

  const closeDrawer = useCallback(() => {
    const targetId = activePageId ? activeFiltersMap[activePageId]?.scrollTargetId : null;
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToFilterResultsTarget(targetId), 80);
    });
  }, [activePageId, activeFiltersMap]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeDrawer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!isOpen) return;
      const target = event.target as Node;
      if (filterDrawerRef.current?.contains(target)) return;
      if (!isMobile && filterContainerRef.current?.contains(target)) return;
      closeDrawer();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, isMobile, closeDrawer]);

  return (
    <DrawerFilterContext.Provider
      value={{
        registerPageFilters,
        activePageId,
        activeFiltersData,
        isOpen,
        setIsOpen,
        closeDrawer,
      }}
    >
      {children}

      {activeFiltersData && (
        <>
        {!isMobile && isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[218] bg-black/10 cursor-pointer border-0"
            aria-label="Close filters"
            onClick={() => closeDrawer()}
          />
        )}
        <div
          ref={filterContainerRef}
          className={cn(
            'fixed z-[219] flex flex-col-reverse items-start gap-3',
            isMobile ? 'pointer-events-none' : 'bottom-6 left-6 lg:bottom-8 lg:left-8',
          )}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={filterDrawerRef}
                id="floating-filter-drawer"
                initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 12 }}
                animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0 }}
                exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 12 }}
                transition={isMobile ? mobileDrawerTransition : desktopDrawerTransition}
                style={{ willChange: 'transform' }}
                drag={isMobile ? 'y' : false}
                dragConstraints={{ top: 0, bottom: 250 }}
                dragElastic={{ top: 0.1, bottom: 0.8 }}
                onDragEnd={(_e, info) => {
                  if (info.offset.y > 120) closeDrawer();
                }}
                className={getFloatingPanelClassName({
                  isMobile,
                  isTablet,
                  textClass: 'text-[#1A1A2E]',
                })}
              >
                {isMobile && (
                  <div className="w-12 h-1 rounded-full bg-gray-200 mx-auto mt-3 shrink-0" />
                )}

                <div className="p-5 border-b border-[#e8edf2] bg-gradient-to-br from-[#FFF8F5]/85 to-[#FFF0E8]/50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-11 h-11 rounded-full bg-orange-primary/10 flex items-center justify-center border border-[#e8edf2] shrink-0">
                      <SlidersHorizontal size={18} className="text-orange-primary" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-primary">
                        Consolidated Discovery
                      </div>
                      <h3 className="text-xs font-black text-heading leading-tight uppercase">
                        Filters & Search
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => closeDrawer()}
                    className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-heading transition-all border border-[#e8edf2] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#F8FBFD] text-navy scroll-smooth p-5 space-y-5 text-left no-scrollbar">
                  {(activeFiltersData.searchQuery !== undefined || activeFiltersData.onSearchSubmit) && (
                    <div className="flex flex-col gap-2">
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">Page Search</div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (activeFiltersData.onSearchSubmit) {
                            activeFiltersData.onSearchSubmit(activeFiltersData.searchQuery || '');
                          }
                        }}
                        className="relative w-full"
                      >
                        <div className="flex items-center bg-white rounded-[5px] border border-[#e8edf2] overflow-hidden focus-within:border-orange-primary/40 transition-all">
                          <div className="pl-4 text-orange-primary shrink-0">
                            <Search className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={activeFiltersData.searchQuery || ''}
                            onChange={(e) => {
                              if (activeFiltersData.setSearchQuery) {
                                activeFiltersData.setSearchQuery(e.target.value);
                              }
                            }}
                            placeholder={activeFiltersData.searchPlaceholder || 'Search catalog...'}
                            className="w-full h-11 bg-transparent outline-none pl-3 pr-4 text-heading text-xs font-semibold placeholder-gray-400 border-none"
                          />
                        </div>
                      </form>
                    </div>
                  )}

                  {activeFiltersData.alphabetFilter && (
                    <AlphabetFilterStrip
                      activeLetter={activeFiltersData.alphabetFilter.activeLetter}
                      onLetterChange={activeFiltersData.alphabetFilter.onLetterChange}
                      compact
                    />
                  )}

                  {activeFiltersData.sectionNav && activeFiltersData.sectionNav.items.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">
                        {activeFiltersData.sectionNav.profileLabel || 'On this page'}
                      </div>
                      <div className="w-full bg-white border border-[#e8edf2] rounded-[5px] p-3 shadow-sm">
                        <DragScrollContainer className="gap-2 pb-0 py-0 items-center">
                          <button
                            type="button"
                            onClick={() => activeFiltersData.sectionNav?.onNavigate(activeFiltersData.sectionNav.allId || 'all')}
                            className={cn(
                              'shrink-0 px-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap',
                              activeFiltersData.sectionNav.activeId === (activeFiltersData.sectionNav.allId || 'all')
                                ? 'bg-[#E8500A] text-white border border-[#E8500A] shadow-md shadow-[#E8500A]/20'
                                : 'bg-white text-[#1A1D4E] border border-[#e8edf2] hover:border-[#E8500A]/30 hover:text-[#E8500A]',
                            )}
                          >
                            {activeFiltersData.sectionNav.allLabel || 'Overview'}
                          </button>
                          {activeFiltersData.sectionNav.items
                            .filter((item) => !item.hidden)
                            .map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => activeFiltersData.sectionNav?.onNavigate(item.id)}
                                className={cn(
                                  'shrink-0 px-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap',
                                  activeFiltersData.sectionNav?.activeId === item.id
                                    ? 'bg-[#E8500A] text-white border border-[#E8500A] shadow-md shadow-[#E8500A]/20'
                                    : 'bg-white text-[#1A1D4E] border border-[#e8edf2] hover:border-[#E8500A]/30 hover:text-[#E8500A]',
                                )}
                              >
                                {item.icon}
                                <span>{item.label}</span>
                              </button>
                            ))}
                        </DragScrollContainer>
                      </div>
                    </div>
                  )}

                  {activeFiltersData.quickFilters && (
                    <div className="flex flex-col gap-2">
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">Quick Filters</div>
                      <div className="w-full bg-white border border-[#e8edf2] rounded-[5px] p-3 shadow-sm">
                        {activeFiltersData.quickFilters}
                      </div>
                    </div>
                  )}

                  {activeFiltersData.activeChips && (
                    <div className="flex flex-col gap-2">{activeFiltersData.activeChips}</div>
                  )}

                  {activeFiltersData.fullFilters && (
                    <div className="flex flex-col gap-2">
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">All Filters</div>
                      <div>{activeFiltersData.fullFilters}</div>
                    </div>
                  )}

                  {activeFiltersData.sorting && (
                    <div className="flex flex-col gap-2">
                      <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] text-left">Sorting & Display</div>
                      <div className="w-full bg-white border border-[#e8edf2] rounded-[5px] p-4 shadow-sm">
                        {activeFiltersData.sorting}
                      </div>
                    </div>
                  )}
                </div>

                {activeFiltersData.footerActions && (
                  <div className="p-4 border-t border-[#e8edf2] bg-gray-50 flex gap-2 shrink-0">
                    {activeFiltersData.footerActions}
                  </div>
                )}

                {isMobile && !activeFiltersData.footerActions && (
                  <div className="px-5 py-4 border-t border-[#e8edf2] bg-white shrink-0">
                    <button
                      type="button"
                      onClick={() => closeDrawer()}
                      className="w-full py-3.5 bg-orange-primary hover:bg-orange-deep text-white text-[11px] font-black uppercase tracking-widest rounded-[5px] transition-colors cursor-pointer border-0"
                    >
                      Show Results
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!isMobile && (
          <motion.button
            id="floating-filters-launcher"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none pointer-events-auto',
              isOpen
                ? 'bg-surface-selected border-orange-primary text-orange-primary'
                : 'bg-white border-[#e8edf2] text-heading hover:border-orange-primary/40',
            )}
            title="Filters & Search"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={15}
                className={cn(
                  'transition-colors',
                  isOpen ? 'text-orange-primary' : 'text-[#8a9bb0] group-hover:text-orange-primary',
                )}
              />
              <span className="text-[10px] font-black uppercase tracking-wider">Filters & Search</span>
            </div>
            <ChevronRight
              size={14}
              className={cn(
                'transition-transform duration-300',
                isOpen ? 'text-orange-primary rotate-90' : 'text-[#8a9bb0] group-hover:text-orange-primary group-hover:translate-x-1',
              )}
            />
          </motion.button>
          )}
        </div>
        </>
      )}
    </DrawerFilterContext.Provider>
  );
}

export function useFloatingFilters() {
  const context = useContext(DrawerFilterContext);
  if (!context) {
    throw new Error('useFloatingFilters must be used within a DrawerFilterProvider');
  }
  return context;
}

/** Opens the page floating filter drawer (DrawerFilterProvider or legacy FloatingOverlays panel). */
export function useOpenPageFilters() {
  const { config } = useFloatingFilter();
  const { activeFiltersData, setIsOpen, isOpen: drawerOpen } = useFloatingFilters();

  const hasDrawerFilters = !!activeFiltersData;
  const hasLegacyFilters =
    !hasDrawerFilters &&
    Boolean(
      config.renderFilters ||
        config.renderSearch ||
        (config.quickFilters && config.quickFilters.length > 0),
    );

  const canOpenFilters = hasDrawerFilters || hasLegacyFilters;
  const activeFilterCount = config.activeFilterCount ?? 0;

  const openFilters = useCallback(() => {
    if (hasDrawerFilters) {
      setIsOpen(true);
      return;
    }
    if (hasLegacyFilters) {
      window.dispatchEvent(new CustomEvent('choosify:open-filters'));
    }
  }, [hasDrawerFilters, hasLegacyFilters, setIsOpen]);

  return {
    canOpenFilters,
    openFilters,
    isFiltersOpen: drawerOpen,
    activeFilterCount,
  };
}

export function RegisterPageFilters({
  id,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  searchPlaceholder,
  sectionNav,
  quickFilters,
  activeChips,
  fullFilters,
  sorting,
  footerActions
}: { id: string } & FloatingFilterData) {
  const { registerPageFilters } = useFloatingFilters();

  useEffect(() => {
    return registerPageFilters(id, {
      searchQuery,
      setSearchQuery,
      onSearchSubmit,
      searchPlaceholder,
      sectionNav,
      quickFilters,
      activeChips,
      fullFilters,
      sorting,
      footerActions
    });
  }, [id, searchQuery, setSearchQuery, onSearchSubmit, searchPlaceholder, sectionNav, quickFilters, activeChips, fullFilters, sorting, footerActions]);

  return null;
}

// ==========================================
// FLOATING FILTER CONTEXT
// Shared between pages and FloatingOverlays
// ==========================================

export interface FloatingFilterConfig {
  // The complete left sidebar filter render function for this page
  // Pages pass their entire sidebar filter JSX as a render prop
  renderFilters: (() => React.ReactNode) | null;
  // The page search bar — render prop
  renderSearch: (() => React.ReactNode) | null;
  sectionNav?: {
    items: SectionNavItem[];
    activeId: string;
    onNavigate: (id: string) => void;
    allLabel?: string;
    allId?: string;
    profileLabel?: string;
  } | null;
  // Active filter count for the badge
  activeFilterCount: number;
  // Quick filter bar chips for this page
  quickFilters: QuickFilter[];
  // Page name for the drawer header
  pageName: string;
  // Clear all filters for this page
  onClearAll: (() => void) | null;
  /** A–Z letter strip shown below search in the floating filter drawer */
  alphabetFilter?: AlphabetFilterConfig | null;
  /** Section id to scroll to when the filter drawer closes */
  scrollTargetId?: string | null;
}

const defaultConfig: FloatingFilterConfig = {
  renderFilters: null,
  renderSearch: null,
  activeFilterCount: 0,
  quickFilters: [],
  pageName: '',
  onClearAll: null,
};

export const FloatingFilterContext = createContext<{
  config: FloatingFilterConfig;
  setConfig: (config: FloatingFilterConfig) => void;
}>({
  config: defaultConfig,
  setConfig: () => {},
});

export function useFloatingFilter() {
  return useContext(FloatingFilterContext);
}

// Provider — wrap App with this
export function FloatingFilterProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<FloatingFilterConfig>(defaultConfig);
  return (
    <FloatingFilterContext.Provider value={{ config, setConfig }}>
      {children}
    </FloatingFilterContext.Provider>
  );
}

// Hook for pages to register their filter config
// Call this inside a page to register filter callbacks and active values
export function useRegisterPageFilters(config: FloatingFilterConfig, deps?: any[]) {
  const { setConfig } = useFloatingFilter();
  
  const prevDepsRef = useRef<any[] | undefined>(undefined);
  const prevConfigRef = useRef<FloatingFilterConfig | undefined>(undefined);

  useEffect(() => {
    let shouldUpdate = false;

    if (deps) {
      // Compare deps array manually if provided
      if (!prevDepsRef.current) {
        shouldUpdate = true;
      } else {
        shouldUpdate = deps.some((dep, i) => !Object.is(dep, prevDepsRef.current?.[i]));
      }
      prevDepsRef.current = deps;
    } else {
      // Do a robust semantic comparison of the config properties if no deps are provided
      if (!prevConfigRef.current) {
        shouldUpdate = true;
      } else {
        const prev = prevConfigRef.current;
        const isSame = 
          prev.pageName === config.pageName &&
          prev.activeFilterCount === config.activeFilterCount &&
          prev.onClearAll === config.onClearAll &&
          prev.quickFilters.length === config.quickFilters.length &&
          prev.quickFilters.every((q, i) => {
            const target = config.quickFilters[i];
            return target && q.id === target.id && q.label === target.label && q.active === target.active;
          });
        shouldUpdate = !isSame;
      }
    }

    if (shouldUpdate) {
      setConfig(config);
    }

    prevConfigRef.current = config;
  }); // Runs on every render to manually check dependency/config updates safely

  // Reset config only on true unmount — a per-render cleanup would wipe the
  // registration whenever the page re-renders without config changes.
  useEffect(() => {
    return () => {
      setConfig(defaultConfig);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}


