import React from 'react';
import { Menu, Zap, Cpu, Compass, Flame, Box, ShieldCheck, Sparkles, ChevronRight, Building2, Layers, FileText } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { AppView } from '../types';

interface CategoryNavProps {
  onNavigate: (view: AppView) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  onNavigate,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="bg-[#192737] text-white border-t border-slate-700 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
        
        {/* All Categories Dropdown Trigger */}
        <div className="flex items-center space-x-1 shrink-0">
          <button 
            onClick={() => {
              onSelectCategory('All Categories');
              onNavigate('catalog');
            }}
            className="flex items-center space-x-2 bg-[#EF4F12] hover:bg-[#d44000] text-white font-bold px-4 py-2.5 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Menu className="w-4 h-4" />
            <span>Shop Categories</span>
          </button>
        </div>

        {/* Categories Horizontal Quick Scroll */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2 px-2 overflow-x-auto whitespace-nowrap">
          {CATEGORIES.slice(1, 8).map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.name);
                  onNavigate('catalog');
                }}
                className={`px-3 py-1 rounded transition-colors font-medium flex items-center space-x-1.5 cursor-pointer ${
                  isActive 
                    ? 'bg-slate-700 text-white font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Engineering Lab Shortcuts */}
        <div className="hidden lg:flex items-center space-x-4 shrink-0 text-slate-300 text-[11px]">
          <button 
            onClick={() => onNavigate('b2b')}
            className="flex items-center space-x-1 hover:text-[#EF4F12] transition-colors cursor-pointer font-semibold text-orange-400"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B BOM Quote</span>
          </button>

          <button 
            onClick={() => onNavigate('fabrication')}
            className="flex items-center space-x-1 hover:text-[#EF4F12] transition-colors cursor-pointer text-slate-300"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>PCB Lab</span>
          </button>

          <button 
            onClick={() => onNavigate('datasheets')}
            className="flex items-center space-x-1 hover:text-[#EF4F12] transition-colors cursor-pointer text-slate-300"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Datasheets</span>
          </button>
        </div>

      </div>
    </nav>
  );
};
