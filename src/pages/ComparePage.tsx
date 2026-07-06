import React from 'react';
import { CompareEngine } from '../components/CompareEngine';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { HeroMarqueeTicker } from '../components/HeroMarqueeTicker';
import { useGlobalState } from '../context/GlobalStateContext';

export function ComparePage() {
  const { siteConfig } = useGlobalState();

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <PageHeroBanner pageKey="compare" />
      <HeroMarqueeTicker pageKey="compare" siteConfig={siteConfig} />
      <main className="w-full">
        <CompareEngine />
      </main>
    </div>
  );
}
