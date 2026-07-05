import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { BRAND_BG_COLOR, MASKED_ICON_SVG, OFFICIAL_SVG_LOGO } from './brandLogoSvg.js';

export async function buildAssets() {
  const publicDir = path.resolve('./public');
  const iconsDir = path.join(publicDir, 'icons');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), OFFICIAL_SVG_LOGO);
  fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), MASKED_ICON_SVG);

  const svgBuffer = Buffer.from(OFFICIAL_SVG_LOGO);

  const renderSquareIcon = async (size, bgHex = BRAND_BG_COLOR, paddingPercent = 0.08) => {
    const paddedSize = Math.round(size * (1 - paddingPercent * 2));

    const logoBuffer = await sharp(svgBuffer)
      .resize({
        width: paddedSize,
        height: paddedSize,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bgHex,
      },
    })
      .composite([
        {
          input: logoBuffer,
          gravity: 'center',
        },
      ])
      .png()
      .toBuffer();
  };

  const faviconIcoBuffer = await renderSquareIcon(32, BRAND_BG_COLOR, 0.06);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconIcoBuffer);

  const appleTouchIconBuffer = await renderSquareIcon(180, BRAND_BG_COLOR, 0.08);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIconBuffer);

  const sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512];
  for (const size of sizes) {
    const pngBuf = await renderSquareIcon(size, BRAND_BG_COLOR, 0.08);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), pngBuf);
  }

  console.log('All PWA assets programmatically generated from the master official SVG successfully!');
}
