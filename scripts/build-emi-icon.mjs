/**
 * Build square Emi mascot icon with Android-safe inset + 22% rounded corners.
 * Usage: node scripts/build-emi-icon.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const srcSvg = path.join(publicDir, 'emi-ai-logo.svg');

const canvas = 512;
/** Baked radius for standalone asset previews; UI uses CSS `.choosify-icon-shell` (22%). */
const cornerRadius = Math.round(canvas * 0.22);
/**
 * Portrait mascot — height is the limiting axis. 20% inset → ≤60% canvas so
 * circular / adaptive masks never clip the body or “a.i.” mark.
 */
const safeInset = 0.2;
const usable = Math.round(canvas * (1 - 2 * safeInset));

async function roundedSquareMask(size, radius) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>
</svg>`;
  return Buffer.from(svg);
}

const mascot = await sharp(srcSvg)
  .resize(usable, usable, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .png()
  .toBuffer();

const composed = await sharp({
  create: {
    width: canvas,
    height: canvas,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{ input: mascot, gravity: 'centre' }])
  .png()
  .toBuffer();

// UI / avatar asset: full square + safe inset (CSS shell supplies 22% radius)
await sharp(composed).png().toFile(path.join(publicDir, 'emi-ai-logo-icon.png'));

// Preview asset with baked 22% corners (docs / QA / non-CSS contexts)
const mask = await roundedSquareMask(canvas, cornerRadius);
await sharp(composed)
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toFile(path.join(publicDir, 'emi-ai-logo-icon-rounded.png'));

// Full-bleed square for adaptive / circular OS masks
await sharp(composed).png().toFile(path.join(publicDir, 'emi-ai-logo-icon-maskable.png'));

// Small UI sizes
for (const s of [32, 48, 64, 96, 128, 192]) {
  await sharp(composed)
    .resize(s, s)
    .png()
    .toFile(path.join(publicDir, `emi-ai-logo-icon-${s}.png`));
}

console.log('emi icons written', {
  cornerRadius,
  safeInset,
  usable,
  files: fs.readdirSync(publicDir).filter((f) => f.startsWith('emi-ai-logo-icon')),
});
