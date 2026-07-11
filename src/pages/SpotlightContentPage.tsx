import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { getAllBrandPosts } from '../lib/brandPosts';
import { getSpotlightContentBySlug } from '../utils/spotlightContentResolver';
import {
  resolveHeroVariant,
  spotlightContentToGuideShape,
} from '../utils/spotlightMixedFeed';
import { GuideDetailPage } from './GuideDetailPage';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

/**
 * Universal Spotlight Content Page — restored Guide Details layout with adaptive hero only.
 */
export function SpotlightContentPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();

  const sources = useMemo(
    () => ({
      catalog: allCatalogProducts,
      guides: allCatalogGuides,
      creators: allCreators,
      brandPosts: getAllBrandPosts(),
      brandLogos: BRAND_LOGOS,
    }),
    [allCatalogProducts, allCatalogGuides, allCreators],
  );

  const content = useMemo(() => getSpotlightContentBySlug(slug, sources), [slug, sources]);

  const catalogGuide = useMemo(() => {
    if (!content) return undefined;
    return allCatalogGuides.find(
      (g) => String(g.id) === String(content.sourceId) || g.slug === content.slug,
    );
  }, [content, allCatalogGuides]);

  const guideShape = useMemo(() => {
    if (!content) return undefined;
    return spotlightContentToGuideShape(content, catalogGuide);
  }, [content, catalogGuide]);

  const heroVariant = content ? resolveHeroVariant(content) : undefined;

  if (!content || !guideShape) {
    return (
      <div className="min-h-screen bg-choosify-feed flex flex-col items-center justify-center p-8 text-center">
        <Megaphone size={32} className="text-gray-300 mb-4" />
        <h1 className="text-xl font-black text-navy uppercase italic mb-2">Content Not Found</h1>
        <p className="text-sm text-gray-500 mb-6">This Spotlight content may have moved or is no longer available.</p>
        <Link to="/spotlight" className="text-[#E8500A] text-xs font-bold uppercase tracking-widest hover:underline">
          Browse Spotlight
        </Link>
      </div>
    );
  }

  return (
    <GuideDetailPage
      guideIdOverride={String(guideShape.id)}
      spotlightGuideOverride={guideShape}
      spotlightHeroVariant={heroVariant}
      spotlightLiveEmbedUrl={content.live?.embedUrl}
      spotlightVideoUrl={content.media?.videoUrl ?? content.live?.replayUrl}
      spotlightPosterImage={
        content.media?.posterImage ??
        content.media?.thumbnail ??
        content.media?.previewImage
      }
      backHref="/spotlight"
      backLabel="Back to Spotlight"
    />
  );
}
