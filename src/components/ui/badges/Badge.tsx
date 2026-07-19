import React from 'react';
import { cn } from '../../../lib/utils';

export type BadgeVariant =
  | 'default'
  | 'green'
  | 'blue'
  | 'purple'
  | 'orange'
  | 'red'
  | 'outline'
  | 'gray'
  | 'verified'
  | 'sponsored'
  | 'deal'
  | 'featured'
  | 'trending'
  | 'bestseller'
  | 'campaign'
  | 'live';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md';

  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-800',
    green: 'bg-[#07D005] text-white',
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-600 text-white',
    orange: 'bg-[#EB4501] text-white',
    red: 'bg-[#EB4501] text-white',
    outline: 'border border-slate-200 text-slate-600',
    gray: 'bg-slate-200 text-slate-700',
    verified: 'bg-[#07D005] text-white',
    sponsored: 'bg-[#EB4501] text-white',
    deal: 'bg-[#EB4501] text-white',
    featured: 'bg-[#000435] text-white',
    trending: 'bg-amber-500 text-white',
    bestseller: 'bg-purple-600 text-white',
    campaign: 'bg-[#EB4501] text-white',
    live: 'bg-[#EB4501] text-white',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {variant === 'live' && (
        <span className="mr-1 flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
        </span>
      )}
      {children}
    </span>
  );
};
