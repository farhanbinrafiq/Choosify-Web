import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

const web = 'C:/Users/User/Projects/Choosify-Web/public';
const admin = 'C:/Users/User/Projects/choosify-admin-4.0/public';

// Eyes art bounds
const bx = 261.18;
const by = 1102.85;
const bw = 3001.35;
const bh = 1466.49;

const canvas = 512;
const margin = 28;
const usable = canvas - margin * 2;
const scale = usable / bw;
const ox = margin;
const oy = (canvas - bh * scale) / 2;
const radius = 112;

const eyesPathD = [
  'M3077.32,1913.39c0-153.52-124.56-277.91-278.07-277.91s-278.07,124.39-278.07,277.91,124.56,278.07,278.07,278.07c26.65,0,52.32-3.79,76.67-10.7-10.69-17.44-16.95-38.17-16.95-60.22,0-64,51.83-115.84,115.67-115.84,28.96,0,55.45,10.7,75.69,28.14,17.28-36.2,26.98-76.67,26.98-119.46Z',
  'M1243.76,1913.39c0-153.52-124.56-277.91-278.07-277.91s-278.07,124.39-278.07,277.91c0,153.52,124.56,278.07,278.07,278.07,26.65,0,52.32-3.79,76.67-10.7-10.69-17.44-16.95-38.17-16.95-60.22,0-64,51.83-115.84,115.67-115.84,28.96,0,55.45,10.7,75.69,28.14,17.28-36.2,26.98-76.67,26.98-119.46Z',
  'M908.33,2569.34c-110.57,0-217.88-21.67-318.95-64.42-97.58-41.27-185.19-100.34-260.41-175.56-75.22-75.22-134.28-162.83-175.56-260.41-42.75-101.07-64.42-208.38-64.42-318.95s21.68-217.88,64.42-318.95c41.27-97.58,100.34-185.19,175.56-260.41,75.22-75.22,162.83-134.28,260.41-175.56,101.07-42.75,208.38-64.42,318.95-64.42s217.88,21.67,318.95,64.42c97.58,41.27,185.19,100.34,260.41,175.56,75.22,75.22,134.28,162.83,175.56,260.41,42.75,101.07,64.42,208.38,64.42,318.95s-21.68,217.88-64.42,318.95c-41.27,97.58-100.34,185.19-175.56,260.41-75.22,75.22-162.83,134.28-260.41,175.56-101.07,42.75-208.38,64.42-318.95,64.42ZM908.33,1102.85c-356.84,0-647.15,290.31-647.15,647.15s290.31,647.15,647.15,647.15,647.15-290.31,647.15-647.15-290.31-647.15-647.15-647.15Z',
  'M2615.38,2569.34c-110.57,0-217.88-21.67-318.95-64.42-97.58-41.27-185.19-100.34-260.41-175.56-75.22-75.22-134.28-162.83-175.56-260.41-42.75-101.07-64.42-208.38-64.42-318.95s21.68-217.88,64.42-318.95c41.27-97.58,100.34-185.19,175.56-260.41,75.22-75.22,162.83-134.28,260.41-175.56,101.07-42.75,208.38-64.42,318.95-64.42s217.88,21.67,318.95,64.42c97.58,41.27,185.19,100.34,260.41,175.56,75.22,75.22,134.28,162.83,175.56,260.41,42.75,101.07,64.42,208.38,64.42,318.95s-21.68,217.88-64.42,318.95c-41.27,97.58-100.34,185.19-175.56,260.41-75.22,75.22-162.83,134.28-260.41,175.56-101.07,42.75-208.38,64.42-318.95,64.42ZM2615.38,1102.85c-356.84,0-647.15,290.31-647.15,647.15s290.31,647.15,647.15,647.15,647.15-290.31,647.15-647.15-290.31-647.15-647.15-647.15Z',
];

function buildFaviconSvg(bg, fg) {
  const paths = eyesPathD.map((d) => `    <path fill="${fg}" d="${d}"/>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}">
  <rect width="${canvas}" height="${canvas}" rx="${radius}" ry="${radius}" fill="${bg}"/>
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

async function writeSet(root, svg) {
  fs.writeFileSync(path.join(root, 'favicon.svg'), svg);
  fs.writeFileSync(path.join(root, 'brand', 'choosify-favicon.svg'), svg);
  for (const [rel, size] of Object.entries(sizes)) {
    const out = path.join(root, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, renderPng(svg, size));
    console.log(out, fs.statSync(out).size);
  }
  for (const s of pwa) {
    fs.writeFileSync(path.join(root, 'icons', `icon-${s}x${s}.png`), renderPng(svg, s));
  }
}

// Storefront: white bg + orange eyes
const storeSvg = buildFaviconSvg('#FFFFFF', '#EB4501');
// Admin: navy bg + white eyes
const adminSvg = buildFaviconSvg('#000435', '#FFFFFF');
await writeSet(web, storeSvg);
await writeSet(admin, adminSvg);

const { default: pngToIco } = await import('png-to-ico');
for (const root of [web, admin]) {
  const buf = await pngToIco([
    path.join(root, 'favicon-16x16.png'),
    path.join(root, 'favicon-32x32.png'),
  ]);
  fs.writeFileSync(path.join(root, 'favicon.ico'), buf);
  console.log('ico', root, buf.length);
}

console.log('storefront: bg #FFFFFF / eyes #EB4501');
console.log('admin: bg #000435 / eyes #FFFFFF');
