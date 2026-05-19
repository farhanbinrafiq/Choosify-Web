import React, { useState } from 'react';
import { BookOpen, Search, Youtube, ArrowRight, User, Calendar, LucidePenTool, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOGS } from '../constants';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { RecommendationCard } from '../components/RecommendationCard';

export function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const recommendationTitles = [
    'Top 10 Smartphones 2026',
    'Best Gadgets Under 1,000 BDT',
    'Best Noise Cancelling Headphones',
    'Ultimate Buying Guide: Smartwatches',
    'Top Laptops for Students 2026',
    'Best Power Banks in Bangladesh',
    'Wireless Earbuds Buying Guide',
    'Best Cameras Under 30,000',
    'Gaming Setup Guide 2026',
    'Top Fitness Trackers'
  ];

  return (
    <div id="guides-root" className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Hero Section */}
      <div id="guides-hero" className="w-full bg-[#0A0A1F] py-24 px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D1D] via-[#0A0A1F] to-[#0A0A1F] opacity-80" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 id="hero-title" className="text-[60px] md:text-[80px] font-black italic uppercase tracking-tighter mb-6 leading-none text-white transition-transform hover:scale-105 duration-700">
            RECOMMENDATIONS
          </h1>

          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[11px] md:text-[13px] mb-12 uppercase tracking-[0.2em] opacity-80 leading-relaxed">
            DISCOVER EXPERT GUIDES, BUYING ADVICE, AND LATEST TECH RECOMMENDATIONS
          </p>
 
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center mb-20">
             <button className="h-16 px-8 orange-brand-gradient text-white font-black rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap uppercase tracking-widest text-[10px] italic hover:brightness-110 transition-all">
                <LucidePenTool size={16} /> Post Recommendation
             </button>
             <div className="flex-1 w-full relative group">
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
                 placeholder="Search by Brand Name or Category..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-16 pl-24 pr-8 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-orange-primary/40 transition-all font-bold placeholder:text-white/20 shadow-3xl text-[13px] italic tracking-wide" 
                />
             </div>
          </div>
 
          {/* Article Titles Marquee */}
          <div className="w-full overflow-hidden py-4 border-y border-white/5 relative">
            <motion.div 
               animate={{ x: [0, -2000] }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="flex whitespace-nowrap gap-12"
            >
               {recommendationTitles.map((title, i) => (
                 <span 
                   key={i} 
                   className={cn(
                     "text-4xl md:text-5xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                     "text-white/10",
                     "hover:text-orange-primary hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
                   )}
                 >
                     {title}
                 </span>
               ))}
               {/* Loop Duplicate */}
               {recommendationTitles.map((title, i) => (
                 <span 
                   key={`dup-${i}`} 
                   className={cn(
                     "text-4xl md:text-5xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                     "text-white/10",
                     "hover:text-orange-primary hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
                   )}
                 >
                     {title}
                 </span>
               ))}
            </motion.div>
          </div>
        </div>
      </div>


      {/* Category Nav Bar (Mobile/Tablet Only) */}
      <div className="w-full bg-white border-b border-gray-100 px-8 sticky top-20 z-40 shadow-sm overflow-x-auto scrollbar-hide lg:hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 py-4 min-w-max">
           {[
             { name: 'All', active: true },
             { name: 'Mobile', icon: '📱' },
             { name: 'Electronics', icon: '🔌' },
             { name: 'Car / Bike', icon: '🚗' },
             { name: 'Gadgets', icon: '⌚' },
             { name: 'Home Appliances', icon: '🏠' },
             { name: 'Beauty Care', icon: '💄' },
             { name: 'Hotels', icon: '🏨' },
             { name: 'Computer', icon: '💻' },
             { name: 'Medical', icon: '🏥' }
           ].map((cat) => (
             <button 
                key={cat.name} 
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  cat.active 
                  ? 'bg-orange-primary text-white shadow-lg shadow-orange-primary/20' 
                  : 'bg-ice-blue/50 text-navy/60 hover:bg-ice-blue hover:text-navy border border-gray-200/50'
                }`}
             >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
             </button>
           ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 w-full py-20 flex flex-col lg:flex-row gap-12 relative z-10">
         {/* Left Sidebar Navigation */}
         <aside className="w-full lg:w-48 lg:sticky lg:top-36 h-max space-y-3 hidden lg:block shrink-0">
            <h4 className="text-[10px] font-black text-navy uppercase tracking-[0.4em] mb-4 italic opacity-30 px-4">Categories</h4>
            {[
              { name: 'All', active: true },
              { name: 'Mobile', icon: '📱' },
              { name: 'Electronics', icon: '🔌' },
              { name: 'Car / Bike', icon: '🚗' },
              { name: 'Gadgets', icon: '⌚' },
              { name: 'Home Appliances', icon: '🏠' },
              { name: 'Beauty Care', icon: '💄' },
              { name: 'Hotels', icon: '🏨' },
              { name: 'Computer', icon: '💻' },
              { name: 'Medical', icon: '🏥' }
            ].map((cat) => (
              <button 
                key={cat.name} 
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all w-full text-left italic group",
                  cat.active 
                  ? 'bg-orange-primary text-white shadow-lg shadow-orange-primary/20' 
                  : 'text-navy/60 hover:bg-orange-primary/5 hover:text-orange-primary'
                )}
              >
                <span className="group-hover:scale-125 transition-transform text-[14px]">{cat.icon || '🔥'}</span>
                {cat.name}
              </button>
            ))}
         </aside>

         <div className="flex-1 min-w-0">
            {/* Featured Guide */}
            <div className="mb-16">
               <RecommendationCard 
                 guide={BLOGS[0]} 
                 index={0} 
                 variant="featured" 
               />
            </div>

            {/* Content Feed - Varied grid for articles and shorts */}
            <div className="flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10 auto-rows-min">
                   {BLOGS.slice(1).map((guide, i) => {
                      const isShorts = guide.type === 'shorts' || guide.type === 'reels';
                      return (
                        <div 
                          key={guide.id}
                          className={cn(
                            "transition-all duration-500",
                            isShorts ? "col-span-1" : "col-span-1" // Keeping it balanced grid
                          )}
                        >
                          <RecommendationCard guide={guide} index={i + 1} />
                        </div>
                      );
                   })}
                </div>
            </div>
            
            {/* Pagination Component */}
            <div className="mt-24 pt-16 border-t border-gray-100 flex flex-col items-center gap-10">
               <div className="flex items-center gap-3">
                  <button className="w-12 h-12 rounded-[20px] flex items-center justify-center bg-white border border-gray-100 text-navy hover:bg-orange-primary hover:text-white hover:border-orange-primary transition-all shadow-lg group">
                     <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  {[1, 2, 3, '...', 12].map((page, i) => (
                    <button 
                      key={i} 
                      className={cn(
                        "w-12 h-12 rounded-[20px] flex items-center justify-center text-[11px] font-black transition-all italic",
                        page === 1 
                        ? "bg-orange-primary text-white shadow-xl shadow-orange-primary/30" 
                        : "bg-white border border-gray-100 text-navy hover:border-orange-primary hover:text-orange-primary shadow-sm"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="w-12 h-12 rounded-[20px] flex items-center justify-center bg-white border border-gray-100 text-navy hover:bg-orange-primary hover:text-white hover:border-orange-primary transition-all shadow-lg group">
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
               
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Results 1-8 of 156 Stories</p>
            </div>

         </div>

         {/* Right Sidebar Widgets */}
         <aside className="w-full lg:w-[320px] space-y-8 shrink-0 relative z-10">
            {/* Newsletter Widget */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-gray-100/50">
               <h4 className="font-black text-orange-primary text-[10px] uppercase tracking-[0.4em] mb-4 italic">NEWSLETTER</h4>
               <p className="text-navy text-[16px] font-black italic leading-tight mb-8">Get the latest industry style fresh look straight to your inbox.</p>
               <div className="space-y-4">
                  <input 
                     type="email" 
                     placeholder="Enter your email address..." 
                     className="w-full bg-white border border-gray-100 rounded-xl py-4 px-6 text-xs font-bold text-navy outline-none italic placeholder:text-gray-300 shadow-inner" 
                  />
                  <button className="w-full py-4 bg-orange-primary text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] italic shadow-lg shadow-orange-primary/30 hover:brightness-110 active:scale-[0.98] transition-all">
                     Subscribe Now
                  </button>
               </div>
            </div>

            {/* Popular Topics Widget */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-gray-100/50">
               <h4 className="font-black text-navy text-[10px] uppercase tracking-[0.4em] mb-8 italic opacity-30">POPULAR TOPICS</h4>
               <div className="space-y-6">
                  {[
                     { title: 'Best Cheap Brands For Everyone That Looks Great Always', cat: 'FASHION', reads: '5K READS', img: 'https://images.unsplash.com/photo-1546868823-05b0521e4cba?w=100' },
                     { title: 'Winter Skin Care Essentials for BD Climate', cat: 'BEAUTY', reads: '12K READS', img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=100' },
                     { title: 'Top 10 Smartwatches in Bangladesh 2026', cat: 'GADGETS', reads: '2K READS', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=100' },
                     { title: 'How To Choose Your First DSLR Camera', cat: 'ELECTRONICS', reads: '4K READS', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100' },
                     { title: 'Luxury Watches Every Man Should Own', cat: 'FASHION', reads: '3K READS', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100' }
                  ].map((topic, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer items-start">
                       <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm">
                          <img src={topic.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <div className="flex-1 pt-1">
                          <h5 className="font-black text-navy text-[11px] leading-tight group-hover:text-orange-primary transition-colors mb-1 italic uppercase tracking-tight">
                             {topic.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest italic">
                             <span>{topic.cat}</span>
                             <span className="opacity-30">•</span>
                             <span>{topic.reads}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-3.5 bg-gray-50 text-gray-400 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-navy hover:text-white transition-all border border-gray-100 italic">
                  LOAD MORE
               </button>
            </div>

            <div className="bg-navy rounded-[24px] p-10 text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><Search size={120} /></div>
               <h4 className="text-xl font-black mb-4 italic uppercase tracking-tighter">Need Customer Help?</h4>
               <p className="text-white/40 text-xs font-medium leading-relaxed mb-10 italic">Ask our AI Shopping Assistant for a personalized recommendation based on your budget & lifestyle.</p>
               <button className="w-full py-5 bg-orange-primary text-white font-black rounded-[12px] uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-orange-primary/20 flex items-center justify-center gap-2 hover:bg-white hover:text-navy transition-all active:scale-95 italic">
                 Start AI Chat
               </button>
            </div>
         </aside>
      </main>
    </div>
  );
}
