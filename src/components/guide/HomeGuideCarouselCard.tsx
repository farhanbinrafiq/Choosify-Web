import { HorizontalMediaCard, ReelCard } from './GuideMediaCards';

type HomeGuideCarouselKind = 'youtube' | 'reels' | 'blog';

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
