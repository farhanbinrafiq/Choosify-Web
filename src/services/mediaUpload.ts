import { getAccessToken } from '../lib/authSession';

const API_BASE =
  ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL as
    | string
    | undefined) || '/api/v1';

const CLOUD_NAME =
  ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_CLOUDINARY_CLOUD_NAME as
    | string
    | undefined) || 'djdyqr8yd';

const UPLOAD_PRESET = (import.meta as ImportMeta & { env?: Record<string, string> }).env
  ?.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

async function uploadViaCloudinary(file: File, folder = 'choosify/verifications'): Promise<string> {
  if (!UPLOAD_PRESET?.trim()) {
    throw new Error('Missing VITE_CLOUDINARY_UPLOAD_PRESET');
  }

  const isImage = file.type.startsWith('image/');
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET.trim());
  form.append('folder', folder);

  const endpoint = isImage
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || `Cloudinary upload failed with ${response.status}`);
  }

  const payload = (await response.json()) as { secure_url?: string };
  if (!payload.secure_url) {
    throw new Error('Cloudinary upload succeeded but no secure_url was returned.');
  }
  return payload.secure_url;
}

async function uploadViaOperationsApi(file: File): Promise<string> {
  const base64Data = await fileToBase64(file);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/operations/media/upload-verification`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
      data: base64Data,
    }),
  });

  if (!response.ok) {
    const raw = await response.text();
    let message = raw || `Upload failed with ${response.status}`;
    try {
      const parsed = JSON.parse(raw) as { error?: string };
      if (parsed.error) message = parsed.error;
    } catch {
      // keep raw
    }
    throw new Error(message);
  }

  const payload = (await response.json()) as { url?: string };
  if (!payload.url) {
    throw new Error('Upload succeeded but no URL was returned.');
  }
  return payload.url;
}

/**
 * Trade license (PDF) + NID/face photos for claim verification.
 * Prefers unsigned Cloudinary when configured; falls back to authenticated ops upload.
 */
export async function uploadVerificationFile(file: File): Promise<{ url: string; name: string }> {
  const allowed =
    file.type.startsWith('image/') ||
    file.type === 'application/pdf' ||
    /\.(pdf|jpe?g|png|webp|gif)$/i.test(file.name);
  if (!allowed) {
    throw new Error('Unsupported file. Upload a PDF or image (JPEG/PNG/WebP/GIF).');
  }

  if (UPLOAD_PRESET?.trim()) {
    try {
      const url = await uploadViaCloudinary(file);
      return { url, name: file.name };
    } catch (error) {
      console.warn('[mediaUpload] Direct Cloudinary failed, trying operations API.', error);
    }
  }

  const url = await uploadViaOperationsApi(file);
  return { url, name: file.name };
}

/**
 * Routes a Consumer's own file through the canonical media chokepoint
 * (`server/media/mediaUploadService.ts` via `POST /catalog/media/upload`) —
 * the same pipeline sellers/creators/admins use for product/brand images,
 * just with a category any authenticated user may write to for their own
 * account (see `CONSUMER_UPLOAD_CATEGORIES` server-side). No separate
 * upload architecture, only a narrower auth gate on the same endpoint.
 */
async function uploadViaCatalogMediaFull(
  file: File,
  category: 'users' | 'reviews' | 'warranty-claims',
): Promise<{ url: string; mediaId: string }> {
  const allowedImage = file.type.startsWith('image/');
  const allowedVideo = category === 'warranty-claims' && file.type.startsWith('video/');
  if (!allowedImage && !allowedVideo) {
    throw new Error(
      category === 'warranty-claims'
        ? 'Please choose a JPG, PNG, WebP image or MP4/WebM video file.'
        : 'Please choose a JPG, PNG, or WebP image file.',
    );
  }
  const base64Data = await fileToBase64(file);
  const token = getAccessToken();
  if (!token) {
    throw new Error('You must be signed in to upload a photo.');
  }
  const response = await fetch(`${API_BASE}/catalog/media/upload`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      data: base64Data,
      category,
    }),
  });
  if (!response.ok) {
    const raw = await response.text();
    let message = raw || `Upload failed with ${response.status}`;
    try {
      const parsed = JSON.parse(raw) as { error?: string };
      if (parsed.error) message = parsed.error;
    } catch {
      // keep raw
    }
    throw new Error(message);
  }
  const payload = (await response.json()) as { url?: string; mediaId?: string };
  if (!payload.url || !payload.mediaId) {
    throw new Error('Upload succeeded but no URL/id was returned.');
  }
  return { url: payload.url, mediaId: payload.mediaId };
}

async function uploadViaCatalogMedia(file: File, category: 'users' | 'reviews'): Promise<string> {
  const result = await uploadViaCatalogMediaFull(file, category);
  return result.url;
}

/** Consumer avatar — server-backed, replacing the old localStorage/data-URL-only avatar. */
export async function uploadUserAvatar(file: File): Promise<string> {
  return uploadViaCatalogMedia(file, 'users');
}

/** Review evidence photos — server-backed, up to the caller to cap count (backend caps at 6). */
export async function uploadReviewPhotos(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files.slice(0, 6)) {
    // eslint-disable-next-line no-await-in-loop
    urls.push(await uploadViaCatalogMedia(file, 'reviews'));
  }
  return urls;
}

/** Warranty claim evidence — photo/video, private (buyer/seller/admin only). Returns media ids for attachmentMediaIds. */
export async function uploadWarrantyClaimEvidence(files: File[]): Promise<string[]> {
  const mediaIds: string[] = [];
  for (const file of files.slice(0, 8)) {
    // eslint-disable-next-line no-await-in-loop
    const result = await uploadViaCatalogMediaFull(file, 'warranty-claims');
    mediaIds.push(result.mediaId);
  }
  return mediaIds;
}
