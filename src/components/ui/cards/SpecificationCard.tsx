import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';

export interface SpecificationItem {
  label: string;
  value: React.ReactNode;
}

export interface SpecificationCardProps {
  title?: string;
  specs: SpecificationItem[];
  onViewAll?: () => void;
  className?: string;
}

export const SpecificationCard: React.FC<SpecificationCardProps> = ({
  title,
  specs,
  onViewAll,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 flex flex-col", className)}>
      {title && (
        <h3 className="text-sm font-black text-[#000435] uppercase tracking-wider mb-6">
          {title}
        </h3>
      )}
      
      <div className="flex-1 space-y-4">
        {specs.map((spec, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-4 border-b border-slate-50 pb-3 last:border-0 last:pb-0 items-start">
            <span className="col-span-1 text-xs font-bold text-slate-500">{spec.label}</span>
            <span className="col-span-2 text-xs font-bold text-[#000435]">{spec.value}</span>
          </div>
        ))}
      </div>

      {onViewAll && (
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Button variant="ghost" size="sm" onClick={onViewAll} className="w-full text-[#FF5B00] hover:text-[#000435]">
            View All Specifications
          </Button>
        </div>
      )}
    </div>
  );
};
