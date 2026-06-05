import React from 'react';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200/80 rounded-md", className)} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-100 flex flex-col gap-4 animate-pulse">
      <Skeleton className="aspect-square w-full rounded-[15px]" />
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
  const { mode } = useGlobalState();

  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-[32px] p-5 md:p-6 h-full flex flex-col md:flex-row gap-6 relative overflow-hidden border border-gray-100 animate-pulse w-full">
        {/* Left Side: Media Placement Card */}
        <div className="relative flex-shrink-0 w-full md:w-[65%] aspect-[16/10] bg-gray-100 rounded-[24px] flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
          <Skeleton className="w-3/4 h-3/4" />
        </div>

        {/* Right Side: Text & Actions */}
        <div className="flex-grow flex flex-col justify-center py-4 px-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <Skeleton className="h-10 w-11/12 mb-3" />
          <Skeleton className="h-10 w-4/5 mb-6" />

          {/* Stock Meter */}
          <div className="mb-8 space-y-2 w-full">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>

          <div className="flex items-end justify-between gap-6 pt-6 border-t border-gray-100">
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-8 w-36" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-[15px] p-4 flex flex-col gap-4 border border-gray-100 h-full animate-pulse">
        <div className="w-full aspect-square bg-gray-100 rounded-[12px] relative p-3">
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-7 h-7 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-8 rounded-full" />
          </div>

          {mode === 'wholesale' && (
            <div className="flex gap-1">
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
          )}

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          {/* Stock progress */}
          <div className="space-y-1 my-2">
            <div className="flex justify-between">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-2 w-12" />
            </div>
            <Skeleton className="h-1 w-full rounded-full" />
          </div>

          <div className="flex items-center justify-between gap-2 mt-auto pt-2.5 border-t border-gray-100">
            <div className="space-y-1">
              <Skeleton className="h-4.5 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-[15px] p-5 gap-6 border border-gray-100 animate-pulse flex flex-col md:flex-row w-full">
        <div className="w-40 h-40 bg-gray-100 rounded-[12px] shrink-0 relative">
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>

        <div className="flex-grow flex flex-col py-1">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>

          {mode === 'wholesale' && (
            <div className="flex gap-1.5 mb-2">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-16 rounded" />
            </div>
          )}

          <Skeleton className="h-6 w-3/4 mb-3" />

          <div className="flex gap-1.5 mb-4 items-center">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="w-3.5 h-3.5 rounded-full" />
            ))}
            <Skeleton className="h-3.5 w-16 ml-1" />
          </div>

          {/* Stock Left Progress */}
          <div className="space-y-1.5 mb-4 max-w-md w-full">
            <div className="flex justify-between">
              <Skeleton className="h-2.5 w-14" />
              <Skeleton className="h-2.5 w-24" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto pt-2">
            <div className="flex items-baseline gap-2.5">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-12 w-full sm:w-52 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Default Grid layout: exactly mirrors (width: '188px', height: '368px')
  return (
    <div 
      className="bg-white rounded-[16px] p-3 border border-gray-100 flex flex-col relative overflow-hidden animate-pulse shrink-0" 
      style={{ width: '188px', height: '368px' }}
    >
      <div className="relative h-[126px] w-full bg-gray-100 rounded-[12px] shrink-0">
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Skeleton className="w-6.5 h-6.5 rounded-full" />
          <Skeleton className="w-6.5 h-6.5 rounded-full" />
        </div>
        <div className="absolute top-2 right-2">
          <Skeleton className="h-4.5 w-10 rounded-full" />
        </div>
        {showCountdown && (
          <div className="absolute bottom-2 left-2 right-2 h-5 rounded-full" />
        )}
      </div>

      <div className="pt-2.5 flex flex-col flex-1 min-h-0 justify-between">
        <div className="space-y-1.5">
          {mode === 'wholesale' && (
            <div className="flex gap-1">
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          )}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          <div className="flex items-center gap-2 justify-between">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-7" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <Skeleton className="h-2 w-8" />
              <Skeleton className="h-2 w-10" />
            </div>
            <Skeleton className="h-1 w-full rounded-full" />
          </div>
        </div>

        {mode === 'wholesale' && (
          <div className="my-1.5 bg-gray-50 border border-gray-100 rounded-lg p-1 space-y-1">
            <Skeleton className="h-2.5 w-12" />
            <div className="flex gap-1 justify-between">
              <Skeleton className="h-6 rounded flex-1" />
              <Skeleton className="h-6 rounded flex-1" />
              <Skeleton className="h-6 rounded flex-1" />
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1 shrink-0">
          <div className="space-y-0.5">
            <Skeleton className="h-2 w-10" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="w-7 h-7 rounded-full" />
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
      <div className="bg-white rounded-[40px] border border-orange-primary/10 p-3 w-full animate-pulse">
        <div className="aspect-[16/9] md:aspect-[2.2/1] w-full bg-slate-100 rounded-[32px] p-6 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="h-3.5 w-12" />
            </div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Skeleton className="w-20 h-20 rounded-full" />
          </div>

          <div className="z-10 space-y-4 max-w-2xl">
            <Skeleton className="h-10 w-5/6" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-11/12" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'shorts') {
    return (
      <div className="bg-white rounded-[32px] border border-gray-100 p-2 md:p-3 h-full animate-pulse">
        <div className="aspect-[9/16] w-full bg-slate-100 rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          <div className="z-10 space-y-3 pt-24 bg-gradient-to-t from-black/20 to-transparent">
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // default / video / article (aspect-[16/10])
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="aspect-[16/10] bg-slate-100 relative p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center z-10">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
      </div>

      <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <Skeleton className="h-8 w-11/12" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4.5 w-full" />
          <Skeleton className="h-4.5 w-2/3" />
        </div>

        <div className="pt-8 border-t border-gray-100 flex items-center justify-between mt-8">
          <div className="flex gap-6">
            <Skeleton className="w-14 h-4.5" />
            <Skeleton className="w-14 h-4.5" />
          </div>
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center border border-gray-150 relative overflow-hidden animate-pulse shadow-soft">
      {/* Decorative colored strip accent placeholder */}
      <Skeleton className="absolute top-0 left-0 w-full h-1" />
      
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gray-50 border border-gray-100 shadow-xs">
        <Skeleton className="w-7 h-7 rounded-lg" />
      </div>

      <Skeleton className="h-4 w-24 mb-1.5" />
      <Skeleton className="h-3.5 w-16" />
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
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex gap-2 border-b border-gray-100 pb-4 mb-2">
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
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
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
