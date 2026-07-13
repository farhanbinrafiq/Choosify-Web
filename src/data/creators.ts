export interface MediaItem {
  id: string;
  title: string;
  thumbnail: string;
  views?: string;
  duration?: string;
  likes?: string;
  excerpt?: string;
  readTime?: string;
  date?: string;
  url: string;
  associatedGuideId?: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  score: number; // 0 - 100
  bestFor: string; 
  bestForTags: string[];
  platforms: ('YouTube' | 'Instagram' | 'Facebook' | 'TikTok')[];
  bio: string;
  followers: { [key: string]: string };
  email: string;
  phone: string;
  videos: MediaItem[];
  reels: MediaItem[];
  blogs: MediaItem[];
  // Extra fields matching the redesigned search metrics
  rating: number;
  reviews: number;
  trustScore: number;
  followersCount: string;
  reviewsCount: number;
  isFeatured?: boolean;
}

export const CREATORS: Creator[] = [
  {
    id: "creator-farhan",
    name: "Farhan Bin Rafiq",
    handle: "@farhan_tech",
    avatar: "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png",
    score: 98,
    bestFor: "Tech Reviewers",
    bestForTags: ["Smartphones", "Laptops", "Gadget Guides", "Dhaka Tech Hubs"],
    platforms: ["YouTube", "Instagram", "TikTok", "Facebook"],
    bio: "Senior Tech Analyst & Digital Product Researcher with 10+ years of experience analyzing electronic imports, consumer durables, and PC components in the Bangladesh market.",
    followers: { "YouTube": "125K Followers" },
    followersCount: "125K",
    reviewsCount: 256,
    rating: 4.8,
    reviews: 12300,
    trustScore: 98,
    isFeatured: true,
    email: "farhan.outreach@choosify.bd",
    phone: "+880 1712-345678",
    videos: [
      {
        id: "v1",
        title: "The Ultimate Budget PC Build Guide in Dhaka | BDT 35K-50K Setup",
        thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&h=337&q=80",
        views: "124K views",
        duration: "15:42",
        url: "#"
      },
      {
        id: "v2",
        title: "Realme vs Xiaomi: Best Under-Display Camera Smartphones Under BDT 25,000",
        thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&h=337&q=80",
        views: "98K views",
        duration: "12:18",
        url: "#",
        associatedGuideId: 1
      }
    ],
    reels: [
      {
        id: "r1",
        title: "Top 3 EDC Gadgets from Multiplaza under 1000 Taka!",
        thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&h=533&q=80",
        views: "240K views",
        likes: "18K",
        url: "#"
      }
    ],
    blogs: [
      {
        id: "b1",
        title: "Navigating Grey Market Premium Electronics in Bangladesh",
        excerpt: "An in-depth manual highlighting the trade-offs of purchasing imported hardware without domestic distributor warranty validation.",
        readTime: "8 min read",
        date: "June 12, 2026",
        thumbnail: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=400&h=250&q=80",
        url: "#"
      }
    ]
  },
  {
    id: "creator-sarah",
    name: "Sarah Jenkins",
    handle: "@sarah_styles",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
    score: 96,
    bestFor: "Fashion Creators",
    bestForTags: ["Streetwear", "Minimalist Wardrobe", "Local Boutiques", "Sustainable Materials"],
    platforms: ["YouTube", "Instagram", "TikTok", "Facebook"],
    bio: "Fashion Curator, Designer, & Retail Analyst specializing in contemporary garments, material longevity metrics, and Dhaka street style aesthetics.",
    followers: { "Instagram": "98K Followers" },
    followersCount: "98K",
    reviewsCount: 189,
    rating: 4.8,
    reviews: 8700,
    trustScore: 96,
    isFeatured: true,
    email: "sarah.collabs@choosify.bd",
    phone: "+880 1812-987654",
    videos: [
      {
        id: "v4",
        title: "Banarasi Polka & Block Print Fusion: Sourcing Summer Outfits in Dhaka",
        thumbnail: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&h=337&q=80",
        views: "95K views",
        duration: "10:30",
        url: "#"
      }
    ],
    reels: [
      {
        id: "r4",
        title: "Thrifting challenge in Doja Market under BDT 1,500!",
        thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&h=533&q=80",
        views: "420K views",
        likes: "38K",
        url: "#"
      }
    ],
    blogs: [
      {
        id: "b3",
        title: "Preserving Desi Block Prints: Washing Rules & Fiber Care Analysis",
        excerpt: "An empirical look at washing variables that extend the dye lifetime of cotton and muslin fabrics inside high-humidity environments.",
        readTime: "6 min read",
        date: "June 05, 2026",
        thumbnail: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=400&h=250&q=80",
        url: "#"
      }
    ]
  },
  {
    id: "creator-rakib",
    name: "Tech With Rakib",
    handle: "@tech_rakib",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
    score: 98,
    bestFor: "Tech Reviewers",
    bestForTags: ["Smartphones", "Unboxing", "Gadgets", "Smart Home"],
    platforms: ["YouTube", "TikTok", "Facebook", "Instagram"],
    bio: "Unboxing pioneer and device review specialist showcasing structural details and software optimization performance on consumer gadgets in Bangladesh.",
    followers: { "YouTube": "215K Subscribers" },
    followersCount: "215K",
    reviewsCount: 312,
    rating: 4.9,
    reviews: 15200,
    trustScore: 98,
    isFeatured: true,
    email: "rakib.collabs@choosify.bd",
    phone: "+880 1715-998877",
    videos: [
      {
        id: "v12",
        title: "Unboxing the Newest Flagship Killer: Pure Performance Under BDT 40K!",
        thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&h=337&q=80",
        views: "150K views",
        duration: "11:20",
        url: "#"
      }
    ],
    reels: [
      {
        id: "r15",
        title: "Quick hands-on review: The ultimate budget wireless gaming mouse!",
        thumbnail: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=300&h=533&q=80",
        views: "350K views",
        likes: "40K",
        url: "#"
      }
    ],
    blogs: []
  },
  {
    id: "creator-nusrat",
    name: "Nusrat Jahan",
    handle: "@nusrat_skincare",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    score: 95,
    bestFor: "Fashion Creators",
    bestForTags: ["Skincare", "Makeup Guides", "Beauty Sourcing", "Local Serums"],
    platforms: ["YouTube", "Instagram", "TikTok"],
    bio: "Certified Skincare Esthetician and makeup design artist reviewing chemical profiles, ingredient safety metrics, and local beauty wellness brands.",
    followers: { "Instagram": "76K Followers" },
    followersCount: "76K",
    reviewsCount: 142,
    rating: 4.7,
    reviews: 7100,
    trustScore: 95,
    isFeatured: false,
    email: "nusrat.beauty@choosify.bd",
    phone: "+880 1823-112233",
    videos: [
      {
        id: "v13",
        title: "My 5-Step Hydration Routine for Hot Dhaka Summers (Oily Skin Safe)",
        thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&h=337&q=80",
        views: "80K views",
        duration: "13:10",
        url: "#"
      }
    ],
    reels: [
      {
        id: "r16",
        title: "Stop using physical face scrubs! Try this instead.",
        thumbnail: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=300&h=533&q=80",
        views: "180K views",
        likes: "15K",
        url: "#"
      }
    ],
    blogs: []
  },
  {
    id: "creator-gadget",
    name: "Gadget Unboxing BD",
    handle: "@gadget_unboxing_bd",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    score: 94,
    bestFor: "Unboxing Experts",
    bestForTags: ["Audio Gears", "Smartwatches", "Unboxing Videos", "Tech Deals"],
    platforms: ["YouTube", "Facebook", "TikTok"],
    bio: "Actionable hands-on reviews and macro photography breakdowns of budget tech, smart accessories, and smart wearables imported directly to Bangladesh.",
    followers: { "YouTube": "64K Base" },
    followersCount: "64K",
    reviewsCount: 178,
    rating: 4.6,
    reviews: 8300,
    trustScore: 94,
    isFeatured: false,
    email: "gadget.unboxing.bd@choosify.bd",
    phone: "+880 1745-667788",
    videos: [
      {
        id: "v14",
        title: "Unboxing the Most Hyped ANC Earbuds Under 3000 TK!",
        thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&h=337&q=80",
        views: "45K views",
        duration: "09:45",
        url: "#"
      }
    ],
    reels: [],
    blogs: []
  },
  {
    id: "creator-homefinds",
    name: "Home Finds BD",
    handle: "@home_finds_bd",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=300&q=80",
    score: 94,
    bestFor: "Lifestyle Creators",
    bestForTags: ["Kitchen Tools", "Smart Organizers", "Home Aesthetics", "Room Tours"],
    platforms: ["YouTube", "Instagram", "Facebook"],
    bio: "Sourcing beautiful, functional, and budget-friendly household appliances, storage solutions, and decor elements to transform modern urban apartments.",
    followers: { "Facebook": "58K Followers" },
    followersCount: "58K",
    reviewsCount: 126,
    rating: 4.7,
    reviews: 5900,
    trustScore: 94,
    isFeatured: false,
    email: "homefinds@choosify.bd",
    phone: "+880 1623-445566",
    videos: [
      {
        id: "v15",
        title: "Top 5 Space Saving Organizers I Found in New Market under 500 TK",
        thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&h=337&q=80",
        views: "98K views",
        duration: "14:50",
        url: "#"
      }
    ],
    reels: [],
    blogs: []
  },
  {
    id: "creator-sneaker",
    name: "Sneaker Spotter",
    handle: "@sneaker_spotter_bd",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    score: 93,
    bestFor: "Budget Finds",
    bestForTags: ["Sneakers", "Streetwear", "Thrift Finds", "Brand Checks"],
    platforms: ["YouTube", "Instagram", "TikTok"],
    bio: "Uncovering premium replica vs original sneakers in local markets. Your go-to guide for street fashion, comfortable kicks, and sneaker collection maintenance in Dhaka.",
    followers: { "Instagram": "43K Followers" },
    followersCount: "43K",
    reviewsCount: 98,
    rating: 4.8,
    reviews: 4800,
    trustScore: 93,
    isFeatured: false,
    email: "sneakerspotter@choosify.bd",
    phone: "+880 1515-223344",
    videos: [
      {
        id: "v16",
        title: "Real vs Fake Sneakers Spotting Guide: Buy Smarter in Bangladesh",
        thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=337&q=80",
        views: "60K views",
        duration: "12:40",
        url: "#"
      }
    ],
    reels: [],
    blogs: []
  },
  {
    id: "creator-tania",
    name: "Travel With Tania",
    handle: "@travel_with_tania",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80",
    score: 92,
    bestFor: "Lifestyle Creators",
    bestForTags: ["Sajek Valley", "Sylhet Tea Gardens", "Resort Reviews", "Travel Gear"],
    platforms: ["YouTube", "Instagram", "Facebook"],
    bio: "Passionate storyteller exploring local resorts, budget-friendly hotels, hidden travel routes, and sustainable backpacking experiences across Bangladesh.",
    followers: { "YouTube": "39K Base" },
    followersCount: "39K",
    reviewsCount: 84,
    rating: 4.8,
    reviews: 3900,
    trustScore: 92,
    isFeatured: false,
    email: "traveltania@choosify.bd",
    phone: "+880 1912-889900",
    videos: [
      {
        id: "v17",
        title: "Solo Travel Sajek on BDT 4,000 Budget: Full Safety & Resort Guide",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=337&q=80",
        views: "110K views",
        duration: "18:20",
        url: "#"
      }
    ],
    reels: [],
    blogs: []
  }
];
