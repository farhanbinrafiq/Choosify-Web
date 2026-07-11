import React, { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  ShoppingBag,
  Heart,
  Scale,
  Star,
  User,
  ChevronRight,
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { CREATORS } from '../data/creators';
import { mockGuides } from '../data/mockGuides';
import { ProductCard } from '../components/ProductCard';
import { PRODUCT_CARD_GRID } from '../lib/pageLayout';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { cn } from '../lib/utils';

function WorkspacePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[5px] border border-[#e8edf2] shadow-sm min-h-[280px]">
      <h3 className="text-lg font-black uppercase text-navy italic tracking-tight mb-2">{title}</h3>
      <p className="text-[11px] text-gray-500 max-w-md leading-relaxed">{description}</p>
    </div>
  );
}

export function ReviewDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();

  const review = useMemo(() => {
    const guides = (allCatalogGuides.length ? allCatalogGuides : mockGuides) as any[];
    const byGuide = guides.find((g) => String(g.slug || g.id) === slug || String(g.id) === slug);
    if (byGuide) {
      return {
        kind: 'guide' as const,
        title: byGuide.title,
        excerpt: byGuide.excerpt,
        author: byGuide.author,
        creatorId: byGuide.creatorId as string | undefined,
        productIds: (byGuide.productIds ?? []) as string[],
        thumbnail: byGuide.thumbnail ?? byGuide.image,
        videoUrl: byGuide.videoUrl as string | undefined,
      };
    }

    const creatorMatch = slug.startsWith('creator-') ? slug.replace('creator-', '') : null;
    const creatorId = creatorMatch ?? slug;
    const creators = allCreators.length ? allCreators : CREATORS;
    const creator = creators.find((c) => String(c.id) === creatorId);
    if (creator) {
      const latest = creator.videos?.[0] ?? creator.reels?.[0];
      return {
        kind: 'creator' as const,
        title: latest?.title ?? `${creator.name} — Creator Review`,
        excerpt: creator.bio,
        author: creator.name,
        creatorId: creator.id,
        productIds: [] as string[],
        thumbnail: latest?.thumbnail ?? creator.avatar,
        videoUrl: latest?.url,
      };
    }

    return null;
  }, [slug, allCatalogGuides, allCreators]);

  const linkedProducts = useMemo(() => {
    if (!review?.productIds.length) return allCatalogProducts.slice(0, 4);
    return review.productIds
      .map((id) => allCatalogProducts.find((p) => String(p.id) === String(id)))
      .filter(Boolean) as typeof allCatalogProducts;
  }, [review, allCatalogProducts, allCatalogProducts.length]);

  const relatedReviews = useMemo(() => {
    const guides = (allCatalogGuides.length ? allCatalogGuides : mockGuides) as any[];
    return guides.filter((g) => String(g.slug || g.id) !== slug).slice(0, 3);
  }, [allCatalogGuides, slug]);

  if (!review) {
    return (
      <div className="min-h-screen bg-choosify-feed flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-xl font-black text-navy uppercase italic mb-2">Review Not Found</h1>
        <p className="text-sm text-gray-500 mb-6">This review may have moved or is no longer available.</p>
        <Link to="/guides" className="text-[#E8500A] text-xs font-bold uppercase tracking-widest hover:underline">
          Back to Discover & Learn
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-choosify-feed">
      <PageHeroBanner pageKey="guides" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#E8500A] mb-6 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <header className="bg-white rounded-[5px] border border-[#e8edf2] p-6 md:p-8 shadow-sm text-left mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#E8500A] mb-2">Review Details</p>
          <h1 className="text-2xl md:text-3xl font-black text-navy italic uppercase tracking-tight leading-tight mb-3">
            {review.title}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{review.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span className="inline-flex items-center gap-1"><Star size={12} className="text-[#E8500A]" /> Verified review</span>
            {review.creatorId && (
              <Link to={`/creators/${review.creatorId}`} className="inline-flex items-center gap-1 text-[#E8500A] hover:underline">
                <User size={12} /> {review.author}
              </Link>
            )}
          </div>
        </header>

        {review.thumbnail && (
          <div className="relative aspect-video rounded-[5px] overflow-hidden border border-[#e8edf2] bg-black mb-6 group">
            <img src={review.thumbnail} alt={review.title} className="w-full h-full object-cover opacity-90" />
            {review.videoUrl && (
              <a
                href={review.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
              >
                <span className="w-14 h-14 rounded-full bg-[#E8500A] text-white flex items-center justify-center shadow-lg">
                  <Play size={24} fill="currentColor" />
                </span>
              </a>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          <Link to="/compare" className={cn('inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#e8edf2] bg-white hover:border-[#E8500A]/30')}>
            <Scale size={12} /> Compare
          </Link>
          <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#e8edf2] bg-white hover:border-[#E8500A]/30 cursor-pointer">
            <Heart size={12} /> Wishlist
          </button>
          {linkedProducts[0] && (
            <Link to={`/products/${linkedProducts[0].id}#buy`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E8500A] text-white hover:bg-[#CF4400]">
              <ShoppingBag size={12} /> Buy Now
            </Link>
          )}
        </div>

        {linkedProducts.length > 0 && (
          <section className="mb-10 text-left">
            <div className="flex items-end justify-between mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-base font-semibold text-[#1a1a2e]">Featured <span className="text-[#E8500A]">Products</span></h2>
              <Link to={`/guides/${slug}/products`} className="text-[10px] font-bold uppercase text-[#E8500A] hover:underline inline-flex items-center gap-1">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className={PRODUCT_CARD_GRID}>
              {linkedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} variant="grid" />
              ))}
            </div>
          </section>
        )}

        {review.creatorId && (
          <section className="mb-10 bg-white rounded-[5px] border border-[#e8edf2] p-6 text-left">
            <h2 className="text-sm font-black uppercase text-navy mb-2 flex items-center gap-2">
              <User size={16} className="text-[#E8500A]" /> About the Creator
            </h2>
            <p className="text-xs text-gray-500 mb-4">Creator profile is secondary — explore the full profile when you want more context.</p>
            <Link to={`/creators/${review.creatorId}`} className="text-[10px] font-black uppercase tracking-widest text-[#E8500A] hover:underline inline-flex items-center gap-1">
              View Creator Profile <ChevronRight size={12} />
            </Link>
          </section>
        )}

        {relatedReviews.length > 0 && (
          <section className="text-left">
            <h2 className="text-base font-semibold text-[#1a1a2e] mb-4">Related <span className="text-[#E8500A]">Reviews</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedReviews.map((g: any) => (
                <Link
                  key={g.id}
                  to={`/reviews/${g.slug || g.id}`}
                  className="block p-4 bg-white border border-[#e8edf2] rounded-[5px] hover:border-[#E8500A]/30 transition-colors"
                >
                  <p className="text-[11px] font-bold text-navy line-clamp-2">{g.title}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{g.author}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export function SellerWorkspaceSection({ tab }: { tab: string }) {
  const copy: Record<string, { title: string; description: string }> = {
    'seller-products': {
      title: 'My Products',
      description: 'Manage your product catalog, inventory, and listings. Full seller product tools arrive in a future release.',
    },
    'seller-orders': {
      title: 'Seller Orders',
      description: 'Track and fulfill orders for your storefront. Order management connects to the commerce backend.',
    },
    'spotlight-requests': {
      title: 'Spotlight Requests',
      description: 'Submit a request for marketing to publish a Spotlight campaign. Sellers do not access the global Campaign Manager — marketing publishes approved campaigns.',
    },
    'seller-performance': {
      title: 'Performance',
      description: 'View sales and Spotlight performance metrics for your products once Phase 5.2 Intelligence Dashboard ships.',
    },
    'creator-studio': {
      title: 'Creator Studio',
      description: 'Create and manage creator content, collaborations, and Spotlight contributions.',
    },
    'creator-collaborations': {
      title: 'Collaborations',
      description: 'Review brand invitations and active collaboration campaigns.',
    },
    'creator-spotlight': {
      title: 'Creator Spotlight',
      description: 'See how your content appears across Spotlight surfaces and track engagement.',
    },
    'mod-queues': {
      title: 'Moderation Queues',
      description: 'Review reported content, campaigns pending approval, and trust signals.',
    },
    'mod-approvals': {
      title: 'Approvals',
      description: 'Approve or reject Spotlight campaigns, creator submissions, and flagged content.',
    },
  };
  const item = copy[tab] ?? { title: 'Workspace', description: 'Role-specific workspace.' };
  return <WorkspacePlaceholder title={item.title} description={item.description} />;
}
