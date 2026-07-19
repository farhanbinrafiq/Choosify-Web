import React from 'react';
import { Share2, Bookmark, Heart, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';

export interface ContentHeroCardProps {
  coverImage: string;
  categoryBadge: string;
  categoryBadgeBg?: string;
  title: string;
  subtitle?: string;
  author?: {
    name: string;
    avatar: string;
  };
  publishedDate: string;
  readTime?: string;
  updatedDate?: string;
  breadcrumbs?: { label: string; href?: string }[];
  onShare?: () => void;
  onSave?: () => void;
  onLike?: () => void;
  isSaved?: boolean;
  isLiked?: boolean;
  className?: string;
}

export const ContentHeroCard: React.FC<ContentHeroCardProps> = ({
  coverImage,
  categoryBadge,
  categoryBadgeBg,
  title,
  subtitle,
  author,
  publishedDate,
  readTime,
  updatedDate,
  breadcrumbs,
  onShare,
  onSave,
  onLike,
  isSaved,
  isLiked,
  className
}) => {
  return (
    <section className={cn("w-full choosify-dark-surface text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden", className)}>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-6 font-semibold tracking-wider uppercase">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</a>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            <span className={cn("text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest", categoryBadgeBg || "bg-[#FF5B00]")}>
              {categoryBadge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 w-full">
              {author && (
                <div className="flex items-center gap-3">
                  <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{author.name}</span>
                    <span className="text-xs font-semibold text-slate-400">Author</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-xl">
                <span>{publishedDate}</span>
                {readTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span>{readTime}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={onLike} variant={isLiked ? "primary" : "outline"} className={cn("gap-2 border-white/20", isLiked ? "bg-[#FF5B00] text-white border-transparent" : "text-white hover:bg-white/10")}>
                <Heart size={16} className={cn(isLiked && "fill-current")} /> {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button onClick={onSave} variant={isSaved ? "primary" : "outline"} className={cn("gap-2 border-white/20", isSaved ? "bg-white text-[#000435] border-transparent" : "text-white hover:bg-white/10")}>
                <Bookmark size={16} className={cn(isSaved && "fill-current")} /> {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button onClick={onShare} variant="outline" className="gap-2 text-white border-white/20 hover:bg-white/10">
                <Share2 size={16} /> Share
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5B00]/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000435] via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
