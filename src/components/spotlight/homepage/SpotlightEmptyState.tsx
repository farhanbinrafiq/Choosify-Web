import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export function SpotlightEmptyState() {
  return (
    <div className="text-center py-10 px-4 border border-dashed border-[#e8edf2] rounded-lg bg-gray-50/50">
      <p className="text-sm text-gray-500 mb-4">No active Spotlight campaigns right now.</p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-xs font-bold uppercase rounded"
      >
        <ShoppingBag size={14} /> Browse Products
      </Link>
    </div>
  );
}
