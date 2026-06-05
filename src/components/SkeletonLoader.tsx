import React from 'react';
import { cn } from '../lib/utils';

// Animated Shimmer Skeleton Base
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
      {...props}
    />
  );
}

// 1. Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-4 shrink-0 flex flex-col gap-3.5 shadow-[0_8px_30px_rgba(26,29,78,0.02)] h-[440px] w-full">
      {/* Product Image */}
      <Skeleton className="w-full h-44 rounded-2xl bg-gray-100" />
      
      {/* Brand & Stats */}
      <div className="flex items-center justify-between mt-1">
        <Skeleton className="w-20 h-4 rounded bg-gray-100" />
        <Skeleton className="w-12 h-4 rounded bg-gray-200" />
      </div>

      {/* Product Title */}
      <div className="space-y-2">
        <Skeleton className="w-11/12 h-4 rounded bg-gray-100" />
        <Skeleton className="w-2/3 h-4 rounded bg-gray-100" />
      </div>

      {/* Footprint Verification Rating */}
      <div className="py-2 px-3 bg-gray-50 rounded-xl flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-4 h-4 rounded-full bg-gray-200" />
          <Skeleton className="w-16 h-3 rounded bg-gray-100" />
        </div>
        <Skeleton className="w-10 h-3 rounded bg-gray-150" />
      </div>

      {/* Call to Actions */}
      <div className="flex gap-2.5 mt-1">
        <Skeleton className="flex-1 h-10 rounded-xl bg-gray-200" />
        <Skeleton className="w-10 h-10 rounded-xl bg-gray-150" />
      </div>
    </div>
  );
}

// 2. Recommendation Thumbnail Skeleton (Guides / Blogs)
export function RecommendationThumbnailSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-4 flex gap-4 w-full shadow-[0_8px_30px_rgba(26,29,78,0.01)] transition-all">
      {/* Image Block */}
      <Skeleton className="w-24 sm:w-28 h-24 sm:h-28 rounded-2xl bg-gray-250 shrink-0" />
      
      {/* Body Info */}
      <div className="flex flex-col flex-1 justify-between py-1">
        <div className="space-y-2">
          <Skeleton className="w-16 h-3.5 rounded bg-orange-500/10" />
          <Skeleton className="w-11/12 h-4.5 rounded bg-gray-200" />
          <Skeleton className="w-3/4 h-3.5 rounded bg-gray-150" />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-3.5 rounded bg-gray-100" />
            <Skeleton className="w-14 h-3.5 rounded bg-gray-100" />
          </div>
          <Skeleton className="w-8 h-3.5 rounded bg-gray-150" />
        </div>
      </div>
    </div>
  );
}

// 3. Category Grid Item Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 font-sans flex items-center gap-4 transition-all hover:shadow-[0_8px_30px_rgba(26,29,78,0.03)] shrink-0">
      <Skeleton className="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex flex-col gap-2 flex-grow">
        <Skeleton className="w-24 h-4 rounded bg-gray-200" />
        <Skeleton className="w-16 h-3.5 rounded bg-gray-150" />
      </div>
    </div>
  );
}
