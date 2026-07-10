/**
 * Universal Spotlight Media Engine — LE-005.2
 * Reusable across Spotlight, Product, Brand, Category, and future Creator modules.
 */

export * from './types';
export * from './utils/aspectRatio';
export * from './utils/classifyMedia';
export * from './validators/mediaValidation';
export * from './hooks/useMediaCarousel';
export * from './hooks/useMediaPlayback';
export { MediaRenderer, renderMedia } from './renderers/MediaRenderer';
export type { MediaRendererProps } from './renderers/MediaRenderer';
export { VideoRenderer } from './renderers/VideoRenderer';
export { ImageRenderer } from './renderers/ImageRenderer';
export { CarouselRenderer } from './renderers/CarouselRenderer';
export { MixedMediaRenderer } from './renderers/MixedMediaRenderer';
export { MediaPlaceholder } from './renderers/MediaPlaceholder';
export { MediaLoading } from './renderers/MediaLoading';
export { MediaError } from './renderers/MediaError';
export { MediaPreview } from './renderers/MediaPreview';
