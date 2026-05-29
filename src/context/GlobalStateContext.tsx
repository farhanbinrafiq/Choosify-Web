import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductModeType, Product, User, Seller, Brand, Order, SubOrder, SubOrderItem, Report, BuyerReputation } from '../types/schemas';
import { PRODUCTS, BRANDS } from '../constants';
import { toast } from 'react-hot-toast';

export interface B2BRfq {
  id: string;
  item: string;
  category: string;
  quantity: number;
  targetPrice?: number;
  status: 'pending' | 'replied' | 'ordered';
  date: string;
  notes: string;
  supplierName?: string;
  supplierAvatar?: string;
  pricePerUnit?: number;
  totalOfferPrice?: number;
  responseNotes?: string;
}

export interface CartItem {
  id: number;
  product: any;
  quantity: number;
  selectedVariant?: any;
}

export interface GlobalStateContextType {
  mode: ProductModeType;
  setMode: (mode: ProductModeType) => void;
  retailCart: CartItem[];
  wholesaleCart: CartItem[];
  addToCart: (product: any, quantity: number, selectedVariant?: any) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (isCOD: boolean) => Order | null;
  addOrder: (order: Order) => void;
  updateSubOrderStatus: (parentOrderId: string, sellerId: string, nextStatus: 'pending' | 'dispatched' | 'transit' | 'delivered') => void;
  reports: Report[];
  addReport: (type: 'seller' | 'product' | 'brand', targetId: string, reason: string, description: string, evidence?: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  buyerReputations: BuyerReputation[];
  sellers: Seller[];
  allBrands: Brand[];
  allProducts: Product[];
  rfqs: B2BRfq[];
  submitRfq: (rfq: Omit<B2BRfq, 'id' | 'date' | 'status'>) => void;
  acceptQuotation: (rfqId: string) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-892',
  role: 'customer',
  name: 'Farhan Bin Rafiq',
  username: 'farhanrafiq',
  phone: '+880 1712-349812',
  email: 'farhanbinrafiq@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
  address: 'H-24, Road-11, Banani, Dhaka, Bangladesh',
  reputation_score: 95,
  orderStats: {
    totalOrders: 18,
    completedOrders: 16,
    cancelledOrders: 2
  },
  verification: {
    verified: true,
    docType: 'NID',
    docUrl: '#'
  },
  premiumStatus: true,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2026-05-20T12:00:00Z'
};

const INITIAL_BUYER_REPUTATIONS: BuyerReputation[] = [
  { userId: 'usr-892', reputationScore: 95, codTrustScore: 98, cancellationRatio: 5, refusalRatio: 0 },
  { userId: 'usr-321', reputationScore: 72, codTrustScore: 68, cancellationRatio: 25, refusalRatio: 8 },
  { userId: 'usr-445', reputationScore: 45, codTrustScore: 30, cancellationRatio: 55, refusalRatio: 20 },
  { userId: 'usr-991', reputationScore: 99, codTrustScore: 100, cancellationRatio: 0, refusalRatio: 0 }
];

const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-samsung',
    userId: 'usr-samsung',
    businessName: 'Samsung Bangladesh Ltd.',
    licenseNo: 'TR-SAM-99123',
    verificationDocs: ['TradeLicense.pdf'],
    ratings: 4.8,
    logistics: {
      provider: 'Pathao Delivery',
      supportedRegions: ['Dhaka', 'Chittagong', 'Sylhet']
    },
    sponsoredStatus: true,
    wholesaleEnabled: true,
    disputeHistory: { totalDisputes: 5, resolvedDisputes: 5 }
  },
  {
    id: 'seller-apple',
    userId: 'usr-apple',
    businessName: 'Apple Retail BD',
    licenseNo: 'TR-APP-88432',
    verificationDocs: ['TradeLicense2.pdf'],
    ratings: 4.9,
    logistics: {
      provider: 'Steady Express',
      supportedRegions: ['All Bangladesh']
    },
    sponsoredStatus: true,
    wholesaleEnabled: true,
    disputeHistory: { totalDisputes: 2, resolvedDisputes: 2 }
  },
  {
    id: 'seller-apex',
    userId: 'usr-apex',
    businessName: 'Apex Footwear Store',
    licenseNo: 'TR-APX-77541',
    verificationDocs: ['TradeLicense3.pdf'],
    ratings: 4.6,
    logistics: {
      provider: 'Paperfly logistics',
      supportedRegions: ['All Bangladesh']
    },
    sponsoredStatus: false,
    wholesaleEnabled: true,
    disputeHistory: { totalDisputes: 12, resolvedDisputes: 11 }
  },
  {
    id: 'seller-general',
    userId: 'usr-general',
    businessName: 'General Retail Palace',
    licenseNo: 'TR-GEN-33123',
    verificationDocs: ['TradeLicense4.pdf'],
    ratings: 4.2,
    logistics: {
      provider: 'eCourier',
      supportedRegions: ['Dhaka']
    },
    sponsoredStatus: false,
    wholesaleEnabled: false,
    disputeHistory: { totalDisputes: 1, resolvedDisputes: 1 }
  }
];

const INITIAL_RFQS: B2BRfq[] = [
  {
    id: "RFQ-5219",
    item: "High-density custom dyed cotton Polo shirts with company logo embroidery",
    category: "Fashion & Lifestyle",
    quantity: 500,
    targetPrice: 320,
    status: "replied",
    date: "2 hours ago",
    notes: "We need custom sizes distributed globally. S-XXL. Split ratios: 1:2:2:1.",
    supplierName: "Epyllion Trade Syndicate",
    supplierAvatar: "ET",
    pricePerUnit: 300,
    totalOfferPrice: 150000,
    responseNotes: "Special vendor rate offered for prompt dispatch. Bulk tax certificate invoice generated."
  },
  {
    id: "RFQ-8812",
    item: "Original Bulk Samsung A35 lots for employee rewards program",
    category: "Mobile & Phones",
    quantity: 35,
    targetPrice: 35000,
    status: "pending",
    date: "1 day ago",
    notes: "Require authentic BSTI verified products. Brand warranty sheets must be pre-filled."
  }
];

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ProductModeType>(() => {
    const saved = localStorage.getItem('choosify_mode');
    return (saved as ProductModeType) || 'retail';
  });

  const [retailCart, setRetailCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('choosify_retail_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wholesaleCart, setWholesaleCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('choosify_wholesale_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('choosify_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('choosify_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);

  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    const saved = localStorage.getItem('choosify_is_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const setIsLoggedIn = (val: boolean) => {
    setIsLoggedInState(val);
    localStorage.setItem('choosify_is_logged_in', String(val));
  };

  const [rfqs, setRfqs] = useState<B2BRfq[]>(() => {
    const saved = localStorage.getItem('choosify_b2b_rfqs');
    return saved ? JSON.parse(saved) : INITIAL_RFQS;
  });

  useEffect(() => {
    localStorage.setItem('choosify_b2b_rfqs', JSON.stringify(rfqs));
  }, [rfqs]);

  const submitRfq = (newRfqData: Omit<B2BRfq, 'id' | 'date' | 'status'>) => {
    const rfqId = `RFQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: B2BRfq = {
      ...newRfqData,
      id: rfqId,
      date: 'Just now',
      status: 'pending'
    };
    setRfqs(prev => [newRfq, ...prev]);
    toast.success(`Broadcasting RFQ ${rfqId} to verified South Asian Wholesalers!`);

    // Dynamic reply simulation
    setTimeout(() => {
      setRfqs(prev => 
        prev.map(q => {
          if (q.id === rfqId) {
            const calculatedPerUnit = q.targetPrice ? Math.round(Number(q.targetPrice) * 0.95) : 340;
            return {
              ...q,
              status: 'replied',
              supplierName: q.category.includes('Tech') || q.category.includes('Mobile') ? 'Bengal Tech Distributors' : 'Epyllion Trade Syndicate',
              supplierAvatar: q.category.includes('Tech') || q.category.includes('Mobile') ? 'BT' : 'ET',
              pricePerUnit: calculatedPerUnit,
              totalOfferPrice: calculatedPerUnit * q.quantity,
              responseNotes: 'Verified commercial wholesale catalog rate authorized direct dispatch.'
            };
          }
          return q;
        })
      );
      toast.success(`You received a direct seller quote for ${rfqId}! Check 'Live RFQs' tab.`);
    }, 4500);
  };

  const acceptQuotation = (rfqId: string) => {
    setRfqs(prev => 
      prev.map(q => q.id === rfqId ? { ...q, status: 'ordered' } : q)
    );
    toast.success('Quota offer accepted and invoice dispatched to Wholesale Settlement!');
  };

  const setMode = (newMode: ProductModeType) => {
    setModeState(newMode);
    localStorage.setItem('choosify_mode', newMode);
    toast.success(`Switched to ${newMode === 'retail' ? 'Retail' : 'Wholesale / B2B'} Mode`, {
      id: 'mode-switch-toast'
    });
  };

  useEffect(() => {
    localStorage.setItem('choosify_retail_cart', JSON.stringify(retailCart));
  }, [retailCart]);

  useEffect(() => {
    localStorage.setItem('choosify_wholesale_cart', JSON.stringify(wholesaleCart));
  }, [wholesaleCart]);

  useEffect(() => {
    localStorage.setItem('choosify_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('choosify_orders', JSON.stringify(orders));
  }, [orders]);

  // Combine static brands with schema rules
  const allBrands: Brand[] = BRANDS.map(b => ({
    id: b.id,
    name: b.name,
    logo: b.logo,
    verifiedStatus: b.id <= 4 || b.id === 10,
    followers: Math.floor(b.products * 12.3),
    ratings: b.rating,
    sponsoredFlag: b.id === 1 || b.id === 2 || b.id === 10,
    featuredFlag: b.id === 3 || b.id === 11,
    wholesaleSupport: b.id !== 9, // Everything except Pickaboo aggregates wholesale
    category: b.category
  }));

  // Map products statically into retail catalog and wholesale catalog
  // Map products statically into retail catalog and wholesale catalog
  const getVariantsForProduct = (productId: number, basePrice: number, baseImage: string): any[] | undefined => {
    if (productId === 1) {
      // Samsung Galaxy S24 Ultra
      const colors = ["Titanium Gray", "Titanium Yellow", "Titanium Violet"];
      const storages = ["256GB", "512GB", "1TB"];
      const colorImages: { [color: string]: string } = {
        "Titanium Gray": baseImage,
        "Titanium Yellow": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
        "Titanium Violet": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop"
      };
      const variants: any[] = [];
      colors.forEach(color => {
        storages.forEach(storage => {
          let priceDiff = 0;
          if (storage === "512GB") priceDiff = 10000;
          if (storage === "1TB") priceDiff = 25000;

          let stock = 15;
          if (color === "Titanium Yellow" && storage === "512GB") stock = 0;
          if (color === "Titanium Violet" && storage === "256GB") stock = 0;

          variants.push({
            sku: `S24U-${color.split(' ')[1].toUpperCase()}-${storage}`,
            attributes: {
              color,
              storage
            },
            price: basePrice + priceDiff,
            stock,
            image: colorImages[color]
          });
        });
      });
      return variants;
    }

    if (productId === 2) {
      // Sony WH-1000XM5
      return [
        {
          sku: "WH5-SILVER",
          attributes: { color: "Platinum Silver" },
          price: basePrice,
          stock: 12,
          image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop"
        },
        {
          sku: "WH5-BLACK",
          attributes: { color: "Midnight Black" },
          price: basePrice,
          stock: 18,
          image: baseImage
        }
      ];
    }

    if (productId === 3) {
      // Apple MacBook Air M3 (Simulated as Out of Stock)
      const rams = ["8GB", "16GB", "24GB"];
      const storages = ["256GB", "512GB"];
      const variants: any[] = [];
      rams.forEach(ram => {
        storages.forEach(storage => {
          let priceDiff = 0;
          if (ram === "16GB") priceDiff += 20000;
          if (ram === "24GB") priceDiff += 40000;
          if (storage === "512GB") priceDiff += 20000;

          variants.push({
            sku: `MBA3-${ram}-${storage}`,
            attributes: {
              ram,
              storage
            },
            price: basePrice + priceDiff,
            stock: 0,
            image: baseImage
          });
        });
      });
      return variants;
    }

    if (productId === 4) {
      // Nike Air Max 270 React
      const colors = ["Obsidian Black", "Hyper Crimson", "Electric Blue"];
      const sizes = ["40", "41", "42", "43", "44"];
      const colorImages: { [color: string]: string } = {
        "Obsidian Black": baseImage,
        "Hyper Crimson": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop",
        "Electric Blue": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop"
      };
      const variants: any[] = [];
      colors.forEach(color => {
        sizes.forEach(size => {
          let priceDiff = 0;
          if (color === "Hyper Crimson") priceDiff = 400;
          if (color === "Electric Blue") priceDiff = 600;

          let stock = 8;
          if (color === "Obsidian Black" && size === "42") stock = 0;
          if (color === "Hyper Crimson" && size === "40") stock = 0;
          if (color === "Electric Blue" && size === "44") stock = 0;

          variants.push({
            sku: `NIKE-${color.split(' ')[1].toUpperCase()}-${size}`,
            attributes: {
              color,
              size
            },
            price: basePrice + priceDiff,
            stock,
            image: colorImages[color]
          });
        });
      });
      return variants;
    }

    if (productId === 6) {
      // Apex Men's Ultima Pro Runner
      const colors = ["Stealth Black", "Neon Lime", "Carbon Grey"];
      const sizes = ["39", "40", "41", "42", "43"];
      const colorImages: { [color: string]: string } = {
        "Stealth Black": baseImage,
        "Neon Lime": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
        "Carbon Grey": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop"
      };
      const variants: any[] = [];
      colors.forEach(color => {
        sizes.forEach(size => {
          let priceDiff = 0;
          if (color === "Neon Lime") priceDiff = 150;
          if (color === "Carbon Grey") priceDiff = 250;

          let stock = 12;
          if (color === "Stealth Black" && size === "41") stock = 0;
          if (color === "Neon Lime" && size === "39") stock = 0;
          if (color === "Carbon Grey" && size === "43") stock = 0;

          variants.push({
            sku: `APEX-${color.split(' ')[1].toUpperCase()}-${size}`,
            attributes: {
              color,
              size
            },
            price: basePrice + priceDiff,
            stock,
            image: colorImages[color]
          });
        });
      });
      return variants;
    }

    if (productId === 8) {
      // Xiaomi Redmi Note 13 Pro
      const rams = ["8GB", "12GB"];
      const storages = ["256GB", "512GB"];
      const variants: any[] = [];
      rams.forEach(ram => {
        storages.forEach(storage => {
          let priceDiff = 0;
          if (ram === "12GB") priceDiff += 4000;
          if (storage === "512GB") priceDiff += 4000;

          let stock = 16;
          if (ram === "12GB" && storage === "512GB") stock = 3;

          variants.push({
            sku: `XIAOMI-${ram}-${storage}`,
            attributes: {
              ram,
              storage
            },
            price: basePrice + priceDiff,
            stock,
            image: baseImage
          });
        });
      });
      return variants;
    }

    return undefined;
  };

  const mappedProducts: Product[] = [];
  
  // Create Retail Products
  PRODUCTS.forEach(p => {
    const cleanPrice = parseFloat(p.price.replace(/,/g, '')) || 5000;
    mappedProducts.push({
      id: p.id,
      title: p.title,
      image: p.image,
      brand: p.brand,
      mode_type: 'retail',
      codSupport: p.id !== 1, // High value products might not have COD
      quotationSupport: false,
      stock: p.id === 3 ? 0 : p.id === 5 ? 3 : 58, // Simulate Out of stock for MacBook
      sellerId: p.brand === 'Samsung' ? 'seller-samsung' : p.brand === 'Apple' ? 'seller-apple' : p.brand === 'Apex' ? 'seller-apex' : 'seller-general',
      brandId: p.brand === 'Samsung' ? 1 : p.brand === 'Apple' ? 2 : p.brand === 'Apex' ? 3 : 4,
      price: cleanPrice,
      description: p.description || `Full verified ${p.title} with complete manufacturer accessory bundle and native local warranty coverage.`,
      category: p.category,
      variants: getVariantsForProduct(p.id, cleanPrice, p.image)
    });
  });

  // Create Wholesale Products (ID mapping shifted upwards by 1000 to keep unique)
  PRODUCTS.forEach(p => {
    const cleanPrice = parseFloat(p.price.replace(/,/g, '')) || 5000;
    const moq = p.category === 'Fashion & Lifestyle' ? 100 : 10;
    const pricingTiers = [
      { minQuantity: moq, price: Math.floor(cleanPrice * 0.85) },
      { minQuantity: moq * 3, price: Math.floor(cleanPrice * 0.78) },
      { minQuantity: moq * 10, price: Math.floor(cleanPrice * 0.70) }
    ];

    mappedProducts.push({
      id: p.id + 1000, // Unique wholesale IDs
      title: `[BULK] ${p.title}`,
      image: p.image,
      brand: p.brand,
      mode_type: 'wholesale',
      moq: moq,
      quantitySlabs: pricingTiers,
      bulkPricing: true,
      codSupport: true,
      quotationSupport: true,
      stock: 5000,
      sellerId: p.brand === 'Samsung' ? 'seller-samsung' : p.brand === 'Apple' ? 'seller-apple' : p.brand === 'Apex' ? 'seller-apex' : 'seller-general',
      brandId: p.brand === 'Samsung' ? 1 : p.brand === 'Apple' ? 2 : p.brand === 'Apex' ? 3 : 4,
      pricingTiers: pricingTiers,
      price: pricingTiers[0].price,
      description: `Premium Wholesale B2B offering for ${p.title}. Standard business invoices generated automatically. Standard COD logistics available.`,
      category: p.category
    });
  });

  const addToCart = (product: any, quantity: number, selectedVariant?: any) => {
    if (mode === 'retail') {
      setRetailCart(prev => {
        // Find existing with same product ID and exact same variant combination
        const existing = prev.find(item => 
          item.product.id === product.id && 
          ((!item.selectedVariant && !selectedVariant) || 
           (item.selectedVariant?.sku === selectedVariant?.sku))
        );
        if (existing) {
          return prev.map(item => 
            (item.product.id === product.id && 
             ((!item.selectedVariant && !selectedVariant) || 
              (item.selectedVariant?.sku === selectedVariant?.sku)))
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        // Save unique composite ID for this cart item row
        const uniqueCartItemId = Date.now() + Math.floor(Math.random() * 1000);
        return [...prev, { id: uniqueCartItemId, product, quantity, selectedVariant }];
      });
    } else {
      // MOQ validation for Wholesale
      const minQty = product.moq || 10;
      if (quantity < minQty) {
        toast.error(`Minimum Order Quantity (MOQ) for this B2B product is ${minQty} units.`);
        return;
      }
      setWholesaleCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
        }
        return [...prev, { id: product.id, product, quantity }];
      });
    }
    toast.success(`Added ${quantity} units to your ${mode === 'retail' ? 'Retail' : 'Wholesale'} Cart`);
  };

  const removeFromCart = (productId: number) => {
    if (mode === 'retail') {
      setRetailCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setWholesaleCart(prev => prev.filter(item => item.id !== productId));
    }
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (mode === 'retail') {
      setRetailCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    } else {
      const item = wholesaleCart.find(i => i.id === productId);
      const minQty = item?.product?.moq || 10;
      if (quantity < minQty) {
        toast.error(`Cannot set quantity below Minimum Order Quantity (${minQty}) in Wholesale Mode.`);
        return;
      }
      setWholesaleCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    }
  };

  const clearCart = () => {
    if (mode === 'retail') setRetailCart([]);
    else setWholesaleCart([]);
  };

  const createOrder = (isCOD: boolean): Order | null => {
    const currentCart = mode === 'retail' ? retailCart : wholesaleCart;
    if (currentCart.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    // Dynamic Slabs calculations for wholesale prices
    const processItemPrice = (item: CartItem) => {
      const baseProduct = item.product;
      if (mode === 'retail') return baseProduct.price;
      
      const slabs = baseProduct.pricingTiers || baseProduct.quantitySlabs || [];
      if (slabs.length === 0) return baseProduct.price;
      
      // Fine-tune pricing based on slab
      let applicablePrice = baseProduct.price;
      const sortedSlabs = [...slabs].sort((a,b) => b.minQuantity - a.minQuantity);
      for (const slab of sortedSlabs) {
        if (item.quantity >= slab.minQuantity) {
          applicablePrice = slab.price;
          break;
        }
      }
      return applicablePrice;
    };

    // Group items by seller
    const itemsBySeller: { [sellerId: string]: CartItem[] } = {};
    currentCart.forEach(item => {
      const sId = item.product.sellerId || 'seller-general';
      if (!itemsBySeller[sId]) {
        itemsBySeller[sId] = [];
      }
      itemsBySeller[sId].push(item);
    });

    const subOrders: SubOrder[] = [];
    let overallTotal = 0;

    Object.keys(itemsBySeller).forEach(sId => {
      const sellerItems = itemsBySeller[sId];
      const sellerObj = INITIAL_SELLERS.find(s => s.id === sId) || INITIAL_SELLERS[3];
      
      const subItems: SubOrderItem[] = sellerItems.map(item => {
        const itemPrice = processItemPrice(item);
        return {
          productId: item.product.id,
          productTitle: item.product.title,
          quantity: item.quantity,
          price: itemPrice
        };
      });

      const subTotal = subItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      const deliveryFee = mode === 'retail' ? 120 : 1500; // Wholesale is heavier freight shipping
      
      overallTotal += subTotal + deliveryFee;

      subOrders.push({
        sellerId: sId,
        sellerBusinessName: sellerObj.businessName,
        items: subItems,
        deliveryFee,
        invoiceId: `INV-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
        trackingStatus: 'pending'
      });
    });

    const isSplit = subOrders.length > 1;

    const newOrder: Order = {
      orderId: `ORD-${Date.now()}`,
      buyerId: currentUser.id,
      isCOD,
      isSplit,
      overallTotal,
      subOrders,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    toast.success(`Order Placed Successfully! ${isSplit ? 'Split into ' + subOrders.length + ' deliveries per seller.' : 'Sent to dispatch.'}`);
    return newOrder;
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateSubOrderStatus = (parentOrderId: string, sellerId: string, nextStatus: 'pending' | 'dispatched' | 'transit' | 'delivered') => {
    setOrders(prev => prev.map(o => {
      if (o.orderId === parentOrderId) {
        return {
          ...o,
          subOrders: o.subOrders.map((sub: any) => {
            if (sub.sellerId === sellerId) {
              return { ...sub, trackingStatus: nextStatus };
            }
            return sub;
          })
        };
      }
      return o;
    }));
  };

  const addReport = (
    type: 'seller' | 'product' | 'brand',
    targetId: string,
    reason: string,
    description: string,
    evidence?: string
  ) => {
    const newReport: Report = {
      report_id: `REP-${Date.now()}`,
      reporter_id: currentUser.id,
      type,
      targetId,
      reason,
      description,
      evidence,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    toast.success(`Thank you. Your report has been registered. ID: ${newReport.report_id}`, {
      duration: 4000
    });
  };

  // Filter products by active mode to ensure data separation
  const allProducts = mappedProducts.filter(p => p.mode_type === mode);

  return (
    <GlobalStateContext.Provider value={{
      mode,
      setMode,
      retailCart,
      wholesaleCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      createOrder,
      addOrder,
      updateSubOrderStatus,
      reports,
      addReport,
      currentUser,
      setCurrentUser,
      isLoggedIn,
      setIsLoggedIn,
      buyerReputations: INITIAL_BUYER_REPUTATIONS,
      sellers: INITIAL_SELLERS,
      allBrands,
      allProducts,
      rfqs,
      submitRfq,
      acceptQuotation
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
