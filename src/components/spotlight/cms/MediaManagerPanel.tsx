import React, { useRef } from 'react';
import { toast } from '../../../lib/notify';
import { ChevronUp, ChevronDown, Star, Trash2 } from 'lucide-react';
import type { UniversalMedia } from '../../media/types/mediaModel';
import { classifyMedia } from '../../media/utils/classifyMedia';
import { validateMedia } from '../../media/validators/mediaValidation';
import {
  generateMediaId,
  getMediaById,
  upsertMediaAsset,
} from '../../../services/spotlightCampaignStorage';
import { MediaPreview } from '../../media/renderers/MediaPreview';
import { cn } from '../../../lib/utils';

interface MediaManagerPanelProps {
  mediaIds: string[];
  primaryMediaId?: string;
  onChange: (mediaIds: string[], primaryMediaId?: string) => void;
}

export function MediaManagerPanel({ mediaIds, primaryMediaId, onChange }: MediaManagerPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const items = mediaIds
    .map((id) => getMediaById(id))
    .filter((m): m is UniversalMedia => Boolean(m));

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const nextIds = [...mediaIds];

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
        toast.error(validation.errors[0]?.message ?? 'Invalid media file');
        return;
      }

      const mediaId = generateMediaId();
      const media: UniversalMedia = {
        mediaId,
        mediaType: probe.mediaType,
        orientation: probe.orientation,
        aspectRatio: probe.aspectRatio,
        resolution: probe.resolution,
        fileSize: file.size,
        mimeType: file.type,
        thumbnail: url,
        posterImage: isVideo ? url : undefined,
        previewImage: url,
        videoUrl: isVideo ? url : undefined,
        imageUrls: isVideo ? [] : [url],
        displayOrder: nextIds.length,
        altText: file.name,
        isPrimary: nextIds.length === 0,
      };
      upsertMediaAsset(media);
      nextIds.push(mediaId);
    });

    onChange(nextIds, primaryMediaId ?? nextIds[0]);
    toast.success('Media added');
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...mediaIds];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next, primaryMediaId);
  };

  const remove = (id: string) => {
    const next = mediaIds.filter((m) => m !== id);
    onChange(next, primaryMediaId === id ? next[0] : primaryMediaId);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-[#e8edf2] rounded-lg p-8 text-center cursor-pointer hover:border-[#EB4501]/40"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-sm font-semibold text-gray-700">Upload video or images</p>
        <p className="text-xs text-gray-400 mt-1">MP4, WebM, JPEG, PNG, WEBP — auto-classified</p>
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <ul className="space-y-3">
        {items.map((media, index) => (
          <li
            key={media.mediaId}
            className={cn(
              'flex items-center gap-3 p-3 border rounded-lg',
              primaryMediaId === media.mediaId ? 'border-[#EB4501]' : 'border-[#e8edf2]',
            )}
          >
            <div className="w-16 h-16 rounded overflow-hidden shrink-0">
              <MediaPreview media={media} />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-bold truncate">{media.mediaType.replace(/_/g, ' ')}</p>
              <p className="text-[10px] text-gray-400">{media.aspectRatio} · {media.mimeType}</p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => onChange(mediaIds, media.mediaId)} title="Set primary">
                <Star size={16} className={primaryMediaId === media.mediaId ? 'text-[#EB4501] fill-[#EB4501]' : 'text-gray-300'} />
              </button>
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>
                <ChevronUp size={16} />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
                <ChevronDown size={16} />
              </button>
              <button type="button" onClick={() => remove(media.mediaId)}>
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
