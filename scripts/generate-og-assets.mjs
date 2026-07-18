import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../public');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#000435"/>
      <stop offset="60%" stop-color="#0A0A2A"/>
      <stop offset="100%" stop-color="#14142E"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1080" cy="80" r="180" fill="#FF5B00" fill-opacity="0.18"/>
  <circle cx="80" cy="560" r="160" fill="#2323FF" fill-opacity="0.16"/>
  <rect x="56" y="52" width="48" height="48" rx="12" fill="#FF5B00"/>
  <text x="80" y="86" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="26" font-weight="800">C</text>
  <text x="120" y="75" fill="#fff" font-family="Arial,sans-serif" font-size="28" font-weight="800">Choosify</text>
  <text x="120" y="98" fill="rgba(255,255,255,0.55)" font-family="Arial,sans-serif" font-size="14" font-weight="600">buy ORIGINAL</text>
  <rect x="980" y="56" width="150" height="36" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)"/>
  <text x="1055" y="80" text-anchor="middle" fill="#FF5B00" font-family="Arial,sans-serif" font-size="14" font-weight="700">CHOOSIFY</text>
  <text x="56" y="280" fill="#fff" font-family="Arial,sans-serif" font-size="54" font-weight="800">Bangladesh Smartest</text>
  <text x="56" y="345" fill="#fff" font-family="Arial,sans-serif" font-size="54" font-weight="800">Product Discovery</text>
  <text x="56" y="410" fill="rgba(255,255,255,0.72)" font-family="Arial,sans-serif" font-size="24" font-weight="500">Compare verified brands. Discover trusted products.</text>
  <text x="56" y="560" fill="rgba(255,255,255,0.55)" font-family="Arial,sans-serif" font-size="20" font-weight="700">www.choosify.bd</text>
  <text x="1144" y="560" text-anchor="end" fill="rgba(255,255,255,0.45)" font-family="Arial,sans-serif" font-size="16">Verified discovery for Bangladesh</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(path.join(root, 'og/default.png'));

const sourceIcon = path.join(root, 'logo.png');
await sharp(sourceIcon).resize(16, 16).png().toFile(path.join(root, 'favicon-16x16.png'));
await sharp(sourceIcon).resize(32, 32).png().toFile(path.join(root, 'favicon-32x32.png'));
await sharp(sourceIcon).resize(180, 180).png().toFile(path.join(root, 'apple-touch-icon.png'));
console.log('Generated og/default.png, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png');
