import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { cn } from '../lib/utils';
import { Star, ShieldCheck, HelpCircle, Check, Sparkles, Flame, Tag, DollarSign, Filter, Search, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  entity: 'products' | 'brands' | 'deals' | 'creators' | 'recommendations' | 'categories' | 'guides';
  filters: FilterDefinition[];
}

// ==========================================
// DRAG SCROLL HELPER HOOK FOR HORIZONTAL SCROLL
// ==========================================
export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {
    ref,
    props: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
      style: { cursor: isDragging ? 'grabbing' : 'grab' }
    }
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
          "flex flex-row items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth select-none pb-1 py-1 w-full -webkit-overflow-scrolling-touch",
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

export const PRODUCTS_PAGE_FILTER_PROFILE: FilterProfile = {
  entity: 'products',
  filters: [
    {
      id: 'price_custom',
      name: 'Price Scope (BDT)',
      type: 'price_custom',
    },
    {
      id: 'category',
      name: 'Categories',
      type: 'single_select',
    },
    {
      id: 'brand',
      name: 'Featured Brands',
      type: 'single_select',
    },
    {
      id: 'rating',
      name: 'Rating Score',
      type: 'single_select',
    },
    {
      id: 'availability',
      name: 'Availability',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Items' },
        { value: 'in-stock', label: 'In Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' }
      ]
    }
  ]
};

export const DEALS_PAGE_FILTER_PROFILE: FilterProfile = {
  entity: 'deals',
  filters: [
    {
      id: 'category',
      name: 'Category Channel',
      type: 'single_select'
    },
    {
      id: 'deal_channel',
      name: 'Wholesale vs Retail',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Channels' },
        { value: 'retail', label: 'Retail Only' },
        { value: 'wholesale', label: 'Wholesale Only' }
      ]
    },
    {
      id: 'discount_range',
      name: 'Minimum Discount',
      type: 'range',
      min: 0,
      max: 70,
      step: 10,
      unit: '% Off'
    }
  ]
};

export const CREATORS_PAGE_FILTER_PROFILE: FilterProfile = {
  entity: 'creators',
  filters: [
    {
      id: 'alphabet',
      name: 'Initial Selector',
      type: 'alphabet'
    },
    {
      id: 'niche',
      name: 'Niche Markets',
      type: 'single_select'
    },
    {
      id: 'verification',
      name: 'Verified Badges',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Creators' },
        { value: 'verified', label: 'Verified Only' },
        { value: 'unverified', label: 'Independent' }
      ]
    },
    {
      id: 'engagement',
      name: 'Engagement Rating',
      type: 'single_select',
      options: [
        { value: 'all', label: 'All Ratings' },
        { value: 'high', label: 'Top-Tier Engagement (4.8+)' },
        { value: 'normal', label: 'Standard Rating' }
      ]
    }
  ]
};

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
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B00]" />
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
                      ? "bg-[#FF5B00] text-white border-transparent shadow-xs font-black italic"
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
                className="px-4 py-2 rounded-full text-[10.5px] font-black uppercase tracking-widest text-[#FF5B00] bg-orange-primary/5 hover:bg-orange-primary/10 border border-dashed border-[#FF5B00]/30 flex items-center gap-1 shrink-0 cursor-pointer"
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F8FA] border border-[#D9E6ED] rounded-[4px] text-[10px] font-black text-[#1A1D4E] uppercase tracking-wider shadow-2xs hover:border-[#FF5B00]/30 transition-all"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="text-[#FF5B00] hover:text-[#EB4501] transition-colors p-[1.5px] rounded-full hover:bg-red-500/10 cursor-pointer border-none bg-none flex items-center justify-center"
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
            className="text-[10px] font-extrabold text-[#FF5B00] uppercase tracking-widest hover:text-[#EB4501] ml-3 transition-colors cursor-pointer border-none bg-transparent hover:underline"
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
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-primary italic block">🔥 Smartphone Smart Specs</span>
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
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-primary italic block">👔 Fashion Custom Specs</span>
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
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-primary italic block">🕶️ Eyewear Smart Specs</span>
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
  const { registerPageFilters, setIsOpen } = useFloatingFilters();

  const latestPropsRef = useRef({
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
    searchPlaceholder,
    quickFilters,
    activeChips,
    sorting,
    children,
    advancedSection,
    onReset
  });

  latestPropsRef.current = {
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
    searchPlaceholder,
    quickFilters,
    activeChips,
    sorting,
    children,
    advancedSection,
    onReset
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.pathname.includes('/overview') || window.location.hash.includes('overview'))) {
      return;
    }

    const pageId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const delegate = {
      get searchQuery() { return latestPropsRef.current.searchQuery; },
      get setSearchQuery() { return latestPropsRef.current.setSearchQuery; },
      get onSearchSubmit() { return latestPropsRef.current.onSearchSubmit; },
      get searchPlaceholder() { return latestPropsRef.current.searchPlaceholder; },
      get quickFilters() { return latestPropsRef.current!.quickFilters; },
      get activeChips() { return latestPropsRef.current.activeChips; },
      get sorting() { return latestPropsRef.current.sorting; },
      get fullFilters() {
        const { children: curChildren, advancedSection: curAdvanced } = latestPropsRef.current;
        return (
          <div className="flex flex-col gap-4 text-left">
            {curChildren}
            {curAdvanced && (
              <div className="flex flex-col gap-4 border-t border-[#e8edf2] pt-4 mt-1">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0] text-left">Advanced Refinements</div>
                {curAdvanced}
              </div>
            )}
          </div>
        );
      },
      get footerActions() {
        return (
          <>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 bg-[#FF5B00] text-white hover:bg-[#EB4501] font-sans text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-xs border-none"
            >
              Apply Filters
            </button>
            {latestPropsRef.current.onReset && (
              <button
                onClick={() => {
                  latestPropsRef.current.onReset?.();
                  setIsOpen(false);
                }}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-sans text-[10px] font-black uppercase tracking-wider rounded-lg border border-white/15 flex items-center justify-center transition-all cursor-pointer"
              >
                Reset All
              </button>
            )}
          </>
        );
      }
    };

    return registerPageFilters(pageId, delegate);
  }, [title, registerPageFilters]);

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
            className="text-[9px] font-bold text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider transition-colors border-none bg-none cursor-pointer"
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
  quickFilters?: React.ReactNode;
  activeChips?: React.ReactNode;
  fullFilters?: React.ReactNode;
  sorting?: React.ReactNode;
  footerActions?: React.ReactNode;
}

interface DrawerFilterContextType {
  registerPageFilters: (id: string, data: FloatingFilterData) => () => void;
  activePageId: string | null;
  activeFiltersData: FloatingFilterData | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DrawerFilterContext = createContext<DrawerFilterContextType | undefined>(undefined);

export function DrawerFilterProvider({ children }: { children: React.ReactNode }) {
  const [activeFiltersMap, setActiveFiltersMap] = useState<Record<string, FloatingFilterData>>({});
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const registerPageFilters = React.useCallback((id: string, data: FloatingFilterData) => {
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
  }, []);

  const activeFiltersData = activePageId ? activeFiltersMap[activePageId] : null;

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DrawerFilterContext.Provider
      value={{
        registerPageFilters,
        activePageId,
        activeFiltersData,
        isOpen,
        setIsOpen,
      }}
    >
      {children}

      {/* FLOATING LAUNCHER BUTTON ON BOTTOM LEFT */}
      <AnimatePresence>
        {activeFiltersData && !isOpen && (
          <div className={cn(
            "fixed z-[220] flex flex-col items-start font-sans",
            isMobile ? "bottom-4 left-4" : "bottom-6 left-6 lg:bottom-8 lg:left-8"
          )}>
            <motion.button
              id="floating-filters-launcher"
              onClick={() => setIsOpen(true)}
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 cursor-pointer bg-white border-[#e8edf2] text-[#1A1A2E] hover:border-[#FF5B00]/40 focus:outline-none group"
              title="Filters & Search"
            >
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-[#8a9bb0] group-hover:text-[#FF5B00] transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Filters & Search
                </span>
              </div>
              <ChevronRight size={14} className="text-[#8a9bb0] group-hover:text-[#FF5B00] group-hover:translate-x-1 transition-all" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* FILTER DRAWER / BOTTOM SHEET */}
      <AnimatePresence>
        {isOpen && activeFiltersData && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[240]"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              id="floating-filter-drawer"
              initial={isMobile ? { y: '100%' } : { x: '-100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={cn(
                "bg-[#0A0B1E]/95 backdrop-blur-xl border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white flex flex-col z-[250]",
                isMobile
                  ? "fixed bottom-0 left-0 right-0 h-[85vh] rounded-t-[32px] w-full border-t border-white/10"
                  : "fixed left-0 top-0 bottom-0 w-[420px] max-w-full border-r border-white/10"
              )}
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00]">
                    <Filter size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#FF5B00] font-extrabold text-left">Consolidated discovery</div>
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-left">Filter & Search Panel</h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 hover:border-white/20 transition-all text-white shrink-0 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer Scrollable Body with Clean light theme style for perfect high-contrast filter rendering */}
              <div className="flex-1 overflow-y-auto bg-[#F8FBFD] text-navy scroll-smooth p-6 space-y-6 text-left">
                {/* 1. Page Search */}
                {(activeFiltersData.searchQuery !== undefined || activeFiltersData.onSearchSubmit) && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0] text-left">Page Directory Search</div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (activeFiltersData.onSearchSubmit) {
                          activeFiltersData.onSearchSubmit(activeFiltersData.searchQuery || '');
                        }
                      }}
                      className="relative w-full bg-[#0A0B1E]/5 p-1 rounded-full border border-gray-200 focus-within:border-[#FF5B00]/40 transition-all duration-300"
                    >
                      <div className="flex items-center bg-white rounded-full overflow-hidden">
                        <div className="pl-4 text-[#FF5B00] shrink-0">
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
                          placeholder={activeFiltersData.searchPlaceholder || "Search catalog..."}
                          className="w-full h-10 bg-transparent outline-none pl-3 pr-20 text-navy text-xs font-semibold placeholder-gray-400 focus:outline-none focus:ring-0 border-none"
                        />
                        <button
                          type="submit"
                          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#FF5B00] hover:from-[#FF5B00] hover:to-[#EB4501] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border-0"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 2. Quick Filters */}
                {activeFiltersData!.quickFilters && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0] text-left">Quick Filters</div>
                    <div className="w-full bg-white border border-[#e8edf2] rounded-[5px] p-3 shadow-sm">
                      {activeFiltersData!.quickFilters}
                    </div>
                  </div>
                )}

                {/* 3. Active Chips */}
                {activeFiltersData.activeChips && (
                  <div className="flex flex-col gap-2">
                    {activeFiltersData.activeChips}
                  </div>
                )}

                {/* 4. Full Filter Architecture V2 */}
                {activeFiltersData.fullFilters && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0] text-left">Advanced Refinements</div>
                    <div>
                      {activeFiltersData.fullFilters}
                    </div>
                  </div>
                )}

                {/* 5. Sorting */}
                {activeFiltersData.sorting && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0] text-left">Sorting & Display</div>
                    <div className="w-full bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm">
                      {activeFiltersData.sorting}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Footer Actions */}
              {activeFiltersData.footerActions && (
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex gap-2 shrink-0">
                  {activeFiltersData.footerActions}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

export function RegisterPageFilters({
  id,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  searchPlaceholder,
  quickFilters,
  activeChips,
  fullFilters,
  sorting,
  footerActions
}: { id: string } & FloatingFilterData) {
  const { registerPageFilters } = useFloatingFilters();

  const latestPropsRef = useRef({
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
    searchPlaceholder,
    quickFilters,
    activeChips,
    fullFilters,
    sorting,
    footerActions
  });
  
  latestPropsRef.current = {
    searchQuery,
    setSearchQuery,
    onSearchSubmit,
    searchPlaceholder,
    quickFilters,
    activeChips,
    fullFilters,
    sorting,
    footerActions
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.pathname.includes('/overview') || window.location.hash.includes('overview'))) {
      return;
    }

    const delegate: FloatingFilterData = {
      get searchQuery() { return latestPropsRef.current.searchQuery; },
      get setSearchQuery() { return latestPropsRef.current.setSearchQuery; },
      get onSearchSubmit() { return latestPropsRef.current.onSearchSubmit; },
      get searchPlaceholder() { return latestPropsRef.current.searchPlaceholder; },
      get quickFilters() { return latestPropsRef.current!.quickFilters; },
      get activeChips() { return latestPropsRef.current.activeChips; },
      get sorting() { return latestPropsRef.current.sorting; },
      get fullFilters() { return latestPropsRef.current.fullFilters; },
      get footerActions() { return latestPropsRef.current.footerActions; }
    };

    return registerPageFilters(id, delegate);
  }, [id, registerPageFilters]);

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
  // Active filter count for the badge
  activeFilterCount?: number;
  // Quick filter bar chips for this page
  quickFilters?: QuickFilter[];
  // Page name for the drawer header
  pageName: string;
  // Clear all filters for this page
  onClearAll: (() => void) | null;
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
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  config: defaultConfig,
  setConfig: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export function useFloatingFilter() {
  return useContext(FloatingFilterContext);
}

// Provider — wrap App with this
export function FloatingFilterProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<FloatingFilterConfig>(defaultConfig);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FloatingFilterContext.Provider value={{ config, setConfig, isOpen, setIsOpen }}>
      {children}
    </FloatingFilterContext.Provider>
  );
}

// Hook for pages to register their filter config
// Call this inside a page to register filter callbacks and active values
export function useRegisterPageFilters(config: FloatingFilterConfig, deps?: any[]) {
  const { setConfig } = useFloatingFilter();
  
  const latestConfigRef = useRef(config);
  latestConfigRef.current = config;

  const prevDepsRef = useRef<any[] | undefined>(undefined);
  const prevConfigRef = useRef<FloatingFilterConfig | undefined>(undefined);

  // Cleanup on unmount to clear registered filters
  useEffect(() => {
    return () => {
      setConfig(defaultConfig);
    };
  }, []);

  // Update registered filter config when dependencies or contents change
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.pathname.includes('/overview') || window.location.hash.includes('overview'))) {
      return;
    }

    let shouldUpdate = false;

    if (deps) {
      if (!prevDepsRef.current) {
        shouldUpdate = true;
      } else {
        shouldUpdate = deps.some((dep, i) => !Object.is(dep, prevDepsRef.current?.[i]));
      }
      prevDepsRef.current = deps;
    } else {
      if (!prevConfigRef.current) {
        shouldUpdate = true;
      } else {
        const prev = prevConfigRef.current;
        const isSame = 
          prev.pageName === config.pageName &&
          prev.activeFilterCount === config.activeFilterCount &&
          (prev.quickFilters?.length || 0) === (config.quickFilters?.length || 0) &&          (prev.quickFilters || []).every((q, i) => {            const target = (config.quickFilters || [])[i];
            return target && q.id === target.id && q.label === target.label && q.active === target.active;
          });
        shouldUpdate = !isSame;
      }
    }

    if (shouldUpdate) {
      const delegate: FloatingFilterConfig = {
        pageName: config.pageName,
        activeFilterCount: config.activeFilterCount,
        quickFilters: config?.quickFilters || [],
        get onClearAll() { return latestConfigRef.current.onClearAll; },
        get renderFilters() { return latestConfigRef.current.renderFilters; },
        get renderSearch() { return latestConfigRef.current.renderSearch; }
      };
      setConfig(delegate);
    }
    
    prevConfigRef.current = config;
  }); // Runs on every render to manually check dependency/config updates safely
}


