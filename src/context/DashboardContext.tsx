import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PRODUCTS, BRANDS } from '../constants';
import toast from 'react-hot-toast';

interface DashboardContextType {
  savedProducts: any[];
  setSavedProducts: React.Dispatch<React.SetStateAction<any[]>>;
  savedBrands: any[];
  setSavedBrands: React.Dispatch<React.SetStateAction<any[]>>;
  savedGuides: any[];
  setSavedGuides: React.Dispatch<React.SetStateAction<any[]>>;
  comparedProducts: any[];
  setComparedProducts: React.Dispatch<React.SetStateAction<any[]>>;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  reviews: any[];
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
  removeSavedProduct: (id: number) => void;
  removeSavedBrand: (id: number) => void;
  addToCompare: (product: any) => void;
  removeFromCompare: (id: number) => void;
  addMessage: (text: string, sender: 'user' | 'other' | 'admin' | 'seller' | 'creator') => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [savedProducts, setSavedProducts] = useState([PRODUCTS[0], PRODUCTS[3], PRODUCTS[5]]);
  const [savedBrands, setSavedBrands] = useState([BRANDS[0], BRANDS[2], BRANDS[9]]);
  const [savedGuides, setSavedGuides] = useState([
    { id: 1, title: 'Best Budget Smartwatches 2026', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', category: 'Tech' },
    { id: 2, title: 'Top 5 Sustainable Fashion Brands', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop', category: 'Fashion' }
  ]);
  const [comparedProducts, setComparedProducts] = useState([PRODUCTS[0], PRODUCTS[1]]);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am interested in the Samsung S24 Ultra you posted. Is it still available?', sender: 'other', senderName: 'Rahat Hossain', time: '10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, text: 'Yes, it is still available. Would you like to know more about the warranty?', sender: 'user', time: '10:35 AM' },
    { id: 3, text: 'I have a question about the delivery time to Chittagong.', sender: 'other', senderName: 'Admin Support', time: '11:00 AM', avatar: 'https://i.pravatar.cc/150?u=admin' }
  ]);
  const [reviews, setReviews] = useState([
    { id: 1, product: PRODUCTS[0].title, rating: 5, comment: 'Amazing performance! The AI features are game-changing.', date: 'May 12, 2026' },
    { id: 2, product: PRODUCTS[5].title, rating: 4, comment: 'Very comfortable for daily runs, but size runs slightly small.', date: 'April 28, 2026' }
  ]);

  const removeSavedProduct = (id: number) => {
    setSavedProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product removed from vault');
  };

  const removeSavedBrand = (id: number) => {
    setSavedBrands(prev => prev.filter(b => b.id !== id));
    toast.success('Brand removed from loved list');
  };

  const addToCompare = (product: any) => {
    if (comparedProducts.length >= 4) {
      toast.error('Maximum 4 products allowed for comparison');
      return;
    }
    if (comparedProducts.find(p => p.id === product.id)) {
      toast.error('Product already in comparison');
      return;
    }
    setComparedProducts(prev => [...prev, product]);
    toast.success(`${product.brand} added to compare`);
  };

  const removeFromCompare = (id: number) => {
    setComparedProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product removed from comparison');
  };

  const addMessage = (text: string, sender: 'user' | 'other' | 'admin' | 'seller' | 'creator' = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: sender === 'user' ? 'Me' : 'Support',
      avatar: sender === 'user' ? undefined : 'https://i.pravatar.cc/150?u=support'
    };
    setMessages(prev => [...prev, newMessage]);
    if (sender === 'user') {
      toast.success('Message sent to curator');
    }
  };

  return (
    <DashboardContext.Provider value={{
      savedProducts, setSavedProducts,
      savedBrands, setSavedBrands,
      savedGuides, setSavedGuides,
      comparedProducts, setComparedProducts,
      messages, setMessages,
      reviews, setReviews,
      removeSavedProduct,
      removeSavedBrand,
      addToCompare,
      removeFromCompare,
      addMessage
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
