import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  FileText, 
  CreditCard, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Lock,
  Layers,
  Heart,
  RefreshCw,
  Building2
} from 'lucide-react';
import { SpacebornLogo } from './SpacebornLogo';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  return (
    <footer className="bg-[#192737] text-slate-300 border-t border-slate-800 text-xs">
      
      {/* Value Assurance Strip */}
      <div className="border-b border-slate-800 bg-[#0f1924]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#EF4F12] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pan-India Priority Dispatch</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Same-day shipping via BlueDart Air Express & Delhivery Surface for orders confirmed before 3 PM.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Components</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Direct procurement from authorized OEMs with cleanroom bench testing & QC certification.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">GST Compliant E-Invoicing</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Instant institutional tax invoices with verifiable IRN, QR code, and 18% Input Tax Credit.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Stripe Secure Payments</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                PCI-DSS Level 1 certified 256-bit encrypted checkout supporting Corporate Cards, UPI & RuPay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer inline-block"
          >
            <SpacebornLogo theme="dark" size="md" subtitle={true} />
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            India’s dedicated aerospace, deep tech, and robotics component megastore. Powering aerospace startups, university research labs, defense engineering, and autonomous robotics developers with 15,000+ QC-verified SKUs.
          </p>

          <div className="space-y-1.5 text-xs text-slate-400">
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#EF4F12] shrink-0" />
              <span>Spaceborn R&D Hub: Electronic City, Bengaluru 560100</span>
            </p>
            <p className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#EF4F12] shrink-0" />
              <span>Mega-Fulfillment & QC Lab: Chakan Industrial Area, Pune 410501</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#EF4F12] shrink-0" />
              <span>Direct Hotline: +91 080 4912 8800 / support@spaceborn.in</span>
            </p>
            <p className="flex items-center space-x-2 font-mono text-[11px] text-slate-500">
              <span>GSTIN: 29AABCS9482Q1Z7 (KA) | 27AABCS9482Q1Z5 (MH)</span>
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">Aerospace & Robotics</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { onSelectCategory('Motors & Drivers'); onNavigate('catalog'); }} className="hover:text-white transition cursor-pointer">
                Micro Metal N20 Motors
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectCategory('Motors & Drivers'); onNavigate('catalog'); }} className="hover:text-white transition cursor-pointer">
                Planetary Geared Actuators
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectCategory('Motors & Drivers'); onNavigate('catalog'); }} className="hover:text-white transition cursor-pointer">
                TB6600 & Stepper Drivers
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectCategory('Development Boards'); onNavigate('catalog'); }} className="hover:text-white transition cursor-pointer">
                ESP32 & Flight Microcontrollers
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectCategory('Sensors & Modules'); onNavigate('catalog'); }} className="hover:text-white transition cursor-pointer">
                LiDAR & Time-of-Flight Sensors
              </button>
            </li>
            <li>
              <button onClick={() => { onSelectCategory('DIY Kits'); onNavigate('catalog'); }} className="hover:text-white transition cursor-pointer">
                Autonomous Rover Chassis
              </button>
            </li>
          </ul>
        </div>

        {/* Institutional & Prototyping Pages */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">Engineering Services</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('b2b')} className="hover:text-[#EF4F12] text-white font-semibold transition cursor-pointer flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#EF4F12]" />
                <span>B2B Institutional BOM Upload</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('fabrication')} className="hover:text-white transition cursor-pointer flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Custom PCB & Hardware Lab</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('datasheets')} className="hover:text-white transition cursor-pointer flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Datasheets & 3D STEP Library</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('warranty')} className="hover:text-white transition cursor-pointer flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>10-Day Warranty & RMA Policy</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('compare')} className="hover:text-white transition cursor-pointer flex items-center space-x-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Specification Comparison Tool</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('wishlist')} className="hover:text-white transition cursor-pointer flex items-center space-x-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Saved Prototyping Wishlist</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">Company & Support</h5>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-white transition cursor-pointer">
                About Spaceborn.in
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition cursor-pointer">
                Contact & Technical Desk
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-white transition cursor-pointer">
                Consignment Tracking & Invoices
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('profile')} className="hover:text-white transition cursor-pointer">
                Institutional Account Profile
              </button>
            </li>
          </ul>

          <div className="pt-3">
            <span className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider font-semibold">
              Payment Gateway Secured By
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-300">
              <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[#6772e5] font-black">
                stripe
              </span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-white text-[11px]">
                VISA
              </span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-white text-[11px]">
                Mastercard
              </span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-emerald-400 text-[11px]">
                RuPay
              </span>
              <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-amber-400 text-[11px]">
                UPI
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Copyright Sub-bar */}
      <div className="border-t border-slate-800 bg-[#0c141d] py-4 px-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Spaceborn Technologies Private Limited (spaceborn.in). All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300 cursor-pointer">About Us</button>
            <span>•</span>
            <button onClick={() => onNavigate('warranty')} className="hover:text-slate-300 cursor-pointer">Warranty & RMA</button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 cursor-pointer">Support</button>
          </div>
        </div>
      </div>

    </footer>
  );
};
