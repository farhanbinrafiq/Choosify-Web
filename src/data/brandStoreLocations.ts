export interface BrandStoreLocation {
  name: string;
  type: 'Official Store' | 'Authorized Dealer' | 'Experience Center' | 'Service Center';
  address: string;
  phone: string;
  hours: string;
  city: 'Dhaka' | 'Chittagong' | 'Sylhet';
  lat: number;
  lng: number;
}

export interface BrandOverviewDetail {
  story: string;
  certifications: string[];
  awards: string[];
  timeline: Array<{ year: string; event: string }>;
}

export const BRAND_STORES_LOCATIONS: Record<string, BrandStoreLocation[]> = {
  apple: [
    {
      name: "Apple Flagship Store - Bashundhara City",
      type: "Official Store",
      address: "Level 5, Block B, Bashundhara City Mall, Panthapath, Dhaka",
      phone: "+880 9612-777333",
      hours: "10:00 AM - 8:30 PM (Closed on Wednesday)",
      city: "Dhaka",
      lat: 23.7509,
      lng: 90.3920
    },
    {
      name: "Apple Authorized Experience Center - Jamuna Future Park",
      type: "Experience Center",
      address: "Level 1, Zone A, Jamuna Future Park, Kuril, Dhaka",
      phone: "+880 9612-777444",
      hours: "11:00 AM - 9:00 PM (Closed on Wednesday)",
      city: "Dhaka",
      lat: 23.8135,
      lng: 90.4241
    },
    {
      name: "Apple Premium Service Center - Dhanmondi",
      type: "Service Center",
      address: "Road 27 (Old), House 45, Dhanmondi, Dhaka",
      phone: "+880 1711-222333",
      hours: "9:00 AM - 6:00 PM (Closed on Friday)",
      city: "Dhaka",
      lat: 23.7554,
      lng: 90.3725
    },
    {
      name: "Apple Authorized Dealer - Sanmar Ocean City",
      type: "Authorized Dealer",
      address: "Level 2, Shop 204, Sanmar Ocean City, GEC Circle, Chittagong",
      phone: "+880 31-654321",
      hours: "10:00 AM - 8:30 PM (Closed on Wednesday)",
      city: "Chittagong",
      lat: 22.3592,
      lng: 91.8219
    },
    {
      name: "Apple Authorized Dealer - Al-Hamra Shopping City",
      type: "Authorized Dealer",
      address: "Level 3, Shop 312, Al-Hamra Shopping City, Zindabazar, Sylhet",
      phone: "+880 821-728192",
      hours: "10:00 AM - 8:30 PM (Closed on Wednesday)",
      city: "Sylhet",
      lat: 24.8969,
      lng: 91.8687
    }
  ],
  samsung: [
    {
      name: "Samsung Smart Plaza - Gulshan 1",
      type: "Official Store",
      address: "House 12, Road 134, Gulshan-1, Dhaka",
      phone: "+880 2-22228192",
      hours: "10:00 AM - 8:00 PM (Closed on Sunday)",
      city: "Dhaka",
      lat: 23.7796,
      lng: 90.4179
    },
    {
      name: "Samsung Authorized Experience Center - Jamuna Future Park",
      type: "Experience Center",
      address: "Level 4, Shop 4C-012, Jamuna Future Park, Kuril, Dhaka",
      phone: "+880 1847-123456",
      hours: "11:00 AM - 9:00 PM (Closed on Wednesday)",
      city: "Dhaka",
      lat: 23.8135,
      lng: 90.4241
    },
    {
      name: "Samsung Premium Customer Service - Karwan Bazar",
      type: "Service Center",
      address: "Level 3, Monarch Plaza, Kazi Nazrul Islam Avenue, Dhaka",
      phone: "+880 9612-300300",
      hours: "9:00 AM - 6:00 PM (Closed on Friday)",
      city: "Dhaka",
      lat: 23.7516,
      lng: 90.3943
    },
    {
      name: "Samsung Smart Plaza - Agrabad C/A",
      type: "Official Store",
      address: "House 48, Sabder Ali Road, Agrabad C/A, Chittagong",
      phone: "+880 31-2515000",
      hours: "10:00 AM - 8:00 PM (Closed on Friday)",
      city: "Chittagong",
      lat: 22.3298,
      lng: 91.8123
    },
    {
      name: "Samsung Authorized Service Center - Zindabazar",
      type: "Service Center",
      address: "Level 2, Millennium Shopping Complex, Zindabazar, Sylhet",
      phone: "+880 821-720300",
      hours: "9:00 AM - 6:00 PM (Closed on Friday)",
      city: "Sylhet",
      lat: 24.8969,
      lng: 91.8687
    }
  ],
  xiaomi: [
    {
      name: "Xiaomi Mi Home - Bashundhara City",
      type: "Official Store",
      address: "Level 6, Block C, Shop 45, Bashundhara City Mall, Panthapath, Dhaka",
      phone: "+880 1799-888777",
      hours: "10:00 AM - 8:30 PM (Closed on Wednesday)",
      city: "Dhaka",
      lat: 23.7509,
      lng: 90.3920
    },
    {
      name: "Xiaomi Mi Store - Jamuna Future Park",
      type: "Official Store",
      address: "Level 4, Zone B, Shop 18C, Jamuna Future Park, Kuril, Dhaka",
      phone: "+880 1799-888999",
      hours: "11:00 AM - 9:00 PM (Closed on Wednesday)",
      city: "Dhaka",
      lat: 23.8135,
      lng: 90.4241
    },
    {
      name: "Xiaomi Authorized Service Center - Eastern Plaza",
      type: "Service Center",
      address: "Level 5, Shop 512, Eastern Plaza, Hatirpool, Dhaka",
      phone: "+880 9612-942664",
      hours: "10:00 AM - 7:00 PM (Closed on Tuesday)",
      city: "Dhaka",
      lat: 23.7431,
      lng: 90.3959
    },
    {
      name: "Xiaomi Mi Store - Sanmar Ocean City",
      type: "Authorized Dealer",
      address: "Level 3, Shop 315, Sanmar Ocean City, GEC, Chittagong",
      phone: "+880 1819-123456",
      hours: "10:00 AM - 8:30 PM (Closed on Wednesday)",
      city: "Chittagong",
      lat: 22.3592,
      lng: 91.8219
    }
  ],
  walton: [
    {
      name: "Walton Plaza - Tejgaon Flagship",
      type: "Official Store",
      address: "Plot 14, Bir Uttam Mir Shawkat Sarak, Tejgaon I/A, Dhaka",
      phone: "+880 9612-316267",
      hours: "9:00 AM - 8:00 PM (Closed on Friday)",
      city: "Dhaka",
      lat: 23.7663,
      lng: 90.4035
    },
    {
      name: "Walton Plaza - Mirpur 10",
      type: "Official Store",
      address: "House 3, Block A, Mirpur 10 Circle, Dhaka",
      phone: "+880 1713-000000",
      hours: "10:00 AM - 8:30 PM (Closed on Sunday)",
      city: "Dhaka",
      lat: 23.8069,
      lng: 90.3687
    },
    {
      name: "Walton Authorized Service Point - GEC",
      type: "Service Center",
      address: "Level 3, CDA Avenue, GEC Circle, Chittagong",
      phone: "+880 31-2550011",
      hours: "9:00 AM - 6:00 PM (Closed on Friday)",
      city: "Chittagong",
      lat: 22.3592,
      lng: 91.8219
    }
  ],
  aarong: [
    {
      name: "Aarong Flagship Outlet - Uttara",
      type: "Official Store",
      address: "House 34, Sector 3, Jashimuddin Avenue, Uttara, Dhaka",
      phone: "+880 2-8952801",
      hours: "10:00 AM - 9:00 PM (Open Daily)",
      city: "Dhaka",
      lat: 23.8643,
      lng: 90.4005
    },
    {
      name: "Aarong Outlet - Dhanmondi",
      type: "Official Store",
      address: "House 40/A, Road 2, Dhanmondi R/A, Dhaka",
      phone: "+880 2-9669528",
      hours: "10:00 AM - 9:00 PM (Open Daily)",
      city: "Dhaka",
      lat: 23.7461,
      lng: 90.3861
    },
    {
      name: "Aarong Outlet - Halishahar",
      type: "Authorized Dealer",
      address: "Plot 1, Block B, Halishahar Housing Estate, Chittagong",
      phone: "+880 31-711528",
      hours: "10:00 AM - 8:30 PM (Open Daily)",
      city: "Chittagong",
      lat: 22.3218,
      lng: 91.7922
    },
    {
      name: "Aarong Outlet - Kumarpara",
      type: "Official Store",
      address: "Nayasarak Road, Kumarpara, Sylhet",
      phone: "+880 821-711528",
      hours: "10:00 AM - 8:30 PM (Open Daily)",
      city: "Sylhet",
      lat: 24.8943,
      lng: 91.8741
    }
  ],
  bata: [
    {
      name: "Bata Flagship Store - Bashundhara City",
      type: "Official Store",
      address: "Level 1, Block A, Shop 5-10, Bashundhara City Mall, Dhaka",
      phone: "+880 2-9111528",
      hours: "10:00 AM - 8:30 PM (Closed on Wednesday)",
      city: "Dhaka",
      lat: 23.7509,
      lng: 90.3920
    },
    {
      name: "Bata Outlet - Elephant Road",
      type: "Official Store",
      address: "House 245, Elephant Road, Dhaka",
      phone: "+880 2-9661528",
      hours: "10:00 AM - 8:30 PM (Closed on Tuesday)",
      city: "Dhaka",
      lat: 23.7381,
      lng: 90.3821
    },
    {
      name: "Bata Authorized Dealer - GEC Circle",
      type: "Authorized Dealer",
      address: "Sanmar Ocean City, GEC, Chittagong",
      phone: "+880 31-654128",
      hours: "10:00 AM - 8:30 PM (Closed on Wednesday)",
      city: "Chittagong",
      lat: 22.3592,
      lng: 91.8219
    }
  ]
};

export const BRAND_OVERVIEW_DETAILS: Record<string, BrandOverviewDetail> = {
  apple: {
    story: "Apple Inc. is an American multinational technology company headquartered in Cupertino, California. Apple is the world's largest technology company by revenue and, as of June 2026, the world's most valuable company by market capitalization. Founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976, Apple revolutionized personal technology with the introduction of the Macintosh in 1984. Today, Apple leads the world in innovation with iPhone, iPad, Mac, Apple Watch, and Apple TV, along with groundbreaking software services like the App Store, Apple Music, and Apple Pay.",
    certifications: ["EPEAT Gold Registered", "Carbon Neutral Commitment by 2030", "ENERGY STAR Qualified"],
    awards: ["Global Design Gold Medal 2025", "Most Valuable Global Brand", "Eco-Innovation Leadership Award"],
    timeline: [
      { year: "1976", event: "Apple Computer founded by Steve Jobs, Steve Wozniak, and Ronald Wayne." },
      { year: "1984", event: "Launched Macintosh personal computer, introducing the GUI to the masses." },
      { year: "2001", event: "Introduced iPod, redefining portable digital music and retail distribution." },
      { year: "2007", event: "Unveiled iPhone, transforming cellular communication and personal computing." },
      { year: "2020", event: "Transitioned to custom-engineered Apple Silicon M-series processors." },
      { year: "2026", event: "Established Official Partner digital storefront directly on Choosify." }
    ]
  },
  samsung: {
    story: "Samsung Electronics Co., Ltd. is a South Korean multinational electronics corporation headquartered in Yeongtong District, Suwon, South Korea. It is the pinnacle of the Samsung chaebol, accounting for 70% of the group's revenue. Samsung has been the world's largest manufacturer of television sets since 2006, and the world's largest manufacturer of mobile phones since 2011. Known for its relentless engineering push, Samsung leads semiconductor manufacturing, OLED display panel technology, and smartphone innovations.",
    certifications: ["UL ECCOLOGO Certified", "ISO 14001 Environmental Standard", "TCO Certified Displays"],
    awards: ["CES Innovation Best of Show", "Green Brand of the Year", "Red Dot Design Platinum Winner"],
    timeline: [
      { year: "1938", event: "Founded as a grocery and noodle trading company in Daegu by Lee Byung-chul." },
      { year: "1969", event: "Samsung Electronics established, starting with black-and-white television sets." },
      { year: "1988", event: "Launched first mobile phone hand-held device in South Korea." },
      { year: "2009", event: "Released first Android-powered Galaxy smartphone, sparking a mobile revolution." },
      { year: "2024", event: "Unveiled Galaxy AI, pioneering standard on-device artificial intelligence features." },
      { year: "2026", event: "Established verified partner digital storefronts on Choosify Bangladesh." }
    ]
  },
  xiaomi: {
    story: "Xiaomi Corporation is a Chinese designer and manufacturer of consumer electronics and related software, home appliances, and household items. Founded in April 2010 by serial entrepreneur Lei Jun, Xiaomi released its first smartphone in August 2011 and rapidly gained market share in China. Today, Xiaomi is the second-largest manufacturer of smartphones globally, maintained by its proprietary MIUI/HyperOS operating ecosystem. Xiaomi is also a major player in smart home IoT devices (smart TVs, vacuum cleaners, air purifiers, and light bulbs) and recently entered the smart electric vehicle arena.",
    certifications: ["Hi-Res Audio Certified", "TUV Rheinland Low Blue Light certified displays", "ISO 27001 Information Security Management"],
    awards: ["BCN Smartphone Award", "Good Design Award Winner", "Fortune Global 500 Listed Enterprise"],
    timeline: [
      { year: "2010", event: "Founded by Lei Jun and seven partners in Beijing." },
      { year: "2011", event: "Released Xiaomi Mi 1 smartphone, disrupting market with premium specs at near-cost price." },
      { year: "2014", event: "Expanded globally, becoming the largest smartphone brand in China." },
      { year: "2018", event: "Listed on Hong Kong Stock Exchange with major global expansion in Europe." },
      { year: "2024", event: "Formally launched Xiaomi SU7 electric smart vehicle, entering electric mobility." },
      { year: "2026", event: "Official storefront launched on Choosify for certified authentic smart products." }
    ]
  },
  walton: {
    story: "Walton High-Tech Industries PLC is a Bangladeshi multinational electronics brand based in Chandra, Gazipur. It specializes in refrigerators, freezers, air conditioners, televisions, home appliances, smartphones, and laptops. Founded in 1977 as a steel and trading enterprise, Walton established its state-of-the-art manufacturing plant in 2006. As Bangladesh's premier high-tech giant, Walton is credited with introducing precision manufacturing to the country, exporting high-quality household and tech items across Asia, Africa, and Europe.",
    certifications: ["BSTI Quality Certified", "ISO 9001:2015 Quality Management", "CE Compliance Certificate for European Markets"],
    awards: ["National Export Gold Trophy (Multiple-time Winner)", "Best Brand Award Bangladesh", "DHL-Daily Star Business Award Winner"],
    timeline: [
      { year: "1977", event: "Walton Group founded as a steel and commodity trading business." },
      { year: "2006", event: "Commissioned high-tech manufacturing plant in Gazipur for domestic refrigerators." },
      { year: "2010", event: "Pioneered local manufacturing of energy-efficient eco-friendly air conditioners." },
      { year: "2017", event: "Launched first ever made-in-Bangladesh certified android smartphones." },
      { year: "2022", event: "Began exporting high-tech compressors and smart home systems to European Union." },
      { year: "2026", event: "Established verified flagship storefront with direct buyer warranty on Choosify." }
    ]
  },
  aarong: {
    story: "Aarong is Bangladesh's leading fashion and lifestyle retail chain, operating as a social enterprise of BRAC. Founded in 1978, Aarong's mission is to provide a solid retail platform for rural artisans, preserving traditional Bangladeshi craft heritage while securing fair wages and self-reliance. From handloom silk sarees and nakshi kantha embroidery to premium wooden, clay, and silver crafts, Aarong showcases the absolute finest of traditional Bangladeshi heritage, supporting over 65,000 artisans across rural cottage industries.",
    certifications: ["World Fair Trade Organization (WFTO) Certified", "BRAC Ethical Social Enterprise Seal", "Handloom & Silk Artisans Fair Pay Compliance"],
    awards: ["Superbrands Bangladesh (Consecutive Winner)", "National Craft Council Merit Award", "Best Fashion & Lifestyle Retail Brand in South Asia"],
    timeline: [
      { year: "1978", event: "Established by BRAC with a small storefront to support silk weavers in Manikganj." },
      { year: "1982", event: "Opened flagship outlet in Dhaka, standardizing rural craft for city buyers." },
      { year: "2001", event: "Introduced 'Taaga' and premium sub-labels, modernizing traditional wear for youth." },
      { year: "2011", event: "Opened the iconic Uttara Flagship Store, the largest lifestyle outlet in Bangladesh." },
      { year: "2018", event: "Artisan network reached 65,000+ across rural fair-trade hubs." },
      { year: "2026", event: "Integrated digital storefront with Choosify, delivering premium artisan craft worldwide." }
    ]
  },
  bata: {
    story: "Bata Shoe Company is a footwear and fashion accessory manufacturer and retailer of Czech origin, with its global headquarters in Lausanne, Switzerland. Bata has been an iconic name in Bangladesh since 1930, establishing its first massive domestic manufacturing facility in Tongi in 1962. Producing over 30 million pairs of shoes annually in Bangladesh, Bata is trusted by families for school, corporate meetings, wedding festivities, and comfortable everyday wear. Brand sub-labels like Bata Comfit, Power, and Marie Claire continue to set standards in ergonomics and fashion.",
    certifications: ["SATRA Quality Technology Centre Mark", "ISO 9001 Shoe Manufacturing Compliance", "Eco-Leather Ethical Sourcing Standard"],
    awards: ["Bangladesh Lifetime Brand Trust Trophy", "Global Footwear comfort and ergonomics leader", "Best Footwear Retail Network Award in South Asia"],
    timeline: [
      { year: "1894", event: "Founded in Zlín, Czech Republic by siblings Tomáš, Anna, and Antonín Baťa." },
      { year: "1930", event: "operations started in the Indian subcontinent, establishing direct retail footprints." },
      { year: "1962", event: "Inaugurated state-of-the-art shoe manufacturing plant in Tongi, Gazipur." },
      { year: "2005", event: "Launched Bata Comfit series, incorporating medical orthotic support in casual shoes." },
      { year: "2018", event: "Redesigned retail centers to premium 'Red Store' designs with digital checkout systems." },
      { year: "2026", event: "Launched verified partner storefront on Choosify, guaranteeing official store dispatch." }
    ]
  }
};
