import React, { useRef, useState } from 'react';
import { toast } from '../../lib/notify';
import { Plus, Link as LinkIcon } from 'lucide-react';
import type { UniversalMedia } from '../../components/media/types/mediaModel';
import { classifyMedia } from '../../components/media/utils/classifyMedia';
import { validateMedia } from '../../components/media/validators/mediaValidation';
import {
  generateMediaId,
  listMediaAssets,
  upsertMediaAsset,
} from '../../services/spotlightCampaignStorage';
import { MediaPreview } from '../../components/media/renderers/MediaPreview';
import { cn } from '../../lib/utils';

const EMBED_PLATFORMS = [
  { id: 'youtube', label: 'YouTube', pattern: /youtube\.com|youtu\.be/ },
  { id: 'facebook', label: 'Facebook', pattern: /facebook\.com|fb\.watch/ },
  { id: 'instagram', label: 'Instagram', pattern: /instagram\.com/ },
  { id: 'tiktok', label: 'TikTok', pattern: /tiktok\.com/ },
  { id: 'vimeo', label: 'Vimeo', pattern: /vimeo\.com/ },
] as const;

function detectPlatform(url: string) {
  return EMBED_PLATFORMS.find((p) => p.pattern.test(url))?.label ?? 'Embed';
}

export function MarketingMediaLibraryPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UniversalMedia[]>(() => listMediaAssets());
  const [embedUrl, setEmbedUrl] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'embed'>('all');

  const refresh = () => setItems(listMediaAssets());

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      const probe = classifyMedia({
        width: isVideo ? 1080 : 1200,
        height: isVideo ? 1920 : 1500,
        mimeType: file.type,
        fileSize: file.size,
        hasVideo: isVideo,
        imageCount: isVideo ? 0 : 1,
      });
      const validation = validateMedia({
        mimeType: file.type,
        fileSize: file.size,
        width: probe.resolution.width,
        height: probe.resolution.height,
        videoUrl: isVideo ? url : undefined,
        imageUrls: isVideo ? [] : [url],
      });
      if (!validation.valid) {
        toast.error(validation.errors[0]?.message ?? 'Invalid file');
        return;
      }
      upsertMediaAsset({
        mediaId: generateMediaId(),
        mediaType: probe.mediaType,
        orientation: probe.orientation,
        aspectRatio: probe.aspectRatio,
        resolution: probe.resolution,
        fileSize: file.size,
        mimeType: file.type,
        thumbnail: url,
        previewImage: url,
        videoUrl: isVideo ? url : undefined,
        imageUrls: isVideo ? [] : [url],
        displayOrder: items.length,
        altText: file.name,
        isPrimary: false,
      });
    });
    refresh();
    toast.success('Media uploaded');
  };

  const handleEmbed = () => {
    const url = embedUrl.trim();
    if (!url) return;
    upsertMediaAsset({
      mediaId: generateMediaId(),
      mediaType: 'landscape_video',
      orientation: 'landscape',
      aspectRatio: '16:9',
      resolution: { width: 1280, height: 720 },
      mimeType: 'text/html',
      thumbnail: `https://picsum.photos/seed/${encodeURIComponent(url)}/640/360`,
      previewImage: `https://picsum.photos/seed/${encodeURIComponent(url)}/640/360`,
      videoUrl: url,
      imageUrls: [],
      displayOrder: items.length,
      altText: `${detectPlatform(url)} embed`,
      isPrimary: false,
    });
    setEmbedUrl('');
    refresh();
    toast.success('Embed added');
  };

  const filtered = items.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'embed') return Boolean(m.videoUrl?.includes('youtube') || m.videoUrl?.includes('instagram') || m.videoUrl?.includes('tiktok') || m.videoUrl?.includes('facebook') || m.videoUrl?.includes('vimeo'));
    if (filter === 'video') return m.mediaType.includes('video') || m.mediaType === 'livestream';
    return m.mediaType.includes('image') || m.mediaType === 'carousel';
  });

  return (
    <div className="flex-grow p-6 space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">Media Library</h1>
          <p className="text-xs text-gray-500">Images, videos, reels, carousels, and embedded URLs · {items.length} assets</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EB4501] text-white text-xs font-bold uppercase rounded"
          >
            <Plus size={14} /> Upload
          </button>
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>
      </div>

      <div className="flex gap-2 items-center bg-white border border-[#e8edf2] rounded-lg p-3">
        <LinkIcon size={14} className="text-gray-400" />
        <input
          value={embedUrl}
          onChange={(e) => setEmbedUrl(e.target.value)}
          placeholder="Paste YouTube, Facebook, Instagram, TikTok, or Vimeo URL..."
          className="flex-grow px-3 py-2 text-sm border border-[#e8edf2] rounded"
        />
        <button type="button" onClick={handleEmbed} className="px-4 py-2 text-xs font-bold uppercase bg-navy text-white rounded">
          Add Embed
        </button>
      </div>

      <div className="flex gap-2">
        {(['all', 'image', 'video', 'embed'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-[10px] font-bold uppercase rounded border',
              filter === f ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-[#e8edf2]',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#e8edf2] rounded-lg">
          <p className="text-sm text-gray-500">No media assets yet. Upload or add an embed URL.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((media) => (
            <div key={media.mediaId} className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100">
                <MediaPreview media={media} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold truncate">{media.altText ?? media.mediaId}</p>
                <p className="text-[10px] text-gray-400 uppercase">
                  {media.videoUrl && detectPlatform(media.videoUrl) !== 'Embed' ? detectPlatform(media.videoUrl) : media.mediaType.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
