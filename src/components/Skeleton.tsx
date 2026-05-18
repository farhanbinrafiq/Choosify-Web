import React from 'react';
import { cn } from '../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-100 flex flex-col gap-4">
      <Skeleton className="aspect-square w-full rounded-[15px]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
