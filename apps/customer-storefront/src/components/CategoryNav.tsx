'use client';
import React from 'react';
import { AppView } from '../types';
import { CATEGORIES, matchCategory, isCategoryActive } from '../data/products';
import { Menu, Zap, Cpu, Compass, Flame, Box, ShieldCheck, Battery, Wrench, Layers, LayoutGrid } from 'lucide-react';

interface CategoryNavProps {
  onNavigate: (view: AppView) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CAT_ICONS: Record<string, React.ReactNode> = {
  'All Categories': <LayoutGrid className="w-3.5 h-3.5" />,
  'Dev Boards & MCUs': <Cpu className="w-3.5 h-3.5" />,
  'Development Boards': <Cpu className="w-3.5 h-3.5" />,
  'Sensors & Modules': <Compass className="w-3.5 h-3.5" />,
  'Motors & Drivers': <Zap className="w-3.5 h-3.5" />,
  'Batteries & Power': <Battery className="w-3.5 h-3.5" />,
  'Batteries & Chargers': <Battery className="w-3.5 h-3.5" />,
  'Robotics & Mechanical': <Box className="w-3.5 h-3.5" />,
  'Mechanical & Frames': <Box className="w-3.5 h-3.5" />,
  'Tools & Soldering': <Wrench className="w-3.5 h-3.5" />,
  'Tools & Accessories': <Wrench className="w-3.5 h-3.5" />,
  '3D Printing & CNC': <Layers className="w-3.5 h-3.5" />,
  'Components & Hardware': <ShieldCheck className="w-3.5 h-3.5" />,
  'Components': <ShieldCheck className="w-3.5 h-3.5" />,
  'DIY Kits': <Flame className="w-3.5 h-3.5" />,
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  onNavigate,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="bg-[#fffbf7] border-b border-[#f9bf8f]/60 sticky top-[60px] z-30 select-none overflow-hidden shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2 text-xs">
        
        {/* Horizontal Category Rail */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = isCategoryActive(cat.name, selectedCategory);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (isActive && cat.id !== 'all') {
                    onSelectCategory('All Categories');
                  } else {
                    onSelectCategory(cat.name);
                  }
                  onNavigate('catalog');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#0c831f] text-white shadow-xs'
                    : 'bg-[#fee9d7]/60 border border-[#f9bf8f]/60 text-[#34222e] hover:bg-[#fee9d7]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#e2434b]'}>
                  {CAT_ICONS[cat.name] || <Box className="w-3.5 h-3.5" />}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
};
