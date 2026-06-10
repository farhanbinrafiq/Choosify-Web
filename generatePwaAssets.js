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

function generateLogoPng(width, height, isTransparent = false) {
  const byteSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: 6 (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowSize = width * 4 + 1;
  const imgData = Buffer.alloc(height * rowSize);

  // Geometric math for rendering precise user's eye logo
  const cx = width / 2;
  const cy = height / 2;
  
  // Left and Right eye centers
  const gap = width * 0.19; // Side-by-side spacing offset
  const lx = cx - gap;
  const rx = cx + gap;
  
  // Eyeball rings
  const R_outer = width * 0.17; // Outer eyeball radius
  const R_inner = width * 0.125; // Inner eyeball radius

  // Pupils shifted slightly left-down
  const p_shift_x = -width * 0.022;
  const p_shift_y = width * 0.005;
  const r_pupil = width * 0.062; // Pupil radius
  
  // Wedge reflection (bite) at bottom-right of pupils
  const ref_shift_x = width * 0.022;
  const ref_shift_y = width * 0.022;
  const r_ref = width * 0.022; // Reflection radius
  
  // Color values matching the precise vermillion orange-red attached logo
  const orangeRed = [239, 60, 35, 255]; // #ef3c23
  const bgCol = isTransparent ? [0, 0, 0, 0] : [0, 4, 53, 255]; // Transparent vs Deep Solid Navy (#000435)

  for (let y = 0; y < height; y++) {
    imgData[y * rowSize] = 0; // Filter 0
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + 1 + x * 4;
      
      const dx_l = x - lx;
      const dy_l = y - cy;
      const d_l = Math.sqrt(dx_l * dx_l + dy_l * dy_l);
      
      const dx_r = x - rx;
      const dy_r = y - cy;
      const d_r = Math.sqrt(dx_r * dx_r + dy_r * dy_r);
      
      let col = bgCol;
      
      // Left eye calculation
      if (d_l <= R_outer) {
        if (d_l >= R_inner) {
          col = orangeRed;
        } else {
          // Inner eyeball logic - check left pupil
          const px_l = lx + p_shift_x;
          const py_l = cy + p_shift_y;
          const d_p_l = Math.sqrt((x - px_l) * (x - px_l) + (y - py_l) * (y - py_l));
          
          if (d_p_l <= r_pupil) {
            // Check reflection bite at bottom-right
            const rx_l = px_l + ref_shift_x;
            const ry_l = py_l + ref_shift_y;
            const d_ref_l = Math.sqrt((x - rx_l) * (x - rx_l) + (y - ry_l) * (y - ry_l));
            
            if (d_ref_l <= r_ref) {
              col = bgCol;
            } else {
              col = orangeRed;
            }
          }
        }
      }
      
      // Right eye calculation
      if (d_r <= R_outer) {
        if (d_r >= R_inner) {
          col = orangeRed;
        } else {
          // Inner eyeball logic - check right pupil
          const px_r = rx + p_shift_x;
          const py_r = cy + p_shift_y;
          const d_p_r = Math.sqrt((x - px_r) * (x - px_r) + (y - py_r) * (y - py_r));
          
          if (d_p_r <= r_pupil) {
            // Check reflection bite at bottom-right
            const rx_r = px_r + ref_shift_x;
            const ry_r = py_r + ref_shift_y;
            const d_ref_r = Math.sqrt((x - rx_r) * (x - rx_r) + (y - ry_r) * (y - ry_r));
            
            if (d_ref_r <= r_ref) {
              col = bgCol;
            } else {
              col = orangeRed;
            }
          }
        }
      }

      imgData[idx] = col[0];
      imgData[idx + 1] = col[1];
      imgData[idx + 2] = col[2];
      imgData[idx + 3] = col[3];
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

  // Create SVGs — Safari pinned tab / monochrome logo mask
  const maskedIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="467.15 0 1665.68 815.83">
  <g fill="currentColor">
    <path d="M1954.9,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36,62.01,138.44,138.44,138.44c13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47Z"/>
    <path d="M1042.05,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36c0,76.43,62.01,138.44,138.44,138.44,13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47Z"/>
    <path d="M875.06,815.83c-224.92,0-407.91-182.99-407.91-407.91S650.13,0,875.06,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91ZM875.06,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71Z"/>
    <path d="M1724.92,815.83c-224.92,0-407.91-182.99-407.91-407.91S1499.99,0,1724.92,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91ZM1724.92,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71Z"/>
  </g>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), maskedIconSvg);

  // Generate favicon.ico with solid base
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generateLogoPng(32, 32, false));

  // Generate PNG icons of all required sizes
  const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512];
  for (const size of sizes) {
    // Generate solid themed background versions for Android, desktop shortcuts, and store launcher definitions
    const pngBuf = generateLogoPng(size, size, false);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), pngBuf);
  }

  // Generate apple-touch-icon.png with solid theme background for iOS homescreen
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generateLogoPng(180, 180, false));

  console.log('PWA logo assets generated successfully in public/');
}
