import React, { useEffect, useMemo } from 'react';
import type { SpotlightCampaignMerchandising } from '../../../types/spotlight/merchandising/model';
import { useSpotlightMerchandising } from '../../../hooks/useSpotlightMerchandising';
import { useSpotlightProductSearch } from '../../../hooks/useSpotlightProductSearch';
import { ProductSearchToolbar } from './ProductSearchToolbar';
import { AttachedProductsList } from './AttachedProductsList';
import { CampaignSlotsPanel } from './CampaignSlotsPanel';
import { BundleBuilderPanel } from './BundleBuilderPanel';
import { CollectionManagerPanel } from './CollectionManagerPanel';
import { MerchantGuidancePanel } from './MerchantGuidancePanel';
import { attachBrandProducts, attachCategoryProducts } from '../../../utils/spotlightProductSearch';
import { cn } from '../../../lib/utils';

interface ProductMerchandisingPanelProps {
  merchandising?: SpotlightCampaignMerchandising;
  linkedProductIds: string[];
  primaryProductId?: string;
  brandId?: string;
  categoryId?: string;
  onChange: (
    merchandising: SpotlightCampaignMerchandising,
    legacy: { linkedProductIds: string[]; primaryProductId?: string },
  ) => void;
}

export function ProductMerchandisingPanel({
  merchandising: initialMerch,
  linkedProductIds,
  primaryProductId,
  brandId,
  categoryId,
  onChange,
}: ProductMerchandisingPanelProps) {
  const {
    merchandising,
    orderedLinks,
    legacySync,
    selectedIds,
    attach,
    detach,
    setRole,
    move,
    togglePin,
    toggleSelect,
    bulkDetach,
    updateCollections,
    updateBundles,
  } = useSpotlightMerchandising(initialMerch, linkedProductIds, primaryProductId);

  const {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    results,
    total,
    hasMore,
    loadMore,
    allCatalogProducts,
  } = useSpotlightProductSearch();

  useEffect(() => {
    onChange(merchandising, legacySync);
  }, [merchandising, legacySync, onChange]);

  const productTitles = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of allCatalogProducts) m[p.id] = p.title;
    return m;
  }, [allCatalogProducts]);

  const attachedSet = useMemo(() => new Set(merchandising.productLinks.map((l) => l.productId)), [merchandising.productLinks]);

  const attachBrand = () => {
    if (!brandId) return;
    attach(attachBrandProducts(allCatalogProducts, brandId), 'featured');
  };

  const attachCategory = () => {
    if (!categoryId) return;
    attach(attachCategoryProducts(allCatalogProducts, categoryId), 'featured');
  };

  const bulkAttach = () => {
    attach([...selectedIds], 'featured');
    selectedIds.forEach((id) => toggleSelect(id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <ProductSearchToolbar
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={setFilters}
            onSortChange={setSortBy}
            total={total}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            {brandId && (
              <button type="button" onClick={attachBrand} className="text-[10px] px-2 py-1 border rounded uppercase font-bold">
                Attach brand
              </button>
            )}
            {categoryId && (
              <button type="button" onClick={attachCategory} className="text-[10px] px-2 py-1 border rounded uppercase font-bold">
                Attach category
              </button>
            )}
            {selectedIds.size > 0 && (
              <>
                <button type="button" onClick={bulkAttach} className="text-[10px] px-2 py-1 bg-[#EB4501] text-white rounded font-bold">
                  Attach selected ({selectedIds.size})
                </button>
                <button type="button" onClick={bulkDetach} className="text-[10px] px-2 py-1 border border-red-200 text-red-600 rounded">
                  Remove selected
                </button>
              </>
            )}
          </div>
          <ul className="max-h-72 overflow-y-auto space-y-1 border border-[#e8edf2] rounded p-2">
            {results.map((p) => {
              const isAttached = attachedSet.has(p.id);
              const isSelected = selectedIds.has(p.id);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => (isAttached ? detach([p.id]) : toggleSelect(p.id))}
                    onDoubleClick={() => !isAttached && attach([p.id])}
                    className={cn(
                      'w-full text-left px-2 py-2 rounded text-xs flex items-center gap-2',
                      isAttached ? 'bg-green-50 border border-green-200' : isSelected ? 'bg-[#EB4501]/10' : 'hover:bg-gray-50',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(p.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    />
                    <img src={p.image} alt="" className="w-8 h-8 object-cover rounded" />
                    <span className="truncate flex-grow">{p.title}</span>
                    <span className="text-gray-400">৳{p.price}</span>
                    {p.stock <= 0 && <span className="text-red-500 text-[9px]">OOS</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          {hasMore && (
            <button type="button" onClick={loadMore} className="mt-2 text-xs text-[#EB4501] font-bold">
              Load more…
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Attached products ({orderedLinks.length})
          </p>
          <AttachedProductsList
            links={orderedLinks}
            catalog={allCatalogProducts}
            onRoleChange={setRole}
            onMove={move}
            onPin={togglePin}
            onRemove={(id) => detach([id])}
          />
          <CampaignSlotsPanel
            slots={merchandising.slots}
            productLinks={merchandising.productLinks}
            productTitles={productTitles}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CollectionManagerPanel
          collections={merchandising.collections}
          onChange={updateCollections}
        />
        <BundleBuilderPanel
          bundles={merchandising.bundles}
          productLinks={merchandising.productLinks}
          productTitles={productTitles}
          onChange={updateBundles}
        />
      </div>
    </div>
  );
}
