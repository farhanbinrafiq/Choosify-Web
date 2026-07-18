import type { SpotlightApiResponse } from './common';
import type { SpotlightActorContext } from './common';
import type { SpotlightMedia } from '../media';
import type { SpotlightCampaignAsset } from '../assets';

export type SpotlightUploadKind = 'media' | 'thumbnail' | 'poster' | 'asset';

export type SpotlightUploadStatus =
  | 'pending'
  | 'uploading'
  | 'processing'
  | 'ready'
  | 'failed';

export interface SpotlightUploadValidationResult {
  valid: boolean;
  errors: Array<{ code: string; message: string }>;
  warnings?: Array<{ code: string; message: string }>;
}

export interface SpotlightCdnMetadata {
  cdnUrl: string;
  bucket?: string;
  objectKey?: string;
  etag?: string;
  cacheControl?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface SpotlightVideoProcessingJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  outputFormats?: string[];
  estimatedCompletionAt?: string;
}

export interface SpotlightInitUploadRequest {
  kind: SpotlightUploadKind;
  fileName: string;
  mimeType: string;
  fileSize: number;
  campaignId?: string;
  actor: SpotlightActorContext;
}

export interface SpotlightInitUploadResponse extends SpotlightApiResponse<{
  uploadId: string;
  uploadUrl: string;
  expiresAt: string;
  fields?: Record<string, string>;
}> {}

export interface SpotlightCompleteUploadRequest {
  uploadId: string;
  actor: SpotlightActorContext;
}

export interface SpotlightCompleteUploadResponse extends SpotlightApiResponse<{
  uploadId: string;
  status: SpotlightUploadStatus;
  media?: SpotlightMedia;
  asset?: SpotlightCampaignAsset;
  validation: SpotlightUploadValidationResult;
  cdn?: SpotlightCdnMetadata;
  videoProcessing?: SpotlightVideoProcessingJob;
}> {}

export interface SpotlightUploadStatusResponse extends SpotlightApiResponse<{
  uploadId: string;
  status: SpotlightUploadStatus;
  validation?: SpotlightUploadValidationResult;
  cdn?: SpotlightCdnMetadata;
  videoProcessing?: SpotlightVideoProcessingJob;
}> {}
