import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import type { Creator, MediaItem } from '../../data/creators';
import { cn } from '../../lib/utils';
import { rankCreatorContent } from '../../utils/listingRanking';
import { usePriorityClockMs } from '../../hooks/usePriorityClockMs';
import { useGlobalState } from '../../context/GlobalStateContext';
import { ProductCard } from '../ProductCard';
import { BrandCardDesign } from '../BrandCardDesign';
import { PRODUCT_CARD_GRID, BRAND_CARD_GRID } from '../../lib/pageLayout';
import { UniversalCommerceCard } from '../content';
import { resolveCommerceCardVariant } from '../content/universalCommerceCardTypes';
import { buildCreatorContentModel, type CreatorContentKind } from '../../utils/creatorContentCardModel';

type CreatorOverviewFeedProps = {
  creator: Creator;
  onViewAllContent?: () => void;
  onViewAllReviews?: () => void;
};

const EXPERTISE = [
  { name: 'Smartphones', count: '128', icon: '📱' },
  { name: 'Laptops', count: '96', icon: '💻' },
  { name: 'PC Components', count: '82', icon: '🖥' },
  { name: 'Audio', count: '76', icon: '🎧' },
  { name: 'Cameras', count: '64', icon: '📷' },
  { name: 'Gaming', count: '52', icon: '🎮' },
];

const WHY_FOLLOW = [
  { icon: '🔎', title: 'In-Depth Research', sub: 'Detailed analysis and real world testing' },
  { icon: '♡', title: 'Honest Reviews', sub: 'Unbiased opinions you can trust' },
  { icon: '⚡', title: 'Smart Recommendations', sub: 'Curated picks based on your needs' },
  { icon: '🔄', title: 'Always Updated', sub: 'Latest trends and market insights' },
];

const BRAND_PARTNERS = [
  { name: 'SAMSUNG', color: '#1428A0' },
  { name: 'mi Xiaomi', color: '#FF6900' },
  { name: 'ASUS', color: '#1A1A2E' },
  { name: 'SONY', color: '#000000' },
  { name: 'DELL', color: '#0076CE' },
  { name: 'acer', color: '#16A34A' },
];

const COLLAB_TYPES = [
  'Product Reviews',
  'Brand Stories',
  'Buying Guides',
  'Tech Analysis',
  'Comparisons',
  'Live Sessions',
];

const COMMUNITY = [
  {
    name: 'Tanvir Hossain',
    initial: 'T',
    rating: '★★★★★ 5/5',
    text: "Farhan bhai's reviews are so detailed and honest. Always helps me make the right decision!",
    ref: 'Samsung Galaxy S24 Ultra Review',
  },
  {
    name: 'Nusrat Jahan',
    initial: 'N',
    rating: '★★★★★ 5/5',
    text: 'The most reliable tech reviewer in Bangladesh. His buying guides are gold!',
    ref: 'Best Laptop Guide 2025',
  },
  {
    name: 'Rashed Ahmed',
    initial: 'R',
    rating: '★★★★★ 5/5',
    text: 'Love how he explains everything in simple terms. Super helpful for beginners like me.',
    ref: 'PC Build Guide',
  },
];

type FeaturedEntry = {
  kind: CreatorContentKind;
  item: MediaItem;
};

function rankFeatured(creator: Creator, nowMs: number): FeaturedEntry[] {
  const videos = creator.videos ?? [];
  const reels = creator.reels ?? [];
  const blogs = creator.blogs ?? [];

  const ranked = rankCreatorContent(
    [
      ...blogs.map((b) => ({ ...b, _kind: 'blog' as const })),
      ...videos.map((v) => ({ ...v, _kind: 'video' as const })),
      ...reels.map((r) => ({ ...r, _kind: 'reel' as const })),
    ],
    nowMs,
  );

  return ranked.slice(0, 4).map((src) => ({
    kind: (src as { _kind: CreatorContentKind })._kind,
    item: src,
  }));
}

// items-start: mixed video (16:9) / reel (9:16) / blog (4:3) cards in one row must NOT
// stretch to match the tallest sibling — each card keeps its own natural height.
const CREATOR_FEED_GRID =
  'grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 items-start';

function OverviewCardHeader({ title, accentColor }: { title: string; accentColor?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 border-b border-[#F1F1F3] pb-3">
      <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center shrink-0">
        <CheckCircle2 size={16} fill="currentColor" className="text-[#EB4501] stroke-white" />
      </div>
      <h3
        className="text-[11px] font-extrabold uppercase tracking-wider"
        style={{ color: accentColor || '#1A1A2E' }}
      >
        {title}
      </h3>
    </div>
  );
}

/** Choosify.dc.html Creator Profile — Overview tab feed */
export function CreatorOverviewFeed({
  creator,
  onViewAllContent,
  onViewAllReviews,
}: CreatorOverviewFeedProps) {
  const navigate = useNavigate();
  const nowMs = usePriorityClockMs();
  const { allProducts, allBrands } = useGlobalState();
  const featured = useMemo(() => rankFeatured(creator, nowMs), [creator, nowMs]);
  const firstName = creator.name.split(' ')[0] || creator.name;

  const overviewBlocks = [
    {
      icon: '📄',
      title: 'Background & Bio',
      text:
        creator.bio ||
        `Senior Tech Analyst & Digital Product Researcher with 10+ years of experience analyzing electronic imports, consumer durables, and PC components in the Bangladesh market.`,
    },
    {
      icon: '📁',
      title: 'Areas of Expertise',
      text: (creator.bestForTags?.length
        ? creator.bestForTags
        : ['Smartphones', 'Laptops', 'PC Components', 'Audio']
      ).join(', '),
    },
    {
      icon: '▷',
      title: 'Content Platforms',
      text: (creator.platforms?.length ? creator.platforms : ['YouTube', 'Instagram', 'TikTok']).join(', '),
    },
  ];

  const contactRows = [
    { icon: '✉', label: 'Business Inquiries', value: creator.email || 'creator@choosify.bd' },
    { icon: '⏱', label: 'Response Time', value: creator.responseTime || '24 - 48 hours' },
    { icon: '✉', label: 'Preferred Contact', value: creator.preferredContact || 'Email' },
    { icon: '📍', label: 'Location', value: creator.location || 'Dhaka, Bangladesh' },
  ];

  const brandPartners =
    creator.brandPartners?.length ? creator.brandPartners : BRAND_PARTNERS;
  const collabTypes =
    creator.collabTypes?.length ? creator.collabTypes : COLLAB_TYPES;

  const matchTags = (creator.bestForTags?.length ? creator.bestForTags : [creator.bestFor]).filter(Boolean);
  const recommendedProducts = useMemo(
    () =>
      allProducts
        .filter((p: any) =>
          matchTags.some(
            (tag) =>
              String(p.category || '').toLowerCase().includes(String(tag).toLowerCase()) ||
              String(tag).toLowerCase().includes(String(p.category || '').toLowerCase()),
          ),
        )
        .slice(0, 4),
    [allProducts, creator.id],
  );
  const recommendedBrands = useMemo(
    () =>
      allBrands
        .filter((b: any) =>
          matchTags.some(
            (tag) =>
              String(b.category || '').toLowerCase().includes(String(tag).toLowerCase()) ||
              String(tag).toLowerCase().includes(String(b.category || '').toLowerCase()),
          ),
        )
        .slice(0, 4),
    [allBrands, creator.id],
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Featured Content — same universal content cards as Discover / Brand Story / Product Detail */}
      <section className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
        <div className="flex justify-between items-baseline mb-3.5">
          <h2 className="text-sm font-extrabold text-[#1A1A2E]">Featured Content</h2>
          <button
            type="button"
            onClick={onViewAllContent}
            className="text-[11.5px] font-bold text-[#1A1A2E] hover:text-[#CF4400] bg-transparent border-0 cursor-pointer"
          >
            VIEW ALL CONTENT →
          </button>
        </div>
        <div className={CREATOR_FEED_GRID}>
          {featured.map((entry) => {
            const model = buildCreatorContentModel(entry.kind, entry.item, creator);
            const variant = resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio);
            return (
              <UniversalCommerceCard
                key={model.id}
                mode="commerce"
                variant={variant}
                model={model}
                onNavigate={() => navigate(model.href)}
                className="w-full h-auto"
              />
            );
          })}
        </div>
      </section>

      {/* Expertise + Latest Reviews */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
          <h3 className="text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">Expertise & Topics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EXPERTISE.map((ex) => (
              <div key={ex.name} className="flex items-center gap-2">
                <div className="w-[30px] h-[30px] rounded-lg bg-[#F4F7F9] flex items-center justify-center text-[13px] shrink-0">
                  {ex.icon}
                </div>
                <div>
                  <div className="text-[11.5px] font-bold text-[#1A1A2E]">{ex.name}</div>
                  <div className="text-[10px] text-[#9AA0AC]">{ex.count} Guides</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
          <div className="flex justify-between items-baseline mb-3.5">
            <h3 className="text-[13px] font-extrabold text-[#1A1A2E]">Latest Reviews</h3>
            <button
              type="button"
              onClick={onViewAllReviews}
              className="text-[11px] font-bold text-[#1A1A2E] hover:text-[#CF4400] bg-transparent border-0 cursor-pointer"
            >
              VIEW ALL REVIEWS →
            </button>
          </div>
          {[
            { name: 'Samsung Galaxy S24 Ultra', date: 'May 5, 2025', rating: '4.9', rank: 1, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop' },
            { name: 'Sony WH-1000XM5 Headphones', date: 'Apr 28, 2025', rating: '4.8', rank: 2, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop' },
            { name: 'Dell XPS 15 (2024)', date: 'Apr 20, 2025', rating: '4.7', rank: 3, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop' },
          ].map((lr, i, arr) => (
            <div
              key={lr.name}
              className={cn('flex items-center gap-2.5 py-2.5', i < arr.length - 1 && 'border-b border-[#F1F1F3]')}
            >
              <div className="text-[11px] font-bold text-[#9AA0AC] w-3.5">{lr.rank}</div>
              <div className="w-[34px] h-[34px] rounded-md overflow-hidden shrink-0 bg-[#F4F7F9]">
                {lr.image ? <img src={lr.image} alt="" className="w-full h-full object-cover" /> : null}
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

      {/* Why Follow */}
      <section className="choosify-dark-surface rounded-xl px-[30px] py-[26px] text-white overflow-hidden">
        <h3 className="text-sm font-extrabold mb-[18px]">Why Follow {firstName}?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_FOLLOW.map((wf) => (
            <div key={wf.title} className="flex gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[13px] shrink-0">
                {wf.icon}
              </div>
              <div>
                <div className="text-xs font-bold mb-0.5">{wf.title}</div>
                <div className="text-[10.5px] text-white/50 leading-snug">{wf.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Creator Overview + Contact & Reach — side by side, styled like Brand/Product Overview cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
          <OverviewCardHeader title="Creator Overview" />
          {overviewBlocks.map((ob) => (
            <div key={ob.title} className="mb-3.5 last:mb-0">
              <div className="text-[11.5px] font-bold text-[#1A1A2E] flex items-center gap-1.5 mb-1">
                {ob.icon} {ob.title}
              </div>
              <p className="text-[11px] text-[#4B5563] leading-relaxed m-0">{ob.text}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
          <OverviewCardHeader title="Contact & Reach" />
          {contactRows.map((cr) => (
            <div key={cr.label} className="flex items-start gap-2 mb-3 last:mb-0">
              <div className="text-xs shrink-0">{cr.icon}</div>
              <div>
                <div className="text-[11px] font-bold text-[#1A1A2E]">{cr.label}</div>
                <div className="text-[11px] text-[#4B5563]">{cr.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnerships & Collaborations — own wider section below */}
      <section className="bg-white border border-[#E8EDF2] rounded-[10px] p-6">
        <OverviewCardHeader title="Partnerships & Collaborations" />
        <div className="text-[10px] font-bold text-[#9AA0AC] mb-2">TOP BRAND PARTNERS</div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-5">
          {brandPartners.map((bp) => (
            <div
              key={bp.name}
              className="border border-[#E5E7EB] rounded-md p-3 text-center text-[11px] font-extrabold"
              style={{ color: bp.color }}
            >
              {bp.name}
            </div>
          ))}
        </div>
        <div className="text-[10px] font-bold text-[#9AA0AC] mb-2">COLLABORATION TYPES</div>
        <div className="flex flex-wrap gap-2">
          {collabTypes.map((ct) => (
            <span
              key={ct}
              className="bg-[#F4F7F9] text-[10.5px] font-semibold text-[#4B5563] px-3 py-1.5 rounded-full"
            >
              {ct}
            </span>
          ))}
        </div>
      </section>

      {/* Community Says */}
      <section>
        <div className="flex justify-between items-baseline mb-3.5">
          <h2 className="text-sm font-extrabold text-[#1A1A2E]">What The Community Says</h2>
          <button
            type="button"
            onClick={onViewAllReviews}
            className="text-[11.5px] font-bold text-[#1A1A2E] hover:text-[#CF4400] bg-transparent border-0 cursor-pointer"
          >
            VIEW ALL REVIEWS →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {COMMUNITY.map((cs) => (
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

      {/* Recommendation From This Creator — products row, then brands row, both universal cards */}
      {(recommendedProducts.length > 0 || recommendedBrands.length > 0) && (
        <section>
          <div className="mb-3.5">
            <h2 className="text-sm font-extrabold text-[#1A1A2E]">Recommendation From This Creator</h2>
            <p className="text-[11px] text-[#9AA0AC] mt-0.5">
              Products and brands {firstName} recommends
            </p>
          </div>
          {recommendedProducts.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[11px] font-extrabold text-[#9AA0AC] uppercase tracking-wide mb-2.5">
                Products
              </h3>
              <div className={PRODUCT_CARD_GRID}>
                {recommendedProducts.map((p: any) => (
                  <ProductCard key={p.id} product={p} variant="grid" />
                ))}
              </div>
            </div>
          )}
          {recommendedBrands.length > 0 && (
            <div>
              <h3 className="text-[11px] font-extrabold text-[#9AA0AC] uppercase tracking-wide mb-2.5">
                Brands
              </h3>
              <div className={BRAND_CARD_GRID}>
                {recommendedBrands.map((b: any) => (
                  <BrandCardDesign key={b.id} brand={b} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
