/**
 * Spotlight API error model — LE-005.3.2
 */

export type SpotlightErrorDomain =
  | 'validation'
  | 'media'
  | 'publishing'
  | 'scheduling'
  | 'moderation'
  | 'permission'
  | 'analytics'
  | 'upload'
  | 'version'
  | 'localization'
  | 'seo'
  | 'not_found'
  | 'conflict'
  | 'internal';

export type SpotlightErrorCode =
  // Validation
  | 'SPOTLIGHT_VALIDATION_FAILED'
  | 'SPOTLIGHT_REQUIRED_FIELD_MISSING'
  | 'SPOTLIGHT_INVALID_SCHEDULE'
  | 'SPOTLIGHT_INVALID_PRODUCT_LINK'
  // Media
  | 'SPOTLIGHT_MEDIA_NOT_FOUND'
  | 'SPOTLIGHT_MEDIA_VALIDATION_FAILED'
  | 'SPOTLIGHT_MEDIA_TYPE_UNSUPPORTED'
  // Publishing
  | 'SPOTLIGHT_PUBLISH_BLOCKED'
  | 'SPOTLIGHT_NOT_APPROVED'
  | 'SPOTLIGHT_ALREADY_PUBLISHED'
  // Scheduling
  | 'SPOTLIGHT_SCHEDULE_CONFLICT'
  | 'SPOTLIGHT_SCHEDULE_IN_PAST'
  | 'SPOTLIGHT_BLACKOUT_DATE'
  // Moderation
  | 'SPOTLIGHT_MODERATION_REQUIRED'
  | 'SPOTLIGHT_MODERATION_REJECTED'
  | 'SPOTLIGHT_MODERATION_FRAUD_SIGNAL'
  // Permission
  | 'SPOTLIGHT_FORBIDDEN'
  | 'SPOTLIGHT_UNAUTHORIZED'
  | 'SPOTLIGHT_OWNER_MISMATCH'
  // Analytics
  | 'SPOTLIGHT_ANALYTICS_UNAVAILABLE'
  // Upload
  | 'SPOTLIGHT_UPLOAD_FAILED'
  | 'SPOTLIGHT_UPLOAD_TOO_LARGE'
  | 'SPOTLIGHT_UPLOAD_MIME_REJECTED'
  // Version
  | 'SPOTLIGHT_VERSION_NOT_FOUND'
  | 'SPOTLIGHT_VERSION_CONFLICT'
  // Localization
  | 'SPOTLIGHT_LOCALE_NOT_SUPPORTED'
  | 'SPOTLIGHT_LOCALIZATION_MISSING'
  // SEO
  | 'SPOTLIGHT_SLUG_CONFLICT'
  | 'SPOTLIGHT_SEO_INVALID'
  // Generic
  | 'SPOTLIGHT_NOT_FOUND'
  | 'SPOTLIGHT_CONFLICT'
  | 'SPOTLIGHT_INTERNAL_ERROR';

export interface SpotlightFieldError {
  field: string;
  code: SpotlightErrorCode;
  message: string;
}

export interface SpotlightError {
  domain: SpotlightErrorDomain;
  code: SpotlightErrorCode;
  message: string;
  details?: SpotlightFieldError[];
  traceId?: string;
}

export interface SpotlightApiErrorResponse {
  error: SpotlightError;
  meta?: { requestId: string; timestamp: string };
}
