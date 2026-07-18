/** Static category seed — kept separate from legacy product mocks to avoid bundle bloat. */
export const CATEGORIES = [
  { id: 'fashion', name: 'Fashion & Lifestyle', icon: 'Shirt' },
  { id: 'jewelry', name: 'Jewelry & Accessories', icon: 'Gem' },
  { id: 'mobile', name: 'Mobile & Phones', icon: 'Smartphone' },
  { id: 'sporting', name: 'Sporting & Playstation', icon: 'Gamepad2' },
  { id: 'gaming', name: 'Gaming & Entertainment', icon: 'Monitor' },
  { id: 'food', name: 'Food & Restaurants', icon: 'Utensils' },
  { id: 'tech', name: 'Tech & Electronics', icon: 'Cpu' },
  { id: 'appliances', name: 'TV & Appliances', icon: 'Tv' },
  { id: 'home', name: 'Home & Living', icon: 'Home' },
  { id: 'baby', name: 'Baby & Maternity', icon: 'Baby' },
] as const;
