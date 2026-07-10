import fs from 'node:fs';
import path from 'node:path';

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function exportCompareData() {
  const comparePath = 'src/components/CompareEngine.tsx';
  const lines = fs.readFileSync(comparePath, 'utf8').split('\n');

  const dataLines = lines.slice(18, 559);
  let body = dataLines.join('\n');
  body = body
    .replace(/^interface ComparisonItem/m, 'export interface ComparisonItem')
    .replace(/^interface MetricRow/m, 'export interface MetricRow')
    .replace(/^interface CompareSection/m, 'export interface CompareSection')
    .replace(
      /^const (PRODUCT_ITEMS|BRAND_ITEMS|CREATOR_ITEMS|GUIDE_ITEMS|AIS_ITEMS|PRODUCT_SECTIONS|BRAND_SECTIONS|CREATOR_SECTIONS|GUIDE_SECTIONS|AIS_SECTIONS)/gm,
      'export const $1',
    );

  const header = `import React from 'react';
import {
  CreditCard,
  Star,
  Layers,
  Truck,
  ShieldCheck,
  Scale,
  Users,
  Activity,
  BookOpen,
  Sparkles,
} from 'lucide-react';

`;

  const footer = `\nexport type CompareMode = 'product' | 'brand' | 'creator' | 'guide' | 'ai';\n`;

  ensureDir('src/components/compare/compareData.tsx');
  fs.writeFileSync('src/components/compare/compareData.tsx', header + body + footer);

  const importBlock = `import {
  BRAND_ITEMS,
  CREATOR_ITEMS,
  GUIDE_ITEMS,
  AIS_ITEMS,
  PRODUCT_SECTIONS,
  BRAND_SECTIONS,
  CREATOR_SECTIONS,
  GUIDE_SECTIONS,
  AIS_SECTIONS,
  type CompareMode,
} from './compare/compareData';
`;

  const updated = [...lines.slice(0, 18), importBlock, '', ...lines.slice(561)].join('\n');
  fs.writeFileSync(comparePath, updated);
}

function exportFilterProfiles() {
  const filterPath = 'src/components/FilterEngine.tsx';
  const filter = fs.readFileSync(filterPath, 'utf8');
  const start = filter.indexOf('export const PRODUCTS_PAGE_FILTER_PROFILE');
  const end = filter.indexOf('// ==========================================\n// LAYER 3: DEDICATED CUSTOM PRICE FILTER');
  if (start === -1 || end === -1) throw new Error('Filter profile markers not found');

  const profiles = filter.slice(start, end).trim();
  ensureDir('src/components/filter/filterProfiles.ts');
  fs.writeFileSync(
    'src/components/filter/filterProfiles.ts',
    `import type { FilterProfile } from '../FilterEngine';\n\n${profiles}\n`,
  );

  const reexport = `export {
  PRODUCTS_PAGE_FILTER_PROFILE,
  DEALS_PAGE_FILTER_PROFILE,
  CREATORS_PAGE_FILTER_PROFILE,
} from './filter/filterProfiles';

`;
  fs.writeFileSync(filterPath, filter.slice(0, start) + reexport + filter.slice(end));
}

function exportBrandComponents() {
  const brandPath = 'src/pages/BrandDetailPage.tsx';
  let brand = fs.readFileSync(brandPath, 'utf8');

  const tikTokStart = brand.indexOf('function TikTokIcon');
  const loadingImport = brand.indexOf('import { LoadingFallback }');
  const influencerStart = brand.indexOf('function WithInfluencerReviews');
  const pageStart = brand.indexOf('export function BrandDetailPage');

  if ([tikTokStart, loadingImport, influencerStart, pageStart].some((i) => i === -1)) {
    throw new Error('BrandDetailPage extraction markers not found');
  }

  const tikTokBlock = brand
    .slice(tikTokStart, loadingImport)
    .trim()
    .replace('function TikTokIcon', 'export function TikTokIcon');

  ensureDir('src/components/brand/TikTokIcon.tsx');
  fs.writeFileSync('src/components/brand/TikTokIcon.tsx', `import React from 'react';\n\n${tikTokBlock}\n`);

  const influencerBlock = brand
    .slice(influencerStart, pageStart)
    .trim()
    .replace('function WithInfluencerReviews', 'export function BrandInfluencerReviewsSection');

  const influencerFile = `import React, { lazy, Suspense } from 'react';
import { LoadingFallback } from '../LoadingFallback';

const InfluencerReviews = lazy(() =>
  import('../InfluencerReviews').then((module) => ({ default: module.InfluencerReviews })),
);

${influencerBlock}
`;

  ensureDir('src/components/brand/BrandInfluencerReviewsSection.tsx');
  fs.writeFileSync('src/components/brand/BrandInfluencerReviewsSection.tsx', influencerFile);

  const beforeTikTok = brand.slice(0, tikTokStart);
  const afterInfluencer = brand.slice(pageStart);
  const importBlock = `import { TikTokIcon } from "../components/brand/TikTokIcon";
import { BrandInfluencerReviewsSection } from "../components/brand/BrandInfluencerReviewsSection";

`;

  brand = beforeTikTok + importBlock + afterInfluencer;
  brand = brand.replace(/<WithInfluencerReviews/g, '<BrandInfluencerReviewsSection');
  brand = brand.replace(/import \{ LoadingFallback \}[^\n]+\n/g, '');
  brand = brand.replace(
    /const InfluencerReviews = lazy\(\(\) =>[\s\S]*?\);\n\n/g,
    '',
  );

  fs.writeFileSync(brandPath, brand);
}

function fixHomePageImports() {
  const homePath = 'src/pages/HomePage.tsx';
  let home = fs.readFileSync(homePath, 'utf8');
  if (!home.includes("from '../components/home/TrendingBrandsCarousel'")) {
    const marker = "import { StudioWrap }";
    const imports = `import { TrendingBrandsCarousel } from '../components/home/TrendingBrandsCarousel';
import { PremiumCarousel } from '../components/home/PremiumCarousel';
`;
    home = home.replace(marker, imports + marker);
    fs.writeFileSync(homePath, home);
  }
}

function fixTrendingCarouselType() {
  const filePath = 'src/components/home/TrendingBrandsCarousel.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    "import type { NavigateFunction } from 'react-router-dom';",
    "import { useNavigate } from 'react-router-dom';",
  );
  fs.writeFileSync(filePath, content);
}

exportCompareData();
exportFilterProfiles();
exportBrandComponents();
fixHomePageImports();
fixTrendingCarouselType();

// Remove empty compareData.ts if present from failed run
if (fs.existsSync('src/components/compare/compareData.ts')) {
  fs.unlinkSync('src/components/compare/compareData.ts');
}

console.log('[le004-extract-safe] complete');
