import React from 'react';
import { Trophy, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface VerdictCardProps {
  verdict: string;
  recommendation?: string;
  overallRating?: number;
  bestFor?: string;
  avoidIf?: string;
  chips?: string[];
  className?: string;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  verdict,
  recommendation,
  overallRating,
  bestFor,
  avoidIf,
  chips,
  className
}) => {
  return (
    <div className={cn("choosify-dark-surface rounded-none p-8 md:p-10 text-white relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB4501]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
        {overallRating !== undefined && (
          <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Score</span>
            <div className="text-6xl font-black text-[#EB4501] tracking-tighter leading-none mb-1">
              {overallRating.toFixed(1)}
            </div>
            <span className="text-[10px] font-bold text-slate-400">Out of 10</span>
          </div>
        )}

        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-[#EB4501]" /> THE VERDICT
            </h3>
            <p className="text-sm md:text-base font-medium text-slate-300 leading-relaxed">
              {verdict}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bestFor && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <span className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Best For
                </span>
                <p className="text-xs font-medium text-emerald-100">{bestFor}</p>
              </div>
            )}
            
            {avoidIf && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <span className="flex items-center gap-1.5 text-xs font-black text-red-400 uppercase tracking-wider mb-2">
                  <AlertCircle className="w-4 h-4" /> Avoid If
                </span>
                <p className="text-xs font-medium text-red-100">{avoidIf}</p>
              </div>
            )}
          </div>

          {recommendation && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm font-bold text-white flex items-start gap-2">
                <span className="text-[#EB4501]">Recommendation:</span> {recommendation}
              </p>
            </div>
          )}

          {chips && chips.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {chips.map((chip, idx) => (
                <span key={idx} className="bg-white/10 border border-white/20 text-slate-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
