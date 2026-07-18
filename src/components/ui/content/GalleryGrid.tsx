import React from 'react';
import { cn } from '../../../lib/utils';

export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface GalleryGridProps {
  images: GalleryImage[];
  layout?: 'grid' | 'carousel' | 'masonry';
  className?: string;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  layout = 'grid',
  className
}) => {
  if (!images || images.length === 0) return null;

  if (layout === 'carousel') {
    return (
      <div className={cn("flex gap-4 overflow-x-auto snap-x scrollbar-hide pb-4", className)}>
        {images.map((img, idx) => (
          <div key={idx} className="shrink-0 snap-start w-72 md:w-96 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
            <div className="aspect-[4/3] w-full">
              <img src={img.src} alt={img.alt || `Gallery image ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 p-4 pt-12">
                <p className="text-white text-xs font-semibold">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Grid layout (handles 1-4 images specifically for aesthetic layouts, falls back to generic grid for more)
  return (
    <div className={cn(
      "grid gap-4",
      images.length === 1 && "grid-cols-1",
      images.length === 2 && "grid-cols-2",
      images.length === 3 && "grid-cols-2 md:grid-cols-3",
      images.length === 4 && "grid-cols-2",
      images.length > 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      className
    )}>
      {images.map((img, idx) => (
        <div 
          key={idx} 
          className={cn(
            "rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group bg-slate-50",
            (images.length === 3 && idx === 0) && "md:col-span-2 md:row-span-2" 
          )}
        >
          <div className={cn(
            "w-full h-full",
            images.length === 1 ? "aspect-video" : "aspect-square"
          )}>
             <img src={img.src} alt={img.alt || `Gallery image ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          {img.caption && (
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-semibold">{img.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
