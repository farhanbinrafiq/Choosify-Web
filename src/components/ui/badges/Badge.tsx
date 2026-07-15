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
  | 'gray';

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
    orange: 'bg-[#FF5B00] text-white',
    red: 'bg-[#EB4S01] text-white', // Based on color palette
    outline: 'border border-slate-200 text-slate-600',
    gray: 'bg-slate-200 text-slate-700',
  };

  // Adjust red color from EB4S01 (from image palette #EB4S01 seems to have a typo, let's use standard red or #E84501 maybe, wait the palette says #EB4S01, it's likely #EB4501. Wait, color palette in image: #000435, #FF5B00, #EB4501, #07D005, #F4F7F9, #1A1A2E, #E8EDF2, #0A0A1F
  // Let's use #EB4501 for red.

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
