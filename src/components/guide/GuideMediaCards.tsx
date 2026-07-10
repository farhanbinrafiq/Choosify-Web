import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Instagram, LucidePenTool, Play, Youtube } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CardEngagementStrip } from '../CardEngagementStrip';

// Sub-component for Reel Story (Segment 2 of reference image)
export function ReelCard({ guide }: { guide: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  if (!guide?.id) return null;
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
      className="group cursor-pointer block bg-white rounded-[5px] border border-[#e8edf2] p-4 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-350 w-full"
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
      <CardEngagementStrip
        entityType="guide"
        entityId={guide.id}
        payload={guide}
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </Link>
  );
}

// Sub-component for Horizontal Media Story (Segment 3 of reference image)
export function HorizontalMediaCard({ guide, badgeType }: { guide: any, badgeType: 'youtube' | 'blog' }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  if (!guide?.id) return null;
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
      className="group cursor-pointer block bg-white rounded-[5px] border border-[#e8edf2] p-4 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-350 w-full"
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

        {/* Footer with engagement */}
        <CardEngagementStrip
          entityType="guide"
          entityId={guide.id}
          payload={guide}
          onClickCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>
    </Link>
  );
}
