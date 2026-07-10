import fs from 'node:fs';
import path from 'node:path';

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

// ── 1. HomePage carousels ─────────────────────────────────────────────
const homePath = 'src/pages/HomePage.tsx';
const home = fs.readFileSync(homePath, 'utf8');
const carouselMarker = 'interface TrendingBrandsCarouselProps';
const carouselIdx = home.indexOf(carouselMarker);
if (carouselIdx === -1) throw new Error('HomePage carousel marker not found');

const homeMain = `${home.slice(0, carouselIdx).trimEnd()}\n`;
const carouselChunk = home.slice(carouselIdx);
const premiumMarker = '// PREMIUM CAROUSEL HELPER';
const premiumIdx = carouselChunk.indexOf(premiumMarker);

const trendingBody = carouselChunk.slice(0, premiumIdx).trim();
const premiumBody = carouselChunk
  .slice(premiumIdx)
  .replace(premiumMarker, '')
  .replace(/^function PremiumCarousel/m, 'export function PremiumCarousel')
  .trim();

const trendingFile = `import React, { useState, useEffect } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

${trendingBody.replace(/^function TrendingBrandsCarousel/m, 'export function TrendingBrandsCarousel')}
`;

const premiumFile = `import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

${premiumBody}
`;

ensureDir('src/components/home/TrendingBrandsCarousel.tsx');
fs.writeFileSync('src/components/home/TrendingBrandsCarousel.tsx', trendingFile);
fs.writeFileSync('src/components/home/PremiumCarousel.tsx', premiumFile);

const homeImports = `import { TrendingBrandsCarousel } from '../components/home/TrendingBrandsCarousel';
import { PremiumCarousel } from '../components/home/PremiumCarousel';
`;
if (!homeMain.includes('TrendingBrandsCarousel')) {
  const insertAt = homeMain.indexOf("import { StudioWrap }");
  const updatedHome =
    homeMain.slice(0, insertAt) + homeImports + homeMain.slice(insertAt);
  fs.writeFileSync(homePath, updatedHome);
} else {
  fs.writeFileSync(homePath, homeMain);
}

// ── 2. CompareEngine mock data ────────────────────────────────────────
const comparePath = 'src/components/CompareEngine.tsx';
const compare = fs.readFileSync(comparePath, 'utf8');
const dataStart = compare.indexOf('// ==========================================\n// TYPE & INTERFACE');
const dataEnd = compare.indexOf('type CompareMode =');
const compareData = compare.slice(dataStart, dataEnd).trim();
const compareRest = compare.slice(0, dataStart) + compare.slice(dataEnd);

const compareDataFile = `${compareData.replace(
  'interface ComparisonItem',
  'export interface ComparisonItem',
).replace(
  'interface MetricRow',
  'export interface MetricRow',
).replace(
  'interface CompareSection',
  'export interface CompareSection',
).replace(
  /^const PRODUCT_ITEMS/m,
  'export const PRODUCT_ITEMS',
).replace(
  /^const BRAND_ITEMS/m,
  'export const BRAND_ITEMS',
).replace(
  /^const CREATOR_ITEMS/m,
  'export const CREATOR_ITEMS',
).replace(
  /^const GUIDE_ITEMS/m,
  'export const GUIDE_ITEMS',
).replace(
  /^const AI_ITEMS/m,
  'export const AI_ITEMS',
).replace(
  /^const COMPARE_SECTIONS/m,
  'export const COMPARE_SECTIONS',
)}
`;

ensureDir('src/components/compare/compareData.ts');
fs.writeFileSync('src/components/compare/compareData.ts', compareDataFile);

const compareImport = `import {
  PRODUCT_ITEMS,
  BRAND_ITEMS,
  CREATOR_ITEMS,
  GUIDE_ITEMS,
  AI_ITEMS,
  COMPARE_SECTIONS,
  type CompareMode,
  type ComparisonItem,
} from './compare/compareData';
`;
const compareHeaderEnd = compareRest.indexOf('export function CompareEngine');
const compareUpdated =
  compareRest.slice(0, dataStart) +
  compareImport +
  '\n' +
  compareRest.slice(compareHeaderEnd);
fs.writeFileSync(comparePath, compareUpdated);

// ── 3. Brand influencer section ───────────────────────────────────────
const brandPath = 'src/pages/BrandDetailPage.tsx';
let brand = fs.readFileSync(brandPath, 'utf8');
const tikTokStart = brand.indexOf('function TikTokIcon');
const tikTokEnd = brand.indexOf('import { LoadingFallback }');
const influencerStart = brand.indexOf('function WithInfluencerReviews');
const influencerEnd = brand.indexOf('export function BrandDetailPage');

const tikTokBlock = brand.slice(tikTokStart, tikTokEnd).trim();
const influencerBlock = brand
  .slice(influencerStart, influencerEnd)
  .replace(/^function WithInfluencerReviews/, 'export function BrandInfluencerReviewsSection')
  .trim();

fs.writeFileSync(
  'src/components/brand/TikTokIcon.tsx',
  `import React from 'react';\n\n${tikTokBlock.replace('function TikTokIcon', 'export function TikTokIcon')}\n`,
);

const influencerFile = `import React, { lazy, Suspense } from 'react';
import { LoadingFallback } from '../LoadingFallback';

const InfluencerReviews = lazy(() =>
  import('../InfluencerReviews').then((module) => ({ default: module.InfluencerReviews })),
);

${influencerBlock.replace('WithInfluencerReviews', 'BrandInfluencerReviewsSection')}
`;
ensureDir('src/components/brand/BrandInfluencerReviewsSection.tsx');
fs.writeFileSync('src/components/brand/BrandInfluencerReviewsSection.tsx', influencerFile);

brand =
  brand.slice(0, tikTokStart) +
  `import { TikTokIcon } from "../components/brand/TikTokIcon";\nimport { BrandInfluencerReviewsSection } from "../components/brand/BrandInfluencerReviewsSection";\n\n` +
  brand.slice(influencerEnd);
brand = brand.replace(/<WithInfluencerReviews/g, '<BrandInfluencerReviewsSection');
fs.writeFileSync(brandPath, brand);

// ── 4. Filter profiles ────────────────────────────────────────────────
const filterPath = 'src/components/FilterEngine.tsx';
const filter = fs.readFileSync(filterPath, 'utf8');
const profileStart = filter.indexOf('export const PRODUCTS_PAGE_FILTER_PROFILE');
const profileEnd = filter.indexOf('export function CustomPriceFilter');
const profiles = filter.slice(profileStart, profileEnd).trim();
fs.writeFileSync(
  'src/components/filter/filterProfiles.ts',
  `import type { FilterProfile } from '../FilterEngine';\n\n${profiles}\n`,
);
const filterUpdated =
  filter.slice(0, profileStart) +
  `export {\n  PRODUCTS_PAGE_FILTER_PROFILE,\n  DEALS_PAGE_FILTER_PROFILE,\n  CREATORS_PAGE_FILTER_PROFILE,\n} from './filter/filterProfiles';\n\n` +
  filter.slice(profileEnd);
fs.writeFileSync(filterPath, filterUpdated);

console.log('[le004-extract] complete');
