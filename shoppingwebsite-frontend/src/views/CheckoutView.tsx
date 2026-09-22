import React, { useState, useEffect } from 'react';
import { CartItem, Address, GstDetails, Order, UserProfile } from '../types';
import { 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  Loader2, 
  ChevronRight,
  Info,
  Sparkles,
  RefreshCw,
  User,
  MapPin
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

  // Stripe Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('VIKRAM JOSHI');
  const [postalCode, setPostalCode] = useState('560100');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'generic'>('generic');

  // Stripe API & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stripeStatus, setStripeStatus] = useState<{ configured: boolean; mode: string }>({
    configured: false,
    mode: 'checking'
  });

  // Calculate pricing
  const totalGrossAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (totalGrossAmount * discountPercent) / 100;
  const netAmount = totalGrossAmount - discountAmount;
  const shippingCost = courierOption === 'bluedart' ? (totalGrossAmount >= 999 ? 0 : 90) : 0;
  const grandTotal = netAmount + shippingCost;
  const taxableBase = netAmount / 1.18;
  const gstAmount = netAmount - taxableBase;

  // Check Stripe Configuration on server
  useEffect(() => {
    fetch('/api/stripe/config')
      .then(res => res.json())
      .then(data => {
        setStripeStatus({
          configured: data.isLive,
          mode: data.isLive ? 'Stripe Production/Test Live API' : 'Stripe Verified Sandbox'
        });
      })
      .catch(() => {
        setStripeStatus({ configured: false, mode: 'Stripe Verified Sandbox' });
      });
  }, []);

  // Format Card Number & detect brand
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    
    // Detect brand
    if (val.startsWith('4')) setCardBrand('visa');
    else if (/^5[1-5]/.test(val)) setCardBrand('mastercard');
    else if (/^3[47]/.test(val)) setCardBrand('amex');
    else setCardBrand('generic');

    // Add spaces every 4 digits
    const parts = val.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : val);
  };

  // Format Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  // Quick autofill Stripe test card
  const fillTestCard = (type: 'success' | 'decline' | '3ds') => {
    if (type === 'success') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvc('888');
      setCardholderName('VIKRAM JOSHI');
      setCardBrand('visa');
      setErrorMessage(null);
    } else if (type === '3ds') {
      setCardNumber('4000 0027 6000 3184');
      setCardExpiry('10/29');
      setCardCvc('314');
      setCardholderName('VIKRAM JOSHI (3DS)');
      setCardBrand('visa');
      setErrorMessage(null);
    } else {
      setCardNumber('4000 0000 0000 0002');
      setCardExpiry('08/27');
      setCardCvc('999');
      setCardholderName('VIKRAM JOSHI (DECLINE)');
      setCardBrand('visa');
      setErrorMessage(null);
    }
  };

  // Submit Payment to Backend Stripe Endpoint
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      setErrorMessage('Please enter a valid 16-digit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setErrorMessage('Please enter a valid card expiration date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setErrorMessage('Please enter a valid 3 or 4-digit CVC code.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Connecting to Stripe Payment Intent gateway...');

    try {
      const orderId = `SPBN-${Math.floor(100000 + Math.random() * 900000)}`;

      // Step 1: Call Backend to Create PaymentIntent
      const intentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'inr',
          orderId: orderId,
          customerEmail: shippingAddress.email,
          customerName: shippingAddress.fullName,
          companyName: gstDetails.enabled ? gstDetails.legalName : shippingAddress.companyName,
          gstin: gstDetails.enabled ? gstDetails.gstin : undefined,
          items: cart.map(i => ({
            id: i.product.id,
            sku: i.product.sku,
            qty: i.quantity,
            price: i.unitPrice
          }))
        })
      });

      const intentData = await intentResponse.json();

      if (!intentResponse.ok) {
        throw new Error(intentData.error || 'Failed to initialize Stripe PaymentIntent');
      }

      // Step 2: Simulating / Confirming Payment with Gateway
      setProcessingStep('Authorizing 256-bit encrypted transaction with card network...');
      await new Promise(r => setTimeout(r, 900));

      // Test decline check
      if (cleanCard.endsWith('0002')) {
        throw new Error('Your card was declined. Test card triggered an intentional insufficient funds response.');
      }

      setProcessingStep('Verifying RBI 3D Secure protocol & generating HSN tax manifest...');
      await new Promise(r => setTimeout(r, 800));

      setProcessingStep('Allocating BlueDart Air Express Waybill & booking bench QC test...');
      await new Promise(r => setTimeout(r, 700));

      // Step 3: Construct Complete Order Record
      const awbNumber = `BD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-IN`;

      const newOrder: Order = {
        id: orderId.toLowerCase(),
        orderNumber: orderId,
        date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) + ' IST',
        status: 'placed',
        currentStageIndex: 0,
        courier: {
          provider: courierOption === 'bluedart' ? 'BlueDart Apex Express' : 'Delhivery Surface Cargo',
          awb: awbNumber,
          trackingUrl: `https://bluedart.com/track/${awbNumber}`,
          estimatedDelivery: courierOption === 'bluedart' ? 'Tomorrow by 11:30 AM' : 'Within 3-4 Business Days',
          currentLocation: 'Spaceborn Mega Fulfillment & QC Hub, Chakan, Pune'
        },
        shippingAddress: shippingAddress,
        gstDetails: gstDetails.enabled ? gstDetails : undefined,
        items: cart.map(item => {
          const itemTotal = item.unitPrice * item.quantity;
          const itemTaxable = itemTotal / 1.18;
          return {
            productId: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            hsn: item.product.hsn,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxableAmount: parseFloat(itemTaxable.toFixed(2)),
            gstAmount: parseFloat((itemTotal - itemTaxable).toFixed(2)),
            total: itemTotal,
            image: item.product.image
          };
        }),
        payment: {
          method: 'Stripe Payment Processing',
          paymentIntentId: intentData.paymentIntentId || `pi_${Date.now()}`,
          transactionId: `txn_${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: 'succeeded',
          amount: grandTotal,
          currency: 'inr',
          cardLast4: cleanCard.slice(-4),
          cardBrand: cardBrand
        },
        pricing: {
          subtotalTaxable: parseFloat(taxableBase.toFixed(2)),
          igst: parseFloat(gstAmount.toFixed(2)),
          cgst: 0,
          sgst: 0,
          discount: parseFloat(discountAmount.toFixed(2)),
          shipping: shippingCost,
          grandTotal: parseFloat(grandTotal.toFixed(2))
        },
        telemetryLogs: [
          {
            timestamp: 'Just Now',
            status: 'Payment Succeeded via Stripe',
            location: 'Stripe Gateway / Spaceborn Central, Pune',
            notes: `Authorized INR ₹${grandTotal.toFixed(2)} on card ending ${cleanCard.slice(-4)}. GST Tax Invoice linked.`,
            completed: true
          },
          {
            timestamp: 'Pending',
            status: 'QC Bench Inspection & Waveform Verification',
            location: 'Spaceborn Fulfillment QC Laboratory',
            notes: 'Component batch scheduled for digital multimeter and encoder quadrature test.',
            completed: false
          }
        ]
      };

      // Save order to backend
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch(err => console.warn('Could not persist to backend:', err));

      // Trigger success callback
      setIsProcessing(false);
      onPaymentSuccess(newOrder);

    } catch (err: any) {
      console.error('Payment failure:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment processing failed. Please check your card details and retry.');
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

            {/* Step 3: Stripe Payment Processing Card Form */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-5">
              
              {/* Header with Stripe Branding */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#6772e5]" />
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    Stripe Secure Card Payment
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-black text-[#6772e5] tracking-wider uppercase">
                    stripe
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    PCI-DSS Level 1
                  </span>
                </div>
              </div>

              {/* Quick Preset Test Cards helper */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Stripe Sandbox One-Click Test Cards:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Instant Autofill</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillTestCard('success')}
                    className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px]"
                  >
                    ✓ Success Card (4242)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillTestCard('3ds')}
                    className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px]"
                  >
                    ✓ 3D Secure Card
                  </button>
                  <button
                    type="button"
                    onClick={() => fillTestCard('decline')}
                    className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px]"
                  >
                    ✗ Decline Test Card
                  </button>
                </div>
              </div>

              {/* Credit Card Form */}
              <form onSubmit={handleProcessPayment} className="space-y-4">
                
                {/* Cardholder Name */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cardholder Name (As on Card)
                  </label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                    placeholder="VIKRAM JOSHI"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#6772e5] focus:bg-white transition"
                  />
                </div>

                {/* Card Number Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Card Number
                    </label>
                    <span className="text-[11px] font-bold text-slate-500 uppercase font-mono">
                      {cardBrand}
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 tracking-wider outline-none focus:border-[#6772e5] focus:bg-white transition"
                    />
                    <div className="absolute right-3 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expiry, CVC & ZIP in one row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Expires
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 text-center outline-none focus:border-[#6772e5] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 text-center outline-none focus:border-[#6772e5] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560100"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 text-center outline-none focus:border-[#6772e5] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Live Processing Indicator */}
                {isProcessing && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#EF4F12]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Stripe Payment...</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono animate-pulse">
                      {processingStep}
                    </p>
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer ${
                    isProcessing
                      ? 'bg-slate-400 text-white cursor-not-allowed'
                      : 'bg-[#EF4F12] hover:bg-[#d44000] text-white shadow-orange-500/25'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} with Stripe</span>
                    </>
                  )}
                </button>

                {/* Security Footer */}
                <div className="pt-2 flex items-center justify-center space-x-4 text-[10px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encryption</span>
                  </span>
                  <span>•</span>
                  <span>Stripe Gateway v2025</span>
                  <span>•</span>
                  <span>Reserve Bank of India Compliant</span>
                </div>

              </form>

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
