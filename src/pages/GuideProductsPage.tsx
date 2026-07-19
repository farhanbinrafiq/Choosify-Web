import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BLOGS, PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { PRODUCT_CARD_GRID } from '../lib/pageLayout';
import { catalogGuideHref } from '../lib/spotlight/content';

export function GuideProductsPage() {
  const { id } = useParams();

  const guide = BLOGS.find((b) => b.id === Number(id));

  if (!guide) {
    return (
      <div className="min-h-screen bg-choosify-feed flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight">Guide not found</h2>
          <Link to="/spotlight?tab=guides" className="text-[#EB4501] font-bold mt-4 block text-[12.5px] hover:underline">
            Back to guides
          </Link>
        </div>
      </div>
    );
  }

  const recommendedProductIds = (guide as any).recommendedProducts || [];
  const guideProducts = PRODUCTS.filter((p) => recommendedProductIds.includes(p.id));

  return (
    <div className="bg-choosify-feed min-h-screen pb-20">
      <div className="w-full px-5 sm:px-10 pt-4">
        <header className="max-w-[1280px] mx-auto choosify-dark-surface text-white px-5 sm:px-10 py-7 rounded-[14px] overflow-hidden">
          <Link
            to={catalogGuideHref({ id: id ?? guide.id, slug: (guide as { slug?: string }).slug })}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/50 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft size={14} />
            Back to guide
          </Link>
          <div className="text-[11px] font-bold text-[#EB4501] tracking-wide mb-1.5">
            RECOMMENDED PRODUCTS
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight max-w-3xl">
            Selected for “{guide.title}”
          </h1>
        </header>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-8">
        {guideProducts.length === 0 ? (
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-10 text-center">
            <p className="text-[13px] font-semibold text-[#9AA0AC]">
              No recommended products linked to this guide yet.
            </p>
          </div>
        ) : (
          <div className={PRODUCT_CARD_GRID}>
            {guideProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
