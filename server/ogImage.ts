/**
 * Runtime Open Graph image generator — plain Node/Sharp replacement for the
 * Vercel-Edge-only `@vercel/og` (Satori) pipeline previously used in api/og.js.
 *
 * Sharp is already a runtime dependency used for exactly this kind of raster
 * composition in scripts/generate-og-assets.mjs (build-time OG asset generation),
 * so no new library was added — the same technique (SVG text/shapes rasterized
 * via Sharp) is reused here at request time with dynamic params.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SITE_THEME_COLOR = '#000435';
const SITE_BRAND_ORANGE = '#EB4501';
const SITE_URL = 'https://www.choosify.bd';
const SITE_NAME = 'Choosify';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

export type OgImageParams = {
  title?: string;
  description?: string;
  type?: string;
  brand?: string;
  label?: string;
  image?: string;
};

function truncate(value: string | undefined, max: number): string {
  const trimmed = String(value || '').trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

function typeLabel(type: string): string {
  switch (type) {
    case 'product':
      return 'Product';
    case 'brand':
      return 'Brand';
    case 'category':
      return 'Category';
    case 'deal':
      return 'Deal';
    case 'article':
      return 'Guide';
    case 'creator':
      return 'Creator';
    default:
      return 'Choosify';
  }
}

function escapeXml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Rough width-based wrapping — no layout engine available outside a browser/Satori. */
function wrapText(text: string, fontSize: number, maxWidthPx: number, maxLines: number): string[] {
  const avgCharWidth = fontSize * 0.56;
  const maxCharsPerLine = Math.max(6, Math.floor(maxWidthPx / avgCharWidth));
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines && words.length > 0) {
    const consumed = lines.join(' ').length;
    if (consumed < text.length) {
      lines[lines.length - 1] = truncate(lines[lines.length - 1], maxCharsPerLine - 1);
    }
  }
  return lines;
}

let cachedWordmarkB64: string | null = null;
let cachedWordmarkPath: string | null = null;

function loadWordmarkDataUri(assetRoot: string): string | null {
  const wordmarkPath = path.join(assetRoot, 'og', 'wordmark-light.png');
  if (cachedWordmarkPath === wordmarkPath && cachedWordmarkB64) return cachedWordmarkB64;
  try {
    const buf = fs.readFileSync(wordmarkPath);
    cachedWordmarkB64 = `data:image/png;base64,${buf.toString('base64')}`;
    cachedWordmarkPath = wordmarkPath;
    return cachedWordmarkB64;
  } catch {
    return null;
  }
}

async function loadMediaDataUri(imageUrl: string, type: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const fit = type === 'brand' || type === 'creator' ? 'contain' : 'cover';
    const padded = await sharp(Buffer.from(arrayBuffer))
      .resize({
        width: 280,
        height: 280,
        fit,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer();
    return `data:image/png;base64,${padded.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function generateOgImage(params: OgImageParams, assetRoot: string): Promise<Buffer> {
  const title = truncate(params.title || SITE_NAME, 90);
  const description = truncate(
    params.description || 'Compare verified brands and discover trusted products across Bangladesh.',
    140,
  );
  const type = String(params.type || 'default').toLowerCase();
  const brand = truncate(params.brand || '', 48);
  const label = truncate(params.label || typeLabel(type), 32);
  const imageParam = params.image || '';
  const showMedia = Boolean(imageParam) && (type === 'product' || type === 'brand' || type === 'creator');

  const wordmarkDataUri = loadWordmarkDataUri(assetRoot);
  const mediaDataUri = showMedia ? await loadMediaDataUri(imageParam, type) : null;
  const renderMedia = Boolean(mediaDataUri);

  const textMaxWidth = renderMedia ? 640 : 1080;
  const titleFontSize = renderMedia ? 52 : 58;
  const titleLines = wrapText(title, titleFontSize, textMaxWidth, 2);
  const descriptionLines = wrapText(description, 24, textMaxWidth, 2);

  const brandY = 250;
  let cursorY = brand ? brandY + 60 : 270;

  const brandSvg = brand
    ? `<text x="56" y="${brandY}" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="rgba(255,255,255,0.65)">${escapeXml(brand)}</text>`
    : '';

  const titleSvg = titleLines
    .map((line, i) => {
      const y = cursorY + i * (titleFontSize + 8);
      return `<text x="56" y="${y}" font-family="Arial, sans-serif" font-size="${titleFontSize}" font-weight="800" letter-spacing="-1.2" fill="#FFFFFF">${escapeXml(line)}</text>`;
    })
    .join('\n');
  cursorY += titleLines.length * (titleFontSize + 8) + 20;

  const descriptionSvg = descriptionLines
    .map((line, i) => {
      const y = cursorY + i * 32;
      return `<text x="56" y="${y}" font-family="Arial, sans-serif" font-size="24" font-weight="500" fill="rgba(255,255,255,0.72)">${escapeXml(line)}</text>`;
    })
    .join('\n');

  const mediaCardX = 1200 - 56 - 280;
  const mediaCardY = 175;
  const mediaSvg = renderMedia
    ? `<clipPath id="mediaClip"><rect x="${mediaCardX}" y="${mediaCardY}" width="280" height="280" rx="28" ry="28" /></clipPath>
       <rect x="${mediaCardX}" y="${mediaCardY}" width="280" height="280" rx="28" ry="28" fill="#FFFFFF" stroke="rgba(255,255,255,0.18)" />
       <image x="${mediaCardX}" y="${mediaCardY}" width="280" height="280" href="${mediaDataUri}" clip-path="url(#mediaClip)" preserveAspectRatio="xMidYMid slice" />`
    : '';

  const wordmarkSvg = wordmarkDataUri
    ? `<image x="56" y="42" width="280" height="54" href="${wordmarkDataUri}" preserveAspectRatio="xMidYMid meet" />`
    : `<text x="56" y="80" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#FFFFFF">${escapeXml(SITE_NAME)}</text>`;

  const labelWidth = Math.max(90, label.length * 11 + 40);
  const labelSvg = `<rect x="${1200 - 56 - labelWidth}" y="42" width="${labelWidth}" height="40" rx="20" ry="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
     <text x="${1200 - 56 - labelWidth / 2}" y="67" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1" fill="${SITE_BRAND_ORANGE}">${escapeXml(label.toUpperCase())}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}">
    <rect width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" fill="${SITE_THEME_COLOR}" />
    ${wordmarkSvg}
    ${labelSvg}
    ${brandSvg}
    ${titleSvg}
    ${descriptionSvg}
    ${mediaSvg}
    <text x="56" y="590" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="rgba(255,255,255,0.55)">${escapeXml(SITE_URL.replace(/^https?:\/\//, ''))}</text>
    <text x="${OG_IMAGE_WIDTH - 56}" y="590" text-anchor="end" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.45)">Bangladesh's Smartest Product Discovery Platform</text>
  </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
