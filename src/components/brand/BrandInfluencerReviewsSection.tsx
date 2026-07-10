import React, { lazy, Suspense } from 'react';
import { LoadingFallback } from '../LoadingFallback';

const InfluencerReviews = lazy(() =>
  import('../InfluencerReviews').then((module) => ({ default: module.InfluencerReviews })),
);

export function BrandInfluencerReviewsSection({
  brandName,
  brandLogo,
  fullWidth,
}: {
  brandName: string;
  brandLogo?: string;
  fullWidth?: boolean;
}) {
  const featuredReview = {
    image:
      'https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop',
    title: `${brandName} Creator Spotlight`,
    excerpt: `Dive deep into the fabric, longevity, and brand heritage of ${brandName}. Real-world creators share their personal daily style experiences.`,
    authorName:
      brandName === 'Apex'
        ? 'TECH REVIEW BD'
        : `${brandName.toUpperCase()} TALK BD`,
    authorSub: 'Dhaka Headquarters',
    authorLogo: brandLogo || brandName.substring(0, 2),
    badgeText: 'BRAND PARTNERSHIP',
  };

  const reviews = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      category: brandName === 'Apex' ? 'FOOTWEAR' : 'FASHION VIBES',
      title: `${brandName} Style & Creators Showcase`,
      authorName: 'Style Maven',
      authorHandle: '@stylemaven',
      authorAvatar: 'https://i.pravatar.cc/100?u=style',
      platform: 'Instagram' as const,
      aspectRatio: 'portrait' as const,
      videoUrl: 'https://www.youtube.com/embed/p17S_gQ2iV4?autoplay=1&mute=1',
      timeAgo: '12m ago',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=600&fit=crop',
      category: brandName === 'Apex' ? 'FOOTWEAR' : 'CASUAL WEAR',
      title: `${brandName} Seasonal Collection Review`,
      authorName: 'BB Fashion Talk',
      authorHandle: '@bbtalk',
      authorAvatar: 'https://i.pravatar.cc/100?u=bbtech',
      platform: 'YouTube' as const,
      aspectRatio: 'landscape' as const,
      videoUrl: 'https://www.youtube.com/embed/T68XW9Q-PqQ?autoplay=1&mute=1',
      timeAgo: '15h ago',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop',
      category: 'CREATOR OPINION',
      title: `Is ${brandName} the Best Local Brand in 2024?`,
      authorName: 'Avishek Mojumder',
      authorHandle: '@avishek',
      authorAvatar: 'https://i.pravatar.cc/100?u=avishek',
      platform: 'TikTok' as const,
      aspectRatio: 'portrait' as const,
      videoUrl: 'https://www.youtube.com/embed/bZha6f-Z35M?autoplay=1&mute=1',
      timeAgo: '1d ago',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=600&fit=crop',
      category: 'DEEP DIVE',
      title: `${brandName} — full brand breakdown`,
      authorName: 'Tech Review BD',
      authorHandle: '@techreviewbd',
      authorAvatar: 'TR',
      platform: 'YouTube' as const,
      aspectRatio: 'landscape' as const,
      videoUrl: 'https://www.youtube.com/embed/PjRreH0T_W4?autoplay=1&mute=1',
      timeAgo: '3d ago',
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
      category: 'STYLING',
      title: `How creators style ${brandName} daily`,
      authorName: 'Key Looks',
      authorHandle: '@keylooks',
      authorAvatar: 'KL',
      platform: 'Instagram' as const,
      aspectRatio: 'portrait' as const,
      videoUrl: 'https://www.youtube.com/embed/p17S_gQ2iV4?autoplay=1&mute=1',
      timeAgo: '5d ago',
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop',
      category: 'QUICK TAKE',
      title: `${brandName} in 60 seconds — honest take`,
      authorName: 'Daily Drop BD',
      authorHandle: '@dailydrop',
      authorAvatar: 'DD',
      platform: 'TikTok' as const,
      aspectRatio: 'portrait' as const,
      videoUrl: 'https://www.youtube.com/embed/bZha6f-Z35M?autoplay=1&mute=1',
      timeAgo: '1w ago',
    },
  ];

  return (
    <Suspense fallback={<LoadingFallback />}>
      <InfluencerReviews
        title="BRAND CAMPAIGN & INFLUENCERS"
        subtitle={`CREATOR EXPERIENCES WITH ${brandName.toUpperCase()}`}
        featuredReview={featuredReview}
        reviews={reviews}
        fullWidth
      />
    </Suspense>
  );
}
