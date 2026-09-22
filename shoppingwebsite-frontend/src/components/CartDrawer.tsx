import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxableSubtotal = (totalAmount / 1.18);
  const gstAmount = totalAmount - taxableSubtotal;

  const FREE_SHIPPING_THRESHOLD = 999;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);
  const progressPercent = Math.min(100, Math.round((totalAmount / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 bg-[#192737] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#EF4F12]" />
              <h2 className="text-base font-bold">Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="p-3.5 bg-orange-50/70 border-b border-orange-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-[#EF4F12]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">You've unlocked FREE Air Express Delivery!</span>
                ) : (
                  <span>Add <strong className="text-[#EF4F12]">₹{amountNeededForFreeShipping.toFixed(0)}</strong> for FREE Shipping</span>
                )}
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#EF4F12] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Your cart is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore high-precision motors, sensors, microcontrollers, and robotics kits in our technical store.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center px-4 py-2 bg-[#192737] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Browse Electronics Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = item.unitPrice * item.quantity;
                return (
                  <div key={item.product.id} className="pt-3 flex gap-3 items-start">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        SKU: {item.product.sku}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-200 rounded bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-7 h-6 flex items-center justify-center text-xs font-bold bg-white border-x border-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900">
                            ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                          <p className="text-[10px] text-slate-400">
                            @ ₹{item.unitPrice}/pc
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout CTAs */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              {/* GST Tax notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <span className="text-blue-900 font-medium">Eligible for 18% Input Tax Credit</span>
                <span className="font-mono font-bold text-blue-800">₹{gstAmount.toFixed(2)}</span>
              </div>

              {/* Subtotals */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Taxable Base Value:</span>
                  <span className="font-mono font-semibold">₹{taxableSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IGST / CGST+SGST (18%):</span>
                  <span className="font-mono font-semibold">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Air Shipping:</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {amountNeededForFreeShipping === 0 ? 'FREE' : '₹90.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Grand Total (Incl. GST):</span>
                  <span className="text-[#192737] font-mono text-base">
                    ₹{(totalAmount + (amountNeededForFreeShipping === 0 ? 0 : 90)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full bg-[#EF4F12] hover:bg-[#d44000] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Stripe Checkout</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onProceedToCart();
                  }}
                  className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <span>Review Cart & GST Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stripe 256-Bit SSL Encrypted</span>
                </span>
                <span>•</span>
                <span>GST Compliant Invoicing</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
