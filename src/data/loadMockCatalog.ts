/** Lazy-loaded legacy mock catalog — kept out of the main bundle. */

let mockCatalogPromise: Promise<{
  products: typeof import('./mockProducts').PRODUCTS;
  brands: typeof import('./mockBrands').BRANDS;
  blogs: typeof import('./mockBlogs').BLOGS;
}> | null = null;

export function loadMockCatalog() {
  if (!mockCatalogPromise) {
    mockCatalogPromise = Promise.all([
      import('./mockProducts'),
      import('./mockBrands'),
      import('./mockBlogs'),
    ]).then(([productsModule, brandsModule, blogsModule]) => ({
      products: productsModule.PRODUCTS,
      brands: brandsModule.BRANDS,
      blogs: blogsModule.BLOGS,
    }));
  }
  return mockCatalogPromise;
}
