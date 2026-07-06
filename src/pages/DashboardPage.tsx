import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Bookmark, 
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
  ShieldCheck,
  TrendingUp,
  Filter,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { ProductCard } from '../components/ProductCard';
import { PRODUCT_CARD_GRID, GUIDE_MEDIA_GRID } from '../lib/pageLayout';
import { renderGuideMediaCard } from './GuidesPage';
import { PRODUCTS } from '../constants';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CHOOSIFY_ANNOUNCEMENTS_THREAD_ID } from '../lib/announcements';
import { cn } from '../lib/utils';
import { PLACEHOLDER_IMAGE } from '../constants';
import { PublicReviewCard } from '../components/PublicReviewCard';
import toast from 'react-hot-toast';
import { getStudioSections } from '../data/studioSections';

// Hex Colors as per instruction
const COLORS = {
  navy: '#0A0A1F',
  orange: '#E8500A',
  green: '#059669',
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-10 py-4 transition-all relative group overflow-hidden border-none text-left bg-transparent cursor-pointer",
      active ? "text-[#E8500A]" : "text-gray-500 hover:text-navy"
    )}
  >
    {active && (
      <motion.div 
        layoutId="active-sidebar"
        className="absolute inset-0 bg-[#E8500A]/5 border-l-4 border-[#E8500A]"
      />
    )}
    <Icon size={18} className={cn("relative z-10", active ? "text-[#E8500A]" : "text-gray-450 group-hover:text-navy")} />
    <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10 italic">{label}</span>
  </button>
);

const TabItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-shrink-0 px-6 py-4 text-[10px] font-black uppercase tracking-widest italic transition-all border-b-2 bg-transparent cursor-pointer",
      active ? "border-[#E8500A] text-navy" : "border-transparent text-gray-400 hover:text-navy"
    )}
  >
    {label}
  </button>
);

const StatCard = ({ icon: Icon, label, value, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white border border-[#e8edf2] rounded-[5px] p-6 flex items-center gap-5 group hover:border-[#E8500A]/30 transition-all cursor-pointer shadow-sm select-none"
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md", color)}>
      <Icon size={20} />
    </div>
    <div className="text-left">
      <div className="text-2xl font-black text-navy italic leading-none mb-1">{value}</div>
      <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-tight">{label}</div>
    </div>
  </div>
);

// --- SECTIONS ---

const OverviewSection = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
  const { savedProducts, savedBrands, lovedBrands, followedBrands, recentlyViewed } = useDashboard();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-navy uppercase italic tracking-tighter leading-none mb-4">
            Hi, <span className="text-[#E8500A]">Mr. Farhan</span>
          </h2>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.3em] italic">Bangladesh's best curator since 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm">
                <img 
                  src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${i}&background=random`; }}
                  className="w-full h-full object-cover" 
                  alt="" 
                />
              </div>
            ))}
          </div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">12 Active Experts Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-navy italic uppercase flex items-center gap-3">
              <Clock className="text-[#E8500A]" size={20} /> Recently Viewed
            </h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onTabChange && onTabChange('recently-viewed')}
                className="text-[10px] font-black text-[#E8500A] uppercase tracking-widest hover:underline italic bg-transparent border-none cursor-pointer"
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
            <div className="py-20 border border-dashed border-gray-200 rounded-[5px] flex flex-col items-center justify-center text-center bg-white w-full shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider italic">No recently viewed history</p>
              <button 
                onClick={() => onTabChange && onTabChange('recently-viewed')}
                className="mt-4 text-[9px] font-black text-[#E8500A] uppercase tracking-widest italic hover:underline"
              >
                Learn More
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <h3 className="text-xl font-black text-navy italic uppercase flex items-center gap-3">
              <TrendingUp className="text-[#059669]" size={20} /> Today's Pick
            </h3>
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-8 relative overflow-hidden group h-[400px] flex flex-col justify-between shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8500A]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop" 
                loading="lazy"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                className="w-full h-48 object-contain mb-8 group-hover:scale-110 transition-transform duration-700" 
                alt="" 
              />
              <div className="mt-auto text-left">
                <span className="text-[9px] font-black text-[#E8500A] uppercase tracking-[0.4em] mb-2 block font-sans">Special Recommendation</span>
                <h4 className="text-2xl font-black text-navy uppercase italic tracking-tighter leading-none mb-4 font-sans">Apex Premium Runner Elite X</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-navy italic font-sans">BDT 4,500</span>
                  <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-150 text-navy flex items-center justify-center hover:bg-[#E8500A] hover:text-white transition-all cursor-pointer border-none shadow-sm">
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
  const { addToCart } = useGlobalState();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Saved <span className="text-[#E8500A]">Vault</span> <span className="text-gray-400 text-2xl">({savedProducts.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Your curated list of premium desires</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-[#e8edf2] rounded-full px-6 py-2 shadow-sm">
           <Filter size={14} className="text-gray-400" />
           <select className="bg-transparent text-navy text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer border-none">
              <option value="all" className="bg-white">All Categories</option>
              <option value="tech" className="bg-white">Tech</option>
              <option value="fashion" className="bg-white">Fashion</option>
           </select>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className={PRODUCT_CARD_GRID}>
          {savedProducts.map((p) => (
            <div key={p.id} className="relative group">
              <button 
                onClick={() => {
                  addToCart(p, 1);
                  toast.success('Added to cart!');
                }}
                className="absolute top-6 right-18 z-30 w-10 h-10 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-[#E8500A]/20 hover:bg-[#E8500A] hover:text-white cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingBag size={18} />
              </button>
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
          <div className="w-24 h-24 rounded-full bg-white border border-[#e8edf2] flex items-center justify-center text-gray-300 mb-8 scale-110 shadow-sm col-span-full">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-black text-[#1a1a2e] italic uppercase tracking-widest mb-4">Vault is empty</h3>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-12 italic max-w-sm">Start exploring Choosify.bd and save products you love to your personal vault.</p>
          <Link to="/products" className="px-12 py-4 bg-[#E8500A] text-white rounded-full text-[11px] font-black uppercase tracking-widest italic shadow-xl shadow-[#E8500A]/10 hover:scale-105 transition-all animate-none">Start Browsing</Link>
        </div>
      )}
    </div>
  );
};

const SavedGuidesSection = () => {
  const { savedGuides } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-left">
        <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">
          Saved <span className="text-[#E8500A]">Guides</span>{' '}
          <span className="text-gray-400 text-2xl">({savedGuides.length})</span>
        </h2>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
          Knowledge bookmarks for your next big buy
        </p>
      </div>

      {savedGuides.length > 0 ? (
        <div className={GUIDE_MEDIA_GRID}>
          {savedGuides.map((guide) => (
            <div key={guide.id} className="relative group min-w-0 w-full">
              {renderGuideMediaCard(guide)}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white border border-[#e8edf2] flex items-center justify-center text-gray-300 mb-8 scale-110 shadow-sm">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-black text-[#1a1a2e] italic uppercase tracking-widest mb-4">
            No saved guides yet
          </h3>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-12 italic max-w-sm">
            Bookmark guides from the recommendations page to find them here later.
          </p>
          <Link
            to="/guides"
            className="px-12 py-4 bg-[#E8500A] text-white rounded-full text-[11px] font-black uppercase tracking-widest italic shadow-xl shadow-[#E8500A]/10 hover:scale-105 transition-all"
          >
            Browse Guides
          </Link>
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
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Saved <span className="text-[#E8500A]">Brands</span> <span className="text-gray-450 text-2xl">({savedBrands.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">â˜† Bookmarked partners for later reference</p>
        </div>
      </div>

      {savedBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {savedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white border border-[#e8edf2] rounded-[5px] p-8 hover:border-[#E8500A]/30 transition-all text-center flex flex-col justify-between shadow-sm"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedBrand(brand.id);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                <X size={16} />
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-navy font-black text-2xl mx-auto mb-6 shadow-sm overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-lg font-black text-[#1a1a2e] uppercase italic mb-2 truncate group-hover:text-[#E8500A] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#E8500A] fill-current text-current" : "text-gray-150"} />
                  ))}
                  <span className="text-[10px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-3 bg-gray-50 border border-gray-150 hover:border-[#E8500A]/50 hover:bg-[#E8500A]/5 rounded-xl text-[9px] font-black text-navy uppercase tracking-widest transition-all text-center">
                Visit Brand Hub
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Store size={64} className="mb-8 text-gray-300" />
          <p className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-widest italic leading-relaxed">No Saved Brands yet</p>
          <Link to="/brands" className="mt-8 px-10 py-3 bg-[#E8500A] text-white rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">Browse All Brands</Link>
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
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Loved <span className="text-[#E8500A]">Brands</span> <span className="text-gray-400 text-2xl">({lovedBrands.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">â™¥ Brands you reacted to with love</p>
        </div>
      </div>

      {lovedBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {lovedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white border border-[#e8edf2] rounded-[5px] p-8 hover:border-[#E8500A]/30 transition-all text-center flex flex-col justify-between shadow-sm"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLoveBrand(brand);
                }}
                className="absolute top-4 right-4 text-rose-550 hover:text-gray-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                <Heart size={16} className="fill-current text-rose-500" />
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-navy font-black text-2xl mx-auto mb-6 shadow-sm overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-lg font-black text-[#1a1a2e] uppercase italic mb-2 truncate group-hover:text-[#E8500A] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#E8500A] fill-current text-current" : "text-gray-150"} />
                  ))}
                  <span className="text-[10px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-3 bg-gray-50 border border-gray-150 hover:border-[#E8500A]/50 hover:bg-[#E8500A]/5 rounded-xl text-[9px] font-black text-navy uppercase tracking-widest transition-all text-center">
                Visit Brand Hub
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Heart size={64} className="mb-8 text-rose-500" />
          <p className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-widest italic leading-relaxed">No Loved Brands yet</p>
          <Link to="/brands" className="mt-8 px-10 py-3 bg-[#E8500A] text-white rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">Explore Brands</Link>
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
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Followed <span className="text-[#E8500A]">Partners</span> <span className="text-gray-400 text-2xl">({followedBrands.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">âš¡ Subscribed to receive updates and deals</p>
        </div>
      </div>

      {followedBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {followedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white border border-[#e8edf2] rounded-[5px] p-8 hover:border-[#E8500A]/30 transition-all text-center flex flex-col justify-between shadow-sm"
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
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-navy font-black text-2xl mx-auto mb-6 shadow-sm overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-lg font-black text-[#1a1a2e] uppercase italic mb-2 truncate group-hover:text-[#E8500A] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={10} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#E8500A] fill-current text-current" : "text-gray-150"} />
                  ))}
                  <span className="text-[10px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-3 bg-gray-50 border border-gray-150 hover:border-[#E8500A]/30 hover:bg-[#E8500A]/5 rounded-xl text-[9px] font-black text-navy uppercase tracking-widest transition-all text-center justify-between flex items-center px-4">
                <span>View Updates</span>
                <span className="bg-[#059669] text-[7px] text-white font-black px-1.5 py-0.5 rounded-full uppercase scale-90">Live</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Store size={64} className="mb-8 text-gray-300" />
          <p className="text-[11px] font-black text-[#1a1a2e ] uppercase tracking-widest italic leading-relaxed font-black mb-4">No Followed Brands yet</p>
          <Link to="/brands" className="mt-8 px-10 py-3 bg-[#E8500A] text-white rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">Explore and Follow Brands</Link>
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
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Recently <span className="text-[#E8500A]">Viewed</span> <span className="text-gray-400 text-2xl">({recentlyViewed.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">ðŸ•’ Products you recently browsed</p>
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
        <div className={PRODUCT_CARD_GRID}>
          {recentlyViewed.map((p) => (
            <div key={p.id} className="relative group">
              <ProductCard product={p} variant="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Clock size={64} className="mb-8 text-[#E8500A]" />
          <p className="text-[11px] font-black text-[#1a1a2e] uppercase tracking-widest italic leading-relaxed">No recently viewed products</p>
          <p className="text-[10px] font-bold text-gray-405 uppercase mt-2 italic">Product views will automatically populate this section.</p>
          <Link to="/products" className="mt-8 px-10 py-3 bg-[#E8500A] text-white font-black uppercase tracking-widest italic shadow-xl">Go To Directory</Link>
        </div>
      )}
    </div>
  );
};


// Legacy MessagesSection removed in favor of modern /messages page
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
    <div className="h-[600px] md:h-[700px] flex flex-col md:flex-row gap-px bg-gray-100 border border-[#e8edf2] rounded-[5px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700 shadow-sm">
      {/* Inbox List */}
      <div className={cn(
        "w-full md:w-[300px] lg:w-[350px] bg-white flex flex-col border-r border-[#e8edf2]",
        activeChat !== null && "hidden md:flex"
      )}>
         <div className="p-6 md:p-8 border-b border-white/5">
            <h2 className="text-lg md:text-xl font-black text-navy italic uppercase tracking-tighter mb-4">Inbox</h2>
            <div className="relative">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold text-navy placeholder:text-gray-400 focus:outline-none focus:border-[#E8500A]/30 transition-all" placeholder="Search chats..." />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto no-scrollbar">
            {[1, 2, 3].map(i => (
              <button 
                key={i} 
                onClick={() => setActiveChat(i)}
                className={cn("w-full p-6 flex gap-4 text-left border-b border-gray-100 transition-all hover:bg-gray-50 bg-transparent border-none cursor-pointer", i === 1 && "bg-gray-50/50 border-r-2 border-[#E8500A]")}
              >
                 <div className="relative">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} className="w-12 h-12 rounded-full object-cover" alt="" />
                    {i === 1 && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#059669] border-2 border-white rounded-full" />}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-xs font-black text-navy italic truncate">{i === 1 ? 'Farhan Rafiq (Admin)' : i === 2 ? 'Apex Official' : 'Dhanmondi Branch'}</span>
                       <span className="text-[8px] font-bold text-gray-400">10:30 AM</span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-1 italic font-bold">Absolutely! We can ship the S24 Ultra...</p>
                 </div>
              </button>
            ))}
         </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-gray-50/30",
        activeChat === null && "hidden md:flex"
      )}>
         <div className="p-4 md:p-6 border-b border-[#e8edf2] flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
               <button onClick={() => setActiveChat(null)} className="md:hidden w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] border-none cursor-pointer">
                  <ArrowLeft size={16} />
               </button>
               <img src="https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" alt="" />
               <div>
                  <h4 className="text-xs md:text-sm font-black text-navy italic uppercase tracking-widest leading-none">Farhan Rafiq</h4>
                  <span className="text-[8px] md:text-[9px] font-bold text-[#059669] uppercase italic font-black">Support Active</span>
               </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
               <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-50 border-none flex items-center justify-center text-gray-400 hover:text-navy transition-colors cursor-pointer"><Bell size={14} /></button>
               <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-50 border-none flex items-center justify-center text-gray-400 hover:text-navy transition-colors cursor-pointer"><MoreVertical size={14} /></button>
            </div>
         </div>

         <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 no-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex flex-col max-w-[90%] md:max-w-[80%]", m.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                 <div className={cn(
                   "px-5 py-3 md:px-6 md:py-4 rounded-[16px] md:rounded-[20px] mb-2 text-[11px] md:text-xs font-bold leading-relaxed",
                   m.sender === 'user' ? "bg-[#E8500A] text-white rounded-tr-none shadow-md shadow-[#E8500A]/10 italic" : "bg-white text-navy rounded-tl-none border border-gray-200"
                 )}>
                    {m.text}
                 </div>
                 <span className="text-[8px] font-black text-gray-400 uppercase italic px-2">{m.senderName || 'Farhan'} â€¢ {m.time}</span>
              </div>
            ))}
         </div>

         <div className="p-6 md:p-8 bg-white border-t border-[#e8edf2]">
            <div className="relative">
               <input 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 className="w-full h-12 md:h-14 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl pl-6 pr-14 md:pr-16 text-xs font-bold text-navy placeholder:text-gray-400 focus:outline-none focus:border-[#E8500A]/30 transition-all" 
                 placeholder="Type message..." 
               />
               <button 
                 onClick={handleSend}
                 className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#E8500A] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#E8500A]/10 border-none cursor-pointer"
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
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Notification <span className="text-[#E8500A]">Center</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Updates on your curated world</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-[10px] font-black text-[#E8500A] uppercase tracking-widest italic hover:underline border-none bg-transparent cursor-pointer"
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
                "p-8 bg-white border border-[#e8edf2] rounded-[5px] flex items-start gap-6 transition-all hover:bg-gray-50 relative overflow-hidden group shadow-sm",
                !n.read && "border-[#E8500A]/30 bg-[#E8500A]/5"
              )}
            >
              {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E8500A]" />}
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                n.type === 'price' ? "bg-[#059669]/10 text-[#059669]" : 
                n.type === 'reply' ? "bg-[#E8500A]/10 text-[#E8500A]" : 
                "bg-[#E8500A]/15 text-[#E8500A]"
              )}>
                {n.type === 'price' ? <TrendingUp size={24} /> : n.type === 'reply' ? <MessageSquare size={24} /> : <Bell size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-black text-navy uppercase italic tracking-tighter">{n.title}</h4>
                  <span className="text-[10px] font-black text-gray-500 uppercase">{n.time}</span>
                </div>
                <p className="text-gray-500 text-sm font-bold italic leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center text-center text-gray-400">
            <Bell size={64} className="mb-8" />
            <p className="text-[11px] font-black uppercase tracking-widest italic">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsSection = () => {
  const { currentUser, setCurrentUser } = useGlobalState();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  const handleSave = () => {
    setCurrentUser({ ...currentUser, name, email, phone, address });
    localStorage.setItem('choosify_user_profile', JSON.stringify({ name, email, phone, address }));
    toast.success('Profile settings updated successfully');
  };

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Profile <span className="text-[#E8500A]">Master</span></h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Configure your discovery experience</p>
          </div>
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer border-0 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 italic"
          >
            Save Changes
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
             <div className="flex flex-col items-center p-8 bg-white border border-[#e8edf2] rounded-[5px] relative overflow-hidden group shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-[#E8500A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-32 h-32 mb-6 cursor-pointer group/avatar">
                   <img src="https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png" className="w-full h-full rounded-full object-cover border-4 border-[#E8500A]/30 transition-all group-hover/avatar:border-navy" alt="Profile" />
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Plus className="text-white" size={32} />
                   </div>
                </div>
                <h4 className="text-xl font-black text-navy italic uppercase mb-1">{name}</h4>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Premium Curator â€¢ ID: 89BD-001</p>
              </div>

             <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] px-2 italic">Basic Intel</h3>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Full Display Name</label>
                      <input 
                        className="w-full h-12 bg-white border border-gray-200 rounded-lg px-6 text-[11px] font-bold text-[#1a1a2e] focus:outline-none focus:border-[#E8500A]/50 shadow-sm" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Email Address</label>
                      <input 
                        className="w-full h-12 bg-white border border-gray-200 rounded-lg px-6 text-[11px] font-bold text-[#1a1a2e] focus:outline-none focus:border-[#E8500A]/50 shadow-sm" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Phone Number</label>
                      <input 
                        className="w-full h-12 bg-white border border-gray-200 rounded-lg px-6 text-[11px] font-bold text-[#1a1a2e] focus:outline-none focus:border-[#E8500A]/50 shadow-sm" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Delivery Address</label>
                      <input 
                        className="w-full h-12 bg-white border border-gray-200 rounded-lg px-6 text-[11px] font-bold text-[#1a1a2e] focus:outline-none focus:border-[#E8500A]/50 shadow-sm" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Your address, Dhaka, Bangladesh"
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] px-2 italic">Notification Matrix</h3>
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-8 space-y-6 shadow-sm">
                   {[
                     { label: 'Sale Alerts', desc: 'When your saved product goes on flash sale', checked: true },
                     { label: 'Expert Tips', desc: 'Weekly curated guides for your categories', checked: true },
                     { label: 'Price Drops', desc: 'Whenever a brand lowers price beyond 20%', checked: false },
                     { label: 'Inbox Direct', desc: 'Direct messages from verified sellers', checked: true }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between gap-6 group">
                        <div className="flex-1">
                           <h5 className="text-[11px] font-black text-navy uppercase italic tracking-tighter mb-1">{item.label}</h5>
                           <p className="text-[9px] font-bold text-gray-500 italic uppercase">{item.desc}</p>
                        </div>
                        <button className={cn(
                          "w-12 h-6 rounded-full transition-all relative p-1",
                          item.checked ? "bg-[#059669]" : "bg-gray-200"
                        )}>
                           <div className={cn("w-4 h-4 rounded-full bg-white transition-all shadow-md", item.checked ? "translate-x-6" : "translate-x-0")} />
                        </button>
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] px-2 italic">Security Zone</h3>
                <button className="w-full py-4 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-navy uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-3 cursor-pointer shadow-sm">
                   <ShieldCheck size={16} className="text-[#E8500A]" /> Reset Multi-Factor Auth
                </button>
                <button className="w-full py-4 bg-red-50 border border-red-100 rounded-lg text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                   Deactivate Curator Account
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

const CmsStudiosSection = () => {
  const studioCards = [
    {
      id: 'website',
      title: 'Website Studio',
      description: 'Mirror the public homepage and platform-wide content surfaces for admin editing.',
      previewHref: '/',
      studioHref: '/dashboard/studio/website',
    },
    {
      id: 'product',
      title: 'Product Studio',
      description: 'Manage the same hero, specs, reviews, and buying-guide surfaces users see on product pages.',
      previewHref: '/products/1',
      studioHref: '/dashboard/studio/product/1',
    },
    {
      id: 'brand',
      title: 'Brand Studio',
      description: 'Keep brand storytelling, catalog blocks, and credibility modules aligned with the live page.',
      previewHref: '/brands/1',
      studioHref: '/dashboard/studio/brand/1',
    },
    {
      id: 'creator',
      title: 'Creator Studio',
      description: 'Reuse public creator-profile sections so creators and admins edit against the real layout.',
      previewHref: '/creators/creator-1',
      studioHref: '/dashboard/studio/creator/creator-1',
    },
    {
      id: 'event',
      title: 'Event Studio',
      description: 'Control event detail content, related products, and follow-up placements from one studio.',
      previewHref: '/whats-on',
      studioHref: '/dashboard/studio/event/aarong-eid-carnival-2026',
    },
  ] as const;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-left">
        <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">
          CMS <span className="text-[#E8500A]">Studios</span>
        </h2>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
          Public-page mirror map for admins, sellers, and creators
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {studioCards.map((studio) => {
          const sections = getStudioSections(studio.id as any);
          return (
            <div key={studio.id} className="bg-white border border-[#e8edf2] rounded-[8px] p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a9bb0]">
                    {sections.length} mapped sections
                  </div>
                  <h3 className="text-xl font-black text-navy italic uppercase tracking-tight mt-2">
                    {studio.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-gray-500 mt-2 leading-relaxed">
                    {studio.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                <Link
                  to={studio.studioHref}
                  className="px-4 py-2 rounded-[5px] bg-[#1A1D4E] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#E8500A] transition-colors"
                >
                  Edit in studio
                </Link>
                <Link
                  to={`${studio.previewHref}${studio.previewHref.includes('?') ? '&' : '?'}studioEdit=1`}
                  className="px-4 py-2 rounded-[5px] border border-[#e8edf2] text-[10px] font-black uppercase tracking-widest text-navy hover:border-[#E8500A]/30 hover:text-[#E8500A]"
                >
                  Preview live
                </Link>
                </div>
              </div>

              <div className="space-y-2">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-start justify-between gap-3 px-3 py-3 rounded-[5px] bg-[#F8FBFD] border border-[#e8edf2]"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-navy uppercase italic">
                        {section.label}
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                        Anchor: {section.anchorId}
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-[#E8500A] uppercase tracking-widest shrink-0">
                      {section.fields.length} fields
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



// --- MAIN PAGE ---

export function DashboardPage() {
  const { setIsLoggedIn } = useGlobalState();
  const { 
    savedProducts, 
    savedBrands, 
    savedGuides,
    lovedBrands, 
    followedBrands, 
    recentlyViewed,
    messages,
    reviews,
    setReviews,
    threads,
  } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // TODO: addToRecentlyViewed called from ProductDetailPage â€” see Prompt 6
  }, []);

  const REMOVED_TABS = new Set(['my-comparisons', 'admin-campaigns', 'admin-overviews', 'notifications']);

  useEffect(() => {
    if (location.state?.activeTab) {
      const tab = location.state.activeTab as string;
      setActiveTab(REMOVED_TABS.has(tab) ? 'overview' : tab);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === 'messages') {
      navigate('/messages');
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'notifications' || activeTab === 'notifications') {
      navigate(`/messages/${CHOOSIFY_ANNOUNCEMENTS_THREAD_ID}`, { replace: true });
    }
  }, [location.search, activeTab, navigate]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const menuItems: Array<{ id: string; label: string; icon: any; href?: string }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'cms-studios', label: 'CMS Studios', icon: Settings },
    { id: 'saved-products', label: `Saved Products (${savedProducts.length})`, icon: Heart },
    { id: 'saved-brands', label: `Saved Brands (${savedBrands.length})`, icon: Store },
    { id: 'loved-brands', label: `Loved Brands (${lovedBrands.length})`, icon: Heart },
    { id: 'followed-brands', label: `Followed Brands (${followedBrands.length})`, icon: CheckCircle2 },
    { id: 'recently-viewed', label: `Recently Viewed (${recentlyViewed.length})`, icon: Clock },
    { id: 'saved-recommendations', label: `Saved Guides (${savedGuides.length})`, icon: Bookmark },
    { id: 'messages', label: `Messages${threads.some(t => t.unread) ? ` (${threads.filter(t => t.unread).length} unread)` : ''}`, icon: MessageSquare, href: '/messages' },
    { id: 'seller-cashbook', label: 'Seller Cashbook', icon: TrendingUp, href: '/seller/cashbook' },
    { id: 'my-reviews', label: 'My Reviews', icon: Star },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const controlItems = menuItems.filter(item => 
    ['overview', 'cms-studios', 'saved-products', 'saved-brands', 'loved-brands', 'followed-brands', 'recently-viewed', 'saved-recommendations'].includes(item.id)
  );

  const accountItems = menuItems.filter(item => 
    ['messages', 'seller-cashbook', 'my-reviews', 'settings'].includes(item.id)
  );

  const renderContent = () => {
    switch (activeTab) {
      // Retail Tabs
      case 'overview': return <OverviewSection onTabChange={setActiveTab} />;
      case 'cms-studios': return <CmsStudiosSection />;
      case 'saved-products': return <SavedProductsSection />;
      case 'saved-brands': return <SavedBrandsSection />;
      case 'loved-brands': return <LovedBrandsSection />;
      case 'followed-brands': return <FollowedBrandsSection />;
      case 'recently-viewed': return <RecentlyViewedSection />;
      case 'saved-recommendations': return <SavedGuidesSection />;
      case 'messages': return (
        <div className="flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto h-[500px]">
          <div className="w-16 h-16 bg-[#F96500]/10 text-orange-primary rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={28} className="animate-pulse" />
          </div>
          <h3 className="text-md font-black uppercase text-gray-950 italic tracking-tight">Opening Workspace Chat</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed font-bold mb-6">
            Connecting you to your secure buyer/seller network in the unified messenger...
          </p>
          <Link 
            to="/messages" 
            className="px-6 py-3 bg-[#F96500] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#FF5B00] transition-all italic leading-none"
          >
            Go to Messenger
          </Link>
        </div>
      );
      case 'my-reviews': return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div>
               <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">My <span className="text-[#E8500A]">Reviews</span></h2>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Your community contributions and feedback</p>
            </div>
            <div className="space-y-6">
               {reviews && reviews.length > 0 ? (
                 reviews.map((r, idx) => {
                   const productImage = PRODUCTS.find(p => p.title === r.product)?.image || PLACEHOLDER_IMAGE;
                   return (
                     <div key={r.id || idx} className="bg-white border border-[#e8edf2] rounded-xl p-6 flex flex-col sm:flex-row gap-6 hover:border-[#E8500A]/20 transition-all shadow-sm">
                       <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center shrink-0">
                         <img src={productImage} alt={r.product} className="w-full h-full object-contain" onError={handleImageError} />
                       </div>
                       <div className="flex-grow text-left">
                         <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                           <h4 className="font-sans font-black text-navy text-sm uppercase italic tracking-tight">{r.product}</h4>
                           <span className="text-[10px] font-mono text-gray-400 font-extrabold uppercase">{r.date || r.createdAt || 'Just now'}</span>
                         </div>
                         <div className="flex items-center gap-1.5 mb-3">
                           {[1, 2, 3, 4, 5].map(s => (
                             <Star key={s} size={12} className={s <= Math.floor(r.rating || 5) ? "text-[#E8500A] fill-[#E8500A]" : "text-gray-250"} />
                           ))}
                           <span className="text-[10px] font-bold text-gray-400">({r.rating || '5'}.0)</span>
                         </div>
                         <p className="text-gray-600 text-xs font-medium italic leading-relaxed">{r.comment}</p>
                       </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="py-20 border border-dashed border-gray-200 rounded-[5px] flex flex-col items-center justify-center text-center bg-white shadow-sm w-full">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider italic">No review records found</p>
                 </div>
               )}
            </div>
        </div>
      );
      case 'settings': return <SettingsSection />;

      default: return <OverviewSection onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed text-[#1a1a2e]">
      {/* Mobile Top Header */}
      <div className="lg:hidden p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-50">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] border border-gray-200 cursor-pointer">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex w-[320px] flex-col border-r border-white/5 choosify-dark-gradient text-white h-screen sticky top-0 overflow-y-auto no-scrollbar">
          <div className="p-10 border-b border-white/5">
            <Link to="/" className="flex flex-col items-start group mb-8 text-white">
              <div className="flex gap-1 mb-1">
                <div className="w-4 h-4 rounded-full border-2 border-[#E8500A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#E8500A] rounded-full" />
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-[#E8500A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#E8500A] rounded-full" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight lowercase font-sans text-white">choosify.bd</span>
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
               <LogOut size={16} className="text-[#E8500A]" /> Curator Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full relative">


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
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">SECURE CURATOR TERMINAL â€¢ v2.6.0</p>
           </div>
        </main>
      </div>
    </div>
  );
}
