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

export function generateAttachedLogoPng(width, height) {
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
  const orangeRed = [240, 60, 30, 255]; // #F03C1E
  const transparent = [0, 0, 0, 0];

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
      
      let col = transparent;
      
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
              col = transparent;
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
              col = transparent;
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

export function buildLogo() {
  const publicDir = path.resolve('./public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const pngBuf = generateAttachedLogoPng(512, 512);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), pngBuf);
  console.log('Precise PNG Logo generated at public/logo.png');
}
