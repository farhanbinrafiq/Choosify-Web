import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { FAQ_ITEMS } from '../data/faq';
import { JsonLd } from './JsonLd';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TAGLINE,
  STATIC_PAGE_SEO,
  shouldNoIndex,
  type SeoMeta,
} from '../lib/seoConfig';
import {
  buildBreadcrumbItems,
  buildCanonicalPath,
  buildCanonicalUrl,
  matchesRouteParam,
  resolveOgType,
} from '../lib/seoHelpers';
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

function setLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function setCanonical(url: string) {
  setLink('canonical', url);
}

function setRobots(noindex: boolean) {
  setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
}

function resolveMeta(
  pathname: string,
  search: string,
  siteConfig: ReturnType<typeof useGlobalState>['siteConfig'],
  state: ReturnType<typeof useGlobalState>,
): SeoMeta {
  const canonicalPath = buildCanonicalPath(pathname, search);
  const cmsPageId =
    PAGE_ID_BY_PATH[pathname] || pathname.replace(/^\//, '').split('/')[0] || 'home';
  const cmsEntry =
    siteConfig?.seoEntries?.find((item) => item.pageId === cmsPageId) ||
    siteConfig?.seoEntries?.find((item) => item.pageId === 'home');

  const staticMeta = STATIC_PAGE_SEO[pathname];
  if (staticMeta) {
    return {
      ...staticMeta,
      ogImage: cmsEntry?.ogImage || staticMeta.ogImage || DEFAULT_OG_IMAGE,
      keywords: cmsEntry?.keywords || staticMeta.keywords,
      ogType: staticMeta.ogType || resolveOgType(pathname),
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
      `View ${title} on Choosify.`;
    return {
      title: `${title} | Choosify`,
      description,
      ogImage: (product as { image?: string })?.image || DEFAULT_OG_IMAGE,
      ogType: 'product',
    };
  }

  if (section === 'brands' && id) {
    const brand = state.allBrands.find((b) => matchesRouteParam(b, id));
    const name = brand?.name || 'Brand';
    const description = brand?.category || `Explore ${name} on Choosify.`;
    return {
      title: `${name} | Choosify Brands`,
      description,
      ogImage: brand?.logo || DEFAULT_OG_IMAGE,
      ogType: 'website',
    };
  }

  if ((section === 'guides' || section === 'blogs' || section === 'recommendations') && id) {
    const guide = state.allGuides.find((g) => matchesRouteParam(g, id));
    const title = guide?.title || 'Guide';
    const description = guide?.excerpt || `Read ${title} on Choosify.`;
    return {
      title: `${title} | Choosify`,
      description,
      ogImage: guide?.image || DEFAULT_OG_IMAGE,
      ogType: 'article',
    };
  }

  if (section === 'creators' && id) {
    const creator = state.allCreators.find((c) => matchesRouteParam(c, id));
    const name = creator?.name || 'Creator';
    return {
      title: `${name} | Choosify Creators`,
      description: creator?.bio || `Follow ${name} on Choosify.`,
      ogImage: creator?.avatar || DEFAULT_OG_IMAGE,
      ogType: 'website',
    };
  }

  if (pathname.startsWith('/categories') && new URLSearchParams(search).get('category')) {
    const slug = new URLSearchParams(search).get('category') || '';
    const category = state.allCategories.find(
      (item) => item.slug === slug || item.id === slug,
    );
    const name = category?.name || slug;
    return {
      title: `${name} | Choosify Categories`,
      description: category?.description || `Browse ${name} products on Choosify.`,
      ogImage: DEFAULT_OG_IMAGE,
    };
  }

  if (section === 'compare') {
    return STATIC_PAGE_SEO['/compare'];
  }

  if (cmsEntry?.title) {
    return {
      title: cmsEntry.title,
      description: cmsEntry.metaDescription,
      keywords: cmsEntry.keywords,
      ogImage: cmsEntry.ogImage || DEFAULT_OG_IMAGE,
      ogType: resolveOgType(pathname),
    };
  }

  return {
    title: SITE_TAGLINE,
    description: "Bangladesh's smartest product discovery platform.",
    ogImage: DEFAULT_OG_IMAGE,
    ogType: resolveOgType(pathname),
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

  const breadcrumbLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    const segments = pathname.split('/').filter(Boolean);
    const [section, id] = segments;

    if (section === 'products' && id) {
      const product = state.allProducts.find((p) => matchesRouteParam(p, id));
      if (product) {
        labels[`/products/${id}`] =
          (product as { title?: string; name?: string }).title ||
          (product as { name?: string }).name ||
          'Product';
      }
    }

    if (section === 'brands' && id) {
      const brand = state.allBrands.find((b) => matchesRouteParam(b, id));
      if (brand) labels[`/brands/${id}`] = brand.name;
    }

    if ((section === 'guides' || section === 'blogs' || section === 'recommendations') && id) {
      const guide = state.allGuides.find((g) => matchesRouteParam(g, id));
      if (guide) labels[`/${section}/${id}`] = guide.title;
    }

    if (section === 'creators' && id) {
      const creator = state.allCreators.find((c) => matchesRouteParam(c, id));
      if (creator) labels[`/creators/${id}`] = creator.name;
    }

    const categorySlug = new URLSearchParams(search).get('category');
    if (categorySlug) {
      const category = state.allCategories.find(
        (item) => item.slug === categorySlug || item.id === categorySlug,
      );
      if (category) labels[`category:${categorySlug}`] = category.name;
    }

    return labels;
  }, [pathname, search, state.allProducts, state.allBrands, state.allGuides, state.allCreators, state.allCategories]);

  const breadcrumbs = useMemo(
    () => buildBreadcrumbItems(pathname, search, breadcrumbLabels),
    [pathname, search, breadcrumbLabels],
  );

  useEffect(() => {
    document.title = meta.title;
    setCanonical(canonical);
    setRobots(noindex);
    setMeta('description', meta.description);
    if (meta.keywords) setMeta('keywords', meta.keywords);

    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('og:locale', 'en_BD', 'property');
    setMeta('og:image', meta.ogImage || DEFAULT_OG_IMAGE, 'property');
    setMeta('og:image:alt', meta.title, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', '@choosifybd');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', meta.ogImage || DEFAULT_OG_IMAGE);
    setMeta('twitter:image:alt', meta.title);
  }, [meta, canonical, noindex, ogType]);

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

    if ((section === 'guides' || section === 'blogs' || section === 'recommendations') && id) {
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
