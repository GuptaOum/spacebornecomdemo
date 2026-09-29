'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address, AppView, Order } from '../types';
import { apiRequest, toFrontendOrder } from '../lib/api';

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type CheckoutOrder = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

interface CheckoutViewProps {
  onNavigate: (view: AppView) => void;
}

const emptyAddress = (fullName = '', email = '', phone = ''): Address => ({
  id: 'checkout-address',
  fullName,
  email,
  phone,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  type: 'residential',
});

const loadRazorpay = () => new Promise<boolean>((resolve) => {
  if (typeof window === 'undefined') return resolve(false);
  if ((window as any).Razorpay) return resolve(true);

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
  const script = existingScript || document.createElement('script');
  if (!existingScript) {
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
  }
  script.addEventListener('load', () => resolve(Boolean((window as any).Razorpay)), { once: true });
  script.addEventListener('error', () => resolve(false), { once: true });
  if (!existingScript) document.body.appendChild(script);
});

export function CheckoutView({ onNavigate }: CheckoutViewProps) {
  const router = useRouter();
  const { cart, clearCart, currentUser, addOrder } = useStore();
  const [shippingAddress, setShippingAddress] = useState<Address>(() => emptyAddress());
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAccessToken, setHasAccessToken] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = 0;
  const totalAmount = subtotal + deliveryFee;

  useEffect(() => {
    setHasAccessToken(Boolean(localStorage.getItem('spaceborn_access_token')));
    const savedAddress = currentUser?.addresses?.find((address) => address.isDefault) || currentUser?.addresses?.[0];
    if (savedAddress) {
      setShippingAddress(savedAddress);
    } else if (currentUser) {
      setShippingAddress((address) => ({
        ...address,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  const updateAddress = (field: keyof Address, value: string) => {
    setShippingAddress((address) => ({ ...address, [field]: value }));
  };

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!localStorage.getItem('spaceborn_access_token')) {
      setErrorMessage('Please sign in with your Spaceborn account before paying.');
      return;
    }
    if (!shippingAddress.fullName.trim() || !shippingAddress.email.trim() || !shippingAddress.phone.trim() ||
        !shippingAddress.addressLine1.trim() || !shippingAddress.city.trim() || !shippingAddress.state.trim() ||
        !/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      setErrorMessage('Enter your contact and shipping details, including a valid 6-digit PIN code.');
      return;
    }
    if (!cart.length) {
      setErrorMessage('Your cart is empty. Add an item before checking out.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Preparing secure Razorpay checkout...');

    try {
      if (!(await loadRazorpay())) {
        throw new Error('Razorpay Checkout did not load. Check your connection and retry.');
      }

      const checkout = await apiRequest<CheckoutOrder>('/payment/checkout-order', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(({ product, quantity }) => ({ sku: product.sku, quantity })),
          shippingAddress,
          discountPercent: 0,
          courierOption: 'delhivery',
        }),
      });

      setProcessingStep('Choose UPI or card in Razorpay Checkout...');
      const paymentResult = await new Promise<RazorpaySuccess>((resolve, reject) => {
        const razorpay = new (window as any).Razorpay({
          key: checkout.keyId,
          amount: checkout.amount,
          currency: checkout.currency,
          name: 'Spaceborn',
          description: 'Robotics components order',
          order_id: checkout.razorpayOrderId,
          prefill: {
            name: shippingAddress.fullName,
            email: shippingAddress.email,
            contact: shippingAddress.phone,
          },
          theme: { color: '#0c831f' },
          method: { upi: true, card: true, netbanking: true, wallet: true },
          handler: resolve,
          modal: { ondismiss: () => reject(new Error('Payment window was closed before payment completed.')) },
        });

        razorpay.on('payment.failed', (response: any) => {
          reject(new Error(response?.error?.description || 'Razorpay could not complete the payment.'));
        });
        razorpay.open();
      });

      setProcessingStep('Verifying your payment securely...');
      const verified = await apiRequest<any>('/payment/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: checkout.orderId,
          razorpayOrderId: paymentResult.razorpay_order_id,
          razorpayPaymentId: paymentResult.razorpay_payment_id,
          razorpaySignature: paymentResult.razorpay_signature,
        }),
      });

      const order: Order = toFrontendOrder(verified);
      order.shippingAddress = shippingAddress;
      order.payment = {
        ...order.payment,
        method: 'Razorpay',
        paymentIntentId: paymentResult.razorpay_order_id,
        transactionId: paymentResult.razorpay_payment_id,
        status: 'succeeded',
        amount: checkout.amount / 100,
        currency: checkout.currency.toLowerCase(),
      };
      order.items = order.items.map((item, index) => ({
        ...item,
        sku: cart[index]?.product.sku || item.sku,
        hsn: cart[index]?.product.hsn || item.hsn,
        image: cart[index]?.product.image || item.image,
      }));

      addOrder(order);
      clearCart();
      router.push('/orders');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to start payment. Please retry.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  if (!cart.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="mb-4 text-xl font-bold">Your cart is empty</h2>
        <button onClick={() => onNavigate('catalog')} className="rounded-lg bg-[#0c831f] px-6 py-2 text-white">Browse Components</button>
      </div>
    );
  }

  const fieldClass = 'mt-1.5 w-full rounded-lg border border-[#f9bf8f]/70 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0c831f] focus:ring-2 focus:ring-[#0c831f]/10';

  return (
    <div className="min-h-screen bg-[#fee9d7] py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 md:flex-row">
        <form onSubmit={handlePayment} className="flex-1 space-y-5 rounded-3xl border border-[#f9bf8f]/60 bg-[#fffbf7] p-6 shadow-sm">
          <button type="button" onClick={() => router.push('/cart')} className="flex items-center gap-2 text-sm font-medium text-[#7a6274] hover:text-[#34222e]">
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </button>
          <h1 className="flex items-center gap-2 text-xl font-bold text-[#34222e]"><Lock className="h-5 w-5 text-[#0c831f]" /> Secure checkout</h1>

          {errorMessage && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage} {!hasAccessToken && <button type="button" className="font-semibold underline" onClick={() => router.push('/auth?mode=login')}>Sign in</button>}</span>
            </div>
          )}

          <div>
            <h2 className="mb-3 font-semibold text-[#34222e]">Contact and delivery details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">Full name<input className={fieldClass} autoComplete="name" required value={shippingAddress.fullName} onChange={(e) => updateAddress('fullName', e.target.value)} /></label>
              <label className="text-sm">Email<input className={fieldClass} autoComplete="email" type="email" required value={shippingAddress.email} onChange={(e) => updateAddress('email', e.target.value)} /></label>
              <label className="text-sm">Phone<input className={fieldClass} autoComplete="tel" type="tel" required value={shippingAddress.phone} onChange={(e) => updateAddress('phone', e.target.value)} /></label>
              <label className="text-sm sm:col-span-2">Address<input className={fieldClass} autoComplete="street-address" required value={shippingAddress.addressLine1} onChange={(e) => updateAddress('addressLine1', e.target.value)} /></label>
              <label className="text-sm">City<input className={fieldClass} autoComplete="address-level2" required value={shippingAddress.city} onChange={(e) => updateAddress('city', e.target.value)} /></label>
              <label className="text-sm">State<input className={fieldClass} autoComplete="address-level1" required value={shippingAddress.state} onChange={(e) => updateAddress('state', e.target.value)} /></label>
              <label className="text-sm">PIN code<input className={fieldClass} autoComplete="postal-code" inputMode="numeric" maxLength={6} required value={shippingAddress.pincode} onChange={(e) => updateAddress('pincode', e.target.value.replace(/\D/g, ''))} /></label>
              <label className="text-sm">Apartment, suite (optional)<input className={fieldClass} value={shippingAddress.addressLine2 || ''} onChange={(e) => updateAddress('addressLine2', e.target.value)} /></label>
            </div>
          </div>

          <div className="rounded-xl border border-[#0c831f]/20 bg-[#f2fcf4] p-4 text-sm text-[#0c831f]">
            <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><p>Pay securely with UPI, card, net banking, or wallet through Razorpay. Payment details are entered on Razorpay and are not stored by Spaceborn.</p></div>
          </div>

          <button type="submit" disabled={isProcessing} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c831f] px-4 py-3 font-bold text-white transition hover:bg-[#096618] disabled:cursor-not-allowed disabled:opacity-60">
            {isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" />{processingStep || 'Processing...'}</> : `Pay ₹${totalAmount.toLocaleString('en-IN')} with UPI or card`}
          </button>
          {!hasAccessToken && <p className="text-center text-xs text-[#7a6274]">Sign in first to place a real order.</p>}
        </form>

        <aside className="h-fit w-full space-y-4 md:w-80">
          <div className="rounded-3xl border border-[#f9bf8f]/60 bg-[#fffbf7] p-5 shadow-sm">
            <h2 className="mb-3 font-bold text-[#34222e]">Order summary</h2>
            <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
              {cart.map((item) => <div key={item.product.id} className="flex justify-between gap-3 text-sm"><span className="truncate text-[#7a6274]">{item.quantity}x {item.product.name}</span><span className="font-semibold">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span></div>)}
            </div>
            <div className="space-y-2 border-t border-[#f9bf8f]/40 pt-3 text-sm">
              <div className="flex justify-between text-[#7a6274]"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-[#7a6274]"><span>Delivery</span><span>{deliveryFee ? `₹${deliveryFee}` : <b className="text-[#0c831f]">FREE</b>}</span></div>
              <div className="flex justify-between border-t border-[#f9bf8f]/40 pt-3 text-lg font-bold"><span>Total pay</span><span>₹{totalAmount.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
