import React, { useState } from 'react';
import { Order, AppView } from '../types';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Box,
  MapPin,
  ChevronRight,
  ExternalLink,
  Package,
  Headphones,
  Check
} from 'lucide-react';

interface OrdersPortalViewProps {
  orders: Order[];
  onViewInvoice: (order: Order) => void;
  onNavigate: (view: AppView) => void;
}

export const OrdersPortalView: React.FC<OrdersPortalViewProps> = ({
  orders,
  onViewInvoice,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0]);

  // Filter orders by order number, AWB, or item name
  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.courier.awb.toLowerCase().includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
    );
  });

  const displayOrder = selectedOrder || filteredOrders[0] || orders[0];

  // 4 Simple, intuitive progress steps like Blinkit / Swiggy
  const trackingSteps = [
    { title: 'Order Placed', desc: 'Payment verified' },
    { title: 'Packed & Tested', desc: 'QC passed' },
    { title: 'Out for Delivery', desc: 'Express courier' },
    { title: 'Delivered', desc: 'Direct to lab/door' },
  ];

  // Map internal stage index (0..4) to 4-step progress
  const getStepState = (stepIndex: number, currentStage: number) => {
    if (currentStage >= 4) return 'completed'; // delivered
    if (stepIndex === 0) return 'completed';
    if (stepIndex === 1 && currentStage >= 1) return 'completed';
    if (stepIndex === 2 && currentStage >= 3) return 'active';
    if (stepIndex === 2 && currentStage >= 2) return 'completed';
    if (stepIndex === 3 && currentStage >= 4) return 'completed';
    if (stepIndex === 1 && currentStage === 0) return 'active';
    if (stepIndex === 2 && currentStage < 3) return 'pending';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-[#fee9d7] text-[#34222e] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-[#7a6274]">
          <span 
            onClick={() => onNavigate('home')} 
            className="hover:text-[#e2434b] cursor-pointer"
          >
            Home
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#7a6274]" />
          <span className="font-bold text-[#34222e]">My Orders</span>
        </div>

        {/* Clean Header Bar */}
        <div className="bg-[#fffbf7] rounded-3xl border border-[#f9bf8f]/60 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0c831f] mb-1">
              <span>⚡ Fast 10-15 Min Local Dispatch</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#34222e]">
              Orders & Deliveries
            </h1>
            <p className="text-xs text-[#7a6274] mt-1 max-w-xl">
              Track live component shipments, view items list, and download official GST tax invoices for business accounts.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#7a6274] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by SPBN-# or item..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#f9bf8f]/70 rounded-2xl text-xs font-medium text-[#34222e] placeholder:text-[#7a6274]/70 outline-none focus:border-[#0c831f] focus:ring-1 focus:ring-[#0c831f] transition shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        {filteredOrders.length === 0 ? (
          <div className="bg-[#fffbf7] rounded-3xl border border-[#f9bf8f]/60 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#fee9d7] mx-auto flex items-center justify-center text-[#e2434b]">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#34222e]">No matching orders found</h3>
            <p className="text-xs text-[#7a6274] max-w-sm mx-auto">
              We couldn't find any orders matching "{searchQuery}". Check the order number or browse our component catalog.
            </p>
            <button
              onClick={() => { setSearchQuery(''); onNavigate('catalog'); }}
              className="mt-2 inline-flex items-center px-5 py-2.5 bg-[#0c831f] hover:bg-[#0a6e1a] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              Browse Hardware Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Active Order Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {displayOrder && (
                <div className="bg-[#fffbf7] rounded-3xl border border-[#f9bf8f]/60 overflow-hidden shadow-xs">
                  
                  {/* Order Top Banner */}
                  <div className="p-5 sm:p-6 bg-white border-b border-[#f9bf8f]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                        <span className="text-base sm:text-lg font-black font-mono text-[#34222e]">
                          {displayOrder.orderNumber}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          displayOrder.status === 'delivered'
                            ? 'bg-[#f2fcf4] text-[#0c831f] border border-[#0c831f]/20'
                            : 'bg-[#fee9d7] text-[#e2434b] border border-[#f9bf8f]'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{displayOrder.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#7a6274] mt-1">
                        Placed on {displayOrder.date} • {displayOrder.items.length} items
                      </p>
                    </div>

                    {/* Invoice CTA */}
                    <button
                      onClick={() => onViewInvoice(displayOrder)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#fee9d7]/70 hover:bg-[#fee9d7] text-[#34222e] border border-[#f9bf8f]/80 transition cursor-pointer self-start sm:self-auto shadow-xs active:scale-95"
                    >
                      <FileText className="w-4 h-4 text-[#e2434b]" />
                      <span>Download GST Invoice</span>
                    </button>
                  </div>

                  {/* Delivery Status & ETA Strip */}
                  <div className="p-4 sm:p-5 bg-[#f2fcf4] border-b border-[#0c831f]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#0c831f] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-[#0c831f]">
                            {displayOrder.status === 'delivered' ? 'Delivered' : 'Estimated Delivery:'}
                          </span>
                          <span className="font-black text-[#34222e]">
                            {displayOrder.courier.estimatedDelivery}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7a6274] mt-0.5">
                          {displayOrder.courier.provider} • Waybill: <strong className="font-mono text-[#34222e]">{displayOrder.courier.awb}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-[#7a6274] uppercase font-bold block">Current Location</span>
                      <span className="font-semibold text-[#34222e] text-xs">
                        {displayOrder.courier.currentLocation}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Minimalist Progress Indicator */}
                  <div className="p-6 border-b border-[#f9bf8f]/40">
                    <h3 className="text-xs font-bold text-[#7a6274] uppercase tracking-wider mb-4">
                      Delivery Progress
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                      {trackingSteps.map((step, idx) => {
                        const state = getStepState(idx, displayOrder.currentStageIndex);
                        const isDone = state === 'completed';
                        const isActive = state === 'active';
                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-2xl border text-center transition-all ${
                              isActive
                                ? 'bg-white border-[#0c831f] ring-2 ring-[#0c831f]/20 shadow-xs'
                                : isDone
                                ? 'bg-[#f2fcf4] border-[#0c831f]/30'
                                : 'bg-white/60 border-[#f9bf8f]/40 opacity-60'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-2 transition-colors ${
                              isDone 
                                ? 'bg-[#0c831f] text-white' 
                                : isActive 
                                ? 'bg-[#e2434b] text-white animate-pulse' 
                                : 'bg-[#fee9d7] text-[#7a6274]'
                            }`}>
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                            </div>
                            <h4 className="text-xs font-bold text-[#34222e]">{step.title}</h4>
                            <p className="text-[10px] text-[#7a6274] mt-0.5">{step.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dispatched Items List */}
                  <div className="p-6 space-y-4 border-b border-[#f9bf8f]/40">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-[#7a6274] uppercase tracking-wider">
                        Components in this Order ({displayOrder.items.length})
                      </h3>
                      <span className="text-xs text-[#0c831f] font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>100% QC Passed</span>
                      </span>
                    </div>

                    <div className="divide-y divide-[#f9bf8f]/30 border border-[#f9bf8f]/40 rounded-2xl overflow-hidden bg-white">
                      {displayOrder.items.map((item, i) => (
                        <div key={i} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#fee9d7]/20 transition">
                          <div className="flex items-center space-x-3.5 min-w-0">
                            <div className="w-13 h-13 rounded-xl bg-white border border-[#f9bf8f]/40 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-[#34222e] truncate">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-[#7a6274] font-mono mt-0.5">
                                SKU: {item.sku} • HSN: {item.hsn}
                              </p>
                              <span className="inline-block mt-1 text-[10px] font-bold text-[#0c831f] bg-[#f2fcf4] px-2 py-0.5 rounded border border-[#0c831f]/20">
                                Qty: {item.quantity} pcs
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-black text-[#34222e] block">
                              ₹{item.total.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-[#7a6274] font-mono block">
                              ₹{item.unitPrice}/pc
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address, Payment & Total Breakdown */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50">
                    
                    {/* Shipping Address */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#7a6274] uppercase tracking-wider block">
                        Delivery Address
                      </span>
                      <div className="bg-white p-4 rounded-2xl border border-[#f9bf8f]/40 text-xs text-[#34222e] space-y-1 shadow-xs">
                        <strong className="block font-bold text-[#34222e] text-sm">
                          {displayOrder.shippingAddress.fullName}
                        </strong>
                        {displayOrder.shippingAddress.companyName && (
                          <p className="font-semibold text-[#e2434b] text-[11px]">
                            {displayOrder.shippingAddress.companyName}
                          </p>
                        )}
                        <p className="text-[#7a6274]">
                          {displayOrder.shippingAddress.addressLine1}
                          {displayOrder.shippingAddress.addressLine2 ? `, ${displayOrder.shippingAddress.addressLine2}` : ''}
                        </p>
                        <p className="text-[#7a6274]">
                          {displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.state} - {displayOrder.shippingAddress.pincode}
                        </p>
                        <p className="text-[11px] text-[#7a6274] pt-1">
                          Phone: <strong className="text-[#34222e]">{displayOrder.shippingAddress.phone}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Payment & Price Summary */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#7a6274] uppercase tracking-wider block">
                        Payment & Bill Summary
                      </span>
                      <div className="bg-white p-4 rounded-2xl border border-[#f9bf8f]/40 text-xs space-y-2 shadow-xs">
                        <div className="flex justify-between text-[#7a6274]">
                          <span>Payment Method:</span>
                          <span className="font-bold text-[#34222e] flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#0c831f]"></span>
                            <span>{displayOrder.payment.method}</span>
                          </span>
                        </div>
                        <div className="flex justify-between text-[#7a6274]">
                          <span>Taxable Value:</span>
                          <span className="font-mono text-[#34222e]">₹{displayOrder.pricing.subtotalTaxable.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#7a6274]">
                          <span>GST (18% ITC Eligible):</span>
                          <span className="font-mono text-[#34222e]">
                            ₹{(displayOrder.pricing.igst || (displayOrder.pricing.cgst + displayOrder.pricing.sgst)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#7a6274]">
                          <span>Express Local Delivery:</span>
                          <span className="font-bold text-[#0c831f]">FREE (10-15 Min)</span>
                        </div>
                        <div className="pt-2 border-t border-[#f9bf8f]/40 flex justify-between items-baseline font-bold text-[#34222e]">
                          <span className="text-xs">Total Amount Paid:</span>
                          <span className="text-base font-black text-[#0c831f] font-mono">
                            ₹{displayOrder.pricing.grandTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Delivery Updates Timeline */}
                  {displayOrder.telemetryLogs && displayOrder.telemetryLogs.length > 0 && (
                    <div className="p-6 border-t border-[#f9bf8f]/40 bg-white">
                      <h3 className="text-xs font-bold text-[#7a6274] uppercase tracking-wider mb-3">
                        Delivery Activity & Status Updates
                      </h3>

                      <div className="space-y-3">
                        {displayOrder.telemetryLogs.map((log, i) => (
                          <div 
                            key={i} 
                            className={`p-3 rounded-2xl border text-xs flex items-start gap-3 transition ${
                              log.completed ? 'bg-[#f2fcf4]/50 border-[#0c831f]/20' : 'bg-white border-[#f9bf8f]/40 opacity-70'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              log.completed ? 'bg-[#0c831f] text-white' : 'bg-[#fee9d7] text-[#7a6274]'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-[#34222e]">{log.status}</h4>
                                <span className="text-[10px] text-[#7a6274] font-mono shrink-0">{log.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-[#7a6274] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-[#e2434b]" />
                                <span>{log.location}</span>
                              </p>
                              {log.notes && (
                                <p className="text-[#34222e]/80 mt-1 text-[11px]">
                                  {log.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Right Column: Order History Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Order List Card */}
              <div className="bg-[#fffbf7] rounded-3xl border border-[#f9bf8f]/60 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f9bf8f]/40">
                  <h3 className="text-xs font-bold text-[#34222e] uppercase tracking-wider">
                    All Orders ({filteredOrders.length})
                  </h3>
                  <span className="text-[11px] text-[#7a6274]">
                    Click to track
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredOrders.map(order => {
                    const isSelected = order.id === displayOrder?.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#0c831f] shadow-sm ring-2 ring-[#0c831f]/20'
                            : 'bg-white/70 border-[#f9bf8f]/50 hover:bg-white hover:border-[#0c831f]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-[#34222e]">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            order.status === 'delivered'
                              ? 'bg-[#f2fcf4] text-[#0c831f]'
                              : 'bg-[#fee9d7] text-[#e2434b]'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#7a6274]">
                          {order.date} • {order.items.length} items
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-[#f9bf8f]/30 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#34222e]">
                            ₹{order.pricing.grandTotal.toFixed(0)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewInvoice(order);
                            }}
                            className="text-[#e2434b] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-[#fffbf7] rounded-3xl border border-[#f9bf8f]/60 p-5 shadow-xs space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#f2fcf4] text-[#0c831f] flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#34222e]">Need Assistance?</h4>
                    <p className="text-[11px] text-[#7a6274]">Hardware support & easy returns</p>
                  </div>
                </div>
                <p className="text-xs text-[#7a6274] leading-relaxed">
                  Have a question about component specifications, pinouts, or damaged transit package? Our engineering team assists within minutes.
                </p>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-2 bg-white hover:bg-[#fee9d7] border border-[#f9bf8f] text-[#34222e] rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  Contact Support
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
