import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, Search, ArrowRight, ShieldCheck, Star, Sparkles, 
  MapPin, Send, HelpCircle, ArrowUpRight, BarChart3, Users, 
  FileCheck2, Plus, SlidersHorizontal, CheckCircle, RefreshCw, Mail,
  Heart, Eye, Share2, Bookmark, Check, ChevronLeft, ChevronRight, Play, 
  PenTool, ImageOff, ShoppingBag, Shirt, Cpu, Baby, Gem, Palette, 
  Luggage, AlertCircle, DollarSign, Smartphone, Utensils, Home, Gamepad2
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useDashboard } from '../../context/DashboardContext';
import { BANGLADESH_DISTRICT_HUBS, B2B_SUPPLIERS, B2B_MANUFACTURERS } from './data/b2bData';
import { ProductCard } from '../../components/ProductCard';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export function B2BHomePage() {
  const navigate = useNavigate();
  const { allProducts, submitRfq, rfqs, addToCart, allBrands } = useGlobalState();
  const { savedProducts, setSavedProducts, addToCompare } = useDashboard();
  
  const [selectedHub, setSelectedHub] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [moqRange, setMoqRange] = useState<number>(300);
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('FEED');
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showAllFollowed, setShowAllFollowed] = useState(false);

  // RFQ quick form states
  const [rfqItem, setRfqItem] = useState('');
  const [rfqQty, setRfqQty] = useState(100);
  const [rfqCat, setRfqCat] = useState('Fashion & Lifestyle');
  const [rfqPrice, setRfqPrice] = useState(300);
  const [rfqNotes, setRfqNotes] = useState('');

  // Sourcing Guides / Recommendations Reactions States
  const [recommendationStates, setRecommendationStates] = useState({
    featured: { liked: false, likes: 3500, views: 12000, shares: 1450, bookmarked: false },
    card1: { liked: false, likes: 2100, views: 5800, shares: 480, bookmarked: false },
    card2: { liked: false, likes: 1400, views: 3200, shares: 250, bookmarked: false },
    card3: { liked: false, likes: 1950, views: 6400, shares: 610, bookmarked: false },
  });

  const handleRecLike = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      const nextLiked = !card.liked;
      return {
        ...prev,
        [cardId]: {
          ...card,
          liked: nextLiked,
          likes: nextLiked ? card.likes + 1 : card.likes - 1
        }
      };
    });
    toast.success(recommendationStates[cardId].liked ? "Removed love rating" : "Loved industrial guide!");
  };

  const handleRecBookmark = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      const nextBookmarked = !card.bookmarked;
      return {
        ...prev,
        [cardId]: {
          ...card,
          bookmarked: nextBookmarked
        }
      };
    });
    toast.success(recommendationStates[cardId].bookmarked ? "Removed from saved resources" : "Saved to industrial resources!");
  };

  const handleRecView = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      return {
        ...prev,
        [cardId]: { ...card, views: card.views + 1 }
      };
    });
    toast.success("Industrial resource booklet logged as viewed!");
  };

  const handleRecShare = (cardId: 'featured' | 'card1' | 'card2' | 'card3') => {
    setRecommendationStates(prev => {
      const card = prev[cardId];
      return {
        ...prev,
        [cardId]: { ...card, shares: card.shares + 1 }
      };
    });
    toast.success("Bulk procurement document link copied to clipboard!");
  };

  // Factory/Supplier Spotlight Reactions States
  const [spotlightStates, setSpotlightStates] = useState({
    liked: false,
    likes: 8400,
    views: 24700,
    shares: 1120
  });

  const handleSpotlightAction = (type: 'likes' | 'views' | 'shares') => {
    setSpotlightStates(prev => {
      if (type === 'likes') {
        const nextLiked = !prev.liked;
        return {
          ...prev,
          liked: nextLiked,
          likes: nextLiked ? prev.likes + 1 : prev.likes - 1
        };
      } else if (type === 'views') {
        return { ...prev, views: prev.views + 1 };
      } else {
        return { ...prev, shares: prev.shares + 1 };
      }
    });
    if (type === 'likes') {
      toast.success(spotlightStates.liked ? "Removed audit support" : "Logged factory audit and capacity support!");
    } else if (type === 'views') {
      toast.success("Supplier dossier marked as reviewed.");
    } else {
      toast.success("Supplier dossier shareable code copied.");
    }
  };

  // Spotlight Product reactions states for the 4 products inside Spotlight Brand
  const [spotlightProductStates, setSpotlightProductStates] = useState<Record<string, { likes: number, views: number, shares: number, liked: boolean }>>({
    'p1': { likes: 140, views: 820, shares: 45, liked: false },
    'p2': { likes: 95, views: 410, shares: 20, liked: false },
    'p3': { likes: 112, views: 630, shares: 38, liked: false },
    'p4': { likes: 160, views: 940, shares: 52, liked: false },
  });

  const handleSpotlightProductReact = (pId: string, type: 'likes' | 'views' | 'shares') => {
    setSpotlightProductStates(prev => {
      const current = prev[pId] || { likes: 100, views: 500, shares: 30, liked: false };
      if (type === 'likes') {
        const nextLiked = !current.liked;
        return {
          ...prev,
          [pId]: {
            ...current,
            liked: nextLiked,
            likes: nextLiked ? current.likes + 1 : current.likes - 1
          }
        };
      } else if (type === 'views') {
        return { ...prev, [pId]: { ...current, views: current.views + 1 } };
      } else {
        return { ...prev, [pId]: { ...current, shares: current.shares + 1 } };
      }
    });
    toast.success(type === 'likes' ? "Vouched for sample line!" : type === 'views' ? "Item specifications fetched!" : "Specs link copied!");
  };

  // Categories definitions adapted for wholesales & factory capabilities
  const categoryTabs = [
    { id: 'FEED', emoji: '🏢', label: 'B2B FEED' },
    { id: 'Fashion & Lifestyle', emoji: '🧵', label: 'RMG APPAREL' },
    { id: 'Electronics & Components', emoji: '🔌', label: 'COMPONENTS' },
    { id: 'Packaging Materials', emoji: '📦', label: 'PACKAGING & KRAFT' },
    { id: 'Leather & Footwear', emoji: '👞', label: 'LEATHER GOODS' },
  ];

  // Followed suppliers mock data - matching standard left sidebar checklist styles
  const initialSuppliersFollowed = [
    { name: 'Sailor Denim Mills', desc: 'Sustainable Weaves & Indigo', avatar: 'SD', bg: 'bg-[#081120]', supplierId: 'supp-1' },
    { name: 'Epyllion Garments', desc: 'Activewear Knits & Sourcing', avatar: 'EG', bg: 'bg-[#FF0038]', supplierId: 'supp-2' },
    { name: 'Apex Footwear Industrial', desc: 'Mass Leather Lot Exporter', avatar: 'AF', bg: 'bg-indigo-900', supplierId: 'supp-3' },
    { name: 'Dhaka Apparel Conglo', desc: 'BSCI-Certified Cotton Mills', avatar: 'DA', bg: 'bg-[#081120]', supplierId: 'mfg-1' },
    { name: 'Bengal Smart Packaging', desc: 'FSC Corrugated Heavy Outer', avatar: 'BS', bg: 'bg-emerald-950', supplierId: 'mfg-2' },
  ];

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please specify what factory classification you seek!');
      return;
    }
    toast.success(`Scouting verified factories for: "${searchQuery}"`);
    const el = document.getElementById('b2b-products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle RFQ Submit
  const handleQuickRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqItem.trim()) {
      toast.error('Please specify what item you want to source');
      return;
    }
    submitRfq({
      item: rfqItem,
      category: rfqCat,
      quantity: rfqQty,
      targetPrice: rfqPrice,
      notes: rfqNotes || `Required urgent bulk quote for ${rfqQty} units.`
    });
    setRfqItem('');
    setRfqNotes('');
    setIsRfqOpen(false);
    toast.success("RFQ broadcasted to all matching industrial mills!");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error("Please enter a valid business email");
      return;
    }
    setNewsletterEmail('');
    toast.success("Subscribed to daily B2B corporate trade dispatch!");
  };

  // Filter suppliers based on district
  const filteredSuppliersList = selectedHub 
    ? B2B_SUPPLIERS.filter(s => s.district.toLowerCase() === selectedHub.toLowerCase()) 
    : B2B_SUPPLIERS;

  // Filter products matching MOQs and search query
  const wholesaleProducts = allProducts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    // If we're filtering by a specific category tab
    const matchesTab = activeTab === 'FEED' || p.category === activeTab;
    const maxMoq = p.moq || 10;
    return matchesSearch && matchesTab && maxMoq <= moqRange;
  });

  return (
    <div className="min-h-screen bg-white text-[#081120] font-sans selection:bg-[#FF0038] selection:text-white pb-16" id="b2b-portal-home">
      
      {/* 1. INDUSTRIAL HERO SECTION - Premium Carmine Red-forward Industrial Gradient */}
      <section className="relative bg-gradient-to-br from-[#081120] via-[#0b1c33] to-[#FF0038] text-white overflow-hidden py-24 px-6 shadow-inner-lg">
        {/* Luminous dynamic background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,0,56,0.30)_0%,_transparent_55%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#081120]/10 to-transparent pointer-events-none" />
        
        {/* Subtle grid pattern helper */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10.5px] tracking-widest text-[#FF0038] font-extrabold uppercase mb-8 shadow-glow hover:border-white/25 transition-all duration-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-space font-black">Bangladesh's #1 Verified B2B Sourcing Gateway</span>
          </div>

          {/* Main Typography Header Section */}
          <h1 className="font-space font-black text-white text-5xl sm:text-6xl md:text-7xl leading-[1] tracking-tight uppercase mb-6 max-w-none">
            source <span className="text-[#FF0038] italic font-black">direct</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-medium mb-12 leading-relaxed opacity-95">
            Weary of raw material counterfeits and supplier trade fraud? Choosify.bd empowers your corporate sourcing with state-of-the-art escrow-protected factory networks in Bangladesh.
          </p>

          {/* Glassmorphic Search Container */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-[0_30px_60px_rgba(11,13,38,0.5)] focus-within:border-white/20 transition-all duration-300 mb-6 font-sans">
            <div className="flex items-center bg-white rounded-full">
              <div className="pl-6 text-[#FF0038] shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verified corporate factories, bulk RMG apparel & wholesale centers..." 
                className="w-full h-14 bg-transparent outline-none pl-4 pr-32 text-[#081120] text-sm sm:text-base font-semibold placeholder-slate-400 focus:outline-[#FF0038] focus:ring-0 border-none" 
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-8 rounded-full bg-gradient-to-r from-[#FF0038] to-[#D6002F] hover:from-[#D6002F] hover:to-[#FF0038] text-white text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                SOURCE NOW
              </button>
            </div>
          </form>

          {/* Quick Shortcuts / Suggested */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 font-semibold mb-12">
            <span className="font-mono text-gray-500 uppercase tracking-wider text-[10px]">Hot Targets:</span>
            {['Knitwear', 'RMG Polo', 'Denim Bulk', 'Smart Phones'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  toast.success(`Scouting verified factories for: "${term}"`);
                  const el = document.getElementById('b2b-products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full border border-white/5 hover:border-white/10 transition-all cursor-pointer text-[11px] font-bold"
              >
                #{term}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsRfqOpen(true)}
              className="px-3 py-1 bg-[#FF0038]/20 hover:bg-[#FF0038]/30 text-white rounded-full border border-[#FF0038]/40 hover:border-white/30 transition-all cursor-pointer text-[11px] font-black uppercase tracking-wider"
            >
              ⚡ Submit Custom RFQ
            </button>
          </div>

          {/* Majestic Metrics Deck */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl border-t border-white/10 pt-10">
            {[
              { label: 'Verified Factories', val: '1,200+', desc: 'Strict Onsite Audits' },
              { label: 'Sourcing Match', val: '15 SEC', desc: 'Direct Factory Directives' },
              { label: 'Wholesale Trade', val: '৳150 CR+', desc: 'Placed and Cleared' },
              { label: 'Escrow Protection', val: '100%', desc: 'Assurance Guarantee' },
            ].map((stat, sidx) => (
              <div key={sidx} className="flex flex-col items-center">
                <span className="font-space text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#FF0038] leading-none tracking-tight">
                  {stat.val}
                </span>
                <span className="font-space text-[10px] font-extrabold text-[#FF0038] uppercase tracking-widest mt-2">{stat.label}</span>
                <span className="text-[9px] text-gray-500 font-mono mt-0.5">{stat.desc}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. B2B MARQUEE BANNER */}
      <div className="relative z-20 bg-gradient-to-r from-[#FF0038] via-[#D6002F] to-[#FF0038] text-white py-4.5 overflow-hidden border-y border-[#FF0038]/20 shadow-lg font-space text-[11.5px] font-black tracking-[0.2em] uppercase leading-none">
        <div className="flex w-max animate-marquee whitespace-nowrap gap-16">
          <span>🏭 100% DIRECT FACTORY SOURCING • CERTIFIED ACTIVE PLANTS IN BANGLADESH • ESCROW ASSURED 🏭</span>
          <span>💎 AUTHENTIC BUSINESS DIRECTORY • SECURE TRADE CONTRACTS • WAREHOUSE LOGISTICS ENHANCED 💎</span>
          <span>🏭 100% DIRECT FACTORY SOURCING • CERTIFIED ACTIVE PLANTS IN BANGLADESH • ESCROW ASSURED 🏭</span>
        </div>
      </div>

      {/* 3. THREE COLUMN GRID SYSTEM - IDENTICAL STRUCTURAL PARITY TO RETAIL */}
      <main className="max-w-[1700px] mx-auto px-6 py-10 w-full grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 relative">
        
        {/* LEFT STICKY SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pl-[2px] pb-[400px] w-full flex-shrink-0">
          
          {/* Card 1 — SOURCING USER PROFILE */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="flex items-center gap-3.5 mb-5 PB-4 border-b border-gray-50">
              <div className="w-14 h-14 bg-[#081120] border-2 border-[#FF0038] rounded-full overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop" 
                  alt="Farhan Bin Rafiq" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-space font-black text-xs sm:text-sm text-[#081120] uppercase tracking-tight line-clamp-1 leading-none">
                  Farhan Bin Rafiq
                </h3>
                <span className="text-[8px] font-black tracking-widest text-[#FF0038] uppercase block mt-1">Sourcing Director</span>
                <span className="text-[7.5px] font-bold text-gray-400 font-mono block leading-none mt-1">LICKEY CO. Ltd</span>
              </div>
            </div>

            {/* Quick stats items */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-[#F7F8FA] border border-slate-100 rounded-[14px] p-3 text-center">
                <span className="text-[17px] font-black text-[#FF0038] font-mono leading-none block">
                  {rfqs.length}
                </span>
                <span className="text-[7.2px] font-black text-gray-400 uppercase tracking-widest mt-1.5 block">ACTIVE RFQS</span>
              </div>
              <div className="bg-[#F7F8FA] border border-slate-100 rounded-[14px] p-3 text-center">
                <span className="text-[17px] font-black text-[#081120] font-mono leading-none block">18</span>
                <span className="text-[7.2px] font-black text-gray-400 uppercase tracking-widest mt-1.5 block">SECURED ORDERS</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4.5">
              <button 
                onClick={() => { navigate('/b2b/orders'); }}
                className="w-full h-11 bg-[#F7F8FA] hover:bg-[#FF0038]/5 text-[#081120] hover:text-[#FF0038] border border-slate-100 text-[10px] font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all font-sans cursor-pointer group"
              >
                <span>My Active Orders</span>
                <span className="w-5 h-5 rounded-full bg-[#081120]/5 group-hover:bg-[#FF0038]/10 text-[#081120] group-hover:text-[#FF0038] flex items-center justify-center text-[9px] font-black font-mono">1</span>
              </button>
              
              <button 
                onClick={() => { setIsRfqOpen(true); }}
                className="w-full h-11 bg-[#F7F8FA] hover:bg-[#FF0038]/5 text-[#081120] hover:text-[#FF0038] border border-slate-100 text-[10px] font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 transition-all font-sans cursor-pointer group"
              >
                <span>Active RFQs</span>
                <span className="w-5 h-5 rounded-full bg-[#081120]/5 group-hover:bg-[#FF0038]/10 text-[#081120] group-hover:text-[#FF0038] flex items-center justify-center text-[9px] font-black font-mono">{rfqs.length}</span>
              </button>
            </div>
          </div>

          {/* Card 2 — QUICK SOURCING HIGHWAYS */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <h3 className="text-[8.5px] font-black tracking-widest text-slate-400 uppercase border-b border-gray-50 pb-3 mb-4.5 italic">
              SOURCING PORTALS
            </h3>
            
            <div className="flex flex-col gap-2">
              {[
                { name: 'Bulk Product Catalog', link: '#b2b-products-section', icon: <ShoppingBag className="w-4 h-4 text-emerald-500" /> },
                { name: 'Factory Directory', link: '/b2b/suppliers', icon: <Building2 className="w-4 h-4 text-[#FF0038]" /> },
                { name: 'RFQ Broadcast Hub', link: '/b2b/rfq', icon: <Send className="w-4 h-4 text-indigo-500" /> },
                { name: 'Spec Sourcing Guides', link: '#sourcing-guides-section', icon: <PenTool className="w-4 h-4 text-amber-500" /> },
                { name: 'Trade Escrow Protection', link: '#section-trust', icon: <ShieldCheck className="w-4 h-4 text-purple-500" /> }
              ].map((item, idx) => (
                <a 
                  key={idx}
                  href={item.link}
                  onClick={(e) => {
                    if (item.link.startsWith('#')) {
                      e.preventDefault();
                      const element = document.getElementById(item.link.substring(1));
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      e.preventDefault();
                      navigate(item.link);
                    }
                  }}
                  className="flex items-center gap-3 bg-[#F7F8FA] hover:bg-[#FF0038]/10 text-[#081120] hover:text-[#FF0038] p-3 rounded-xl transition-all font-sans text-xs font-black uppercase tracking-tight shadow-xs h-11 border border-slate-50"
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="flex-1 truncate">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Card 3 — SUPPLIERS YOU FOLLOW CHECKLIST */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3.5 mb-4 max-w-full">
              <h3 className="font-space font-black text-xs text-[#081120] uppercase tracking-wide">
                Suppliers <span className="text-[#FF0038]">Watchlist</span>
              </h3>
              <span className="text-[9.5px] font-black text-[#FF0038] font-mono leading-none">
                {initialSuppliersFollowed.length} UNITS
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {(showAllFollowed ? initialSuppliersFollowed : initialSuppliersFollowed.slice(0, 4)).map((sup, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(`/b2b/supplier/${sup.supplierId}`)}
                  className="flex gap-3 bg-[#F7F8FA] hover:bg-slate-50 p-2 rounded-xl transition-all duration-200 cursor-pointer text-left border border-slate-50/70"
                >
                  <div className={cn("w-10 h-10 select-none text-white rounded-lg flex items-center justify-center font-black text-xs italic shrink-0", sup.bg)}>
                    {sup.avatar}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                    <h4 className="font-space text-[10.5px] font-black uppercase text-[#081120] leading-tight truncate">
                      {sup.name}
                    </h4>
                    <p className="text-[9px] text-gray-400 font-semibold truncate leading-none mt-1">
                      {sup.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3.5 border-t border-gray-50">
              <button 
                onClick={() => setShowAllFollowed(!showAllFollowed)}
                className="w-full py-2 bg-[#F7F8FA] hover:bg-slate-100 text-gray-500 font-space font-black rounded-lg text-[8.5px] tracking-widest uppercase flex items-center justify-center gap-1 cursor-pointer transition-all border border-slate-100"
              >
                <span>{showAllFollowed ? 'Collapse Watchlist' : 'Show All Watchlist'}</span>
                <ChevronRight className={cn("w-3 h-3 transition-transform", showAllFollowed ? "rotate-90" : "")} />
              </button>
            </div>
          </div>

        </aside>

        {/* CENTER FEED SECTION - KEY INTERACTION CANVAS */}
        <section className="flex flex-col gap-8 w-full min-w-0" id="b2b-center-feed">
          
          {/* CATEGORIES / CAPABILITIES STICKY TAB BAR */}
          <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md py-4 border-b border-gray-100/80 -mx-6 px-6">
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar max-w-full">
              {categoryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      toast.success(`Broadcasting catalog results for: ${tab.label}`);
                    }}
                    className={cn(
                      "flex items-center gap-2 shrink-0 px-5 py-3 rounded-full text-[10px] sm:text-[10.5px] font-black uppercase tracking-widest italic transition-all duration-200 cursor-pointer hover:scale-105 transform",
                      isActive 
                        ? "bg-[#FF0038] text-white shadow-md shadow-[#FF0038]/20 border border-[#FF0038]" 
                        : "bg-white border border-slate-200 text-[#081120] hover:border-slate-350"
                    )}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'FEED' ? (
            <>
              {/* FEED SECTION A — INDUSTRIES & MANUFACTURERS CAROUSEL */}
              <div id="section-supplier-carousel" className="bg-white rounded-3xl border border-gray-100/90 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)] text-left">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#081120]">FEATURED</span>
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#FF0038] italic">SUPPLIERS</span>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold pl-3 border-l-2 border-[#FF0038] leading-tight">
                      BSCI field-audited fabrication plants and export manufacturers in Bangladesh.
                    </p>
                  </div>

                  {/* Carousel Controllers */}
                  <div className="flex items-center gap-2">
                    <Link to="/b2b/suppliers" className="text-[10px] font-black text-[#FF0038] hover:text-[#D6002F] uppercase tracking-widest shrink-0 flex items-center gap-1 border border-[#FF0038]/20 bg-[#FF0038]/5 px-4.5 py-2.5 rounded-full">
                      EXPLORE DIRECTORY <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <div className="flex items-center gap-1 pl-2">
                      <button 
                        onClick={() => { setCarouselIndex(prev => prev === 0 ? 2 : prev - 1); }}
                        className="w-10 h-10 rounded-full border border-gray-150 flex items-center justify-center text-[#081120] hover:bg-slate-50 transition-colors shadow-xs active:scale-[0.9] cursor-pointer"
                        title="Prev"
                      >
                         <ChevronLeft size={16} />
                      </button>
                      <button 
                        onClick={() => { setCarouselIndex(prev => prev === 2 ? 0 : prev + 1); }}
                        className="w-10 h-10 rounded-full border border-gray-150 flex items-center justify-center text-[#081120] hover:bg-slate-50 transition-colors shadow-xs active:scale-[0.9] cursor-pointer"
                        title="Next"
                      >
                         <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Carousel Container Slider */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {B2B_SUPPLIERS.concat(B2B_SUPPLIERS).slice(carouselIndex, carouselIndex + 3).map((sup, idx) => (
                    <div 
                      key={idx}
                      onClick={() => navigate(`/b2b/supplier/${sup.slug}`)}
                      className="bg-[#F7F8FA] border border-slate-200/80 hover:border-[#FF0038]/20 rounded-[28px] overflow-hidden p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
                    >
                      <div>
                        {/* Flag and Verification Badge */}
                        <div className="flex items-start justify-between">
                          <div className={cn("w-11 h-11 text-white rounded-xl flex items-center justify-center font-black text-sm italic shadow-xs", idx % 2 === 0 ? "bg-[#081120]" : "bg-indigo-900")}>
                            {sup.logo}
                          </div>
                          <span className="bg-white/95 border border-[#FF0038]/30 inline-flex items-center gap-1 px-3 py-1 bg-white text-[#081120] text-[8.5px] font-black uppercase tracking-wider rounded-full shadow-xs italic font-sans shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF0038]" /> Verified Supplier
                          </span>
                        </div>

                        {/* Title & Specialties */}
                        <div className="mt-5 text-left">
                          <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#FF0038]">{sup.type}</span>
                          <h4 className="font-space font-black text-base uppercase text-[#081120] group-hover:text-[#FF0038] mt-1 transition-colors leading-tight truncate">
                            {sup.name}
                          </h4>
                          <p className="text-[10.5px] text-gray-500 font-semibold leading-relaxed line-clamp-2 mt-2">
                            {sup.about}
                          </p>
                        </div>
                      </div>

                      {/* Small visual metadata tags */}
                      <div className="grid grid-cols-2 gap-3.5 mt-6 pt-5 border-t border-slate-200">
                        <div className="text-left">
                          <span className="text-[8px] font-bold text-gray-400 uppercase font-mono tracking-widest block leading-none">Min Order</span>
                          <span className="text-[11.5px] font-black text-[#081120] mt-1 block leading-none font-mono">৳{sup.minimumOrderValue.toLocaleString()}</span>
                        </div>
                        <div className="text-left border-l border-slate-200 pl-3.5">
                          <span className="text-[8px] font-bold text-gray-400 uppercase font-mono tracking-widest block leading-none">Capacity</span>
                          <span className="text-[11.5px] font-black text-[#FF0038] mt-1 block leading-none font-mono truncate">{sup.productionCapacity.split(' ')[0]} Units</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* FEED SECTION B — POPULAR WHOLESALE PRODUCTS */}
              <div id="section-popular-products" className="bg-white rounded-3xl border border-gray-100/90 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)] text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#081120]">Popular</span>
                      <span className="font-space text-xl sm:text-2xl font-black uppercase tracking-tight text-[#FF0038] italic">Wholesale items</span>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold pl-3 border-l-2 border-[#FF0038] leading-tight">
                      Primary verified bulk deals and certified lots ready for immediate freight dispatch.
                    </p>
                  </div>
                  <Link to="/products" className="text-[10px] font-black text-white hover:text-white uppercase tracking-widest shrink-0 flex items-center gap-1.5 leading-none bg-[#FF0038] hover:bg-[#D6002F] px-4.5 py-2.5 rounded-full shadow-md">
                    VIEW PRODUCTS CATALOG <Search className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Popular Product list in visual cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {wholesaleProducts.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
                  ))}
                </div>
              </div>

              {/* FEED SECTION C — SPOTLIGHT FACTORY (Sponsored) */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 mt-4 text-left gap-3">
                <div className="text-left">
                  <h2 className="font-space text-3xl font-black italic tracking-tight uppercase leading-none">
                    <span className="text-[#FF0038]">SPOTLIGHT</span> <span className="text-[#081120]">FACTORY</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="shrink-0 w-1 h-[14px] bg-[#FF0038] rounded-full inline-block" />
                    <p className="text-[11px] text-[#081120] font-bold tracking-wide leading-none uppercase">
                      BSCI field audits conducted. Direct-to-mill contracts & raw cargo tracking.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0">
                  <span className="border border-[#FF0038]/40 text-[#FF0038] text-[9.5px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full leading-none font-mono">
                    VERIFIED PARTNER
                  </span>
                </div>
              </div>

              <div id="section-spotlight-brand" className="relative overflow-hidden rounded-[20px] bg-[#081120] text-white p-6 md:p-8 shadow-2xl leading-relaxed mb-4">
                {/* Spotlight Main Header */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-7 items-center pb-6 border-b border-white/10 relative z-10">
                  
                  {/* Left Logo */}
                  <div className="flex flex-col items-center gap-2.5 shrink-0">
                    <div className="w-[115px] h-[115px] bg-slate-900 border border-[#FF0038]/30 rounded-xl flex flex-col items-center justify-center p-3 relative group transition-transform duration-300 hover:scale-[1.03] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#FF0038] text-white rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                        <Check className="w-3.5 h-3.5 font-black stroke-[3]" />
                      </span>
                      <div className="text-center font-space font-black text-white text-2xl uppercase leading-none italic tracking-tighter">
                        sailor
                        <div className="text-[7.5px] font-sans tracking-[0.25em] mt-1.5 uppercase font-medium text-[#FF0038]">DENIM MILLS</div>
                      </div>
                    </div>
                    <Link to="/b2b/supplier/sailor-denim-mills" className="text-[10px] font-bold text-white/95 hover:text-[#FF0038] tracking-wider uppercase underline transition-colors">
                      VIEW AUDIT DIRECTORY
                    </Link>
                  </div>

                  {/* Middle factory descriptive block */}
                  <div className="flex flex-col gap-2.5 text-left md:pl-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-space font-black text-4xl text-white uppercase italic tracking-tight leading-none">
                        Sailor Denim
                      </h3>
                      <span className="bg-[#FF0038] text-white text-[9.5px] font-black px-3 py-1 rounded-full uppercase tracking-wider leading-none font-mono">
                        BSCI FACTORY
                      </span>
                    </div>
                    <div>
                      <p className="text-[10.5px] text-gray-300 font-extrabold uppercase tracking-widest leading-none font-sans">
                        PRIMARY WEAVES & TEXTILE FABRICATORS
                      </p>
                      <div className="h-[1px] bg-white/20 w-36 mt-1.5" />
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-1">
                      <span className="text-[11px] text-white font-extrabold flex items-center gap-2 tracking-wide uppercase font-mono">
                        <span className="text-[#FF0038] text-sm">🏭</span> Gazipur Industrial Bypass Road, Bangladesh
                      </span>
                      <span className="text-[11px] text-white font-extrabold flex items-center gap-2 tracking-wide uppercase font-mono">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[18px] h-[18px] text-emerald-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        Oeko-Tex Standard 100 Certified
                      </span>
                    </div>
                  </div>

                  {/* Right Stats Block */}
                  <div className="grid grid-cols-3 gap-5 md:gap-7 bg-white/5 border border-white/10 rounded-2xl p-4.5 mt-2 md:mt-0">
                    <div className="flex flex-col text-left">
                      <span className="text-[#FF0038] text-[10.5px] font-black tracking-widest uppercase font-mono leading-none">CAPACITY</span>
                      <span className="text-white text-[11.5px] font-black uppercase tracking-wider mt-1.5 leading-none">850K Yds/Mo</span>
                    </div>
                    <div className="flex flex-col text-left border-l border-white/10 pl-5">
                      <span className="text-[#FF0038] text-[10.5px] font-black tracking-widest uppercase font-mono leading-none">MIN VAL</span>
                      <span className="text-white text-[11.5px] font-black uppercase tracking-wider mt-1.5 leading-none font-sans">BDT 1.5L</span>
                    </div>
                    <div className="flex flex-col text-[#FF0038] text-left border-l border-white/10 pl-5">
                      <span className="text-[#FF0038] text-[10.5px] font-black tracking-widest uppercase font-mono leading-none">EXPORT</span>
                      <span className="text-white text-[11.5px] font-black uppercase tracking-wider mt-1.5 leading-none font-sans">EU / JAPAN</span>
                    </div>
                  </div>

                </div>

                {/* Sub-list of 4 spotlight products in compact mockup cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 pt-6 relative z-10 text-[#081120]">
                  {allProducts.slice(0, 4).map((product, idx) => {
                    const mockImages = [
                      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1565084888279-aca607ecad0c?w=400&h=400&fit=crop",
                      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=400&h=400&fit=crop"
                    ];
                    const pKey = `p${idx + 1}`;
                    const pState = spotlightProductStates[pKey] || { likes: 100, views: 500, shares: 30, liked: false };
                    
                    return (
                      <div 
                        key={product.id || idx}
                        onClick={() => {
                          handleSpotlightProductReact(pKey, 'views');
                          navigate(`/products/${product.id}`);
                        }}
                        className="bg-white border border-gray-100 hover:border-[#FF0038]/30 rounded-2xl p-4 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col gap-3 group"
                      >
                        <div className="w-full aspect-square bg-[#ECEFF1] rounded-xl overflow-hidden relative border border-gray-100 shrink-0">
                          <img 
                            src={mockImages[idx]} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            alt={product.title} 
                          />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <span className="text-[7px] font-mono font-black text-[#FF0038] uppercase tracking-wide text-left leading-none">MOQ: 100 PCS</span>
                          <h5 className="font-sans font-extrabold text-[#081120] text-[11px] leading-tight text-left line-clamp-2 uppercase">
                            {product.title}
                          </h5>
                          
                          {/* Mini Reaction Toolbar */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto select-none">
                            <div className="flex items-center gap-2.5 text-[9px] font-mono font-bold text-gray-450">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'likes');
                                }}
                                className={cn(
                                  "flex items-center gap-0.5 transition-colors",
                                  pState.liked ? "text-rose-500 font-black" : "hover:text-rose-500"
                                )}
                              >
                                <Heart className={cn("w-3.5 h-3.5", pState.liked ? "fill-current text-rose-500" : "")} />
                                <span>{pState.likes}</span>
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'views');
                                }}
                                className="flex items-center gap-0.5 hover:text-[#FF0038]"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{pState.views}</span>
                              </button>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpotlightProductReact(pKey, 'shares');
                                }}
                                className="flex items-center gap-0.5 hover:text-[#FF0038]"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>{pState.shares}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Reactions Toolbar & Browse Brand Link */}
                <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-6 pb-2">
                  <div className="flex items-center gap-6 text-[11px] font-black text-gray-300 uppercase font-mono select-none">
                    
                    {/* Main Container React Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('likes'); }}
                      className={cn(
                        "flex items-center gap-1.5 transition-all text-[11px] cursor-pointer transform active:scale-95",
                        spotlightStates.liked ? "text-[#FF0038] font-black" : "hover:text-[#FF0138]/60 text-gray-300"
                      )}
                    >
                      <Heart className={cn("w-4.5 h-4.5", spotlightStates.liked ? "fill-current text-[#FF0038] scale-110" : "")} />
                      <span>{spotlightStates.likes} VOUCHES</span>
                    </button>

                    {/* Main Container Viewed Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('views'); }}
                      className="flex items-center gap-1.5 hover:text-[#FF0038] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4.5 h-4.5" />
                      <span>{(spotlightStates.views / 1000).toFixed(1)}k CLICKS</span>
                    </button>

                    {/* Main Container Share Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSpotlightAction('shares'); }}
                      className="flex items-center gap-1.5 hover:text-[#FF0038] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4.5 h-4.5" />
                      <span>{spotlightStates.shares} COPIES</span>
                    </button>
                  </div>

                  <Link 
                    to="/b2b/supplier/sailor-denim-mills" 
                    className="text-[11.5px] font-black text-white hover:text-[#FF0038] uppercase tracking-wider italic flex items-center gap-1 transition-colors font-sans"
                  >
                    DISCOVERY MILL PROFILE
                  </Link>
                </div>
              </div>

              {/* FEED SECTION E — SOURCING RESEARCH & INDUSTRIAL GUIDES */}
              <div id="sourcing-guides-section" className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-10 shadow-[0_15px_40px_rgba(26,29,78,0.02)] text-left">
                
                {/* Section Header */}
                <div className="text-center mb-10 flex flex-col items-center">
                  <h2 className="font-space text-3xl font-black italic tracking-tight text-center uppercase leading-none">
                    <span className="text-[#081120]">SOURCING</span> <span className="text-[#FF0038]">GUIDES & STATS</span>
                  </h2>
                  <div className="flex items-center gap-2.5 mt-2.5 justify-center max-w-[620px]">
                    <span className="shrink-0 w-1 h-5 bg-[#FF0038] rounded-full inline-block" />
                    <p className="text-xs text-[#081120] font-bold tracking-wide text-left uppercase">
                      Industrial white papers to navigate export regulations, fabric density weights, and customs.
                    </p>
                  </div>
                </div>

                {/* Main Sourcing Guide banner blog layout */}
                <div className="border border-gray-100 rounded-[28px] overflow-hidden shadow-md hover:shadow-xl hover:border-gray-200/80 transition-all duration-300 mb-9 bg-white flex flex-col group">
                  <div 
                    onClick={() => {
                      handleRecView('featured');
                      navigate(`/guides/b2b-apparel-export-2026`);
                    }}
                    className="aspect-[1.9/1] w-full bg-[#081120] relative overflow-hidden cursor-pointer"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=1200&h=675&fit=crop" 
                      className="w-full h-full object-cover opacity-85 group-hover:scale-[1.03] transition-transform duration-700" 
                      alt="Featured recommendation" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />
                    
                    {/* Top-Left Featured Badge */}
                    <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF0038] text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg shadow-md font-mono">
                      ★ BANGLADESH denim audit 2026
                    </span>

                    {/* Top-Right YT Badge */}
                    <div className="absolute top-5 right-5 flex flex-col items-center">
                      <div className="w-9 h-9 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#FF0038] transition-colors shadow-md">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507A3.003 3.003 0 0 0 .503 6.163C0 8.044 0 12 0 12s0 3.956.503 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.956 24 12 24 12s0-3.956-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <span className="text-[8px] font-bold text-white tracking-widest uppercase mt-1 drop-shadow-sm font-mono leading-none">Video tour</span>
                    </div>

                    {/* Large Circular Play Button Center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 bg-[#FF0038] hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                        <Play className="w-7 h-7 fill-current ml-1 text-white" />
                      </div>
                    </div>

                    {/* Lower Info overlay */}
                    <div className="absolute bottom-5 left-5 pr-24 text-left pointer-events-none">
                      <h3 className="font-space font-black text-white text-xl uppercase tracking-tight leading-tight mb-2 pr-12">
                        HOW TO ENGAGE DENIM FACTORIES DIRECT
                      </h3>
                      <p className="text-[10px] text-white/80 font-semibold line-clamp-1 italic max-w-2xl">
                        A full virtual machinery validation tour across major state-of-the-art Gazipur mills.
                      </p>
                    </div>

                    {/* Length badge */}
                    <span className="absolute bottom-5 right-5 bg-black/75 backdrop-blur-md text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded-md border border-white/10 shadow-lg">
                      12:45
                    </span>
                  </div>

                  {/* Body description */}
                  <div className="p-6 md:p-8 text-left bg-white">
                    <h4 
                      onClick={() => {
                        handleRecView('featured');
                        navigate(`/guides/b2b-apparel-export-2026`);
                      }}
                      className="font-space font-black text-xl lg:text-2xl uppercase text-[#081120] leading-snug hover:text-[#FF0038] transition-colors cursor-pointer mb-2"
                    >
                      BANGLADESH EXPORT APPAREL ROADMAP 2026
                    </h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed mb-6 font-semibold max-w-4xl">
                      Complete trade audit blueprint. Contains direct instructions on inspecting fabric GSM densities, checking BSCI security certs, and executing irrevocable L/C trade contracts.
                    </p>

                    {/* Interactive Toolbar */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                      <div className="flex items-center gap-6 text-[10.5px] font-black text-gray-400 uppercase font-mono select-none">
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('featured'); }}
                          className={cn(
                            "flex items-center gap-1.5 transition-all duration-250 cursor-pointer transform active:scale-90 hover:scale-[1.05]",
                            recommendationStates.featured.liked ? "text-[#FF0038] font-black" : "hover:text-[#FF0038] text-gray-500"
                          )}
                        >
                          <Heart className={cn("w-4.5 h-4.5", recommendationStates.featured.liked ? "fill-current text-[#FF0038] scale-110" : "")} /> 
                          <span>{recommendationStates.featured.likes}</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('featured'); }}
                          className="flex items-center gap-1.5 hover:text-[#FF0038] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4.5 h-4.5" /> 
                          <span>{(recommendationStates.featured.views / 1000).toFixed(1)}k</span>
                        </button>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecShare('featured'); }}
                          className="flex items-center gap-1.5 hover:text-[#FF0038] text-gray-500 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4.5 h-4.5" /> 
                          <span>{recommendationStates.featured.shares}</span>
                        </button>
                      </div>

                      {/* Bookmark Trigger */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('featured'); }}
                        className={cn(
                          "w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center transition-all bg-white hover:shadow-md transform active:scale-95 cursor-pointer",
                          recommendationStates.featured.bookmarked ? "border-[#FF0038]/30 bg-[#FF0038]/5" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn(
                          "w-5 h-5 stroke-[2] transition-colors duration-200", 
                          recommendationStates.featured.bookmarked ? "fill-[#FF0038] text-[#FF0038]" : "text-slate-400"
                        )} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub Guides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5 mb-10">
                  
                  {/* CARD 1: Video Reel Guideline */}
                  <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left">
                    <div 
                      onClick={() => handleRecView('card1')}
                      className="relative h-[240px] bg-[#081120] overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&h=1000&fit=crop" 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                        alt="Reel 1 Factory" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                      
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 bg-[#FF0038] text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                        FACTORY TOUR REEL
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 bg-[#FF0038] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 pr-12 text-left pointer-events-none">
                        <h4 className="font-space font-black text-white text-xs uppercase tracking-tight leading-tight mb-1">
                          APEX RAW LEATHER AUDITS
                        </h4>
                        <p className="text-[9px] text-white/80 font-medium line-clamp-1 italic">
                          Inside the largest leather processing yard in Chittagong region.
                        </p>
                      </div>

                      <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-[8px] font-mono font-black px-2 py-0.5 rounded border border-white/10">
                        4:15
                      </span>
                    </div>

                    {/* Card Actions Row */}
                    <div className="p-4.5 bg-white border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase font-mono select-none">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('card1'); }}
                          className={cn(
                            "flex items-center gap-1 shrink-0 transition-transform active:scale-95 cursor-pointer",
                            recommendationStates.card1.liked ? "text-[#FF0038] font-black" : "hover:text-[#FF0038] text-gray-500"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", recommendationStates.card1.liked ? "fill-current text-[#FF0038] scale-110" : "")} />
                          <span>{recommendationStates.card1.likes}</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('card1'); }}
                          className="flex items-center gap-1 hover:text-[#FF0038]/80 text-gray-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{(recommendationStates.card1.views / 1000).toFixed(1)}k</span>
                        </button>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('card1'); }}
                        className={cn(
                          "w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all transform active:scale-95 cursor-pointer",
                          recommendationStates.card1.bookmarked ? "bg-[#FF0038]/5 border-[#FF0038]/30" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn("w-4 h-4 stroke-[2]", recommendationStates.card1.bookmarked ? "fill-[#FF0038] text-[#FF0038]" : "text-slate-400")} />
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: Text Sourcing Manual */}
                  <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left">
                    <div 
                      onClick={() => handleRecView('card2')}
                      className="relative h-44 bg-[#081120] overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&h=500&fit=crop" 
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                        alt="Blog RMG sourcing" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 bg-white text-[#081120] text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-gray-100 font-mono">
                        WHITE PAPER
                      </span>
                    </div>

                    <div className="p-4.5 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="font-space font-black text-xs uppercase text-[#081120] group-hover:text-[#FF0038] leading-snug mb-1.5 transition-colors line-clamp-2">
                          UNDERSTANDING DIRECT CARGO ESCROW
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium line-clamp-2 leading-relaxed">
                          Verify how Choosify escrow prevents custom export cargo failures.
                        </p>
                      </div>

                      <div className="border-t border-gray-50 pt-4 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase font-mono select-none">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRecLike('card2'); }}
                            className={cn(
                              "flex items-center gap-1 transition-transform active:scale-95 cursor-pointer",
                              recommendationStates.card2.liked ? "text-[#FF0038] font-black" : "hover:text-[#FF0038] text-gray-500"
                            )}
                          >
                            <Heart className={cn("w-4 h-4", recommendationStates.card2.liked ? "fill-current text-[#FF0038] scale-110" : "")} />
                            <span>{recommendationStates.card2.likes}</span>
                          </button>
                        </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecBookmark('card2'); }}
                          className={cn(
                            "w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all transform active:scale-95 cursor-pointer",
                            recommendationStates.card2.bookmarked ? "bg-[#FF0038]/5 border-[#FF0038]/30" : "hover:border-gray-200"
                          )}
                        >
                          <Bookmark className={cn("w-4 h-4 stroke-[2]", recommendationStates.card2.bookmarked ? "fill-[#FF0038] text-[#FF0038]" : "text-slate-400")} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Video Reel Guidelines 2 */}
                  <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left">
                    <div 
                      onClick={() => handleRecView('card3')}
                      className="relative h-[240px] bg-[#081120] overflow-hidden cursor-pointer"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=600&h=1000&fit=crop" 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                        alt="Reel 3 Packing" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                      
                      <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 bg-[#FF0038] text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                        PACKAGING DEMO
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 bg-[#FF0038] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 pr-12 text-left pointer-events-none">
                        <h4 className="font-space font-black text-white text-xs uppercase tracking-tight leading-tight mb-1">
                          BENGAL Kraft Outer validation
                        </h4>
                        <p className="text-[9px] text-white/80 font-medium line-clamp-1 italic">
                          Assessing damp-proof heavy carton layers transit capacity.
                        </p>
                      </div>

                      <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-[8px] font-mono font-black px-2 py-0.5 rounded border border-white/10">
                        6:20
                      </span>
                    </div>

                    <div className="p-4.5 bg-white border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase font-mono select-none">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecLike('card3'); }}
                          className={cn(
                            "flex items-center gap-1 shrink-0 transition-transform active:scale-95 cursor-pointer",
                            recommendationStates.card3.liked ? "text-[#FF0038] font-black" : "hover:text-[#FF0038] text-gray-500"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", recommendationStates.card3.liked ? "fill-current text-[#FF0038] scale-110" : "")} />
                          <span>{recommendationStates.card3.likes}</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRecView('card3'); }}
                          className="flex items-center gap-1 hover:text-[#FF0038]/80 text-gray-500 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{(recommendationStates.card3.views / 1000).toFixed(1)}k</span>
                        </button>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRecBookmark('card3'); }}
                        className={cn(
                          "w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center bg-white transition-all transform active:scale-95 cursor-pointer",
                          recommendationStates.card3.bookmarked ? "bg-[#FF0038]/5 border-[#FF0038]/30" : "hover:border-gray-200"
                        )}
                      >
                        <Bookmark className={cn("w-4 h-4 stroke-[2]", recommendationStates.card3.bookmarked ? "fill-[#FF0038] text-[#FF0038]" : "text-slate-400")} />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Explore Guides bottom button */}
                <div className="text-center">
                  <Link 
                    to="/b2b/rfq" 
                    className="inline-flex items-center gap-2.5 px-9 py-3.5 bg-[#FF0038] hover:bg-[#D6002F] font-black text-white text-[11px] tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl duration-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>LAUNCH CUSTOM RFQ WIZARD</span>
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                      →
                    </span>
                  </Link>
                </div>
              </div>

              {/* FEED SECTION F — REGIONAL HUBS (Replicates Popular Categories Grid layout exactly but for B2B) */}
              <div id="section-categories" className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-10 shadow-[0_15px_40px_rgba(26,29,78,0.02)] text-left">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-100/60 gap-4">
                  <div className="text-left">
                    <h2 className="font-space text-3xl font-black italic tracking-tight uppercase leading-none">
                      <span className="text-[#081120]">BANGLADESH</span> <span className="text-[#FF0038]">SOURCING HUBS</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="shrink-0 w-1 h-[14px] bg-[#FF0038] rounded-full inline-block" />
                      <p className="text-[11px] text-[#081120] font-bold tracking-wide leading-none uppercase">
                        LOCALIZED SOURCING CLUSTERS
                      </p>
                    </div>
                  </div>

                  {/* MOQ Filter Control */}
                  <div className="flex items-center gap-3 bg-[#F7F8FA] border border-slate-200 px-4 py-2.5 rounded-full">
                    <SlidersHorizontal size={12} className="text-[#FF0038]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-space leading-none">MAX MOQ FILTER:</span>
                    <input 
                      type="range" 
                      min={10} 
                      max={500} 
                      value={moqRange} 
                      onChange={(e) => setMoqRange(Number(e.target.value))}
                      className="w-20 sm:w-28 accent-[#FF0038]"
                    />
                    <span className="text-[10px] font-black text-[#FF0038] font-mono italic whitespace-nowrap leading-none">{moqRange} UNITS</span>
                  </div>
                </div>

                {/* District Grid - 6 beautiful cards matching layout structure of popular categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6.5">
                  {BANGLADESH_DISTRICT_HUBS.map((hub, idx) => {
                    const isSelected = selectedHub.toLowerCase() === hub.name.toLowerCase();
                    
                    const getDistrictMockIcon = (hubId: string) => {
                      if (hubId === 'dhaka') return <Shirt className="w-[21px] h-[21px] text-blue-600 stroke-[2.5]" />;
                      if (hubId === 'chittagong') return <Luggage className="w-[21px] h-[21px] text-rose-500 stroke-[2.5]" />;
                      if (hubId === 'gazipur') return <Palette className="w-[21px] h-[21px] text-orange-500 stroke-[2.5]" />;
                      if (hubId === 'narayanganj') return <Cpu className="w-[21px] h-[21px] text-[#1A73E8] stroke-[2.5]" />;
                      if (hubId === 'sylhet') return <Gem className="w-[21px] h-[21px] text-yellow-500 stroke-[2.5]" />;
                      if (hubId === 'khulna') return <Baby className="w-[21px] h-[21px] text-emerald-500 stroke-[2.5]" />;
                      return <ShoppingBag className="w-[21px] h-[21px] text-gray-500 stroke-[2.5]" />;
                    };

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          setSelectedHub(isSelected ? '' : hub.name);
                          toast.success(isSelected ? "Showing all nationwide factories" : `Showing audited plants located in ${hub.name} district`);
                        }}
                        className={cn(
                          "bg-white border text-left rounded-[20px] p-6 flex flex-col items-start shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-lg hover:border-gray-200/90 transition-all duration-300 cursor-pointer group select-none relative",
                          isSelected ? "border-[#FF0038] bg-[#FF0038]/5" : "border-gray-100"
                        )}
                      >
                        <div className="w-11 h-11 bg-white border border-slate-100/90 rounded-full flex items-center justify-center shadow-sm mb-5 group-hover:scale-105 transition-transform duration-250 shrink-0">
                          {getDistrictMockIcon(hub.id)}
                        </div>
                        
                        <div className="w-full">
                          <span className="text-[8px] font-mono font-black uppercase text-[#FF0038] tracking-widest">{hub.tag}</span>
                          <h4 className="font-sans font-bold text-sm text-[#081120] group-hover:text-[#FF0038] transition-colors leading-tight mb-1.5 uppercase tracking-tight mt-1">
                            {hub.name} District Hub
                          </h4>
                          <p className="text-[10px] text-gray-400 font-semibold leading-tight line-clamp-1 mb-3 font-mono">
                            Specialty: {hub.specialty}
                          </p>
                          <div className="flex items-center justify-between w-full mt-auto">
                            <span className="text-[11px] text-[#FF0038] font-black leading-none uppercase font-mono tracking-tight">
                              {hub.supplierCount} Verified Plants
                            </span>
                            <span className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5 italic">
                              Explore Specs →
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* NON-FEED CATEGORY DISPLAY GRID - REPLICATES RETAIL LOGIC FOR CATEGORIES FILTERED PRODUCTS */
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)] min-h-[480px] text-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8 text-left">
                <div>
                  <h3 className="font-space font-black text-2xl uppercase text-[#081120] flex items-center gap-2.5 leading-none">
                    <span className="text-3xl leading-none">{categoryTabs.find(t=>t.id===activeTab)?.emoji}</span> {activeTab}
                  </h3>
                  <p className="text-[10.5px] text-gray-400 mt-1.5 uppercase tracking-wider font-mono">BROWSING SECURED AUDITED WHOLESALE CATALOGS</p>
                </div>
                <button 
                  onClick={() => setActiveTab('FEED')}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-[#FF0038] hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none shadow-xs"
                >
                  Return to Feed
                </button>
              </div>

              {wholesaleProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wholesaleProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} variant="compact" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mb-4 border border-dashed border-slate-300">
                    <AlertCircle className="w-8 h-8 text-[#FF0038]" />
                  </div>
                  <h4 className="font-space font-extrabold text-[#081120] uppercase tracking-wide mb-1.5 leading-none">No original wholesale items cataloged</h4>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-semibold">
                    We are currently executing strict brand quality assays on corporate outlets in this category. New products update weekly!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FEED SECTION G — TRUST BADGES */}
          <div id="section-trust" className="bg-white rounded-3xl border border-gray-100/90 p-6 md:p-8 shadow-[0_15px_40px_rgba(26,29,78,0.02)] text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 rounded-[24px] border border-[#CFD4E6] p-7 lg:p-10 bg-gradient-to-b from-[#EEF1F8]/10 to-white/40 shadow-sm text-center">
              
              <div className="text-center flex flex-col items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#FF0038]/10 flex items-center justify-center text-[#FF0038] shadow-sm shrink-0 border border-[#FF0038]/5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-space font-black text-sm text-[#081120] uppercase tracking-wider mb-2 leading-none">Trade Assurance Assured</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                    Choosify lists merchant networks complying strictly with independent factory audits. Safe, secured buying with verified LC.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3.5 border-t md:border-t-0 md:border-x border-[#CFD4E6]/50 pt-7 md:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#FF0038]/10 flex items-center justify-center text-[#FF0038] shadow-sm shrink-0 border border-[#FF0038]/5">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-space font-black text-sm text-[#081120] uppercase tracking-wider mb-2 leading-none">Escrow-Shield Protection</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                    Your bulk funds remain fully locked in bank escrow until physical custom-grade audits and barcode labels verify your RMG lot.
                  </p>
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3.5 border-t md:border-t-0 pt-7 md:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#FF0038]/10 flex items-center justify-center text-[#FF0038] shadow-sm shrink-0 border border-[#FF0038]/5">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-space font-black text-sm text-[#081120] uppercase tracking-wider mb-2 leading-none">Direct Fabric Auditing</h4>
                  <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                    All listed retail, RMG or tech lots feature solid producer-backed distributor warranties and standard brand authenticity stamps, guaranteed.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* RIGHT STICKY SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-[500px] w-full max-w-[260px] xl:max-w-[310px] flex-shrink-0">
          
          {/* Card 1 — B2B TRENDING BULK DEALS (Matches Retail Trending Deals layout exactly) */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-50">
              <h3 className="font-space font-black text-[18px] tracking-tight italic text-[#081120] uppercase">
                BULK <span className="text-[#FF0038]">DEALS</span>
              </h3>
              <span className="text-[10px] font-black text-[#FF0038] underline uppercase tracking-wider select-none leading-none">
                HOT SLABS
              </span>
            </div>
            
            <div className="flex flex-col gap-5">
              {[
                {
                  id: 1,
                  title: "Heavy RMG Combed Cotton Cargo T-Shirts Slabs",
                  img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=240&h=240&fit=crop",
                  moq: "100 Pcs",
                  badge: "BEST RATE",
                  badgeClass: "bg-[#FF0038] text-white",
                  price: "BDT 180"
                },
                {
                  id: 2,
                  title: "Premium Oeko-Tex Standard Twill Denim Fabric",
                  img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=240&h=240&fit=crop",
                  moq: "500 Yds",
                  badge: "BSCI AUDITED",
                  badgeClass: "bg-[#081120] text-emerald-400 border border-emerald-500/20",
                  price: "BDT 310"
                },
                {
                  id: 3,
                  title: "Original Grade Corrugated Barcode Heavy Card",
                  img: "https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=240&h=240&fit=crop",
                  moq: "1,000 Pcs",
                  badge: "FSC CERT",
                  badgeClass: "bg-emerald-600 text-white",
                  price: "BDT 22"
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex gap-4 bg-white hover:bg-gray-50/30 p-1 rounded-2xl transition-all duration-300 group text-left"
                >
                  <div className="w-24 h-24 rounded-[16px] overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center bg-gray-50 relative">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Supplier catalog bookmarked to vault!');
                      }}
                      className="absolute top-1.5 left-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow border border-orange-100 cursor-pointer hover:scale-110 active:scale-90 transition-transform z-10"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#FF0038]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1 text-left">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono font-bold uppercase text-gray-400 tracking-wider">MOQ: {item.moq}</span>
                        <span className={cn("text-[7px] font-black uppercase px-2 py-0.5 rounded-[6px] tracking-tight leading-none shrink-0", item.badgeClass)}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-space text-[10.5px] font-black uppercase tracking-tight text-[#081120] group-hover:text-[#FF0038] transition-colors line-clamp-2 leading-tight mt-1">
                        {item.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[12px] font-mono font-black text-[#FF0038] tracking-tight">
                        {item.price}
                      </span>
                      <button 
                        type="button" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          addToCart({
                            id: `b2b-deal-${item.id}`,
                            title: item.title,
                            price: parseFloat(item.price.replace("BDT ", "")),
                            image: item.img,
                            moq: 100,
                            brand: 'DIRECT MILL'
                          }, 100); 
                          toast.success(`Successfully added bulk quantity of ${item.title} to cargo!`);
                        }} 
                        className="w-10 h-10 rounded-full bg-[#FF0038] hover:bg-[#D6002F] text-white flex flex-col items-center justify-center shrink-0 hover:scale-[1.05] active:scale-[0.96] transition-transform shadow-[0_4px_12px_rgba(255,0,56,0.2)] border-0 cursor-pointer"
                      >
                        <span className="text-[7px] font-black uppercase leading-none tracking-tight">Inquire</span>
                        <span className="text-[7px] font-black uppercase leading-none tracking-tight mt-0.5">Bulk</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — LIVE SUPPLIER BROADCASTS (Matches Card 2 in Retail Right Sidebar layout exactly) */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-50">
              <h3 className="font-space font-black text-[12px] tracking-wide text-[#081120] uppercase leading-tight">
                MILL <span className="text-[#FF0038]">BROADCASTS</span>
              </h3>
              <span className="text-[9.5px] font-mono font-black text-[#FF0038] leading-none animate-pulse">● LIVE</span>
            </div>

            <div className="flex flex-col gap-3.5">
              {[
                {
                  title: "Epyllion Trade uploaded 50 updated RMG activewear catalog items",
                  img: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=160&h=160&fit=crop",
                  likes: "140",
                  views: "2.4k",
                  company: "EPYLLION"
                },
                {
                  title: "Sailor Denim registered raw yarn inventory at Gazipur warehouse B",
                  img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=160&h=160&fit=crop",
                  likes: "85",
                  views: "1.1k",
                  company: "SAILOR MILLS"
                },
                {
                  title: "Apex Shoe Group cleared rigorous BSCI worker health visual assays",
                  img: "https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=160&h=160&fit=crop",
                  likes: "210",
                  views: "4.8k",
                  company: "APEX CORP"
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => { navigate('/b2b/suppliers'); }}
                  className="flex gap-3 bg-white border border-gray-100/80 rounded-[16px] p-2.5 hover:shadow-[0_8px_20px_rgba(26,29,78,0.03)] hover:border-[#FF0038]/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-[12px] overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center bg-gray-50">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                    <span className="text-[7px] font-mono font-black text-[#FF0038] tracking-widest">{item.company}</span>
                    <h4 className="font-space text-[9.5px] font-black uppercase tracking-tight text-[#081120] group-hover:text-[#FF0038] transition-colors line-clamp-2 leading-tight">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-gray-400 font-mono text-[8px] font-black mt-1">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#FF0038] fill-[#FF0038]/10" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-gray-450" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — FOR FACTORIES & SELLERS (REPOSITIONED & EXACT DIMENSIONS PARITY TO RETAIL) */}
          <div 
            id="section-sellers" 
            className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] relative overflow-hidden flex flex-col justify-between text-center shrink-0 mx-auto" 
            style={{ width: '280px', height: '464px' }}
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#FF0038]/5 to-[#081120]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FF0038]/10 text-[#FF0038] flex items-center justify-center mb-3.5 border border-[#FF0038]/5 shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="font-space text-lg font-black uppercase tracking-tight text-[#081120] leading-snug">
                For Factories <span className="text-[#FF0038] italic">& Exporters</span>
              </h3>
              
              <p className="text-[10.5px] text-gray-400 font-bold mt-2 px-1 leading-relaxed">
                Connect directly with enterprise sourcing directors, submit digital blueprints, and lock secure trade contracts.
              </p>
            </div>

            <div className="border border-dashed border-[#FF0038]/20 bg-gradient-to-b from-[#FF0038]/5 to-white rounded-[20px] p-4 text-center flex flex-col items-center justify-center shadow-sm my-2 flex-1">
              <h4 className="font-space font-black text-[#081120] text-[11px] uppercase tracking-wider mb-2 leading-none">Broadcast Factory Load</h4>
              <p className="text-[9.5px] text-gray-500 mb-4 leading-relaxed max-w-[210px] font-semibold">
                Submit direct quotations on active RFQs and clear worker welfare validations.
              </p>
              
              <button 
                onClick={() => setIsRfqOpen(true)}
                className="w-full h-10 bg-gradient-to-r from-[#FF0038] to-[#D6002F] hover:from-[#D6002F] hover:to-[#FF0038] text-white font-black rounded-full text-[9.5px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer outline-none border-none"
              >
                Send Custom Quote <PenTool className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-gray-400 uppercase font-mono tracking-widest shrink-0">
              <Users className="w-3.5 h-3.5 text-gray-400" /> 1200+ mills active today
            </div>
          </div>

          {/* Card 4 — B2B NEWSLETTER DISPATCH */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5.5 shadow-[0_10px_30px_rgba(26,29,78,0.02)] text-left">
            <div className="mb-4">
              <h3 className="text-[9.5px] font-black tracking-widest text-[#FF0038] uppercase mb-1.5 italic font-mono">B2B TRADE OBSERVER</h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                Receive newly verified factory audits, bulk RMG slabs, and trade assurance protection bulletins weekly.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter company email address..." 
                  className="w-full h-11 px-4.5 bg-[#F7F8FA] border border-gray-150 hover:bg-gray-100 rounded-xl text-xs font-semibold text-[#081120] placeholder-gray-400 focus:outline-[#FF0038] focus:ring-0 focus:border-[#FF0038] transition-all text-left" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full h-11 bg-[#FF0038] hover:bg-[#D6002F] rounded-xl text-xs font-black text-white tracking-widest uppercase transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer border-none"
              >
                SUBSCRIBE TO REPORT <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>

        </aside>

      </main>

      {/* RFQ Drawer Modal */}
      <AnimatePresence>
        {isRfqOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-[#081120]/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 p-8 rounded-[32px] w-full max-w-lg relative text-slate-800 shadow-2xl text-left"
            >
              <h3 className="text-2xl font-black text-[#081120] italic uppercase tracking-tight">Rapid Sourcing Request</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6 font-medium">Complete standard industrial terms for nationwide broadcast.</p>

              <form onSubmit={handleQuickRfqSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-slate-500">Specify Sourced Item</label>
                  <input 
                    type="text" 
                    value={rfqItem} 
                    onChange={(e) => setRfqItem(e.target.value)} 
                    required
                    placeholder="e.g. combed cotton t-shirts lot"
                    className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-300 text-xs text-[#081120] focus:outline-none focus:border-[#FF0038] font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-slate-500">Order Load Qty</label>
                    <input 
                      type="number" 
                      value={rfqQty} 
                      onChange={(e) => setRfqQty(Number(e.target.value))} 
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-300 text-xs text-[#081120] font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-slate-500">Target Budget Per Item (BDT)</label>
                    <input 
                      type="number" 
                      value={rfqPrice} 
                      onChange={(e) => setRfqPrice(Number(e.target.value))} 
                      className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-300 text-xs text-[#081120] font-bold" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5 text-slate-500 font-mono">Special Directives Checklist</label>
                  <textarea 
                    value={rfqNotes} 
                    onChange={(e) => setRfqNotes(e.target.value)} 
                    rows={3}
                    placeholder="Certifications, materials standard, branding options."
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 text-xs text-[#081120] placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#FF0038]"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsRfqOpen(false)}
                    className="flex-1 h-12 bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all italic border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-12 bg-[#FF0038] hover:bg-[#d6002f] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all italic shadow-md border-none cursor-pointer"
                  >
                    Broadcast RFQ Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
