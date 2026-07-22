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
import { catalogGuideHref } from '../lib/spotlight/content';
import { usePageBreadcrumbs } from '../context/BreadcrumbContext';

function WorkspacePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#E8EDF2] shadow-sm min-h-[280px]">
      <h3 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight mb-2">{title}</h3>
      <p className="text-[12.5px] text-[#9AA0AC] max-w-md leading-relaxed">{description}</p>
    </div>
  );
}

export function ReviewDetailPage() {
  usePageBreadcrumbs({ hidden: true });
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
        <h1 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">Review not found</h1>
        <p className="text-sm text-[#9AA0AC] mb-6">This review may have moved or is no longer available.</p>
        <Link to="/guides" className="text-[#EB4501] text-[12.5px] font-bold hover:underline">
          Back to buying guides
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-choosify-feed">
      <div className="w-full px-5 sm:px-10 pt-4">
        <div className="max-w-5xl mx-auto choosify-dark-surface text-white px-5 sm:px-10 py-7 rounded-none overflow-hidden">
          <nav className="text-xs text-white/45 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white/80">Home</Link>
            <span className="mx-1.5">›</span>
            <Link to="/guides" className="hover:text-white/80">Guides</Link>
            <span className="mx-1.5">›</span>
            <span className="text-[#EB4501]">Review</span>
          </nav>
          <div className="text-[11px] font-bold text-[#EB4501] tracking-wide mb-1.5">REVIEW DETAILS</div>
          <h1 className="text-2xl md:text-[28px] font-extrabold tracking-tight leading-tight max-w-3xl">
            {review.title}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-8 -mt-4 relative z-[1]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#9AA0AC] hover:text-[#CF4400] mb-5 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <header className="bg-white rounded-xl border border-[#E8EDF2] p-6 md:p-8 shadow-sm text-left mb-6">
          <p className="text-[12.5px] text-[#4B5563] leading-relaxed mb-4">{review.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3 text-[11.5px] font-semibold text-[#9AA0AC]">
            <span className="inline-flex items-center gap-1"><Star size={12} className="text-[#EB4501]" /> Verified review</span>
            {review.creatorId && (
              <Link to={`/creators/${review.creatorId}`} className="inline-flex items-center gap-1 text-[#EB4501] hover:underline">
                <User size={12} /> {review.author}
              </Link>
            )}
            {!review.creatorId && review.author && (
              <span className="inline-flex items-center gap-1"><User size={12} /> {review.author}</span>
            )}
          </div>
        </header>

        {(review.thumbnail || review.videoUrl) && (
          <div className="bg-[#000435] rounded-xl overflow-hidden mb-6 aspect-video relative">
            {review.thumbnail ? (
              <img src={review.thumbnail} alt="" className="w-full h-full object-cover opacity-90" />
            ) : null}
            {review.videoUrl && (
              <a
                href={review.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors"
              >
                <span className="w-14 h-14 rounded-full bg-[#EB4501] text-white flex items-center justify-center shadow-lg">
                  <Play size={22} fill="currentColor" />
                </span>
              </a>
            )}
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">Linked products</h2>
          <p className="text-[12.5px] text-[#9AA0AC] mb-4">Shop items featured in this review</p>
          {linkedProducts.length > 0 ? (
            <div className={PRODUCT_CARD_GRID}>
              {linkedProducts.map((p) => (
                <ProductCard key={String(p.id)} product={p as any} />
              ))}
            </div>
          ) : (
            <WorkspacePlaceholder
              title="No linked products"
              description="Products for this review will appear here when available."
            />
          )}
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight">Related reviews</h2>
            <Link to="/guides" className="text-[12.5px] font-bold text-[#EB4501] inline-flex items-center gap-1 hover:underline">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedReviews.map((g: any) => (
              <Link
                key={String(g.id || g.slug)}
                to={catalogGuideHref(g)}
                className="bg-white border border-[#E8EDF2] rounded-xl overflow-hidden hover:border-[#EB4501]/40 transition-colors"
              >
                <div className="aspect-[16/10] bg-[#F4F7F9]">
                  {(g.thumbnail || g.image) && (
                    <img src={g.thumbnail || g.image} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-[13px] font-bold text-[#1A1A2E] line-clamp-2">{g.title}</p>
                  <p className="text-[11px] text-[#9AA0AC] mt-1">{g.author || 'Choosify Guides'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 bg-[#EB4501] text-white px-4 py-2.5 rounded-lg text-xs font-bold"
          >
            <ShoppingBag size={14} /> Browse Products & Services
          </Link>
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 choosify-emi-gradient text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:brightness-110 transition-all"
          >
            <Scale size={14} /> Compare
          </Link>
          <Link
            to="/dashboard?tab=saved-items"
            className="inline-flex items-center gap-1.5 bg-white border border-[#E8EDF2] text-[#1A1A2E] px-4 py-2.5 rounded-lg text-xs font-bold"
          >
            <Heart size={14} /> Wishlist
          </Link>
        </div>
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
