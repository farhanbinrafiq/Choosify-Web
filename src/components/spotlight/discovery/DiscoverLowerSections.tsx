import React from 'react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../../../constants';

/** Choosify.dc.html Discover — sections below YouTube / Reels / Live / Blog Stories */

const GUIDE_TYPES = [
  {
    title: 'SMARTPHONES',
    links: [
      'Best Phones Under 20,000',
      'Flagship Phones Comparison',
      'Camera Phones Guide',
      'Battery Life Comparison',
    ],
    count: 129,
  },
  {
    title: 'LAPTOPS',
    links: [
      'Best Laptops for Students',
      'Gaming Laptops Guide',
      'MacBooks vs Windows',
      'Budget Laptops',
    ],
    count: 98,
  },
  {
    title: 'AUDIO',
    links: [
      'Headphones Buying Guide',
      'Wireless Earbuds Guide',
      'Speakers Comparison',
      'Soundbars Guide',
    ],
    count: 76,
  },
  {
    title: 'CAMERAS',
    links: [
      'DSLR vs Mirrorless',
      'Best Cameras for Beginners',
      'Videography Cameras',
      'Lens Buying Guide',
    ],
    count: 55,
  },
  {
    title: 'GAMING',
    links: [
      'Gaming PC Build Guide',
      'Gaming Accessories',
      'Monitor Buying Guide',
      'Console Comparison',
    ],
    count: 32,
  },
  {
    title: 'HOME APPLIANCES',
    links: [
      'Refrigerator Guide',
      'Washing Machine Guide',
      'Air Conditioner Guide',
      'Kitchen Appliances',
    ],
    count: 60,
  },
] as const;

const EXPERT_PICKS = [
  {
    num: '1',
    title: 'Best 4K TVs for Home Theater in 2025',
    meta: '9 min read · 12.6K views',
  },
  {
    num: '2',
    title: 'Camera Settings Every Beginner Should Know',
    meta: '7 min read · 8.9K views',
  },
  {
    num: '3',
    title: 'How to Choose the Right Gaming Monitor',
    meta: '6 min read · 7.4K views',
  },
] as const;

const TOP_CREATORS = [
  {
    name: 'Tech World BD',
    role: 'Verified Expert',
    guides: 128,
    followers: '453K',
    initial: 'TW',
    bg: '#2323FF',
  },
  {
    name: 'Gadget & Gear',
    role: 'Tech Creator',
    guides: 96,
    followers: '312K',
    initial: 'GG',
    bg: '#2323FF',
  },
  {
    name: 'Style With Me',
    role: 'Fashion Creator',
    guides: 76,
    followers: '245K',
    initial: 'SM',
    bg: '#DB2777',
  },
  {
    name: 'Productivity Lab',
    role: 'Lifestyle Creator',
    guides: 64,
    followers: '198K',
    initial: 'PL',
    bg: '#07DD05',
  },
] as const;

const COMMUNITY_REVIEWS = [
  {
    name: 'Tanvir Hossain',
    role: 'Verified Expert',
    rating: '5/5',
    quote:
      'I have been using Samsung products for years and they never disappoint. Excellent build quality and amazing performance.',
    product: 'Samsung Galaxy S24 Ultra · 2 days ago',
    initial: 'TH',
    bg: '#2323FF',
  },
  {
    name: 'Nusrat Jahan',
    role: 'Verified Buyer',
    rating: '4.8/5',
    quote:
      'The Bespoke refrigerator is perfect for our home. Stylish design and super efficient cooling.',
    product: 'Samsung Bespoke 4-Door Refrigerator · 6 days ago',
    initial: 'NJ',
    bg: '#DB2777',
  },
] as const;

const TRUST_POINTS = [
  { title: 'Expert & Verified', sub: 'Content by experts and verified creators' },
  { title: '100% Independent', sub: 'Unbiased guides you can trust' },
  { title: 'Regularly Updated', sub: 'Latest trends and recommendations' },
  { title: 'Real Experiences', sub: 'From real users and customers' },
  { title: 'Smart & Helpful', sub: 'AI powered discovery just for you' },
] as const;

export function DiscoverLowerSections() {
  return (
    <div className="w-full">
      {/* GUIDES BY PRODUCT TYPE */}
      <div className="text-[13px] font-extrabold text-[#1A1A2E] tracking-[0.4px] mt-11 mb-1">
        GUIDES BY PRODUCT TYPE
      </div>
      <p className="text-xs text-[#9AA0AC] m-0 mb-4">Explore our comprehensive buying guides</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-11">
        {GUIDE_TYPES.map((gt) => (
          <Link
            key={gt.title}
            to={`/guides?q=${encodeURIComponent(gt.title.toLowerCase())}`}
            className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px] flex gap-3.5 no-underline hover:border-[#EB4501]/35 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.3px] mb-2.5">
                {gt.title}
              </div>
              {gt.links.map((lk) => (
                <div key={lk} className="text-[11.5px] text-[#4B5563] mb-1.5">
                  · {lk}
                </div>
              ))}
              <div className="text-[11px] font-bold text-[#EB4501] mt-2">
                VIEW ALL ({gt.count}) ›
              </div>
            </div>
            <div className="w-[76px] h-[76px] rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9]">
              <img
                src={PLACEHOLDER_IMAGE}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* EXPERT'S PICKS + EDITOR'S PICK */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 mb-11">
        <div>
          <div className="text-[13px] font-extrabold text-[#1A1A2E] tracking-[0.4px] mb-3.5">
            EXPERT&apos;S PICKS
          </div>
          {EXPERT_PICKS.map((ep) => (
            <Link
              key={ep.num}
              to="/guides"
              className="flex items-center gap-3 py-3 border-b border-[#F1F1F3] no-underline last:border-b-0 hover:opacity-90"
            >
              <div className="text-base font-extrabold text-[#E5E7EB] w-5 shrink-0">{ep.num}</div>
              <div className="w-[52px] h-[52px] rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9]">
                <img
                  src={PLACEHOLDER_IMAGE}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-[#1A1A2E] mb-1">{ep.title}</div>
                <div className="text-[10.5px] text-[#9AA0AC]">{ep.meta}</div>
              </div>
            </Link>
          ))}
        </div>
        <div>
          <Link to="/guides" className="block no-underline group">
            <div className="relative h-40 rounded-[10px] overflow-hidden mb-2.5 bg-[#F4F7F9]">
              <img
                src={PLACEHOLDER_IMAGE}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#EB4501] text-white text-[8.5px] font-extrabold px-2 py-0.5 rounded pointer-events-none">
                EDITOR&apos;S PICK
              </div>
            </div>
            <div className="text-[13px] font-bold text-[#1A1A2E] mb-1.5 group-hover:text-[#CF4400] transition-colors">
              Best Noise Cancelling Headphones in 2025
            </div>
            <div className="text-[11px] text-[#9AA0AC]">Headphone Zone · Official Review</div>
          </Link>
        </div>
      </div>

      {/* TOP CREATORS */}
      <div className="flex justify-between items-baseline mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E] tracking-[0.4px]">
          TOP CREATORS
        </div>
        <Link to="/creators" className="text-xs font-bold text-[#1A1A2E] no-underline hover:text-[#CF4400]">
          VIEW ALL CREATORS ›
        </Link>
      </div>
      <div className="bg-white border border-[#E8EDF2] rounded-[10px] px-[18px] py-1.5 mb-11">
        {TOP_CREATORS.map((tc, i) => (
          <div
            key={tc.name}
            className={`flex items-center gap-3 py-3 ${
              i < TOP_CREATORS.length - 1 ? 'border-b border-[#F1F1F3]' : ''
            }`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
              style={{ backgroundColor: tc.bg }}
            >
              {tc.initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-bold text-[#1A1A2E]">{tc.name}</div>
              <div className="text-[10.5px] text-[#9AA0AC]">
                {tc.role} · {tc.guides} Guides · {tc.followers} Followers
              </div>
            </div>
            <Link
              to="/creators"
              className="bg-white text-[#1A1A2E] border border-[#E5E7EB] px-4 py-1.5 rounded-md text-[11px] font-bold no-underline hover:border-[#EB4501] hover:text-[#CF4400] transition-colors"
            >
              FOLLOW
            </Link>
          </div>
        ))}
      </div>

      {/* FROM OUR COMMUNITY */}
      <div className="text-[13px] font-extrabold text-[#1A1A2E] tracking-[0.4px] mb-3.5">
        FROM OUR COMMUNITY
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-9">
        {COMMUNITY_REVIEWS.map((cr) => (
          <div
            key={cr.name}
            className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shrink-0"
                style={{ backgroundColor: cr.bg }}
              >
                {cr.initial}
              </div>
              <div>
                <div className="text-xs font-bold text-[#1A1A2E]">{cr.name}</div>
                <div className="text-[10px] text-[#9AA0AC]">{cr.role}</div>
              </div>
            </div>
            <div className="text-[11px] text-[#F59E0B] mb-2">★★★★★ {cr.rating}</div>
            <p className="text-xs text-[#4B5563] leading-relaxed m-0 mb-2.5">{cr.quote}</p>
            <div className="text-[11px] font-semibold text-[#1A1A2E]">{cr.product}</div>
          </div>
        ))}
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px] flex flex-col items-center justify-center text-center">
          <div className="text-[34px] font-extrabold text-[#1A1A2E] mb-1.5">4.8</div>
          <div className="text-xs text-[#F59E0B] mb-2.5">★★★★★</div>
          <div className="text-[11px] text-[#9AA0AC]">(12.4K Reviews)</div>
        </div>
      </div>

      {/* Choosify statement / trust strip */}
      <div className="flex justify-between bg-white border border-[#E8EDF2] rounded-[10px] px-6 py-[18px] flex-wrap gap-3.5">
        {TRUST_POINTS.map((tp) => (
          <div key={tp.title} className="text-center max-w-[150px]">
            <div className="text-[11.5px] font-bold text-[#1A1A2E] mb-1">{tp.title}</div>
            <div className="text-[10px] text-[#9AA0AC]">{tp.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
