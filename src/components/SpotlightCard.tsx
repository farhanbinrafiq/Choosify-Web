import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Bookmark, Play, Clock, Eye, LayoutGrid, Calendar, Share2, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { Badge } from './ui/badges/Badge';

// Unified Verified Icon to match what is used on the Home Page
function VerifiedIcon({ size = 14, className = "text-blue-400" }: { size?: number; className?: string }) {
  return <CheckCircle size={size} className={className} />;
}

interface Creator {
  name: string;
  avatar: string;
  verified?: boolean;
}

interface SpotlightCardProps {
  card?: any; // For backward compatibility with existing usage
  variant?: 'featured' | 'standard' | 'video' | 'reel' | 'campaign' | 'collection';
  id?: string | number;
  title?: string;
  desc?: string;
  excerpt?: string;
  image?: string;
  cover?: string;
  thumbnail?: string;
  badge?: string;
  badgeBg?: string;
  category?: string;
  date?: string;
  readTime?: string;
  duration?: string;
  views?: number | string;
  creator?: Creator;
  publisher?: string;
  avatar?: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  onClick?: () => void;
  products?: any[];
  ctaText?: string;
  ctaLink?: string;
  sponsorBadge?: string;
  tagline?: string;
  className?: string;
}

export const SpotlightCard = memo(function SpotlightCard({
  card,
  variant: propVariant,
  id,
  title,
  desc,
  excerpt,
  image,
  cover,
  thumbnail,
  badge,
  badgeBg,
  category,
  date,
  readTime,
  duration,
  views,
  creator,
  publisher,
  avatar,
  isBookmarked: propIsBookmarked,
  onBookmarkToggle,
  onClick,
  products,
  ctaText,
  ctaLink,
  sponsorBadge,
  tagline,
  className
}: SpotlightCardProps) {
  const navigate = useNavigate();
  const [localBookmarked, setLocalBookmarked] = useState(false);

  // Fallback map to resolve any inputs (direct props or nested card object)
  const finalId = id || card?.id || 'spotlight-item';
  const finalTitle = title || card?.title || card?.name || 'Untitled Discovery';
  const finalDesc = desc || excerpt || card?.desc || card?.excerpt || card?.subtitle || 'Explore this curated highlight on Choosify.';
  const finalImage = image || cover || thumbnail || card?.cover || card?.image || card?.thumbnail || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80';
  const finalBadge = badge || card?.badge || category || card?.category || 'SPOTLIGHT';
  const finalBadgeBg = badgeBg || card?.badgeBg || 'bg-[#EB4501]';
  const finalDate = date || card?.date || 'Today';
  const finalReadTime = readTime || card?.readTime || '5 min read';
  const finalDuration = duration || card?.duration || '10:00';
  const finalViews = views || card?.views || '12K';
  
  // Resolve creator structure
  let finalCreator: Creator = { name: 'Choosify Team', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', verified: true };
  if (creator) {
    finalCreator = creator;
  } else if (publisher) {
    finalCreator = { name: publisher, avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', verified: true };
  } else if (card?.publisher) {
    finalCreator = { name: card.publisher, avatar: card.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', verified: true };
  } else if (card?.creator) {
    finalCreator = card.creator;
  }

  // Determine variant
  // If propVariant is specified, use it. Otherwise attempt to infer from card prop or fallback to standard.
  let activeVariant: 'featured' | 'standard' | 'video' | 'reel' | 'campaign' | 'collection' = 'standard';
  if (propVariant) {
    activeVariant = propVariant;
  } else if (card?.variant) {
    activeVariant = card.variant;
  } else if (card?.badge?.toLowerCase().includes('guide') || card?.category?.toLowerCase().includes('guide')) {
    activeVariant = 'featured';
  } else if (card?.badge?.toLowerCase().includes('video') || card?.duration) {
    activeVariant = 'video';
  } else if (card?.badge?.toLowerCase().includes('collection') || card?.itemsCount) {
    activeVariant = 'collection';
  }

  const isSaved = propIsBookmarked !== undefined ? propIsBookmarked : localBookmarked;

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmarkToggle) {
      onBookmarkToggle();
    } else {
      setLocalBookmarked(!isSaved);
      toast.success(!isSaved ? 'Saved to library!' : 'Removed from library');
    }
  };

  const handlePress = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/discover/${finalId}`);
    }
  };

  // ----------------------------------------------------
  // A. FEATURED VARIANT (Buying Guides / Hero Editorials)
  // ----------------------------------------------------
  if (activeVariant === 'featured') {
    return (
      <div
        id={`spotlight-featured-${finalId}`}
        onClick={handlePress}
        className={cn(
          "bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer group flex flex-col md:flex-row w-full text-left min-h-[320px]",
          className
        )}
      >
        {/* Left Info area (55% width) */}
        <div className="p-8 md:w-[55%] flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="orange" className={cn("rounded-full px-3 py-1 text-[10px]", finalBadgeBg)}>
                {finalBadge}
              </Badge>
              <button
                onClick={handleBookmark}
                className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#CF4400] hover:bg-slate-100 transition-all border border-transparent"
                aria-label="Bookmark"
              >
                <Bookmark size={15} className={cn("transition-colors", isSaved ? "fill-[#EB4501] text-[#EB4501]" : "")} />
              </button>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-[#050B2C] leading-tight tracking-tight group-hover:text-[#CF4400] transition-colors mb-3 line-clamp-3">
              {finalTitle}
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 line-clamp-3">
              {finalDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-2.5">
              <img
                src={finalCreator.avatar}
                alt={finalCreator.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-slate-800">{finalCreator.name}</span>
                  {finalCreator.verified && <VerifiedIcon size={11} />}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-0.5"><Eye size={10} /> {finalViews} views</span>
                  <span>•</span>
                  <span>{finalDate}</span>
                </div>
              </div>
            </div>

            <span className="bg-slate-100 text-slate-600 text-[9px] font-black tracking-wider px-3 py-1 rounded-full uppercase flex items-center gap-1 shrink-0">
              <Clock size={10} /> {finalReadTime}
            </span>
          </div>
        </div>

        {/* Right Cover Art (45% width) */}
        <div className="md:w-[45%] h-64 md:h-auto overflow-hidden relative min-h-[220px]">
          <img
            src={finalImage}
            alt={finalTitle}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-l md:from-black/10" />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // B. STANDARD VARIANT (Articles / News / Tips)
  // ----------------------------------------------------
  if (activeVariant === 'standard') {
    return (
      <div
        id={`spotlight-standard-${finalId}`}
        onClick={handlePress}
        className={cn(
          "bg-white rounded-[24px] overflow-hidden border border-[#EEF2F7] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all duration-300 cursor-pointer group flex flex-col justify-between text-left h-full",
          className
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
          <img
            src={finalImage}
            alt={finalTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="orange" className={cn("px-2.5 py-1 text-[9px] shadow-sm", finalBadgeBg)}>
              {finalBadge}
            </Badge>
          </div>
          <button
            onClick={handleBookmark}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-[#CF4400] hover:bg-white transition-all shadow-sm border border-transparent"
          >
            <Bookmark size={13} className={cn("transition-colors", isSaved ? "fill-[#EB4501] text-[#EB4501]" : "")} />
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[14px] font-extrabold text-[#050B2C] leading-snug tracking-tight mb-2 group-hover:text-[#CF4400] transition-colors line-clamp-2">
              {finalTitle}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold line-clamp-2 leading-relaxed mb-4">
              {finalDesc}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-1.5 min-w-0">
              <img
                src={finalCreator.avatar}
                alt={finalCreator.name}
                className="w-5.5 h-5.5 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-bold text-slate-600 truncate">{finalCreator.name}</span>
              {finalCreator.verified && <VerifiedIcon size={10} className="text-blue-400 shrink-0" />}
            </div>
            <span className="text-[9px] font-bold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-0.5">
              <Clock size={9} /> {finalReadTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // C. VIDEO VARIANT (Creator Reviews / Product Videos)
  // ----------------------------------------------------
  if (activeVariant === 'video') {
    return (
      <div
        id={`spotlight-video-${finalId}`}
        onClick={handlePress}
        className={cn(
          "bg-white rounded-[24px] overflow-hidden border border-[#EEF2F7] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all duration-300 cursor-pointer group flex flex-col text-left h-full",
          className
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <img
            src={finalImage}
            alt={finalTitle}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#EB4501]/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#CF4400] transition-all duration-300">
              <Play size={18} fill="currentColor" className="ml-1" />
            </div>
          </div>
          
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="blue" className="px-2 py-0.5 text-[8px]">
              {finalBadge || 'CREATOR REVIEW'}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 z-10 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono font-black text-white tracking-wider">
            {finalDuration}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#050B2C] leading-snug tracking-tight mb-2 line-clamp-2 group-hover:text-[#CF4400] transition-colors">
              {finalTitle}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold line-clamp-1 truncate mb-3">
              {finalDesc}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-1.5">
              <img
                src={finalCreator.avatar}
                alt={finalCreator.name}
                className="w-5.5 h-5.5 rounded-full object-cover border border-white"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-bold text-slate-600 truncate">{finalCreator.name}</span>
              {finalCreator.verified && <VerifiedIcon size={10} />}
            </div>
            <span className="text-[9px] font-bold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-1">
              <Eye size={10} /> {finalViews}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // D. REEL VARIANT (Vertical Videos / Shorts)
  // ----------------------------------------------------
  if (activeVariant === 'reel') {
    return (
      <div
        id={`spotlight-reel-${finalId}`}
        onClick={handlePress}
        className={cn(
          "relative min-w-[200px] aspect-[9/16] rounded-[24px] overflow-hidden cursor-pointer group shadow-lg border border-transparent transition-all duration-300 h-[360px] shrink-0 snap-start",
          className
        )}
      >
        <img
          src={finalImage}
          alt={finalTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Badge variant="red" className="px-2.5 py-0.5 text-[8px] rounded-full">
            REEL
          </Badge>
          {finalDuration && (
            <span className="text-[8px] font-black text-white bg-black/40 px-2 py-0.5 rounded-full tracking-wider">
              {finalDuration}
            </span>
          )}
        </div>

        {/* Play Icon in Center */}
        <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xs text-white border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white text-left z-10">
          <h3 className="text-sm font-black leading-snug mb-3 drop-shadow-md line-clamp-2">{finalTitle}</h3>
          
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <img
              src={finalCreator.avatar}
              alt={finalCreator.name}
              className="w-5 h-5 rounded-full border border-white/20 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-extrabold text-white truncate">{finalCreator.name}</span>
                {finalCreator.verified && <VerifiedIcon size={9} />}
              </div>
              <span className="text-[8px] text-white/70 block font-bold uppercase">{finalViews} views</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // E. CAMPAIGN VARIANT (Sponsored / Sales Advertorial)
  // ----------------------------------------------------
  if (activeVariant === 'campaign') {
    return (
      <div
        id={`spotlight-campaign-${finalId}`}
        onClick={handlePress}
        className={cn(
          "bg-gradient-to-br from-[#FFF5F0] to-[#FFF0EB] rounded-[24px] p-6 border border-orange-100 shadow-[0_4px_20px_rgba(235, 69, 1,0.02)] hover:shadow-[0_8px_30px_rgba(235, 69, 1,0.06)] transition-all duration-300 flex flex-col justify-between text-left h-full cursor-pointer group relative overflow-hidden",
          className
        )}
      >
        {/* Abstract design elements */}
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#EB4501]/5 rounded-full blur-xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="campaign" className="px-2.5 py-0.5 text-[8px] shadow-xs">
              {sponsorBadge || 'CAMPAIGN'}
            </Badge>
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">
              SPONSORED
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 leading-tight tracking-tight mb-2 mt-1">
            {finalTitle}
          </h3>
          {tagline && (
            <p className="text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide">
              {tagline}
            </p>
          )}
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
            {finalDesc}
          </p>
        </div>

        {finalImage && (
          <div className="w-full h-32 rounded-xl overflow-hidden mb-4 border border-orange-50/50 bg-white">
            <img
              src={finalImage}
              alt={finalTitle}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-orange-100/50 flex items-center justify-between">
          <span className="text-[10px] font-black text-[#EB4501] uppercase tracking-wider group-hover:underline flex items-center gap-0.5">
            {ctaText || 'Learn More'} →
          </span>
          <span className="text-[8px] font-bold text-slate-400">Ends soon</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // F. COLLECTION VARIANT (Groupings / Curations)
  // ----------------------------------------------------
  if (activeVariant === 'collection') {
    const productsList = products || card?.products || [];

    return (
      <div
        id={`spotlight-collection-${finalId}`}
        onClick={handlePress}
        className={cn(
          "bg-white rounded-[24px] border border-[#EEF2F7] overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col relative text-left cursor-pointer",
          className
        )}
      >
        <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden shrink-0">
          <img
            src={finalImage}
            alt={finalTitle}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="blue" className="px-2.5 py-1 text-[8px] rounded-full shadow-sm">
              {finalBadge || 'COLLECTION'}
            </Badge>
          </div>
          {isSaved !== undefined && (
            <button
              onClick={handleBookmark}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-slate-500 hover:text-[#CF4400] hover:bg-white transition-all shadow-sm border border-transparent"
            >
              <Bookmark size={13} className={cn("transition-colors", isSaved ? "fill-[#EB4501] text-[#EB4501]" : "")} />
            </button>
          )}
        </div>

        {/* Optional preview mini-row for collection thumbs */}
        {productsList.length > 0 && (
          <div className="flex gap-1.5 p-3 bg-slate-50 border-b border-slate-100 overflow-hidden">
            {productsList.slice(0, 4).map((p: any, idx: number) => (
              <div key={idx} className="w-8 h-8 rounded-md overflow-hidden bg-white border border-slate-100 flex-none">
                <img
                  src={p.image || p.thumbnail || p}
                  alt=""
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
            {productsList.length > 4 && (
              <div className="w-8 h-8 rounded-md bg-slate-200 text-[10px] font-black text-slate-600 flex items-center justify-center border border-slate-100 flex-none uppercase">
                +{productsList.length - 4}
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-[#050B2C] leading-snug group-hover:text-[#CF4400] transition-colors mb-2 line-clamp-2">
              {finalTitle}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-4 leading-relaxed line-clamp-2">
              {finalDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mt-auto pt-2 border-t border-slate-50">
            <LayoutGrid size={11} className="text-[#EB4501]" />
            <span>{productsList.length || 8} Products</span>
            <span>•</span>
            <span>{finalDate}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
});
