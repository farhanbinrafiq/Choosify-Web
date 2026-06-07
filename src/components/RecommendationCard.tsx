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
        className="group cursor-pointer block bg-white rounded-xl border border-[#e8edf2] hover:border-orange-primary/30 transition-all duration-300 w-full relative p-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-[16/9] md:aspect-[2.2/1] w-full relative overflow-hidden bg-slate-950 rounded-lg">
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
          
          <div className="absolute top-6 left-6 z-20">
             <div className="bg-orange-primary px-4 py-2 rounded-lg border border-white/10">
                <span className="text-[10px] font-semibold text-white uppercase tracking-wider leading-none">FEATURED STORY</span>
             </div>
          </div>
          
          <div className="absolute top-6 right-6 z-20 flex flex-col items-center">
             <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <Youtube size={18} />
             </div>
          </div>

          {/* Centered Red Play Button */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-all duration-500",
            isHovering ? "opacity-0 scale-[1.2]" : "opacity-100 scale-100"
          )}>
            <div className="w-16 h-16 rounded-full bg-[#E02424] flex items-center justify-center border-2 border-white/20">
              <Play className="text-white fill-white ml-1" size={24} />
            </div>
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-20">
             <div className="max-w-4xl text-left">
                <h3 className="text-xl md:text-3xl font-semibold text-white leading-tight mb-2 group-hover:text-orange-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed mb-3 line-clamp-2 max-w-2xl opacity-90">
                  {guide.excerpt || "Dive into our comprehensive analysis and expert evaluation of this product. We explore every feature and specification."}
                </p>
             </div>
             
             <div className="absolute bottom-6 right-6 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-white border border-white/10 leading-none">
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
        className="group cursor-pointer block bg-white rounded-xl border border-[#e8edf2] hover:scale-[1.01] transition-all duration-300 h-full relative p-3 max-w-[285px] sm:max-w-[320px] md:max-w-none mx-auto w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-[9/16] w-full relative overflow-hidden bg-slate-950 rounded-lg">
          {guide.videoUrl ? (
            <video
              ref={videoRef}
              src={guide.videoUrl}
              poster={guide.image}
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
            />
          ) : (
            <img 
              src={guide.image} 
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" 
              alt="Shorts" 
            />
          )}
          
          {/* Top Overlays */}
          <div className="absolute top-4 left-4 z-20">
             <div className="bg-white px-2.5 py-1 rounded shadow-none border border-gray-100">
                <span className="text-[9px] font-semibold text-black uppercase tracking-wider leading-none">REEL</span>
             </div>
          </div>
          
          <div className="absolute top-4 right-4 z-20 flex flex-col items-center">
             <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <Instagram size={14} />
             </div>
          </div>

          {/* Centered Red Play Button */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-all duration-500",
            isHovering ? "opacity-0 scale-[1.2]" : "opacity-100 scale-100"
          )}>
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center border border-white/20">
              <Play className="text-white fill-white ml-0.5" size={18} />
            </div>
          </div>

          {/* Bottom Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 z-10 pt-20">
             <h3 className="text-sm font-semibold text-white tracking-tight leading-snug mb-1.5 group-hover:text-orange-primary transition-colors text-left">
                {guide.title || "TOP 10 SMARTPHONES TO BUY IN 2026"}
             </h3>
             
             <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white">
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
      className="group cursor-pointer block bg-white rounded-xl overflow-hidden border border-[#e8edf2] hover:scale-[1.01] transition-all duration-300 flex flex-col h-full"
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
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center border border-white/20">
                <Play className="text-white fill-white ml-0.5" size={20} />
              </div>
            </div>
            {guide.duration && (
              <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-white">
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
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white px-2.5 py-1 rounded flex items-center gap-1.5 border border-gray-100 w-max">
            <BookOpen size={11} className="text-orange-primary" />
            <span className="text-[9px] font-mono text-gray-500 leading-none">{guide.readTime || '5 MIN READ'}</span>
          </div>
        </div>

        {/* Brand Overlay */}
        <div className="absolute top-4 right-4 z-10">
           {isVideo ? (
             <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                <Youtube size={14} />
             </div>
           ) : (
             <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                <BookOpen size={12} />
             </div>
           )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col min-w-0 bg-white">
        <div className="flex-1 flex flex-col text-left">
          <h3 className="text-xs font-semibold uppercase text-[#1a1a2e] group-hover:text-orange-primary transition-colors leading-snug line-clamp-2 mb-1">
            {guide.title}
          </h3>
          
          <p className="text-gray-400 text-[11px] leading-relaxed mb-3 line-clamp-2">
            {guide.excerpt || "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."}
          </p>
        </div>
        
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
            <span className="flex items-center gap-1 cursor-pointer">
              <Heart size={13} className="text-rose-500" /> {guide.views || '12K'}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={13} /> {guide.views || '1.2k'}
            </span>
            <span className="flex items-center gap-1 hidden sm:flex">
              <Share2 size={13} /> {guide.shares || '450'}
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-50 text-gray-600 group-hover:bg-orange-primary group-hover:text-white transition-colors flex items-center justify-center">
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
