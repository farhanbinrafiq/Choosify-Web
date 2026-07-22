import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const SITE_NAME = 'Choosify';
const SITE_THEME_COLOR = '#000435';
const SITE_BRAND_ORANGE = '#EB4501';
const SITE_URL = 'https://www.choosify.bd';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
/** Real wordmark rasterized by `npm run generate:og` from public/choosify-logo-wordmark.svg */
const WORDMARK_SRC = `${SITE_URL}/og/wordmark-light.png`;

/** Minimal element factory — Vercel Edge /api routes do not transform JSX outside Next.js. */
function h(type, props, ...children) {
  const flat = children
    .flat(Infinity)
    .filter((child) => child !== null && child !== undefined && child !== false);
  return {
    type,
    props: {
      ...(props || {}),
      children: flat.length <= 1 ? flat[0] ?? undefined : flat,
    },
  };
}

function truncate(value, max) {
  const trimmed = String(value || '').trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

function typeLabel(type) {
  switch (type) {
    case 'product':
      return 'Product';
    case 'brand':
      return 'Brand';
    case 'category':
      return 'Category';
    case 'deal':
      return 'Deal';
    case 'article':
      return 'Guide';
    case 'creator':
      return 'Creator';
    default:
      return 'Choosify';
  }
}

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = truncate(searchParams.get('title') || SITE_NAME, 90);
    const description = truncate(
      searchParams.get('description') ||
        'Compare verified brands and discover trusted products across Bangladesh.',
      140,
    );
    const type = String(searchParams.get('type') || 'default').toLowerCase();
    const brand = truncate(searchParams.get('brand') || '', 48);
    const label = truncate(searchParams.get('label') || typeLabel(type), 32);
    const image = searchParams.get('image') || '';
    const showMedia = Boolean(image) && (type === 'product' || type === 'brand' || type === 'creator');

    return new ImageResponse(
      h(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: SITE_THEME_COLOR,
            color: '#FFFFFF',
            fontFamily: 'Satoshi, Helvetica Neue, Arial, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          },
        },
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '42px 56px 0',
            },
          },
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center' } },
            h('img', {
              src: WORDMARK_SRC,
              width: 280,
              height: 54,
              style: { objectFit: 'contain' },
            }),
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                padding: '10px 18px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: 16,
                fontWeight: 700,
                color: SITE_BRAND_ORANGE,
                textTransform: 'uppercase',
                letterSpacing: 1,
              },
            },
            label,
          ),
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '28px 56px 36px',
              gap: 40,
            },
          },
          h(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                maxWidth: showMedia ? 680 : 1080,
              },
            },
            brand
              ? h(
                  'div',
                  {
                    style: {
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.65)',
                      marginBottom: 12,
                      display: 'flex',
                    },
                  },
                  brand,
                )
              : null,
            h(
              'div',
              {
                style: {
                  fontSize: showMedia ? 52 : 58,
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: -1.2,
                  display: 'flex',
                },
              },
              title,
            ),
            h(
              'div',
              {
                style: {
                  marginTop: 18,
                  fontSize: 24,
                  lineHeight: 1.35,
                  color: 'rgba(255,255,255,0.72)',
                  fontWeight: 500,
                  display: 'flex',
                },
              },
              description,
            ),
          ),
          showMedia
            ? h(
                'div',
                {
                  style: {
                    width: 280,
                    height: 280,
                    borderRadius: 28,
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.18)',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                    flexShrink: 0,
                  },
                },
                h('img', {
                  src: image,
                  alt: '',
                  width: 280,
                  height: 280,
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: type === 'brand' || type === 'creator' ? 'contain' : 'cover',
                    padding: type === 'brand' || type === 'creator' ? 28 : 0,
                  },
                }),
              )
            : null,
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 56px 40px',
            },
          },
          h(
            'div',
            {
              style: {
                fontSize: 20,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.55)',
                display: 'flex',
              },
            },
            SITE_URL.replace(/^https?:\/\//, ''),
          ),
          h(
            'div',
            {
              style: {
                fontSize: 18,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.45)',
                display: 'flex',
              },
            },
            'Bangladesh\'s Smartest Product Discovery Platform',
          ),
        ),
      ),
      {
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch (error) {
    console.error('[api/og]', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
