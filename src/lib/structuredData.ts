import {
  ORGANIZATION_CONTACT,
  ORGANIZATION_SOCIAL_LINKS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
} from '../../lib/seoShared';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    email: ORGANIZATION_CONTACT.email,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: ORGANIZATION_CONTACT.contactType,
        email: ORGANIZATION_CONTACT.email,
        availableLanguage: ['en', 'bn'],
      },
    ],
    sameAs: ORGANIZATION_SOCIAL_LINKS,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    inLanguage: 'en-BD',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  description?: string;
  image?: string | string[];
  url: string;
  brand?: string;
  price?: number;
  currency?: string;
  sku?: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  const images = Array.isArray(product.image)
    ? product.image.filter(Boolean)
    : product.image
      ? [product.image]
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    url: absoluteUrl(product.url),
    sku: product.sku,
    brand: product.brand
      ? { '@type': 'Brand', name: product.brand }
      : undefined,
    offers:
      product.price && product.price > 0
        ? {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency || 'BDT',
            availability: 'https://schema.org/InStock',
            url: absoluteUrl(product.url),
          }
        : undefined,
    aggregateRating:
      product.ratingValue && product.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
}

export function reviewJsonLd(review: {
  itemName: string;
  itemUrl: string;
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: review.itemName,
      url: absoluteUrl(review.itemUrl),
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: review.datePublished,
  };
}

export function brandJsonLd(brand: {
  name: string;
  description?: string;
  logo?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    description: brand.description,
    logo: brand.logo,
    url: absoluteUrl(brand.url),
  };
}

export function articleJsonLd(article: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: absoluteUrl(article.url),
    mainEntityOfPage: absoluteUrl(article.url),
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', name: SITE_NAME },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
    },
  };
}

export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function webPageJsonLd(page: {
  name: string;
  description?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.name,
    description: page.description,
    url: absoluteUrl(page.url),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
