import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface Product {
  id: number;
  title: string;
  price: string | number;
  image?: string;
  images?: string[];
  brand?: string;
  rating?: number;
}

interface RecentlyViewedCardProps {
  product: Product;
  className?: string;
}

export const RecentlyViewedCard = memo(function RecentlyViewedCard({ product, className }: RecentlyViewedCardProps) {
  const imageUrl = product.image 
    || (product.images && product.images[0]) 
    || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop';
    
  const displayPrice = typeof product.price === 'number' 
    ? `৳${product.price.toLocaleString()}` 
    : product.price.startsWith('৳') || product.price.startsWith('BDT')
      ? product.price
      : `৳${product.price}`;

  return (
    <Link
      to={`/products/${product.id}`}
      id={`recently-viewed-card-${product.id}`}
      className={cn(
        "block w-[150px] min-w-[150px] max-w-[150px] bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-md transition-all duration-300 select-none text-left flex flex-col gap-2 shrink-0 group cursor-pointer",
        className
      )}
    >
      {/* Product Image Area */}
      <div className="w-full aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
        <img 
          src={imageUrl} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Info Area */}
      <div className="flex flex-col min-w-0">
        {product.brand && (
          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider truncate mb-0.5">
            {product.brand}
          </span>
        )}
        <h4 className="text-[11px] font-bold text-[#000435] leading-snug line-clamp-1 group-hover:text-[#CF4400] transition-colors">
          {product.title}
        </h4>
        <div className="text-[11px] font-black text-[#EB4501] mt-1">
          {displayPrice}
        </div>
      </div>
    </Link>
  );
});
