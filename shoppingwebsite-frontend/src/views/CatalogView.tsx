import React, { useState, useMemo } from 'react';
import { Product, FilterState } from '../types';
import { ProductCard } from '../components/ProductCard';
import { MOTOR_SUBCATEGORIES } from '../data/products';
import { 
  SlidersHorizontal, 
  ChevronRight, 
  Grid, 
  List, 
  X, 
  Check, 
  Sliders, 
  RotateCcw, 
  FileDown, 
  Search,
  ShoppingCart,
  Star
} from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, qty: number) => void;
  onQuickView: (p: Product) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onQuickView,
  selectedCategory,
  onSelectCategory,
  searchQuery: initialSearchQuery,
}) => {
  // Filter state
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedVoltages, setSelectedVoltages] = useState<string[]>([]);
  const [selectedRpms, setSelectedRpms] = useState<string[]>([]);
  const [selectedShaft, setSelectedShaft] = useState<string[]>([]);
  const [encoderFilter, setEncoderFilter] = useState<'all' | 'with' | 'without'>('all');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available filter options derived from products
  const availableVoltages = ['5V', '6V', '12V', '24V'];
  const availableRpms = ['100 RPM', '300 RPM', '330 RPM', '12000 RPM'];
  const availableShafts = ['3mm D-Shaft', '6mm D-Shaft', '5mm Round Shaft'];

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedSubCategory('All');
    setInStockOnly(false);
    setSelectedVoltages([]);
    setSelectedRpms([]);
    setSelectedShaft([]);
    setEncoderFilter('all');
    setMaxPrice(3000);
  };

  const hasActiveFilters = 
    selectedSubCategory !== 'All' ||
    inStockOnly ||
    selectedVoltages.length > 0 ||
    selectedRpms.length > 0 ||
    selectedShaft.length > 0 ||
    encoderFilter !== 'all' ||
    maxPrice < 3000;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      if (selectedCategory !== 'All Categories' && selectedCategory !== 'all') {
        if (p.category !== selectedCategory) return false;
      }

      // Search match
      if (initialSearchQuery.trim()) {
        const q = initialSearchQuery.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Subcategory
      if (selectedSubCategory !== 'All') {
        if (!p.subCategory.toLowerCase().includes(selectedSubCategory.toLowerCase())) {
          return false;
        }
      }

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      // Price
      if (p.price > maxPrice) return false;

      // Voltage
      if (selectedVoltages.length > 0) {
        if (!p.voltage || !selectedVoltages.some(v => p.voltage?.includes(v))) {
          return false;
        }
      }

      // RPM
      if (selectedRpms.length > 0) {
        if (!p.rpm || !selectedRpms.some(r => r.startsWith(p.rpm!.toString()))) {
          return false;
        }
      }

      // Shaft
      if (selectedShaft.length > 0) {
        if (!p.shaftType || !selectedShaft.includes(p.shaftType)) {
          return false;
        }
      }

      // Encoder
      if (encoderFilter === 'with' && !p.encoder) return false;
      if (encoderFilter === 'without' && p.encoder) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [
    products, 
    selectedCategory, 
    initialSearchQuery, 
    selectedSubCategory, 
    inStockOnly, 
    maxPrice, 
    selectedVoltages, 
    selectedRpms, 
    selectedShaft, 
    encoderFilter, 
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
          <span 
            onClick={() => onSelectCategory('All Categories')} 
            className="hover:text-[#EF4F12] cursor-pointer"
          >
            Home
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="hover:text-[#EF4F12] cursor-pointer">{selectedCategory}</span>
          {selectedSubCategory !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-slate-800">{selectedSubCategory}</span>
            </>
          )}
        </div>

        {/* Category Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#EF4F12] uppercase tracking-wider mb-1">
                <span>Industrial Component Catalog</span>
                <span>•</span>
                <span className="text-slate-500">100% Genuine Certified</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#192737]">
                {selectedCategory === 'All Categories' ? 'Industrial Electronics & Robotics Directory' : selectedCategory}
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Browse precision-machined metal gearmotors, quadrature encoders, stepper drivers, and microcontroller development modules with downloadable datasheets and CAD files.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {filteredProducts.length} Products Found
              </span>
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
            <button
              onClick={() => setSelectedSubCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedSubCategory === 'All' 
                  ? 'bg-[#192737] text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            {MOTOR_SUBCATEGORIES.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedSubCategory === sub 
                    ? 'bg-[#EF4F12] text-white font-bold' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
            
            {/* Filter Header & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#EF4F12]" />
                <span>Applied Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold text-[#EF4F12] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* In Stock Availability Checkbox */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#EF4F12] focus:ring-[#EF4F12] cursor-pointer"
                />
                <span>In-Stock Only (Immediate Dispatch)</span>
              </label>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Max Price:</span>
                <span className="font-mono text-[#EF4F12]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#EF4F12] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹50</span>
                <span>₹3,000</span>
              </div>
            </div>

            {/* Operating Voltage */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">Operating Voltage</span>
              <div className="space-y-1.5">
                {availableVoltages.map(v => (
                  <label key={v} className="flex items-center space-x-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedVoltages.includes(v)}
                      onChange={() => toggleFilter(selectedVoltages, setSelectedVoltages, v)}
                      className="w-3.5 h-3.5 rounded text-[#EF4F12] focus:ring-[#EF4F12]"
                    />
                    <span>{v} DC</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rated Speed (RPM) */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">Rated Speed (RPM)</span>
              <div className="space-y-1.5">
                {availableRpms.map(r => (
                  <label key={r} className="flex items-center space-x-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRpms.includes(r)}
                      onChange={() => toggleFilter(selectedRpms, setSelectedRpms, r)}
                      className="w-3.5 h-3.5 rounded text-[#EF4F12] focus:ring-[#EF4F12]"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Shaft Profile */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">Shaft Profile</span>
              <div className="space-y-1.5">
                {availableShafts.map(s => (
                  <label key={s} className="flex items-center space-x-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedShaft.includes(s)}
                      onChange={() => toggleFilter(selectedShaft, setSelectedShaft, s)}
                      className="w-3.5 h-3.5 rounded text-[#EF4F12] focus:ring-[#EF4F12]"
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Encoder Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">Encoder Feedback</span>
              <div className="space-y-1.5 text-xs text-slate-600">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="encoder"
                    checked={encoderFilter === 'all'}
                    onChange={() => setEncoderFilter('all')}
                    className="text-[#EF4F12] focus:ring-[#EF4F12]"
                  />
                  <span>All Motors</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="encoder"
                    checked={encoderFilter === 'with'}
                    onChange={() => setEncoderFilter('with')}
                    className="text-[#EF4F12] focus:ring-[#EF4F12]"
                  />
                  <span>With Hall / Optical Encoder</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="encoder"
                    checked={encoderFilter === 'without'}
                    onChange={() => setEncoderFilter('without')}
                    className="text-[#EF4F12] focus:ring-[#EF4F12]"
                  />
                  <span>Standard Non-Encoder</span>
                </label>
              </div>
            </div>

            {/* Custom Gear Ratio Help Card */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 text-xs">
              <p className="font-bold text-slate-900">Custom Gearbox Ratio?</p>
              <p className="text-slate-600 text-[11px] mt-1">
                We supply 1:10 up to 1:1000 custom gear ratios with planetary stages for volume batches.
              </p>
              <button 
                onClick={() => alert('Custom Gear Ratio Inquiry forwarded to Spaceborn Hardware Engineering Desk.')}
                className="mt-2 text-[11px] font-bold text-[#EF4F12] hover:underline cursor-pointer block"
              >
                Inquire with Engineering Desk →
              </button>
            </div>

          </aside>

          {/* Right Product Grid Column */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Controls Bar: Sort, View Switcher, Filter Toggle for Mobile */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
              
              <div className="flex items-center space-x-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#EF4F12]" />
                  <span>Filters {hasActiveFilters && '(Active)'}</span>
                </button>

                <div className="text-xs text-slate-500 hidden sm:block">
                  Showing <strong className="text-slate-800">{filteredProducts.length}</strong> components
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="text-slate-500 hidden sm:inline">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="featured">Featured (Maker Choice)</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Customer Rating</option>
                  </select>
                </div>

                {/* View Switcher */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition cursor-pointer ${
                      viewMode === 'grid' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition cursor-pointer ${
                      viewMode === 'list' ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Mobile Filters Drawer if open */}
            {mobileFilterOpen && (
              <div className="lg:hidden bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Filter By Specs</span>
                  <button onClick={clearAllFilters} className="text-xs font-bold text-[#EF4F12]">Clear All</button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {availableVoltages.map(v => (
                    <button
                      key={v}
                      onClick={() => toggleFilter(selectedVoltages, setSelectedVoltages, v)}
                      className={`px-2.5 py-1 rounded border text-xs ${
                        selectedVoltages.includes(v) ? 'bg-[#EF4F12] text-white border-[#EF4F12]' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#EF4F12]"
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>
            )}

            {/* Products Listing */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No components match your current filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your voltage, RPM, or price criteria, or reset all filters to view our full inventory.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-2 inline-flex items-center px-4 py-2 bg-[#192737] text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#EF4F12] hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-200 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono mb-0.5">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span>SKU: {product.sku}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1 text-xs">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">{product.rating}</span>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            {product.stock} in stock
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2">
                      <div className="text-left sm:text-right">
                        <span className="text-base font-black text-[#192737]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Excl. GST: ₹{(product.price / 1.18).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product, 1);
                        }}
                        className="bg-[#EF4F12] hover:bg-[#d44000] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
