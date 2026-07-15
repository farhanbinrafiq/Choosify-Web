import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ProsConsCardProps {
  pros: string[];
  cons: string[];
  className?: string;
}

export const ProsConsCard: React.FC<ProsConsCardProps> = ({
  pros,
  cons,
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-wider text-sm mb-4">
          <CheckCircle2 className="w-5 h-5" /> THE PROS
        </div>
        <ul className="space-y-3">
          {pros.map((pro, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
              <span className="text-emerald-500 font-black shrink-0 mt-0.5">+</span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-wider text-sm mb-4">
          <XCircle className="w-5 h-5" /> THE CONS
        </div>
        <ul className="space-y-3">
          {cons.map((con, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
              <span className="text-red-400 font-black shrink-0 mt-0.5">-</span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
