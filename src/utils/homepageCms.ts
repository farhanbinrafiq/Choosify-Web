import type { HomepageConfig, HomepageHeroBanner } from '../types/catalog';

export const isHomeSectionVisible = (homepageConfig: HomepageConfig | null, sectionId: string): boolean => {
  if (!homepageConfig?.sections?.length) return true;
  const section = homepageConfig.sections.find((item) => item.id === sectionId);
  return section ? section.isVisible : true;
};

export const getActiveHeroBanner = (homepageConfig: HomepageConfig | null): HomepageHeroBanner | null => {
  const banners = homepageConfig?.heroBanners?.filter((banner) => banner.isActive) ?? [];
  if (!banners.length) return null;
  return [...banners].sort((a, b) => a.order - b.order)[0];
};

export const getSectionItemIds = (homepageConfig: HomepageConfig | null, sectionId: string): string[] => {
  const section = homepageConfig?.sections?.find((item) => item.id === sectionId);
  return section?.itemIds ?? [];
};
