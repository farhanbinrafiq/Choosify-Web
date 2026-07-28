/**
 * DRAFT — nested Level-1 → Level-2 → Level-3 category taxonomy, used by the
 * /categories page's sidebar-driven subcategory breakdown view. This is an
 * editable starting point authored to cover all 25 top-level categories with
 * plausible groupings, NOT real catalog data — please review subcategory/item
 * names against the actual business taxonomy before relying on this beyond UI.
 *
 * Keyed by `categoryId`, matching `CategorySeed.id` in `src/data/categories.ts`
 * (the single source of truth for Level-1 category name/icon — not duplicated
 * here). `items: []` marks a Level-2 group as a leaf (no Level-3 list, e.g.
 * Electronics → "Mobile Phones").
 */

export type TaxonomyLevel2 = {
  name: string;
  /** Level-3 leaf items under this group. Empty = this group itself is a leaf. */
  items: string[];
};

export type TaxonomyLevel1 = {
  /** Matches CategorySeed.id in src/data/categories.ts */
  categoryId: string;
  groups: TaxonomyLevel2[];
};

export const CATEGORY_TAXONOMY: TaxonomyLevel1[] = [
  {
    categoryId: 'fashion-lifestyle',
    groups: [
      { name: "Men's Fashion", items: ['Shirts', 'T-Shirts', 'Panjabi & Fatua', 'Trousers & Jeans', 'Jackets & Blazers'] },
      { name: "Women's Fashion", items: ['Sarees', 'Salwar Kameez', 'Dresses & Gowns', 'Tops & Tunics', 'Western Wear'] },
      { name: 'Footwear', items: ["Men's Shoes", "Women's Shoes", 'Sandals & Slippers', 'Sports Shoes', 'Kids Footwear'] },
      { name: 'Bags & Luggage', items: ['Handbags', 'Backpacks', 'Travel Luggage', 'Wallets & Purses', 'Laptop Bags'] },
      { name: 'Fashion Accessories', items: ['Belts', 'Sunglasses', 'Caps & Hats', 'Scarves & Stoles', 'Ties & Cufflinks'] },
    ],
  },
  {
    categoryId: 'jewelry-luxury',
    groups: [
      { name: 'Gold', items: ['Gold Rings', 'Gold Necklaces', 'Gold Earrings', 'Gold Bangles & Bracelets'] },
      { name: 'Silver', items: ['Silver Rings', 'Silver Necklaces', 'Silver Anklets', 'Silver Earrings'] },
      { name: 'Diamond', items: ['Diamond Rings', 'Diamond Necklaces', 'Diamond Earrings', 'Diamond Bracelets'] },
      { name: 'Bridal', items: ['Bridal Jewelry Sets', 'Bridal Tiaras & Crowns', 'Bridal Necklaces', 'Bridal Maang Tikka'] },
      { name: 'Luxury Watches', items: ["Men's Watches", "Women's Watches", 'Smartwatches', 'Watch Accessories'] },
    ],
  },
  {
    categoryId: 'beauty-health-pharmacy',
    groups: [
      { name: 'Makeup', items: ['Face Makeup', 'Eye Makeup', 'Lip Makeup', 'Makeup Tools & Brushes'] },
      { name: 'Skincare', items: ['Moisturizers', 'Sunscreen', 'Face Wash & Cleansers', 'Serums & Treatments'] },
      { name: 'Hair Care', items: ['Shampoo & Conditioner', 'Hair Oil', 'Hair Styling Tools', 'Hair Color'] },
      { name: "Men's Grooming", items: ['Shaving & Trimming', 'Beard Care', "Men's Skincare"] },
      { name: 'OTC Medicines', items: ['Pain Relief', 'Cold & Flu', 'Vitamins & Supplements', 'First Aid Supplies'] },
    ],
  },
  {
    categoryId: 'electronics',
    groups: [
      { name: 'Mobile Phones', items: [] },
      { name: 'Computers', items: ['Laptops', 'Desktops', 'Monitors', 'Computer Accessories', 'Printers & Scanners'] },
      { name: 'TV & Entertainment', items: ['Televisions', 'Home Theatre & Soundbars', 'Streaming Devices', 'TV Mounts & Accessories'] },
      { name: 'Cameras', items: ['DSLR Cameras', 'Mirrorless Cameras', 'Action Cameras', 'Camera Lenses', 'Camera Accessories'] },
      { name: 'Audio', items: ['Headphones & Earbuds', 'Bluetooth Speakers', 'Home Audio Systems', 'Microphones'] },
    ],
  },
  {
    categoryId: 'home-furniture-appliances',
    groups: [
      { name: 'Furniture', items: ['Sofas', 'Beds', 'Dining Tables', 'Wardrobes', 'Office Chairs', 'Bookshelves', 'Recliners', 'TV Units', 'Coffee Tables'] },
      { name: 'Home Decor', items: ['Wall Art', 'Vases & Showpieces', 'Curtains', 'Rugs & Carpets', 'Clocks'] },
      { name: 'Kitchen & Dining', items: ['Cookware', 'Dinner Sets', 'Kitchen Storage', 'Cutlery', 'Kitchen Gadgets'] },
      { name: 'Bathroom', items: ['Bath Fittings', 'Towels & Bathrobes', 'Bathroom Storage', 'Shower Accessories'] },
      { name: 'Storage & Organization', items: ['Wardrobe Organizers', 'Storage Boxes', 'Shelving Units', 'Closet Systems'] },
      { name: 'Home Appliances', items: ['Refrigerators', 'Washing Machines', 'Microwaves', 'Air Conditioners', 'Vacuum Cleaners'] },
      { name: 'Lighting', items: ['Ceiling Lights', 'Table Lamps', 'LED Bulbs', 'Outdoor Lighting', 'Decorative Lights'] },
    ],
  },
  {
    categoryId: 'grocery-food',
    groups: [
      { name: 'Grocery', items: ['Rice & Grains', 'Pulses & Lentils', 'Cooking Oil', 'Spices & Seasoning', 'Packaged Foods', 'Snacks', 'Bakery Items'] },
      { name: 'Fruits & Vegetables', items: ['Fresh Fruits', 'Fresh Vegetables', 'Organic Produce', 'Frozen Vegetables'] },
      { name: 'Meat & Fish', items: ['Fresh Fish', 'Chicken & Poultry', 'Mutton & Beef', 'Frozen Seafood'] },
      { name: 'Dairy & Eggs', items: ['Milk', 'Eggs', 'Cheese & Butter', 'Yogurt'] },
      { name: 'Beverages', items: ['Soft Drinks', 'Juices', 'Tea & Coffee', 'Water & Mineral Water'] },
    ],
  },
  {
    categoryId: 'baby-kids-toys',
    groups: [
      { name: 'Baby Care', items: ['Baby Bath & Skincare', 'Baby Health', 'Baby Grooming', 'Diapers & Wipes'] },
      { name: 'Baby Feeding', items: ['Feeding Bottles', 'Baby Food', 'Breastfeeding Accessories', 'Sterilizers'] },
      { name: 'Baby Gear', items: ['Strollers & Prams', 'Baby Carriers', 'Car Seats', 'Baby Cribs'] },
      { name: 'Toys', items: ['Action Figures', 'Building Blocks', 'Soft Toys', 'Remote Control Toys'] },
      { name: 'Educational Toys', items: ['Learning Kits', 'Puzzles', 'STEM Toys', 'Flash Cards'] },
    ],
  },
  {
    categoryId: 'sports-fitness-outdoor',
    groups: [
      { name: 'Sports', items: ['Cricket Gear', 'Football Gear', 'Badminton & Table Tennis', 'Team Sports Equipment'] },
      { name: 'Gym Equipment', items: ['Treadmills', 'Weights & Dumbbells', 'Exercise Bikes', 'Home Gym Sets'] },
      { name: 'Fitness Accessories', items: ['Yoga Mats', 'Resistance Bands', 'Fitness Trackers', 'Water Bottles'] },
      { name: 'Camping', items: ['Tents', 'Sleeping Bags', 'Camping Furniture', 'Outdoor Cookware'] },
      { name: 'Cycling', items: ['Bicycles', 'Cycling Helmets', 'Bicycle Accessories', 'Bike Repair Kits'] },
    ],
  },
  {
    categoryId: 'gaming-entertainment',
    groups: [
      { name: 'Gaming Consoles', items: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Handheld Consoles'] },
      { name: 'Gaming Accessories', items: ['Controllers', 'Gaming Headsets', 'Gaming Chairs', 'Gaming Keyboards & Mice'] },
      { name: 'Video Games', items: ['Action & Adventure', 'Sports Games', 'Racing Games', 'Multiplayer Games'] },
      { name: 'PC Games', items: ['Digital PC Games', 'Game Keys', 'PC Game Bundles'] },
      { name: 'Streaming Subscription', items: [] },
    ],
  },
  {
    categoryId: 'automotive',
    groups: [
      { name: 'Vehicle Marketplace', items: ['Cars', 'Motorcycles', 'Commercial Vehicles', 'Electric Vehicles'] },
      { name: 'Auto Parts', items: ['Engine Parts', 'Brake Parts', 'Suspension Parts', 'Filters'] },
      { name: 'Tires', items: ['Car Tires', 'Motorcycle Tires', 'Tubes', 'Alloy Wheels'] },
      { name: 'Batteries', items: ['Car Batteries', 'Motorcycle Batteries', 'Battery Chargers'] },
      { name: 'Car Accessories', items: ['Car Audio', 'Seat Covers', 'Car Care Products', 'Dash Cameras'] },
    ],
  },
  {
    categoryId: 'books-education-arts',
    groups: [
      { name: 'Books', items: ['Fiction', 'Non-Fiction', 'Academic Books', "Children's Books", 'Religious Books', 'Comics & Graphic Novels', 'Biographies', 'Self-Help'] },
      { name: 'Stationery', items: ['Notebooks & Diaries', 'Pens & Pencils', 'Art Supplies', 'Office Stationery'] },
      { name: 'Online Courses', items: ['Language Learning', 'Skill Development', 'Exam Preparation', 'Professional Certification'] },
      { name: 'Musical Instruments', items: ['Guitars', 'Keyboards & Pianos', 'Tabla & Percussion', 'Instrument Accessories'] },
      { name: 'Arts & Crafts', items: ['Painting Supplies', 'Craft Kits', 'Sketching & Drawing', 'Craft Materials'] },
    ],
  },
  {
    categoryId: 'pets-agriculture',
    groups: [
      { name: 'Pet Food', items: ['Dog Food', 'Cat Food', 'Bird Food', 'Fish Food'] },
      { name: 'Pet Accessories', items: ['Collars & Leashes', 'Pet Beds', 'Pet Carriers', 'Pet Grooming'] },
      { name: 'Veterinary', items: [] },
      { name: 'Agriculture', items: ['Farm Tools', 'Irrigation Equipment', 'Fertilizers', 'Greenhouse Supplies'] },
      { name: 'Seeds', items: ['Vegetable Seeds', 'Flower Seeds', 'Fruit Seeds', 'Organic Seeds'] },
    ],
  },
  {
    categoryId: 'travel-hospitality',
    groups: [
      { name: 'Accommodation Booking', items: ['Hotels', 'Resorts', 'Guest Houses', 'Homestays'] },
      { name: 'Travel Packages', items: ['Domestic Tours', 'International Tours', 'Honeymoon Packages', 'Group Tours'] },
      { name: 'Transportation Booking', items: ['Bus Tickets', 'Train Tickets', 'Air Tickets', 'Launch Tickets'] },
      { name: 'Vehicle Rental', items: ['Car Rental', 'Microbus Rental', 'Bike Rental', 'Chauffeur Services'] },
      { name: 'Event & Ticket Booking', items: ['Concert Tickets', 'Amusement Park Tickets', 'Museum Tickets', 'Sports Event Tickets'] },
    ],
  },
  {
    categoryId: 'real-estate',
    groups: [
      { name: 'Buy Property', items: ['Apartments for Sale', 'Houses for Sale', 'Plots for Sale', 'Commercial Property for Sale'] },
      { name: 'Rent Property', items: ['Apartments for Rent', 'Houses for Rent', 'Office Space for Rent', 'Shop Space for Rent'] },
      { name: 'Apartments', items: ['Ready Apartments', 'Under-Construction Apartments', 'Luxury Apartments'] },
      { name: 'Commercial', items: ['Office Space', 'Retail Space', 'Warehouses', 'Showrooms'] },
      { name: 'Land', items: [] },
    ],
  },
  {
    categoryId: 'events-wedding',
    groups: [
      { name: 'Wedding', items: ['Wedding Planning', 'Wedding Attire', 'Bridal Makeup', 'Wedding Invitations'] },
      { name: 'Event Venue', items: ['Banquet Halls', 'Community Centers', 'Outdoor Venues', 'Hotel Venues'] },
      { name: 'Photography & Videography', items: ['Wedding Photography', 'Event Videography', 'Drone Coverage', 'Photo Albums'] },
      { name: 'Decoration', items: ['Stage Decoration', 'Floral Decoration', 'Lighting Decoration', 'Balloon Decoration'] },
      { name: 'Catering', items: ['Wedding Catering', 'Corporate Catering', 'Buffet Services', 'Dessert Catering'] },
    ],
  },
  {
    categoryId: 'professional-home-services',
    groups: [
      { name: 'Home Services', items: ['Cleaning Services', 'Pest Control', 'Home Painting', 'Gardening Services'] },
      { name: 'Repair & Maintenance', items: ['AC Repair', 'Electrical Repair', 'Plumbing', 'Appliance Repair'] },
      { name: 'Professional Services', items: ['Legal Services', 'Accounting Services', 'Consulting', 'Notary Services'] },
      { name: 'IT Services', items: ['Web Development', 'App Development', 'IT Support', 'Network Setup'] },
      { name: 'Digital Marketing', items: ['SEO Services', 'Social Media Marketing', 'Content Creation', 'Paid Ads Management'] },
    ],
  },
  {
    categoryId: 'industrial-business',
    groups: [
      { name: 'Industrial Equipment', items: ['Generators', 'Compressors', 'Industrial Motors', 'Conveyor Systems'] },
      { name: 'Power Tools', items: ['Drills', 'Grinders', 'Saws', 'Welding Equipment'] },
      { name: 'Business Supplies', items: ['Office Furniture', 'Printing Supplies', 'Packaging Materials', 'Signage'] },
      { name: 'Hotel Supplies', items: ['Hotel Furniture', 'Kitchen Equipment', 'Linens & Uniforms', 'Guest Amenities'] },
      { name: 'Medical Supplies', items: ['Diagnostic Equipment', 'Hospital Furniture', 'PPE & Safety', 'Medical Consumables'] },
    ],
  },
  {
    categoryId: 'digital-products',
    groups: [
      { name: 'Software', items: ['Productivity Software', 'Design Software', 'Antivirus & Security', 'Business Software'] },
      { name: 'Domain', items: [] },
      { name: 'Hosting', items: ['Shared Hosting', 'VPS Hosting', 'Cloud Hosting', 'WordPress Hosting'] },
      { name: 'Digital Templates', items: ['Website Templates', 'Resume Templates', 'Presentation Templates', 'Social Media Templates'] },
      { name: 'Gift Cards', items: [] },
    ],
  },
  {
    categoryId: 'financial-government-services',
    groups: [
      { name: 'Banking', items: ['Savings Accounts', 'Loans', 'Credit Cards', 'Fixed Deposits'] },
      { name: 'Insurance', items: ['Life Insurance', 'Health Insurance', 'Motor Insurance', 'Travel Insurance'] },
      { name: 'Utility Bill Payment', items: ['Electricity Bill', 'Gas Bill', 'Water Bill', 'Internet Bill'] },
      { name: 'Government Services', items: ['NID Services', 'Passport Services', 'Trade License', 'Land Registration'] },
      { name: 'Tax Services', items: ['Income Tax Filing', 'VAT Registration', 'Tax Consultancy', 'Corporate Tax'] },
    ],
  },
  {
    categoryId: 'jobs-recruitment',
    groups: [
      { name: 'Job Marketplace', items: ['Full-Time Jobs', 'Part-Time Jobs', 'Remote Jobs', 'Internships'] },
      { name: 'Recruitment Services', items: ['Corporate Hiring', 'Executive Search', 'Bulk Hiring', 'Background Verification'] },
      { name: 'Resume Writing', items: [] },
      { name: 'Interview Coaching', items: [] },
      { name: 'HR Consultancy', items: ['Payroll Management', 'HR Policy Setup', 'Employee Training', 'Compliance Consulting'] },
    ],
  },
  {
    categoryId: 'b2b-marketplace',
    groups: [
      { name: 'Wholesale', items: ['Wholesale Textiles', 'Wholesale Electronics', 'Wholesale Groceries', 'Wholesale Packaging'] },
      { name: 'Import & Export', items: ['Import Sourcing', 'Export Trading', 'Customs Clearance', 'Freight Forwarding'] },
      { name: 'Manufacturers', items: ['Garment Manufacturers', 'Furniture Manufacturers', 'Electronics Manufacturers', 'Food Manufacturers'] },
      { name: 'Distributors', items: ['FMCG Distributors', 'Electronics Distributors', 'Pharma Distributors', 'Building Materials Distributors'] },
      { name: 'OEM & ODM', items: ['Private Label Manufacturing', 'Custom Packaging', 'Contract Manufacturing'] },
    ],
  },
  {
    categoryId: 'rental-marketplace',
    groups: [
      { name: 'Vehicles', items: ['Car Rental', 'Truck Rental', 'Bike Rental', 'Bus Rental'] },
      { name: 'Electronics', items: ['Laptop Rental', 'Camera Rental', 'Projector Rental', 'Sound System Rental'] },
      { name: 'Furniture', items: ['Event Furniture Rental', 'Office Furniture Rental', 'Home Furniture Rental'] },
      { name: 'Construction Equipment', items: ['Excavator Rental', 'Scaffolding Rental', 'Generator Rental', 'Concrete Mixer Rental'] },
      { name: 'Event Equipment', items: ['Tent & Canopy Rental', 'Stage & Lighting Rental', 'Sound Equipment Rental'] },
    ],
  },
  {
    categoryId: 'used-products',
    groups: [
      { name: 'Electronics', items: ['Used Mobile Phones', 'Used Laptops', 'Used Cameras', 'Used TVs'] },
      { name: 'Vehicles', items: ['Used Cars', 'Used Motorcycles', 'Used Commercial Vehicles'] },
      { name: 'Furniture', items: ['Used Sofas', 'Used Beds', 'Used Office Furniture'] },
      { name: 'Appliances', items: ['Used Refrigerators', 'Used Washing Machines', 'Used Air Conditioners'] },
      { name: 'Books', items: [] },
    ],
  },
  {
    categoryId: 'auctions',
    groups: [
      { name: 'Electronics', items: ['Auctioned Phones', 'Auctioned Laptops', 'Auctioned Cameras'] },
      { name: 'Vehicles', items: ['Auctioned Cars', 'Auctioned Motorcycles'] },
      { name: 'Property', items: [] },
      { name: 'Art', items: ['Paintings', 'Sculptures', 'Antique Art', 'Photography'] },
      { name: 'Antiques', items: ['Antique Furniture', 'Antique Coins', 'Antique Jewelry', 'Vintage Collectibles'] },
    ],
  },
  {
    categoryId: 'community-social-impact',
    groups: [
      { name: 'NGO Donations', items: ['Emergency Relief Fund', 'Child Welfare Fund', 'Healthcare Donations', 'Education Fund'] },
      { name: 'Volunteer Programs', items: ['Community Cleanup', 'Teaching Volunteers', 'Medical Camps', 'Disaster Response Teams'] },
      { name: 'Disaster Relief', items: ['Flood Relief', 'Cyclone Relief', 'Emergency Supplies', 'Relief Fund Donations'] },
      { name: 'Educational Sponsorship', items: ['Child Sponsorship', 'School Supplies Donation', 'Scholarship Programs', 'Underprivileged Student Support'] },
    ],
  },
  {
    categoryId: 'bookings-appointments',
    groups: [
      { name: 'Restaurant Reservation', items: ['Fine Dining', 'Casual Dining', 'Buffet Reservation', 'Private Dining'] },
      { name: "Doctor's Appointment", items: ['General Physician', 'Specialist Consultation', 'Dental Checkup', 'Diagnostic Tests'] },
      { name: 'Massage Appointment', items: ['Full Body Massage', 'Spa Package', 'Foot Reflexology', 'Couples Massage'] },
      { name: 'Therapy Appointment', items: ['Physiotherapy', 'Mental Health Counseling', 'Speech Therapy', 'Occupational Therapy'] },
      { name: 'Gym Membership', items: ['Monthly Membership', 'Annual Membership', 'Personal Training', 'Group Classes'] },
    ],
  },
];

export function getTaxonomyGroups(categoryId: string): TaxonomyLevel2[] {
  return CATEGORY_TAXONOMY.find((entry) => entry.categoryId === categoryId)?.groups ?? [];
}
