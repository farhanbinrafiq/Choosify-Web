import type { CatalogCreator, CatalogGuide, CatalogPlacement } from '../types/catalog';
import type { Creator } from '../data/creators';

export const mapCatalogCreator = (creator: CatalogCreator): Creator => ({
  id: creator.id,
  name: creator.name,
  handle: creator.handle,
  avatar: creator.avatar,
  score: creator.score,
  bestFor: creator.bestFor,
  bestForTags: creator.bestForTags ?? [],
  platforms: (creator.platforms ?? []) as Creator['platforms'],
  bio: creator.bio,
  followers: creator.followers,
  email: creator.email || '',
  phone: creator.phone || '',
  videos: (creator.videos ?? []).map((item) => ({ ...item, associatedGuideId: undefined })),
  reels: creator.reels ?? [],
  blogs: creator.blogs ?? [],
  featuredFlag: creator.featuredFlag,
  verifiedStatus: creator.verifiedStatus,
  createdAt: creator.createdAt,
  updatedAt: creator.updatedAt,
});

export const mapCatalogGuide = (guide: CatalogGuide) => ({
  id: guide.id,
  slug: guide.slug,
  title: guide.title,
  author: guide.author,
  authorAvatar: guide.authorAvatar,
  /** ISO publish timestamp — used by dynamic Viral Today / Discover priority */
  publishedAt: guide.publishedAt,
  status: guide.status,
  date: new Date(guide.publishedAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  image: guide.image,
  excerpt: guide.excerpt || '',
  type: guide.type,
  readTime: guide.readTime,
  views: guide.views ?? '0',
  shares: guide.shares || '0',
  category: guide.category ?? '',
  videoUrl: guide.videoUrl,
  duration: guide.duration,
  tags: guide.tags ?? [],
  productIds: guide.productIds ?? [],
  whatWeLike: guide.whatWeLike,
  whatToConsider: guide.whatToConsider,
  verdict: guide.verdict,
  seoTitle: guide.seoTitle,
  seoDescription: guide.seoDescription,
  seoKeywords: guide.seoKeywords,
  seoOgImage: guide.seoOgImage,
  seoCanonicalUrl: guide.seoCanonicalUrl,
});

export const isPlacementActive = (placement: CatalogPlacement): boolean => {
  if (!placement.isActive) return false;
  const now = Date.now();
  const start = Date.parse(placement.startDate);
  const end = Date.parse(placement.endDate);
  if (Number.isFinite(start) && now < start) return false;
  if (Number.isFinite(end) && now > end) return false;
  return true;
};
