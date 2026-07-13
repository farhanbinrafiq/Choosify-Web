import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play, Bookmark, Share2, ShieldCheck, Plus, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeroProps {
  content: any;
  isSaved: boolean;
  isFollowing: boolean;
  handleSave: () => void;
  setIsFollowing: (f: boolean) => void;
}

export const HeroSection = ({ content, isSaved, isFollowing, handleSave, setIsFollowing }: HeroProps) => {
  return (
    <section className="w-full bg-[#000435] text-white pt-10 pb-20 px-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-purple-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{content.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <span className="inline-block bg-[#FF5B00] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              {content.type}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {content.title}
            </h1>
            
            <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed max-w-xl">
              {content.subtitle}
            </p>
            
            {/* Creator Info & Metadata */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div className="flex items-center gap-3">
                <img src={content.author.avatar} alt={content.author.name} className="w-12 h-12 rounded-full " />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white">{content.author.name}</span>
                    {content.author.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span>Updated {content.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span>{content.readTime}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span>{content.views}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-[#FF5B00] hover:bg-[#EB4501] text-white px-8 py-3.5 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#FF5B00]/20">
                <Play className="w-5 h-5 fill-white" /> Watch Video
              </button>
              <button 
                onClick={handleSave}
                className={cn(
                  "px-6 py-3.5 rounded-full font-bold transition-all flex items-center gap-2",
                  isSaved ? "bg-white text-[#000435]" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                <Bookmark className={cn("w-5 h-5", isSaved && "fill-[#000435]")} /> 
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold transition-all flex items-center gap-2 ">
                <Share2 className="w-5 h-5" /> Share
              </button>
              
              <div className="flex-1 min-w-[200px] flex justify-end">
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold transition-all flex items-center gap-2  ml-auto"
                >
                  {isFollowing ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Image/Video */}
          <div className="relative">
            <div className="aspect-[4/3] md:aspect-video lg:aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl relative group">
              <img src={content.coverImage} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center  group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1 fill-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
