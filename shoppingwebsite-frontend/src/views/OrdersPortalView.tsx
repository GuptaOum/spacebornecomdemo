import React, { useState } from 'react';
import { Order, AppView } from '../types';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Box,
  MapPin,
  Sparkles,
  AlertCircle
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

  // Handle order search
  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.courier.awb.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shippingAddress.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayOrder = selectedOrder || orders[0];

  const stages = [
    { title: 'Payment Authorized', sub: 'Stripe 256-Bit SSL' },
    { title: 'QC Bench Test', sub: 'Waveform & Multimeter' },
    { title: 'ESD Packaging', sub: 'Moisture Barrier Bag' },
    { title: 'Air Cargo Dispatch', sub: 'BlueDart Air Express' },
    { title: 'Out for Delivery', sub: 'Local Hub Courier' },
    { title: 'Consignment Delivered', sub: 'Signature Verified' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* Portal Header */}
        <div className="bg-[#192737] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-[#EF4F12]/20 border border-[#EF4F12]/40 text-orange-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 text-[#EF4F12]" />
                <span>Pan-India Consignment Telemetry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Live Hardware Dispatch & Invoicing Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Track pre-shipment QC testing logs, BlueDart Air cargo telemetry, and download GST E-Invoices for corporate accounting.
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full md:w-80">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Track by SPBN-# or AWB Number..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white placeholder:text-slate-400 outline-none focus:border-[#EF4F12]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Order Telemetry Details Card */}
        {displayOrder && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            
            {/* Telemetry Card Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black text-slate-900 font-mono">
                    Order #{displayOrder.orderNumber}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full capitalize">
                    {displayOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {displayOrder.date} • Invoiced to <strong className="text-slate-800">{displayOrder.gstDetails?.legalName || displayOrder.shippingAddress.companyName || displayOrder.shippingAddress.fullName}</strong>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => onViewInvoice(displayOrder)}
                  className="bg-[#192737] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#EF4F12]" />
                  <span>View GST E-Invoice</span>
                </button>
              </div>
            </div>

            {/* Courier & Waybill Banner */}
            <div className="p-4 bg-orange-50/70 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#EF4F12] text-white flex items-center justify-center font-black">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{displayOrder.courier.provider}</span>
                  <span className="text-slate-600 font-mono">
                    AWB: <strong>{displayOrder.courier.awb}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Hub</span>
                  <span className="font-semibold text-slate-900">{displayOrder.courier.currentLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
                  <span className="font-bold text-emerald-700">{displayOrder.courier.estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* 6-Stage Progress Tracker */}
            <div className="p-6 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-4">
                Fulfillment & Logistics Pipeline
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {stages.map((stage, idx) => {
                  const isDone = idx <= displayOrder.currentStageIndex;
                  const isCurrent = idx === displayOrder.currentStageIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-center transition ${
                        isCurrent 
                          ? 'bg-orange-50 border-[#EF4F12] ring-2 ring-orange-200' 
                          : isDone 
                          ? 'bg-emerald-50/60 border-emerald-200' 
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold mb-2 ${
                        isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{stage.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{stage.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consignment Items & Telemetry Logs Grid */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Items Manifest (6 cols) */}
              <div className="lg:col-span-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Dispatched Component Items ({displayOrder.items.length})
                </span>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {displayOrder.items.map((item, i) => (
                    <div key={i} className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain rounded bg-slate-50 border border-slate-200 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                          <span className="text-[10px] text-slate-500 font-mono">
                            SKU: {item.sku} | HSN: {item.hsn}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 text-xs">
                        <span className="font-bold text-slate-900">Qty: {item.quantity}</span>
                        <span className="block font-mono text-slate-600">₹{item.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between font-bold">
                  <span>Grand Total (Paid via Stripe):</span>
                  <span className="font-mono text-slate-900 text-sm">₹{displayOrder.pricing.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Telemetry Logs (6 cols) */}
              <div className="lg:col-span-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Pre-Shipment Testing & Carrier Log
                </span>

                <div className="space-y-2.5">
                  {displayOrder.telemetryLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs flex items-start space-x-3 ${
                        log.completed ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/70 opacity-70'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h6 className="font-bold text-slate-900">{log.status}</h6>
                          <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#EF4F12]" />
                          <span>{log.location}</span>
                        </p>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                          {log.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Recent Institutional Orders History Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Recent Hardware Orders ({filteredOrders.length})
            </h3>
            <span className="text-xs text-slate-500">
              Instant GST E-Invoice retrieval
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Order ID</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">BlueDart AWB</th>
                  <th className="px-4 py-2.5">Payment</th>
                  <th className="px-4 py-2.5 text-right">Amount</th>
                  <th className="px-4 py-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{order.date}</td>
                    <td className="px-4 py-3 font-mono text-emerald-700 font-semibold">
                      {order.courier.awb}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Stripe Paid</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹{order.pricing.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[#0051d5] hover:underline font-bold text-xs cursor-pointer"
                        >
                          Track Telemetry
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => onViewInvoice(order)}
                          className="text-[#EF4F12] hover:underline font-bold text-xs cursor-pointer"
                        >
                          GST Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
