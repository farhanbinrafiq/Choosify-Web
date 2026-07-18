import React from 'react';
import { cn } from '../../../lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'icon'
  | 'authentication'
  | 'cta'
  | 'navigation';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[#000435] text-white hover:bg-[#FF5B00]',
      secondary: 'bg-slate-100 text-[#000435] hover:bg-slate-200',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-50',
      outline: 'border-2 border-slate-200 bg-transparent text-[#000435] hover:border-[#000435]',
      danger: 'bg-[#EB4501] text-white hover:bg-red-700',
      icon: 'bg-transparent text-slate-500 hover:text-[#FF5B00] hover:bg-orange-50',
      authentication: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm',
      cta: 'bg-[#FF5B00] text-white hover:bg-[#000435]',
      navigation: 'bg-white text-slate-600 hover:text-[#000435] border-b-2 border-transparent hover:border-[#000435] rounded-none',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base',
      icon: 'w-10 h-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
