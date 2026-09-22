import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  FileCheck2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Cpu, 
  Truck, 
  Eye, 
  EyeOff, 
  KeyRound,
  RefreshCw,
  Award,
  ChevronRight
} from 'lucide-react';
import { UserProfile, GstDetails, Address, AppView } from '../types';
import { SpacebornLogo } from '../components/SpacebornLogo';
import { toUserProfile } from '../lib/api';

interface AuthViewProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (view: AppView) => void;
  initialMode?: 'login' | 'signup';
}

export function AuthView({
  currentUser,
  onLoginSuccess,
  onNavigate,
  initialMode = 'login'
}: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialMode);
  
  // Show/Hide password
  const [showPassword, setShowPassword] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form States
  const [signupType, setSignupType] = useState<'individual' | 'business'>('business');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('+91 ');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [gstin, setGstin] = useState('');
  const [gstinValidated, setGstinValidated] = useState<boolean | null>(null);
  const [gstinInfo, setGstinInfo] = useState<{ stateName?: string; pan?: string; taxType?: string } | null>(null);
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');

  // UI status states
  const [loading, setLoading] = useState(false);
  const [gstinLoading, setGstinLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Regular Email/Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      const user = data.data?.user;
      if (data.data?.accessToken) localStorage.setItem('spaceborn_access_token', data.data.accessToken);
      if (res.ok && user) {
        onLoginSuccess(toUserProfile(user));
        setSuccessMessage(`Welcome back, ${user.fullName}!`);
        setTimeout(() => {
          onNavigate('catalog');
        }, 500);
      } else {
        setErrorMessage(data.message || 'Invalid email or password. Please try again or create an account.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Live GSTIN format and lookup validation
  const handleValidateGstin = async () => {
    if (!gstin || gstin.trim().length !== 15) {
      setErrorMessage('GSTIN must be exactly 15 alphanumeric characters (e.g. 29AABCA9482Q1Z7)');
      return;
    }

    setGstinLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/validate-gstin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: gstin.trim().toUpperCase() })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setGstinValidated(true);
        setGstinInfo({
          stateName: data.stateName,
          pan: data.pan,
          taxType: data.taxType
        });
        setState(data.stateName || state);
        setSuccessMessage(`GSTIN Verified: ${data.stateName} (PAN: ${data.pan})`);
      } else {
        setGstinValidated(false);
        setErrorMessage(data.message || 'Invalid GSTIN number.');
      }
    } catch (err: any) {
      setErrorMessage('GST portal lookup failed');
    } finally {
      setGstinLoading(false);
    }
  };

  // Signup Submit Handler
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !signupEmail || !signupPassword) {
      setErrorMessage('Please fill in your Full Name, Email, and Password.');
      return;
    }

    if (signupType === 'business' && !companyName) {
      setErrorMessage('Please enter your Company, Lab or Institution legal name.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        fullName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
        accountType: signupType,
        companyName: signupType === 'business' ? companyName : undefined,
        designation: designation || undefined,
        gstin: signupType === 'business' ? gstin : undefined,
        stateCode: gstin ? gstin.substring(0, 2) : '27',
        addressLine1: addressLine || undefined,
        city: city || undefined,
        state: state || undefined,
        pincode: pincode || undefined
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const user = data.data?.user;
      if (data.data?.accessToken) localStorage.setItem('spaceborn_access_token', data.data.accessToken);
      if (res.ok && user) {
        onLoginSuccess(toUserProfile(user));
        setSuccessMessage(`Account created successfully! Welcome to Spaceborn.in, ${user.fullName}.`);
        setTimeout(() => {
          onNavigate('catalog');
        }, 600);
      } else {
        setErrorMessage(data.message || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-gradient-to-b from-slate-100/80 via-slate-50 to-white min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Informational Showcase Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#192737] via-[#101b27] to-[#0a121a] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#EF4F12_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header Brand */}
            <div className="mb-6">
              <SpacebornLogo theme="dark" size="md" subtitle={true} />
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug mb-3">
              One account for Aerospace Builders, University Labs & Robotics R&D.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Access wholesale volume tier discounts, official GST e-invoices with Input Tax Credit, and live flight telemetry on every robotics dispatch.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3.5 mb-8">
              <div className="flex items-start space-x-3 text-xs">
                <div className="p-1.5 rounded-lg bg-orange-500/20 text-[#EF4F12] shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">18% Input Tax Credit (ITC)</h4>
                  <p className="text-[11px] text-slate-400">Auto-populated GSTIN invoices with QR code IRN for seamless accounting.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Same-Day Aviation Dispatch</h4>
                  <p className="text-[11px] text-slate-400">Order by 3 PM IST for guaranteed same-day QC bench testing and air cargo pickup.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">100% Bench-Tested Components</h4>
                  <p className="text-[11px] text-slate-400">All micro-motors, stepper drivers, and sensor breakout boards pass oscilloscope QC.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Tab Navigation (Sign In vs Sign Up) */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 pb-3 text-sm font-bold transition border-b-2 text-center cursor-pointer ${
                  activeTab === 'login'
                    ? 'border-[#EF4F12] text-[#EF4F12]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In to Account
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 pb-3 text-sm font-bold transition border-b-2 text-center cursor-pointer ${
                  activeTab === 'signup'
                    ? 'border-[#EF4F12] text-[#EF4F12]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Register Maker / B2B Account
              </button>
            </div>

            {/* Error / Success Feedback Banners */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="flex-1">{successMessage}</span>
              </div>
            )}

            {/* ================= LOGIN TAB ================= */}
            {activeTab === 'login' && (
              <div>

                {/* Password Form */}
                
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. vikram.j@apexrobotics.io or maker@gmail.com"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center text-slate-600 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#EF4F12] focus:ring-orange-500 mr-2" />
                        Remember workstation
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage('Password reset is not available yet. Please contact Spaceborn support.');
                        }}
                        className="text-[#EF4F12] hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-2.5 bg-[#EF4F12] hover:bg-[#d4430e] text-white rounded-lg font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Sign In Securely</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                  <p className="pt-5 text-center text-xs text-slate-600">
                    New to Spaceborn? <button type="button" onClick={() => setActiveTab('signup')} className="font-bold text-[#EF4F12] hover:underline">Create your account</button>
                  </p>
              </div>
            )}
{/* ================= REGISTER TAB ================= */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                
                {/* Account Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSignupType('business')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        signupType === 'business'
                          ? 'border-[#EF4F12] bg-orange-50/40 ring-1 ring-orange-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Building2 className={`w-4 h-4 ${signupType === 'business' ? 'text-[#EF4F12]' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-900">B2B & Labs</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        18% GST Input Credit, bulk purchase quotes & corporate billing.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupType('individual')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        signupType === 'individual'
                          ? 'border-[#EF4F12] bg-orange-50/40 ring-1 ring-orange-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className={`w-4 h-4 ${signupType === 'individual' ? 'text-[#EF4F12]' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-900">Maker / Student</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        DIY Robotics, hobby projects, maker discount coupons.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Joshi"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Password Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 98450 82194"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Create Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full px-3 pr-8 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* B2B Specific Fields */}
                {signupType === 'business' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 flex items-center">
                        <Building2 className="w-3.5 h-3.5 text-[#EF4F12] mr-1" />
                        Enterprise & GST Details
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        18% GST Credit
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Company / Lab Legal Name *
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Apex Robotics Labs LLP"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Designation / Role
                        </label>
                        <input
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. Principal Hardware Lead"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                        />
                      </div>
                    </div>

                    {/* GSTIN Verification Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-700">
                          GSTIN (15 Alphanumeric Characters)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setGstin('29AABCA9482Q1Z7');
                            setGstinValidated(true);
                            setGstinInfo({ stateName: 'Karnataka', pan: 'AABCA9482Q', taxType: 'IGST' });
                            setState('Karnataka');
                          }}
                          className="text-[10px] text-[#0051d5] hover:underline cursor-pointer"
                        >
                          Use Sample: 29AABCA9482Q1Z7
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          maxLength={15}
                          value={gstin}
                          onChange={(e) => {
                            setGstin(e.target.value.toUpperCase());
                            setGstinValidated(null);
                          }}
                          placeholder="e.g. 29AABCA9482Q1Z7"
                          className="w-full px-3 py-1.5 text-xs font-mono tracking-wider uppercase bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleValidateGstin}
                          disabled={gstinLoading || !gstin}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shrink-0 transition cursor-pointer disabled:opacity-50"
                        >
                          {gstinLoading ? 'Checking...' : 'Verify'}
                        </button>
                      </div>

                      {gstinValidated === true && gstinInfo && (
                        <div className="mt-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center justify-between">
                          <span className="flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                            Verified: <strong>{gstinInfo.stateName}</strong> (PAN: {gstinInfo.pan})
                          </span>
                          <span className="font-semibold text-emerald-700">{gstinInfo.taxType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Primary Shipping Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Delivery Address
                    </label>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="Plot/Flat No, Tech Park, Street"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City & Pincode
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                      />
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560100"
                        className="w-full px-2 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-[#EF4F12] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-start space-x-2 pt-1">
                  <input type="checkbox" defaultChecked required className="rounded border-slate-300 text-[#EF4F12] mt-0.5" />
                  <span>
                    I agree to Spaceborn.in Terms of Supply, Anti-Static ESD standards, and GST e-invoicing conditions.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#EF4F12] hover:bg-[#d4430e] text-white rounded-lg font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Complete Registration & Activate Benefits</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Secure Trust Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              256-bit SSL Session Encrypted
            </span>
            <span>Indian Data Residency Compliant</span>
          </div>

        </div>

      </div>
    </div>
  );
}
