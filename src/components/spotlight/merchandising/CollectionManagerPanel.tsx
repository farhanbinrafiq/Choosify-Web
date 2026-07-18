import React, { useState } from 'react';
import { Copy, Plus, Trash2 } from 'lucide-react';
import type { SpotlightMerchandisingCollection } from '../../../types/spotlight/merchandising/collections';
import { duplicateCollection } from '../../../services/spotlightMerchandisingStorage';

interface CollectionManagerPanelProps {
  collections: SpotlightMerchandisingCollection[];
  onChange: (collections: SpotlightMerchandisingCollection[]) => void;
}

export function CollectionManagerPanel({ collections, onChange }: CollectionManagerPanelProps) {
  const [name, setName] = useState('');

  const create = () => {
    if (!name.trim()) return;
    const now = new Date().toISOString();
    onChange([
      ...collections,
      {
        collectionId: `col-${Date.now()}`,
        name: name.trim(),
        collectionType: 'manual',
        productIds: [],
        displayOrder: collections.length,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    setName('');
  };

  return (
    <div className="space-y-3 border border-[#e8edf2] rounded p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Collections</p>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection name"
          className="flex-grow px-2 py-1 border rounded text-sm"
        />
        <button type="button" onClick={create} className="px-3 py-1 bg-navy text-white text-xs rounded flex items-center gap-1">
          <Plus size={12} /> Create
        </button>
      </div>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {collections.map((c) => (
          <li key={c.collectionId} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
            <span>
              {c.name} <span className="text-gray-400">({c.collectionType}) · {c.productIds.length} items</span>
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                title="Duplicate"
                onClick={() => onChange([...collections, duplicateCollection(c, `${c.name} (Copy)`)])}
              >
                <Copy size={12} />
              </button>
              <button type="button" onClick={() => onChange(collections.filter((x) => x.collectionId !== c.collectionId))}>
                <Trash2 size={12} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
