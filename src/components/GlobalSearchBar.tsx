import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Folder, User, Clock, ArrowRight, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { PRODUCTS, BRANDS, CATEGORIES } from '../constants';
import { CREATORS } from '../data/creators';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { getBrandOverviews, getProductOverviews } from '../utils/overviewRegistry';

interface GlobalSearchBarProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  onSubmit?: (query: string) => void;
  variant?: 'hero' | 'navbar' | 'standard';
  /** Controlled value for page-local filtering (disables internal query state when set) */
  value?: string;
  onValueChange?: (query: string) => void;
  /** Show autocomplete dropdown — off for catalog filter bars */
  enableSuggestions?: boolean;
  submitLabel?: string;
  /** Edge-to-edge navbar layout: icon-only on xs, compact on sm/md, full on lg+ */
  layout?: 'default' | 'navbar-fluid';
  onMobileExpandedChange?: (expanded: boolean) => void;
}

interface SuggestionItem {
  id: string;
  type: 'query' | 'product' | 'brand' | 'creator' | 'category' | 'recent' | 'popular' | 'trending';
  title: string;
  subtitle?: string;
  image?: string;
  route: string;
  badge?: string;
}

const matchSearchText = (value: unknown, query: string) =>
  typeof value === 'string' && value.toLowerCase().includes(query);

export function GlobalSearchBar({
  initialValue = '',
  placeholder = "Search authentic Fashion hubs, Smart Gadgets & verified outlets...",
  className = '',
  onSubmit,
  variant = 'standard',
  value,
  onValueChange,
  enableSuggestions = true,
  submitLabel = 'DISCOVER',
  layout = 'default',
  onMobileExpandedChange,
}: GlobalSearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isNavbarFluid = layout === 'navbar-fluid';
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const setMobileExpandedState = (next: boolean) => {
    setMobileExpanded(next);
    onMobileExpandedChange?.(next);
  };
  const isControlled = value !== undefined;
  const [query, setQuery] = useState(initialValue || searchParams.get('q') || '');
  const queryValue = isControlled ? value : query;
  const setQueryValue = (next: string) => {
    if (isControlled) onValueChange?.(next);
    else setQuery(next);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { customOverviews } = useDashboard();
  const { allProducts, allBrands, allCategories, allCreators, siteConfig } = useGlobalState();

  const productSource = allProducts.length > 0 ? allProducts : PRODUCTS;
  const brandSource = allBrands.length > 0
    ? allBrands.map((b) => ({ ...b, products: (b as any).followers ?? (b as any).products ?? 0, rating: (b as any).ratings ?? (b as any).rating ?? 0 }))
    : BRANDS;
  const creatorSource = allCreators.length > 0 ? allCreators : CREATORS;
  const categorySource = allCategories.length > 0
    ? allCategories.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))
    : CATEGORIES;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({ visibility: 'hidden' });

  // Sync with searchParams or initial value (uncontrolled mode only)
  useEffect(() => {
    if (isControlled) return;
    const qParam = searchParams.get('q') || '';
    if (initialValue) {
      setQuery(initialValue);
    } else if (qParam) {
      setQuery(qParam);
    }
  }, [searchParams, initialValue, isControlled]);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('choosify_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        // Fallback default recent searches
        setRecentSearches(['Aarong', 'Yellow', 'Sony WH-1000XM5']);
      }
    } catch (e) {
      setRecentSearches(['Aarong', 'Yellow', 'Sony WH-1000XM5']);
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('choosify_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearRecent = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((_, idx) => idx !== indexToRemove);
      setRecentSearches(updated);
      localStorage.setItem('choosify_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Close suggestions dropdown on click outside (input + portaled panel)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (mobileOverlayRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
      if (isNavbarFluid && mobileExpanded) {
        setMobileExpandedState(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNavbarFluid, mobileExpanded]);

  useEffect(() => {
    setMobileExpandedState(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isNavbarFluid) return;
    const mq = window.matchMedia('(min-width: 640px)');
    const sync = () => {
      if (mq.matches) setMobileExpandedState(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [isNavbarFluid]);

  // Pin dropdown to the search field — escapes navbar color/overflow clipping
  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const anchor =
        isNavbarFluid && mobileExpanded && mobileOverlayRef.current
          ? mobileOverlayRef.current
          : containerRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const isMobileOverlay = isNavbarFluid && mobileExpanded && viewportWidth < 640;
      const minWidth = isMobileOverlay ? viewportWidth - 24 : 300;
      const maxWidth = isMobileOverlay ? viewportWidth - 24 : Math.min(420, viewportWidth - 16);
      const width = Math.min(Math.max(rect.width, minWidth), maxWidth);
      let left = isMobileOverlay ? 12 : rect.left;
      if (!isMobileOverlay && left + width > viewportWidth - 8) {
        left = viewportWidth - width - 8;
      }
      left = Math.max(8, left);

      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left,
        width,
        maxHeight: isMobileOverlay ? Math.min(385, window.innerHeight - rect.bottom - 16) : 385,
        visibility: 'visible',
        zIndex: 300,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, queryValue, variant, isNavbarFluid, mobileExpanded]);

  // Static Preset Lists
  const popularSearches = useMemo(() => {
    const cmsTerms = (siteConfig?.popularSearches ?? [])
      .filter((item) => item.isActive && item.term.trim())
      .sort((a, b) => a.order - b.order)
      .map((item) => item.term);
    return cmsTerms.length > 0 ? cmsTerms.slice(0, 6) : ['iPhone 15', 'Apex', 'Yellow', 'Sony WH-1000XM5'];
  }, [siteConfig?.popularSearches]);

  const trendingSearches = useMemo(() => {
    const cmsTerms = (siteConfig?.popularSearches ?? [])
      .filter((item) => item.isActive && item.term.trim())
      .sort((a, b) => a.order - b.order)
      .slice(6, 10)
      .map((item) => item.term);
    return cmsTerms.length > 0
      ? cmsTerms
      : ['Samsung S24 Ultra', 'Gift wrapping', 'Sailor', 'PC Build'];
  }, [siteConfig?.popularSearches]);
  const commonKeywords = [
    'iphone', 'iphone 15', 'iphone charger', 'iphone cover', 'samsung galaxy', 'samsung s24',
    'gift wrapping', 'airport pickup', 't-shirt', 'casual wear', 'sound system', 'laptop',
    'gaming console', 'leather shoes', 'beauty care', 'eid panjabi', 'headphones', 'earbuds',
    'aarong salwar kameez', 'apex shoes', 'sailor clothing'
  ];

  // Dynamically compute suggestions list
  const suggestionsGrouped = useMemo(() => {
    const q = queryValue.trim().toLowerCase();
    
    // 1. BEFORE TYPING STATE
    if (!q) {
      const recents: SuggestionItem[] = recentSearches.map((s, idx) => ({
        id: `recent-${idx}-${s}`,
        type: 'recent',
        title: s,
        route: `/search?q=${encodeURIComponent(s)}`
      }));

      const populars: SuggestionItem[] = popularSearches.map((s, idx) => ({
        id: `popular-${idx}-${s}`,
        type: 'popular',
        title: s,
        route: `/search?q=${encodeURIComponent(s)}`
      }));

      const trendings: SuggestionItem[] = trendingSearches.map((s, idx) => ({
        id: `trending-${idx}-${s}`,
        type: 'trending',
        title: s,
        route: `/search?q=${encodeURIComponent(s)}`
      }));

      return {
        recent: recents,
        popular: populars,
        trending: trendings,
        queries: [],
        products: [],
        brands: [],
        creators: [],
        categories: [],
        totalCount: recents.length + populars.length + trendings.length
      };
    }

    // 2. ACTIVE TYPING STATE: Filter lists using the search query
    
    // 2.1 Suggested Queries
    const matchedQueries: SuggestionItem[] = commonKeywords
      .filter(k => k.toLowerCase().includes(q))
      .slice(0, 4)
      .map((k, idx) => ({
        id: `query-${idx}-${k}`,
        type: 'query',
        title: k,
        route: `/search?q=${encodeURIComponent(k)}`
      }));

    // 2.2 Products Matching (Check title, brand, category, description, and overviews)
    const matchedProducts: SuggestionItem[] = productSource.filter(p => {
      const pOverviews = getProductOverviews(p.id, p.title, p.category, customOverviews || []);
      const matchedOverview = Object.values(pOverviews).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(q)
      );

      return matchSearchText(p.title, q) ||
             matchSearchText(p.brand, q) ||
             matchSearchText(p.category, q) ||
             matchSearchText(p.description, q) ||
             matchedOverview;
    })
    .slice(0, 3)
    .map(p => ({
      id: `product-${p.id}`,
      type: 'product',
      title: p.title,
      subtitle: `${p.brand} • BDT ${p.price}`,
      image: p.image,
      route: `/products/${p.id}`,
      badge: p.tag
    }));

    // 2.3 Brands Matching (Check name, category, and overviews)
    const matchedBrands: SuggestionItem[] = brandSource.filter(b => {
      const bOverviews = getBrandOverviews(b.name, customOverviews || []);
      const matchedOverview = Object.values(bOverviews).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(q)
      );

      return matchSearchText(b.name, q) ||
             matchSearchText(b.category, q) ||
             matchedOverview;
    })
    .slice(0, 3)
    .map(b => ({
      id: `brand-${b.id}`,
      type: 'brand',
      title: b.name,
      subtitle: `${b.category || 'Brand'} • ${b.products ?? 0} Products`,
      route: `/brands/${b.id}`,
      badge: b.rating >= 4.8 ? 'Verified' : undefined
    }));

    // 2.4 Creators Matching (Check name, handle, bio, bestFor)
    const matchedCreators: SuggestionItem[] = creatorSource.filter(c => {
      return matchSearchText(c.name, q) ||
             matchSearchText(c.handle, q) ||
             matchSearchText(c.bio, q) ||
             matchSearchText(c.bestFor, q);
    })
    .slice(0, 3)
    .map(c => ({
      id: `creator-${c.id}`,
      type: 'creator',
      title: c.name,
      subtitle: `${c.handle || '@creator'} • ${c.bestFor || 'Creator'} Expert`,
      image: c.avatar,
      route: `/creators/${c.id}`
    }));

    // 2.5 Categories Matching (Check name)
    const matchedCategories: SuggestionItem[] = categorySource.filter(c => matchSearchText(c.name, q))
    .slice(0, 3)
    .map(c => ({
      id: `category-${c.id}`,
      type: 'category',
      title: c.name,
      route: `/products?category=${encodeURIComponent(c.name)}`,
      badge: 'Category'
    }));

    const totalCount = matchedQueries.length + matchedProducts.length + matchedBrands.length + matchedCreators.length + matchedCategories.length;

    return {
      recent: [],
      popular: [],
      trending: [],
      queries: matchedQueries,
      products: matchedProducts,
      brands: matchedBrands,
      creators: matchedCreators,
      categories: matchedCategories,
      totalCount
    };
  }, [queryValue, recentSearches, customOverviews, productSource, brandSource, creatorSource, categorySource]);

  // Create flat suggestion list for arrow-key keyboard navigation
  const flatSuggestions = useMemo(() => {
    const list: SuggestionItem[] = [];
    
    if (!queryValue.trim()) {
      list.push(...suggestionsGrouped.recent);
      list.push(...suggestionsGrouped.popular);
      list.push(...suggestionsGrouped.trending);
    } else {
      list.push(...suggestionsGrouped.queries);
      list.push(...suggestionsGrouped.products);
      list.push(...suggestionsGrouped.brands);
      list.push(...suggestionsGrouped.creators);
      list.push(...suggestionsGrouped.categories);
    }
    
    return list;
  }, [queryValue, suggestionsGrouped]);

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1 >= flatSuggestions.length ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 < 0 ? flatSuggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatSuggestions.length) {
        handleSelectSuggestion(flatSuggestions[activeIndex]);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectSuggestion = (item: SuggestionItem) => {
    saveRecentSearch(item.type === 'query' || item.type === 'recent' || item.type === 'popular' || item.type === 'trending' ? item.title : item.title);
    setQueryValue(item.title);
    setIsOpen(false);
    if (isNavbarFluid && mobileExpanded) {
      setMobileExpandedState(false);
    }
    navigate(item.route);
    if (onSubmit) {
      onSubmit(item.title);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = queryValue.trim();
    if (!trimmed) return;
    
    saveRecentSearch(trimmed);
    setIsOpen(false);
    
    if (onSubmit) {
      onSubmit(trimmed);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const openMobileSearch = () => {
    setMobileExpandedState(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (enableSuggestions) setIsOpen(true);
    });
  };

  const closeMobileSearch = () => {
    setMobileExpandedState(false);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const renderNavbarHeroForm = (mode: 'inline' | 'overlay') => (
    <form
      onSubmit={(e) => {
        handleSearchSubmit(e);
        if (mode === 'overlay') closeMobileSearch();
      }}
      className={cn(
        'relative w-full bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg focus-within:border-white/20 transition-all duration-300',
        mode === 'overlay' && 'choosify-mobile-search-pill',
      )}
    >
      <div className="flex items-center bg-white rounded-full relative min-w-0">
        {mode === 'overlay' && (
          <button
            type="button"
            aria-label="Close search"
            onClick={closeMobileSearch}
            className="shrink-0 pl-2.5 pr-1 text-gray-400 hover:text-[#E8500A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="pl-2.5 sm:pl-4 text-[#E8500A] shrink-0">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={queryValue}
          onChange={(e) => {
            setQueryValue(e.target.value);
            if (enableSuggestions) {
              setIsOpen(true);
              setActiveIndex(-1);
            }
          }}
          onFocus={() => {
            if (!enableSuggestions) return;
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full min-w-0 bg-transparent outline-none text-navy font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none',
            mode === 'overlay'
              ? 'h-10 pl-2 pr-24 text-xs'
              : 'h-9 sm:h-9 md:h-10 pl-2 sm:pl-3 pr-11 sm:pr-14 md:pr-20 lg:pr-24 text-[11px] sm:text-xs',
          )}
        />
        <button
          type="submit"
          aria-label={submitLabel}
          className={cn(
            'absolute right-1 sm:right-1.5 top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white font-black tracking-widest uppercase flex items-center justify-center gap-1 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer',
            mode === 'overlay'
              ? 'px-4 text-[9px]'
              : 'px-2 sm:px-2.5 md:px-4 lg:px-5 text-[8px] sm:text-[8px] md:text-[9px] min-w-[2rem] sm:min-w-[2.25rem] md:min-w-0',
          )}
        >
          {mode === 'overlay' ? (
            submitLabel
          ) : (
            <>
              <Search className="w-3.5 h-3.5 md:hidden shrink-0" />
              <span className="hidden md:inline">{submitLabel}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div ref={containerRef} className={cn('relative w-full min-w-0', className)}>
      {isNavbarFluid && (
        <button
          type="button"
          aria-label="Open search"
          onClick={openMobileSearch}
          className="sm:hidden flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Search size={20} />
        </button>
      )}

      {isNavbarFluid && mobileExpanded && createPortal(
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-[2px] sm:hidden"
            onClick={closeMobileSearch}
            aria-hidden
          />
          <div
            ref={mobileOverlayRef}
            className="fixed left-0 right-0 z-[95] px-3 py-3 choosify-dark-gradient border-b border-white/10 sm:hidden"
            style={{ top: 'var(--choosify-navbar-height, 3.5rem)' }}
          >
            {renderNavbarHeroForm('overlay')}
          </div>
        </>,
        document.body,
      )}

      {/* Home Hero or Navbar style glassmorphic search input box */}
      {variant === 'navbar' ? (
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative w-full bg-white/5 hover:bg-white/10 focus-within:bg-white/10 backdrop-blur-md px-2 py-1 lg:px-2.5 lg:py-1.5 xl:px-3 xl:py-1.5 rounded-full border border-white/10 focus-within:border-white/20 transition-all duration-300 flex items-center min-w-0"
        >
          <div className="text-gray-400 shrink-0">
            <Search className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
          </div>
          <input 
            ref={inputRef}
            type="text" 
            value={queryValue}
            onChange={(e) => {
              setQueryValue(e.target.value);
              if (enableSuggestions) {
                setIsOpen(true);
                setActiveIndex(-1);
              }
            }}
            onFocus={() => {
              if (!enableSuggestions) return;
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder} 
            className="w-full min-w-0 bg-transparent outline-none pl-1.5 lg:pl-2 pr-1 text-white text-[8.5px] lg:text-[9px] xl:text-[10px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-0 border-none" 
          />
          {queryValue && (
            <button
              type="button"
              onClick={() => {
                setQueryValue('');
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-white shrink-0 p-0.5 cursor-pointer bg-transparent border-none"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>
      ) : isNavbarFluid ? (
        <div className="hidden sm:block w-full min-w-0">{renderNavbarHeroForm('inline')}</div>
      ) : (
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg focus-within:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center bg-white rounded-full relative min-w-0">
            <div className="pl-4 text-[#E8500A] shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={queryValue}
              onChange={(e) => {
                setQueryValue(e.target.value);
                if (enableSuggestions) {
                  setIsOpen(true);
                  setActiveIndex(-1);
                }
              }}
              onFocus={() => {
                if (!enableSuggestions) return;
                setIsOpen(true);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full h-10 bg-transparent outline-none pl-3 pr-24 text-navy text-xs font-semibold placeholder-gray-500 focus:outline-none focus:ring-0 border-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      )}

      {/* Intelligent Live Suggestions Dropdown */}
      {enableSuggestions && isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="choosify-omni-search-dropdown bg-white border border-gray-200 rounded-lg shadow-[0_18px_40px_rgba(0,4,53,0.14)] font-sans text-left text-[#1A1A2E] overflow-y-auto overflow-x-hidden no-scrollbar"
        >
          {/* A. BEFORE TYPING STATE */}
          {!queryValue.trim() ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              {/* Recent Searches */}
              <div className="flex flex-col text-left space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" />
                  Recent Searches
                </span>
                {suggestionsGrouped.recent.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">No recent searches</p>
                ) : (
                  <div className="flex flex-col space-y-1">
                    {suggestionsGrouped.recent.map((item, idx) => {
                      const flatIdx = idx;
                      const isActive = activeIndex === flatIdx;
                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleSelectSuggestion(item)}
                          onMouseEnter={() => setActiveIndex(flatIdx)}
                          className={`group flex items-center justify-between px-2.5 py-1.5 rounded-[5px] text-[11px] font-bold cursor-pointer transition-colors ${
                            isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          <button
                            onClick={(e) => handleClearRecent(e, idx)}
                            className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            title="Remove"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Popular Searches */}
              <div className="flex flex-col text-left space-y-2 pt-4 md:pt-0 md:pl-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={12} className="text-[#FF5B00]" />
                  Popular
                </span>
                <div className="flex flex-col space-y-1">
                  {suggestionsGrouped.popular.map((item, idx) => {
                    const flatIdx = suggestionsGrouped.recent.length + idx;
                    const isActive = activeIndex === flatIdx;
                    return (
                      <div 
                        key={item.id}
                        onClick={() => handleSelectSuggestion(item)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        className={`px-2.5 py-1.5 rounded-[5px] text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                          isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[#FF5B00]">•</span>
                        <span className="truncate">{item.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trending Searches */}
              <div className="flex flex-col text-left space-y-2 pt-4 md:pt-0 md:pl-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <ArrowRight size={12} className="text-orange-primary animate-pulse" />
                  Trending
                </span>
                <div className="flex flex-col space-y-1">
                  {suggestionsGrouped.trending.map((item, idx) => {
                    const flatIdx = suggestionsGrouped.recent.length + suggestionsGrouped.popular.length + idx;
                    const isActive = activeIndex === flatIdx;
                    return (
                      <div 
                        key={item.id}
                        onClick={() => handleSelectSuggestion(item)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        className={`px-2.5 py-1.5 rounded-[5px] text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                          isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[#E8500A] font-black">↑</span>
                        <span className="truncate">{item.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* B. ACTIVE TYPING STATE Suggestions */
            <div className="divide-y divide-gray-100">
              
              {flatSuggestions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-sans text-xs">
                  <p className="font-bold uppercase tracking-wider text-gray-400 mb-1">No matches</p>
                  "No matching suggestions found."
                </div>
              ) : (
                <>
                  {/* GROUP: Search Suggestions (Autocompletes) */}
                  {suggestionsGrouped.queries.length > 0 && (
                    <div className="p-2">
                      <span className="px-2.5 py-1 text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                        Search Suggestions
                      </span>
                      {suggestionsGrouped.queries.map((item, idx) => {
                        const flatIdx = idx;
                        const isActive = activeIndex === flatIdx;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-[5px] text-[11px] font-bold cursor-pointer transition-colors ${
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                            }`}
                          >
                            <Search size={12} className="opacity-40" />
                            <span className="truncate italic">"{item.title}"</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* GROUP: Products */}
                  {suggestionsGrouped.products.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <span className="px-2.5 py-1 text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                        Products
                      </span>
                      {suggestionsGrouped.products.map((item, idx) => {
                        const flatIdx = suggestionsGrouped.queries.length + idx;
                        const isActive = activeIndex === flatIdx;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-[5px] cursor-pointer transition-colors ${
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                            }`}
                          >
                            {item.image ? (
                              <img src={item.image} className="w-8 h-8 rounded-[5px] object-cover shrink-0 border border-gray-100" alt={item.title} />
                            ) : (
                              <div className="w-8 h-8 rounded-[5px] bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                                <Search size={12} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="text-[11.5px] font-bold truncate leading-snug text-inherit">{item.title}</h4>
                              <p className="text-[9.5px] text-gray-500 font-semibold truncate mt-0.5">{item.subtitle}</p>
                            </div>
                            {item.badge && (
                              <span className="text-[8px] font-black uppercase tracking-wider bg-orange-primary text-white px-1.5 py-0.5 rounded-full shrink-0 scale-90">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* GROUP: Brands */}
                  {suggestionsGrouped.brands.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <span className="px-2.5 py-1 text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                        Brands
                      </span>
                      {suggestionsGrouped.brands.map((item, idx) => {
                        const flatIdx = suggestionsGrouped.queries.length + suggestionsGrouped.products.length + idx;
                        const isActive = activeIndex === flatIdx;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            className={`flex items-center justify-between px-3 py-2 rounded-[5px] cursor-pointer transition-colors ${
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 text-left">
                              <div className="w-8 h-8 rounded-full bg-[#120713] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm uppercase italic">
                                {item.title.substring(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[11.5px] font-bold truncate leading-snug flex items-center gap-1">
                                  {item.title}
                                  {item.badge === 'Verified' && (
                                    <span className="text-[#E8500A] text-[9px]" title="Verified Brand">🛡️</span>
                                  )}
                                </h4>
                                <p className="text-[9.5px] text-gray-500 font-semibold truncate mt-0.5">{item.subtitle}</p>
                              </div>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest border border-gray-200 text-gray-400 px-2 py-0.5 rounded-full scale-90">
                              Brand
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* GROUP: Creators */}
                  {suggestionsGrouped.creators.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <span className="px-2.5 py-1 text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                        Creators
                      </span>
                      {suggestionsGrouped.creators.map((item, idx) => {
                        const flatIdx = suggestionsGrouped.queries.length + suggestionsGrouped.products.length + suggestionsGrouped.brands.length + idx;
                        const isActive = activeIndex === flatIdx;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            className={`flex items-center justify-between px-3 py-2 rounded-[5px] cursor-pointer transition-colors ${
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 text-left">
                              {item.image ? (
                                <img src={item.image} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" alt={item.title} />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                                  <User size={12} />
                                </div>
                              )}
                              <div className="min-w-0">
                                <h4 className="text-[11.5px] font-bold truncate leading-snug">{item.title}</h4>
                                <p className="text-[9.5px] text-gray-500 font-semibold truncate mt-0.5">{item.subtitle}</p>
                              </div>
                            </div>
                            <span className="text-[8.5px] font-black uppercase tracking-widest text-orange-primary bg-orange-primary/5 border border-orange-primary/10 px-2 py-0.5 rounded-full scale-90">
                              Creator
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* GROUP: Categories */}
                  {suggestionsGrouped.categories.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <span className="px-2.5 py-1 text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                        Categories
                      </span>
                      {suggestionsGrouped.categories.map((item, idx) => {
                        const flatIdx = suggestionsGrouped.queries.length + suggestionsGrouped.products.length + suggestionsGrouped.brands.length + suggestionsGrouped.creators.length + idx;
                        const isActive = activeIndex === flatIdx;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            className={`flex items-center justify-between px-3 py-2 rounded-[5px] cursor-pointer transition-colors ${
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-[#1A1A2E] hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 text-left min-w-0">
                              <Folder size={12} className="text-gray-400 shrink-0" />
                              <span className="text-[11.5px] font-bold truncate">{item.title}</span>
                            </div>
                            <span className="text-[8.5px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full scale-90">
                              {item.badge}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
