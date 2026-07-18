import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { CatalogProduct } from '../../../types/catalog';
import { cn } from '../../../lib/utils';

interface SpotlightCommerceStripProps {
  product?: CatalogProduct;
  serviceLabel?: string;
  extraProductCount?: number;
  brandName?: string;
  compact?: boolean;
  className?: string;
}

export function SpotlightCommerceStrip({
  product,
  serviceLabel,
  extraProductCount = 0,
  brandName,
  compact,
  className,
}: SpotlightCommerceStripProps) {
  if (!product && !serviceLabel) return null;

  const productUrl = product ? `/products/${product.slug || product.id}` : undefined;

  return (
    <div className={cn('rounded-[5px] border border-[#e8edf2] bg-[#fafbfc] p-2.5', className)}>
      {product && (
        <div className="flex items-center gap-2.5">
          {product.image && (
            <img
              src={product.image}
              alt=""
              className={cn('rounded object-cover border border-gray-100 shrink-0', compact ? 'w-10 h-10' : 'w-12 h-12')}
            />
          )}
          <div className="min-w-0 flex-1">
            <p className={cn('font-semibold text-[#1a1a2e] line-clamp-1', compact ? 'text-[11px]' : 'text-xs')}>
              {product.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn('font-black text-[#E8500A]', compact ? 'text-xs' : 'text-sm')}>
                ৳{product.price.toLocaleString()}
              </span>
              {extraProductCount > 0 && (
                <span className="text-[9px] font-bold text-gray-400 uppercase">+{extraProductCount} more</span>
              )}
            </div>
            {brandName && (
              <p className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5 truncate">{brandName}</p>
            )}
          </div>
          {productUrl && (
            <Link
              to={productUrl}
              className="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white bg-[#E8500A] rounded hover:bg-[#CF4400]"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingBag size={10} aria-hidden />
              Shop
            </Link>
          )}
        </div>
      )}
      {!product && serviceLabel && (
        <p className={cn('font-semibold text-[#1a1a2e]', compact ? 'text-[11px]' : 'text-xs')}>{serviceLabel}</p>
      )}
    </div>
  );
}
