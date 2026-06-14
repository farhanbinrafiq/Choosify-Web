import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ArrowRight, ShoppingBag } from 'lucide-react';
import { BLOGS, PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';

export function GuideProductsPage() {
  const { id } = useParams();
  
  const guide = BLOGS.find(b => b.id === Number(id));
  
  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-navy uppercase italic">Guide Not Found</h2>
          <Link to="/guides" className="text-orange-primary font-bold mt-4 block uppercase tracking-widest text-[10px]">Back to Guides</Link>
        </div>
      </div>
    );
  }

  // Define recommendedProducts as number[] or default to empty
  const recommendedProductIds = (guide as any).recommendedProducts || [];
  const guideProducts = PRODUCTS.filter(p => recommendedProductIds.includes(p.id));

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Header Section */}
      <div className="hero-gradient py-20 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            to={`/guides/${id}`}
            className="flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] italic mb-12 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            Back to Guide
          </Link>
          
          <div className="max-w-4xl">
            <div className="bg-orange-primary text-white text-[10px] font-black px-6 py-2 rounded-xl mb-8 uppercase tracking-[0.3em] italic w-fit">
              RECOMMENDED PRODUCTS
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.85] uppercase">
              Products specifically selected for <span className="text-orange-primary">"{guide.title}"</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {guideProducts.map(product => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}
