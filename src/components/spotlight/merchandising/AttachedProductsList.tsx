import React from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Pin, Star } from 'lucide-react';
import type { CatalogProduct } from '../../../types/catalog';
import type { SpotlightCampaignProductLink } from '../../../types/spotlight/merchandising/productLink';
import { SPOTLIGHT_PRODUCT_ROLE_META } from '../../../types/spotlight/merchandising/roles';
import type { SpotlightProductMerchandisingRole } from '../../../types/spotlight/merchandising/roles';
import { assessProductHealth } from '../../../utils/spotlightProductHealth';
import { cn } from '../../../lib/utils';

interface AttachedProductsListProps {
  links: SpotlightCampaignProductLink[];
  catalog: CatalogProduct[];
  onRoleChange: (productId: string, role: SpotlightProductMerchandisingRole) => void;
  onMove: (productId: string, direction: 'up' | 'down') => void;
  onPin: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export function AttachedProductsList({
  links,
  catalog,
  onRoleChange,
  onMove,
  onPin,
  onRemove,
}: AttachedProductsListProps) {
  return (
    <ul className="space-y-2">
      {links.map((link, idx) => {
        const product = catalog.find((p) => p.id === link.productId);
        const health = assessProductHealth(product);
        const hasError = health.some((h) => h.severity === 'error');

        return (
          <li
            key={link.productId}
            className={cn(
              'flex flex-wrap items-center gap-2 p-2 border rounded',
              hasError && 'border-red-200 bg-red-50/50',
            )}
          >
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => onMove(link.productId, 'up')} disabled={idx === 0} className="text-gray-400 disabled:opacity-30">
                <ChevronUp size={12} />
              </button>
              <button type="button" onClick={() => onMove(link.productId, 'down')} disabled={idx === links.length - 1} className="text-gray-400 disabled:opacity-30">
                <ChevronDown size={12} />
              </button>
            </div>
            {product ? (
              <img src={product.image} alt="" className="w-10 h-10 object-cover rounded" />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded" />
            )}
            <div className="flex-grow min-w-0">
              <p className="text-xs font-semibold truncate">{product?.title ?? link.productId}</p>
              <select
                value={link.role}
                onChange={(e) => onRoleChange(link.productId, e.target.value as SpotlightProductMerchandisingRole)}
                className="text-[10px] border rounded mt-0.5"
              >
                {(Object.keys(SPOTLIGHT_PRODUCT_ROLE_META) as SpotlightProductMerchandisingRole[]).map((r) => (
                  <option key={r} value={r}>{SPOTLIGHT_PRODUCT_ROLE_META[r].label}</option>
                ))}
              </select>
            </div>
            {hasError && (
              <span title={health[0]?.message}>
                <AlertTriangle size={14} className="text-red-500" aria-hidden />
              </span>
            )}
            <button type="button" onClick={() => onPin(link.productId)} title="Pin">
              <Pin size={14} className={link.pinned ? 'text-[#E8500A]' : 'text-gray-300'} />
            </button>
            {link.role === 'hero' && <Star size={14} className="text-[#E8500A] fill-[#E8500A]" />}
            <button type="button" onClick={() => onRemove(link.productId)} className="text-gray-400 hover:text-red-500 text-xs">
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
