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
  Sparkles,
  Phone,
  Laptop,
  Headphones,
  Camera,
  Gamepad,
  Trophy
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
import { PublicReviewCard } from '../components/PublicReviewCard';
import toast from 'react-hot-toast';

// Hex Colors as per instruction
const COLORS = {
  navy: '#0A0A1F',
  orange: '#E8500A',
  green: '#059669',
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, badge, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between px-8 py-3 transition-all relative group border-none text-left bg-transparent cursor-pointer select-none",
      active ? "text-white font-bold" : "text-gray-400 hover:text-white"
    )}
  >
    {active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#E8500A] rounded-r-full" />
    )}
    <div className="flex items-center gap-3.5 relative z-10">
      <Icon size={16} className={cn(active ? "text-[#E8500A]" : "text-gray-450 group-hover:text-white transition-colors")} />
      <span className="text-[10px] uppercase tracking-[0.15em] font-black italic">{label}</span>
    </div>
    {badge && badge > 0 && (
      <span className="bg-[#E8500A] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full relative z-10">
        {badge}
      </span>
    )}
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

// High-fidelity Stats metric card
const MetricBox = ({ title, value, linkText, onClick, icon: Icon, iconColor, bgHover }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#E8500A]/20 transition-all cursor-pointer shadow-sm flex flex-col justify-between h-[135px] text-left group select-none",
      bgHover
    )}
  >
    <div className="flex items-center justify-between">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", iconColor)}>
        <Icon size={16} />
      </div>
      <span className="text-2xl font-black text-navy tracking-tight">{value}</span>
    </div>
    <div className="mt-4">
      <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-wider mb-1 line-clamp-1">{title}</h5>
      <span className="text-[8px] font-black text-[#E8500A] uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        {linkText} <span>→</span>
      </span>
    </div>
  </div>
);

// High-fidelity recently viewed card
const RecentlyViewedCard = ({ item }: { item: any }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[280px] w-full text-left group">
    <div className="h-32 w-full flex items-center justify-center p-2 bg-gray-50/50 rounded-xl relative overflow-hidden">
      <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="mt-4 flex-1 flex flex-col justify-between">
      <div>
        <h4 className="text-[11px] font-bold text-gray-800 tracking-tight leading-snug line-clamp-2 h-8">{item.title}</h4>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xs font-extrabold text-navy">BDT {item.price}</span>
          {item.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">BDT {item.originalPrice}</span>
          )}
        </div>
      </div>
      <div className="text-[10px] text-gray-400 font-medium mt-2 flex items-center gap-1 uppercase tracking-wide">
        <Clock size={10} className="text-gray-300" />
        {item.viewed}
      </div>
    </div>
  </div>
);

// Today's Recommendation headphone promo card
const RecommendationBox = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[280px] flex group w-full">
    <div className="w-[40%] bg-[#080713] flex items-center justify-center p-4 relative shrink-0">
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent" />
      <img 
        src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop" 
        alt="Sony WH-1000XM5" 
        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 z-10" 
      />
    </div>
    <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50">
      <div className="space-y-2 text-left">
        <span className="text-[9px] font-black text-[#E8500A] uppercase tracking-[0.2em] block">Recommended For You</span>
        <h4 className="text-xs font-black text-navy uppercase leading-tight tracking-tight line-clamp-3">Best Noise Cancelling Headphones in 2025</h4>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Top picks based on your recent views and interests.</p>
      </div>
      <button className="text-[10px] font-black text-[#E8500A] uppercase tracking-wider flex items-center gap-1.5 hover:translate-x-1 transition-transform border-none bg-transparent cursor-pointer text-left self-start p-0 font-sans">
        Discover Now <span className="text-sm font-bold">→</span>
      </button>
    </div>
  </div>
);

// Recommended Product with orange cart button
const RecommendedProductCard = ({ item }: { item: any }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[310px] w-full text-left relative group">
    <div className="h-32 w-full flex items-center justify-center p-2 bg-gray-50/50 rounded-xl relative overflow-hidden">
      <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="mt-4 flex-grow flex flex-col justify-between">
      <div className="space-y-1">
        <h4 className="text-[11px] font-bold text-gray-800 tracking-tight leading-snug line-clamp-2 h-8">{item.title}</h4>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-[#E8500A]">BDT {item.price}</span>
          {item.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">BDT {item.originalPrice}</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-bold text-gray-700">{item.rating}</span>
          <span className="text-[10px] text-gray-400">({item.reviews})</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-[#E8500A] text-white flex items-center justify-center hover:bg-[#CF4400] transition-colors border-none cursor-pointer shadow-md shadow-[#E8500A]/20">
          <ShoppingBag size={12} />
        </button>
      </div>
    </div>
  </div>
);

// Top categories section
const TopCategoriesList = () => {
  const categories = [
    { name: 'Smartphones', count: '128 Guides', icon: Phone },
    { name: 'Laptops', count: '96 Guides', icon: Laptop },
    { name: 'Audio', count: '76 Guides', icon: Headphones },
    { name: 'Cameras', count: '64 Guides', icon: Camera },
    { name: 'Gaming', count: '52 Guides', icon: Gamepad },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[310px] flex flex-col justify-between">
      <div className="space-y-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:text-[#E8500A] group-hover:bg-[#E8500A]/5 transition-colors">
                  <Icon size={14} />
                </div>
                <div className="text-left">
                  <h5 className="text-[11px] font-bold text-gray-800">{cat.name}</h5>
                  <p className="text-[9px] text-gray-400 font-medium">{cat.count}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          );
        })}
      </div>
      <button className="text-[9px] font-black text-[#E8500A] uppercase tracking-widest text-left hover:translate-x-1 transition-transform border-none bg-transparent cursor-pointer p-0 mt-2 self-start flex items-center gap-1 font-sans">
        Explore All Categories <span className="text-xs font-bold">→</span>
      </button>
    </div>
  );
};

// Recent orders visualizer
const RecentOrdersList = () => {
  const orders = [
    {
      id: '#O054321',
      title: 'Samsung Galaxy S24 Ultra',
      price: 'BDT 145,000',
      status: 'Delivered',
      date: 'May 12, 2025',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop'
    },
    {
      id: '#O054320',
      title: 'Sony WH-1000XM5',
      price: 'BDT 28,900',
      status: 'Shipped',
      date: 'May 10, 2025',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    {
      id: '#O054319',
      title: 'AirPods Pro (2nd Gen)',
      price: 'BDT 25,900',
      status: 'Delivered',
      date: 'May 08, 2025',
      image: 'https://images.unsplash.com/photo-1588449668338-d15176090c44?w=100&h=100&fit=crop'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[320px] flex flex-col justify-between">
      <div className="divide-y divide-gray-100 flex-1 flex flex-col justify-center">
        {orders.map((order, i) => (
          <div key={i} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 group hover:bg-gray-50/30 px-2 -mx-2 rounded-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                <img src={order.image} alt={order.title} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-bold text-[#E8500A]">{order.id}</span>
                  <span className="text-[10px] font-bold text-gray-800 truncate max-w-[150px] sm:max-w-xs">{order.title}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{order.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none",
                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
              )}>
                {order.status}
              </span>
              <span className="text-[10px] text-gray-400 font-medium min-w-[70px] text-right">{order.date}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="text-[9px] font-black text-[#E8500A] uppercase tracking-widest text-left hover:translate-x-1 transition-transform border-none bg-transparent cursor-pointer p-0 mt-3 self-start flex items-center gap-1 font-sans">
        View All Orders <span className="text-xs font-bold">→</span>
      </button>
    </div>
  );
};

// Activity counter with golden trophy and dynamic stats
const ActivitySummaryCard = () => {
  const metrics = [
    { title: '18', desc: 'Products Viewed', change: '↑ 12%', icon: Clock, circleColor: 'bg-blue-50 text-blue-500 border border-blue-100' },
    { title: '7', desc: 'Guides Read', change: '↑ 8%', icon: BookOpen, circleColor: 'bg-orange-50 text-[#E8500A] border border-orange-100' },
    { title: '3', desc: 'Reviews Written', change: '↑ 50%', icon: Star, circleColor: 'bg-orange-50 text-[#E8500A] border border-orange-100' },
    { title: '2', desc: 'Orders Placed', change: '↑ 100%', icon: ShoppingBag, circleColor: 'bg-blue-50 text-blue-500 border border-blue-100' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[320px] flex flex-col justify-between">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="flex flex-col items-start text-left p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", metric.circleColor)}>
                <Icon size={14} />
              </div>
              <span className="text-lg font-black text-navy leading-none mb-1">{metric.title}</span>
              <span className="text-[9px] text-gray-500 font-bold tracking-tight uppercase leading-snug line-clamp-2 h-6">{metric.desc}</span>
              <span className="text-[8px] font-black text-emerald-600 tracking-wider uppercase mt-1">{metric.change}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100/50 p-3.5 rounded-xl border border-gray-100">
        <div className="text-left">
          <p className="text-[10px] text-gray-600 font-bold leading-tight">Keep exploring, Farhan!</p>
          <p className="text-[9px] text-gray-400 font-medium mt-0.5 leading-snug">You're making smart choices.</p>
        </div>
        <div className="relative shrink-0 flex items-center justify-center">
          <Trophy size={28} className="text-amber-400 animate-bounce" />
          <div className="absolute -top-1 -right-1 bg-[#E8500A] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full">+24</div>
        </div>
      </div>
    </div>
  );
};

// Premium user badge and date info
const PremiumBadgeCard = () => (
  <div className="bg-gradient-to-r from-white to-gray-50/50 border border-gray-100 rounded-2xl p-4.5 shadow-sm flex items-center justify-between max-w-sm w-full gap-4 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8500A]/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500" />
    <div className="flex items-center gap-3.5 relative z-10">
      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
        <Trophy size={18} />
      </div>
      <div className="text-left">
        <h4 className="text-[11px] font-black text-navy uppercase tracking-wider mb-0.5">Premium Member</h4>
        <p className="text-[9px] text-gray-400 font-medium">Member since Dec 2024</p>
        <div className="mt-2 inline-flex items-center gap-1 bg-[#0c0d21] text-white text-[8px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
          <Star size={8} className="fill-amber-400 text-amber-400" /> Premium Active
        </div>
      </div>
    </div>
    
    <div className="relative z-10 w-12 h-12 flex items-center justify-center shrink-0">
      <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
        <Star size={20} className="text-[#E8500A] fill-[#E8500A]" />
      </div>
    </div>
  </div>
);

// --- SECTIONS ---

const OverviewSection = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
  const { savedProducts, savedBrands, lovedBrands, followedBrands, recentlyViewed } = useDashboard();

  // Mock static values from the reference image representation
  const recentlyViewedItems = [
    {
      id: 1,
      title: 'Samsung Galaxy S24 Ultra',
      price: '145,000',
      viewed: 'Viewed 2h ago',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Apex Premium Runner Elite X',
      price: '4,500',
      viewed: 'Viewed 5h ago',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Sony WH-1000XM5',
      price: '28,900',
      viewed: 'Viewed 1d ago',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'MacBook Air M3',
      price: '132,000',
      originalPrice: '138,000',
      viewed: 'Viewed 2d ago',
      image: 'https://images.unsplash.com/photo-1496181133227-f83bb023945d?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'iPhone 15 Pro Max',
      price: '167,500',
      originalPrice: '175,000',
      viewed: 'Viewed 3d ago',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop'
    }
  ];

  const recommendedItems = [
    {
      id: 1,
      title: 'OnePlus 12R 5G',
      price: '52,900',
      originalPrice: '145,000',
      rating: '4.6',
      reviews: '128',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Apple Watch Series 9',
      price: '48,500',
      rating: '4.7',
      reviews: '90',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'AirPods Pro (2nd Gen)',
      price: '25,900',
      rating: '4.8',
      reviews: '210',
      image: 'https://images.unsplash.com/photo-1588449668338-d15176090c44?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Dell XPS 13 Plus',
      price: '145,000',
      rating: '4.5',
      reviews: '84',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Canon EOS R50',
      price: '85,000',
      rating: '4.6',
      reviews: '67',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop'
    }
  ];
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Welcome & Premium Member header card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
        <div className="text-left">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-2">Welcome back,</span>
          <h2 className="text-4xl font-black text-navy uppercase italic tracking-tighter leading-none mb-3">
            Hi, <span className="text-[#E8500A]">Mr. Farhan!</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] italic">Bangladesh's Smartest Product Discovery Platform</p>
        </div>
        <PremiumBadgeCard />
      </div>

      {/* Metric counters with 7 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 font-sans">
        <MetricBox 
          title="Saved Products" 
          value={savedProducts.length || 5} 
          linkText="View all saved" 
          onClick={() => onTabChange && onTabChange('saved-products')}
          icon={Heart}
          iconColor="bg-rose-50 text-rose-500 border-rose-100"
        />
        <MetricBox 
          title="Saved Brands" 
          value={savedBrands.length || 3} 
          linkText="View all saved" 
          onClick={() => onTabChange && onTabChange('saved-brands')}
          icon={Store}
          iconColor="bg-blue-50 text-blue-500 border-blue-100"
        />
        <MetricBox 
          title="Loved Brands" 
          value={lovedBrands.length || 3} 
          linkText="View all loved" 
          onClick={() => onTabChange && onTabChange('loved-brands')}
          icon={Heart}
          iconColor="bg-rose-50 text-rose-500 border-rose-100"
        />
        <MetricBox 
          title="Following" 
          value={followedBrands.length || 5} 
          linkText="View all following" 
          onClick={() => onTabChange && onTabChange('followed-brands')}
          icon={CheckCircle2}
          iconColor="bg-indigo-50 text-indigo-500 border-indigo-100"
        />
        <MetricBox 
          title="Browsing History" 
          value={recentlyViewed.length || 7} 
          linkText="View all history" 
          onClick={() => onTabChange && onTabChange('recently-viewed')}
          icon={Clock}
          iconColor="bg-sky-50 text-sky-500 border-sky-100"
        />
        <MetricBox 
          title="Saved Spotlight" 
          value={2} 
          linkText="View all saved" 
          onClick={() => onTabChange && onTabChange('saved-recommendations')}
          icon={Bookmark}
          iconColor="bg-indigo-50 text-indigo-500 border-indigo-100"
        />
        <MetricBox 
          title="Orders" 
          value={4} 
          linkText="View all orders" 
          onClick={() => onTabChange && onTabChange('overview')}
          icon={ShoppingBag}
          iconColor="bg-violet-50 text-violet-500 border-violet-100"
        />
      </div>

      {/* Row 1: Recently viewed + Today's Recommendation split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-navy uppercase italic tracking-wider flex items-center gap-2">
              <span className="text-[#E8500A]">●</span> Recently Viewed
            </h3>
            <button 
              onClick={() => onTabChange && onTabChange('recently-viewed')}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E8500A] transition-colors border-none bg-transparent cursor-pointer flex items-center gap-1 font-sans"
            >
              View all history <span>→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recentlyViewedItems.map((item) => (
              <RecentlyViewedCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-black text-navy uppercase italic tracking-wider text-left">
            Today's Recommendation For You
          </h3>
          <RecommendationBox />
        </div>
      </div>

      {/* Row 2: Recommended For You + Top Categories List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        <div className="lg:col-span-9 space-y-4">
          <div className="text-left">
            <h3 className="text-sm font-black text-navy uppercase italic tracking-wider flex items-center gap-2">
              <span className="text-[#E8500A]">●</span> Recommended For You
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">Personalized recommendations based on your activity</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendedItems.map((item) => (
              <RecommendedProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="text-left">
            <h3 className="text-sm font-black text-navy uppercase italic tracking-wider">
              Top Categories For You
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">Explore what interests you most</p>
          </div>
          <TopCategoriesList />
        </div>
      </div>

      {/* Row 3: Recent Orders + Activity Summary with Trophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-navy uppercase italic tracking-wider flex items-center gap-2">
              <span className="text-[#E8500A]">●</span> Recent Orders
            </h3>
            <button 
              onClick={() => onTabChange && onTabChange('overview')}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E8500A] transition-colors border-none bg-transparent cursor-pointer flex items-center gap-1 font-sans"
            >
              View all orders <span>→</span>
            </button>
          </div>
          <RecentOrdersList />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="text-left">
            <h3 className="text-sm font-black text-navy uppercase italic tracking-wider">
              Activity Summary
            </h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">Your activity this month</p>
          </div>
          <ActivitySummaryCard />
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-8">
          {savedProducts.map((p) => (
            <div key={p.id} className="relative group shrink-0" style={{ width: '199.5px', height: '268.5px' }}>
              <button 
                onClick={() => {
                  addToCart(p, 1);
                  toast.success('Added to cart!');
                }}
                className="absolute top-4 right-14 z-30 w-8 h-8 rounded-full bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-[#E8500A]/20 hover:bg-[#E8500A] hover:text-white cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingBag size={14} />
              </button>
              <button 
                onClick={() => removeSavedProduct(p.id)}
                className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-500/20 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={14} />
              </button>
              <ProductCard product={p} variant="grid" isDashboard={true} />
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

const SavedBrandsSection = () => {
  const { savedBrands, removeSavedBrand } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Saved <span className="text-[#E8500A]">Brands</span> <span className="text-gray-450 text-2xl">({savedBrands.length})</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">☆ Bookmarked partners for later reference</p>
        </div>
      </div>

      {savedBrands.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-8">
          {savedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white border border-[#e8edf2] rounded-[5px] p-4.5 hover:border-[#E8500A]/30 transition-all text-center flex flex-col justify-between shadow-sm shrink-0"
              style={{
                boxSizing: 'border-box',
                width: '199.5px',
                height: '268.5px'
              }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedBrand(brand.id);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                <X size={14} />
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-navy font-black text-xl mx-auto mb-4 shadow-sm overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-sm font-black text-[#1a1a2e] uppercase italic mb-1.5 truncate group-hover:text-[#E8500A] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={8} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#E8500A] fill-current text-current" : "text-gray-150"} />
                  ))}
                  <span className="text-[8.5px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-2 bg-gray-50 border border-gray-150 hover:border-[#E8500A]/50 hover:bg-[#E8500A]/5 rounded-lg text-[8px] font-black text-navy uppercase tracking-widest transition-all text-center">
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
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">♥ Brands you reacted to with love</p>
        </div>
      </div>

      {lovedBrands.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-8">
          {lovedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white border border-[#e8edf2] rounded-[5px] p-4.5 hover:border-[#E8500A]/30 transition-all text-center flex flex-col justify-between shadow-sm shrink-0"
              style={{
                boxSizing: 'border-box',
                width: '199.5px',
                height: '268.5px'
              }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLoveBrand(brand);
                }}
                className="absolute top-3 right-3 text-rose-550 hover:text-gray-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                <Heart size={14} className="fill-current text-rose-500" />
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-navy font-black text-xl mx-auto mb-4 shadow-sm overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-sm font-black text-[#1a1a2e] uppercase italic mb-1.5 truncate group-hover:text-[#E8500A] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={8} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#E8500A] fill-current text-current" : "text-gray-150"} />
                  ))}
                  <span className="text-[8.5px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-2 bg-gray-50 border border-gray-150 hover:border-[#E8500A]/50 hover:bg-[#E8500A]/5 rounded-lg text-[8px] font-black text-navy uppercase tracking-widest transition-all text-center">
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
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">⚡ Subscribed to receive updates and deals</p>
        </div>
      </div>

      {followedBrands.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-8">
          {followedBrands.map((brand) => (
            <div 
              key={brand.id} 
              className="relative group bg-white border border-[#e8edf2] rounded-[5px] p-4.5 hover:border-[#E8500A]/30 transition-all text-center flex flex-col justify-between shadow-sm shrink-0"
              style={{
                boxSizing: 'border-box',
                width: '199.5px',
                height: '268.5px'
              }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowBrand(brand);
                }}
                className="absolute top-3 right-3 text-[#E8500A] hover:text-gray-400 transition-colors bg-transparent border-none cursor-pointer font-black text-[8px] tracking-wider uppercase"
              >
                Unfollow
              </button>
              
              <div className="cursor-pointer" onClick={() => navigate(`/brands/${brand.id || brand.name.toLowerCase()}`)}>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-navy font-black text-xl mx-auto mb-4 shadow-sm overflow-hidden">
                  {brand.logo && brand.logo.length > 2 ? (
                    <img src={brand.logo} className="w-full h-full object-contain" alt="" />
                  ) : (
                    brand.logo || brand.name[0]
                  )}
                </div>
                <h4 className="text-sm font-black text-[#1a1a2e] uppercase italic mb-1.5 truncate group-hover:text-[#E8500A] transition-colors">{brand.name}</h4>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={8} className={s <= Math.floor(brand.rating || 4.5) ? "font-black text-[#E8500A] fill-current text-current" : "text-gray-150"} />
                  ))}
                  <span className="text-[8.5px] font-bold text-gray-400">({brand.rating || '4.5'})</span>
                </div>
              </div>

              <Link to={`/brands/${brand.id || brand.name.toLowerCase()}`} className="w-full py-2 bg-gray-50 border border-gray-150 hover:border-[#E8500A]/30 hover:bg-[#E8500A]/5 rounded-lg text-[8px] font-black text-navy uppercase tracking-widest transition-all text-center justify-between flex items-center px-3">
                <span>Updates</span>
                <span className="bg-[#059669] text-[6px] text-white font-black px-1 py-0.5 rounded-full uppercase scale-90">Live</span>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-8">
          {recentlyViewed.map((p) => (
            <div key={p.id} className="relative group shrink-0" style={{ width: '199.5px', height: '268.5px' }}>
              <ProductCard product={p} variant="grid" isDashboard={true} />
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

const CompareToolSection = () => {
  const { comparedProducts, removeFromCompare } = useDashboard();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Compare <span className="text-[#059669]">Matrix</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Side-by-side analysis for smart decisions</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-8 py-3 bg-white border border-gray-200 text-navy rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2 cursor-pointer shadow-sm">
              <Send size={14} /> Share Link
           </button>
           <Link to="/compare" className="px-8 py-3 bg-[#E8500A] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#E8500A]/10 hover:scale-105 active:scale-95 transition-all animate-none">Full View</Link>
        </div>
      </div>

      <div className="bg-white border border-[#e8edf2] rounded-[5px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[200px_repeat(3,1fr)] divide-x divide-gray-150 border-b border-gray-150">
               <div className="p-8 flex flex-col justify-center bg-gray-50/50">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-2">Active Slots</span>
                  <h4 className="text-xl font-black text-navy italic uppercase leading-none">{comparedProducts.length}/4 Models</h4>
               </div>
               {[...comparedProducts, ...Array(4 - comparedProducts.length).fill(null)].slice(0, 3).map((p, i) => (
                 <div key={i} className="p-8 group relative min-h-[200px] flex flex-col items-center justify-center">
                   {p ? (
                     <>
                       <button 
                         onClick={() => removeFromCompare(p.id)}
                         className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-sans bg-transparent border-none cursor-pointer"
                       >
                         <X size={16} />
                       </button>
                       <img src={p.image} className="w-20 h-20 object-contain mb-6" alt="" />
                       <h5 className="text-[11px] font-black text-[#1a1a2e ] italic uppercase text-center line-clamp-1">{p.title}</h5>
                       <span className="text-[10px] font-bold text-[#E8500A] mt-1 italic">BDT {p.price}</span>
                     </>
                   ) : (
                     <button className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-500 transition-all bg-transparent cursor-pointer">
                        <Plus size={24} />
                     </button>
                   )}
                 </div>
               ))}
            </div>
            
            {/* Comparison Table (Simplified) */}
            <div className="divide-y divide-gray-150">
                {[
                  { label: 'Rating', values: comparedProducts.map(p => p.rating + '/5.0') },
                  { label: 'Market Value', values: comparedProducts.map(() => 'Premium') },
                  { label: 'In Stock', values: comparedProducts.map(() => 'Yes (Dhaka)'), color: 'text-[#059669]' },
                  { label: 'Expert Score', values: comparedProducts.map(() => '92/100'), color: 'text-[#E8500A]' }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-[200px_repeat(3,1fr)] divide-x divide-gray-150">
                     <div className="p-6 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase italic tracking-widest">{row.label}</div>
                     {row.values.map((val, vidx) => (
                       <div key={vidx} className={cn("p-6 text-center text-xs font-bold italic", row.color || "text-navy")}>{val}</div>
                     ))}
                     {/* Empty slot fillers */}
                     {Array(3 - row.values.length).fill(null).map((_, fidx) => (
                       <div key={`f-${fidx}`} className="p-6 text-center text-gray-300">-</div>
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
                 <span className="text-[8px] font-black text-gray-400 uppercase italic px-2">{m.senderName || 'Farhan'} • {m.time}</span>
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
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Premium Curator • ID: 89BD-001</p>
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

const AdminOverviewsSection = () => {
  const { customOverviews, addCustomOverview, deleteCustomOverview } = useDashboard();
  const [targetType, setTargetType] = useState<'brand' | 'product'>('product');
  const [targetId, setTargetId] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [bulletText, setBulletText] = useState('');

  // Set default targetId when targetType changes
  useEffect(() => {
    if (targetType === 'brand') {
      setTargetId(BRANDS[0]?.name.toLowerCase() || '');
    } else {
      setTargetId(String(PRODUCTS[0]?.id) || '');
    }
  }, [targetType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId || !sectionName || !bulletText) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Process textarea lines into non-empty bullet points
    const content = bulletText
      .split('\n')
      .map(line => line.trim().replace(/^•\s*/, ''))
      .filter(line => line.length > 0);

    if (content.length === 0) {
      toast.error('Please write at least one bullet point.');
      return;
    }

    addCustomOverview({
      targetType,
      targetId,
      sectionName: sectionName.trim(),
      content
    });

    // Reset form
    setSectionName('');
    setBulletText('');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 text-left">
      <div>
        <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">
          Overviews <span className="text-[#E8500A]">Manager</span>
        </h2>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
          Add dynamic overview sections to brands or products in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white border border-gray-150 rounded-[5px] p-6 shadow-sm">
          <h3 className="text-sm font-black text-navy uppercase tracking-wider mb-4 border-b border-gray-150 pb-2 flex items-center gap-2">
            <span className="text-[#E8500A]">✦</span> Create Section
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Type selector */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                Target Entity Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('product')}
                  className={`py-2 text-[10px] font-black uppercase tracking-wider border rounded cursor-pointer ${
                    targetType === 'product'
                      ? 'bg-navy text-white border-navy'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Product
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('brand')}
                  className={`py-2 text-[10px] font-black uppercase tracking-wider border rounded cursor-pointer ${
                    targetType === 'brand'
                      ? 'bg-navy text-white border-navy'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Brand
                </button>
              </div>
            </div>

            {/* Target selection dropdown */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                Select {targetType === 'product' ? 'Product' : 'Brand'}
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full text-[11px] font-bold border border-gray-200 rounded p-2.5 bg-gray-50 uppercase tracking-wide focus:outline-none focus:border-orange-primary"
              >
                {targetType === 'product'
                  ? PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} (ID: {p.id})
                      </option>
                    ))
                  : BRANDS.map(b => (
                      <option key={b.name} value={b.name.toLowerCase()}>
                        {b.name}
                      </option>
                    ))}
              </select>
            </div>

            {/* Section Name */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                Section Name (Dynamic Header)
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="e.g. Sustainability, Certifications"
                className="w-full text-[11px] font-bold border border-gray-200 rounded p-2.5 bg-gray-50 uppercase tracking-wide focus:outline-none focus:border-orange-primary"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                Content (One bullet point per line)
              </label>
              <textarea
                value={bulletText}
                onChange={(e) => setBulletText(e.target.value)}
                placeholder="• 100% Recycled titanium frame&#10;• Certified organic cotton weave&#10;• Zero plastic packaging used"
                rows={5}
                className="w-full text-[11px] font-bold border border-gray-200 rounded p-2.5 bg-gray-50 tracking-wide focus:outline-none focus:border-orange-primary leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E8500A] hover:bg-[#ff5d14] text-white py-3 rounded text-[11px] font-black uppercase tracking-widest cursor-pointer select-none shadow-md transition-colors"
            >
              Add Section
            </button>
          </form>
        </div>

        {/* Existing Sections Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-150 rounded-[5px] p-6 shadow-sm">
            <h3 className="text-sm font-black text-navy uppercase tracking-wider mb-4 border-b border-gray-150 pb-2 flex items-center gap-2">
              <span className="text-[#E8500A]">✦</span> Active Custom Sections ({customOverviews?.length || 0})
            </h3>

            {customOverviews?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded flex flex-col items-center justify-center gap-2">
                <p className="text-xs font-bold text-gray-450 uppercase tracking-wider italic">
                  No custom overview sections have been created yet.
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  Use the form to add a section for a brand or product.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
                {customOverviews?.map((co) => {
                  let targetName = co.targetId;
                  if (co.targetType === 'product') {
                    const prod = PRODUCTS.find(p => String(p.id) === String(co.targetId));
                    targetName = prod ? prod.title : `Product ID: ${co.targetId}`;
                  } else {
                    const brand = BRANDS.find(b => b.name.toLowerCase() === co.targetId.toLowerCase());
                    targetName = brand ? brand.name : co.targetId;
                  }

                  return (
                    <div
                      key={co.id}
                      className="border border-[#e8edf2] rounded-[5px] p-4.5 bg-white hover:shadow-soft transition-all flex justify-between items-start gap-4"
                    >
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            co.targetType === 'product'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}>
                            {co.targetType}
                          </span>
                          <span className="text-[10px] font-black uppercase text-navy italic tracking-wide truncate max-w-[200px] sm:max-w-[300px]">
                            {targetName}
                          </span>
                        </div>
                        <h4 className="font-space font-black text-xs uppercase text-[#1A1D4E] tracking-tight">
                          {co.sectionName}
                        </h4>
                        <div className="space-y-1 pl-2 border-l-2 border-orange-primary/20">
                          {co.content.map((bullet, idx) => (
                            <p key={idx} className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-wider">
                              • {bullet}
                            </p>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteCustomOverview(co.id)}
                        className="px-6 py-3 bg-white hover:bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer border border-red-200 hover:border-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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
                <div key={c.id} className="bg-white/5 border border-white/10 rounded-[5px] p-6 flex flex-col justify-between relative overflow-hidden group">
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

          <div className="bg-white/5 border border-white/10 rounded-[5px] p-8 space-y-6">
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
                className="px-6 py-3 bg-white hover:bg-gray-50 text-[#1A1A2E] text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer border border-[#e8edf2] hover:border-[#1A1D4E]/20"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer border-0 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 italic"
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
    campaigns,
    reviews,
    customOverviews
  } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === 'messages') {
      navigate('/messages');
    }
  }, [activeTab, navigate]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const menuItems: Array<{ id: string; label: string; icon: any; badge?: number; href?: string }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'saved-products', label: 'Saved Products', icon: Heart, badge: savedProducts.length || 5 },
    { id: 'saved-brands', label: 'Saved Brands', icon: Store, badge: savedBrands.length || 3 },
    { id: 'loved-brands', label: 'Loved Brands', icon: Heart, badge: lovedBrands.length || 3 },
    { id: 'followed-brands', label: 'Following', icon: CheckCircle2, badge: followedBrands.length || 5 },
    { id: 'recently-viewed', label: 'Browsing History', icon: Clock, badge: recentlyViewed.length || 7 },
    { id: 'saved-recommendations', label: 'Saved Spotlight', icon: Bookmark, badge: 2 },
    { id: 'my-comparisons', label: 'My Comparisons', icon: Layers, badge: comparedProducts.length || 0 },
    { id: 'admin-campaigns', label: 'Campaigns (Admin)', icon: Sparkles, badge: campaigns?.length || 0 },
    { id: 'admin-overviews', label: 'Overviews (Admin)', icon: Settings, badge: customOverviews?.length || 0 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messages.length || 3, href: '/messages' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || 0 },
    { id: 'my-reviews', label: 'My Reviews', icon: Star },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const controlItems = menuItems.filter(item => 
    ['overview', 'saved-products', 'saved-brands', 'loved-brands', 'followed-brands', 'recently-viewed', 'saved-recommendations', 'my-comparisons', 'admin-campaigns', 'admin-overviews'].includes(item.id)
  );

  const accountItems = menuItems.filter(item => 
    ['messages', 'notifications', 'my-reviews', 'settings'].includes(item.id)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection onTabChange={setActiveTab} />;
      case 'saved-products': return <SavedProductsSection />;
      case 'saved-brands': return <SavedBrandsSection />;
      case 'loved-brands': return <LovedBrandsSection />;
      case 'followed-brands': return <FollowedBrandsSection />;
      case 'recently-viewed': return <RecentlyViewedSection />;
      case 'admin-campaigns': return <AdminCampaignsSection />;
      case 'admin-overviews': return <AdminOverviewsSection />;
      case 'saved-recommendations': return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div>
              <h2 className="text-3xl font-black text-navy italic uppercase tracking-tighter mb-2">Saved <span className="text-[#E8500A]">Guides</span></h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Knowledge bookmarks for your next big buy</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-8">
               {BLOGS.slice(0, 4).map((guide, i) => (
                 <RecommendationCard key={guide.id} guide={guide} index={i} isDashboard={true} />
               ))}
            </div>
        </div>
      );
      case 'my-comparisons': return <CompareToolSection />;
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
      case 'notifications': return <NotificationsSection />;
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
    <div className="flex flex-col min-h-screen bg-[#F4F6F9] text-[#1a1a2e]">
      {/* Mobile Top Header */}
      <div className="lg:hidden p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-50">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] border border-gray-200 cursor-pointer">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex w-[290px] flex-col border-r border-white/5 bg-[#0C0B1B] text-white h-screen sticky top-0 overflow-y-auto no-scrollbar shrink-0">
          <div className="p-8 border-b border-white/5">
            <Link to="/" className="flex flex-col items-start group text-white select-none">
              <div className="flex gap-1.5 mb-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-[#E8500A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#E8500A] rounded-full animate-ping" />
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-[#E8500A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#E8500A] rounded-full" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white block">choosify.bd</span>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] block mt-1 italic">Dashboard v2.0</span>
            </Link>
          </div>

          <nav className="flex-1 py-6 overflow-y-auto no-scrollbar space-y-6">
            <div>
              <div className="px-8 text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 italic">Platform Control</div>
              {controlItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  badge={item.badge}
                  onClick={() => {
                    if (item.href) {
                      navigate(item.href);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                />
              ))}
            </div>
            
            <div>
              <div className="px-8 text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 italic">Communication & Account</div>
              {accountItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  badge={item.badge}
                  onClick={() => {
                    if (item.href) {
                      navigate(item.href);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                />
              ))}
            </div>

            {/* Promo Member card in sidebar */}
            <div className="mx-6 my-8 p-5 rounded-2xl bg-gradient-to-br from-[#12132D] to-[#0A0B1A] border border-white/5 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#E8500A]/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#E8500A] text-xs font-sans">🔥</span>
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Premium Member</span>
              </div>
              <p className="text-[9px] text-gray-400 font-medium leading-relaxed mb-4">
                Enjoy early access to handpicked deals, priority premium support, and exclusive rewards.
              </p>
              <button onClick={() => toast.success('Premium benefits are active!')} className="w-full py-2 bg-white/5 hover:bg-[#E8500A] border border-white/10 hover:border-transparent text-white rounded-xl text-[8.5px] font-black uppercase tracking-widest transition-colors cursor-pointer text-center font-sans">
                View Benefits
              </button>
            </div>
          </nav>

          <div className="p-8 border-t border-white/5 space-y-3">
            <Link to="/" className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-navy rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20">
               <ShoppingBag size={14} /> Browse Choosify.bd
            </Link>
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                navigate('/');
                toast.success('Successfully logged out.');
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:bg-white/10 transition-all cursor-pointer"
            >
               <LogOut size={14} className="text-[#E8500A]" /> Curator Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full relative overflow-x-hidden">
           <div className="p-8 md:p-12 lg:p-16 max-w-[1400px] mx-auto min-h-screen">
              <div className="animate-in fade-in transition-all duration-700">
                {renderContent()}
              </div>
           </div>
           
           {/* Footer Accent */}
           <div className="py-12 text-center opacity-25 hidden lg:block">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full border-2 border-navy flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-navy rounded-full" />
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
