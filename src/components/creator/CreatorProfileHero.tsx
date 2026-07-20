import React from 'react';
import { Check, MessageCircle, Share2, ShieldCheck } from 'lucide-react';
import { FollowButton } from '../FollowButton';
import { ProfileSocialPills } from '../design/ProfileSocialPills';

export interface CreatorProfileHeroProps {
  creator: any;
  claimStatus: string;
  onShare: () => void;
  onMessage?: () => void;
  onClaim?: () => void;
  trustScore?: number;
  reviewCountLabel?: string;
  facts?: Array<{ icon: string; label: string; value: string }>;
  coverImage?: string;
  /** Extra CTAs (Love, Ask For Branding, pending badge) preserved from page logic */
  extraActions?: React.ReactNode;
}

const DEFAULT_SCORE_ROWS = [
  { label: 'Accuracy', pct: '96%', value: '4.9' },
  { label: 'Depth', pct: '94%', value: '4.8' },
  { label: 'Clarity', pct: '92%', value: '4.7' },
  { label: 'Trust', pct: '98%', value: '4.9' },
  { label: 'Value', pct: '90%', value: '4.6' },
];

/** Choosify.dc.html Creator Profile hero — cover constrained to feed silhouette + circular avatar + trust/info cards */
export function CreatorProfileHero({
  creator,
  claimStatus,
  onShare,
  onMessage,
  onClaim,
  trustScore = 4.9,
  reviewCountLabel = '12.4K+ reviews',
  facts,
  coverImage,
  extraActions,
}: CreatorProfileHeroProps) {
  const cover =
    coverImage ||
    creator.coverImage ||
    creator.banner ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80';

  const initial = String(creator.name || 'C')
    .split(/\s+/)
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const info =
    facts ||
    [
      { icon: '📹', label: 'Guides', value: String(creator.guidesCount ?? creator.contentCount ?? '48') },
      { icon: '👁', label: 'Views', value: String(creator.views ?? '2.1M') },
      { icon: '♥', label: 'Followers', value: String(creator.followers ?? '120K') },
      { icon: '★', label: 'Reviews', value: String(creator.reviewsCount ?? '860') },
      { icon: '🏷', label: 'Niche', value: String(creator.bestFor ?? creator.niche ?? 'Tech') },
      { icon: '📍', label: 'Based in', value: String(creator.location ?? 'Dhaka') },
    ];

  const handle = creator.handle || `@${String(creator.name || 'creator').toLowerCase().replace(/\s+/g, '')}`;
  const title = creator.title || creator.role || 'Creator & Product Researcher';

  return (
    <div className="bg-choosify-feed">
      {/* Cover — feed silhouette (not viewport edge-to-edge); matches Creator Profile max-w-[1180px] */}
      <div className="w-full px-5 sm:px-8 lg:px-10 pt-4">
        <div className="max-w-[1180px] mx-auto relative">
          <div className="relative h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden choosify-dark-surface rounded-none">
            <img src={cover} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-none" />
          </div>
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[60px] w-[100px] h-[100px] md:w-[120px] md:h-[120px] z-[5]">
            <div className="w-full h-full rounded-full bg-[#1A1A2E] border-[5px] border-white shadow-[0_16px_36px_rgba(0,0,0,0.28),0_0_0_4px_rgba(7,208,80,0.18)] overflow-hidden flex items-center justify-center text-white text-[30px] font-extrabold">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                initial
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 pb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mt-[74px] mb-6">
          <div className="flex-1 min-w-0 text-center lg:text-left w-full">
            <div className="text-[22px] font-extrabold text-[#1A1A2E] flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              {creator.name}
              {claimStatus === 'verified' && (
                <span className="inline-flex text-[#2323FF]" title="Verified">
                  <Check size={18} strokeWidth={3} />
                </span>
              )}
            </div>
            <div className="text-[13px] text-[#2323FF] font-semibold">{title}</div>
            <div className="text-[12.5px] text-[#9AA0AC] mb-2.5">
              {handle} · {creator.location || 'Dhaka, Bangladesh'}
            </div>
            {claimStatus === 'verified' && (
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2323FF] mb-2">
                <ShieldCheck size={12} /> Verified Creator
              </div>
            )}
            {claimStatus === 'pending' && (
              <div className="inline-flex items-center gap-1.5 bg-[#FF000D] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg mb-2">
                Ownership verification pending
              </div>
            )}
            {claimStatus === 'community' && (
              <div className="text-[10px] font-bold text-[#9AA0AC] mb-2">Community creator profile</div>
            )}
            <ProfileSocialPills className="mt-2.5 justify-center lg:justify-start" />
            {creator.bio && (
              <p className="text-[12.5px] text-[#4B5563] max-w-xl mx-auto lg:mx-0 leading-relaxed mt-3">
                {creator.bio}
              </p>
            )}
          </div>

          <div className="flex gap-2.5 flex-wrap justify-center lg:justify-end lg:mt-[52px] shrink-0 w-full lg:w-auto">
            <FollowButton
              id={String(creator.id || creator.name)}
              name={creator.name}
              type="creator"
              className="!bg-[#2323FF] !text-white !border-[#2323FF] px-[18px] py-2.5 rounded-lg text-xs font-bold hover:!brightness-110"
            />
            {onMessage && (
              <button
                type="button"
                onClick={onMessage}
                className="inline-flex items-center gap-1.5 bg-white text-[#1A1A2E] border border-[#E5E7EB] px-[18px] py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9]"
              >
                <MessageCircle size={13} /> Message
              </button>
            )}
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
                🏷 Claim This Profile
              </button>
            )}
            {extraActions}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-2">
          <div className="bg-white border border-[#E8EDF2] rounded-none p-5 md:w-[300px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] shrink-0">
            <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide mb-2.5">TRUST SCORE</div>
            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-[30px] font-extrabold text-[#1A1A2E]">{trustScore}</div>
              <div className="text-[11.5px] text-[#9AA0AC]">/5 · {reviewCountLabel}</div>
            </div>
            {DEFAULT_SCORE_ROWS.map((r) => (
              <div key={r.label} className="flex items-center gap-2.5 mb-2">
                <div className="text-[11px] text-[#4B5563] font-semibold w-[74px]">{r.label}</div>
                <div className="flex-1 h-1.5 bg-[#F1F1F3] rounded-sm overflow-hidden">
                  <div className="h-full bg-[#2323FF] rounded-sm" style={{ width: r.pct }} />
                </div>
                <div className="text-[11px] font-extrabold text-[#1A1A2E] w-5 text-right">{r.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E8EDF2] rounded-none p-5 flex-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-wide mb-4">CREATOR INFO</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
              {info.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <div className="w-[34px] h-[34px] rounded-lg bg-[#F4F7F9] flex items-center justify-center text-sm shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-[15px] font-extrabold text-[#1A1A2E]">{f.value}</div>
                    <div className="text-[10.5px] text-[#9AA0AC]">{f.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
