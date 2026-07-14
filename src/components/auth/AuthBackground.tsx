import React from 'react';
import { motion } from 'motion/react';

interface BackgroundProduct {
  id: number;
  title: string;
  brand: string;
  price: string;
  badge: string;
  badgeBg: string;
  image: string;
  installmentPrice: string;
}

const BACKGROUND_PRODUCTS: BackgroundProduct[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: '৳134,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop',
    installmentPrice: '৳6,366'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5',
    brand: 'Sony',
    price: '৳29,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&h=300&fit=crop',
    installmentPrice: '৳2,500'
  },
  {
    id: 3,
    title: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    price: '৳145,000',
    badge: 'HOT DEAL',
    badgeBg: 'bg-[#FF5B00]/15 text-[#FF5B00] border-[#FF5B00]/20',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop',
    installmentPrice: '৳8,660'
  },
  {
    id: 4,
    title: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: '৳139,990',
    badge: 'TOP SPOT',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop',
    installmentPrice: '৳7,680'
  },
  {
    id: 5,
    title: 'MacBook Air M1',
    brand: 'Apple',
    price: '৳146,990',
    badge: 'TOP RATED',
    badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&h=300&fit=crop',
    installmentPrice: '৳8,785'
  },
  {
    id: 6,
    title: 'DJI Mini 4 Pro',
    brand: 'DJI',
    price: '৳89,990',
    badge: 'NEW',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=300&h=300&fit=crop',
    installmentPrice: '৳6,366'
  },
  {
    id: 7,
    title: 'Nike Air Max 270',
    brand: 'Nike',
    price: '৳12,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    installmentPrice: '৳2,580'
  },
  {
    id: 8,
    title: 'Instax Mini 12',
    brand: 'Fujifilm',
    price: '৳11,990',
    badge: 'BEST SELLER',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop',
    installmentPrice: '৳2,500'
  },
  {
    id: 9,
    title: 'Premium Travel Bag',
    brand: 'Nomatic',
    price: '৳4,590',
    badge: 'HOT DEAL',
    badgeBg: 'bg-[#FF5B00]/15 text-[#FF5B00] border-[#FF5B00]/20',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    installmentPrice: '৳785'
  }
];

export const AuthBackground: React.FC = () => {
  // Stagger columns of cards
  const columns = [
    [0, 5, 2],
    [1, 6, 8],
    [3, 7, 0],
    [4, 2, 5],
    [8, 1, 3]
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#000435]" id="auth-background-layer">
      {/* Grid of floating cards */}
      <div className="absolute inset-x-0 top-0 bottom-0 grid grid-cols-5 gap-6 p-6 opacity-[0.35] blur-[10px] select-none pointer-events-none scale-105">
        {columns.map((colIndices, colIdx) => (
          <motion.div
            key={colIdx}
            className="flex flex-col gap-6"
            animate={{
              y: colIdx % 2 === 0 ? [0, -40, 0] : [-40, 0, -40],
            }}
            transition={{
              duration: 20 + colIdx * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              marginTop: `${colIdx * 24}px`
            }}
          >
            {colIndices.map((prodIdx, itemIdx) => {
              const product = BACKGROUND_PRODUCTS[prodIdx];
              return (
                <div
                  key={`${colIdx}-${itemIdx}-${product.id}`}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-2xl h-[280px]"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded border ${product.badgeBg}`}>
                      {product.badge}
                    </span>
                  </div>
                  
                  {/* Image container */}
                  <div className="w-full h-28 my-3 overflow-hidden rounded-xl bg-black/10 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="text-left">
                    <h4 className="text-sm font-extrabold text-white tracking-tight leading-tight truncate mb-0.5">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-white/40 font-bold mb-1">{product.brand}</p>
                    
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-black text-[#FF5B00]">{product.price}</span>
                      <div className="text-right">
                        <p className="text-[8px] text-white/30 font-bold uppercase leading-none">0% installment</p>
                        <p className="text-[10px] text-white/80 font-extrabold leading-none">{product.installmentPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Dark Navy Overlay */}
      <div className="absolute inset-0 bg-[#000435]/85 z-10" id="dark-navy-overlay" />

      {/* Radial Vignette */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,4,53,0.75)_80%)]" 
        id="radial-vignette"
      />
      
      {/* Custom light bloom element */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FF5B00] opacity-5 blur-[120px] pointer-events-none" />
    </div>
  );
};
