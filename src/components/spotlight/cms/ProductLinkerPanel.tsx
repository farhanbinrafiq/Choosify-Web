import React, { useMemo, useState } from 'react';
import { Star, GripVertical, X } from 'lucide-react';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { cn } from '../../../lib/utils';

interface ProductLinkerPanelProps {
  linkedProductIds: string[];
  primaryProductId?: string;
  onChange: (ids: string[], primaryId?: string) => void;
}

export function ProductLinkerPanel({
  linkedProductIds,
  primaryProductId,
  onChange,
}: ProductLinkerPanelProps) {
  const { allCatalogProducts } = useGlobalState();
  const [query, setQuery] = useState('');

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCatalogProducts.filter(
      (p) =>
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q),
    );
  }, [allCatalogProducts, query]);

  const attached = linkedProductIds
    .map((id) => allCatalogProducts.find((p) => p.id === id))
    .filter(Boolean);

  const toggle = (id: string) => {
    if (linkedProductIds.includes(id)) {
      const next = linkedProductIds.filter((x) => x !== id);
      onChange(next, primaryProductId === id ? next[0] : primaryProductId);
    } else {
      const next = [...linkedProductIds, id];
      onChange(next, primaryProductId ?? id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog products..."
          className="w-full mb-3 px-3 py-2 border border-[#e8edf2] rounded text-sm"
        />
        <ul className="max-h-80 overflow-y-auto space-y-2 border border-[#e8edf2] rounded p-2">
          {products.slice(0, 40).map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className={cn(
                  'w-full text-left px-2 py-2 rounded text-xs flex items-center gap-2',
                  linkedProductIds.includes(p.id) ? 'bg-[#EB4501]/10' : 'hover:bg-gray-50',
                )}
              >
                <img src={p.image} alt="" className="w-8 h-8 object-cover rounded" />
                <span className="truncate">{p.title}</span>
                <span className="text-gray-400 ml-auto">৳{p.price}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Attached products</p>
        <ul className="space-y-2">
          {attached.map((p) => p && (
            <li key={p.id} className="flex items-center gap-2 p-2 border rounded">
              <GripVertical size={14} className="text-gray-300" />
              <img src={p.image} alt="" className="w-10 h-10 object-cover rounded" />
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold truncate">{p.title}</p>
                <p className="text-[10px] text-gray-400">{p.brandName}</p>
              </div>
              <button type="button" onClick={() => onChange(linkedProductIds, p.id)} title="Primary">
                <Star size={14} className={primaryProductId === p.id ? 'text-[#EB4501] fill-[#EB4501]' : 'text-gray-300'} />
              </button>
              <button type="button" onClick={() => toggle(p.id)}>
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
