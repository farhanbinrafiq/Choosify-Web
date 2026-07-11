import React, { useMemo } from 'react';

import { ChoosifyCommerceMediaGallery } from '../../commerce/ChoosifyCommerceMediaGallery';

import { buildGuideGalleryItems, buildSpotlightContentGalleryItems } from '../../media/choosifyMediaAdapters';



export type SpotlightHeroVariant = 'portrait' | 'landscape' | 'image' | 'carousel' | 'live' | 'replay';



interface SpotlightContentHeroProps {

  guide: { title?: string; image?: string; videoUrl?: string; type?: string; category?: string };

  variant: SpotlightHeroVariant;

  liveEmbedUrl?: string;

  videoUrl?: string;

  posterImage?: string;

  headline?: string;

  media?: Parameters<typeof buildSpotlightContentGalleryItems>[0]['media'];

  live?: Parameters<typeof buildSpotlightContentGalleryItems>[0]['live'];

}



/** Spotlight Content Page hero — commerce media gallery (detail pages only) */

export function SpotlightContentHero({

  guide,

  variant,

  liveEmbedUrl,

  videoUrl,

  posterImage,

  headline,

  media,

  live,

}: SpotlightContentHeroProps) {

  const items = useMemo(() => {

    const contentItems = buildSpotlightContentGalleryItems({

      headline: headline ?? guide.title ?? 'Spotlight',

      media:

        media ??

        ({

          videoUrl: videoUrl ?? guide.videoUrl,

          thumbnail: posterImage ?? guide.image,

          mediaType:

            variant === 'portrait'

              ? 'vertical_video'

              : variant === 'live' || variant === 'replay' || variant === 'landscape'

                ? 'landscape_video'

                : undefined,

        } as NonNullable<Parameters<typeof buildSpotlightContentGalleryItems>[0]['media']>),

      live: live ?? (liveEmbedUrl ? { embedUrl: liveEmbedUrl } : undefined),

    });



    if (contentItems.length > 0 && !(contentItems.length === 1 && contentItems[0].url.includes('placeholder'))) {

      return contentItems;

    }



    return buildGuideGalleryItems({

      ...guide,

      videoUrl: videoUrl ?? guide.videoUrl,

      image: posterImage ?? guide.image,

      type: variant === 'portrait' ? 'reels' : guide.type,

    });

  }, [guide, variant, liveEmbedUrl, videoUrl, posterImage, headline, media, live]);



  return (

    <ChoosifyCommerceMediaGallery

      items={items}

      ariaLabel={`${headline ?? guide.title ?? 'Spotlight'} media gallery`}

    />

  );

}

