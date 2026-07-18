import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { FAQ_ITEMS } from '../data/faq';
import { JsonLd } from './JsonLd';
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_DEFAULT_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_THEME_COLOR,
  SITE_TWITTER_HANDLE,
  STATIC_PAGE_SEO,
  buildOgImageUrl,
  formatPageTitle,
  shouldNoIndex,
  type SeoMeta,
} from '../lib/seoConfig';
import {
  buildCanonicalPath,
  buildCanonicalUrl,
  matchesRouteParam,
  resolveOgType,
} from '../lib/seoHelpers';
import { useBreadcrumbItems } from '../hooks/useBreadcrumbItems';
import {
  articleJsonLd,
  brandJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  productJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from '../lib/structuredData';

const PAGE_ID_BY_PATH: Record<string, string> = {
  '/': 'home',
  '/guides': 'guides',
  '/blogs': 'guides',
  '/spotlight': 'guides',
  '/creators': 'creators',
  '/products': 'products',
  '/brands': 'brands',
  '/deals': 'deals',
  '/categories': 'categories',
};

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLink(rel: string, href: string, attrs?: Record<string, string>) {
  const selector = attrs?.sizes
    ? `link[rel="${rel}"][sizes="${attrs.sizes}"]`
    : `link[rel="${rel}"]`;
  let link = document.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => link!.setAttribute(key, value));
  }
}

function resolveDynamicOgImage(meta: SeoMeta): string {
  if (meta.ogImage?.includes('/api/og')) return meta.ogImage;
  return buildOgImageUrl({
    title: meta.title.replace(/\s*\|\s*Choosify.*$/i, '').trim() || SITE_NAME,
    description: meta.description,
    type: meta.ogCardType || (meta.ogType === 'article' ? 'article' : meta.ogType === 'product' ? 'product' : 'default'),
    image: meta.entityImage || (meta.ogImage && !meta.ogImage.includes('logo.png') ? meta.ogImage : undefined),
    brand: meta.brandName,
    label: meta.label,
  });
}

function resolveMeta(
  pathname: string,
  search: string,
  siteConfig: ReturnType<typeof useGlobalState>['siteConfig'],
  state: ReturnType<typeof useGlobalState>,
): SeoMeta {
  const cmsPageId =
    PAGE_ID_BY_PATH[pathname] || pathname.replace(/^\//, '').split('/')[0] || 'home';
  const cmsEntry =
    siteConfig?.seoEntries?.find((item) => item.pageId === cmsPageId) ||
    siteConfig?.seoEntries?.find((item) => item.pageId === 'home');

  const staticMeta = STATIC_PAGE_SEO[pathname];
  if (staticMeta) {
    return {
      ...staticMeta,
      keywords: cmsEntry?.keywords || staticMeta.keywords,
      ogType: staticMeta.ogType || resolveOgType(pathname),
      entityImage: cmsEntry?.ogImage,
    };
  }

  const segments = pathname.split('/').filter(Boolean);
  const [section, id] = segments;

  if (section === 'products' && id) {
    const product = state.allProducts.find((p) => matchesRouteParam(p, id));
    const catalogId = (product as { catalogId?: string })?.catalogId;
    const detail = catalogId ? state.productDetailsById[catalogId] : undefined;
    const title =
      detail?.seoTitle ||
      (product as { seoTitle?: string; title?: string; name?: string })?.seoTitle ||
      (product as { title?: string; name?: string })?.title ||
      (product as { name?: string })?.name ||
      'Product';
    const description =
      detail?.seoDescription ||
      (product as { seoDescription?: string; description?: string })?.seoDescription ||
      (product as { description?: string })?.description ||
      `View ${title} on Choosify — verified product discovery for Bangladesh.`;
    const brandName =
      (product as { brand?: string; brandName?: string }).brand ||
      (product as { brandName?: string }).brandName;
    const entityImage = (product as { image?: string })?.image;
    return {
      title: formatPageTitle(title),
      description,
      ogType: 'product',
      ogCardType: 'product',
      brandName,
      entityImage,
      label: 'Product',
    };
  }

  if (section === 'brands' && id) {
    const brand = state.allBrands.find((b) => matchesRouteParam(b, id));
    const name = brand?.name || 'Brand';
    const description =
      (brand as { description?: string })?.description ||
      brand?.category ||
      `Explore ${name} on Choosify.`;
    return {
      title: formatPageTitle(name),
      description,
      ogType: 'website',
      ogCardType: 'brand',
      entityImage: brand?.logo,
      label: 'Brand',
    };
  }

  if (
    (section === 'guides' ||
      section === 'blogs' ||
      section === 'recommendations' ||
      section === 'spotlight' ||
      section === 'reviews') &&
    id
  ) {
    const guide = state.allGuides.find((g) => matchesRouteParam(g, id));
    const title = guide?.title || id.replace(/-/g, ' ');
    const description = guide?.excerpt || `Read ${title} on Choosify Discover.`;
    return {
      title: formatPageTitle(title),
      description,
      ogType: 'article',
      ogCardType: 'article',
      entityImage: guide?.image,
      label: 'Discover',
    };
  }

  if (section === 'creators' && id) {
    const creator = state.allCreators.find((c) => matchesRouteParam(c, id));
    const name = creator?.name || 'Creator';
    return {
      title: formatPageTitle(name),
      description: creator?.bio || `Follow ${name} on Choosify.`,
      ogType: 'website',
      ogCardType: 'creator',
      entityImage: creator?.avatar,
      label: 'Creator',
    };
  }

  if (pathname.startsWith('/categories') && new URLSearchParams(search).get('category')) {
    const slug = new URLSearchParams(search).get('category') || '';
    const category = state.allCategories.find(
      (item) => item.slug === slug || item.id === slug,
    );
    const name = category?.name || slug;
    return {
      title: formatPageTitle(name),
      description: category?.description || `Browse ${name} products and services on Choosify.`,
      ogCardType: 'category',
      label: 'Category',
    };
  }

  if (section === 'compare') {
    return STATIC_PAGE_SEO['/compare'];
  }

  if (cmsEntry?.title) {
    return {
      title: cmsEntry.title,
      description: cmsEntry.metaDescription || SITE_DEFAULT_DESCRIPTION,
      keywords: cmsEntry.keywords,
      entityImage: cmsEntry.ogImage,
      ogType: resolveOgType(pathname),
    };
  }

  return {
    title: SITE_TAGLINE,
    description: SITE_DEFAULT_DESCRIPTION,
    ogType: resolveOgType(pathname),
    ogCardType: 'default',
  };
}

export function PageSeo() {
  const { pathname, search } = useLocation();
  const state = useGlobalState();
  const { siteConfig } = state;

  const meta = useMemo(
    () => resolveMeta(pathname, search, siteConfig, state),
    [
      pathname,
      search,
      siteConfig,
      state.allProducts,
      state.allBrands,
      state.allGuides,
      state.allCreators,
      state.allCategories,
      state.productDetailsById,
    ],
  );

  const noindex = shouldNoIndex(pathname);
  const canonicalPath = buildCanonicalPath(pathname, search);
  const canonical = buildCanonicalUrl(pathname, search);
  const ogType = meta.ogType || resolveOgType(pathname);
  const ogImage = resolveDynamicOgImage(meta) || DEFAULT_OG_IMAGE;

  const breadcrumbs = useBreadcrumbItems();

  useEffect(() => {
    document.title = meta.title;
    setLink('canonical', canonical);
    setMeta('theme-color', SITE_THEME_COLOR);
    setMeta(
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    setMeta('description', meta.description);
    if (meta.keywords) setMeta('keywords', meta.keywords);
    setMeta('author', SITE_NAME);
    setMeta('application-name', SITE_NAME);

    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('og:locale', SITE_LOCALE, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:image:secure_url', ogImage, 'property');
    setMeta('og:image:width', String(OG_IMAGE_WIDTH), 'property');
    setMeta('og:image:height', String(OG_IMAGE_HEIGHT), 'property');
    setMeta('og:image:alt', meta.title, 'property');
    setMeta('og:image:type', 'image/png', 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', SITE_TWITTER_HANDLE);
    setMeta('twitter:creator', SITE_TWITTER_HANDLE);
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', ogImage);
    setMeta('twitter:image:alt', meta.title);

    // Messenger / WhatsApp rely on Open Graph; keep image large-card friendly
    setLink('image_src', ogImage);
  }, [meta, canonical, noindex, ogType, ogImage]);

  const structuredData = useMemo(() => {
    const blocks: Array<Record<string, unknown>> = [];

    if (pathname === '/') {
      blocks.push(organizationJsonLd(), websiteJsonLd());
    }

    blocks.push(breadcrumbJsonLd(breadcrumbs));

    const segments = pathname.split('/').filter(Boolean);
    const [section, id] = segments;

    if (section === 'products' && id) {
      const product = state.allProducts.find((p) => matchesRouteParam(p, id));
      if (product) {
        const name =
          (product as { title?: string; name?: string }).title ||
          (product as { name?: string }).name ||
          'Product';
        blocks.push(
          productJsonLd({
            name,
            description: (product as { description?: string }).description,
            image: (product as { image?: string }).image,
            url: canonicalPath,
            brand:
              (product as { brand?: string; brandName?: string }).brand ||
              (product as { brandName?: string }).brandName,
            price: (product as { price?: number }).price,
            sku: (product as { catalogId?: string }).catalogId,
            ratingValue: (product as { rating?: number }).rating,
            reviewCount: (product as { reviews?: number }).reviews,
          }),
        );
      }
    }

    if (section === 'brands' && id) {
      const brand = state.allBrands.find((b) => matchesRouteParam(b, id));
      if (brand) {
        blocks.push(
          brandJsonLd({
            name: brand.name || 'Brand',
            description: brand.category,
            logo: brand.logo,
            url: canonicalPath,
          }),
        );
      }
    }

    if (
      (section === 'guides' ||
        section === 'blogs' ||
        section === 'recommendations' ||
        section === 'spotlight' ||
        section === 'reviews') &&
      id
    ) {
      const guide = state.allGuides.find((g) => matchesRouteParam(g, id));
      if (guide) {
        blocks.push(
          articleJsonLd({
            title: guide.title,
            description: guide.excerpt,
            image: guide.image,
            url: canonicalPath,
            author: guide.author,
            datePublished: guide.date,
            dateModified: guide.date,
          }),
        );
      }
    }

    if (pathname === '/faq') {
      blocks.push(faqPageJsonLd(FAQ_ITEMS));
    }

    if (section === 'compare') {
      blocks.push(
        webPageJsonLd({
          name: 'Compare Products and Brands',
          url: canonicalPath,
          description: meta.description,
        }),
      );
    }

    return blocks;
  }, [pathname, canonicalPath, meta.description, breadcrumbs, state]);

  return (
    <>
      {structuredData.map((block, index) => (
        <JsonLd key={`${canonical}-${index}`} id={`${canonical}-${index}`} data={block} />
      ))}
    </>
  );
}
