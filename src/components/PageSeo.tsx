import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';

const PAGE_ID_BY_PATH: Record<string, string> = {
  '/': 'home',
  '/guides': 'guides',
  '/creators': 'creators',
  '/products': 'products',
  '/brands': 'brands',
  '/deals': 'deals',
  '/categories': 'categories',
};

export function PageSeo() {
  const { pathname } = useLocation();
  const { siteConfig } = useGlobalState();

  useEffect(() => {
    const pageId = PAGE_ID_BY_PATH[pathname] || pathname.replace(/^\//, '').split('/')[0] || 'home';
    const entry =
      siteConfig?.seoEntries?.find((item) => item.pageId === pageId) ||
      siteConfig?.seoEntries?.find((item) => item.pageId === 'home');

    if (!entry?.title) return;

    document.title = entry.title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', entry.metaDescription);
    setMeta('keywords', entry.keywords);
    setMeta('og:title', entry.title, 'property');
    setMeta('og:description', entry.metaDescription, 'property');
    if (entry.ogImage) setMeta('og:image', entry.ogImage, 'property');

    if (entry.canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = entry.canonicalUrl;
    }
  }, [pathname, siteConfig]);

  return null;
}
