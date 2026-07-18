import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CategoryCard } from '../../../components/CategoryCard';

interface CategoriesSectionProps {
  categories: any[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Categories</h2>
        <Link to="/categories" className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]">
          VIEW ALL CATEGORIES <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {categories.slice(0, 6).map((cat) => {
          const categoryCovers: Record<string, string> = {
            'cat-elect': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
            'cat-fash': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
            'cat-mob': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
            'cat-home': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
            'cat-beau': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
            'cat-sport': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80'
          };
          const img = categoryCovers[cat.id] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
          return (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              title={cat.name}
              image={img}
              discount="Up to 40% Off"
              count={cat.name === 'Electronics' ? 120 : cat.name === 'Fashion' ? 450 : 180}
              items={cat.name === 'Electronics' ? ['Headphones', 'Laptops', 'Audio'] : ['Men\'s Apparel', 'Women\'s Apparel', 'Casual Shoes']}
            />
          );
        })}
      </div>
    </section>
  );
};
