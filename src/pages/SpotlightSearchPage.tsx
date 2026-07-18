import React, { useMemo, useState } from 'react';
import { useSpotlightSearch } from '../hooks/useSpotlightSearch';
import { SpotlightDiscoveryNav, SpotlightSearchPanel } from '../components/spotlight/discovery';

export function SpotlightSearchPage() {
  const { query, setQuery, submitSearch, results, suggestions } = useSpotlightSearch();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-4 text-left">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Discover Spotlight</h1>
        <p className="text-sm text-gray-500 mt-2">Discover campaigns, creators, guides, collections, series, and live events.</p>
      </header>

      <SpotlightDiscoveryNav />

      <SpotlightSearchPanel
        query={query}
        onQueryChange={setQuery}
        onSubmit={submitSearch}
        results={results}
        suggestions={suggestions}
      />
    </div>
  );
}
