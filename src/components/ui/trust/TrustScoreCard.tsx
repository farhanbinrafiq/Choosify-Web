import React from 'react';
import { cn } from '../../../lib/utils';
import { ShieldCheck } from 'lucide-react';

export interface TrustCategoryScore {
  label: string;
  score: number;
}

export interface TrustScoreCardProps {
  overallScore: number;
  label?: string;
  ratingText?: string;
  categories: TrustCategoryScore[];
  className?: string;
}

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({
  overallScore,
  label = "Choosify Trust Score",
  ratingText = "Excellent",
  categories,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#07D005]/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-7 h-7 text-[#07D005]" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#000435]">{overallScore.toFixed(1)}</span>
            <span className="text-sm font-bold text-slate-400">/10</span>
          </div>
          <span className="text-sm font-bold text-[#07D005] mt-1">{ratingText}</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex-1 space-y-4">
        {categories.map((category, idx) => {
          const percentage = Math.min(100, Math.max(0, (category.score / 10) * 100));
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-600">{category.label}</span>
                <span className="text-xs font-black text-[#000435]">{category.score.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#07D005] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
