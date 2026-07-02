import { NOINDEX_PATH_PREFIXES, SITE_URL } from '../lib/seoShared';

function buildRobotsTxt(): string {
  const disallowRules = NOINDEX_PATH_PREFIXES.map((prefix) => `Disallow: ${prefix}`).join('\n');

  return [
    'User-agent: *',
    'Allow: /',
    '',
    disallowRules,
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

export default function handler(
  _req: unknown,
  res: {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => { send: (body: string) => void };
  },
) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).send(buildRobotsTxt());
}
