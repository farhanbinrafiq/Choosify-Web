import React, { useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { HeroScrollCue, HERO_SCROLL_CUE_PADDING } from '../components/HeroScrollCue';
import { PRODUCT_CARD_GRID, WHATS_ON_CARD_GRID } from '../lib/pageLayout';
import { ProductCard } from '../components/ProductCard';
import { BrandPostCard } from '../components/BrandPostCard';
import { BrandPostBannerGallery } from '../components/BrandPostBannerGallery';
import { useRegisterPageFilters } from '../components/FilterEngine';
import {
  formatBrandPostDateRange,
  getBrandPostBannerImages,
  getBrandPostBySlug,
  getBrandPostsByBrandId,
} from '../lib/brandPosts';
import { BRAND_POST_KIND_LABELS } from '../types/brandPost';
import { PRODUCTS } from '../constants';

export function BrandPostDetailPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBrandPostBySlug(slug) : undefined;

  const bannerImages = useMemo(
    () => (post ? getBrandPostBannerImages(post) : []),
    [post],
  );

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
  const statusLabel =
    post.status === 'live' ? 'Live Now' : post.status === 'scheduled' ? 'Upcoming' : 'Ended';

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Hero — matches Guide Detail layout */}
      <section
        ref={heroRef}
        className={cn(
          'relative w-full choosify-dark-gradient border-b border-white/5',
          HERO_SCROLL_CUE_PADDING,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,0,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,4,53,0.4),transparent_55%)]" />

        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#E8500A] text-white">
                Sponsored
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/90 text-[#1A1D4E]">
                {BRAND_POST_KIND_LABELS[post.kind]}
              </span>
              {dateLabel && (
                <div className="flex items-center gap-2 text-[10px] font-black text-white/80 uppercase tracking-widest italic bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <CalendarDays size={14} className="text-orange-primary" />
                  {dateLabel}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] font-black text-orange-primary uppercase tracking-widest italic bg-orange-primary/10 px-4 py-2 rounded-full border border-orange-primary/20">
                <Sparkles size={14} className="text-orange-primary" />
                {statusLabel}
              </div>
            </div>
          </div>

          <BrandPostBannerGallery images={bannerImages} alt={post.title} />

          <div className="max-w-[1080px] mx-auto px-6 pb-8 text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight mb-4 font-sans drop-shadow-xl">
              {post.title}
            </h1>

            <p className="text-white/85 text-sm md:text-base font-medium italic uppercase tracking-wider leading-relaxed mb-6 max-w-4xl font-sans">
              {post.excerpt}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/[0.04] rounded-[5px] p-6 border border-white/10 shadow-lg mb-6">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                  Brand Partner
                </span>
                <span className="text-sm font-black text-white uppercase italic tracking-tighter truncate">
                  {post.brandName}
                </span>
              </div>
              <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                  Event Type
                </span>
                <span className="text-sm font-black text-[#F97316] uppercase italic tracking-tighter">
                  {BRAND_POST_KIND_LABELS[post.kind]}
                </span>
              </div>
              <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                  Location
                </span>
                <span className="text-sm font-black text-white uppercase italic tracking-tighter truncate">
                  {post.location || 'Multiple venues'}
                </span>
              </div>
              <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                  Availability
                </span>
                <span className="text-sm font-black text-white uppercase italic tracking-tighter">
                  {statusLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {post.ctaLabel && post.ctaUrl && (
                <Link
                  to={post.ctaUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic border-none cursor-pointer shadow-lg"
                >
                  {post.ctaLabel}
                  <ExternalLink size={14} />
                </Link>
              )}
              <button
                type="button"
                onClick={() => toast.success("Event saved to your dashboard!")}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/15 border border-white/15 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic cursor-pointer shadow-lg"
              >
                <Bookmark size={14} className="text-[#F97316]" />
                Save Event
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Share link copied to clipboard!');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/15 border border-white/15 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic cursor-pointer shadow-lg"
              >
                <Share2 size={14} />
                Share Event
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#000435]/60 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1 font-mono">
                  POSTED BY
                </span>
                <span className="text-sm font-black text-white uppercase italic truncate">
                  {post.brandName}
                </span>
              </div>
              <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1 font-mono">
                  LINKED PRODUCTS
                </span>
                <span className="text-sm font-black text-[#E8500A] uppercase italic">
                  {linkedProducts.length || 0} items
                </span>
              </div>
              <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1 font-mono">
                  BANNERS
                </span>
                <span className="text-sm font-black text-blue-300 uppercase italic">
                  {bannerImages.length} visual{bannerImages.length === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1 font-mono">
                  PUBLISHED
                </span>
                <span className="text-sm font-black text-white uppercase italic">
                  {post.publishedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
        <HeroScrollCue anchorRef={heroRef} />
      </section>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#E8500A] mb-6"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <article className="bg-white rounded-[5px] border border-[#e8edf2] shadow-sm overflow-hidden">
          <div className="p-5 sm:p-8 space-y-6 text-left">
            <Link
              to={`/brands/${post.brandId}`}
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-full bg-[#1A1D4E] text-white flex items-center justify-center text-xs font-black">
                {post.brandLogo || post.brandName.slice(0, 2)}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">Verified brand partner</p>
                <p className="text-sm font-bold text-[#1A1D4E] group-hover:text-[#E8500A] transition-colors">
                  {post.brandName}
                </p>
              </div>
            </Link>

            {post.location && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                <MapPin size={14} />
                {post.location}
              </div>
            )}

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
            <div className={WHATS_ON_CARD_GRID}>
              {relatedPosts.map((related) => (
                <BrandPostCard key={related.id} post={related} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
