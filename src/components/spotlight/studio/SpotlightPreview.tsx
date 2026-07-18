import React from 'react';
import type { SpotlightExperienceDraft, SpotlightPreviewMode } from '../../../types/spotlight/studio';
import { PREVIEW_REGISTRY } from '../../../lib/spotlight/studio/previewRegistry';
import { SpotlightBlockRenderer } from './SpotlightBlockRenderer';
import { cn } from '../../../lib/utils';

interface SpotlightPreviewProps {
  draft: SpotlightExperienceDraft;
  mode: SpotlightPreviewMode;
  onModeChange: (mode: SpotlightPreviewMode) => void;
}

export function SpotlightPreview({ draft, mode, onModeChange }: SpotlightPreviewProps) {
  const previewDef = PREVIEW_REGISTRY.find((p) => p.mode === mode) ?? PREVIEW_REGISTRY[0];

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {PREVIEW_REGISTRY.map((p) => (
          <button
            key={p.mode}
            type="button"
            onClick={() => onModeChange(p.mode)}
            className={cn(
              'px-3 py-1.5 text-[10px] font-bold uppercase rounded border',
              mode === p.mode ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-[#e8edf2]',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400">{previewDef.description}</p>
      <div className="mx-auto border border-[#e8edf2] rounded-lg bg-white shadow-lg overflow-hidden transition-all" style={{ maxWidth: previewDef.width }}>
        {mode === 'social' ? (
          <div className="p-4 border border-[#e8edf2] m-4 rounded">
            <p className="text-xs text-gray-400">choosify.com</p>
            <p className="font-bold text-sm mt-1">{draft.seo.metaTitle || draft.title || 'Spotlight Experience'}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{draft.seo.metaDescription || draft.description}</p>
          </div>
        ) : mode === 'carousel' ? (
          <div className="aspect-[21/9] bg-navy/90 text-white p-6 flex flex-col justify-end">
            <span className="text-[10px] font-bold uppercase text-[#E8500A]">Spotlight</span>
            <h3 className="text-xl font-extrabold tracking-tight">{draft.headline || draft.title}</h3>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-lg font-black text-navy mb-4">{draft.headline || draft.title || 'Preview'}</h2>
            <SpotlightBlockRenderer blocks={draft.blocks} editable={false} />
          </div>
        )}
      </div>
    </div>
  );
}
