import React from 'react';
import { 
  Check, CheckCircle2, Globe, Heart, Share2, MessageSquare, 
  MoreHorizontal, Info, Star, Users, Facebook, Instagram, 
  Linkedin, Youtube, MapPin, Calendar, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';

// Inline TikTok icon SVG for high fidelity
function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

// Inline X icon SVG for high fidelity
function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export interface MetricBreakdown {
  label: string;
  value: number;
}

export interface UnifiedProfileHeroProps {
  type: 'brand' | 'creator';
  id: string;
  name: string;
  verified?: boolean;
  handle?: string;
  category?: string;
  country?: string;
  founded?: string;
  title?: string; // e.g. "Sr. Tech Analyst & Digital Product Researcher"
  bio?: string;
  tagline?: string;
  logoUrl?: string;
  websiteUrl?: string;
  bannerImage?: string;
  bannerClass?: string; // e.g. Tailwind gradient fallback
  accentColor?: string; // hex code for border ring/accents
  socials?: {
    fb?: string;
    ig?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    x?: string;
    website?: string;
  };
  score: {
    value: string | number;
    max?: string | number;
    reviewsCountLabel?: string;
    recommendPctLabel?: string;
    breakdown?: MetricBreakdown[];
  };
  isFollowed: boolean;
  onToggleFollow: () => void;
  onShare: () => void;
  onMessage?: () => void;
  
  // Sticky Navigation rendering
  navigationItems?: { id: string; label: string; count?: string | number }[];
  activeTabId?: string;
  onTabClick?: (id: string) => void;
}

export const UnifiedProfileHero: React.FC<UnifiedProfileHeroProps> = ({
  type,
  name,
  verified = true,
  handle,
  category,
  country,
  founded,
  title,
  bio,
  tagline,
  logoUrl,
  websiteUrl,
  bannerImage,
  bannerClass = "from-[#050C24] via-[#0D1530] to-[#170C35]",
  accentColor = "#FF5B00",
  socials,
  score,
  isFollowed,
  onToggleFollow,
  onShare,
  onMessage,
  navigationItems,
  activeTabId,
  onTabClick
}) => {
  
  // Parse social links and filter empty ones
  const activeSocials = React.useMemo(() => {
    if (!socials) return [];
    return Object.entries(socials)
      .filter(([_, value]) => value && value !== "#" && value !== "")
      .map(([key, value]) => ({ platform: key, url: value }));
  }, [socials]);

  const hasSocials = activeSocials.length > 0;

  // Render the Trust/Score Card
  const renderScoreCard = (isMobile: boolean) => {
    const isBrand = type === 'brand';
    const breakdown = score.breakdown || [];
    
    return (
      <div 
        className={cn(
          "bg-slate-950/75 backdrop-blur-xl border border-white/15 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between select-none text-left",
          isMobile 
            ? "w-full" 
            : "absolute top-5 right-5 bottom-5 w-[330px] hidden lg:flex"
        )}
      >
        {/* Glow orb inside card */}
        <div 
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
            {isBrand ? "BRAND SCORE" : "TRUST SCORE"}
            <HelpCircle size={12} className="text-slate-400" />
          </span>
          <span className="text-[10px] font-extrabold bg-white/10 text-slate-200 px-2 py-0.5 rounded">
            WCAG AA VERIFIED
          </span>
        </div>

        {/* Big Score Ring + Stars Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative w-[72px] h-[72px] shrink-0">
            <svg viewBox="0 0 72 72" className="w-[72px] h-[72px] -rotate-90">
              <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
              <circle
                cx="36" cy="36" r="30" fill="none"
                stroke={isBrand ? accentColor : "#10B981"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={`${2 * Math.PI * 30 * (1 - Math.min(Number(score.value) / Number(score.max || 5), 1))}`}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white leading-none">{score.value}</span>
              <span className="text-[8px] font-bold text-slate-400 leading-none mt-0.5">/{score.max || "5"}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((starIdx) => (
                <Star 
                  key={starIdx} 
                  size={12} 
                  className={cn(
                    "fill-amber-400 text-amber-400",
                    starIdx > Math.round(Number(score.value)) && "opacity-30 fill-transparent"
                  )} 
                />
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">
              {score.reviewsCountLabel || "Verified Reviews"}
            </span>
          </div>
        </div>

        {/* Breakdown Bars with solid background and high accessibility */}
        <div className="space-y-2.5 mb-4">
          {breakdown.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-200 tracking-wide uppercase">
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                  {m.label}
                </span>
                <span>{m.value}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(m.value / 5) * 100}%`,
                    backgroundColor: isBrand ? accentColor : "#10B981" 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation Statement */}
        {score.recommendPctLabel && (
          <div className="pt-3 border-t border-white/10 flex items-center gap-2.5 text-xs text-slate-100 font-bold">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Users size={14} />
            </div>
            <p className="leading-tight">
              {score.recommendPctLabel}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#F5F8FD] select-none">

      {/* EDGE-TO-EDGE CAMPAIGN BANNER — full viewport width, no side gutters, no rounded outer corners */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] min-h-[220px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px] overflow-hidden">
        {bannerImage ? (
          <img 
            src={bannerImage} 
            alt={`${name} Campaign`} 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", bannerClass)}>
            {/* Fallback organic abstract overlays */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-8 text-white/10 font-black text-4xl sm:text-6xl tracking-widest uppercase pointer-events-none selection:bg-transparent">
              CHOOSIFY CERTIFIED
            </div>
          </div>
        )}

        {/* Constrained inner column — keeps score card & avatar aligned with the rest of the page content, while the banner background itself stays full-bleed */}
        <div className="relative w-full h-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Floating brand score card inside the banner on desktop */}
          {renderScoreCard(false)}

          {/* Floating Logo/Avatar absolutely centered on bottom edge of the constrained column */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-white rounded-full flex items-center justify-center z-20 shadow-xl border-4 border-white overflow-hidden"
          >
            <div 
              className="w-full h-full rounded-full overflow-hidden p-1 flex items-center justify-center bg-white"
              style={{ border: `2px solid ${accentColor}` }}
            >
              <img 
                src={logoUrl || "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png"} 
                alt={`${name} Logo`} 
                className={cn(
                  "w-full h-full object-cover rounded-full",
                  type === 'brand' ? "object-contain p-2" : "object-cover"
                )}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content area below Banner — constrained to the readable column, banner above remains edge-to-edge */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white border border-slate-100 rounded-b-3xl shadow-sm px-6 pb-6 pt-16 sm:pt-20 lg:pt-12 relative z-10">
          
          {/* Main 3-Column Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:items-center">
            
            {/* COLUMN 1: Profile Info (left-aligned) */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#000435] tracking-tight leading-none">
                    {name}
                  </h1>
                  {verified && (
                    <div className="inline-flex items-center gap-1 bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <CheckCircle2 size={10} className="fill-current" />
                      <span>VERIFIED {type === 'brand' ? "BRAND" : "CREATOR"}</span>
                    </div>
                  )}
                </div>

                {/* Subtitle / Handle metadata */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-slate-500 text-xs font-bold">
                  {handle && <span className="text-[#000435] font-extrabold">{handle}</span>}
                  {(category || title) && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{category || title}</span>
                    </>
                  )}
                  {country && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <MapPin size={12} className="text-[#FF5B00]" />
                        {country}
                      </span>
                    </>
                  )}
                  {founded && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Calendar size={12} className="text-[#FF5B00]" />
                        Founded {founded}
                      </span>
                    </>
                  )}
                </div>

                {/* Tagline or bio if provided */}
                {(tagline || bio) && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold italic max-w-lg mx-auto lg:mx-0">
                    "{tagline || bio}"
                  </p>
                )}

                {/* Website Link */}
                {websiteUrl && (
                  <div className="flex items-center justify-center lg:justify-start pt-1">
                    <a 
                      href={websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5B00] hover:underline"
                    >
                      <Globe size={13} />
                      <span>{websiteUrl.replace('https://', '').replace('http://', '')}</span>
                      <ArrowUpRight size={10} />
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media Links (Only displays available platforms, no placeholders) */}
              {hasSocials && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                  {activeSocials.map(({ platform, url }) => {
                    let IconComponent = Globe;
                    let label = platform;
                    
                    if (platform === 'fb' || platform === 'facebook') IconComponent = Facebook;
                    else if (platform === 'ig' || platform === 'instagram') IconComponent = Instagram;
                    else if (platform === 'linkedin') IconComponent = Linkedin;
                    else if (platform === 'youtube' || platform === 'yt') IconComponent = Youtube;
                    
                    return (
                      <a 
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={label.toUpperCase()}
                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#FF5B00] text-[#000435] hover:text-white flex items-center justify-center transition-all shadow-xs border border-slate-200/50"
                      >
                        {platform === 'tiktok' ? (
                          <TikTokIcon className="w-4 h-4" />
                        ) : platform === 'x' ? (
                          <XIcon className="w-3.5 h-3.5" />
                        ) : (
                          <IconComponent size={15} />
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* COLUMN 2: Spacer for centering the absolute logo on desktop */}
            <div className="hidden lg:block lg:col-span-2" />

            {/* COLUMN 3: Actions row (right-aligned) */}
            <div className="lg:col-span-5 flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full">
              <Button 
                onClick={onToggleFollow} 
                variant={isFollowed ? "outline" : "primary"}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-xs shrink-0 flex items-center gap-1.5",
                  !isFollowed ? "bg-[#FF5B00] text-white hover:bg-[#FF5B00]/95 border-[#FF5B00]" : "border-slate-200 text-[#000435] hover:bg-slate-50"
                )}
              >
                <Heart size={14} className={cn("transition-colors", isFollowed ? "fill-red-500 text-red-500" : "text-white")} />
                <span>{isFollowed ? "Following" : type === 'brand' ? "Follow Brand" : "Follow"}</span>
              </Button>

              {type === 'creator' && onMessage && (
                <Button 
                  onClick={onMessage} 
                  variant="outline"
                  className="px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase border-slate-200 text-[#000435] hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Message</span>
                </Button>
              )}

              {websiteUrl && (
                <Button 
                  onClick={() => window.open(websiteUrl, '_blank')}
                  variant="outline"
                  className="px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase border-slate-200 text-[#000435] hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Globe size={14} />
                  <span>Visit Website</span>
                </Button>
              )}

              <Button 
                onClick={onShare}
                variant="outline"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#000435]"
                title="Share Storefront"
              >
                <Share2 size={14} />
              </Button>

              <Button 
                variant="outline"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#000435]"
                title="More Options"
              >
                <MoreHorizontal size={14} />
              </Button>
            </div>

          </div>

          {/* Mobile-only Trust/Score Card rendered naturally below brand action group */}
          <div className="block lg:hidden mt-8 w-full">
            {renderScoreCard(true)}
          </div>

        </div>

        {/* Sticky navigation attached to the hero */}
        {navigationItems && activeTabId && onTabClick && (
          <div className="sticky top-16 sm:top-20 z-40 bg-[#F5F8FD]/95 backdrop-blur-md py-3 transition-all border-b border-[#EEF2F7] mt-6">
            <div className="w-full">
              <div className="flex h-full overflow-x-auto hide-scrollbar gap-1.5 sm:gap-2 bg-white/40 p-1 rounded-xl">
                {navigationItems.map((item) => {
                  const isTabActive = activeTabId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabClick(item.id)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                        isTabActive
                          ? "text-[#FF5B00] bg-[#FF5B00]/10 shadow-xs"
                          : "text-slate-500 hover:text-[#000435] hover:bg-slate-50"
                      )}
                    >
                      <span>{item.label}</span>
                      {item.count !== undefined && item.count !== "" && (
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ml-1",
                          isTabActive ? "bg-[#FF5B00] text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
