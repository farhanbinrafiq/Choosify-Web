import { MOCK_BRAND_POSTS } from '../data/mockBrandPosts';
import { catalogApi } from '../services/catalogApi';
import type { CatalogBrandPost } from '../types/catalog';
import type { BrandPost, BrandPostKind } from '../types/brandPost';

const now = () => Date.now();

let cachedPosts: BrandPost[] | null = null;

function mapCatalogBrandPost(post: CatalogBrandPost): BrandPost {
  return {
    id: post.id,
    slug: post.slug,
    brandId: Number(post.brandId) || 0,
    brandName: post.brandName,
    brandLogo: post.brandLogo,
    kind: post.kind,
    title: post.title,
    excerpt: post.excerpt,
    heroImage: post.heroImage,
    bannerImages: post.bannerImages,
    body: post.body,
    startDate: post.startDate,
    endDate: post.endDate,
    location: post.location,
    ctaLabel: post.ctaLabel,
    ctaUrl: post.ctaUrl,
    linkedProductIds: post.linkedProductIds?.map((id) => Number(id) || 0),
    sponsored: post.sponsored,
    status: post.status,
    publishedAt: post.publishedAt,
  };
}

export async function hydrateBrandPostsFromApi(): Promise<BrandPost[]> {
  try {
    const rows = await catalogApi.listBrandPosts();
    if (rows.length > 0) {
      cachedPosts = rows.map(mapCatalogBrandPost);
      return cachedPosts;
    }
  } catch (error) {
    console.warn('[brandPosts] Catalog API unavailable, using mock fallback.', error);
  }
  cachedPosts = MOCK_BRAND_POSTS;
  return cachedPosts;
}

function isVisible(post: BrandPost): boolean {
  if (post.status === 'expired') return false;
  if (post.endDate && new Date(post.endDate).getTime() < now()) return false;
  return post.status === 'live' || post.status === 'scheduled';
}

export function getAllBrandPosts(): BrandPost[] {
  return (cachedPosts ?? MOCK_BRAND_POSTS).filter(isVisible);
}

export function getBrandPostBySlug(slug: string): BrandPost | undefined {
  return (cachedPosts ?? MOCK_BRAND_POSTS).find((post) => post.slug === slug);
}

export function getBrandPostsByBrandId(brandId: number): BrandPost[] {
  return getAllBrandPosts()
    .filter((post) => post.brandId === brandId)
    .sort((a, b) => {
      const aTime = a.startDate ? new Date(a.startDate).getTime() : 0;
      const bTime = b.startDate ? new Date(b.startDate).getTime() : 0;
      return aTime - bTime;
    });
}

export function filterBrandPosts(options?: {
  kind?: BrandPostKind | 'all';
  query?: string;
  brandId?: number;
}): BrandPost[] {
  const q = options?.query?.trim().toLowerCase() ?? '';
  return getAllBrandPosts()
    .filter((post) => {
      if (options?.brandId != null && post.brandId !== options.brandId) return false;
      if (options?.kind && options.kind !== 'all' && post.kind !== options.kind) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.brandName.toLowerCase().includes(q) ||
        post.location?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function formatBrandPostDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatBrandPostDateRange(start?: string, end?: string): string {
  if (!start && !end) return '';
  if (start && !end) return formatBrandPostDate(start);
  if (start && end) {
    return `${formatBrandPostDate(start)} – ${formatBrandPostDate(end)}`;
  }
  return formatBrandPostDate(end);
}

/** Resolve edge-to-edge detail banners — supports one or many sponsor photos */
export function getBrandPostBannerImages(post: BrandPost): string[] {
  const fromBanners = post.bannerImages?.filter(Boolean) ?? [];
  if (fromBanners.length > 0) return fromBanners;
  return post.heroImage ? [post.heroImage] : [];
}
