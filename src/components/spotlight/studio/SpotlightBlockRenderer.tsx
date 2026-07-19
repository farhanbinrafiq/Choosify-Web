import React from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { SpotlightBlock } from '../../../types/spotlight/studio';
import { getBlockDefinition } from '../../../lib/spotlight/studio/blockRegistry';
import { cn } from '../../../lib/utils';

interface SpotlightBlockRendererProps {
  blocks: SpotlightBlock[];
  selectedBlockId?: string | null;
  onSelect?: (blockId: string) => void;
  onUpdate?: (blockId: string, data: Record<string, unknown>) => void;
  onRemove?: (blockId: string) => void;
  onMove?: (blockId: string, direction: 'up' | 'down') => void;
  editable?: boolean;
}

function BlockContent({ block, editable, onUpdate }: { block: SpotlightBlock; editable?: boolean; onUpdate?: (data: Record<string, unknown>) => void }) {
  const def = getBlockDefinition(block.type);

  if (block.type === 'heading') {
    const level = (block.data.level as number) ?? 2;
    const headingClass = 'text-xl font-black text-navy';
    const text = String(block.data.text ?? 'Heading');
    if (editable) {
      return (
        <input
          className={`w-full ${headingClass} bg-transparent border-none outline-none`}
          value={String(block.data.text ?? '')}
          onChange={(e) => onUpdate?.({ text: e.target.value })}
          placeholder="Heading"
        />
      );
    }
    if (level <= 1) return <h1 className={headingClass}>{text}</h1>;
    if (level === 2) return <h2 className={headingClass}>{text}</h2>;
    if (level === 3) return <h3 className={headingClass}>{text}</h3>;
    if (level === 4) return <h4 className={headingClass}>{text}</h4>;
    if (level === 5) return <h5 className={headingClass}>{text}</h5>;
    return <h6 className={headingClass}>{text}</h6>;
  }

  if (block.type === 'paragraph' || block.type === 'rich_text') {
    return editable ? (
      <textarea
        className="w-full min-h-[80px] text-sm text-gray-600 border border-[#e8edf2] rounded p-2"
        value={String(block.data.text ?? block.data.html ?? '')}
        onChange={(e) => onUpdate?.({ text: e.target.value })}
        placeholder="Write content..."
      />
    ) : (
      <p className="text-sm text-gray-600">{String(block.data.text ?? '')}</p>
    );
  }

  if (block.type === 'cta' || block.type === 'button') {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="px-4 py-2 bg-[#EB4501] text-white text-xs font-bold uppercase rounded">
          {String(block.data.label ?? 'CTA')}
        </span>
        {editable && (
          <input
            className="text-xs border rounded px-2 py-1"
            value={String(block.data.label ?? '')}
            onChange={(e) => onUpdate?.({ label: e.target.value })}
            placeholder="Button label"
          />
        )}
      </div>
    );
  }

  if (block.type === 'products' || block.type === 'product_card') {
    return (
      <div className="p-4 border border-dashed border-[#e8edf2] rounded bg-[#F8FBFD] text-center text-xs text-gray-400">
        {def.label} — product grid renders on publish
      </div>
    );
  }

  if (block.type === 'divider') {
    return <hr className="border-[#e8edf2]" />;
  }

  if (block.type === 'announcement' || block.type === 'alert' || block.type === 'highlight_box') {
    return (
      <div className="p-3 bg-[#F8FBFD] border border-[#e8edf2] rounded text-sm">
        {editable ? (
          <input
            className="w-full bg-transparent border-none outline-none"
            value={String(block.data.text ?? '')}
            onChange={(e) => onUpdate?.({ text: e.target.value })}
          />
        ) : (
          String(block.data.text ?? def.label)
        )}
      </div>
    );
  }

  if (block.type.startsWith('embed_') || block.type === 'video' || block.type === 'embedded_video') {
    return (
      <div className="aspect-video bg-navy/5 border border-[#e8edf2] rounded flex items-center justify-center text-xs text-gray-400">
        {def.label} embed preview
      </div>
    );
  }

  return (
    <div className="p-3 border border-[#e8edf2] rounded text-xs text-gray-500">
      {def.label} block
    </div>
  );
}

export function SpotlightBlockRenderer({
  blocks,
  selectedBlockId,
  onSelect,
  onUpdate,
  onRemove,
  onMove,
  editable = true,
}: SpotlightBlockRendererProps) {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  if (!sorted.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#e8edf2] rounded-lg">
        <p className="text-sm font-bold text-navy">Start building your Spotlight Experience</p>
        <p className="text-xs text-gray-400 mt-1">Add blocks from the library or choose a template</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((block, idx) => {
        const def = getBlockDefinition(block.type);
        const selected = selectedBlockId === block.blockId;
        return (
          <div
            key={block.blockId}
            className={cn(
              'group relative border rounded-lg p-4 bg-white transition-shadow',
              selected ? 'border-[#EB4501] shadow-md' : 'border-[#e8edf2] hover:border-[#EB4501]/30',
            )}
            onClick={() => onSelect?.(block.blockId)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelect?.(block.blockId); }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase text-gray-400">{def.label}</span>
              {editable && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={(e) => { e.stopPropagation(); onMove?.(block.blockId, 'up'); }} disabled={idx === 0} className="p-1 text-gray-400 hover:text-navy disabled:opacity-30" aria-label="Move up">
                    <ChevronUp size={14} />
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); onMove?.(block.blockId, 'down'); }} disabled={idx === sorted.length - 1} className="p-1 text-gray-400 hover:text-navy disabled:opacity-30" aria-label="Move down">
                    <ChevronDown size={14} />
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); onRemove?.(block.blockId); }} className="p-1 text-rose-400 hover:text-rose-600" aria-label="Remove block">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <BlockContent block={block} editable={editable} onUpdate={(data) => onUpdate?.(block.blockId, data)} />
          </div>
        );
      })}
    </div>
  );
}
