import React, { useState } from 'react';
import { Product, AppView } from '../types';
import { 
  Star, 
  ShoppingCart, 
  Check, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Download, 
  Box, 
  ChevronRight, 
  Plus, 
  Zap, 
  Lock, 
  Info,
  MapPin,
  CheckCircle2,
  Share2
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
  const [pincode, setPincode] = useState('560100');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>('Delivery to 560100 (Bengaluru) by Tomorrow, 11:30 AM via BlueDart Air Express.');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  // Calculate tier pricing
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
      setPincodeStatus(`Verified Serviceable: Priority delivery to ${pincode} within 24-48 Hours via BlueDart Air Cargo.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1600);
  };

  // Frequently bought together companion products
  const wheelProduct = allProducts.find(p => p.id === 'n20-rubber-wheel-30mm');
  const bracketProduct = allProducts.find(p => p.id === 'n20-mounting-bracket-steel');

  const bundleTotal = (product.price + (wheelProduct?.price || 85) + (bracketProduct?.price || 45));
  const bundleDiscountedTotal = bundleTotal - 25;

  const handleAddBundle = () => {
    onAddToCart(product, 1);
    if (wheelProduct) onAddToCart(wheelProduct, 1);
    if (bracketProduct) onAddToCart(bracketProduct, 1);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1800);
  };

  // Related products
  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <>
    <div className="min-h-screen bg-[#f8f9fc] py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
          <span onClick={() => onNavigate('home')} className="hover:text-[#EF4F12] cursor-pointer">Home</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span onClick={() => onNavigate('catalog')} className="hover:text-[#EF4F12] cursor-pointer">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span onClick={() => onNavigate('catalog')} className="hover:text-[#EF4F12] cursor-pointer">{product.subCategory}</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-bold text-slate-800 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Presentation Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Primary Image Stage */}
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-center h-80 sm:h-96 overflow-hidden group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-80 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Stock Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    In Stock ({product.stock} Units)
                  </span>
                  <span className="bg-[#192737] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    QC Tested
                  </span>
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
                          ? 'border-[#EF4F12] ring-2 ring-orange-200' 
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Engineering Downloads Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <a
                  href="#specs"
                  onClick={(e) => { e.preventDefault(); setActiveTab('specs'); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-lg border border-slate-200 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#EF4F12]" />
                  <span>Datasheet (PDF 1.4MB)</span>
                </a>

                <a
                  href="#specs"
                  onClick={(e) => { e.preventDefault(); alert('3D CAD Step file download initiated: N20_Gearmotor_Assembly.step'); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-lg border border-slate-200 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Box className="w-4 h-4 text-[#0051d5]" />
                  <span>3D CAD (.STEP 4.2MB)</span>
                </a>
              </div>
            </div>

            {/* Product Configuration & Information (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                {/* Brand & HSN strip */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mb-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#EF4F12] uppercase tracking-wider">{product.brand}</span>
                    <span>•</span>
                    <span className="font-mono">SKU: <strong className="text-slate-800">{product.sku}</strong></span>
                  </div>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                    HSN Code: {product.hsn}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-[#192737] leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Assurance */}
                <div className="mt-2.5 flex items-center space-x-3 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-slate-800">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} Verified Maker Reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Genuine Certified</span>
                  </span>
                </div>
              </div>

              {/* Price Container */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#192737]">
                    ₹{currentUnitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Inclusive of 18% GST
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
                  <span>
                    Excl. GST: <strong className="text-slate-900 font-mono">₹{priceExGst}</strong>
                  </span>
                  <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    B2B Tax Credit: Claim ₹{itcSaving} per piece
                  </span>
                </div>
              </div>

              {/* Tiered Bulk Pricing Table */}
              {product.tierPricing && product.tierPricing.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-[#EF4F12]" />
                      <span>Volume Wholesale Tiers (Applied Automatically)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {product.tierPricing.map((tier, idx) => {
                      const isSelected = quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty);
                      return (
                        <div
                          key={idx}
                          onClick={() => setQuantity(tier.minQty)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer ${
                            isSelected 
                              ? 'bg-orange-50 border-[#EF4F12] ring-2 ring-orange-200' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="block text-[11px] font-bold text-slate-500">
                            {tier.minQty}{tier.maxQty ? ` - ${tier.maxQty} pcs` : '+ pcs'}
                          </span>
                          <span className="block text-sm font-black text-slate-900 mt-0.5">
                            ₹{tier.price}
                          </span>
                          <span className={`block text-[10px] font-bold mt-1 ${isSelected ? 'text-[#EF4F12]' : 'text-emerald-600'}`}>
                            {tier.savings}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Controls */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-12 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-base transition cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-14 h-12 text-center text-sm font-black text-slate-900 bg-white border-x border-slate-200 outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-12 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-base transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-orange-500/20 cursor-pointer ${
                      addedSuccess 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-[#EF4F12] hover:bg-[#d44000] text-white'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added {quantity} Units to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add {quantity} to Cart (₹{totalPrice.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now with Stripe */}
                  <button
                    onClick={() => onBuyNow(product, quantity)}
                    disabled={product.stock <= 0}
                    className="h-12 px-6 rounded-xl font-bold text-sm bg-[#192737] hover:bg-slate-800 text-white flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#EF4F12]" />
                    <span>Buy Now (Stripe)</span>
                  </button>
                </div>
              </div>

              {/* Pincode Estimator Bar */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 shrink-0">Dispatch Estimator:</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="w-32 px-2.5 py-1 text-xs font-mono font-bold bg-white border border-slate-300 rounded outline-none"
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold text-[#0051d5] hover:underline cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-[11px] text-slate-600 flex items-center space-x-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{pincodeStatus}</span>
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
            <Plus className="w-4 h-4 text-[#EF4F12]" />
            <span>Frequently Bought Prototyping Bundle</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 flex flex-wrap items-center gap-4">
              
              {/* Product 1 */}
              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-xs">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                  <span className="text-xs font-black text-[#192737]">₹{product.price}</span>
                </div>
              </div>

              <span className="text-slate-400 font-bold text-lg">+</span>

              {/* Product 2: Rubber Wheels */}
              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-xs">
                <img 
                  src={wheelProduct?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaJNsmXpBWhZoJxAGar-eL2Y0Od7MSjXyY5ZXKYCcEYA5k3A7zGziKDq4etekl8nfVtUU1YA6Du795fy3MpZkB_zPxXOV6EXCVa1BWy2MM6hhyNC_KCNbT3GYzm_z4ckeRQrhQ4HGz39X2Phq_-c9kebwl-nicM6FGrMddghVSQw2mH5bL20aAVAUsLjIZer9PEgyd-sepAckbttCXV9-XmesY2midLmYog3i5kyniUk5dIp6Z8rc7'} 
                  alt="Rubber Wheels" 
                  className="w-12 h-12 object-contain" 
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">30mm High Traction Wheels (Pair)</h4>
                  <span className="text-xs font-black text-[#192737]">₹85.00</span>
                </div>
              </div>

              <span className="text-slate-400 font-bold text-lg">+</span>

              {/* Product 3: Mounting Bracket */}
              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-xs">
                <img 
                  src={bracketProduct?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuABVWRn2ggqdF_7GYjNCyKB7ZDDatCtspOB4f4YCz357yh7jhXP8bWc_0i1PuHnoj4wtBdqzDMIUQ_Aezv4w6Oag1i2F50Bue4bIvwTUihifPhrb37q9ka7NDkGGafTx-QvKJAh4fftvCF59LgYjEexIq1s48ADiPc9xRY1BHiE_9JfchKALDPJ2OD3s_jjG81Wc0kWeKZUI1Uten12-Y7Q1gRY43EhOMI1rM0UPiHWDDKnEra6RXGf'} 
                  alt="Steel Bracket" 
                  className="w-12 h-12 object-contain" 
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">N20 Stamped Steel Brackets (Pair)</h4>
                  <span className="text-xs font-black text-[#192737]">₹45.00</span>
                </div>
              </div>

            </div>

            {/* Bundle Checkout Box */}
            <div className="md:col-span-4 bg-orange-50/70 p-4 rounded-xl border border-orange-200 text-center space-y-2">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-xl font-black text-[#192737]">₹{bundleDiscountedTotal}.00</span>
                <span className="text-xs text-slate-400 line-through">₹{bundleTotal}.00</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Save ₹25
                </span>
              </div>
              <p className="text-[11px] text-slate-600">Complete drive wheel and mounting assembly</p>
              
              <button
                onClick={handleAddBundle}
                className={`w-full py-2 px-4 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                  bundleAdded ? 'bg-emerald-600 text-white' : 'bg-[#EF4F12] hover:bg-[#d44000] text-white shadow-xs'
                }`}
              >
                {bundleAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Bundle Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add All 3 Items to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Engineering Specs & Diagrams */}
        <div id="specs" className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 mb-8 shadow-xs">
          
          {/* Tab Headers */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'pinout', label: 'Pinout & Wiring Diagram' },
              { id: 'package', label: 'Package Includes' },
              { id: 'reviews', label: `Maker Reviews (${product.reviewsCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#192737] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Specifications */}
          {activeTab === 'specs' && (
            <div className="pt-6 space-y-6">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Engineering Parameter</th>
                      <th className="px-4 py-2.5">Specification Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-4 py-2.5 font-bold text-slate-900 w-1/3">{key}</td>
                        <td className="px-4 py-2.5 font-mono">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key Features Bulleted */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  Mechanical & Electrical Highlights
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Quadrature Hall Sensor Output Logic</span>
                  <span>
                    Channels C1 and C2 output 90° out-of-phase square wave pulses. Hall sensor logic operates at 3.3V or 5.0V with integrated pull-up resistors.
                  </span>
                </div>
              </div>

              {product.pinout && (
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#192737] text-white font-bold">
                      <tr>
                        <th className="px-4 py-2.5">Pin</th>
                        <th className="px-4 py-2.5">Wire Color</th>
                        <th className="px-4 py-2.5">Functional Signal</th>
                        <th className="px-4 py-2.5">Wiring Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {product.pinout.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 font-bold font-mono text-slate-900">{p.pin}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center space-x-1.5">
                              <span 
                                className="w-3 h-3 rounded-full border border-slate-300 shrink-0" 
                                style={{ backgroundColor: p.color.toLowerCase() === 'white' ? '#f8f9fa' : p.color.toLowerCase() }}
                              />
                              <span className="font-semibold">{p.color}</span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-bold text-[#EF4F12]">{p.function}</td>
                          <td className="px-4 py-2.5 text-slate-600">{p.description}</td>
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Package Contents
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {product.packageIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <Box className="w-4 h-4 text-[#EF4F12]" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-black text-slate-900">{product.rating}</span>
                  <div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      Based on {product.reviewsCount} customer reviews
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => alert('Review submission open for verified institutional purchasers.')}
                  className="bg-[#192737] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Write a Technical Review
                </button>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                {[
                  {
                    name: 'Rajesh Sharma',
                    org: 'IIT Bombay Robotics Club',
                    date: '2 weeks ago',
                    title: 'Excellent quadrature encoder signal clarity',
                    comment: 'Tested on an oscilloscope with 10k pull-ups to 3.3V STM32 timer encoder mode. Clean 90-degree phase quadrature without chatter. Gearbox backlash is minimal.',
                    rating: 5
                  },
                  {
                    name: 'Ananya Deshmukh',
                    org: 'Apex Automation Ltd.',
                    date: '1 month ago',
                    title: 'Reliable torque for micromouse maze solving',
                    comment: 'Runs very cool at 12V under continuous load. High quality brass gears. Re-ordered 30 pcs for our production run with GST invoice.',
                    rating: 5
                  }
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{rev.name}</span>
                        <span className="text-slate-400">({rev.org})</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <h5 className="text-xs font-bold text-slate-800">{rev.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Related Components Cross-Sell */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Related Hardware in {product.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#EF4F12] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="h-32 flex items-center justify-center bg-slate-50 rounded-lg p-2 mb-3">
                    <img src={p.image} alt={p.name} className="max-h-28 max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{p.name}</h4>
                    <span className="text-sm font-black text-[#192737] block mt-2">₹{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
};
