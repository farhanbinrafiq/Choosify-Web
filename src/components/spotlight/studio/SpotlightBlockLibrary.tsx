import React from 'react';
import { BLOCK_REGISTRY } from '../../../lib/spotlight/studio/blockRegistry';
import type { SpotlightBlockType } from '../../../types/spotlight/studio';

interface SpotlightBlockLibraryProps {
  onAdd: (type: SpotlightBlockType) => void;
  filterCategory?: string;
}

export function SpotlightBlockLibrary({ onAdd, filterCategory }: SpotlightBlockLibraryProps) {
  const blocks = filterCategory
    ? BLOCK_REGISTRY.filter((b) => b.category === filterCategory)
    : BLOCK_REGISTRY;

  const grouped = blocks.reduce<Record<string, typeof blocks>>((acc, b) => {
    acc[b.category] = acc[b.category] ?? [];
    acc[b.category].push(b);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Add Block</p>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <p className="text-[10px] font-bold uppercase text-navy mb-2">{category}</p>
          <div className="grid grid-cols-2 gap-2">
            {items.map((block) => (
              <button
                key={block.type}
                type="button"
                onClick={() => onAdd(block.type)}
                className="text-left p-2 rounded border border-[#e8edf2] hover:border-[#E8500A]/40 hover:bg-[#F8FBFD] transition-colors"
              >
                <span className="text-xs font-bold text-navy">{block.label}</span>
                <span className="block text-[9px] text-gray-400 mt-0.5 line-clamp-2">{block.description}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
