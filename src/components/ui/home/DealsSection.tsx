import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, CreditCard, Ticket, ShoppingBag } from 'lucide-react';
import { DealCard } from '../../../components/DealCard';

export const DEALS_MOCK = [
  {
    type: 'flash',
    bg: 'bg-gradient-to-br from-[#FF5B00] to-[#EB4501]',
    label: 'FLASH SALE',
    title: 'Up to 60% Off',
    subtitle: 'On selected items',
    icon: Flame,
    cta: 'SHOP NOW'
  },
  {
    type: 'bank',
    bg: 'bg-[#3B82F6]',
    label: 'BANK OFFER',
    title: 'Up to 20% Cashback',
    subtitle: 'With selected cards',
    icon: CreditCard,
    cta: 'SHOP NOW'
  },
  {
    type: 'coupon',
    bg: 'bg-[#10B981]',
    label: 'COUPONS',
    title: 'Extra 10% Off',
    subtitle: 'On orders over 5,000',
    icon: Ticket,
    code: 'CHOOSEFY10COP'
  },
  {
    type: 'sponsor',
    bg: 'bg-[#EC4899]',
    label: 'SPONSORED',
    title: 'Pickaboo Mega Deals',
    subtitle: 'Best prices on electronics',
    icon: ShoppingBag,
    cta: 'EXPLORE NOW'
  }
];

export const DealsSection: React.FC = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Today's Deals</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Limited time offers — don't miss out!</p>
        </div>
        <Link 
          to="/deals" 
          className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]"
        >
          VIEW ALL DEALS <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEALS_MOCK.map((deal, idx) => (
          <DealCard key={idx} variant="promo" deal={deal} />
        ))}
      </div>
    </section>
  );
};
