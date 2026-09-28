'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, VendorStore } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  vendorStore: VendorStore | null;
  login: (role: 'customer' | 'vendor' | 'admin', email: string, name: string, city?: string) => void;
  logout: () => void;
  setVendorStatus: (status: 'pending' | 'approved' | 'rejected') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  vendorStore: null,
  login: () => {},
  logout: () => {},
  setVendorStatus: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [vendorStore, setVendorStore] = useState<VendorStore | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('spaceborn_user');
    const savedVendor = localStorage.getItem('spaceborn_vendor');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedVendor) setVendorStore(JSON.parse(savedVendor));
  }, []);

  const login = (role: 'customer' | 'vendor' | 'admin', email: string, name: string, city: string = 'Bangalore') => {
    // 🚀 FIREBASE INTEGRATION POINT 🚀
    // Example: signInWithEmailAndPassword(auth, email, password).then(res => ...)
    // For now, we continue using the mocked context until real keys are provided.
    
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      role,
      email,
      fullName: name,
      phone: '',
      accountType: 'individual',
      addresses: [],
      joinedDate: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('spaceborn_user', JSON.stringify(newUser));

    if (role === 'vendor') {
      const newVendor: VendorStore = {
        id: `v-${Date.now()}`,
        userId: newUser.id,
        storeName: `${name}'s Electronics Hub`,
        city: city, 
        status: 'pending', // Requires admin approval
        joinedDate: new Date().toISOString(),
      };
      setVendorStore(newVendor);
      localStorage.setItem('spaceborn_vendor', JSON.stringify(newVendor));
    } else {
      setVendorStore(null);
      localStorage.removeItem('spaceborn_vendor');
    }
  };

  const logout = () => {
    setUser(null);
    setVendorStore(null);
    localStorage.removeItem('spaceborn_user');
    localStorage.removeItem('spaceborn_vendor');
  };

  const setVendorStatus = (status: 'pending' | 'approved' | 'rejected') => {
    if (vendorStore) {
      const updated = { ...vendorStore, status };
      setVendorStore(updated);
      localStorage.setItem('spaceborn_vendor', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, vendorStore, login, logout, setVendorStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
