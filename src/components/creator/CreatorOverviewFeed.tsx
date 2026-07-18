import React from 'react';
import type { Creator } from '../../data/creators';
import { spotlightContentHref } from '../../lib/spotlight/content';
import { cn } from '../../lib/utils';
import { CreatorContentCard, CREATOR_FEED_GRID } from './CreatorContentCard';

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

type FeaturedItem = {
  id: string;
  title: string;
  tag: string;
  tagBg: string;
  meta: string;
  showPlay: boolean;
  image?: string;
  href?: string;
};

function buildFeatured(creator: Creator): FeaturedItem[] {
  const items: FeaturedItem[] = [];
  const videos = creator.videos ?? [];
  const reels = creator.reels ?? [];
  const blogs = creator.blogs ?? [];

  if (blogs[0]) {
    items.push({
      id: `blog-${blogs[0].id}`,
      title: blogs[0].title,
      tag: 'BUYING GUIDE',
      tagBg: '#2323FF',
      meta: blogs[0].readTime || '12 min read',
      showPlay: false,
      image: blogs[0].thumbnail,
      href: spotlightContentHref(String(blogs[0].associatedGuideId || blogs[0].id)),
    });
  }
  if (videos[0]) {
    items.push({
      id: `vid-${videos[0].id}`,
      title: videos[0].title,
      tag: 'CREATOR REVIEW',
      tagBg: '#3B82F6',
      meta: videos[0].views ? `${videos[0].views}` : 'Video review',
      showPlay: true,
      image: videos[0].thumbnail,
      href: spotlightContentHref(String(videos[0].associatedGuideId || videos[0].id)),
    });
  }
  if (reels[0]) {
    items.push({
      id: `reel-${reels[0].id}`,
      title: reels[0].title,
      tag: 'COLLECTION',
      tagBg: '#16A34A',
      meta: 'Short · Featured',
      showPlay: true,
      image: reels[0].thumbnail,
      href: spotlightContentHref(String(reels[0].associatedGuideId || reels[0].id)),
    });
  }
  if (blogs[1] || videos[1]) {
    const b = blogs[1];
    const v = videos[1];
    const src = b || v;
    if (src) {
      items.push({
        id: `extra-${src.id}`,
        title: src.title,
        tag: 'BRAND STORY',
        tagBg: '#EB4501',
        meta: src.readTime || src.views || 'Featured',
        showPlay: !b,
        image: src.thumbnail,
        href: spotlightContentHref(String(src.associatedGuideId || src.id)),
      });
    }
  }

  while (items.length < 4) {
    const fallbacks = [
      { title: 'Best Running Shoes for 2025', tag: 'BUYING GUIDE', tagBg: '#2323FF', meta: '12 min read', showPlay: false },
      { title: '30 Day Review: Samsung S24 Ultra', tag: 'CREATOR REVIEW', tagBg: '#3B82F6', meta: '18 min video', showPlay: true },
      { title: 'Minimal Desk Setup Ideas', tag: 'COLLECTION', tagBg: '#16A34A', meta: '8 items', showPlay: false },
      { title: "Behind Aarong's Summer Collection", tag: 'BRAND STORY', tagBg: '#EB4501', meta: '10 min read', showPlay: false },
    ];
    const f = fallbacks[items.length];
    items.push({ id: `demo-${items.length}`, ...f });
  }

  return items.slice(0, 4);
}

const LATEST_REVIEWS = [
  {
    name: 'Samsung Galaxy S24 Ultra',
    date: 'May 5, 2025',
    rating: '4.9',
    rank: 1,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    date: 'Apr 28, 2025',
    rating: '4.8',
    rank: 2,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop',
  },
  {
    name: 'Dell XPS 15 (2024)',
    date: 'Apr 20, 2025',
    rating: '4.7',
    rank: 3,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop',
  },
];

/** Choosify.dc.html Creator Profile — Overview tab feed */
export function CreatorOverviewFeed({
  creator,
  onViewAllContent,
  onViewAllReviews,
}: CreatorOverviewFeedProps) {
  const featured = buildFeatured(creator);
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
    { icon: '⏱', label: 'Response Time', value: '24 - 48 hours' },
    { icon: '✉', label: 'Preferred Contact', value: 'Email' },
    { icon: '📍', label: 'Location', value: 'Dhaka, Bangladesh' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Featured Content */}
      <section>
        <div className="flex justify-between items-baseline mb-3.5">
          <h2 className="text-sm font-extrabold text-[#1A1A2E]">Featured Content</h2>
          <button
            type="button"
            onClick={onViewAllContent}
            className="text-[11.5px] font-bold text-[#1A1A2E] hover:text-[#FF5B00] bg-transparent border-0 cursor-pointer"
          >
            VIEW ALL CONTENT →
          </button>
        </div>
        <div className={CREATOR_FEED_GRID}>
          {featured.map((cf) => (
            <CreatorContentCard
              key={cf.id}
              title={cf.title}
              tag={cf.tag}
              tagBg={cf.tagBg}
              meta={cf.meta}
              image={cf.image}
              showPlay={cf.showPlay}
              href={cf.href}
            />
          ))}
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
              className="text-[11px] font-bold text-[#1A1A2E] hover:text-[#FF5B00] bg-transparent border-0 cursor-pointer"
            >
              VIEW ALL REVIEWS →
            </button>
          </div>
          {LATEST_REVIEWS.map((lr, i) => (
            <div
              key={lr.name}
              className={cn(
                'flex items-center gap-2.5 py-2.5',
                i < LATEST_REVIEWS.length - 1 && 'border-b border-[#F1F1F3]',
              )}
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
      <section className="bg-[#14161f] rounded-xl px-[30px] py-[26px] text-white">
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

      {/* Overview / Partners / Contact */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
          <h3 className="text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">Creator Overview</h3>
          {overviewBlocks.map((ob) => (
            <div key={ob.title} className="mb-3.5 last:mb-0">
              <div className="text-[11.5px] font-bold text-[#1A1A2E] flex items-center gap-1.5 mb-1">
                {ob.icon} {ob.title}
              </div>
              <p className="text-[11px] text-[#4B5563] leading-relaxed m-0">{ob.text}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
          <h3 className="text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">Partnerships & Collaborations</h3>
          <div className="text-[10px] font-bold text-[#9AA0AC] mb-2">TOP BRAND PARTNERS</div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {BRAND_PARTNERS.map((bp) => (
              <div
                key={bp.name}
                className="border border-[#E5E7EB] rounded-md p-2 text-center text-[10.5px] font-extrabold"
                style={{ color: bp.color }}
              >
                {bp.name}
              </div>
            ))}
          </div>
          <div className="text-[10px] font-bold text-[#9AA0AC] mb-2">COLLABORATION TYPES</div>
          <div className="flex flex-wrap gap-2">
            {COLLAB_TYPES.map((ct) => (
              <span
                key={ct}
                className="bg-[#F4F7F9] text-[10.5px] font-semibold text-[#4B5563] px-3 py-1.5 rounded-[14px]"
              >
                {ct}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
          <h3 className="text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">Contact & Reach</h3>
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

      {/* Community Says */}
      <section>
        <div className="flex justify-between items-baseline mb-3.5">
          <h2 className="text-sm font-extrabold text-[#1A1A2E]">What The Community Says</h2>
          <button
            type="button"
            onClick={onViewAllReviews}
            className="text-[11.5px] font-bold text-[#1A1A2E] hover:text-[#FF5B00] bg-transparent border-0 cursor-pointer"
          >
            VIEW ALL REVIEWS →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {COMMUNITY.map((cs) => (
            <div key={cs.name} className="bg-white border border-[#E8EDF2] rounded-[14px] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF5B00] text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">
                    {cs.initial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A1A2E] mb-px">{cs.name}</div>
                    <div className="flex items-center gap-0.5 text-[10px] text-[#16A34A] font-bold">
                      <svg width="10" height="10" viewBox="0 0 20 20" fill="#16A34A" aria-hidden>
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
