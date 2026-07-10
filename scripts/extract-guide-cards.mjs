import fs from 'node:fs';

const guides = fs.readFileSync('src/pages/GuidesPage.tsx', 'utf8');
const start = guides.indexOf('// Sub-component for Reel Story');
const end = guides.indexOf('export function GuidesPage()');
const body = guides.slice(start, end).trim();

const header = `import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Instagram, LucidePenTool, Play, Youtube } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CardEngagementStrip } from '../CardEngagementStrip';

`;

fs.mkdirSync('src/components/guide', { recursive: true });
fs.writeFileSync('src/components/guide/GuideMediaCards.tsx', `${header}${body}\n`);

const homeCard = `import type { HomeGuideCarouselKind } from '../../pages/HomePage';
import { HorizontalMediaCard, ReelCard } from './GuideMediaCards';

type HomeGuideCarouselSlide = {
  guide: any;
  kind: HomeGuideCarouselKind;
};

export function HomeGuideCarouselCard({ slide }: { slide: HomeGuideCarouselSlide }) {
  if (slide.kind === 'reels') {
    return <ReelCard guide={slide.guide} />;
  }
  return (
    <HorizontalMediaCard
      guide={slide.guide}
      badgeType={slide.kind === 'youtube' ? 'youtube' : 'blog'}
    />
  );
}
`;

fs.writeFileSync('src/components/guide/HomeGuideCarouselCard.tsx', homeCard);

const updatedGuides = guides.replace(body, "export { ReelCard, HorizontalMediaCard } from '../components/guide/GuideMediaCards';\n\n");
fs.writeFileSync('src/pages/GuidesPage.tsx', updatedGuides);
console.log('[extract-guide-cards] done');
