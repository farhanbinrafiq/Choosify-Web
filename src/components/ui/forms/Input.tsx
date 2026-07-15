import React, { forwardRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Eye, EyeOff, Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-12 rounded-xl border bg-white px-4 text-sm font-medium text-slate-900 transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            leftIcon && "pl-11",
            error 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : "border-slate-200 focus:border-[#000435] focus:ring-[#000435]",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative w-full">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn("pr-12", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export const SearchInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        type="text"
        leftIcon={<Search className="w-5 h-5" />}
        className={cn("bg-slate-50 border-transparent focus:bg-white focus:border-[#000435]", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl border bg-white p-4 text-sm font-medium text-slate-900 transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 resize-y",
            error 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : "border-slate-200 focus:border-[#000435] focus:ring-[#000435]",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export const Checkbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "w-4 h-4 rounded border-slate-300 text-[#000435] focus:ring-[#000435] transition-colors cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export const Radio = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        ref={ref}
        className={cn(
          "w-4 h-4 border-slate-300 text-[#000435] focus:ring-[#000435] transition-colors cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
Radio.displayName = 'Radio';
