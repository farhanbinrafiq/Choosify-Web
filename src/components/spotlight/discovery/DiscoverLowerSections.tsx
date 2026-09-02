import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE } from '../../../constants';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { CREATORS } from '../../../data/creators';

/** Choosify.dc.html Discover — sections below YouTube / Reels / Live / Blog Stories */

const GUIDE_LINK_PREVIEW = 3;

const GUIDE_TYPES = [
  {
    title: 'SMARTPHONES',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop',
    links: [
      'Best Phones Under 20,000',
      'Flagship Phones Comparison',
      'Camera Phones Guide',
      'Battery Life Comparison',
      '5G Phones Buying Guide',
      'Best Mid-Range Phones',
      'Foldable Phones Explained',
      'Phone Accessories Guide',
    ],
    count: 129,
  },
  {
    title: 'LAPTOPS',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=500&fit=crop',
    links: [
      'Best Laptops for Students',
      'Gaming Laptops Guide',
      'MacBooks vs Windows',
      'Budget Laptops',
      'Ultrabooks Comparison',
      'Work-from-Home Laptops',
      'Creator Laptops Guide',
      'Laptop Accessories Picks',
    ],
    count: 98,
  },
  {
    title: 'AUDIO',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop',
    links: [
      'Headphones Buying Guide',
      'Wireless Earbuds Guide',
      'Speakers Comparison',
      'Soundbars Guide',
      'Noise Cancelling Explained',
      'Studio Monitors Guide',
      'Budget Audio Picks',
      'True Wireless Rankings',
    ],
    count: 76,
  },
  {
    title: 'CAMERAS',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=500&fit=crop',
    links: [
      'DSLR vs Mirrorless',
      'Best Cameras for Beginners',
      'Videography Cameras',
      'Lens Buying Guide',
      'Action Cameras Guide',
      'Vlogging Camera Picks',
      'Camera Accessories Guide',
      'Budget Photography Kits',
    ],
    count: 55,
  },
  {
    title: 'GAMING',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop',
    links: [
      'Gaming PC Build Guide',
      'Gaming Accessories',
      'Monitor Buying Guide',
      'Console Comparison',
      'Gaming Headsets Guide',
      'Mechanical Keyboards',
      'Budget Gaming Setups',
      'Controller Buying Guide',
    ],
    count: 32,
  },
  {
    title: 'HOME APPLIANCES',
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=500&fit=crop',
    links: [
      'Refrigerator Guide',
      'Washing Machine Guide',
      'Air Conditioner Guide',
      'Kitchen Appliances',
      'Vacuum Cleaner Guide',
      'Water Purifier Picks',
      'Microwave Buying Guide',
      'Smart Home Essentials',
    ],
    count: 60,
  },
] as const;

function GuideTypeCard({
  title,
  links,
  count,
  image,
}: {
  title: string;
  links: readonly string[];
  count: number;
  image: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(image);
  const hasMore = links.length > GUIDE_LINK_PREVIEW;
  const visible = expanded ? links : links.slice(0, GUIDE_LINK_PREVIEW);

  return (
    <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px] flex gap-3.5 items-stretch min-h-[148px]">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.3px] mb-2.5">{title}</div>
        {visible.map((lk) => (
          <Link
            key={lk}
            to={`/guides?q=${encodeURIComponent(lk)}`}
            className="block text-[11.5px] text-[#4B5563] mb-1.5 no-underline hover:text-[#EF3C23]"
          >
            · {lk}
          </Link>
        ))}
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] font-bold text-[#FF5B00] mt-2 border-0 bg-transparent p-0 cursor-pointer hover:brightness-110"
          >
            {expanded ? 'Show less' : `VIEW ALL (${count}) ›`}
          </button>
        )}
      </div>
      <div className="w-[112px] min-h-[112px] self-stretch rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9]">
        <img
          src={imgSrc}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />
      </div>
    </div>
  );
}

const EXPERT_PICKS = [
  {
    num: '1',
    title: 'Best 4K TVs for Home Theater in 2025',
    meta: '9 min read · 12.6K views',
    image:
      'https://images.unsplash.com/photo-1593359677879-a4b92e8b8090?w=320&h=320&fit=crop',
  },
  {
    num: '2',
    title: 'Camera Settings Every Beginner Should Know',
    meta: '7 min read · 8.9K views',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=320&h=320&fit=crop',
  },
  {
    num: '3',
    title: 'How to Choose the Right Gaming Monitor',
    meta: '6 min read · 7.4K views',
    image:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=320&h=320&fit=crop',
  },
  {
    num: '4',
    title: 'Noise-Cancelling Headphones Worth Buying',
    meta: '8 min read · 10.2K views',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&h=320&fit=crop',
  },
  {
    num: '5',
    title: 'Smartphones Under ৳40,000 That Deliver',
    meta: '10 min read · 15.1K views',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=320&fit=crop',
  },
  {
    num: '6',
    title: 'Best Laptops for Students This Year',
    meta: '11 min read · 9.8K views',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=320&h=320&fit=crop',
  },
] as const;

const EXPERT_PICKS_LEFT = EXPERT_PICKS.slice(0, 3);
const EXPERT_PICKS_RIGHT = EXPERT_PICKS.slice(3, 6);

function ExpertPickRow({
  pick,
}: {
  pick: (typeof EXPERT_PICKS)[number];
}) {
  const [imgSrc, setImgSrc] = useState<string>(pick.image);

  return (
    <Link
      to="/guides"
      className="flex items-center gap-3 py-3 border-b border-[#F1F1F3] no-underline last:border-b-0 hover:opacity-90"
    >
      <div className="text-base font-extrabold text-[#E5E7EB] w-5 shrink-0">{pick.num}</div>
      <div className="w-[72px] h-[72px] rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9]">
        <img
          src={imgSrc}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold text-[#1A1A2E] mb-1">{pick.title}</div>
        <div className="text-[10.5px] text-[#9AA0AC]">{pick.meta}</div>
      </div>
    </Link>
  );
}

const TOP_CREATORS = [
  {
    id: 'creator-farhan',
    name: 'Farhan Bin Rafiq',
    role: 'Verified Expert',
    guides: 128,
    followers: '453K',
    initial: 'FR',
    bg: '#2323FF',
  },
  {
    id: 'creator-sarah',
    name: 'Sarah Jenkins',
    role: 'Tech Creator',
    guides: 96,
    followers: '312K',
    initial: 'SJ',
    bg: '#2323FF',
  },
  {
    id: 'creator-imtiaz',
    name: 'Imtiaz Ahmed',
    role: 'Fashion Creator',
    guides: 76,
    followers: '245K',
    initial: 'IA',
    bg: '#DB2777',
  },
  {
    id: 'creator-mily',
    name: 'Mily Rahman',
    role: 'Lifestyle Creator',
    guides: 64,
    followers: '198K',
    initial: 'MR',
    bg: '#07DD05',
  },
  {
    id: 'creator-shakib',
    name: 'Shakib Al-Mridha',
    role: 'Lifestyle Creator',
    guides: 58,
    followers: '176K',
    initial: 'SA',
    bg: '#FF5B00',
  },
  {
    id: 'creator-anika',
    name: 'Anika Sultana',
    role: 'Beauty Creator',
    guides: 52,
    followers: '154K',
    initial: 'AS',
    bg: '#7C3AED',
  },
] as const;

function hasUsableCreatorAvatar(url?: string | null): boolean {
  const v = (url ?? '').trim();
  return v.startsWith('http') || v.startsWith('/');
}

function TopCreatorAvatar({
  name,
  initial,
  bg,
  avatar,
}: {
  name: string;
  initial: string;
  bg: string;
  avatar?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = hasUsableCreatorAvatar(avatar) && !failed;

  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0 overflow-hidden"
      style={showPhoto ? undefined : { backgroundColor: bg }}
      aria-hidden={!showPhoto}
    >
      {showPhoto ? (
        <img
          src={avatar}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-label={name}>{initial}</span>
      )}
    </div>
  );
}

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
  const { allCreators } = useGlobalState();

  const topCreators = useMemo(() => {
    const pool = allCreators.length > 0 ? allCreators : CREATORS;
    const byId = new Map(pool.map((c) => [String(c.id), c]));
    const byName = new Map(pool.map((c) => [c.name.toLowerCase(), c]));
    const staticById = new Map(CREATORS.map((c) => [String(c.id), c]));

    return TOP_CREATORS.map((tc) => {
      const found =
        byId.get(tc.id) ??
        byName.get(tc.name.toLowerCase()) ??
        staticById.get(tc.id);
      const avatar = found?.avatar;
      return {
        ...tc,
        id: found ? String(found.id) : tc.id,
        name: found?.name ?? tc.name,
        avatar: hasUsableCreatorAvatar(avatar) ? avatar!.trim() : undefined,
      };
    });
  }, [allCreators]);

  const topCreatorsLeft = topCreators.slice(0, 3);
  const topCreatorsRight = topCreators.slice(3, 6);

  return (
    <div className="w-full">
      {/* GUIDES BY PRODUCT TYPE */}
      <div className="text-[13px] font-extrabold text-[#1A1A2E] tracking-[0.4px] mt-11 mb-1">
        GUIDES BY PRODUCT TYPE
      </div>
      <p className="text-xs text-[#9AA0AC] m-0 mb-4">Explore our comprehensive buying guides</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-11">
        {GUIDE_TYPES.map((gt) => (
          <GuideTypeCard
            key={gt.title}
            title={gt.title}
            links={gt.links}
            count={gt.count}
            image={gt.image}
          />
        ))}
      </div>

      {/* EXPERT'S PICKS — two independent cards side by side */}
      <div className="mb-11">
        <div className="text-[13px] font-extrabold text-[#1A1A2E] tracking-[0.4px] mb-3.5">
          EXPERT&apos;S PICKS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[EXPERT_PICKS_LEFT, EXPERT_PICKS_RIGHT].map((column, colIdx) => (
            <div
              key={colIdx}
              className="bg-white border border-[#E8EDF2] rounded-[10px] px-4 py-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
            >
              {column.map((ep) => (
                <ExpertPickRow key={ep.num} pick={ep} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* TOP CREATORS — two independent cards side by side */}
      <div className="flex justify-between items-baseline mb-3.5">
        <div className="text-[13px] font-extrabold text-[#1A1A2E] tracking-[0.4px]">
          TOP CREATORS
        </div>
        <Link to="/creators" className="text-xs font-bold text-[#1A1A2E] no-underline hover:text-[#EF3C23]">
          VIEW ALL CREATORS ›
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-11">
        {[topCreatorsLeft, topCreatorsRight].map((column, colIdx) => (
          <div
            key={colIdx}
            className="bg-white border border-[#E8EDF2] rounded-[10px] px-[18px] py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
          >
            {column.map((tc) => (
              <div
                key={tc.id}
                className="flex items-center gap-3 py-3 border-b border-[#F1F1F3] last:border-b-0"
              >
                <TopCreatorAvatar
                  name={tc.name}
                  initial={tc.initial}
                  bg={tc.bg}
                  avatar={tc.avatar}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-bold text-[#1A1A2E]">{tc.name}</div>
                  <div className="text-[10.5px] text-[#9AA0AC]">
                    {tc.role} · {tc.guides} Guides · {tc.followers} Followers
                  </div>
                </div>
                <Link
                  to={`/creators/${tc.id}`}
                  className="bg-white text-[#1A1A2E] border border-[#E5E7EB] px-4 py-1.5 rounded-full text-[11px] font-bold no-underline hover:border-[#FF5B00] hover:text-[#EF3C23] transition-colors shrink-0"
                >
                  View Profile
                </Link>
              </div>
            ))}
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
