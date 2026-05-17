import React, { useState } from 'react';
import { Search, ChevronDown, Star, Filter, Bookmark, Grid, List as ListIcon, X } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';

export function AllProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { name: "Headphone", count: 230, checked: true },
    { name: "Mobile", count: 150, checked: true },
    { name: "Bag", count: 89, checked: true },
    { name: "Eye-Wear", count: 112, checked: true },
    { name: "Perfume", count: 78 },
    { name: "Toys", count: 45 },
    { name: "Fashion", count: 156 },
    { name: "Laptop", count: 92 },
    { name: "Personal Care", count: 67 },
    { name: "Microware", count: 43 }
  ];

  const productTypes = [
    "Man", "Shoes", "Pant", "Food & Grains", "Shoes", "Fragrance", "Men's Wear", "Gadget", "Shirt", "Restaurants", "Accessories", "Glasses"
  ];

  const brands = [
    { name: "Apex", count: 230, checked: true },
    { name: "Gadget & Gear", count: 150 },
    { name: "Nike", count: 102 },
    { name: "Adidas", count: 89, checked: true },
    { name: "Bata", count: 112 },
    { name: "Dhaka Boot Barn", count: 78 },
    { name: "Fabrilife", count: 45 },
    { name: "ARTISTI SHOES", count: 156 },
    { name: "Blue & Pinks", count: 92 },
    { name: "Pickaboo", count: 189 }
  ];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header / Hero */}
      <div className="w-full bg-[#0A0B1E] pt-12 pb-16 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <span className="text-white/40">All Category</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <span className="text-white/40">Products</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <span className="text-white">All Products</span>
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-3">All Products</h1>
            <p className="text-gray-400 text-sm font-medium mb-6">Discover & Compare The Best Products in Bangladesh.</p>
            
            <div className="max-w-xl relative group">
               <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <div className="flex gap-1 opacity-80">
                     <div className="w-5 h-5 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                       <div className="w-2 h-2 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                     </div>
                     <div className="w-5 h-5 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                       <div className="w-2 h-2 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                     </div>
                  </div>
               </div>
               <input 
                type="text" 
                placeholder="Search Products by Name, Category or Brand..." 
                className="w-full h-16 pl-24 pr-8 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-orange-primary/40 transition-all font-bold placeholder:text-white/20 shadow-3xl text-[13px] italic tracking-wide" 
               />
            </div>
          </div>
          <div className="text-orange-primary font-black text-2xl italic tracking-tighter">
            20 Products Found
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-8 w-full flex flex-col lg:flex-row gap-8 py-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-60 flex-shrink-0">
          <div className="space-y-8">
            {/* Search Filter */}
            <div className="flex gap-2">
               <div className="relative flex-1">
                  <input type="text" placeholder="Search With Product Name" className="w-full h-12 px-4 bg-white rounded-xl text-xs font-bold border border-gray-100 focus:outline-none focus:border-orange-primary shadow-sm" />
               </div>
               <button className="h-12 px-6 bg-orange-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-primary/20">Search</button>
            </div>

            {/* Filter Group: Category */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-navy uppercase tracking-widest">Filter By Product</h3>
                  <span className="text-[10px] font-black text-orange-primary uppercase cursor-pointer">Clear All</span>
               </div>
               <div className="space-y-3 mb-6">
                 {categories.map((cat, i) => (
                   <label key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", cat.checked ? "bg-orange-primary border-orange-primary" : "border-gray-200 bg-white")}>
                           {cat.checked && <X size={10} className="text-white font-black" />}
                        </div>
                        <span className={cn("text-xs font-bold transition-colors", cat.checked ? "text-navy" : "text-gray-400 group-hover:text-navy")}>{cat.name}</span>
                     </div>
                     <span className="text-[10px] font-black text-gray-200">{cat.count}</span>
                   </label>
                 ))}
               </div>
               <div className="pt-4 border-t border-gray-100">
                  <button className="text-[10px] font-black text-orange-primary uppercase tracking-widest flex items-center gap-2">View All 150 Categories <ChevronDown size={14}/></button>
               </div>
            </div>

            {/* Filter Group: Brand */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-navy uppercase tracking-widest">Filter By Brand</h3>
                  <span className="text-[10px] font-black text-orange-primary uppercase cursor-pointer">Clear All</span>
               </div>
               <div className="space-y-3 mb-6">
                 {brands.map((brand, i) => (
                   <label key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", brand.checked ? "bg-orange-primary border-orange-primary" : "border-gray-200 bg-white")}>
                           {brand.checked && <X size={10} className="text-white font-black" />}
                        </div>
                        <span className={cn("text-xs font-bold transition-colors", brand.checked ? "text-navy" : "text-gray-400 group-hover:text-navy")}>{brand.name}</span>
                     </div>
                     <span className="text-[10px] font-black text-gray-200">{brand.count}</span>
                   </label>
                 ))}
               </div>
               <div className="pt-4 border-t border-gray-50">
                  <button className="text-[10px] font-black text-orange-primary uppercase tracking-widest flex items-center gap-2">View All 150 Brands <ChevronDown size={14}/></button>
               </div>
            </div>

            {/* Filter Group: Price */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-navy uppercase tracking-widest">Filter By Price Range</h3>
                  <span className="text-[10px] font-black text-orange-primary uppercase cursor-pointer">Clear All</span>
               </div>
               <div className="flex flex-wrap gap-2 mb-8">
                 {["Under ৳500", "৳1k - ৳2k", "৳2k - ৳5k", "৳5k - ৳10k", "৳10k - ৳25k", "৳25k - ৳50k", "৳50k - ৳100k"].map((range, i) => (
                   <button key={i} className={cn("px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", i === 0 ? "bg-[#B16B4A] text-white shadow-md shadow-[#B16B4A]/20" : "bg-[#F8FAFC] text-gray-400 hover:bg-gray-100")}>
                      {range}
                   </button>
                 ))}
               </div>
               <div className="px-2 mb-8">
                  <div className="relative h-1 bg-gray-100 rounded-full">
                     <div className="absolute left-[10%] right-[30%] top-0 bottom-0 bg-[#B16B4A] rounded-full" />
                     <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#B16B4A] rounded-full shadow-lg cursor-pointer" />
                     <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#B16B4A] rounded-full shadow-lg cursor-pointer" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[9px] font-black text-orange-primary uppercase tracking-widest opacity-60">From ৳</span>
                     <input type="text" value="14,048" className="w-full h-10 px-3 bg-[#F8FAFC] rounded-lg text-xs font-bold text-navy focus:outline-none border border-transparent focus:border-[#B16B4A] shadow-inner" readOnly />
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[9px] font-black text-orange-primary uppercase tracking-widest opacity-60">To ৳</span>
                     <input type="text" value="20,000" className="w-full h-10 px-3 bg-[#F8FAFC] rounded-lg text-xs font-bold text-navy focus:outline-none border border-transparent focus:border-[#B16B4A] shadow-inner" readOnly />
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
               <button className="w-full py-4 bg-orange-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-primary/30 hover:scale-[1.02] active:scale-95 transition-all">Apply Filters</button>
               <button className="w-full py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-orange-primary/20 transition-all bg-[#F8FAFC]">Reset</button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Top Bar / Sorting */}
          <div className="flex flex-col gap-6 mb-12">
             <div className="flex flex-wrap items-center gap-4">
                {[
                  { label: "Men's Wear", active: true },
                  { label: "Sale", active: true },
                  { label: "Under 10k", active: true },
                  { label: "4.5+", active: true }
                ].map((chip, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-navy uppercase tracking-widest shadow-sm">
                    {chip.label} <X size={14} className="text-[#B16B4A] cursor-pointer" />
                  </div>
                ))}
                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-blue-500/0 hover:border-blue-500 transition-all">Clear All</button>
                
                <div className="ml-auto flex items-center gap-4">
                   <div className="flex items-center gap-2 text-navy text-[10px] font-black uppercase tracking-widest">
                      Sort:
                      <div className="relative group">
                         <button className="flex items-center gap-2 px-6 py-2 bg-[#B16B4A] text-white rounded-xl shadow-lg shadow-[#B16B4A]/20">
                            Most Popular <ChevronDown size={14} />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
            {([...PRODUCTS, ...PRODUCTS, ...PRODUCTS.slice(0, 2)]).map((product, i) => (
              <ProductCard key={i} product={product} variant="grid" />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4 bg-white px-8 py-3 rounded-full border border-gray-100 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-navy transition-colors whitespace-nowrap">
                   <ChevronDown size={14} className="rotate-90" /> Previous
                </button>
                <div className="flex items-center gap-4">
                   {[1, 2, 3, 4, 5, "...", 32].map((page, i) => (
                      <button key={i} className={cn("w-8 h-8 rounded-full text-xs font-black transition-all flex-shrink-0 flex items-center justify-center", page === 3 ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/20" : "text-gray-400 hover:text-navy hover:bg-gray-50")}>
                         {page}
                      </button>
                   ))}
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest hover:text-orange-primary transition-colors whitespace-nowrap">
                   Next <ChevronDown size={14} className="-rotate-90" />
                </button>
             </div>
             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Showing <span className="text-navy">450</span> Of <span className="text-navy">450</span> Results
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
