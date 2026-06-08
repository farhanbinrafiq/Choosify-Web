import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, ArrowLeft, RefreshCw, Layers, Award,
  HelpCircle, ChevronRight, ShoppingCart, Info, TrendingUp
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { ProductCard } from '../../components/ProductCard';
import toast from 'react-hot-toast';

export function B2BProductsPage() {
  const navigate = useNavigate();
  const { allProducts } = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [moqFilter, setMoqFilter] = useState<number>(300);

  // Filter products by mode Type "wholesale" already precomputed inside GlobalStateContext!
  // But we filter them on searching query
  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesMoq = p.moq ? p.moq <= moqFilter : true;
    return matchesSearch && matchesCategory && matchesMoq;
  });

  // Extract available wholesale categories
  const categoriesPool = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-16 selection:bg-[#FF0038] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <div className="bg-gradient-to-br from-[#081120] to-[#FF0038] border-none py-14 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#FF0038] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all mb-4 italic"
          >
            <ArrowLeft size={12} /> B2B Portal Hub
          </button>
          
          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            Volume-Tier Catalog
          </h1>
          <p className="text-xs text-slate-200 mt-2 max-w-xl font-medium tracking-wide">
            Filter wholesale electronics, combed RMG lots, and premium leather commodities. Review pricing slabs and custom packaging capabilities.
          </p>
        </div>
      </div>

      {/* 2. DYNAMIC FILTERS AND CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="bg-[#F7F8FA] border border-slate-200 p-4 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Keyword search selector */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={14} />
            </span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wholesale lots..."
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF0038]"
            />
          </div>

          {/* Category Selector */}
          <div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF0038] cursor-pointer"
            >
              <option value="">All Bulk Categories</option>
              {categoriesPool.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* MOQ Slider */}
          <div className="flex items-center gap-3 bg-white border border-slate-300 h-11 px-4 rounded-xl">
            <SlidersHorizontal size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#081120]">MOQ:</span>
            <input 
              type="range" 
              min={10} 
              max={300} 
              value={moqFilter} 
              onChange={(e) => setMoqFilter(Number(e.target.value))}
              className="w-20 md:w-full accent-[#FF0038]"
            />
            <span className="text-[11px] font-black text-[#FF0038] font-mono italic">{moqFilter}</span>
          </div>

          {/* Matches Info */}
          <div className="flex items-center justify-between text-xs font-bold md:pl-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0">
            <span className="text-slate-500 uppercase tracking-widest text-[9px]">{filteredProducts.length} Lots Sourced</span>
            {(searchQuery || selectedCategory || moqFilter < 300) && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setMoqFilter(300);
                  toast.success('Filters cleared successfully');
                }}
                className="text-[10px] font-black text-[#FF0038] uppercase tracking-widest italic flex items-center gap-1 hover:underline"
              >
                <RefreshCw size={10} /> Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. PRODUCTS GRID LISTING */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {filteredProducts.length === 0 ? (
          <div className="bg-[#F7F8FA] border border-slate-200 rounded-[32px] p-16 text-center text-slate-800">
            <HelpCircle size={40} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-black italic">No Wholesale Inventory Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">Try increasing the Minimum Order Quantity (MOQ) filter to accommodate large apparel lots.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} variant="grid" />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
