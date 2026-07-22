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
  Truck,
  BadgeCheck,
  CreditCard,
  RotateCcw,
  Headphones,
  Banknote,
  Award,
  Gift,
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
import { cn } from '../lib/utils';
import { PLACEHOLDER_IMAGE } from '../constants';
import { PublicReviewCard } from '../components/PublicReviewCard';
import { AddressBookManager } from '../components/address/AddressBookManager';
import toast from 'react-hot-toast';
import { toPlatformRole } from '../lib/platform/roles';
import { getDashboardNavForRole, isDashboardTabAllowed } from '../lib/platform/dashboardRegistry';
import { SellerWorkspaceSection } from './ReviewDetailPage';
import { CustomerOrdersPage } from './CustomerOrdersPage';
import { DealsVerticalSponsoredCard } from '../components/deals/DealsLowerSections';
import { UniversalCarousel } from '../components/design/UniversalCarousel';

/** Tabs with their own right column / dense forms — do not inject sponsored rail */
const DASHBOARD_TABS_WITH_RIGHT_CONTENT = new Set([
  'overview',
  'following',
  'saved-items',
  'addresses',
  'settings',
  'orders',
  'my-reviews',
]);

const OVERVIEW_TRUST = [
  { id: 'verified', label: 'Verified Sellers', icon: BadgeCheck },
  { id: 'payments', label: 'Secure Payments', icon: CreditCard },
  { id: 'returns', label: 'Easy Returns', icon: RotateCcw },
  { id: 'cod', label: 'COD Available', icon: Banknote },
  { id: 'support', label: '24/7 Support', icon: Headphones },
] as const;

const OVERVIEW_BADGES = [
  { id: 'verified-buyer', label: 'Verified Buyer', emoji: '✓' },
  { id: 'top-reviewer', label: 'Top Reviewer', emoji: '★' },
  { id: 'early-adopter', label: 'Early Adopter', emoji: '◆' },
  { id: 'deal-hunter', label: 'Deal Hunter', emoji: '৳' },
] as const;

function formatOrderStatus(status: string): { label: string; className: string } {
  switch (status) {
    case 'delivered':
      return { label: 'Delivered', className: 'bg-emerald-50 border-emerald-200 text-emerald-700' };
    case 'dispatched':
    case 'transit':
      return { label: 'Shipped', className: 'bg-blue-50 border-blue-200 text-blue-700' };
    case 'pending':
    default:
      return { label: 'Processing', className: 'bg-amber-50 border-amber-200 text-amber-700' };
  }
}

function scoreMeterColor(pct: number): string {
  // < 50% red · < 70% blue · otherwise green (site palette)
  if (pct < 50) return '#FF000D';
  if (pct < 70) return '#2323FF';
  return '#07A828';
}

function ScoreRing({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const color = scoreMeterColor(pct);
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative w-[72px] h-[72px] shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90" aria-hidden>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#E8EDF2" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-1">
        <span className="text-[15px] font-extrabold text-[#1A1A2E] leading-none tabular-nums">{score}</span>
        <span className="text-[9px] font-bold text-[#9AA0AC] mt-0.5 leading-none">/{max}</span>
      </div>
    </div>
  );
}

function DashboardSponsoredRail() {
  return (
    <aside
      className="hidden lg:block w-full max-w-[240px] shrink-0 sticky top-[88px] self-start isolate z-0"
      aria-label="Sponsored advertisement"
    >
      <DealsVerticalSponsoredCard />
    </aside>
  );
}

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
  'saved-items',
  'following',
  'recently-viewed',
]);
const ACTIVITY_TAB_IDS = new Set([
  'orders',
]);
const COMMUNICATION_TAB_IDS = new Set(['my-reviews', 'addresses']);
const LEGACY_DASHBOARD_TAB_REDIRECTS: Record<string, 'saved-items' | 'following'> = {
  'saved-products': 'saved-items',
  'saved-brands': 'saved-items',
  'saved-recommendations': 'saved-items',
  'loved-brands': 'following',
  'followed-brands': 'following',
};
/** Former dashboard Messages tab — full inbox now lives at /messages */
const EXTERNAL_DASHBOARD_TAB_REDIRECTS: Record<string, string> = {
  messages: '/messages',
  notifications: '/messages',
};

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
  const { savedProducts } = useDashboard();
  const { orders, currentUser } = useGlobalState();
  const displayName = userName?.trim() || 'there';

  const choosifyScore = Math.min(
    100,
    Math.max(0, Math.round(currentUser?.reputation_score ?? 0)),
  );
  const scoreEncouragement =
    choosifyScore >= 90
      ? 'Excellent standing — keep shopping smart.'
      : choosifyScore >= 70
        ? 'Great progress — a few more orders unlock more perks.'
        : 'Shop & review to boost your Choosify Score.';

  const flatItems = orders.flatMap((order) =>
    order.subOrders.flatMap((sub) =>
      sub.items.map((item) => ({
        orderId: order.orderId,
        createdAt: order.createdAt,
        seller: sub.sellerBusinessName,
        status: sub.trackingStatus,
        title: item.productTitle,
        price: item.price * item.quantity,
        quantity: item.quantity,
        image:
          PRODUCTS.find((p) => p.title === item.productTitle)?.image || PLACEHOLDER_IMAGE,
      })),
    ),
  );

  const totalOrdersCount = orders.length || currentUser?.orderStats?.totalOrders || 0;
  const deliveredCount = orders.reduce(
    (n, o) => n + o.subOrders.filter((s) => s.trackingStatus === 'delivered').length,
    0,
  );
  const processingCount = orders.reduce(
    (n, o) =>
      n +
      o.subOrders.filter(
        (s) =>
          s.trackingStatus === 'pending' ||
          s.trackingStatus === 'dispatched' ||
          s.trackingStatus === 'transit',
      ).length,
    0,
  );

  const parseMoney = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const n = Number(value.replace(/[^\d.]/g, ''));
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const totalSpent = orders.reduce((sum, o) => sum + (o.overallTotal || 0), 0);

  const totalSavings = flatItems.reduce((sum, row) => {
    const prod = PRODUCTS.find((p) => p.title === row.title) as
      | { price?: string | number; originalPrice?: string | number }
      | undefined;
    if (!prod) return sum;
    const price = parseMoney(prod.price);
    const original = parseMoney(prod.originalPrice);
    if (original > price) {
      return sum + (original - price) * (row.quantity || 1);
    }
    return sum;
  }, 0);

  const recentOrderRows = flatItems.slice(0, 5);

  const recommended = PRODUCTS.filter((p) => {
    const price = parseMoney((p as { price?: string | number }).price);
    const original = parseMoney((p as { originalPrice?: string | number }).originalPrice);
    const tag = String((p as { tag?: string }).tag || '').toLowerCase();
    return original > price || tag.includes('off') || tag.includes('deal') || tag.includes('%');
  }).slice(0, 8);
  const recommendedFallback =
    recommended.length > 0 ? recommended : PRODUCTS.slice(0, 8);

  const wishlistPreview = savedProducts.slice(0, 6);

  const scoreBenefits = [
    { label: 'Priority COD', unlocked: choosifyScore >= 70 },
    { label: 'Early deal access', unlocked: choosifyScore >= 80 },
    { label: 'Free express tips', unlocked: choosifyScore >= 90 },
    { label: 'Buyer protection boost', unlocked: choosifyScore >= 60 },
  ];

  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-BD', {
        month: 'short',
        year: 'numeric',
      })
    : 'Dec 2024';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="min-w-0">
        <div className="text-[13px] text-[#6B7280] mb-0.5">Welcome back,</div>
        <h2 className="text-[26px] font-extrabold text-[#1A1A2E] leading-tight mb-1.5">
          Hi, {displayName}!
        </h2>
        <p className="text-[12.5px] text-[#9AA0AC]">
          Bangladesh&apos;s smartest product discovery platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-5 min-w-0 items-start">
        <div className="space-y-5 min-w-0 overflow-hidden">
          {/* 2×2 stats — middle column is too narrow for 4-up without overlap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-w-0">
            <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex flex-col gap-3 min-w-0 overflow-hidden">
              <div className="flex gap-3 items-start min-w-0">
                <ScoreRing score={choosifyScore} max={100} />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide uppercase mb-1">
                    Choosify Score
                  </div>
                  <button
                    type="button"
                    onClick={() => onTabChange?.('my-reviews')}
                    className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0"
                  >
                    Score Details →
                  </button>
                </div>
              </div>
              <p className="text-[11.5px] text-[#4B5563] leading-snug break-words">
                {scoreEncouragement}
              </p>
            </div>

            <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex flex-col min-w-0 overflow-hidden">
              <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide uppercase mb-1">
                Total Orders
              </div>
              <div className="text-[22px] font-extrabold text-[#1A1A2E] leading-none mb-1.5 tabular-nums">
                {totalOrdersCount}
              </div>
              <p className="text-[11.5px] text-[#6B7280] mb-3 flex-1 break-words leading-snug">
                {deliveredCount} delivered · {processingCount} processing
              </p>
              <button
                type="button"
                onClick={() => onTabChange?.('orders')}
                className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0 text-left"
              >
                View All Orders →
              </button>
            </div>

            <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex flex-col min-w-0 overflow-hidden">
              <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide uppercase mb-1">
                Total Spent
              </div>
              <div className="text-[18px] sm:text-[20px] font-extrabold text-[#1A1A2E] leading-snug mb-1.5 tabular-nums break-all">
                ৳{totalSpent.toLocaleString('en-BD')}
              </div>
              <p className="text-[11.5px] text-[#6B7280] mb-3 flex-1">Across all purchases</p>
              <button
                type="button"
                onClick={() => onTabChange?.('orders')}
                className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0 text-left"
              >
                View Spending →
              </button>
            </div>

            <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex flex-col min-w-0 overflow-hidden">
              <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide uppercase mb-1">
                Total Savings
              </div>
              <div className="text-[18px] sm:text-[20px] font-extrabold text-[#1A1A2E] leading-snug mb-1.5 tabular-nums break-all">
                ৳{Math.round(totalSavings).toLocaleString('en-BD')}
              </div>
              <p className="text-[11.5px] text-[#6B7280] mb-3 flex-1">Deals & promo savings</p>
              <button
                type="button"
                onClick={() => onTabChange?.('orders')}
                className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0 text-left"
              >
                View My Savings →
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 sm:p-5 min-w-0 overflow-hidden">
            <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-[14px] font-extrabold text-[#1A1A2E] flex items-center gap-2 min-w-0">
                <Package className="text-[#EB4501] shrink-0" size={16} />
                <span className="truncate">Recent Orders</span>
              </h3>
              <button
                type="button"
                onClick={() => onTabChange?.('orders')}
                className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer shrink-0 whitespace-nowrap"
              >
                View All →
              </button>
            </div>

            {recentOrderRows.length > 0 ? (
              <div className="flex flex-col gap-3 min-w-0">
                {recentOrderRows.map((row, i) => {
                  const status = formatOrderStatus(row.status);
                  return (
                    <div
                      key={`${row.orderId}-${i}`}
                      className="flex flex-col gap-3 border border-[#E8EDF2] rounded-xl p-3 bg-[#F4F7F9]/40 min-w-0 sm:flex-row sm:items-center"
                    >
                      <img
                        src={row.image}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                        className="w-14 h-14 rounded-lg object-cover border border-[#E8EDF2] shrink-0"
                      />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="text-[13px] font-bold text-[#1A1A2E] truncate">{row.title}</div>
                        <div className="text-[11.5px] text-[#9AA0AC] mt-0.5 truncate">
                          {row.seller}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize shrink-0',
                              status.className,
                            )}
                          >
                            {row.status === 'delivered' && <CheckCircle2 size={10} />}
                            {(row.status === 'dispatched' || row.status === 'transit') && (
                              <Truck size={10} />
                            )}
                            {row.status === 'pending' && <Clock size={10} />}
                            {status.label}
                          </span>
                          <span className="text-[11px] text-[#9AA0AC] shrink-0">
                            {new Date(row.createdAt).toLocaleDateString('en-BD')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center shrink-0 min-w-0 sm:min-w-[96px]">
                        <div className="text-[14px] font-extrabold text-[#1A1A2E] tabular-nums whitespace-nowrap">
                          ৳{row.price.toLocaleString('en-BD')}
                        </div>
                        <button
                          type="button"
                          onClick={() => onTabChange?.('orders')}
                          className="text-[11.5px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0 whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 border border-dashed border-[#E8EDF2] rounded-xl flex flex-col items-center justify-center text-center bg-[#F4F7F9]">
                <p className="text-[12px] font-semibold text-[#9AA0AC]">No orders yet</p>
                <Link
                  to="/products"
                  className="mt-3 text-[11.5px] font-bold text-[#EB4501] hover:underline"
                >
                  Start shopping →
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 sm:p-5 min-w-0 overflow-hidden">
            <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-[14px] font-extrabold text-[#1A1A2E] flex items-center gap-2 min-w-0">
                <Gift className="text-[#EB4501] shrink-0" size={16} />
                <span className="truncate">Recommended For You</span>
              </h3>
              <Link
                to="/products"
                className="text-[11.5px] font-bold text-[#EB4501] hover:underline shrink-0 whitespace-nowrap"
              >
                Browse more →
              </Link>
            </div>
            <UniversalCarousel
              items={recommendedFallback}
              getKey={(product) => String(product.id)}
              itemWidth={220}
              gap={16}
              renderItem={(product) => <ProductCard product={product} variant="grid" />}
              className="min-w-0"
            />
          </div>

          <div
            className="bg-white rounded-[10px] border border-[#E8EDF2] px-4 sm:px-5 py-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 min-w-0"
            aria-label="Choosify trust guarantees"
          >
            {OVERVIEW_TRUST.map(({ id, label, icon: Icon }) => (
              <div key={id} className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#EB4501]/10 text-[#EB4501] flex items-center justify-center shrink-0">
                  <Icon size={15} aria-hidden />
                </div>
                <span className="text-[11.5px] font-bold text-[#1A1A2E] leading-snug break-words">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4 min-w-0 lg:sticky lg:top-[88px]">
          {(currentUser?.premiumStatus ?? true) && (
            <div className="bg-[#FFF3EA] rounded-xl px-5 py-4 relative overflow-hidden">
              <div className="text-[12.5px] font-bold text-[#1A1A2E] mb-0.5">Premium Member</div>
              <div className="text-[11px] text-[#9AA0AC] mb-3">Member since {memberSince}</div>
              <span className="inline-block bg-[#1A1A2E] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full">
                ★ PREMIUM ACTIVE
              </span>
              <div
                className="absolute right-[-6px] bottom-[-10px] text-[52px] opacity-15 pointer-events-none"
                aria-hidden
              >
                ♛
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 min-w-0 overflow-hidden">
            <h3 className="text-[13px] font-extrabold text-[#1A1A2E] mb-1 flex items-center gap-2">
              <Award className="text-[#EB4501] shrink-0" size={15} /> Your Score / Benefits
            </h3>
            <p className="text-[11.5px] text-[#9AA0AC] mb-3 break-words">
              Score {choosifyScore}/100 unlocks these perks
            </p>
            <ul className="space-y-2">
              {scoreBenefits.map((b) => (
                <li key={b.label} className="flex items-start gap-2 text-[12px] min-w-0">
                  <CheckCircle2
                    size={14}
                    className={cn(
                      'shrink-0 mt-0.5',
                      b.unlocked ? 'text-emerald-500' : 'text-[#D1D5DB]',
                    )}
                  />
                  <span
                    className={cn(
                      'min-w-0 break-words',
                      b.unlocked ? 'text-[#1A1A2E] font-semibold' : 'text-[#9AA0AC]',
                    )}
                  >
                    {b.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h3 className="text-[13px] font-extrabold text-[#1A1A2E]">Badges</h3>
              <button
                type="button"
                onClick={() => onTabChange?.('settings')}
                className="text-[11px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0 shrink-0"
              >
                View All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {OVERVIEW_BADGES.map((b) => (
                <div
                  key={b.id}
                  title={b.label}
                  className="w-10 h-10 rounded-full bg-[#F4F7F9] border border-[#E8EDF2] flex items-center justify-center text-[13px] font-extrabold text-[#EB4501]"
                >
                  {b.emoji}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h3 className="text-[13px] font-extrabold text-[#1A1A2E] min-w-0 truncate">
                Wishlist{' '}
                <span className="text-[#9AA0AC] font-bold">({savedProducts.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => onTabChange?.('saved-items')}
                className="text-[11px] font-bold text-[#EB4501] hover:underline bg-transparent border-none cursor-pointer p-0 shrink-0"
              >
                View All
              </button>
            </div>
            {wishlistPreview.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {wishlistPreview.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onTabChange?.('saved-items')}
                    className="aspect-square rounded-lg overflow-hidden border border-[#E8EDF2] bg-[#F4F7F9] p-0 cursor-pointer"
                  >
                    <img
                      src={p.image || PLACEHOLDER_IMAGE}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11.5px] text-[#9AA0AC] text-center py-4">
                No saved products yet
              </p>
            )}
          </div>
        </aside>
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

const SavedItemsSection = () => {
  const { savedProducts, savedBrands, savedGuides } = useDashboard();
  const totalSaved = savedProducts.length + savedBrands.length + savedGuides.length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-left">
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
          Saved Items{' '}
          <span className="text-[#9AA0AC] text-lg font-bold">({totalSaved})</span>
        </h2>
        <p className="text-[#9AA0AC] text-[12.5px]">
          Everything you saved, organized by type
        </p>
      </div>

      <section className="space-y-4" aria-labelledby="saved-products-heading">
        <div className="flex items-center justify-between gap-3">
          <h3 id="saved-products-heading" className="text-[15px] font-extrabold text-[#1A1A2E]">
            Saved Products <span className="text-[#9AA0AC]">({savedProducts.length})</span>
          </h3>
          <Link to="/products" className="text-[11.5px] font-bold text-[#EB4501] hover:underline">
            Browse products →
          </Link>
        </div>
        {savedProducts.length > 0 ? (
          <div className={PRODUCT_CARD_GRID}>
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="rounded-[10px] border border-dashed border-[#E8EDF2] bg-white py-10 text-center text-[12px] font-semibold text-[#9AA0AC]">
            No saved products yet
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="saved-brands-heading">
        <div className="flex items-center justify-between gap-3">
          <h3 id="saved-brands-heading" className="text-[15px] font-extrabold text-[#1A1A2E]">
            Saved Brands <span className="text-[#9AA0AC]">({savedBrands.length})</span>
          </h3>
          <Link to="/brands" className="text-[11.5px] font-bold text-[#EB4501] hover:underline">
            Browse brands →
          </Link>
        </div>
        {savedBrands.length > 0 ? (
          <div className={BRAND_CARD_GRID}>
            {savedBrands.map((brand) => (
              <BrandCardDesign key={brand.id} brand={mapBrandToCardDesign(brand)} />
            ))}
          </div>
        ) : (
          <div className="rounded-[10px] border border-dashed border-[#E8EDF2] bg-white py-10 text-center text-[12px] font-semibold text-[#9AA0AC]">
            No saved brands yet
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="saved-guides-heading">
        <div className="flex items-center justify-between gap-3">
          <h3 id="saved-guides-heading" className="text-[15px] font-extrabold text-[#1A1A2E]">
            Saved Guides &amp; Content{' '}
            <span className="text-[#9AA0AC]">({savedGuides.length})</span>
          </h3>
          <Link to="/spotlight" className="text-[11.5px] font-bold text-[#EB4501] hover:underline">
            Browse Spotlight →
          </Link>
        </div>
        {savedGuides.length > 0 ? (
          <div className={GUIDE_MEDIA_GRID}>
            {savedGuides.map((item) => {
              const model = savedItemToCommerceModel(item);
              return (
                <UniversalCommerceCard
                  key={model.id || item.id}
                  mode="editorial"
                  variant={resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio)}
                  model={model}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-[10px] border border-dashed border-[#E8EDF2] bg-white py-10 text-center text-[12px] font-semibold text-[#9AA0AC]">
            No saved guides or content yet
          </div>
        )}
      </section>
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
  const { followedBrands, lovedBrands, toggleFollowBrand, toggleLoveBrand } = useDashboard();
  const { allCreators } = useGlobalState();

  const followedCreators = followedBrands.filter((item) => isFollowedCreatorEntity(item, allCreators));
  const followedBrandOnly = followedBrands.filter((item) => !isFollowedCreatorEntity(item, allCreators));
  const brandRows = [
    ...followedBrandOnly.map((item) => ({ item, source: 'followed' as const })),
    ...lovedBrands
      .filter(
        (loved) =>
          !followedBrandOnly.some(
            (followed) =>
              String(followed.id) === String(loved.id) ||
              String(followed.name).toLowerCase() === String(loved.name).toLowerCase(),
          ),
      )
      .map((item) => ({ item, source: 'loved' as const })),
  ];
  const totalFollowing = brandRows.length + followedCreators.length;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
            Following <span className="text-[#9AA0AC] text-lg font-bold">({totalFollowing})</span>
          </h2>
          <p className="text-[#9AA0AC] text-[12.5px]">Brands and creators you follow for updates</p>
        </div>
      </div>

      <section className="space-y-4" aria-labelledby="following-brands-heading">
        <div className="flex items-center justify-between gap-3">
          <h3 id="following-brands-heading" className="text-[15px] font-extrabold text-[#1A1A2E]">
            Brands <span className="text-[#9AA0AC]">({brandRows.length})</span>
          </h3>
          <Link to="/brands" className="text-[11.5px] font-bold text-[#EB4501] hover:underline">
            Explore brands →
          </Link>
        </div>
        {brandRows.length > 0 ? (
          <div className={BRAND_CARD_GRID}>
            {brandRows.map(({ item: brand, source }) => (
              <div key={`${source}-${brand.id}`} className="flex flex-col gap-2 min-w-0">
                <BrandCardDesign brand={mapBrandToCardDesign(brand)} />
                <button
                  type="button"
                  onClick={() =>
                    source === 'followed' ? toggleFollowBrand(brand) : toggleLoveBrand(brand)
                  }
                  className="text-[12px] font-bold text-[#9AA0AC] hover:text-[#CF4400] bg-transparent border-none cursor-pointer self-center"
                >
                  {source === 'followed' ? 'Unfollow' : 'Remove from Loved'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[10px] border border-dashed border-[#E8EDF2] bg-white py-10 text-center text-[12px] font-semibold text-[#9AA0AC]">
            No followed brands yet
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="following-creators-heading">
        <div className="flex items-center justify-between gap-3">
          <h3 id="following-creators-heading" className="text-[15px] font-extrabold text-[#1A1A2E]">
            Creators <span className="text-[#9AA0AC]">({followedCreators.length})</span>
          </h3>
          <Link to="/creators" className="text-[11.5px] font-bold text-[#EB4501] hover:underline">
            Explore creators →
          </Link>
        </div>
        {followedCreators.length > 0 ? (
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
        ) : (
          <div className="rounded-[10px] border border-dashed border-[#E8EDF2] bg-white py-10 text-center text-[12px] font-semibold text-[#9AA0AC]">
            No followed creators yet
          </div>
        )}
      </section>
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
            Recently Viewed <span className="text-[#9AA0AC] text-lg font-bold">({recentlyViewed.length})</span>
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
            <div className="flex flex-col items-center p-8 bg-white border border-[#E8EDF2] rounded-[10px] relative overflow-hidden group">
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

            <div className="space-y-5 bg-white border border-[#E8EDF2] rounded-[10px] p-6">
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
            <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-6 space-y-3 text-left">
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
          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-6 space-y-5">
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
        <div className="max-w-2xl bg-white border border-[#E8EDF2] rounded-[10px] p-6 text-left">
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


const DEMO_SELLER_RATINGS = [
  {
    id: 'sr-1',
    sellerName: 'Samsung Official Store',
    sellerType: 'Brand',
    orderRef: 'ORD-24018',
    productName: 'Samsung Galaxy S24 Ultra',
    rating: 5,
    comment:
      'Excellent buyer — clear communication, accepted delivery on time, and left helpful product feedback.',
    date: 'Jun 2, 2026',
    tags: ['On-time', 'Reliable'],
  },
  {
    id: 'sr-2',
    sellerName: 'TechLand BD',
    sellerType: 'Seller',
    orderRef: 'ORD-23991',
    productName: 'Sony WH-1000XM5',
    rating: 5,
    comment: 'Smooth COD experience. Buyer was available and verified the order quickly.',
    date: 'May 21, 2026',
    tags: ['COD OK', 'Responsive'],
  },
  {
    id: 'sr-3',
    sellerName: 'Aarong Official',
    sellerType: 'Brand',
    orderRef: 'ORD-23844',
    productName: 'Premium Cotton Panjabi',
    rating: 4,
    comment: 'Good buyer overall. One reschedule request, but completed the purchase cleanly.',
    date: 'May 4, 2026',
    tags: ['Completed'],
  },
  {
    id: 'sr-4',
    sellerName: 'Pickaboo',
    sellerType: 'Seller',
    orderRef: 'ORD-23702',
    productName: 'Apple AirPods Pro 2',
    rating: 5,
    comment: 'Highly recommended customer. Fast confirmation and zero return issues.',
    date: 'Apr 18, 2026',
    tags: ['Trusted', 'No returns'],
  },
] as const;

function MyReviewsSection() {
  const { currentUser } = useGlobalState();
  const { reviews } = useDashboard();
  const choosifyScore = Math.min(
    100,
    Math.max(0, Math.round(currentUser?.reputation_score ?? 0)),
  );
  const avgSellerRating =
    DEMO_SELLER_RATINGS.reduce((sum, r) => sum + r.rating, 0) / DEMO_SELLER_RATINGS.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-left">
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">My Reviews</h2>
        <p className="text-[#9AA0AC] text-[12.5px]">
          Seller ratings from your purchases and reviews you&apos;ve written
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-5 items-start">
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5 flex flex-col sm:flex-row gap-5 items-start min-w-0">
          <ScoreRing score={choosifyScore} max={100} />
          <div className="min-w-0 flex-1 text-left">
            <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide uppercase mb-1">
              Choosify Score
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1A1A2E] mb-1.5">
              Built from seller ratings &amp; purchase trust
            </h3>
            <p className="text-[12.5px] text-[#6B7280] leading-relaxed mb-3">
              Brands and sellers rate you after completed orders. Higher scores unlock better COD
              trust, deals, and premium perks.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4F7F9] border border-[#E8EDF2] text-[11px] font-bold text-[#1A1A2E]">
                <Star size={12} className="text-[#EB4501] fill-[#EB4501]" />
                Avg seller rating {avgSellerRating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4F7F9] border border-[#E8EDF2] text-[11px] font-bold text-[#1A1A2E]">
                {DEMO_SELLER_RATINGS.length} seller reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4 text-left">
        <div>
          <h3 className="text-[15px] font-extrabold text-[#1A1A2E]">Reviews from sellers</h3>
          <p className="text-[12px] text-[#9AA0AC] mt-0.5">
            Ratings left by brands and sellers you purchased from
          </p>
        </div>

        <div className="space-y-3 max-w-3xl">
          {DEMO_SELLER_RATINGS.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#E8EDF2] rounded-[10px] p-5 text-left"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center shrink-0">
                    <Store size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[13px] font-extrabold text-[#1A1A2E] truncate">
                        {item.sellerName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-[#F4F7F9] border border-[#E8EDF2] text-[9px] font-bold text-[#9AA0AC] uppercase tracking-wide">
                        {item.sellerType}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#9AA0AC] mt-0.5">
                      Order {item.orderRef} · {item.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0" aria-label={`${item.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < item.rating
                          ? 'text-[#EB4501] fill-[#EB4501]'
                          : 'text-[#E8EDF2] fill-[#E8EDF2]'
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="text-[12.5px] text-[#4B5563] leading-relaxed mb-3">{item.comment}</p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-[#9AA0AC] uppercase tracking-wide">
                  Purchase
                </span>
                <span className="text-[12px] font-bold text-[#1A1A2E]">{item.productName}</span>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg bg-[#07A828]/10 text-[#07A828] text-[10px] font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 text-left">
        <div>
          <h3 className="text-[15px] font-extrabold text-[#1A1A2E]">Reviews you wrote</h3>
          <p className="text-[12px] text-[#9AA0AC] mt-0.5">
            Product feedback you shared with the community
          </p>
        </div>

        <div className="space-y-4 max-w-3xl">
          {reviews && reviews.length > 0 ? (
            reviews.map((r, idx) => {
              const productImage =
                PRODUCTS.find((p) => p.title === r.product)?.image || PLACEHOLDER_IMAGE;
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
            <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white w-full">
              <p className="text-[13px] font-medium text-[#9AA0AC] tracking-tight">
                You haven&apos;t written any product reviews yet
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


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
    Star,
    Settings,
    MapPin,
  };

  const formatNavLabel = (item: { id: string; label: string }) => item.label;

  const getNavCount = (id: string): number | string | null => {
    if (id === 'saved-items') return savedProducts.length + savedBrands.length + savedGuides.length;
    if (id === 'following') return followedBrands.length + lovedBrands.length;
    if (id === 'recently-viewed') return recentlyViewed.length;
    return null;
  };

  const mapNavItems = (items: typeof dashboardNav.platform) =>
    items.map((item) => ({
      id: item.id,
      label: formatNavLabel(item),
      icon: DASHBOARD_ICONS[item.icon] ?? LayoutDashboard,
      href: item.href,
      count: getNavCount(item.id),
      badge: null as number | string | null,
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
    'messages',
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryTab = params.get('tab');
    if (queryTab && EXTERNAL_DASHBOARD_TAB_REDIRECTS[queryTab]) {
      navigate(EXTERNAL_DASHBOARD_TAB_REDIRECTS[queryTab], { replace: true });
      return;
    }
    const redirectedTab = queryTab ? LEGACY_DASHBOARD_TAB_REDIRECTS[queryTab] : undefined;
    if (redirectedTab) {
      params.set('tab', redirectedTab);
      navigate(`/dashboard?${params.toString()}`, { replace: true });
      setActiveTab(redirectedTab);
      return;
    }
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
      const requestedTab = location.state.activeTab as string;
      if (EXTERNAL_DASHBOARD_TAB_REDIRECTS[requestedTab]) {
        navigate(EXTERNAL_DASHBOARD_TAB_REDIRECTS[requestedTab], { replace: true });
        return;
      }
      const tab = LEGACY_DASHBOARD_TAB_REDIRECTS[requestedTab] ?? requestedTab;
      if (tab !== requestedTab) {
        navigate(`/dashboard?tab=${tab}`, { replace: true });
      }
      if (REMOVED_TABS.has(tab) || !isDashboardTabAllowed(tab, platformRole)) {
        setActiveTab('overview');
      } else {
        setActiveTab(tab);
      }
      if (location.state?.settingsSubTab) {
        setSettingsSubTab(location.state.settingsSubTab as SettingsSubTab);
      }
    }
  }, [location.state, location.search, platformRole, navigate]);

  const renderContent = () => {
    if (!isDashboardTabAllowed(activeTab, platformRole)) {
      return <OverviewSection onTabChange={setActiveTab} userName={currentUser.name} />;
    }

    switch (activeTab) {
      // Retail Tabs
      case 'overview': return <OverviewSection onTabChange={setActiveTab} userName={currentUser.name} />;
      case 'saved-items': return <SavedItemsSection />;
      case 'following': return <FollowedBrandsSection />;
      case 'recently-viewed': return <RecentlyViewedSection />;
      case 'orders':
        return (
          <CustomerOrdersPage
            embedded
            onOpenConversation={(threadId) => {
              navigate(`/messages/${threadId}`);
            }}
          />
        );
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
      case 'my-reviews':
        return <MyReviewsSection />;
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
    // Keep Orders inside the dashboard shell; only leave for true external workspace routes
    if (item.href && item.id !== 'orders') {
      navigate(item.href);
    } else {
      setActiveTab(item.id);
      navigate(`/dashboard?tab=${item.id}`);
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

  const browseChoosifyLink = (
    <Link
      to="/"
      className="flex items-center gap-2 border border-[#E8EDF2] rounded-[10px] px-3.5 py-2.5 text-[12px] font-semibold text-[#1A1A2E] hover:bg-[#F4F7F9] transition-colors bg-white"
    >
      Browse Choosify.bd
    </Link>
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
          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-3 flex flex-col min-h-0">
          {renderSidebarNav()}
          <div className="mt-2 pt-2 border-t border-[#E8EDF2]">
            {browseChoosifyLink}
          </div>
          </div>
        </aside>

        {/* Main Content — optional right sponsored rail when column is empty */}
        <main className="flex-1 w-full min-w-0 relative">
          {DASHBOARD_TABS_WITH_RIGHT_CONTENT.has(activeTab) ? (
            <div className="animate-in fade-in transition-all duration-700 min-w-0">{renderContent()}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-5 items-start animate-in fade-in transition-all duration-700">
              <div className="min-w-0 overflow-x-clip relative z-[1]">{renderContent()}</div>
              <DashboardSponsoredRail />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
