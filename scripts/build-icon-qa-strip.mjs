import sharp from 'sharp';
import fs from 'fs';

const canvasW = 900;
const canvasH = 480;

const items = [
  { file: 'public/favicon-32x32.png', label: 'favicon 32', x: 40, y: 70, show: 32 },
  { file: 'public/apple-touch-icon.png', label: 'apple-touch', x: 100, y: 50, show: 90 },
  { file: 'public/icons/icon-192x192.png', label: 'any 192', x: 220, y: 45, show: 96 },
  { file: 'public/icons/icon-192x192-maskable.png', label: 'maskable 192', x: 340, y: 45, show: 96 },
  { file: 'public/icons/icon-512x512.png', label: 'any 512', x: 460, y: 30, show: 128 },
  { file: 'public/icons/icon-512x512-maskable.png', label: 'maskable 512', x: 610, y: 30, show: 128 },
  { file: 'public/emi-ai-logo-icon.png', label: 'emi icon', x: 100, y: 230, show: 128 },
  { file: 'public/emi-ai-logo-icon-rounded.png', label: 'emi 22% radius', x: 260, y: 230, show: 128 },
  { file: 'public/emi-ai-logo-icon-maskable.png', label: 'emi maskable', x: 420, y: 230, show: 128 },
];

const bgSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">
  <defs>
    <pattern id="c" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#e8edf2"/>
      <rect x="8" y="8" width="8" height="8" fill="#e8edf2"/>
      <rect x="8" width="8" height="8" fill="#fff"/>
      <rect y="8" width="8" height="8" fill="#fff"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#F4F7F9"/>
  <text x="24" y="28" font-family="Segoe UI,sans-serif" font-size="15" font-weight="700" fill="#1A1A2E">Choosify icon QA — inset 20% · corner 22% · content ≤60% (Android safe zone 66%)</text>
  <rect x="24" y="44" width="850" height="160" fill="url(#c)" rx="8"/>
  <rect x="24" y="220" width="850" height="180" fill="url(#c)" rx="8"/>
  <text x="24" y="430" font-family="Segoe UI,sans-serif" font-size="12" fill="#6B7280">Measured: oo contentW ≈ 60%; Emi contentH ≈ 59%. Orange dashed circle = Android 66% safe zone on maskable@128.</text>
</svg>`;

const composites = [];
for (const it of items) {
  const buf = await sharp(it.file).resize(it.show, it.show).png().toBuffer();
  composites.push({ input: buf, left: it.x, top: it.y });
}

let labelSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">`;
for (const it of items) {
  const ty = it.y + it.show + 14;
  labelSvg += `<text x="${it.x}" y="${ty}" font-family="Segoe UI,sans-serif" font-size="11" font-weight="600" fill="#6B7280">${it.label}</text>`;
}
labelSvg += `<circle cx="${610 + 64}" cy="${30 + 64}" r="42" fill="none" stroke="#EB4501" stroke-width="2" stroke-dasharray="4 3"/>`;
labelSvg += '</svg>';

await sharp(Buffer.from(bgSvg))
  .composite([...composites, { input: Buffer.from(labelSvg), left: 0, top: 0 }])
  .png()
  .toFile('public/icon-qa-strip.png');

console.log('wrote public/icon-qa-strip.png', fs.statSync('public/icon-qa-strip.png').size);
