export const SUPPORTED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
] as const;

export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export const FUTURE_VIDEO_MIME_TYPES = ['video/quicktime'] as const;
export const FUTURE_IMAGE_MIME_TYPES = ['image/avif'] as const;

/** 100 MB default upload cap */
export const MEDIA_MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/** 10 minutes max video duration */
export const MEDIA_MAX_VIDEO_DURATION_SECONDS = 600;

/** Minimum short-edge resolution */
export const MEDIA_MIN_RESOLUTION_PX = 320;

export interface MediaValidationRuleSet {
  maxFileSizeBytes: number;
  maxVideoDurationSeconds: number;
  minResolutionPx: number;
  allowedVideoMimeTypes: readonly string[];
  allowedImageMimeTypes: readonly string[];
}

export const DEFAULT_MEDIA_VALIDATION_RULES: MediaValidationRuleSet = {
  maxFileSizeBytes: MEDIA_MAX_FILE_SIZE_BYTES,
  maxVideoDurationSeconds: MEDIA_MAX_VIDEO_DURATION_SECONDS,
  minResolutionPx: MEDIA_MIN_RESOLUTION_PX,
  allowedVideoMimeTypes: SUPPORTED_VIDEO_MIME_TYPES,
  allowedImageMimeTypes: SUPPORTED_IMAGE_MIME_TYPES,
};

export interface MediaValidationError {
  field: string;
  code: string;
  message: string;
}

export interface MediaValidationResult {
  valid: boolean;
  errors: MediaValidationError[];
}

export interface MediaValidationInput {
  mimeType?: string;
  fileSize?: number;
  duration?: number;
  width?: number;
  height?: number;
  videoUrl?: string;
  imageUrls?: string[];
}

export function validateMedia(
  input: MediaValidationInput,
  rules: MediaValidationRuleSet = DEFAULT_MEDIA_VALIDATION_RULES,
): MediaValidationResult {
  const errors: MediaValidationError[] = [];

  if (input.fileSize != null && input.fileSize > rules.maxFileSizeBytes) {
    errors.push({
      field: 'fileSize',
      code: 'file_too_large',
      message: `File size exceeds maximum of ${Math.round(rules.maxFileSizeBytes / (1024 * 1024))} MB.`,
    });
  }

  if (input.duration != null && input.duration > rules.maxVideoDurationSeconds) {
    errors.push({
      field: 'duration',
      code: 'duration_too_long',
      message: `Video duration exceeds maximum of ${rules.maxVideoDurationSeconds} seconds.`,
    });
  }

  const shortEdge = Math.min(input.width ?? 0, input.height ?? 0);
  if (shortEdge > 0 && shortEdge < rules.minResolutionPx) {
    errors.push({
      field: 'resolution',
      code: 'resolution_too_low',
      message: `Minimum resolution is ${rules.minResolutionPx}px on the shortest edge.`,
    });
  }

  if (input.mimeType) {
    const isVideo = input.mimeType.startsWith('video/');
    const isImage = input.mimeType.startsWith('image/');
    const allowed = isVideo
      ? rules.allowedVideoMimeTypes
      : isImage
        ? rules.allowedImageMimeTypes
        : [];

    if ((isVideo || isImage) && !allowed.includes(input.mimeType)) {
      errors.push({
        field: 'mimeType',
        code: 'unsupported_format',
        message: `Format "${input.mimeType}" is not supported. Allowed: ${allowed.join(', ')}.`,
      });
    }
  }

  const hasVideo = Boolean(input.videoUrl);
  const hasImages = (input.imageUrls?.length ?? 0) > 0;
  if (!hasVideo && !hasImages) {
    errors.push({
      field: 'source',
      code: 'missing_source',
      message: 'Media must include a video URL or at least one image.',
    });
  }

  return { valid: errors.length === 0, errors };
}
