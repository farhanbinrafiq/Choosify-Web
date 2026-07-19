import React from 'react';
import { Check, Globe, Share2, ShieldCheck } from 'lucide-react';
import { FollowButton } from '../FollowButton';
import { ProfileSocialPills } from '../design/ProfileSocialPills';

export interface BrandDetailHeroProps {
  brand: any;
  logoNode: React.ReactNode;
  claimStatus: string;
  categoryLabel: string;
  handle?: string;
  locationLabel?: string;
  websiteUrl?: string;
  onShare: () => void;
  onClaim?: () => void;
  onExploreProducts: () => void;
  score?: number;
  reviewCount?: number;
  facts?: Array<{ label: string; value: string }>;
  infoBar?: Array<{ icon: string; value: string; label: string }>;
  coverImage?: string;
}

const DEFAULT_SCORE_ROWS = [
  { label: 'Quality', pct: '88%', value: '4.4' },
  { label: 'Value', pct: '82%', value: '4.1' },
  { label: 'Trust', pct: '90%', value: '4.5' },
  { label: 'Service', pct: '80%', value: '4.0' },
  { label: 'Design', pct: '92%', value: '4.6' },
];

/**
 * Choosify.dc.html Brand Detail hero —
 * cover banner constrained to feed silhouette (max-w-[1440px], rounded, top padding),
 * circular logo overlap, light identity row, score/facts, info bar.
 */
export function BrandDetailHero({
  brand,
  logoNode,
  claimStatus,
  categoryLabel,
  handle,
  locationLabel = 'Bangladesh',
  websiteUrl,
  onShare,
  onClaim,
  onExploreProducts,
  score = 4.3,
  reviewCount = 12490,
  facts,
  infoBar,
  coverImage,
}: BrandDetailHeroProps) {
  const cover =
    coverImage ||
    brand.coverImage ||
    brand.banner ||
    brand.heroImage ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80';

  const brandFacts =
    facts ||
    [
      { label: 'Products', value: String(brand.productCount ?? brand.products ?? '120+') },
      { label: 'Followers', value: String(brand.followers ?? '50K+') },
      { label: 'Categories', value: String(brand.categoryCount ?? '8') },
      { label: 'Deals', value: String(brand.dealCount ?? '24') },
      { label: 'Creators', value: String(brand.creatorCount ?? '18') },
      { label: 'Since', value: String(brand.founded ?? '2012') },
    ];

  const bar =
    infoBar ||
    [
      { icon: '♥', value: '12.4K', label: 'LOVE REACTS' },
      { icon: '🏷', value: '8.2K', label: 'ITEMS SAVED' },
      { icon: '🤝', value: '64', label: 'DEALS FOUND' },
      { icon: '✓', value: '25K+', label: 'VERIFIED ORDERS' },
      { icon: '👁', value: '1.2M', label: 'PRODUCT VIEWS' },
    ];

  const slug = handle || `@${String(brand.name || 'brand').toLowerCase().replace(/\s+/g, '')}`;

  return (
    <div className="bg-choosify-feed">
      {/* Cover — feed silhouette (not viewport edge-to-edge); matches Brand Detail max-w-[1440px] */}
      <div className="w-full px-5 sm:px-8 lg:px-10 pt-4">
        <div className="max-w-[1440px] mx-auto relative">
          <div className="relative h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden choosify-dark-surface rounded-[14px]">
            <img src={cover} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[14px]" />
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[60px] w-[100px] h-[100px] md:w-[120px] md:h-[120px] z-[5]">
            <div className="w-full h-full rounded-full bg-white border-[5px] border-white shadow-[0_16px_36px_rgba(0,0,0,0.28),0_0_0_4px_rgba(255,88,0,0.15)] overflow-hidden flex items-center justify-center">
              {logoNode}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 pb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mt-[74px] mb-5">
          <div className="flex-1 min-w-0 text-center lg:text-left w-full">
            <div className="text-[22px] font-extrabold text-[#1A1A2E] flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              {brand.name}
              {claimStatus === 'verified' && (
                <span className="inline-flex items-center text-[#2323FF]" title="Verified">
                  <Check size={18} strokeWidth={3} />
                </span>
              )}
            </div>
            <div className="text-[12.5px] text-[#9AA0AC] mb-2.5">
              {slug} · {categoryLabel} · {locationLabel}
            </div>
            {claimStatus === 'verified' && (
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2323FF] mb-2">
                <ShieldCheck size={12} /> Verified Brand Owner
              </div>
            )}
            {claimStatus === 'pending' && (
              <div className="inline-flex items-center gap-1.5 bg-[#FF000D] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg mb-2">
                Ownership verification pending
              </div>
            )}
            {claimStatus === 'community' && (
              <div className="text-[10px] font-bold text-[#9AA0AC] mb-2">Community brand profile</div>
            )}
            <ProfileSocialPills className="mt-2.5 justify-center lg:justify-start" />
          </div>

          <div className="flex gap-2.5 flex-wrap justify-center lg:justify-end lg:mt-[52px] shrink-0 w-full lg:w-auto">
            <FollowButton
              id={String(brand.id)}
              name={brand.name}
              type="brand"
              className="!bg-[#2323FF] !text-white !border-[#2323FF] px-[18px] py-2.5 rounded-lg text-xs font-bold hover:!brightness-110"
            />
            <button
              type="button"
              onClick={onExploreProducts}
              className="bg-white text-[#1A1A2E] border border-[#E5E7EB] px-[18px] py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9]"
            >
              Explore Products
            </button>
            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white text-[#1A1A2E] border border-[#E5E7EB] px-[18px] py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9]"
              >
                <Globe size={13} /> Visit Website
              </a>
            ) : null}
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-1.5 bg-white text-[#1A1A2E] border border-[#E5E7EB] px-[18px] py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9]"
            >
              <Share2 size={13} /> Share
            </button>
            {claimStatus === 'community' && onClaim && (
              <button
                type="button"
                onClick={onClaim}
                className="bg-[#FF000D] text-white border border-[#FF000D] px-[18px] py-2.5 rounded-lg text-xs font-bold hover:brightness-110"
              >
                🏷 Claim This Brand
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="bg-white border border-[#E8EDF2] rounded-[14px] p-5 md:w-[300px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] shrink-0">
            <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide mb-2.5">BRAND SCORE</div>
            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-[30px] font-extrabold text-[#1A1A2E]">{score}</div>
              <div className="text-[11.5px] text-[#9AA0AC]">
                /5 · {reviewCount.toLocaleString()} reviews
              </div>
            </div>
            {DEFAULT_SCORE_ROWS.map((r) => (
              <div key={r.label} className="flex items-center gap-2.5 mb-2">
                <div className="text-[11px] text-[#4B5563] font-semibold w-16">{r.label}</div>
                <div className="flex-1 h-1.5 bg-[#F1F1F3] rounded-sm overflow-hidden">
                  <div className="h-full bg-[#2323FF] rounded-sm" style={{ width: r.pct }} />
                </div>
                <div className="text-[11px] font-extrabold text-[#1A1A2E] w-5 text-right">{r.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E8EDF2] rounded-[14px] p-5 flex-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide mb-4">BRAND FACTS</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
              {brandFacts.map((f) => (
                <div key={f.label}>
                  <div className="text-base font-extrabold text-[#1A1A2E] mb-0.5">{f.value}</div>
                  <div className="text-[11px] text-[#9AA0AC]">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8EDF2] rounded-[14px] px-5 sm:px-7 py-[18px] flex flex-wrap items-center gap-x-8 gap-y-4 mb-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          {bar.map((item) => (
            <div key={item.label}>
              <div className="text-base font-extrabold text-[#1A1A2E] flex items-center gap-1.5">
                <span>{item.icon}</span> {item.value}
              </div>
              <div className="text-[10px] text-[#9AA0AC]">{item.label}</div>
            </div>
          ))}
          <div className="choosify-emi-gradient text-white text-[10px] font-extrabold px-4 py-2 rounded-lg ml-auto">
            TRENDING
          </div>
        </div>
      </div>
    </div>
  );
}
