import { CustomOverview } from '../context/DashboardContext';

export function getBrandOverviews(brandName: string, customOverviews: CustomOverview[] = []) {
  const name = brandName.toLowerCase();
  
  // Base default overview data
  let baseOverview: Record<string, any> = {};
  if (name.includes('choosify')) {
     baseOverview = {
        "Shop Address & Links": "CHOOSE-HQ, SUITE 5A, METROPOLITAN TOWERS, GULSHAN-2, DHAKA 1212. Website: choosify.com",
        "Contact Information": "Email: hello@choosify.com, Phone: 09612246673",
        "Price & Audience": "Price Range: BDT - FREE ACCESS, Age Range: AGE: 15 - 65, Audience: SHOPPERS, CREATORS, VERIFIED OUTLETS & SMART BUYERS",
        "Services & Specialties": [
           "TRANSPARENT COMMUNITY COMPARISONS",
           "VERIFIED OUTLET REVIEWS & INSIGHTS",
           "ACTIVE PROMO CODES & CAMPAIGNS",
           "INFLUENCER INSIGHTS & EXPERIENCES",
           "RETAIL PARTNER COORDINATION",
           "REAL-TIME PRICE HISTORY TRACKER"
        ],
        "Best For Tags": ["#BrandDiscovery", "#ProductComparison", "#Deals", "#Recommendations", "#Creators", "#Marketplace", "#ConsumerInsights", "#ShoppingGuides"],
        "Brand Overview": "Choosify is a consumer discovery and marketplace platform designed to help users find trusted brands, products, creators, deals, recommendations, and comparisons through a transparent and community-focused ecosystem."
     };
  } else if (name.includes('fff')) {
     baseOverview = {
        "Shop Address & Links": "FFF SOURCING HQ, PLOT 12, ROAD 4, SECTOR 3, UTTARA, DHAKA 1230 BANGLADESH. Website: fff.com.bd",
        "Contact Information": "Email: sourcing@fff.com.bd, Phone: +8801711223344",
        "Price & Audience": "Price Range: BDT - CUSTOM SERVICE, Age Range: AGE: 18 - 60, Audience: FASHION BRANDS, RETAILERS, IMPORTERS",
        "Services & Specialties": [
           "GARMENT SOURCING",
           "BUYING HOUSE SERVICES",
           "APPAREL MANUFACTURING COORDINATION",
           "QUALITY CONTROL",
           "VENDOR MANAGEMENT",
           "PRODUCT DEVELOPMENT",
           "EXPORT SUPPORT",
           "COMPLIANCE MANAGEMENT"
        ],
        "Best For Tags": ["#GarmentSourcing", "#BuyingHouse", "#ApparelManufacturing", "#BangladeshExports", "#FashionProduction", "#QualityControl", "#VendorManagement", "#TextileIndustry"],
        "Brand Overview": "FFF Sourcing Ltd is a Bangladesh-based garment sourcing and buying house company supporting international apparel brands through sourcing, manufacturing coordination, quality assurance, product development, and export management services."
     };
  } else if (name.includes('sailor') || name.includes('la reve') || name.includes('yellow') || name.includes('aarong') || name.includes('ethnic') || name.includes('fashion') || name.includes('apex') || name.includes('bata') || name.includes('lotto')) {
     baseOverview = {
        "Shop Address & Links": "GRAND SHOPPING MALL, HOUSE 2, ROAD 2, SECTOR 92. 1500 - DHAKA BANGLADESH. Website: www.website.com",
        "Contact Information": "Email: fashion@gmail.com, Phone: 01234456789",
        "Price & Audience": "Price Range: BDT - 500, Age Range: AGE: 12 - 40, Audience: MALE, FEMALE, YOUTH & KIDS",
        "Services & Specialties": [
           "90 DAYS RETURN WITH REFUND POLICY",
           "FULL COD ENTIRE BANGLADESH",
           "6 MONTHS WARRANTY ALL PRODUCT",
           "CUSTOM GIFT BOX AVAILABLE",
           "3 HOURS DELIVERY INSIDE DHAKA METRO",
           "ONLINE & OFFLINE ORDER FACILITIES."
        ],
        "Best For Tags": ["#premium buyers", "#quality driven", "#ethnic wear", "#fashion", "#eid collection", "#trend setter", "#old money", "#summer collection", "#beach wear"],
        "Brand Overview": `${brandName} is a premier lifestyle brand in Bangladesh, offering high-quality ethnic wear, fashion trends, and custom shopping experiences.`
     };
  } else {
     baseOverview = {
        "Shop Address & Links": "JAMUNA FUTURE PARK, LEVEL 4, SHOP 22B, DHAKA BANGLADESH. Website: www.brand.com.bd",
        "Contact Information": "Email: support@brand.com, Phone: 09612345678",
        "Price & Audience": "Price Range: BDT 5,000 - 150,000, Age Range: AGE: 18 - 60, Audience: TECH ENTHUSIASTS, PROFESSIONALS",
        "Services & Specialties": [
           "7 DAYS REPLACEMENT WARRANTY",
           "100% ORIGINAL PRODUCT GUARANTEE",
           "OFFICIAL BRAND WARRANTY",
           "EMI AVAILABLE UP TO 24 MONTHS",
           "EXPRESS HOME DELIVERY",
           "SECURED CARD & MOBILE PAYMENTS"
        ],
        "Best For Tags": ["#tech", "#gadgets", "#original", "#official warranty", "#smart choice", "#power user", "#premium build", "#trending tech"],
        "Brand Overview": `${brandName} provides genuine high-end electronics, tech gadgets, official warranties, and seamless payment solutions.`
     };
  }

  // Merge with custom overviews from Admin
  const brandCustoms = customOverviews.filter(co => co.targetType === 'brand' && co.targetId.toLowerCase() === name);
  brandCustoms.forEach(co => {
    baseOverview[co.sectionName] = co.content;
  });

  return baseOverview;
}

export function getProductOverviews(productId: number | string, productTitle: string, productCategory: string, customOverviews: CustomOverview[] = []) {
  // Base default product overview data
  const baseOverview: Record<string, any> = {
    "Product Overview": `${productTitle} is a premium item in the ${productCategory} category, offering outstanding craftsmanship and authentic value.`,
    "Quality & Materials": [
      "AUTHENTIC STANDARD SEWING WITH BRAND LABELS",
      "HIGH DUST & SPILL PROOF COATED EXTERIOR",
      "UNBREAKABLE GRADE FINISHING STRUCTURE",
      "BREATHABLE PREMIUM CLOTHS IDEAL FOR LONG WEAR"
    ],
    "Features & Benefits": [
      "7 DAYS SATISFACTION REFUND/EXCHANGE GUARANTEE",
      "SECURE PARTNER CHECKOUT INTEGRATIONS",
      "OFFICIAL DECK WARRANTY ACTIVE WITH UNIQUE SERIAL CODE",
      "NATIONWIDE COMPLIANCE DELIVERY COVERAGE"
    ],
    "Audience & Use Cases": [
      "VALUE ORIENTED BUYERS APPRAISING BUILD INTEGRITY",
      "LIFESTYLE CREATORS REQUIRING RELIABLE WEARS",
      "RETAIL TEAMS COMPARING QUALITY AND VALUE TARGETS",
      "MODERN BANGLADESHI LIFESTYLE AND ACTIVE CIRCLES"
    ],
    "Customer Support & Assurance": [
      "REAL-TIME MSG BACKING FROM HIGH PRIORITY STAFF",
      "COMPLETE VERIFICATION CERTIFICATES DEPOSITED",
      "EASY ACCESS TRANSIT SYSTEM INTEGRATIONS",
      "SECURED PERSONALIZED INBOUND SUPPORT LOG"
    ],
    "Best For Tags": [
      "#premium lifestyle",
      "#quality driven",
      "#modern apparel",
      "#exclusive designs",
      "#sustainable wear",
      "#best in segment BBDT",
      "#elite deshi collect"
    ],
    "Optional Add-ons": [
      "Gift wrapping and message cards available on demand",
      "Extended 1-year care package add-on"
    ]
  };

  // Merge with custom overviews from Admin
  const productCustoms = customOverviews.filter(co => co.targetType === 'product' && String(co.targetId) === String(productId));
  productCustoms.forEach(co => {
    baseOverview[co.sectionName] = co.content;
  });

  return baseOverview;
}

export interface SearchMatch {
  matchedIn: string;
  snippet: string;
}

export function matchOverviewContent(overviews: Record<string, any>, query: string): SearchMatch | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  for (const [sectionName, content] of Object.entries(overviews)) {
    if (Array.isArray(content)) {
      for (const item of content) {
        if (typeof item === 'string' && item.toLowerCase().includes(q)) {
          const cleanItem = item.replace(/^•\s*/, '');
          return {
            matchedIn: sectionName,
            snippet: cleanItem
          };
        }
      }
    } else if (typeof content === 'string') {
      if (content.toLowerCase().includes(q)) {
        const idx = content.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 40);
        const end = Math.min(content.length, idx + q.length + 50);
        let snippet = content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        return {
          matchedIn: sectionName,
          snippet
        };
      }
    }
  }
  return null;
}
