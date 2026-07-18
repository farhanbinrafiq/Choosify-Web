import React from 'react';

type OptimizedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** When true, image loads immediately (hero / above-the-fold). */
  priority?: boolean;
};

export function OptimizedImage({
  priority = false,
  loading,
  decoding = 'async',
  fetchPriority,
  ...props
}: OptimizedImageProps) {
  return (
    <img
      {...props}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding}
      fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
    />
  );
}
