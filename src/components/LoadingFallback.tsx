import React from 'react';
import { Skeleton, ProductSkeleton } from './Skeleton';
import { ChoosifyIconLogo } from './ChoosifyIconLogo';

export function LoadingFallback({ variant = 'default' }: { variant?: 'default' | 'products' | 'detail' }) {
  if (variant === 'products') {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <ChoosifyIconLogo size={72} className="animate-pulse rounded-2xl shadow-sm" />
      <div className="flex flex-col items-center gap-2">
        <span className="text-[13px] font-semibold text-[#1A1A2E] tracking-tight animate-pulse">Loading…</span>
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">Choosify.bd discovery matrix loading...</span>
      </div>
    </div>
  );
}
