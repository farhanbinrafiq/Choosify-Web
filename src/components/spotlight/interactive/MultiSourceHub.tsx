import React from 'react';
import type { SpotlightLiveSource } from '../../../types/spotlight/interactive/sources';
import { LIVE_SOURCE_PROVIDER_LABELS } from '../../../types/spotlight/interactive/sources';
import { cn } from '../../../lib/utils';

interface MultiSourceHubProps {
  sources: SpotlightLiveSource[];
  activeSourceId: string;
  onSelect: (sourceId: string) => void;
}

/** Multi-Source Event Hub (CTO) — pick perspective, stay in campaign ecosystem */
export function MultiSourceHub({ sources, activeSourceId, onSelect }: MultiSourceHubProps) {
  if (sources.length <= 1) return null;

  return (
    <div className="mb-4 text-left" role="tablist" aria-label="Watch perspectives">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Choose perspective</p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <button
            key={source.sourceId}
            type="button"
            role="tab"
            aria-selected={activeSourceId === source.sourceId}
            onClick={() => onSelect(source.sourceId)}
            className={cn(
              'px-3 py-2 rounded-[5px] text-left border text-[10px] font-bold uppercase tracking-wide transition-colors max-w-[200px]',
              activeSourceId === source.sourceId
                ? 'bg-[#EB4501] text-white border-[#EB4501]'
                : 'bg-white text-gray-600 border-[#e8edf2] hover:border-[#EB4501]/40',
            )}
          >
            <span className="block truncate">{source.label}</span>
            <span className="block text-[8px] font-normal normal-case opacity-70 mt-0.5">
              {LIVE_SOURCE_PROVIDER_LABELS[source.provider]}
              {source.contributorRole ? ` · ${source.contributorRole}` : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
