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
  /** Use full container width on detail pages (default: centered 680px card) */
  fullWidth?: boolean;
}

import { getVideoEmbedUrl } from '../lib/videoEmbed';
import { CREATOR_HYBRID_GRID } from '../lib/pageLayout';

type ReviewPlatform = 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook';

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
      <div className={`${sizeClass} rounded-full overflow-hidden border border-[#e8edf2] bg-white flex-shrink-0 flex items-center justify-center shadow-sm`}>
        <img src={safeAvatar} alt={name || "avatar"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
    );
  }

  const displayLetters = typeof name === 'string' && name.trim().length > 0
    ? name.trim().substring(0, 2)
    : (typeof safeAvatar === 'string' && safeAvatar.trim().length > 0 ? safeAvatar.trim().substring(0, 2) : "CR");

  return (
    <div className={`${sizeClass} rounded-full bg-[#FFF0E8] border border-[#FFD4BC] flex items-center justify-center font-bold text-[#E8500A] shrink-0 uppercase`}>
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
        return <Youtube size={24} className="text-white/80" />;
      case 'Instagram':
        return <Instagram size={24} className="text-white/80" />;
      case 'TikTok':
        return <TikTokIcon className="w-6 h-6 text-white/80" />;
      case 'Facebook':
        return <Facebook size={24} className="text-white/80" />;
      default:
        return <Video size={24} className="text-[#8B949E]/10" />;
    }
  };

  const cleanEmbed = getVideoEmbedUrl(videoUrl);

  if (isPlaying && cleanEmbed) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black z-10 select-none overflow-hidden">
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
      className="absolute inset-0 w-full h-full cursor-pointer group flex items-center justify-center overflow-hidden transition-all duration-300 select-none"
    >
      <img 
        src={image} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
        alt="Video Thumbnail"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20" />

      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <div className="w-11 h-11 rounded-full bg-[#E8500A] text-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF6B00] shrink-0">
          <Play size={14} className="fill-current ml-0.5 text-white" />
        </div>
        <span className="text-[10px] text-white/90 font-semibold tracking-wide drop-shadow-sm">
          Watch review
        </span>
      </div>

      <div className="absolute right-3 bottom-3 opacity-70">
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
  },
  {
    id: "card-7",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=600&fit=crop",
    category: "Deep Dive",
    title: "Long-term durability test — 90 days later",
    authorName: "Tech Review BD",
    authorHandle: "@techreviewbd",
    authorAvatar: "TR",
    platform: "YouTube",
    aspectRatio: "landscape",
    videoUrl: "https://www.youtube.com/embed/PjRreH0T_W4?autoplay=1&mute=1",
    timeAgo: "2w ago"
  },
  {
    id: "card-8",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop",
    category: "Quick Take",
    title: "60-second honest verdict — worth it?",
    authorName: "Daily Drop BD",
    authorHandle: "@dailydrop",
    authorAvatar: "DD",
    platform: "TikTok",
    aspectRatio: "portrait",
    videoUrl: "https://www.youtube.com/embed/bZha6f-Z35M?autoplay=1&mute=1",
    timeAgo: "4d ago"
  }
];

const isPortraitReview = (review: InfluencerReviewCard): boolean => {
  if (review.aspectRatio === 'portrait') return true;
  if (review.aspectRatio === 'landscape') return false;
  return review.platform === 'Instagram' || review.platform === 'TikTok';
};

const DENSE_ROW_MAX = 5;

/** Lead row: up to 2 cards (any mix). Following rows: up to 5 per row, order preserved. */
const buildCreatorReviewRows = (reviews: InfluencerReviewCard[]): InfluencerReviewCard[][] => {
  if (reviews.length === 0) return [];
  if (reviews.length === 1) return [[reviews[0]]];

  const rows: InfluencerReviewCard[][] = [reviews.slice(0, 2)];

  let index = 2;
  while (index < reviews.length) {
    rows.push(reviews.slice(index, index + DENSE_ROW_MAX));
    index += DENSE_ROW_MAX;
  }

  return rows;
};

interface CreatorReviewCardProps {
  review: InfluencerReviewCard;
  isPlaying: boolean;
  onPlay: () => void;
  getPlatformIcon: (platform: ReviewPlatform) => React.ReactNode;
  variant: 'landscape' | 'portrait';
}

function CreatorReviewCard({
  review,
  isPlaying,
  onPlay,
  getPlatformIcon,
  variant,
  dense = false,
}: CreatorReviewCardProps & { dense?: boolean }) {
  const isPortrait = variant === 'portrait';

  return (
    <div
      data-platform={review.platform?.toLowerCase()}
      data-format={variant}
      className="choosify-creator-hybrid-card ir-card flex flex-col bg-white h-full transition-all duration-200 rounded-[12px] border border-[#e8edf2] overflow-hidden shadow-[0_4px_16px_rgba(26,29,78,0.04)] hover:shadow-[0_8px_24px_rgba(232,80,10,0.08)] hover:border-[#E8500A]/20"
    >
      <div
        className={`relative bg-[#eef2f7] overflow-hidden ${
          isPortrait
            ? dense
              ? 'aspect-[9/14] max-h-[300px] w-full mx-auto'
              : 'aspect-[9/16]'
            : 'aspect-[16/10]'
        }`}
      >
        <VideoArea
          id={review.id}
          videoUrl={review.videoUrl || ''}
          image={review.image}
          platform={review.platform || 'Instagram'}
          aspectRatio={isPortrait ? 'portrait' : 'landscape'}
          isPlaying={isPlaying}
          onPlay={onPlay}
        />

        {!isPlaying ? (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-white/95 backdrop-blur-md border border-white/80 text-[#1A1D4E] px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm select-none">
              {getPlatformIcon(review.platform || 'Instagram')}
              {review.platform === 'Instagram' || review.platform === 'TikTok'
                ? 'Reel'
                : review.platform}
            </span>
          </div>
        ) : null}
      </div>

      <div className={`flex flex-col flex-grow text-left bg-white ${isPortrait ? 'p-3' : 'p-4'}`}>
        <span className="text-[9px] font-black text-[#E8500A] tracking-[0.14em] uppercase mb-1.5">
          {review.category}
        </span>

        <h4
          className={`font-bold text-[#1A1D4E] leading-snug line-clamp-2 text-left mb-3 ${
            isPortrait ? 'text-[12px] min-h-[34px]' : 'text-[13px] min-h-[38px]'
          }`}
        >
          {review.title}
        </h4>

        <div className="flex items-center justify-between border-t border-[#e8edf2] pt-3 mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <RenderAvatar avatar={review.authorAvatar} name={review.authorName} size="sm" />
            <span className="text-[11px] text-[#64748b] truncate font-semibold">
              {review.authorHandle}
            </span>
          </div>
          <span className="text-[9px] text-[#8a9bb0] font-mono shrink-0">{review.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export function InfluencerReviews({
  title = "Creator Reviews",
  subtitle = "Trusted voices, real opinions",
  brandName,
  featuredReview,
  reviews,
  allowAdd = false,
  fullWidth = false,
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

  const creatorRows = buildCreatorReviewRows(filteredReviews);
  const hasHybridFeed = creatorRows.length > 0;

  const isFilterActive = activePlatformFilter !== 'ALL';
  // Featured hero only belongs in the feed when its platform survives the active filter
  const showFeaturedBlock =
    !isFilterActive || (finalFeatured.platform || 'YouTube') === activePlatformFilter;

  const clearPlatformFilter = () => {
    setActivePlatformFilter('ALL');
    setPlayingVideoId(null);
  };

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
          Trusted voices, <span className="text-[#E8500A] not-italic">real opinions</span>
        </>
      );
    }
    if (subtitle.includes(',')) {
      const parts = subtitle.split(',');
      return (
        <>
          {parts[0].trim()}, <span className="text-[#E8500A] not-italic">{parts[1].trim()}</span>
        </>
      );
    }
    return subtitle;
  };

  return (
    <section 
      id="influencer-reviews-section" 
      className={`font-sans text-[#1A1A2E] p-4 sm:p-6 md:p-8 rounded-[12px] border border-[#e8edf2] bg-white text-left flex flex-col justify-start shadow-[0_8px_30px_rgba(26,29,78,0.06)] relative overflow-hidden ${
        fullWidth ? 'w-full max-w-none my-0' : 'w-full max-w-[680px] mx-auto my-6'
      }`}
    >
      {/* PART 1 — SECTION HEADER */}
      <div className="text-center mb-6 border-0 p-0 bg-transparent flex flex-col items-center">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.18em] uppercase text-[#8a9bb0] mb-2">
          <span className="w-5 h-px bg-[#e8edf2]" />
          {title}
          <span className="w-5 h-px bg-[#e8edf2]" />
        </p>

        <h2 className="font-sans text-xl sm:text-2xl md:text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-[#1A1A2E] mt-1 mb-4">
          {renderSubtitleText()}
        </h2>

        <div className="flex flex-nowrap md:justify-center items-center gap-2 overflow-x-auto no-scrollbar w-full py-1.5 justify-start max-w-full select-none">
          {(['ALL', 'YouTube', 'Instagram', 'TikTok', 'Facebook'] as const).map((filter) => {
            const isActive = activePlatformFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setActivePlatformFilter(filter);
                  setPlayingVideoId(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border select-none whitespace-nowrap outline-none ${
                  isActive
                    ? "bg-[#E8500A] text-white border-[#E8500A] shadow-sm shadow-[#E8500A]/20"
                    : "bg-white text-[#64748b] border-[#e8edf2] hover:text-[#1A1D4E] hover:border-[#E8500A]/30"
                }`}
              >
                {filter !== 'ALL' && getPlatformIcon(filter)}
                <span className="leading-none">{filter === 'ALL' ? 'All' : filter}</span>
              </button>
            );
          })}

          {isFilterActive && (
            <button
              onClick={clearPlatformFilter}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-dashed border-[#E8500A]/40 bg-[#FFF0E8] text-[#E8500A] hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A] select-none whitespace-nowrap outline-none"
            >
              <X size={11} className="shrink-0" />
              <span className="leading-none">Clear Filter</span>
            </button>
          )}
        </div>

        {isFilterActive && (
          <p className="mt-2.5 text-[10px] font-bold text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8500A] animate-pulse" />
            Showing {filteredReviews.length} {activePlatformFilter} review{filteredReviews.length === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {/* PART 2 — FEATURED VIDEO BLOCK (hidden when it doesn't match the active platform filter) */}
      {showFeaturedBlock && (
      <div className="flex flex-col sm:flex-row items-stretch border border-[#e8edf2] rounded-[12px] overflow-hidden bg-white mb-6 shadow-[0_4px_18px_rgba(26,29,78,0.05)]">
        
        <div className="w-full sm:w-[52%] relative bg-[#0f172a] aspect-[16/9] flex-shrink-0">
          <VideoArea
            id="featured"
            videoUrl={finalFeatured.videoUrl || ""}
            image={finalFeatured.image}
            platform={finalFeatured.platform || "YouTube"}
            aspectRatio="landscape"
            isPlaying={playingVideoId === 'featured'}
            onPlay={handlePlayFeatured}
          />
          
          {!playingVideoId || playingVideoId !== 'featured' ? (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-white/95 backdrop-blur-md border border-white/80 text-[#1A1D4E] px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm select-none">
                {getPlatformIcon(finalFeatured.platform || 'YouTube')}
                {finalFeatured.platform}
              </span>
            </div>
          ) : null}
        </div>

        <div className="w-full sm:w-[48%] bg-white p-5 sm:p-6 flex flex-col justify-between flex-shrink-0 text-left min-w-0 border-t sm:border-t-0 sm:border-l border-[#e8edf2]">
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#E8500A] mb-2">
              <span className="inline-block w-1 h-3 rounded-full bg-[#E8500A]" />
              {finalFeatured.badgeText || 'In-depth Review'}
            </p>
            <h3 className="font-space text-lg sm:text-xl font-black text-[#1A1D4E] leading-snug tracking-tight mb-2.5 line-clamp-2">
              {finalFeatured.title}
            </h3>
            <p className="text-sm text-[#64748b] leading-relaxed line-clamp-4 mb-4">
              {finalFeatured.excerpt}
            </p>
          </div>

          <div className="pt-4 border-t border-[#e8edf2] space-y-3.5 mt-auto">
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[#64748b]">
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                <Eye size={12} className="text-[#E8500A]/70" />
                <span className="text-[#1A1D4E]">{finalFeatured.stats?.views || "124K"} views</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                <ThumbsUp size={12} className="text-[#E8500A]/70" />
                <span className="text-[#1A1D4E]">{finalFeatured.stats?.likes || "8.2K"}</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                <Clock size={12} className="text-[#E8500A]/70" />
                <span className="text-[#1A1D4E]">{finalFeatured.stats?.duration || "18 min"}</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 min-w-0">
              <RenderAvatar avatar={finalFeatured.authorLogo || ""} name={finalFeatured.authorName} size="md" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-[#1A1D4E] leading-none truncate mb-0.5 uppercase">
                  {finalFeatured.authorName}
                </span>
                <span className="text-[10px] text-[#8a9bb0] truncate font-medium">
                  {finalFeatured.authorSub || "@techreviewbd"}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
      )}

      {/* PART 3 — HYBRID FEED (row 1: up to 3; row 2+: up to 4 reels per row) */}
      {!hasHybridFeed ? (
        <div className="w-full text-center py-10 bg-[#F8FAFC] border border-[#e8edf2] rounded-[12px] text-[#8a9bb0] flex flex-col items-center gap-3">
          <span className="text-sm font-semibold">
            {isFilterActive
              ? `No ${activePlatformFilter} reviews yet for this listing`
              : 'Creator content coming soon'}
          </span>
          {isFilterActive && (
            <button
              onClick={clearPlatformFilter}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E8500A]/40 text-[#E8500A] hover:bg-[#E8500A] hover:text-white transition-all cursor-pointer select-none"
            >
              <X size={11} className="shrink-0" />
              Clear Filter & Show All
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {creatorRows.map((row, rowIndex) => {
            const rowTier = rowIndex === 0 ? 'lead' : 'dense';
            return (
              <div
                key={`creator-hybrid-row-${rowIndex}`}
                className={CREATOR_HYBRID_GRID}
                data-row-tier={rowTier}
                data-row-size={row.length}
              >
                {row.map((review) => {
                  const isPortrait = isPortraitReview(review);
                  return (
                    <CreatorReviewCard
                      key={review.id}
                      review={review}
                      variant={isPortrait ? 'portrait' : 'landscape'}
                      dense={rowTier === 'dense' && isPortrait}
                      isPlaying={playingVideoId === review.id}
                      onPlay={() => handlePlayCard(review.id, review.authorName)}
                      getPlatformIcon={getPlatformIcon}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* PART 4 — ACCORDION DROPDOWN SUBMISSION FORM FOR CUSTOM INFLUENCER REVIEWS */}
      {canAddCreatorReview && showAddForm && (
        <div className="mt-5 p-5 bg-[#F8FAFC] border border-[#e8edf2] rounded-[12px] anim-fade text-left space-y-4">
          <div className="flex items-center justify-between border-b border-[#e8edf2] pb-2.5">
            <h4 className="font-space text-lg text-[#1A1D4E] font-black tracking-wide flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8500A]" />
              Add Creator Review
            </h4>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-[#8a9bb0] hover:text-[#1A1D4E] transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#64748b] font-bold mb-1 uppercase tracking-wider text-[9px]">Creator Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Style Guru" 
                  value={formData.authorName}
                  onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                  className="w-full bg-white border border-[#e8edf2] rounded-[8px] px-3 py-2 text-[#1A1D4E] focus:outline-none focus:border-[#E8500A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#64748b] font-bold mb-1 uppercase tracking-wider text-[9px]">Social Handle *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. @styleguru" 
                  value={formData.authorHandle}
                  onChange={(e) => setFormData({...formData, authorHandle: e.target.value})}
                  className="w-full bg-white border border-[#e8edf2] rounded-[8px] px-3 py-2 text-[#1A1D4E] focus:outline-none focus:border-[#E8500A] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#64748b] font-bold mb-1 uppercase tracking-wider text-[9px]">Platform *</label>
                <select 
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                  className="w-full bg-white border border-[#e8edf2] rounded-[8px] px-3 py-2 text-[#1A1D4E] focus:outline-none focus:border-[#E8500A] transition-colors"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram (Reel)</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook (Video)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#64748b] font-bold mb-1 uppercase tracking-wider text-[9px]">Category/Tag</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fashion Vibes, Unboxing" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border border-[#e8edf2] rounded-[8px] px-3 py-2 text-[#1A1D4E] focus:outline-none focus:border-[#E8500A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#64748b] font-bold mb-1 uppercase tracking-wider text-[9px]">Review Video Title *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. First look at the stunning fabric quality!" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white border border-[#e8edf2] rounded-[8px] px-3 py-2 text-[#1A1D4E] focus:outline-none focus:border-[#E8500A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#64748b] font-bold mb-1 uppercase tracking-wider text-[9px]">Video URL or YouTube Watch/Short Link *</label>
              <input 
                type="url" 
                required
                placeholder="e.g. https://www.youtube.com/watch?v=T68XW9Q-PqQ or any embed URL" 
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                className="w-full bg-white border border-[#e8edf2] rounded-[8px] px-3 py-2 text-[#1A1D4E] focus:outline-none focus:border-[#E8500A] transition-colors"
              />
              <p className="text-[10px] text-[#8a9bb0] mt-1">
                ProTip: Supports YouTube shorts, standard videos, and direct iframe embed links safely.
              </p>
            </div>

            <div>
              <label className="block text-[#64748b] font-bold mb-1 uppercase tracking-wider text-[9px]">Preferred Video Aspect Design *</label>
              <div className="flex items-center gap-4 mt-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-[#1A1D4E]">
                  <input 
                    type="radio" 
                    name="aspectRatio" 
                    checked={formData.aspectRatio === 'landscape'}
                    onChange={() => setFormData({...formData, aspectRatio: 'landscape'})}
                    className="accent-[#E8500A]"
                  />
                  Horizontal (16:10 / 16:9)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#1A1D4E]">
                  <input 
                    type="radio" 
                    name="aspectRatio" 
                    checked={formData.aspectRatio === 'portrait'}
                    onChange={() => setFormData({...formData, aspectRatio: 'portrait'})}
                    className="accent-[#E8500A]"
                  />
                  Vertical Reels/TikTok (3:4)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-white hover:bg-[#F8FAFC] text-[#1A1D4E] font-semibold py-2 px-4 rounded-[8px] border border-[#e8edf2] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#E8500A] hover:bg-[#FF6B00] text-white font-semibold py-2 px-5 rounded-[8px] transition-colors shadow-sm shadow-[#E8500A]/20 cursor-pointer"
              >
                Add Creator Review
              </button>
            </div>
          </form>
        </div>
      )}

      {canAddCreatorReview && !showAddForm && (
        <button 
          onClick={() => {
            setShowAddForm(true);
            setTimeout(() => {
              document.getElementById('influencer-reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
          }}
          className="flex items-center justify-center gap-2 w-full py-3.5 mt-5 border border-dashed border-[#e8edf2] rounded-[12px] bg-[#F8FAFC] hover:bg-white text-[#64748b] hover:text-[#1A1D4E] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none"
        >
          <Plus size={14} className="text-[#E8500A]" />
          Add creator review
        </button>
      )}

    </section>
  );
}
