import React, { useState } from 'react';
import { Product, CartItem, UserProfile, AppView } from '../types';
import { CATEGORIES } from '../data/products';
import { SpacebornLogo } from './SpacebornLogo';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  RefreshCw, 
  User, 
  Truck, 
  FileCheck, 
  HelpCircle, 
  PhoneCall, 
  Cpu, 
  ChevronDown,
  X,
  LogOut,
  Building2,
  Sparkles,
  UserCheck,
  Settings,
  Layers,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  cart: CartItem[];
  wishlistCount: number;
  compareCount?: number;
  user: UserProfile | null;
  onOpenCart: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onSignOut: () => void;
  onNavigate: (view: AppView) => void;
  currentView: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  wishlistCount,
  compareCount = 0,
  user,
  onOpenCart,
  onOpenAuth,
  onSignOut,
  onNavigate,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  products,
  onSelectProduct,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Filter products for quick search dropdown
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Top Announcement & Service Bar */}
      <div className="bg-[#192737] text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-slate-200">
              <PhoneCall className="w-3.5 h-3.5 text-[#EF4F12]" />
              <span>Helpline: <strong className="text-white">+91 080 4912 8800</strong> (Mon-Sat 9:30 AM - 6:30 PM)</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center space-x-1 text-emerald-400 font-medium">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Claim 18% GST Input Tax Credit On All Orders</span>
            </span>
          </div>

          <div className="flex items-center space-x-5 text-slate-300">
            <button 
              onClick={() => onNavigate('orders')} 
              className="hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-[#EF4F12]" />
              <span>Track Consignment</span>
            </button>
            <span className="text-slate-500">|</span>
            <button 
              onClick={() => onNavigate('b2b')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              B2B BOM & Quotes
            </button>
            <span className="text-slate-500">|</span>
            <button 
              onClick={() => onNavigate('fabrication')}
              className="hover:text-white cursor-pointer transition-colors"
            >
              PCB & Hardware Lab
            </button>
            <span className="text-slate-500">|</span>
            <button 
              onClick={() => onNavigate('contact')}
              className="hover:text-white cursor-pointer transition-colors flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Technical Desk</span>
            </button>
            <span className="text-slate-500">|</span>
            <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              INR ₹
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer shrink-0"
          >
            <SpacebornLogo size="md" subtitle={true} />
          </div>

          {/* Search Bar with Category Filter */}
          <div className="relative flex-1 max-w-2xl hidden md:block">
            <div className="flex rounded-md border-2 border-slate-300 focus-within:border-[#EF4F12] transition-colors bg-white overflow-hidden shadow-xs">
              <select 
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="bg-slate-50 text-xs font-semibold text-slate-700 px-3 py-2 border-r border-slate-200 outline-none cursor-pointer max-w-[150px] truncate"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search 15,000+ SKUs: N20 motor, ESP32, LiPo, TB6600, soldering..."
                  className="w-full px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')} 
                    className="p-1 mr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button 
                onClick={() => {
                  if (searchQuery.trim()) {
                    onNavigate('catalog');
                    setShowSearchDropdown(false);
                  }
                }}
                className="bg-[#EF4F12] hover:bg-[#d44000] text-white px-5 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Autocomplete Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div 
                className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100"
                onMouseLeave={() => setShowSearchDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Matching Technical Components ({searchResults.length})
                </div>
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      setShowSearchDropdown(false);
                    }}
                    className="px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 object-contain bg-slate-100 p-1 rounded border border-slate-200" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-slate-500">SKU: {p.sku} | In Stock: {p.stock} pcs</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#EF4F12] shrink-0 ml-2">₹{p.price}</span>
                  </div>
                ))}
                <div 
                  onClick={() => {
                    onNavigate('catalog');
                    setShowSearchDropdown(false);
                  }}
                  className="p-2 text-center text-xs font-semibold text-[#0051d5] hover:bg-blue-50 cursor-pointer"
                >
                  View all matching components in catalog →
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Account & Authentication Controls */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center space-x-2 text-slate-700 hover:text-[#EF4F12] p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#EF4F12] to-[#ff7a45] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="text-[10px] text-slate-500 block leading-tight truncate max-w-[120px]">
                      {user.companyName || user.makerLevel || 'Maker Account'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center">
                      {user.fullName.split(' ')[0]} <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center space-x-1.5 bg-[#EF4F12]/10 hover:bg-[#EF4F12] text-[#EF4F12] hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border border-[#EF4F12]/20"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {showAccountMenu && user && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowAccountMenu(false)}
                >
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {user.accountType === 'business' ? (
                        <span className="inline-block text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Verified B2B ({user.gstDetails?.gstin ? 'GSTIN Active' : 'Corporate'})
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {user.makerLevel || 'Maker Pro'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <button 
                      onClick={() => {
                        onNavigate('profile');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Profile & Addresses</span>
                    </button>

                    <button 
                      onClick={() => {
                        onNavigate('orders');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <span className="flex items-center space-x-2.5">
                        <Truck className="w-4 h-4 text-slate-400" />
                        <span>Live Telemetry & Orders</span>
                      </span>
                      <span className="bg-orange-100 text-[#EF4F12] text-[10px] font-bold px-1.5 py-0.5 rounded-full">Active</span>
                    </button>

                    <button 
                      onClick={() => {
                        onNavigate('orders');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4 text-slate-400" />
                      <span>GST E-Invoices Archive</span>
                    </button>

                    <button 
                      onClick={() => {
                        onNavigate('wishlist');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <span className="flex items-center space-x-2.5">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Saved Wishlist Items</span>
                      </span>
                      {wishlistCount > 0 && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{wishlistCount}</span>
                      )}
                    </button>

                    <button 
                      onClick={() => {
                        onNavigate('b2b');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>B2B BOM & Institutional Quotes</span>
                    </button>

                    <button 
                      onClick={() => {
                        onNavigate('fabrication');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>PCB & Hardware Prototyping Lab</span>
                    </button>

                    <button 
                      onClick={() => {
                        onNavigate('datasheets');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Datasheets & 3D STEP Library</span>
                    </button>

                    <button 
                      onClick={() => {
                        onNavigate('warranty');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>Warranty & 10-Day RMA Returns</span>
                    </button>

                    <button 
                      onClick={() => {
                        onOpenAuth('login');
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2.5 text-slate-700 hover:text-[#EF4F12] transition cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <span>Switch Account / Demo Logins</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <button 
                      onClick={() => {
                        onSignOut();
                        setShowAccountMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2.5 text-xs font-semibold transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Compare Tool */}
            <button 
              onClick={() => onNavigate('compare')}
              className="relative p-2 text-slate-600 hover:text-[#EF4F12] rounded-md hover:bg-slate-100 transition hidden sm:flex items-center cursor-pointer"
              title="Compare Components"
            >
              <RefreshCw className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-slate-600 hover:text-[#EF4F12] rounded-md hover:bg-slate-100 transition hidden sm:flex items-center cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EF4F12] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center space-x-2.5 bg-[#EF4F12] hover:bg-[#d44000] text-white px-3 sm:px-4 py-2 rounded-lg transition-all shadow-sm shadow-orange-500/20 cursor-pointer shrink-0"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-orange-200 block uppercase font-bold tracking-wider leading-none">Cart</span>
                <span className="text-xs font-extrabold text-white">₹{cartSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 block md:hidden">
          <div className="relative flex rounded-md border border-slate-300 focus-within:border-[#EF4F12] bg-white overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search motors, ESP32, sensors..."
              className="w-full px-3 py-2 text-sm text-slate-900 outline-none"
            />
            <button 
              onClick={() => onNavigate('catalog')}
              className="bg-[#EF4F12] text-white px-4 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
