'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { CheckoutView } from '../../views/CheckoutView';
import { Order } from '../../types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    gstDetails,
    currentUser,
    addOrder,
    clearCart,
  } = useStore();

  const handlePaymentSuccess = (order: Order) => {
    addOrder(order);
    clearCart();
    router.push('/orders');
  };

  return (
    <CheckoutView
      cart={cart}
      gstDetails={gstDetails}
      discountPercent={0}
      currentUser={currentUser}
      onOpenAuth={(mode) => router.push(`/auth?mode=${mode || 'login'}`)}
      onPaymentSuccess={handlePaymentSuccess}
      onBackToCart={() => router.push('/cart')}
    />
  );
}
