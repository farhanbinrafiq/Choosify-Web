import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BrandCard } from '../../../components/BrandCard';

interface FeaturedBrandsSectionProps {
  brands: any[];
}

export const FeaturedBrandsSection: React.FC<FeaturedBrandsSectionProps> = ({ brands }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Brands</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Trusted brands, verified sellers</p>
        </div>
        <Link 
          to="/brands" 
          className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]"
        >
          VIEW ALL BRANDS <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide">
        {brands.slice(0, 8).map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </section>
  );
};
