'use client';
import React, { useState } from 'react';
import { Product, AppView } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, 
  ShoppingCart, 
  Check, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Box, 
  ChevronRight, 
  Zap, 
  Lock, 
  Info,
  MapPin,
  CheckCircle2,
  ZoomIn
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (p: Product, qty: number) => void;
  onBuyNow: (p: Product, qty: number) => void;
  onSelectProduct: (p: Product) => void;
  onNavigate: (view: AppView) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onNavigate,
}) => {
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'pinout' | 'package' | 'reviews'>('specs');
  const [pincode, setPincode] = useState('208001');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>('âš¡ 10-15 Min Express Delivery available to Kanpur Hub & Labs.');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  // Sync selectedImage if product changes
  React.useEffect(() => {
    const pImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    setSelectedImage(pImages[0]);
    setQuantity(1);
  }, [product.id, product.image]);

  // Calculate tier pricing if applicable
  const getUnitPriceForQty = (qty: number): number => {
    if (!product.tierPricing || product.tierPricing.length === 0) return product.price;
    for (let i = product.tierPricing.length - 1; i >= 0; i--) {
      const tier = product.tierPricing[i];
      if (qty >= tier.minQty) {
        return tier.price;
      }
    }
    return product.price;
  };

  const currentUnitPrice = getUnitPriceForQty(quantity);
  const totalPrice = currentUnitPrice * quantity;
  const priceExGst = (currentUnitPrice / 1.18).toFixed(2);
  const itcSaving = (currentUnitPrice - parseFloat(priceExGst)).toFixed(2);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus(`Verified: 10-15 minute runner delivery active for PIN ${pincode}.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1600);
  };

  // Related products
  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fee9d7] text-[#34222e] py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-[#7a6274] mb-4 overflow-x-auto whitespace-nowrap">
          <span onClick={() => onNavigate('home')} className="hover:text-[#e2434b] cursor-pointer">Home</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span onClick={() => onNavigate('catalog')} className="hover:text-[#e2434b] cursor-pointer">{product.category}</span>
          {product.subCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span onClick={() => onNavigate('catalog')} className="hover:text-[#e2434b] cursor-pointer">{product.subCategory}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-bold text-[#34222e] truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Presentation Card */}
        <div className="bg-[#fffbf7] rounded-3xl border border-[#f9bf8f]/60 p-6 lg:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Primary Image Stage with Amazon/Blinkit Zoom Lens */}
              <div 
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                className="relative bg-white border border-[#f9bf8f]/60 rounded-2xl p-6 flex items-center justify-center h-80 sm:h-96 overflow-hidden group shadow-xs cursor-crosshair select-none"
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? 'scale(2.3)' : 'scale(1)',
                    transition: isZoomed ? 'transform 0.08s ease-out' : 'transform 0.3s ease-out',
                  }}
                  className="max-h-80 max-w-full object-contain pointer-events-none will-change-transform"
                />
                
                {/* Stock & Speed Badges */}
                <div className={`absolute top-3 left-3 flex flex-col gap-1.5 transition-opacity ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="bg-[#f2fcf4] text-[#0c831f] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#0c831f]/20 uppercase">
                    âš¡ {product.deliveryMins || 10} Mins Delivery
                  </span>
                  <span className="bg-white/90 text-[#34222e] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#f9bf8f]/60 uppercase">
                    In Stock ({product.stock} units)
                  </span>
                </div>

                {/* Hover to Zoom Guide Badge */}
                <div className={`absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#7a6274] border border-[#f9bf8f]/60 text-[10.5px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs transition-opacity duration-200 pointer-events-none ${isZoomed ? 'opacity-0' : 'opacity-80 group-hover:opacity-100'}`}>
                  <ZoomIn className="w-3.5 h-3.5 text-[#0c831f]" />
                  <span>Roll over image to zoom</span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl border p-1 bg-white shrink-0 overflow-hidden cursor-pointer transition ${
                        selectedImage === img 
                          ? 'border-[#0c831f] ring-2 ring-[#0c831f]/20' 
                          : 'border-[#f9bf8f]/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Downloads Bar */}
              <div className="pt-3 border-t border-[#f9bf8f]/40 flex flex-wrap items-center gap-2 text-xs">
                <a
                  href="#specs"
                  onClick={(e) => { e.preventDefault(); setActiveTab('specs'); }}
                  className="flex-1 bg-white hover:bg-[#fee9d7] text-[#34222e] font-semibold py-2 px-3 rounded-xl border border-[#f9bf8f]/60 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#e2434b]" />
                  <span>Technical Datasheet</span>
                </a>

                <a
                  href="#specs"
                  onClick={(e) => { e.preventDefault(); alert('3D CAD Step file download initiated.'); }}
                  className="flex-1 bg-white hover:bg-[#fee9d7] text-[#34222e] font-semibold py-2 px-3 rounded-xl border border-[#f9bf8f]/60 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Box className="w-4 h-4 text-[#0c831f]" />
                  <span>3D CAD (.STEP)</span>
                </a>
              </div>
            </div>

            {/* Product Configuration & Information (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                {/* Brand & HSN strip */}
                <div className="flex flex-wrap items-center justify-between text-xs text-[#7a6274] mb-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#e2434b] uppercase tracking-wider">{product.brand}</span>
                    <span>â€¢</span>
                    <span>SKU: <strong className="text-[#34222e]">{product.sku}</strong></span>
                  </div>
                  <span className="bg-white border border-[#f9bf8f]/60 px-2 py-0.5 rounded text-[11px] font-semibold text-[#34222e]">
                    HSN: {product.hsn}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#34222e] leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Assurance */}
                <div className="mt-2.5 flex items-center space-x-3 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#34222e]">{product.rating}</span>
                  <span className="text-[#7a6274]">({product.reviewsCount} reviews)</span>
                  <span className="text-[#7a6274]/50">â€¢</span>
                  <span className="text-[#0c831f] font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Genuine Certified</span>
                  </span>
                </div>
              </div>

              {/* Price Container */}
              <div className="bg-[#fee9d7]/50 rounded-2xl p-4 sm:p-5 border border-[#f9bf8f]/60 space-y-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#34222e]">
                    ₹{currentUnitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#7a6274] line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#0c831f] bg-[#f2fcf4] px-2 py-0.5 rounded-lg border border-[#0c831f]/20">
                    Inclusive of 18% GST
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-[#7a6274] pt-1">
                  <span>
                    Excl. GST: <strong className="text-[#34222e]">₹{priceExGst}</strong>
                  </span>
                  <span className="text-[#0c831f] font-semibold bg-[#f2fcf4] px-2 py-0.5 rounded border border-[#0c831f]/20">
                    B2B Tax Credit: Claim ₹{itcSaving} ITC
                  </span>
                </div>
              </div>

              {/* Tiered Bulk Pricing Table if applicable */}
              {product.tierPricing && product.tierPricing.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#34222e] flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-[#0c831f]" />
                    <span>Volume Wholesale Tiers (Applied Automatically)</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {product.tierPricing.map((tier, idx) => {
                      const isSelected = quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty);
                      return (
                        <div
                          key={idx}
                          onClick={() => setQuantity(tier.minQty)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer ${
                            isSelected 
                              ? 'bg-[#f2fcf4] border-[#0c831f] ring-2 ring-[#0c831f]/20' 
                              : 'bg-white border-[#f9bf8f]/60 hover:bg-[#fee9d7]/30'
                          }`}
                        >
                          <span className="block text-[11px] font-semibold text-[#7a6274]">
                            {tier.minQty}{tier.maxQty ? ` - ${tier.maxQty} pcs` : '+ pcs'}
                          </span>
                          <span className="block text-sm font-bold text-[#34222e] mt-0.5">
                            ₹{tier.price}
                          </span>
                          <span className={`block text-[10px] font-bold mt-1 ${isSelected ? 'text-[#0c831f]' : 'text-[#7a6274]'}`}>
                            {tier.savings}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Action Controls */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#f9bf8f] rounded-xl overflow-hidden bg-white shrink-0 shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-12 flex items-center justify-center text-[#34222e] hover:bg-[#fee9d7] font-bold text-base transition cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-16 h-12 text-center text-sm font-bold text-[#34222e] bg-white border-x border-[#f9bf8f] outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-12 flex items-center justify-center text-[#34222e] hover:bg-[#fee9d7] font-bold text-base transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Quick Quantity Presets */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-[#7a6274] mr-0.5">Quick Pack:</span>
                    {[1, 5, 10, 25, 50, 100].map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, q))}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          quantity === q
                            ? 'bg-[#0c831f] text-white border-[#0c831f] shadow-xs'
                            : 'bg-white text-[#34222e] border-[#f9bf8f]/60 hover:bg-[#fee9d7]'
                        }`}
                      >
                        +{q}
                      </button>
                    ))}
                  </div>

                  {/* Add to Cart CTA (Blinkit Green) */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm ${
                      addedSuccess 
                        ? 'bg-[#0c831f] text-white' 
                        : 'bg-[#0c831f] hover:bg-[#0a6e1a] text-white active:scale-[0.98]'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added {quantity} to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add {quantity} to Cart (₹{totalPrice.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now (Coral) */}
                  <button
                    onClick={() => onBuyNow(product, quantity)}
                    disabled={product.stock <= 0}
                    className="h-12 px-6 rounded-xl font-bold text-sm bg-[#e2434b] hover:bg-[#c7323a] text-white flex items-center justify-center space-x-2 transition cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* Delivery Estimator Bar */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#f9bf8f]/60 space-y-2">
                <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#e2434b] shrink-0" />
                  <span className="text-xs font-semibold text-[#34222e] shrink-0">Delivery to Pincode:</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="w-32 px-2.5 py-1 text-xs font-bold text-[#34222e] bg-[#fee9d7]/40 border border-[#f9bf8f]/60 rounded-lg outline-none"
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold text-[#0c831f] hover:underline cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-[11px] text-[#7a6274] flex items-center space-x-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-[#0c831f] shrink-0" />
                    <span>{pincodeStatus}</span>
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Engineering Specs & Diagrams */}
        <div id="specs" className="bg-[#fffbf7] rounded-3xl border border-[#f9bf8f]/60 p-6 lg:p-8 mb-8 shadow-xs">
          
          {/* Tab Headers */}
          <div className="flex items-center space-x-2 border-b border-[#f9bf8f]/40 pb-3 overflow-x-auto">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'pinout', label: 'Pinout & Wiring Diagram' },
              { id: 'package', label: 'Package Includes' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#0c831f] text-white shadow-xs'
                    : 'text-[#7a6274] hover:bg-[#fee9d7]/50 hover:text-[#34222e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Specifications */}
          {activeTab === 'specs' && (
            <div className="pt-6 space-y-6">
              <p className="text-xs sm:text-sm text-[#7a6274] leading-relaxed">
                {product.description}
              </p>

              <div className="overflow-hidden border border-[#f9bf8f]/60 rounded-2xl bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#fee9d7]/60 text-[#34222e] font-bold border-b border-[#f9bf8f]/40">
                    <tr>
                      <th className="px-4 py-2.5">Parameter</th>
                      <th className="px-4 py-2.5">Specification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f9bf8f]/30 font-medium text-[#7a6274]">
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#fffbf7]'}>
                        <td className="px-4 py-2.5 font-bold text-[#34222e] w-1/3">{key}</td>
                        <td className="px-4 py-2.5">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key Features Bulleted */}
              <div>
                <h4 className="text-xs font-bold text-[#34222e] uppercase tracking-wider mb-3">
                  Highlights & Features
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#7a6274]">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0c831f] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Pinout Diagram & Wire Color Code */}
          {activeTab === 'pinout' && (
            <div className="pt-6 space-y-6">
              <div className="bg-[#f2fcf4] border border-[#0c831f]/20 rounded-2xl p-4 text-xs text-[#34222e] flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-[#0c831f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Interface & Signal Logic</span>
                  <span className="text-[#7a6274]">
                    Connect VCC to 5V DC and GND to system ground. Trigger requires a 10Âµs TTL pulse to transmit sonar ping.
                  </span>
                </div>
              </div>

              {product.pinout && (
                <div className="overflow-hidden border border-[#f9bf8f]/60 rounded-2xl bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#fee9d7]/60 text-[#34222e] font-bold border-b border-[#f9bf8f]/40">
                      <tr>
                        <th className="px-4 py-2.5">Pin</th>
                        <th className="px-4 py-2.5">Wire Color</th>
                        <th className="px-4 py-2.5">Signal</th>
                        <th className="px-4 py-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f9bf8f]/30 font-medium text-[#7a6274]">
                      {product.pinout.map((p, idx) => (
                        <tr key={idx} className="hover:bg-[#fffbf7]">
                          <td className="px-4 py-2.5 font-bold text-[#34222e]">{p.pin}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center space-x-1.5">
                              <span 
                                className="w-3 h-3 rounded-full border border-gray-300 shrink-0" 
                                style={{ backgroundColor: p.color.toLowerCase() === 'white' ? '#f8f9fa' : p.color.toLowerCase() }}
                              />
                              <span>{p.color}</span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-bold text-[#e2434b]">{p.function}</td>
                          <td className="px-4 py-2.5 text-[#7a6274]">{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Package Includes */}
          {activeTab === 'package' && (
            <div className="pt-6 space-y-4">
              <h4 className="text-xs font-bold text-[#34222e] uppercase tracking-wider">
                Package Contents
              </h4>
              <ul className="space-y-2 text-xs text-[#7a6274]">
                {product.packageIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5 p-2.5 bg-white rounded-xl border border-[#f9bf8f]/40">
                    <Box className="w-4 h-4 text-[#0c831f]" />
                    <span className="font-medium text-[#34222e]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#f9bf8f]/60">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-extrabold text-[#34222e]">{product.rating}</span>
                  <div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-[#7a6274]">
                      Based on {product.reviewsCount} customer reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-3">
                {[
                  {
                    name: 'Rajesh Sharma',
                    org: 'Robotics Lab',
                    date: '2 weeks ago',
                    title: 'Accurate and reliable ranging',
                    comment: 'Works out of the box with Arduino NewPing library. High precision ranging up to 400cm.',
                    rating: 5
                  },
                  {
                    name: 'Ananya Deshmukh',
                    org: 'Automation Team',
                    date: '1 month ago',
                    title: 'Clean signal without false triggers',
                    comment: 'High quality transducers and prompt 10-minute dispatch. Re-ordering for our robotics batch.',
                    rating: 5
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-[#f9bf8f]/40 bg-white space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#34222e]">{rev.name}</span>
                        <span className="text-[#7a6274]">({rev.org})</span>
                        <span className="text-[10px] bg-[#f2fcf4] text-[#0c831f] font-bold px-1.5 py-0.5 rounded border border-[#0c831f]/20">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-[#7a6274] text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <h5 className="text-xs font-bold text-[#34222e]">{rev.title}</h5>
                    <p className="text-xs text-[#7a6274] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Related Components */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-[#34222e]">
              Related Components in {product.category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                  onAddToCart={(prod, qty) => onAddToCart(prod, qty || 1)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
