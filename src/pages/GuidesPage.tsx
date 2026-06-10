import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, Youtube, ArrowRight, User, Calendar, LucidePenTool, Heart, Shirt, Smartphone, Tv, Compass, Baby, Smile, Car, Droplets, Bookmark, Eye, Share2, Play, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOGS } from '../constants';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { RecommendationCard } from '../components/RecommendationCard';
import { RecommendationCardSkeleton } from '../components/Skeleton';

// Sub-component for Featured Story (Segment 1 of reference image)
function FeaturedCard({ guide }: { guide: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group cursor-pointer block bg-white rounded-2xl border border-[#e8edf2] p-5 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-300 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[16/9] md:aspect-[2.2/1] w-full relative overflow-hidden bg-slate-950 rounded-xl">
        {guide.videoUrl ? (
          <video
            ref={videoRef}
            src={guide.videoUrl}
            poster={guide.image}
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
          />
        ) : (
          <img
            src={guide.image}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
            alt="Featured"
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-15 pointer-events-none" />

        {/* Badge: Featured Story */}
        <div className="absolute top-5 left-5 z-20">
          <div className="bg-[#E8500A] px-3.5 py-1.5 rounded-[8px] flex items-center justify-center border border-white/10 shadow-sm">
            <span className="text-[10px] font-black tracking-wider text-white uppercase leading-none">★ FEATURED</span>
          </div>
        </div>

        {/* Platform logo top-right */}
        <div className="absolute top-5 right-5 z-20 flex flex-col items-center gap-0.5">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
            <Youtube size={18} />
          </div>
          <span className="text-[9px] font-black tracking-wider text-white uppercase drop-shadow-md">Youtube</span>
        </div>

        {/* Centered Red Play Button */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center z-10 transition-all duration-300",
          isHovering ? "opacity-0 scale-[1.1]" : "opacity-100 scale-100"
        )}>
          <div className="w-16 h-16 rounded-full bg-[#E02424] flex items-center justify-center border border-white/20 shadow-lg">
            <Play className="text-white fill-white ml-1" size={24} />
          </div>
        </div>

        {/* Bottom Time Pill */}
        <div className="absolute bottom-5 right-5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-[4px] text-[10px] font-mono font-bold text-white tracking-widest border border-white/10 leading-none">
          {guide.duration || '8:10'}
        </div>
      </div>

      {/* Content Section below Media */}
      <div className="pt-5 flex flex-col gap-2.5">
        <h3 className="font-sans text-xl md:text-3xl font-black italic uppercase tracking-tighter text-[#0c133c] leading-tight hover:text-orange-primary transition-colors text-left">
          {guide.title}
        </h3>
        
        <p className="text-gray-500 font-semibold text-xs md:text-sm leading-relaxed text-left max-w-4xl">
          {guide.excerpt || "Top 10 Smartphones to Buy in 2026. Find the best phone deals............"}
        </p>

        {/* Footer with Stats and Bookmark */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-6 text-[11px] font-black text-[#8a92a6] uppercase tracking-wider italic">
            <span className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
              <Heart size={15} className="text-rose-500 stroke-[2.5]" /> {guide.shares || '12k'}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={15} className="text-[#8a92a6] stroke-[2.5]" /> {guide.views || '1.2k'}
            </span>
            <span className="flex items-center gap-1.5">
              <Share2 size={15} className="text-[#8a92a6] stroke-[2.5]" /> 450
            </span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={cn(
              "w-9 h-9 rounded-full bg-white border flex items-center justify-center transition-all cursor-pointer shadow-none",
              isBookmarked 
                ? "border-orange-primary text-orange-primary bg-orange-primary/5" 
                : "border-[#e8edf2] text-gray-400 hover:text-orange-primary hover:border-orange-primary"
            )}
          >
            <Bookmark className={cn("w-4 h-4", isBookmarked ? "fill-current" : "")} />
          </button>
        </div>
      </div>
    </Link>
  );
}

// Sub-component for Reel Story (Segment 2 of reference image)
function ReelCard({ guide }: { guide: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group cursor-pointer block bg-white rounded-2xl border border-[#e8edf2] p-4 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-300 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[9/16] w-full relative overflow-hidden bg-slate-950 rounded-xl">
        {guide.videoUrl ? (
          <video
            ref={videoRef}
            src={guide.videoUrl}
            poster={guide.image}
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
          />
        ) : (
          <img
            src={guide.image}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
            alt="Reel"
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10 pointer-events-none" />

        {/* Badge: Reel */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white px-2.5 py-1 rounded-[6px] border border-gray-100 shadow-xs flex items-center justify-center">
            <span className="text-[9px] font-black text-black uppercase tracking-wider leading-none">REEL</span>
          </div>
        </div>

        {/* Platform logo top-right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-0.5">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-350 group-hover:scale-105">
            <Instagram size={14} />
          </div>
          <span className="text-[8px] font-black text-white uppercase tracking-wider drop-shadow-md">Instagram</span>
        </div>

        {/* Centered Red Play Button */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center z-10 transition-all duration-300",
          isHovering ? "opacity-0 scale-[1.1]" : "opacity-100 scale-100"
        )}>
          <div className="w-12 h-12 rounded-full bg-[#E02424] flex items-center justify-center border border-white/20 shadow-md">
            <Play className="text-white fill-white ml-0.5" size={18} />
          </div>
        </div>

        {/* Video Duration / Text Infused inside Media */}
        <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col justify-end text-left pointer-events-none">
          <h3 className="font-sans text-base md:text-lg font-black italic uppercase tracking-tighter text-white leading-tight mb-1 group-hover:text-orange-primary transition-colors">
            {guide.title}
          </h3>
          <p className="text-white/80 font-semibold text-[11px] leading-snug line-clamp-2 mb-2">
            {guide.excerpt || "Top 10 Smartphones to Buy in 2026. Find the best phone deals............"}
          </p>
          <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono text-white tracking-widest border border-white/5">
            {guide.duration || '8:10'}
          </div>
        </div>
      </div>

      {/* Footer Section below Media */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-3">
        <div className="flex items-center gap-3.5 text-[10px] font-black text-[#8a92a6] uppercase tracking-wider italic">
          <span className="flex items-center gap-1 hover:text-rose-500 transition-colors">
            <Heart size={14} className="text-rose-500 stroke-[2.5]" /> {guide.shares || '12k'}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} className="text-[#8a92a6] stroke-[2.5]" /> {guide.views || '1.2k'}
          </span>
          <span className="flex items-center gap-1">
            <Share2 size={14} className="text-[#8a92a6] stroke-[2.5]" /> 450
          </span>
        </div>

        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          className={cn(
            "w-8 h-8 rounded-full bg-white border flex items-center justify-center transition-all cursor-pointer shadow-none",
            isBookmarked 
              ? "border-orange-primary text-orange-primary bg-orange-primary/5" 
              : "border-[#e8edf2] text-gray-400 hover:text-orange-primary hover:border-orange-primary"
          )}
        >
          <Bookmark className={cn("w-3.5 h-3.5", isBookmarked ? "fill-current" : "")} />
        </button>
      </div>
    </Link>
  );
}

// Sub-component for Horizontal Media Story (Segment 3 of reference image)
function HorizontalMediaCard({ guide, badgeType }: { guide: any, badgeType: 'youtube' | 'blog' }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleMouseEnter = () => {
    if (badgeType === 'youtube') {
      setIsHovering(true);
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
      }
    }
  };

  const handleMouseLeave = () => {
    if (badgeType === 'youtube') {
      setIsHovering(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group cursor-pointer block bg-white rounded-2xl border border-[#e8edf2] p-4 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-300 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-950 rounded-xl">
        {badgeType === 'youtube' && guide.videoUrl ? (
          <video
            ref={videoRef}
            src={guide.videoUrl}
            poster={guide.image}
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
          />
        ) : (
          <img
            src={guide.image}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
            alt="Card Media"
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Badge: top left */}
        <div className="absolute top-4 left-4 z-20">
          {badgeType === 'blog' ? (
            <div className="bg-white px-2.5 py-1 rounded-[6px] border border-gray-100 shadow-xs flex items-center gap-1.5">
              <BookOpen size={11} className="text-orange-primary" />
              <span className="text-[8.5px] font-mono font-bold text-gray-500 uppercase leading-none">{guide.readTime || '5 MIN READ'}</span>
            </div>
          ) : null}
        </div>

        {/* Platform logo top-right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-0.5">
          {badgeType === 'youtube' ? (
            <>
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-350 group-hover:scale-105">
                <Youtube size={14} />
              </div>
              <span className="text-[8px] font-black text-white uppercase tracking-wider drop-shadow-md">Youtube</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-350 group-hover:scale-105">
                <LucidePenTool size={14} />
              </div>
              <span className="text-[8px] font-black text-white uppercase tracking-wider drop-shadow-md">Blog</span>
            </>
          )}
        </div>

        {/* Play Button for Youtube/Video Card */}
        {badgeType === 'youtube' && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-all duration-300",
            isHovering ? "opacity-0 scale-[1.1]" : "opacity-100 scale-100"
          )}>
            <div className="w-12 h-12 rounded-full bg-[#E02424] flex items-center justify-center border border-white/20 shadow-sm">
              <Play className="text-white fill-white ml-0.5" size={18} />
            </div>
          </div>
        )}

        {/* Duration for Youtube */}
        {badgeType === 'youtube' && (
          <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono text-white tracking-widest border border-white/5">
            {guide.duration || '8:10'}
          </div>
        )}
      </div>

      {/* Content Section below Media */}
      <div className="pt-3 flex flex-col gap-1.5">
        <h3 className="font-sans text-base md:text-lg font-black italic uppercase tracking-tighter text-[#0c133c] leading-tight group-hover:text-orange-primary transition-colors text-left line-clamp-1">
          {guide.title}
        </h3>
        
        <p className="text-gray-400 font-semibold text-[11px] leading-relaxed text-left line-clamp-2">
          {guide.excerpt || "Top 10 Smartphones to Buy in 2026. Find the best phone deals............"}
        </p>

        {/* Footer with Stats and Bookmark */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-3.5 text-[10px] font-black text-[#8a92a6] uppercase tracking-wider italic">
            <span className="flex items-center gap-1 hover:text-rose-500 transition-colors">
              <Heart size={14} className="text-rose-500 stroke-[2.5]" /> {guide.shares || '12k'}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} className="text-[#8a92a6] stroke-[2.5]" /> {guide.views || '1.2k'}
            </span>
            <span className="flex items-center gap-1">
              <Share2 size={14} className="text-[#8a92a6] stroke-[2.5]" /> 450
            </span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={cn(
              "w-8 h-8 rounded-full bg-white border flex items-center justify-center transition-all cursor-pointer shadow-none",
              isBookmarked 
                ? "border-orange-primary text-orange-primary bg-orange-primary/5" 
                : "border-[#e8edf2] text-gray-400 hover:text-orange-primary hover:border-orange-primary"
            )}
          >
            <Bookmark className={cn("w-3.5 h-3.5", isBookmarked ? "fill-current" : "")} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Fashion');
  const [isLoading, setIsLoading] = useState(true);

  // Trigger simulated loading effect on category change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const categoriesList = [
    { name: 'Fashion', icon: <Shirt size={16} className="stroke-[2.5]" />, count: 550 },
    { name: 'Gadgest', icon: <Smartphone size={16} className="stroke-[2.5]" />, count: 420 },
    { name: 'Perfume', icon: <Droplets size={16} className="stroke-[2.5]" />, count: 180 },
    { name: 'Electronics', icon: <Tv size={16} className="stroke-[2.5]" />, count: 350 },
    { name: 'Travel', icon: <Compass size={16} className="stroke-[2.5]" />, count: 156 },
    { name: 'Education', icon: <BookOpen size={16} className="stroke-[2.5]" />, count: 210 },
    { name: 'Parenting', icon: <Heart size={16} className="stroke-[2.5]" />, count: 95 },
    { name: 'Kids', icon: <Smile size={16} className="stroke-[2.5]" />, count: 240 },
    { name: 'Cars / Bike', icon: <Car size={16} className="stroke-[2.5]" />, count: 310 }
  ];

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

  // Dynamic filter supporting the high-fidelity bento bento-grid
  const getFilteredBlogs = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return BLOGS;
    }
    return BLOGS.filter(blog => {
      const titleMatches = blog.title.toLowerCase().includes(q);
      const excerptMatches = blog.excerpt?.toLowerCase().includes(q) || false;
      const categoryMatches = blog.category?.toLowerCase().includes(q) || false;
      return titleMatches || excerptMatches || categoryMatches;
    });
  };

  const filteredBlogs = getFilteredBlogs();

  return (
    <div id="guides-root" className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Hero Section */}
      <div id="guides-hero" className="hero-section hero-container w-full bg-[#0A0A1F] px-8 relative overflow-hidden flex items-center justify-center" style={{ height: '303px' }}>
        {/* Background Gradients */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="hero-content max-w-7xl mx-auto text-center relative z-10 w-full">
          <h1 id="hero-title" className="text-[28px] md:text-[36px] font-black italic uppercase tracking-tighter mb-2 leading-none text-white transition-transform hover:scale-105 duration-700">
            RECOMMENDATIONS
          </h1>

          <p className="text-white/70 max-w-2xl mx-auto font-bold italic text-[9px] md:text-[10.5px] mb-3 uppercase tracking-[0.2em] opacity-80 leading-relaxed">
            DISCOVER EXPERT GUIDES, BUYING ADVICE, AND LATEST TECH RECOMMENDATIONS
          </p>
  
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3 items-center mb-3 w-full">
             <button className="h-10 px-5 orange-brand-gradient text-white font-black rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap uppercase tracking-widest text-[9px] italic hover:brightness-110 transition-all text-left shrink-0">
                <LucidePenTool size={14} /> Post Recommendation
             </button>
             <div className="flex-1 w-full relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                   <div className="flex gap-1 opacity-80">
                      <div className="w-4 h-4 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-orange-primary/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-orange-primary rounded-full group-hover:scale-150 transition-transform" />
                      </div>
                   </div>
                </div>
                <input 
                 type="text" 
                 placeholder="Search by Brand Name or Category..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-10 pl-18 pr-6 rounded-full bg-gradient-to-r from-[#000A2A] to-[#0A0A1F] text-white border border-white/10 focus:outline-none focus:border-orange-primary/40 transition-all font-bold placeholder:text-white/20 shadow-xl text-[11px] italic tracking-wide animate-none" 
                />
             </div>
          </div>
  
          {/* Article Titles Marquee */}
          <div className="w-full overflow-hidden py-1.5 border-y border-white/5 relative">
            <motion.div 
               animate={{ x: [0, -2000] }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="flex whitespace-nowrap gap-8"
            >
               {recommendationTitles.map((title, i) => (
                 <span 
                   key={i} 
                   className={cn(
                     "text-xl md:text-2xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                     "text-white/10",
                     "hover:text-orange-primary hover:scale-110"
                   )}
                 >
                      {title}
                 </span>
               ))}
               {recommendationTitles.map((title, i) => (
                 <span 
                   key={`dup-${i}`} 
                   className={cn(
                     "text-xl md:text-2xl font-black italic uppercase tracking-tighter transition-all duration-500 cursor-default",
                     "text-white/10",
                     "hover:text-orange-primary hover:scale-110"
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
      <div className="w-full bg-white border-b border-gray-100 px-8 sticky top-20 z-40 shadow-sm overflow-x-auto scrollbar-hide lg:hidden text-left">
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

      <main className="max-w-[1440px] mx-auto px-6 w-full py-20 flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 relative z-10">
         {/* Left Sidebar Navigation */}
         <aside className="w-full lg:w-64 xl:w-72 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar hidden lg:block shrink-0">
           <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-xl flex flex-col gap-5">
             <div className="flex flex-col gap-1">
               <h3 className="text-xl md:text-2xl font-black uppercase text-navy italic tracking-tighter text-left">
                 <span className="text-orange-primary">CATA</span>GORIES
               </h3>
               <div className="w-full h-px bg-gray-100 mt-2" />
             </div>

             <div className="flex flex-col gap-1">
               {categoriesList.map((cat) => {
                 const isActive = activeCategory === cat.name;
                 return (
                   <button 
                     key={cat.name} 
                     onClick={() => setActiveCategory(cat.name)}
                     className={cn(
                       "flex items-center gap-4 py-2.5 px-3 rounded-2xl w-full text-left group transition-all duration-300",
                       isActive 
                       ? "bg-orange-primary/5 ring-1 ring-orange-primary/10" 
                       : "hover:bg-slate-50/80"
                     )}
                   >
                     <span className={cn(
                       "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 flex-shrink-0 relative",
                       isActive
                       ? "bg-orange-primary text-white border-orange-primary shadow-lg shadow-orange-primary/20"
                       : "bg-white text-orange-primary border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.04)] group-hover:scale-110 group-hover:border-orange-primary/20"
                     )}>
                       {cat.icon}
                     </span>

                     <span className="flex-1 min-w-0">
                       <span className={cn(
                         "text-[10.5px] md:text-xs font-black uppercase italic tracking-widest transition-colors duration-300 truncate block",
                         isActive ? "text-orange-primary" : "text-navy group-hover:text-orange-primary"
                       )}>
                         {cat.name}
                       </span>
                     </span>

                     <span className={cn(
                       "px-2.5 py-1 text-[9px] font-mono font-bold rounded-full transition-colors duration-300 shrink-0",
                       isActive 
                       ? "bg-orange-primary text-white" 
                       : "bg-[#EAEFF4] text-navy/70"
                     )}>
                       {cat.count}
                     </span>
                   </button>
                 );
               })}
             </div>
           </div>
         </aside>

         <div className="flex-1 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
            {isLoading ? (
               <div className="flex flex-col gap-12">
                  <div className="mb-16">
                     <RecommendationCardSkeleton variant="featured" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10 auto-rows-min">
                     {Array.from({ length: 4 }).map((_, i) => (
                        <RecommendationCardSkeleton 
                           key={i} 
                           variant={i % 3 === 0 ? "shorts" : "default"} 
                        />
                     ))}
                  </div>
                </div>
             ) : (
                <>
                  {filteredBlogs.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                       <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                         <Search size={24} />
                       </div>
                       <h3 className="font-sans text-lg font-black italic uppercase tracking-tighter text-[#1A1D4E] mb-1">No Results Found</h3>
                       <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-sm">We couldn't find any guides matching your criteria. Try adjusting your search query or category.</p>
                     </div>
                  ) : searchQuery ? (
                     <div className="flex flex-col gap-10">
                        <h4 className="font-sans text-xs font-black uppercase tracking-[0.25em] text-[#8a92a6] italic text-left">Search Results ({filteredBlogs.length})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {filteredBlogs.map(guide => (
                              <HorizontalMediaCard 
                                 key={guide.id} 
                                 guide={guide} 
                                 badgeType={guide.type === 'video' ? 'youtube' : 'blog'} 
                              />
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col gap-12 animate-fade-in duration-500">
                        {/* Row 1: Curated Featured Guide (Segment 1) */}
                        <FeaturedCard guide={BLOGS[0]} />

                        {/* Row 2: Grid of 3 Reel / Short-form Stories (Segment 2) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <ReelCard guide={BLOGS[1]} />
                           <ReelCard guide={BLOGS[4]} />
                           <ReelCard guide={BLOGS[6]} />
                        </div>

                        {/* Row 3: Grid of 2 Horizontal Media Stories (Segment 3) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <HorizontalMediaCard guide={BLOGS[2]} badgeType="youtube" />
                           <HorizontalMediaCard guide={BLOGS[3]} badgeType="blog" />
                        </div>
                     </div>
                  )}
               </>
             )}
             
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
         <aside className="w-full lg:w-[320px] space-y-8 shrink-0 relative z-10 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar hidden lg:block">
            {/* Newsletter Widget */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-gray-100/50 text-left animate-none">
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
            <div className="bg-white rounded-[40px] p-8 border border-gray-100/80 shadow-2xl shadow-gray-100/40 text-left">
               <h4 className="font-extrabold text-[#8e9aa8] text-[11px] uppercase tracking-[0.3em] mb-10 italic pl-1">POPULAR TOPICS</h4>
               <div className="space-y-7">
                  {[
                     { title: 'Best Cheap Brands For Everyone That Looks Great Always', cat: 'FASHION', reads: '5K READS', img: 'https://images.unsplash.com/photo-1546868823-05b0521e4cba?w=120' },
                     { title: 'Winter Skin Care Essentials for BD Climate', cat: 'BEAUTY', reads: '12K READS', img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=120' },
                     { title: 'Top 10 Smartwatches in Bangladesh 2026', cat: 'GADGETS', reads: '2K READS', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=120' },
                     { title: 'How To Choose Your First DSLR Camera', cat: 'ELECTRONICS', reads: '4K READS', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120' },
                     { title: 'Luxury Watches Every Man Should Own', cat: 'FASHION', reads: '3K READS', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=120' }
                  ].map((topic, i) => (
                    <div key={i} className="flex gap-5 group cursor-pointer items-center">
                       <div className="w-[68px] h-[68px] rounded-[22px] bg-slate-50 flex-shrink-0 overflow-hidden border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center relative">
                          <img 
                            src={topic.img} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h5 className="font-black text-[#0c133c] text-[11.5px] leading-[1.35] group-hover:text-orange-primary transition-colors mb-1 italic uppercase tracking-tight">
                             {topic.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[8px] font-black text-[#8a92a6] uppercase tracking-wider italic">
                             <span>{topic.cat}</span>
                             <span className="text-[6px] text-[#8a92a6]/50">•</span>
                             <span>{topic.reads}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 bg-[#f5f7fb] text-[#8a92a6] font-bold text-[9.5px] uppercase tracking-[0.2em] rounded-[18px] hover:bg-[#0c133c] hover:text-white hover:shadow-lg transition-all border border-transparent italic flex items-center justify-center">
                  LOAD MORE
               </button>
            </div>

            <div className="bg-navy rounded-[24px] p-10 text-white relative overflow-hidden group shadow-2xl text-left">
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
