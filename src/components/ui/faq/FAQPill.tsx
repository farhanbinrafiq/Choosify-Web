import React from 'react';
import { cn } from '../../../lib/utils';

export interface FAQPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive?: boolean;
}

export const FAQPill: React.FC<FAQPillProps> = ({
  label,
  isActive = false,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap",
        isActive 
          ? "bg-[#000435] text-white border border-[#000435]" 
          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        className
      )}
      {...props}
    >
      {label}
    </button>
  );
};
