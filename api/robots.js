const SITE_URL = 'https://www.choosify.bd';

const NOINDEX_PATH_PREFIXES = [
  '/login',
  '/dashboard',
  '/checkout',
  '/cart',
  '/messages',
  '/seller',
  '/order-success',
  '/order-tracking',
  '/post-offer',
  '/profile',
  '/overview',
];

function buildRobotsTxt() {
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

module.exports = function handler(_req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).send(buildRobotsTxt());
};
