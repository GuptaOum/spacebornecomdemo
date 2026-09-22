import React, { useState } from 'react';
import { Product, AppView } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { 
  Cpu, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  Truck, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
  onQuickView: (p: Product) => void;
  onNavigate: (view: AppView) => void;
  onSelectCategory: (cat: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onQuickView,
  onNavigate,
  onSelectCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'motors' | 'iot' | 'kits' | 'tools'>('all');

  // Filter products for tabbed section
  const tabbedProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'motors') return p.category === 'Motors & Drivers';
    if (activeTab === 'iot') return p.category === 'Development Boards' || p.category === 'Sensors & Modules';
    if (activeTab === 'kits') return p.category === 'DIY Kits' || p.category === 'Robotics & Mechanical';
    if (activeTab === 'tools') return p.category === 'Tools & Soldering' || p.category === 'Components';
    return true;
  }).slice(0, 8);

  const featuredMotor = products.find(p => p.id === 'n20-12v-300rpm-encoder') || products[0];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Category Sidebar (Desktop) */}
            <div className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-[#192737] text-white px-4 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Shop By Department</span>
                <Sliders className="w-3.5 h-3.5 text-[#EF4F12]" />
              </div>
              <div className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {CATEGORIES.slice(1).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      onNavigate('catalog');
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-orange-50/60 hover:text-[#EF4F12] flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#EF4F12] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
                <span className="text-[11px] font-bold text-[#0051d5] hover:underline cursor-pointer flex items-center justify-center space-x-1">
                  <span>Explore All 15,000+ Hardware SKUs</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>

            {/* Main Center Featured Banner */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-gradient-to-br from-[#192737] via-[#1d2f44] to-[#0f1924] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-md">
              {/* Background Tech Motif */}
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
                <Cpu className="w-80 h-80 stroke-[0.8]" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-[#EF4F12]/20 border border-[#EF4F12]/40 text-orange-300 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#EF4F12]" />
                  <span>Precision Robotics Supply • In Stock</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
                  Micro Metal Geared Motors with Magnetic Encoders
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mb-6">
                  Industrial-grade all-metal spur gearboxes with quadrature Hall feedback. Engineered for autonomous micromouse, robotic arms, and IoT actuators.
                </p>

                <div className="flex flex-wrap items-baseline gap-3 mb-6">
                  <span className="text-2xl sm:text-3xl font-black text-white">Starting from ₹210</span>
                  <span className="text-xs text-orange-300 font-semibold bg-orange-950/60 px-2 py-0.5 rounded border border-orange-700/50">
                    Up to 18% Institutional Bulk Tier Discount
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap gap-3">
                <button
                  onClick={() => onSelectProduct(featuredMotor)}
                  className="bg-[#EF4F12] hover:bg-[#d44000] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-600/30 flex items-center space-x-2 cursor-pointer"
                >
                  <span>View N20 Motor Specifications</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onSelectCategory('Motors & Drivers');
                    onNavigate('catalog');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 transition cursor-pointer"
                >
                  Browse Motors Catalog
                </button>
              </div>
            </div>

            {/* Right Spotlight Promotional Cards */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Card 1: ESP32 */}
              <div 
                onClick={() => {
                  const esp = products.find(p => p.id === 'esp32-wroom-32d');
                  if (esp) onSelectProduct(esp);
                }}
                className="flex-1 bg-white rounded-xl border border-slate-200 p-4 hover:border-[#EF4F12] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                    <span className="text-[#0051d5]">Wireless MCU</span>
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">In Stock</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#EF4F12] transition leading-snug">
                    ESP32-WROOM-32D Dual-Core 240MHz Wi-Fi & BT Module
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">4MB Flash with PCB trace antenna</p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-black text-[#192737]">₹185.00</span>
                  <span className="text-xs text-[#EF4F12] font-bold group-hover:translate-x-1 transition-transform">
                    View Specs →
                  </span>
                </div>
              </div>

              {/* Card 2: 4WD Kit */}
              <div 
                onClick={() => {
                  const kit = products.find(p => p.id === 'smart-car-4wd-kit');
                  if (kit) onSelectProduct(kit);
                }}
                className="flex-1 bg-white rounded-xl border border-slate-200 p-4 hover:border-[#EF4F12] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                    <span className="text-[#EF4F12]">Robotics Pro</span>
                    <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Bestseller</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#EF4F12] transition leading-snug">
                    4WD Autonomous Smart Car Chassis with Encoders
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">Dual acrylic platform with 4x TT gear motors</p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-black text-[#192737]">₹1,290.00</span>
                  <span className="text-xs text-[#EF4F12] font-bold group-hover:translate-x-1 transition-transform">
                    View Specs →
                  </span>
                </div>
              </div>

              {/* Card 3: Soldering Station */}
              <div 
                onClick={() => {
                  const sol = products.find(p => p.id === 'digital-soldering-station-60w');
                  if (sol) onSelectProduct(sol);
                }}
                className="flex-1 bg-white rounded-xl border border-slate-200 p-4 hover:border-[#EF4F12] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                    <span className="text-amber-600">Lab Equipment</span>
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">ESD Safe</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#EF4F12] transition leading-snug">
                    Pro-Grade 60W Digital Soldering Station
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">PID temperature control with LED display</p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-black text-[#192737]">₹2,450.00</span>
                  <span className="text-xs text-[#EF4F12] font-bold group-hover:translate-x-1 transition-transform">
                    View Specs →
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Trust & Value Assurance Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2.5 text-slate-700">
            <Truck className="w-4 h-4 text-[#EF4F12] shrink-0" />
            <span>Pan-India Priority Dispatch within 24h</span>
          </div>
          <div className="flex items-center space-x-2.5 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Genuine Certified Hardware</span>
          </div>
          <div className="flex items-center space-x-2.5 text-slate-700">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>GST Compliant Invoices with 18% ITC</span>
          </div>
          <div className="flex items-center space-x-2.5 text-slate-700">
            <Cpu className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Bench Tested by Hardware Engineers</span>
          </div>
        </div>
      </div>

      {/* Trending Engineering Segments */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Trending Engineering Segments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore specialized product categories configured for maker and industrial applications
            </p>
          </div>
          <button
            onClick={() => {
              onSelectCategory('All Categories');
              onNavigate('catalog');
            }}
            className="text-xs font-bold text-[#0051d5] hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Micro Metal Motors', count: '142 SKUs', sub: 'N20, GA12, Hall Encoders', cat: 'Motors & Drivers' },
            { name: 'Edge AI & IoT MCUs', count: '88 SKUs', sub: 'ESP32, RP2040, STM32', cat: 'Development Boards' },
            { name: 'High Discharge LiPo', count: '64 SKUs', sub: '2S to 6S, 40C-100C', cat: 'Batteries & Chargers' },
            { name: 'Precision Steppers', count: '95 SKUs', sub: 'NEMA 17/23, TB6600', cat: 'Motors & Drivers' },
            { name: 'Autonomous Platforms', count: '45 SKUs', sub: '4WD, Mecanum, Tracks', cat: 'DIY Kits' },
            { name: 'Digital Soldering', count: '38 SKUs', sub: 'ESD Stations, Flux, Tips', cat: 'Tools & Soldering' }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectCategory(item.cat);
                onNavigate('catalog');
              }}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#EF4F12] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-orange-50 text-slate-700 group-hover:text-[#EF4F12] flex items-center justify-center mb-3 transition-colors">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#EF4F12] transition-colors leading-snug">
                {item.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.sub}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Precision Components & Embedded Modules (Tabbed Catalog Showcase) */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Precision Components & Embedded Modules
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic, bench-tested hardware with downloadable datasheets and CAD geometry
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-bold">
              {[
                { id: 'all', label: 'All In-Stock' },
                { id: 'motors', label: 'Motors & Drivers' },
                { id: 'iot', label: 'IoT & Microcontrollers' },
                { id: 'kits', label: 'Robotics Kits' },
                { id: 'tools', label: 'Prototyping & Tools' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {tabbedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <button
              onClick={() => {
                onSelectCategory('All Categories');
                onNavigate('catalog');
              }}
              className="inline-flex items-center space-x-2 bg-[#192737] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-xs"
            >
              <span>View All 15,000+ Items in Full Catalog</span>
              <ArrowRight className="w-4 h-4 text-[#EF4F12]" />
            </button>
          </div>

        </div>
      </section>

      {/* Institutional Procurement & B2B GST Quote Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-6">
        <div className="bg-gradient-to-r from-[#192737] via-[#213145] to-[#192737] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-slate-700">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Institutional & Enterprise Hardware Procurement</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Need Bulk Quantities or Institutional GST E-Invoicing?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We provide formal quotations, vendor compliance sheets, tiered discounts up to 25%, and direct bill-to/ship-to GST invoices for universities, R&D labs, and defense incubators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('b2b')}
              className="bg-[#EF4F12] hover:bg-[#d44000] text-white font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer shadow-sm text-center"
            >
              Upload Project BOM / CSV
            </button>
            <button
              onClick={() => onNavigate('b2b')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-3 rounded-xl border border-slate-600 transition cursor-pointer text-center"
            >
              Request Custom Quote
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
