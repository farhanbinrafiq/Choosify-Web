import React, { useMemo, useState } from 'react';
import { GripVertical, Star, X } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import type { CmsAssociationItem, CmsAssociationKind } from '../../types/marketing/cms';
import { cn } from '../../lib/utils';

interface AssociationPanelProps {
  associations: CmsAssociationItem[];
  onChange: (items: CmsAssociationItem[]) => void;
  allowedKinds?: CmsAssociationKind[];
}

const KIND_TABS: { id: CmsAssociationKind; label: string }[] = [
  { id: 'product', label: 'Products' },
  { id: 'service', label: 'Services' },
  { id: 'brand', label: 'Brands' },
  { id: 'collection', label: 'Collections' },
];

export function AssociationPanel({
  associations,
  onChange,
  allowedKinds = ['product', 'service', 'brand', 'collection'],
}: AssociationPanelProps) {
  const { allCatalogProducts, allBrands } = useGlobalState();
  const [tab, setTab] = useState<CmsAssociationKind>(allowedKinds[0] ?? 'product');
  const [query, setQuery] = useState('');

  const catalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    switch (tab) {
      case 'product':
        return allCatalogProducts
          .filter((p) => !q || p.title.toLowerCase().includes(q) || p.brandName.toLowerCase().includes(q))
          .slice(0, 30)
          .map((p) => ({
            id: String(p.id),
            kind: 'product' as const,
            label: p.title,
            imageUrl: p.image,
          }));
      case 'brand':
        return allBrands
          .filter((b) => !q || b.name.toLowerCase().includes(q))
          .slice(0, 30)
          .map((b) => ({
            id: String(b.id),
            kind: 'brand' as const,
            label: b.name,
            imageUrl: b.logo,
          }));
      case 'service':
        return [
          { id: 'svc-delivery', kind: 'service' as const, label: 'Express Delivery', imageUrl: undefined },
          { id: 'svc-install', kind: 'service' as const, label: 'Home Installation', imageUrl: undefined },
          { id: 'svc-warranty', kind: 'service' as const, label: 'Extended Warranty', imageUrl: undefined },
        ].filter((s) => !q || s.label.toLowerCase().includes(q));
      case 'collection':
        return [
          { id: 'col-summer', kind: 'collection' as const, label: 'Summer Picks', imageUrl: undefined },
          { id: 'col-tech', kind: 'collection' as const, label: 'Tech Essentials', imageUrl: undefined },
          { id: 'col-deals', kind: 'collection' as const, label: 'Best Deals', imageUrl: undefined },
        ].filter((c) => !q || c.label.toLowerCase().includes(q));
      default:
        return [];
    }
  }, [tab, query, allCatalogProducts, allBrands]);

  const attached = associations.filter((a) => a.kind === tab);

  const toggle = (item: { id: string; kind: CmsAssociationKind; label: string; imageUrl?: string }) => {
    const exists = associations.find((a) => a.id === item.id && a.kind === item.kind);
    if (exists) {
      const next = associations.filter((a) => !(a.id === item.id && a.kind === item.kind));
      onChange(next.map((a, i) => ({ ...a, order: i })));
    } else {
      onChange([
        ...associations,
        {
          ...item,
          order: associations.length,
          isPrimary: associations.length === 0,
        },
      ]);
    }
  };

  const setPrimary = (id: string, kind: CmsAssociationKind) => {
    onChange(
      associations.map((a) => ({
        ...a,
        isPrimary: a.id === id && a.kind === kind,
      })),
    );
  };

  const remove = (id: string, kind: CmsAssociationKind) => {
    onChange(associations.filter((a) => !(a.id === id && a.kind === kind)));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const kindItems = associations.filter((a) => a.kind === tab);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= kindItems.length) return;
    const ids = kindItems.map((a) => `${a.kind}:${a.id}`);
    const allIds = associations.map((a) => `${a.kind}:${a.id}`);
    const fromKey = ids[idx];
    const toKey = ids[swapIdx];
    const fromIdx = allIds.indexOf(fromKey);
    const toIdx = allIds.indexOf(toKey);
    const next = [...associations];
    [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
    onChange(next.map((a, i) => ({ ...a, order: i })));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="flex gap-1 mb-3">
          {KIND_TABS.filter((t) => allowedKinds.includes(t.id)).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'px-3 py-1.5 text-[10px] font-bold uppercase rounded border',
                tab === t.id ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-[#e8edf2]',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${tab}...`}
          className="w-full mb-3 px-3 py-2 border border-[#e8edf2] rounded text-sm"
        />
        <ul className="max-h-72 overflow-y-auto space-y-1 border border-[#e8edf2] rounded p-2">
          {catalog.map((item) => {
            const active = associations.some((a) => a.id === item.id && a.kind === item.kind);
            return (
              <li key={`${item.kind}-${item.id}`}>
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  className={cn(
                    'w-full text-left px-2 py-2 rounded text-xs flex items-center gap-2',
                    active ? 'bg-[#EB4501]/10' : 'hover:bg-gray-50',
                  )}
                >
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="w-8 h-8 object-cover rounded" />}
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Attached ({associations.length})
        </p>
        <ul className="space-y-2">
          {associations.map((a, idx) => (
            <li key={`${a.kind}-${a.id}`} className="flex items-center gap-2 p-2 border rounded">
              <div className="flex flex-col">
                <button type="button" onClick={() => move(idx, -1)} className="text-gray-300 text-[10px]">▲</button>
                <GripVertical size={12} className="text-gray-300" />
                <button type="button" onClick={() => move(idx, 1)} className="text-gray-300 text-[10px]">▼</button>
              </div>
              {a.imageUrl && <img src={a.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />}
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold truncate">{a.label}</p>
                <p className="text-[10px] text-gray-400 uppercase">{a.kind}</p>
              </div>
              <button
                type="button"
                onClick={() => setPrimary(a.id, a.kind)}
                className={cn('p-1', a.isPrimary ? 'text-[#EB4501]' : 'text-gray-300')}
                title="Set as primary"
              >
                <Star size={14} fill={a.isPrimary ? 'currentColor' : 'none'} />
              </button>
              <button type="button" onClick={() => remove(a.id, a.kind)} className="text-gray-400 hover:text-red-500 p-1">
                <X size={14} />
              </button>
            </li>
          ))}
          {associations.length === 0 && (
            <p className="text-xs text-gray-400 py-4 text-center border border-dashed rounded">No associations yet</p>
          )}
        </ul>
      </div>
    </div>
  );
}
