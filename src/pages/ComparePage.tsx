import React, { lazy, Suspense } from 'react';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { LoadingFallback } from '../components/LoadingFallback';

const CompareEngine = lazy(() =>
  import('../components/CompareEngine').then((module) => ({ default: module.CompareEngine })),
);

export function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <PageHeroBanner pageKey="compare" />
      <main className="w-full">
        <Suspense fallback={<LoadingFallback />}>
          <CompareEngine />
        </Suspense>
      </main>
    </div>
  );
}
