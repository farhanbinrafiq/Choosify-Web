import fs from 'node:fs';

const src = fs.readFileSync('src/constants.ts', 'utf8');
const products = src.match(/export const PRODUCTS = \[([\s\S]*?)\];/)[0];
const brands = src.match(/export const BRANDS = \[([\s\S]*?)\];/)[0];
const blogs = src.match(/export const BLOGS = \[([\s\S]*?)\];/)[0];

fs.writeFileSync(
  'src/data/mockProducts.ts',
  `/** Legacy mock catalog — lazy-loaded to keep main bundle lean. */\n${products}\n`,
);
fs.writeFileSync(
  'src/data/mockBrands.ts',
  `/** Legacy mock brands — lazy-loaded to keep main bundle lean. */\n${brands}\n`,
);
fs.writeFileSync(
  'src/data/mockBlogs.ts',
  `/** Legacy mock guides — lazy-loaded to keep main bundle lean. */\n${blogs}\n`,
);
fs.writeFileSync(
  'src/constants.ts',
  `export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&h=800&fit=crop';

export { CATEGORIES } from './data/categories';

export { PRODUCTS } from './data/mockProducts';
export { BRANDS } from './data/mockBrands';
export { BLOGS } from './data/mockBlogs';
`,
);

console.log('[split-mock-catalog] done');
