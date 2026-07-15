import React from 'react';
import { cn } from '../../../lib/utils';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  active?: boolean;
}

export const Pill: React.FC<PillProps> = ({
  children,
  active = false,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 select-none border',
        active
          ? 'bg-[#000435] border-[#000435] text-white shadow-sm font-semibold'
          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
