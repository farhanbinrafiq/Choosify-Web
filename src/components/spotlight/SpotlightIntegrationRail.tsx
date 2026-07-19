import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { getAllBrandPosts } from '../../lib/brandPosts';
import { resolveSpotlightExperience } from '../../utils/spotlightContentResolver';
import { SpotlightContentCard } from './experience/SpotlightContentCard';
import { PremiumCarousel } from '../home/PremiumCarousel';

const BRAND_LOGOS: Record<string, string> = {
  Samsung: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80',
  Apple: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80',
};

interface SpotlightIntegrationRailProps {
  title?: string;
  subtitle?: string;
  /** Filter by brand id, category name, creator id, or product ids */
  brandId?: string;
  categoryName?: string;
  creatorId?: string;
  productIds?: string[];
  maxItems?: number;
  viewAllHref?: string;
  source?: 'homepage' | 'brand' | 'product' | 'category' | 'creator' | 'search';
}

export function SpotlightIntegrationRail({
  title = 'Spotlight',
  subtitle = 'Campaigns, live events, and announcements',
  brandId,
  categoryName,
  creatorId,
  productIds = [],
  maxItems = 8,
  viewAllHref = '/spotlight',
  source = 'homepage',
}: SpotlightIntegrationRailProps) {
  const { allCatalogProducts, allCatalogGuides, allCreators } = useGlobalState();

  const items = useMemo(() => {
    const all = resolveSpotlightExperience({
      catalog: allCatalogProducts,
      guides: allCatalogGuides,
      creators: allCreators,
      brandPosts: getAllBrandPosts(),
      brandLogos: BRAND_LOGOS,
    });

    return all
      .filter((c) => {
        if (brandId && !c.connections.brandIds.includes(String(brandId))) return false;
        if (creatorId && !c.connections.creatorIds.includes(String(creatorId)) && c.publisher.publisherId !== `creator-${creatorId}`) return false;
        if (categoryName && !c.connections.categoryIds.some((id) => id.toLowerCase().includes(categoryName.toLowerCase()))) {
          const hay = `${c.headline} ${c.description ?? ''}`.toLowerCase();
          if (!hay.includes(categoryName.toLowerCase())) return false;
        }
        if (productIds.length && !c.connections.productIds.some((id) => productIds.includes(id))) return false;
        return true;
      })
      .slice(0, maxItems);
  }, [allCatalogProducts, allCatalogGuides, allCreators, brandId, categoryName, creatorId, productIds, maxItems]);

  if (!items.length) return null;

  return (
    <section className="mt-8 border-t border-gray-100 pt-8" data-spotlight-source={source} aria-labelledby="spotlight-integration-rail">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div className="text-left">
          <h2 id="spotlight-integration-rail" className="text-base font-semibold text-[#1a1a2e]">{title}</h2>
          {subtitle && <p className="text-[12px] text-[#8a9bb0] mt-1">{subtitle}</p>}
        </div>
        <Link to={viewAllHref} className="text-xs font-bold uppercase text-[#EB4501] hover:underline shrink-0 inline-flex items-center gap-1">
          Explore <ChevronRight size={14} />
        </Link>
      </div>
      <PremiumCarousel
        items={items.map((i) => ({ ...i, id: i.contentId }))}
        itemWidth={280}
        gap={16}
        renderCard={(item) => (
          <SpotlightContentCard content={item} variant="compact" className="w-full" />
        )}
      />
    </section>
  );
}
