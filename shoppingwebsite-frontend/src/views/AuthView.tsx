'use client';
import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound, Store, Shield } from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { SpacebornLogo } from '../components/SpacebornLogo';
import { useAuth } from '../context/AuthContext';

interface AuthViewProps {
  onLoginSuccess?: (user: UserProfile) => void;
  onNavigate: (view: AppView) => void;
  initialMode?: 'login' | 'signup';
}

export function AuthView({ onLoginSuccess, onNavigate, initialMode = 'login' }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'customer' | 'vendor' | 'admin'>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, user } = useAuth();

  const selectTab = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setErrorMessage(null);
    setPassword('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    
    if (activeTab === 'signup' && password.length < 4) {
      setErrorMessage('Use a password with at least 4 characters.');
      return;
    }

    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      try {
        const userName = activeTab === 'signup' ? fullName : email.split('@')[0];
        login(role, email, userName, city);
        
        if (role === 'admin') {
          onNavigate('admin');
        } else if (role === 'vendor') {
          onNavigate('vendor');
        } else {
          onNavigate('catalog');
        }
      } catch (err) {
        setErrorMessage('Failed to authenticate');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-[75vh] bg-slate-50 px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex justify-center"><SpacebornLogo size="md" /></div>
        <h1 className="text-center text-2xl font-bold text-slate-900">
          {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          {activeTab === 'login' ? 'Sign in to continue to your account.' : 'Join the fastest electronics marketplace.'}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1 mb-4">
          <button type="button" onClick={() => selectTab('login')} className={`rounded-md py-2 text-sm font-semibold transition ${activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            Sign in
          </button>
          <button type="button" onClick={() => selectTab('signup')} className={`rounded-md py-2 text-sm font-semibold transition ${activeTab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
            Sign up
          </button>
        </div>

        {/* Role Selection */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Continue as</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={() => setRole('customer')}
              className={`flex flex-col items-center p-2 rounded-xl border transition ${role === 'customer' ? 'border-[#EF4F12] bg-[#EF4F12]/5 text-[#EF4F12]' : 'border-slate-200 text-slate-500 hover:border-[#EF4F12]/30 hover:bg-slate-50'}`}
            >
              <UserRound className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Customer</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('vendor')}
              className={`flex flex-col items-center p-2 rounded-xl border transition ${role === 'vendor' ? 'border-[#0c831f] bg-[#0c831f]/5 text-[#0c831f]' : 'border-slate-200 text-slate-500 hover:border-[#0c831f]/30 hover:bg-slate-50'}`}
            >
              <Store className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Vendor</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              className={`flex flex-col items-center p-2 rounded-xl border transition ${role === 'admin' ? 'border-[#34222e] bg-[#34222e]/5 text-[#34222e]' : 'border-slate-200 text-slate-500 hover:border-[#34222e]/30 hover:bg-slate-50'}`}
            >
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Admin</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div role="alert" className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {activeTab === 'signup' && (
            <label className="block text-sm font-medium text-slate-700">
              Full Name or Store Name
              <span className="relative mt-1.5 block">
                <UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Spaceborn / Your Name" className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15" />
              </span>
            </label>
          )}

          {activeTab === 'signup' && role === 'vendor' && (
            <label className="block text-sm font-medium text-slate-700">
              City (Location)
              <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 bg-white">
                <option value="Bangalore">Bangalore</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Gurugram">Gurugram</option>
              </select>
            </label>
          )}

          <label className="block text-sm font-medium text-slate-700">
            Email address
            <span className="relative mt-1.5 block">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15" />
            </span>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <span className="relative mt-1.5 block">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'} type={showPassword ? 'text' : 'password'} minLength={4} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={activeTab === 'signup' ? 'At least 4 characters' : 'Your password'} className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15" />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <button type="submit" disabled={loading} className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
            role === 'admin' ? 'bg-[#34222e] hover:bg-[#1f141b]' :
            role === 'vendor' ? 'bg-[#0c831f] hover:bg-[#096618]' :
            'bg-[#EF4F12] hover:bg-[#d4430e]'
          }`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Please wait...' : activeTab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          {activeTab === 'login' ? 'New here? ' : 'Already have an account? '}
          <button type="button" onClick={() => selectTab(activeTab === 'login' ? 'signup' : 'login')} className="font-semibold text-[#EF4F12] hover:underline">
            {activeTab === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  );
}
