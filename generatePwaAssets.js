import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OFFICIAL_SVG_LOGO = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2547.21 1388.35">
  <defs>
    <style>
      .cls-1 {
        fill: #fff;
      }

      .cls-2 {
        fill: #ef3c23;
      }
    </style>
  </defs>
  <g>
    <path class="cls-2" d="M1954.92,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36,62.01,138.44,138.44,138.44c13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47h0Z"/>
    <path class="cls-2" d="M1042.07,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36,62.01,138.44,138.44,138.44c13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47h0Z"/>
    <path class="cls-2" d="M875.08,815.83c-224.92,0-407.91-182.99-407.91-407.91S650.15,0,875.08,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91h0ZM875.08,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71h0Z"/>
    <path class="cls-2" d="M1724.94,815.83c-224.92,0-407.91-182.99-407.91-407.91S1500.01,0,1724.94,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91h0ZM1724.94,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71h0Z"/>
  </g>
  <g>
    <path class="cls-1" d="M.02,1116.82c0-98.08,66.8-172.86,169.17-172.86,87.05,0,141.02,49.65,152.63,120.74h-93.15c-6.73-30.03-26.35-49.04-58.21-49.04-48.46,0-72.95,39.84-72.95,101.15s24.49,99.91,72.95,99.91c35.52,0,56.99-21.44,61.28-58.85h92.56c-3.08,74.17-61.92,131.8-152.63,131.8-104.23,0-171.67-75.39-171.67-172.86h.02Z"/>
    <path class="cls-1" d="M465.51,1279.26h-96.28v-456.06h96.28v125.67c0,3.05,0,29.42-.64,50.87h1.86c19.62-34.94,52.7-55.77,98.08-55.77,71.67,0,113.4,47.79,113.4,120.74v214.55h-95.64v-196.16c0-35.55-18.98-59.46-54.55-59.46-37.37,0-62.5,30.03-62.5,71.73v183.88h-.01Z"/>
    <path class="cls-1" d="M724.4,1116.82c0-98.08,68.65-172.86,172.88-172.86s171.61,74.78,171.61,172.86-68.02,172.86-171.61,172.86-172.88-75.39-172.88-172.86ZM971.46,1116.82c0-61.92-26.99-104.2-74.81-104.2s-74.75,42.28-74.75,104.2,25.71,102.98,74.75,102.98,74.81-41.7,74.81-102.98Z"/>
    <path class="cls-1" d="M1102.27,1116.82c0-98.08,68.65-172.86,172.88-172.86s171.61,74.78,171.61,172.86-68.02,172.86-171.61,172.86-172.88-75.39-172.88-172.86ZM1349.32,1116.82c0-61.92-26.99-104.2-74.81-104.2s-74.75,42.28-74.75,104.2,25.71,102.98,74.75,102.98,74.81-41.7,74.81-102.98Z"/>
    <path class="cls-1" d="M1474.56,1178.72h90.71c5.51,30.67,28.84,47.82,66.22,47.82,34.36,0,53.97-14.1,53.97-37.37,0-29.42-38.65-33.11-83.98-41.7-58.27-11.03-117.11-25.74-117.11-101.76,0-66.8,60.7-101.73,137.31-101.73,90.71,0,136.09,39.23,144.68,96.22h-89.49c-6.15-23.27-24.55-34.94-55.19-34.94s-48.4,12.27-48.4,33.11c0,24.52,35.52,28.2,80.26,36.16,58.27,10.42,124.48,25.74,124.48,107.89,0,70.51-62.56,107.28-147.12,107.28-94.42,0-151.41-45.35-156.34-110.96v-.02Z"/>
    <rect class="cls-1" x="1826.01" y="953.14" width="96.28" height="326.12"/>
    <path class="cls-1" d="M2111.83,1015.67v263.59h-96.28v-263.59h-49.04v-62.53h49.04v-27.57c0-34.94,8.59-59.46,27.62-76.63,21.41-19.01,55.13-26.35,96.8-25.74,12.88,0,26.41.61,39.87,2.44v68.65c-48.4-1.83-68.02,1.25-68.02,38.01v20.83h68.02v62.53h-68.02.01Z"/>
    <path class="cls-1" d="M2247.4,1387.15v-75.39h4.93c1.22.61,28.79.61,31.28.61,30,0,44.74-11.03,46.54-33.11,0-11.03-5.51-36.16-17.12-65.58l-101.15-260.55h101.15l41.67,125.06c14.68,44.14,26.99,113.4,26.99,113.4h1.22s14.68-69.87,28.79-113.4l39.87-125.06h95.64l-116.47,334.1c-26.41,75.39-56.41,101.12-118.91,101.12-3.08,0-62.56-.61-64.42-1.22v.02Z"/>
    <path class="cls-2" d="M1874.46,920.07c28.78,0,52.1-23.35,52.1-52.13s-23.32-52.13-52.1-52.13-52.13,23.35-52.13,52.13c0,5,.71,9.81,2.01,14.37,3.27-2,7.16-3.18,11.29-3.18,12,0,21.72,9.72,21.72,21.69,0,5.43-2.01,10.4-5.27,14.19,6.79,3.24,14.37,5.06,22.39,5.06h-.01Z"/>
  </g>
</svg>`;

export async function buildAssets() {
  const publicDir = path.resolve('./public');
  const iconsDir = path.join(publicDir, 'icons');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // 1. Write the exact official master SVG to favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), OFFICIAL_SVG_LOGO);

  // 2. Generate masked-icon.svg (using only the eyes group colored black/currentcolor so it acts as standard mask)
  const maskedIconSvg = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="467.15 0 1665.68 815.83">
  <g fill="currentColor">
    <path d="M1954.92,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36,62.01,138.44,138.44,138.44c13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47Z"/>
    <path d="M1042.07,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36,62.01,138.44,138.44,138.44c13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47Z"/>
    <path d="M875.08,815.83c-224.92,0-407.91-182.99-407.91-407.91S650.15,0,875.08,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91ZM875.08,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71Z"/>
    <path d="M1724.94,815.83c-224.92,0-407.91-182.99-407.91-407.91S1500.01,0,1724.94,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91ZM1724.94,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71Z"/>
  </g>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), maskedIconSvg);

  const svgBuffer = Buffer.from(OFFICIAL_SVG_LOGO);

  // Helper to render the official logo inside a square canvas using sharp
  const renderSquareIcon = async (size, bgHex = '#000435', paddingPercent = 0.15) => {
    // Determine target size of logo inside the padded box
    const paddedSize = Math.round(size * (1 - paddingPercent * 2));
    
    // We render the SVG first with a specific height/width to ensure maximum sharpness
    const logoBuffer = await sharp(svgBuffer)
      .resize({
        width: paddedSize,
        height: paddedSize,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    // Now composite it onto a solid square navy canvas of exact target size
    return await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bgHex
      }
    })
    .composite([{
      input: logoBuffer,
      gravity: 'center'
    }])
    .png()
    .toBuffer();
  };

  // 3. Generate favicon.ico (32x32)
  const faviconIcoBuffer = await renderSquareIcon(32, '#000435', 0.1);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconIcoBuffer);

  // 4. Generate Apple Touch Icon (180x180)
  const appleTouchIconBuffer = await renderSquareIcon(180, '#000435', 0.15);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIconBuffer);

  // 5. Generate all required PNG icons for manifest / homescreen
  const sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512];
  for (const size of sizes) {
    const pngBuf = await renderSquareIcon(size, '#000435', 0.15);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), pngBuf);
  }

  console.log('All PWA assets programmatically generated from the master official SVG successfully!');
}
