/**
 * Self-hosted Node/Express server for the Choosify storefront SPA.
 *
 * Replaces three Vercel-only pieces previously required for social sharing:
 *  - middleware.js       (Vercel Edge Middleware — crawler UA rewrite)
 *  - api/share.js        (Vercel Edge Function — server-rendered OG/Twitter HTML)
 *  - api/og.js            (Vercel Edge Function — @vercel/og dynamic image)
 *
 * In production this serves the Vite-built dist/ SPA directly; in development
 * it delegates to Vite's dev middleware, matching the pattern already used by
 * the Admin repo's server.ts.
 */
import fs from 'fs';
import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { SITE_URL, SOCIAL_CRAWLER_UA_PATTERN } from './lib/seoShared';
import { buildShareHtml, injectSeoHead, resolvePageMeta } from './server/shareHtml';
import { buildRobotsTxt, buildSitemapXml } from './server/seoRoutes';
import { generateOgImage } from './server/ogImage';

/** www.choosify.bd -> choosify.bd (the canonical host in SITE_URL). */
const CANONICAL_HOST = new URL(SITE_URL).host;
const WWW_HOST = `www.${CANONICAL_HOST}`;

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '127.0.0.1'; // Production traffic reaches this server through the local Nginx reverse proxy.
const isProduction = process.env.NODE_ENV === 'production';

function isCrawlerRequest(userAgent: string, pathname: string): boolean {
  if (!SOCIAL_CRAWLER_UA_PATTERN.test(userAgent)) return false;
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/og/') ||
    pathname.includes('.')
  ) {
    return false;
  }
  return true;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  // One public host: Nginx forwards both choosify.bd and www.choosify.bd here
  // with the original Host header; www is permanently redirected, keeping the
  // full path and query string.
  app.use((req, res, next) => {
    const host = String(req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
    if (host !== WWW_HOST) return next();
    res.redirect(req.method === 'GET' || req.method === 'HEAD' ? 301 : 308, `${SITE_URL}${req.originalUrl}`);
  });
  // Baseline security headers for the storefront (the dashboard sets the same via helmet).
  // No CSP here yet — it needs a tested allowlist for every third-party asset first.
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    if (isProduction) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    next();
  });
  const distPath = path.join(process.cwd(), 'dist');
  const assetRoot = isProduction ? distPath : path.join(process.cwd(), 'public');

  app.get('/api/og', async (req, res) => {
    try {
      const png = await generateOgImage(
        {
          title: typeof req.query.title === 'string' ? req.query.title : undefined,
          description: typeof req.query.description === 'string' ? req.query.description : undefined,
          type: typeof req.query.type === 'string' ? req.query.type : undefined,
          brand: typeof req.query.brand === 'string' ? req.query.brand : undefined,
          label: typeof req.query.label === 'string' ? req.query.label : undefined,
          image: typeof req.query.image === 'string' ? req.query.image : undefined,
        },
        assetRoot,
      );
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      res.end(png);
    } catch (error) {
      console.error('[api/og]', error);
      res.status(500).send('Failed to generate OG image');
    }
  });

  app.get('/robots.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(buildRobotsTxt());
  });

  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const xml = await buildSitemapXml();
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=600');
      res.end(xml);
    } catch (error) {
      // 503 (retry later), never a partial sitemap that would drop live pages.
      console.error('[sitemap]', error);
      res.setHeader('Retry-After', '600');
      res.status(503).type('text/plain').send('Sitemap temporarily unavailable');
    }
  });

  app.get('/api/share', async (req, res) => {
    try {
      const pathWithQuery = typeof req.query.path === 'string' ? req.query.path : '/';
      const [pathname, query = ''] = pathWithQuery.split('?');
      const html = await buildShareHtml(pathname || '/', query ? `?${query}` : '');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=86400');
      res.end(html);
    } catch (error) {
      console.error('[api/share]', error);
      res.status(500).send('Failed to render share page');
    }
  });

  // Social crawlers do not execute SPA JavaScript — serve pre-rendered OG HTML directly.
  app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();
    const userAgent = req.headers['user-agent'] || '';
    const pathname = req.path;
    if (!isCrawlerRequest(userAgent, pathname)) return next();
    try {
      const html = await buildShareHtml(pathname, req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=86400');
      res.end(html);
    } catch (error) {
      console.error('[crawler-share]', error);
      next();
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), { immutable: true, maxAge: '365d' }),
    );
    app.use('/og', express.static(path.join(distPath, 'og'), { maxAge: '1d' }));
    // dotfiles: 'allow' is required so /.well-known/... (e.g. BIMI's
    // /.well-known/bimi/choosify.svg) is actually served -- serve-static's
    // default 'ignore' silently skips any path with a dot-prefixed segment
    // and falls through to the SPA catch-all below instead of 404ing.
    app.use(express.static(distPath, { index: false, maxAge: '1h', dotfiles: 'allow' }));
    // Every page gets its own title, description, canonical, robots and
    // Open Graph tags in the HTML itself (PageSeo keeps them in sync after
    // client-side navigation).
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    app.use(async (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const search = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
      const meta = await resolvePageMeta(req.path, search);
      res.type('html').send(injectSeoHead(indexHtml, meta));
    });
  }

  const httpServer = createServer(app);
  httpServer.listen(PORT, HOST, () => {
    console.log(`[Choosify-Web] listening on :${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start Choosify-Web server', error);
  process.exit(1);
});
