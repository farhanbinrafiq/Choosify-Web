import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Heart, ArrowRight, Share2, Eye, Youtube, Instagram } from 'lucide-react';
import { cn } from '../lib/utils';
import { PLACEHOLDER_IMAGE } from '../constants';

export function RecommendationCard(props: any) {
  const { guide, index, variant } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const isFeatured = variant === 'featured';
  const isShorts = guide.type === 'shorts' || guide.type === 'reels';
  const isVideo = guide.type === 'video';
  const isArticle = guide.type === 'article' || !guide.type;

  // Featured Style (Wide Overlay)
  if (isFeatured) {
    return (
      <Link 
        to={`/guides/${guide.id}`} 
        className="group cursor-pointer block bg-white rounded-[40px] border border-orange-primary/10 hover:shadow-2xl transition-all duration-500 shadow-xl shadow-gray-100/30 w-full relative p-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-[16/9] md:aspect-[2.2/1] w-full relative overflow-hidden bg-navy rounded-[32px]">
          {guide.videoUrl ? (
            <video
              ref={videoRef}
              src={guide.videoUrl}
              poster={guide.image}
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]"
            />
          ) : (
            <img 
              src={guide.image} 
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" 
              alt="Featured" 
            />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
          
          <div className="absolute top-8 left-8 z-20">
             <div className="bg-orange-primary px-6 py-3 rounded-xl shadow-2xl">
                <span className="text-[11px] font-black italic text-white uppercase tracking-[0.2em] leading-none">FEATURED STORY</span>
             </div>
          </div>
          
          <div className="absolute top-8 right-8 z-20 flex flex-col items-center">
             <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                <Youtube size={28} />
             </div>
             <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-2 opacity-80">Youtube</span>
          </div>

          {/* Centered Red Play Button */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-all duration-500",
            isHovering ? "opacity-0 scale-[1.5]" : "opacity-100 scale-100"
          )}>
            <div className="w-24 h-24 rounded-full bg-[#E02424] flex items-center justify-center shadow-2xl border-[5px] border-white/20">
              <Play className="text-white fill-white ml-2" size={40} />
            </div>
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-10 md:p-16 z-20">
             <div className="max-w-4xl">
                <h3 className="text-4xl md:text-6xl lg:text-[72px] font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-6 group-hover:text-orange-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-white/80 text-[15px] md:text-[18px] font-medium italic leading-relaxed mb-4 line-clamp-2 max-w-3xl opacity-90">
                  {guide.excerpt || "Dive into our comprehensive analysis and expert evaluation of this product. We explore every feature and specification."}
                </p>
             </div>
             
             <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 bg-[#000020]/90 backdrop-blur-md px-4 py-2.5 rounded-xl text-[13px] font-black text-white border border-white/10 italic leading-none shadow-2xl">
                {guide.duration || '8:10'}
             </div>
          </div>
        </div>
      </Link>
    );
  }

  // New "Reel" style based on reference image
  if (isShorts && !isFeatured) {
    return (
      <Link 
        to={`/guides/${guide.id}`} 
        className="group cursor-pointer block bg-white rounded-[32px] border border-gray-100 hover:shadow-3xl transition-all duration-500 shadow-xl shadow-gray-100/30 h-full relative p-2 md:p-3 max-w-[285px] sm:max-w-[320px] md:max-w-none mx-auto w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-[9/16] w-full relative overflow-hidden bg-navy rounded-[24px]">
          {guide.videoUrl ? (
            <video
              ref={videoRef}
              src={guide.videoUrl}
              poster={guide.image}
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
            />
          ) : (
            <img 
              src={guide.image} 
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" 
              alt="Shorts" 
            />
          )}
          
          {/* Top Overlays */}
          <div className="absolute top-6 left-6 z-20">
             <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-white/20">
                <span className="text-[10px] font-black italic text-navy uppercase tracking-widest leading-none">REEL</span>
             </div>
          </div>
          
          <div className="absolute top-6 right-6 z-20 flex flex-col items-center">
             <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110">
                <Instagram size={20} />
             </div>
          </div>

          {/* Centered Red Play Button */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-all duration-500",
            isHovering ? "opacity-0 scale-[1.5]" : "opacity-100 scale-100"
          )}>
            <div className="w-20 h-20 rounded-full bg-[#FF0000] flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.4)] border-[4px] border-white/20 active:scale-90 transition-transform">
              <Play className="text-white fill-white ml-1.5" size={32} />
            </div>
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 md:p-8 z-10 pt-32">
             <h3 className="text-2xl md:text-[32px] font-black text-white italic uppercase tracking-tighter leading-none mb-3 group-hover:text-orange-primary transition-colors">
                {guide.title || "TOP 10 SMARTPHONES TO BUY IN 2026"}
             </h3>
             <p className="text-white/80 text-[11px] md:text-[13px] font-medium italic leading-relaxed mb-4 line-clamp-2 max-w-[95%] opacity-90">
                {guide.excerpt || "The ultimate guide to finding the best smartphone for your budget and needs."}
             </p>
             
             <div className="absolute bottom-6 right-6 bg-[#000020]/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-[12px] font-black text-white border border-white/10 italic leading-none shadow-2xl">
                {guide.duration || '8:10'}
             </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/guides/${guide.id}`} 
      className="group cursor-pointer block bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 shadow-xl shadow-gray-100/30 flex flex-col h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Source */}
      <div className="overflow-hidden relative bg-gray-50 shrink-0 aspect-[16/10]">
        {guide.videoUrl ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={guide.videoUrl}
              poster={guide.image}
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s]"
            />
            <div className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-all duration-500",
              isHovering ? "opacity-0" : "opacity-100"
            )}>
              <div className="w-20 h-20 rounded-full bg-[#E02424] flex items-center justify-center border-[4px] border-white/20 shadow-2xl">
                <Play className="text-white fill-white ml-1" size={28} />
              </div>
            </div>
            {guide.duration && (
              <div className="absolute bottom-6 right-6 bg-navy/80 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-black text-white uppercase tracking-widest border border-white/10 italic leading-none">
                {guide.duration}
              </div>
            )}
          </div>
        ) : (
          <img 
            src={guide.image || PLACEHOLDER_IMAGE} 
            loading="lazy"
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" 
            alt="Guide" 
          />
        )}

        {/* Badges */}
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-gray-100 w-max">
            <BookOpen size={14} className="text-orange-primary" />
            <span className="text-[10px] font-black text-navy uppercase tracking-widest italic leading-none">{guide.readTime || '5 MIN READ'}</span>
          </div>
        </div>

        {/* Brand Overlay */}
        <div className="absolute top-6 right-6 z-10 opacity-60 group-hover:opacity-100 transition-opacity">
           {isVideo ? (
             <div className="w-12 h-12 rounded-full bg-navy/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                <Youtube size={24} />
             </div>
           ) : (
             <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                <BookOpen size={20} />
             </div>
           )}
        </div>
      </div>

      <div className="p-8 md:p-10 flex-1 flex flex-col min-w-0 bg-white">
        <div className="flex-1 flex flex-col">
          <h3 className="font-black text-navy uppercase tracking-tighter mb-6 group-hover:text-orange-primary transition-colors leading-[1.05] italic text-2xl md:text-3xl">
            {guide.title}
          </h3>
          
          <p className="text-gray-400 text-sm font-medium italic leading-relaxed mb-8 line-clamp-2 uppercase tracking-wide opacity-80">
            {guide.excerpt || "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product. We examine the hardware, software, and everyday value."}
          </p>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] italic transition-all group-hover:text-navy/60">
            <span className="flex items-center gap-2.5 hover:text-pink-500 transition-colors cursor-pointer">
              <Heart size={18} className={cn("transition-colors", isHovering ? "text-pink-500 fill-pink-500" : "text-pink-500")} /> {guide.views || '12K'}
            </span>
            <span className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
              <Eye size={18} /> {guide.views || '1.2k'}
            </span>
            <span className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity hidden sm:flex">
              <Share2 size={18} /> {guide.shares || '450'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-navy/5 text-navy group-hover:bg-orange-primary group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-md">
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>

  );
}
