import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { BRAND_BG_COLOR, CHOOSIFY_ICON_SVG } from './brandLogoSvg.js';

export async function buildLogo() {
  const publicDir = path.resolve('./public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(CHOOSIFY_ICON_SVG);

  const paddedSize = Math.round(512 * 0.88);
  const logoBuffer = await sharp(svgBuffer)
    .resize({
      width: paddedSize,
      height: paddedSize,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const finalPng = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: BRAND_BG_COLOR,
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

  fs.writeFileSync(path.join(publicDir, 'logo.png'), finalPng);
  console.log('Precise SVG-based PNG Logo generated at public/logo.png successfully!');
}
