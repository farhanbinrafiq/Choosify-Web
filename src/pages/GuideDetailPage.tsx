import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Bookmark, Star, ArrowRight, Play, Info, 
  CheckCircle2, ShoppingBag, Smartphone, Laptop, Zap, Globe, MessageSquare,
  ChevronLeft, ChevronRight, Youtube, Eye, Heart, HelpCircle, Users, Palette, Sparkles, XCircle,
  PartyPopper, Ruler, Shirt, CalendarDays, Check, X, BookOpen, Facebook, Twitter, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BLOGS, PRODUCTS } from '../constants';
import { cn } from '../lib/utils';
import { EvaluationData, ComparisonProduct } from '../types/evaluation';
import evaluationsData from '../data/evaluations.json';

const evaluations = evaluationsData as EvaluationData[];

const COMPARISON_DATA: ComparisonProduct[] = [
  {
    brand: 'Ecstasy',
    subBrand: "Men's Wear",
    quality: 'Good',
    service: 'Normal',
    priceRange: { min: 2800 },
    packaging: 'Great',
    performance: 'Good',
    score: 8.0,
    actionLabel: 'Shop'
  },
  {
    brand: 'Infinity',
    subBrand: 'Formal Wear',
    quality: 'Premium',
    service: 'Premium',
    priceRange: { min: 3500 },
    packaging: 'Average',
    performance: 'Great',
    score: 7.5,
    actionLabel: 'Shop'
  },
  {
    brand: 'Le Reve',
    subBrand: 'Casual Wear',
    quality: 'Excellent',
    service: 'Best',
    priceRange: { min: 1500 },
    packaging: 'Excellent',
    performance: 'Excellent',
    score: 9.0,
    actionLabel: 'Shop'
  },
  {
    brand: 'Sailor',
    subBrand: 'Top Brand',
    quality: 'Budget',
    service: 'Excellent',
    priceRange: { min: 1200 },
    packaging: 'Good',
    performance: 'Disappointed',
    score: 9.5,
    actionLabel: 'Shop'
  },
  {
    brand: 'Yellow',
    subBrand: 'Ethnic Wear',
    quality: 'Affordable',
    service: 'Average',
    priceRange: { min: 500 },
    packaging: 'Excellent',
    performance: 'Awesome',
    score: 7.2,
    actionLabel: 'Shop'
  }
];

export function GuideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the blog/guide. Fallback to first if not found
  const guide = BLOGS.find(b => b.id === Number(id)) || BLOGS[0];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  
  const [interactions, setInteractions] = useState({
    loved: 1000,
    isLoved: false,
    helpful: 400,
    isHelpful: false,
    purchases: 95,
    isPurchased: false
  });

  const toggleInteraction = (field: 'isLoved' | 'isHelpful' | 'isPurchased') => {
    setInteractions(prev => {
      const countField = field === 'isLoved' ? 'loved' : field === 'isHelpful' ? 'helpful' : 'purchases';
      const isField = field;
      return {
        ...prev,
        [isField]: !prev[isField],
        [countField]: prev[isField] ? prev[countField] - 1 : prev[countField] + 1
      };
    });
  };
  
  // Find evaluation data for this guide/product
  const evaluation = evaluations.find(e => e.productId === Number(id)) || evaluations[0];
  
  const guideImages = [
    "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % guideImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + guideImages.length) % guideImages.length);
  
  // Products related to this guide based on constants mapping
  const recommendedProductIds = (guide as any).recommendedProducts || [];
  const allGuideProducts = PRODUCTS.filter(p => recommendedProductIds.includes(p.id));
  
  // If no recommended products, fallback to first 3 products
  const displayProducts = allGuideProducts.length > 0 ? allGuideProducts.slice(0, visibleCount) : PRODUCTS.slice(0, visibleCount);

  const handleViewProducts = () => {
    if (allGuideProducts.length > 6) {
      navigate(`/guides/${id}/products`);
    } else {
      setVisibleCount(6);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb & Meta Meta (PRD Requirement) */}
      <div className="max-w-7xl mx-auto px-6 py-8">
         <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
               <Link to="/" className="hover:text-orange-primary transition-colors">Home</Link>
               <ChevronRight size={12} />
               <Link to="/guides" className="hover:text-orange-primary transition-colors">Recommendations</Link>
               <ChevronRight size={12} />
               <span className="text-navy">{guide.title}</span>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest italic bg-gray-50 px-4 py-2 rounded-full">
                  <CalendarDays size={14} className="text-orange-primary" />
                  Published May 12, 2026
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest italic bg-orange-primary/5 px-4 py-2 rounded-full border border-orange-primary/10">
                  <BookOpen size={14} className="text-orange-primary" />
                  8 Min Read
               </div>
            </div>
         </div>
      </div>



      {/* Updated Hero Section */}
      <div className="w-full bg-[#0A0A14] py-12 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-full bg-orange-primary/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          {/* Main Container Wrapper */}
          <div className="bg-[#1D1D2B]/50 backdrop-blur-xl rounded-[24px] border border-white/10 p-6 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden">
            
            {/* Title Header */}
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
              {guide.title}
            </h1>

            {/* Media Row: Video Left, Photos Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
               {/* Video Card (Left) */}
               <div className="aspect-video rounded-[16px] overflow-hidden relative group border border-white/5 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1718043323049-d757d5494191?w=1200" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="Video Thumbnail" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* YouTube Tag */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-20">
                     <Youtube size={14} className="text-red-500 fill-current" />
                     <span className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Youtube</span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <motion.button 
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                       className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] z-20 pointer-events-auto"
                     >
                        <Play size={32} fill="currentColor" strokeWidth={0} className="ml-1" />
                     </motion.button>
                     {/* Ripple Effect */}
                     <div className="absolute w-20 h-20 rounded-full bg-red-600 animate-ping opacity-20 pointer-events-none" />
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-10 left-10 max-w-[250px] pointer-events-none">
                     <h3 className="text-2xl font-black text-white uppercase italic leading-tight tracking-tighter">
                        Introducing the new Galaxy <span className="text-orange-primary underline decoration-2 underline-offset-4">S26 Ultra</span>
                     </h3>
                  </div>
               </div>

               {/* Photo Slider Card (Right) */}
               <div className="aspect-video rounded-[16px] overflow-hidden relative group border border-white/5 shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      src={guideImages[currentImageIndex]} 
                      className="w-full h-full object-cover" 
                      alt="Product Gallery" 
                    />
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Navigation Arrows */}
                  <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
                     <button 
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                       className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all pointer-events-auto z-30"
                     >
                        <ChevronLeft size={24} />
                     </button>
                     <button 
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                       className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all pointer-events-auto z-30"
                     >
                        <ChevronRight size={24} />
                     </button>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-20">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest italic">
                        Image {currentImageIndex + 1} - {guideImages.length}
                     </span>
                  </div>

                  {/* Floating S26 Text Overlay */}
                  <div className="absolute bottom-10 right-10 pointer-events-none">
                     <span className="text-4xl font-black text-white/20 uppercase italic tracking-tighter">
                        S26 Ultra
                     </span>
                  </div>
               </div>
            </div>

            {/* Content Divider */}
            <div className="h-px bg-white/10 w-full mb-10" />

            {/* Bottom Meta Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-8">
               {/* Author Info */}
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full border-2 border-orange-primary p-0.5 shadow-[0_0_20px_rgba(255,92,56,0.2)]">
                     <img src={`https://i.pravatar.cc/150?u=${guide.author}`} className="w-full h-full rounded-full object-cover" alt={guide.author} />
                  </div>
                  <div>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic block mb-1">Recommended By</span>
                     <h4 className="text-lg font-black text-white uppercase italic leading-none">{guide.author}</h4>
                     <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={10} className={star <= 4 ? "text-orange-primary fill-current" : "text-white/20"} />
                           ))}
                        </div>
                        <span className="text-[9px] font-black text-orange-primary uppercase tracking-widest italic ml-1 underline underline-offset-2">Pro Contributor</span>
                     </div>
                  </div>
               </div>

               {/* Meta Stats Group */}
               <div className="flex flex-wrap items-center gap-12 lg:gap-20">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic mb-2">Published Date</span>
                     <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">{guide.date}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic mb-2">Read Time</span>
                     <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">12 Minutes</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic mb-2">Audience</span>
                     <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">ENTHUSIASTS</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>


      {/* Article Stats Bar Style (As per reference image) */}
      <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 md:top-20 z-40 mb-12">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-50 bg-white">
            <div className="flex flex-col items-center justify-center py-5">
               <span className="text-xl font-black text-navy italic leading-none mb-1">12,500</span>
               <span className="text-[10px] font-bold text-gray-400 italic">Views</span>
            </div>
            <div className="flex flex-col items-center justify-center py-5 group">
               <span className="text-xl font-black text-navy italic leading-none mb-2">{interactions.loved}</span>
               <button 
                 onClick={() => toggleInteraction('isLoved')}
                 className={cn(
                   "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all active:scale-95 border",
                   interactions.isLoved ? "bg-red-500 text-white border-red-600" : "bg-gray-50 text-gray-400 border-gray-100 hover:text-red-500 hover:border-red-100"
                 )}
               >
                  <Heart size={10} className={cn(interactions.isLoved && "fill-current")} /> love react
               </button>
            </div>
            <div className="flex flex-col items-center justify-center py-5 group">
               <span className="text-xl font-black text-navy italic leading-none mb-2">{interactions.helpful}</span>
               <button 
                 onClick={() => toggleInteraction('isHelpful')}
                 className={cn(
                   "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all active:scale-95 border",
                   interactions.isHelpful ? "bg-[#1B5CFF] text-white border-[#1B5CFF]/60" : "bg-gray-50 text-gray-400 border-gray-100 hover:text-[#1B5CFF] hover:border-[#1B5CFF]/20"
                 )}
               >
                  <CheckCircle2 size={10} /> helpful
               </button>
            </div>
            <div className="flex flex-col items-center justify-center py-5 group">
               <span className="text-xl font-black text-orange-primary italic leading-none mb-2">{interactions.purchases}</span>
               <button 
                 onClick={() => toggleInteraction('isPurchased')}
                 className={cn(
                   "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all active:scale-95 border",
                   interactions.isPurchased ? "bg-[#059669] text-white border-[#059669]/60" : "bg-gray-50 text-gray-400 border-gray-100 hover:text-[#059669] hover:border-[#059669]/20"
                 )}
               >
                  <ShoppingBag size={10} /> {interactions.isPurchased ? "Purchased ✓" : "Purchased"}
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 w-full">
        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32 items-start relative">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8">
            {/* Price across stores section (Based on reference image) */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-navy uppercase italic tracking-tighter leading-none">Price across stores</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic mt-2">
                    Independent comparison · we don't earn from these links
                  </p>
                </div>
                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">UPDATED 2 HRS AGO</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Daraz', price: '2,100', delivery: 'Free · 2-3 days', isBest: true, icon: <ShoppingBag size={18} className="text-blue-500" /> },
                  { name: 'Pickaboo', price: '2,184', delivery: '৳60 · 1-2 days', icon: <Smartphone size={18} className="text-navy/40" /> },
                  { name: 'Brand Store', price: '2,226', delivery: 'Free · 3-5 days', icon: <Globe size={18} className="text-blue-400" /> },
                  { name: 'Rokomari', price: '2,289', delivery: '৳50 · 2-4 days', icon: <Bookmark size={18} className="text-orange-primary" /> }
                ].map((store, i) => (
                  <div key={i} className={cn(
                    "relative bg-white rounded-2xl p-8 border transition-all hover:shadow-2xl hover:border-orange-primary/20 group",
                    store.isBest ? "border-orange-primary/40 shadow-xl shadow-orange-primary/5" : "border-gray-100"
                  )}>
                    {store.isBest && (
                      <div className="absolute -top-3 left-6 bg-orange-primary text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic z-10 shadow-lg shadow-orange-primary/20">
                        BEST PRICE
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-orange-primary/5 transition-colors">
                        {store.icon}
                      </div>
                      <span className="text-sm font-black text-navy italic">{store.name}</span>
                    </div>
                    <div className="flex flex-col mb-8">
                      <span className="text-3xl font-black text-navy italic leading-none">৳{store.price}</span>
                      <span className="text-[10px] font-bold text-gray-400 italic mt-3">{store.delivery}</span>
                    </div>
                    <a href="#" className="text-[10px] font-black text-orange-primary uppercase tracking-widest italic flex items-center gap-2 hover:translate-x-2 transition-transform group-hover:underline underline-offset-4">
                      Visit store <ArrowRight size={14} className="-rotate-45" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros, Cons & Best For Section (Based on reference image) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
              {/* Pros */}
              <div className="lg:col-span-4 bg-white border border-green-100 rounded-[32px] p-10 hover:shadow-xl transition-all">
                <h4 className="text-[11px] font-black text-green-500 uppercase tracking-[0.2em] italic mb-8 flex items-center gap-3">
                  <CheckCircle2 size={16} /> PROS
                </h4>
                <div className="space-y-5">
                  {['Excellent build quality', 'Comfortable for long wear', 'Strong value for money', 'Local warranty included'].map(p => (
                    <div key={p} className="flex items-center gap-4 text-sm font-bold text-navy italic opacity-70">
                      <Check size={16} className="text-green-500 shrink-0" /> {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div className="lg:col-span-4 bg-white border border-red-100 rounded-[32px] p-10 hover:shadow-xl transition-all">
                <h4 className="text-[11px] font-black text-orange-primary uppercase tracking-[0.2em] italic mb-8 flex items-center gap-3">
                  <XCircle size={16} /> CONS
                </h4>
                <div className="space-y-5">
                  {['Limited color variants', 'Premium price point', 'Sizes run slightly small'].map(c => (
                    <div key={c} className="flex items-center gap-4 text-sm font-bold text-navy italic opacity-70">
                      <X size={16} className="text-orange-primary shrink-0" /> {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Best For Tags */}
              <div className="lg:col-span-4 bg-white border border-gray-100 rounded-[32px] p-10 hover:shadow-xl transition-all">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic mb-8 flex items-center gap-3">
                   <Users size={16} /> BEST FOR
                </h4>
                <div className="flex flex-wrap gap-2.5">
                   {['Daily wear', 'Office', 'Eid', 'Travel', 'Gifting', 'Age 18-35', 'Comfort lovers'].map(tag => (
                      <span key={tag} className="px-5 py-2.5 bg-gray-50 text-navy rounded-xl text-[10px] font-black italic uppercase tracking-widest hover:bg-orange-primary hover:text-white transition-all cursor-default">
                         {tag}
                      </span>
                   ))}
                </div>
              </div>
            </div>

            <div className="bg-[#F8FAFC] py-20 px-10 rounded-[40px] mb-32">
              <h2 className="text-3xl font-black text-navy uppercase italic tracking-tighter mb-12">
                WHY THIS {evaluation?.categoryType?.toUpperCase() || 'CATEGORY'} MATTERS IN 2026
              </h2>
              
              <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-12 border border-blue-50/50">
                 <p className="text-navy text-[14px] font-medium leading-relaxed mb-16 max-w-3xl opacity-80">
                    Best Suited For {evaluation?.bestFor || 'Expert recommendation'}. This product excels in {evaluation?.criteria?.[0]?.label || 'Performance'} and {evaluation?.criteria?.[1]?.label || 'Quality'}.
                 </p>

                 {/* Detailed Grids */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 px-2">
                    {[
                       { key: 'audience', icon: <Users size={24} />, bg: 'bg-[#F1F5F9]', color: 'text-navy/60', label: 'Audience' },
                       { key: 'styling', icon: <Palette size={24} />, bg: 'bg-[#F1F5F9]', color: 'text-navy/60', label: 'Styling' },
                       { key: 'trend', icon: <PartyPopper size={24} />, bg: 'bg-[#F1F5F9]', color: 'text-navy/60', label: 'Season / Trend' },
                       { key: 'sizeFitting', icon: <Ruler size={24} />, bg: 'bg-[#F1F5F9]', color: 'text-navy/60', label: 'Size & Fitting' },
                       { key: 'material', icon: <Shirt size={24} />, bg: 'bg-[#F1F5F9]', color: 'text-navy/60', label: 'Material & Fabric' },
                       { key: 'occasion', icon: <CalendarDays size={24} />, bg: 'bg-[#F1F5F9]', color: 'text-navy/60', label: 'Occasion' }
                    ].map((item) => {
                       const detail = (evaluation.evaluationDetails as any)[item.key];
                       if (!detail) return null;
                       return (
                          <div key={item.key} className="flex gap-6">
                             <div className={`w-16 h-16 rounded-[16px] ${item.bg} flex items-center justify-center ${item.color} shrink-0 shadow-sm`}>
                                {item.icon}
                             </div>
                             <div className="flex flex-col pt-1">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-navy mb-2 opacity-50">{item.label}</h4>
                                <div className="space-y-1.5 text-navy">
                                  {detail.items.map((it: string) => (
                                     <p key={it} className="text-[13px] font-bold italic leading-tight flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-orange-primary/40 rounded-full" /> {it}
                                     </p>
                                  ))}
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
            </div>

                {/* Expert Verdict Detailed Card (BOTTOM) - Redesigned to match Reference Image */}
                <div className="mt-20 bg-white rounded-[24px] border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.06)] overflow-hidden">
                   {/* Card Header (Reference Style) */}
                   <div className="bg-[#0A0A1F] p-8 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                      <div className="flex-1">
                         <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">Recommended</h3>
                         <p className="text-blue-200/40 text-[11px] font-black uppercase tracking-widest italic">Best for premium buyers who value quality over price</p>
                      </div>
                      <div className="hidden lg:flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest italic">
                         <Info size={16} /> Research insights for 2026
                      </div>
                   </div>

                   {/* Body Row 1: Grade and Main Verdict */}
                   <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-px bg-gray-100 border-b border-gray-100">
                      <div className="bg-white p-12 flex flex-col items-center justify-center text-center">
                         <span className="text-[100px] font-black text-[#FF5C38] italic leading-none drop-shadow-sm">{evaluation.grade}</span>
                         <div className="mt-2">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#0A0A1F]/40 italic">Product Grade</h4>
                            <p className="text-[13px] font-bold text-[#0A0A1F] italic opacity-80">Exceptional overall</p>
                         </div>
                      </div>

                      <div className="bg-white p-12 flex flex-col justify-center">
                         <div className="relative">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#FF5C38] mb-6 italic flex items-center gap-3">
                               <div className="w-8 h-px bg-[#FF5C38]/20" /> Expert Verdict
                            </h4>
                            <p className="text-[16px] md:text-[18px] font-bold text-[#0A0A1F] italic leading-relaxed opacity-70">
                               A top-tier pick with outstanding performance and build quality. Minor trade-offs in value and port selection are unlikely to bother most buyers.
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Body Row 2: Score Bars Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border-b border-gray-100">
                      {evaluation.criteria.slice(0, 4).map(c => (
                         <div key={c.label} className="bg-white p-10">
                            <div className="flex items-center justify-between mb-4">
                               <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0A0A1F] italic opacity-60">{c.label}</span>
                               <span className="text-sm font-black text-[#0A0A1F] italic">{c.score}<span className="text-[10px] text-[#0A0A1F]/30 ml-0.5">/10</span></span>
                            </div>
                            <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: `${c.score * 10}%` }}
                                 className="h-full bg-[#FF5C38] shadow-[0_0_10px_rgba(255,92,56,0.3)]" 
                               />
                            </div>
                         </div>
                      ))}
                   </div>

                   {/* Evaluation Table Section (As per Reference Image) */}
                   <div className="bg-[#FAF9F5] px-8 py-5 flex items-center justify-between border-b border-gray-100">
                      <div className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr] w-full items-center">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A1F]/30 italic">Evaluation Criteria <span className="opacity-50">Up to 5</span></span>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A1F]/30 italic">Strengths <span className="opacity-50">Max 3</span></span>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A1F]/30 italic">Considerations <span className="opacity-50">Max 3</span></span>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A0A1F]/30 italic">Best For</span>
                      </div>
                   </div>

                   <div className="divide-y divide-gray-100">
                      {[
                        { icon: <Smartphone size={16} />, label: 'Build quality', pros: ['Durable frame', 'Premium finish'], cons: ['Heavy at 2.1 kg'], best: '#Professionals' },
                        { icon: <Zap size={16} />, label: 'Performance', pros: ['Fast processor', 'Long battery'], cons: ['Runs warm', 'No USB-A'], best: '#Power users' },
                        { icon: <ShoppingBag size={16} />, label: 'Value for money', pros: ['Free returns'], cons: ['Premium price', 'Few bundles'], best: '#Buyers' },
                        { icon: <Globe size={16} />, label: 'Ease of use', pros: ['Intuitive UI', 'Quick setup'], cons: ['Steep curve'], best: '#Beginners' },
                        { icon: <MessageSquare size={16} />, label: 'After-sales', pros: ['2-yr warranty', '24/7 live chat'], cons: ['Slow responses'], best: '#Long-term' }
                      ].map((row, idx) => (
                         <div key={idx} className="grid grid-cols-[1.5fr_1.5fr_1.5fr_1fr] px-8 py-6 items-center hover:bg-gray-50/50 transition-colors">
                            {/* Criteria Col */}
                            <div className="flex items-center gap-4">
                               <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-orange-primary/60">
                                  {row.icon}
                               </div>
                               <span className="text-[14px] font-bold text-navy italic">{row.label}</span>
                            </div>
                            
                            {/* Strengths Col */}
                            <div className="space-y-1">
                               {row.pros.map(p => (
                                  <div key={p} className="flex items-center gap-2 text-[12px] font-bold italic text-navy/60">
                                     <Check size={12} className="text-blue-500" /> {p}
                                  </div>
                               ))}
                            </div>

                            {/* Considerations Col */}
                            <div className="space-y-1">
                               {row.cons.map(c => (
                                  <div key={c} className="flex items-center gap-2 text-[12px] font-bold italic text-navy/60">
                                     <X size={12} className="text-orange-primary/60" /> {c}
                                  </div>
                               ))}
                            </div>

                            {/* Best For Col */}
                            <div>
                               <span className="px-4 py-1.5 bg-[#EFF6FF] text-[#1E40AF] rounded-[4px] text-[11px] font-black uppercase tracking-widest italic shadow-sm">
                                  {row.best}
                               </span>
                            </div>
                         </div>
                      ))}
                   </div>

                   {/* Footer Bar */}
                   <div className="bg-[#FAF9F5] p-6 flex justify-center items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center">
                         <Info size={12} />
                      </div>
                      <span className="text-[11px] font-bold text-[#0A0A1F]/40 italic">
                         Scores calculated dynamically based on category relevance and user budget profile.
                      </span>
                   </div>
                </div>
              </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 sticky top-24 pt-12 self-start">
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-2xl shadow-gray-200/50 flex flex-col items-center text-center">
               {/* Profile Picture */}
               <div className="w-32 h-32 rounded-full border-4 border-orange-primary/20 p-1 mb-6">
                  <img src="https://i.pravatar.cc/300?u=farhan" className="w-full h-full object-cover rounded-full" alt="Author" />
               </div>

               {/* Name & Title */}
               <h4 className="text-2xl font-black text-navy italic tracking-tighter uppercase mb-2">Farhan Bin Rafiq</h4>
               
               {/* Social Icons */}
               <div className="flex gap-4 justify-center mb-6">
                  <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Facebook size={16} /></button>
                  <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm"><Twitter size={16} /></button>
                  <button className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"><Youtube size={16} /></button>
               </div>

               {/* Bio */}
               <p className="text-sm font-bold text-gray-500 italic mb-6 leading-relaxed">
                  Senior Tech Analyst & Digital Product Researcher with 10+ years of experience in the Bangladesh market.
               </p>

               {/* Verified Badge */}
               <div className="mb-8">
                  <span className="text-[10px] font-black text-orange-primary uppercase tracking-widest italic px-4 py-2 bg-orange-primary/5 rounded-full border border-orange-primary/10">
                    verified expert contributor
                  </span>
               </div>

               {/* Follow Button */}
               <button className="w-full py-5 bg-navy text-white rounded-2xl text-[11px] font-black uppercase tracking-widest italic hover:bg-orange-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-navy/10">
                  Follow Expert
               </button>
            </div>
            
            {/* Additional Sidebar Widgets */}
            <div className="mt-8 p-8 bg-gray-50 rounded-[24px] border border-gray-100 italic">
               <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick Tip</h5>
               <p className="text-xs font-bold text-navy opacity-60">Always check for official warranty stickers when buying premium electronics in Bangladesh.</p>
            </div>
          </aside>
        </div>        {/* Overall Winner Segment - Redesigned to match Featured Guide Style */}
        <section className="border-t border-gray-100 pt-32 mb-40">
           {displayProducts.length > 0 && (
             <div className="mb-32">
                <div className="mb-16">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-4 px-2 border-l-4 border-orange-primary">Our Definitive Recommendation</p>
                   <h2 className="text-5xl font-black text-navy uppercase italic tracking-tighter leading-none">THE OVERALL <span className="text-orange-primary">WINNER</span></h2>
                </div>
                
                {/* Winner Card - Featured Banner Style */}
                <div className="group relative w-full h-[550px] rounded-[10px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-gray-100">
                    <img 
                      src={displayProducts[0].image} 
                      className="w-full h-full object-contain p-20 bg-white group-hover:scale-105 transition-transform duration-[3s]" 
                      alt="Winner Product" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B33] via-[#0D0B33]/80 to-transparent" />
                    
                    <div className="absolute inset-0 p-12 md:p-20 flex flex-col justify-center items-start">
                       <div className="bg-[#FF5C38] text-white text-[10px] font-black px-6 py-2.5 rounded-xl mb-10 uppercase tracking-[0.3em] italic shadow-lg shadow-orange-primary/20">
                           THE 2026 CHAMPION
                       </div>
                       
                       <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.9] mb-12 max-w-2xl uppercase group-hover:tracking-normal transition-all duration-700">
                          {displayProducts[0].brand} {displayProducts[0].title}
                       </h3>
                       
                       <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
                          <Link to={`/products/${displayProducts[0].id}`} className="bg-white text-navy px-12 py-6 rounded-2xl text-[12px] font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-orange-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl">
                             READ FULL SPECS <ArrowRight size={22} className="-rotate-45" />
                          </Link>
                          
                          <div className="flex items-center gap-5">
                             <div className="flex flex-col">
                                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest italic mb-2">Market Price</span>
                                <span className="text-4xl font-black text-white italic leading-none">৳{displayProducts[0].price}</span>
                             </div>
                             <div className="w-px h-10 bg-white/20 mx-2" />
                             <div className="flex flex-col">
                                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest italic mb-2">Expert Rating</span>
                                <div className="flex items-center gap-2">
                                   <Star size={14} className="text-orange-primary fill-current" />
                                   <span className="text-2xl font-black text-white italic leading-none">{displayProducts[0].rating}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
             </div>
           )}

           <div className="mb-20">
              
           </div>

           <div className="flex items-center justify-between mb-16">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-4 px-2 border-l-4 border-orange-primary">Top-Tier Alternatives</p>
                 <h2 className="text-4xl font-black text-navy uppercase italic tracking-tighter leading-none">OTHER <span className="text-orange-primary">PRODUCTS</span> MENTIONED</h2>
              </div>
              <button 
                onClick={handleViewProducts}
                className="text-[11px] font-black text-navy uppercase tracking-widest italic hover:text-orange-primary transition-colors flex items-center gap-4 group px-8 py-4 bg-gray-50 rounded-full"
              >
                 VIEW COMPARISON <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>

           {/* Small Product Cards - Similar to HomePage Small Guide Cards Style */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {displayProducts.slice(1).map(product => (
                 <Link key={product.id} to={`/products/${product.id}`} className="group block">
                    <div className="relative aspect-[16/10] rounded-[10px] overflow-hidden mb-8 border border-gray-100 shadow-xl bg-white p-10 flex items-center justify-center">
                       <img 
                         src={product.image} 
                         className="max-w-[70%] max-h-[70%] object-contain group-hover:scale-110 transition-transform duration-700" 
                         alt={product.title} 
                       />
                       <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gray-50/80 backdrop-blur-sm flex items-center justify-center border border-gray-100 text-orange-primary font-black italic shadow-inner">
                          {product.rating}
                       </div>
                       <div className="absolute top-6 right-6 bg-navy text-white text-[8px] font-black px-4 py-1.5 rounded-full italic tracking-[0.2em] uppercase shadow-lg">
                          {product.tag || 'TOP PICK'}
                       </div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-navy italic tracking-tighter leading-tight mb-4 group-hover:text-orange-primary transition-colors uppercase line-clamp-2">
                       {product.brand} {product.title}
                    </h3>
                    
                    <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase tracking-wider mb-8 italic line-clamp-2">
                       A premium alternative offering exceptional value and nearly identical performance to our top pick.
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 transition-all group-hover:border-orange-primary/20">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Starting From</span>
                          <span className="text-2xl font-black text-navy italic leading-none">৳{product.price}</span>
                       </div>
                       <span className="text-[10px] font-black text-orange-primary uppercase tracking-widest italic flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                          VIEW DETAILS <ArrowRight size={16} className="-rotate-45" />
                       </span>
                    </div>
                 </Link>
              ))}
           </div>
        </section>

        {/* Action Call for help */}
        <div className="bg-[#1A1A2E] rounded-[10px] p-20 text-center relative overflow-hidden group shadow-3xl">
           <div className="absolute top-0 right-0 w-[400px] h-full bg-blue-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-[400px] h-full bg-orange-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />
           
           <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[10px] font-black text-orange-primary italic tracking-[0.5em] mb-8 block uppercase">NEED PERSONAL HELP?</span>
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-8 uppercase">Let our experts find the perfect match for you.</h2>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest italic mb-12">Message us directly on Facebook or WhatsApp for free consultation.</p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                 <button className="px-12 py-5 bg-orange-primary text-white text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[10px] shadow-2xl shadow-orange-primary/20 hover:scale-105 transition-all flex items-center gap-3">
                    Contact On WhatsApp <ArrowRight size={16} />
                 </button>
                 <button className="px-12 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[10px] hover:bg-white/10 transition-all">
                    Community Forum
                 </button>
              </div>
           </div>
        </div>
        {/* Related Recommendations (End of Page) */}
        <section className="mt-32 pt-20 border-t border-gray-100">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h3 className="text-5xl font-black text-navy italic tracking-tighter uppercase mb-4">You May Also Like</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed">More expert recommendations to help you decide wisely.</p>
              </div>
              <Link to="/guides" className="px-10 py-5 bg-navy text-white rounded-full text-[11px] font-black uppercase tracking-widest italic hover:bg-orange-primary transition-all shadow-xl">
                 View All Recommendations
              </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
              {BLOGS.slice(0, 3).map((guide, i) => (
                <Link key={i} to={`/guides/${guide.id}`} className="group cursor-pointer block bg-[#FDFDFD] rounded-[24px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 shadow-xl shadow-gray-100/50">
                  <div className="aspect-[16/10] overflow-hidden relative">
                     <img src={guide.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Guide" />
                     <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                           <BookOpen size={12} className="text-orange-primary" />
                           <span className="text-[9px] font-black text-navy uppercase tracking-widest italic">5 min read</span>
                        </div>
                     </div>
                  </div>
                  <div className="p-8">
                      <h3 className="text-lg font-black text-navy uppercase tracking-tighter mb-4 group-hover:text-orange-primary transition-colors leading-tight italic line-clamp-2">
                         {guide.title}
                      </h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic line-clamp-2 mb-8">{guide.excerpt}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                         <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                            <span className="flex items-center gap-1.5"><Heart size={12} className="text-pink-500" /> 12k</span>
                            <span className="flex items-center gap-1.5 opacity-50">• 450 Shared</span>
                         </div>
                         <ArrowRight size={16} className="text-orange-primary group-hover:translate-x-2 transition-transform" />
                      </div>
                  </div>
                </Link>
              ))}
           </div>
        </section>

        {/* Feedback Section (PRD Requirement) */}
        <section className="bg-gray-50 rounded-[40px] p-12 md:p-20 text-center mb-32 border border-gray-100/50">
           <h3 className="text-4xl font-black text-navy italic tracking-tighter uppercase mb-6">Was this Recommendation helpful?</h3>
           <p className="text-gray-400 text-lg font-bold italic mb-12 uppercase tracking-wide opacity-80 max-w-2xl mx-auto leading-relaxed">Your feedback helps our experts create better guides for you. We take every vote seriously to maintain our 100% unbiased status.</p>
           
           <div className="flex flex-wrap justify-center gap-6">
              <button className="flex items-center gap-4 px-10 py-5 bg-white text-navy font-black rounded-full border border-gray-100 hover:border-green-500 hover:text-green-600 transition-all shadow-xl group">
                 <CheckCircle2 size={24} className="group-hover:scale-125 transition-transform" /> 
                 <span className="text-[11px] uppercase tracking-widest italic">Yes, It Was Helpful</span>
              </button>
              <button className="flex items-center gap-4 px-10 py-5 bg-white text-navy font-black rounded-full border border-gray-100 hover:border-red-500 hover:text-red-500 transition-all shadow-xl group">
                 <XCircle size={24} className="group-hover:scale-125 transition-transform" /> 
                 <span className="text-[11px] uppercase tracking-widest italic">No, I Need More Info</span>
              </button>
           </div>
           
           <div className="mt-16 flex flex-col items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
              <ShieldCheck size={20} className="text-orange-primary" />
              100% INDEPENDENT • NO PAID PROMOTIONS
           </div>
        </section>
      </div>
    </div>
  );
}
