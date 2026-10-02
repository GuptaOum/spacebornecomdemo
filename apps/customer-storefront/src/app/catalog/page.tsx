'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { CatalogView } from '../../views/CatalogView';
import { Product } from '../../types';

export default function CatalogPage() {
  const router = useRouter();
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addToCart,
    setSelectedProduct,
    setQuickViewProduct,
  } = useStore();

  // `/catalog?q=battery` opens the search directly (shared links, refresh, browser back).
  // Read from window to avoid a Suspense boundary requirement for useSearchParams.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')?.trim();
    if (q && !searchQuery) setSearchQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    router.push(`/product/${prod.id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
  };

  return (
    <CatalogView
      products={products}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onClearSearch={handleClearSearch}
      onSelectProduct={handleSelectProduct}
      onAddToCart={addToCart}
      onQuickView={setQuickViewProduct}
    />
  );
}
