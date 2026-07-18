/**
 * Product hero — Choosify.dc.html sliver gallery (detail pages only)
 */
import React from 'react';
import { DetailSliverMediaGallery } from './commerce/DetailSliverMediaGallery';
import { buildProductGalleryItems } from './media/choosifyMediaAdapters';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export function getProductMedia(product: any, selectedVariantImage?: string): MediaItem[] {
  const mainImg = selectedVariantImage || product.image || PLACEHOLDER_IMAGE;
  const isTechOrMobile = product.category?.toLowerCase().includes('tech') || 
                        product.category?.toLowerCase().includes('mobile') ||
                        product.category?.toLowerCase().includes('phone') ||
                        product.category?.toLowerCase().includes('gaming') ||
                        product.category?.toLowerCase().includes('appliance');
  
  const isFashion = product.category?.toLowerCase().includes('fashion') || 
                    product.category?.toLowerCase().includes('lifestyle') ||
                    product.category?.toLowerCase().includes('jewelry');

  if (isTechOrMobile) {
    return [
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-taking-photos-with-a-smartphone-34356-large.mp4' },
      { type: 'image', url: mainImg },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=800&fit=crop' },
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-virtual-reality-glasses-4384-large.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=800&fit=crop' }
    ];
  } else if (isFashion) {
    return [
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-pair-of-new-athletic-shoes-42999-large.mp4' },
      { type: 'image', url: mainImg },
      { type: 'image', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop' },
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-man-putting-on-designer-sneakers-42998-large.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&h=800&fit=crop' }
    ];
  } else {
    return [
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-serving-coffee-from-a-french-press-coffee-maker-41223-large.mp4' },
      { type: 'image', url: mainImg },
      { type: 'image', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop' },
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-dripping-fresh-beverage-41224-large.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop' }
    ];
  }
}

interface ProductMediaGalleryProps {
  product: any;
  selectedVariantImage?: string;
  showAddVideo?: boolean;
  onAddVideo?: () => void;
}

export function ProductMediaGallery({
  product,
  selectedVariantImage,
  showAddVideo,
  onAddVideo,
}: ProductMediaGalleryProps) {
  const items = buildProductGalleryItems({
    ...product,
    image: selectedVariantImage || product.image,
  });

  return (
    <DetailSliverMediaGallery
      items={items}
      ariaLabel={`${product.title ?? 'Product'} media gallery`}
      showAddVideo={showAddVideo}
      onAddVideo={onAddVideo}
    />
  );
}
