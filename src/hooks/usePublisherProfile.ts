import { useMemo } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { getAllBrandPosts } from '../lib/brandPosts';
import { findPublisherBySlug, buildPublisherTrustProfile } from '../utils/spotlightPublisherProfile';
import { buildPublisherPageModel } from '../utils/spotlightPublisherPage';
import { resolveSpotlightExperience } from '../utils/spotlightContentResolver';
import { listHomepageSpotlightCampaigns } from '../utils/spotlightHomepage';
import { buildCampaignCollaborationGraph } from '../utils/spotlightCollaborationEngine';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

export function usePublisherProfile(slug: string | undefined) {
  const { allCatalogBrands, allCreators, allCatalogProducts, allCatalogGuides } = useGlobalState();

  const profile = useMemo(() => {
    if (!slug) return undefined;
    return findPublisherBySlug(slug, allCatalogBrands, allCreators);
  }, [slug, allCatalogBrands, allCreators]);

  const trust = useMemo(
    () => (profile ? buildPublisherTrustProfile(profile) : undefined),
    [profile],
  );

  const brandPosts = useMemo(() => getAllBrandPosts(), []);

  const allContent = useMemo(
    () =>
      resolveSpotlightExperience({
        catalog: allCatalogProducts,
        guides: allCatalogGuides,
        creators: allCreators,
        brandPosts,
        brandLogos: BRAND_LOGOS,
      }),
    [allCatalogProducts, allCatalogGuides, allCreators, brandPosts],
  );

  const contributions = useMemo(() => {
    if (!profile) return [];
    const campaigns = listHomepageSpotlightCampaigns();
    return campaigns.flatMap((c) =>
      buildCampaignCollaborationGraph(c, allCatalogProducts, BRAND_LOGOS).contributions.filter(
        (contrib) => contrib.publisherId === profile.publisherId || contrib.publisherName === profile.name,
      ),
    );
  }, [profile, allCatalogProducts]);

  const products = useMemo(() => {
    if (!profile || profile.sourceKind !== 'brand') return [];
    return allCatalogProducts.filter((p) => p.brandId === profile.sourceId).slice(0, 12);
  }, [profile, allCatalogProducts]);

  const page = useMemo(() => {
    if (!profile) return undefined;
    return buildPublisherPageModel({ profile, allContent, contributions, products });
  }, [profile, allContent, contributions, products]);

  return { profile, trust, page, allContent };
}
