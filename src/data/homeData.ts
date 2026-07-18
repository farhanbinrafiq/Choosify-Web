// Categories matching reference image
export const CATEGORY_ITEMS = [
  { id: 'cat-elect', name: 'Electronics', emoji: '🎧', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-fash', name: 'Fashion', emoji: '🧥', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-mob', name: 'Mobile & Accessories', emoji: '📱', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-home', name: 'Home & Living', emoji: '🛋️', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-beau', name: 'Beauty & Health', emoji: '🧴', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-sport', name: 'Sports & Outdoors', emoji: '🏋️', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-auto', name: 'Automotive', emoji: '🛞', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-rest', name: 'Restaurants', emoji: '🍔', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-hotel', name: 'Hotels', emoji: '🏨', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-trav', name: 'Travel & Tours', emoji: '✈️', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-edu', name: 'Education', emoji: '🎓', bg: 'bg-[#F2F3F8]' },
  { id: 'cat-more', name: 'More', emoji: '🔮', bg: 'bg-[#F2F3F8]' },
];

// Spotlight cards matching reference image
export const SPOTLIGHT_CARDS = [
  {
    id: 'spot-1',
    badge: 'LIVE',
    badgeBg: 'bg-[#EF4444]', // Crimson red
    title: 'Samsung Unpacked Watch Party',
    publisher: 'Samsung Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-2',
    badge: 'REEL',
    badgeBg: 'bg-[#10B981]', // Emerald green
    title: '5 Sneakers You Need This Summer',
    publisher: 'SneakerHead BD',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-3',
    badge: 'GUIDE',
    badgeBg: 'bg-[#6366F1]', // Indigo blue
    title: 'Best Smartphones Under 30K in BD',
    publisher: 'Choosify Guides',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-4',
    badge: 'BRAND STORY',
    badgeBg: 'bg-[#F59E0B]', // Amber
    title: "Aarong: Crafting Bangladesh's Heritage",
    publisher: 'Aarong Official',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-5',
    badge: 'CAMPAIGN',
    badgeBg: 'bg-[#EC4899]', // Pink
    title: 'Eid Collection 2025 Now Live',
    publisher: 'Bata Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
  },
  {
    id: 'spot-6',
    badge: 'CAROUSEL',
    badgeBg: 'bg-[#06B6D4]', // Cyan
    title: 'Top 5 Beach Resorts For Your Next Trip',
    publisher: 'Travel With Tasin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop',
  }
];

// Featured products data matching reference image
export const FEATURED_PRODUCTS_MOCK = [
  {
    id: 1,
    title: 'Samsung Galaxy S24 Ultra',
    price: '124,800',
    originalPrice: '139,900',
    rating: '4.8 (1.2k)',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    discount: '-10%',
    badge: 'FEATURED'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5',
    price: '32,999',
    originalPrice: '38,999',
    rating: '4.7 (890)',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
    discount: '-15%',
    badge: 'BEST SELLER'
  },
  {
    id: 3,
    title: 'Amazfit GTR 4',
    price: '18,490',
    originalPrice: '22,999',
    rating: '4.6 (532)',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
    discount: '-20%',
    badge: null
  },
  {
    id: 4,
    title: 'Apple AirPods Pro 2',
    price: '25,999',
    originalPrice: '29,499',
    rating: '4.9 (1.5k)',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    discount: '-12%',
    badge: null
  },
  {
    id: 5,
    title: 'Nike Air Max Excee',
    price: '7,499',
    originalPrice: '9,999',
    rating: '4.6 (420)',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    discount: '-25%',
    badge: null
  },
  {
    id: 6,
    title: 'Xiaomi 14T Pro',
    price: '54,999',
    originalPrice: null,
    rating: '4.7 (210)',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    discount: null,
    badge: 'NEW'
  }
];

// Buying guides matching reference image
export const BUYING_GUIDES = [
  {
    id: 'g-1',
    title: 'Best Phones Under 30K in BD',
    desc: 'Updated May 2025',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=260&fit=crop'
  },
  {
    id: 'g-2',
    title: "Best Hotels in Cox's Bazar",
    desc: 'Top 10 Picks',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=260&fit=crop'
  },
  {
    id: 'g-3',
    title: 'Best Air Conditioners for Home',
    desc: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&h=260&fit=crop'
  },
  {
    id: 'g-4',
    title: 'Best Running Shoes for Men',
    desc: 'Expert Reviewed',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=260&fit=crop'
  },
  {
    id: 'g-5',
    title: 'Best Laptops for Students',
    desc: 'Budget Friendly',
    image: 'https://images.unsplash.com/photo-1496181133227-f83bb023945d?w=400&h=260&fit=crop'
  },
  {
    id: 'g-6',
    title: 'How to Choose the Right Camera',
    desc: 'Complete Guide',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=260&fit=crop'
  }
];

// Brand logos matching reference image
export const BRAND_LOGOS = [
  { id: 'brand-logo-samsung', name: 'SAMSUNG', image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { id: 'brand-logo-apple', name: 'Apple', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { id: 'brand-logo-xiaomi', name: 'Xiaomi', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
  { id: 'brand-logo-walton', name: 'WALTON', text: 'WALTON', image: null, color: 'text-blue-800 font-extrabold tracking-tighter' },
  { id: 'brand-logo-aarong', name: 'AARONG', text: 'AARONG', image: null, color: 'text-[#5C3A21] font-serif font-black tracking-widest' },
  { id: 'brand-logo-bata', name: 'Bata', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bata_logo.svg' },
  { id: 'brand-logo-pickaboo', name: 'PICKABOO', text: 'PICKABOO', image: null, color: 'text-[#FF5B00] font-black tracking-wide' },
  { id: 'brand-logo-lereve', name: 'Le Reve', text: 'Le Reve', image: null, color: 'text-purple-950 font-serif italic font-bold' }
];

// Recently viewed matching reference image with unique IDs
export const RECENTLY_VIEWED = [
  { id: 'rv-1', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop' },
  { id: 'rv-2', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&h=100&fit=crop' },
  { id: 'rv-3', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&h=100&fit=crop' },
  { id: 'rv-4', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
  { id: 'rv-5', image: 'https://images.unsplash.com/photo-1496181133227-f83bb023945d?w=100&h=100&fit=crop' },
  { id: 'rv-6', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop' },
  { id: 'rv-7', image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=100&h=100&fit=crop' },
  { id: 'rv-8', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop' }
];

export const HERO_SLIDES = [
  {
    title: "Choose, Compare &",
    highlight: "Decide Wisely.",
    subtitle: "Bangladesh's most trusted product discovery platform. Compare prices, read verified guides, and spot authentic deals.",
    cta1: "EXPLORE NOW",
    cta2: "HOW IT WORKS",
    imageLeft: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
    imageRight: "https://images.unsplash.com/photo-1695048133031-698f1f5068cf?w=500&q=80"
  },
  {
    title: "Compare Smartly,",
    highlight: "Save Instantly.",
    subtitle: "Find the absolute best deals, certified guides, and store prices.",
    cta1: "EXPLORE DEALS",
    cta2: "POPULAR SEARCH",
    imageLeft: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    imageRight: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80"
  }
];
