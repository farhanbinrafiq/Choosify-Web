import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ExternalLink, Play } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import {
  CreatorReviewViewerModal,
  type CreatorReviewViewerMedia,
} from '../creatorReviews/CreatorReviewViewerModal';
import { ProviderPlaceholder } from '../creatorReviews/ProviderPlaceholder';
import { getTikTokThumbnail } from '../../lib/tiktokOembed';
import { getAllBrandPosts } from '../../lib/brandPosts';
import { resolveSpotlightExperience } from '../../utils/spotlightContentResolver';
import {
  resolveLiveStatus,
  spotlightContentToPriorityInput,
} from '../../utils/contentPriority';
import { usePriorityClockMs } from '../../hooks/usePriorityClockMs';
import { rankCreatorContent } from '../../utils/listingRanking';
import {
  UniversalCommerceCard,
  spotlightToContentCardModel,
  resolveCommerceCardVariant,
} from '../content';
import { primaryProductForContent } from '../../utils/spotlightMixedFeed';
import { resolveFeedCardVariant } from '../../utils/spotlightMixedFeed';
import type { SpotlightContent } from '../../types/spotlight/experience/content';
import { cn } from '../../lib/utils';
import {
  brandStoryTextBlocks,
  normalizeBrandStoryCards,
  type BrandStoryBlock,
  type BrandStoryCardModel,
} from '../../lib/brandStory';

const BRAND_LOGOS: Record<string, string> = {};

type StoryRowKind = 'live' | 'youtube' | 'reels' | 'blogs';

/**
 * Progressive reveal by visual grid rows (not type-section count).
 * First paint: 2 visual rows → Browse More adds 3 more until the feed ends.
 */
const INITIAL_VISUAL_ROWS = 2;
const BROWSE_MORE_VISUAL_ROWS = 3;

/** Cards that fill one visual row for each type’s grid. */
const CARDS_PER_VISUAL_ROW: Record<StoryRowKind, number> = {
  live: 2, // sm:grid-cols-2
  youtube: 4, // xl:grid-cols-4
  reels: 5, // xl:grid-cols-5
  blogs: 3, // lg:grid-cols-3
};

type StoryRow = {
  kind: StoryRowKind;
  title: string;
  icon: string;
  iconClassName?: string;
  items: SpotlightContent[];
  forceVariant: 'live' | 'landscape-video' | 'portrait-reel' | 'blog';
  gridClassName: string;
  compactMedia?: boolean;
};

function belongsToBrand(
  content: SpotlightContent,
  brandId: string | number,
  brandName: string,
  brandProductIds: Set<string>,
): boolean {
  const idStr = String(brandId);
  const idNum = String(Number(brandId));
  const name = brandName.trim().toLowerCase();
  if (content.connections.brandIds.some((id) => String(id) === idStr || String(id) === idNum)) {
    return true;
  }
  if (content.publisher?.name?.trim().toLowerCase() === name) return true;
  if (content.connections.productIds.some((pid) => brandProductIds.has(String(pid)))) {
    return true;
  }
  return false;
}

function isPinnedOrFeatured(content: SpotlightContent): boolean {
  if (content.isSponsored) return true;
  return Boolean(content.badges?.some((b) => /pin|feature|sponsor/i.test(b)));
}

/** How many visual rows the given card counts occupy for a type. */
function visualRowsForCardCount(kind: StoryRowKind, cardCount: number): number {
  if (cardCount <= 0) return 0;
  return Math.ceil(cardCount / CARDS_PER_VISUAL_ROW[kind]);
}

/**
 * Walk type rows in order and take enough cards to fill `visualRowBudget` grid rows.
 * Returns per-kind visible card counts.
 */
function takeCardsForVisualRows(
  rows: StoryRow[],
  visualRowBudget: number,
): Map<StoryRowKind, number> {
  const limits = new Map<StoryRowKind, number>();
  let budget = visualRowBudget;

  for (const row of rows) {
    if (budget <= 0) {
      limits.set(row.kind, 0);
      continue;
    }
    const perRow = CARDS_PER_VISUAL_ROW[row.kind];
    const maxCards = row.items.length;
    const rowsAffordable = Math.min(budget, Math.ceil(maxCards / perRow) || 0);
    const cards = Math.min(maxCards, rowsAffordable * perRow);
    limits.set(row.kind, cards);
    budget -= visualRowsForCardCount(row.kind, cards);
  }

  return limits;
}

function totalVisualRows(rows: StoryRow[]): number {
  return rows.reduce(
    (sum, row) => sum + visualRowsForCardCount(row.kind, row.items.length),
    0,
  );
}

/**
 * Brand Details — "Brand Story" grouped by type into rows with progressive reveal.
 * LIVE keeps featured size during active + 24h grace; then shrinks to YouTube row.
 */
const STORY_ASPECT: Record<BrandStoryCardModel['aspect'], string> = {
  landscape: '16 / 9',
  portrait: '9 / 16',
  square: '1 / 1',
};

/**
 * Dashboard-authored Brand Story card — external link or the seller's own
 * published content.
 *
 * Three distinct interaction models, chosen by what the card actually is:
 *  1. `kind: 'link'` on a platform this app can embed (YouTube/Shorts/
 *     Instagram/TikTok/Facebook/Reel) — Play opens the SAME shared Creator
 *     Review viewer in-platform; a separate small external-link icon opens
 *     the real original URL. Clicking the card never leaves Choosify by
 *     itself just because the source happens to be external.
 *  2. `kind: 'link'` on an unrecognized platform (e.g. a plain blog/article
 *     URL) — kept exactly as before: the whole card is a plain
 *     `target="_blank"` external link. No embed is invented for a provider
 *     this app doesn't support.
 *  3. `kind: 'content'` (a Choosify-hosted guide/review the seller
 *     published) — an in-app `<Link>`, not a new-tab external anchor; this
 *     was a real bug (Choosify's own detail pages were opening in a new
 *     browser tab).
 */
function AuthoredStoryCard({
  card,
  onPlay,
}: {
  card: BrandStoryCardModel;
  onPlay: (media: CreatorReviewViewerMedia) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const isPlayableLink = card.kind === 'link' && !!card.platform && card.platform !== 'unknown' && !!card.href;

  // Same thumbnail precedence as Creator Review media (CreatorReviewMediaCard):
  // custom → YouTube-derived (already in card.thumbnailUrl) → TikTok's public
  // oEmbed thumbnail (fetched fresh, never persisted) → the honest
  // platform-branded ProviderPlaceholder. Facebook/Instagram have no
  // credential-free thumbnail source, so they get the branded placeholder.
  const needsTikTokFetch = isPlayableLink && card.platform === 'tiktok' && !card.hasThumbnail;
  const [tiktokThumb, setTiktokThumb] = useState<string | null>(null);
  useEffect(() => {
    if (!needsTikTokFetch || !card.href) {
      setTiktokThumb(null);
      return;
    }
    let cancelled = false;
    getTikTokThumbnail(card.href).then((url) => {
      if (!cancelled) setTiktokThumb(url);
    });
    return () => {
      cancelled = true;
    };
  }, [needsTikTokFetch, card.href]);

  const thumbSrc = card.hasThumbnail ? card.thumbnailUrl : tiktokThumb || '';
  const showImg = Boolean(thumbSrc) && !imgFailed;
  const showProviderPlaceholder = !showImg && isPlayableLink;

  const media = (
    <div
      className="group relative w-full bg-[#F4F7F9] overflow-hidden"
      style={{
        aspectRatio: STORY_ASPECT[card.aspect],
        ...(card.aspect === 'portrait' ? { maxWidth: 220, marginLeft: 'auto', marginRight: 'auto' } : {}),
      }}
    >
      {showImg ? (
        <img
          src={thumbSrc}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : showProviderPlaceholder ? (
        // Branded "Preview unavailable" tile shared with Creator Reviews --
        // renders its own play affordance, so the Play overlay below skips its
        // circle in this state.
        <ProviderPlaceholder platform={card.platform!} label={card.platformLabel} />
      ) : (
        // Neutral Choosify placeholder — never a blank rectangle, never a
        // fabricated/borrowed image.
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#1A1D4E] to-[#2A2E6B] text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.16em] opacity-90">
            {card.platformLabel}
          </span>
          <span className="text-[9px] font-semibold opacity-60">Open to view</span>
        </div>
      )}
      {isPlayableLink && (
        <>
          <button
            type="button"
            onClick={() => onPlay({ videoUrl: card.href as string, title: card.title })}
            aria-label={`Play ${card.title}`}
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-colors cursor-pointer',
              showProviderPlaceholder ? 'bg-transparent' : 'bg-black/10 hover:bg-black/25',
            )}
          >
            {showProviderPlaceholder ? null : (
              <div className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                <Play className="w-4 h-4 text-[#1A1A2E] ml-0.5 fill-[#1A1A2E]" />
              </div>
            )}
          </button>
          <a
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Open on ${card.platformLabel}`}
            aria-label={`Open on ${card.platformLabel}`}
            className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/70 hover:bg-black/85 flex items-center justify-center text-white transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        </>
      )}
    </div>
  );
  const meta = (
    <div className="p-3 text-left">
      <div className="text-[9px] font-extrabold text-[#8A00C4] uppercase tracking-wider">
        {card.platformLabel}
      </div>
      <div className="text-[12px] font-bold text-[#1A1A2E] mt-0.5 line-clamp-2">{card.title}</div>
      {card.caption ? (
        <div className="text-[10.5px] text-[#9AA0AC] mt-0.5 line-clamp-1">{card.caption}</div>
      ) : null}
    </div>
  );

  if (isPlayableLink) {
    // The media area owns the Play/external-link affordances above; the
    // card itself is not a link at all, so those two controls stay the
    // only interactive targets (no whole-card navigation to fight with them).
    return (
      <div className="bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden">
        {media}
        {meta}
      </div>
    );
  }

  if (card.kind === 'content' && card.href) {
    return (
      <Link
        to={card.href}
        className="block bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden hover:border-[#FF5B00]/40 transition-colors"
      >
        {media}
        {meta}
      </Link>
    );
  }

  // Unrecognized platform (e.g. a plain blog/article link) — unchanged:
  // plain external link, no invented embed.
  return card.href ? (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden hover:border-[#FF5B00]/40 transition-colors"
    >
      {media}
      {meta}
    </a>
  ) : (
    <div className="bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden">
      {media}
      {meta}
    </div>
  );
}

export function BrandStorySection({
  brandId,
  brandName,
  className,
  storyBlocks,
  legacyStory,
}: {
  brandId: string | number;
  brandName: string;
  className?: string;
  /** Dashboard-authored Brand Story (CatalogBrand.storyBlocks). */
  storyBlocks?: BrandStoryBlock[];
  /** Legacy single free-text brand story (CatalogBrand.story). */
  legacyStory?: string;
}) {
  const navigate = useNavigate();
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();
  // Single shared active-media state -- same one-active-player contract as
  // CreatorReviewsPreview: at most one Brand Story video can be playing at a
  // time, and this reuses the exact same modal (not a copy of it).
  const [activeMedia, setActiveMedia] = useState<CreatorReviewViewerMedia | null>(null);

  const authoredCards = useMemo(
    () =>
      normalizeBrandStoryCards(storyBlocks, (contentId) => {
        const g = (allCatalogGuides ?? []).find(
          (x) => String(x.id) === contentId || String(x.slug) === contentId,
        );
        if (!g) return undefined;
        const kindLabel =
          g.type === 'reels' || g.type === 'shorts'
            ? 'Reel'
            : g.type === 'video'
              ? 'Video'
              : 'Guide';
        return {
          title: g.title,
          image: g.image || g.gallery?.[0],
          href: `/spotlight/${g.slug || g.id}`,
          kindLabel,
        };
      }),
    [storyBlocks, allCatalogGuides],
  );
  const authoredText = useMemo(() => brandStoryTextBlocks(storyBlocks), [storyBlocks]);
  const legacyText = (legacyStory || '').trim();
  const hasAuthored = authoredCards.length > 0 || authoredText.length > 0 || Boolean(legacyText);
  const nowMs = usePriorityClockMs();
  const [visibleVisualRows, setVisibleVisualRows] = useState(INITIAL_VISUAL_ROWS);

  const items = useMemo(() => {
    const brandPosts = getAllBrandPosts();
    const all = resolveSpotlightExperience({
      catalog: allCatalogProducts,
      guides: allCatalogGuides ?? [],
      creators: allCreators ?? [],
      brandPosts,
      brandLogos: BRAND_LOGOS,
    });

    const brandProductIds = new Set(
      allCatalogProducts
        .filter(
          (p) =>
            String(p.brandId) === String(brandId) ||
            String(p.brandId) === String(Number(brandId)) ||
            (p.brandName || '').toLowerCase() === brandName.toLowerCase(),
        )
        .map((p) => String(p.id)),
    );

    const filtered = all.filter((c) =>
      belongsToBrand(c, brandId, brandName, brandProductIds),
    );

    return rankCreatorContent(
      filtered.map((c) => ({
        ...c,
        id: c.contentId,
        isLive: resolveLiveStatus(spotlightContentToPriorityInput(c), nowMs) === 'live',
        pinned: isPinnedOrFeatured(c),
        publishedAt: c.publishedAt,
        views: c.popularityScore ?? 0,
        likes: 0,
      })),
      nowMs,
    );
  }, [allCatalogProducts, allCatalogGuides, allCreators, brandId, brandName, nowMs]);

  const rows = useMemo((): StoryRow[] => {
    const live: SpotlightContent[] = [];
    const youtube: SpotlightContent[] = [];
    const reels: SpotlightContent[] = [];
    const blogs: SpotlightContent[] = [];

    for (const content of items) {
      const variant = resolveFeedCardVariant(content, nowMs);
      if (variant === 'live') live.push(content);
      else if (variant === 'reel') reels.push(content);
      else if (variant === 'blog') blogs.push(content);
      else youtube.push(content); // landscape / square / previously LIVE
    }

    const next: StoryRow[] = [];
    if (live.length) {
      next.push({
        kind: 'live',
        title: 'Live Now',
        icon: '◉',
        items: live,
        forceVariant: 'live',
        gridClassName: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
      });
    }
    if (youtube.length) {
      next.push({
        kind: 'youtube',
        title: 'YouTube',
        icon: '▶',
        items: youtube,
        forceVariant: 'landscape-video',
        gridClassName: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
      });
    }
    if (reels.length) {
      next.push({
        kind: 'reels',
        title: 'Reels',
        icon: '⏵',
        items: reels,
        forceVariant: 'portrait-reel',
        gridClassName:
          'grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3',
      });
    }
    if (blogs.length) {
      next.push({
        kind: 'blogs',
        title: 'Blogs',
        icon: '▤',
        iconClassName: 'text-[#07DD05]',
        items: blogs,
        forceVariant: 'blog',
        gridClassName: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
        compactMedia: true,
      });
    }
    return next;
  }, [items, nowMs]);

  const feedVisualRows = useMemo(() => totalVisualRows(rows), [rows]);
  const cardLimits = useMemo(
    () => takeCardsForVisualRows(rows, visibleVisualRows),
    [rows, visibleVisualRows],
  );

  const visibleRows = useMemo(
    () =>
      rows
        .map((row) => ({
          ...row,
          items: row.items.slice(0, cardLimits.get(row.kind) ?? 0),
        }))
        .filter((row) => row.items.length > 0),
    [rows, cardLimits],
  );

  const hasMore = visibleVisualRows < feedVisualRows;

  // Honest empty state — only when there is neither authored Brand Story
  // content nor any brand-connected published content.
  if (!items.length && !hasAuthored) {
    return (
      <section
        id="brand-story-section"
        className={cn('scroll-mt-36 w-full', className)}
        aria-labelledby="brand-story-heading"
      >
        <h3
          id="brand-story-heading"
          className="text-[15px] font-extrabold text-[#1A1A2E] mb-3.5"
        >
          Brand Story
        </h3>
        <div className="bg-white border border-dashed border-[#E8EDF2] rounded-[10px] py-12 text-center text-[13px] text-[#9AA0AC] font-semibold">
          No brand stories, videos, or guides published yet.
        </div>
      </section>
    );
  }

  const storyCount = authoredCards.length + items.length;

  return (
    <section
      id="brand-story-section"
      className={cn('scroll-mt-36 w-full', className)}
      aria-labelledby="brand-story-heading"
    >
      <div className="flex items-baseline justify-between gap-3 mb-3.5">
        <h3
          id="brand-story-heading"
          className="text-[15px] font-extrabold text-[#1A1A2E] m-0"
        >
          Brand Story
        </h3>
        <span className="text-[12px] font-bold text-[#9AA0AC]">{storyCount} stories</span>
      </div>
      <p className="text-[12px] text-[#9AA0AC] m-0 mb-4">
        Guides, videos, reviews, live sessions, and updates from {brandName}.
      </p>

      {hasAuthored && (
        <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 sm:p-5 space-y-4 mb-4">
          {(legacyText || authoredText.length > 0) && (
            <div className="space-y-4 text-left">
              {legacyText ? (
                <p className="text-[12.5px] text-[#4B5563] m-0 leading-relaxed whitespace-pre-wrap">
                  {legacyText}
                </p>
              ) : (
                authoredText.map((t) => (
                  <div key={t.id}>
                    {t.heading ? (
                      <div className="text-[10px] font-extrabold text-[#9AA0AC] uppercase tracking-wider mb-1">
                        {t.heading}
                      </div>
                    ) : null}
                    <p className="text-[12.5px] text-[#4B5563] m-0 leading-relaxed whitespace-pre-wrap">
                      {t.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
          {authoredCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {authoredCards.map((card) => (
                <AuthoredStoryCard key={card.key} card={card} onPlay={setActiveMedia} />
              ))}
            </div>
          )}
        </div>
      )}

      {visibleRows.length > 0 && (
      <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 sm:p-5 space-y-8">
        {visibleRows.map((row) => (
          <div key={row.kind}>
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-[#1A1A2E] mb-3.5">
              <span className={cn('text-[#FF000D]', row.iconClassName)}>{row.icon}</span>
              {row.title}
            </div>
            <div className={row.gridClassName}>
              {row.items.map((content) => (
                <StoryCard
                  key={content.contentId}
                  content={content}
                  products={allCatalogProducts}
                  forceVariant={row.forceVariant}
                  nowMs={nowMs}
                  onNavigate={() => navigate(content.href)}
                  compactMedia={row.compactMedia}
                />
              ))}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() =>
                setVisibleVisualRows((n) =>
                  Math.min(n + BROWSE_MORE_VISUAL_ROWS, feedVisualRows),
                )
              }
              className="text-[12.5px] font-bold text-[#FF5B00] hover:text-[#EF3C23] bg-transparent border border-[#E8EDF2] hover:border-[#FF5B00]/40 rounded-lg px-5 py-2.5 cursor-pointer transition-colors min-h-[44px]"
            >
              Browse More
            </button>
          </div>
        )}
      </div>
      )}

      <CreatorReviewViewerModal media={activeMedia} onClose={() => setActiveMedia(null)} />
    </section>
  );
}

function StoryCard({
  content,
  products,
  forceVariant,
  onNavigate,
  compactMedia,
  nowMs,
}: {
  content: SpotlightContent;
  products: Parameters<typeof primaryProductForContent>[1];
  forceVariant?: 'landscape-video' | 'portrait-reel' | 'live' | 'guide' | 'blog';
  onNavigate: () => void;
  compactMedia?: boolean;
  nowMs: number;
}) {
  const product = primaryProductForContent(content, products);
  const model = spotlightToContentCardModel(content, product, nowMs);
  const variant =
    forceVariant ?? resolveCommerceCardVariant(model.layoutVariant, model.aspectRatio);

  return (
    <UniversalCommerceCard
      mode="commerce"
      variant={variant}
      model={model}
      onNavigate={onNavigate}
      compactMedia={compactMedia}
      className="w-full"
    />
  );
}
