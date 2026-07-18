import React from 'react';
import { cn } from '../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('choosify-skeleton rounded-md', className)} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[5px] p-2.5 border border-[#e8edf2] flex flex-col gap-3 h-full w-full">
      <Skeleton className="aspect-[4/3] w-full rounded-[5px]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-10 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton({ 
  variant = 'grid', 
  showCountdown = false 
}: { 
  variant?: 'grid' | 'list' | 'compact' | 'featured',
  showCountdown?: boolean
}) {
  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-[5px] p-5 md:p-6 h-full flex flex-col md:flex-row gap-6 relative overflow-hidden border border-[#e8edf2] animate-pulse w-full">
        {/* Left Side: Media Placement Card */}
        <div className="relative flex-shrink-0 w-full md:w-[45%] xl:w-[40%] aspect-[16/10] bg-gray-50 rounded-[5px] flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <Skeleton className="w-3/4 h-3/4 rounded-[5px]" />
        </div>

        {/* Right Side: Text & Actions */}
        <div className="flex-grow flex flex-col justify-center py-2 px-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded" />
          </div>

          <Skeleton className="h-10 w-11/12 mb-4" />

          {/* Stock Meter */}
          <div className="mb-4 space-y-2 w-full">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>

          <div className="flex items-end justify-between gap-4 pt-4 border-t border-gray-150">
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-8 w-36" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-14 h-14 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-[5px] p-3 flex flex-col gap-3 border border-[#e8edf2] h-full animate-pulse">
        <div className="w-full aspect-square bg-gray-50 rounded-[5px] relative p-2.5 flex items-center justify-center shrink-0">
          <Skeleton className="w-full h-full rounded-[5px]" />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-8 rounded-full" />
          </div>

          <Skeleton className="h-4 w-full" />

          <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <Skeleton className="h-4.5 w-16" />
            </div>
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4 gap-5 animate-pulse flex flex-row w-full text-left bg-white">
        <div className="w-36 h-36 bg-gray-50 rounded-[5px] shrink-0 relative flex items-center justify-center p-3">
          <Skeleton className="w-full h-full rounded-[5px]" />
        </div>

        <div className="flex-grow flex flex-col py-0.5 justify-between min-w-0">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-12 rounded" />
            </div>

            <Skeleton className="h-6 w-3/4 mb-1.5" />

            <div className="flex gap-1 items-center">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="w-3.5 h-3.5 rounded-full" />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto gap-4 pt-3.5 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Default Grid layout: mirrors regular card proportions in responsive grid
  return (
    <div 
      className="bg-white rounded-[5px] p-2.5 border border-[#e8edf2] flex flex-col relative overflow-hidden w-full max-w-full min-w-0 h-full self-stretch" 
    >
      <div className="relative w-full aspect-[4/3] bg-[#eef2f7] rounded-[5px] shrink-0 p-2 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-[5px]" />
      </div>

      <div className="pt-1.5 flex flex-col flex-grow min-h-0 justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-2.5 w-12 rounded" />
            <Skeleton className="h-2.5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-full rounded" />
        </div>

        <div className="mt-auto pt-2 border-t border-[#e8edf2] flex items-center justify-between gap-2 w-full">
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-2 w-10 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function RecommendationCardSkeleton({ 
  variant = 'default' 
}: { 
  variant?: 'default' | 'shorts' | 'featured' 
}) {
  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-[5px] border border-[#e8edf2] p-3 w-full animate-pulse">
        <div className="aspect-[16/9] md:aspect-[2.2/1] w-full bg-slate-950 rounded-[5px] p-6 md:p-8 flex flex-col justify-end relative overflow-hidden">
          <div className="absolute top-6 left-6 z-20">
            <Skeleton className="h-8 w-36 rounded" />
          </div>
          <div className="absolute top-6 right-6 z-20">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          <div className="z-10 space-y-3 text-left">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'shorts') {
    return (
      <div className="bg-white rounded-[5px] border border-[#e8edf2] p-3 h-full animate-pulse max-w-[320px] mx-auto w-full">
        <div className="aspect-[9/16] w-full bg-slate-950 rounded-[5px] p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <Skeleton className="h-6 w-14 rounded" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>

          <div className="z-10 space-y-2 text-left pt-20">
            <Skeleton className="h-6 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  // default
  return (
    <div className="bg-white rounded-[5px] overflow-hidden border border-[#e8edf2] flex flex-col h-full animate-pulse">
      <div className="aspect-[16/10] bg-gray-50 relative p-4 flex flex-col justify-between shrink-0">
        <div className="flex justify-between items-center z-10">
          <Skeleton className="h-7 w-28 rounded" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between bg-white text-left">
        <div className="space-y-3">
          <Skeleton className="h-6 w-11/12" />
          <Skeleton className="h-4.5 w-full" />
          <Skeleton className="h-4.5 w-2/3" />
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-4">
          <div className="flex gap-4">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-12 h-4" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="choosify-category-photo-card choosify-category-card bg-white border rounded-[5px] flex flex-col overflow-hidden w-full border-[#e8edf2] p-0">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="w-full px-3 py-3 border-t border-[#e8edf2] space-y-2">
        <Skeleton className="h-3 w-4/5 rounded-sm" />
        <Skeleton className="h-2.5 w-1/3 rounded-sm" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ 
  count = 8, 
  showSidebar = false 
}: { 
  count?: number,
  showSidebar?: boolean 
}) {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 2xl:gap-24">
      {showSidebar && (
        <aside className="hidden lg:flex flex-col gap-6 w-[300px] flex-shrink-0 animate-pulse text-left">
          {/* Quick Highways Placeholder */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 space-y-4 shadow-[#e8edf2] shadow-none">
            <div className="flex gap-2 border-b border-[#e8edf2] pb-4 mb-2">
              <Skeleton className="h-6 w-14" />
              <Skeleton className="h-6 w-20" />
            </div>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-4 w-full">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4.5 w-8 rounded-full shrink-0" />
              </div>
            ))}
          </div>

          {/* Followed Brands Placeholder */}
          <div className="bg-white rounded-[5px] border border-[#e8edf2] p-4.5 space-y-4 shadow-none">
            <div className="flex justify-between items-center border-b border-[#e8edf2] pb-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 w-full">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-2.5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      <div className="flex-grow">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, idx) => (
            <CategoryCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandCardSkeleton() {
  return (
    <div 
      className="bg-white rounded-[5px] p-5 border border-[#e8edf2] flex flex-col justify-between overflow-hidden mx-auto animate-pulse shadow-none"
      style={{ width: '100%', maxWidth: '250px', height: '280px' }}
    >
      {/* Horizontal Header */}
      <div className="flex gap-3 items-start text-left w-full">
        <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-2">
          <Skeleton className="w-8 h-8 rounded" />
        </div>
        <div className="flex flex-col min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
          <Skeleton className="h-2 w-1/3 rounded" />
        </div>
      </div>

      <div className="w-full h-[1px] bg-gray-55 my-3" />

      {/* Grid below */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 space-y-1.5">
          <Skeleton className="h-2 w-8 mx-auto rounded" />
          <Skeleton className="h-3 w-12 mx-auto rounded" />
        </div>
        <div className="text-center bg-gray-50/50 py-1.5 rounded-lg border border-gray-100/50 space-y-1.5">
          <Skeleton className="h-3 w-10 mx-auto rounded" />
          <Skeleton className="h-2 w-8 mx-auto rounded" />
        </div>
        <div className="text-center bg-green-50/50 py-1.5 rounded-lg border border-green-100 space-y-1.5">
          <Skeleton className="h-3 w-10 mx-auto rounded" />
          <Skeleton className="h-2 w-8 mx-auto rounded" />
        </div>
      </div>

      <div className="w-full h-[1px] bg-transparent my-1" />

      {/* Button footer */}
      <div className="w-full h-8 bg-gray-100 rounded-lg" />
    </div>
  );
}
