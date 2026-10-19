import React, { lazy, Suspense } from 'react';
import { LoadingFallback } from '../components/LoadingFallback';

const CompareEngine = lazy(() =>
  import('../components/CompareEngine').then((module) => ({ default: module.CompareEngine })),
);

/**
 * Compare page shell. The header (title, Share Comparison, Clear All) lives in
 * CompareEngine because both actions operate on its canonical selection.
 */
export function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <main className="w-full max-w-[1400px] mx-auto px-5 sm:px-10 py-6 pb-[60px]">
        <Suspense fallback={<LoadingFallback />}>
          <CompareEngine />
        </Suspense>
      </main>
    </div>
  );
}
