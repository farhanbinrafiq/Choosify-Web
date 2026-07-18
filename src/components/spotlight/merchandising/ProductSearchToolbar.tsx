import React from 'react';
import type {
  SpotlightProductSearchFilters,
  SpotlightProductSearchSortKey,
} from '../../../types/spotlight/merchandising/search';

interface ProductSearchToolbarProps {
  filters: SpotlightProductSearchFilters;
  sortBy: SpotlightProductSearchSortKey;
  onFiltersChange: (f: SpotlightProductSearchFilters) => void;
  onSortChange: (s: SpotlightProductSearchSortKey) => void;
  total: number;
}

export function ProductSearchToolbar({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  total,
}: ProductSearchToolbarProps) {
  return (
    <div className="space-y-3 mb-3">
      <div className="flex flex-wrap gap-2">
        <input
          placeholder="Search name, brand, category, tag..."
          value={filters.query ?? ''}
          onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
          className="flex-grow min-w-[180px] px-3 py-2 border border-[#e8edf2] rounded text-sm"
        />
        <input
          placeholder="SKU"
          value={filters.sku ?? ''}
          onChange={(e) => onFiltersChange({ ...filters, sku: e.target.value })}
          className="w-24 px-2 py-2 border border-[#e8edf2] rounded text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SpotlightProductSearchSortKey)}
          className="px-2 py-2 border border-[#e8edf2] rounded text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popularity">Popularity</option>
          <option value="alphabetical">A–Z</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={filters.inStockOnly ?? false}
            onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
          />
          In stock
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={filters.verifiedSellerOnly ?? false}
            onChange={(e) => onFiltersChange({ ...filters, verifiedSellerOnly: e.target.checked })}
          />
          Verified seller
        </label>
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value ? (e.target.value as 'live' | 'draft' | 'archived') : undefined,
            })
          }
          className="px-2 py-1 border rounded"
        >
          <option value="">All status</option>
          <option value="live">Live</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <span className="text-gray-400 ml-auto">{total} products</span>
      </div>
    </div>
  );
}
