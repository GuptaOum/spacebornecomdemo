import React, { useState, useEffect } from 'react';
import { CartItem, Address, GstDetails, Order, UserProfile } from '../types';
import { apiRequest } from '../lib/api';
import { 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Loader2, 
  ChevronRight,
  User
} from 'lucide-react';

interface CheckoutViewProps {
  cart: CartItem[];
  gstDetails: GstDetails;
  discountPercent: number;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onPaymentSuccess: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  gstDetails,
  discountPercent,
  currentUser,
  onOpenAuth,
  onPaymentSuccess,
  onBackToCart,
}) => {
  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState<Address>(() => {
    if (currentUser?.addresses && currentUser.addresses.length > 0) {
      return currentUser.addresses[0];
    }
    return {
      id: 'addr-1',
      fullName: currentUser?.fullName || 'Vikram Joshi',
      companyName: currentUser?.companyName || 'Apex Robotics Labs LLP',
      email: currentUser?.email || 'vikram.j@apexrobotics.io',
      phone: currentUser?.phone || '+91 98450 82194',
      addressLine1: 'Plot 42, Electronic City Phase 1',
      addressLine2: 'Hardware Incubation Tech Park, Block C-3',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      type: 'business',
      isDefault: true
    };
  });

  // Sync shipping address when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const defaultAddr = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
        setShippingAddress(defaultAddr);
      } else {
        setShippingAddress(prev => ({
          ...prev,
          fullName: currentUser.fullName,
          companyName: currentUser.companyName || prev.companyName,
          email: currentUser.email,
          phone: currentUser.phone
        }));
      }
    }
  }, [currentUser]);

  const [courierOption, setCourierOption] = useState<'bluedart' | 'delhivery'>('bluedart');

  // Razorpay hosted checkout state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate pricing
  const totalGrossAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (totalGrossAmount * discountPercent) / 100;
  const netAmount = totalGrossAmount - discountAmount;
  const shippingCost = courierOption === 'bluedart' ? (totalGrossAmount >= 999 ? 0 : 90) : 0;
  const grandTotal = netAmount + shippingCost;
  const taxableBase = netAmount / 1.18;
  const gstAmount = netAmount - taxableBase;

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  // Razorpay hosts the payment form. The backend signature verification is
  // required before the app records an order as paid.
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);
    setProcessingStep('Preparing secure Razorpay checkout...');

    try {
      if (!localStorage.getItem('spaceborn_access_token')) {
        onOpenAuth?.('login');
        throw new Error('Please sign in to place a real order. Demo sessions cannot be charged.');
      }
      if (!(await loadRazorpay())) throw new Error('Razorpay Checkout could not load. Check your connection and retry.');

      const checkout = await apiRequest<{ orderId: string; razorpayOrderId: string; amount: number; currency: string; keyId: string }>(
        '/payment/checkout-order',
        { method: 'POST', body: JSON.stringify({
          items: cart.map(({ product, quantity }) => ({ sku: product.sku, quantity })),
          shippingAddress,
          discountPercent,
          courierOption,
        }) }
      );
      setProcessingStep('Choose UPI or card in Razorpay Checkout...');

      const options = {
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: 'Spaceborn',
        description: 'Robotics components order',
        order_id: checkout.razorpayOrderId,
        prefill: { name: shippingAddress.fullName, email: shippingAddress.email, contact: shippingAddress.phone },
        theme: { color: '#EF4F12' },
        method: { upi: true, card: true, netbanking: true, wallet: true },
        modal: { ondismiss: () => { setIsProcessing(false); setProcessingStep(''); } },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            setProcessingStep('Verifying payment securely...');
            await apiRequest('/payment/verify', { method: 'POST', body: JSON.stringify({
              orderId: checkout.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }) });

            const orderNumber = `SPBN-${checkout.orderId.slice(-6).toUpperCase()}`;
            const awb = `BD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-IN`;
            const newOrder: Order = {
              id: checkout.orderId, orderNumber,
              date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
              status: 'placed', currentStageIndex: 0,
              courier: { provider: courierOption === 'bluedart' ? 'BlueDart Apex Express' : 'Delhivery Surface Cargo', awb, trackingUrl: `https://bluedart.com/track/${awb}`, estimatedDelivery: courierOption === 'bluedart' ? 'Tomorrow by 11:30 AM' : 'Within 3-4 Business Days', currentLocation: 'Spaceborn Mega Fulfillment & QC Hub, Chakan, Pune' },
              shippingAddress, gstDetails: gstDetails.enabled ? gstDetails : undefined,
              items: cart.map(item => {
                const total = item.unitPrice * item.quantity;
                const taxable = total / 1.18;
                return { productId: item.product.id, name: item.product.name, sku: item.product.sku, hsn: item.product.hsn, quantity: item.quantity, unitPrice: item.unitPrice, taxableAmount: Number(taxable.toFixed(2)), gstAmount: Number((total - taxable).toFixed(2)), total, image: item.product.image };
              }),
              payment: { method: 'Razorpay', paymentIntentId: response.razorpay_order_id, transactionId: response.razorpay_payment_id, status: 'succeeded', amount: checkout.amount / 100, currency: checkout.currency.toLowerCase() },
              pricing: { subtotalTaxable: Number(taxableBase.toFixed(2)), igst: Number(gstAmount.toFixed(2)), cgst: 0, sgst: 0, discount: Number(discountAmount.toFixed(2)), shipping: shippingCost, grandTotal: checkout.amount / 100 },
              telemetryLogs: [
                { timestamp: 'Just Now', status: 'Payment Succeeded via Razorpay', location: 'Razorpay Gateway', notes: `Payment ${response.razorpay_payment_id} verified by server.`, completed: true },
                { timestamp: 'Pending', status: 'QC Bench Inspection & Waveform Verification', location: 'Spaceborn Fulfillment QC Laboratory', notes: 'Component batch scheduled for digital multimeter and encoder quadrature test.', completed: false },
              ],
            };
            setIsProcessing(false);
            onPaymentSuccess(newOrder);
          } catch (error: any) {
            setIsProcessing(false);
            setErrorMessage(error.message || 'Payment could not be verified. Contact support before retrying.');
          }
        },
      };
      new (window as any).Razorpay(options).open();
    } catch (error: any) {
      setIsProcessing(false);
      setErrorMessage(error.message || 'Could not start payment. Please retry.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Back Link & Stepper Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToCart}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-[#EF4F12] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Cart</span>
          </button>

          {/* Stepper */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold">1. Cart Review</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-400 font-semibold">2. Shipping & GSTIN</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[#EF4F12] font-black flex items-center space-x-1">
              <span className="w-5 h-5 rounded-full bg-[#EF4F12] text-white flex items-center justify-center text-[10px]">3</span>
              <span>Stripe Payment & Invoice</span>
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Shipping & Payment Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Account Sign-In / User Status Banner */}
            {!currentUser ? (
              <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent p-4 rounded-xl border border-orange-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#EF4F12] text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Have a Spaceborn Maker or B2B Account?</h4>
                    <p className="text-[11px] text-slate-600">Sign in to auto-populate your saved lab addresses and claim 18% Input Tax Credit.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  className="px-3 py-1.5 bg-[#EF4F12] hover:bg-[#d4430e] text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer shadow-xs"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Authenticated as <strong>{currentUser.fullName}</strong> ({currentUser.accountType === 'business' ? 'B2B Enterprise' : 'Maker Pro'})
                  </span>
                </div>
                {currentUser.addresses && currentUser.addresses.length > 1 && (
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-slate-500">Saved Addr:</span>
                    <select
                      value={shippingAddress.id}
                      onChange={(e) => {
                        const sel = currentUser.addresses.find(a => a.id === e.target.value);
                        if (sel) setShippingAddress(sel);
                      }}
                      className="text-[11px] font-semibold bg-white border border-slate-300 rounded px-2 py-1 outline-none"
                    >
                      {currentUser.addresses.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.fullName} - {a.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 2 Review: Delivery Location & Courier */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-[#EF4F12]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    Institutional Delivery Location
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Address
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">{shippingAddress.companyName || shippingAddress.fullName} — {shippingAddress.fullName}</p>
                <p>{shippingAddress.addressLine1}{shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} - <strong className="font-mono">{shippingAddress.pincode}</strong></p>
                <p className="text-slate-500 font-mono">Contact: {shippingAddress.phone} | {shippingAddress.email}</p>
              </div>

              {/* Courier Selection */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block mb-2">Select Dispatch Priority:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setCourierOption('bluedart')}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                      courierOption === 'bluedart' ? 'bg-orange-50/70 border-[#EF4F12] ring-1 ring-orange-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#EF4F12] mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">BlueDart Air Apex Express</span>
                      <span className="text-slate-500 text-[11px]">Priority 24-48h Delivery</span>
                      <span className="text-emerald-700 font-bold block mt-0.5">
                        {totalGrossAmount >= 999 ? 'FREE (Unlocked)' : '₹90.00'}
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setCourierOption('delhivery')}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                      courierOption === 'delhivery' ? 'bg-orange-50/70 border-[#EF4F12] ring-1 ring-orange-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Delhivery Surface Cargo</span>
                      <span className="text-slate-500 text-[11px]">Standard 3-5 Days Transit</span>
                      <span className="text-slate-700 font-bold block mt-0.5">FREE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GSTIN badge if active */}
              {gstDetails.enabled && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Invoiced To: <strong className="font-mono">{gstDetails.gstin}</strong> ({gstDetails.legalName})</span>
                  </div>
                  <span className="font-bold">18% ITC Cleared</span>
                </div>
              )}
            </div>

            {/* Step 3: Razorpay hosted payment methods */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#EF4F12]" />
                  <h2 className="text-sm sm:text-base font-black text-slate-900">Secure payment</h2>
                </div>
                <span className="text-xs font-black text-blue-700">Razorpay</span>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                Pay securely using UPI, credit or debit card, net banking, or wallet. Payment details are entered in Razorpay Checkout and are never stored by this site.
              </div>
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{errorMessage}</span>
                </div>
              )}
              {isProcessing && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#EF4F12]"><Loader2 className="w-4 h-4 animate-spin" /><span>Preparing payment...</span></div>
                  <p className="text-[11px] text-slate-600">{processingStep}</p>
                </div>
              )}
              <form onSubmit={handleProcessPayment}>
                <button type="submit" disabled={isProcessing} className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${isProcessing ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-[#EF4F12] hover:bg-[#d44000] text-white shadow-orange-500/25 cursor-pointer'}`}>
                  {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Continue in Razorpay...</span></> : <><Lock className="w-4 h-4" /><span>Pay INR {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} with UPI or card</span></>}
                </button>
              </form>
              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /><span>Payment is confirmed by our server before order success.</span></div>
            </div>
          </div>

          {/* Right Column: Order Manifest & Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Consignment Manifest
              </h3>

              {/* Items List mini table */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Qty: {item.quantity} × ₹{item.unitPrice}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Taxable Breakdown */}
              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Taxable Base Value:</span>
                  <span className="font-mono font-semibold">₹{taxableBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>18% IGST / CGST+SGST:</span>
                  <span className="font-mono font-semibold text-blue-700">₹{gstAmount.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Air Express Shipping:</span>
                  <span className={`font-mono font-bold ${shippingCost === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}.00`}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm font-black text-slate-900">
                  <span>Total Amount (Payable):</span>
                  <span className="text-xl text-[#192737] font-mono">
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Assurance Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Immediate Order Fulfillment</span>
                </div>
                <p>
                  Upon payment clearance, your components move instantly to our QC bench for multimeter & encoder wave testing before air dispatch.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
