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

/** Platforms the creator links to, when they have not listed platforms explicitly. */
function platformsFromLinks(links: Creator['socialLinks']): string[] {
  const names: Array<[keyof NonNullable<Creator['socialLinks']>, string]> = [
    ['youtube', 'YouTube'],
    ['facebook', 'Facebook'],
    ['instagram', 'Instagram'],
    ['tiktok', 'TikTok'],
    ['linkedin', 'LinkedIn'],
  ];
  return names.filter(([k]) => String(links?.[k] || '').trim()).map(([, n]) => n);
}

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
      <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#FF5B00] flex items-center justify-center shrink-0">
        <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
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

  // Real data only: everything below comes from what the creator entered in
  // Creator Studio. Missing fields are left out (never a demo placeholder).
  const topics = (creator.bestForTags || []).map((t) => String(t).trim()).filter(Boolean);
  const platforms = creator.platforms?.length ? creator.platforms : platformsFromLinks(creator.socialLinks);
  const overviewBlocks = [
    { icon: '📄', title: 'Background & Bio', text: (creator.bio || '').trim() },
    { icon: '📁', title: 'Areas of Expertise', text: topics.join(', ') },
    { icon: '▷', title: 'Content Platforms', text: platforms.join(', ') },
  ].filter((b) => b.text);

  const contactRows = [
    { icon: '✉', label: 'Business Inquiries', value: (creator.email || '').trim() },
    { icon: '⏱', label: 'Response Time', value: (creator.responseTime || '').trim() },
    { icon: '✉', label: 'Preferred Contact', value: (creator.preferredContact || '').trim() },
    { icon: '📍', label: 'Location', value: (creator.location || '').trim() },
  ].filter((r) => r.value);

  const brandPartners = creator.brandPartners || [];
  const collabTypes = creator.collabTypes || [];

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
            className="text-[11.5px] font-bold text-[#1A1A2E] hover:text-[#EF3C23] bg-transparent border-0 cursor-pointer"
          >
            VIEW ALL CONTENT →
          </button>
        </div>
        {featured.length === 0 ? (
          <p className="text-[12px] text-[#9AA0AC] py-3 m-0" data-testid="creator-no-content">
            {firstName} has not published any content yet.
          </p>
        ) : null}
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
          {topics.length ? (
            <div className="flex flex-wrap gap-2" data-testid="creator-topics">
              {topics.map((t) => (
                <span key={t} className="bg-[#F4F7F9] text-[11px] font-semibold text-[#1A1A2E] px-3 py-1.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[#9AA0AC] py-3 m-0">No topics added yet.</p>
          )}
        </div>
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5">
          <div className="flex justify-between items-baseline mb-3.5">
            <h3 className="text-[13px] font-extrabold text-[#1A1A2E]">Latest Reviews</h3>
            <button
              type="button"
              onClick={onViewAllReviews}
              className="text-[11px] font-bold text-[#1A1A2E] hover:text-[#EF3C23] bg-transparent border-0 cursor-pointer"
            >
              VIEW ALL REVIEWS →
            </button>
          </div>
          {/* No canonical Creator-review feed yet — never fabricate. */}
          <p className="text-[12px] text-[#9AA0AC] py-3 m-0">No reviews yet.</p>
        </div>
      </section>

      {/* Creator Overview + Contact & Reach — side by side, styled like Brand/Product Overview cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
          <OverviewCardHeader title="Creator Overview" />
          {overviewBlocks.length === 0 ? (
            <p className="text-[11px] text-[#9AA0AC] m-0">{firstName} has not added an overview yet.</p>
          ) : null}
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
          {contactRows.length === 0 ? (
            <p className="text-[11px] text-[#9AA0AC] m-0">No contact details shared yet.</p>
          ) : null}
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

      {/* Partnerships & Collaborations — only what the creator has listed */}
      {brandPartners.length > 0 || collabTypes.length > 0 ? (
      <section className="bg-white border border-[#E8EDF2] rounded-[10px] p-6" data-testid="creator-partnerships">
        <OverviewCardHeader title="Partnerships & Collaborations" />
        {brandPartners.length > 0 ? (
        <>
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
        </>
        ) : null}
        {collabTypes.length > 0 ? (
        <>
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
        </>
        ) : null}
      </section>
      ) : null}

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
