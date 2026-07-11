import type { SpotlightStoryGroup } from '../types/spotlight/discovery/story';
import type { SpotlightContent } from '../types/spotlight/experience/content';

export function buildDemoStoryGroups(allContent: SpotlightContent[]): SpotlightStoryGroup[] {
  const picks = allContent.slice(0, 6);
  return picks.map((content, i) => ({
    storyGroupId: `story-${content.contentId}`,
    publisherId: content.publisher.publisherId,
    publisherName: content.publisher.name,
    publisherAvatar: content.publisher.logoUrl,
    isVerified: content.publisher.isVerified,
    publishedAt: content.publishedAt,
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
    slides: [
      {
        slideId: `slide-${i}-1`,
        kind: content.media?.videoUrl ? 'video' : 'image',
        durationMs: 5000,
        mediaUrl: content.media?.videoUrl ?? content.media?.thumbnail,
        headline: content.headline,
        href: content.href,
      },
      ...(content.connections.productIds[0]
        ? [{
            slideId: `slide-${i}-2`,
            kind: 'product' as const,
            durationMs: 4000,
            entityId: content.connections.productIds[0],
            headline: 'Shop Now',
            ctaLabel: 'Buy',
            href: `/products/${content.connections.productIds[0]}`,
          }]
        : []),
      {
        slideId: `slide-${i}-cta`,
        kind: 'cta',
        durationMs: 3000,
        headline: content.ctaLabel,
        href: content.href,
        ctaLabel: content.ctaLabel,
      },
    ],
  }));
}
