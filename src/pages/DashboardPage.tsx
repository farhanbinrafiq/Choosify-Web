import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Bookmark, 
  Layers, 
  MessageSquare, 
  Star, 
  Settings, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight, 
  ArrowLeft, 
  ShoppingBag, 
  Store, 
  BookOpen, 
  Trash2, 
  Plus, 
  Send,
  MoreVertical,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Filter,
  X,
  Truck,
  FileText,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { ProductCard } from '../components/ProductCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { PRODUCTS, BRANDS, BLOGS } from '../constants';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { PLACEHOLDER_IMAGE } from '../constants';
import toast from 'react-hot-toast';

// Hex Colors as per instruction
const COLORS = {
  navy: '#0A0A1F',
  orange: '#F96500',
  green: '#07DD05',
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-6 py-4 transition-all relative group overflow-hidden border-none text-left bg-transparent cursor-pointer",
      active ? "text-white" : "text-gray-400 hover:text-white"
    )}
  >
    {active && (
      <motion.div 
        layoutId="active-sidebar"
        className="absolute inset-0 bg-white/5 border-r-4 border-[#F96500]"
      />
    )}
    <Icon size={20} className={cn("relative z-10", active ? "text-[#F96500]" : "group-hover:text-white")} />
    <span className="text-[11px] font-black uppercase tracking-[0.2em] relative z-10 italic">{label}</span>
  </button>
);

const TabItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-shrink-0 px-6 py-4 text-[10px] font-black uppercase tracking-widest italic transition-all border-b-2 bg-transparent cursor-pointer",
      active ? "border-[#F96500] text-white" : "border-transparent text-gray-400"
    )}
  >
    {label}
  </button>
);

const StatCard = ({ icon: Icon, label, value, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5 group hover:bg-white/10 transition-all cursor-pointer hover:border-white/20 select-none"
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", color)}>
      <Icon size={22} />
    </div>
    <div className="text-left">
      <div className="text-2xl font-black text-white italic leading-none mb-1">{value}</div>
      <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-tight">{label}</div>
    </div>
  </div>
);

// --- SECTIONS ---

const OverviewSection = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
  const { savedProducts, savedBrands, lovedBrands, followedBrands, recentlyViewed, comparedProducts } = useDashboard();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
            Hi, <span className="text-[#F96500]">Mr. Farhan</span>
          </h2>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.3em] italic">Bangladesh's best curator since 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-navy overflow-hidden bg-gray-800">
                <img 
                  src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${i}&background=random`; }}
                  className="w-full h-full object-cover" 
                  alt="" 
                />
              </div>
            ))}
          </div>
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">12 Active Experts Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Heart} 
          label="Saved Products" 
          value={savedProducts.length} 
          color="bg-[#F96500]" 
          onClick={() => onTabChange && onTabChange('saved-products')}
        />
        <StatCard 
          icon={Store} 
          label="Saved Brands" 
          value={savedBrands.length} 
          color="bg-[#1B5CFF]" 
          onClick={() => onTabChange && onTabChange('saved-brands')}
        />
        <StatCard 
          icon={Heart} 
          label="Loved Brands" 
          value={lovedBrands.length} 
          color="bg-rose-500" 
          onClick={() => onTabChange && onTabChange('loved-brands')}
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Followed Brands" 
          value={followedBrands.length} 
          color="bg-[#07DD05]" 
          onClick={() => onTabChange && onTabChange('followed-brands')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3">
              <Clock className="text-[#F96500]" size={20} /> Recently Viewed
            </h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onTabChange && onTabChange('recently-viewed')}
                className="text-[10px] font-black text-[#F96500] uppercase tracking-widest hover:underline italic bg-transparent border-none cursor-pointer"
              >
                See All
              </button>
            </div>
          </div>
          
          {recentlyViewed.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-2 -mx-2">
              {recentlyViewed.map((p, i) => (
                <div key={i} className="min-w-[280px] sm:min-w-[320px] shrink-0">
                  <ProductCard product={p} variant="grid" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/5 w-full">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider italic">No recently viewed history</p>
              <button 
                onClick={() => onTabChange && onTabChange('recently-viewed')}
                className="mt-4 text-[9px] font-black text-[#F96500] uppercase tracking-widest italic hover:underline"
              >
                Learn More
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3">
              <TrendingUp className="text-[#07DD05]" size={20} /> Today's Pick
            </h3>
            <div className="bg-gradient-to-br from-[#F96500]/20 to-transparent border border-[#F96500]/30 rounded-3xl p-8 relative overflow-hidden group h-[400px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F96500]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop" 
                loading="lazy"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                className="w-full h-48 object-contain mb-8 group-hover:scale-110 transition-transform duration-700" 
                alt="" 
              />
              <div className="mt-auto text-left">
                <span className="text-[9px] font-black text-[#F96500] uppercase tracking-[0.4em] mb-2 block font-sans">Special Recommendation</span>
                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-4 font-sans">Apex Premium Runner Elite X</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white italic font-sans">BDT 4,500</span>
                  <button className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-[#F96500] hover:text-white transition-all cursor-pointer border-none">
                    <ArrowLeft className="rotate-180" size={18} />
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const SavedProductsSection = () => {
  const { savedProducts, removeSavedProduct } = useDashboard();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Saved <span className="text-[#F96500]">Vault</span> <span className="text-gray-500 text-2xl">({savedProducts.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Your curated list of premium desires</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-6 py-2">
           <Filter size={14} className="text-gray-400" />
           <select className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer border-none">
              <option value="all" className="bg-[#0A0A1F]">All Categories</option>
              <option value="tech" className="bg-[#0A0A1F]">Tech</option>
              <option value="fashion" className="bg-[#0A0A1F]">Fashion</option>
           </select>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedProducts.map((p) => (
            <div key={p.id} className="relative group">
              <button 
                onClick={() => removeSavedProduct(p.id)}
                className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-500/20 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={18} />
              </button>
              <ProductCard product={p} variant="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-8 scale-110">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-widest mb-4">Vault is empty</h3>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-12 italic max-w-sm">Start exploring Choosify.bd and save products you love to your personal vault.</p>
          <Link to="/products" className="px-12 py-4 bg-[#F96500] text-white rounded-full text-[11px] font-black uppercase tracking-widest italic shadow-2xl shadow-[#F96500]/20 hover:scale-105 transition-all">Start Browsing</Link>
        </div>
      )}
    </div>
  );
};

const SavedBrandsSection = () => {
  const { savedBrands, removeSavedBrand } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Saved <span className="text-[#1B5CFF]">Brands</span> <span className="text-gray-500 text-2xl">({savedBrands.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">☆ Bookmarked partners for later reference</p>
        </div>
      </div>

      {savedBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {savedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all text-center flex flex-col justify-between"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedBrand(brand.id);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                <X size={16} />
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-navy font-black text-2xl mx-auto mb-6 shadow-xl shadow-black/20 overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-lg font-black text-white uppercase italic mb-2 truncate group-hover:text-[#F96500] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#F96500] fill-current text-current" : "text-white/10"} />
                  ))}
                  <span className="text-[10px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-3 bg-white/5 border border-white/10 hover:border-[#F96500]/50 hover:bg-[#F96500]/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all text-center">
                Visit Brand Hub
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-60">
          <Store size={64} className="mb-8 text-gray-500" />
          <p className="text-[11px] font-black uppercase tracking-widest italic leading-relaxed">No Saved Brands yet</p>
          <Link to="/brands" className="mt-8 px-10 py-3 bg-[#F96500] text-white rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">Browse All Brands</Link>
        </div>
      )}
    </div>
  );
};

const LovedBrandsSection = () => {
  const { lovedBrands, toggleLoveBrand } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Loved <span className="text-[#F96500]">Brands</span> <span className="text-gray-500 text-2xl">({lovedBrands.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">♥ Brands you reacted to with love</p>
        </div>
      </div>

      {lovedBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {lovedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all text-center flex flex-col justify-between"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLoveBrand(brand);
                }}
                className="absolute top-4 right-4 text-rose-500 hover:text-gray-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                <Heart size={16} className="fill-current text-rose-500" />
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-navy font-black text-2xl mx-auto mb-6 shadow-xl shadow-black/20 overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-lg font-black text-white uppercase italic mb-2 truncate group-hover:text-[#F96500] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#F96500] fill-current text-current" : "text-white/10"} />
                  ))}
                  <span className="text-[10px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-3 bg-white/5 border border-white/10 hover:border-[#F96500]/50 hover:bg-[#F96500]/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all text-center">
                Visit Brand Hub
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-60">
          <Heart size={64} className="mb-8 text-rose-500" />
          <p className="text-[11px] font-black uppercase tracking-widest italic leading-relaxed">No Loved Brands yet</p>
          <Link to="/brands" className="mt-8 px-10 py-3 bg-[#F96500] text-white rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">Explore Brands</Link>
        </div>
      )}
    </div>
  );
};

const FollowedBrandsSection = () => {
  const { followedBrands, toggleFollowBrand } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Followed <span className="text-[#F96500]">Partners</span> <span className="text-gray-500 text-2xl">({followedBrands.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">⚡ Subscribed to receive updates and deals</p>
        </div>
      </div>

      {followedBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {followedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all text-center flex flex-col justify-between"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowBrand(brand);
                }}
                className="absolute top-4 right-4 text-orange-500 hover:text-gray-400 transition-colors bg-transparent border-none cursor-pointer font-black text-[10px] tracking-wider uppercase"
              >
                Unfollow
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-navy font-black text-2xl mx-auto mb-6 shadow-xl shadow-black/20 overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-lg font-black text-white uppercase italic mb-2 truncate group-hover:text-[#F96500] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#F96500] fill-current text-current" : "text-white/10"} />
                  ))}
                  <span className="text-[10px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-3 bg-white/5 border border-white/10 hover:border-[#F96500]/50 hover:bg-[#F96500]/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest transition-all text-center justify-between flex items-center px-4">
                <span>View Updates</span>
                <span className="bg-[#07DD05] text-[7px] text-[#0A0A1F] font-black px-1.5 py-0.5 rounded-full uppercase scale-90">Live</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-60">
          <Store size={64} className="mb-8 text-gray-500" />
          <p className="text-[11px] font-black uppercase tracking-widest italic leading-relaxed">No Followed Brands yet</p>
          <Link to="/brands" className="mt-8 px-10 py-3 bg-[#F96500] text-white rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">Explore and Follow Brands</Link>
        </div>
      )}
    </div>
  );
};

const RecentlyViewedSection = () => {
  const { recentlyViewed, setRecentlyViewed } = useDashboard();

  const handleClearHistory = () => {
    setRecentlyViewed([]);
    toast.success('Browsing history cleared.');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Recently <span className="text-[#F96500]">Viewed</span> <span className="text-gray-500 text-2xl">({recentlyViewed.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">🕒 Products you recently browsed</p>
        </div>
        {recentlyViewed.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="text-[10px] font-black text-red-500 uppercase tracking-widest italic hover:underline bg-transparent border-none cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>

      {recentlyViewed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentlyViewed.map((p) => (
            <div key={p.id} className="relative group">
              <ProductCard product={p} variant="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-60">
          <Clock size={64} className="mb-8 text-[#F96500]" />
          <p className="text-[11px] font-black uppercase tracking-widest italic leading-relaxed">No recently viewed products</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase mt-2 italic">Product views will automatically populate this section.</p>
          <Link to="/products" className="mt-8 px-10 py-3 bg-[#F96500] text-[#0A0A1F] font-black uppercase tracking-widest italic shadow-xl">Go To Directory</Link>
        </div>
      )}
    </div>
  );
};

const CompareToolSection = () => {
  const { comparedProducts, removeFromCompare } = useDashboard();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Compare <span className="text-[#07DD05]">Matrix</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Side-by-side analysis for smart decisions</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 flex items-center gap-2">
              <Send size={14} /> Share Link
           </button>
           <Link to="/compare" className="px-8 py-3 bg-[#07DD05] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#07DD05]/20 hover:scale-105 active:scale-95 transition-all">Full View</Link>
        </div>
      </div>

      <div className="bg-[#050514]/50 border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[200px_repeat(3,1fr)] divide-x divide-white/5 border-b border-white/10">
               <div className="p-8 flex flex-col justify-center bg-white/5">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic mb-2">Active Slots</span>
                  <h4 className="text-xl font-black text-white italic uppercase uppercase leading-none">{comparedProducts.length}/4 Models</h4>
               </div>
               {[...comparedProducts, ...Array(4 - comparedProducts.length).fill(null)].slice(0, 3).map((p, i) => (
                 <div key={i} className="p-8 group relative min-h-[200px] flex flex-col items-center justify-center">
                   {p ? (
                     <>
                       <button 
                         onClick={() => removeFromCompare(p.id)}
                         className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                       >
                         <X size={16} />
                       </button>
                       <img src={p.image} className="w-20 h-20 object-contain mb-6" alt="" />
                       <h5 className="text-[11px] font-black text-white italic uppercase text-center line-clamp-1">{p.title}</h5>
                       <span className="text-[10px] font-bold text-[#F96500] mt-1 italic">BDT {p.price}</span>
                     </>
                   ) : (
                     <button className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/10 hover:border-white/20 hover:text-white/30 transition-all">
                        <Plus size={24} />
                     </button>
                   )}
                 </div>
               ))}
            </div>
            
            {/* Comparison Table (Simplified) */}
            <div className="divide-y divide-white/5">
                {[
                  { label: 'Rating', values: comparedProducts.map(p => p.rating + '/5.0') },
                  { label: 'Market Value', values: comparedProducts.map(() => 'Premium') },
                  { label: 'In Stock', values: comparedProducts.map(() => 'Yes (Dhaka)'), color: 'text-[#07DD05]' },
                  { label: 'Expert Score', values: comparedProducts.map(() => '92/100'), color: 'text-[#F96500]' }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-[200px_repeat(3,1fr)] divide-x divide-white/5">
                     <div className="p-6 bg-white/5 text-[10px] font-black text-gray-400 uppercase italic tracking-widest">{row.label}</div>
                     {row.values.map((val, vidx) => (
                       <div key={vidx} className={cn("p-6 text-center text-xs font-bold italic", row.color || "text-white")}>{val}</div>
                     ))}
                     {/* Empty slot fillers */}
                     {Array(3 - row.values.length).fill(null).map((_, fidx) => (
                       <div key={`f-${fidx}`} className="p-6 text-center text-white/5">-</div>
                     ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessagesSection = () => {
  const { messages, addMessage } = useDashboard();
  const [inputText, setInputText] = useState('');
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage(inputText, 'user');
    setInputText('');
  };

  return (
    <div className="h-[600px] md:h-[700px] flex flex-col md:flex-row gap-px bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Inbox List */}
      <div className={cn(
        "w-full md:w-[300px] lg:w-[350px] bg-[#050514] flex flex-col",
        activeChat !== null && "hidden md:flex"
      )}>
         <div className="p-6 md:p-8 border-b border-white/5">
            <h2 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter mb-4">Inbox</h2>
            <div className="relative">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input className="w-full h-10 pl-10 pr-4 bg-white/5 rounded-xl text-[10px] font-bold text-white placeholder:text-gray-500 focus:outline-none" placeholder="Search chats..." />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto no-scrollbar">
            {[1, 2, 3].map(i => (
              <button 
                key={i} 
                onClick={() => setActiveChat(i)}
                className={cn("w-full p-6 flex gap-4 text-left border-b border-white/5 transition-all hover:bg-white/5", i === 1 && "bg-white/5 border-r-2 border-[#F96500]")}
              >
                 <div className="relative">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} className="w-12 h-12 rounded-full object-cover" alt="" />
                    {i === 1 && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#07DD05] border-2 border-[#050514] rounded-full" />}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-xs font-black text-white italic truncate">{i === 1 ? 'Farhan Rafiq (Admin)' : i === 2 ? 'Apex Official' : 'Dhanmondi Branch'}</span>
                       <span className="text-[8px] font-bold text-gray-500">10:30 AM</span>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1 italic font-bold">Absolutely! We can ship the S24 Ultra...</p>
                 </div>
              </button>
            ))}
         </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-[#0A0A1F]/50",
        activeChat === null && "hidden md:flex"
      )}>
         <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[#050514]/40">
            <div className="flex items-center gap-4">
               <button onClick={() => setActiveChat(null)} className="md:hidden w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white">
                  <ArrowLeft size={16} />
               </button>
               <img src="https://i.pravatar.cc/150?u=admin" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" alt="" />
               <div>
                  <h4 className="text-xs md:text-sm font-black text-white italic uppercase tracking-widest leading-none">Farhan Rafiq</h4>
                  <span className="text-[8px] md:text-[9px] font-bold text-[#07DD05] uppercase italic font-black">Support Active</span>
               </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
               <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Bell size={14} /></button>
               <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><MoreVertical size={14} /></button>
            </div>
         </div>

         <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 no-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex flex-col max-w-[90%] md:max-w-[80%]", m.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                 <div className={cn(
                   "px-5 py-3 md:px-6 md:py-4 rounded-[16px] md:rounded-[20px] mb-2 text-[11px] md:text-xs font-bold leading-relaxed",
                   m.sender === 'user' ? "bg-[#F96500] text-white rounded-tr-none shadow-xl shadow-[#F96500]/10 italic" : "bg-white/5 text-gray-300 rounded-tl-none border border-white/10"
                 )}>
                    {m.text}
                 </div>
                 <span className="text-[8px] font-black text-gray-500 uppercase italic px-2">{m.senderName || 'Farhan'} • {m.time}</span>
              </div>
            ))}
         </div>

         <div className="p-6 md:p-8 bg-[#050514]/60 border-t border-white/5">
            <div className="relative">
               <input 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-6 pr-14 md:pr-16 text-xs font-bold text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F96500]/50 transition-all" 
                 placeholder="Type message..." 
               />
               <button 
                 onClick={handleSend}
                 className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#F96500] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#F96500]/20"
               >
                  <Send size={16} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const NotificationsSection = () => {
  const { notifications, setNotifications } = useDashboard();

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Notification <span className="text-[#7C3AED]">Center</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Updates on your curated world</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-[10px] font-black text-[#F96500] uppercase tracking-widest italic hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={cn(
                "p-8 bg-white/5 border border-white/10 rounded-[24px] flex items-start gap-6 transition-all hover:bg-white/10 relative overflow-hidden group",
                !n.read && "border-[#7C3AED]/30 bg-[#7C3AED]/5"
              )}
            >
              {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#7C3AED]" />}
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                n.type === 'price' ? "bg-[#07DD05]/10 text-[#07DD05]" : 
                n.type === 'reply' ? "bg-[#F96500]/10 text-[#F96500]" : 
                "bg-[#7C3AED]/10 text-[#7C3AED]"
              )}>
                {n.type === 'price' ? <TrendingUp size={24} /> : n.type === 'reply' ? <MessageSquare size={24} /> : <Bell size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{n.title}</h4>
                  <span className="text-[10px] font-black text-gray-500 uppercase">{n.time}</span>
                </div>
                <p className="text-gray-400 text-sm font-bold italic leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center text-center opacity-40">
            <Bell size={64} className="mb-8" />
            <p className="text-[11px] font-black uppercase tracking-widest italic">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsSection = () => {
  const [profile, setProfile] = useState({
    name: 'Farhan Bin Rafiq',
    email: 'farhan-88@gmail.com',
    location: 'Dhaka, Bangladesh'
  });

  const handleSave = () => {
    toast.success('Profile settings updated successfully');
  };

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Profile <span className="text-[#F96500]">Master</span></h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Configure your discovery experience</p>
          </div>
          <button 
            onClick={handleSave}
            className="px-10 py-3 bg-[#F96500] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#F96500]/20 hover:scale-105 transition-all italic"
          >
            Save Changes
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
             <div className="flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#F96500]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-32 h-32 mb-6 cursor-pointer group/avatar">
                   <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full rounded-full object-cover border-4 border-[#F96500]/30 transition-all group-hover/avatar:border-white" alt="Profile" />
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Plus className="text-white" size={32} />
                   </div>
                </div>
                <h4 className="text-xl font-black text-white italic uppercase mb-1">{profile.name}</h4>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Premium Curator • ID: 89BD-001</p>
             </div>

             <div className="space-y-6">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] px-2 italic">Basic Intel</h3>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Full Display Name</label>
                      <input 
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-bold text-white focus:outline-none focus:border-[#F96500]/50" 
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Email Address</label>
                      <input 
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-bold text-white focus:outline-none focus:border-[#F96500]/50" 
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Location (City)</label>
                      <input 
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-bold text-white focus:outline-none focus:border-[#F96500]/50" 
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="space-y-6">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] px-2 italic">Notification Matrix</h3>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                   {[
                     { label: 'Sale Alerts', desc: 'When your saved product goes on flash sale', checked: true },
                     { label: 'Expert Tips', desc: 'Weekly curated guides for your categories', checked: true },
                     { label: 'Price Drops', desc: 'Whenever a brand lowers price beyond 20%', checked: false },
                     { label: 'Inbox Direct', desc: 'Direct messages from verified sellers', checked: true }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between gap-6 group">
                        <div className="flex-1">
                           <h5 className="text-[11px] font-black text-white uppercase italic tracking-tighter mb-1">{item.label}</h5>
                           <p className="text-[9px] font-bold text-gray-500 italic uppercase">{item.desc}</p>
                        </div>
                        <button className={cn(
                          "w-12 h-6 rounded-full transition-all relative p-1",
                          item.checked ? "bg-[#07DD05]" : "bg-white/10"
                        )}>
                           <div className={cn("w-4 h-4 rounded-full bg-white transition-all shadow-md", item.checked ? "translate-x-6" : "translate-x-0")} />
                        </button>
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] px-2 italic">Security Zone</h3>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 flex items-center justify-center gap-3">
                   <ShieldCheck size={16} className="text-[#F96500]" /> Reset Multi-Factor Auth
                </button>
                <button className="w-full py-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                   Deactivate Curator Account
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

const AdminCampaignsSection = () => {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useDashboard();
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [ctaText, setCtaText] = useState('EXPLORE');
  const [ctaLink, setCtaLink] = useState('/deals');
  const [image, setImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [active, setActive] = useState(true);
  const [sponsorBadge, setSponsorBadge] = useState('');
  const [countdownEnd, setCountdownEnd] = useState('');

  const imagePresets = [
    { name: 'Black Friday Gold', url: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=1600&q=80' },
    { name: 'Summer Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80' },
    { name: 'Tech Neon', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&q=80' },
    { name: 'Fashion Boutique', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80' },
    { name: 'Stadium & Arena', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80' }
  ];

  const handleEdit = (c: any) => {
    setEditingId(c.id);
    setTitle(c.title);
    setTagline(c.tagline);
    setCtaText(c.ctaText || 'EXPLORE');
    setCtaLink(c.ctaLink || '/deals');
    setImage(c.image);
    setStartDate(c.startDate || '');
    setEndDate(c.endDate || '');
    setPriority(c.priority || 1);
    setActive(c.active);
    setSponsorBadge(c.sponsorBadge || '');
    setCountdownEnd(c.countdownEnd || '');
    setFormMode('edit');
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setTitle('');
    setTagline('');
    setCtaText('EXPLORE');
    setCtaLink('/deals');
    setImage('');
    setStartDate('');
    setEndDate('');
    setPriority(1);
    setActive(true);
    setSponsorBadge('');
    setCountdownEnd('');
    setFormMode('create');
  };

  const handleSave = () => {
    if (!title.trim() || !tagline.trim() || !image.trim()) {
      toast.error('Please fill in Title, Tagline and Banner Image URL');
      return;
    }

    const campaignData: any = {
      title,
      tagline,
      ctaText,
      ctaLink,
      image,
      startDate,
      endDate,
      priority: Number(priority),
      active,
      sponsorBadge: sponsorBadge.trim() || undefined,
      countdownEnd: countdownEnd.trim() || undefined
    };

    if (formMode === 'edit' && editingId) {
      updateCampaign({ ...campaignData, id: editingId });
    } else {
      addCampaign(campaignData);
    }
    setFormMode('list');
  };

  const toggleCampaignActive = (c: any) => {
    updateCampaign({ ...c, active: !c.active });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 text-white">
      {formMode === 'list' ? (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Campaigns <span className="text-[#F96500]">Manager</span></h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Curate and schedule edge-to-edge promotional banners</p>
            </div>
            
            <button
              onClick={handleCreateNew}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-md italic cursor-pointer animate-pulse"
            >
              + Create Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns && campaigns.map((c) => {
              const isPast = c.endDate && new Date(c.endDate) < new Date();
              const isFuture = c.startDate && new Date(c.startDate) > new Date();
              
              return (
                <div key={c.id} className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url(${c.image})` }} />
                  
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                        !c.active ? 'bg-red-950/80 border border-red-500/25 text-red-400' :
                        isPast ? 'bg-amber-950/80 border border-amber-500/25 text-amber-400' :
                        isFuture ? 'bg-blue-950/80 border border-blue-500/25 text-blue-400' :
                        'bg-green-950/80 border border-green-500/25 text-green-400'
                      }`}>
                        {!c.active ? 'Inactive' : isPast ? 'Expired' : isFuture ? 'Upcoming' : 'Active'}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 font-extrabold">Priority: {c.priority}</span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white italic uppercase tracking-tight">{c.title}</h4>
                      <p className="text-xs text-gray-300 font-medium line-clamp-2 mt-1">{c.tagline}</p>
                    </div>

                    <div className="space-y-1 text-[10px] text-gray-400 font-semibold border-t border-white/5 pt-3">
                      <div><span className="text-gray-500 uppercase">CTA:</span> <span className="text-[#FF5B00] font-mono">{c.ctaText}</span> → <span className="text-gray-300 font-mono italic">{c.ctaLink}</span></div>
                      {c.startDate && <div><span className="text-gray-500 uppercase font-mono">Runs:</span> <span className="text-gray-300 font-mono">{c.startDate} to {c.endDate || 'Forever'}</span></div>}
                      {c.sponsorBadge && <div><span className="text-gray-500 uppercase">Sponsor Badge:</span> <span className="text-emerald-400">{c.sponsorBadge}</span></div>}
                      {c.countdownEnd && <div><span className="text-gray-500 uppercase">Countdown:</span> <span className="text-purple-400 font-mono">{c.countdownEnd}</span></div>}
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-3 mt-6 border-t border-white/5 pt-4">
                    <button
                      onClick={() => toggleCampaignActive(c)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase cursor-pointer tracking-wider border transition-all ${
                        c.active 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' 
                          : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-400 hover:text-black'
                      }`}
                    >
                      {c.active ? 'Deactivate' : 'Activate'}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase cursor-pointer tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCampaign(c.id)}
                        className="p-1.5 rounded-full bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white border border-red-900 hover:border-red-500 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              {formMode === 'edit' ? 'Edit' : 'Create New'} <span className="text-[#FF5B00]">Campaign</span>
            </h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Configure promotional parameters for Choosify home delivery shield</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. BLACK FRIDAY"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Short Tagline (Curated & Premium)</label>
                <input
                  type="text"
                  placeholder="e.g. UP TO 70% OFF SELECT PRODUCTS"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">CTA Button Text</label>
                <input
                  type="text"
                  placeholder="e.g. EXPLORE DEALS"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">CTA Destination Page</label>
                <select
                  className="w-full h-11 bg-[#0b0c1e] border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                >
                  <option value="/deals">Deals Hub Page (/deals)</option>
                  <option value="/products">All Products Feed (/products)</option>
                  <option value="/brands">Brands Page (/brands)</option>
                  <option value="/categories?cat=fashion">Fashion Category (/categories?cat=fashion)</option>
                  <option value="/categories?cat=tech">Tech Category (/categories?cat=tech)</option>
                  <option value="/dashboard">User Personal Dashboard (/dashboard)</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Campaign Banner Background Image URL</label>
                  <span className="text-[9px] text-[#FF5B00] font-black uppercase tracking-wider">Fast Presets</span>
                </div>
                <input
                  type="text"
                  placeholder="Paste direct photographic banner URL"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50 font-mono"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                
                {/* Visual Presets list */}
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setImage(preset.url);
                        toast.success(`Banner presets chosen: ${preset.name}`);
                      }}
                      className="px-3 py-1 text-[9px] font-black uppercase rounded-lg border bg-white/5 hover:bg-[#FF5B00]/20 text-gray-300 border-white/5 hover:border-[#FF5B00]/40 transition-all cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Start Date</label>
                <input
                  type="date"
                  className="w-full h-11 bg-[#0b0c1e] border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">End Date (Expiry)</label>
                <input
                  type="date"
                  className="w-full h-11 bg-[#0b0c1e] border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Display Priority (larger numbers shown first, e.g. 10)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Countdown End Date (optional e.g. 2026-11-28T12:00:00Z)</label>
                <input
                  type="text"
                  placeholder="e.g. 2026-11-28T12:00:00Z"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50 font-mono"
                  value={countdownEnd}
                  onChange={(e) => setCountdownEnd(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Sponsor Label / Badge text (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Platform Special, Sponsored, Apex exclusive"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF5B00]/50"
                  value={sponsorBadge}
                  onChange={(e) => setSponsorBadge(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 pt-6 pl-1 select-none">
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative p-1",
                    active ? "bg-[#07DD05]" : "bg-white/10"
                  )}
                >
                  <div className={cn("w-4 h-4 rounded-full bg-white transition-all shadow-md", active ? "translate-x-6" : "translate-x-0")} />
                </button>
                <div>
                  <h5 className="text-[11px] font-black uppercase italic tracking-tighter">Publish immediately</h5>
                  <p className="text-[9px] font-bold text-gray-500 italic uppercase">Make campaign visible on platform immediately</p>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-4 border-t border-white/5 pt-6 mt-4">
              <button
                type="button"
                onClick={() => setFormMode('list')}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-2.5 bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all shadow-md italic"
              >
                Save Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE ---

export function DashboardPage() {
  const { setIsLoggedIn } = useGlobalState();
  const { 
    savedProducts, 
    savedBrands, 
    lovedBrands, 
    followedBrands, 
    recentlyViewed,
    comparedProducts,
    messages,
    notifications,
    campaigns
  } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'saved-products', label: `Saved Products (${savedProducts.length})`, icon: Heart },
    { id: 'saved-brands', label: `Saved Brands (${savedBrands.length})`, icon: Store },
    { id: 'loved-brands', label: `Loved Brands (${lovedBrands.length})`, icon: Heart },
    { id: 'followed-brands', label: `Followed Brands (${followedBrands.length})`, icon: CheckCircle2 },
    { id: 'recently-viewed', label: `Recently Viewed (${recentlyViewed.length})`, icon: Clock },
    { id: 'saved-recommendations', label: 'Saved Guides', icon: Bookmark },
    { id: 'my-comparisons', label: `My Comparisons (${comparedProducts.length})`, icon: Layers },
    { id: 'admin-campaigns', label: `Campaigns Manager (Admin) (${campaigns?.length || 0})`, icon: Sparkles },
    { id: 'cashbook', label: 'CashBook Ledger', icon: BookOpen, href: '/cashbook' },
    { id: 'messages', label: `Messages (${messages.length})`, icon: MessageSquare },
    { id: 'notifications', label: `Notifications (${notifications.filter(n => !n.read).length})`, icon: Bell },
    { id: 'my-reviews', label: 'My Reviews', icon: Star },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const controlItems = menuItems.filter(item => 
    ['overview', 'saved-products', 'saved-brands', 'loved-brands', 'followed-brands', 'recently-viewed', 'saved-recommendations', 'my-comparisons', 'admin-campaigns', 'cashbook'].includes(item.id)
  );

  const accountItems = menuItems.filter(item => 
    ['messages', 'notifications', 'my-reviews', 'settings'].includes(item.id)
  );

  const renderContent = () => {
    switch (activeTab) {
      // Retail Tabs
      case 'overview': return <OverviewSection onTabChange={setActiveTab} />;
      case 'saved-products': return <SavedProductsSection />;
      case 'saved-brands': return <SavedBrandsSection />;
      case 'loved-brands': return <LovedBrandsSection />;
      case 'followed-brands': return <FollowedBrandsSection />;
      case 'recently-viewed': return <RecentlyViewedSection />;
      case 'admin-campaigns': return <AdminCampaignsSection />;
      case 'saved-recommendations': return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Saved <span className="text-[#F96500]">Guides</span></h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Knowledge bookmarks for your next big buy</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
               {BLOGS.slice(0, 4).map((guide, i) => (
                 <RecommendationCard key={guide.id} guide={guide} index={i} />
               ))}
            </div>
        </div>
      );
      case 'my-comparisons': return <CompareToolSection />;
      case 'messages': return <MessagesSection />;
      case 'notifications': return <NotificationsSection />;
      case 'my-reviews': return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">My <span className="text-orange-primary">Reviews</span></h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Your community contributions and feedback</p>
            </div>
            <div className="space-y-6">
               {[1, 2].map(i => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8">
                    <div className="w-24 h-24 rounded-2xl bg-white p-2 shrink-0">
                       <img src={PRODUCTS[i === 1 ? 0 : 5].image} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-black text-white uppercase italic truncate max-w-md">{PRODUCTS[i === 1 ? 0 : 5].title}</h4>
                          <span className="text-[10px] font-black text-gray-500 uppercase">May {12 - i}, 2026</span>
                       </div>
                       <div className="flex items-center gap-1.5 mb-4">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} className={s <= (i === 1 ? 5 : 4) ? "text-[#F96500] fill-current" : "text-white/10"} />
                          ))}
                       </div>
                       <p className="text-[13px] font-bold text-gray-300 italic italic leading-relaxed max-w-2xl px-4 border-l-2 border-white/10">
                          {i === 1 ? "Amazing performance! The AI features are game-changing for my daily workflow. Battery life is also significantly better than predecessors." : "Very comfortable for daily runs, but size runs slightly small. I suggest buying one size up for the perfect fit."}
                       </p>
                       <div className="mt-6 flex items-center gap-6">
                          <button className="text-[9px] font-black text-[#F96500] uppercase tracking-[0.2em] italic hover:underline">Edit Review</button>
                          <button className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] italic hover:text-white">Delete</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      );
      case 'settings': return <SettingsSection />;

      default: return <OverviewSection onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A1F] text-white">
      {/* Mobile Top Header */}
      <div className="lg:hidden p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0A0A1F] z-50">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white border-0 cursor-pointer">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex w-[320px] flex-col border-r border-[#ffffff0d] bg-[#050514]/40 h-screen sticky top-0 overflow-y-auto no-scrollbar">
          <div className="p-10 border-b border-[#ffffff0d]">
            <Link to="/" className="flex flex-col items-start group mb-8">
              <div className="flex gap-1 mb-1">
                <div className="w-4 h-4 rounded-full border-2 border-[#F96500] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#F96500] rounded-full" />
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-[#F96500] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#F96500] rounded-full" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight lowercase font-sans">choosify.bd</span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1 italic">Dashboard v2.0</span>
            </Link>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
            <div className="px-10 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">Platform Control</div>
            {controlItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => {
                  if (item.href) {
                    navigate(item.href);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              />
            ))}
            
            <div className="mt-12 px-10 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">Communication & Account</div>
            {accountItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => {
                  if (item.href) {
                    navigate(item.href);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
              />
            ))}
          </nav>

          <div className="p-10 mt-auto border-t border-white/5 space-y-4">
            <Link to="/" className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-navy rounded-2xl text-[11px] font-black uppercase tracking-widest italic hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20">
               <ShoppingBag size={16} /> Browse Choosify.bd
            </Link>
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                navigate('/');
                toast.success('Successfully logged out.');
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic hover:bg-white/10 transition-all cursor-pointer"
            >
               <LogOut size={16} className="text-[#F96500]" /> Curator Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full relative">
          {/* GLOBAL STICKY NAVIGATION SYSTEM */}
          <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-150 shadow-sm py-4 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="flex items-center justify-start lg:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'overview', label: "Overview", icon: <LayoutDashboard size={13} /> },
                  { id: 'saved-products', label: "Saved Products", icon: <Bookmark size={13} /> },
                  { id: 'saved-brands', label: "Saved Brands", icon: <Store size={13} /> },
                  { id: 'loved-brands', label: "Loved Brands", icon: <Heart size={13} /> },
                  { id: 'followed-brands', label: "Followed Brands", icon: <CheckCircle2 size={13} /> },
                  { id: 'recently-viewed', label: "Recently Viewed", icon: <Clock size={13} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px] border",
                      activeTab === tab.id
                        ? "bg-[#E8500A] border-transparent text-white shadow-md shadow-[#E8500A]/10 italic"
                        : "bg-white border-gray-200 text-gray-500 hover:text-navy hover:bg-gray-50/80"
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

           <div className="p-8 md:p-12 lg:p-20 max-w-[1400px] mx-auto min-h-screen">
              <div className="animate-in fade-in transition-all duration-700">
                {renderContent()}
              </div>
           </div>
           
           {/* Footer Accent */}
           <div className="py-20 text-center opacity-20 hidden lg:block">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <span className="text-xl font-bold tracking-tight lowercase">choosify.bd</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">SECURE CURATOR TERMINAL • v2.6.0</p>
           </div>
        </main>
      </div>
    </div>
  );
}
