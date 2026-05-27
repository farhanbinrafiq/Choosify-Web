import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ChevronDown, Star, Bookmark, X, Gift, Package, DollarSign, Shirt, Smartphone, Droplets, Tv, Compass, BookOpen, Heart, Smile, Car } from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';

export function BrandProductPage() {
  const { id } = useParams();
  const brandId = parseInt(id || '1');
  const brand = BRANDS.find(b => b.id === brandId) || BRANDS[2]; // Fallback to Sailor

  const [activeFilter, setActiveFilter] = useState('Full Experience');

  const brandProducts = PRODUCTS.filter(p => p.brand === brand.name);
  // If no products match the brand name (since constants is limited), fallback to first few products for demo
  const displayProducts = brandProducts.length > 0 ? brandProducts : PRODUCTS.slice(0, 6);
  
  const dealProducts = displayProducts.filter(p => p.tag === 'SALE' || p.tag === 'HOT' || p.tag === 'NEW').slice(0, 3);
  // If no deals found, just take first 3
  const finalDeals = dealProducts.length > 0 ? dealProducts : displayProducts.slice(0, 3);

  const categories = [
    { name: "Mobile", count: 230, checked: true },
    { name: "FIMS", count: 150 },
    { name: "Headphone", count: 89 },
    { name: "Chargers & Batteries", count: 112, checked: true },
    { name: "Mobile Case", count: 78 },
    { name: "Power", count: 45 },
    { name: "Speaker", count: 156 },
    { name: "Powerplug", count: 92 },
    { name: "Laptop", count: 67 },
    { name: "TVs & Monitors", count: 43 }
  ];

  const productTypes = [
    "Drives", "Flash", "Ram", "Batteries", "SSD", "Keyboard", "Monitors", "Mouse", "Cases", "Fans", "Ram", "Software", "CPU"
  ];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header / Hero */}
      <div className="w-full bg-[#0A0B1E] pt-20 pb-24 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <Link to="/categories" className="hover:text-white transition-colors">All Category</Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full mx-1"></div>
              <span className="text-white">Brand Products</span>
            </div>
            <div className="flex items-center gap-6">
               <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center p-4 border border-white/10">
                  {/* Replace with actual logo logic if available */}
                  <span className="text-white text-3xl font-black italic">{brand.name.substring(0, 2).toUpperCase()}</span>
               </div>
               <div>
                  <p className="text-[10px] font-black text-orange-primary uppercase tracking-[0.4em] mb-1">Showing</p>
                  <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-1">{brand.name}</h1>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">All Shop Products</p>
               </div>
            </div>
          </div>
          <div className="text-orange-primary font-black text-3xl italic tracking-tighter mt-8 md:mt-0">
            20 Products Found
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 w-full flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 py-16 relative">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0">
          <div className="space-y-8 sticky top-32">
            {/* Active Filters (Moved from main) */}
            <div className="bg-[#0A0B1E] rounded-[20px] p-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/10 blur-3xl rounded-full" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
                  Selection
                  <span className="text-orange-primary cursor-pointer hover:underline">Clear</span>
               </h3>
               <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Men's Wear" },
                    { label: "Sale" },
                    { label: "Under 10k" }
                  ].map((chip, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer">
                      {chip.label} <X size={12} className="text-orange-primary" />
                    </div>
                  ))}
               </div>
            </div>

            {/* View Selection Filter */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
               <h3 className="text-[10px] font-black text-navy uppercase tracking-widest mb-6">Show Component</h3>
               <div className="space-y-2">
                  {[
                    { label: "Full Experience", icon: <Star size={12} /> },
                    { label: "Exclusive Deals Only", icon: <Gift size={12} /> },
                    { label: "Product Catalogs Only", icon: <Package size={12} /> }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveFilter(item.label)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        activeFilter === item.label ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                         {item.icon}
                         {item.label}
                      </div>
                      <div className={cn("w-1.5 h-1.5 rounded-full", activeFilter === item.label ? "bg-white" : "bg-transparent")} />
                    </button>
                  ))}
               </div>
            </div>

            {/* Search Filter */}
            <div className="flex flex-col gap-3">
               <span className="text-[10px] font-black text-navy uppercase tracking-widest">Filter By Product Name</span>
               <div className="flex gap-2">
                  <div className="relative flex-1">
                     <input type="text" placeholder="Search With Product Name" className="w-full h-12 px-4 bg-[#F8FAFC] rounded-xl text-xs font-bold border border-gray-100 focus:outline-none focus:border-orange-primary shadow-sm" />
                  </div>
                  <button className="h-12 px-6 bg-orange-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-primary/20">Search</button>
               </div>
            </div>

            {/* Filter Group: Category */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-2 h-full bg-orange-primary/5" />
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-navy uppercase tracking-widest">Filter By Category</h3>
                  <span className="text-[10px] font-black text-orange-primary uppercase cursor-pointer hover:underline underline-offset-4">Reset</span>
               </div>
               <div className="space-y-3">
                 {categories.map((cat, i) => (
                   <label key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", cat.checked ? "bg-orange-primary border-orange-primary" : "border-gray-200 bg-white")}>
                           {cat.checked && <X size={10} className="text-white font-black" />}
                        </div>
                        <span className={cn("text-[11px] font-bold transition-colors", cat.checked ? "text-navy" : "text-gray-400 group-hover:text-navy")}>{cat.name}</span>
                     </div>
                   </label>
                 ))}
               </div>
            </div>

            {/* Filter Group: Product Type */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-navy uppercase tracking-widest">Popular Product Type</h3>
                  <span className="text-[10px] font-black text-orange-primary uppercase cursor-pointer hover:underline underline-offset-4">Reset</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {productTypes.map((type, i) => (
                   <button key={i} className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", i === 0 || i === 12 ? "bg-orange-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100")}>
                      {type}
                   </button>
                 ))}
               </div>
            </div>

            {/* Filter Group: Price */}
            <div className="bg-white rounded-[10px] p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black text-navy uppercase tracking-widest">Filter By Price Range</h3>
                  <span className="text-[10px] font-black text-orange-primary uppercase cursor-pointer">Clear All</span>
               </div>
               <div className="grid grid-cols-2 gap-2 mb-8">
                 {["Under ৳500", "৳1k - ৳2k", "৳2k - ৳5k", "৳5k - ৳10k", "৳10k - ৳25k", "৳25k - ৳50k", "৳50k - ৳100k"].map((range, i) => (
                   <button key={i} className={cn("px-2 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all text-center", i === 0 ? "bg-orange-primary text-white shadow-md shadow-orange-primary/20" : "bg-gray-50 text-gray-400 hover:bg-gray-100")}>
                      {range}
                   </button>
                 ))}
               </div>
               <div className="px-2 mb-8">
                  <div className="relative h-1 bg-gray-100 rounded-full">
                     <div className="absolute left-[10%] right-[30%] top-0 bottom-0 bg-orange-primary rounded-full" />
                     <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-orange-primary rounded-full shadow-lg cursor-pointer" />
                     <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-orange-primary rounded-full shadow-lg cursor-pointer" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">From ৳</span>
                     <input type="text" value="14,048" className="w-full h-10 px-3 bg-[#F8FAFC] rounded-lg text-xs font-bold text-navy focus:outline-none border border-transparent focus:border-orange-primary shadow-inner" readOnly />
                  </div>
                  <div className="flex flex-col gap-1.5">
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">To ৳</span>
                     <input type="text" value="20,000" className="w-full h-10 px-3 bg-[#F8FAFC] rounded-lg text-xs font-bold text-navy focus:outline-none border border-transparent focus:border-orange-primary shadow-inner" readOnly />
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
          <div className="w-full h-[1px] bg-gray-100 mb-20" />

          {/* Exclusive Deals Section */}
          {(activeFilter === 'Full Experience' || activeFilter === 'Exclusive Deals Only') && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-navy italic tracking-tighter uppercase mb-1">Exclusive Deals</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">Limited Time Offers From {brand.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(188px,1fr))] justify-items-center justify-center gap-6">
                {finalDeals.map((product, i) => (
                  <ProductCard key={i} product={product} variant="grid" />
                ))}
              </div>
            </div>
          )}

          {/* Products Sub-section */}
          {(activeFilter === 'Full Experience' || activeFilter === 'Product Catalogs Only') && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-navy italic tracking-tighter uppercase mb-1">Product Catalog</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">Explore All Items From {brand.name}</p>
                </div>
              </div>

              {/* Top Bar / Sort Area */}
              <div className="flex flex-col gap-6 mb-12">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                      Active Results: <span className="text-navy">100 Items Identified</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-navy text-[10px] font-black uppercase tracking-widest">
                          Sort:
                          <div className="relative group">
                            <button className="flex items-center gap-2 px-6 py-2 bg-orange-primary text-white rounded-xl shadow-lg shadow-orange-primary/20">
                                Most Popular <ChevronDown size={14} />
                            </button>
                          </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(188px,1fr))] justify-items-center justify-center gap-6 mb-20">
                {([...displayProducts, ...displayProducts, ...displayProducts.slice(0, 4)]).map((product, i) => (
                  <ProductCard key={i} product={product} variant="grid" />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-12">
                <div className="flex items-center gap-4 bg-white px-8 py-3 rounded-full border border-gray-100 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-navy transition-colors whitespace-nowrap">
                      Previous
                    </button>
                    <div className="flex items-center gap-4">
                      {[1, 2, 3, 4, 5, "...", 32].map((page, i) => (
                          <button key={i} className={cn("w-9 h-9 rounded-full text-xs font-black transition-all flex-shrink-0 flex items-center justify-center", page === 3 ? "bg-orange-primary text-white shadow-xl shadow-orange-primary/20 scale-110" : "text-gray-400 hover:text-navy hover:bg-gray-50")}>
                            {page}
                          </button>
                      ))}
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest hover:text-orange-primary transition-colors whitespace-nowrap">
                      Next
                    </button>
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic px-6 py-3 bg-white border border-gray-100 rounded-full">
                    Showing <span className="text-navy">100</span> Of <span className="text-navy">1,582 Results</span>
                </div>
              </div>
            </>
          )}
        </main>

        {/* RIGHT SIDEBAR WITH PROMO CODES */}
        <aside className="hidden xl:flex flex-col gap-8 w-64 xl:w-72 flex-shrink-0">
          <div className="bg-white rounded-[32px] p-6 border border-gray-100 text-left relative overflow-hidden shadow-xl">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-orange-primary rounded-full" />
                   <h4 className="text-base font-black text-navy uppercase tracking-tight italic">Promo Codes</h4>
                </div>
                <button className="text-[10px] font-black text-orange-primary hover:underline uppercase tracking-widest">
                  See All
                </button>
             </div>
             
             <div className="w-full h-px bg-gray-100 my-4" />

             <div className="space-y-6">
                {/* Promo Code Card 1 */}
                <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex flex-col items-center text-center">
                   <div className="w-10 h-10 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary mb-4 shadow-sm border border-orange-primary/10">
                      <Gift size={16} />
                   </div>
                   <span className="text-[10px] font-black text-navy uppercase tracking-wider mb-1">First Purchase Offer</span>
                   <span className="text-lg font-black text-orange-primary italic uppercase tracking-tighter mb-4">BDT 500 FLAT</span>
                   
                   <div className="w-full py-3.5 bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 shadow-xs">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Promo Code</span>
                      <span className="text-sm font-mono font-black text-navy tracking-widest leading-none">EID26</span>
                   </div>
                   
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Valid Till June 30</span>
                </div>

                {/* Promo Code Card 2 */}
                <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex flex-col items-center text-center">
                   <div className="w-10 h-10 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary mb-4 shadow-sm border border-orange-primary/10">
                      <Gift size={16} />
                   </div>
                   <span className="text-[10px] font-black text-navy uppercase tracking-wider mb-1">First Purchase Offer</span>
                   <span className="text-lg font-black text-orange-primary italic uppercase tracking-tighter mb-4">BDT 500 FLAT</span>
                   
                   <div className="w-full py-3.5 bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 shadow-xs">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Promo Code</span>
                      <span className="text-sm font-mono font-black text-navy tracking-widest leading-none">APEX500</span>
                   </div>
                   
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">For New Users Only</span>
                </div>

                {/* Promo Code Card 3 */}
                <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex flex-col items-center text-center">
                   <div className="w-10 h-10 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary mb-4 shadow-sm border border-orange-primary/10">
                      <Gift size={16} />
                   </div>
                   <span className="text-[10px] font-black text-navy uppercase tracking-wider mb-1">First Purchase Offer</span>
                   <span className="text-lg font-black text-orange-primary italic uppercase tracking-tighter mb-4">BDT 500 FLAT</span>
                   
                   <div className="w-full py-3.5 bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-3 shadow-xs">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Promo Code</span>
                      <span className="text-sm font-mono font-black text-navy tracking-widest leading-none">APEX20</span>
                   </div>
                   
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Valid Till June 30</span>
                </div>
             </div>
          </div>

          {/* SPONSORED AD BANNER */}
          <div className="bg-[#020215] rounded-[32px] p-6 border border-white/5 text-center relative overflow-hidden shadow-2xl flex flex-col items-center w-full mt-6">
             {/* Badge */}
             <div className="border border-white/20 px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest text-[#94A3B8] uppercase mb-5 leading-none">
                SPONSORED AD
             </div>

             {/* Fashion Portrait Image */}
             <div className="w-full relative rounded-2xl overflow-hidden mb-6 aspect-[4/5] border border-white/10 shadow-lg">
                <img 
                   src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" 
                   className="w-full h-full object-cover relative z-10" 
                   alt="Aarong Brand Ambassador" 
                   referrerPolicy="no-referrer"
                />
             </div>

             {/* Aarong Typography */}
             <div className="flex flex-col gap-1.5 mb-5">
                <h4 className="text-xl font-black text-white uppercase tracking-wider leading-none">AARONG</h4>
                <h4 className="text-[16px] font-black text-white uppercase tracking-tighter leading-none">HERITAGE SHOPPING</h4>
                <h4 className="text-xl font-black text-white uppercase tracking-widest leading-none">BRAND</h4>
             </div>

             {/* Support Text */}
             <p className="text-[9.5px] text-[#A1A1AA] font-bold leading-relaxed mb-6 max-w-[210px] mx-auto text-center">
                New Collection Available. Free Delivery Overall Dhaka On Purchase Above BDT 1500
             </p>

             {/* CTA Action Button */}
             <button className="w-full py-3.5 bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:opacity-90 active:scale-[0.98] transition-all text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-primary/20 italic">
                Shop Now
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
}
