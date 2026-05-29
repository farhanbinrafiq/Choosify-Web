import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, ArrowLeft, RefreshCw, Layers, Award,
  HelpCircle, ChevronRight, ShoppingCart, Info, TrendingUp
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
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
            {filteredProducts.map((p) => {
              const basePrice = p.pricingTiers?.[0]?.price || p.price;
              const maxSavingsPrice = p.pricingTiers?.[p.pricingTiers.length - 1]?.price || basePrice;

              return (
                <div 
                  key={p.id}
                  onClick={() => navigate(`/b2b/product/${p.id}`)}
                  className="bg-[#F7F8FA] border border-slate-200 hover:border-[#FF0038]/40 rounded-[28px] p-5 transition-all duration-300 relative cursor-pointer group flex flex-col justify-between shadow-sm"
                >
                  <div>
                    {/* Catalog Image */}
                    <div className="w-full aspect-square rounded-2xl bg-white overflow-hidden border border-slate-200/60 relative">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#081120] rounded-lg text-[9px] font-black text-white uppercase tracking-widest italic font-mono">
                        MOQ: {p.moq || 10} Units
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{p.category}</p>
                      <h3 className="font-black text-[#081120] italic text-base mt-1 group-hover:text-[#FF0038] transition-colors truncate">{p.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">{p.description}</p>
                    </div>

                    {/* Slabs Grid Display */}
                    {p.pricingTiers && (
                      <div className="grid grid-cols-3 gap-2 mt-4 bg-white border border-slate-200 p-2 rounded-xl text-center shadow-sm">
                        {p.pricingTiers.slice(0, 3).map((tier, idx) => (
                          <div key={idx} className="border-r border-slate-100 last:border-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider font-mono">
                              Qty {tier.minQuantity}+
                            </p>
                            <p className="text-[10px] font-black text-emerald-600 font-mono italic mt-0.5">
                              ৳{tier.price.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sourcing Price Range CTA */}
                  <div className="mt-6 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block">Slab Rate Limit</span>
                      <span className="text-sm font-black text-[#081120] font-mono italic">
                        ৳{maxSavingsPrice.toLocaleString()} - ৳{basePrice.toLocaleString()}
                      </span>
                    </div>
                    <button className="px-3.5 py-2 bg-[#081120] hover:bg-[#FF0038] hover:text-white border-none text-[9px] font-black text-white uppercase tracking-widest italic transition-all rounded-xl">
                      Inquire Lot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
