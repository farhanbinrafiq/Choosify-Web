import React from 'react';
import { CompareEngine } from '../components/CompareEngine';
import { PageHeroBanner } from '../components/PageHeroBanner';

export function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <PageHeroBanner pageKey="compare" />
      <main className="w-full">
        <CompareEngine />
      </main>
    </div>
  );
}
