const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('docs/design/choosify-3-0/Choosify.dc.html', 'utf8');
const outDir = 'docs/design/choosify-3-0/screens';
fs.mkdirSync(outDir, { recursive: true });
for (const label of ['Products List', 'Product Detail', 'Deals', 'Brands List', 'Creators List', 'Categories']) {
  const marker = `data-screen-label="${label}"`;
  const start = html.indexOf(marker);
  if (start < 0) { console.log('missing', label); continue; }
  const divStart = html.lastIndexOf('<div', start);
  const next = html.indexOf('data-screen-label="', start + marker.length);
  const end = next > 0 ? html.lastIndexOf('<div', next) : divStart + 35000;
  const chunk = html.slice(divStart, end > divStart ? end : divStart + 30000);
  const file = path.join(outDir, `${label.replace(/\s+/g, '-').toLowerCase()}.html`);
  fs.writeFileSync(file, chunk);
  console.log(label, chunk.length);
}
