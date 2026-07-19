import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Star, 
  Settings, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight, 
  ArrowLeft, 
  ShoppingBag, 
  Store, 
  BookOpen, 
  Trash2, 
  Plus, 
  Send,
  MoreVertical,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Filter,
  X,
  Megaphone,
  Package,
  BarChart3,
  Flame,
  MapPin,
  Menu,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { ProductCard } from '../components/ProductCard';
import { BrandCardDesign, mapBrandToCardDesign } from '../components/BrandCardDesign';
import { CreatorCardDesign } from '../components/CreatorCardDesign';
import {
  PRODUCT_CARD_GRID,
  GUIDE_MEDIA_GRID,
  BRAND_CARD_GRID,
  CREATOR_CARD_GRID,
} from '../lib/pageLayout';
import {
  UniversalCommerceCard,
  guideToContentCardModel,
  spotlightToContentCardModel,
  resolveCommerceCardVariant,
} from '../components/content';
import { PRODUCTS } from '../constants';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { CHOOSIFY_ANNOUNCEMENTS_THREAD_ID } from '../lib/announcements';
import { cn } from '../lib/utils';
import { PLACEHOLDER_IMAGE } from '../constants';
import { PublicReviewCard } from '../components/PublicReviewCard';
import { AddressBookManager } from '../components/address/AddressBookManager';
import toast from 'react-hot-toast';
import { toPlatformRole } from '../lib/platform/roles';
import { getDashboardNavForRole, isDashboardTabAllowed } from '../lib/platform/dashboardRegistry';
import { SellerWorkspaceSection } from './ReviewDetailPage';

function mapFollowedToCreatorCard(item: any) {
  return {
    id: item.id ?? item.name,
    name: item.name || 'Creator',
    handle: item.handle || `@${String(item.name || 'creator').toLowerCase().replace(/\s+/g, '')}`,
    avatar: item.avatar || item.image || item.logo || '',
    score: item.score ?? 85,
    bestFor: item.bestFor || item.niche || 'Lifestyle',
    platforms: item.platforms || ['Instagram'],
    rating: item.rating || 4.7,
    reviews: item.reviews ?? item.reviewCount ?? 85,
    followers: item.followers,
    niche: item.niche || item.bestFor,
    bio: item.bio,
    coverImage: item.coverImage,
    isHot: item.isHot,
    isFeatured: item.isFeatured,
  };
}

function isFollowedCreatorEntity(item: any, allCreators: any[]) {
  if (item?._entityType === 'creator') return true;
  if (item?._entityType === 'brand') return false;
  if (item?.handle || Array.isArray(item?.platforms)) return true;
  return allCreators.some(
    (c) =>
      String(c.id) === String(item?.id) ||
      (c.name && item?.name && c.name.toLowerCase().trim() === String(item.name).toLowerCase().trim()),
  );
}

function savedItemToCommerceModel(item: any) {
  if (item?.contentId && item?.publisher) {
    return spotlightToContentCardModel(item);
  }
  return guideToContentCardModel(item);
}
const COLLECTION_TAB_IDS = new Set([
  'saved-products',
  'saved-brands',
  'loved-brands',
  'followed-brands',
]);
const ACTIVITY_TAB_IDS = new Set([
  'recently-viewed',
  'saved-recommendations',
  'orders',
]);
const COMMUNICATION_TAB_IDS = new Set(['messages', 'my-reviews', 'addresses']);

// --- SUB-COMPONENTS ---

const SidebarSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-[0.06em] mb-2.5 mt-5 first:mt-0">
    {children}
  </div>
);

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  count,
  badge,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number | string | null;
  badge?: number | string | null;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-[12.5px] font-semibold transition-colors border-none text-left cursor-pointer',
      active
        ? 'bg-[#FFF3EA] text-[#EB4501]'
        : 'bg-transparent text-[#4B5563] hover:bg-[#F4F7F9]',
    )}
  >
    <span className="flex items-center gap-2.5 min-w-0">
      <Icon size={15} className={cn('shrink-0', active ? 'text-[#EB4501]' : 'text-[#9AA0AC]')} />
      <span className="truncate">{label}</span>
    </span>
    {badge != null && badge !== '' ? (
      <span className="shrink-0 bg-[#EB4501] text-white text-[10px] font-extrabold rounded-lg px-1.5 py-0.5 leading-none">
        {badge}
      </span>
    ) : count != null && count !== '' ? (
      <span className="shrink-0 text-[#9AA0AC] font-bold text-[12px]">{count}</span>
    ) : null}
  </button>
);

// --- SECTIONS ---

const OverviewSection = ({
  onTabChange,
  userName,
}: {
  onTabChange?: (tab: string) => void;
  userName?: string;
}) => {
  const { recentlyViewed } = useDashboard();
  const displayName = userName?.trim() || 'there';

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="text-[13px] text-[#6B7280] mb-0.5">Welcome back,</div>
          <h2 className="text-[26px] font-extrabold text-[#1A1A2E] leading-tight mb-1.5">
            Hi, {displayName}!
          </h2>
          <p className="text-[12.5px] text-[#9AA0AC]">
            Bangladesh&apos;s smartest product discovery platform.
          </p>
        </div>
        <div className="bg-[#FFF3EA] rounded-xl px-5 py-4 min-w-[260px] relative overflow-hidden">
          <div className="text-[12.5px] font-bold text-[#1A1A2E] mb-0.5">Premium Member</div>
          <div className="text-[11px] text-[#9AA0AC] mb-3">Member since Dec 2024</div>
          <span className="inline-block bg-[#1A1A2E] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full">
            ★ PREMIUM ACTIVE
          </span>
          <div className="absolute right-[-6px] bottom-[-10px] text-[52px] opacity-15 pointer-events-none" aria-hidden>
            ♛
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.1fr] gap-5">
        <div className="bg-white border border-[#E8EDF2] rounded-[14px] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-extrabold text-[#1A1A2E] flex items-center gap-2">
              <Clock className="text-[#EB4501]" size={16} /> Recently Viewed
            </h3>
            <button
              type="button"
              onClick={() => onTabChange?.('recently-viewed')}
              className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer"
            >
              View all history →
            </button>
          </div>

          {recentlyViewed.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2">
              {recentlyViewed.map((p, i) => (
                <div key={i} className="min-w-[240px] sm:min-w-[280px] shrink-0">
                  <ProductCard product={p} variant="grid" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 border border-dashed border-[#E8EDF2] rounded-xl flex flex-col items-center justify-center text-center bg-[#F4F7F9] w-full">
              <p className="text-[12px] font-semibold text-[#9AA0AC]">No recently viewed history</p>
              <button
                type="button"
                onClick={() => onTabChange?.('recently-viewed')}
                className="mt-3 text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer"
              >
                Browse products →
              </button>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E8EDF2] rounded-[14px] overflow-hidden flex flex-col">
          <div className="h-[130px] bg-[#F4F7F9] shrink-0">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-[0.04em] mb-1.5">
              TODAY&apos;S RECOMMENDATION
            </div>
            <h4 className="text-[14px] font-extrabold text-[#1A1A2E] leading-snug mb-2">
              Best Noise Cancelling Headphones in 2025
            </h4>
            <p className="text-[11.5px] text-[#9AA0AC] leading-relaxed mb-3 flex-1">
              Top picks based on your recent views and interests.
            </p>
            <button
              type="button"
              onClick={() => onTabChange?.('saved-recommendations')}
              className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer text-left"
            >
              Discover Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SavedProductsSection = () => {
  const { savedProducts, removeSavedProduct } = useDashboard();
  const { addToCart } = useGlobalState();
  
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            Saved Products <span className="text-[#9AA0AC] text-lg font-bold">({savedProducts.length})</span>
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">Your curated list of saved products</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-[#e8edf2] rounded-full px-6 py-2 shadow-sm">
           <Filter size={14} className="text-gray-400" />
           <select className="bg-transparent text-navy text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer border-none">
              <option value="all" className="bg-white">All Categories</option>
              <option value="tech" className="bg-white">Tech</option>
              <option value="fashion" className="bg-white">Fashion</option>
           </select>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className={PRODUCT_CARD_GRID}>
          {savedProducts.map((p) => (
            <div key={p.id} className="relative group">
              <button 
                onClick={() => {
                  addToCart(p, 1);
                  toast.success('Added to cart!');
                }}
                className="absolute top-6 right-18 z-30 w-10 h-10 rounded-full bg-[#EB4501]/10 text-[#EB4501] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-[#EB4501]/20 hover:bg-[#CF4400] hover:text-white cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingBag size={18} />
              </button>
              <button 
                onClick={() => removeSavedProduct(p.id)}
                className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-500/20 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={18} />
              </button>
              <ProductCard product={p} variant="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white border border-[#e8edf2] flex items-center justify-center text-gray-300 mb-8 scale-110 shadow-sm col-span-full">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-lg font-extrabold text-[#1A1A2E] mb-2">No saved products yet</h3>
          <p className="text-[#9AA0AC] text-[12.5px] mb-8 max-w-sm">Start exploring Choosify.bd and save products you love.</p>
          <Link to="/products" className="px-8 py-3 bg-[#EB4501] text-white rounded-lg text-[13px] font-bold tracking-tight shadow-sm hover:brightness-110 transition-all">Start browsing</Link>
        </div>
      )}
    </div>
  );
};

const SavedGuidesSection = () => {
  const { savedGuides } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-left">
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
          Saved Contents <span className="text-[#9AA0AC] text-lg font-bold">({savedGuides.length})</span>
        </h2>
        <p className="text-[#9AA0AC] text-[12.5px]">
          Guides, spotlights, and editorial you bookmarked
        </p>
      </div>

      {savedGuides.length > 0 ? (
        <div className={GUIDE_MEDIA_GRID}>
          {savedGuides.map((item) => {
            const model = savedItemToCommerceModel(item);
            return (
              <div key={model.id || item.id} className="relative group min-w-0 w-full">
                <UniversalCommerceCard
                  mode="editorial"
                  variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
                  model={model}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white border border-[#E8EDF2] flex items-center justify-center text-gray-300 mb-8 shadow-sm">
            <BookOpen size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-4">
            No saved contents yet
          </h3>
          <p className="text-[#9AA0AC] text-[12.5px] mb-10 max-w-sm">
            Bookmark guides and spotlights from Discover to find them here later.
          </p>
          <Link
            to="/spotlight"
            className="px-8 py-3 bg-[#EB4501] text-white rounded-xl text-[13px] font-bold tracking-tight shadow-sm hover:brightness-110 transition-all"
          >
            Browse Spotlight
          </Link>
        </div>
      )}
    </div>
  );
};

const SavedBrandsSection = () => {
  const { savedBrands } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            Saved Brands <span className="text-[#9AA0AC] text-lg font-bold">({savedBrands.length})</span>
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">Bookmarked partners for later reference</p>
        </div>
      </div>

      {savedBrands.length > 0 ? (
        <div className={BRAND_CARD_GRID}>
          {savedBrands.map((brand) => (
            <BrandCardDesign key={brand.id} brand={mapBrandToCardDesign(brand)} />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Store size={64} className="mb-8 text-gray-300" />
          <p className="text-[13px] font-semibold text-[#1A1A2E] tracking-tight leading-relaxed">No Saved Brands yet</p>
          <Link to="/brands" className="mt-6 px-6 py-2.5 bg-[#EB4501] text-white rounded-xl text-[13px] font-bold tracking-tight shadow-sm hover:brightness-110">Browse all brands</Link>
        </div>
      )}
    </div>
  );
};

const LovedBrandsSection = () => {
  const { lovedBrands, toggleLoveBrand } = useDashboard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            Loved Brands <span className="text-[#9AA0AC] text-lg font-bold">({lovedBrands.length})</span>
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">Brands you reacted to with love</p>
        </div>
      </div>

      {lovedBrands.length > 0 ? (
        <div className={BRAND_CARD_GRID}>
          {lovedBrands.map((brand) => (
            <div key={brand.id} className="flex flex-col gap-2 min-w-0">
              <BrandCardDesign brand={mapBrandToCardDesign(brand)} />
              <button
                type="button"
                onClick={() => toggleLoveBrand(brand)}
                className="text-[12px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer self-center"
              >
                Remove from Loved
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Heart size={64} className="mb-8 text-rose-500" />
          <p className="text-[13px] font-semibold text-[#1A1A2E] tracking-tight leading-relaxed">No Loved Brands yet</p>
          <Link to="/brands" className="mt-6 px-6 py-2.5 bg-[#EB4501] text-white rounded-xl text-[13px] font-bold tracking-tight shadow-sm hover:brightness-110">Explore brands</Link>
        </div>
      )}
    </div>
  );
};

const FollowedBrandsSection = () => {
  const { followedBrands, toggleFollowBrand } = useDashboard();
  const { allCreators } = useGlobalState();

  const followedCreators = followedBrands.filter((item) => isFollowedCreatorEntity(item, allCreators));
  const followedBrandOnly = followedBrands.filter((item) => !isFollowedCreatorEntity(item, allCreators));

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            Following <span className="text-[#9AA0AC] text-lg font-bold">({followedBrands.length})</span>
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">Brands and creators you follow for updates</p>
        </div>
      </div>

      {followedBrands.length > 0 ? (
        <div className="space-y-10">
          {followedBrandOnly.length > 0 && (
            <div className="space-y-4">
              {followedCreators.length > 0 && (
                <h3 className="text-[13px] font-bold text-[#9AA0AC]">Brands</h3>
              )}
              <div className={BRAND_CARD_GRID}>
                {followedBrandOnly.map((brand) => (
                  <div key={brand.id} className="flex flex-col gap-2 min-w-0">
                    <BrandCardDesign brand={mapBrandToCardDesign(brand)} />
                    <button
                      type="button"
                      onClick={() => toggleFollowBrand(brand)}
                      className="text-[12px] font-bold text-[#9AA0AC] hover:text-[#CF4400] bg-transparent border-none cursor-pointer self-center"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {followedCreators.length > 0 && (
            <div className="space-y-4">
              {followedBrandOnly.length > 0 && (
                <h3 className="text-[13px] font-bold text-[#9AA0AC]">Creators</h3>
              )}
              <div className={CREATOR_CARD_GRID}>
                {followedCreators.map((creator) => {
                  const catalog =
                    allCreators.find(
                      (c) =>
                        String(c.id) === String(creator.id) ||
                        c.name?.toLowerCase().trim() === String(creator.name || '').toLowerCase().trim(),
                    ) || creator;
                  return (
                    <div key={creator.id} className="flex flex-col gap-2 min-w-0">
                      <CreatorCardDesign creator={mapFollowedToCreatorCard(catalog)} />
                      <button
                        type="button"
                        onClick={() => toggleFollowBrand(creator)}
                        className="text-[12px] font-bold text-[#9AA0AC] hover:text-[#CF4400] bg-transparent border-none cursor-pointer self-center"
                      >
                        Unfollow
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Store size={64} className="mb-8 text-gray-300" />
          <p className="text-[13px] font-semibold text-[#1A1A2E] tracking-tight leading-relaxed mb-4">Nothing followed yet</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/brands" className="px-6 py-2.5 bg-[#EB4501] text-white rounded-xl text-[13px] font-bold tracking-tight shadow-sm hover:brightness-110">Explore brands</Link>
            <Link to="/creators" className="px-6 py-2.5 bg-white border border-[#E8EDF2] text-[#1A1A2E] rounded-xl text-[13px] font-bold tracking-tight hover:border-[#EB4501]/40">Explore creators</Link>
          </div>
        </div>
      )}
    </div>
  );
};

const RecentlyViewedSection = () => {
  const { recentlyViewed, setRecentlyViewed } = useDashboard();

  const handleClearHistory = () => {
    setRecentlyViewed([]);
    toast.success('Browsing history cleared.');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            Browsing History <span className="text-[#9AA0AC] text-lg font-bold">({recentlyViewed.length})</span>
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">Products you recently browsed</p>
        </div>
        {recentlyViewed.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="text-[12px] font-bold text-red-500 tracking-tight hover:underline bg-transparent border-none cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>

      {recentlyViewed.length > 0 ? (
        <div className={PRODUCT_CARD_GRID}>
          {recentlyViewed.map((p) => (
            <div key={p.id} className="relative group">
              <ProductCard product={p} variant="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center opacity-80">
          <Clock size={64} className="mb-8 text-[#EB4501]" />
          <p className="text-[13px] font-semibold text-[#1A1A2E] tracking-tight leading-relaxed">No recently viewed products</p>
          <p className="text-[10px] font-bold text-gray-405 uppercase mt-2 italic">Product views will automatically populate this section.</p>
          <Link to="/products" className="mt-6 px-6 py-2.5 bg-[#EB4501] text-white rounded-lg text-[13px] font-bold tracking-tight shadow-sm hover:brightness-110">Go to directory</Link>
        </div>
      )}
    </div>
  );
};


// Legacy MessagesSection removed in favor of modern /messages page
const MessagesSection = () => {
  const { messages, addMessage } = useDashboard();
  const [inputText, setInputText] = useState('');
  const [activeChat, setActiveChat] = useState<number | null>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage(inputText, 'user');
    setInputText('');
  };

  return (
    <div className="h-[600px] md:h-[700px] flex flex-col md:flex-row gap-px bg-gray-100 border border-[#e8edf2] rounded-[5px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700 shadow-sm">
      {/* Inbox List */}
      <div className={cn(
        "w-full md:w-[300px] lg:w-[350px] bg-white flex flex-col border-r border-[#e8edf2]",
        activeChat !== null && "hidden md:flex"
      )}>
         <div className="p-6 md:p-8 border-b border-white/5">
            <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-4">Inbox</h2>
            <div className="relative">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold text-navy placeholder:text-gray-400 focus:outline-none focus:border-[#EB4501]/30 transition-all" placeholder="Search chats..." />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto no-scrollbar">
            {[1, 2, 3].map(i => (
              <button 
                key={i} 
                onClick={() => setActiveChat(i)}
                className={cn("w-full p-6 flex gap-4 text-left border-b border-gray-100 transition-all hover:bg-gray-50 bg-transparent border-none cursor-pointer", i === 1 && "bg-gray-50/50 border-r-2 border-[#EB4501]")}
              >
                 <div className="relative">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} className="w-12 h-12 rounded-full object-cover" alt="" />
                    {i === 1 && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#059669] border-2 border-white rounded-full" />}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <span className="text-xs font-black text-navy italic truncate">{i === 1 ? 'Farhan Rafiq (Admin)' : i === 2 ? 'Apex Official' : 'Dhanmondi Branch'}</span>
                       <span className="text-[8px] font-bold text-gray-400">10:30 AM</span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-1 italic font-bold">Absolutely! We can ship the S24 Ultra...</p>
                 </div>
              </button>
            ))}
         </div>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-gray-50/30",
        activeChat === null && "hidden md:flex"
      )}>
         <div className="p-4 md:p-6 border-b border-[#e8edf2] flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
               <button onClick={() => setActiveChat(null)} className="md:hidden w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a2e] border-none cursor-pointer">
                  <ArrowLeft size={16} />
               </button>
               <img src="https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" alt="" />
               <div>
                  <h4 className="text-xs md:text-sm font-extrabold text-[#1A1A2E] tracking-tight leading-none">Farhan Rafiq</h4>
                  <span className="text-[8px] md:text-[9px] font-bold text-[#059669] uppercase italic font-black">Support Active</span>
               </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
               <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-50 border-none flex items-center justify-center text-gray-400 hover:text-navy transition-colors cursor-pointer"><Bell size={14} /></button>
               <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-50 border-none flex items-center justify-center text-gray-400 hover:text-navy transition-colors cursor-pointer"><MoreVertical size={14} /></button>
            </div>
         </div>

         <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 no-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex flex-col max-w-[90%] md:max-w-[80%]", m.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                 <div className={cn(
                   "px-5 py-3 md:px-6 md:py-4 rounded-[16px] md:rounded-[20px] mb-2 text-[11px] md:text-xs font-bold leading-relaxed",
                   m.sender === 'user' ? "bg-[#EB4501] text-white rounded-tr-none shadow-md shadow-[#EB4501]/10 italic" : "bg-white text-navy rounded-tl-none border border-gray-200"
                 )}>
                    {m.text}
                 </div>
                 <span className="text-[11px] font-medium text-[#9AA0AC] tracking-tight px-2">{m.senderName || 'Farhan'} â€¢ {m.time}</span>
              </div>
            ))}
         </div>

         <div className="p-6 md:p-8 bg-white border-t border-[#e8edf2]">
            <div className="relative">
               <input 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 className="w-full h-12 md:h-14 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl pl-6 pr-14 md:pr-16 text-xs font-bold text-navy placeholder:text-gray-400 focus:outline-none focus:border-[#EB4501]/30 transition-all" 
                 placeholder="Type message..." 
               />
               <button 
                 onClick={handleSend}
                 className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#EB4501] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#EB4501]/10 border-none cursor-pointer"
               >
                  <Send size={16} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const NotificationsSection = () => {
  const { notifications, setNotifications } = useDashboard();

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">Notifications</h2>
          <p className="text-[#9AA0AC] text-[13px] font-medium">Updates on your curated world</p>
        </div>
        <button 
          onClick={markAllAsRead}
            className="text-[12px] font-bold text-[#EB4501] tracking-tight hover:underline border-none bg-transparent cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={cn(
                "p-8 bg-white border border-[#e8edf2] rounded-[5px] flex items-start gap-6 transition-all hover:bg-gray-50 relative overflow-hidden group shadow-sm",
                !n.read && "border-[#EB4501]/30 bg-[#EB4501]/5"
              )}
            >
              {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EB4501]" />}
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                n.type === 'price' ? "bg-[#059669]/10 text-[#059669]" : 
                n.type === 'reply' ? "bg-[#EB4501]/10 text-[#EB4501]" : 
                "bg-[#EB4501]/15 text-[#EB4501]"
              )}>
                {n.type === 'price' ? <TrendingUp size={24} /> : n.type === 'reply' ? <MessageSquare size={24} /> : <Bell size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-extrabold text-[#1A1A2E] tracking-tight">{n.title}</h4>
                  <span className="text-[10px] font-black text-gray-500 uppercase">{n.time}</span>
                </div>
                <p className="text-gray-500 text-sm font-bold italic leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center text-center text-gray-400">
            <Bell size={64} className="mb-8" />
            <p className="text-[13px] font-medium text-[#9AA0AC]">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SETTINGS_TABS = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
] as const;

type SettingsSubTab = (typeof SETTINGS_TABS)[number]['id'];

const SettingsSection = ({ initialSubTab = 'personal' }: { initialSubTab?: SettingsSubTab }) => {
  const { currentUser, setCurrentUser } = useGlobalState();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>(initialSubTab);

  useEffect(() => {
    setSettingsSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleSave = () => {
    setCurrentUser({ ...currentUser, name, email, phone });
    localStorage.setItem('choosify_user_profile', JSON.stringify({ name, email, phone }));
    toast.success('Profile settings updated successfully');
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            Profile Settings
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">
            Account center — personal info, addresses, security &amp; preferences
          </p>
        </div>
        {settingsSubTab === 'personal' && (
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#EB4501] hover:brightness-110 text-white text-[13px] font-bold tracking-tight rounded-xl transition-all cursor-pointer border-0 shadow-sm flex items-center gap-2"
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-[#F4F7F9] rounded-2xl w-fit">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSettingsSubTab(tab.id)}
            className={cn(
              'min-h-[40px] px-4 py-2 text-[12.5px] font-bold rounded-xl transition-all border-0 cursor-pointer',
              settingsSubTab === tab.id
                ? 'bg-white text-[#EB4501] shadow-sm'
                : 'bg-transparent text-[#6B7280] hover:text-[#1A1A2E]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {settingsSubTab === 'personal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center p-8 bg-white border border-[#E8EDF2] rounded-[14px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#EB4501]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-28 h-28 mb-5 cursor-pointer group/avatar">
                <img
                  src="https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png"
                  className="w-full h-full rounded-full object-cover border-4 border-[#EB4501]/25 transition-all group-hover/avatar:border-[#EB4501]/60"
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Plus className="text-white" size={28} />
                </div>
              </div>
              <h4 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">{name}</h4>
              <p className="text-[#9AA0AC] text-[12px] font-semibold">Premium Member</p>
            </div>

            <div className="space-y-5 bg-white border border-[#E8EDF2] rounded-[14px] p-6">
              <h3 className="text-[13px] font-bold text-[#1A1A2E]">Profile</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight ml-1">
                    Full Display Name
                  </label>
                  <input
                    className="w-full h-12 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#EB4501]/10 focus:border-[#EB4501]/40 focus:bg-white transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight ml-1">
                    Email Address
                  </label>
                  <input
                    className="w-full h-12 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#EB4501]/10 focus:border-[#EB4501]/40 focus:bg-white transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-[#9AA0AC] tracking-tight ml-1">
                    Phone Number
                  </label>
                  <input
                    className="w-full h-12 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 text-xs font-bold text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#EB4501]/10 focus:border-[#EB4501]/40 focus:bg-white transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#E8EDF2] rounded-[14px] p-6 space-y-3 text-left">
              <h3 className="text-[13px] font-bold text-[#1A1A2E]">Quick links</h3>
              <p className="text-[13px] font-medium text-[#9AA0AC] leading-relaxed">
                Manage delivery locations from the Addresses tab or sidebar menu.
              </p>
              <button
                type="button"
                onClick={() => setSettingsSubTab('addresses')}
                className="text-[12.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Go to Addresses →
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsSubTab === 'addresses' && <AddressBookManager embedded />}

      {settingsSubTab === 'security' && (
        <div className="space-y-4 max-w-xl">
          <h3 className="text-[13px] font-bold text-[#1A1A2E]">Security</h3>
          <button className="w-full py-4 bg-white border border-[#E8EDF2] rounded-xl text-[13px] font-bold text-[#1A1A2E] hover:bg-[#F4F7F9] flex items-center justify-center gap-3 cursor-pointer min-h-[44px]">
            <ShieldCheck size={16} className="text-[#EB4501]" /> Reset Multi-Factor Auth
          </button>
          <button className="w-full py-4 bg-rose-50 border border-rose-100 rounded-xl text-[13px] font-bold text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer min-h-[44px]">
            Deactivate Account
          </button>
        </div>
      )}

      {settingsSubTab === 'notifications' && (
        <div className="space-y-4 max-w-2xl">
          <h3 className="text-[13px] font-bold text-[#1A1A2E]">Notifications</h3>
          <div className="bg-white border border-[#E8EDF2] rounded-[14px] p-6 space-y-5">
            {[
              { label: 'Sale Alerts', desc: 'When your saved product goes on flash sale', checked: true },
              { label: 'Expert Tips', desc: 'Weekly curated guides for your categories', checked: true },
              { label: 'Price Drops', desc: 'Whenever a brand lowers price beyond 20%', checked: false },
              { label: 'Inbox Direct', desc: 'Direct messages from verified sellers', checked: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-6 group">
                <div className="flex-1 text-left">
                  <h5 className="text-[13px] font-bold text-[#1A1A2E] tracking-tight mb-0.5">
                    {item.label}
                  </h5>
                  <p className="text-[12px] font-medium text-[#9AA0AC]">{item.desc}</p>
                </div>
                <button
                  type="button"
                  className={cn(
                    'w-12 h-6 rounded-full transition-all relative p-1 min-h-[44px] min-w-[48px] flex items-center',
                    item.checked ? 'bg-[#059669]' : 'bg-gray-200',
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full bg-white transition-all shadow-md',
                      item.checked ? 'translate-x-6' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {settingsSubTab === 'privacy' && (
        <div className="max-w-2xl bg-white border border-[#E8EDF2] rounded-[14px] p-6 text-left">
          <h3 className="text-[13px] font-extrabold tracking-tight text-[#1A1A2E] mb-2">Privacy</h3>
          <p className="text-[12.5px] text-[#9AA0AC] leading-relaxed">
            Control how your browsing activity and profile data are used across Choosify. Privacy controls
            will expand in a future release.
          </p>
        </div>
      )}
    </div>
  );
};


// --- MAIN PAGE ---

export function DashboardPage() {
  const { setIsLoggedIn, currentUser } = useGlobalState();
  const { 
    savedProducts, 
    savedBrands, 
    savedGuides,
    lovedBrands, 
    followedBrands, 
    recentlyViewed,
    messages,
    reviews,
    setReviews,
    threads,
  } = useDashboard();
  const location = useLocation();
  const navigate = useNavigate();

  const platformRole = toPlatformRole(currentUser.role);
  const dashboardNav = getDashboardNavForRole(platformRole);

  const DASHBOARD_ICONS: Record<string, any> = {
    LayoutDashboard,
    Heart,
    Store,
    CheckCircle2,
    Clock,
    Bookmark,
    ShoppingBag,
    Package,
    Send,
    TrendingUp,
    Megaphone,
    BarChart3,
    Sparkles: Star,
    Users: MessageSquare,
    Flame,
    ShieldCheck: CheckCircle2,
    MessageSquare,
    Star,
    Settings,
    MapPin,
  };

  const formatNavLabel = (item: { id: string; label: string }) => item.label;

  const getNavCount = (id: string): number | string | null => {
    if (id === 'saved-products') return savedProducts.length;
    if (id === 'saved-brands') return savedBrands.length;
    if (id === 'loved-brands') return lovedBrands.length;
    if (id === 'followed-brands') return followedBrands.length;
    if (id === 'recently-viewed') return recentlyViewed.length;
    if (id === 'saved-recommendations') return savedGuides.length;
    return null;
  };

  const getNavBadge = (id: string): number | string | null => {
    if (id === 'messages') {
      const unread = threads.filter((t) => t.unread).length;
      return unread > 0 ? unread : null;
    }
    return null;
  };

  const mapNavItems = (items: typeof dashboardNav.platform) =>
    items.map((item) => ({
      id: item.id,
      label: formatNavLabel(item),
      icon: DASHBOARD_ICONS[item.icon] ?? LayoutDashboard,
      href: item.href,
      count: getNavCount(item.id),
      badge: getNavBadge(item.id),
    }));

  const controlItems = mapNavItems(dashboardNav.platform);
  const workspaceItems = mapNavItems(dashboardNav.workspace);
  const accountItems = mapNavItems(dashboardNav.account);

  const overviewItems = controlItems.filter((i) => i.id === 'overview');
  const collectionItems = controlItems.filter((i) => COLLECTION_TAB_IDS.has(i.id));
  const activityItems = controlItems.filter((i) => ACTIVITY_TAB_IDS.has(i.id));
  const communicationItems = accountItems.filter((i) => COMMUNICATION_TAB_IDS.has(i.id));
  const accountOnlyItems = accountItems.filter((i) => !COMMUNICATION_TAB_IDS.has(i.id));

  const [activeTab, setActiveTab] = useState('overview');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('personal');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // TODO: addToRecentlyViewed called from ProductDetailPage â€” see Prompt 6
  }, []);

  const REMOVED_TABS = new Set([
    'my-comparisons',
    'admin-campaigns',
    'admin-overviews',
    'notifications',
    'cms-studios',
    'spotlight-campaigns',
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryTab = params.get('tab');
    if (queryTab && !REMOVED_TABS.has(queryTab) && isDashboardTabAllowed(queryTab, platformRole)) {
      setActiveTab(queryTab);
      if (queryTab === 'settings') {
        const sub = params.get('section');
        if (sub === 'addresses' || sub === 'personal' || sub === 'security' || sub === 'notifications' || sub === 'privacy') {
          setSettingsSubTab(sub);
        }
      }
      return;
    }

    if (location.state?.activeTab) {
      const tab = location.state.activeTab as string;
      if (REMOVED_TABS.has(tab) || !isDashboardTabAllowed(tab, platformRole)) {
        setActiveTab('overview');
      } else {
        setActiveTab(tab);
      }
      if (location.state?.settingsSubTab) {
        setSettingsSubTab(location.state.settingsSubTab as SettingsSubTab);
      }
    }
  }, [location.state, location.search, platformRole]);

  useEffect(() => {
    if (activeTab === 'messages') {
      navigate('/messages');
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'notifications' || activeTab === 'notifications') {
      navigate(`/messages/${CHOOSIFY_ANNOUNCEMENTS_THREAD_ID}`, { replace: true });
    }
  }, [location.search, activeTab, navigate]);

  const renderContent = () => {
    if (!isDashboardTabAllowed(activeTab, platformRole)) {
      return <OverviewSection onTabChange={setActiveTab} userName={currentUser.name} />;
    }

    switch (activeTab) {
      // Retail Tabs
      case 'overview': return <OverviewSection onTabChange={setActiveTab} userName={currentUser.name} />;
      case 'saved-products': return <SavedProductsSection />;
      case 'saved-brands': return <SavedBrandsSection />;
      case 'loved-brands': return <LovedBrandsSection />;
      case 'followed-brands': return <FollowedBrandsSection />;
      case 'recently-viewed': return <RecentlyViewedSection />;
      case 'saved-recommendations': return <SavedGuidesSection />;
      case 'messages': return (
        <div className="flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto h-[500px]">
          <div className="w-16 h-16 bg-[#F96500]/10 text-orange-primary rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={28} className="animate-pulse" />
          </div>
          <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight">Opening workspace chat</h3>
          <p className="text-[13px] text-[#9AA0AC] leading-relaxed font-medium mb-6">
            Connecting you to your buyer/seller network in the messenger…
          </p>
          <Link 
            to="/messages" 
            className="px-6 py-3 bg-[#EB4501] text-white text-[13px] font-bold tracking-tight rounded-lg hover:brightness-110 transition-all leading-none"
          >
            Go to Messenger
          </Link>
        </div>
      );
      case 'orders':
        navigate('/profile/orders');
        return null;
      case 'seller-products':
      case 'seller-orders':
      case 'spotlight-requests':
      case 'seller-performance':
      case 'creator-studio':
      case 'creator-collaborations':
      case 'creator-spotlight':
      case 'mod-queues':
      case 'mod-approvals':
        return <SellerWorkspaceSection tab={activeTab} />;
      case 'brand-spotlight':
      case 'brand-analytics':
      case 'admin-marketing':
        navigate('/marketing/studio');
        return null;
      case 'my-reviews': return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div>
               <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">My Reviews</h2>
               <p className="text-[#9AA0AC] text-[12.5px]">Your community contributions and feedback</p>
            </div>
            <div className="space-y-4 max-w-3xl">
               {reviews && reviews.length > 0 ? (
                 reviews.map((r, idx) => {
                   const productImage = PRODUCTS.find(p => p.title === r.product)?.image || PLACEHOLDER_IMAGE;
                   return (
                     <PublicReviewCard
                       key={r.id || idx}
                       review={{
                         name: currentUser.name || 'You',
                         avatar: undefined,
                         rating: r.rating || 5,
                         comment: r.comment,
                         date: r.date || r.createdAt || 'Just now',
                         productName: r.product,
                         productImage,
                         verified: true,
                       }}
                       showActions
                     />
                   );
                 })
               ) : (
                 <div className="py-20 border border-dashed border-[#E8EDF2] rounded-[14px] flex flex-col items-center justify-center text-center bg-white w-full">
                    <p className="text-[13px] font-medium text-[#9AA0AC] tracking-tight">No review records found</p>
                 </div>
               )}
            </div>
        </div>
      );
      case 'settings':
        return <SettingsSection initialSubTab={settingsSubTab} />;
      case 'addresses':
        return <AddressBookManager />;

      default: return <OverviewSection onTabChange={setActiveTab} userName={currentUser.name} />;
    }
  };

  const allNavItems = [...controlItems, ...workspaceItems, ...accountItems];

  const handleNavClick = (item: { id: string; href?: string }) => {
    setMobileNavOpen(false);
    if (item.href) {
      navigate(item.href);
    } else {
      setActiveTab(item.id);
    }
  };

  const renderSidebarNav = (compact = false) => (
    <nav className={cn('flex-1 overflow-y-auto no-scrollbar', compact ? 'px-3 py-4' : 'px-1')}>
      {overviewItems.length > 0 && (
        <>
          <SidebarSectionLabel>DASHBOARD</SidebarSectionLabel>
          {overviewItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              count={item.count}
              badge={item.badge}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </>
      )}

      {collectionItems.length > 0 && (
        <>
          <SidebarSectionLabel>MY COLLECTION</SidebarSectionLabel>
          {collectionItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              count={item.count}
              badge={item.badge}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </>
      )}

      {activityItems.length > 0 && (
        <>
          <SidebarSectionLabel>ACTIVITY</SidebarSectionLabel>
          {activityItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              count={item.count}
              badge={item.badge}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </>
      )}

      {workspaceItems.length > 0 && (
        <>
          <SidebarSectionLabel>WORKSPACE</SidebarSectionLabel>
          {workspaceItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              count={item.count}
              badge={item.badge}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </>
      )}

      {communicationItems.length > 0 && (
        <>
          <SidebarSectionLabel>COMMUNICATION</SidebarSectionLabel>
          {communicationItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              count={item.count}
              badge={item.badge}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </>
      )}

      <SidebarSectionLabel>ACCOUNT</SidebarSectionLabel>
      {accountOnlyItems.map((item) => (
        <SidebarItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={activeTab === item.id}
          count={item.count}
          badge={item.badge}
          onClick={() => handleNavClick(item)}
        />
      ))}
      <SidebarItem
        icon={LogOut}
        label="Log Out"
        onClick={() => {
          setMobileNavOpen(false);
          setIsLoggedIn(false);
          navigate('/');
          toast.success('Successfully logged out.');
        }}
      />
    </nav>
  );

  const premiumCard = (
    <div className="choosify-dark-surface rounded-[14px] p-5 text-white mb-3.5">
      <div className="text-[13px] font-extrabold mb-1">Premium Member</div>
      <div className="text-[11px] text-white/55 mb-3.5">Enjoy exclusive benefits</div>
      {['Early access to deals', 'Premium support', 'Exclusive rewards'].map((perk) => (
        <div key={perk} className="flex items-center gap-2 text-[11.5px] text-white/85 mb-2.5">
          <span className="text-[#EB4501]">●</span>
          {perk}
        </div>
      ))}
      <button
        type="button"
        className="w-full bg-[#EB4501] text-white border-none py-2.5 rounded-lg text-[12px] font-extrabold cursor-pointer mt-1.5 hover:brightness-105"
      >
        View Benefits
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed text-[#1A1A2E]">
      {/* Mobile Top Header */}
      <div className="lg:hidden p-4 border-b border-[#E8EDF2] flex items-center justify-between sticky top-0 bg-white z-50">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-[#F4F7F9] flex items-center justify-center text-[#1A1A2E] border border-[#E8EDF2] cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="text-[13px] font-bold text-[#1A1A2E] truncate px-2">
          {allNavItems.find((item) => item.id === activeTab)?.label ?? 'Dashboard'}
        </p>
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="w-10 h-10 rounded-full bg-[#F4F7F9] flex items-center justify-center text-[#1A1A2E] border border-[#E8EDF2] cursor-pointer"
          aria-label="Open dashboard menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,300px)] bg-white shadow-2xl overflow-y-auto flex flex-col border-r border-[#E8EDF2]">
            <div className="p-4 border-b border-[#E8EDF2] flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#1A1A2E]">Dashboard</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="text-[#9AA0AC] hover:text-[#1A1A2E] bg-transparent border-none cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {renderSidebarNav(true)}
            <div className="p-4 mt-auto border-t border-[#E8EDF2]">
              {premiumCard}
              <Link
                to="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 border border-[#E8EDF2] rounded-[10px] px-3.5 py-2.5 text-[12px] font-semibold text-[#1A1A2E]"
              >
                Browse Choosify.bd
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-7 gap-7 items-start">
        {/* Sidebar Desktop — light sticky */}
        <aside className="hidden lg:flex w-[240px] shrink-0 flex-col sticky top-[88px] max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
          {renderSidebarNav()}
          <div className="mt-4 pt-2">
            {premiumCard}
            <Link
              to="/"
              className="flex items-center gap-2 border border-[#E8EDF2] rounded-[10px] px-3.5 py-2.5 text-[12px] font-semibold text-[#1A1A2E] hover:bg-white transition-colors bg-white"
            >
              Browse Choosify.bd
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 relative">
          <div className="animate-in fade-in transition-all duration-700">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
