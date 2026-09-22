import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingCart, Check, FileText, Box, ShieldCheck, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onViewFullDetails: (p: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewFullDetails,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [added, setAdded] = useState(false);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const priceExGst = (product.price / (1 + product.gstRate / 100)).toFixed(2);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center h-64 overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-56 max-w-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-lg border p-1 bg-white shrink-0 overflow-hidden cursor-pointer ${
                      activeImage === img ? 'border-[#EF4F12] ring-2 ring-orange-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>QC Bench Tested</span>
              </span>
              <span className="font-mono">HSN: {product.hsn}</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
                <span className="text-[#EF4F12] uppercase tracking-wider">{product.category}</span>
                <span>•</span>
                <span>{product.brand}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2">
                {product.name}
              </h2>

              <p className="text-xs text-slate-500 font-mono mb-3">
                SKU: <span className="text-slate-800 font-semibold">{product.sku}</span>
              </p>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} verified maker reviews)</span>
              </div>

              {/* Price */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-[#192737]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Inclusive of 18% GST
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Base Price: ₹{priceExGst} (Claim ₹{(product.price - parseFloat(priceExGst)).toFixed(2)} Input Tax Credit)
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* Highlights */}
              <ul className="text-xs text-slate-600 space-y-1.5 mb-5">
                {product.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4F12] mt-1.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center font-bold text-sm bg-white border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`flex-1 h-10 rounded-lg flex items-center justify-center space-x-2 font-bold text-sm transition-all cursor-pointer ${
                    added ? 'bg-emerald-600 text-white' : 'bg-[#EF4F12] hover:bg-[#d44000] text-white shadow-sm'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onViewFullDetails(product);
                }}
                className="w-full text-center text-xs font-bold text-[#0051d5] hover:text-blue-800 py-1 flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>View Complete Technical Datasheet & 3D CAD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
