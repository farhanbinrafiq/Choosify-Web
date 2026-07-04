import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/AllProductsPage.tsx',
  'src/pages/BrandsPage.tsx',
  'src/pages/CategoriesPage.tsx',
  'src/pages/CreatorsPage.tsx',
  'src/pages/DealsPage.tsx',
  'src/pages/GuidesPage.tsx',
  'src/pages/WhatsOnPage.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/BrandDealsPage.tsx',
  'src/pages/GuideDetailPage.tsx',
  'src/pages/CreatorProfilePage.tsx',
  'src/components/CompareEngine.tsx',
];

const shellPatterns = [
  'choosify-page-shell choosify-page-grid grid grid-cols-1 gap-5 xl:gap-6 2xl:gap-7 items-start w-full relative',
  'choosify-page-shell choosify-page-grid grid grid-cols-1 gap-5 xl:gap-6 2xl:gap-7 relative',
  'choosify-page-shell choosify-page-grid grid grid-cols-1 gap-5 xl:gap-6 2xl:gap-7 items-start relative',
];

for (const file of files) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.warn('Skip missing', file);
    continue;
  }
  let content = fs.readFileSync(full, 'utf8');
  let changed = false;

  for (const pattern of shellPatterns) {
    if (content.includes(pattern)) {
      content = content.replaceAll(pattern, '${PAGE_LISTING_SINGLE_SHELL}');
      changed = true;
    }
  }

  if (content.includes("'choosify-page-shell choosify-page-grid grid grid-cols-1 gap-5 xl:gap-6 2xl:gap-7 relative'")) {
    content = content.replaceAll(
      "'choosify-page-shell choosify-page-grid grid grid-cols-1 gap-5 xl:gap-6 2xl:gap-7 relative'",
      'PAGE_LISTING_SINGLE_SHELL',
    );
    changed = true;
  }

  if (changed) {
    if (!content.includes('PAGE_LISTING_SINGLE_SHELL')) {
      console.warn('Pattern replaced but constant missing in', file);
    }
    if (!content.includes('from "../lib/pageLayout"') && !content.includes("from '../lib/pageLayout'")) {
      content = content.replace(
        /(import React[^\n]*\n)/,
        `$1import { PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";\n`,
      );
    } else if (!content.match(/PAGE_LISTING_SINGLE_SHELL.*pageLayout|pageLayout.*PAGE_LISTING_SINGLE_SHELL/)) {
      content = content.replace(
        /from ["']\.\.\/lib\/pageLayout["'];?/,
        (m) => {
          if (content.includes('PAGE_LISTING_SINGLE_SHELL')) return m;
          return m.replace(';', ', PAGE_LISTING_SINGLE_SHELL;').replace('"', '{ PAGE_LISTING_SINGLE_SHELL } from "').replace("' from '", "'"); // fallback
        },
      );
      // simpler: add to existing import
      content = content.replace(
        /import \{([^}]+)\} from ["']\.\.\/lib\/pageLayout["'];/,
        (match, imports) => {
          if (imports.includes('PAGE_LISTING_SINGLE_SHELL')) return match;
          return `import {${imports.trim()}, PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";`;
        },
      );
    }

    // Fix template literal in className - use backticks
    content = content.replace(
      /className="([^"]*)\$\{PAGE_LISTING_SINGLE_SHELL\}([^"]*)"/g,
      'className={`$1${PAGE_LISTING_SINGLE_SHELL}$2`}',
    );
    content = content.replace(
      /className='([^']*)\$\{PAGE_LISTING_SINGLE_SHELL\}([^']*)'/g,
      "className={`$1${PAGE_LISTING_SINGLE_SHELL}$2`}",
    );
    content = content.replace(
      /className=\{`\$\{PAGE_LISTING_SINGLE_SHELL\}`\}/g,
      'className={`${PAGE_LISTING_SINGLE_SHELL}`}',
    );

    fs.writeFileSync(full, content);
    console.log('Updated', file);
  }
}
