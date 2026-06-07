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
  Briefcase
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

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5 group hover:bg-white/10 transition-all cursor-pointer">
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", color)}>
      <Icon size={22} />
    </div>
    <div>
      <div className="text-2xl font-black text-white italic leading-none mb-1">{value}</div>
      <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

// --- SECTIONS ---

const OverviewSection = () => {
  const { savedProducts, savedBrands, comparedProducts } = useDashboard();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
            Marhaba, <span className="text-[#F96500]">Farhan</span>
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
        <StatCard icon={Heart} label="Saved Products" value={savedProducts.length} color="bg-[#F96500]" />
        <StatCard icon={Store} label="Loved Brands" value={savedBrands.length} color="bg-[#1B5CFF]" />
        <StatCard icon={Layers} label="Active Comparisons" value={comparedProducts.length} color="bg-[#07DD05]" />
        <StatCard icon={Bell} label="Pending Alerts" value="03" color="bg-[#7C3AED]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3">
              <Clock className="text-[#F96500]" size={20} /> Recently Viewed
            </h3>
            <div className="flex items-center gap-4">
              <button className="text-[10px] font-black text-[#F96500] uppercase tracking-widest hover:underline italic bg-transparent border-none cursor-pointer">See All</button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-2 -mx-2">
            {PRODUCTS.slice(4, 9).map((p, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] shrink-0">
                <ProductCard product={p} variant="grid" />
              </div>
            ))}
          </div>
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
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Saved <span className="text-[#F96500]">Vault</span></h2>
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
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 mb-8 mb-8 scale-110">
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

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Loved <span className="text-[#1B5CFF]">Partners</span></h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Brands you trust and follow for updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {savedBrands.map((brand) => (
          <div key={brand.id} className="relative group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all text-center">
            <button 
              onClick={() => removeSavedBrand(brand.id)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-navy font-black text-2xl mx-auto mb-6 shadow-xl shadow-black/20">
              {brand.logo}
            </div>
            <h4 className="text-lg font-black text-white uppercase italic italic mb-2">{brand.name}</h4>
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={10} className={s <= Math.floor(brand.rating) ? "text-[#F96500] fill-current" : "text-white/10"} />
              ))}
            </div>
            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Visit Brand</button>
          </div>
        ))}
      </div>
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

// --- MAIN PAGE ---

export function DashboardPage() {
  const { setIsLoggedIn } = useGlobalState();
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
    { id: 'saved-products', label: 'Saved Products', icon: Heart },
    { id: 'saved-brands', label: 'Loved Brands', icon: Store },
    { id: 'saved-recommendations', label: 'Saved Guides', icon: Bookmark },
    { id: 'my-comparisons', label: 'My Comparisons', icon: Layers },
    { id: 'cashbook', label: 'CashBook Ledger', icon: BookOpen, href: '/cashbook' },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'my-reviews', label: 'My Reviews', icon: Star },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      // Retail Tabs
      case 'overview': return <OverviewSection />;
      case 'saved-products': return <SavedProductsSection />;
      case 'saved-brands': return <SavedBrandsSection />;
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

      default: return <OverviewSection />;
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
            {menuItems.slice(0, 6).map((item) => (
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
            {menuItems.slice(6).map((item) => (
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
           {/* Mobile Top Tabs */}
           <div className="lg:hidden flex overflow-x-auto no-scrollbar border-b border-white/5 sticky top-[80px] bg-[#0A0A1F] z-40 bg-zinc-900/50 backdrop-blur-2xl">
              {menuItems.map((item) => (
                <TabItem
                  key={item.id}
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
