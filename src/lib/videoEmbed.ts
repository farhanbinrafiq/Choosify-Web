/** Converts common video URLs into iframe-safe embed URLs. */
export function getVideoEmbedUrl(url: string): string {
  if (!url || url === '#') return '';

  let clean = url.trim();

  if (clean.includes('youtube.com/shorts/') || clean.includes('youtu.be/shorts/')) {
    const id = clean.split('/shorts/')[1]?.split(/[?&#]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  if (clean.includes('youtu.be/')) {
    const id = clean.split('youtu.be/')[1]?.split(/[?&#]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  if (clean.includes('youtube.com/watch')) {
    try {
      const query = clean.includes('?') ? clean.substring(clean.indexOf('?')) : '';
      const id = new URLSearchParams(query).get('v');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    } catch {
      // fall through
    }
  }

  if (clean.includes('/embed/')) {
    if (!clean.includes('autoplay=')) {
      clean = clean.includes('?') ? `${clean}&autoplay=1` : `${clean}?autoplay=1`;
    }
    return clean;
  }

  if (clean.includes('tiktok.com')) {
    return clean;
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(clean) || clean.startsWith('blob:')) {
    return clean;
  }

  return clean;
}

export function isDirectVideoFile(url: string): boolean {
  if (!url || url === '#') return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith('blob:');
}

export function isEmbeddableVideo(url: string): boolean {
  if (!url || url === '#') return false;
  const embed = getVideoEmbedUrl(url);
  return embed.length > 0 && (embed.includes('/embed/') || embed.includes('tiktok.com') || isDirectVideoFile(embed));
}
