import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, Eye, Check, Shield, Cpu } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
  onQuickView?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onQuickView,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const priceExGst = (product.price / (1 + product.gstRate / 100)).toFixed(2);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      onSelect(product);
    }
  };

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-[#EF4F12]/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.badge && (
          <span className="bg-[#EF4F12] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        {product.stock > 0 ? (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-semibold px-1.5 py-0.5 rounded">
            In Stock: {product.stock} pcs
          </span>
        ) : (
          <span className="bg-rose-50 text-rose-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">
            Backorder
          </span>
        )}
      </div>

      {/* Quick View Hover Button */}
      <button
        onClick={handleQuickViewClick}
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-[#EF4F12] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-slate-200"
        title="Quick View Specifications"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Image Container */}
      <div className="p-4 pt-8 bg-slate-50/50 flex items-center justify-center h-48 border-b border-slate-100 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 truncate max-w-[140px]">{product.brand}</span>
            <span className="font-mono text-[10px]">SKU: {product.sku}</span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#EF4F12] transition-colors leading-snug mb-2">
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center space-x-1 mb-2.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-700">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </div>

          {/* Key Engineering Specs tag if available */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.voltage && (
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {product.voltage}
              </span>
            )}
            {product.rpm && (
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {product.rpm} RPM
              </span>
            )}
            {product.encoder && (
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-1.5 py-0.5 rounded font-medium">
                Hall Encoder
              </span>
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline space-x-2">
            <span className="text-base sm:text-lg font-black text-[#192737]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            (Excl. GST: ₹{priceExGst})
          </p>

          {/* Quantity and Add to Cart Row */}
          <div className="mt-3 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-8 h-8 text-center text-xs font-bold text-slate-800 bg-white border-x border-slate-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`flex-1 h-8 rounded-lg flex items-center justify-center space-x-1.5 text-xs font-bold transition-all cursor-pointer ${
                isAdded 
                  ? 'bg-emerald-600 text-white' 
                  : product.stock <= 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#EF4F12] hover:bg-[#d44000] text-white shadow-xs'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
