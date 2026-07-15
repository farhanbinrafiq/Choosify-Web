import React from 'react';
import { cn } from '../../../lib/utils';

export type FilterChipVariant = 'default' | 'pill' | 'dark' | 'outline';

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  variant?: FilterChipVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  isActive = false,
  variant = 'default',
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-extrabold transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<FilterChipVariant, string> = {
    // Standard block filter chips (used in Filter Bar etc.)
    default: isActive
      ? 'bg-white border border-[#FF5B00]/30 text-[#FF5B00] shadow-sm font-black text-[10.5px] px-3 py-1.5 rounded-lg'
      : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-[10.5px] px-3 py-1.5 rounded-lg',

    // Full round pills (used in Category Navigation)
    pill: isActive
      ? 'bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/25 text-[11px] px-3 py-1.5 rounded-full'
      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent text-[11px] px-3 py-1.5 rounded-full',

    // Dark variants used in Dark Hero backgrounds
    dark: isActive
      ? 'bg-[#FF5B00] text-white border border-[#FF5B00] text-[10.5px] px-3 py-1.5 rounded-lg font-black'
      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/85 hover:text-white text-[10.5px] px-3 py-1.5 rounded-lg',

    // Outline variant
    outline: isActive
      ? 'border-2 border-[#000435] text-[#000435] text-[11px] px-3 py-1.5 rounded-full bg-[#000435]/5'
      : 'border-2 border-slate-200 text-slate-600 hover:border-[#000435] hover:text-[#000435] text-[11px] px-3 py-1.5 rounded-full',
  };

  return (
    <button
      type="button"
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {leftIcon && <span className="mr-1.5 flex items-center shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="ml-1.5 flex items-center shrink-0">{rightIcon}</span>}
    </button>
  );
};

FilterChip.displayName = 'FilterChip';
