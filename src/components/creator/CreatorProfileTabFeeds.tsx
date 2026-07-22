import React, { useMemo } from 'react';
import type { Creator, MediaItem } from '../../data/creators';
import { spotlightContentHref } from '../../lib/spotlight/content';
import { CreatorContentCard, CREATOR_FEED_GRID } from './CreatorContentCard';
import { cn } from '../../lib/utils';
import { rankCreatorContent, rankProducts } from '../../utils/listingRanking';
import { usePriorityClockMs } from '../../hooks/usePriorityClockMs';

type CreatorVideosTabProps = {
  videos: MediaItem[];
  reels: MediaItem[];
  onOpenVideo: (url: string, title: string, isShort: boolean) => void;
};

export function CreatorVideosTab({ videos, reels, onOpenVideo }: CreatorVideosTabProps) {
  const nowMs = usePriorityClockMs();
  const items = useMemo(() => {
    const rankedVideos = rankCreatorContent(videos, nowMs);
    const rankedReels = rankCreatorContent(reels, nowMs);
    return [
      ...rankedVideos.map((v) => ({
        key: `v-${v.id}`,
        title: v.title,
        tag: v.isLive ? 'LIVE' : v.pinned ? 'PINNED' : v.associatedGuideId ? 'FULL GUIDE' : 'VIDEO',
        tagBg: v.isLive ? '#FF000D' : v.associatedGuideId ? '#EB4501' : '#3B82F6',
        meta: [v.views, v.duration].filter(Boolean).join(' · ') || 'Video',
        image: v.thumbnail,
        showPlay: true as boolean,
        href: v.associatedGuideId ? spotlightContentHref(String(v.associatedGuideId)) : undefined,
        onClick: v.associatedGuideId ? undefined : () => onOpenVideo(v.url, v.title, false),
      })),
      ...rankedReels.map((r) => ({
        key: `r-${r.id}`,
        title: r.title,
        tag: r.isLive ? 'LIVE' : r.pinned ? 'PINNED' : 'REEL',
        tagBg: r.isLive ? '#FF000D' : '#16A34A',
        meta: [r.views, r.likes ? `♥ ${r.likes}` : ''].filter(Boolean).join(' · ') || 'Short',
        image: r.thumbnail,
        showPlay: true as boolean,
        href: r.associatedGuideId ? spotlightContentHref(String(r.associatedGuideId)) : undefined,
        onClick: r.associatedGuideId ? undefined : () => onOpenVideo(r.url, r.title, true),
      })),
    ];
  }, [videos, reels, nowMs, onOpenVideo]);

  if (!items.length) {
    return <EmptyState message="No videos or reels yet." />;
  }

  return (
    <section className="text-left">
      <SectionHead title="Videos & Reels" count={items.length} />
      <div className={CREATOR_FEED_GRID}>
        {items.map((item) => (
          <CreatorContentCard
            key={item.key}
            title={item.title}
            tag={item.tag}
            tagBg={item.tagBg}
            meta={item.meta}
            image={item.image}
            showPlay={item.showPlay}
            href={item.href}
            onClick={item.onClick}
          />
        ))}
      </div>
    </section>
  );
}

type CreatorGuidesTabProps = {
  blogs: MediaItem[];
};

export function CreatorGuidesTab({ blogs }: CreatorGuidesTabProps) {
  const nowMs = usePriorityClockMs();
  const rankedBlogs = useMemo(() => rankCreatorContent(blogs, nowMs), [blogs, nowMs]);

  if (!rankedBlogs.length) {
    return <EmptyState message="No guides published yet." />;
  }

  return (
    <section className="text-left">
      <SectionHead title="Guides & Articles" count={rankedBlogs.length} />
      <div className={CREATOR_FEED_GRID}>
        {rankedBlogs.map((blog, i) => {
          const isGuide = !!blog.associatedGuideId;
          const tag = blog.isLive
            ? 'LIVE'
            : blog.pinned
              ? 'PINNED'
              : isGuide
                ? 'BUYING GUIDE'
                : i % 2 === 0
                  ? 'BRAND STORY'
                  : 'ARTICLE';
          const tagBg = blog.isLive
            ? '#FF000D'
            : isGuide
              ? '#2323FF'
              : i % 2 === 0
                ? '#EB4501'
                : '#6B7280';
          const href = isGuide
            ? spotlightContentHref(String(blog.associatedGuideId))
            : undefined;
          const external = !isGuide && blog.url && blog.url !== '#' ? blog.url : undefined;

          const card = (
            <CreatorContentCard
              title={blog.title}
              tag={tag}
              tagBg={tagBg}
              meta={[blog.readTime, blog.date].filter(Boolean).join(' · ') || 'Guide'}
              image={blog.thumbnail}
              showPlay={false}
              href={href}
            />
          );

          if (external) {
            return (
              <a
                key={blog.id}
                href={external}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline"
              >
                <CreatorContentCard
                  title={blog.title}
                  tag={tag}
                  tagBg={tagBg}
                  meta={[blog.readTime, blog.date].filter(Boolean).join(' · ') || 'Guide'}
                  image={blog.thumbnail}
                />
              </a>
            );
          }

          return <React.Fragment key={blog.id}>{card}</React.Fragment>;
        })}
      </div>
    </section>
  );
}

type CommunityReview = {
  name: string;
  initial: string;
  rating: string;
  text: string;
  ref: string;
};

type LatestProductReview = {
  id?: string | number;
  name: string;
  date: string;
  rating: string;
  rank: number;
  image?: string;
  stock?: number;
  featuredFlag?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
};

type CreatorReviewsTabProps = {
  community: CommunityReview[];
  latestProducts: LatestProductReview[];
};

export function CreatorReviewsTab({ community, latestProducts }: CreatorReviewsTabProps) {
  const nowMs = usePriorityClockMs();
  const rankedProducts = useMemo(() => {
    // Reuse Products list ranking (trending / in-stock / new / price-drop)
    const scored = rankProducts(
      latestProducts.map((p, idx) => ({
        id: p.id ?? p.name ?? idx,
        createdAt: p.createdAt,
        stock: p.stock,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        featuredFlag: p.featuredFlag,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
      })),
      { nowMs },
    );
    const byId = new Map(latestProducts.map((p, idx) => [String(p.id ?? p.name ?? idx), p]));
    return scored.map((p, i) => {
      const original = byId.get(String(p.id)) ?? latestProducts[i];
      return { ...original, rank: i + 1 };
    });
  }, [latestProducts, nowMs]);

  return (
    <div className="flex flex-col gap-8 text-left">
      <section>
        <SectionHead title="Latest Product Reviews" />
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
          {rankedProducts.map((lr, i) => (
            <div
              key={lr.name}
              className={cn(
                'flex items-center gap-2.5 py-2.5',
                i < rankedProducts.length - 1 && 'border-b border-[#F1F1F3]',
              )}
            >
              <div className="text-[11px] font-bold text-[#9AA0AC] w-3.5">{lr.rank}</div>
              <div className="w-[34px] h-[34px] rounded-md overflow-hidden shrink-0 bg-[#F4F7F9]">
                {lr.image ? (
                  <img src={lr.image} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-bold text-[#1A1A2E] truncate">{lr.name}</div>
                <div className="text-[10px] text-[#9AA0AC]">{lr.date}</div>
              </div>
              <div className="text-[11px] font-bold text-[#1A1A2E]">★ {lr.rating}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="What The Community Says" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {community.map((cs) => (
            <div key={cs.name} className="bg-white border border-[#E8EDF2] rounded-[10px] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EB4501] text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">
                    {cs.initial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1A2E] mb-px">{cs.name}</div>
                    <div className="flex items-center gap-0.5 text-[10px] text-[#2323FF] font-bold">
                      <svg width="10" height="10" viewBox="0 0 20 20" fill="#2323FF" aria-hidden>
                        <circle cx="10" cy="10" r="9" />
                        <path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" />
                      </svg>
                      Verified Buyer
                    </div>
                  </div>
                </div>
                <div className="text-[#FBBF24] text-[11px] font-bold shrink-0">{cs.rating}</div>
              </div>
              <p className="text-[11.5px] text-[#374151] leading-relaxed m-0 mb-2">{cs.text}</p>
              <div className="text-[10px] text-[#9AA0AC] pt-2 border-t border-[#F1F1F3]">{cs.ref}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHead({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-baseline justify-between mb-3.5">
      <h2 className="text-sm font-extrabold text-[#1A1A2E] m-0">{title}</h2>
      {typeof count === 'number' ? (
        <span className="text-[11.5px] font-bold text-[#9AA0AC]">{count} items</span>
      ) : null}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-[13px] text-[#4B5563] font-semibold border border-dashed border-[#E8EDF2] rounded-[10px] bg-white">
      {message}
    </div>
  );
}

/** Demo community + product reviews (DC creator profile) */
export function getCreatorReviewDemo(creator: Creator) {
  const first = creator.name.split(' ')[0] || 'Creator';
  return {
    community: [
      {
        name: 'Tanvir Hossain',
        initial: 'T',
        rating: '★★★★★ 5/5',
        text: `${first}'s reviews are so detailed and honest. Always helps me make the right decision!`,
        ref: 'Samsung Galaxy S24 Ultra Review',
      },
      {
        name: 'Nusrat Jahan',
        initial: 'N',
        rating: '★★★★★ 5/5',
        text: 'The most reliable reviewer in Bangladesh. Buying guides are gold!',
        ref: 'Best Laptop Guide 2025',
      },
      {
        name: 'Rashed Ahmed',
        initial: 'R',
        rating: '★★★★★ 5/5',
        text: 'Explains everything in simple terms. Super helpful for beginners like me.',
        ref: 'PC Build Guide',
      },
    ],
    latestProducts: [
      {
        id: 'demo-s24',
        name: 'Samsung Galaxy S24 Ultra',
        date: 'May 5, 2025',
        rating: '4.9',
        rank: 1,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop',
        isBestseller: true,
        stock: 40,
        createdAt: '2025-05-05T00:00:00.000Z',
      },
      {
        id: 'demo-sony',
        name: 'Sony WH-1000XM5 Headphones',
        date: 'Apr 28, 2025',
        rating: '4.8',
        rank: 2,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop',
        stock: 3,
        originalPrice: 45000,
        price: 38000,
        discountPercent: 15,
        createdAt: '2025-04-28T00:00:00.000Z',
      },
      {
        id: 'demo-dell',
        name: 'Dell XPS 15 (2024)',
        date: 'Apr 20, 2025',
        rating: '4.7',
        rank: 3,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop',
        stock: 0,
        createdAt: '2025-04-20T00:00:00.000Z',
      },
    ],
  };
}
