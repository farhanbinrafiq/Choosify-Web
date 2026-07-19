import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Check, ArrowRight } from 'lucide-react';

export const SummaryCard = ({ overallWinner }: { overallWinner: any }) => {
  return (
    <div className="choosify-dark-surface rounded-[32px] p-8 md:p-10 flex flex-col lg:flex-row items-center gap-10 shadow-2xl mb-16 relative overflow-hidden ">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full lg:w-[350px] shrink-0 bg-white/5 rounded-[24px] p-6  relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent" />
        <img src={overallWinner.image} alt={overallWinner.product} className="w-full h-48 object-contain mb-4 drop-shadow-xl z-10" />
      </div>

      <div className="flex-1 text-white z-10">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-[#EB4501]" />
          <span className="text-xl font-extrabold uppercase tracking-wider text-white">OVERALL WINNER</span>
        </div>
        
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <span className="inline-block bg-[#EB4501] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">
              {overallWinner.badge}
            </span>
            <h2 className="text-3xl font-extrabold mb-3 leading-tight max-w-sm">{overallWinner.product}</h2>
            <div className="flex items-center gap-2 mb-6 text-sm">
              <div className="flex text-[#EB4501]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold">{overallWinner.rating}</span>
              <span className="text-white/60">({overallWinner.reviewsCount})</span>
            </div>
            <Link to="/products/1" className="text-[#EB4501] font-bold flex items-center gap-1 text-sm hover:text-[#CF4400] transition-colors group">
              View on Choosify <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {overallWinner.highlights.map((highlight: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="font-medium text-white/90">{highlight}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-[20px] p-6 text-center min-w-[150px]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Choosify Rating</div>
            <div className="text-5xl font-extrabold text-[#EB4501] mb-2">{overallWinner.score}</div>
            <div className="text-sm font-medium text-slate-400 mb-3">Out of 10</div>
            <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider rounded-full">
              {overallWinner.scoreLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
