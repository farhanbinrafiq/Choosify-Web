import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Folder, User, Check, Clock, ArrowRight, Sparkles, X } from 'lucide-react';
import { PRODUCTS, BRANDS, CATEGORIES } from '../constants';
import { CREATORS } from '../data/creators';
import { useDashboard } from '../context/DashboardContext';
import { getBrandOverviews, getProductOverviews } from '../utils/overviewRegistry';
import { toast } from 'react-hot-toast';

interface GlobalSearchBarProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  onSubmit?: (query: string) => void;
  variant?: 'hero' | 'navbar' | 'standard';
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

export function GlobalSearchBar({
  initialValue = '',
  placeholder = "Search authentic Fashion hubs, Smart Gadgets & verified outlets...",
  className = '',
  onSubmit,
  variant = 'standard'
}: GlobalSearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(initialValue || searchParams.get('q') || '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { customOverviews } = useDashboard();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with searchParams or initial value
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    if (initialValue) {
      setQuery(initialValue);
    } else if (qParam) {
      setQuery(qParam);
    }
  }, [searchParams, initialValue]);

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

  // Close suggestions dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Static Preset Lists
  const popularSearches = ['iPhone 15', 'Apex', 'Yellow', 'Sony WH-1000XM5'];
  const trendingSearches = ['Samsung S24 Ultra', 'Gift wrapping', 'Sailor', 'PC Build'];
  const commonKeywords = [
    'iphone', 'iphone 15', 'iphone charger', 'iphone cover', 'samsung galaxy', 'samsung s24',
    'gift wrapping', 'airport pickup', 't-shirt', 'casual wear', 'sound system', 'laptop',
    'gaming console', 'leather shoes', 'beauty care', 'eid panjabi', 'headphones', 'earbuds',
    'aarong salwar kameez', 'apex shoes', 'sailor clothing'
  ];

  // Dynamically compute suggestions list
  const suggestionsGrouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    
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
    const matchedProducts: SuggestionItem[] = PRODUCTS.filter(p => {
      const pOverviews = getProductOverviews(p.id, p.title, p.category, customOverviews || []);
      const matchedOverview = Object.values(pOverviews).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(q)
      );

      return p.title.toLowerCase().includes(q) ||
             p.brand.toLowerCase().includes(q) ||
             p.category.toLowerCase().includes(q) ||
             (p.description || '').toLowerCase().includes(q) ||
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
    const matchedBrands: SuggestionItem[] = BRANDS.filter(b => {
      const bOverviews = getBrandOverviews(b.name, customOverviews || []);
      const matchedOverview = Object.values(bOverviews).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(q)
      );

      return b.name.toLowerCase().includes(q) ||
             b.category.toLowerCase().includes(q) ||
             matchedOverview;
    })
    .slice(0, 3)
    .map(b => ({
      id: `brand-${b.id}`,
      type: 'brand',
      title: b.name,
      subtitle: `${b.category} • ${b.products} Products`,
      route: `/brands/${b.id}`,
      badge: b.rating >= 4.8 ? 'Verified' : undefined
    }));

    // 2.4 Creators Matching (Check name, handle, bio, bestFor)
    const matchedCreators: SuggestionItem[] = CREATORS.filter(c => {
      return c.name.toLowerCase().includes(q) ||
             c.handle.toLowerCase().includes(q) ||
             c.bio.toLowerCase().includes(q) ||
             c.bestFor.toLowerCase().includes(q);
    })
    .slice(0, 3)
    .map(c => ({
      id: `creator-${c.id}`,
      type: 'creator',
      title: c.name,
      subtitle: `${c.handle} • ${c.bestFor} Expert`,
      image: c.avatar,
      route: `/creators/${c.id}`
    }));

    // 2.5 Categories Matching (Check name)
    const matchedCategories: SuggestionItem[] = CATEGORIES.filter(c => {
      return c.name.toLowerCase().includes(q);
    })
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
  }, [query, recentSearches, customOverviews]);

  // Create flat suggestion list for arrow-key keyboard navigation
  const flatSuggestions = useMemo(() => {
    const list: SuggestionItem[] = [];
    
    if (!query.trim()) {
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
  }, [query, suggestionsGrouped]);

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
    setQuery(item.title);
    setIsOpen(false);
    navigate(item.route);
    if (onSubmit) {
      onSubmit(item.title);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    
    saveRecentSearch(trimmed);
    setIsOpen(false);
    
    if (onSubmit) {
      onSubmit(trimmed);
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Home Hero or Navbar style glassmorphic search input box */}
      {variant === 'navbar' ? (
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative w-full bg-white/5 hover:bg-white/10 focus-within:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 focus-within:border-white/20 transition-all duration-300 flex items-center"
        >
          <div className="text-gray-400 shrink-0">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder} 
            className="w-full bg-transparent outline-none pl-2.5 pr-2 text-white text-[10px] font-semibold placeholder-gray-400 focus:outline-none focus:ring-0 border-none" 
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-white shrink-0 p-0.5 cursor-pointer bg-transparent border-none"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>
      ) : (
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative w-full bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg focus-within:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center bg-white rounded-full">
            <div className="pl-4 text-[#E8500A] shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <input 
              ref={inputRef}
              type="text" 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => {
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
              DISCOVER
            </button>
          </div>
        </form>
      )}

      {/* Intelligent Live Suggestions Dropdown */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-150 rounded-[5px] shadow-sm z-50 overflow-hidden font-sans text-left max-h-[385px] overflow-y-auto no-scrollbar"
        >
          {/* A. BEFORE TYPING STATE */}
          {!query.trim() ? (
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
                            isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
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
                          isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
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
                          isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
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
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
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
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
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
                              <h4 className="text-[11.5px] font-bold truncate leading-snug">{item.title}</h4>
                              <p className="text-[9.5px] text-gray-400 font-semibold truncate mt-0.5">{item.subtitle}</p>
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
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
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
                                <p className="text-[9.5px] text-gray-400 font-semibold truncate mt-0.5">{item.subtitle}</p>
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
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 text-left">
                              {item.image ? (
                                <img src={item.image} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-100" alt={item.title} />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-150 flex items-center justify-center shrink-0 text-gray-500">
                                  <User size={12} />
                                </div>
                              )}
                              <div className="min-w-0">
                                <h4 className="text-[11.5px] font-bold truncate leading-snug">{item.title}</h4>
                                <p className="text-[9.5px] text-gray-400 font-semibold truncate mt-0.5">{item.subtitle}</p>
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
                              isActive ? 'bg-[#E8500A]/5 text-[#E8500A]' : 'text-navy hover:bg-gray-50'
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
        </div>
      )}
    </div>
  );
}
