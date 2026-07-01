import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { JsonLd } from './JsonLd';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TAGLINE,
  STATIC_PAGE_SEO,
  absoluteUrl,
  shouldNoIndex,
  type SeoMeta,
} from '../lib/seoConfig';
import {
  articleJsonLd,
  brandJsonLd,
  breadcrumbJsonLd,
  organizationJsonLd,
  productJsonLd,
  websiteJsonLd,
} from '../lib/structuredData';

const PAGE_ID_BY_PATH: Record<string, string> = {
  '/': 'home',
  '/guides': 'guides',
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

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

function setRobots(noindex: boolean) {
  setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
}

function resolveMeta(pathname: string, siteConfig: ReturnType<typeof useGlobalState>['siteConfig'], state: ReturnType<typeof useGlobalState>): SeoMeta {
  const cmsPageId = PAGE_ID_BY_PATH[pathname] || pathname.replace(/^\//, '').split('/')[0] || 'home';
  const cmsEntry =
    siteConfig?.seoEntries?.find((item) => item.pageId === cmsPageId) ||
    siteConfig?.seoEntries?.find((item) => item.pageId === 'home');

  const staticMeta = STATIC_PAGE_SEO[pathname];
  if (staticMeta) {
    return {
      ...staticMeta,
      ogImage: cmsEntry?.ogImage || staticMeta.ogImage || DEFAULT_OG_IMAGE,
      keywords: cmsEntry?.keywords || staticMeta.keywords,
    };
  }

  const segments = pathname.split('/').filter(Boolean);
  const [section, id] = segments;

  if (section === 'products' && id) {
    const product = state.allProducts.find(
      (p) => String(p.id) === id || String((p as { catalogId?: string }).catalogId) === id,
    );
    const title =
      (product as { seoTitle?: string; title?: string; name?: string })?.seoTitle ||
      (product as { title?: string; name?: string })?.title ||
      (product as { name?: string })?.name ||
      'Product';
    const description =
      (product as { seoDescription?: string; description?: string })?.seoDescription ||
      (product as { description?: string })?.description ||
      `View ${title} on Choosify.`;
    return {
      title: `${title} | Choosify`,
      description,
      ogImage: (product as { image?: string })?.image || DEFAULT_OG_IMAGE,
    };
  }

  if (section === 'brands' && id) {
    const brand = state.allBrands.find((b) => String(b.id) === id);
    const name = brand?.name || 'Brand';
    const description = brand?.category || `Explore ${name} on Choosify.`;
    return {
      title: `${name} | Choosify Brands`,
      description,
      ogImage: brand?.logo || DEFAULT_OG_IMAGE,
    };
  }

  if ((section === 'guides' || section === 'recommendations') && id) {
    const guide = state.allGuides.find((g) => String(g.id) === id || ('slug' in g && g.slug === id));
    const title = guide?.title || 'Guide';
    const description = guide?.excerpt || `Read ${title} on Choosify.`;
    return {
      title: `${title} | Choosify`,
      description,
      ogImage: guide?.image || DEFAULT_OG_IMAGE,
    };
  }

  if (section === 'creators' && id) {
    const creator = state.allCreators.find((c) => String(c.id) === id);
    const name = creator?.name || 'Creator';
    return {
      title: `${name} | Choosify Creators`,
      description: creator?.bio || `Follow ${name} on Choosify.`,
      ogImage: creator?.avatar || DEFAULT_OG_IMAGE,
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
    };
  }

  return {
    title: SITE_TAGLINE,
    description: "Bangladesh's smartest product discovery platform.",
    ogImage: DEFAULT_OG_IMAGE,
  };
}

function buildBreadcrumbs(pathname: string): Array<{ name: string; path: string }> {
  const crumbs = [{ name: 'Home', path: '/' }];
  const segments = pathname.split('/').filter(Boolean);
  let current = '';
  for (const segment of segments) {
    current += `/${segment}`;
    const label = segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ name: label, path: current });
  }
  return crumbs;
}

export function PageSeo() {
  const { pathname } = useLocation();
  const state = useGlobalState();
  const { siteConfig } = state;

  const meta = useMemo(
    () => resolveMeta(pathname, siteConfig, state),
    [pathname, siteConfig, state.allProducts, state.allBrands, state.allGuides, state.allCreators],
  );

  const noindex = shouldNoIndex(pathname);
  const canonical = absoluteUrl(pathname);

  useEffect(() => {
    document.title = meta.title;
    setCanonical(canonical);
    setRobots(noindex);
    setMeta('description', meta.description);
    if (meta.keywords) setMeta('keywords', meta.keywords);

    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:type', pathname === '/' ? 'website' : 'article', 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('og:image', meta.ogImage || DEFAULT_OG_IMAGE, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', meta.ogImage || DEFAULT_OG_IMAGE);
  }, [meta, pathname, canonical, noindex]);

  const structuredData = useMemo(() => {
    const blocks: Array<Record<string, unknown>> = [organizationJsonLd(), websiteJsonLd()];
    if (pathname !== '/') {
      blocks.push(breadcrumbJsonLd(buildBreadcrumbs(pathname)));
    }

    const segments = pathname.split('/').filter(Boolean);
    const [section, id] = segments;

    if (section === 'products' && id) {
      const product = state.allProducts.find(
        (p) => String(p.id) === id || String((p as { catalogId?: string }).catalogId) === id,
      );
      if (product) {
        blocks.push(
          productJsonLd({
            name: (product as { title?: string; name?: string }).title || (product as { name?: string }).name || 'Product',
            description: (product as { description?: string }).description,
            image: (product as { image?: string }).image,
            url: pathname,
            brand: (product as { brand?: string; brandName?: string }).brand || (product as { brandName?: string }).brandName,
            price: (product as { price?: number }).price,
          }),
        );
      }
    }

    if (section === 'brands' && id) {
      const brand = state.allBrands.find((b) => String(b.id) === id);
      if (brand) {
        blocks.push(
          brandJsonLd({
            name: brand.name || 'Brand',
            description: brand.category,
            logo: brand.logo,
            url: pathname,
          }),
        );
      }
    }

    if ((section === 'guides' || section === 'recommendations') && id) {
      const guide = state.allGuides.find((g) => String(g.id) === id || ('slug' in g && g.slug === id));
      if (guide) {
        blocks.push(
          articleJsonLd({
            title: guide.title,
            description: guide.excerpt,
            image: guide.image,
            url: pathname,
            author: guide.author,
            datePublished: guide.date,
            dateModified: guide.date,
          }),
        );
      }
    }

    if (section === 'compare') {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Compare Products and Brands',
        url: canonical,
        description: meta.description,
      });
    }

    return blocks;
  }, [pathname, canonical, meta.description, state]);

  return (
    <>
      {structuredData.map((block, index) => (
        <JsonLd key={`${pathname}-${index}`} id={`${pathname}-${index}`} data={block} />
      ))}
    </>
  );
}
