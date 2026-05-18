import React from 'react';
import { Skeleton, ProductSkeleton } from './Skeleton';

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
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-primary/10 border-t-orange-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-orange-primary rounded-full animate-ping" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[12px] font-black text-navy uppercase tracking-[0.4em] italic animate-pulse">Initializing Data Protocol</span>
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">Choosify discovery matrix loading...</span>
      </div>
    </div>
  );
}
