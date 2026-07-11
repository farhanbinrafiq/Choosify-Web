import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { getAllBrandPosts } from '../lib/brandPosts';
import { getSpotlightContentBySlug } from '../utils/spotlightContentResolver';
import { spotlightContentHref } from '../lib/spotlight/content';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

/** Redirect legacy guide/review URLs to unified Spotlight Content Page */
export function LegacyGuideContentRedirect() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const key = slug ?? id ?? '';
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();

  const sources = {
    catalog: allCatalogProducts,
    guides: allCatalogGuides,
    creators: allCreators,
    brandPosts: getAllBrandPosts(),
    brandLogos: BRAND_LOGOS,
  };

  const content = getSpotlightContentBySlug(key, sources);
  if (content) {
    return <Navigate to={content.href} replace />;
  }

  const guide = allCatalogGuides.find((g) => String(g.id) === key || String(g.slug) === key);
  const target = guide ? spotlightContentHref(String(guide.slug ?? guide.id)) : '/spotlight';
  return <Navigate to={target} replace />;
}
