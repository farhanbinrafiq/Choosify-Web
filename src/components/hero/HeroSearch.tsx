import React from 'react';
import { HeroSearchBar } from '../HeroSearchBar';
import { cn } from '../../lib/utils';

interface HeroSearchProps {
  className?: string;
  placeholder?: string;
}

export function HeroSearch({ className, placeholder = 'Search products, brands, guides…' }: HeroSearchProps) {
  return (
    <div className={cn('mt-6 md:mt-8', className)}>
      <HeroSearchBar placeholder={placeholder} size="home" enableSuggestions />
    </div>
  );
}
