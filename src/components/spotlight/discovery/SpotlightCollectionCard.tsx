import React from 'react';
import { Link } from 'react-router-dom';
import type { SpotlightCollection } from '../../../types/spotlight/discovery/collections';

interface SpotlightCollectionCardProps {
  collection: SpotlightCollection;
  compact?: boolean;
}

export function SpotlightCollectionCard({ collection, compact }: SpotlightCollectionCardProps) {
  return (
    <Link
      to={`/spotlight/collections/${collection.slug}`}
      className="group flex flex-col h-full min-h-[120px] p-4 bg-white border border-[#e8edf2] rounded-[5px] hover:border-[#EB4501]/40 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]"
      aria-label={`Collection: ${collection.name}`}
    >
      <span className="text-[9px] font-black uppercase tracking-widest text-[#EB4501]">{collection.kind}</span>
      <h3 className={cnTitle(compact)}>{collection.name}</h3>
      {!compact && collection.description && (
        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{collection.description}</p>
      )}
      <p className="mt-auto pt-2 text-[10px] font-bold text-gray-400 uppercase">{collection.items.length} items</p>
    </Link>
  );
}

function cnTitle(compact?: boolean) {
  return compact
    ? 'text-sm font-bold text-[#1a1a2e] mt-1 line-clamp-1'
    : 'text-base font-bold text-[#1a1a2e] mt-1 line-clamp-2';
}

interface SpotlightCollectionRowProps {
  collections: SpotlightCollection[];
}

export function SpotlightCollectionRow({ collections }: SpotlightCollectionRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {collections.map((c) => (
        <SpotlightCollectionCard key={c.collectionId} collection={c} />
      ))}
    </div>
  );
}
