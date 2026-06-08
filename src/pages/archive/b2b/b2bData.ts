export interface B2BSupplier {
  id: string;
  name: string;
  type: 'Manufacturer' | 'Distributor' | 'Wholesaler' | 'Joint Venture';
  slug: string;
  logo: string;
  bannerImage: string;
  district: string;
  address: string;
  responseRate: string;
  responseTime: string;
  yearsInBusiness: number;
  deliveryRegions: string[];
  certifications: string[];
  productionCapacity: string;
  factorySize: string;
  employees: number;
  exportRegions: string[];
  isVerified: boolean;
  ratings: number;
  reviewsCount: number;
  about: string;
  minimumOrderValue: number;
  annualTurnover: string;
}

export interface B2BManufacturer {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  location: string;
  employees: number;
  established: number;
  certifications: string[];
  mainProducts: string[];
  capacity: string;
  image: string;
  about: string;
}

export const BANGLADESH_DISTRICT_HUBS = [
  { id: 'dhaka', name: 'Dhaka', specialty: 'Apparel, Tech Logistics, Leather Goods', supplierCount: 342, tag: 'Apparel Hub' },
  { id: 'chittagong', name: 'Chittagong', specialty: 'Freight Shipping, Electronics, Steel & Shipping', supplierCount: 189, tag: 'Shipping Gateway' },
  { id: 'gazipur', name: 'Gazipur', specialty: 'RMG Factories, Knitwear, Primary Textiles', supplierCount: 245, tag: 'Garments Heart' },
  { id: 'narayanganj', name: 'Narayanganj', specialty: 'Knitwear, River Trade, Shitalakshya Mills', supplierCount: 156, tag: 'Yarn & Knit' },
  { id: 'sylhet', name: 'Sylhet', specialty: 'Pink Pearls, Organic Tea Plants, Local Crafts', supplierCount: 48, tag: 'Artisanal Commodities' },
  { id: 'khulna', name: 'Khulna', specialty: 'Jute Fiber, Sea Freight, Frozen Shrimp Lots', supplierCount: 74, tag: 'Agro Industrial' },
  { id: 'rajshahi', name: 'Rajshahi', specialty: 'Fine Rajshahi Silk, Pure Mango Pulp Blocks', supplierCount: 52, tag: 'Silk & Agriculture' }
];

export const B2B_SUPPLIERS: B2BSupplier[] = [
  {
    id: 'supp-1',
    name: 'Sailor Denim Mills Ltd.',
    type: 'Manufacturer',
    slug: 'sailor-denim-mills',
    logo: 'SD',
    bannerImage: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=1200&q=80',
    district: 'Gazipur',
    address: 'Vogra Bypass Road, Gazipur Industrial Area, Gazipur',
    responseRate: '98%',
    responseTime: 'Within 2 hours',
    yearsInBusiness: 14,
    deliveryRegions: ['Worldwide Address', 'All Bangladesh Hubs'],
    certifications: ['OEKO-TEX Standard 100', 'BSCI', 'WRAP Gold Certified'],
    productionCapacity: '850,000 Yards/Month',
    factorySize: '120,000 sq ft',
    employees: 1200,
    exportRegions: ['European Union', 'North America', 'Japan'],
    isVerified: true,
    ratings: 4.9,
    reviewsCount: 38,
    about: 'Sailor Denim Mills Ltd. is a pioneer in sustainable dye denim manufacturing, utilizing state-of-the-art European machinery and advanced water-recycling systems.',
    minimumOrderValue: 150000,
    annualTurnover: '$18 Million'
  },
  {
    id: 'supp-2',
    name: 'Epyllion Trade Syndicate',
    type: 'Wholesaler',
    slug: 'epyllion-trade-syndicate',
    logo: 'ET',
    bannerImage: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=1200&q=80',
    district: 'Dhaka',
    address: 'Epyllion House, Road-21, Gulshan-1, Dhaka',
    responseRate: '96%',
    responseTime: 'Within 3 hours',
    yearsInBusiness: 22,
    deliveryRegions: ['All Bangladesh Shipping Routes'],
    certifications: ['ISO 9001:2015', 'Oeko-Tex Standard', 'SEDEX Audit Standard'],
    productionCapacity: '1,200,000 Pcs/Month',
    factorySize: '240,005 sq ft',
    employees: 3400,
    exportRegions: ['North America', 'Australia', 'Middle East'],
    isVerified: true,
    ratings: 4.8,
    reviewsCount: 104,
    about: 'Epyllion Trade Syndicate specializes in primary ready-made apparel lot distributions, offering high density cotton items and brand licensing support.',
    minimumOrderValue: 200000,
    annualTurnover: '$45 Million'
  },
  {
    id: 'supp-3',
    name: 'Apex Wholesale Industrial Group',
    type: 'Manufacturer',
    slug: 'apex-wholesale',
    logo: 'AW',
    bannerImage: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=1200&q=80',
    district: 'Narayanganj',
    address: 'Apex Sourcing Estate, Kanchpur, Narayanganj',
    responseRate: '94%',
    responseTime: 'Within 4 hours',
    yearsInBusiness: 28,
    deliveryRegions: ['All Bangladesh Lanes', 'Export Freight'],
    certifications: ['LWG Gold Certified (Leather)', 'ISO 14001:2015', 'BSCI Code of Conduct'],
    productionCapacity: '150,000 Pairs/Month',
    factorySize: '95,000 sq ft',
    employees: 950,
    exportRegions: ['European Union', 'South Korea', 'UAE'],
    isVerified: true,
    ratings: 4.7,
    reviewsCount: 46,
    about: 'The wholesale and export arm of Apex Bangladesh, focusing on mass footwear lots, wholesale leather skins, and custom rubber vulcanized components.',
    minimumOrderValue: 100000,
    annualTurnover: '$12 Million'
  },
  {
    id: 'supp-4',
    name: 'Sylhet Artisanal Gems & Pearl Co.',
    type: 'Wholesaler',
    slug: 'sylhet-artisanal-gems',
    logo: 'SG',
    bannerImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80',
    district: 'Sylhet',
    address: 'Pearl Tower, Zindabazar, Sylhet',
    responseRate: '91%',
    responseTime: 'Within 6 hours',
    yearsInBusiness: 8,
    deliveryRegions: ['Dhaka Express Cargo', 'Airway Cargo'],
    certifications: ['Handicraft Bangladesh Board Verified', 'Pure Silver Gilt Garantee'],
    productionCapacity: '10,000 Batches/Month',
    factorySize: '15,000 sq ft',
    employees: 45,
    exportRegions: ['ASEAN', 'European Union', 'Gulf Corporation Council'],
    isVerified: false,
    ratings: 4.4,
    reviewsCount: 12,
    about: 'A cooperative of local artisans producing authenticated Bangladesh Pink Pearls sourced from regional wetlands, paired with filigree craft lines.',
    minimumOrderValue: 50000,
    annualTurnover: '$1.5 Million'
  }
];

export const B2B_MANUFACTURERS: B2BManufacturer[] = [
  {
    id: 'mfg-1',
    name: 'Dhaka Apparel Conglomerate',
    slug: 'dhaka-apparel-conglomerate',
    specialty: 'High-density knit fabrics, combed cotton materials, activewear lots',
    location: 'Tejgaon I/A, Dhaka',
    employees: 5200,
    established: 1998,
    certifications: ['OEKO-TEX', 'BSCI', 'ISO 9001', 'GOTS (Organic Cotton)'],
    mainProducts: ['Heavy Hoodies', 'Polo Shirts', 'Pima Cotton Rolls', 'Custom Uniform Sets'],
    capacity: '2.5 Million Pcs/Month',
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&q=80',
    about: 'Dhaka Apparel Conglomerate stands as the single largest supplier of certified organic combed cotton garments. Providing premium custom branding, tagging, and packing for global fast-fashion brands.'
  },
  {
    id: 'mfg-2',
    name: 'Bengal Smart Packaging Ltd.',
    slug: 'bengal-smart-packaging',
    specialty: 'Corrugated cartons, heavy kraft bags, smart barcode labeling systems',
    location: 'Kanchpur, Narayanganj',
    employees: 820,
    established: 2011,
    certifications: ['FSC Statement of Origin Certificate', 'ISO 14001', 'BRC Global Standard'],
    mainProducts: ['Retail Display Trays', 'Export Grade Cartons', 'Biodegradable Mailing Envelopes'],
    capacity: '12 Million Items/Month',
    image: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=600&q=80',
    about: 'Providing zero-plastic industrial packing solutions to leading exporters. Special moisture-proof composite layouts ensure extreme transit protection across high-temperature cargo vessels.'
  }
];
