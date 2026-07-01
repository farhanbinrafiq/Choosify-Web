import type {
  CatalogBrand,
  CatalogCategory,
  CatalogCreator,
  CatalogDeal,
  CatalogGuide,
  CatalogPlacement,
  CatalogProduct,
  CatalogProductDetail,
  HomepageConfig,
  SiteConfig,
} from '../types/catalog';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const rawError = await response.text();
    throw new Error(rawError || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const catalogApi = {
  listProducts: async (): Promise<CatalogProduct[]> => {
    const result = await request<{ data: CatalogProduct[] }>('/catalog/products');
    return result.data;
  },
  listBrands: async (): Promise<CatalogBrand[]> => {
    const result = await request<{ data: CatalogBrand[] }>('/catalog/brands');
    return result.data;
  },
  listCategories: async (): Promise<CatalogCategory[]> => {
    const result = await request<{ data: CatalogCategory[] }>('/catalog/categories');
    return result.data;
  },
  listDeals: async (): Promise<CatalogDeal[]> => {
    const result = await request<{ data: CatalogDeal[] }>('/catalog/deals');
    return result.data;
  },
  getHomepage: async (): Promise<{
    homepage: HomepageConfig;
    featuredProducts: CatalogProduct[];
    featuredBrands: CatalogBrand[];
    featuredDeals: CatalogDeal[];
    featuredCreators: CatalogCreator[];
    featuredGuides: CatalogGuide[];
  }> => request('/catalog/home'),

  getSiteConfig: async (): Promise<SiteConfig> => {
    const result = await request<{ site: SiteConfig }>('/catalog/site');
    return result.site;
  },

  listCreators: async (): Promise<CatalogCreator[]> => {
    const result = await request<{ data: CatalogCreator[] }>('/catalog/creators?status=live');
    return result.data;
  },

  listGuides: async (): Promise<CatalogGuide[]> => {
    const result = await request<{ data: CatalogGuide[] }>('/catalog/guides?status=live');
    return result.data;
  },

  getGuide: async (id: string): Promise<CatalogGuide | null> => {
    try {
      return await request<CatalogGuide>(`/catalog/guides/${id}`);
    } catch {
      return null;
    }
  },

  listPlacements: async (placement?: string): Promise<CatalogPlacement[]> => {
    const query = new URLSearchParams({ active: 'true' });
    if (placement) query.set('placement', placement);
    const result = await request<{ data: CatalogPlacement[] }>(`/catalog/placements?${query.toString()}`);
    return result.data;
  },

  getProductDetail: async (productId: string): Promise<CatalogProductDetail | null> => {
    try {
      return await request<CatalogProductDetail>(`/catalog/product-details/${productId}`);
    } catch {
      return null;
    }
  },
};
