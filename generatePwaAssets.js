import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    let k = (c ^ buf[i]) & 0xff;
    for (let j = 0; j < 8; j++) {
      if (k & 1) k = (k >>> 1) ^ 0xedb88320;
      else k = k >>> 1;
    }
    c = (c >>> 8) ^ k;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generateLogoPng(width, height) {
  const byteSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowSize = width * 3 + 1;
  const imgData = Buffer.alloc(height * rowSize);

  // Geometric math for rendering logo
  const cx = width / 2;
  const cy = height / 2;
  const R = 10 * (width / 24);
  const lx = cx - 2.5 * (width / 24);
  const rx = cx + 2.5 * (width / 24);
  const r = 2.5 * (width / 24);

  // Navy: #000435 -> [0, 4, 53]
  // Orange: #FF5B00 -> [255, 91, 0]
  // White: [255, 255, 255]
  // Blended Right: 40% White over Orange -> [255, 156, 102]
  const navy = [0, 4, 53];
  const orange = [255, 91, 0];
  const white = [255, 255, 255];
  const blended = [255, 156, 102];

  for (let y = 0; y < height; y++) {
    imgData[y * rowSize] = 0; // Filter 0
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + 1 + x * 3;
      
      const dx_outer = x - cx;
      const dy_outer = y - cy;
      const is_outer = (dx_outer * dx_outer + dy_outer * dy_outer) <= R * R;

      const dx_left = x - lx;
      const dy_left = y - cy;
      const is_left = (dx_left * dx_left + dy_left * dy_left) <= r * r;

      const dx_right = x - rx;
      const dy_right = y - cy;
      const is_right = (dx_right * dx_right + dy_right * dy_right) <= r * r;

      let color = navy;
      if (is_left) {
        color = white;
      } else if (is_right) {
        color = blended;
      } else if (is_outer) {
        color = orange;
      }

      imgData[idx] = color[0];
      imgData[idx + 1] = color[1];
      imgData[idx + 2] = color[2];
    }
  }

  const compressed = zlib.deflateSync(imgData);
  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([byteSignature, createChunk('IHDR', ihdr), idat, iend]);
}

export function buildAssets() {
  const publicDir = path.resolve('./public');
  const iconsDir = path.join(publicDir, 'icons');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Create SVGs
  const maskedIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#FF5B00" />
  <circle cx="9.5" cy="12" r="2.5" fill="#FFFFFF" />
  <circle cx="14.5" cy="12" r="2.5" fill="#FFFFFF" opacity="0.4" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), maskedIconSvg);

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" fill="#000435"/>
  <circle cx="12" cy="12" r="10" fill="#FF5B00" />
  <circle cx="9.5" cy="12" r="2.5" fill="#FFFFFF" />
  <circle cx="14.5" cy="12" r="2.5" fill="#FFFFFF" opacity="0.4" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateLogoPng(32, 32)); // Use a real favicon.ico bytes

  // Generate PNG icons of all required sizes
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  for (const size of sizes) {
    const pngBuf = generateLogoPng(size, size);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), pngBuf);
  }

  // Generate apple-touch-icon.png (180x180 and 152x152 sizes)
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateLogoPng(180, 180));

  console.log('PWA logo assets generated successfully in public/');
}
