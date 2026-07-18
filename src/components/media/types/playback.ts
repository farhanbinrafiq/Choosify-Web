export type MediaRendererKind =
  | 'video'
  | 'image'
  | 'carousel'
  | 'mixed'
  | 'placeholder';

export interface MediaPlaybackOptions {
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  showControls: boolean;
  lazyLoad: boolean;
}

export interface MediaRenderError {
  code: 'unsupported_format' | 'load_failed' | 'validation_failed' | 'missing_source';
  message: string;
  mediaId?: string;
}
