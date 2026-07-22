/**
 * Generate static Open Graph + favicon assets from real brand files.
 *
 * Sources (do not invent graphics):
 * - public/choosify-logo-wordmark.svg  (navbar / footer wordmark)
 * - public/logo.png                    (oo mark, favicon source)
 * - Brand navy #000435 (auth / footer / dark chrome)
 *
 * Output:
 * - public/og/default.png          1200×630 default og:image
 * - public/og/wordmark-light.png   wordmark on transparent (for /api/og)
 * - public/favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
 *
 * Run: npm run generate:og
 */
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../public');
const ogDir = path.join(root, 'og');

const NAVY = '#000435';
const TAGLINE = "Bangladesh's Smartest Product Discovery Platform";
const SITE_HOST = 'www.choosify.bd';

await fs.promises.mkdir(ogDir, { recursive: true });

const wordmarkPath = path.join(root, 'choosify-logo-wordmark.svg');
const logoMarkPath = path.join(root, 'logo.png');

if (!fs.existsSync(wordmarkPath)) {
  throw new Error(`Missing brand wordmark: ${wordmarkPath}`);
}
if (!fs.existsSync(logoMarkPath)) {
  throw new Error(`Missing brand logo mark: ${logoMarkPath}`);
}

/** Official wordmark rendered for dark backgrounds (white + orange eyes). */
const wordmarkBuffer = await sharp(wordmarkPath)
  .resize({
    width: 720,
    height: 140,
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp(wordmarkBuffer).toFile(path.join(ogDir, 'wordmark-light.png'));

const wordmarkMeta = await sharp(wordmarkBuffer).metadata();
const wordmarkW = wordmarkMeta.width || 720;
const wordmarkH = wordmarkMeta.height || 140;
const wordmarkLeft = Math.round((1200 - wordmarkW) / 2);
const wordmarkTop = 210;

const taglineSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="80">
  <text
    x="600"
    y="36"
    text-anchor="middle"
    fill="rgba(255,255,255,0.78)"
    font-family="Satoshi, Helvetica Neue, Arial, sans-serif"
    font-size="28"
    font-weight="600"
  >${TAGLINE.replace(/&/g, '&amp;').replace(/'/g, '&apos;')}</text>
</svg>`);

const hostSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="40">
  <text
    x="600"
    y="28"
    text-anchor="middle"
    fill="rgba(255,255,255,0.42)"
    font-family="Satoshi, Helvetica Neue, Arial, sans-serif"
    font-size="18"
    font-weight="600"
  >${SITE_HOST}</text>
</svg>`);

/** Clean navy field — same ink as navbar / footer / auth chrome. */
const backgroundSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${NAVY}"/>
</svg>`);

await sharp(backgroundSvg)
  .composite([
    { input: wordmarkBuffer, left: wordmarkLeft, top: wordmarkTop },
    { input: taglineSvg, left: 0, top: wordmarkTop + wordmarkH + 28 },
    { input: hostSvg, left: 0, top: 560 },
  ])
  .png()
  .toFile(path.join(ogDir, 'default.png'));

await sharp(logoMarkPath).resize(16, 16).png().toFile(path.join(root, 'favicon-16x16.png'));
await sharp(logoMarkPath).resize(32, 32).png().toFile(path.join(root, 'favicon-32x32.png'));
await sharp(logoMarkPath).resize(180, 180).png().toFile(path.join(root, 'apple-touch-icon.png'));

const out = await sharp(path.join(ogDir, 'default.png')).metadata();
console.log(
  `Generated og/default.png (${out.width}×${out.height}), og/wordmark-light.png, favicons from real brand assets.`,
);
