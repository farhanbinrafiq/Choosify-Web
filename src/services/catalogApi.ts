import type {
  CatalogBrand,
  CatalogCategory,
  CatalogDeal,
  CatalogProduct,
  HomepageConfig,
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
  }> => request('/catalog/home'),
};
