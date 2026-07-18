import sharp from 'sharp';
import { writeFileSync, unlinkSync } from 'fs';

const cropSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="280 420 2940 1640" width="512" height="512">
  <path fill="#ef3c23" d="M2991.4,1393.6c0-144.4-117.2-261.4-261.6-261.4s-261.6,117-261.6,261.4,117.2,261.6,261.6,261.6,49.2-3.6,72.1-10.1c-10.1-16.4-15.9-35.9-15.9-56.6,0-60.2,48.8-109,108.8-109s52.2,10.1,71.2,26.5c16.2-34,25.4-72.1,25.4-112.4Z"/>
  <path fill="#ef3c23" d="M1266.7,1393.6c0-144.4-117.2-261.4-261.6-261.4s-261.6,117-261.6,261.4c0,144.4,117.2,261.6,261.6,261.6s49.2-3.6,72.1-10.1c-10.1-16.4-15.9-35.9-15.9-56.6,0-60.2,48.8-109,108.8-109s52.2,10.1,71.2,26.5c16.2-34,25.4-72.1,25.4-112.4Z"/>
  <path fill="#ef3c23" d="M951.2,2010.6c-104,0-204.9-20.4-300-60.6-91.8-38.8-174.2-94.4-244.9-165.1-70.8-70.8-126.3-153.2-165.1-244.9-40.2-95.1-60.6-196-60.6-300s20.4-204.9,60.6-300c38.8-91.8,94.4-174.2,165.1-244.9,70.8-70.8,153.2-126.3,244.9-165.1,95.1-40.2,196-60.6,300-60.6s204.9,20.4,300,60.6c91.8,38.8,174.2,94.4,244.9,165.1,70.8,70.8,126.3,153.2,165.1,244.9,40.2,95.1,60.6,196,60.6,300s-20.4,204.9-60.6,300c-38.8,91.8-94.4,174.2-165.1,244.9-70.8,70.8-153.2,126.3-244.9,165.1-95.1,40.2-196,60.6-300,60.6ZM951.2,631.2c-335.7,0-608.7,273.1-608.7,608.7s273.1,608.7,608.7,608.7,608.7-273.1,608.7-608.7-273.1-608.7-608.7-608.7Z"/>
  <path fill="#ef3c23" d="M2556.9,2010.6c-104,0-204.9-20.4-300-60.6-91.8-38.8-174.2-94.4-244.9-165.1-70.8-70.8-126.3-153.2-165.1-244.9-40.2-95.1-60.6-196-60.6-300s20.4-204.9,60.6-300c38.8-91.8,94.4-174.2,165.1-244.9,70.8-70.8,153.2-126.3,244.9-165.1,95.1-40.2,196-60.6,300-60.6s204.9,20.4,300,60.6c91.8,38.8,174.2,94.4,244.9,165.1,70.8,70.8,126.3,153.2,165.1,244.9,40.2,95.1,60.6,196,60.6,300s-20.4,204.9-60.6,300c-38.8,91.8-94.4,174.2-165.1,244.9-70.8,70.8-153.2,126.3-244.9,165.1-95.1,40.2-196,60.6-300,60.6ZM2556.9,631.2c-335.7,0-608.7,273.1-608.7,608.7s273.1,608.7,608.7,608.7,608.7-273.1,608.7-608.7-273.1-608.7-608.7-608.7Z"/>
</svg>`;

const input = Buffer.from(cropSvg);
const sizes = [16, 32, 48];
const pngs = [];

for (const s of sizes) {
  const buf = await sharp(input)
    .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  pngs.push({ size: s, buf });
}

await sharp(input)
  .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/logo.png');

/** Build a PNG-embedded ICO (Vista+). */
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + 16 * count;
  const payloads = [];

  for (const { size, buf } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    payloads.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...payloads]);
}

const ico = buildIco(pngs);
writeFileSync('public/favicon.ico', ico);
console.log('favicon.ico', ico.length, 'bytes; magic', [...ico.slice(0, 6)]);

for (const s of sizes) {
  try {
    unlinkSync(`public/favicon-${s}.png`);
  } catch {
    /* ignore */
  }
}
