import React from 'react';
import type { SpotlightPublisherPageSection } from '../../../types/spotlight/publisher/page';
import type { SpotlightImpressionCallbacks } from '../../../types/spotlight/homepage';
import { SpotlightContentCard } from '../experience/SpotlightContentCard';
import { PremiumCarousel } from '../../home/PremiumCarousel';
import { PublisherContributionCard } from './PublisherContributionCard';
import { ProductCard } from '../../ProductCard';
import { useGlobalState } from '../../../context/GlobalStateContext';

interface PublisherPageSectionProps {
  section: SpotlightPublisherPageSection;
  impressionCallbacks?: SpotlightImpressionCallbacks;
}

export function PublisherPageSection({ section, impressionCallbacks }: PublisherPageSectionProps) {
  const { allCatalogProducts } = useGlobalState();
  const products = section.productIds
    ?.map((id) => allCatalogProducts.find((p) => p.id === id))
    .filter(Boolean) ?? [];

  if (section.id === 'creator_collaborations' && section.contributions?.length) {
    return (
      <section className="mb-10 text-left">
        <h2 className="text-base font-semibold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">{section.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {section.contributions.map((c) => (
            <PublisherContributionCard key={c.contributionId} contribution={c} />
          ))}
        </div>
      </section>
    );
  }

  if (section.id === 'products' && products.length) {
    return (
      <section className="mb-10 text-left">
        <h2 className="text-base font-semibold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">{section.title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product!.id} product={product!} variant="grid" />
          ))}
        </div>
      </section>
    );
  }

  if (!section.items?.length) {
    if (section.id === 'about') {
      return (
        <section className="mb-10 text-left">
          <h2 className="text-base font-semibold text-[#1a1a2e] mb-4">{section.title}</h2>
          <p className="text-sm text-gray-500">Publisher profile and collaboration hub on Choosify Spotlight.</p>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="mb-10 text-left" aria-labelledby={`pub-section-${section.id}`}>
      <h2 id={`pub-section-${section.id}`} className="text-base font-semibold text-[#1a1a2e] mb-4 pb-2 border-b border-gray-100">
        {section.title}
      </h2>
      {section.items.length > 3 ? (
        <PremiumCarousel
          items={section.items.map((item) => ({ ...item, id: item.contentId }))}
          itemWidth={280}
          gap={16}
          renderCard={(item) => (
            <SpotlightContentCard content={item} impressionCallbacks={impressionCallbacks} variant="compact" />
          )}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {section.items.map((item) => (
            <SpotlightContentCard key={item.contentId} content={item} impressionCallbacks={impressionCallbacks} />
          ))}
        </div>
      )}
    </section>
  );
}

interface PublisherSectionNavProps {
  sections: SpotlightPublisherPageSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function PublisherSectionNav({ sections, activeId, onSelect }: PublisherSectionNavProps) {
  return (
    <nav className="flex flex-wrap gap-2 mb-8" aria-label="Publisher sections">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors ${
            activeId === s.id
              ? 'bg-[#E8500A] text-white border-[#E8500A]'
              : 'bg-white text-gray-500 border-[#e8edf2] hover:border-[#E8500A]/40'
          }`}
        >
          {s.title}
        </button>
      ))}
    </nav>
  );
}
