import React from 'react';
import { GlobalSearchBar } from './GlobalSearchBar';
import { cn } from '../lib/utils';

interface HeroSearchBarProps {
  placeholder: string;
  className?: string;
  /** Home hero uses full width; inner pages use a narrower bar */
  size?: 'home' | 'page';
  value?: string;
  onValueChange?: (query: string) => void;
  initialValue?: string;
  onSubmit?: (query: string) => void;
  enableSuggestions?: boolean;
}

export function HeroSearchBar({
  placeholder,
  className,
  size = 'page',
  value,
  onValueChange,
  initialValue,
  onSubmit,
  enableSuggestions = false,
}: HeroSearchBarProps) {
  return (
    <div
      className={cn(
        'relative w-full mx-auto',
        size === 'home' ? 'max-w-2xl' : 'max-w-sm md:max-w-md',
        className,
      )}
    >
      <GlobalSearchBar
        variant="hero"
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        initialValue={initialValue}
        onSubmit={onSubmit}
        enableSuggestions={enableSuggestions}
      />
    </div>
  );
}
