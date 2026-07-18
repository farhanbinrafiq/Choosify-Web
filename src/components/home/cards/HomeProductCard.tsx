import React, { memo } from 'react';
import type { CatalogProduct } from '../../../types/catalog';
import { ProductCard } from '../../ProductCard';
import { cn } from '../../../lib/utils';

interface HomeProductCardProps {
  product: CatalogProduct;
  className?: string;
}

/** Homepage / category browse — same Choosify.dc.html ProductCard anatomy */
export const HomeProductCard = memo(function HomeProductCard({
  product,
  className,
}: HomeProductCardProps) {
  return (
    <div className={cn('h-full', className)}>
      <ProductCard product={product} variant="grid" />
    </div>
  );
});
