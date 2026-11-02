import React from 'react';
import { Check, Flag, Globe, Share2, ShieldCheck } from 'lucide-react';
import { FollowButton } from '../FollowButton';
import { VerificationPill } from '../VerificationPill';
import { brandSuccessScore } from '../BrandCardDesign';
import {
  ProfileSocialPills,
  profileSocialLinksFromCatalog,
  type ProfileSocialLink,
} from '../design/ProfileSocialPills';

export interface BrandDetailHeroProps {
  brand: any;
  logoNode: React.ReactNode;
  claimStatus: string;
  /** Owned but not verified: 'pending' while documents are in review. */
  verification?: 'pending' | 'none';
  categoryLabel: string;
  handle?: string;
  locationLabel?: string;
  websiteUrl?: string;
  onShare: () => void;
  onClaim?: () => void;
  onReport?: () => void;
  onExploreProducts: () => void;
  score?: number;
  reviewCount?: number;
  facts?: Array<{ label: string; value: string }>;
  infoBar?: Array<{ icon: string; value: string; label: string }>;
  coverImage?: string;
  socialLinks?: ProfileSocialLink[];
}

/**
 * Choosify.dc.html Brand Detail hero —
 * cover banner constrained to feed silhouette (max-w-[1440px], square corners, top padding),
 * circular logo overlap, light identity row, score/facts, info bar.
 */
/** "https://www.begautos.com/shop" → "begautos.com" (falls back to the raw text). */
function websiteHost(url: string): string {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function BrandDetailHero({
  brand,
  logoNode,
  claimStatus,
  verification,
  categoryLabel,
  handle,
  locationLabel = 'Bangladesh',
  websiteUrl,
  onShare,
  onClaim,
  onReport,
  onExploreProducts,
  score = 0,
  reviewCount = 0,
  facts,
  infoBar,
  coverImage,
  socialLinks,
}: BrandDetailHeroProps) {
  const cover =
    coverImage ||
    brand.coverImage ||
    brand.banner ||
    brand.heroImage ||
    '';

  const resolvedSocials =
    socialLinks ||
    // Explicit [] fallback — profileSocialLinksFromCatalog's own default
    // fallback is Choosify's own official social links, meant for contexts
    // with no brand data at all. A real brand with no socialLinks saved
    // must show no social pills, never Choosify's.
    profileSocialLinksFromCatalog(brand?.socialLinks, []);

  // Real/zero counts only when the caller doesn't pass its own `facts` —
  // never a fabricated positive number ("120+", "50K+" etc.). "Creators" and
  // "Since" are omitted entirely, same as BrandDetailPage's real facts array,
  // since there is no genuine per-brand source for either yet.
  const brandFacts =
    facts ||
    [
      { label: 'Products', value: String(brand.productCount ?? brand.products ?? 0) },
      { label: 'Followers', value: String(brand.followers ?? 0) },
      { label: 'Categories', value: String(brand.categoryCount ?? 0) },
      { label: 'Deals', value: String(brand.dealCount ?? 0) },
    ];

  const slug = handle || `@${String(brand.name || 'brand').toLowerCase().replace(/\s+/g, '')}`;

  return (
    <div className="bg-choosify-feed">
      {/* Cover — feed silhouette (not viewport edge-to-edge); matches Brand Detail max-w-[1440px] */}
      <div className="w-full px-5 sm:px-8 lg:px-10 pt-4">
        <div className="max-w-[1440px] mx-auto relative">
          {/* No cover uploaded → a plain blank band (never a stock photo). */}
          <div
            className={`relative h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden rounded-none ${cover ? 'choosify-dark-surface' : 'bg-[#E8EDF2]'}`}
            data-testid="profile-cover"
          >
            {cover ? (
              <>
                <img src={cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-none" />
              </>
            ) : null}
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[60px] w-[100px] h-[100px] md:w-[120px] md:h-[120px] z-[5]">
            <div className="w-full h-full rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center">
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
              <div className="inline-flex items-center gap-1.5 bg-[#FF000D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2">
                Ownership claim under review
              </div>
            )}
            {claimStatus === 'community' && (
              <div className="text-[10px] font-bold text-[#9AA0AC] mb-2">Community profile · Unclaimed</div>
            )}
            {claimStatus === 'owned' && (
              <div className="mb-2">
                <VerificationPill verification={verification} />
              </div>
            )}
            {/* Website first in the social row (same pill shape, orange globe) so it's easy to spot. */}
            <div className="mt-2.5 flex flex-wrap gap-2 justify-center lg:justify-start">
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white border border-[#FF5B00]/35 rounded-full pl-1 pr-3 py-1 no-underline hover:border-[#FF5B00] hover:bg-[#FFF6F2] transition-colors"
                  aria-label={`Visit ${brand.name} website (${websiteHost(websiteUrl)})`}
                  data-testid="brand-website-pill"
                >
                  <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[#FF5B00] to-[#EF3C23]">
                    <Globe size={18} className="text-white" aria-hidden />
                  </span>
                  <span className="flex flex-col leading-tight text-left">
                    <span className="text-[11px] font-bold text-[#1A1A2E]">Website</span>
                    <span className="text-[10px] text-[#6B7280] max-w-[160px] truncate">{websiteHost(websiteUrl)}</span>
                  </span>
                </a>
              ) : null}
              <ProfileSocialPills className="justify-center lg:justify-start" links={resolvedSocials} />
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap justify-center lg:justify-end lg:mt-[52px] shrink-0 w-full lg:w-auto">
            <FollowButton
              id={String(brand.id)}
              catalogId={brand.catalogId ? String(brand.catalogId) : undefined}
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
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-1.5 bg-white text-[#1A1A2E] border border-[#E5E7EB] px-[18px] py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9]"
            >
              <Share2 size={13} /> Share
            </button>
            {onReport && (
              <button
                type="button"
                onClick={onReport}
                title="Report this brand"
                className="inline-flex items-center gap-1.5 bg-white text-[#9AA0AC] border border-[#E5E7EB] px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9] hover:text-red-500"
              >
                <Flag size={13} />
              </button>
            )}
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
          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5 md:w-[300px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] shrink-0">
            <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide mb-2.5">BRAND SCORE</div>
            {/* Same success score as the brand cards: 100% for a new brand, then it
                follows the real average rating (5★ = 100%). Unclaimed community
                profiles are not scored. */}
            {(() => {
              const success = brandSuccessScore({ rating: reviewCount > 0 ? score : 0, ownership: brand.ownership });
              return (
                <>
                  <div className="flex items-baseline gap-2 mb-1">
                    <div className={`text-[30px] font-extrabold ${success === null ? 'text-[#9AA0AC]' : 'text-[#07A828]'}`} data-testid="brand-hero-score">
                      {success === null ? '—' : `${success}%`}
                    </div>
                    {success !== null && <div className="text-[11.5px] text-[#9AA0AC]">Success</div>}
                  </div>
                  <div className="text-[11.5px] text-[#9AA0AC] mb-4">
                    {success === null
                      ? 'Community profile · not scored until a verified owner claims it'
                      : reviewCount > 0
                        ? `${score.toFixed(1)}/5 from ${reviewCount.toLocaleString()} review${reviewCount === 1 ? '' : 's'}`
                        : 'New brand · no reviews yet'}
                  </div>
                </>
              );
            })()}
          </div>

          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5 flex-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
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

      </div>
    </div>
  );
}
