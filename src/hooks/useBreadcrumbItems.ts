import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { getBrandPostBySlug } from '../lib/brandPosts';
import {
  buildBreadcrumbItems,
  matchesRouteParam,
  type BreadcrumbItem,
} from '../lib/seoHelpers';

/** Resolve breadcrumb trail from the current route + catalog entities */
export function useBreadcrumbItems(extraLabels: Record<string, string> = {}): BreadcrumbItem[] {
  const { pathname, search } = useLocation();
  const state = useGlobalState();

  return useMemo(() => {
    const labels: Record<string, string> = { ...extraLabels };
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

    if (section === 'whats-on' && id) {
      const post = getBrandPostBySlug(id);
      if (post) labels[`/whats-on/${id}`] = post.title;
    }

    const categorySlug = new URLSearchParams(search).get('category');
    if (categorySlug) {
      const category = state.allCategories.find(
        (item) => item.slug === categorySlug || item.id === categorySlug,
      );
      if (category) labels[`category:${categorySlug}`] = category.name;
    }

    return buildBreadcrumbItems(pathname, search, labels);
  }, [
    pathname,
    search,
    extraLabels,
    state.allProducts,
    state.allBrands,
    state.allGuides,
    state.allCreators,
    state.allCategories,
  ]);
}
