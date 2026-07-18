import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { getCategoryIconComponent } from '../lib/categoryIcons';
import type { CategoryDisplayItem } from '../utils/categoryDisplay';
import { getSubcategoryEmoji, getCategoryBrandNames, getCategoryProducts } from '../utils/categoryStats';
import { PLACEHOLDER_IMAGE } from '../constants';
import { LoadingFallback } from './LoadingFallback';
import { catalogGuideHref } from '../lib/spotlight/content';
import type { CatalogProduct } from '../types/catalog';

const HomeProductCard = React.lazy(() =>
  import('./home/cards/HomeProductCard').then((m) => ({ default: m.HomeProductCard })),
);

type CategorySubcategoryPanelProps = {
  category: CategoryDisplayItem;
  onClose: () => void;
  className?: string;
  products?: CatalogProduct[];
  guides?: Array<{ id: string; title: string; image?: string; slug?: string; category?: string }>;
  creators?: Array<{ id: string; name: string; avatar?: string; specialty?: string }>;
};

export function CategorySubcategoryPanel({
  category,
  onClose,
  className,
  products = [],
  guides = [],
  creators = [],
}: CategorySubcategoryPanelProps) {
  const brandNames = getCategoryBrandNames(category, products);
  const popularProducts = getCategoryProducts(category, products, 6);

  const categoryGuides = guides
    .filter((g) => {
      const hay = `${g.title} ${g.category ?? ''}`.toLowerCase();
      const needle = category.name.toLowerCase().split(/[\s&]+/)[0] ?? '';
      return hay.includes(needle);
    })
    .slice(0, 4);

  const categoryCreators = creators.slice(0, 4);

  return (
    <motion.div
      key={`subpanel-${category.name}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('col-span-full overflow-hidden', className)}
    >
      <div className="mt-4 mb-2 rounded-[20px] bg-white border border-[#eef2f6] shadow-lg p-5 md:p-8 text-left">
        <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[#eef2f6]">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F8FA] flex items-center justify-center shrink-0 ring-2 ring-[#E8500A]/10">
              {getCategoryIconComponent(category.name, category.icon)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-semibold text-[#1A1D4E] tracking-tight truncate">
                {category.name}
              </h2>
              <p className="text-xs text-[#8a9bb0] mt-0.5">
                {category.count.toLocaleString()} products · {category.subcategories.length} subcategories
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 rounded-full border border-[#eef2f6] hover:border-[#E8500A]/30 flex items-center justify-center text-[#8a9bb0] hover:text-[#E8500A] transition-colors bg-white shrink-0"
            aria-label="Collapse category"
          >
            <X size={16} />
          </button>
        </div>

        {category.subcategories.length > 0 && (
          <section className="mb-8" aria-labelledby={`${category.id}-subcategories`}>
            <h3 id={`${category.id}-subcategories`} className="text-[11px] font-black uppercase tracking-widest text-[#8a9bb0] mb-4">
              Subcategories
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {category.subcategories.map((sub, index) => (
                <motion.button
                  key={sub.name}
                  type="button"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F7F8FA] hover:bg-[#FFF8F4] border border-transparent hover:border-[#E8500A]/20 text-sm font-medium text-[#1A1D4E] hover:text-[#E8500A] transition-all duration-200 min-h-[44px]"
                  onClick={() => {
                    document.getElementById('categories-main-display')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span aria-hidden>{getSubcategoryEmoji(sub.name)}</span>
                  {sub.name}
                </motion.button>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8" aria-labelledby={`${category.id}-brands`}>
          <h3 id={`${category.id}-brands`} className="text-[11px] font-black uppercase tracking-widest text-[#8a9bb0] mb-4">
            Featured Brands
          </h3>
          <div className="flex flex-wrap gap-3">
            {brandNames.map((brand) => (
              <Link
                key={brand}
                to={`/search?q=${encodeURIComponent(brand)}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border border-[#eef2f6] shadow-sm hover:shadow-md hover:border-[#E8500A]/20 hover:-translate-y-0.5 transition-all duration-200 min-h-[48px] text-sm font-semibold text-[#1A1D4E] hover:text-[#E8500A]"
              >
                {brand}
              </Link>
            ))}
          </div>
        </section>

        {popularProducts.length > 0 && (
          <section className="mb-8" aria-labelledby={`${category.id}-products`}>
            <div className="flex items-end justify-between gap-3 mb-4">
              <h3 id={`${category.id}-products`} className="text-[11px] font-black uppercase tracking-widest text-[#8a9bb0]">
                Popular Products
              </h3>
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="text-[11px] font-bold uppercase tracking-wider text-[#E8500A] hover:underline inline-flex items-center gap-1"
              >
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {popularProducts.map((product) => (
                <Suspense key={product.id} fallback={<LoadingFallback />}>
                  <HomeProductCard product={product} />
                </Suspense>
              ))}
            </div>
          </section>
        )}

        {categoryGuides.length > 0 && (
          <section className="mb-8" aria-labelledby={`${category.id}-guides`}>
            <h3 id={`${category.id}-guides`} className="text-[11px] font-black uppercase tracking-widest text-[#8a9bb0] mb-4">
              Buying Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categoryGuides.map((guide) => (
                <Link
                  key={guide.id}
                  to={catalogGuideHref(guide)}
                  className="group flex gap-3 p-3 rounded-2xl bg-[#F7F8FA] hover:bg-white border border-transparent hover:border-[#eef2f6] hover:shadow-md transition-all duration-200"
                >
                  <div className="w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-white">
                    <img
                      src={guide.image || PLACEHOLDER_IMAGE}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 py-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#E8500A]">Guide</span>
                    <p className="text-sm font-semibold text-[#1A1D4E] line-clamp-2 group-hover:text-[#E8500A] transition-colors">
                      {guide.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {categoryCreators.length > 0 && (
          <section className="mb-8" aria-labelledby={`${category.id}-creators`}>
            <h3 id={`${category.id}-creators`} className="text-[11px] font-black uppercase tracking-widest text-[#8a9bb0] mb-4">
              Creators
            </h3>
            <div className="flex flex-wrap gap-3">
              {categoryCreators.map((creator) => (
                <Link
                  key={creator.id}
                  to={`/creators/${creator.id}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F7F8FA] hover:bg-white border border-[#eef2f6] hover:border-[#E8500A]/20 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E8500A]/10 overflow-hidden flex items-center justify-center text-[10px] font-bold text-[#E8500A]">
                    {creator.avatar ? (
                      <img src={creator.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      creator.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#1A1D4E]">{creator.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
