import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../constants';
import { CompareEngine } from '../components/CompareEngine';

export function ComparePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <main className="w-full">
        <CompareEngine />
      </main>
    </div>
  );
}
