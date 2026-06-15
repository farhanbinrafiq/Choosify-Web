import React, { useState, useEffect } from 'react';
import { Play, Eye, ThumbsUp, Clock, Youtube, Instagram, Facebook, Video, Plus, X, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGlobalState } from '../context/GlobalStateContext';

// Custom Minimal SVG for TikTok to pair perfectly with Lucide outline style
function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.51-.15-.11-.29-.24-.42-.37v7.21c.1 2.3-.92 4.67-2.81 5.95-1.99 1.34-4.73 1.53-6.91.5-2.28-1.03-3.86-3.41-3.95-5.91-.12-3-.07-6 .02-9 1.37-.02 2.75-.01 4.12-.02-.07 1.58-.04 3.17-.05 4.76.1-.15.2-.29.3-.43.91-1.25 2.45-2.01 4.02-1.96.01-1.3-.01-2.61.02-3.91v-.04z"/>
    </svg>
  );
}

export interface InfluencerReviewCard {
  id: string | number;
  image: string;
  category: string;
  title: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  badgeBg?: string;
  platform?: 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook';
  aspectRatio?: 'landscape' | 'portrait';
  videoUrl?: string;
  stats?: {
    views?: string;
    likes?: string;
    duration?: string;
  };
  timeAgo?: string;
}

export interface InfluencerFeaturedReview {
  image: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorSub?: string;
  authorLogo?: string;
  badgeText?: string;
  platform?: 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook';
  videoUrl?: string;
  stats?: {
    views: string;
    likes: string;
    duration: string;
  };
}

export interface InfluencerReviewsProps {
  title?: string;
  subtitle?: string;
  brandName?: string;
  featuredReview?: InfluencerFeaturedReview;
  reviews?: InfluencerReviewCard[];
  allowAdd?: boolean;
}

// Converts standard video links into embeddable iframe-safe URLs
const getEmbedUrl = (url: string) => {
  if (!url) return '';
  let clean = url.trim();

  // Handle YouTube Shorts
  if (clean.includes('youtube.com/shorts/') || clean.includes('youtu.be/shorts/')) {
    const parts = clean.split('/shorts/');
    const id = parts[1]?.split('?')[0]?.split('&')[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  }

  // Handle standard short youtu.be links
  if (clean.includes('youtu.be/')) {
    const parts = clean.split('youtu.be/');
    const id = parts[1]?.split('?')[0]?.split('&')[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  }

  // Handle standard watch links
  if (clean.includes('youtube.com/watch')) {
    try {
      const urlParams = new URLSearchParams(clean.substring(clean.indexOf('?')));
      const id = urlParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    } catch (e) {
      // fallback
    }
  }

  // Already an embed link
  if (clean.includes('/embed/')) {
    if (!clean.includes('autoplay=')) {
      clean = clean.includes('?') ? `${clean}&autoplay=1&mute=1` : `${clean}?autoplay=1&mute=1`;
    }
    return clean;
  }

  return clean;
};

// Unified avatar rendering to cleanly handle both dynamic image URLs and initial characters
function RenderAvatar({ avatar, name, size = 'sm' }: { avatar: string; name: string; size?: 'sm' | 'md' }) {
  const safeAvatar = avatar || '';
  const isUrl = typeof safeAvatar === 'string' && safeAvatar.length > 0 && (
    safeAvatar.startsWith('http://') || 
    safeAvatar.startsWith('https://') || 
    safeAvatar.startsWith('/') || 
    safeAvatar.startsWith('data:') ||
    /\.(jpg|jpeg|png|gif|webp|svg)/i.test(safeAvatar)
  );
  const sizeClass = size === 'sm' ? "w-6 h-6 text-[9px]" : "w-7 h-7 text-xs";
  
  if (isUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden border border-[#21262D] bg-[#21262D] flex-shrink-0 flex items-center justify-center`}>
        <img src={safeAvatar} alt={name || "avatar"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
    );
  }
  
  const displayLetters = typeof name === 'string' && name.trim().length > 0
    ? name.trim().substring(0, 2)
    : (typeof safeAvatar === 'string' && safeAvatar.trim().length > 0 ? safeAvatar.trim().substring(0, 2) : "CR");

  return (
    <div className={`${sizeClass} rounded-full bg-[#21262D] border border-[#21262D] flex items-center justify-center font-semibold text-[#F0F6FC] shrink-0 uppercase`}>
      {safeAvatar && !isUrl ? safeAvatar.substring(0, 2) : displayLetters}
    </div>
  );
}

// Interactive iframe wrapper displaying high density metadata while supporting dynamic state
interface VideoAreaProps {
  id: string | number;
  videoUrl: string;
  image: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook';
  aspectRatio: 'landscape' | 'portrait';
  isPlaying: boolean;
  onPlay: () => void;
}

function VideoArea({ id, videoUrl, image, platform, aspectRatio, isPlaying, onPlay }: VideoAreaProps) {
  const getLargePlatformIcon = () => {
    switch (platform) {
      case 'YouTube':
        return <Youtube size={24} className="text-[#8B949E]/10" />;
      case 'Instagram':
        return <Instagram size={24} className="text-[#8B949E]/10" />;
      case 'TikTok':
        return <TikTokIcon className="w-6 h-6 text-[#8B949E]/10" />;
      case 'Facebook':
        return <Facebook size={24} className="text-[#8B949E]/10" />;
      default:
        return <Video size={24} className="text-[#8B949E]/10" />;
    }
  };

  const cleanEmbed = getEmbedUrl(videoUrl);

  if (isPlaying && cleanEmbed) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black z-10 select-none rounded-[8px] overflow-hidden">
        <iframe
          src={cleanEmbed}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full block"
          title={`Creator Stream on ${platform}`}
        />
      </div>
    );
  }

  return (
    <div 
      onClick={onPlay}
      className="absolute inset-0 w-full h-full cursor-pointer group flex items-center justify-center overflow-hidden transition-all duration-300 select-none rounded-[8px]"
    >
      {/* Background Image with optimized zoom and blur details */}
      <img 
        src={image} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] brightness-[0.4]"
        alt="Video Thumbnail"
      />
      <div className="absolute inset-0 bg-[#0D1117]/50" />

      {/* Centered White Play circle and text */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <div className="w-9 h-9 rounded-full bg-[#FAF9F5]/90 text-[#0D1117] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FAF9F5] shrink-0">
          <Play size={12} className="fill-current ml-0.5 text-[#0D1117]" />
        </div>
        <span className="text-[11px] text-[#8B949E] font-medium tracking-wide">
          Click to load video
        </span>
      </div>

      {/* Stylized background platform silhouette for premium branding */}
      <div className="absolute right-3 bottom-3 opacity-40">
        {getLargePlatformIcon()}
      </div>
    </div>
  );
}

// Pre-configured default sample reviews dataset mapping all requirements precisely
const curatedFeaturedReview: InfluencerFeaturedReview = {
  image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&h=800&fit=crop",
  title: "Why this remains a top choice in 2024",
  excerpt: "A deep dive into performance and build quality — from real-world testing to expert analysis. Watch the full breakdown.",
  authorName: "Tech Review BD",
  authorSub: "Dhaka HQ",
  authorLogo: "TR",
  badgeText: "In-depth Review",
  platform: "YouTube",
  videoUrl: "https://www.youtube.com/embed/PjRreH0T_W4?autoplay=1&mute=1",
  stats: {
    views: "124K",
    likes: "8.2K",
    duration: "18 min"
  }
};

const curatedReviews: InfluencerReviewCard[] = [
  {
    id: "card-1",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    category: "Fashion Vibes",
    title: "Apex Style Showcase — full outfit breakdown",
    authorName: "Style Maven",
    authorHandle: "@stylemaven",
    authorAvatar: "SM",
    platform: "Instagram",
    aspectRatio: "portrait",
    videoUrl: "https://www.youtube.com/embed/p17S_gQ2iV4?autoplay=1&mute=1",
    timeAgo: "12m ago"
  },
  {
    id: "card-2",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
    category: "Footwear Review",
    title: "Collection deep dive — is it worth it?",
    authorName: "BB Tech Reviews",
    authorHandle: "@bbtech",
    authorAvatar: "BB",
    platform: "YouTube",
    aspectRatio: "landscape",
    videoUrl: "https://www.youtube.com/embed/T68XW9Q-PqQ?autoplay=1&mute=1",
    timeAgo: "15h ago"
  },
  {
    id: "card-3",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop",
    category: "Unboxing",
    title: "Finding the perfect build — first look",
    authorName: "Avishek Mojumder",
    authorHandle: "@avishek",
    authorAvatar: "AM",
    platform: "TikTok",
    aspectRatio: "portrait",
    videoUrl: "https://www.youtube.com/embed/bZha6f-Z35M?autoplay=1&mute=1",
    timeAgo: "1d ago"
  },
  {
    id: "card-4",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop",
    category: "Live Review",
    title: "Honest thoughts after 30 days",
    authorName: "Nadia Rahman",
    authorHandle: "@nadia.reviews",
    authorAvatar: "NR",
    platform: "Facebook",
    aspectRatio: "landscape",
    videoUrl: "https://www.youtube.com/embed/S_8qM8882bA?autoplay=1&mute=1",
    timeAgo: "3d ago"
  },
  {
    id: "card-5",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
    category: "Lifestyle",
    title: "Daily carry — does it actually hold up?",
    authorName: "Key Looks",
    authorHandle: "@keylooks",
    authorAvatar: "KL",
    platform: "Instagram",
    aspectRatio: "portrait",
    videoUrl: "https://www.youtube.com/embed/p17S_gQ2iV4?autoplay=1&mute=1",
    timeAgo: "5d ago"
  },
  {
    id: "card-6",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
    category: "Comparison",
    title: "vs. the competition — full breakdown",
    authorName: "Gear Reviews BD",
    authorHandle: "@gearreviews",
    authorAvatar: "GR",
    platform: "YouTube",
    aspectRatio: "landscape",
    videoUrl: "https://www.youtube.com/embed/T68XW9Q-PqQ?autoplay=1&mute=1",
    timeAgo: "1w ago"
  }
];

export function InfluencerReviews({
  title = "Creator Reviews",
  subtitle = "Trusted voices, real opinions",
  brandName,
  featuredReview,
  reviews,
  allowAdd = false,
}: InfluencerReviewsProps) {
  const { currentUser } = useGlobalState();
  const canAddCreatorReview = allowAdd && currentUser?.role === 'admin';

  // Gracefully filter/merge external properties avoiding TS typing errors
  const baseReviews = reviews && reviews.length > 0 ? reviews.map((r, i) => {
    const defaultCard = curatedReviews[i % curatedReviews.length];
    return {
      ...defaultCard,
      id: r.id || `ext-${i}`,
      image: r.image || defaultCard.image,
      category: r.category || defaultCard.category,
      title: r.title || defaultCard.title,
      authorName: r.authorName || defaultCard.authorName,
      authorHandle: r.authorHandle || defaultCard.authorHandle,
      authorAvatar: r.authorAvatar || defaultCard.authorAvatar,
      platform: r.platform || defaultCard.platform,
      aspectRatio: r.aspectRatio || defaultCard.aspectRatio,
      videoUrl: r.videoUrl || defaultCard.videoUrl,
      timeAgo: r.timeAgo || defaultCard.timeAgo
    };
  }) : curatedReviews;

  const reviewsKey = JSON.stringify(reviews);

  const [activePlatformFilter, setActivePlatformFilter] = useState<'ALL' | 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook'>('ALL');
  const [playingVideoId, setPlayingVideoId] = useState<string | number | null>(null);
  const [localReviews, setLocalReviews] = useState<InfluencerReviewCard[]>(baseReviews);

  // Toggleable submission form state at bottom
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    authorHandle: '',
    platform: 'YouTube' as 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook',
    title: '',
    category: 'Product Review',
    videoUrl: '',
    aspectRatio: 'landscape' as 'landscape' | 'portrait',
  });

  // Initialize and sync base reviews list
  useEffect(() => {
    setLocalReviews(baseReviews);
  }, [reviewsKey, brandName]);

  // Safely map incoming props or fall back to curated specifications
  const finalFeatured: InfluencerFeaturedReview = {
    ...curatedFeaturedReview,
    ...(featuredReview ? {
      title: featuredReview.title,
      excerpt: featuredReview.excerpt,
      authorName: featuredReview.authorName,
      authorSub: featuredReview.authorSub || "Creator Expert",
      authorLogo: featuredReview.authorLogo || featuredReview.authorName.substring(0, 2),
      badgeText: featuredReview.badgeText || "In-depth Review",
      platform: featuredReview.platform || "YouTube",
      videoUrl: featuredReview.videoUrl || "https://www.youtube.com/embed/PjRreH0T_W4?autoplay=1&mute=1",
      stats: featuredReview.stats || curatedFeaturedReview.stats
    } : {}),
  };

  if (brandName) {
    if (!featuredReview) {
      finalFeatured.title = `Why ${brandName} remains a top choice in 2024`;
      finalFeatured.excerpt = `An inside look at how ${brandName} approaches fit, aesthetic cohesion, and everyday wearability. We map performance to value.`;
    }
  }

  const filteredReviews = localReviews.filter((review) => {
    if (activePlatformFilter === 'ALL') return true;
    return review.platform === activePlatformFilter;
  });

  const getPlatformIcon = (platform: 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook') => {
    switch (platform) {
      case 'YouTube':
        return <Youtube size={12} className="shrink-0 text-red-500" />;
      case 'Instagram':
        return <Instagram size={12} className="shrink-0 text-pink-500" />;
      case 'TikTok':
        return <TikTokIcon className="w-3 h-3 shrink-0 text-cyan-400" />;
      case 'Facebook':
        return <Facebook size={12} className="shrink-0 text-blue-500" />;
    }
  };

  const handlePlayFeatured = () => {
    setPlayingVideoId('featured');
    toast.success(`Loading review stream by ${finalFeatured.authorName}`);
  };

  const handlePlayCard = (id: string | number, author: string) => {
    setPlayingVideoId(id);
    toast.success(`Loading review stream by ${author}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { authorName, authorHandle, platform, title, category, videoUrl, aspectRatio } = formData;

    if (!authorName.trim() || !authorHandle.trim() || !title.trim() || !videoUrl.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const cleanHandle = authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`;
    const initials = authorName.trim().substring(0, 2).toUpperCase() || "CR";

    // Set high quality default thumbnail from list
    const fallbackThumb = aspectRatio === 'portrait' 
      ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop'
      : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop';

    const newCard: InfluencerReviewCard = {
      id: `custom-card-${Date.now()}`,
      image: fallbackThumb,
      category: category || "Creator Review",
      title,
      authorName,
      authorHandle: cleanHandle,
      authorAvatar: initials,
      platform,
      aspectRatio,
      videoUrl,
      timeAgo: "Just now"
    };

    setLocalReviews([newCard, ...localReviews]);
    toast.success("Creator review dynamic stream added perfectly!");
    
    // Clear form
    setFormData({
      authorName: '',
      authorHandle: '',
      platform: 'YouTube',
      title: '',
      category: 'Product Review',
      videoUrl: '',
      aspectRatio: 'landscape',
    });
    setShowAddForm(false);
  };

  // Helper to split a subtitle beautifully with elegant italics styling
  const renderSubtitleText = () => {
    if (!subtitle) {
      return (
        <>
          Trusted voices, <span className="italic text-[#8B949E] font-normal">real opinions</span>
        </>
      );
    }
    if (subtitle.includes(',')) {
      const parts = subtitle.split(',');
      return (
        <>
          {parts[0].trim()}, <span className="italic text-[#8B949E] font-normal">{parts[1].trim()}</span>
        </>
      );
    }
    return subtitle;
  };

  return (
    <section 
      id="influencer-reviews-section" 
      className="font-['DM_Sans',_sans-serif] hero-gradient text-[#F0F6FC] p-4 sm:p-6 md:p-8 rounded-[5px] border border-[#21262D]/60 w-full max-w-[680px] mx-auto text-left flex flex-col justify-start shadow-xl my-6 relative overflow-hidden"
    >
      {/* PART 1 — SECTION HEADER */}
      <div className="text-center mb-6 border-0 p-0 bg-transparent flex flex-col items-center">
        {/* Small ALL-CAPS eyebrow */}
        <p className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#8B949E] mb-2">
          <span className="w-5 h-[0.5px] bg-[#21262D]" />
          {title}
          <span className="w-5 h-[0.5px] bg-[#21262D]" />
        </p>

        {/* Dynamic H2 heading with italic logic */}
        <h2 className="font-['DM_Serif_Display',_serif] text-xl sm:text-2xl md:text-3xl font-normal leading-[1.2] tracking-tight text-[#F0F6FC] mt-1 mb-4">
          {renderSubtitleText()}
        </h2>

        {/* Filter Pills list - horizontal scrolling configured on mobile, centered on desktop */}
        <div className="flex flex-nowrap md:justify-center items-center gap-1.5 overflow-x-auto no-scrollbar w-full py-1.5 justify-start max-w-full select-none">
          {(['ALL', 'YouTube', 'Instagram', 'TikTok', 'Facebook'] as const).map((filter) => {
            const isActive = activePlatformFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setActivePlatformFilter(filter);
                  setPlayingVideoId(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer border select-none whitespace-nowrap outline-none ${
                  isActive
                    ? "bg-[#FF6B35] text-white border-[#FF6B35] shadow-sm shadow-[#FF6B35]/20"
                    : "bg-transparent text-[#8B949E] border-[#21262D] hover:text-[#F0F6FC] hover:border-[#8B949E]/40"
                }`}
              >
                {filter !== 'ALL' && getPlatformIcon(filter)}
                <span className="leading-none">{filter === 'ALL' ? 'All' : filter}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PART 2 — FEATURED VIDEO BLOCK */}
      <div className="flex flex-col sm:flex-row items-stretch border border-[#21262D]/70 rounded-[5px] overflow-hidden bg-[#161B22] mb-6 shadow-md shadow-[#000]/10">
        
        {/* Left Side: 16:9 Aspect Video Embed / Placeholder */}
        <div className="w-full sm:w-[52%] relative bg-[#0D1117] aspect-[16/9] flex-shrink-0">
          <VideoArea
            id="featured"
            videoUrl={finalFeatured.videoUrl || ""}
            image={finalFeatured.image}
            platform={finalFeatured.platform || "YouTube"}
            aspectRatio="landscape"
            isPlaying={playingVideoId === 'featured'}
            onPlay={handlePlayFeatured}
          />
          
          {/* Absolute Platform Badge Overlay */}
          {!playingVideoId || playingVideoId !== 'featured' ? (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="bg-[#0D1117]/85 backdrop-blur-md border border-[#21262D] text-[#F0F6FC] px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm select-none">
                {getPlatformIcon(finalFeatured.platform || 'YouTube')}
                {finalFeatured.platform}
              </span>
            </div>
          ) : null}
        </div>

        {/* Right Side: Editorial Meta Desk */}
        <div className="w-full sm:w-[48%] bg-[#161B22] p-4.5 flex flex-col justify-between flex-shrink-0 text-left min-w-0">
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8B949E] mb-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              {finalFeatured.platform} · {finalFeatured.badgeText}
            </p>
            <h3 className="font-['DM_Serif_Display',_serif] text-base sm:text-lg font-normal text-[#F0F6FC] leading-snug tracking-tight mb-2 truncate">
              {finalFeatured.title}
            </h3>
            <p className="text-xs text-[#8B949E] leading-relaxed font-light line-clamp-3 mb-4">
              {finalFeatured.excerpt}
            </p>
          </div>

          <div className="pt-3 border-t border-[#21262D]/60 space-y-3.5 mt-auto">
            {/* Stats list with safe wrapping */}
            <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[#8B949E]">
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                <Eye size={12} className="text-[#8B949E]/70" />
                <span className="text-[#F0F6FC]">{finalFeatured.stats?.views || "124K"} views</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                <ThumbsUp size={12} className="text-[#8B949E]/70" />
                <span className="text-[#F0F6FC]">{finalFeatured.stats?.likes || "8.2K"}</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                <Clock size={12} className="text-[#8B949E]/70" />
                <span className="text-[#F0F6FC]">{finalFeatured.stats?.duration || "18 min"}</span>
              </span>
            </div>

            {/* Author bar */}
            <div className="flex items-center gap-2.5 min-w-0">
              <RenderAvatar avatar={finalFeatured.authorLogo || ""} name={finalFeatured.authorName} size="md" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#F0F6FC] leading-none truncate mb-0.5">
                  {finalFeatured.authorName}
                </span>
                <span className="text-[10px] text-[#8B949E] truncate">
                  {finalFeatured.authorSub || "@techreviewbd"}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* PART 3 — CARD GRID */}
      {filteredReviews.length === 0 ? (
        <div className="w-full text-center py-10 bg-[#161B22] border border-[#21262D] rounded-[5px] text-gray-400">
          Creator content coming soon
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1px] bg-[#21262D]/60 rounded-[5px] overflow-hidden border border-[#21262D]/60 shadow-inner">
          {filteredReviews.map((review) => {
            const isPlaying = playingVideoId === review.id;
            const isPortrait = review.aspectRatio === 'portrait';
            
            return (
              <div 
                key={review.id} 
                data-platform={review.platform?.toLowerCase()}
                className="ir-card flex flex-col bg-[#161B22] h-full transition-all duration-200"
              >
                {/* Stabilized Video Thumbnails with locked proportional aspects */}
                <div className={`relative bg-[#0D1117] overflow-hidden ${
                  isPortrait ? "aspect-[3/4]" : "aspect-[16/10]"
                }`}>
                  <VideoArea
                    id={review.id}
                    videoUrl={review.videoUrl || ""}
                    image={review.image}
                    platform={review.platform || 'Instagram'}
                    aspectRatio={review.aspectRatio || 'landscape'}
                    isPlaying={isPlaying}
                    onPlay={() => handlePlayCard(review.id, review.authorName)}
                  />

                  {/* Absolute platform overlay label */}
                  {!isPlaying ? (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="bg-[#0D1117]/85 backdrop-blur-md border border-[#21262D] text-[#F0F6FC] px-1.5 py-0.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm select-none">
                        {getPlatformIcon(review.platform || 'Instagram')}
                        {review.platform === 'Instagram' ? 'Reel' : review.platform}
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Card Body - optimized spacing to align contents and metadata perfectly */}
                <div className="p-3.5 flex flex-col flex-grow text-left bg-[#161B22]">
                  <span className="text-[9.5px] font-extrabold text-[#FF6B35] tracking-widest uppercase mb-1">
                    {review.category}
                  </span>
                  
                  {/* Clean text body with min-height constraint for perfect alignment, never overlapping */}
                  <h4 className="text-[12.5px] font-medium text-[#F0F6FC] leading-snug line-clamp-2 min-h-[35px] text-left text-ellipsis overflow-hidden mt-0.5 mb-3.5">
                    {review.title}
                  </h4>

                  {/* Separator / Creator metadata row with automatic bottom anchoring */}
                  <div className="flex items-center justify-between border-t border-[#21262D]/60 pt-2.5 mt-auto">
                    <div className="flex items-center gap-2 min-w-0">
                      <RenderAvatar avatar={review.authorAvatar} name={review.authorName} size="sm" />
                      <span className="text-[11px] text-[#8B949E] truncate font-medium">
                        {review.authorHandle}
                      </span>
                    </div>
                    <span className="text-[9.5px] text-[#8B949E] font-mono shrink-0">
                      {review.timeAgo}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PART 4 — ACCORDION DROPDOWN SUBMISSION FORM FOR CUSTOM INFLUENCER REVIEWS */}
      {canAddCreatorReview && showAddForm && (
        <div className="mt-5 p-5 bg-[#161B22] border border-[#21262D] rounded-[5px] anim-fade text-left space-y-4">
          <div className="flex items-center justify-between border-b border-[#21262D] pb-2.5">
            <h4 className="font-['DM_Serif_Display',_serif] text-lg text-[#F0F6FC] font-normal tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              Add Creator Review
            </h4>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-['DM_Sans',_sans-serif]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8B949E] font-medium mb-1 uppercase tracking-wider text-[9px]">Creator Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Style Guru" 
                  value={formData.authorName}
                  onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-[#F0F6FC] focus:outline-none focus:border-[#FF6B35] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#8B949E] font-medium mb-1 uppercase tracking-wider text-[9px]">Social Handle *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. @styleguru" 
                  value={formData.authorHandle}
                  onChange={(e) => setFormData({...formData, authorHandle: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-[#F0F6FC] focus:outline-none focus:border-[#FF6B35] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8B949E] font-medium mb-1 uppercase tracking-wider text-[9px]">Platform *</label>
                <select 
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-[#F0F6FC] focus:outline-none focus:border-[#FF6B35] transition-colors"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram (Reel)</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook (Video)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#8B949E] font-medium mb-1 uppercase tracking-wider text-[9px]">Category/Tag</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fashion Vibes, Unboxing" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-[#F0F6FC] focus:outline-none focus:border-[#FF6B35] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8B949E] font-medium mb-1 uppercase tracking-wider text-[9px]">Review Video Title *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. First look at the stunning fabric quality!" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-[#F0F6FC] focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#8B949E] font-medium mb-1 uppercase tracking-wider text-[9px]">Video URL or YouTube Watch/Short Link *</label>
              <input 
                type="url" 
                required
                placeholder="e.g. https://www.youtube.com/watch?v=T68XW9Q-PqQ or any embed URL" 
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                className="w-full bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-[#F0F6FC] focus:outline-none focus:border-[#FF6B35] transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                ProTip: Supports YouTube shorts, standard videos, and direct iframe embed links safely.
              </p>
            </div>

            <div>
              <label className="block text-[#8B949E] font-medium mb-1 uppercase tracking-wider text-[9px]">Preferred Video Aspect Design *</label>
              <div className="flex items-center gap-4 mt-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-[#F0F6FC]">
                  <input 
                    type="radio" 
                    name="aspectRatio" 
                    checked={formData.aspectRatio === 'landscape'}
                    onChange={() => setFormData({...formData, aspectRatio: 'landscape'})}
                    className="accent-[#FF6B35]"
                  />
                  Horizontal (16:10 / 16:9)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#F0F6FC]">
                  <input 
                    type="radio" 
                    name="aspectRatio" 
                    checked={formData.aspectRatio === 'portrait'}
                    onChange={() => setFormData({...formData, aspectRatio: 'portrait'})}
                    className="accent-[#FF6B35]"
                  />
                  Vertical Reels/TikTok (3:4)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-[#21262D] hover:bg-[#30363D] text-[#F0F6FC] font-semibold py-2 px-4 rounded-[6px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#FF6B35] hover:bg-[#ff8554] text-white font-semibold py-2 px-5 rounded-[6px] transition-colors shadow-sm shadow-[#FF6B35]/20 cursor-pointer"
              >
                Add Creator Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PART 5 — TRIGGER BUTTON to match mock design */}
      {canAddCreatorReview && !showAddForm && (
        <button 
          onClick={() => {
            setShowAddForm(true);
            // Scroll to form area smoothly
            setTimeout(() => {
              document.getElementById('influencer-reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
          }}
          className="flex items-center justify-center gap-2 w-full py-3.5 mt-5 border border-dashed border-[#21262D] rounded-[5px] bg-transparent hover:bg-[#161B22] text-[#8B949E] hover:text-[#F0F6FC] text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none"
        >
          <Plus size={14} className="text-[#8B949E]" />
          Add creator review
        </button>
      )}

    </section>
  );
}
