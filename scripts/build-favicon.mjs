/**
 * Canonical Choosify app-icon generator.
 *
 * Spec:
 * - Canvas: square 512²
 * - Corner radius (baked into `any` / favicon): 22% of edge (≈ iOS continuous corner)
 * - Safe inset: 18% per side → logo spans ≤64% of canvas (inside Android adaptive
 *   safe zone of ~66%). This is the root fix for side-cropped “oo” eyes.
 * - Maskable / apple-touch: full-bleed square (OS applies its own mask); same logo inset.
 *
 * Usage: node scripts/build-favicon.mjs
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const web = path.resolve(__dirname, '../public');
const admin = path.resolve(__dirname, '../../choosify-admin-4.0/public');

/**
 * True raster bbox of both eye rings (probed via scripts/probe-logo-bbox.mjs).
 * The previous geometric estimate (261×1102 / 3001×1466) was too tight — paths
 * overflow ~174 units on L/R/T, which made an “18% inset” still land at ~72%
 * canvas width and get cropped by Android’s ~66% adaptive safe zone.
 */
const bx = 87.68;
const by = 929.35;
const bw = 3348.36;
const bh = 1640.92;

const canvas = 512;
/** ~22% of 512 — rounded-square, never a circle */
const cornerRadius = Math.round(canvas * 0.22);
/**
 * Android adaptive icons keep only the center ~66% visible.
 * 20% inset → logo spans ≤60% of canvas (comfortable margin inside safe zone).
 */
const safeInset = 0.2;

const eyesPathD = [
  'M3077.32,1913.39c0-153.52-124.56-277.91-278.07-277.91s-278.07,124.39-278.07,277.91,124.56,278.07,278.07,278.07c26.65,0,52.32-3.79,76.67-10.7-10.69-17.44-16.95-38.17-16.95-60.22,0-64,51.83-115.84,115.67-115.84,28.96,0,55.45,10.7,75.69,28.14,17.28-36.2,26.98-76.67,26.98-119.46Z',
  'M1243.76,1913.39c0-153.52-124.56-277.91-278.07-277.91s-278.07,124.39-278.07,277.91c0,153.52,124.56,278.07,278.07,278.07,26.65,0,52.32-3.79,76.67-10.7-10.69-17.44-16.95-38.17-16.95-60.22,0-64,51.83-115.84,115.67-115.84,28.96,0,55.45,10.7,75.69,28.14,17.28-36.2,26.98-76.67,26.98-119.46Z',
  'M908.33,2569.34c-110.57,0-217.88-21.67-318.95-64.42-97.58-41.27-185.19-100.34-260.41-175.56-75.22-75.22-134.28-162.83-175.56-260.41-42.75-101.07-64.42-208.38-64.42-318.95s21.68-217.88,64.42-318.95c41.27-97.58,100.34-185.19,175.56-260.41,75.22-75.22,162.83-134.28,260.41-175.56,101.07-42.75,208.38-64.42,318.95-64.42s217.88,21.67,318.95,64.42c97.58,41.27,185.19,100.34,260.41,175.56,75.22,75.22,134.28,162.83,175.56,260.41,42.75,101.07,64.42,208.38,64.42,318.95s-21.68,217.88-64.42,318.95c-41.27,97.58-100.34,185.19-175.56,260.41-75.22,75.22-162.83,134.28-260.41,175.56-101.07,42.75-208.38,64.42-318.95,64.42ZM908.33,1102.85c-356.84,0-647.15,290.31-647.15,647.15s290.31,647.15,647.15,647.15,647.15-290.31,647.15-647.15-290.31-647.15-647.15-647.15Z',
  'M2615.38,2569.34c-110.57,0-217.88-21.67-318.95-64.42-97.58-41.27-185.19-100.34-260.41-175.56-75.22-75.22-134.28-162.83-175.56-260.41-42.75-101.07-64.42-208.38-64.42-318.95s21.68-217.88,64.42-318.95c41.27-97.58,100.34-185.19,175.56-260.41,75.22-75.22,162.83-134.28,260.41-175.56,101.07-42.75,208.38-64.42,318.95-64.42s217.88,21.67,318.95,64.42c97.58,41.27,185.19,100.34,260.41,175.56,75.22,75.22,134.28,162.83,175.56,260.41,42.75,101.07,64.42,208.38,64.42,318.95s-21.68,217.88-64.42,318.95c-41.27,97.58-100.34,185.19-175.56,260.41-75.22,75.22-162.83,134.28-260.41,175.56-101.07,42.75-208.38,64.42-318.95,64.42ZM2615.38,1102.85c-356.84,0-647.15,290.31-647.15,647.15s290.31,647.15,647.15,647.15,647.15-290.31,647.15-647.15-290.31-647.15-647.15-647.15Z',
];

function layoutLogo() {
  const usable = canvas * (1 - 2 * safeInset);
  const scale = Math.min(usable / bw, usable / bh);
  const ox = (canvas - bw * scale) / 2;
  const oy = (canvas - bh * scale) / 2;
  return { scale, ox, oy, usable };
}

function buildFaviconSvg(bg, fg, { rounded = true } = {}) {
  const { scale, ox, oy } = layoutLogo();
  const rx = rounded ? cornerRadius : 0;
  const paths = eyesPathD.map((d) => `    <path fill="${fg}" d="${d}"/>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}">
  <rect width="${canvas}" height="${canvas}" rx="${rx}" ry="${rx}" fill="${bg}"/>
  <g transform="translate(${ox.toFixed(3)} ${oy.toFixed(3)}) scale(${scale.toFixed(8)}) translate(${(-bx).toFixed(3)} ${(-by).toFixed(3)})">
${paths}
  </g>
</svg>
`;
}

/** Safari pinned-tab / mask-icon — monochrome eyes on transparent square with safe inset */
function buildMaskedIconSvg() {
  const { scale, ox, oy } = layoutLogo();
  const paths = eyesPathD.map((d) => `    <path fill="black" d="${d}"/>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}">
  <g transform="translate(${ox.toFixed(3)} ${oy.toFixed(3)}) scale(${scale.toFixed(8)}) translate(${(-bx).toFixed(3)} ${(-by).toFixed(3)})">
${paths}
  </g>
</svg>
`;
}

function renderPng(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon.png': 192,
  'apple-touch-icon.png': 180,
  'brand/choosify-logo-icon-app.png': 512,
};
const pwa = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512];

async function writeSet(root, roundedSvg, maskableSvg, maskedMonoSvg) {
  if (!fs.existsSync(root)) {
    console.warn('skip missing root', root);
    return;
  }
  fs.mkdirSync(path.join(root, 'brand'), { recursive: true });
  fs.mkdirSync(path.join(root, 'icons'), { recursive: true });

  fs.writeFileSync(path.join(root, 'favicon.svg'), roundedSvg);
  fs.writeFileSync(path.join(root, 'brand', 'choosify-favicon.svg'), roundedSvg);
  fs.writeFileSync(path.join(root, 'masked-icon.svg'), maskedMonoSvg);

  for (const [rel, size] of Object.entries(sizes)) {
    const out = path.join(root, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    // Apple applies its own mask — use full-bleed square with safe-zone logo
    const svg = rel === 'apple-touch-icon.png' ? maskableSvg : roundedSvg;
    fs.writeFileSync(out, renderPng(svg, size));
    console.log(out, fs.statSync(out).size);
  }

  for (const s of pwa) {
    fs.writeFileSync(path.join(root, 'icons', `icon-${s}x${s}.png`), renderPng(roundedSvg, s));
    fs.writeFileSync(
      path.join(root, 'icons', `icon-${s}x${s}-maskable.png`),
      renderPng(maskableSvg, s),
    );
  }
}

const storeRounded = buildFaviconSvg('#FFFFFF', '#EB4501', { rounded: true });
const storeMaskable = buildFaviconSvg('#FFFFFF', '#EB4501', { rounded: false });
const adminRounded = buildFaviconSvg('#000435', '#FFFFFF', { rounded: true });
const adminMaskable = buildFaviconSvg('#000435', '#FFFFFF', { rounded: false });
const maskedMono = buildMaskedIconSvg();

await writeSet(web, storeRounded, storeMaskable, maskedMono);
await writeSet(admin, adminRounded, adminMaskable, maskedMono);

const { default: pngToIco } = await import('png-to-ico');
for (const root of [web, admin]) {
  if (!fs.existsSync(root)) continue;
  const buf = await pngToIco([
    path.join(root, 'favicon-16x16.png'),
    path.join(root, 'favicon-32x32.png'),
  ]);
  fs.writeFileSync(path.join(root, 'favicon.ico'), buf);
  console.log('ico', root, buf.length);
}

const layout = layoutLogo();
console.log(
  JSON.stringify(
    {
      cornerRadius,
      cornerPct: +(cornerRadius / canvas).toFixed(3),
      safeInset,
      logoSpanPct: +((1 - 2 * safeInset) * 100).toFixed(1),
      androidSafeZonePct: 66,
      scale: +layout.scale.toFixed(6),
    },
    null,
    2,
  ),
);
