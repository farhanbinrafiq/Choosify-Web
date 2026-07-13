export interface Subcategory {
  name: string;
  count: number;
  brands: number;
  icon: string;
}

export interface CategoryItem {
  name: string;
  icon: string;
  count: number;
  color: string;
  subcategories: Subcategory[];
}

export const CATEGORIES_LIST: CategoryItem[] = [
  { 
    name: 'Fashion & Lifestyle', 
    icon: 'Shirt', 
    count: 1240,
    color: 'from-orange-500 to-rose-500',
    subcategories: [
      { name: "Men's Fashion", count: 840, brands: 42, icon: 'Shirt' },
      { name: "Women's Fashion", count: 920, brands: 56, icon: 'ShoppingBag' },
      { name: "Kid's Wear", count: 320, brands: 24, icon: 'Baby' },
      { name: "Activewear", count: 410, brands: 18, icon: 'Dumbbell' },
      { name: "Footwear", count: 650, brands: 35, icon: 'Footprints' },
      { name: "Bags & Wallets", count: 280, brands: 15, icon: 'Briefcase' }
    ]
  },
  { 
    name: 'Jewelry & Accessories', 
    icon: 'Gem', 
    count: 270,
    color: 'from-amber-400 to-yellow-600',
    subcategories: [
      { name: "Necklaces & Pendants", count: 120, brands: 10, icon: 'Gem' },
      { name: "Earrings & Rings", count: 80, brands: 8, icon: 'Gem' },
      { name: "Luxury Watches", count: 150, brands: 12, icon: 'Watch' },
      { name: "Hair Accessories", count: 65, brands: 5, icon: 'Sparkles' }
    ]
  },
  { 
    name: 'Eyewear & Fragrances', 
    icon: 'Eye', 
    count: 180,
    color: 'from-sky-400 to-blue-600',
    subcategories: [
      { name: "Sunglasses", count: 100, brands: 8, icon: 'Glasses' },
      { name: "Designer Perfumes", count: 80, brands: 6, icon: 'Wind' },
      { name: "Prescription Eyeglasses", count: 120, brands: 12, icon: 'Glasses' },
      { name: "Body Mists & Deodorants", count: 95, brands: 7, icon: 'Sparkles' }
    ]
  },
  { 
    name: 'Beauty & Personal Care', 
    icon: 'Sparkles', 
    count: 920,
    color: 'from-pink-400 to-rose-600',
    subcategories: [
      { name: "Skin Care", count: 320, brands: 40, icon: 'Sparkles' },
      { name: "Hair Care", count: 210, brands: 25, icon: 'Flame' },
      { name: "Makeup & Cosmetics", count: 450, brands: 30, icon: 'Sparkles' },
      { name: "Grooming Tools", count: 110, brands: 14, icon: 'Scissors' }
    ]
  },
  { 
    name: 'Tech & Electronics', 
    icon: 'Cpu', 
    count: 1100,
    color: 'from-indigo-500 to-violet-600',
    subcategories: [
      { name: "Computers & Laptops", count: 450, brands: 20, icon: 'Laptop' },
      { name: "Audio & Headphones", count: 320, brands: 15, icon: 'Headphones' },
      { name: "DSLR & Action Cameras", count: 180, brands: 10, icon: 'Camera' },
      { name: "Computer Accessories", count: 250, brands: 18, icon: 'Keyboard' }
    ]
  },
  { 
    name: 'Mobile & Wearable', 
    icon: 'Smartphone', 
    count: 850,
    color: 'from-emerald-500 to-teal-600',
    subcategories: [
      { name: "Smartphones", count: 540, brands: 15, icon: 'Smartphone' },
      { name: "Smartwatches", count: 210, brands: 10, icon: 'Watch' },
      { name: "Tablets & iPads", count: 100, brands: 8, icon: 'Tablet' },
      { name: "Power Banks & Chargers", count: 150, brands: 12, icon: 'BatteryCharging' }
    ]
  },
  { 
    name: 'TV & Appliances', 
    icon: 'Tv', 
    count: 390, 
    color: 'from-red-500 to-rose-700', 
    subcategories: [
      { name: "Smart TVs", count: 190, brands: 11, icon: 'Tv' },
      { name: "Refrigerators", count: 120, brands: 8, icon: 'Snowflake' },
      { name: "Air Conditioners", count: 85, brands: 6, icon: 'Wind' },
      { name: "Microwave Ovens", count: 75, brands: 5, icon: 'Flame' }
    ] 
  },
  { 
    name: 'Gaming & Entertainment', 
    icon: 'Gamepad2', 
    count: 560, 
    color: 'from-purple-500 to-indigo-700', 
    subcategories: [
      { name: "Gaming Consoles", count: 110, brands: 4, icon: 'Gamepad2' },
      { name: "Gaming Laptops", count: 140, brands: 8, icon: 'Laptop' },
      { name: "Video Games", count: 350, brands: 25, icon: 'Gamepad' },
      { name: "Gaming Accessories", count: 210, brands: 15, icon: 'Cpu' }
    ] 
  },
  { 
    name: 'Home & Living', 
    icon: 'Home', 
    count: 640, 
    color: 'from-slate-400 to-gray-600', 
    subcategories: [
      { name: "Living Room Furniture", count: 240, brands: 15, icon: 'Home' },
      { name: "Smart Lighting", count: 180, brands: 12, icon: 'Lightbulb' },
      { name: "Kitchenware & Dining", count: 310, brands: 20, icon: 'ChefHat' },
      { name: "Bedding & Cushions", count: 150, brands: 8, icon: 'Bed' }
    ] 
  },
  { 
    name: 'Vehicles & Automotive', 
    icon: 'Car', 
    count: 150, 
    color: 'from-blue-500 to-cyan-700', 
    subcategories: [
      { name: "Motorbikes", count: 85, brands: 10, icon: 'Bike' },
      { name: "Car Accessories", count: 220, brands: 25, icon: 'Car' },
      { name: "Helmets & Riding Gear", count: 140, brands: 12, icon: 'Shield' },
      { name: "Engine Oils & Fluids", count: 95, brands: 8, icon: 'Droplets' }
    ] 
  },
  { 
    name: 'Family & Kids', 
    icon: 'Baby', 
    count: 320, 
    color: 'from-pink-500 to-rose-400', 
    subcategories: [
      { name: "Toys & Games", count: 280, brands: 18, icon: 'Smile' },
      { name: "Baby Apparel", count: 190, brands: 12, icon: 'Baby' },
      { name: "Strollers & Car Seats", count: 85, brands: 6, icon: 'Shuffle' },
      { name: "Baby Feeding & Care", count: 130, brands: 10, icon: 'Heart' }
    ] 
  },
  { 
    name: 'Food & Essentials', 
    icon: 'ShoppingBasket', 
    count: 1400, 
    color: 'from-green-500 to-lime-600', 
    subcategories: [
      { name: "Organic Groceries", count: 640, brands: 35, icon: 'ShoppingBasket' },
      { name: "Gourmet Snacks", count: 320, brands: 20, icon: 'Apple' },
      { name: "Beverages & Juices", count: 280, brands: 15, icon: 'CupSoda' },
      { name: "Daily Cooking Spices", count: 150, brands: 8, icon: 'Utensils' }
    ] 
  },
  { 
    name: 'Travel & Hospitality', 
    icon: 'Plane', 
    count: 210, 
    color: 'from-cyan-400 to-sky-600', 
    subcategories: [
      { name: "Luggage & Suitcases", count: 120, brands: 8, icon: 'Luggage' },
      { name: "Travel Accessories", count: 95, brands: 12, icon: 'Compass' },
      { name: "Hotels & Resort Bookings", count: 45, brands: 20, icon: 'Map' },
      { name: "Backpacks & Duffels", count: 150, brands: 10, icon: 'Briefcase' }
    ] 
  },
  { 
    name: 'Hobbies & Creativity', 
    icon: 'Palette', 
    count: 190, 
    color: 'from-amber-500 to-orange-700', 
    subcategories: [
      { name: "Art Supplies & Paints", count: 110, brands: 8, icon: 'Palette' },
      { name: "Musical Instruments", count: 95, brands: 12, icon: 'Music' },
      { name: "Crafting Tools", count: 75, brands: 6, icon: 'Scissors' },
      { name: "Board Games & Puzzles", count: 130, brands: 10, icon: 'Gamepad2' }
    ] 
  },
  { 
    name: 'Health & Wellness', 
    icon: 'Activity', 
    count: 480, 
    color: 'from-emerald-400 to-green-600', 
    subcategories: [
      { name: "Fitness Equipment", count: 140, brands: 15, icon: 'Dumbbell' },
      { name: "Vitamins & Supplements", count: 220, brands: 18, icon: 'Heart' },
      { name: "Wellness Devices", count: 110, brands: 10, icon: 'Activity' },
      { name: "Yoga & Pilates Mats", count: 85, brands: 6, icon: 'Sparkles' }
    ] 
  },
  { 
    name: 'Education & Learning', 
    icon: 'BookOpen', 
    count: 120, 
    color: 'from-indigo-600 to-blue-700', 
    subcategories: [
      { name: "Academic Books", count: 320, brands: 40, icon: 'BookOpen' },
      { name: "Stationery & Pens", count: 180, brands: 15, icon: 'PenTool' },
      { name: "Online Learning Courses", count: 90, brands: 12, icon: 'Laptop' },
      { name: "Educational Toys", count: 110, brands: 8, icon: 'Smile' }
    ] 
  }
];

export const getCategoryDescription = (name: string): string => {
  const mainCat = name.toLowerCase();
  if (mainCat.includes('fashion')) {
    return "Explore the ultimate collections in men's and women's apparel, trending streetwear, premium local designer labels, and essential footwear.";
  }
  if (mainCat.includes('jewelry')) {
    return "Accessorize with style. Discover fine local gold, heritage silver jewelry, timeless luxury watches, and bespoke accessories.";
  }
  if (mainCat.includes('eyewear')) {
    return "Discover signature scents, premium designer colognes, prescription eyewear, and summer-ready sunglasses.";
  }
  if (mainCat.includes('beauty')) {
    return "Pamper yourself with premium skincare solutions, organic hair products, cosmetics, and everyday personal grooming tools.";
  }
  if (mainCat.includes('tech')) {
    return "Power your productivity with state-of-the-art computers, immersive audio headsets, action cameras, and smart gadgets.";
  }
  if (mainCat.includes('mobile')) {
    return "Stay connected with flagship smartphones, smartwatches, fast chargers, and durable tech gear.";
  }
  if (mainCat.includes('tv')) {
    return "Upgrade your living space with energy-efficient refrigerators, smart 4K TVs, home heating, and cooling systems.";
  }
  if (mainCat.includes('gaming')) {
    return "Level up your gaming setup with consoles, high-refresh rate laptops, trending video games, and mechanical gaming gear.";
  }
  if (mainCat.includes('home')) {
    return "Transform your home with comfortable designer furniture, aesthetic smart lighting, and high-quality kitchenware.";
  }
  if (mainCat.includes('vehicle')) {
    return "Keep moving with reliable motorbikes, essential car safety accessories, helmets, and top-tier engine lubricants.";
  }
  if (mainCat.includes('family')) {
    return "Everything you need for your little ones, from developmental learning toys to premium baby garments and strollers.";
  }
  if (mainCat.includes('food')) {
    return "Shop everyday groceries, organic fresh produce, premium local snacks, and delicious beverages.";
  }
  if (mainCat.includes('travel')) {
    return "Gear up for your next adventure with durable suitcases, backpacks, travel gadgets, and vacation packages.";
  }
  if (mainCat.includes('hobby') || mainCat.includes('hobbies')) {
    return "Unleash your inner artist with professional art materials, musical instruments, and creative board games.";
  }
  if (mainCat.includes('health')) {
    return "Invest in your health with vitamins, wellness tracking devices, fitness gear, and yoga accessories.";
  }
  if (mainCat.includes('education')) {
    return "Boost your knowledge with academic textbooks, online courses, and school stationery supplies.";
  }
  return "Discover verified premium brands, compare local shopping deals, and explore creator recommendations.";
};

export const isProductInMainCategory = (productCategory: string, mainCategoryName: string): boolean => {
  if (!productCategory) return false;
  const prodCat = productCategory.toLowerCase();
  const mainCat = mainCategoryName.toLowerCase();
  
  if (mainCat.includes('fashion & lifestyle')) {
    return prodCat.includes('fashion') || prodCat.includes('lifestyle') || prodCat.includes('apparel') || prodCat.includes('clothing') || prodCat.includes('footwear');
  }
  if (mainCat.includes('jewelry & accessories')) {
    return prodCat.includes('jewelry') || prodCat.includes('accessory') || prodCat.includes('accessories') || prodCat.includes('watch');
  }
  if (mainCat.includes('eyewear & fragrances')) {
    return prodCat.includes('eyewear') || prodCat.includes('sunglasses') || prodCat.includes('fragrance') || prodCat.includes('perfume') || prodCat.includes('mist');
  }
  if (mainCat.includes('beauty & personal care')) {
    return prodCat.includes('beauty') || prodCat.includes('personal care') || prodCat.includes('skincare') || prodCat.includes('makeup') || prodCat.includes('cosmetic');
  }
  if (mainCat.includes('tech & electronics')) {
    return prodCat.includes('tech') || prodCat.includes('electronics') || prodCat.includes('computer') || prodCat.includes('laptop') || prodCat.includes('audio') || prodCat.includes('camera');
  }
  if (mainCat.includes('mobile & wearable')) {
    return prodCat.includes('mobile') || prodCat.includes('phone') || prodCat.includes('wearable') || prodCat.includes('smartwatch') || prodCat.includes('tablet');
  }
  if (mainCat.includes('tv & appliances')) {
    return prodCat.includes('tv') || prodCat.includes('appliance') || prodCat.includes('refrigerator') || prodCat.includes('oven') || prodCat.includes('snowflake');
  }
  if (mainCat.includes('gaming & entertainment')) {
    return prodCat.includes('gaming') || prodCat.includes('playstation') || prodCat.includes('video game') || prodCat.includes('entertainment') || prodCat.includes('console');
  }
  if (mainCat.includes('home & living')) {
    return prodCat.includes('home') || prodCat.includes('living') || prodCat.includes('furniture') || prodCat.includes('decor') || prodCat.includes('lighting');
  }
  if (mainCat.includes('vehicles & automotive')) {
    return prodCat.includes('vehicle') || prodCat.includes('car') || prodCat.includes('motor') || prodCat.includes('automotive') || prodCat.includes('bike');
  }
  if (mainCat.includes('family & kids')) {
    return prodCat.includes('family') || prodCat.includes('kids') || prodCat.includes('baby') || prodCat.includes('maternity') || prodCat.includes('toy');
  }
  if (mainCat.includes('food & essentials')) {
    return prodCat.includes('food') || prodCat.includes('essential') || prodCat.includes('grocer') || prodCat.includes('restaurant') || prodCat.includes('beverage');
  }
  if (mainCat.includes('travel & hospitality')) {
    return prodCat.includes('travel') || prodCat.includes('hospitality') || prodCat.includes('luggage') || prodCat.includes('hotel');
  }
  if (mainCat.includes('hobbies & creativity')) {
    return prodCat.includes('hobby') || prodCat.includes('hobbies') || prodCat.includes('creativity') || prodCat.includes('art') || prodCat.includes('music') || prodCat.includes('craft');
  }
  if (mainCat.includes('health & wellness')) {
    return prodCat.includes('health') || prodCat.includes('wellness') || prodCat.includes('fitness') || prodCat.includes('supplement');
  }
  if (mainCat.includes('education & learning')) {
    return prodCat.includes('education') || prodCat.includes('learning') || prodCat.includes('book') || prodCat.includes('course') || prodCat.includes('stationery');
  }

  return prodCat.includes(mainCat) || mainCat.includes(prodCat);
};

export const GENERATED_PRODUCTS = [
  // Jewelry & Accessories
  {
    id: 9001,
    title: 'Luxury Gold Necklace 22K',
    brand: 'Aarong',
    price: '85,000',
    originalPrice: '92,000',
    rating: 4.9,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    tag: 'NEW',
    category: 'Jewelry & Accessories',
    description: 'A beautiful hand-crafted 22K gold necklace with intricate heritage motifs, perfect for weddings and festive occasions.',
    stores: [
      { name: 'Aarong Gold', price: '85,000', delivery: '1-2 Days', rating: 4.9, link: '#' }
    ]
  },
  {
    id: 9002,
    title: 'Silver Filigree Bracelet',
    brand: 'Aarong',
    price: '4,500',
    originalPrice: '5,200',
    rating: 4.7,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    category: 'Jewelry & Accessories',
    description: 'Traditional Bangladeshi silver filigree work, crafted with precision by local artisans.',
    stores: [
      { name: 'Aarong Crafts', price: '4,500', delivery: '2-3 Days', rating: 4.8, link: '#' }
    ]
  },
  {
    id: 9003,
    title: 'Classic Aviator Sunglasses',
    brand: 'Yellow',
    price: '3,500',
    originalPrice: '4,200',
    rating: 4.6,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    category: 'Eyewear & Fragrances',
    description: 'High-quality polarization and UV protection, framed in lightweight metal alloy.',
    stores: [
      { name: 'Yellow', price: '3,500', delivery: '1-2 Days', rating: 4.6, link: '#' }
    ]
  },
  {
    id: 9004,
    title: 'Oud Supreme Perfume (100ml)',
    brand: 'Perfume World',
    price: '15,500',
    originalPrice: '17,000',
    rating: 4.9,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    tag: 'HOT',
    category: 'Eyewear & Fragrances',
    description: 'An intense, warm oriental woody scent, blending precious oud, sandalwood, and light amber notes.',
    stores: [
      { name: 'Perfume World', price: '15,500', delivery: 'Instant', rating: 4.9, link: '#' }
    ]
  },
  // Beauty & Personal Care
  {
    id: 9005,
    title: 'Hydrating Hyaluronic Acid Serum',
    brand: 'Perfume World',
    price: '1,850',
    originalPrice: '2,200',
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=400&h=400&fit=crop',
    category: 'Beauty & Personal Care',
    description: 'Deeply hydrates and plumps skin, restoring its natural radiance and elasticity.',
    stores: [
      { name: 'Perfume World Care', price: '1,850', delivery: '1-2 Days', rating: 4.8, link: '#' }
    ]
  },
  {
    id: 9006,
    title: 'Premium Hair Growth Oil',
    brand: 'Aarong',
    price: '1,200',
    originalPrice: '1,500',
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&h=400&fit=crop',
    category: 'Beauty & Personal Care',
    description: 'Enriched with amla, bhringraj, and organic coconut oil, strengthening roots and stimulating growth.',
    stores: [
      { name: 'Aarong Herbal', price: '1,200', delivery: '2-3 Days', rating: 4.8, link: '#' }
    ]
  },
  // TV & Appliances
  {
    id: 9007,
    title: 'Smart Inverter Refrigerator',
    brand: 'Samsung',
    price: '68,000',
    originalPrice: '74,000',
    rating: 4.7,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1571175432267-ef19a8627c1a?w=400&h=400&fit=crop',
    category: 'TV & Appliances',
    description: 'Energy-saving digital inverter compressor with modern frost-free technology and sleek door finish.',
    stores: [
      { name: 'Samsung Plaza', price: '68,000', delivery: '3-4 Days', rating: 4.8, link: '#' }
    ]
  },
  {
    id: 9008,
    title: 'Split AC 1.5 Ton',
    brand: 'Samsung',
    price: '55,000',
    originalPrice: '59,900',
    rating: 4.6,
    reviews: 43,
    image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=400&h=400&fit=crop',
    category: 'TV & Appliances',
    description: 'Fast cooling air conditioner with digital inverter and PM2.5 air purification filters.',
    stores: [
      { name: 'Samsung Brand Shop', price: '55,000', delivery: '2-3 Days', rating: 4.7, link: '#' }
    ]
  },
  // Gaming & Entertainment
  {
    id: 9009,
    title: 'Sony PlayStation 5 Slim',
    brand: 'Sony',
    price: '65,000',
    originalPrice: '68,000',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
    tag: 'HOT',
    category: 'Gaming & Entertainment',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD and deeper immersion with haptic feedback.',
    stores: [
      { name: 'Sony Centre', price: '65,000', delivery: '1-2 Days', rating: 4.9, link: '#' },
      { name: 'Star Tech', price: '65,500', delivery: 'Instant', rating: 4.8, link: '#' }
    ]
  },
  {
    id: 9010,
    title: 'Mechanical Gaming Keyboard',
    brand: 'Star Tech',
    price: '5,500',
    originalPrice: '6,200',
    rating: 4.7,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    category: 'Gaming & Entertainment',
    description: 'Tactile blue switches, vibrant RGB backlighting, and a heavy-duty aluminum chassis.',
    stores: [
      { name: 'Star Tech', price: '5,500', delivery: '1-2 Days', rating: 4.8, link: '#' }
    ]
  },
  // Home & Living
  {
    id: 9011,
    title: 'Ergonomic Office Chair',
    brand: 'Yellow',
    price: '14,500',
    originalPrice: '16,000',
    rating: 4.7,
    reviews: 81,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&h=400&fit=crop',
    category: 'Home & Living',
    description: 'Full mesh back, adjustable lumbar support, and smooth 3D armrests for long office hours.',
    stores: [
      { name: 'Yellow Home', price: '14,500', delivery: '3-5 Days', rating: 4.7, link: '#' }
    ]
  },
  {
    id: 9012,
    title: 'Smart LED Desk Lamp',
    brand: 'Star Tech',
    price: '2,500',
    originalPrice: '2,900',
    rating: 4.5,
    reviews: 39,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    category: 'Home & Living',
    description: 'Dimmable LED lamp with adjustable color temperatures, USB charging port, and touch controls.',
    stores: [
      { name: 'Star Tech Home', price: '2,500', delivery: '1-2 Days', rating: 4.5, link: '#' }
    ]
  },
  // Vehicles & Automotive
  {
    id: 9013,
    title: 'Smart Dual-Lens Dashcam',
    brand: 'Star Tech',
    price: '8,500',
    originalPrice: '9,800',
    rating: 4.7,
    reviews: 48,
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&h=400&fit=crop',
    category: 'Vehicles & Automotive',
    description: 'Full HD front and rear recording with night vision, wide-angle lens, and G-sensor loop recording.',
    stores: [
      { name: 'Star Tech Auto', price: '8,500', delivery: '1-2 Days', rating: 4.6, link: '#' }
    ]
  },
  {
    id: 9014,
    title: 'Aerodynamic Full-Face Helmet',
    brand: 'Apex',
    price: '4,200',
    originalPrice: '4,900',
    rating: 4.6,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1542319630-55fb7f7c944a?w=400&h=400&fit=crop',
    category: 'Vehicles & Automotive',
    description: 'Lightweight shell construction, dual visor system, and premium anti-fog air ventilation.',
    stores: [
      { name: 'Apex Accessories', price: '4,200', delivery: '2-3 Days', rating: 4.6, link: '#' }
    ]
  },
  // Family & Kids
  {
    id: 9015,
    title: 'Interlocking Block Building Toy',
    brand: 'Apex',
    price: '2,400',
    originalPrice: '2,800',
    rating: 4.8,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    category: 'Family & Kids',
    description: 'Develops fine motor skills and creativity in children. 500+ colorful safety-grade blocks.',
    stores: [
      { name: 'Apex Kids', price: '2,400', delivery: '2-3 Days', rating: 4.8, link: '#' }
    ]
  },
  {
    id: 9016,
    title: 'Organic Cotton Baby Onesies',
    brand: 'Yellow',
    price: '1,500',
    originalPrice: '1,800',
    rating: 4.7,
    reviews: 44,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
    category: 'Family & Kids',
    description: 'Super-soft 100% organic cotton, breathable fabric with easy nickel-free snap closures.',
    stores: [
      { name: 'Yellow Baby', price: '1,500', delivery: '1-2 Days', rating: 4.7, link: '#' }
    ]
  },
  // Food & Essentials
  {
    id: 9017,
    title: 'Premium Organic Honey 500g',
    brand: 'Aarong',
    price: '950',
    originalPrice: '1,100',
    rating: 4.9,
    reviews: 184,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    category: 'Food & Essentials',
    description: '100% pure organic wild honey, sourced sustainably from the Sundarbans forest.',
    stores: [
      { name: 'Aarong Foods', price: '950', delivery: '2-3 Days', rating: 4.9, link: '#' }
    ]
  },
  {
    id: 9018,
    title: 'Gourmet Roasted Cashews 250g',
    brand: 'Aarong',
    price: '650',
    originalPrice: '750',
    rating: 4.8,
    reviews: 122,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    category: 'Food & Essentials',
    description: 'Slow-roasted premium cashew nuts lightly salted with sea salt, perfect for snacking.',
    stores: [
      { name: 'Aarong Fresh', price: '650', delivery: '1-2 Days', rating: 4.8, link: '#' }
    ]
  },
  // Travel & Hospitality
  {
    id: 9019,
    title: 'Hardshell Spinner Suitcase 24"',
    brand: 'Yellow',
    price: '9,500',
    originalPrice: '11,000',
    rating: 4.7,
    reviews: 36,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dca487?w=400&h=400&fit=crop',
    category: 'Travel & Hospitality',
    description: 'Durable polycarbonate scratch-resistant hardshell, 360-degree silent dual spinner wheels.',
    stores: [
      { name: 'Yellow Travel', price: '9,500', delivery: '3-4 Days', rating: 4.7, link: '#' }
    ]
  },
  {
    id: 9020,
    title: 'Waterproof Hiking Backpack 45L',
    brand: 'Yellow',
    price: '4,200',
    originalPrice: '4,800',
    rating: 4.6,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Travel & Hospitality',
    description: 'Ergonomic breathable suspension shoulder straps, with durable high-density nylon cover.',
    stores: [
      { name: 'Yellow Outdoors', price: '4,200', delivery: '1-2 Days', rating: 4.6, link: '#' }
    ]
  },
  // Hobbies & Creativity
  {
    id: 9021,
    title: 'Professional Acrylic Paint Set',
    brand: 'Yellow',
    price: '2,800',
    originalPrice: '3,200',
    rating: 4.8,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    category: 'Hobbies & Creativity',
    description: '24 non-toxic rich pigmentation acrylic tubes, suitable for canvas, wood, and ceramic.',
    stores: [
      { name: 'Yellow Art', price: '2,800', delivery: '2-3 Days', rating: 4.8, link: '#' }
    ]
  },
  {
    id: 9022,
    title: 'Acoustic Steel-String Guitar',
    brand: 'Aarong',
    price: '11,500',
    originalPrice: '12,900',
    rating: 4.7,
    reviews: 55,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
    category: 'Hobbies & Creativity',
    description: 'Full-size acoustic guitar with rich tone, spruce top body, and natural gloss finish.',
    stores: [
      { name: 'Aarong Melody', price: '11,500', delivery: '2-3 Days', rating: 4.7, link: '#' }
    ]
  },
  // Health & Wellness
  {
    id: 9023,
    title: 'Resistance Bands Workout Set',
    brand: 'Apex',
    price: '1,500',
    originalPrice: '1,800',
    rating: 4.7,
    reviews: 91,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop',
    category: 'Health & Wellness',
    description: '5 levels of stackable resistance tubes with door anchors, handles, and ankle straps.',
    stores: [
      { name: 'Apex Fit', price: '1,500', delivery: '1-2 Days', rating: 4.7, link: '#' }
    ]
  },
  {
    id: 9024,
    title: 'Anti-Slip Cork Yoga Mat',
    brand: 'Yellow',
    price: '3,200',
    originalPrice: '3,800',
    rating: 4.6,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400&h=400&fit=crop',
    category: 'Health & Wellness',
    description: 'Organic natural cork layer with supportive rubber base, providing ultimate sweat-proof grip.',
    stores: [
      { name: 'Yellow Wellness', price: '3,200', delivery: '1-2 Days', rating: 4.6, link: '#' }
    ]
  },
  // Education & Learning
  {
    id: 9025,
    title: 'English Grammar & Composition',
    brand: 'Aarong',
    price: '450',
    originalPrice: '500',
    rating: 4.8,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop',
    category: 'Education & Learning',
    description: 'A comprehensive, easy-to-understand self-learning grammar textbook for students.',
    stores: [
      { name: 'Aarong Books', price: '450', delivery: '1-2 Days', rating: 4.8, link: '#' }
    ]
  },
  {
    id: 9026,
    title: 'Executive Fine-Tip Fountain Pen',
    brand: 'Yellow',
    price: '3,500',
    originalPrice: '3,900',
    rating: 4.7,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop',
    category: 'Education & Learning',
    description: 'Stainless steel fine nib, metallic build, offering a smooth premium writing experience.',
    stores: [
      { name: 'Yellow Stationery', price: '3,500', delivery: '1-2 Days', rating: 4.7, link: '#' }
    ]
  }
];
