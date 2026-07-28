/**
 * Static category seed — kept separate from legacy product mocks to avoid bundle bloat.
 *
 * Full 25-category platform taxonomy. `productCount` / `brandCount` are placeholders
 * (0) until wired to real backend aggregates; the Categories page computes live
 * product/brand counts per category from `allCatalogProducts` instead of these fields.
 * `subcategories` is a 5-item starting sample per category — deeper (3rd/4th) tiers
 * are handled later at the product-tagging level, not here.
 *
 * Icon choices (closest available lucide-react icon per category):
 *  - Beauty, Health & Pharmacy -> HeartPulse (health/pharmacy dominate the merged name)
 *  - Home, Furniture & Appliances -> Sofa
 *  - Grocery & Food -> ShoppingBasket
 *  - Sports, Fitness & Outdoor -> Dumbbell
 *  - Pets & Agriculture -> PawPrint (pets dominate the merged name)
 *  - Events & Wedding -> PartyPopper
 *  - Professional & Home Services -> Wrench
 *  - Digital Products -> Download
 *  - Financial & Government Services -> Landmark
 *  - B2B Marketplace -> Boxes (wholesale/bulk goods)
 *  - Rental Marketplace -> Key
 *  - Used Products -> Recycle
 *  - Community & Social Impact -> HeartHandshake
 */
export type CategorySeed = {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  productCount: number;
  brandCount: number;
  featuredBrand: string | null;
};

export const CATEGORIES: CategorySeed[] = [
  {
    id: 'fashion-lifestyle',
    name: 'Fashion & Lifestyle',
    icon: 'Shirt',
    subcategories: ["Men's Fashion", "Women's Fashion", 'Footwear', 'Bags & Luggage', 'Fashion Accessories'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'jewelry-luxury',
    name: 'Jewelry & Luxury',
    icon: 'Gem',
    subcategories: ['Gold', 'Silver', 'Diamond', 'Bridal', 'Luxury Watches'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'beauty-health-pharmacy',
    name: 'Beauty, Health & Pharmacy',
    icon: 'HeartPulse',
    subcategories: ['Makeup', 'Skincare', 'Hair Care', "Men's Grooming", 'OTC Medicines'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Cpu',
    subcategories: ['Mobile Phones', 'Computers', 'TV & Entertainment', 'Cameras', 'Audio'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'home-furniture-appliances',
    name: 'Home, Furniture & Appliances',
    icon: 'Sofa',
    subcategories: ['Furniture', 'Home Decor', 'Kitchen & Dining', 'Home Appliances', 'Lighting'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'grocery-food',
    name: 'Grocery & Food',
    icon: 'ShoppingBasket',
    subcategories: ['Grocery', 'Fruits & Vegetables', 'Meat & Fish', 'Dairy & Eggs', 'Beverages'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'baby-kids-toys',
    name: 'Baby, Kids & Toys',
    icon: 'Baby',
    subcategories: ['Baby Care', 'Baby Feeding', 'Baby Gear', 'Toys', 'Educational Toys'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'sports-fitness-outdoor',
    name: 'Sports, Fitness & Outdoor',
    icon: 'Dumbbell',
    subcategories: ['Sports', 'Gym Equipment', 'Fitness Accessories', 'Camping', 'Cycling'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'gaming-entertainment',
    name: 'Gaming & Entertainment',
    icon: 'Gamepad2',
    subcategories: ['Gaming Consoles', 'Gaming Accessories', 'Video Games', 'PC Games', 'Streaming Subscription'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: 'Car',
    subcategories: ['Vehicle Marketplace', 'Auto Parts', 'Tires', 'Batteries', 'Car Accessories'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'books-education-arts',
    name: 'Books, Education & Arts',
    icon: 'BookOpen',
    subcategories: ['Books', 'Stationery', 'Online Courses', 'Musical Instruments', 'Arts & Crafts'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'pets-agriculture',
    name: 'Pets & Agriculture',
    icon: 'PawPrint',
    subcategories: ['Pet Food', 'Pet Accessories', 'Veterinary', 'Agriculture', 'Seeds'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'travel-hospitality',
    name: 'Travel & Hospitality',
    icon: 'Plane',
    subcategories: ['Accommodation Booking', 'Travel Packages', 'Transportation Booking', 'Vehicle Rental', 'Event & Ticket Booking'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: 'Building2',
    subcategories: ['Buy Property', 'Rent Property', 'Apartments', 'Commercial', 'Land'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'events-wedding',
    name: 'Events & Wedding',
    icon: 'PartyPopper',
    subcategories: ['Wedding', 'Event Venue', 'Photography & Videography', 'Decoration', 'Catering'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'professional-home-services',
    name: 'Professional & Home Services',
    icon: 'Wrench',
    subcategories: ['Home Services', 'Repair & Maintenance', 'Professional Services', 'IT Services', 'Digital Marketing'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'industrial-business',
    name: 'Industrial & Business',
    icon: 'Factory',
    subcategories: ['Industrial Equipment', 'Power Tools', 'Business Supplies', 'Hotel Supplies', 'Medical Supplies'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'digital-products',
    name: 'Digital Products',
    icon: 'Download',
    subcategories: ['Software', 'Domain', 'Hosting', 'Digital Templates', 'Gift Cards'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'financial-government-services',
    name: 'Financial & Government Services',
    icon: 'Landmark',
    subcategories: ['Banking', 'Insurance', 'Utility Bill Payment', 'Government Services', 'Tax Services'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'jobs-recruitment',
    name: 'Jobs & Recruitment',
    icon: 'Briefcase',
    subcategories: ['Job Marketplace', 'Recruitment Services', 'Resume Writing', 'Interview Coaching', 'HR Consultancy'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'b2b-marketplace',
    name: 'B2B Marketplace',
    icon: 'Boxes',
    subcategories: ['Wholesale', 'Import & Export', 'Manufacturers', 'Distributors', 'OEM & ODM'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'rental-marketplace',
    name: 'Rental Marketplace',
    icon: 'Key',
    subcategories: ['Vehicles', 'Electronics', 'Furniture', 'Construction Equipment', 'Event Equipment'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'used-products',
    name: 'Used Products',
    icon: 'Recycle',
    subcategories: ['Electronics', 'Vehicles', 'Furniture', 'Appliances', 'Books'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'auctions',
    name: 'Auctions',
    icon: 'Gavel',
    subcategories: ['Electronics', 'Vehicles', 'Property', 'Art', 'Antiques'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'community-social-impact',
    name: 'Community & Social Impact',
    icon: 'HeartHandshake',
    subcategories: ['NGO Donations', 'Volunteer Programs', 'Disaster Relief', 'Educational Sponsorship'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
  {
    id: 'bookings-appointments',
    name: 'Bookings & Appointments',
    icon: 'CalendarCheck',
    subcategories: ['Restaurant Reservation', "Doctor's Appointment", 'Massage Appointment', 'Therapy Appointment', 'Gym Membership'],
    productCount: 0,
    brandCount: 0,
    featuredBrand: null,
  },
] as const;
