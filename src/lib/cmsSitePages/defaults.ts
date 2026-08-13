import type {
  AboutPageContent,
  AdvertisePageContent,
  ContactPageContent,
  LegalDocumentContent,
  PartnershipPageContent,
  SitePagesConfig,
  SuggestBrandPageContent,
} from './types';

/** Seed = current approved storefront copy (visual/content baseline). */

export const DEFAULT_ABOUT: AboutPageContent = {
  companyNavLabel: 'ABOUT CHOOSIFY',
  legalNavLabel: 'LEGAL',
  companyNav: [
    { id: 'about-top', href: '#about-top', icon: '🏠', label: 'About Us', enabled: true, order: 0 },
    { id: 'suggest-brand', href: '#suggest-brand', icon: '🏷', label: 'Suggest a Brand', enabled: true, order: 1 },
    { id: 'partnership', href: '#partnership', icon: '🤝', label: 'Partnership', enabled: true, order: 2 },
    { id: 'advertise', href: '#advertise', icon: '📢', label: 'Advertise', enabled: true, order: 3 },
    { id: 'b2b', href: '#b2b', icon: '🏢', label: 'B2B Solutions', enabled: true, order: 4 },
  ],
  legalNav: [
    { id: 'terms', href: '#terms', icon: '📄', label: 'Terms of Service', enabled: true, order: 0 },
    { id: 'privacy', href: '#privacy', icon: '🔒', label: 'Privacy Policy', enabled: true, order: 1 },
    { id: 'contact', href: '#contact', icon: '✉', label: 'Contact Us', enabled: true, order: 2 },
  ],
  helpBox: {
    title: 'Need Help?',
    description: 'Our support team is here to assist you.',
    ctaLabel: 'Contact Support',
    ctaHref: '/messages',
  },
  heroEyebrow: 'ABOUT CHOOSIFY',
  heroTitleLine1: 'Choose. Compare.',
  heroTitleLine2Prefix: 'Decide',
  heroTitleAccent: 'Wisely.',
  heroDescription:
    "Choosify is Bangladesh's smart product discovery and decision-making platform. We help you explore trusted products, compare prices, read real reviews, and make confident choices.",
  heroImageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  stats: [
    { id: 'brands', icon: '🏷', value: '2,400+', label: 'Brands', bg: '#FFF3EA', enabled: true, order: 0 },
    { id: 'products', icon: '📦', value: '48K+', label: 'Products', bg: '#EEF0FF', enabled: true, order: 1 },
    { id: 'reviews', icon: '⭐', value: '120K+', label: 'Reviews', bg: '#ECFDF3', enabled: true, order: 2 },
    { id: 'users', icon: '👥', value: '85K+', label: 'Users', bg: '#FFF7ED', enabled: true, order: 3 },
  ],
  whyHeading: 'Why Choosify?',
  whyCards: [
    { id: 'smart', icon: '🔍', title: 'Smart Discovery', desc: 'Find trusted products across categories with curated catalogs.', bg: '#FFF3EA', enabled: true, order: 0 },
    { id: 'compare', icon: '⚖', title: 'Honest Compare', desc: 'Side-by-side specs, prices, and reviews before you buy.', bg: '#EEF0FF', enabled: true, order: 1 },
    { id: 'reviews', icon: '⭐', title: 'Real Reviews', desc: 'Community and creator insights you can actually use.', bg: '#ECFDF3', enabled: true, order: 2 },
    { id: 'deals', icon: '🏷', title: 'Live Deals', desc: 'Track promos and savings from verified sellers.', bg: '#FFF7ED', enabled: true, order: 3 },
    { id: 'confident', icon: '🛡', title: 'Shop Confident', desc: 'Verified brands, transparent info, safer decisions.', bg: '#F3E8FF', enabled: true, order: 4 },
  ],
  companyRows: [
    { id: 'suggest-brand', icon: '🏷', bg: '#FFF3EA', title: 'Suggest a Brand', desc: 'Know a great Bangladeshi brand we should list? Tell us.', cta: 'Submit suggestion', href: '/contact', enabled: true, order: 0 },
    { id: 'partnership', icon: '🤝', bg: '#EEF0FF', title: 'Partnership', desc: 'Collaborate with Choosify on campaigns, content, and growth.', cta: 'Partner with us', href: '/contact', enabled: true, order: 1 },
    { id: 'advertise', icon: '📢', bg: '#ECFDF3', title: 'Advertise', desc: 'Reach high-intent shoppers across discovery surfaces.', cta: 'Advertise here', href: '/contact', enabled: true, order: 2 },
    { id: 'b2b', icon: '🏢', bg: '#FFF7ED', title: 'B2B Solutions', desc: 'Procurement tools and catalogs for teams and retailers.', cta: 'Explore B2B', href: '/contact', enabled: true, order: 3 },
  ],
  legalSectionLabel: 'LEGAL',
  legalRows: [
    { id: 'terms', icon: '📄', bg: '#F4F7F9', title: 'Terms of Service', desc: 'Rules for using Choosify products and community features.', enabled: true, order: 0 },
    { id: 'privacy', icon: '🔒', bg: '#F4F7F9', title: 'Privacy Policy', desc: 'How we collect, use, and protect your information.', enabled: true, order: 1 },
    { id: 'contact', icon: '✉', bg: '#F4F7F9', title: 'Contact Us', desc: 'Reach support, partnerships, or press — we respond fast.', enabled: true, order: 2 },
  ],
};

export const DEFAULT_SUGGEST_BRAND: SuggestBrandPageContent = {
  hero: {
    badge: 'Community Discovery',
    title: 'Suggest a Brand',
    description:
      'Help us discover great brands for the Choosify community. Recommend local or international brands that offer quality, authenticity, and incredible value.',
    sideCardTitle: 'Discovery Engine',
    sideCardSubtitle: 'Community Driven',
    sideCardBody:
      "Over 70% of listed brand catalogs are vetted directly from recommendations proposed by savvy consumers like you. Let's make smart shopping mainstream!",
    sideCardIcon: '💡',
  },
  whyHeading: 'Why Suggest Brands',
  whyBody:
    "Choosify is built on trust, transparency, and authenticity. By suggesting high-quality brands that deserve a spotlight, you're helping thousands of Bangladeshi consumers make confident buying choices. Avoid online shop scams and help others connect with authentic, verified outlets.",
  whyCards: [
    { id: 'secure', title: 'Expand Secure Outlets', desc: 'We vet every recommended store against stringent authenticity guidelines to protect consumers.', enabled: true, order: 0 },
    { id: 'local', title: 'Promote Local Craft', desc: 'Support home-grown Bangladeshi artisans, weavers, boutique designers, and indie entrepreneurs.', enabled: true, order: 1 },
  ],
  howHeading: 'How Brand Discovery Works',
  howSteps: [
    { id: 's1', step: '01', title: 'Submit Recommendation', desc: 'Provide basic brand coordinates such as their website, social media profile, and category fields.', enabled: true, order: 0 },
    { id: 's2', step: '02', title: 'Authenticity Vetting', desc: 'Our moderation desk evaluates their customer reputation, catalog quality, and business integrity.', enabled: true, order: 1 },
    { id: 's3', step: '03', title: 'Platform Onboarding', desc: 'We list the approved brand profile, letting users search their items, compare rates, and write reviews.', enabled: true, order: 2 },
  ],
  benefitsHeading: 'Benefits of Joining Choosify',
  benefitsIntro: "Vetted brands receive extensive visibility on Bangladesh's smartest product discovery canvas:",
  benefits: [
    'Premium brand listing placement in search results',
    'Direct verification badge to showcase credibility',
    'Instant review tracking & customer feedback cycles',
    'Access to compare tools highlighting key selling points',
    'Ability to post deals, promos, and discount vouchers',
    'Targeted campaign spots reaching high-intent buyers',
  ],
  formHeading: 'Suggest Sourcing',
  formSubheading: 'Fill in brand credentials below',
  fields: {
    brandName: { label: 'Brand Name *', placeholder: 'e.g., Aarong, Apex, local boutique name' },
    website: { label: 'Website / Social Profile *', placeholder: 'e.g., www.brand.com or social URL' },
    category: { label: 'Category', placeholder: 'Select a Category' },
    country: { label: 'Country', placeholder: 'e.g., Bangladesh, Japan, USA' },
    reason: { label: 'Why should we list this brand? *', placeholder: 'Tell us what makes them stand out, their catalog, authenticity level, etc.' },
  },
  categoryOptions: [
    { id: 'fashion', value: 'Fashion & Lifestyle', label: 'Fashion & Lifestyle', enabled: true, order: 0 },
    { id: 'mobile', value: 'Mobile & Phones', label: 'Mobile & Phones', enabled: true, order: 1 },
    { id: 'tech', value: 'Tech & Electronics', label: 'Tech & Electronics', enabled: true, order: 2 },
    { id: 'beauty', value: 'Beauty & Cosmetics', label: 'Beauty & Cosmetics', enabled: true, order: 3 },
    { id: 'jewelry', value: 'Jewelry & Accessories', label: 'Jewelry & Accessories', enabled: true, order: 4 },
    { id: 'home', value: 'Home & Living', label: 'Home & Living', enabled: true, order: 5 },
  ],
  submitLabel: 'Submit Suggestion',
  successTitle: 'Thank You!',
  successSubtitle: 'Suggestion Submitted Successfully',
  successBodyTemplate:
    'We have logged your suggestion for {{brandName}}. Our vetting desk will evaluate this brand profile shortly. Thank you for contributing to the Choosify discovery platform!',
  successResetLabel: 'Suggest Another Brand',
};

export const DEFAULT_PARTNERSHIP: PartnershipPageContent = {
  hero: {
    badge: 'Collaborate & Scale',
    title: 'Partnership Opportunities',
    description:
      "Partner with Choosify, Bangladesh's leading product discovery platform. Join forces with us to accelerate growth, enhance brand transparency, and empower consumers.",
    sideCardTitle: 'Synergetic Ecosystem',
    sideCardSubtitle: 'Win-Win Dynamic',
    sideCardBody:
      'We match verified brands with native creators to drive trustworthy commerce. Empowering buyers with crystal clear data.',
    sideCardIcon: '🤝',
  },
  partnerHeading: 'Partner With Choosify',
  partnerBody:
    'Choosify acts as the primary hub connecting authentic brands with verified creators and curious shoppers. Our platform supports collaborative growth models that align brand visibility with real audience engagement. Explore how our partnerships can unlock reliable revenue pipelines for your business.',
  categoriesHeading: 'Partnership Categories',
  categories: [
    { id: 'brand', icon: 'award', title: 'Brand Partnerships', desc: 'Connect your catalog with high-intent buyers, secure a verification badge, and deploy campaigns that drive tangible ROI.', enabled: true, order: 0 },
    { id: 'creator', icon: 'users', title: 'Creator Partnerships', desc: 'Collaborate on sponsored deals, leverage direct affiliate loops, and expand your community reach across our creator marketplace.', enabled: true, order: 1 },
    { id: 'affiliate', icon: 'zap', title: 'Affiliate Partnerships', desc: 'Unlock special commission overrides, integrate exclusive coupon codes, and build durable passive earnings from your traffic.', enabled: true, order: 2 },
    { id: 'agency', icon: 'briefcase', title: 'Agency Partnerships', desc: 'Get consolidated dashboards to manage multiple client brand listings, unlock analytics APIs, and scale brand verified campaigns.', enabled: true, order: 3 },
  ],
  credibilityTitle: 'Durable Platform Credibility',
  credibilityBody:
    "By aligning with Choosify, partners leverage Bangladesh's premier, scam-free discovery database. Our unified pricing engine and brand verified claim statuses ensure that customer trust is maintained at every touchpoint.",
  formHeading: 'Request Partnership',
  formSubheading: 'Submit strategic collaboration request',
  fields: {
    companyName: { label: 'Company / Brand Name *', placeholder: 'e.g., Bata, Apex, local agency, or creator name' },
    contactName: { label: 'Primary Contact Name *', placeholder: 'e.g., Farhan Rafiq' },
    email: { label: 'Business Email *', placeholder: 'e.g., partnerships@brand.com' },
    partnershipModel: { label: 'Partnership Model', placeholder: '' },
    message: { label: 'Brief Proposal / Message', placeholder: 'Describe your goals, audience size, integration interests, or agency roster details.' },
  },
  modelOptions: [
    { id: 'brand', value: 'brand', label: 'Brand Partnerships', enabled: true, order: 0 },
    { id: 'creator', value: 'creator', label: 'Creator Partnerships', enabled: true, order: 1 },
    { id: 'affiliate', value: 'affiliate', label: 'Affiliate Partnerships', enabled: true, order: 2 },
    { id: 'agency', value: 'agency', label: 'Agency Partnerships', enabled: true, order: 3 },
  ],
  submitLabel: 'Submit Proposal',
  successTitle: 'Proposal Logged',
  successSubtitle: 'Partnership Desk Acknowledged',
  successBodyTemplate:
    'We have received the partnership brief for {{companyName}}. Our strategic relations desk will review and contact {{contactName}} within 2 business days. Thank you for choosing Choosify!',
  successResetLabel: 'Submit Another Request',
};

export const DEFAULT_ADVERTISE: AdvertisePageContent = {
  hero: {
    badge: 'Premium Brand Exposure',
    title: 'Advertise on Choosify',
    description:
      'Reach thousands of high-intent Bangladeshi shoppers actively comparing pricing, seeking recommendations, and preparing to purchase.',
    sideCardTitle: 'Targeting Precision',
    sideCardBody:
      "We don't do blind eyeballs. Choosify positions your brand right where active purchase comparisons occur. Ensure your catalog remains top-of-mind.",
  },
  whyHeading: 'Why Advertise',
  whyBody:
    'Traditional social platforms bombard users with interrupting feeds. On Choosify, users come with an active intention: Compare, Discovery, and Purchase. Advertising here guarantees alignment with customers at the bottom of the buying funnel, boosting click-through rates and campaign efficiency.',
  audienceHeading: 'Audience Overview',
  audienceStats: [
    { id: 'shoppers', value: '150K+', label: 'Monthly Shoppers', enabled: true, order: 0 },
    { id: 'dhaka', value: '75%', label: 'Dhaka-Based Buyers', enabled: true, order: 1 },
    { id: 'impressions', value: '4.2m+', label: 'Monthly Impressions', enabled: true, order: 2 },
  ],
  placementsHeading: 'Placement Opportunities',
  placements: [
    { id: 'brands', icon: 'sparkles', title: 'Promoted Brands', desc: 'Get featured at the top of brand listings and search pages. Drive high-visibility branding directly above alphabetical arrays.', enabled: true, order: 0 },
    { id: 'deals', icon: 'trending', title: 'Promoted Deals', desc: 'Pin your discount coupon, clearance code, or hot deal to the top of the popular "Deals" and category feeds.', enabled: true, order: 1 },
    { id: 'recs', icon: 'layers', title: 'Promoted Recommendations', desc: 'Embed your top-selling products inside highly-vetted community shopping guides and expert recommendation blogs.', enabled: true, order: 2 },
    { id: 'home', icon: 'megaphone', title: 'Homepage Placement', desc: 'Capture absolute attention with hero carousel banners or dedicated bento-grid display items on our central discovery homepage.', enabled: true, order: 3 },
    { id: 'creators', icon: 'users', title: 'Creator Collaborations', desc: 'Let us match your catalog with viral local TikTokers and Instagram influencers to deploy authentic social campaigns.', enabled: true, order: 4 },
  ],
  pricingTitle: 'Custom Pricing Available',
  pricingBody:
    "No rigid packages. We structure custom pricing tailored directly to your brand's monthly budget, target category, and specific conversion goals. Start scaling from small community campaigns upwards!",
  formHeading: 'Talk To Our Team',
  formSubheading: 'Start building your custom campaign',
  fields: {
    brandName: { label: 'Brand Name *', placeholder: 'e.g., Bata Bangladesh, Apex, Sailor' },
    contactPerson: { label: 'Contact Person *', placeholder: 'e.g., Farhan Rafiq' },
    email: { label: 'Business Email *', placeholder: 'e.g., marketing@brand.com' },
    budget: { label: 'Monthly Budget Scope', placeholder: '' },
    placementInterest: { label: 'Placement Interest', placeholder: '' },
    message: { label: 'Campaign Goals', placeholder: 'Describe what products you wish to spotlight, your launch timeline, etc.' },
  },
  budgetOptions: [
    { id: 'b1', value: 'under-50k', label: 'Under ৳50,000 / month', enabled: true, order: 0 },
    { id: 'b2', value: '50k-150k', label: '৳50,000 - ৳150,000 / month', enabled: true, order: 1 },
    { id: 'b3', value: '150k-500k', label: '৳150,000 - ৳500,000 / month', enabled: true, order: 2 },
    { id: 'b4', value: 'above-500k', label: 'Above ৳500,000 / month', enabled: true, order: 3 },
  ],
  placementOptions: [
    { id: 'p1', value: 'sponsored-brands', label: 'Promoted Brands Spotlight', enabled: true, order: 0 },
    { id: 'p2', value: 'sponsored-deals', label: 'Promoted Deals & Promo Pins', enabled: true, order: 1 },
    { id: 'p3', value: 'sponsored-recs', label: 'Promoted Guide Placement', enabled: true, order: 2 },
    { id: 'p4', value: 'homepage', label: 'Homepage Banner Spots', enabled: true, order: 3 },
    { id: 'p5', value: 'creator-collabs', label: 'Influencer Collaborations', enabled: true, order: 4 },
  ],
  submitLabel: 'Talk To Our Team',
  successTitle: 'Inquiry Sent',
  successSubtitle: 'Campaign Desk Notified',
  successBodyTemplate:
    'We have logged your campaign parameters for {{brandName}}. An advertising manager will contact {{contactPerson}} with custom mock media-kit and CTR models in 24 hours.',
  successResetLabel: 'Submit Another Inquiry',
};

export const DEFAULT_TERMS: LegalDocumentContent = {
  hero: {
    badge: 'Legal Standards',
    title: 'Terms of Service',
    description: 'Please read these terms carefully before accessing or using Choosify. Last updated: June 2026.',
    sideCardTitle: 'Legal Integrity',
    sideCardBody:
      'By using our product discovery platform, comparison tools, and deal portals, you agree to comply with our global user rules.',
  },
  lastUpdatedText: 'Last updated: June 2026',
  indexTitle: 'Document Index',
  sections: [
    {
      id: 'intro',
      indexLabel: '1. Introduction',
      number: '01',
      title: 'Introduction',
      paragraphs: [
        'Welcome to Choosify (owned and operated by Choosify.bd). These Terms of Service ("Terms") govern your access to and use of our website, mobile applications, product discovery catalogs, pricing comparison engines, coupon code features, and seller services (collectively, the "Platform").',
        'By accessing, browsing, registering for, or using any part of the Platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree to these Terms, please refrain from using our Platform immediately.',
      ],
      enabled: true,
      order: 0,
    },
    {
      id: 'user-resp',
      indexLabel: '2. User Responsibilities',
      number: '02',
      title: 'User Responsibilities',
      paragraphs: [
        'As a user of Choosify, you agree to utilize the Platform solely for lawful purposes and in absolute compliance with these Terms. Specifically:',
      ],
      bullets: [
        'You must provide truthful, accurate, and current information when registering an account, proposing brand suggestions, or leaving public product reviews.',
        'You are solely responsible for protecting the confidentiality of your account password and for all activity occurring under your account.',
        'You agree not to bypass, disable, or interfere with any security features or comparison validation mechanisms integrated into the Platform.',
      ],
      enabled: true,
      order: 1,
    },
    {
      id: 'seller-resp',
      indexLabel: '3. Seller Responsibilities',
      number: '03',
      title: 'Seller Responsibilities',
      paragraphs: [
        'Sellers who claim brand profiles or post coupon offers on Choosify must adhere to high standards of commercial honesty:',
      ],
      bullets: [
        'Sellers must guarantee the authenticity of listed items. Listing replica, counterfeit, or misleadingly branded goods is strictly prohibited and subject to immediate ban.',
        'Sellers must maintain honest and accurate inventory, pricing parameters, and delivery options inside their dashboards.',
        'Sellers are legally liable for fulfilling orders processed via integrated retail checkout loops and maintaining BSTI certifications where applicable.',
      ],
      enabled: true,
      order: 2,
    },
    {
      id: 'creator-resp',
      indexLabel: '4. Creator Responsibilities',
      number: '04',
      title: 'Creator Responsibilities',
      paragraphs: [
        'Influencers and creators registered on our Directory agree to maintain integrity in their recommendations and sponsored videos:',
      ],
      bullets: [
        'Creators must disclose any affiliate relationships, paid sponsorships, or promotional perks related to products they feature or review on the Platform.',
        'Creators are prohibited from posting false reviews, misleading rating boosts, or unverified claims regarding brand products.',
      ],
      enabled: true,
      order: 3,
    },
    {
      id: 'intellectual-prop',
      indexLabel: '5. Intellectual Property',
      number: '05',
      title: 'Intellectual Property',
      paragraphs: [
        'The Platform design, code, logos, trademarks, visual assets, text layouts, comparison algorithms, and databases are the exclusive intellectual property of Choosify.bd and are protected by Bangladeshi intellectual property laws.',
        'Users retain ownership of content they publish (such as review text or suggested brand descriptions) but grant Choosify an infinite, royalty-free, global license to display, index, and promote that user-generated content across our discovery ecosystems.',
      ],
      enabled: true,
      order: 4,
    },
    {
      id: 'prohibited-act',
      indexLabel: '6. Prohibited Activities',
      number: '06',
      title: 'Prohibited Activities',
      paragraphs: ['Users are strictly forbidden from engaging in the following behaviors on Choosify:'],
      bullets: [
        'Using web scrapers, data miners, or bots to harvest product comparison lists, creator profiles, or deal databases without our express written permission.',
        'Posting abusive, pornographic, harassing, or defamatory text inside public reviews or brand suggestion descriptions.',
        'Creating fake accounts to boost store ratings, post fake deals, or spam competitor listings.',
      ],
      enabled: true,
      order: 5,
    },
    {
      id: 'termination',
      indexLabel: '7. Account Termination',
      number: '07',
      title: 'Account Termination',
      paragraphs: [
        'Choosify reserves the absolute right to suspend, terminate, or restrict access to any user, creator, or seller account at our sole discretion, without prior notice, for conduct that violates these Terms, harms our community, or compromises the commercial integrity of the Platform.',
      ],
      enabled: true,
      order: 6,
    },
    {
      id: 'disclaimers',
      indexLabel: '8. Disclaimers',
      number: '08',
      title: 'Disclaimers',
      paragraphs: [
        'Choosify is a product discovery and price comparison platform. While we make every effort to verify seller authenticity and catalog data accuracy, we do not warrant or guarantee that any seller offers, deal codes, specifications, or pricing descriptions listed on the Platform are completely error-free or current at any given instant.',
        'Our Platform is provided "as is" and "as available," without warranties of any kind, whether express or implied.',
      ],
      enabled: true,
      order: 7,
    },
    {
      id: 'contact',
      indexLabel: '9. Contact Information',
      number: '09',
      title: 'Contact Information',
      paragraphs: [
        'If you have any questions, compliance inquiries, or disputes regarding these Terms of Service, please reach out to our legal compliance office at:',
      ],
      contactBox: {
        emailLabel: 'Email',
        email: 'legal@choosify.bd',
        addressLabel: 'Address',
        address: 'Level 11, Gulshan Commerce Center, Gulshan-2, Dhaka, Bangladesh',
        responseLabel: 'Response Window',
        responseWindow: '3 Business Days',
      },
      enabled: true,
      order: 8,
    },
  ],
};

export const DEFAULT_PRIVACY: LegalDocumentContent = {
  hero: {
    badge: 'User Protection',
    title: 'Privacy Policy',
    description:
      'We are committed to securing your data. Learn how we collect, store, and utilize your information. Last updated: June 2026.',
    sideCardTitle: 'Secure Handling',
    sideCardBody:
      'Our privacy rules ensure absolute confidentiality, in compliance with standard digital protection regulations.',
  },
  lastUpdatedText: 'Last updated: June 2026',
  indexTitle: 'Document Index',
  sections: [
    {
      id: 'collect',
      indexLabel: '1. Information We Collect',
      number: '01',
      title: 'Information We Collect',
      paragraphs: [
        'We collect personal parameters to deliver dynamic product comparisons and secure retail checkout loops. This includes:',
      ],
      bullets: [
        'Personal Credentials: Full name, email address, physical shipping coordinates, telephone numbers, and profile details provided during account creation or checkout.',
        'Seller Information: Brand registration numbers, outlet licenses, and representative contacts.',
        'Usage Metrics: Browser type, device IP addresses, viewed product comparison categories, and clicked deal voucher codes.',
      ],
      enabled: true,
      order: 0,
    },
    {
      id: 'use',
      indexLabel: '2. How We Use Information',
      number: '02',
      title: 'How We Use Information',
      paragraphs: ['Choosify utilizes stored parameters strictly for standard operational purposes, including:'],
      bullets: [
        'Operating and optimizing our price comparison calculators and discovery feeds.',
        'Fulfilling customer orders and processing retail checkout logistics with registered sellers.',
        'Responding to brand suggestion proposals and partnership forms.',
        'Detecting fraudulent ratings, fake product reviews, or bot scraping activities.',
      ],
      enabled: true,
      order: 1,
    },
    {
      id: 'cookies',
      indexLabel: '3. Cookies & Tracking',
      number: '03',
      title: 'Cookies & Tracking Technologies',
      paragraphs: [
        'We use tracking cookies, local session storage parameters, and diagnostic tools to persist user selections (e.g., comparison items, dashboard layout preferences, and active carts).',
        'You can adjust your browser properties to decline cookie tracking, though some parts of the comparison platform or checkout cycles may not operate seamlessly.',
      ],
      enabled: true,
      order: 2,
    },
    {
      id: 'security',
      indexLabel: '4. Security Measures',
      number: '04',
      title: 'Security Measures',
      paragraphs: [
        'We implement industry-standard administrative, physical, and technological security barriers to safeguard your personal credentials from unauthorized modification, access, exposure, or destruction.',
        'All checkout routes and form submissions are protected via Secure Sockets Layer (SSL) encryption, ensuring data transmission remains private.',
      ],
      enabled: true,
      order: 3,
    },
    {
      id: 'third-party',
      indexLabel: '5. Third Party Services',
      number: '05',
      title: 'Third Party Services',
      paragraphs: [
        'Our platform includes links to third-party brand websites, seller outlets, and creator social profiles. We do not control or assume liability for the privacy guidelines or content hosted on external, third-party sites. We recommend reviewing their policies on their respective platforms.',
      ],
      enabled: true,
      order: 4,
    },
    {
      id: 'rights',
      indexLabel: '6. User Rights',
      number: '06',
      title: 'User Rights',
      paragraphs: [
        'Depending on your geographic location, you retain key rights regarding your personal information, including:',
      ],
      bullets: [
        'The right to inspect what personal credentials we store.',
        'The right to request immediate correction of outdated or incorrect shipping/contact records.',
        'The right to request total deletion of your profile database and account history from our systems.',
      ],
      enabled: true,
      order: 5,
    },
    {
      id: 'retention',
      indexLabel: '7. Data Retention',
      number: '07',
      title: 'Data Retention',
      paragraphs: [
        'We store collected data only as long as necessary to fulfill active comparison and retail services, support legal compliance audits, or resolve platform disputes. Profile data is kept until an explicit deletion request is received and verified.',
      ],
      enabled: true,
      order: 6,
    },
    {
      id: 'contact',
      indexLabel: '8. Contact Information',
      number: '08',
      title: 'Contact Information',
      paragraphs: [
        'For security inquiries, privacy complaints, or data deletion requests, please contact our data protection office at:',
      ],
      contactBox: {
        emailLabel: 'Email',
        email: 'privacy@choosify.bd',
        addressLabel: 'Office Address',
        address: 'Level 11, Gulshan Commerce Center, Gulshan-2, Dhaka, Bangladesh',
      },
      enabled: true,
      order: 7,
    },
  ],
};

export const DEFAULT_CONTACT: ContactPageContent = {
  hero: {
    badge: 'Get In Touch',
    title: 'Contact Choosify',
    description:
      "We're here to assist. Connect with our dedicated support, brand verification, and business development relations desk.",
  },
  useGlobalOfficeAddress: true,
  hqTitle: 'Dhaka HQ',
  hqAddress: 'Level 11, Gulshan Commerce Center, Road 45, Gulshan-2, Dhaka, Bangladesh.',
  channelsHeading: 'Support Channels',
  channels: [
    { id: 'general', title: 'General Support', desc: 'Got questions about price comparisons, local deal updates, or user accounts? Our support team is ready to help.', badge: 'Help Desk', enabled: true, order: 0 },
    { id: 'brand', title: 'Brand Support', desc: 'Need assistance claiming your brand page, adjusting listing descriptions, or managing discount coupons?', badge: 'Sellers Desk', enabled: true, order: 1 },
    { id: 'creator', title: 'Creator Support', desc: "Encountered issues syncing your TikTok profile or updating your directory portfolio? Let's resolve it.", badge: 'Creators Desk', enabled: true, order: 2 },
    { id: 'business', title: 'Business Inquiries', desc: 'Interested in sponsored guide campaigns, corporate advertising plans, or platform partnerships?', badge: 'BD Team', enabled: true, order: 3 },
  ],
  methodsHeading: 'Contact Methods',
  methods: [
    { id: 'email', iconKey: 'mail', title: 'Email Support', value: '{{supportEmail}}', desc: 'Response within 24 hours', enabled: true, order: 0 },
    { id: 'messenger', iconKey: 'messenger', title: 'Messenger Support', value: 'fb.com/choosify.bd', desc: 'Live chat during working hours', enabled: true, order: 1 },
    { id: 'social', iconKey: 'social', title: 'Social Channels', value: '@choosify.bd', desc: 'DM us on Instagram or TikTok', enabled: true, order: 2 },
  ],
  useGlobalSupportEmail: true,
  commitmentTitle: 'Commitment to Prompt Responses',
  commitmentBody:
    'We prioritize user and seller satisfaction above all. Our general SLA response window is under 24 hours for verified sellers, and 48 hours for general community inquiries. Thank you for helping us maintain a transparent marketplace!',
  formHeading: 'Send A Message',
  formSubheading: 'Fill in parameters below',
  fields: {
    name: { label: 'Your Name *', placeholder: 'e.g., Farhan Bin Rafiq' },
    email: { label: 'Email Address *', placeholder: 'e.g., support@brand.com' },
    subject: { label: 'Subject *', placeholder: 'e.g., Verification Dispute, Guide Suggestion' },
    message: { label: 'Message Content *', placeholder: 'How can we help? Provide order details or profile link if relevant.' },
  },
  submitLabel: 'Submit Message',
  successTitle: 'Message Logged',
  successSubtitle: 'Support Desk Notified',
  successBodyTemplate:
    'We have logged your query. Our team will review your message regarding "{{subject}}" and reply back to {{email}} shortly. Thank you for reaching out!',
  successResetLabel: 'Send Another Message',
};

export function defaultSitePages(): SitePagesConfig {
  return {
    about: DEFAULT_ABOUT,
    suggestBrand: DEFAULT_SUGGEST_BRAND,
    partnership: DEFAULT_PARTNERSHIP,
    advertise: DEFAULT_ADVERTISE,
    terms: DEFAULT_TERMS,
    privacy: DEFAULT_PRIVACY,
    contact: DEFAULT_CONTACT,
  };
}
