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
  associatedGuideId?: string | number;
  /** Creator-pinned content for profile ranking */
  pinned?: boolean;
  /** Active LIVE stream on this piece of content */
  isLive?: boolean;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  score: number; // 0 - 100
  bestFor: string; // "Tech" | "Fashion" | "Lifestyle" | "Finance" | "Home Living"
  bestForTags: string[];
  platforms: ('YouTube' | 'Instagram' | 'Facebook' | 'TikTok')[];
  bio: string;
  followers: { [key: string]: string };
  email: string;
  phone: string;
  videos: MediaItem[];
  reels: MediaItem[];
  blogs: MediaItem[];
  /** Catalog ranking fields — optional on mock data */
  featuredFlag?: boolean;
  verifiedStatus?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const CREATORS: Creator[] = [
  {
    id: "creator-farhan",
    name: "Farhan Bin Rafiq",
    handle: "@farhan_tech",
    avatar: "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png",
    score: 96,
    bestFor: "Tech",
    bestForTags: ["Smartphones", "Laptops", "Gadget Guides", "Dhaka Tech Hubs"],
    platforms: ["YouTube", "Facebook"],
    bio: "Senior Tech Analyst & Digital Product Researcher with 10+ years of experience analyzing electronic imports, consumer durables, and PC components in the Bangladesh market.",
    followers: { "YouTube": "450K Subscriber Base", "Facebook": "120K Followers" },
    email: "farhan.outreach@choosify.bd",
    phone: "+880 1712-345678",
    videos: [
      {
        id: "v1",
        title: "The Ultimate Budget PC Build Guide in Dhaka | BDT 35K-50K Setup",
        thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&h=337&q=80",
        views: "124K views",
        duration: "15:42",
        url: "https://www.youtube.com/watch?v=8jPQjjsBbIc",
      },
      {
        id: "v2",
        title: "Realme vs Xiaomi: Best Under-Display Camera Smartphones Under BDT 25,000",
        thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&h=337&q=80",
        views: "98K views",
        duration: "12:18",
        url: "#",
        associatedGuideId: 1,
      },
      {
        id: "v3",
        title: "Testing Flagship Earbuds on Dhaka Bus Routes (ANC Validation Test)",
        thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&h=337&q=80",
        views: "82K views",
        duration: "18:05",
        url: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
      },
    ],
    reels: [
      {
        id: "r1",
        title: "Top 3 EDC Gadgets from Multiplaza under 1000 Taka!",
        thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&h=533&q=80",
        views: "240K views",
        likes: "18K",
        url: "#"
      },
      {
        id: "r2",
        title: "Instant thermal paste check: Does it make a difference in Dhaka summer?",
        thumbnail: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=300&h=533&q=80",
        views: "185K views",
        likes: "14K",
        url: "#"
      },
      {
        id: "r3",
        title: "This tiny Type-C hub is a life-saver for University students!",
        thumbnail: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=300&h=533&q=80",
        views: "310K views",
        likes: "25K",
        url: "#"
      }
    ],
    blogs: [
      {
        id: "b1",
        title: "Navigating Grey Market Premium Electronics in Bangladesh: Warranty vs Cost",
        excerpt: "An in-depth manual highlighting the trade-offs of purchasing imported hardware without domestic distributor warranty validation. Learn how to verify official customs documentation.",
        readTime: "8 min read",
        date: "June 12, 2026",
        thumbnail: "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=400&h=250&q=80",
        url: "#"
      },
      {
        id: "b2",
        title: "Local Retailer vs Import Sourced: The Cost of SSD Solid State Storage in Dhaka",
        excerpt: "We analyze historical parts pricing trends across Multiplan Center and IDB Bhaban to provide a predictive cost model for high-density flash storage components.",
        readTime: "5 min read",
        date: "May 28, 2026",
        thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&h=250&q=80",
        url: "#"
      }
    ]
  },
  {
    id: "creator-sarah",
    name: "Sarah Jenkins",
    handle: "@sarah_styles",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
    score: 93,
    bestFor: "Fashion",
    bestForTags: ["Streetwear", "Minimalist Wardrobe", "Local Boutiques", "Sustainable Materials"],
    platforms: ["Instagram", "TikTok"],
    bio: "Fashion Curator, Designer, & Retail Analyst specializing in contemporary garments, material longevity metrics, and Dhaka street style aesthetics. Passionate about blending modern cuts with Bangladeshi heritage textiles.",
    followers: { "Instagram": "310K Followers", "TikTok": "150K Base" },
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
      },
      {
        id: "v5",
        title: "My 10-Item Capsule Wardrobe Checklist (Dhaka Monsoon Edition)",
        thumbnail: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&h=337&q=80",
        views: "81K views",
        duration: "14:15",
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
        url: "#",
        associatedGuideId: 4
      },
      {
        id: "r5",
        title: "Why linen is the only fabric you should wear this June.",
        thumbnail: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&h=533&q=80",
        views: "290K views",
        likes: "22K",
        url: "#"
      },
      {
        id: "r6",
        title: "Simple styling hack for oversized shirts.",
        thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&h=533&q=80",
        views: "520K views",
        likes: "49K",
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
    id: "creator-imtiaz",
    name: "Imtiaz Ahmed",
    handle: "@imtiaz_living",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    score: 89,
    bestFor: "Lifestyle",
    bestForTags: ["Home Decor", "Organized Living", "Smart Kitchen", "Decluttering"],
    platforms: ["Facebook", "YouTube"],
    bio: "Interior Systems Architect and Home Operations Specialist with an emphasis on local modular setups, energy-efficient appliance placement, and optimizing space density in compact urban flats.",
    followers: { "Facebook": "180K Followers", "YouTube": "75K Subscribers" },
    email: "imtiaz.living@choosify.bd",
    phone: "+880 1681-223344",
    videos: [
      {
        id: "v6",
        title: "Touring a Modular 1200 Sq Ft Flat in Uttara (Zero-Waste Organization Tour)",
        thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&h=337&q=80",
        views: "72K views",
        duration: "21:03",
        url: "#"
      },
      {
        id: "v7",
        title: "Testing Inverter Recess Refrigerators against Non-Inverters: Live Power Consumpion Metering",
        thumbnail: "https://images.unsplash.com/photo-1571175452281-047b769225d7?auto=format&fit=crop&w=600&h=337&q=80",
        views: "54K views",
        duration: "13:50",
        url: "#"
      }
    ],
    reels: [
      {
        id: "r7",
        title: "3 kitchen layout errors to avoid in Gulshan rentals.",
        thumbnail: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&h=533&q=80",
        views: "120K views",
        likes: "9.2K",
        url: "#"
      },
      {
        id: "r8",
        title: "How to fit a study corner into an 8x10 bedroom.",
        thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&h=533&q=80",
        views: "165K views",
        likes: "11K",
        url: "#"
      }
    ],
    blogs: [
      {
        id: "b4",
        title: "The Ultimate Bangladeshi Kitchen Ventilation Guide: Hoods vs Exhaust Fans",
        excerpt: "An engineering appraisal comparing high-volume suction exhaust hoods against passive exhaust systems in apartment designs modeled for heavy spice environments.",
        readTime: "9 min read",
        date: "May 15, 2026",
        thumbnail: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=400&h=250&q=80",
        url: "#"
      }
    ]
  },
  {
    id: "creator-mily",
    name: "Mily Rahman",
    handle: "@mily_finance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    score: 91,
    bestFor: "Finance",
    bestForTags: ["Personal Budgeting", "Sanchayapatra", "Tax Filing BD", "Credit Score Tips"],
    platforms: ["YouTube", "Facebook"],
    bio: "Chartered Financial Consultant and Consumer Advocate making retail finance simple, transparent, and actionable for professional youth and local households.",
    followers: { "YouTube": "210K Subscribers", "Facebook": "140K Followers" },
    email: "mily.media@choosify.bd",
    phone: "+880 1511-556677",
    videos: [
      {
        id: "v8",
        title: "How to File Income Tax Online in Bangladesh (Step-by-Step Guide for 2026)",
        thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&h=337&q=80",
        views: "320K views",
        duration: "25:10",
        url: "#"
      },
      {
        id: "v9",
        title: "Sanchayapatra Investment Rules: Latest Interest Rates & Verification Procedures",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=337&q=80",
        views: "180K views",
        duration: "17:45",
        url: "#"
      }
    ],
    reels: [
      {
        id: "r9",
        title: "Stop storing money in standard current accounts. Here's why.",
        thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&h=533&q=80",
        views: "340K views",
        likes: "28K",
        url: "#"
      },
      {
        id: "r10",
        title: "How to check credit history with central bank portal.",
        thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=300&h=533&q=80",
        views: "220K views",
        likes: "19K",
        url: "#"
      }
    ],
    blogs: [
      {
        id: "b5",
        title: "Youth Retail Banking in Bangladesh: Fee Structures & Savings Accounts Comparison",
        excerpt: "An exhaustive comparison table analyzing student accounts, monthly maintenance thresholds, and atm charges across top 10 retail banks in Dhaka.",
        readTime: "7 min read",
        date: "April 29, 2026",
        thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&h=250&q=80",
        url: "#"
      }
    ]
  },
  {
    id: "creator-shakib",
    name: "Shakib Al-Mridha",
    handle: "@shakib_lifestyle",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
    score: 87,
    bestFor: "Lifestyle",
    bestForTags: ["Travel Sourcing", "Café Reviews", "Local Craftsmanship", "Eco Tourism"],
    platforms: ["Instagram", "TikTok", "YouTube"],
    bio: "Professional Travel Vlogger, Culinary Reviewer, and Eco-Lodge Developer based in Sylhet and Dhaka. Highlighting Bangladesh's emerging hospitality sector, organic food sourcing, and local lifestyle innovations.",
    followers: { "Instagram": "180K Followers", "TikTok": "230K Base", "YouTube": "100K Subscribers" },
    email: "shakib.outreach@choosify.bd",
    phone: "+880 1912-334455",
    videos: [
      {
        id: "v10",
        title: "Is Sylhet's New Eco-Resort Worth BDT 15K a Night? (Detailed Audit)",
        thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&h=337&q=80",
        views: "115K views",
        duration: "19:12",
        url: "#"
      },
      {
        id: "v11",
        title: "Chasing the Best Organic Coffee Cooperatives in the Chittagong Hill Tracts",
        thumbnail: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&h=337&q=80",
        views: "89K views",
        duration: "22:45",
        url: "#",
        associatedGuideId: 8
      }
    ],
    reels: [
      {
        id: "r11",
        title: "Top 3 hidden cafes in Banani for quiet reading.",
        thumbnail: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=300&h=533&q=80",
        views: "198K views",
        likes: "15.4K",
        url: "#"
      },
      {
        id: "r12",
        title: "This organic honey from Sunderbans is absolute gold!",
        thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&h=533&q=80",
        views: "245K views",
        likes: "21K",
        url: "#"
      }
    ],
    blogs: [
      {
        id: "b6",
        title: "The Rise of Organic Agri-Boutiques in Dhaka: Quality Sourcing Reports",
        excerpt: "An investigative overview of supply networks distributing chemical-free produce, fresh honey, and block-pressed mustard oil directly from farmers to city doorsteps.",
        readTime: "6 min read",
        date: "May 10, 2026",
        thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&h=250&q=80",
        url: "#"
      }
    ]
  }
];
