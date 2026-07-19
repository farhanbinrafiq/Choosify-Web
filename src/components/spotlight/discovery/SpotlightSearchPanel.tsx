import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { SpotlightSearchResult, SpotlightSearchSuggestion } from '../../../types/spotlight/discovery/search';

interface SpotlightSearchPanelProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: (q: string) => void;
  results: SpotlightSearchResult[];
  suggestions: SpotlightSearchSuggestion[];
}

export function SpotlightSearchPanel({
  query,
  onQueryChange,
  onSubmit,
  results,
  suggestions,
}: SpotlightSearchPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} role="search" aria-label="Spotlight search">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Discover campaigns, creators, guides, live..."
            className="w-full pl-10 pr-4 py-3 min-h-[48px] text-sm border border-[#e8edf2] rounded-[5px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]"
            aria-label="Discover Spotlight"
          />
        </div>
      </form>

      {!query && suggestions.length > 0 && (
        <div className="space-y-4">
          {(['recent', 'popular', 'trending'] as const).map((kind) => {
            const items = suggestions.filter((s) => s.kind === kind);
            if (!items.length) return null;
            return (
              <div key={kind}>
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">{kind.replace('_', ' ')} searches</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <button
                      key={`${kind}-${s.query}`}
                      type="button"
                      onClick={() => onSubmit(s.query)}
                      className="px-3 py-2 min-h-[44px] text-xs font-bold border border-[#e8edf2] rounded-full hover:border-[#EB4501]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {query && (
        <div>
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-3">
            {results.length} results
          </h3>
          {results.length === 0 ? (
            <p className="text-sm text-gray-500">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            <ul className="divide-y divide-gray-100 border border-[#e8edf2] rounded-[5px] overflow-hidden">
              {results.map((r) => (
                <li key={`${r.kind}-${r.entityId}`}>
                  <Link
                    to={r.href}
                    className="flex items-center justify-between gap-3 p-4 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EB4501]"
                  >
                    <div className="text-left min-w-0">
                      <span className="text-[9px] font-black uppercase text-[#EB4501]">{r.kind}</span>
                      <p className="text-sm font-semibold text-[#1a1a2e] truncate">{r.title}</p>
                      {r.subtitle && <p className="text-[11px] text-gray-500">{r.subtitle}</p>}
                    </div>
                    {r.isTrending && (
                      <span className="shrink-0 text-[9px] font-bold uppercase text-amber-600">Trending</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
