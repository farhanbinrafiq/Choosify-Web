import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { PRODUCT_CARD_GRID } from '../lib/pageLayout';
import { ProductCard } from '../components/ProductCard';
import { BrandPostCard } from '../components/BrandPostCard';
import { useRegisterPageFilters } from '../components/FilterEngine';
import {
  formatBrandPostDateRange,
  getBrandPostBySlug,
  getBrandPostsByBrandId,
} from '../lib/brandPosts';
import { BRAND_POST_KIND_LABELS } from '../types/brandPost';
import { PRODUCTS } from '../constants';

export function BrandPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBrandPostBySlug(slug) : undefined;

  const relatedPosts = useMemo(
    () => (post ? getBrandPostsByBrandId(post.brandId).filter((p) => p.slug !== post.slug).slice(0, 4) : []),
    [post],
  );

  const linkedProducts = useMemo(() => {
    if (!post?.linkedProductIds?.length) return [];
    return PRODUCTS.filter((p) => post.linkedProductIds!.includes(p.id));
  }, [post]);

  useRegisterPageFilters({
    pageName: post?.title ?? "What's On",
    renderSearch: null,
    quickFilters: [],
    renderFilters: null,
    activeFilterCount: 0,
    onClearAll: null,
  });

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm font-bold text-[#1A1D4E]">This post could not be found.</p>
        <Link to="/whats-on" className="text-[#E8500A] text-xs font-black uppercase hover:underline">
          Back to What&apos;s On
        </Link>
      </div>
    );
  }

  const dateLabel = formatBrandPostDateRange(post.startDate, post.endDate);

  return (
    <div className="bg-choosify-feed min-h-screen pb-16">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#E8500A] mb-4"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <article className="bg-white rounded-[5px] border border-[#e8edf2] shadow-sm overflow-hidden">
          <div className="relative aspect-[21/9] sm:aspect-[2.4/1] bg-slate-100">
            <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#E8500A] text-white">
                  Sponsored
                </span>
                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/90 text-[#1A1D4E]">
                  {BRAND_POST_KIND_LABELS[post.kind]}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight italic">
                {post.title}
              </h1>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#e8edf2]">
              <Link
                to={`/brands/${post.brandId}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-11 h-11 rounded-full bg-[#1A1D4E] text-white flex items-center justify-center text-xs font-black">
                  {post.brandLogo || post.brandName.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">Posted by</p>
                  <p className="text-sm font-bold text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors">
                    {post.brandName}
                  </p>
                </div>
              </Link>

              {post.ctaLabel && post.ctaUrl && (
                <Link
                  to={post.ctaUrl}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest rounded-[5px] transition-colors shrink-0"
                >
                  {post.ctaLabel}
                  <ExternalLink size={12} />
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-[#1A1D4E]">
              {dateLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-[#E8500A]" />
                  {dateLabel}
                </span>
              )}
              {post.location && (
                <span className="inline-flex items-center gap-1.5 text-gray-500">
                  <MapPin size={14} />
                  {post.location}
                </span>
              )}
            </div>

            <p className="text-sm text-[#1A1D4E] font-semibold leading-relaxed">{post.excerpt}</p>

            <div className="space-y-4">
              {post.body.map((paragraph, i) => (
                <p key={i} className="text-[13px] text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="rounded-[5px] bg-[#FFF8F5] border border-[#E8500A]/15 p-4 flex items-start gap-3">
              <Sparkles size={16} className="text-[#E8500A] shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-600 leading-relaxed">
                This is a <strong>sponsored brand awareness post</strong>, not an editorial buying guide.
                Offers and availability are confirmed directly with {post.brandName}.
              </p>
            </div>
          </div>
        </article>

        {linkedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-black uppercase text-[#1A1D4E] mb-4 tracking-tight">
              Related <span className="text-[#E8500A]">Products</span>
            </h2>
            <div className={PRODUCT_CARD_GRID}>
              {linkedProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="grid" isGuideDetail />
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase text-[#1A1D4E] tracking-tight">
                More from <span className="text-[#E8500A]">{post.brandName}</span>
              </h2>
              <Link
                to="/whats-on"
                className="text-[10px] font-black uppercase text-[#E8500A] hover:underline inline-flex items-center gap-1"
              >
                All What&apos;s On <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <BrandPostCard key={related.id} post={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
