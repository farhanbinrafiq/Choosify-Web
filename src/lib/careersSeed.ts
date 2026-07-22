import type { PublicJobPosting } from '../services/operationsApi';

/** Offline / API-failure fallback — mirrors backend seed. */
export const FALLBACK_JOB_POSTINGS: PublicJobPosting[] = [
  {
    id: 'job-frontend-engineer',
    slug: 'frontend-engineer',
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Dhaka / Hybrid',
    employmentType: 'full_time',
    summary:
      'Build and polish the Choosify storefront experience — discovery feeds, product detail, and buyer dashboard.',
    description:
      'As a Frontend Engineer at Choosify, you will ship high-quality React interfaces that help millions of shoppers discover verified brands across Bangladesh.',
    responsibilities:
      '- Own features across Choosify-Web (React, TypeScript, Vite)\n- Collaborate with design on feed layouts, cards, and forms\n- Improve performance, accessibility, and SEO for public pages',
    requirements:
      '- Strong React + TypeScript experience\n- Comfortable with modern CSS / design systems\n- Experience shipping consumer-facing web products',
    status: 'open',
    postedAt: new Date().toISOString(),
  },
  {
    id: 'job-product-designer',
    slug: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    employmentType: 'full_time',
    summary: 'Shape Choosify’s visual system and craft clear buyer/seller flows across web and dashboard.',
    description:
      'We are looking for a Product Designer who can balance brand expression with practical marketplace UX.',
    responsibilities:
      '- Design end-to-end product flows and high-fidelity UI\n- Maintain and evolve the Choosify design system\n- Partner with engineering for polished implementation',
    requirements:
      '- Portfolio showing marketplace or consumer product work\n- Strong Figma skills\n- Systems thinking around components and tokens',
    status: 'open',
    postedAt: new Date().toISOString(),
  },
  {
    id: 'job-growth-marketing-intern',
    slug: 'growth-marketing-intern',
    title: 'Growth Marketing Intern',
    department: 'Growth',
    location: 'Dhaka',
    employmentType: 'internship',
    summary: 'Support campaigns, content experiments, and community outreach that grow Choosify awareness.',
    description:
      'Join the Growth team for a hands-on internship across social, partnerships, and content.',
    responsibilities:
      '- Assist with social content calendars and campaign tracking\n- Support creator/brand outreach lists\n- Help analyze simple performance metrics',
    requirements:
      '- Currently studying marketing, communications, or related field\n- Strong Bangla + English writing\n- Curious about e-commerce and social platforms',
    status: 'open',
    postedAt: new Date().toISOString(),
  },
];

export function employmentTypeLabel(type: PublicJobPosting['employmentType']) {
  switch (type) {
    case 'full_time':
      return 'Full-time';
    case 'part_time':
      return 'Part-time';
    case 'internship':
      return 'Internship';
    case 'contract':
      return 'Contract';
    default:
      return type;
  }
}
