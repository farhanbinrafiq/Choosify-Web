import type {
  CatalogBrand,
  CatalogCreator,
  CatalogDeal,
  CatalogGuide,
  CatalogPlacement,
  CatalogProduct,
} from '../types/catalog';

export type ResolvedPlacement = {
  id: string;
  placementId: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  ctaLabel: string;
  isExternal: boolean;
  entityType: CatalogPlacement['entityType'];
};

type CatalogLookup = {
  products: CatalogProduct[];
  brands: CatalogBrand[];
  deals: CatalogDeal[];
  guides: CatalogGuide[];
  creators: CatalogCreator[];
};

const DEFAULT_SPONSORED_IMAGE =
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80';

function isImageUrl(value?: string): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value) || value.startsWith('/');
}

function pickEntityImage(...candidates: Array<string | undefined>): string {
  for (const candidate of candidates) {
    if (isImageUrl(candidate)) return candidate;
  }
  return DEFAULT_SPONSORED_IMAGE;
}

function findProduct(catalogs: CatalogLookup, entityId: string) {
  return catalogs.products.find(
    (item) => item.id === entityId || item.slug === entityId,
  );
}

function findBrand(catalogs: CatalogLookup, entityId: string) {
  return catalogs.brands.find(
    (item) => item.id === entityId || item.slug === entityId,
  );
}

function findGuide(catalogs: CatalogLookup, entityId: string) {
  return catalogs.guides.find(
    (item) => item.id === entityId || item.slug === entityId,
  );
}

function findCreator(catalogs: CatalogLookup, entityId: string) {
  return catalogs.creators.find(
    (item) => item.id === entityId || item.handle === entityId,
  );
}

export function resolvePlacementContent(
  placement: CatalogPlacement,
  catalogs: CatalogLookup,
): ResolvedPlacement | null {
  const product = placement.entityType === 'product'
    ? findProduct(catalogs, placement.entityId)
    : undefined;
  const brand = placement.entityType === 'brand'
    ? findBrand(catalogs, placement.entityId)
    : undefined;
  const guide = placement.entityType === 'guide'
    ? findGuide(catalogs, placement.entityId)
    : undefined;
  const creator = placement.entityType === 'creator'
    ? findCreator(catalogs, placement.entityId)
    : undefined;

  let href = '/advertise';
  let isExternal = false;
  let title = placement.title?.trim() || '';
  let subtitle: string | undefined;
  let image = placement.image?.trim() || '';
  let ctaLabel = 'Learn More';

  switch (placement.entityType) {
    case 'product': {
      if (!product && !title) return null;
      href = `/products/${product?.id ?? placement.entityId}`;
      title = title || product?.title || 'Featured Product';
      subtitle = subtitle ?? product?.brandName;
      image = pickEntityImage(image, product?.image);
      ctaLabel = 'Shop Now';
      break;
    }
    case 'brand': {
      if (!brand && !title) return null;
      href = `/brands/${brand?.id ?? placement.entityId}`;
      title = title || brand?.name || 'Featured Brand';
      subtitle = subtitle ?? brand?.category;
      image = pickEntityImage(image, brand?.logo);
      ctaLabel = 'View Brand';
      break;
    }
    case 'deal': {
      href = '/deals';
      title = title || 'Limited-Time Deal';
      ctaLabel = 'View Deals';
      if (product) {
        title = title || product.title;
        image = pickEntityImage(image, product.image);
        href = `/products/${product.id}`;
      }
      break;
    }
    case 'guide': {
      if (!guide && !title) return null;
      href = `/guides/${guide?.slug ?? guide?.id ?? placement.entityId}`;
      title = title || guide?.title || 'Featured Guide';
      subtitle = subtitle ?? guide?.author;
      image = pickEntityImage(image, guide?.image);
      ctaLabel = 'Read Guide';
      break;
    }
    case 'creator': {
      if (!creator && !title) return null;
      href = `/creators/${creator?.id ?? placement.entityId}`;
      title = title || creator?.name || 'Featured Creator';
      subtitle = subtitle ?? creator?.handle;
      image = pickEntityImage(image, creator?.avatar);
      ctaLabel = 'View Profile';
      break;
    }
    default:
      break;
  }

  if (!image) image = DEFAULT_SPONSORED_IMAGE;

  return {
    id: `placement-${placement.id}`,
    placementId: placement.id,
    title,
    subtitle,
    image,
    href,
    ctaLabel,
    isExternal,
    entityType: placement.entityType,
  };
}

export function buildFallbackPortraitPlacement(catalogs: CatalogLookup): ResolvedPlacement | null {
  const product =
    catalogs.products.find((item) => item.isDeal || item.featuredFlag) ??
    catalogs.products[0];
  const brand =
    catalogs.brands.find((item) => item.sponsoredFlag) ?? catalogs.brands[0];

  if (product) {
    return {
      id: 'fallback-portrait-product',
      placementId: 'fallback',
      title: product.title,
      subtitle: product.brandName,
      image: pickEntityImage(product.image),
      href: `/products/${product.id}`,
      ctaLabel: 'Shop Now',
      isExternal: false,
      entityType: 'product',
    };
  }

  if (brand) {
    return {
      id: 'fallback-portrait-brand',
      placementId: 'fallback',
      title: brand.name,
      subtitle: brand.category,
      image: pickEntityImage(brand.logo),
      href: `/brands/${brand.id}`,
      ctaLabel: 'View Brand',
      isExternal: false,
      entityType: 'brand',
    };
  }

  return null;
}

export function buildFallbackLandscapePlacement(catalogs: CatalogLookup): ResolvedPlacement | null {
  const brand =
    catalogs.brands.find((item) => item.sponsoredFlag) ?? catalogs.brands[0];

  if (!brand) return buildFallbackPortraitPlacement(catalogs);

  return {
    id: 'fallback-landscape-brand',
    placementId: 'fallback',
    title: brand.name,
    subtitle: brand.category,
    image: brand.logo,
    href: `/brands/${brand.id}`,
    ctaLabel: 'Shop Now',
    isExternal: false,
    entityType: 'brand',
  };
}
