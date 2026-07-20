import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, Info, Check } from 'lucide-react';

export const RecommendationsVerdict = ({ verdict }: { verdict: any }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 mb-16 items-start">
      {/* Left Panel */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">RECOMMENDATIONS &<br/>QUICK VERDICT</h2>
        
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] p-6 shadow-soft ">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold uppercase tracking-wider text-sm">
              <CheckCircle2 className="w-5 h-5" /> BUY IF YOU
            </div>
            <p className="text-slate-600 font-medium pl-7">{verdict.buyIf}</p>
          </div>
          
          <div className="bg-white rounded-[20px] p-6 shadow-soft ">
            <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold uppercase tracking-wider text-sm">
              <HelpCircle className="w-5 h-5" /> CONSIDER IF
            </div>
            <p className="text-slate-600 font-medium pl-7">{verdict.considerIf}</p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-soft ">
            <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase tracking-wider text-sm">
              <XCircle className="w-5 h-5" /> NOT FOR YOU IF
            </div>
            <p className="text-slate-600 font-medium pl-7">{verdict.notForYouIf}</p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-soft ">
            <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold uppercase tracking-wider text-sm">
              <Info className="w-5 h-5" /> VERDICT
            </div>
            <p className="text-slate-600 font-medium pl-7">{verdict.overall}</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">WHY THIS WON</h2>
        <div className="choosify-dark-surface text-white rounded-none p-8 md:p-10 shadow-xl ">
          <h3 className="text-[#EB4501] font-extrabold uppercase tracking-widest mb-4">THE VERDICT</h3>
          <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-white/90">
            {verdict.summary}
          </p>
          <div className="flex flex-wrap gap-3">
            {verdict.chips.map((chip: string, idx: number) => (
              <span key={idx} className="bg-white/10  text-white font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default">
                <Check className="w-4 h-4 text-emerald-400" /> {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
