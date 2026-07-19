import React from 'react';
import { cn } from '../../../lib/utils';
import { LucideIcon } from 'lucide-react';

export interface BoxContentItem {
  icon?: LucideIcon | React.ElementType;
  label: string;
}

export interface BoxContentsCardProps {
  title?: string;
  items: BoxContentItem[];
  className?: string;
}

export const BoxContentsCard: React.FC<BoxContentsCardProps> = ({
  title,
  items,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 flex flex-col", className)}>
      {title && (
        <h3 className="text-sm font-black text-[#000435] uppercase tracking-wider mb-6">
          {title}
        </h3>
      )}
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
              {item.icon ? (
                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-[#CF4400] transition-colors" />
              ) : (
                <div className="w-5 h-5 bg-slate-200 rounded-sm" />
              )}
            </div>
            <span className="text-sm font-bold text-slate-700">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
