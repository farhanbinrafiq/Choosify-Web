import React, { useState, useEffect, useRef } from 'react';
import { Search, Youtube, Star, ChevronDown, CheckCircle2, Bookmark, ChevronLeft, ChevronRight, Zap, TrendingUp, HelpCircle, AlertCircle, Share2, MessageCircle, BarChart3, Users, Play, Smartphone, Gift, Shirt, Info, Package, DollarSign, ShieldCheck, ThumbsUp, Heart } from 'lucide-react';
import { BRANDS, PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate, Link } from 'react-router-dom';

import { useCarousel } from '../hooks/useCarousel';

export function BrandDetailPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const brand = BRANDS[2]; // Apex or Sailor based on ref
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(1);
  const [productLineIndex, setProductLineIndex] = useState(1);
  const [suggestedIndex, setSuggestedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  const carouselItems = [
    { name: "Premium Comfort", category: "Classic Collection", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop" },
    { name: "Sailor Eid Collection", category: "Modern Fit", img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1200&h=800&fit=crop" },
    { name: "Royal Edition", category: "Luxury Series", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop" },
    { name: "Festive Spirit", category: "Seasonal Wear", img: "https://images.unsplash.com/photo-1511741454500-ddbf7ef33554?w=1200&h=800&fit=crop" }
  ];

  const productLineCarousel = useCarousel(carouselItems.length, 3500);
  const suggestedCarousel = useCarousel(3, 3000);

  const handleProductLineNext = () => setProductLineIndex((prev) => (prev + 1) % carouselItems.length);
  const handleProductLinePrev = () => setProductLineIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  const handleSuggestedNext = () => setSuggestedIndex((prev) => (prev + 1) % 4);
  const handleSuggestedPrev = () => setSuggestedIndex((prev) => (prev - 1 + 4) % 4);

  const dragStart = useRef<number | null>(null);
  
  const handleSuggestedPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    suggestedCarousel.pause();
  };
  
  const handleSuggestedPointerMove = (e: React.PointerEvent) => {
    if (dragStart.current !== null) {
      if (Math.abs(e.clientX - dragStart.current) > 5) {
        isDraggingRef.current = true;
        setIsDragging(true);
      }
    }
  };

  const handleSuggestedPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current !== null) {
      const diff = e.clientX - dragStart.current;
      if (diff > 50) suggestedCarousel.prev();
      else if (diff < -50) suggestedCarousel.next();
    }
    dragStart.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    suggestedCarousel.resume();
  };

  const brandValues = [
    { icon: <Users className="text-blue-500" />, title: "My Audience", items: ["Family Focused", "Mens Wear", "Teens & Kids", "Ethnic Style", "Teens"] },
    { icon: <TrendingUp className="text-green-500" />, title: "My Messaging", items: ["Value Driven", "Ethical", "Smart Choice", "Youth Oriented", "Stylish"] },
    { icon: <Star className="text-yellow-500" />, title: "My Appeal / Vibe", items: ["Modern Collection", "Youth Centric", "Modest Design", "Modern Fit", "Trendy"] },
    { icon: <Zap className="text-orange-500" />, title: "My Brand / Styling", items: ["Eid Collection", "Durability", "Traditional Touch", "Festive Edition", "Regular Fit"] },
    { icon: <Package className="text-purple-500" />, title: "Brand Materials", items: ["Premium Cotton", "Handcrafted", "Export Quality", "Traditional Silk", "Vibrant Colors"] },
    { icon: <Gift className="text-pink-500" />, title: "The Occasion", items: ["Wedding Wear", "Formal Wear", "Daily Casual", "Eid Special", "Cultural Fest"] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      {/* Brand Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative dark-brand-gradient pt-16 pb-8 overflow-hidden border-b border-white/5"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-primary rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full mb-8">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              {/* Left: Brand Identity */}
              <div className="flex-1 w-full">
                 <div className="flex items-center gap-4 md:gap-6 mb-6 flex-wrap">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white flex items-center justify-center text-3xl md:text-5xl font-black text-navy shadow-2xl border-4 border-white relative">
                       {brand.logo}
                       <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-orange-primary rounded-full flex items-center justify-center text-white border-[3px] md:border-4 border-[#050514] shadow-lg">
                          <CheckCircle2 size={isMobile ? 12 : 16} />
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter shrink-0">{brand.name}</h1>
                          <div className="bg-green-accent px-2 md:px-3 py-1 rounded-full flex items-center gap-2 shadow-lg w-fit">
                             <ShieldCheck size={12} className="text-white" />
                             <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest italic whitespace-nowrap">Verified Brand</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 md:gap-6 flex-wrap mt-2">
                          <div className="flex items-center gap-2">
                            <span className="white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Brand of {brand.category}</span>
                          </div>
                          <div className="h-3 w-px bg-white/10 hidden sm:block" />
                          <div className="flex items-center gap-2">
                             <Heart size={14} className="text-orange-primary fill-current" />
                             <span className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest italic">25k Loves</span>
                          </div>
                          <div className="h-3 w-px bg-white/10 hidden sm:block" />
                          <div className="flex items-center gap-2">
                             <TrendingUp size={14} className="text-green-accent" />
                             <span className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest italic">Score: 92/100</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Top Socials/Quick Stats */}
                 <div className="flex gap-3 md:gap-4 mb-8 md:mb-10 text-white flex-wrap">
                    <button className="bg-orange-primary text-white text-[10px] md:text-[11px] font-black uppercase px-6 md:px-10 py-4 md:py-5 rounded-full tracking-[0.2em] shadow-2xl shadow-orange-primary/30 hover:scale-105 active:scale-95 transition-all italic border border-white/10 flex items-center gap-2 md:gap-3">
                       <Heart size={isMobile ? 14 : 16} /> Love Brand
                    </button>
                    <button className="bg-white/10 text-white text-[10px] md:text-[11px] font-black uppercase px-6 md:px-10 py-4 md:py-5 rounded-full tracking-[0.2em] hover:bg-white/20 transition-all italic border border-white/10">
                       Follow Brand
                    </button>
                    <button className="bg-navy text-white text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-4 md:py-5 rounded-full tracking-[0.2em] hover:bg-navy/80 transition-all italic border border-white/20 flex items-center gap-2 md:gap-3">
                       <Share2 size={isMobile ? 14 : 16} /> Share
                    </button>
                 </div>
                 
                 <div className="w-full md:w-fit">
                    <button className="w-full md:w-fit bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-4 group hover:bg-white/20 transition-all">
                       <div className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
                       <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest italic">Go To Authentic Store</span>
                       <ChevronRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>

              {/* Right: Metrics Card */}
              <div className="w-full md:w-[480px]">
                 <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[30px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <div className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Expert Score</div>
                          <div className="text-6xl font-black italic">4.3 <span className="text-2xl text-white/40">/5</span></div>
                       </div>
                       <div className="text-right">
                          <div className="flex gap-1 justify-end mb-1">
                             {[1, 2, 3, 4].map(i => <Star key={i} size={14} className="fill-orange-primary text-orange-primary" />)}
                             <Star size={14} className="fill-white/20 text-white/20" />
                          </div>
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Based on 840 reviews</div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       {[
                          { label: "Quality", value: 85, color: "bg-green-accent" },
                          { label: "Longevity", value: 72, color: "bg-orange-primary" },
                          { label: "Service", value: 92, color: "bg-blue-400" },
                          { label: "Style", value: 88, color: "bg-purple-400" },
                          { label: "Price Range", value: 65, color: "bg-yellow-400" }
                       ].map((m, i) => (
                          <div key={i} className="flex items-center gap-4">
                             <div className="w-20 text-[9px] font-bold uppercase tracking-widest text-white/60">{m.label}</div>
                             <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${m.value}%` }}
                                  transition={{ delay: 0.5, duration: 1 }}
                                  className={cn("h-full rounded-full", m.color)} 
                                />
                             </div>
                             <div className="w-8 text-[10px] font-black text-right">{m.value}%</div>
                          </div>
                       ))}
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                       <div className="w-10 h-10 rounded-full blue-brand-gradient flex items-center justify-center">
                          <TrendingUp size={20} />
                       </div>
                       <div>
                          <div className="text-sm font-black italic">850+ Socials</div>
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Community Approved</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Global Breadcrumbs in Hero Area */}
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full mb-4">
          <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link to="/brands" className="hover:text-white transition-colors">Brands</Link>
            <ChevronRight size={10} />
            <span className="text-white">Sailor</span>
          </div>
        </div>
      </motion.section>

      {/* Product Line Title */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="product-line" 
        className="bg-white pt-12 pb-16"
      >
        <div className="max-w-7xl mx-auto px-8 text-center mb-12">
           <h2 className="text-4xl font-black text-navy italic tracking-tighter mb-3 uppercase italic">Product Line</h2>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">Sailor's Trending Elements</p>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center gap-3 md:gap-5 h-[400px] md:h-[580px]">
            {carouselItems.map((item, i) => {
              const isActive = i === productLineIndex;
              
              return (
                <motion.div
                  key={i}
                  onClick={() => setProductLineIndex(i)}
                  initial={false}
                  animate={{
                    width: isActive ? (isMobile ? '100%' : '60%') : (isMobile ? '0%' : '13%'),
                    flex: isActive ? 10 : 1,
                    opacity: isActive ? 1 : 0.7,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  className={cn(
                    "relative h-full rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer group",
                    !isActive && "hidden md:block"
                  )}
                >
                  <img 
                    src={item.img} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    alt={item.name} 
                  />
                  <div className={cn(
                     "absolute inset-0 transition-opacity duration-700",
                     isActive ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent" : "bg-black/30"
                  )} />

                  {/* Vertical Text for Inactive */}
                  {!isActive && (
                    <div className="absolute inset-x-0 bottom-12 flex justify-center translate-y-10 group-hover:translate-y-0 transition-transform">
                      <span className="text-white/80 text-[11px] font-black uppercase tracking-[0.5em] italic origin-center rotate-[-90deg] whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  )}

                  {/* Active Content - Text Title Only as requested */}
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute inset-0 p-12 flex flex-col justify-end items-start"
                    >
                      <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">
                        {item.name}
                      </h3>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center justify-center gap-12">
          <div className="flex gap-4">
            {carouselItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setProductLineIndex(i)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  productLineIndex === i ? "w-20 bg-orange-primary" : "w-3 bg-gray-200"
                )}
              />
            ))}
          </div>
          
          <div className="flex gap-6">
            <button 
              onClick={handleProductLinePrev} 
              className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleProductLineNext} 
              className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Brand Attributes Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white py-16 border-b border-gray-100"
      >
         <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
               {brandValues.map((value, i) => (
                  <div key={i} className="group">
                     <div className="flex items-center gap-6 mb-8">
                        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-navy/10 transform group-hover:rotate-6">
                           {React.cloneElement(value.icon as React.ReactElement<any>, { size: 24, className: cn((value.icon as any).props.className, "group-hover:text-white") })}
                        </div>
                        <h4 className="text-xl font-black text-navy italic tracking-tight">{value.title}</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {value.items.map((item, j) => (
                           <div key={j} className="flex items-center gap-2 pl-1 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full group-hover:border-navy/10 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-primary" />
                              <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider whitespace-nowrap">{item}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </motion.section>

      {/* Recommendations & Price Check */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#F8FAFC] py-16 overflow-hidden"
      >
         <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col lg:flex-row gap-20">
               {/* Left: Top Suggested Products */}
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                        <h3 className="text-3xl font-black text-navy italic tracking-tighter mb-2 uppercase">Top Suggested Products</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Sailor Best Selling Items</p>
                     </div>
                     <Link to="/products" className="text-[10px] font-black text-orange-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">View All Lineup</Link>
                  </div>
                  
                  <div className="relative w-full h-[400px] md:h-[480px]">
                     <div className="flex items-center justify-center gap-3 h-full">
                        {PRODUCTS.slice(0, 4).map((p, i) => {
                           const isActive = i === suggestedIndex;
                           
                           return (
                             <motion.div
                               key={p.id}
                               onClick={() => setSuggestedIndex(i)}
                               initial={false}
                               animate={{
                                 width: isActive ? (isMobile ? '100%' : '60%') : (isMobile ? '0%' : '15%'),
                                 flex: isActive ? 8 : 1,
                                 opacity: isActive ? 1 : 0.6,
                               }}
                               transition={{
                                 type: "spring",
                                 stiffness: 100,
                                 damping: 20
                               }}
                               className={cn(
                                 "relative h-full rounded-[24px] md:rounded-[30px] overflow-hidden cursor-pointer group",
                                 !isActive && "hidden md:block" // Hide side cards on mobile
                               )}
                             >
                               <img 
                                 src={p.image} 
                                 className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                                 alt={p.title} 
                               />
                               <div className={cn(
                                  "absolute inset-0 transition-opacity duration-700",
                                  isActive ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent" : "bg-black/40"
                               )} />

                               {!isActive && (
                                 <div className="absolute inset-x-0 bottom-12 flex justify-center translate-y-10 group-hover:translate-y-0 transition-transform">
                                   <span className="text-white/80 text-[9px] font-black uppercase tracking-[0.5em] italic origin-center rotate-[-90deg] whitespace-nowrap">
                                     {p.title}
                                   </span>
                                 </div>
                               )}

                               {isActive && (
                                 <motion.div 
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.3 }}
                                   className="absolute inset-0 p-8 flex flex-col justify-end items-start"
                                 >
                                    <div className="flex items-center gap-2 mb-4 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                       <div className="w-5 h-5 rounded-full bg-orange-primary flex items-center justify-center text-white">
                                          <Star size={10} className="fill-current" />
                                       </div>
                                       <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] italic">TOP PICK</span>
                                    </div>
                                    <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">
                                       {p.title}
                                    </h4>
                                 </motion.div>
                               )}
                             </motion.div>
                           );
                        })}
                     </div>
                  </div>

                  {/* Navigator for Compact Carousel */}
                  <div className="mt-8 flex items-center justify-center md:justify-start gap-10">
                     <div className="flex gap-3">
                       {[0, 1, 2, 3].map((i) => (
                         <button
                           key={i}
                           onClick={() => setSuggestedIndex(i)}
                           className={cn(
                             "h-1 transition-all duration-500 rounded-full",
                             suggestedIndex === i ? "w-12 bg-orange-primary" : "w-2 bg-gray-300"
                           )}
                         />
                       ))}
                     </div>
                     <div className="flex gap-4">
                        <button onClick={handleSuggestedPrev} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all">
                           <ChevronLeft size={18} />
                        </button>
                        <button onClick={handleSuggestedNext} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all">
                           <ChevronRight size={18} />
                        </button>
                     </div>
                  </div>
               </div>

               {/* Right: Review Analysis & Comparison Highlights */}
               <div className="w-full lg:w-[480px] space-y-8">
                  <div className="bg-white rounded-[40px] p-10 shadow-soft border border-gray-50">
                     <div className="flex items-center justify-between mb-10">
                        <h4 className="font-black text-navy italic tracking-tight text-xl text-center">Review Analysis</h4>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-accent/10 sm:text-green-accent rounded-full">
                           <ShieldCheck size={14} className="text-green-accent" />
                           <span className="text-[10px] font-bold uppercase text-green-accent tracking-widest italic">Digitally Selected</span>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-10">
                        <div>
                           <div className="flex items-center gap-2 mb-4 text-green-500">
                              <TrendingUp size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Pros</span>
                           </div>
                           <ul className="space-y-3">
                              {["Value Price", "Stylish Build", "Youth Choice", "Durable Fabric"].map((item, i) => (
                                 <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-500 italic">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {item}
                                 </li>
                              ))}
                           </ul>
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-4 text-red-500">
                              <AlertCircle size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Cons</span>
                           </div>
                           <ul className="space-y-3">
                              {["Sizing Issue", "High Cost", "Limited Stock", "Online Only"].map((item, i) => (
                                 <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-400 italic">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                                    {item}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>

                     <div className="mt-12 p-8 bg-gray-50 rounded-[30px] relative overflow-hidden group">
                        <div className="flex items-start gap-6">
                           <div className="text-6xl font-black text-navy/10 italic leading-none">A+</div>
                           <div>
                              <div className="text-xs font-black text-navy uppercase tracking-widest mb-2 italic">Expert Rating</div>
                              <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                                Sailor has consistently maintained high scores across style and ethnic quality, making it a top choice for festive fashion in 2024.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </motion.section>

      {/* Comparison Section Header */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white py-16"
      >
         <div className="max-w-7xl mx-auto px-8">
            <h3 className="text-3xl font-black text-navy italic tracking-tighter mb-12 text-center uppercase italic underline decoration-orange-primary underline-offset-8">Similar Brands Comparison</h3>
            
            <div className="overflow-x-auto no-scrollbar rounded-[30px] border border-gray-100 shadow-soft bg-white">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Brand Identity</th>
                        <th className="py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic text-center">Quality</th>
                        <th className="py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic text-center">Service</th>
                        <th className="py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic text-center">Price Range</th>
                        <th className="py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic text-center">Materials</th>
                        <th className="py-6 px-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic text-center">Rating</th>
                        <th className="py-6 px-8 text-[11px] font-black text-navy uppercase tracking-widest text-right italic">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {[
                        { name: "Apex Brand", id: 3, logo: "A", quality: "Premium", service: "Excellent", price: "High (৳৳৳)", mat: "P. Cotton", score: "4.8" },
                        { name: "Aarong Brand", id: 10, logo: "A", quality: "Elite", service: "Good", price: "Mid (৳৳)", mat: "Pure Silk", score: "4.7" },
                        { name: "Lotto Wear", id: 6, logo: "L", quality: "Basic", service: "Fast", price: "Economy (৳)", mat: "Synthetic", score: "4.2" },
                        { name: "Yellow Shop", id: 11, logo: "Y", quality: "Fashion", service: "Med", price: "Premium (৳৳৳)", mat: "Cotton Blend", score: "4.5" }
                     ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="py-6 px-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-navy text-white font-black flex items-center justify-center text-sm">{item.logo}</div>
                                 <span className="font-black text-navy italic text-sm">{item.name}</span>
                              </div>
                           </td>
                           <td className="py-6 px-8 text-center"><span className="px-3 py-1 bg-green-accent text-white text-[9px] font-black uppercase rounded-full tracking-widest italic">{item.quality}</span></td>
                           <td className="py-6 px-8 text-center text-xs font-bold text-gray-400 italic uppercase tracking-wider">{item.service}</td>
                           <td className="py-6 px-8 text-center text-xs font-bold text-navy italic">{item.price}</td>
                           <td className="py-6 px-8 text-center text-xs font-bold text-gray-400 italic">{item.mat}</td>
                           <td className="py-6 px-8 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                 <Star size={12} className="fill-orange-primary text-orange-primary" />
                                 <span className="font-black text-navy text-xs italic">{item.score}</span>
                              </div>
                           </td>
                           <td className="py-6 px-8 text-right">
                              <Link to={`/brands/${item.id}`} className="px-6 py-2 border-2 border-navy text-navy font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-navy hover:text-white transition-all transform hover:scale-105 italic inline-block">Visit Page</Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </motion.section>

      {/* Influencer & Youtuber Reviews */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#050514] py-16 overflow-hidden relative border-b border-white/5"
      >
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         
         <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full px-6 py-2 flex items-center gap-3 shadow-xl transform -translate-y-12">
               <Users size={16} className="text-orange-primary" />
               <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">Creator Community</span>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-8 relative">
            <div className="text-center mb-16">
               <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4 uppercase leading-none">Influencer & Youtuber Reviews</h3>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic mb-2">Trusted Experts Breaking Down {brand.name}</p>
            </div>

            {/* Featured Row */}
            <div className="bg-white rounded-[32px] overflow-hidden mb-12 shadow-2xl flex flex-col lg:flex-row border border-white/5 bg-white/5 backdrop-blur-xl text-navy">
               <div className="lg:w-3/5 relative group h-[400px] lg:h-auto min-h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    alt="Featured Review"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-8 left-8">
                     <span className="bg-orange-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic flex items-center gap-2 shadow-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> TRENDING NOW
                     </span>
                  </div>
                  <div className="absolute top-8 right-8">
                     <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Youtube size={24} />
                     </div>
                  </div>
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                     <Play size={28} className="fill-current ml-1" />
                  </button>
                  <div className="absolute bottom-10 left-10 text-white flex gap-6 items-end">
                     <div className="flex flex-col items-start">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2 italic">Creator Spotlight</p>
                        <h4 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-1">{brand.name} Special Edition</h4>
                        <div className="w-20 h-1.5 bg-orange-primary rounded-full mt-2" />
                     </div>
                  </div>
               </div>
               <div className="lg:w-2/5 p-12 flex flex-col justify-center bg-white relative">
                  <span className="text-[10px] font-black text-orange-primary uppercase tracking-[0.4em] mb-6 block italic px-3 py-1 border-l-2 border-orange-primary w-fit">IN-DEPTH REVIEW</span>
                  <h4 className="text-3xl md:text-4xl font-black text-navy italic tracking-tighter leading-tight mb-6">Why {brand.name} remains a Top Choice in 2024!</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                    Watch as we dive deep into the performance and build quality of {brand.name}'s latest collection. From real-world testing to expert analysis.
                  </p>
                  
                  <div className="w-full h-[1px] bg-gray-100 mb-8" />
                  
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <div className="text-xs font-black text-navy italic uppercase tracking-wider mb-1">Tech Review BD</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live from Dhaka</div>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white text-[10px] font-black uppercase tracking-tight shadow-xl italic">Choosify.bd</div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Portrait Card */}
               <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-white/5 flex flex-col group lg:row-span-1 h-[600px] relative">
                  <div className="absolute inset-0">
                     <img 
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        alt="Reel Review"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  </div>
                  
                  <div className="absolute top-8 left-8">
                     <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                        <Smartphone size={18} />
                     </div>
                  </div>

                  <div className="absolute top-8 right-8">
                     <span className="bg-orange-primary/90 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic flex items-center gap-2">
                        Product Reel <Zap size={10} className="fill-current" />
                     </span>
                  </div>

                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform scale-90 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100">
                     <Play size={24} className="fill-current ml-1" />
                  </button>

                  <div className="absolute bottom-24 left-8 right-8">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                 <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-full h-full object-cover" alt="avatar" />
                              </div>
                           ))}
                        </div>
                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">+25k Views</span>
                     </div>
                     <h5 className="text-2xl font-black text-white italic tracking-tighter mb-2 leading-tight">{brand.name} Style Showcase</h5>
                  </div>

                  <div className="mt-auto p-8 relative z-10 flex items-center justify-between bg-black/20 backdrop-blur-md">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-primary overflow-hidden">
                            <img src="https://i.pravatar.cc/100?img=44" className="w-full h-full object-cover" alt="Fashion Ally" />
                         </div>
                         <div>
                            <div className="text-xs font-black text-white italic">Style Maven</div>
                            <div className="text-[9px] font-bold text-white/50">@stylemaven • 1.2m</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 text-orange-primary">
                         <Star size={10} className="fill-current" />
                         <span className="text-[10px] font-black">5.0</span>
                      </div>
                  </div>
               </div>

               {/* Regular Square Cards Container */}
               <div className="flex flex-col gap-8 lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                     {/* Square Card 1 */}
                     <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col group h-full">
                        <div className="relative h-64 overflow-hidden">
                           <img 
                              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                              alt="Review Card"
                           />
                           <div className="absolute inset-0 bg-navy/20" />
                           <div className="absolute top-6 right-6">
                              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                                 <Youtube size={20} />
                              </div>
                           </div>
                           <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform scale-0 group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                              <Play size={20} className="fill-current ml-1" />
                           </button>
                        </div>
                        <div className="p-8 flex-1 flex flex-col text-navy">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-1.5">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-orange-primary text-orange-primary" />)}
                              </div>
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Authentic</span>
                           </div>
                           <h5 className="text-xl font-black text-navy italic tracking-tighter leading-tight mb-4">{brand.name} Collection: A Deep Dive</h5>
                           <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 italic">
                              Testing the durability and comfort of this latest {brand.name} release.
                           </p>
                           
                           <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-white font-black text-[10px] shadow-lg italic">RD</div>
                                  <div>
                                     <div className="text-xs font-black text-navy italic">BD Tech Guys</div>
                                     <div className="text-[9px] font-bold text-gray-400">@bdtechguys • 420k</div>
                                  </div>
                               </div>
                               <Heart size={16} className="text-gray-200 group-hover:text-red-500 transition-colors" />
                           </div>
                        </div>
                     </div>

                     {/* Square Card 2 */}
                     <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col group h-full">
                        <div className="relative h-64 overflow-hidden">
                           <img 
                              src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                              alt="Review Card"
                           />
                           <div className="absolute inset-0 bg-navy/20" />
                           <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform scale-0 group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                              <Play size={20} className="fill-current ml-1" />
                           </button>
                        </div>
                        <div className="p-8 flex-1 flex flex-col text-navy">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-1.5">
                                 {[1,2,3,4].map(i => <Star key={i} size={10} className="fill-orange-primary text-orange-primary" />)}
                              </div>
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Review</span>
                           </div>
                           <h5 className="text-xl font-black text-navy italic tracking-tighter leading-tight mb-4">Finding The Perfect Build in {brand.name}</h5>
                           <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 italic">
                              Exploring original luxury quality and how to verify authenticity.
                           </p>
                           
                           <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-orange-primary text-white flex items-center justify-center text-white font-black text-[10px] shadow-lg italic">AM</div>
                                  <div>
                                     <div className="text-xs font-black text-navy italic">Auntie Mirpur</div>
                                     <div className="text-[9px] font-bold text-gray-400">@auntiemirpur • 150k</div>
                                  </div>
                               </div>
                               <Heart size={16} className="text-gray-200 group-hover:text-red-500 transition-colors" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </motion.section>

      {/* Public Review Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#F8FAFC] py-16 border-t border-gray-100"
      >
         <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
               <h3 className="text-4xl font-black text-navy italic tracking-tighter mb-4 uppercase">Public Reviews</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] italic px-4 py-1.5 border border-gray-100 rounded-full w-fit mx-auto bg-white">Verified Customer Experiences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {[
                  {
                     name: "Tanvir Hasan",
                     date: "2 weeks ago",
                     purchaseDate: "April 2024",
                     comment: "The fabric quality of the new Sailor Eid collection is absolutely top-notch. I was skeptical about the price but after wearing it once, I can say it's worth every taka. The fit is perfect for large build individuals as well.",
                     rating: 5,
                     verified: true,
                     productImages: [
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"
                     ],
                     dp: "https://i.pravatar.cc/150?u=tanvir",
                     helpful: 124,
                     unhelpful: 2
                  },
                  {
                     name: "Nusrat Jahan",
                     date: "1 month ago",
                     purchaseDate: "March 2024",
                     comment: "Beautiful designs! I bought three different items and all of them were delivered on time. The online sizing chart was very accurate which was a relief. Highly recommend the fusion wear collection.",
                     rating: 4.8,
                     verified: true,
                     productImages: [
                        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop"
                     ],
                     dp: "https://i.pravatar.cc/150?u=nusrat",
                     helpful: 89,
                     unhelpful: 5
                  }
               ].map((review, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="bg-white rounded-[40px] p-10 shadow-soft border border-gray-100 flex flex-col group hover:shadow-2xl transition-all duration-500"
                  >
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-primary shadow-lg p-0.5">
                              <img src={review.dp} className="w-full h-full object-cover rounded-[14px]" alt={review.name} />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="font-black text-navy italic tracking-tight text-lg">{review.name}</span>
                                 {review.verified && (
                                    <div className="flex items-center gap-1 bg-green-accent/10 px-2 py-0.5 rounded-full">
                                       <CheckCircle2 size={10} className="text-green-accent" />
                                       <span className="text-[8px] font-black uppercase text-green-accent italic">Verified</span>
                                    </div>
                                 )}
                              </div>
                              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Posted {review.date}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center gap-1 mb-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                 <Star 
                                    key={star} 
                                    size={12} 
                                    className={cn(
                                       "fill-current",
                                       star <= review.rating ? "text-orange-primary" : "text-gray-100"
                                    )} 
                                 />
                              ))}
                           </div>
                           <div className="text-lg font-black text-navy italic">{review.rating} <span className="text-[10px] text-gray-300">/ 5</span></div>
                        </div>
                     </div>

                     {/* Product Images */}
                     <div className="flex gap-3 mb-8">
                        {review.productImages.map((img, j) => (
                           <div key={j} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-50 group-hover:border-navy/10 transition-colors cursor-zoom-in">
                              <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="product review" />
                           </div>
                        ))}
                     </div>

                     <div className="p-8 bg-gray-50 rounded-[30px] mb-8 relative">
                        <div className="absolute top-4 right-6 text-4xl font-black text-navy/5 italic">"</div>
                        <p className="text-sm text-navy/80 font-bold leading-relaxed italic">
                           {review.comment}
                        </p>
                     </div>

                     <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-6">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Purchase Date</span>
                              <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">{review.purchaseDate}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-100 hover:border-navy hover:text-navy transition-all shadow-sm group/btn">
                              <ThumbsUp size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                              <span className="text-[10px] font-black uppercase tracking-widest italic">Helpful ({review.helpful})</span>
                           </button>
                           <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                              <ThumbsUp size={14} className="rotate-180" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
            
            <div className="mt-16 flex justify-center">
               <button className="px-12 py-4 border-2 border-navy text-navy font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-navy hover:text-white transition-all transform hover:scale-105 active:scale-95 italic">Load More Reviews</button>
            </div>
         </div>
      </motion.section>

      {/* Brand Deals Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white py-16 border-t border-gray-100 relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 w-1/4 h-full bg-orange-primary/5 blur-[100px] rounded-full translate-x-1/2" />
         <div className="max-w-7xl mx-auto px-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
               <div>
                  <h3 className="text-4xl font-black text-navy italic tracking-tighter mb-4 uppercase">Exclusive Brand Promot Codes</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] italic mb-2">Limited Time Offers & Vouchers</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { title: "Eid Special Voucher", discount: "20% OFF", code: "EID2024", expiry: "Valid till June 30", icon: <Gift /> },
                  { title: "First Purchase Offer", discount: "৳ 500 FLAT", code: "WELCOME500", expiry: "New Users Only", icon: <DollarSign /> },
                  { title: "Free Shipping", discount: "MIN ৳ 2000", code: "FREESHIP", expiry: "Selected Areas", icon: <Package /> }
               ].map((deal, i) => (
                  <motion.div 
                     key={i}
                     whileHover={{ y: -10 }}
                     className="bg-gray-50 rounded-[30px] p-8 border border-gray-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl transition-all duration-500"
                  >
                     <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-navy mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        {React.cloneElement(deal.icon as React.ReactElement<any>, { size: 28 })}
                     </div>
                     <h4 className="text-xl font-black text-navy italic tracking-tight mb-2">{deal.title}</h4>
                     <div className="text-3xl font-black text-orange-primary italic tracking-tighter mb-6 underline decoration-navy/10 underline-offset-8">
                        {deal.discount}
                     </div>
                     
                     <div className="w-full p-4 bg-white rounded-2xl border-2 border-dashed border-gray-200 mb-6 flex flex-col items-center relative overflow-hidden group/code">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gray-50 rotate-45 translate-x-1/2 -translate-y-1/2 border-l border-b border-gray-100" />
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 italic">Promo Code</span>
                        <span className="text-xl font-black text-navy tracking-[0.2em]">{deal.code}</span>
                     </div>
                     
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{deal.expiry}</span>
                  </motion.div>
               ))}
            </div>
         </div>
      </motion.section>
    </div>
  );
}
