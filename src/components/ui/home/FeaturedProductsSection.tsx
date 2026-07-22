import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../../components/ProductCard';

interface FeaturedProductsSectionProps {
  products: any[];
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Products</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Handpicked deals you'll love</p>
        </div>
        <Link 
          to="/products" 
          className="text-xs font-bold text-[#EB4501] uppercase tracking-wider flex items-center gap-1 hover:text-[#CF4400]"
        >
          VIEW ALL ›
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.slice(0, 5).map(prod => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
};
