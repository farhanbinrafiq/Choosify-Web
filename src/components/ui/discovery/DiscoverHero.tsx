import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { SearchInput } from '../forms/Input';
import { Button } from '../buttons/Button';
import { FilterChip } from '../navigation/FilterChip';
import { EmiAiLogo } from '../../EmiAiLogo';

export interface DiscoverHeroProps {
  breadcrumbs?: Array<{ label: string; path?: string }>;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (query: string) => void;
  trendingSearches?: string[];
  onTrendingSearchClick?: (item: string) => void;
  backgroundIllustrationUrl?: string;
  featuredStatistic?: {
    tag: string;
    title: string;
    meta: string;
    onClick?: () => void;
  };
  seasonalBanner?: React.ReactNode;
  onShareClick?: () => void;
  aiDiscoverCta?: {
    text: string;
    onClick: () => void;
  };
}

export function DiscoverHero({
  breadcrumbs = [],
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  trendingSearches = [],
  onTrendingSearchClick,
  backgroundIllustrationUrl,
  featuredStatistic,
  seasonalBanner,
  onShareClick,
  aiDiscoverCta,
}: DiscoverHeroProps) {
  return (
    <section className="choosify-dark-surface text-white relative pt-8 pb-14 px-6 md:px-10 lg:px-12 overflow-hidden animate-fade-in" id="discover-hero-component">
      {/* Soft grid lines or glow circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-[#EB4501]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] font-black text-white/50 uppercase tracking-widest mb-6">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={10} />}
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-white transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-white/80">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Seasonal Banner */}
        {seasonalBanner && (
          <div className="mb-6">
            {seasonalBanner}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subtitle, Search and CTA */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-5">
            <span className="text-xs font-black text-[#EB4501] uppercase tracking-[0.2em]">DISCOVER.</span>
            
            {title && (
              <h2 className="text-3xl sm:text-[46px] lg:text-[52px] font-black tracking-tight leading-none text-white uppercase font-sans">
                {title}
              </h2>
            )}
            
            {subtitle && (
              <p className="text-xs sm:text-sm text-white/70 max-w-lg font-bold leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Input container matches reference search layout */}
            <div className="relative max-w-xl w-full pt-2">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search Discover..."
                className="w-full bg-white/10 backdrop-blur-md h-13 pr-28 rounded-2xl text-white placeholder-white/50 font-bold text-xs outline-none focus:ring-2 focus:ring-[#EB4501]/30 transition-all border border-white/10 focus:bg-white/15"
              />
              <Button 
                onClick={() => onSearchSubmit(searchQuery)}
                variant="cta"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-wider uppercase px-5 py-2.5 rounded-xl h-10 z-20"
              >
                Search
              </Button>
            </div>

            {/* AI Discover CTA within Hero */}
            {aiDiscoverCta && (
              <div className="pt-1">
                <Button
                  onClick={aiDiscoverCta.onClick}
                  variant="outline"
                  size="sm"
                  leftIcon={<EmiAiLogo size={14} className="w-3.5 h-3.5" />}
                  rightIcon={<Sparkles size={11} className="text-pink-400" />}
                  className="bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-indigo-200 text-[10px] uppercase tracking-wider rounded-full h-9.5 px-5"
                >
                  {aiDiscoverCta.text}
                </Button>
              </div>
            )}

            {/* Trending searches */}
            {trendingSearches && trendingSearches.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] font-black pt-2">
                <span className="text-white/40">Trending searches:</span>
                {trendingSearches.map((item, idx) => (
                  <FilterChip
                    key={idx}
                    variant="dark"
                    isActive={searchQuery === item}
                    onClick={() => onTrendingSearchClick?.(item)}
                  >
                    {item}
                  </FilterChip>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hero Collage & Featured Statistic / Editor's Pick Box */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-none overflow-hidden bg-slate-900/50 border border-white/10 shadow-2xl flex items-center justify-center">
              
              {backgroundIllustrationUrl ? (
                <img 
                  src={backgroundIllustrationUrl} 
                  alt="Discovery Cover" 
                  className="w-full h-full object-cover opacity-75"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                  <Sparkles size={48} className="text-white/10 animate-pulse" />
                </div>
              )}

              {/* Collage Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000435]/90 via-transparent to-transparent" />
              
              {/* Share Button on top-right */}
              {onShareClick && (
                <Button 
                  onClick={onShareClick}
                  variant="icon"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 z-20"
                >
                  <Share2 size={15} />
                </Button>
              )}

              {/* Editor's Pick / Featured Statistic Floating Widget */}
              {featuredStatistic && (
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-left flex items-center gap-3 shadow-xl hover:scale-[1.01] transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-[#EB4501]/15 flex items-center justify-center text-[#EB4501] shrink-0 border border-[#EB4501]/25">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-black text-[#EB4501] tracking-widest uppercase block leading-none mb-1">
                      {featuredStatistic.tag}
                    </span>
                    <h4 className="text-xs font-black text-white leading-tight truncate">
                      {featuredStatistic.title}
                    </h4>
                    <span className="text-[9px] text-white/50 font-bold block mt-0.5">
                      {featuredStatistic.meta}
                    </span>
                  </div>
                  {featuredStatistic.onClick && (
                    <Button 
                      onClick={featuredStatistic.onClick}
                      variant="cta"
                      className="w-7 h-7 rounded-lg p-0 flex items-center justify-center shrink-0"
                    >
                      <ArrowRight size={13} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
